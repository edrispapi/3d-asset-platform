import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Box, Layers, Smartphone, Zap } from 'lucide-react';
import { ModelViewerWrapper } from '@/components/ui/model-viewer-wrapper';
import { DEFAULT_VIEWER_CONFIG } from '@/lib/types';
export function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              AetherLens
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/5">
                Sign In
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/20 border-none px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-500/5 rounded-[100%] blur-[100px] -z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              New: AR QuickLook Support
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight">
              Bring your products to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Life</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-lg">
              The fastest way to manage, visualize, and embed 3D assets. 
              Transform your e-commerce experience with immersive WebAR technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="h-12 px-8 bg-white text-zinc-950 hover:bg-zinc-200 text-base font-semibold rounded-full w-full sm:w-auto">
                  Start for free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-full w-full sm:w-auto">
                View Demo
              </Button>
            </div>
            <div className="pt-8 border-t border-zinc-800/50 flex items-center gap-8 text-zinc-500 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               {/* Mock Logos */}
               <span className="font-bold text-lg">ACME Corp</span>
               <span className="font-bold text-lg">Vertex</span>
               <span className="font-bold text-lg">Polymesh</span>
            </div>
          </div>
          {/* Hero 3D Preview */}
          <div className="relative h-[500px] w-full bg-zinc-900/30 rounded-2xl border border-zinc-800/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50 lg:order-last order-first">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <div className="px-2 py-1 rounded bg-black/50 backdrop-blur text-xs font-mono text-zinc-400 border border-white/10">
                auto-rotate: true
              </div>
              <div className="px-2 py-1 rounded bg-black/50 backdrop-blur text-xs font-mono text-zinc-400 border border-white/10">
                ar: enabled
              </div>
            </div>
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
      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-900/30 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for the Spatial Web</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Everything you need to deploy high-fidelity 3D models to any website or application.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">Asset Management</h3>
              <p className="text-zinc-400 leading-relaxed">
                Organize your GLB and GLTF files in a centralized, secure dashboard. Tag, filter, and version control your assets.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <Smartphone className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">Instant AR</h3>
              <p className="text-zinc-400 leading-relaxed">
                Automatically generate AR-ready viewers. Let customers place products in their own space with a single tap.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-purple-500/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">Global Edge Delivery</h3>
              <p className="text-zinc-400 leading-relaxed">
                Powered by Cloudflare's global network. Low-latency delivery of assets ensures instant load times anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-12 bg-zinc-950 border-t border-zinc-900 text-center text-zinc-500 text-sm">
        <p>Built with ❤️ at Cloudflare</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} AetherLens. All rights reserved.</p>
      </footer>
    </div>
  );
}