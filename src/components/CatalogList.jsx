import React, { useState, useEffect } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { CatalogFilter, FilterByPrice, FilterBySeason } from "../patterns/strategy";

const catalogFilter = new CatalogFilter(FilterByPrice);

const CatalogList = ({ onSubscribe }) => {
  const [allBoxes, setAllBoxes] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [filterType, setFilterType] = useState("price");
  const [filterValue, setFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/catalog")
      .then(res => res.json())
      .then(data => { setAllBoxes(data); setBoxes(data); setLoading(false); })
      .catch(() => { setError("No se pudo conectar con el servidor"); setLoading(false); });
  }, []);

  const handleFilter = () => {
    if (!filterValue) return setBoxes(allBoxes);
    if (filterType === "price") {
      catalogFilter.setStrategy(FilterByPrice);
      setBoxes(catalogFilter.apply(allBoxes, Number(filterValue)));
    } else {
      catalogFilter.setStrategy(FilterBySeason);
      setBoxes(catalogFilter.apply(allBoxes, filterValue));
    }
  };

  const handleLimpiar = () => { setFilterValue(""); setBoxes(allBoxes); };

  if (loading) return (
    <div style={{ padding: "48px 0", textAlign: "center", color: "#4b7a5e" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
      <p style={{ fontSize: 14 }}>Cargando catálogo...</p>
    </div>
  );
  if (error) return <p style={{ padding: 32, color: "#ef4444", fontSize: 14 }}>⚠ {error}</p>;

  return (
    <div>
      <div style={{
        display: "flex", gap: 10, marginBottom: 28,
        flexWrap: "wrap", alignItems: "center",
        background: "white", padding: "14px 18px",
        borderRadius: 14, border: "1.5px solid #d1fae5",
        boxShadow: "0 2px 8px rgba(20,83,45,0.05)"
      }}>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={{
            padding: "9px 14px", borderRadius: 9,
            border: "1.5px solid #d1fae5", fontSize: 13,
            color: "#14532d", fontWeight: 600,
            background: "#f0fdf4", cursor: "pointer", outline: "none"
          }}
        >
          <option value="price">Precio máximo</option>
          <option value="season">Categoría</option>
        </select>
        <input
          value={filterValue}
          placeholder={filterType === "price" ? "Ej: 15000" : "Ej: vegana"}
          onChange={e => setFilterValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleFilter()}
          style={{
            padding: "9px 14px", borderRadius: 9,
            border: "1.5px solid #d1fae5", fontSize: 13,
            flex: 1, minWidth: 140, outline: "none",
            color: "#14532d",
          }}
        />
        <button onClick={handleFilter} style={{
          background: "#14532d", color: "white",
          border: "none", borderRadius: 9,
          padding: "9px 20px", fontSize: 13,
          fontWeight: 700, cursor: "pointer",
          transition: "background 0.15s"
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#166534"}
        onMouseLeave={e => e.currentTarget.style.background = "#14532d"}
        >
          Filtrar
        </button>
        <button onClick={handleLimpiar} style={{
          background: "white", color: "#64748b",
          border: "1.5px solid #e2e8f0", borderRadius: 9,
          padding: "9px 16px", fontSize: 13,
          cursor: "pointer", transition: "border-color 0.15s"
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#cbd5e1"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
        >
          Limpiar
        </button>
        <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: "auto" }}>
          {boxes.length} producto{boxes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {boxes.length === 0
        ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
            <p style={{ fontSize: 14 }}>No hay productos con ese filtro.</p>
          </div>
        )
        : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 18
          }}>
            {boxes.map(box => (
              <SubscriptionCard key={box.id} box={box} onSubscribe={onSubscribe} />
            ))}
          </div>
        )
      }
    </div>
  );
};

export default CatalogList;