import React from "react";
import { greenBiteEvents } from "../patterns/observer";

const CATEGORIA_CONFIG = {
  familiar:  { emoji: "👨‍👩‍👧‍👦", color: "#064e3b", bg: "#d1fae5", label: "Familiar" },
  vegana:    { emoji: "🥦", color: "#065f46", bg: "#a7f3d0", label: "Vegana" },
  detox:     { emoji: "🧃", color: "#0f766e", bg: "#ccfbf1", label: "Detox" },
  frutas:    { emoji: "🍓", color: "#9f1239", bg: "#ffe4e6", label: "Frutas" },
  verduras:  { emoji: "🥕", color: "#713f12", bg: "#fef3c7", label: "Verduras" },
  mixta:     { emoji: "🌿", color: "#14532d", bg: "#dcfce7", label: "Mixta" },
};

const SubscriptionCard = ({ box, onSubscribe }) => {
  const cfg = CATEGORIA_CONFIG[box.categoria] || { emoji: "🌱", color: "#14532d", bg: "#dcfce7", label: box.categoria };

  const handleSubscribe = () => {
    greenBiteEvents.emit("subscription:new", { boxId: box.id });
    onSubscribe(box);
  };

  const stockPct = Math.min((box.stock / 50) * 100, 100);
  const stockColor = box.stock > 30 ? "#16a34a" : box.stock > 10 ? "#d97706" : "#dc2626";

  return (
    <div style={{
      background: "white",
      border: "1.5px solid #d1fae5",
      borderRadius: 18,
      padding: "22px 20px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 0,
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 32px rgba(20,83,45,0.13)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(90deg, #16a34a, #4ade80)",
        borderRadius: "18px 18px 0 0"
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: cfg.bg, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 26
        }}>
          {cfg.emoji}
        </div>
        <span style={{
          background: cfg.bg, color: cfg.color,
          fontSize: 11, fontWeight: 700,
          padding: "4px 10px", borderRadius: 20,
          textTransform: "uppercase", letterSpacing: "0.5px"
        }}>
          {cfg.label}
        </span>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#14532d", margin: "0 0 6px", lineHeight: 1.3 }}>
        {box.nombre}
      </h3>
      <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.55, margin: "0 0 16px", flexGrow: 1 }}>
        {box.descripcion}
      </p>

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Stock disponible</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: stockColor }}>{box.stock} unidades</span>
        </div>
        <div style={{ height: 4, background: "#f1f5f9", borderRadius: 99 }}>
          <div style={{ height: 4, width: `${stockPct}%`, background: stockColor, borderRadius: 99, transition: "width 0.4s" }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#14532d" }}>
            ${box.precio?.toLocaleString("es-CL")}
          </span>
          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>/mes</span>
        </div>
        <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, background: "#f0fdf4", padding: "3px 8px", borderRadius: 8 }}>
          Envío gratis
        </span>
      </div>

      <button
        onClick={handleSubscribe}
        style={{
          background: "#14532d", color: "white",
          border: "none", borderRadius: 10,
          padding: "11px", fontSize: 13,
          fontWeight: 700, cursor: "pointer",
          letterSpacing: "0.3px",
          transition: "background 0.15s, transform 0.1s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#166534"}
        onMouseLeave={e => e.currentTarget.style.background = "#14532d"}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      >
        Suscribirse →
      </button>
    </div>
  );
};

export default SubscriptionCard;