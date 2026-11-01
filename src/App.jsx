import { createContext, useContext, useReducer, useRef, useCallback, useEffect, useMemo, useState, memo } from "react";
import { PRODUCTS, CATEGORIES } from "./products";
import "./styles.css";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const ex = state.find((i) => i.id === action.item.id);
      return ex ? state.map((i) => (i.id === ex.id ? { ...i, qty: i.qty + 1 } : i)) : [...state, { ...action.item, qty: 1 }];
    }
    case "DEC": return state.map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i)).filter((i) => i.qty > 0);
    case "REMOVE": return state.filter((i) => i.id !== action.id);
    case "CLEAR": return [];
    default: return state;
  }
}

// ---- Middleware----
const logger = (getState) => (next) => (action) => {
  console.group(`%c${action.type}`, "color:#4f46e5");
  console.log("prev state:", getState());
  next(action);
  console.log("action:", action);
  console.groupEnd();
};

const limitPerItem = (getState) => (next) => (action) => {
  if (action.type === "ADD") {
    const ex = getState().find((i) => i.id === action.item.id);
    if (ex && ex.qty >= 5) { alert("Max 5 units per item!"); return; } // block the action
  }
  next(action);
};

// ---- useReducer + middleware chain ----
function useReducerWithMiddleware(reducer, initial, init, middlewares) {
  const [state, rawDispatch] = useReducer(reducer, initial, init);
  const stateRef = useRef(state);
  stateRef.current = state;
  const dispatch = useCallback((action) => {
    const getState = () => stateRef.current;
    const chain = middlewares.reduceRight((next, mw) => mw(getState)(next), rawDispatch);
    chain(action);
  }, [middlewares]);
  return [state, dispatch];
}

// ---- Context ----
const CartContext = createContext();
const middlewares = [logger, limitPerItem]; // defined outside = stable reference
const loadCart = () => { try { return JSON.parse(localStorage.getItem("cart")) || []; } catch { return []; } };

function CartProvider({ children }) {
  const [cart, dispatch] = useReducerWithMiddleware(cartReducer, [], loadCart, middlewares);
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]); // persist
  const value = useMemo(() => ({ cart, dispatch }), [cart, dispatch]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
const useCart = () => useContext(CartContext);


function Navbar() {
  const { cart } = useCart();
  const count = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  return <div className="nav"><h2>⚡ TechMart</h2><span>🛒 {count}</span></div>;
}

const ProductCard = memo(function ProductCard({ product, onAdd }) {
  console.log("render card:", product.name);
  return (
    <div className="card">
      <div className="emoji">{product.emoji}</div>
      <h3>{product.name}</h3>
      <p className="price">₹{product.price.toLocaleString("en-IN")}</p>
      <button className="primary" onClick={() => onAdd(product)}>Add to cart</button>
    </div>
  );
});

function Cart() {
  const { cart, dispatch } = useCart();
  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
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

function Shop() {
  const { dispatch } = useCart();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("none");

  const handleAdd = useCallback((item) => dispatch({ type: "ADD", item }), [dispatch]);

  const visible = useMemo(() => {
    const list = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, sort]);

  return (
    <>
      <div className="toolbar">
        {CATEGORIES.map((c) => (
          <button key={c} className={c === category ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="none">Sort by</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>
      <div className="grid">{visible.map((p) => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)}</div>
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <div className="container"><Shop /><Cart /></div>
    </CartProvider>
  );
}