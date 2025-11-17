import React, { useState } from "react";
import Card from "../components/Card";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useApp } from "../state/AppContext";
import { navigate } from "../router/HashRouter";
import { post, setAuthToken } from "../api/client";

/**
 * PUBLIC_INTERFACE
 * Login page wired to backend with graceful fallback
 */
export default function Login() {
  const { dispatch } = useApp();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Try backend auth first
      const res = await post("/auth/login", { email, password: pwd });
      if (res && res.token) {
        setAuthToken(res.token);
        dispatch({ type: "LOGIN", payload: { token: res.token, user: { email } } });
        navigate("/");
        return;
      }
      throw new Error("Invalid response");
    } catch (err) {
      // Fallback: client-side demo login
      alert("Backend login failed or unavailable. Using demo session.");
      dispatch({ type: "LOGIN", payload: { token: "demo", user: { email } } });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <Card title="Sign in">
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
          <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Login"}</Button>
        </form>
      </Card>
    </div>
  );
}
