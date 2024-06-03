// Dashboard.jsx
import React from "react";
import { Helmet } from "react-helmet";
import { DashboardProvider, useDashboard } from "../../context/DashboardProvider";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import Home from "./pages/Home";
import MyAccount from "./pages/MyAccount";
import MyPrizes from "./pages/MyPrizes";
import MyTickets from "./pages/MyTickets";
import MyPayments from "./pages/MyPayments";
import ChangePassword from "./pages/ChangePassword";

const Dashboard = () => {
  const { page } = useDashboard();

  const renderPage = () => {
    switch (page) {
      case 1:
        return <Home />;
      case 2:
        return <MyTickets />;
      case 3:
        return <MyPrizes />;
      case 4:
      case 6:
        return <MyAccount />;
      case 5:
        return <MyPayments />;
      case 7:
        return <ChangePassword />;

      // Add cases for other pages as needed...
      default:
        return <Home />;
    }
  };

  return (
    <>
      {/* <DashboardHeader /> */}
      <div className="flex h-full w-full flex-col py-10">
        <Helmet>
          <title>Dashboard | Hendrix Archive</title>
          <meta name="description" content="Manage your account and view your tickets." />
        </Helmet>
        <DashboardSidebar />
        <div className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{renderPage()}</div>
        </div>
      </div>
    </>
  );
};

export default function DashboardWrapper() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
