import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Box, Layers, Smartphone, Zap } from 'lucide-react';
import { ModelViewerWrapper } from '@/components/ui/model-viewer-wrapper';
import { DEFAULT_VIEWER_CONFIG } from '@shared/types';
import { useAppStore } from '@/lib/store';
export function HomePage() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const GetStartedButton = (
    <Link to={isAuthenticated ? "/dashboard" : "/login"}>
      <Button size="lg" className="h-12 px-8 bg-white text-zinc-950 hover:bg-zinc-200 text-base font-semibold rounded-full w-full sm:w-auto">
        {isAuthenticated ? 'Go to Dashboard' : 'Start for free'}
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </Link>
  );
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30">
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              AetherLens
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/5">
                {isAuthenticated ? 'Dashboard' : 'Sign In'}
              </Button>
            </Link>
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/20 border-none px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-32">
            <section className="relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 z-10">
                  <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight">
                    Bring your products to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Life</span>
                  </h1>
                  <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-lg">
                    The fastest way to manage, visualize, and embed 3D assets. Transform your e-commerce experience with immersive WebAR technology.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {GetStartedButton}
                  </div>
                </div>
                <div className="relative h-[500px] w-full bg-zinc-900/30 rounded-2xl border border-zinc-800/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50 lg:order-last order-first">
                  <ModelViewerWrapper
                    src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                    poster="https://modelviewer.dev/shared-assets/models/Astronaut.webp"
                    config={DEFAULT_VIEWER_CONFIG}
                    autoPlay={true}
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="bg-zinc-900/30 border-y border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-24">
              <section id="features">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for the Spatial Web</h2>
                  <p className="text-zinc-400 max-w-2xl mx-auto">
                    Everything you need to deploy high-fidelity 3D models to any website or application.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"><Layers className="w-6 h-6 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-zinc-100">Asset Management</h3>
                    <p className="text-zinc-400">Organize your GLB/GLTF files in a centralized, secure dashboard.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"><Smartphone className="w-6 h-6 text-indigo-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-zinc-100">Instant AR</h3>
                    <p className="text-zinc-400">Automatically generate AR-ready viewers for customers to place products in their space.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"><Zap className="w-6 h-6 text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-zinc-100">Global Edge Delivery</h3>
                    <p className="text-zinc-400">Powered by Cloudflare's global network for instant load times anywhere.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-12 bg-zinc-950 border-t border-zinc-900 text-center text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>Built with ❤️ at Cloudflare</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} AetherLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}