"use client";

import { useEffect } from "react";
import useUserStore from "@/store/useAuthstore";
import { useCartStore } from "@/store/useCartStore";

export default function AppProvider({ children }) {
  const { checkAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  return children;
}

