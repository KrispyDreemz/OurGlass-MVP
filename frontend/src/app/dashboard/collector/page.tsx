"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CollectorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [mine, setMine] = useState<any[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "collector") {
        router.push("/");
        return;
      }
      setUser(payload);
    } catch {
      router.push("/");
    }
    async function loadAuctions() {
      const all = await fetch("/api/auctions/ownership").then((r) => r.json());
      setAuctions(all.filter((a: any) => a.status === "active"));
      const mineRes = await fetch("/api/auctions/ownership/mine", { credentials: "include" });
      if (mineRes.ok) setMine(await mineRes.json());
    }

    loadAuctions();
  }, [router]);

  async function bid(id: string) {
    const amt = parseFloat(amounts[id] || "0");
    await fetch(`/api/auctions/ownership/${id}/bid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount: amt }),
    });
    setAmounts({ ...amounts, [id]: "" });
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1>Welcome, {user.email}</h1>
      <h2>Active Ownership Auctions</h2>
      <ul>
        {auctions.map((a) => (
          <li key={a.id} className="flex gap-2 items-center">
            <span className="flex-1">{a.artwork.title} - Current {a.currentBid ?? 0}</span>
            <input
              value={amounts[a.id] || ""}
              onChange={(e) => setAmounts({ ...amounts, [a.id]: e.target.value })}
              className="border px-1"
              placeholder="Bid"
            />
            <button onClick={() => bid(a.id)}>Bid</button>
          </li>
        ))}
      </ul>
      <h2>My Purchases</h2>
      <ul>
        {mine.map((m) => (
          <li key={m.id}>{m.artwork.title} - Won at {m.currentBid}</li>
        ))}
      </ul>
    </div>
  );
}
