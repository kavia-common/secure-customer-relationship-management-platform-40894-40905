import React, { useState } from "react";
import Card from "../components/Card";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { useApp } from "../state/AppContext";
import { navigate } from "../router/HashRouter";

/**
 * PUBLIC_INTERFACE
 * Login page (client side only demo)
 */
export default function Login() {
  const { dispatch } = useApp();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN", payload: { token: "demo", user: { email } } });
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <Card title="Sign in">
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
          <Button type="submit">Login</Button>
        </form>
      </Card>
    </div>
  );
}
