"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("ACCESS_TOKEN");
    if (!token && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/login");
    } else if (token && pathname === "/login") {
      router.replace("/");
    } else {
      setAuthorized(true); // eslint-disable-line
    }
  }, [pathname, router]);

  if (!authorized) {
    return null;
  }
  return <>{children}</>;
}
