
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { BrandProvider } from "@/components/brands/BrandContext";
import { ThemeProvider } from "next-themes";
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import EnvChecker from '@/components/debug/EnvChecker';
import Index from "./pages/Index";
import Conversations from "./pages/Conversations";
import NetworkNavigator from "./pages/NetworkNavigator";
import MyLists from "./pages/MyLists";
import MyCampaigns from "./pages/MyCampaigns";
import Brands from "./pages/Brands";
import BrandDetail from "./pages/BrandDetail";
import ListDetail from "./pages/ListDetail";
import NotFound from "./pages/NotFound";
import CampaignDetail from "./pages/CampaignDetail";
import AddBrand from './pages/AddBrand';
import AskLassie from "./pages/AskLassie";
import Publishers from "./pages/Publishers";
import PublisherEditPage from "./pages/PublisherEdit";

// Create QueryClient outside the component
const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const supabase = createClient();

    const checkAndSignIn = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No active session found, signing in anonymously...");
          const { data: anonSessionData, error: signInError } = await supabase.auth.signInAnonymously();
          if (signInError) {
            console.error("Error signing in anonymously:", signInError);
          } else if (anonSessionData?.user) {
            console.log("Signed in anonymously:", anonSessionData.user.id);
          }
        } else {
           console.log("Active session found:", session.user.id, `Anonymous: ${session.user.is_anonymous}`);
        }
      } catch (error) {
         console.error("Error checking/signing in session:", error);
      }
    };
    checkAndSignIn();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <BrandProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <EnvChecker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/network-navigator" element={<NetworkNavigator />} />
              <Route path="/ask-lassie" element={<AskLassie />} />
              <Route path="/lists" element={<MyLists />} />
              <Route path="/lists/:id" element={<ListDetail />} />
              <Route path="/campaigns" element={<MyCampaigns />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/brands/:id" element={<BrandDetail />} />
              <Route path="/add-brand" element={<AddBrand />} />
              <Route path="/publishers" element={<Publishers />} />
              <Route path="/publishers/:id" element={<PublisherEditPage />} />
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
