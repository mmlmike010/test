"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import { Check, Plus } from "lucide-react";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import ProductDetailModal from "@/components/ProductDetailModal";

function AddButton({
  productId,
  onAdd,
}: {
  productId: string;
  onAdd: () => void;
}) {
  const qty = useCartStore(
    (s) => s.items.find((i) => i.product.id === productId)?.quantity || 0
  );
  const [justAdded, setJustAdded] = useState(false);

  const handle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handle}
      className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
        justAdded
          ? "bg-green-600 text-white"
          : "bg-[#0060A9] text-white hover:bg-blue-800"
      }`}
    >
      {justAdded ? (
        <>
          <Check className="w-4 h-4" />
          Added{qty > 0 ? ` · ${qty}` : ""}
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          {qty > 0 ? `Add · ${qty} in cart` : "Add"}
        </>
      )}
    </button>
  );
}

function ProductCard({
  product,
  membersOnly,
  onOpen,
}: {
  product: Product;
  membersOnly?: boolean;
  onOpen: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0060A9]/40"
    >
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
        />
        {membersOnly && product.savings > 0 && (
          <div className="absolute top-2 left-2 bg-[#CC0000] text-white px-2 py-1 rounded text-[10px] font-bold tracking-wide">
            MEMBERS ONLY
          </div>
        )}
      </div>
      <div className="p-3.5">
        <div className="mb-2">
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
          <div className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-[11px] font-semibold">
            ${product.savings.toFixed(2)} OFF
          </div>
        </div>
        <p className="text-[11px] font-medium text-[#0060A9] mb-0.5">
          {product.brand}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mb-2">
          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="sm"
          />
        </div>
        <p className="text-xs text-gray-500 mb-3 capitalize">
          {product.department} · {product.category}
        </p>
        <AddButton productId={product.id} onAdd={() => addItem(product)} />
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const results = useCatalogStore((s) => s.results);
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);
  const q = useCatalogStore((s) => s.q);
  const department = useCatalogStore((s) => s.department);
  const tag = useCatalogStore((s) => s.tag);
  const search = useCatalogStore((s) => s.search);
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    void search();
  }, [search]);

  const filtered = results;
  const savings = filtered.filter((p) => p.savings > 0);
  const titleBits = [
    department,
    tag ? tag.replace(/^\w/, (c) => c.toUpperCase()) : null,
    q.trim() ? `“${q.trim()}”` : null,
  ].filter(Boolean);

  return (
    <div className="bg-gray-50 p-5 lg:p-6">
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
            {titleBits.length
              ? titleBits.join(" · ")
              : "Member Only Savings"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? "Searching…"
              : `${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
            {department || tag || q
              ? ""
              : " · 8/24/26-9/20/26"}
          </p>
        </div>
        {(department || tag || q) && (
          <button
            type="button"
            className="text-sm text-[#0060A9] font-semibold hover:underline"
            onClick={() => {
              clearFilters();
              void search();
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
          <p className="text-gray-900 font-semibold mb-1">No products found</p>
          <p className="text-sm text-gray-500 mb-4">
            Try another department or a broader search.
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-[#0060A9] text-white text-sm font-semibold"
            onClick={() => {
              clearFilters();
              void search();
            }}
          >
            Show all
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(savings.length ? savings : filtered).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              membersOnly={product.savings > 0}
              onOpen={() => setSelected(product)}
            />
          ))}
        </div>
      )}

      {!department && !tag && !q.trim() && filtered.length > 0 && (
        <>
          <div className="mt-6 bg-gradient-to-r from-[#0060A9] to-blue-700 rounded-xl p-6 text-white">
            <div className="text-xs font-semibold mb-2 tracking-wide opacity-90">
              WAREHOUSE EVENT
            </div>
            <h3 className="text-2xl font-bold mb-2">Buy More Save More</h3>
            <p className="text-blue-100 text-sm">
              Member deals on household staples this week. Ask Kirk to build the
              cart — or browse departments on the left.
            </p>
          </div>
        </>
      )}

      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
