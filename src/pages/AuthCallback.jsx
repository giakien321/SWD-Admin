import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { storeTokens } from "../lib/auth";

export default function AuthCallback(){
  const navigate = useNavigate();

  useEffect(() => {
    // parse hash fragment: #id_token=...&state=...
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const id_token = params.get("id_token");

    if (!id_token) {
      alert("Google login failed (no id_token).");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        // send Google ID token to backend for verification and to get our accessToken
        const res = await api.post("/api/v1/auth/google", { token: id_token });
        const { accessToken, refreshToken } = res.data;
        storeTokens({ accessToken, refreshToken });
        navigate("/");
      } catch (err) {
        console.error(err);
        alert("Login failed: " + (err?.response?.data?.message || err.message));
        navigate("/login");
      }
    })();
  }, []);

  return <div className="min-h-screen flex items-center justify-center">Processing login...</div>;
}
