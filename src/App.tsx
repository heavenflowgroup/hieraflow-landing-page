import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuiSommesNous from "./pages/QuiSommesNous";
import Accessibilite from "./pages/Accessibilite";
import NotFound from "./pages/NotFound";
import Confidentialite from "./pages/Confidentialite";
import TrafficConsent from "./components/TrafficConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrafficConsent />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
          <Route path="/accessibilite" element={<Accessibilite />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/livre-blanc/:slug" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
