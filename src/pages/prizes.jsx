import React, { useEffect, useState } from "react";
// import DashboardHeader from "../components/dashboard-header";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import useDocumentTitle from "../components/useDocumentTitle";
import { toast, ToastContainer } from "react-toastify";
import PrizeImageLoader from "../components/ImageLoader";
import apiClient from "../api.config";
import { Helmet } from "react-helmet";

export default function Prizes() {
  useDocumentTitle("Prizes");
  const navigate = useNavigate();
  const [isLoaded, setLoadComplete] = useState(false);
  const [PurchaseData, setPurchaseData] = useState([]);
  const secureUserData = secureLocalStorage.getItem("UserData");
  const parser = new DOMParser();
  const [modalShow, setModalShow] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [fuluserSurname, setFullName] = useState("");
  const [accountnumber, setAccountNumber] = useState("");
  const [sortcode, setSortCode] = useState("");
  const [paypalemail, setPaypalEmail] = useState("");
  const [bankaccount, setBankAccount] = useState(true);
  const [prizeID, setPrizeID] = useState("");
  const [paypal, setPaypal] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [postcode, setPostcode] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [refresh, setRefresh] = useState(1);

  const siteID = process.env.REACT_APP_SITE_ID;
  const APIURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!secureUserData) {
      navigate("/login");
    } else {
      axios
        .get(`${process.env.REACT_APP_API_URL}/users/${secureUserData.userID}/data`, {
          withCredentials: true,
          credentials: "same-origin",
        })
        .then((res) => {
          if (res.data.content.prizes) {
            setAddress1(res.data.content.userAddressLine1);
            setAddress2(res.data.content.userAddressLine2);
            setPostcode(res.data.content.userAddressPostcode);
            setUserSurname(res.data.content.userSurname);
            setUserFirstName(res.data.content.userFirstName);
            setPurchaseData(res.data.content.prizes);
          }
          setLoadComplete(true);
        });
    }
  }, [refresh]);

  async function ClaimPrize() {
    // console.log("prizeID:", prizeID, "UserId:", userData.userID, "bankaccount: ", bankaccount, "accountnumber:", accountnumber, "accountnumber:", accountnumber, "fuluserSurname:", fuluserSurname)
    if (!bankaccount && paypalemail === "") {
      toast.error(`Please Enter Your Proper paypal email`);
      return;
    } else if (bankaccount && fuluserSurname === "" && accountnumber === "" && sortcode === "") {
      toast.error(`Please Enter Bank Details`);
    } else if (bankaccount && fuluserSurname === "") {
      toast.error(`Please Enter Full Name`);
    } else if (bankaccount && accountnumber === "") {
      toast.error(`Please Enter Account Number`);
    } else if (bankaccount && sortcode === "") {
      toast.error(`Please Enter Sortcode`);
    } else {
      try {
        const response = await toast.promise(
          apiClient.post(
            `${process.env.REACT_APP_API_URL}/prizes/claim`,
            {
              userID: secureUserData.userID,
              prize_id: prizeID,
              PaymentMethod: bankaccount ? "bank" : "paypal",
              full_name: fuluserSurname != "" ? fuluserSurname : "paypal",
              Sortcode: sortcode != "" ? sortcode : "paypal",
              account_no: accountnumber != "" ? accountnumber : "paypal",
              userEmail: paypalemail != "" ? paypalemail : "bank",
              detail_meta: { siteID: siteID },
              datameta: secureUserData,
              pageType: "Cash prize",
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
        if (response.data.status === true && response.data.error === null && response.data.content === null) {
          setModalShow(false);
          toast("Thank you for submitting, Your prize will be processed in the next 14 - 21 days", { type: "success" });
        } else if (response.data.status === true && response.data.content.message) {
          setModalShow(false);
          toast("Prize already claimed!", { type: "info" });
        } else {
          setModalShow(false);
          toast("Something went wrong While ", { type: "error" });
        }
        setRefresh((prev) => prev + 1);
      } catch (error) {
        console.log(error?.response?.data?.error);
        if (error?.response?.data?.error?.reason) {
          toast.warn(error?.response?.data?.error?.reason);
        } else if (error.response.status === 403) {
          toast.error(`${error.response.data?.content?.message}`);
        } else {
          toast.error(`${error.message}`);
        }
        setRefresh((prev) => prev + 1);
      }
    }
  }

  async function ClaimPrize2() {
    // console.log(`{siteID:${siteID},address1:${address1},address2:${address2},postcode:${postcode}}`, userSurname, userFirstName);
    if (address1 === null || address2 === null || postcode === null) {
      toast.error(`Please Enter Your full Address`);
      return;
    } else {
      try {
        const response = await toast.promise(
          apiClient.post(
            `${process.env.REACT_APP_API_URL}/prizes/claim`,
            {
              userID: secureUserData.userID,
              prize_id: prizeID,
              PaymentMethod: "prize",
              full_name: userFirstName + " " + userSurname,
              Sortcode: "-",
              account_no: "-",
              userEmail: "-",
              detail_meta: { siteID: siteID, address1: address1, address2: address2, postcode: postcode },
              datameta: secureUserData,
              pageType: "Prize",
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
        if (response.data.status === true && response.data.error === null && response.data.content === null) {
          setModalShow2(false);
          toast("Thank you for submitting, Your prize will be processed in the next 14 - 21 days", { autoClose: 15000, type: "success" });
        } else if (response.data.status === true && response.data?.content?.message) {
          setModalShow2(false);
          toast("Prize already claimed!", { type: "warn" });
        } else {
          setModalShow2(false);
          toast("Something went wrong While ", { type: "error" });
        }
        setRefresh((prev) => prev + 1);
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.content?.message) {
          toast.error(`${error?.response?.data?.content?.message}`);
        } else {
          toast.error(`${error.message}`);
        }
        setRefresh((prev) => prev + 1);
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>My Prizes | Discover Your Winnings with Hendrix Archive Draw</title>
        <meta name="description" content="Revel in your victories and explore the incredible prizes you've won. Every win brings joy and impacts communities positively." />
      </Helmet>
      {/* <DashboardHeader active="prize" /> */}
      {isLoaded ? (
        PurchaseData.length === 0 ? (
          <>
            <div className="user-subscription-section font-face-sh pb-5">
              <div className="no-subscription-box bg-white text-center rounded-3 p-4 mx-auto" style={{ maxWidth: 450, boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
                <p className="text-center fs-16 m-0" style={{ color: "#302d51" }}>
                  You don't have any prize won choose the subscription plan here.
                </p>
              </div>
            </div>
            <div className="mx-auto text-center pb-5" style={{ maxWidth: 327 }}>
              <Link
                to={"/subscription-plan"}
                className="cta-large-button btn bg-branding-1 border-0 w-100 fs-5 font-face-sh-bold rounded-pill  py-2 mt-0 mb-2 lh-2 desktop-btn text-light"
                style={{ display: "block", height: 48 }}
              >
                Enter The Draw
              </Link>
            </div>
          </>
        ) : (
          <>
            {PurchaseData.map((item, index) => {
              return (
                <>
                  <div key={item.id} className="user-subscription-section font-face-sh pb-5">
                    <div className="no-subscription-box bg-white rounded-3 p-4 mx-auto" style={{ maxWidth: 327, boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
                      {item.prizeImageURL == "/sports/prizeImage.jpg" ? (
                        <img src={require(`../images${item.prizeImageURL}`)} width="100%" alt="Prize Image" />
                      ) : (
                        <PrizeImageLoader src={item.prizeImageURL} />
                      )}
                      <p className="text-center fs-14 m-0" style={{ color: "#302d51" }}>
                        <strong>
                          <b className="branding-1" dangerouslySetInnerHTML={{ __html: parser.parseFromString(`${item.prizeName}`, "text/html").body.textContent }}></b>
                          <br />
                          {item.prizeValue != 0 ? item.prizeValue : ""}{" "}
                        </strong>{" "}
                        <br />
                        <i
                          className="text-decoration-none"
                          style={{ color: "#4b467d" }}
                          dangerouslySetInnerHTML={{ __html: parser.parseFromString(`${item.prizeDescription}`, "text/html").body.textContent }}
                        ></i>
                      </p>
                      <div className="mx-auto text-center pt-3" style={{ maxWidth: 327 }}>
                        {item.drawPrizeState === 1 ? (
                          item.prizeTypeID == 1 || item.prizeTypeID === 2 ? (
                            <Button
                              variant="primary"
                              onClick={() => {
                                setModalShow(true);
                                setPrizeID(item.prizeID);
                              }}
                              className="py-3 px-5 border border-2 border-white rounded-pill bg-branding-1 bg-branding-1-hover text-white text-decoration-none fs-6 lh-1 font-face-sh"
                            >
                              Claim Prize
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              onClick={() => {
                                setModalShow2(true);
                                setPrizeID(item.prizeID);
                              }}
                              className="py-3 px-5 border border-2 border-white rounded-pill bg-branding-1 bg-branding-1-hover text-white text-decoration-none fs-6 lh-1 font-face-sh"
                            >
                              Claim Prize
                            </Button>
                          )
                        ) : item.drawPrizeState === 2 ? (
                          <span className="bg-branding-1 text-white px-4 py-2 rounded-pill">Prize Already Claimed</span>
                        ) : item.drawPrizeState === 3 ? (
                          <span className="bg-branding-1 text-white px-4 py-2 rounded-pill">Prize Already Dispatched</span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </>
        )
      ) : (
        <div className="user-subscription-section font-face-sh pb-5">
          <div className="no-subscription-box bg-white rounded-3 p-4 mx-auto" style={{ maxWidth: 327, boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
            <p className="text-center fs-14 m-0" style={{ color: "#302d51" }}>
              <strong>Loading...</strong>
            </p>
          </div>
        </div>
      )}

      <Modal show={modalShow} onHide={() => setModalShow(false)} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton className="d-flex flex-column justify-content-start">
          <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-left">
            Claim Prize
          </Modal.Title>
          <p className="w-100 text-left m-0">Please fill the below bank details</p>
        </Modal.Header>
        <Modal.Body>
          <div className="claim-methods d-flex gap-2 mb-3">
            <Button
              onClick={() => {
                setBankAccount(true);
                setPaypal(false);
              }}
              className={
                bankaccount
                  ? "w-50 py-3 px-5 border border-2 border-white rounded-pill bg-branding-1 bg-branding-1-hover border border-branding-1 text-white text-decoration-none fs-6 lh-1 font-face-sh"
                  : "w-50 py-3 px-5 border border-2 border-white rounded-pill border border-branding-1 bg-transparent branding-1 branding-1-hover text-decoration-none fs-6 lh-1 font-face-sh"
              }
            >
              Bank Account
            </Button>
            <Button
              onClick={() => {
                setPaypal(true);
                setBankAccount(false);
              }}
              className={
                paypal
                  ? "w-50 py-3 px-5 border border-2 border-white rounded-pill bg-branding-1 bg-branding-1-hover border border-branding-1 text-white text-decoration-none fs-6 lh-1 font-face-sh"
                  : "w-50 py-3 px-5 border border-2 border-white rounded-pill border border-branding-1 bg-transparent branding-1 branding-1-hover text-decoration-none fs-6 lh-1 font-face-sh"
              }
            >
              PayPal
            </Button>
          </div>
          <div className={bankaccount ? "d-block" : "d-none"}>
            <input type="text" id="fuluserSurname" onChange={(event) => setFullName(event.target.value)} placeholder="Full Name" className="input" />
            <input type="text" id="accountnumber" onChange={(event) => setAccountNumber(event.target.value)} placeholder="Account Number" className="input" />
            <input type="text" id="sortcode" onChange={(event) => setSortCode(event.target.value)} placeholder="Sort Code" className="input" />

            <button
              type="submit"
              id="btn-signup"
              onClick={ClaimPrize}
              className="button btn bg-branding-green border-0 w-100 fs-5 font-face-sh-bold rounded-pill py-3 mt-3 mb-2 lh-1 text-light"
              style={{ backgroundColor: "rgb(5, 179, 4)" }}
            >
              Submit
            </button>
          </div>

          <div className={paypal ? "d-block" : "d-none"}>
            <input type="email" id="paypalemail" onChange={(event) => setPaypalEmail(event.target.value)} placeholder="Email Address" className="input" />

            <button
              type="submit"
              id="btn-signup"
              onClick={ClaimPrize}
              className="button btn bg-branding-green border-0 w-100 fs-5 font-face-sh-bold rounded-pill py-3 mt-3 mb-2 lh-1 text-light"
              style={{ backgroundColor: "rgb(5, 179, 4)" }}
            >
              Submit
            </button>
          </div>

          <div className="trusted-secure text-center my-2">
            <img src={require("../images/padlock.png")} className="d-inline-block" style={{ width: 20, height: "auto" }} />
            <span className="d-inline-block fw-bold branding-2 ms-1">Trusted Secure</span>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={modalShow2} onHide={() => setModalShow2(false)} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton className="d-flex flex-column justify-content-start">
          <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-left">
            Claim Prize
          </Modal.Title>
          <p className="w-100 text-left m-0">Please confirm your address below for delivery</p>
        </Modal.Header>
        <Modal.Body>
          <div>
            <input type="text" id="address1" onChange={(event) => setAddress1(event.target.value)} placeholder="Address Line 1" className="input" />
            <input type="text" id="address2" onChange={(event) => setAddress2(event.target.value)} placeholder="Address Line 2" className="input" />
            <input type="text" id="postcode" onChange={(event) => setPostcode(event.target.value)} placeholder="Postcode" className="input" />

            <button
              type="submit"
              id="btn-signup"
              onClick={ClaimPrize2}
              className="button btn bg-branding-green border-0 w-100 fs-5 font-face-sh-bold rounded-pill py-3 mt-3 mb-2 lh-1 text-light"
              style={{ backgroundColor: "rgb(5, 179, 4)" }}
            >
              Submit
            </button>
          </div>

          <div className="trusted-secure text-center my-2">
            <img src={require("../images/padlock.png")} className="d-inline-block" style={{ width: 20, height: "auto" }} />
            <span className="d-inline-block fw-bold branding-2 ms-1">Trusted Secure</span>
          </div>
        </Modal.Body>
      </Modal>
      <Footer />
      <ToastContainer />
    </>
  );
}
