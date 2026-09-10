"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import StoreSheet from "@/components/StoreSheet";
import GoldStarMark from "@/components/GoldStarMark";
import GoldStarMembershipCard from "@/components/GoldStarMembershipCard";
import InstacartMark from "@/components/InstacartMark";
import { departments } from "@/lib/data/products";
import { aisleLabel } from "@/lib/ui/aisleLabels";
import { productSize } from "@/lib/ui/packSize";
import { useCatalogStore } from "@/lib/store/catalog";
import { useCartStore } from "@/lib/store/cart";
import {
  DELIVERY_WINDOWS,
  KIRK_EMAIL,
  KIRK_MEMBERSHIP,
  KIRK_NAME,
  deliveryWindow,
  formatAddress,
  useSessionStore,
} from "@/lib/store/session";

function PricingSheet() {
  const setSheet = useSessionStore((s) => s.setSheet);
  return (
    <StoreSheet title="Pricing & fees" onClose={() => setSheet(null)} wide>
      <div className="px-4 py-4 text-[13px] text-[#333] leading-relaxed space-y-4">
        <p className="text-[12px] font-bold tracking-[0.08em] uppercase text-costco-blue">
          About our pricing, savings, and returns
        </p>
        <section>
          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-1">Pricing</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Item prices are marked up higher than your local Costco warehouse.
            </li>
            <li>
              Instacart uses the markup to pay for delivery. A $35 minimum
              order applies.
            </li>
          </ul>
        </section>
        <section>
          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-1">
            3 additional ways to save
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Executive members earn an annual 2% Reward (up to $1,000) on the
              original warehouse price for qualified Same-Day purchases.
            </li>
            <li>
              Costco Anywhere Visa® by Citi cardholders earn 2% rewards on
              Same-Day purchases.
            </li>
            <li>
              Instacart+ members receive up to 3.5% savings on every Same-Day
              order.
            </li>
          </ul>
        </section>
        <section>
          <h3 className="font-bold text-[#1a1a1a] text-[15px] mb-1">Returns</h3>
          <p>
            Costco has a 100% Satisfaction Guarantee. Return merchandise to any
            Costco warehouse. Some items must be returned within 90 days.
          </p>
        </section>
        <p className="text-[11px] text-[#777] leading-snug">
          A Costco membership is required for Same-Day member pricing. Prices,
          fees, and availability shown for 11217 Brooklyn.
        </p>
      </div>
    </StoreSheet>
  );
}

function MembershipSheet() {
  const setSheet = useSessionStore((s) => s.setSheet);
  const addMembership = useSessionStore((s) => s.addMembership);
  const removeMembership = useSessionStore((s) => s.removeMembership);
  const membershipAdded = useSessionStore((s) => s.membershipAdded);
  const membershipNumber = useSessionStore((s) => s.membershipNumber);
  const [number, setNumber] = useState(membershipNumber || KIRK_MEMBERSHIP);

  return (
    <StoreSheet title="Add membership" onClose={() => setSheet(null)}>
      <div className="px-4 py-4 space-y-3">
        <GoldStarMembershipCard />
        <p className="text-[13px] text-[#555] leading-snug">
          Add your Costco membership to unlock member pricing on Same-Day.
          Kirk&apos;s Gold Star is ready for this demo.
        </p>
        {membershipAdded ? (
          <div className="rounded-[12px] border border-[#b7d7b0] bg-[#eef7ee] px-3.5 py-3">
            <p className="text-[13px] font-bold text-[#1e5b24] inline-flex items-center gap-1.5">
              <GoldStarMark size={16} />
              Gold Star added · {membershipNumber}
            </p>
            <button
              type="button"
              className="mt-2 text-[13px] font-bold text-costco-blue hover:underline"
              onClick={removeMembership}
            >
              Remove membership
            </button>
          </div>
        ) : (
          <>
            <label className="block">
              <span className="block text-[12px] font-bold text-[#555] mb-1">
                Membership number
              </span>
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                inputMode="numeric"
                className="w-full h-11 px-3.5 bg-[#f6f6f6] border border-[#d8d8d8] rounded-[8px] text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
              />
            </label>
            <button
              type="button"
              className="w-full py-3 bg-[#0AAD0A] text-white rounded-full font-bold hover:bg-[#099809] text-[15px]"
              onClick={() => addMembership(number)}
            >
              Add membership
            </button>
            <button
              type="button"
              className="w-full text-[13px] font-bold text-costco-blue hover:underline"
              onClick={() => {
                setNumber(KIRK_MEMBERSHIP);
                addMembership(KIRK_MEMBERSHIP);
              }}
            >
              Use Kirk&apos;s Gold Star · {KIRK_MEMBERSHIP}
            </button>
          </>
        )}
      </div>
    </StoreSheet>
  );
}

function SignInSheet() {
  const setSheet = useSessionStore((s) => s.setSheet);
  const signIn = useSessionStore((s) => s.signIn);
  const signOut = useSessionStore((s) => s.signOut);
  const signedIn = useSessionStore((s) => s.signedIn);
  const displayName = useSessionStore((s) => s.displayName);
  const email = useSessionStore((s) => s.email);
  const [name, setName] = useState(displayName || KIRK_NAME);
  const [mail, setMail] = useState(email || KIRK_EMAIL);

  return (
    <StoreSheet title="Sign in / Register" onClose={() => setSheet(null)}>
      <div className="px-4 py-4 space-y-3">
        <p className="text-[13px] text-[#555] leading-snug">
          Sign in to save lists, attach a Gold Star, and check out. Demo only —
          nothing leaves this browser.
        </p>
        {signedIn ? (
          <div className="rounded-[12px] border border-[#c5d8ea] bg-[#e8f2fa] px-3.5 py-3">
            <p className="text-[15px] font-bold text-[#1a1a1a]">{displayName}</p>
            <p className="text-[13px] text-[#555]">{email}</p>
            <button
              type="button"
              className="mt-2 text-[13px] font-bold text-costco-blue hover:underline"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            <label className="block">
              <span className="block text-[12px] font-bold text-[#555] mb-1">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#f6f6f6] border border-[#d8d8d8] rounded-[8px] text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
              />
            </label>
            <label className="block">
              <span className="block text-[12px] font-bold text-[#555] mb-1">
                Email
              </span>
              <input
                type="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#f6f6f6] border border-[#d8d8d8] rounded-[8px] text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
              />
            </label>
            <button
              type="button"
              className="w-full py-3 bg-[#0AAD0A] text-white rounded-full font-bold hover:bg-[#099809] text-[15px]"
              onClick={() => signIn(name, mail)}
            >
              Continue
            </button>
            <button
              type="button"
              className="w-full text-[13px] font-bold text-costco-blue hover:underline"
              onClick={() => signIn(KIRK_NAME, KIRK_EMAIL)}
            >
              Continue as Kirk
            </button>
          </>
        )}
      </div>
    </StoreSheet>
  );
}

function DeliverySheet() {
  const setSheet = useSessionStore((s) => s.setSheet);
  const setDelivery = useSessionStore((s) => s.setDelivery);
  const windowId = useSessionStore((s) => s.windowId);
  const address = useSessionStore((s) => s.address);
  const [picked, setPicked] = useState(windowId);
  const [line1, setLine1] = useState(address.line1);
  const [city, setCity] = useState(address.city);
  const [zip, setZip] = useState(address.zip);

  return (
    <StoreSheet title="Delivery details" onClose={() => setSheet(null)}>
      <div className="px-4 py-4 space-y-4">
        <div>
          <p className="text-[12px] font-bold text-[#555] mb-2">Time window</p>
          <div className="space-y-2">
            {DELIVERY_WINDOWS.map((window) => {
              const on = picked === window.id;
              return (
                <button
                  key={window.id}
                  type="button"
                  onClick={() => setPicked(window.id)}
                  className={`w-full flex items-center justify-between rounded-[12px] border px-3.5 py-3 text-left ${
                    on
                      ? "border-costco-blue bg-[#e8f2fa]"
                      : "border-[#e0e0e0] bg-white hover:bg-[#f6f6f6]"
                  }`}
                >
                  <span>
                    <span className="block text-[14px] font-bold text-[#1a1a1a]">
                      {window.label}
                    </span>
                    <span className="block text-[12px] text-[#666] mt-0.5">
                      {window.when}
                    </span>
                  </span>
                  {on && <Check className="w-4 h-4 text-costco-blue" />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[12px] font-bold text-[#555]">Address</p>
          <input
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder="Street address"
            className="w-full h-11 px-3.5 bg-[#f6f6f6] border border-[#d8d8d8] rounded-[8px] text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="h-11 px-3.5 bg-[#f6f6f6] border border-[#d8d8d8] rounded-[8px] text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
            />
            <input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP"
              inputMode="numeric"
              className="h-11 px-3.5 bg-[#f6f6f6] border border-[#d8d8d8] rounded-[8px] text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
            />
          </div>
        </div>
        <button
          type="button"
          className="w-full py-3 bg-[#0AAD0A] text-white rounded-full font-bold hover:bg-[#099809] text-[15px]"
          onClick={() => setDelivery(picked, { line1, city, zip })}
        >
          Save delivery details
        </button>
      </div>
    </StoreSheet>
  );
}

function DepartmentsSheet() {
  const setSheet = useSessionStore((s) => s.setSheet);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const search = useCatalogStore((s) => s.search);
  const selected = useCatalogStore((s) => s.department);

  return (
    <StoreSheet title="Departments" onClose={() => setSheet(null)}>
      <div className="px-2 py-2">
        {departments.map((department) => (
          <button
            key={department}
            type="button"
            onClick={() => {
              setQuery("");
              setDepartment(department);
              void search();
              setSheet(null);
              document.querySelector("main")?.scrollTo({ top: 0 });
            }}
            className={`w-full text-left px-3 py-2.5 rounded-[8px] text-[14px] ${
              selected === department
                ? "bg-[#e8f2fa] text-costco-blue font-bold"
                : "text-[#333] hover:bg-[#f6f6f6]"
            }`}
          >
            {aisleLabel(department)}
          </button>
        ))}
      </div>
    </StoreSheet>
  );
}

function RequestSheet() {
  const setSheet = useSessionStore((s) => s.setSheet);
  const setSpecialRequest = useSessionStore((s) => s.setSpecialRequest);
  const specialRequest = useSessionStore((s) => s.specialRequest);
  const [note, setNote] = useState(specialRequest);

  return (
    <StoreSheet title="Add a special request" onClose={() => setSheet(null)}>
      <div className="px-4 py-4 space-y-3">
        <p className="text-[13px] text-[#555] leading-snug">
          Shoppers will try to honor notes like substitutions or leave-at-door
          instructions.
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="E.g. Leave at the door. No substitutions on eggs."
          className="w-full px-3.5 py-2.5 bg-[#f6f6f6] border border-[#d8d8d8] rounded-[8px] text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15 resize-none"
        />
        <button
          type="button"
          className="w-full py-3 bg-[#0AAD0A] text-white rounded-full font-bold hover:bg-[#099809] text-[15px]"
          onClick={() => setSpecialRequest(note)}
        >
          Save request
        </button>
      </div>
    </StoreSheet>
  );
}

function CheckoutSheet() {
  const setSheet = useSessionStore((s) => s.setSheet);
  const signedIn = useSessionStore((s) => s.signedIn);
  const displayName = useSessionStore((s) => s.displayName);
  const membershipAdded = useSessionStore((s) => s.membershipAdded);
  const membershipNumber = useSessionStore((s) => s.membershipNumber);
  const windowId = useSessionStore((s) => s.windowId);
  const address = useSessionStore((s) => s.address);
  const specialRequest = useSessionStore((s) => s.specialRequest);
  const orderPlaced = useSessionStore((s) => s.orderPlaced);
  const placeOrder = useSessionStore((s) => s.placeOrder);
  const clearOrder = useSessionStore((s) => s.clearOrder);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const slot = deliveryWindow(windowId);
  const ready = signedIn && membershipAdded && items.length > 0;

  return (
    <StoreSheet title="Checkout" onClose={() => setSheet(null)} wide>
      <div className="px-4 py-4 space-y-3">
        {orderPlaced ? (
          <div className="rounded-[12px] border border-[#b7d7b0] bg-[#eef7ee] px-3.5 py-4">
            <p className="text-[16px] font-bold text-[#1e5b24]">
              Order placed
            </p>
            <p className="text-[13px] text-[#1e5b24] mt-1 leading-snug">
              Delivery {slot.label} · {formatAddress(address)} · Gold Star{" "}
              {membershipNumber}
            </p>
            <button
              type="button"
              className="mt-3 text-[13px] font-bold text-costco-blue hover:underline"
              onClick={() => {
                clearOrder();
                setSheet(null);
              }}
            >
              Keep shopping
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSheet("delivery")}
              className="w-full text-left rounded-[12px] border border-[#e0e0e0] px-3.5 py-3 hover:bg-[#f6f6f6]"
            >
              <p className="text-[12px] font-bold text-[#666]">Delivery</p>
              <p className="text-[14px] font-bold text-[#1a1a1a] mt-0.5">
                {slot.when} · {slot.label}
              </p>
              <p className="text-[13px] text-[#555]">
                {address.line1}, {formatAddress(address)}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setSheet("membership")}
              className="w-full text-left rounded-[12px] border border-[#e0e0e0] px-3.5 py-3 hover:bg-[#f6f6f6]"
            >
              <p className="text-[12px] font-bold text-[#666]">Membership</p>
              <p className="text-[14px] font-bold text-[#1a1a1a] mt-0.5 inline-flex items-center gap-1.5">
                <GoldStarMark size={16} />
                {membershipAdded
                  ? `Gold Star · ${membershipNumber}`
                  : "Add your Costco membership"}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setSheet("signin")}
              className="w-full text-left rounded-[12px] border border-[#e0e0e0] px-3.5 py-3 hover:bg-[#f6f6f6]"
            >
              <p className="text-[12px] font-bold text-[#666]">Account</p>
              <p className="text-[14px] font-bold text-[#1a1a1a] mt-0.5">
                {signedIn ? `Signed in as ${displayName}` : "Sign in to check out"}
              </p>
            </button>
            {specialRequest && (
              <p className="text-[12px] text-[#555] leading-snug">
                Special request: {specialRequest}
              </p>
            )}
            {items.length > 0 && (
              <div className="rounded-[12px] border border-[#e0e0e0] overflow-hidden">
                <p className="px-3.5 py-2 text-[12px] font-bold text-[#666] bg-[#f6f6f6] border-b border-[#ececec]">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </p>
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-3 px-3.5 py-2.5 border-b border-[#f0f0f0] last:border-b-0"
                  >
                    <div className="relative w-14 h-14 overflow-hidden bg-white border border-[#eee] rounded-[10px] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#242424] leading-snug line-clamp-2">
                        {product.brand} {product.name}
                      </p>
                      <p className="text-[12px] text-[#72767E] mt-0.5">
                        {quantity} × ${product.price.toFixed(2)}
                        {productSize(product.id) ? ` · ${productSize(product.id)}` : ""}
                      </p>
                    </div>
                    <p className="text-[14px] font-bold text-[#1a1a1a] tabular-nums shrink-0">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end justify-between pt-1">
              <span className="text-[#555] text-[13px] font-semibold">
                Estimated total
              </span>
              <span className="font-bold text-[#1a1a1a] text-[24px] tabular-nums leading-none">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              disabled={!ready}
              onClick={placeOrder}
              className="w-full py-3 bg-[#0AAD0A] text-white rounded-full font-bold hover:bg-[#099809] text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {items.length === 0
                ? "Add items to check out"
                : !signedIn
                  ? "Sign in to check out"
                  : !membershipAdded
                    ? "Add membership to check out"
                    : "Place order"}
            </button>
            <p className="text-[11px] text-[#888] text-center leading-snug inline-flex items-center justify-center gap-1.5 w-full">
              <InstacartMark size={12} />
              Service, delivery, and tax calculated at checkout
            </p>
          </>
        )}
      </div>
    </StoreSheet>
  );
}

export default function StoreSheets() {
  const sheet = useSessionStore((s) => s.sheet);
  if (sheet === "pricing") return <PricingSheet />;
  if (sheet === "membership") return <MembershipSheet />;
  if (sheet === "signin") return <SignInSheet />;
  if (sheet === "delivery") return <DeliverySheet />;
  if (sheet === "departments") return <DepartmentsSheet />;
  if (sheet === "request") return <RequestSheet />;
  if (sheet === "checkout") return <CheckoutSheet />;
  return null;
}
