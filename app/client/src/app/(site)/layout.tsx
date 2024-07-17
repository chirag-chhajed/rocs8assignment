"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useLogoutMutation } from "@/store/api/authApi";
import { ChevronLeft, ChevronRight, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { toast } from "sonner";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const [logout] = useLogoutMutation();
  const handleLogout = () => {
    toast.promise(logout().unwrap(), {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Failed to log out",
    });
  };
  return (
    <>
      <header className="px-10 pb-4">
        <div className="justify-end flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="#" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Help
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Sale
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Hi, John</NavigationMenuTrigger>
                <NavigationMenuContent className="py-4 px-3 bg-white right-0 w-36 rounded-md space-y-4">
                  <p className="text-neutral-800 font-medium text-sm">
                    Account
                  </p>
                  <ul className="text-neutral-400 text-xs space-y-4">
                    <li>
                      <NavigationMenuItem className="hover:text-black capitalize">
                        <Link href="#" legacyBehavior passHref>
                          <NavigationMenuLink>Profile</NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </li>
                    <li>
                      <NavigationMenuItem className="hover:text-black capitalize">
                        <Link href="#" legacyBehavior passHref>
                          <NavigationMenuLink>Orders</NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </li>
                    <li>
                      <NavigationMenuItem className="hover:text-black capitalize">
                        <Link href="#" legacyBehavior passHref>
                          <NavigationMenuLink>
                            Payment Methods
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </li>
                    <li>
                      <NavigationMenuItem className="hover:text-black capitalize">
                        <Link href="#" legacyBehavior passHref>
                          <NavigationMenuLink>
                            Account Settings
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </li>
                    <li
                      onClick={() => handleLogout()}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleLogout();
                        }
                      }}
                      aria-label="Log Out"
                    >
                      <NavigationMenuItem className="hover:text-black capitalize">
                        <button type="button">Log Out</button>
                      </NavigationMenuItem>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="uppercase font-bold text-3xl">ecommerce</h1>
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className="!text-base font-semibold text-black gap-8">
              <NavigationMenuItem>
                <Link href="#" legacyBehavior passHref>
                  <NavigationMenuLink>Categories</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#" legacyBehavior passHref>
                  <NavigationMenuLink>Sale</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#" legacyBehavior passHref>
                  <NavigationMenuLink>Clearance</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#" legacyBehavior passHref>
                  <NavigationMenuLink>New Stock</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#" legacyBehavior passHref>
                  <NavigationMenuLink>Training</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex justify-center items-center gap-8">
            <button className="hover:bg-neutral-100 rounded p-2 " type="button">
              <Search />
            </button>
            <button className="hover:bg-neutral-100 rounded p-2 " type="button">
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
