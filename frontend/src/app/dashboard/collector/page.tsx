"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CollectorDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "collector") {
        router.push("/");
        return;
      }
      setUser(payload);
    } catch {
      router.push("/");
    }
  }, [router]);

  if (!user) return null;

  return <div>Welcome, {user.name} ({user.role})</div>;
}
