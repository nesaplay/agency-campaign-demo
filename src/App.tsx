
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
    // EXTENSIVE ENV DEBUG LOGGING
    console.log("=== APP.TSX ENVIRONMENT DEBUG START ===");
    console.log("Current URL:", window.location.href);
    console.log("NODE_ENV:", import.meta.env.NODE_ENV);
    console.log("MODE:", import.meta.env.MODE);
    console.log("BASE_URL:", import.meta.env.BASE_URL);
    console.log("DEV:", import.meta.env.DEV);
    console.log("PROD:", import.meta.env.PROD);
    console.log("SSR:", import.meta.env.SSR);
    
    // Check specific env vars
    console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
    console.log("Type of VITE_SUPABASE_URL:", typeof import.meta.env.VITE_SUPABASE_URL);
    console.log("Type of VITE_SUPABASE_ANON_KEY:", typeof import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // List ALL environment variables
    console.log("ALL ENV VARS:", import.meta.env);
    console.log("ALL ENV KEYS:", Object.keys(import.meta.env));
    console.log("VITE_ prefixed vars:", Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
    
    // Check if we're in browser environment
    console.log("Is browser:", typeof window !== 'undefined');
    console.log("Document ready state:", document.readyState);
    console.log("Timestamp:", new Date().toISOString());
    console.log("=== APP.TSX ENVIRONMENT DEBUG END ===");

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
