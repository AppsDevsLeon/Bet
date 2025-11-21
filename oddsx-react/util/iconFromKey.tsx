"use client";

import React from "react";
import { UsdtIcon, UsdcIcon, EthIcon } from "@/components/Icons/CryptoIcons";

export function iconFromKey(key?: string): React.ReactNode {
  if (!key) return undefined;

  switch (key.toLowerCase()) {
    case "usdt":
    case "tether":
      return <UsdtIcon size={18} />;
    case "usdc":
      return <UsdcIcon size={18} />;
    case "eth":
    case "ethereum":
      return <EthIcon size={18} />;
    default:
      return undefined;
  }
}
