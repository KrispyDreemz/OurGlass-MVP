import type { NextApiRequest, NextApiResponse } from 'next';

const data = {
  artworks: [
    { id: 'a1', title: 'Sunset Vista', status: 'pending' },
    { id: 'a2', title: 'Urban Jungle', status: 'approved' },
    { id: 'a3', title: 'Abstract Dreams', status: 'auctioned', finalPrice: 500 },
  ],
  sponsorshipAuctions: [
    { id: 's1', title: 'Ocean Breeze', image: '/placeholder.png', currentBid: 100, endsAt: Date.now() + 86400000 },
    { id: 's2', title: 'Mountain Peak', image: '/placeholder.png', currentBid: 150, endsAt: Date.now() + 7200000 },
    { id: 's3', title: 'City Lights', image: '/placeholder.png', currentBid: 200, endsAt: Date.now() + 3600000 },
  ],
  ownershipAuctions: [
    { id: 'o1', title: 'Vintage Charm', image: '/placeholder.png', currentBid: 250, endsAt: Date.now() + 86400000 * 2 },
    { id: 'o2', title: 'Modern Lines', image: '/placeholder.png', currentBid: 400, endsAt: Date.now() + 7200000 },
    { id: 'o3', title: 'Golden Hour', image: '/placeholder.png', currentBid: 350, endsAt: Date.now() + 3600000 * 5 },
  ],
  bids: [
    { id: 'b1', title: 'Ocean Breeze', amount: 120, status: 'active', endsAt: Date.now() + 7200000 },
    { id: 'b2', title: 'Mountain Peak', amount: 180, status: 'won', date: '2024-01-05' },
    { id: 'b3', title: 'Vintage Charm', amount: 300, status: 'active', endsAt: Date.now() + 86400000 },
    { id: 'b4', title: 'Golden Hour', amount: 420, status: 'won', date: '2024-02-10' },
  ],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(data);
}
