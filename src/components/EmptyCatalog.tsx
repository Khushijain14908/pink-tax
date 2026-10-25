export default function EmptyCatalog() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 p-10 text-center text-gray-600">
      <p className="font-semibold text-gray-900">No products yet</p>
      <p className="mt-1 text-sm">
        Run <code className="rounded bg-white px-1.5 py-0.5">npm run scrape</code> then{" "}
        <code className="rounded bg-white px-1.5 py-0.5">npm run catalog</code> to load real Amazon prices.
      </p>
    </div>
  );
}
