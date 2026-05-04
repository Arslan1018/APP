'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  currency: string;
  restaurantId: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ar_cart') || '[]');
    setCart(stored);
  }, []);

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeItem(id);
    const updated = cart.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
    setCart(updated);
    localStorage.setItem('ar_cart', JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem('ar_cart', JSON.stringify(updated));
  };

  const currency = cart[0]?.currency || 'TWD';
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleOrder = async () => {
    if (!cart.length || !customerName) return;
    setPlacing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: cart[0].restaurantId,
          items: cart.map((i) => ({ itemId: i.id, quantity: i.quantity })),
          customerName,
          tableNumber,
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      localStorage.removeItem('ar_cart');
      setCart([]);
      setPlaced(true);
    } catch {
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Order Placed!</h1>
          <p className="text-white/50 mb-8">Your food is being prepared. Sit back and enjoy!</p>
          <Link href="/" className="px-8 py-3 bg-brand-500 text-white rounded-2xl font-semibold hover:bg-brand-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center gap-4 px-5 py-4 glass-dark border-b border-white/10">
        <button onClick={() => router.back()} className="text-white/60 hover:text-white">← Back</button>
        <h1 className="font-display text-xl font-bold">Your Cart</h1>
        <span className="ml-auto text-white/40 text-sm">{cart.length} items</span>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-4">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-white/50">Your cart is empty</p>
            <Link href="/" className="inline-block mt-4 text-brand-400 hover:text-brand-300">
              Browse Menu →
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    🍽️
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.name}</p>
                    <p className="text-white/40 text-sm">{currency} {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-sm hover:bg-white/10">−</button>
                    <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-sm hover:bg-brand-600">+</button>
                  </div>
                  <p className="text-sm font-bold text-brand-400 w-16 text-right">{currency} {(item.price * item.quantity).toFixed(0)}</p>
                </div>
              ))}
            </div>

            {/* Order details */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <h3 className="font-semibold">Order Details</h3>
              <input
                type="text"
                required
                placeholder="Your name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
              <input
                type="text"
                placeholder="Table number (optional)"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            {/* Summary */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-sm">
              <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{currency} {subtotal.toFixed(0)}</span></div>
              <div className="flex justify-between text-white/60"><span>Tax (5%)</span><span>{currency} {tax.toFixed(0)}</span></div>
              <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10 text-base">
                <span>Total</span><span className="text-brand-400">{currency} {total.toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={placing || !customerName}
              className="w-full py-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold rounded-2xl text-lg transition-all hover:scale-[1.02] shadow-xl shadow-brand-500/30"
            >
              {placing ? 'Placing Order...' : `Place Order — ${currency} ${total.toFixed(0)}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
