// components/client-only.tsx
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * @description A component that renders its children only on the client side after hydration.
 * This is useful for components that rely on browser-specific APIs or have dynamic initial states
 * that might cause hydration mismatches if rendered on the server.
 * @param {ReactNode} children - The React children to be rendered.
 */
export function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  // Set hasMounted to true after the component mounts on the client
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Render null on the server and during the initial client render until mounted
  if (!hasMounted) {
    return null;
  }

  // Render children only when mounted on the client
  return <>{children}</>;
}
