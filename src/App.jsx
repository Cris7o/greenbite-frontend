import React, { useState, useEffect } from "react";
import CatalogList from "./components/CatalogList";
import { greenBiteEvents } from "./patterns/observer";

export default function App() {
  const [tab, setTab] = useState("catalogo");
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    greenBiteEvents.subscribe("subscription:new", () => {});
  }, []);

  useEffect(() => {
    if (tab === "pedidos") {
      setLoadingPedidos(true);
      fetch("/api/dashboard/1")
        .then(res => res.json())
        .then(data => { setPedidos(data.orders || []); setLoadingPedidos(false); })
        .catch(() => setLoadingPedidos(false));
    }
  }, [tab]);

  const handleSubscribe = (box) => {
    setToastMsg(`✅ ¡Suscrito a ${box.nombre}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const ESTADO_COLOR = {
    PENDIENTE:      { bg: "#fef3c7", color: "#713f12" },
    EN_PREPARACION: { bg: "#dbeafe", color: "#1e3a8a" },
    ENVIADO:        { bg: "#ede9fe", color: "#3b0764" },
    ENTREGADO:      { bg: "#d1fae5", color: "#064e3b" },
    CANCELADO:      { bg: "#fee2e2", color: "#7f1d1d" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", fontFamily: "'DM Sans', sans-serif" }}>

      {toastMsg && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 999,
          background: "#14532d", color: "white",
          padding: "14px 22px", borderRadius: 12,
          fontSize: 14, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(20,83,45,0.25)",
          animation: "slideIn 0.3s ease"
        }}>
          {toastMsg}
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
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
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22
          }}>🌿</div>
          <div>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>
              GreenBite
            </div>
            <div style={{ fontSize: 10, color: "#86efac", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Suscripciones Orgánicas
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 6 }}>
          {[
            { key: "catalogo", label: "🛒 Catálogo" },
            { key: "pedidos",  label: "📦 Pedidos"  },
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
        </nav>
      </header>

      <div style={{ background: "linear-gradient(180deg, #dcfce7 0%, #f0fdf4 100%)", padding: "32px 32px 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          {tab === "catalogo" && (
            <div style={{ animation: "fadeUp 0.4s ease" }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  🌱 Temporada actual
                </span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#052e16", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
                Catálogo de cajas orgánicas
              </h1>
              <p style={{ color: "#4b7a5e", fontSize: 14, margin: "0 0 28px" }}>
                Producido directamente por agricultores locales · Envío a domicilio cada semana
              </p>
            </div>
          )}
          {tab === "pedidos" && (
            <div style={{ animation: "fadeUp 0.4s ease", marginBottom: 28 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#052e16", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
                Tus pedidos activos
              </h1>
              <p style={{ color: "#4b7a5e", fontSize: 14, margin: 0 }}>
                Estado en tiempo real desde el sistema de despacho
              </p>
            </div>
          )}
        </div>
      </div>

      <main style={{ maxWidth: 1140, margin: "0 auto", padding: "24px 32px 48px" }}>

        {tab === "catalogo" && <CatalogList onSubscribe={handleSubscribe} />}

        {tab === "pedidos" && (
          loadingPedidos ? (
            <p style={{ color: "#64748b", padding: "32px 0" }}>Cargando pedidos...</p>
          ) : pedidos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 15 }}>No hay pedidos activos por ahora.</p>
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
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#14532d" }}>{pedido.cliente}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                          {pedido.producto} · {pedido.cantidad} unidad{pedido.cantidad !== 1 ? "es" : ""}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>
                        {new Date(pedido.fecha).toLocaleDateString("es-CL")}
                      </span>
                      <span style={{
                        background: cfg.bg, color: cfg.color,
                        padding: "5px 14px", borderRadius: 20,
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.3px"
                      }}>
                        {pedido.estado.replace(/_/g, " ")}
                      </span>
                    </div>
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