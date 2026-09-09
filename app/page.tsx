"use client";

import { useState } from "react";
import Header from "@/components/Header";
import DepartmentsSidebar from "@/components/DepartmentsSidebar";
import CategoryScroller from "@/components/CategoryScroller";
import ProductGrid from "@/components/ProductGrid";
import AskKirkChat from "@/components/AskKirkChat";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  const [isKirkOpen, setIsKirkOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAskKirkClick={() => setIsKirkOpen(true)} />

      <div className="flex flex-1 min-h-0">
        <DepartmentsSidebar compact={isKirkOpen} />

        <main className="flex-1 min-w-0 overflow-x-hidden">
          <CategoryScroller />
          <ProductGrid />
        </main>

        {isKirkOpen && (
          <AskKirkChat
            isOpen={isKirkOpen}
            onClose={() => setIsKirkOpen(false)}
          />
        )}
      </div>

      <CartDrawer />
    </div>
  );
}
