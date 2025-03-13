
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { BrandProvider } from "@/components/brands/BrandContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Conversations from "./pages/Conversations";
import NetworkNavigator from "./pages/NetworkNavigator";
import MyLists from "./pages/MyLists";
import Brands from "./pages/Brands";
import BrandDetail from "./pages/BrandDetail";
import ListDetail from "./pages/ListDetail";
import NotFound from "./pages/NotFound";

// Create QueryClient outside the component
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <BrandProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/network-navigator" element={<NetworkNavigator />} />
              <Route path="/lists" element={<MyLists />} />
              <Route path="/lists/:id" element={<ListDetail />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/brands/:id" element={<BrandDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrandProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
