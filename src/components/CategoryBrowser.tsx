"use client";

import { useMemo, useState } from "react";
import type { CatalogPair } from "@/lib/catalog";
import ComparisonCard from "./ComparisonCard";

const SORTS = {
  markup: { label: "Biggest markup", compare: (a: CatalogPair, b: CatalogPair) => b.markupPct - a.markupPct },
  price: { label: "Price: low to high", compare: (a: CatalogPair, b: CatalogPair) => a.womens.price - b.womens.price },
  brand: {
    label: "Brand A–Z",
    compare: (a: CatalogPair, b: CatalogPair) => a.womens.brand.localeCompare(b.womens.brand),
  },
};
type SortKey = keyof typeof SORTS;

const MARKUP_RANGES = {
  none: { label: "Under 5% (no pink tax)", test: (pct: number) => pct < 5 },
  mid: { label: "5–25%", test: (pct: number) => pct >= 5 && pct < 25 },
  high: { label: "25%+ (yikes)", test: (pct: number) => pct >= 25 },
};
type RangeKey = keyof typeof MARKUP_RANGES;

export default function CategoryBrowser({
  pairs,
  productTypes,
}: {
  pairs: CatalogPair[];
  productTypes: string[];
}) {
  const [sort, setSort] = useState<SortKey>("markup");
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [ranges, setRanges] = useState<Set<RangeKey>>(new Set());

  // An empty set means "no filter", i.e. show everything.
  const shown = useMemo(
    () =>
      pairs
        .filter((p) => !types.size || types.has(p.productType))
        .filter((p) => !ranges.size || [...ranges].some((r) => MARKUP_RANGES[r].test(p.markupPct)))
        .sort(SORTS[sort].compare),
    [pairs, types, ranges, sort],
  );

  const countByType = (t: string) => pairs.filter((p) => p.productType === t).length;
  const filtersActive = types.size > 0 || ranges.size > 0;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="w-full shrink-0 self-start rounded-2xl border border-pink-100 bg-pink-50 p-5 lg:w-60">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          {filtersActive && (
            <button
              type="button"
              onClick={() => {
                setTypes(new Set());
                setRanges(new Set());
              }}
              className="text-xs font-medium text-pink-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <Group title="Sort by">
          {(Object.keys(SORTS) as SortKey[]).map((key) => (
            <Option key={key} type="radio" checked={sort === key} onChange={() => setSort(key)}>
              {SORTS[key].label}
            </Option>
          ))}
        </Group>

        <Group title="Product">
          {productTypes.map((t) => {
            const count = countByType(t);
            return (
              <Option
                key={t}
                type="checkbox"
                checked={types.has(t)}
                disabled={count === 0}
                onChange={() => setTypes(toggle(types, t))}
              >
                <span className="capitalize">{t}</span> <span className="text-gray-400">({count})</span>
              </Option>
            );
          })}
        </Group>

        <Group title="Markup">
          {(Object.keys(MARKUP_RANGES) as RangeKey[]).map((key) => (
            <Option
              key={key}
              type="checkbox"
              checked={ranges.has(key)}
              onChange={() => setRanges(toggle(ranges, key))}
            >
              {MARKUP_RANGES[key].label}
            </Option>
          ))}
        </Group>
      </aside>

      <div className="flex-1">
        <p className="mb-4 text-sm text-gray-500">
          Showing {shown.length} of {pairs.length} comparisons
        </p>
        {shown.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((p) => (
              <ComparisonCard key={p.id} pair={p} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-pink-200 p-10 text-center text-gray-600">
            No products match these filters.
          </p>
        )}
      </div>
    </div>
  );
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-5">
      <legend className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</legend>
      <div className="mt-2 space-y-1.5 text-sm text-gray-700">{children}</div>
    </fieldset>
  );
}

function Option({
  type,
  checked,
  disabled,
  onChange,
  children,
}: {
  type: "radio" | "checkbox";
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex items-center gap-2 ${disabled ? "opacity-40" : "cursor-pointer"}`}>
      <input
        type={type}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="accent-pink-600"
      />
      <span>{children}</span>
    </label>
  );
}
