"use client";
import { useEffect, useState } from "react";

export default function AdminArtworks() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const res = await fetch("/api/artworks/pending", { credentials: "include" });
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function update(id: number, status: string) {
    await fetch(`/api/artworks/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <ul>
      {items.map((a) => (
        <li key={a.id} className="flex gap-2 items-center">
          <span className="flex-1">{a.title}</span>
          <button onClick={() => update(a.id, "approved")}>Approve</button>
          <button onClick={() => update(a.id, "rejected")}>Reject</button>
        </li>
      ))}
    </ul>
  );
}
