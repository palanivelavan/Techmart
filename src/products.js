export const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", category: "Headphones", price: 2999, emoji: "🎧" },
  { id: 2, name: "Gaming Headset", category: "Headphones", price: 4499, emoji: "🎮" },
  { id: 3, name: "Neckband Earphones", category: "Headphones", price: 1299, emoji: "🎵" },
  { id: 4, name: "Smartphone 5G", category: "Mobiles", price: 18999, emoji: "📱" },
  { id: 5, name: "Flagship Phone Pro", category: "Mobiles", price: 64999, emoji: "📲" },
  { id: 6, name: "Smart Watch", category: "Wearables", price: 3999, emoji: "⌚" },
  { id: 7, name: "Bluetooth Speaker", category: "Speakers", price: 2199, emoji: "🔊" },
  { id: 8, name: "Power Bank 20000mAh", category: "Accessories", price: 1799, emoji: "🔋" },
];
export const CATEGORIES = ["All", ...new Set(PRODUCTS.map((p) => p.category))];