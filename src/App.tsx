import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index.tsx";
import Patients from "./pages/Patients.tsx";
import PatientDetail from "./pages/PatientDetail.tsx";
import Alerts from "./pages/Alerts.tsx";
import Returns from "./pages/Returns.tsx";
import PatientApp from "./pages/PatientApp.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const withLayout = (node: React.ReactNode) => <AppLayout>{node}</AppLayout>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/patients" element={withLayout(<Patients />)} />
          <Route path="/patients/:id" element={withLayout(<PatientDetail />)} />
          <Route path="/alerts" element={withLayout(<Alerts />)} />
          <Route path="/returns" element={withLayout(<Returns />)} />
          <Route path="/patient-app" element={withLayout(<PatientApp />)} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
