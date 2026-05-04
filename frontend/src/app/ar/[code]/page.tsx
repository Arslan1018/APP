'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ARItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  arModel: {
    glbUrl: string;
    usdzUrl?: string;
    scale: number;
  } | null;
  menu: {
    restaurant: {
      name: string;
      logoUrl: string;
      currency: string;
      id: string;
    };
  };
}

// Extend JSX for model-viewer web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'camera-controls'?: boolean;
        autoplay?: boolean;
        'shadow-intensity'?: string;
        exposure?: string;
        poster?: string;
        loading?: string;
        reveal?: string;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

export default function ARViewerPage() {
  const params = useParams();
  const code = params.code as string;
  const [item, setItem] = useState<ARItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/${code}`);
        if (!res.ok) throw new Error('Item not found');
        const data = await res.json();
        setItem(data.data);

        // Track scan
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/${code}/scan`, { method: 'POST' });
      } catch (err) {
        setError('This QR code is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [code]);

  const handleAddToCart = () => {
    if (!item) return;
    // Get or create cart in localStorage
    const cart = JSON.parse(localStorage.getItem('ar_cart') || '[]');
    const existing = cart.find((i: { id: string }) => i.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
        imageUrl: item.imageUrl,
        restaurantId: item.menu.restaurant.id,
        currency: item.menu.restaurant.currency,
      });
    }
    localStorage.setItem('ar_cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading AR experience...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-6xl mb-4">😔</p>
          <h2 className="text-white text-2xl font-bold mb-2">QR Code Not Found</h2>
          <p className="text-white/40">{error}</p>
        </div>
      </div>
    );
  }

  const currency = item.menu.restaurant.currency;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <div className="fixed top-0 w-full z-50 flex items-center justify-between px-4 py-3 glass-dark">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">{item.menu.restaurant.name}</span>
        </div>
        <Link href={`/restaurant/${item.menu.restaurant.id}`} className="text-xs text-brand-500 font-medium">
          View Full Menu →
        </Link>
      </div>

      {/* AR MODEL VIEWER */}
      <div className="relative w-full h-[60vh] pt-14">
        {item.arModel ? (
          <model-viewer
            ref={modelViewerRef}
            src={item.arModel.glbUrl}
            ios-src={item.arModel.usdzUrl}
            alt={`3D model of ${item.name}`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            camera-controls
            autoplay
            shadow-intensity="1"
            exposure="0.8"
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          >
            {/* AR button slot */}
            <button
              slot="ar-button"
              className="absolute bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-brand-500 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/40 text-sm z-10"
            >
              <span>✨</span> View in Your Space
            </button>
          </model-viewer>
        ) : (
          // Fallback: show image if no 3D model
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)' }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-contain animate-float"
              />
            ) : (
              <div className="text-8xl animate-float">🍽️</div>
            )}
          </div>
        )}
      </div>

      {/* ITEM INFO CARD */}
      <div className="relative z-10 -mt-8 mx-4 rounded-3xl bg-[#111] border border-white/10 p-6 pb-safe">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="font-display text-2xl font-bold">{item.name}</h1>
            <p className="text-white/50 text-sm mt-1">{item.description}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-brand-500">
              {currency} {item.price.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              −
            </button>
            <span className="text-xl font-bold w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white hover:bg-brand-600 transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-white/40 text-sm">
            Total: {currency} {(item.price * quantity).toFixed(0)}
          </span>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            addedToCart
              ? 'bg-green-500 text-white scale-95'
              : 'bg-brand-500 hover:bg-brand-600 text-white hover:scale-[1.02] shadow-xl shadow-brand-500/30'
          }`}
        >
          {addedToCart ? '✓ Added to Cart!' : `Add to Cart — ${currency} ${(item.price * quantity).toFixed(0)}`}
        </button>

        {/* View cart link */}
        <Link
          href="/cart"
          className="block text-center mt-3 text-sm text-white/40 hover:text-white transition-colors"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
