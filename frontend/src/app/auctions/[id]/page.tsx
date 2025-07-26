"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AuctionDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [amount, setAmount] = useState("");

  async function load() {
    const res = await fetch(`/api/auctions/sponsorship/${id}`);
    if (res.ok) setData(await res.json());
  }

  async function bid(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/auctions/sponsorship/${id}/bid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount: parseFloat(amount) })
    });
    setAmount("");
    load();
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [id]);

  if (!data) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1>{data.artwork.title}</h1>
      {data.artwork.imageUrl && (
        <img src={data.artwork.imageUrl} alt="art" className="w-64" />
      )}
      <p>Current bid: {data.bidAmount ?? 0}</p>
      <p>Ends at: {new Date(data.endsAt).toLocaleString()}</p>
      <form onSubmit={bid} className="flex gap-2">
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" />
        <button type="submit">Bid</button>
      </form>
    </div>
  );
}
