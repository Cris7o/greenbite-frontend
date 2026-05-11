import React, { useState, useEffect } from "react";
import CatalogList from "./components/CatalogList";
import Login from "./components/Login";
import { greenBiteEvents } from "./patterns/observer";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("greenbite_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [tab, setTab] = useState("catalogo");
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    greenBiteEvents.subscribe("subscription:new", () => {});
  }, []);

  const cargarPedidos = () => {
    if (!user) return;
    setLoadingPedidos(true);
    fetch(`/api/dashboard/${user.id}`)
      .then(res => res.json())
      .then(data => { setPedidos(data.orders || []); setLoadingPedidos(false); })
      .catch(() => setLoadingPedidos(false));
  };

  useEffect(() => {
    if (tab === "pedidos" || tab === "suscripciones") cargarPedidos();
  }, [tab, user]);

  const handleLogin = (userData) => {
    sessionStorage.setItem("greenbite_user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("greenbite_user");
    setUser(null);
    setTab("catalogo");
    setPedidos([]);
  };

  const handleSubscribe = async (box) => {
    try {
      const res = await fetch("/api/suscribir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, boxNombre: box.nombre })
      });
      if (!res.ok) throw new Error();
      setToastMsg(`✅ ¡Suscrito a ${box.nombre}!`);
      setTimeout(() => setToastMsg(null), 3000);
      if (tab === "suscripciones") cargarPedidos();
    } catch {
      setToastMsg("❌ Error al suscribirse, intenta de nuevo");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const ESTADO_COLOR = {
    PENDIENTE:      { bg: "#fef3c7", color: "#713f12" },
    EN_PREPARACION: { bg: "#dbeafe", color: "#1e3a8a" },
    ENVIADO:        { bg: "#ede9fe", color: "#3b0764" },
    ENTREGADO:      { bg: "#d1fae5", color: "#064e3b" },
    CANCELADO:      { bg: "#fee2e2", color: "#7f1d1d" },
  };

  const ESTADO_ICON = {
    PENDIENTE: "⏳", EN_PREPARACION: "👨‍🍳", ENVIADO: "🚚", ENTREGADO: "✅", CANCELADO: "❌"
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'DM Sans', sans-serif" }}>

      {toastMsg && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 999,
          background: toastMsg.startsWith("❌") ? "#dc2626" : "#14532d",
          color: "white", padding: "14px 22px", borderRadius: 12,
          fontSize: 14, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          animation: "slideIn 0.3s ease"
        }}>
          {toastMsg}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <header style={{
        background: "linear-gradient(135deg, #052e16 0%, #14532d 60%, #166534 100%)",
        color: "white", padding: "0 32px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 68,
        boxShadow: "0 2px 20px rgba(5,46,22,0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
          }}>🌿</div>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700 }}>GreenBite</div>
            <div style={{ fontSize: 10, color: "#86efac", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Suscripciones Orgánicas
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[
            { key: "catalogo",       label: "🛒 Catálogo"        },
            { key: "suscripciones",  label: "🌿 Mis suscripciones" },
            { key: "pedidos",        label: "📦 Mis pedidos"      },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              background: tab === key ? "rgba(255,255,255,0.2)" : "transparent",
              color: "white",
              border: tab === key ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
              borderRadius: 9, padding: "8px 18px",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}>
              {label}
            </button>
          ))}

          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)", margin: "0 6px" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#16a34a",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "white"
            }}>
              {user.nombre.charAt(0)}
            </div>
            <span style={{ fontSize: 13, color: "#d1fae5", fontWeight: 500 }}>{user.nombre}</span>
            <button onClick={handleLogout} style={{
              background: "rgba(255,255,255,0.1)", color: "white",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8,
              padding: "6px 12px", fontSize: 12, cursor: "pointer",
              transition: "background 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              Salir
            </button>
          </div>
        </nav>
      </header>

      <div style={{ background: "linear-gradient(180deg, #dcfce7 0%, #f0fdf4 100%)", padding: "32px 32px 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          {tab === "catalogo" && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                🌱 Temporada actual
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#052e16", margin: "4px 0 6px", fontFamily: "Georgia, serif" }}>
                Catálogo de cajas orgánicas
              </h1>
              <p style={{ color: "#4b7a5e", fontSize: 14, margin: "0 0 28px" }}>
                Producido por agricultores locales · Envío a domicilio cada semana
              </p>
            </div>
          )}
          {tab === "suscripciones" && (
            <div style={{ animation: "fadeUp 0.4s ease", marginBottom: 28 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#052e16", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
                Mis suscripciones
              </h1>
              <p style={{ color: "#4b7a5e", fontSize: 14, margin: 0 }}>
                Hola {user.nombre} · estas son las cajas a las que estás suscrito
              </p>
            </div>
          )}
          {tab === "pedidos" && (
            <div style={{ animation: "fadeUp 0.4s ease", marginBottom: 28 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#052e16", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
                Mis pedidos
              </h1>
              <p style={{ color: "#4b7a5e", fontSize: 14, margin: 0 }}>
                Hola {user.nombre} · aquí está el estado de tus entregas
              </p>
            </div>
          )}
        </div>
      </div>

      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 32px 48px" }}>

        {tab === "catalogo" && <CatalogList onSubscribe={handleSubscribe} />}

        {tab === "suscripciones" && (
          loadingPedidos ? (
            <p style={{ color: "#64748b", padding: "32px 0" }}>Cargando suscripciones...</p>
          ) : pedidos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
              <p style={{ fontSize: 15, marginBottom: 16 }}>Aún no tienes suscripciones activas.</p>
              <button onClick={() => setTab("catalogo")} style={{
                background: "#14532d", color: "white", border: "none",
                borderRadius: 10, padding: "11px 24px", fontSize: 13,
                fontWeight: 700, cursor: "pointer"
              }}>
                Ver catálogo →
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {pedidos.map(pedido => {
                const cfg = ESTADO_COLOR[pedido.estado] || {};
                const icon = ESTADO_ICON[pedido.estado] || "📦";
                return (
                  <div key={pedido.id} style={{
                    background: "white", border: "1.5px solid #d1fae5",
                    borderRadius: 18, padding: "22px 20px",
                    display: "flex", flexDirection: "column", gap: 12,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    position: "relative", overflow: "hidden"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(20,83,45,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #16a34a, #4ade80)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 32 }}>{icon}</div>
                      <span style={{
                        background: cfg.bg, color: cfg.color,
                        padding: "4px 12px", borderRadius: 20,
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.3px"
                      }}>
                        {pedido.estado.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#14532d", margin: "0 0 4px" }}>
                        {pedido.producto}
                      </h3>
                      <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                        {pedido.cantidad} unidad{pedido.cantidad !== 1 ? "es" : ""} · suscripción semanal
                      </p>
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                      Suscrito el {new Date(pedido.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {tab === "pedidos" && (
          loadingPedidos ? (
            <p style={{ color: "#64748b", padding: "32px 0" }}>Cargando pedidos...</p>
          ) : pedidos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 15 }}>No tienes pedidos activos por ahora.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pedidos.map(pedido => {
                const cfg = ESTADO_COLOR[pedido.estado] || {};
                return (
                  <div key={pedido.id} style={{
                    background: "white", border: "1.5px solid #d1fae5",
                    borderRadius: 14, padding: "16px 22px",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 16,
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(20,83,45,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: "50%",
                        background: "#dcfce7", color: "#14532d",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: 16, flexShrink: 0
                      }}>
                        {pedido.cliente?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#14532d" }}>{pedido.producto}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                          {pedido.cantidad} unidad{pedido.cantidad !== 1 ? "es" : ""} · {new Date(pedido.fecha).toLocaleDateString("es-CL")}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      background: cfg.bg, color: cfg.color,
                      padding: "5px 14px", borderRadius: 20,
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.3px", flexShrink: 0
                    }}>
                      {pedido.estado.replace(/_/g, " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>
    </div>
  );
}