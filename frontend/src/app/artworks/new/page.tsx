"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArtwork() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
        price_estimate: price ? parseFloat(price) : undefined,
        image_url: imageUrl,
      }),
    });
    if (res.ok) router.push("/dashboard/artworks");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price Estimate" />
      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" />
      <button type="submit">Submit</button>
    </form>
  );
}
