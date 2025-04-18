import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminGalleryManagement from "@/pages/admin-gallery-management";
import ClientDashboard from "@/pages/client-dashboard";
import ProjectDetails from "@/pages/project-details";
import MessageDetails from "@/pages/message-details";
import ContentPage from "@/pages/content-page";
import ServicesPage from "@/pages/services-page";
import Checkout from "@/pages/checkout";
import GalleryPage from "@/pages/gallery-page";
import ArtworkDetail from "@/pages/artwork-detail";
import CheckoutOrder from "@/pages/checkout-order";
import OrdersPage from "@/pages/orders-page";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
// Temporarily commenting out protected route for development
// import { ProtectedRoute } from "@/lib/protected-route";
import { ThemeProvider } from "@/components/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      {/* Temporarily bypassing authentication for development */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/client" component={ClientDashboard} />
      <Route path="/project/:id" component={ProjectDetails} />
      <Route path="/message/:id" component={MessageDetails} />
      {/* Services and checkout routes */}
      <Route path="/services" component={ServicesPage} />
      <Route path="/checkout" component={Checkout} />
      {/* Gallery and artwork routes */}
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/artwork/:id" component={ArtworkDetail} />
      <Route path="/checkout/:id" component={CheckoutOrder} />
      <Route path="/orders" component={OrdersPage} />
      
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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
