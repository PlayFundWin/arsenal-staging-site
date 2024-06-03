import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
// import Signup from './pages/signup';
import PageNotFound from "./pages/404";
import TermsConditions from "./pages/terms-conditions";
import PrivacyPolicy from "./pages/privacy-policy";
import Account from "./pages/account";
import Prizes from "./pages/prizes";
import Subscription from "./pages/subscription";
import PaymentMethod from "./pages/payment-method";
import Details from "./pages/details";
import ResetPassword from "./pages/reset-password";
import SubscriptionPlan from "./pages/subscription-plan";
import UserResetPassword from "./pages/user-reset-password";
import ThankYou from "./pages/payment-success";

function SiteRouter() {
  return (
    // <div className="SiteRoutes" >

    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/reset-password" element={<ResetPassword />} />
        <Route exact path="/subscription-plan" element={<SubscriptionPlan />} />
        <Route exact path="/terms-conditions" element={<TermsConditions />} />
        <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route exact path="/account" element={<Account />} />
        <Route exact path="/account/prizes" element={<Prizes />} />
        <Route exact path="/account/subscription" element={<Subscription />} />
        <Route exact path="/account/payment-method" element={<PaymentMethod />} />
        <Route exact path="/account/details" element={<Details />} />
        <Route exact path="/user-reset-password" element={<UserResetPassword />} />
        <Route exact path="/payment-success/:transactionID" element={<ThankYou />} />
        <Route exact path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>

    // </div>
  );
}

export default SiteRouter;
