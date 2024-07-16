import { ChevronLeft, ChevronRight, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import type React from "react";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="px-10 pb-4">
        <nav className="flex justify-end py-3">
          <ul className="flex justify-center gap-5 text-xs text-neutral-500 ">
            <li className="hover:text-black">
              <Link href="#">Help</Link>
            </li>
            <li className="hover:text-black">
              <Link href="#">Orders & Returns</Link>
            </li>
            <li className="hover:text-black">
              <Link href="#">Hi, John</Link>
            </li>
          </ul>
        </nav>
        <div className="flex justify-between items-center">
          <h1 className="uppercase font-bold text-3xl">ecommerce</h1>
          <nav className="hidden md:block">
            <ul className="flex justify-center items-center gap-8 font-semibold text-base">
              <li>
                <Link href="#">Categories</Link>
              </li>
              <li>
                <Link href="#">Sale</Link>
              </li>
              <li>
                <Link href="#">Clearance</Link>
              </li>
              <li>
                <Link href="#">New Stock</Link>
              </li>
              <li>
                <Link href="#">Training</Link>
              </li>
            </ul>
          </nav>
          <div className="flex justify-center items-center gap-8">
            <button
              className="hover:bg-neutral-100 rounded p-2 hover:text-neutral-500"
              type="button"
            >
              <Search />
            </button>
            <button
              className="hover:bg-neutral-100 rounded p-2 hover:text-neutral-500"
              type="button"
            >
              <ShoppingCart />
            </button>
          </div>
        </div>
      </header>
      <div className="flex justify-center items-center bg-neutral-100 space-x-5 font-medium text-sm pt-3 pb-2">
        <ChevronLeft size={16} />

        <p>Get 10% off on business sign up</p>
        <ChevronRight size={16} />
      </div>
      {children}
    </>
  );
};

export default SiteLayout;
