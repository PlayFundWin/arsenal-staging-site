import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import apiClient from "../api.config";
import useDocumentTitle from "../components/useDocumentTitle";
import LogoRed from "../images/mancity-horizontal-dark.png";

export default function UserResetPassword() {
  useDocumentTitle("User Reset Password");

  const Urlparams = useLocation().search;
  const [password, setPassword] = useState("");
  const [Confirmpassword, setConfirmpassword] = useState("");
  const Params_userID = new URLSearchParams(Urlparams).get("userID");
  const Params_resetToken = new URLSearchParams(Urlparams).get("resetToken");
  const navigate = useNavigate();

  const siteID = process.env.REACT_APP_SITE_ID;
  const APIURL = process.env.REACT_APP_API_URL;

  // console.log(Params_userID,Params_resetToken);
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function ValidateUser() {
    if (Params_userID === null || Params_resetToken === null) {
      toast.error("Invalid Reset token");
    } else if (Confirmpassword.trim().length === 0 && password.trim().length === 0) {
      toast.error("Please Enter Password and Confirm Password");
    } else if (password.trim().length === 0) {
      toast.error("Please Enter Password");
    } else if (Confirmpassword.trim().length === 0) {
      toast.error("Please Enter Confirm Password");
    } else if (password != Confirmpassword) {
      toast.error("Invalid Confirm Password");
    } else {
      try {
        const response = await toast.promise(
          apiClient.post(
            APIURL + "/auth/reset",
            {
              userID: Params_userID,
              userPasswordToken: Params_resetToken,
              userPassword: Confirmpassword,
            },
            {
              withCredentials: true,
              credentials: "same-origin",
            }
          ),
          {
            pending: "Please wait...",
          }
        );

        if (response.data.content === "Token Matches. Password Reset Succesfully") {
          toast("Passwort Reset Successfully", { type: "success" });
          await timeout(2000);
          navigate("/login");
        } else {
          toast("Passwort Reset Fail", { type: "error" });
        }
      } catch (error) {
        console.log(error);
        toast.error(`${error.message} Node Not found`);
      }
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
              <h3 className="title text-center fs-22 mb-3 pb-1 mt-4 l-title" id="title" style={{ display: "block" }}>
                Reset your password
              </h3>
            </div>
            <div
              id="emailPassword"
              className="d-block"
              style={{ maxWidth: 560, margin: "0 auto", padding: "40px", boxShadow: "0px 0px 10px #eee", border: "1px solid #ccc", borderRadius: 15 }}
            >
              <ul className="checkbox-list list-unstyled">
                <li className="checkbox-item pt-4 pb-0">
                  <input type="password" onChange={(event) => setPassword(event.target.value)} placeholder="New Password" className="input" />
                </li>
                <li className="checkbox-item pt-4 pb-2">
                  <input type="password" onChange={(event) => setConfirmpassword(event.target.value)} placeholder="Confirm New Password" className="input" />
                </li>
              </ul>

              <button
                onClick={ValidateUser}
                className="cta-large-button btn bg-branding-1 border-0 w-100 fs-5 font-face-sh-bold rounded-pill  py-2 mt-3 mb-2 lh-2 desktop-btn text-light"
                style={{ display: "block", height: 48 }}
                type="button"
                name="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
