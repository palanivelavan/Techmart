// DAY 2: useEffect & Custom Hooks (async loading + debounced search)
import { useState, useEffect } from "react";
import { PRODUCTS, CATEGORIES } from "./products";
import "./styles.css";

// Custom hook: delays updating a value until the user stops typing
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t); // cleanup
  }, [value, delay]);
  return debounced;
}

// Fake API call
const fetchProducts = () => new Promise((res) => setTimeout(() => res(PRODUCTS), 800));

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchProducts().then((data) => { setProducts(data); setLoading(false); });
  }, []); // runs once on mount

  useEffect(() => {
    document.title = `TechMart (${cartCount})`;
  }, [cartCount]);

  const visible = products
    .filter((p) => category === "All" || p.category === category)
    .filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));

  return (
    <>
      <div className="nav"><h2>⚡ TechMart</h2><span>🛒 {cartCount}</span></div>
      <div className="container">
        <div className="toolbar">
          <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {CATEGORIES.map((c) => (
            <button key={c} className={c === category ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        {loading ? <p>Loading products...</p> : visible.length === 0 ? <p>No products found 😕</p> : (
          <div className="grid">
            {visible.map((p) => <ProductCard key={p.id} product={p} onAdd={() => setCartCount((n) => n + 1)} />)}
          </div>
        )}
      </div>
    </>
  );
}