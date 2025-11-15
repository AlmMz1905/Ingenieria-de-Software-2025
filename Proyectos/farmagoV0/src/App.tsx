import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { TopNavigation } from "./components/TopNavigation";
import { SideNavigation } from "./components/SideNavigation";
import { DashboardScreen } from "./components/DashboardScreen";
import { PharmacyDashboard } from "./components/PharmacyDashboard";
import { SalesScreen } from "./components/SalesScreen";
import { RecipesScreen } from "./components/RecipesScreen";
import { UploadRecipeScreen } from "./components/UploadRecipeScreen";
import { ProductCatalogScreen } from "./components/ProductCatalogScreen";
import { CheckoutAddressScreen } from "./components/CheckoutAddressScreen";
import { CheckoutPaymentScreen } from "./components/CheckoutPaymentScreen";
import { OrderConfirmationScreen } from "./components/OrderConfirmationScreen";
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
import { VerifyAccountScreen } from "./components/VerifyAccountScreen";
import { AccountCreatedScreen } from "./components/AccountCreatedScreen";
import { PasswordResetRequestScreen } from "./components/PasswordResetRequestScreen";
import { PasswordResetEmailSentScreen } from "./components/PasswordResetEmailSentScreen";
import { PasswordResetNewPasswordScreen } from "./components/PasswordResetNewPasswordScreen";

type AuthView = "login" | "register" | "verify-account" | "account-created" | "forgot-password" | "reset-email-sent" | "reset-new-password" | "app";
type UserType = "cliente" | "empleado" | "";
type CheckoutStep = "address" | "payment" | "confirmation";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [settingsTab, setSettingsTab] = useState("profile");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>("");
  const [resetEmail, setResetEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  
  // Checkout flow state
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("address");
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [orderId, setOrderId] = useState("");
  const [orderTotal] = useState(2850.00); // Mock order total
  const [deliveryFee] = useState(350.00); // Mock delivery fee

  const handleLogin = (accountType: string) => {
    setIsAuthenticated(true);
    setAuthView("app");
    setUserType(accountType as UserType);
  };

  const handleRegister = (accountType: string, email: string) => {
    setRegisterEmail(email);
    setUserType(accountType as UserType);
    setAuthView("verify-account");
  };

  const handleVerifyAccount = (code: string) => {
    // Simulate verification
    console.log("Verification code:", code);
    setAuthView("account-created");
  };

  const handleResendCode = () => {
    alert("Código reenviado a " + registerEmail);
  };

  const handleGoToLogin = () => {
    setAuthView("login");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView("login");
    setActiveSection("home");
    setUserType("");
  };

  const handleNavigate = (section: string, tab?: string) => {
    setActiveSection(section);
    if (tab && section === "settings") {
      setSettingsTab(tab);
    }
  };

  const handleDeleteAccount = () => {
    handleLogout();
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

  // Checkout flow handlers
  const handleContinueToPayment = (addressId: number) => {
    setSelectedAddressId(addressId);
    setCheckoutStep("payment");
  };

  const handleBackToCart = () => {
    setActiveSection("sales");
    setCheckoutStep("address");
  };

  const handleBackToAddress = () => {
    setCheckoutStep("address");
  };

  const handleConfirmPayment = (paymentMethodId: number) => {
    // Generate order ID
    const newOrderId = "#P-" + Math.floor(1000 + Math.random() * 9000);
    setOrderId(newOrderId);
    setCheckoutStep("confirmation");
  };

  const handleGoToOrders = () => {
    setActiveSection("products");
    setCheckoutStep("address");
  };

  const handleGoToHome = () => {
    setActiveSection("home");
    setCheckoutStep("address");
  };

  const handleNavigateToCart = () => {
    setActiveSection("sales");
  };

  const handleProceedToCheckout = () => {
    setActiveSection("checkout-address");
    setCheckoutStep("address");
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
        return <SalesScreen onProceedToCheckout={handleProceedToCheckout} />;
      case "catalog":
        return <ProductCatalogScreen onNavigateToCart={handleNavigateToCart} />;
      case "checkout-address":
        return checkoutStep === "address" ? (
          <CheckoutAddressScreen onContinue={handleContinueToPayment} onBack={handleBackToCart} />
        ) : checkoutStep === "payment" ? (
          <CheckoutPaymentScreen 
            onConfirmPayment={handleConfirmPayment} 
            onBack={handleBackToAddress}
            orderTotal={orderTotal}
            deliveryFee={deliveryFee}
          />
        ) : (
          <OrderConfirmationScreen 
            orderId={orderId} 
            onGoToHome={handleGoToHome} 
            onGoToOrders={handleGoToOrders} 
          />
        );
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
        return <CustomerSettingsScreen initialTab={settingsTab} onDeleteAccount={handleDeleteAccount} />;
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
    } else if (authView === "verify-account") {
      return (
        <VerifyAccountScreen
          email={registerEmail}
          onVerify={handleVerifyAccount}
          onResendCode={handleResendCode}
        />
      );
    } else if (authView === "account-created") {
      return (
        <AccountCreatedScreen
          onGoToLogin={handleGoToLogin}
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
    <>
      <Toaster position="top-right" />
      <div className="h-screen w-screen flex flex-col bg-background">
        <TopNavigation onLogout={handleLogout} onNavigate={handleNavigate} />
        
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
    </>
  );
}
