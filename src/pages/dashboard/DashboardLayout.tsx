import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Settings,
  LogOut,
  ChevronRight,
  Users,
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
import { useAppStore } from '@/lib/store';
function DashboardSidebar() {
  const location = useLocation();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname.startsWith(path);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <Sidebar className="border-r border-zinc-800 bg-zinc-950">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-zinc-800">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl text-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span>AetherLens</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/dashboard/models')} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[active=true]:bg-blue-600/10 data-[active=true]:text-blue-400">
              <Link to="/dashboard/models"><Box className="w-5 h-5" /><span>3D Assets</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/dashboard/users')} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[active=true]:bg-blue-600/10 data-[active=true]:text-blue-400">
              <Link to="/dashboard/users"><Users className="w-5 h-5" /><span>Users</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/dashboard/settings')} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 data-[active=true]:bg-blue-600/10 data-[active=true]:text-blue-400">
              <Link to="/dashboard/settings"><Settings className="w-5 h-5" /><span>Settings</span></Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <Avatar className="h-9 w-9 border border-zinc-700">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email || 'admin@aetherlens.io'}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-950 text-zinc-50 w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-zinc-950 overflow-hidden">
          <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-zinc-400 hover:text-zinc-100" />
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle className="relative top-0 right-0" />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
export default DashboardLayout;