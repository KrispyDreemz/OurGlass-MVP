export interface Artwork {
  id: string;
  title: string;
  status: string;
  finalPrice?: number;
}

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <div className="border p-4 rounded bg-gray-800 text-white">
      <h3 className="font-semibold">{artwork.title}</h3>
      <p>Status: {artwork.status}</p>
      {artwork.finalPrice && (
        <p>Sold for ${artwork.finalPrice}</p>
      )}
    </div>
  );
}
