"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import api from "@/lib/axios";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (response: CredentialResponse) => {
    try {
      const { data } = await api.post("/auth/google", {
        credential: response.credential,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      console.log("Login failed", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-semibold">Sign in to continue</h1>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => console.log("Login Failed")}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
