import { Navigate, Route, Routes } from "react-router-dom";

/* =========================================================
   AUTH / ROUTE GUARDS
========================================================= */

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import ClientRoute from "./components/auth/ClientRoute";

/* =========================================================
   LAYOUTS
========================================================= */

import AdminLayout from "./components/layout/AdminLayout";
import ClientLayout from "./components/layout/ClientLayout";
import SettingsLayout from "./components/layout/SettingsLayout";

/* =========================================================
   PUBLIC AUTH
========================================================= */

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

import AdminDashboard from "./pages/admin/Dashboard";

/* =========================================================
   ADMIN CLIENTS
========================================================= */

import ClientList from "./pages/admin/clients/ClientList";
import AddClient from "./pages/admin/clients/AddClient";
import EditClient from "./pages/admin/clients/EditClient";
import ViewClient from "./pages/admin/clients/ViewClient";

/* =========================================================
   ADMIN QUOTES
========================================================= */

import QuoteList from "./pages/admin/quotes/QuoteList";
import QuoteDetails from "./pages/admin/quotes/QuoteDetails";
import AddQuote from "./pages/admin/quotes/AddQuote";
import EditQuote from "./pages/admin/quotes/EditQuote";

/* =========================================================
   ADMIN INVOICES
========================================================= */

import InvoiceList from "./pages/admin/invoices/InvoiceList";
import AddInvoice from "./pages/admin/invoices/AddInvoice";
import EditInvoice from "./pages/admin/invoices/EditInvoice";
import InvoiceDetails from "./pages/admin/invoices/InvoiceDetails";

/* =========================================================
   ADMIN PAYMENTS
========================================================= */

import PaymentList from "./pages/admin/payments/PaymentList";
import PaymentDetails from "./pages/admin/payments/PaymentDetails";

/* =========================================================
   ADMIN REPORTS
========================================================= */

import ReportDashboard from "./pages/admin/reports/ReportDashboard";

/* =========================================================
   ADMIN TICKETS
========================================================= */

import AdminTicketList from "./pages/admin/tickets/TicketList";
import AdminTicketDetails from "./pages/admin/tickets/TicketDetails";

/* =========================================================
   ADMIN SETTINGS
========================================================= */

import SettingsHub from "./pages/admin/settings/SettingsHub";
import General from "./pages/admin/settings/General";
import Business from "./pages/admin/settings/Business";
import Quotation from "./pages/admin/settings/Quotation";
import Invoice from "./pages/admin/settings/Invoice";
import Payments from "./pages/admin/settings/payments";
import Tax from "./pages/admin/settings/Tax";
import Emails from "./pages/admin/settings/Emails";
import Pdf from "./pages/admin/settings/Pdf";
import Translate from "./pages/admin/settings/Translate";
import Extras from "./pages/admin/settings/Extras";
import License from "./pages/admin/settings/License";

/* =========================================================
   CLIENT PORTAL
========================================================= */

import ClientDashboard from "./pages/client/Dashboard";
import ClientQuotes from "./pages/client/Quotes";
import ClientQuoteDetails from "./pages/client/QuoteDetails";
import ClientInvoices from "./pages/client/Invoices";
import ClientInvoiceDetails from "./pages/client/InvoiceDetails";
import ClientPayments from "./pages/client/Payments";
import ClientReceipts from "./pages/client/Receipts";
import ClientReceiptDetails from "./pages/client/ReceiptDetails";
import ClientTickets from "./pages/client/Tickets";
import ClientTicketDetails from "./pages/client/TicketDetails";
import ClientProfile from "./pages/client/Profile";

/* =========================================================
   CLIENT PAYMENT CHECKOUT
========================================================= */

import PaymentCheckout from "./pages/client/payments/PaymentCheckout";
import PaymentSuccess from "./pages/client/payments/PaymentSuccess";
import PaymentFailed from "./pages/client/payments/PaymentFailed";

/* =========================================================
   COMMON
========================================================= */

import Profile from "./pages/profile/Profile";
import System from "./pages/system/System";

/* =========================================================
   ERROR PAGES
========================================================= */

import Unauthorized from "./pages/errors/Unauthorized";
import Forbidden from "./pages/errors/Forbidden";
import NotFound from "./pages/errors/NotFound";
import ServerError from "./pages/errors/ServerError";


export default function App() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =====================================================
          PROTECTED ROUTES
      ===================================================== */}

      <Route element={<ProtectedRoute />}>

        {/* ===================================================
            ADMIN
        =================================================== */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* ADMIN HOME */}

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            {/* DASHBOARD */}

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            {/* =================================================
                CLIENTS
            ================================================= */}

            <Route
              path="clients"
              element={<ClientList />}
            />

            <Route
              path="clients/add"
              element={<AddClient />}
            />

            <Route
              path="clients/:id/edit"
              element={<EditClient />}
            />

            <Route
              path="clients/:id"
              element={<ViewClient />}
            />

            {/* =================================================
                QUOTES
            ================================================= */}

            <Route
              path="quotes"
              element={<QuoteList />}
            />

            <Route
              path="quotes/add"
              element={<AddQuote />}
            />

            <Route
              path="quotes/:id/edit"
              element={<EditQuote />}
            />

            <Route
              path="quotes/:id"
              element={<QuoteDetails />}
            />

            {/* =================================================
                INVOICES
            ================================================= */}

            <Route
              path="invoices"
              element={<InvoiceList />}
            />

            <Route
              path="invoices/add"
              element={<AddInvoice />}
            />

            <Route
              path="invoices/:id/edit"
              element={<EditInvoice />}
            />

            <Route
              path="invoices/:id"
              element={<InvoiceDetails />}
            />

            {/* =================================================
                PAYMENTS
            ================================================= */}

            <Route
              path="payments"
              element={<PaymentList />}
            />

            <Route
              path="payments/:id"
              element={<PaymentDetails />}
            />

            {/* =================================================
                REPORTS
            ================================================= */}

            <Route
              path="reports"
              element={<ReportDashboard />}
            />

            {/* =================================================
                SUPPORT TICKETS
            ================================================= */}

            <Route
              path="tickets"
              element={<AdminTicketList />}
            />

            <Route
              path="tickets/:id"
              element={<AdminTicketDetails />}
            />

            {/* =================================================
                PROFILE
            ================================================= */}

            <Route
              path="profile"
              element={<Profile />}
            />

            {/* =================================================
                SYSTEM
            ================================================= */}

            <Route
              path="system"
              element={<System />}
            />

            {/* =================================================
                SETTINGS
            ================================================= */}

            <Route
              path="settings"
              element={<SettingsLayout />}
            >

              {/* /admin/settings → SettingsHub with all 11 cards */}
              <Route
                index
                element={<SettingsHub />}
              />

              <Route
                path="general"
                element={<General />}
              />

              <Route
                path="business"
                element={<Business />}
              />

              <Route
                path="quotation"
                element={<Quotation />}
              />

              <Route
                path="invoice"
                element={<Invoice />}
              />

              <Route
                path="payments"
                element={<Payments />}
              />

              <Route
                path="tax"
                element={<Tax />}
              />

              <Route
                path="emails"
                element={<Emails />}
              />

              <Route
                path="pdf"
                element={<Pdf />}
              />

              <Route
                path="translate"
                element={<Translate />}
              />

              <Route
                path="extras"
                element={<Extras />}
              />

              <Route
                path="license"
                element={<License />}
              />

            </Route>

          </Route>

        </Route>


        {/* ===================================================
            CLIENT PORTAL
        =================================================== */}

        <Route element={<ClientRoute />}>

          <Route
            path="/client"
            element={<ClientLayout />}
          >

            {/* /client
                → /client/dashboard */}

            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            {/* =================================================
                CLIENT DASHBOARD
            ================================================= */}

            <Route
              path="dashboard"
              element={<ClientDashboard />}
            />

            {/* =================================================
                CLIENT QUOTES
            ================================================= */}

            <Route
              path="quotes"
              element={<ClientQuotes />}
            />

            <Route
              path="quotes/:id"
              element={<ClientQuoteDetails />}
            />

            {/* =================================================
                CLIENT INVOICES
            ================================================= */}

            <Route
              path="invoices"
              element={<ClientInvoices />}
            />

            <Route
              path="invoices/:id"
              element={<ClientInvoiceDetails />}
            />

            {/* =================================================
                CLIENT PAYMENTS
            ================================================= */}

            <Route
              path="payments"
              element={<ClientPayments />}
            />

            {/* =================================================
                PAYMENT CHECKOUT
            ================================================= */}

            <Route
              path="payments/checkout/:invoiceId"
              element={<PaymentCheckout />}
            />

            {/* =================================================
                PAYMENT SUCCESS
            ================================================= */}

            <Route
              path="payments/success"
              element={<PaymentSuccess />}
            />

            {/* =================================================
                PAYMENT FAILED
            ================================================= */}

            <Route
              path="payments/failed"
              element={<PaymentFailed />}
            />

            {/* =================================================
                CLIENT RECEIPTS
            ================================================= */}

            <Route
              path="receipts"
              element={<ClientReceipts />}
            />

            <Route
              path="receipts/:id"
              element={<ClientReceiptDetails />}
            />

            {/* =================================================
                CLIENT TICKETS
            ================================================= */}

            <Route
              path="tickets"
              element={<ClientTickets />}
            />

            <Route
              path="tickets/:id"
              element={<ClientTicketDetails />}
            />

            {/* =================================================
                CLIENT PROFILE
            ================================================= */}

            <Route
              path="profile"
              element={<ClientProfile />}
            />

          </Route>

        </Route>

      </Route>


      {/* =====================================================
          ERROR ROUTES
      ===================================================== */}

      <Route
        path="/401"
        element={<Unauthorized />}
      />

      <Route
        path="/403"
        element={<Forbidden />}
      />

      <Route
        path="/500"
        element={<ServerError />}
      />

      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}