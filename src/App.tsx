import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { PlatformProvider } from "@/context/PlatformContext";
import Dashboard from "@/pages/Dashboard";
import LogReturn from "@/pages/LogReturn";
import MedicationReviews from "@/pages/MedicationReviews";
import PatientDetail from "@/pages/PatientDetail";
import Patients from "@/pages/Patients";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PlatformProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/returns/new" element={<LogReturn />} />
              <Route path="/reviews" element={<MedicationReviews />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PlatformProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
