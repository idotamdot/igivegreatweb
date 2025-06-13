import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminGalleryManagement from "@/pages/admin-gallery-management";
import ClientDashboard from "@/pages/client-dashboard";
import PSIIndex from "@/pages/psi-index";
import BusinessApplication from "@/pages/business-application";
import ProjectDetails from "@/pages/project-details";
import MessageDetails from "@/pages/message-details";
import ContentPage from "@/pages/content-page";
import ServicesPage from "@/pages/services-page";
import Checkout from "@/pages/checkout";
import GalleryPage from "@/pages/gallery-page";
import ArtworkDetail from "@/pages/artwork-detail";
import CheckoutOrder from "@/pages/checkout-order";
import CryptoCheckout from "@/pages/crypto-checkout";
import OrdersPage from "@/pages/orders-page";
import InvoicingDashboard from "@/pages/invoicing-dashboard";
import NotFound from "@/pages/not-found";
import NeuralCommandCenter from "@/pages/neural-command-center";
import Login from "@/pages/Login";
import QuantumWorkspace from "@/pages/QuantumWorkspace";
import AIProjectGenerator from "@/pages/AIProjectGenerator";
import NeuralAnalytics from "@/pages/NeuralAnalytics";
import DeploymentPipeline from "@/pages/DeploymentPipeline";
import { AuthProvider } from "@/hooks/use-auth";
// Temporarily commenting out protected route for development
// import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "@/components/theme-provider";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import { useOnboarding } from "@/hooks/useOnboarding";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={Login} />
      <Route path="/quantum-workspace" component={QuantumWorkspace} />
      <Route path="/ai-generator" component={AIProjectGenerator} />
      <Route path="/neural-analytics" component={NeuralAnalytics} />
      <Route path="/auth" component={AuthPage} />
      {/* Temporarily bypassing authentication for development */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/client" component={ClientDashboard} />
      <Route path="/index" component={PSIIndex} />
      <Route path="/apply" component={BusinessApplication} />
      <Route path="/project/:id" component={ProjectDetails} />
      <Route path="/message/:id" component={MessageDetails} />
      {/* Services and checkout routes */}
      <Route path="/services" component={ServicesPage} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/crypto-checkout" component={CryptoCheckout} />
      {/* Gallery and artwork routes */}
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/artwork/:id" component={ArtworkDetail} />
      <Route path="/checkout/:id" component={CheckoutOrder} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/invoicing" component={InvoicingDashboard} />
      <Route path="/neural" component={NeuralCommandCenter} />
      <Route path="/neural-command-center" component={NeuralCommandCenter} />
      <Route path="/quantum-services" component={ServicesPage} />
      
      {/* Admin gallery management routes */}
      <Route path="/admin-gallery-management" component={AdminGalleryManagement} />
      <Route path="/admin/gallery/artworks" component={GalleryPage} />
      <Route path="/admin/gallery/sizes" component={GalleryPage} />
      <Route path="/admin/gallery/orders" component={OrdersPage} />
      
      {/* Admin services management routes */}
      <Route path="/admin/services/list" component={ServicesPage} />
      <Route path="/admin/services/pricing" component={ServicesPage} />
      {/* Route for content pages created from menu links */}
      <Route path="/page/:slug" component={ContentPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { shouldShowOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <Router />
          <Toaster />
          {shouldShowOnboarding() && (
            <OnboardingTutorial 
              onComplete={completeOnboarding}
              onSkip={skipOnboarding}
            />
          )}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
