'use client';
import { useState } from 'react';

export default function BidModal({ open, onClose, onBid }: { open: boolean; onClose: () => void; onBid: (amount: number) => void }) {
  const [value, setValue] = useState('');
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 p-4 rounded">
        <input
          className="border p-2 text-black" value={value}
          onChange={(e) => setValue(e.target.value)} placeholder="Amount" />
        <div className="mt-2 flex gap-2">
          <button className="px-4 py-1 bg-blue-500 text-white" onClick={() => { onBid(parseFloat(value)); setValue(''); onClose(); }}>Bid</button>
          <button className="px-4 py-1 bg-gray-500 text-white" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
