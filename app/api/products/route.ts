import { NextRequest, NextResponse } from "next/server";
import { departments, filterProducts } from "@/lib/data/products";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const department = searchParams.get("department") || undefined;
  const tag = searchParams.get("tag") || undefined;

  if (department && !departments.includes(department)) {
    return NextResponse.json(
      { error: `Unknown department: ${department}`, products: [] },
      { status: 400 }
    );
  }

  const products = filterProducts({ q, department, tag });
  return NextResponse.json({
    products,
    count: products.length,
    filters: { q: q || null, department: department || null, tag: tag || null },
  });
}
