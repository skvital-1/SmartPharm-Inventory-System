
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { LoginForm } from "@/components/LoginForm";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { MedicineManagement } from "@/components/MedicineManagement";
import { SalesManagement } from "@/components/SalesManagement";
import { SupplierManagement } from "@/components/SupplierManagement";
import { Reports } from "@/components/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { state } = useApp();

  if (!state.user) {
    return <LoginForm />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 bg-background">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medicines" element={<MedicineManagement />} />
            <Route path="/sales" element={<SalesManagement />} />
            <Route path="/suppliers" element={<SupplierManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
