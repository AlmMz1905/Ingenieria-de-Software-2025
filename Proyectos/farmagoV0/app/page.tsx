'use client';

import { useState } from "react";
import { Toaster } from "../src/components/ui/sonner";
import { TopNavigation } from "../src/components/TopNavigation";
import { SideNavigation } from "../src/components/SideNavigation";
import { DashboardScreen } from "../src/components/DashboardScreen";
import { PharmacyDashboard } from "../src/components/PharmacyDashboard";
import { SalesScreen } from "../src/components/SalesScreen";
import { RecipesScreen } from "../src/components/RecipesScreen";
import { UploadRecipeScreen } from "../src/components/UploadRecipeScreen";
import { ProductCatalogScreen } from "../src/components/ProductCatalogScreen";
import { CheckoutAddressScreen } from "../src/components/CheckoutAddressScreen";
import { CheckoutPaymentScreen } from "../src/components/CheckoutPaymentScreen";
import { OrderConfirmationScreen } from "../src/components/OrderConfirmationScreen";
import { MapScreenCustomer } from "../src/components/MapScreenCustomer";
import { MapScreenPharmacy } from "../src/components/MapScreenPharmacy";
import { ChatScreenCustomer } from "../src/components/ChatScreenCustomer";
import { ChatScreenPharmacy } from "../src/components/ChatScreenPharmacy";
import { CustomerReviewsScreen } from "../src/components/CustomerReviewsScreen";
import { UploadedRecipesScreen } from "../src/components/UploadedRecipesScreen";
import { PharmacyRatingsScreen } from "../src/components/PharmacyRatingsScreen";
import { CustomerSettingsScreen } from "../src/components/CustomerSettingsScreen";
import { PharmacySettingsScreen } from "../src/components/PharmacySettingsScreen";
import { StockManagementScreen } from "../src/components/StockManagementScreen";
import { UsersScreen } from "../src/components/UsersScreen";
import { LoginScreen } from "../src/components/LoginScreen";
import { RegisterScreen } from "../src/components/RegisterScreen";
import { VerifyAccountScreen } from "../src/components/VerifyAccountScreen";
import { AccountCreatedScreen } from "../src/components/AccountCreatedScreen";
import { PasswordResetRequestScreen } from "../src/components/PasswordResetRequestScreen";
import { PasswordResetEmailSentScreen } from "../src/components/PasswordResetEmailSentScreen";
import { PasswordResetNewPasswordScreen } from "../src/components/PasswordResetNewPasswordScreen";
import { toast } from "sonner";

type AuthView = "login" | "register" | "verify-account" | "account-created" | "forgot-password" | "reset-email-sent" | "reset-new-password" | "app";
type UserType = "cliente" | "farmacia" | "";
type CheckoutStep = "address" | "payment" | "confirmation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export default function Page() {
  const [activeSection, setActiveSection] = useState("home");
  const [settingsTab, setSettingsTab] = useState("profile");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>("");
  const [user, setUser] = useState<any>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("address");
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [orderId, setOrderId] = useState("");
  const [orderTotal] = useState(2850.00);
  const [deliveryFee] = useState(350.00);

  const handleLogin = async (email: string, password: string, accountType: string) => {
    setIsLoading(true);
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      localStorage.setItem('token', response.access_token);
      setUser(response.user);
      setUserType(response.user_type as UserType);
      setIsAuthenticated(true);
      setAuthView("app");
      toast.success("Sesión iniciada");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, accountType: string) => {
    setIsLoading(true);
    try {
      const endpoint = accountType === 'cliente' ? '/auth/register/cliente' : '/auth/register/farmacia';
      const response = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          nombre: accountType === 'cliente' ? 'Usuario' : 'Farmacia',
          apellido: 'Test',
          ...(accountType === 'cliente' ? { dni: '12345678' } : { nombre_comercial: email, cuit: Math.random().toString() })
        }),
      });
      
      localStorage.setItem('token', response.access_token);
      setUser(response.user);
      setUserType(response.user_type as UserType);
      setIsAuthenticated(true);
      setAuthView("app");
      toast.success("Cuenta creada exitosamente");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAccount = (code: string) => {
    console.log("Verification code:", code);
    setAuthView("account-created");
  };

  const handleResendCode = () => {
    toast.info("Código reenviado a " + registerEmail);
  };

  const handleGoToLogin = () => {
    setAuthView("login");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAuthView("login");
    setActiveSection("home");
    setUserType("");
    setUser(null);
    toast.success("Sesión cerrada");
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
    toast.success("Contraseña restablecida exitosamente");
    setAuthView("login");
  };

  const handleBackToLogin = () => {
    setAuthView("login");
  };

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
    if (userType === "farmacia") {
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

  if (!isAuthenticated) {
    if (authView === "register") {
      return (
        <RegisterScreen
          onRegister={(accountType, email) => {
            setRegisterEmail(email);
            handleRegister(email, "password123", accountType);
          }}
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
        onLogin={(email, password, accountType) => handleLogin(email, password, accountType)}
        onSwitchToRegister={() => setAuthView("register")}
        onForgotPassword={handleForgotPassword}
      />
    );
  }

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
