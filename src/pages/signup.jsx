// signup-new.jsx
import React from "react";
import { Helmet } from "react-helmet";
import { useSignup } from "../context/SignupProvider"; // Adjust the path as needed
import SignupForm from "../components/forms/SignupForm"; // Adjust the path as needed
import CheckoutForm from "../components/forms/CheckoutForm"; // Adjust the path as needed
// import SubscriptionPlanForm from "../components/SubscriptionPlanForm"; // Adjust the path as needed

const Signup = () => {
  const { page, setPage } = useSignup();
  const renderForm = () => {
    // setPage(1);
    switch (page) {
      case 1:
        return <SignupForm setPage={setPage} />;
      case 2:
        return <CheckoutForm setPage={setPage} />;
      case 3:
        // return <SubscriptionPlanForm />;
        break;
      default:
        return <SignupForm setPage={setPage} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Signup for Hendrix Archive Draw | Your Gateway to Exciting Prizes</title>
        <meta
          name="description"
          content="Create an account to participate in draws, win amazing prizes, and support Hendrix Archive's mission. Your journey to making a difference begins here!"
        />
      </Helmet>
      <div className="bg-white" style={{ height: "100vh" }}>
        {renderForm()}
      </div>
    </>
  );
};

export default Signup;
