"use client";

import { Button } from "@/components/ui/button";
import { store } from "@/store";
import { useLogoutMutation } from "@/store/api/authApi";
import { clearTokens } from "@/store/authSlice";

export default function App() {
  const [logout, { isLoading }] = useLogoutMutation();
  return (
    <main className="text-3xl font-bold underline">
      <Button
        onClick={() => {
          logout()
            .unwrap()
            .then(() => {
              store.dispatch(clearTokens());
            });
        }}
        disabled={isLoading}
      >
        Logout
      </Button>
    </main>
  );
}
