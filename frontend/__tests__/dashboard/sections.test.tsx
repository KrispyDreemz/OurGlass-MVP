import { render } from '@testing-library/react';
import ArtworkCard from '@/components/dashboard/ArtworkCard';
import AuctionGrid from '@/components/dashboard/AuctionGrid';
import CountdownTimer from '@/components/dashboard/CountdownTimer';

const artwork = { id: 'a', title: 'Test', status: 'pending' };
const auctionItem = { id: 'x', title: 'Auction', image: '/img', currentBid: 10, endsAt: Date.now() + 1000 };
const bid = { id: 'b', title: 'Bid', amount: 10, status: 'active', endsAt: Date.now() + 1000 };

test('ArtworkCard snapshot', () => {
  const { container } = render(<ArtworkCard artwork={artwork} />);
  expect(container).toMatchSnapshot();
});

test('AuctionGrid snapshot', () => {
  const { container } = render(<AuctionGrid items={[auctionItem]} />);
  expect(container).toMatchSnapshot();
});

test('CountdownTimer snapshot', () => {
  const { container } = render(<CountdownTimer end={bid.endsAt} />);
  expect(container).toMatchSnapshot();
});
