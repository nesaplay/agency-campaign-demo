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
import EnvFileChecker from '@/components/debug/EnvFileChecker';
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
    // IMMEDIATE ENV CHECK ON APP LOAD
    console.log("=== APP STARTUP ENV CHECK ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Window location:", window.location.href);
    console.log("Document ready state:", document.readyState);
    
    // Check import.meta.env immediately
    console.log("import.meta.env object exists:", !!import.meta.env);
    console.log("import.meta.env type:", typeof import.meta.env);
    console.log("import.meta.env keys count:", Object.keys(import.meta.env).length);
    console.log("All keys:", Object.keys(import.meta.env));
    
    // Check our specific variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log("VITE_SUPABASE_URL raw value:", supabaseUrl);
    console.log("VITE_SUPABASE_ANON_KEY raw value:", supabaseKey);
    console.log("VITE_SUPABASE_URL type:", typeof supabaseUrl);
    console.log("VITE_SUPABASE_ANON_KEY type:", typeof supabaseKey);
    console.log("VITE_SUPABASE_URL defined:", supabaseUrl !== undefined);
    console.log("VITE_SUPABASE_ANON_KEY defined:", supabaseKey !== undefined);
    
    // Check mode and other standard vars
    console.log("MODE:", import.meta.env.MODE);
    console.log("DEV:", import.meta.env.DEV);
    console.log("PROD:", import.meta.env.PROD);
    console.log("BASE_URL:", import.meta.env.BASE_URL);
    
    console.log("=== END APP STARTUP ENV CHECK ===");

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
            <EnvFileChecker />
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
