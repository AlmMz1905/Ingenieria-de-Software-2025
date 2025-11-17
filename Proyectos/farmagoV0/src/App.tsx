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
import { OrderManagementScreen } from "./components/OrderManagementScreen";
import { OrderDetailScreen } from "./components/OrderDetailScreen";
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

// --- (Interfaces "Globales") ---
import { type MedicamentoConStock } from "./components/StockManagementScreen";
export interface CartItem extends MedicamentoConStock {
  quantity: number;
}
// ¡OJO! ¡Esta 'interface' es una ADIVINANZA de la API!
// ¡La vamos a usar para el estado "global" de pedidos!
export interface Order {
  id_pedido: number;
  fecha_pedido: string;
  total: number;
  estado: string;
  detalles?: {
    cantidad: number;
    precio_unitario: number;
    medicamento: { // ¡Asumo que la API nos devuelve esto!
      nombre_comercial: string;
    }
  }[];
}
// --- FIN DEL CAMBIO ---

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
  
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("address");
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [orderId, setOrderId] = useState("");
  
  // --- ¡¡¡ESTADO GLOBALIZADO!!! ---
  const [stockItems, setStockItems] = useState<MedicamentoConStock[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); // ¡El historial "global"!
  // --- FIN DEL CAMBIO ---


  const handleLogin = (accountType: string) => {
    setIsAuthenticated(true);
    setAuthView("app");
    
    if (accountType === "farmacia") {
      setUserType("empleado");
    } else {
      setUserType("cliente");
    }
  };

  // ... (handleRegister, handleVerifyAccount, etc. igual que antes) ...
  const handleRegister = (accountType: string, email: string) => {
    setRegisterEmail(email);
    setUserType(accountType as UserType);
    setAuthView("verify-account");
  };
  const handleVerifyAccount = (code: string) => {
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
    setCart([]);
    setOrders([]); // ¡Limpiamos los pedidos al salir!
    // ¡NO LIMPIAMOS EL STOCK!
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
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


  // --- (handleConfirmPayment, igual que antes) ---
  const handleConfirmPayment = async (paymentMethodId: number, total: number) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("authToken");

    if (!token || !apiUrl) {
      alert("Error: No estás autenticado o la API no está configurada.");
      return;
    }

    const detalles = cart.map(item => ({
      id_medicamento: item.id_medicamento,
      cantidad: item.quantity,
      precio_unitario: item.precio || 0
    }));

    const HACK_FARMACIA_ID = 1;

    try {
      const response = await fetch(`${apiUrl}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id_farmacia: HACK_FARMACIA_ID,
          metodo_pago: "tarjeta", 
          total: total,
          detalles: detalles
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "No se pudo crear el pedido.");
      }

      // ¡El backend nos devuelve el pedido nuevo!
      const newOrderData: Order = await response.json(); 
      
      // Actualizamos el stock "en vivo"
      setStockItems(prevStock => {
        let newStock = [...prevStock];
        cart.forEach(cartItem => {
          newStock = newStock.map(stockItem => {
            if (stockItem.id_medicamento === cartItem.id_medicamento) {
              return {
                ...stockItem,
                stock: (stockItem.stock || 0) - cartItem.quantity
              };
            }
            return stockItem;
          });
        });
        return newStock;
      });

      // --- ¡CAMBIO! ¡Agregamos el pedido nuevo al historial "global"! ---
      setOrders(prevOrders => [newOrderData, ...prevOrders]);
      // --- FIN DEL CAMBIO ---

      setCart([]);
      setOrderId(newOrderData.id_pedido.toString());
      setCheckoutStep("confirmation");

    } catch (err: any) {
      console.error("Error al confirmar el pago:", err);
      alert(`Error al crear el pedido: ${err.message}`);
    }
  };


  // (El resto de los handlers, igual que antes)
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

  // --- ¡CAMBIO! ¡Este botón ahora te lleva de verdad! ---
  const handleGoToOrders = () => {
    setActiveSection("products"); // "products" es el ID de "Mis Recetas"
    setCheckoutStep("address"); // Reseteamos el checkout
  };
  // --- FIN DEL CAMBIO ---

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
  const handleNavigateToOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveSection("order-detail");
  };
  const handleBackToOrderManagement = () => {
    setSelectedOrderId("");
    setActiveSection("order-management");
  };
  const handleOrderComplete = (orderId: string, completionType: string) => {
    console.log(`Order ${orderId} completed via ${completionType}`);
  };

  const renderContent = () => {
    // (Farmacia, igual que antes)
    if (userType === "empleado") {
      switch (activeSection) {
        // ... (el resto de 'empleado' sigue igual) ...
        case "home":
          return <PharmacyDashboard onNavigate={setActiveSection} />;
        case "uploaded-recipes":
          return <UploadedRecipesScreen />;
        case "order-management":
          return <OrderManagementScreen onNavigateToDetail={handleNavigateToOrderDetail} />;
        case "order-detail":
          return (
            <OrderDetailScreen 
              orderId={selectedOrderId} 
              onBack={handleBackToOrderManagement}
              onOrderComplete={handleOrderComplete}
            />
          );
        case "stock-management":
          return (
            <StockManagementScreen 
              stockItems={stockItems} 
              setStockItems={setStockItems} 
            />
          );
        case "pharmacy-ratings":
          return <PharmacyRatingsScreen />;
        case "settings":
          return <PharmacySettingsScreen />;
        default:
          return <PharmacyDashboard onNavigate={setActiveSection} />;
      }
    }

    // (Cliente, igual que antes)
    switch (activeSection) {
      // ... (el resto de 'cliente' sigue igual) ...
      case "home":
        return <DashboardScreen onNavigate={setActiveSection} />;
      case "sales":
        return (
          <SalesScreen 
            onProceedToCheckout={handleProceedToCheckout} 
            cart={cart}
            setCart={setCart}
          />
        );
      case "catalog":
        return (
          <ProductCatalogScreen 
            onNavigateToCart={handleNavigateToCart}
            stockItems={stockItems}
            setStockItems={setStockItems}
            cart={cart}
            setCart={setCart}
          />
        );
      case "checkout-address":
        // (Checkout, igual que antes)
        const subtotal = cart.reduce((sum, item) => sum + (item.quantity * (item.precio || 0)), 0);
        const tax = subtotal * 0.21;
        const total = subtotal + tax;
        const deliveryFee = 0;
        
        return checkoutStep === "address" ? (
          <CheckoutAddressScreen onContinue={handleContinueToPayment} onBack={handleBackToCart} />
        ) : checkoutStep === "payment" ? (
          <CheckoutPaymentScreen 
            onConfirmPayment={(paymentId) => handleConfirmPayment(paymentId, total)}
            onBack={handleBackToAddress}
            orderTotal={total}
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
        // --- ¡CAMBIO! ¡Le pasamos el estado "global" de pedidos! ---
        return (
          <RecipesScreen 
            orders={orders}
            setOrders={setOrders}
          />
        );
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

  // (Login/Register, igual que antes)
  if (!isAuthenticated) {
    // ...
    return (
      <LoginScreen
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView("register")}
        onForgotPassword={handleForgotPassword}
      />
    );
  }

  // (App Autenticada, igual que antes)
  return (
    <>
      <Toaster position="top-right" />
      <div className="h-screen w-screen flex flex-col bg-background">
        <TopNavigation 
          onLogout={handleLogout} 
          onNavigate={handleNavigate} 
          userType={userType} 
        />
        
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