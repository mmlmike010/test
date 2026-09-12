"use client";

import { X } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { useStorefrontOverlayClass, useSessionStore } from "@/lib/store/session";
import { instantSavingsText } from "@/lib/ui/instantSavings";
import { productSize, unitPriceLabel, warehouseItemNumber } from "@/lib/ui/packSize";
import { aisleLabel } from "@/lib/ui/aisleLabels";
import { isLimitedOffer } from "@/lib/ui/warehouseSearch";
import AddControl from "@/components/AddControl";
import StarRating from "@/components/StarRating";
import WarehouseFooter from "@/components/WarehouseFooter";

/** costco.com Compare Products table. UI only — never sent to Kirk. */
export default function WarehouseCompareSheet({
  items,
  onClose,
  onRemove,
}: {
  items: Product[];
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const kirkOpen = useSessionStore((s) => s.kirkOpen);
  const overlayClass = useStorefrontOverlayClass(kirkOpen);
  const inspect = useCatalogStore((s) => s.inspect);

  return (
    <div
      className={`fixed z-[78] flex min-h-0 flex-col bg-white ${overlayClass}`}
    >
        <div className="min-h-0 flex-1 overflow-auto px-4 py-4 lg:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex items-start justify-between gap-2">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-[#555]"
            >
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-costco-blue hover:underline"
              >
                Home
              </button>
              <span aria-hidden="true">›</span>
              <span className="text-[#1a1a1a]">Compare Products</span>
            </nav>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[3px] p-1 text-[#555] hover:bg-[#f7fbfe]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-0.5 text-[22px] font-bold leading-snug text-[#1a1a1a]">
            Compare Products
          </h2>
          <div className="mt-4 min-w-0 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse bg-white text-left text-[13px]">
            <thead>
              <tr className="border border-[#c4c4c4] bg-[#f6f7f8]">
                <th className="w-[88px] border border-[#c4c4c4] px-2 py-2 font-bold text-[#555]">
                  Item
                </th>
                {items.map((product) => (
                  <th
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-3 align-top font-normal"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        inspect(product, "warehouse");
                      }}
                      className="relative mx-auto mb-2 block h-[96px] w-[96px] overflow-hidden rounded-[3px] border border-[#eee] bg-white"
                      aria-label={`View ${product.brand} ${product.name}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-contain p-1"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        inspect(product, "warehouse");
                      }}
                      className="text-left text-[13px] font-bold leading-snug text-costco-blue hover:underline"
                    >
                      {product.brand} {product.name}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Brand
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#1a1a1a]"
                  >
                    {product.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Item #
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#72767E]"
                  >
                    {warehouseItemNumber(product.id)}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Size
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#72767E]"
                  >
                    {productSize(product.id) || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Department
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#72767E]"
                  >
                    {aisleLabel(product.department)}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Features
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#72767E]"
                  >
                    <ul className="list-disc space-y-0.5 pl-4">
                      {product.category ? <li>{product.category}</li> : null}
                      {productSize(product.id) ? (
                        <li>{productSize(product.id)}</li>
                      ) : null}
                      <li>Membership required</li>
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Limited-Time Offer
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#1a1a1a]"
                  >
                    {isLimitedOffer(product) ? (
                      <span className="font-bold text-costco-red">Yes</span>
                    ) : (
                      "—"
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Rating
                </th>
                {items.map((product) => (
                  <td key={product.id} className="border border-[#c4c4c4] px-3 py-2">
                    <StarRating
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      size="sm"
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Your Price
                </th>
                {items.map((product) => (
                  <td key={product.id} className="border border-[#c4c4c4] px-3 py-2">
                    <p className="text-[18px] font-bold tabular-nums text-[#1a1a1a]">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.originalPrice > product.price ? (
                      <p className="text-[12px] text-[#888] line-through">
                        ${product.originalPrice.toFixed(2)}
                      </p>
                    ) : null}
                    {instantSavingsText(product.savings) ? (
                      <p className="text-[11px] font-semibold leading-snug text-[#188038]">
                        {instantSavingsText(product.savings)}
                      </p>
                    ) : null}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Category
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#72767E]"
                  >
                    {product.category || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Unit Price
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#72767E]"
                  >
                    {unitPriceLabel(product.id, product.price) || "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Availability
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 font-semibold text-[#188038]"
                  >
                    {product.inStock ? "In Stock" : "Out of stock"}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Sold By
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#72767E]"
                  >
                    Costco
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Membership
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 text-[#72767E]"
                  >
                    Required
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Delivery
                </th>
                {items.map((product) => (
                  <td
                    key={product.id}
                    className="border border-[#c4c4c4] px-3 py-2 font-semibold text-[#188038]"
                  >
                    Same-Day Delivery
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-[#c4c4c4] bg-[#f6f7f8] px-2 py-2 font-bold text-[#555]">
                  Cart
                </th>
                {items.map((product) => (
                  <td key={product.id} className="border border-[#c4c4c4] px-3 py-2">
                    <AddControl
                      product={product}
                      variant="inline"
                      tone="warehouse"
                      wide
                    />
                    <button
                      type="button"
                      onClick={() => onRemove(product.id)}
                      className="mt-2 block text-[12px] font-bold text-costco-blue hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          </div>
        </div>
        <WarehouseFooter className="-mx-4 mt-8 -mb-4 lg:-mx-6" />
      </div>
    </div>
  );
}
