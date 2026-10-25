"use client";

import { useEffect, useState } from "react";
import type { CheckResult } from "@/lib/checkProduct";
import { formatMarkup, formatPrice, formatUnitPrice } from "@/lib/format";
import ProductTile from "./ProductTile";

const LOADING_MESSAGES = [
  "Looking up the product…",
  "Checking if it comes in blue…",
  "Measuring the markup…",
  "Asking why it needs to be lavender-scented…",
  "Searching for the men's version…",
  "Still searching. Amazon has a lot of razors…",
];

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; result: CheckResult };

export default function LinkChecker() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setState(res.ok ? { status: "done", result: data } : { status: "error", message: data.error });
    } catch {
      setState({ status: "error", message: "Couldn't reach the server. Is it running?" });
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.amazon.com/dp/..."
          className="flex-1 rounded-full border border-pink-200 px-5 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
        />
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="rounded-full bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
        >
          {state.status === "loading" ? "Checking…" : "Check"}
        </button>
      </form>

      {state.status === "loading" && <Loading />}
      {state.status === "error" && (
        <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-red-700">
          {state.message}
        </p>
      )}
      {state.status === "done" && <Results result={state.result} />}
    </>
  );
}

function Loading() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => Math.min(n + 1, LOADING_MESSAGES.length - 1)), 6000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mt-12 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
      <p className="mt-4 font-medium text-gray-700">{LOADING_MESSAGES[i]}</p>
      <p className="mt-1 text-sm text-gray-500">New products can take a minute or two.</p>
    </div>
  );
}

const VERDICTS: Record<CheckResult["verdict"], { title: string; note: string; style: string }> = {
  "pink-taxed": {
    title: "Pink Taxed",
    note: "The women's version costs more for the same thing.",
    style: "border-pink-400 bg-pink-50",
  },
  even: {
    title: "No Pink Tax",
    note: "Women's and men's versions cost about the same. Rare, but it happens.",
    style: "border-emerald-300 bg-emerald-50",
  },
  reverse: {
    title: "No Pink Tax",
    note: "Plot twist: the women's version is actually cheaper.",
    style: "border-emerald-300 bg-emerald-50",
  },
  "not-gendered": {
    title: "Not Gendered",
    note: "This product isn't marketed to women or men, so there's nothing to compare.",
    style: "border-gray-300 bg-gray-50",
  },
  "no-match": {
    title: "No Equivalent Found",
    note: "We couldn't find a close match marketed to the other gender. Better no answer than a wrong one.",
    style: "border-gray-300 bg-gray-50",
  },
};

function Results({ result }: { result: CheckResult }) {
  const { product, counterpart, comparison, alternatives } = result;
  const v = VERDICTS[result.verdict];
  const isWomens = product.gender === "women";

  return (
    <section className="mt-12 space-y-6">
      <div className={`rounded-2xl border-2 p-6 text-center ${v.style}`}>
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">Verdict</p>
        <p className="mt-2 text-3xl font-extrabold text-gray-900">{v.title}</p>
        <p className="mt-1 text-gray-600">{v.note}</p>
        <p className="mt-2 text-sm text-gray-500">Brand: {product.brand || "Unknown"}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ResultBox title="Your Product">
          <ProductTile product={product} label={isWomens ? "For Her" : "For Him"} tone={isWomens ? "pink" : "blue"} />
        </ResultBox>
        {counterpart && (
          <ResultBox title={isWomens ? "Men's Equivalent" : "Women's Equivalent"}>
            <ProductTile product={counterpart} label={isWomens ? "For Him" : "For Her"} tone={isWomens ? "blue" : "pink"} />
          </ResultBox>
        )}
      </div>

      {comparison && counterpart && (
        <ResultBox title="Price Difference">
          <p className={`text-3xl font-bold ${comparison.markupPct >= 5 ? "text-pink-600" : "text-emerald-600"}`}>
            {formatMarkup(comparison.markupPct)}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {comparison.basis === "unit"
              ? `Compared ${comparison.unitLabel}, since the sizes differ.`
              : "Compared by sticker price. We couldn't read a size from both listings."}{" "}
            {comparison.markupPct >= 5 && "That's the price of being marketed to."}
          </p>
        </ResultBox>
      )}

      {alternatives.length > 0 && (
        <ResultBox title="Cheaper Alternatives">
          <ul className="divide-y divide-pink-100">
            {alternatives.map((a) => (
              <li key={a.asin}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 py-3 text-sm hover:text-pink-700"
                >
                  <span className="line-clamp-1 text-gray-800">
                    {a.title} <span className="text-gray-500">· {a.brand}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-semibold text-gray-900">{formatPrice(a.price, a.currency)}</span>
                    <span className="block text-xs text-gray-500">{formatUnitPrice(a)}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </ResultBox>
      )}
    </section>
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
