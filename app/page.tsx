"use client";

import { useState } from "react";
import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import { MobileAisles } from "@/components/DepartmentsSidebar";
import ProductGrid from "@/components/ProductGrid";
import AskKirkChat from "@/components/AskKirkChat";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  const [isKirkOpen, setIsKirkOpen] = useState(true);

  return (
    <div className="h-dvh bg-[#f6f7f8] flex flex-col overflow-hidden">
      <Header onAskKirkClick={() => setIsKirkOpen(true)} />
      <PromoBanner />

      <div className="flex flex-1 min-h-0">
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          <MobileAisles />
          <ProductGrid />
        </main>

      </div>

      <AskKirkChat
        isOpen={isKirkOpen}
        onClose={() => setIsKirkOpen(false)}
      />

      <CartDrawer />
    </div>
  );
}
