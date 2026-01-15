
import React from 'react';
import { Sparkles, ArrowRight, Zap, Palette, Download, TrendingUp } from 'lucide-react';
import { TRENDING_COLLECTIONS } from '../constants';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center p-4 justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">InviteAI</h2>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Features</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Templates</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:block text-sm font-bold">Log In</button>
            <button 
              onClick={onStart}
              className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all active:scale-95"
            >
              Start Creating
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <section className="py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 order-2 md:order-1 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                ✨ New: AI Canvas V2
              </span>
              <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Create Magic Invitations <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">with AI</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-lg">
                Transform your abstract ideas into stunning, personalized invitation designs for any event in mere seconds. No design skills required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStart}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all active:scale-95"
              >
                Generate Now <ArrowRight size={20} />
              </button>
              <button className="glass-effect hover:bg-white/5 text-white font-bold py-4 px-8 rounded-xl transition-all">
                View Showcase
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div 
                className="relative w-full aspect-video md:aspect-[4/3] bg-center bg-cover rounded-2xl border border-white/10 shadow-2xl"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607192233397-3031bbcd3551?auto=format&fit=crop&q=80&w=1200')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/60 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose InviteAI?</h2>
            <p className="text-slate-400">Our advanced neural networks are trained specifically for high-end event typography and visual composition.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="text-blue-500" />}
              title="Instant Generation"
              description="Describe your vibe, and let our AI create unique drafts in under 10 seconds."
            />
            <FeatureCard 
              icon={<Palette className="text-purple-500" />}
              title="Unique Art Styles"
              description="From minimalist modernism to ethereal dreamscapes, no two designs are ever alike."
            />
            <FeatureCard 
              icon={<Download className="text-pink-500" />}
              title="Print-Ready Quality"
              description="Export in lossless 4K resolution with CMYK support for professional printing."
            />
          </div>
        </section>

        {/* Collections */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary text-sm font-bold tracking-widest uppercase">Popular</p>
              <h2 className="text-2xl font-extrabold tracking-tight">Trending Collections</h2>
            </div>
            <button className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
              Explore All <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
            {TRENDING_COLLECTIONS.map((item) => (
              <div key={item.id} className="min-w-[300px] flex-shrink-0 group cursor-pointer snap-start">
                <div 
                  className="aspect-[3/4] rounded-2xl bg-cover bg-center overflow-hidden relative border border-white/10 group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-bold">{item.title}</p>
                  <p className="text-slate-500 text-sm">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="text-3xl md:text-5xl font-black text-white">Ready to create your first magic invite?</h2>
              <p className="text-white/80 max-w-lg text-lg">Join over 10,000 users who are saving hours of design work with our AI-powered platform.</p>
              <button 
                onClick={onStart}
                className="bg-white text-primary hover:bg-slate-100 font-extrabold py-4 px-10 rounded-xl transition-all active:scale-95 shadow-xl"
              >
                Start Designing for Free
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            <span className="font-bold text-lg">InviteAI</span>
          </div>
          <p className="text-sm text-slate-500">© 2024 InviteAI Technologies. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="p-8 rounded-2xl glass-effect border-white/5 hover:border-primary/30 transition-colors group">
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
