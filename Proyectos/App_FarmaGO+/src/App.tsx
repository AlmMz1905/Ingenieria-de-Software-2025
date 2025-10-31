import { useState } from "react";
import { TopNavigation } from "./components/TopNavigation";
import { SideNavigation } from "./components/SideNavigation";
import { DashboardScreen } from "./components/DashboardScreen";
import { DeliveryDashboard } from "./components/DeliveryDashboard";
import { PharmacyDashboard } from "./components/PharmacyDashboard";
import { SalesScreen } from "./components/SalesScreen";
import { RecipesScreen } from "./components/RecipesScreen";
import { UploadRecipeScreen } from "./components/UploadRecipeScreen";
import { MapScreenCustomer } from "./components/MapScreenCustomer";
import { MapScreenPharmacy } from "./components/MapScreenPharmacy";
import { MapScreenDelivery } from "./components/MapScreenDelivery";
import { ChatScreenCustomer } from "./components/ChatScreenCustomer";
import { ChatScreenPharmacy } from "./components/ChatScreenPharmacy";
import { ChatScreenDelivery } from "./components/ChatScreenDelivery";
import { DeliveryOrdersScreen } from "./components/DeliveryOrdersScreen";
import { RatingsScreen } from "./components/RatingsScreen";
import { UploadedRecipesScreen } from "./components/UploadedRecipesScreen";
import { PharmacyRatingsScreen } from "./components/PharmacyRatingsScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { UsersScreen } from "./components/UsersScreen";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";

type AuthView = "login" | "register" | "app";
type UserType = "cliente" | "repartidor" | "empleado" | "";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>("");

  const handleLogin = (accountType: string) => {
    setIsAuthenticated(true);
    setAuthView("app");
    setUserType(accountType as UserType);
  };

  const handleRegister = (accountType: string) => {
    setIsAuthenticated(true);
    setAuthView("app");
    setUserType(accountType as UserType);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView("login");
    setActiveSection("home");
    setUserType("");
  };

  const renderContent = () => {
    // Contenido específico para repartidores
    if (userType === "repartidor") {
      switch (activeSection) {
        case "home":
          return <DeliveryDashboard onNavigate={setActiveSection} />;
        case "delivery-orders":
          return <DeliveryOrdersScreen />;
        case "inventory":
          return <MapScreenDelivery />;
        case "delivery-chat":
          return <ChatScreenDelivery />;
        case "ratings":
          return <RatingsScreen />;
        case "users":
          return <UsersScreen />;
        case "settings":
          return <SettingsScreen />;
        default:
          return <DeliveryDashboard onNavigate={setActiveSection} />;
      }
    }

    // Contenido específico para empleados de farmacia
    if (userType === "empleado") {
      switch (activeSection) {
        case "home":
          return <PharmacyDashboard onNavigate={setActiveSection} />;
        case "uploaded-recipes":
          return <UploadedRecipesScreen />;
        case "pharmacy-chat":
          return <ChatScreenPharmacy />;
        case "pharmacy-ratings":
          return <PharmacyRatingsScreen />;
        case "users":
          return <UsersScreen />;
        case "settings":
          return <SettingsScreen />;
        default:
          return <PharmacyDashboard onNavigate={setActiveSection} />;
      }
    }

    // Contenido para clientes
    switch (activeSection) {
      case "home":
        return <DashboardScreen onNavigate={setActiveSection} />;
      case "sales":
        return <SalesScreen />;
      case "products":
        return <RecipesScreen />;
      case "upload-recipe":
        return <UploadRecipeScreen />;
      case "pharmacy-chat":
        return <ChatScreenCustomer />;
      case "inventory":
        return <MapScreenCustomer />;
      case "reports":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>
            <p className="text-gray-600">Reports and analytics features coming soon...</p>
          </div>
        );
      case "users":
        return <UsersScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <SalesScreen />;
    }
  };

  // Show authentication screens if not authenticated
  if (!isAuthenticated) {
    if (authView === "register") {
      return (
        <RegisterScreen
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView("login")}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView("register")}
      />
    );
  }

  // Show main app when authenticated
  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      <TopNavigation onLogout={handleLogout} onNavigate={setActiveSection} />
      
      <div className="flex flex-1 overflow-hidden">
        <SideNavigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          userType={userType}
        />
        
        <main className="flex-1 overflow-auto bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}