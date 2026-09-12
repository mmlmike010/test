"use client";

import { useState, type ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";
import StoreSheet from "@/components/StoreSheet";
import GoldStarMark from "@/components/GoldStarMark";
import GoldStarMembershipCard from "@/components/GoldStarMembershipCard";
import KirkIdPhoto from "@/components/KirkIdPhoto";
import MembershipBarcode from "@/components/MembershipBarcode";
import MembershipQr from "@/components/MembershipQr";
import InstacartMark from "@/components/InstacartMark";
import { departments } from "@/lib/data/products";
import { aisleLabel } from "@/lib/ui/aisleLabels";
import { instantSavingsAmount, instantSavingsText } from "@/lib/ui/instantSavings";
import { productSize, unitPriceLabel, warehouseItemNumber } from "@/lib/ui/packSize";
import { EMPTY_WAREHOUSE_FACETS } from "@/lib/ui/warehouseSearch";
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
  type StoreSheet as SessionSheet,
} from "@/lib/store/session";

function useWarehouseCheckoutSheet() {
  return useSessionStore((s) => s.sheetTone) === "warehouse";
}

function WarehouseGoldStarCard({
  name,
  number,
}: {
  name: string;
  number: string;
}) {
  return (
    <div className="overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <div className="h-[6px] bg-costco-red" />
      <div className="flex items-start gap-4 px-5 py-4">
        <KirkIdPhoto className="h-[88px] w-[66px] shrink-0 rounded-[2px] border border-[#d0d0d0] shadow-[inset_0_0_0_2px_#f7f6f2]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <GoldStarMark size={18} />
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-costco-red">
              Gold Star
            </p>
          </div>
          <p className="mt-1 text-[22px] font-black leading-none tracking-tight text-[#1a1a1a]">
            {name}
          </p>
          <p className="mt-2 text-[16px] font-bold tabular-nums tracking-[0.12em] text-costco-blue">
            {number}
          </p>
          <MembershipBarcode className="mt-2 h-7 w-full max-w-[220px] text-[#1a1a1a]" />
        </div>
        <MembershipQr className="h-20 w-20 shrink-0 border border-[#ececec] bg-white p-1" />
      </div>
      <div className="h-[6px] bg-costco-blue" />
    </div>
  );
}

function warehouseAccountCrumbs(
  title: string,
  closeSheet: () => void,
  priorSheet: SessionSheet
) {
  const setSheet = useSessionStore.getState().setSheet;
  const openCart = useCartStore.getState().openCart;
  if (priorSheet === "checkout") {
    return [
      { label: "Home", onClick: () => setSheet(null) },
      {
        label: "Shopping Cart",
        onClick: () => {
          setSheet(null);
          openCart("warehouse");
        },
      },
      { label: "Checkout", onClick: closeSheet },
      { label: title },
    ];
  }
  return [
    { label: "Home", onClick: closeSheet },
    { label: title },
  ];
}

function PricingSheet() {
  const closeSheet = useSessionStore((s) => s.closeSheet);
  return (
    <StoreSheet title="Pricing & fees" onClose={closeSheet} wide>
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
  const closeSheet = useSessionStore((s) => s.closeSheet);
  const addMembership = useSessionStore((s) => s.addMembership);
  const removeMembership = useSessionStore((s) => s.removeMembership);
  const membershipAdded = useSessionStore((s) => s.membershipAdded);
  const membershipNumber = useSessionStore((s) => s.membershipNumber);
  const warehouse = useWarehouseCheckoutSheet();
  const priorSheet = useSessionStore((s) => s.priorSheet);
  const [number, setNumber] = useState(membershipNumber || KIRK_MEMBERSHIP);
  const title = warehouse ? "Membership" : "Add membership";

  return (
    <StoreSheet
      title={title}
      onClose={closeSheet}
      tone={warehouse ? "warehouse" : "sameday"}
      page={warehouse}
      crumbs={
        warehouse ? warehouseAccountCrumbs(title, closeSheet, priorSheet) : undefined
      }
    >
      {warehouse ? (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <WarehouseGoldStarCard
            name={KIRK_NAME}
            number={membershipNumber || number || KIRK_MEMBERSHIP}
          />
          <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-5 py-5 space-y-3">
            <p className="text-[15px] font-bold text-[#1a1a1a]">
              Costco membership
            </p>
            <p className="text-[13px] leading-snug text-[#555]">
              Add your Costco membership to unlock member pricing on Same-Day.
              Kirk&apos;s Gold Star is ready for this demo.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-[13px] text-[#555]">
              <li>Instant Savings on warehouse items</li>
              <li>Same-Day Delivery with membership</li>
              <li>100% Satisfaction Guarantee</li>
            </ul>
            {membershipAdded ? (
              <div className="rounded-[3px] border border-[#c4c4c4] bg-[#f7fbfe] px-3.5 py-3">
                <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-costco-blue">
                  <GoldStarMark size={16} />
                  Gold Star added · {membershipNumber}
                </p>
                <button
                  type="button"
                  className="mt-2 block text-[13px] font-bold text-costco-blue hover:underline"
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
                    className="h-11 w-full rounded-[3px] border border-[#c4c4c4] bg-[#f6f6f6] px-3.5 text-[15px] text-[#222] focus:border-costco-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
                  />
                </label>
                <button
                  type="button"
                  className="w-full rounded-[3px] bg-costco-red py-3 text-[15px] font-bold text-white hover:bg-costco-red-hover"
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
            {priorSheet === "checkout" ? (
              <button
                type="button"
                className="text-[13px] font-bold text-costco-blue hover:underline"
                onClick={closeSheet}
              >
                Return to Checkout
              </button>
            ) : null}
          </div>
        </div>
      ) : (
      <div className="px-4 py-4 space-y-3">
        <GoldStarMembershipCard />
        <p className="text-[13px] text-[#555] leading-snug">
          Add your Costco membership to unlock member pricing on Same-Day.
          Kirk&apos;s Gold Star is ready for this demo.
        </p>
        {membershipAdded ? (
          <div className="rounded-[12px] border border-[#b7d7b0] bg-[#eef7ee] px-3.5 py-3">
            <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1e5b24]">
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
                className="h-11 w-full rounded-[8px] border border-[#d8d8d8] bg-[#f6f6f6] px-3.5 text-[15px] text-[#222] focus:border-costco-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
              />
            </label>
            <button
              type="button"
              className="w-full rounded-full bg-[#0AAD0A] py-3 text-[15px] font-bold text-white hover:bg-[#099809]"
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
      )}
    </StoreSheet>
  );
}

function SignInSheet() {
  const closeSheet = useSessionStore((s) => s.closeSheet);
  const signIn = useSessionStore((s) => s.signIn);
  const signOut = useSessionStore((s) => s.signOut);
  const signedIn = useSessionStore((s) => s.signedIn);
  const displayName = useSessionStore((s) => s.displayName);
  const email = useSessionStore((s) => s.email);
  const warehouse = useWarehouseCheckoutSheet();
  const priorSheet = useSessionStore((s) => s.priorSheet);
  const [name, setName] = useState(displayName || KIRK_NAME);
  const [mail, setMail] = useState(email || KIRK_EMAIL);
  const [password, setPassword] = useState("");
  const [resetNote, setResetNote] = useState<string | null>(null);
  const title = "Sign In / Register";

  return (
    <StoreSheet
      title={title}
      onClose={closeSheet}
      tone={warehouse ? "warehouse" : "sameday"}
      page={warehouse}
      crumbs={
        warehouse ? warehouseAccountCrumbs(title, closeSheet, priorSheet) : undefined
      }
    >
      {warehouse ? (
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-5 py-5 space-y-3">
            <p className="text-[15px] font-bold text-[#1a1a1a]">Sign In</p>
            {signedIn ? (
              <div className="rounded-[3px] border border-[#c4c4c4] bg-[#f7fbfe] px-3.5 py-3">
                <p className="text-[15px] font-bold text-[#1a1a1a]">
                  {displayName}
                </p>
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
                    Email Address
                  </span>
                  <input
                    type="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    autoComplete="username"
                    className="h-11 w-full rounded-[3px] border border-[#c4c4c4] bg-[#f6f6f6] px-3.5 text-[15px] text-[#222] focus:border-costco-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
                  />
                </label>
                <label className="block">
                  <span className="block text-[12px] font-bold text-[#555] mb-1">
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-11 w-full rounded-[3px] border border-[#c4c4c4] bg-[#f6f6f6] px-3.5 text-[15px] text-[#222] focus:border-costco-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
                  />
                </label>
                <button
                  type="button"
                  className="w-full rounded-[3px] bg-costco-red py-3 text-[15px] font-bold text-white hover:bg-costco-red-hover"
                  onClick={() => signIn(name || KIRK_NAME, mail)}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="text-[13px] font-bold text-costco-blue hover:underline"
                  onClick={() =>
                    setResetNote(
                      "If this were a live Costco account, a reset link would be sent. Demo only — nothing leaves this browser."
                    )
                  }
                >
                  Forgot Password?
                </button>
                {resetNote ? (
                  <p className="text-[12px] leading-snug text-[#555]">{resetNote}</p>
                ) : null}
                <button
                  type="button"
                  className="block text-[13px] font-bold text-costco-blue hover:underline"
                  onClick={() => signIn(KIRK_NAME, KIRK_EMAIL)}
                >
                  Continue as Kirk
                </button>
              </>
            )}
            {priorSheet === "checkout" ? (
              <button
                type="button"
                className="text-[13px] font-bold text-costco-blue hover:underline"
                onClick={closeSheet}
              >
                Return to Checkout
              </button>
            ) : null}
          </div>
          <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-5 py-5">
            <p className="text-[15px] font-bold text-[#1a1a1a]">
              New to Costco?
            </p>
            <p className="mt-1 text-[13px] leading-snug text-[#555]">
              Create an account to save lists, attach a Gold Star, and check
              out. A Costco membership is required for member pricing.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] text-[#555]">
              <li>Track Same-Day Delivery orders</li>
              <li>Save warehouse items to lists</li>
              <li>Checkout with Gold Star pricing</li>
            </ul>
            <button
              type="button"
              className="mt-4 w-full rounded-[3px] border border-costco-red bg-white py-3 text-[15px] font-bold text-costco-red hover:bg-[#fff5f6]"
              onClick={() => signIn(name || KIRK_NAME, mail || KIRK_EMAIL)}
            >
              Create Account
            </button>
          </div>
        </div>
      ) : (
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
                className="h-11 w-full rounded-[8px] border border-[#d8d8d8] bg-[#f6f6f6] px-3.5 text-[15px] text-[#222] focus:border-costco-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
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
                className="h-11 w-full rounded-[8px] border border-[#d8d8d8] bg-[#f6f6f6] px-3.5 text-[15px] text-[#222] focus:border-costco-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
              />
            </label>
            <button
              type="button"
              className="w-full rounded-full bg-[#0AAD0A] py-3 text-[15px] font-bold text-white hover:bg-[#099809]"
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
      )}
    </StoreSheet>
  );
}

function DeliverySheet() {
  const closeSheet = useSessionStore((s) => s.closeSheet);
  const setDelivery = useSessionStore((s) => s.setDelivery);
  const windowId = useSessionStore((s) => s.windowId);
  const address = useSessionStore((s) => s.address);
  const warehouse = useWarehouseCheckoutSheet();
  const priorSheet = useSessionStore((s) => s.priorSheet);
  const [picked, setPicked] = useState(windowId);
  const [line1, setLine1] = useState(address.line1);
  const [city, setCity] = useState(address.city);
  const [zip, setZip] = useState(address.zip);
  const title = warehouse ? "Shipping & Delivery" : "Delivery details";

  return (
    <StoreSheet
      title={title}
      onClose={closeSheet}
      tone={warehouse ? "warehouse" : "sameday"}
      page={warehouse}
      crumbs={
        warehouse ? warehouseAccountCrumbs(title, closeSheet, priorSheet) : undefined
      }
    >
      <div
        className={
          warehouse
            ? "rounded-[3px] border border-[#c4c4c4] bg-white px-5 py-5 space-y-4"
            : "px-4 py-4 space-y-4"
        }
      >
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
                  className={`w-full flex items-center justify-between border px-3.5 py-3 text-left ${
                    warehouse ? "rounded-[3px]" : "rounded-[12px]"
                  } ${
                    on
                      ? warehouse
                        ? "border-costco-blue bg-[#f7fbfe]"
                        : "border-costco-blue bg-[#e8f2fa]"
                      : warehouse
                        ? "border-[#c4c4c4] bg-white hover:bg-[#f7fbfe]"
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
            className={`w-full h-11 px-3.5 bg-[#f6f6f6] border text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15 ${
              warehouse
                ? "rounded-[3px] border-[#c4c4c4]"
                : "rounded-[8px] border-[#d8d8d8]"
            }`}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className={`h-11 px-3.5 bg-[#f6f6f6] border text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15 ${
                warehouse
                  ? "rounded-[3px] border-[#c4c4c4]"
                  : "rounded-[8px] border-[#d8d8d8]"
              }`}
            />
            <input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP"
              inputMode="numeric"
              className={`h-11 px-3.5 bg-[#f6f6f6] border text-[15px] text-[#222] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15 ${
                warehouse
                  ? "rounded-[3px] border-[#c4c4c4]"
                  : "rounded-[8px] border-[#d8d8d8]"
              }`}
            />
          </div>
        </div>
        <button
          type="button"
          className={`w-full py-3 text-[15px] font-bold text-white ${
            warehouse
              ? "rounded-[3px] bg-costco-red hover:bg-costco-red-hover"
              : "rounded-full bg-[#0AAD0A] hover:bg-[#099809]"
          }`}
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
  const closeSheet = useSessionStore((s) => s.closeSheet);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const search = useCatalogStore((s) => s.search);
  const selected = useCatalogStore((s) => s.department);

  return (
    <StoreSheet title="Departments" onClose={closeSheet}>
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
  const closeSheet = useSessionStore((s) => s.closeSheet);
  const setSpecialRequest = useSessionStore((s) => s.setSpecialRequest);
  const specialRequest = useSessionStore((s) => s.specialRequest);
  const [note, setNote] = useState(specialRequest);

  return (
    <StoreSheet title="Add a special request" onClose={closeSheet}>
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

function CheckoutStep({
  n,
  title,
  children,
  onChange,
}: {
  n: number;
  title: string;
  children: ReactNode;
  onChange?: () => void;
}) {
  return (
    <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-4 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-costco-blue text-[13px] font-bold text-white">
            {n}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[#1a1a1a]">{title}</p>
            {children}
          </div>
        </div>
        {onChange ? (
          <button
            type="button"
            onClick={onChange}
            className="shrink-0 text-[13px] font-bold text-costco-blue hover:underline"
          >
            Change
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CheckoutSheet() {
  const setSheet = useSessionStore((s) => s.setSheet);
  const signedIn = useSessionStore((s) => s.signedIn);
  const displayName = useSessionStore((s) => s.displayName);
  const email = useSessionStore((s) => s.email);
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
  const totalItems = useCartStore((s) => s.getTotalItems());
  const cartTone = useCartStore((s) => s.cartTone);
  const openCart = useCartStore((s) => s.openCart);
  const sheetWarehouse = useWarehouseCheckoutSheet();
  const warehouse = cartTone === "warehouse" || sheetWarehouse;
  const slot = deliveryWindow(windowId);
  const ready = signedIn && membershipAdded && items.length > 0;
  const savingsTotal = items.reduce(
    (sum, { product, quantity }) =>
      sum + instantSavingsAmount(product.savings, quantity),
    0
  );
  const card = warehouse
    ? "flex w-full items-center rounded-[3px] border border-[#c4c4c4] bg-white px-4 py-3.5 text-left hover:bg-[#f7fbfe]"
    : "flex w-full items-center rounded-xl border border-[#e0e0e0] bg-white px-4 py-3.5 text-left shadow-sm hover:bg-[#fafafa]";
  const goCart = () => {
    setSheet(null);
    openCart("warehouse");
  };
  const [cardName, setCardName] = useState(displayName || KIRK_NAME);
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 1117");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("");

  return (
    <StoreSheet
      title={orderPlaced && warehouse ? "Thank You" : "Checkout"}
      onClose={() => {
        if (orderPlaced) clearOrder();
        setSheet(null);
      }}
      page
      tone={warehouse ? "warehouse" : "sameday"}
      crumbs={
        warehouse
          ? orderPlaced
            ? [
                {
                  label: "Home",
                  onClick: () => {
                    clearOrder();
                    setSheet(null);
                  },
                },
                { label: "Order Confirmation" },
              ]
            : [
                { label: "Home", onClick: () => setSheet(null) },
                { label: "Shopping Cart", onClick: goCart },
                { label: "Checkout" },
              ]
          : undefined
      }
    >
      <div className="space-y-3">
        {orderPlaced ? (
          warehouse ? (
            <div className="space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start xl:gap-5 xl:space-y-0">
              <div className="space-y-4">
                <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-5 py-5">
                  <p className="text-[13px] text-[#555]">
                    Your order has been received.
                  </p>
                  <p className="mt-3 text-[15px] font-bold text-[#1a1a1a]">
                    Order Number: KS-1847111217
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-[#555]">
                    We&apos;ll send a confirmation to{" "}
                    <span className="font-semibold text-[#1a1a1a]">
                      {email || KIRK_EMAIL}
                    </span>
                    .
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1a1a1a]">
                    <GoldStarMark size={16} />
                    Gold Star {membershipNumber}
                  </p>
                </div>
                <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-4 py-3.5">
                  <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#666]">
                    Delivery
                  </p>
                  <p className="mt-1 text-[15px] font-bold text-[#1a1a1a]">
                    Same-Day Delivery
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#555]">
                    {slot.when} · {slot.label}
                  </p>
                  <p className="text-[13px] text-[#555]">
                    {address.line1}, {formatAddress(address)}
                  </p>
                </div>
                {items.length > 0 ? (
                  <div className="overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-white">
                    <p className="border-b border-[#ececec] bg-[#f6f7f8] px-4 py-2 text-[12px] font-bold text-[#666]">
                      {totalItems} item{totalItems === 1 ? "" : "s"}
                    </p>
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex gap-3 border-b border-[#f0f0f0] px-4 py-3 last:border-b-0"
                      >
                        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[3px] border border-[#eee] bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-2 text-[14px] font-bold leading-snug text-costco-blue">
                              {product.brand} {product.name}
                            </p>
                            <p className="shrink-0 text-[15px] font-bold tabular-nums text-[#1a1a1a]">
                              ${(product.price * quantity).toFixed(2)}
                            </p>
                          </div>
                          {productSize(product.id) ? (
                            <p className="mt-0.5 text-[13px] text-[#72767E]">
                              {productSize(product.id)}
                            </p>
                          ) : null}
                          <p className="mt-0.5 text-[12px] text-[#72767E]">
                            Item {warehouseItemNumber(product.id)}
                          </p>
                          <p className="mt-0.5 text-[13px] tabular-nums text-[#8a8a8a]">
                            {quantity} × ${product.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                <button
                  type="button"
                  className="text-[13px] font-bold text-costco-blue hover:underline"
                  onClick={() => {
                    clearOrder();
                    setSheet(null);
                  }}
                >
                  Continue Shopping
                </button>
              </div>
              <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-4 py-4 xl:sticky xl:top-0">
                <p className="mb-3 text-[15px] font-bold text-[#1a1a1a]">
                  Order Summary
                </p>
                <div className="mb-2 flex items-center justify-between text-[13px] text-[#555]">
                  <span>
                    Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
                  </span>
                  <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {savingsTotal > 0 ? (
                  <div className="mb-2 flex items-center justify-between text-[13px] font-semibold text-[#188038]">
                    <span>You Saved</span>
                    <span className="tabular-nums">
                      ${savingsTotal.toFixed(2)}
                    </span>
                  </div>
                ) : null}
                <div className="mb-2 flex items-center justify-between text-[13px] text-[#555]">
                  <span>Shipping &amp; Handling</span>
                  <span>T.B.D.</span>
                </div>
                <div className="mb-3 flex items-center justify-between text-[13px] text-[#555]">
                  <span>Estimated Taxes</span>
                  <span>T.B.D.</span>
                </div>
                <div className="flex items-end justify-between border-t border-[#ececec] pt-3">
                  <span className="text-[13px] font-semibold text-[#555]">
                    Estimated Total
                  </span>
                  <span className="text-[24px] font-bold leading-none tabular-nums text-[#1a1a1a]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
          <div className="rounded-xl border border-[#b7d7b0] bg-[#eef7ee] px-5 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-[#1e5b24]">
              ✓
            </div>
            <p className="mt-3 text-[22px] font-extrabold text-[#1e5b24]">
              Order placed
            </p>
            <p className="mt-1 text-[13px] leading-snug text-[#1e5b24]">
              Delivery {slot.label} · {formatAddress(address)} · Gold Star{" "}
              {membershipNumber}
            </p>
            <button
              type="button"
              className="mt-4 text-[13px] font-bold text-costco-blue hover:underline"
              onClick={() => {
                clearOrder();
                setSheet(null);
              }}
            >
              Keep shopping
            </button>
          </div>
          )
        ) : (
          <div
            className={
              warehouse
                ? "space-y-4 xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start xl:gap-5 xl:space-y-0"
                : "space-y-3"
            }
          >
            <div className="space-y-3">
            {warehouse ? (
              <>
                <CheckoutStep
                  n={1}
                  title="Shipping & Delivery"
                  onChange={() => setSheet("delivery", "warehouse")}
                >
                  <p className="mt-1 text-[14px] font-bold text-[#1a1a1a]">
                    Same-Day Delivery
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#555]">
                    {slot.when} · {slot.label}
                  </p>
                  <p className="text-[13px] text-[#555]">
                    {address.line1}, {formatAddress(address)}
                  </p>
                </CheckoutStep>
                <CheckoutStep
                  n={2}
                  title="Membership"
                  onChange={() => setSheet("membership", "warehouse")}
                >
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#1a1a1a]">
                    <GoldStarMark size={16} />
                    {membershipAdded
                      ? `Gold Star · ${membershipNumber}`
                      : "Add your Costco membership"}
                  </p>
                </CheckoutStep>
                <CheckoutStep
                  n={3}
                  title="Account"
                  onChange={() => setSheet("signin", "warehouse")}
                >
                  <p className="mt-1 text-[14px] font-bold text-[#1a1a1a]">
                    {signedIn
                      ? `Signed in as ${displayName}`
                      : "Sign in to check out"}
                  </p>
                  {signedIn && email ? (
                    <p className="text-[13px] text-[#555]">{email}</p>
                  ) : null}
                </CheckoutStep>
                <CheckoutStep n={4} title="Payment">
                  <div className="mt-2 flex flex-wrap items-start gap-3">
                    <div className="flex h-[80px] w-[132px] flex-col justify-between rounded-[6px] bg-[#1a1a1a] p-2 text-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
                      <p className="text-[10px] font-black leading-none tracking-tight text-costco-red">
                        COSTCO
                      </p>
                      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/80">
                        Anywhere Visa
                      </p>
                      <p className="text-[12px] font-bold tracking-[0.16em]">
                        •••• 1117
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[#1a1a1a]">
                        Costco Anywhere Visa ending in 1117
                      </p>
                      <label className="mt-1 flex items-center gap-2 text-[13px] text-[#555]">
                        <input
                          type="checkbox"
                          checked
                          readOnly
                          className="accent-costco-blue"
                        />
                        Billing address same as delivery
                      </label>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="block text-[12px] font-bold text-[#555]">
                      Name on card
                      <input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        autoComplete="off"
                        className="mt-1 h-10 w-full rounded-[3px] border border-[#c4c4c4] bg-white px-3 text-[14px] font-normal text-[#1a1a1a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
                      />
                    </label>
                    <label className="block text-[12px] font-bold text-[#555]">
                      Card number
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        autoComplete="off"
                        inputMode="numeric"
                        className="mt-1 h-10 w-full rounded-[3px] border border-[#c4c4c4] bg-white px-3 text-[14px] font-normal tabular-nums text-[#1a1a1a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
                      />
                    </label>
                    <label className="block text-[12px] font-bold text-[#555]">
                      Expiration
                      <input
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        autoComplete="off"
                        placeholder="MM/YY"
                        className="mt-1 h-10 w-full rounded-[3px] border border-[#c4c4c4] bg-white px-3 text-[14px] font-normal tabular-nums text-[#1a1a1a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
                      />
                    </label>
                    <label className="block text-[12px] font-bold text-[#555]">
                      Security code
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        autoComplete="off"
                        inputMode="numeric"
                        className="mt-1 h-10 w-full rounded-[3px] border border-[#c4c4c4] bg-white px-3 text-[14px] font-normal tabular-nums text-[#1a1a1a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-[11px] leading-snug text-[#72767E]">
                    Payment details stay on this page. This demo does not charge
                    a card.
                  </p>
                </CheckoutStep>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setSheet("delivery", "sameday")}
                  className={card}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-[#666]">Delivery</p>
                    <p className="mt-0.5 text-[14px] font-bold text-[#1a1a1a]">
                      {slot.when} · {slot.label}
                    </p>
                    <p className="text-[13px] text-[#555]">
                      {address.line1}, {formatAddress(address)}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[#9aa0a6]" />
                </button>
                <button
                  type="button"
                  onClick={() => setSheet("membership", "sameday")}
                  className={card}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-[#666]">Membership</p>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#1a1a1a]">
                      <GoldStarMark size={16} />
                      {membershipAdded
                        ? `Gold Star · ${membershipNumber}`
                        : "Add your Costco membership"}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[#9aa0a6]" />
                </button>
                <button
                  type="button"
                  onClick={() => setSheet("signin", "sameday")}
                  className={card}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-[#666]">Account</p>
                    <p className="mt-0.5 text-[14px] font-bold text-[#1a1a1a]">
                      {signedIn
                        ? `Signed in as ${displayName}`
                        : "Sign in to check out"}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[#9aa0a6]" />
                </button>
                <div className="rounded-xl border border-[#e0e0e0] bg-white px-4 py-3.5 shadow-sm">
                  <p className="text-[12px] font-bold text-[#666]">Payment</p>
                  <p className="mt-0.5 text-[14px] font-bold text-[#1a1a1a]">
                    Item subtotal only
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#555]">
                    Service, delivery, and tax are not estimated in this demo
                  </p>
                </div>
              </>
            )}
            {specialRequest && (
              <p className="px-1 text-[12px] leading-snug text-[#555]">
                Special request: {specialRequest}
              </p>
            )}
            {items.length > 0 && (
              <div
                className={
                  warehouse
                    ? "overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-white"
                    : "overflow-hidden rounded-xl border border-[#e0e0e0] bg-white shadow-sm"
                }
              >
                <p className="border-b border-[#ececec] bg-[#f6f7f8] px-4 py-2 text-[12px] font-bold text-[#666]">
                  {totalItems} item{totalItems === 1 ? "" : "s"}
                </p>
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-3 border-b border-[#f0f0f0] px-4 py-3 last:border-b-0"
                  >
                    <div
                      className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden border border-[#eee] bg-white ${
                        warehouse ? "rounded-[3px]" : "rounded-[12px]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`line-clamp-2 text-[14px] leading-snug ${
                            warehouse
                              ? "font-bold text-costco-blue"
                              : "text-[#242424]"
                          }`}
                        >
                          {product.brand} {product.name}
                        </p>
                        <p className="shrink-0 text-[15px] font-bold tabular-nums text-[#1a1a1a]">
                          ${(product.price * quantity).toFixed(2)}
                        </p>
                      </div>
                      {productSize(product.id) ? (
                        <p className="mt-0.5 text-[13px] text-[#72767E]">
                          {productSize(product.id)}
                        </p>
                      ) : null}
                      {warehouse ? (
                        <p className="mt-0.5 text-[12px] text-[#72767E]">
                          Item {warehouseItemNumber(product.id)}
                        </p>
                      ) : null}
                      {!warehouse && unitPriceLabel(product.id, product.price) ? (
                        <p className="mt-0.5 text-[13px] text-[#72767E]">
                          {unitPriceLabel(product.id, product.price)}
                        </p>
                      ) : null}
                      <p className="mt-0.5 text-[13px] tabular-nums text-[#8a8a8a]">
                        {quantity} × ${product.price.toFixed(2)} each
                      </p>
                      {product.savings > 0 ? (
                        <p className="mt-0.5 text-[12px] font-semibold leading-snug text-[#188038]">
                          {warehouse
                            ? instantSavingsText(product.savings)
                            : `Save $${product.savings.toFixed(2)}`}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
            <div
              className={
                warehouse
                  ? "rounded-[3px] border border-[#c4c4c4] bg-white px-4 py-4 xl:sticky xl:top-0"
                  : "rounded-xl border border-[#e0e0e0] bg-white px-4 py-4 shadow-sm"
              }
            >
              {warehouse ? (
                <p className="mb-3 text-[15px] font-bold text-[#1a1a1a]">
                  Order Summary
                </p>
              ) : null}
              {warehouse ? (
                <>
                  <div className="mb-2 flex items-center justify-between text-[13px] text-[#555]">
                    <span>
                      Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
                    </span>
                    <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  {savingsTotal > 0 ? (
                    <div className="mb-2 flex items-center justify-between text-[13px] font-semibold text-[#188038]">
                      <span>You Saved</span>
                      <span className="tabular-nums">
                        ${savingsTotal.toFixed(2)}
                      </span>
                    </div>
                  ) : null}
                  <div className="mb-2 flex items-center justify-between text-[13px] text-[#555]">
                    <span>Shipping &amp; Handling</span>
                    <span>T.B.D.</span>
                  </div>
                  <div className="mb-3 flex items-center justify-between text-[13px] text-[#555]">
                    <span>Estimated Taxes</span>
                    <span>T.B.D.</span>
                  </div>
                </>
              ) : null}
              <div
                className={`flex items-end justify-between ${
                  warehouse ? "border-t border-[#ececec] pt-3" : ""
                }`}
              >
                <span className="text-[13px] font-semibold text-[#555]">
                  {warehouse ? "Estimated Total" : "Estimated total"}
                </span>
                <span className="text-[24px] font-bold leading-none tabular-nums text-[#1a1a1a]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {warehouse ? (
                <p className="mt-2 text-[12px] leading-snug text-[#555]">
                  Item subtotal only. Shipping &amp; Handling and Estimated
                  Taxes are T.B.D.
                </p>
              ) : null}
              {warehouse ? (
                <p className="mt-3 text-[11px] leading-snug text-[#666]">
                  By placing your order, you agree to Costco.com terms and
                  conditions. Membership required.
                </p>
              ) : null}
              <button
                type="button"
                disabled={!ready}
                onClick={placeOrder}
                className={`mt-4 w-full py-3 text-[15px] font-bold text-white disabled:cursor-not-allowed ${
                  warehouse
                    ? "rounded-[3px] bg-costco-red hover:bg-costco-red-hover disabled:bg-[#c4c4c4] disabled:text-[#666] disabled:hover:bg-[#c4c4c4]"
                    : "rounded-full bg-[#0AAD0A] hover:bg-[#099809] disabled:opacity-50"
                }`}
              >
                {items.length === 0
                  ? "Add items to check out"
                  : !signedIn
                    ? "Sign in to check out"
                    : !membershipAdded
                      ? "Add membership to check out"
                      : "Place order"}
              </button>
              {warehouse ? (
                <button
                  type="button"
                  onClick={goCart}
                  className="mt-3 w-full text-center text-[13px] font-bold text-costco-blue hover:underline"
                >
                  Return to Cart
                </button>
              ) : null}
              <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-center text-[11px] leading-snug text-[#888]">
                {warehouse ? null : <InstacartMark size={12} />}
                {warehouse
                  ? "Membership required · Prices higher than warehouse"
                  : "Same-Day Delivery powered by Instacart · Membership required"}
              </p>
            </div>
          </div>
        )}
      </div>
    </StoreSheet>
  );
}

function CustomerServiceSheet() {
  const closeSheet = useSessionStore((s) => s.closeSheet);
  const setSheet = useSessionStore((s) => s.setSheet);
  const search = useCatalogStore((s) => s.search);
  const inspect = useCatalogStore((s) => s.inspect);
  const shopKirkland = () => {
    closeSheet();
    inspect(null);
    useCatalogStore.setState({
      q: "kirkland",
      department: null,
      tag: null,
      openList: null,
      openRecipe: null,
      listTone: "warehouse",
      warehouseFacets: EMPTY_WAREHOUSE_FACETS,
      warehouseSort: "relevance",
    });
    void search();
  };
  const topics = [
    {
      title: "Orders & Returns",
      copy: "Track an order or start a return.",
      onClick: () => setSheet("signin", "warehouse"),
    },
    {
      title: "Membership",
      copy: "Gold Star benefits and member number.",
      onClick: () => setSheet("membership", "warehouse"),
    },
    {
      title: "Find a Warehouse",
      copy: "Same-Day Delivery address and time windows.",
      onClick: () => setSheet("delivery", "warehouse"),
    },
    {
      title: "Account & Sign In",
      copy: "Sign in or create a Costco.com account.",
      onClick: () => setSheet("signin", "warehouse"),
    },
    {
      title: "Kirkland Signature",
      copy: "Shop member-only Kirkland Signature items.",
      onClick: shopKirkland,
    },
    {
      title: "Pricing & Fees",
      copy: "Same-Day pricing, savings, and returns.",
      onClick: () => setSheet("pricing", "sameday"),
    },
  ];

  return (
    <StoreSheet
      title="Customer Service"
      onClose={closeSheet}
      tone="warehouse"
      page
      crumbs={[
        { label: "Home", onClick: closeSheet },
        { label: "Customer Service" },
      ]}
    >
      <div className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-5 py-5">
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#555]">
              Contact Us
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#555]">
              Get help with membership, orders, and Same-Day Delivery.
            </p>
            <p className="mt-3 text-[22px] font-bold text-[#1a1a1a]">
              1-800-774-2678
            </p>
            <p className="mt-0.5 text-[13px] text-[#72767E]">
              Monday–Sunday, 8:00am–8:00pm PT
            </p>
            <p className="mt-3 text-[13px] font-bold text-[#1a1a1a]">
              customerservice@costco.com
            </p>
            <p className="mt-0.5 text-[12px] text-[#72767E]">
              We typically reply within one business day.
            </p>
          </div>
          <div className="rounded-[3px] border border-[#c4c4c4] bg-[#f7fbfe] px-5 py-5">
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#555]">
              Membership
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#555]">
              Gold Star members receive warehouse pricing on Same-Day Delivery.
              Membership is required to check out.
            </p>
            <button
              type="button"
              className="mt-3 text-[13px] font-bold text-costco-blue hover:underline"
              onClick={() => setSheet("membership", "warehouse")}
            >
              View membership
            </button>
          </div>
        </div>
        <div>
          <p className="mb-2 text-[15px] font-bold text-[#1a1a1a]">
            Popular Help Topics
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <button
                key={topic.title}
                type="button"
                onClick={topic.onClick}
                className="rounded-[3px] border border-[#c4c4c4] bg-white px-4 py-3 text-left hover:border-costco-blue hover:bg-[#f7fbfe]"
              >
                <p className="text-[14px] font-bold text-costco-blue">
                  {topic.title}
                </p>
                <p className="mt-1 text-[12px] text-[#555]">{topic.copy}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </StoreSheet>
  );
}

export default function StoreSheets() {
  const sheet = useSessionStore((s) => s.sheet);
  const priorSheet = useSessionStore((s) => s.priorSheet);
  const checkoutOpen = sheet === "checkout" || priorSheet === "checkout";

  return (
    <>
      {checkoutOpen ? <CheckoutSheet /> : null}
      {sheet === "pricing" ? <PricingSheet /> : null}
      {sheet === "membership" ? <MembershipSheet /> : null}
      {sheet === "signin" ? <SignInSheet /> : null}
      {sheet === "delivery" ? <DeliverySheet /> : null}
      {sheet === "departments" ? <DepartmentsSheet /> : null}
      {sheet === "request" ? <RequestSheet /> : null}
      {sheet === "customer" ? <CustomerServiceSheet /> : null}
    </>
  );
}
