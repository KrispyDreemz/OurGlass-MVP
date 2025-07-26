"use client";
import { useState } from "react";
import useSWR from "swr";
import ArtworkCard from "@/components/dashboard/ArtworkCard";
import AuctionGrid from "@/components/dashboard/AuctionGrid";
import CountdownTimer from "@/components/dashboard/CountdownTimer";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const { data } = useSWR("/api/dashboardData", fetcher);
  const [tab, setTab] = useState("artworks");

  if (!data) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="p-4 text-white">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        {[
          ["artworks", "My Artworks"],
          ["sponsorship", "Sponsorship Auctions"],
          ["ownership", "Ownership Auctions"],
          ["bids", "My Bids & Purchases"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as string)}
            className={`px-2 py-1 rounded ${
              tab === key ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "artworks" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.artworks.map((a: any) => (
            <ArtworkCard key={a.id} artwork={a} />
          ))}
        </div>
      )}

      {tab === "sponsorship" && (
        <AuctionGrid items={data.sponsorshipAuctions} />
      )}

      {tab === "ownership" && <AuctionGrid items={data.ownershipAuctions} />}

      {tab === "bids" && (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Artwork</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Status</th>
              <th className="text-left">End</th>
            </tr>
          </thead>
          <tbody>
            {data.bids.map((b: any) => (
              <tr key={b.id} className="border-t">
                <td>{b.title}</td>
                <td>${b.amount}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === "active" ? (
                    <CountdownTimer end={b.endsAt} />
                  ) : (
                    b.date
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
