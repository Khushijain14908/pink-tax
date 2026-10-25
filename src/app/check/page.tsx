// TODO: gate behind Auth0 login once auth is implemented.
// TODO: replace placeholder results with Bright Data scrape + comparison.
export default function CheckPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Is it Pink Taxed?</h1>
        <p className="mt-2 text-gray-600">
          Paste a product link. We&apos;ll find out if you&apos;re paying extra for the color.
        </p>
      </header>

      <form className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          placeholder="https://store.com/product/..."
          className="flex-1 rounded-full border border-pink-200 px-5 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
        />
        <button type="button" className="rounded-full bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700">
          Check
        </button>
      </form>

      {/* Placeholder results */}
      <section className="mt-12 space-y-6">
        <div className="rounded-2xl border-2 border-pink-300 bg-pink-50 p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">Verdict</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">[Pink Taxed / Not Pink Taxed]</p>
          <p className="mt-1 text-gray-600">Company: [Brand X]</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <ResultBox title="Your Product">
            <ProductStub name="Product Name (Women's)" price="$X.XX" />
          </ResultBox>
          <ResultBox title="Men's Equivalent">
            <ProductStub name="Product Name (Men's)" price="$Y.YY" />
          </ResultBox>
        </div>

        <ResultBox title="Price Difference">
          <p className="text-2xl font-bold text-pink-600">+X% (+$Z.ZZ)</p>
          <p className="mt-1 text-sm text-gray-600">
            That&apos;s the price of being marketed to.
          </p>
        </ResultBox>

        <ResultBox title="Cheaper Alternatives">
          <ul className="divide-y divide-pink-100">
            {["Alternative A", "Alternative B", "Alternative C"].map((a) => (
              <li key={a} className="flex items-center justify-between py-3 text-sm">
                <span className="text-gray-800">{a} · Brand Y</span>
                <span className="font-semibold text-gray-900">$X.XX</span>
              </li>
            ))}
          </ul>
        </ResultBox>
      </section>
    </div>
  );
}

function ResultBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
      {children}
    </div>
  );
}

function ProductStub({ name, price }: { name: string; price: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-xs text-pink-700">
        Image
      </div>
      <div>
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-lg font-bold text-gray-900">{price}</p>
      </div>
    </div>
  );
}
