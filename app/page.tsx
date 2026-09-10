"use client";

import StoreChrome from "@/components/StoreChrome";
import { MobileAisles } from "@/components/DepartmentsSidebar";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <StoreChrome>
      <MobileAisles />
      <ProductGrid />
    </StoreChrome>
  );
}
