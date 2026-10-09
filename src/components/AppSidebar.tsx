
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileBarChart,
  Pill,
  LogOut
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

const navigation = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Medicines', url: '/medicines', icon: Package },
  { title: 'Sales', url: '/sales', icon: ShoppingCart },
  { title: 'Suppliers', url: '/suppliers', icon: Users },
  { title: 'Reports', url: '/reports', icon: FileBarChart },
];

export function AppSidebar() {
  const { logout, state } = useApp();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-primary">SmartPharm</h2>
            <p className="text-sm text-sidebar-foreground">Pharmacy System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-sidebar-accent text-sidebar-primary font-medium' 
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-sidebar-primary">
              {state.user?.username}
            </p>
            <p className="text-xs text-sidebar-foreground capitalize">
              {state.user?.role}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-sidebar-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}
