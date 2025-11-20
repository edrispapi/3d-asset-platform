import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
// --- Custom Sidebar Implementation specific to AetherLens ---
function DashboardSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <Sidebar className="border-r border-zinc-800 bg-zinc-950">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 font-bold text-xl text-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span>AetherLens</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6">
        <SidebarMenu>
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">
            Platform
          </div>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive('/dashboard')}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[active=true]:bg-blue-600/10 data-[active=true]:text-blue-400"
            >
              <Link to="/dashboard">
                <LayoutDashboard className="w-5 h-5" />
                <span>Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={isActive('/dashboard/models')}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[active=true]:bg-blue-600/10 data-[active=true]:text-blue-400"
            >
              <Link to="/dashboard/models">
                <Box className="w-5 h-5" />
                <span>3D Assets</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-8">
           <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">
            Configuration
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              >
                <Link to="/dashboard/settings">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <Avatar className="h-9 w-9 border border-zinc-700">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">Admin User</p>
            <p className="text-xs text-zinc-500 truncate">admin@aetherlens.io</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-zinc-950 text-zinc-50 w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-zinc-950 overflow-hidden">
          {/* Mobile Header / Top Bar */}
          <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-zinc-400 hover:text-zinc-100" />
              <div className="hidden md:flex items-center text-sm text-zinc-500">
                <span className="hover:text-zinc-300 cursor-pointer transition-colors">Dashboard</span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-zinc-100 font-medium">Overview</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle className="relative top-0 right-0" />
              <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border-none">
                Upgrade Plan
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
export default DashboardLayout;