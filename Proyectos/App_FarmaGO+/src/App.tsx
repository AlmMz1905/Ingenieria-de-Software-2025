import { useState } from "react";
import { TopNavigation } from "./components/TopNavigation";
import { SideNavigation } from "./components/SideNavigation";
import { DashboardScreen } from "./components/DashboardScreen";
import { SalesScreen } from "./components/SalesScreen";
import { RecipesScreen } from "./components/RecipesScreen";
import { UploadRecipeScreen } from "./components/UploadRecipeScreen";
import { PharmacyChatScreen } from "./components/PharmacyChatScreen";
import { MapScreen } from "./components/MapScreen";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";

type AuthView = "login" | "register" | "app";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAuthView("app");
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
    setAuthView("app");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView("login");
    setActiveSection("home"); // Reset to default section
  };

  const renderContent = () => {
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
        return <PharmacyChatScreen />;
      case "inventory":
        return <MapScreen />;
      case "reports":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>
            <p className="text-gray-600">Reports and analytics features coming soon...</p>
          </div>
        );
      case "users":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-600">User management features coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-semibold mb-4">System Settings</h2>
            <p className="text-gray-600">System settings coming soon...</p>
          </div>
        );
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
      <TopNavigation onLogout={handleLogout} />
      
      <div className="flex flex-1 overflow-hidden">
        <SideNavigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 overflow-auto bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}