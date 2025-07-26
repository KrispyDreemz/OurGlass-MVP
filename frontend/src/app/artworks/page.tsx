"use client";
import { useEffect, useState } from "react";

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/artworks")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  return (
    <ul>
      {items.map((a) => (
        <li key={a.id}>
          {a.title} - ${'{'}a.priceEstimate ?? 'N/A'{'}'}
        </li>
      ))}
    </ul>
  );
}
