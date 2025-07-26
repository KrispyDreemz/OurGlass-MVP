"use client";
import { useEffect, useState } from "react";

export default function MyBids() {
  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auctions/sponsorship", { credentials: "include" })
      .then(res => res.ok ? res.json() : [])
      .then(setItems);
    fetch("/api/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(setUser);
  }, []);

  if (!items.length) return <div>No auctions</div>;

  return (
    <ul>
      {items.map((a: any) => (
        <li key={a.id} className={user && a.userId === user.id ? "font-bold" : ""}>
          {a.artwork.title} - Current bid: {a.bidAmount ?? 0}
        </li>
      ))}
    </ul>
  );
}
