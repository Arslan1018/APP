import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-5 glass-dark">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <span className="font-display text-xl font-bold text-white">ARMenu</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-full transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-8 text-center">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/20 text-brand-400 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            AR-Powered Restaurant Menus
          </span>

          <h1 className="font-display text-6xl md:text-7xl font-bold leading-tight mb-6">
            See Your Food<br />
            <span className="text-brand-500">Before You Order</span>
          </h1>

          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
            Give your customers an immersive dining experience. Scan a QR code,
            see 3D food models float in real space, and order with one tap.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl text-lg transition-all hover:scale-105 shadow-xl shadow-brand-500/30"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 border border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl text-lg transition-all"
            >
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-400 text-center mb-16">Three steps to transform your menu</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '📸', title: 'Upload Your Menu', desc: 'Add your dishes, prices, and 3D food models to your restaurant dashboard.' },
              { step: '02', icon: '🔲', title: 'Generate QR Codes', desc: 'Each menu item gets a unique QR code. Print them on your physical menus.' },
              { step: '03', icon: '✨', title: 'Customers See AR', desc: 'Customers scan and watch their dish materialize in 3D on their table.' },
            ].map((item) => (
              <div key={item.step} className="relative p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/8 transition-all group">
                <span className="absolute top-6 right-6 text-6xl font-bold text-white/5 font-display">
                  {item.step}
                </span>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-8 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-center mb-16">Everything You Need</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🥽', title: 'WebXR AR Viewer', desc: 'Full AR experience in the browser — no app download needed. Works on iOS and Android.' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Track QR scans, popular items, order rates, and customer device data.' },
              { icon: '🛒', title: 'Direct Ordering', desc: 'Customers can add to cart and pay directly from the AR experience.' },
              { icon: '🎨', title: 'Custom Branding', desc: 'Match your restaurant\'s visual identity with custom colors, logos, and layouts.' },
              { icon: '🔒', title: 'Secure & Fast', desc: 'JWT auth, rate limiting, encrypted data. Lightning-fast CDN-served 3D models.' },
              { icon: '🌐', title: 'Multi-language', desc: 'Support for multiple languages to serve international customers.' },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-6 rounded-2xl border border-white/10">
                <span className="text-3xl flex-shrink-0">{f.icon}</span>
                <div>
                  <h4 className="font-semibold mb-1">{f.title}</h4>
                  <p className="text-gray-400 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-5xl font-bold mb-6">
            Ready to wow your customers?
          </h2>
          <p className="text-gray-400 mb-8">
            Join restaurants worldwide using AR menus to increase orders and delight guests.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-10 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl text-xl transition-all hover:scale-105 shadow-2xl shadow-brand-500/40"
          >
            Get Started — It's Free
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/10">
        © 2026 ARMenu. Built for the future of dining.
      </footer>
    </main>
  );
}
