import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return setError("Completa todos los campos");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Credenciales incorrectas");
      onLogin(data);
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: 24
    }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {["10%", "30%", "60%", "80%", "50%"].map((left, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            width: 200 + i * 80, height: 200 + i * 80,
            left, top: `${10 + i * 15}%`,
          }} />
        ))}
      </div>

      <div style={{
        background: "white", borderRadius: 22,
        padding: "44px 40px", width: "100%", maxWidth: 420,
        boxShadow: "0 32px 80px rgba(5,46,22,0.4)",
        position: "relative"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #14532d, #16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px"
          }}>🌿</div>
          <h1 style={{
            fontFamily: "Georgia, serif", fontSize: 24,
            fontWeight: 700, color: "#052e16", margin: "0 0 6px"
          }}>GreenBite</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Ingresa para ver tus suscripciones
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="tu@greenbite.cl"
              style={{
                display: "block", width: "100%", marginTop: 6,
                padding: "11px 14px", borderRadius: 10,
                border: "1.5px solid #d1fae5", fontSize: 14,
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.15s", color: "#14532d"
              }}
              onFocus={e => e.target.style.borderColor = "#16a34a"}
              onBlur={e => e.target.style.borderColor = "#d1fae5"}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              style={{
                display: "block", width: "100%", marginTop: 6,
                padding: "11px 14px", borderRadius: 10,
                border: "1.5px solid #d1fae5", fontSize: 14,
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.15s", color: "#14532d"
              }}
              onFocus={e => e.target.style.borderColor = "#16a34a"}
              onBlur={e => e.target.style.borderColor = "#d1fae5"}
            />
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#dc2626", fontWeight: 500
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? "#86efac" : "#14532d",
              color: "white", border: "none", borderRadius: 10,
              padding: "13px", fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 6, transition: "background 0.15s",
              letterSpacing: "0.3px"
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#166534"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#14532d"; }}
          >
            {loading ? "Ingresando..." : "Ingresar →"}
          </button>
        </div>

        <div style={{ marginTop: 28, padding: "16px", background: "#f0fdf4", borderRadius: 10 }}>
          <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Usuarios de prueba
          </p>
          {[
            { email: "ana@greenbite.cl",    pass: "ana123"    },
            { email: "carlos@greenbite.cl", pass: "carlos123" },
            { email: "sofia@greenbite.cl",  pass: "sofia123"  },
            { email: "miguel@greenbite.cl", pass: "miguel123" },
          ].map(u => (
            <div
              key={u.email}
              onClick={() => { setEmail(u.email); setPassword(u.pass); }}
              style={{
                fontSize: 12, color: "#16a34a", cursor: "pointer",
                padding: "3px 0", fontWeight: 500,
                transition: "color 0.1s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#14532d"}
              onMouseLeave={e => e.currentTarget.style.color = "#16a34a"}
            >
              {u.email} / {u.pass}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;