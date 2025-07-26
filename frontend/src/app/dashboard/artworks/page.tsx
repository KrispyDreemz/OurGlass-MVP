"use client";
import { useEffect, useState } from "react";

export default function MyArtworks() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/artworks/mine", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setItems);
  }, []);

  return (
    <ul>
      {items.map((a) => (
        <li key={a.id}>
          {a.title} - {a.status}
        </li>
      ))}
    </ul>
  );
}
