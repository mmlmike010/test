"use client";

import { useState } from "react";
import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import DepartmentsSidebar from "@/components/DepartmentsSidebar";
import CategoryScroller from "@/components/CategoryScroller";
import ProductGrid from "@/components/ProductGrid";
import AskKirkChat from "@/components/AskKirkChat";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  const [isKirkOpen, setIsKirkOpen] = useState(true);

  return (
    <div className="h-dvh bg-costco-bg flex flex-col overflow-hidden">
      <Header onAskKirkClick={() => setIsKirkOpen(true)} />
      <PromoBanner />

      <div className="flex flex-1 min-h-0">
        <DepartmentsSidebar compact={isKirkOpen} />

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <CategoryScroller />
          <ProductGrid />
        </main>

        {isKirkOpen && (
          <>
            <button
              type="button"
              aria-label="Close Ask Kirk"
              className="lg:hidden fixed inset-0 z-40 bg-black/40"
              onClick={() => setIsKirkOpen(false)}
            />
            <AskKirkChat
              isOpen={isKirkOpen}
              onClose={() => setIsKirkOpen(false)}
            />
          </>
        )}
      </div>

      <CartDrawer />
    </div>
  );
}
