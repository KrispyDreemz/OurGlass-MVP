'use client';
import { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import BidModal from './BidModal';

export interface AuctionItem {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  endsAt: number;
}

export default function AuctionGrid({ items }: { items: AuctionItem[] }) {
  const [selected, setSelected] = useState<AuctionItem | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded p-4 bg-gray-800 text-white">
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover mb-2" />
            <h3 className="font-semibold">{item.title}</h3>
            <p>Bid: ${item.currentBid}</p>
            <CountdownTimer end={item.endsAt} />
            <button className="mt-2 px-2 py-1 bg-blue-600" onClick={() => setSelected(item)}>Bid Now</button>
          </div>
        ))}
      </div>
      <BidModal open={!!selected} onClose={() => setSelected(null)} onBid={() => {}} />
    </div>
  );
}
