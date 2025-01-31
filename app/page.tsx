"use client";
import Email from "@/components/accountInfo/username";
import { Header } from "@/components/header";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login")
      }
    })

    return () => unsubscribe();
  }, [router]);

  return (
    <>
      <Header />
      <Email />
    </>
  );
}
