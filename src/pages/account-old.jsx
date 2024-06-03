import React from "react";
import DashboardHeader from "../components/dashboard-header";
import Footer from "../components/footer";
import AccountImpactBg from "../images/account-impact-top_bg.svg";
import LogoFoundationGray from "../images/mancity-vertical-dark.png";
import AccountImpactBottomDotIcon from "../images/account-impact_bottom_dot.svg";
import { Helmet } from "react-helmet";
export default function Account() {
  return (
    <>
      <Helmet>
        <title>My Account | Manage Your Hendrix Archive Draw Profile</title>
        <meta name="description" content="Review and manage your personal details, tickets, and upcoming draws. Your personalized hub for all things Hendrix Archive Draw!" />
      </Helmet>
      <DashboardHeader active="account" />

      <div className="account-impact-section font-face-sh mb-5 pb-5">
        <div
          className="account-impact-container mx-auto position-relative bg-white"
          style={{ maxWidth: 375, borderRadius: "24px 24px 12px 12px", boxShadow: "0 16px 24px rgba(0,0,0,.12)" }}
        >
          <div className="account-impact-top_bg position-absolute start-0 end-0 top-0 bottom-0" style={{ overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
            <img className="position-absolute start-0 end-0" src={AccountImpactBg} style={{ top: -30 }} />
          </div>
          <div className="position-relative text-center py-5">
            <h4 className="account-impact_title text-light text-uppercase font-face-sh-bold fs-18">Total raised:</h4>
            <h2 className="account-impact_raised text-light font-face-sh-bold display-6">£46,000+</h2>
          </div>
          <div className="account-impact_logo mt-3 text-center">
            <img className="mx-auto" src={LogoFoundationGray} style={{ maxWidth: 171 }} />
          </div>
          <div className="account-impact_text pt-3 pb-3 px-3">
            <p className="text-center" style={{ color: "#00000", fontSize: 15 }}>
              With support from our passionate fans, we're using the power of football to empower young people in Manchester and all around the world, helping them to lead
              healthier lives.
            </p>
          </div>
          <div className="account-impact_bottom_dot_icon text-center">
            <img className="mx-auto position-relative" src={AccountImpactBottomDotIcon} style={{ width: 92, bottom: -19 }} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
