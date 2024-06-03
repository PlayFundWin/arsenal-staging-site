import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import apiClient from "../api.config";
import useDocumentTitle from "../components/useDocumentTitle";
import LogoRed from "../images/mancity-horizontal-dark.png";

export default function ResetPassword() {
  useDocumentTitle("Reset Password");
  const [email, setEmail] = useState("");

  const siteID = process.env.REACT_APP_SITE_ID;
  const APIURL = process.env.REACT_APP_API_URL;

  async function resetPassword() {
    if (email.trim().length === 0) {
      toast.error(`Please Enter Your Email`);
    } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      toast.error(`Invalid Email`);
    } else {
      const response = await toast.promise(
        apiClient.post(
          APIURL + "/auth/request",
          {
            userEmail: email,
            siteID: siteID,
          },
          {
            withCredentials: true,
            credentials: "same-origin",
          }
        ),
        {
          pending: "Please wait...",
          success: "Thank you! If we have record of a user with your email address, you will receive an email with a link to reset your password.",
          error: "Something went Wrong",
        }
      );
    }
  }

  return (
    <>
      <section className="reset-password-section font-face-sh">
        <div className="container">
          <div className="login-box mx-auto mt-4" style={{ maxWidth: 360 }}>
            <div className="login-header text-center pt-1">
              <Link to={"/"}>
                <img className="logo mb-3" src={LogoRed} style={{ maxHeight: 70 }} />
              </Link>
              <div id="myTreesPromo" className="promo-area" style={{ display: "none" }}>
                Save 1 tree by simply signing up
              </div>
              <h3 className="title text-center fs-22 mb-1 pb-1 l-title mt-4" id="title" style={{ display: "block" }}>
                Reset your password
              </h3>
              <h5 className="subtitle text-center mb-4" id="toggleTypeContainer" style={{ display: "block", fontSize: 15 }}>
                <span id="hint" style={{ display: "inline", color: "#43465E" }}>
                  Or, try a different
                </span>
                <span className="subtitle-link" id="login-instead">
                  <Link className="text-decoration-none branding-1" to={"/login"}>
                    {" "}
                    Log in
                  </Link>
                </span>
              </h5>
            </div>
            <div id="emailPassword" style={{ maxWidth: 560, margin: "0 auto", padding: "40px", boxShadow: "0px 0px 10px #eee", border: "1px solid #ccc", borderRadius: 15 }}>
              <input type="email" id="email" onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="input" style={{ display: "block" }} />

              <button
                type="submit"
                onClick={resetPassword}
                id="btn-signup"
                className="cta-large-button btn bg-branding-1 border-0 w-100 fs-5 font-face-sh-bold rounded-pill  py-2 mt-4 mb-2 lh-2 desktop-btn text-light"
                style={{ display: "block", height: 48 }}
              >
                Reset password
              </button>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
