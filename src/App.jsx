import { createContext, useContext, useReducer } from "react";
import { PRODUCTS, CATEGORIES } from "./products";
import { useState } from "react";
import "./styles.css";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exists = state.find((i) => i.id === action.item.id);
      return exists
        ? state.map((i) => (i.id === exists.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state, { ...action.item, qty: 1 }];
    }
    case "DEC":
      return state.map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0);
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

// ---- Context ----
const CartContext = createContext();
function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  return <CartContext.Provider value={{ cart, dispatch }}>{children}</CartContext.Provider>;
}
const useCart = () => useContext(CartContext); // custom hook

// ---- Components ----
function Navbar() {
  const { cart } = useCart();
  return <div className="nav"><h2>⚡ TechMart</h2><span>🛒 {cart.reduce((s, i) => s + i.qty, 0)}</span></div>;
}

function ProductCard({ product }) {
  const { dispatch } = useCart();
  return (
    <div className="card">
      <div className="emoji">{product.emoji}</div>
      <h3>{product.name}</h3>
      <p className="price">₹{product.price.toLocaleString("en-IN")}</p>
      <button className="primary" onClick={() => dispatch({ type: "ADD", item: product })}>Add to cart</button>
    </div>
  );
}

function Cart() {
  const { cart, dispatch } = useCart();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 && <p>Cart is empty</p>}
      {cart.map((i) => (
        <div className="row" key={i.id}>
          <span>{i.emoji} {i.name}</span>
          <div className="qty">
            <button onClick={() => dispatch({ type: "DEC", id: i.id })}>−</button>
            {i.qty}
            <button onClick={() => dispatch({ type: "ADD", item: i })}>+</button>
            <button onClick={() => dispatch({ type: "REMOVE", id: i.id })}>✕</button>
          </div>
        </div>
      ))}
      <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>
      {cart.length > 0 && <button className="primary" onClick={() => dispatch({ type: "CLEAR" })}>Checkout</button>}
    </div>
  );
}

export default function App() {
  const [category, setCategory] = useState("All");
  const visible = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
  return (
    <CartProvider>
      <Navbar />
      <div className="container">
        <div className="toolbar">
          {CATEGORIES.map((c) => (
            <button key={c} className={c === category ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="grid">{visible.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        <Cart />
      </div>
    </CartProvider>
  );
}