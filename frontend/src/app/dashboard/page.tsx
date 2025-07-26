"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error("unauthenticated");
      })
      .then(setUser)
      .catch(() => router.push("/login"));
  }, [router]);

  if (!user) return null;

  return <div>Welcome, {user.email}</div>;
}
