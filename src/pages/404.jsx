import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import secureLocalStorage from "react-secure-storage";
import LogoRed from "../images/mancity-horizontal-white.png";
import LogoWhite from "../images/mancity-horizontal-white.png";
import axios from "axios";
import Moment from "moment";
import Header from "../components/Header";
import Facebook from "../images/facebook.svg";
import Twitter from "../images/twitter-x-new.svg";
import Instagram from "../images/instagram.svg";
import Visa from "../images/visa.svg";
import Mastercard from "../images/mastercard.svg";
import LogoFoundationWhite from "../images/logo-foundation-white.svg";
import Cup from "../images/cup.svg";
import "../images/HeroBg.png";
import "../App.css";
import LogoFoundationGray from "../images/mancity-horizontal-dark.png";
import CurevedDot from "../images/cureved-dot.svg";
import FooterIconAddress from "../images/footer-icon-address.svg";
import FooterIconEmail from "../images/footer-icon-email.svg";
import useDocumentTitle from "../components/useDocumentTitle";
import { Helmet } from "react-helmet";

export default function PageNotFound() {
  useDocumentTitle("Page Not Found");
  const [scroll, setScroll] = useState(false);
  const [Sidebar, setSidebar] = useState(false);
  const [login, setLogin] = useState(secureLocalStorage.getItem("UserData") ? secureLocalStorage.getItem("UserData").loggedin : false);
  const [DrawData, setDrawData] = useState([]);

  const siteID = process.env.REACT_APP_SITE_ID;
  const APIURL = process.env.REACT_APP_API_URL;

  function logout() {
    secureLocalStorage.clear();
    axios.delete(APIURL + "/auth/logout");
    setLogin(false);
  }

  return (
    <>
      <Helmet>
        <title>Win Big in the Hendrix Archive Community Draw | Support CITC and Manchester Community</title>
        <meta
          name="description"
          content="Kick off your winning streak! Join the Hendrix Archive Community Prize Draw to clinch incredible prizes, and play a vital role in supporting Hendrix Archive's enduring mission to uplift communities."
        />
      </Helmet>
      <Header />

      <section className="w-100 bg-f2  p-5 position-relative notfound-page">
        <div className="container h-100 p-5 notfound-page">
          <div className="d-flex align-items-center justify-content-center h-100 ">
            <div className="d-flex flex-column w-75 row notfound">
              <div className="align-items-center justify-content-center text-center">
                <img src={require("../images/404city.png")} style={{ width: "100%" }} />
                <h1 className="display-4 mb-5 branding-1 font-face-sh-bold">Ohh... Shoot, this isn't the right place</h1>
                <h5 className="color-grey">This page you have navigated doesn't exist or has been moved. Our apologies</h5>
                <div className="pt-0">
                  <Link
                    to={"/"}
                    className="cta-large-button btn btn-link btn bg-branding-1 text-decoration-none shadow-lg text-white border-0 notfound-button fs-4 w-25 m-3 rounded-pill py-3 mt-5"
                    style={{ height: 48, lineHeight: "14px" }}
                  >
                    Home
                  </Link>
                  <Link
                    to={"/login"}
                    className="cta-large-button btn btn-link btn bg-branding-1 text-decoration-none shadow-lg text-white border-0 notfound-button fs-4  w-25 m-3 rounded-pill py-3 mt-5"
                    style={{ height: 48, lineHeight: "14px" }}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-section font-face-sh mt-5 position-relative mobile-footer">
        <div className="container">
          <div className="footer-logo">
            <img className="" src={LogoFoundationGray} alt="logo-foundation-gray" style={{ width: 270 }} />
          </div>
          <div className="row pt-4">
            <div className="col-sm-12 col-md-12 col-lg-5 black-clr">
              <h4 className="mb-4 pb-2 pt-2 xs-body-font-bold">Contact us</h4>
              <div className="footer-address d-flex align-items-start">
                <img className="me-3" src={FooterIconAddress} alt="FooterIconAddress" style={{ width: 24 }} />
                <p style={{ fontSize: 14 }}>Post: PFW Holdings Ltd Suite#300, 4 Blenheim Court, Peppercorn Close, Peterborough, PE1 2DU</p>
              </div>
              <div className="footer-email d-flex align-items-start">
                <img className="me-3" src={FooterIconEmail} alt="FooterIconEmail" style={{ width: 24 }} />
                <p style={{ fontSize: 14 }}>
                  Support:{" "}
                  <a href="mailto:hello@playfundwin.com" className="text-decoration-none black-clr branding-1-hover">
                    hello@playfundwin.com
                  </a>
                </p>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-3 mt-md-5">
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6 black-clr mb-3">
                  <p className="mt-4 pt-2 xs-body-font-bold">Follow us</p>
                  <div className="d-flex">
                    <a className="branding-2 text-decoration-none" href="https://facebook.com/PlayFundWin/" target="_blank">
                      <img className="me-3" src={Facebook} alt="Facebook" style={{ width: 24 }} />
                    </a>
                    <a className="branding-2 text-decoration-none" href="https://www.instagram.com/playfundwin" target="_blank">
                      <img className="me-3" src={Twitter} alt="Twitter" style={{ width: 24 }} />
                    </a>
                    <a className="branding-2 text-decoration-none" href="https://twitter.com/PlayFundWin" target="_blank">
                      <img className="me-3" src={Instagram} alt="Instagram" style={{ width: 24 }} />
                    </a>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <div className="d-flex mt-md-5 pt-2">
                    <img className="me-3" src={Visa} alt="Visa" style={{ width: 64 }} />
                    <img className="me-3" src={Mastercard} alt="Mastercard" style={{ width: 64 }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-12 col-lg-4  mt-md-5 black-clr ps-md-5">
              <p className="mt-4 pt-3" style={{ fontSize: 13 }}>
                Hendrix Archive Prize Draw is operated by{" "}
                <a className="text-decoration-none black-clr branding-1-hover" href="https://playfundwin.com/" target="_blank">
                  Play Fund Win
                </a>
              </p>
              <div className="d-flex" style={{ fontSize: 14 }}>
                <Link className="black-clr text-decoration-none pe-5 branding-1-hover xs-body-font-bold" to={"/terms-conditions"}>
                  Terms & Conditions
                </Link>
                <Link className="black-clr text-decoration-none branding-1-hover xs-body-font-bold" to={"/privacy-policy"}>
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
