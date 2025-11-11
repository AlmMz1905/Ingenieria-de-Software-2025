import { useState } from "react";
import { TopNavigation } from "./components/TopNavigation";
import { SideNavigation } from "./components/SideNavigation";
import { DashboardScreen } from "./components/DashboardScreen";
import { PharmacyDashboard } from "./components/PharmacyDashboard";
import { SalesScreen } from "./components/SalesScreen";
import { RecipesScreen } from "./components/RecipesScreen";
import { UploadRecipeScreen } from "./components/UploadRecipeScreen";
import { MapScreenCustomer } from "./components/MapScreenCustomer";
import { MapScreenPharmacy } from "./components/MapScreenPharmacy";
import { ChatScreenCustomer } from "./components/ChatScreenCustomer";
import { ChatScreenPharmacy } from "./components/ChatScreenPharmacy";
import { CustomerReviewsScreen } from "./components/CustomerReviewsScreen";
import { UploadedRecipesScreen } from "./components/UploadedRecipesScreen";
import { PharmacyRatingsScreen } from "./components/PharmacyRatingsScreen";
import { CustomerSettingsScreen } from "./components/CustomerSettingsScreen";
import { PharmacySettingsScreen } from "./components/PharmacySettingsScreen";
import { StockManagementScreen } from "./components/StockManagementScreen";
import { UsersScreen } from "./components/UsersScreen";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { PasswordResetRequestScreen } from "./components/PasswordResetRequestScreen";
import { PasswordResetEmailSentScreen } from "./components/PasswordResetEmailSentScreen";
import { PasswordResetNewPasswordScreen } from "./components/PasswordResetNewPasswordScreen";

type AuthView = "login" | "register" | "forgot-password" | "reset-email-sent" | "reset-new-password" | "app";
type UserType = "cliente" | "empleado" | "";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>("");
  const [resetEmail, setResetEmail] = useState("");

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

  const handleForgotPassword = () => {
    setAuthView("forgot-password");
  };

  const handleSendResetLink = (email: string) => {
    setResetEmail(email);
    setAuthView("reset-email-sent");
  };

  const handlePasswordReset = (newPassword: string) => {
    alert("Contraseña restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.");
    setAuthView("login");
  };

  const handleBackToLogin = () => {
    setAuthView("login");
  };

  const renderContent = () => {
    // Contenido específico para empleados de farmacia
    if (userType === "empleado") {
      switch (activeSection) {
        case "home":
          return <PharmacyDashboard onNavigate={setActiveSection} />;
        case "uploaded-recipes":
          return <UploadedRecipesScreen />;
        case "stock-management":
          return <StockManagementScreen />;
        case "pharmacy-ratings":
          return <PharmacyRatingsScreen />;
        case "settings":
          return <PharmacySettingsScreen />;
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
      case "inventory":
        return <MapScreenCustomer />;
      case "reviews":
        return <CustomerReviewsScreen />;
      case "users":
        return <UsersScreen />;
      case "settings":
        return <CustomerSettingsScreen />;
      default:
        return <DashboardScreen onNavigate={setActiveSection} />;
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
    } else if (authView === "forgot-password") {
      return (
        <PasswordResetRequestScreen
          onSendResetLink={handleSendResetLink}
          onBackToLogin={handleBackToLogin}
        />
      );
    } else if (authView === "reset-email-sent") {
      return (
        <PasswordResetEmailSentScreen
          email={resetEmail}
          onBackToLogin={handleBackToLogin}
        />
      );
    } else if (authView === "reset-new-password") {
      return (
        <PasswordResetNewPasswordScreen
          onPasswordReset={handlePasswordReset}
          onBackToLogin={handleBackToLogin}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView("register")}
        onForgotPassword={handleForgotPassword}
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