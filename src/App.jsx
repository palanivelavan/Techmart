// DAY 1: Components, Props & useState
import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "./products";
import "./styles.css";

function ProductCard({ product, onAdd }) {
  return (
    <div className="card">
      <div className="emoji">{product.emoji}</div>
      <h3>{product.name}</h3>
      <p className="price">₹{product.price.toLocaleString("en-IN")}</p>
      <button className="primary" onClick={() => onAdd(product)}>Add to cart</button>
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);

  const visible = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  return (
    <>
      <div className="nav"><h2> TechMart </h2><span>🛒 {cartCount}</span></div>
      <div className="container">
        <div className="toolbar">
          {CATEGORIES.map((c) => (
            <button key={c} className={c === category ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={() => setCartCount((n) => n + 1)} />
          ))}
        </div>
      </div>
    </>
  );
}