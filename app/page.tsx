"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import { MobileAisles } from "@/components/DepartmentsSidebar";
import ProductGrid from "@/components/ProductGrid";
import AskKirkChat from "@/components/AskKirkChat";
import CartDrawer from "@/components/CartDrawer";
import ProductDetailModal from "@/components/ProductDetailModal";
import WarehouseAddedModal from "@/components/WarehouseAddedModal";
import { hydrateLists } from "@/lib/store/lists";
import { useCatalogStore } from "@/lib/store/catalog";
import { hydrateSession, useSessionStore } from "@/lib/store/session";
import StoreSheets from "@/components/StoreSheets";

export default function Home() {
  const isKirkOpen = useSessionStore((s) => s.kirkOpen);
  const setKirkOpen = useSessionStore((s) => s.setKirkOpen);
  const inspecting = useCatalogStore((s) => s.inspecting);
  const inspect = useCatalogStore((s) => s.inspect);

  useEffect(() => {
    hydrateLists();
    hydrateSession();
  }, []);

  return (
    <div className="h-dvh bg-[#f6f7f8] flex flex-col overflow-hidden">
      <Header onAskKirkClick={() => setKirkOpen(true)} />

      <div className="flex flex-1 min-h-0">
        <div
          className={
            isKirkOpen
              ? "hidden"
              : "flex min-w-0 flex-1 flex-col"
          }
        >
          <PromoBanner />
          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
            <MobileAisles />
            <ProductGrid />
          </main>
        </div>

        {isKirkOpen && (
          <>
            <button
              type="button"
              aria-label="Close Ask Kirk"
              className="lg:hidden fixed inset-0 z-[35] bg-black/40"
              onClick={() => setKirkOpen(false)}
            />
            <AskKirkChat
              isOpen={isKirkOpen}
              onClose={() => setKirkOpen(false)}
            />
          </>
        )}
      </div>

      <CartDrawer />
      <WarehouseAddedModal />
      {inspecting ? (
        <ProductDetailModal
          key={inspecting.id}
          product={inspecting}
          onClose={() => inspect(null)}
        />
      ) : null}
      <StoreSheets />
    </div>
  );
}
