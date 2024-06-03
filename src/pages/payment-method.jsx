import React, { useEffect, useState } from "react";
// import DashboardHeader from "../components/dashboard-header";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import creditCardType from "credit-card-type";
import { Helmet } from "react-helmet";

let header = { withCredentials: true, credentials: "same-origin" };
const luhn = require("luhn");

export default function PaymentMethod() {
  const navigate = useNavigate();
  const [isLoaded, setLoadComplete] = useState(false);
  const [PurchaseData, setPurchaseData] = useState([]);
  const secureUserData = secureLocalStorage.getItem("UserData");

  const siteID = process.env.REACT_APP_SITE_ID;
  const APIURL = process.env.REACT_APP_API_URL;

  console.log("DrawEntries", siteID);

  const [userPaymentMethodList, SetUserPaymentMethodList] = useState([]);
  const [paymentMethodChange, SetPaymentMethodChange] = useState(1);
  const [modalAddNewCard, SetModalAddNewCard] = useState(false);
  const [modalEditCard, SetModalEditCard] = useState(false);
  const [modalDeleteCard, SetModalDeleteCard] = useState(false);
  const [modalDefaultCard, SetModalDefaultCard] = useState(false);

  //selected_card
  const [selectedCard, SetSelectedCard] = useState(null);

  //add new card
  const [cardNumber, setCardNumber] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardExpiryDate, setCardExpiryDate] = useState("");
  const [clickPaymentMethodBtn, setClickPaymentMethodBtn] = useState(false);
  const [cardBrandLogo, setCardBrandLogo] = useState("");
  const [userFirstName, SetFname] = useState("");
  const [Lname, SetLname] = useState("");

  useEffect(() => {
    if (!secureUserData) {
      navigate("/login");
    } else {
      axios
        .get(`${APIURL}/users/${secureUserData.userID}/data`, {
          withCredentials: true,
          credentials: "same-origin",
        })
        .then((res) => {
          console.log(res.content);
          SetFname(res.data.content?.userFirstName);
          SetLname(res.data.content?.userSurname);
        });
    }
  }, []);

  const handleCardNumberChange = (event) => {
    let value = event.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(value);

    if (!value) {
      // If the card number is not entered or cleared, remove the card brand logo
      setCardBrandLogo("");
    } else {
      // Get the card brand based on the card number's BIN
      const cardType = creditCardType(value);
      if (cardType && cardType.length > 0) {
        // You can use this information to display the card brand logo
        const cardBrand = cardType[0].type.toLowerCase();
        // Assuming you have card brand logos in your assets folder
        setCardBrandLogo(cardBrand);
        console.log("cardBrandLogo:", cardBrandLogo);
      } else {
        setCardBrandLogo(""); // No brand logo found
      }
    }
  };

  const handleCardCVCChange = (event) => {
    let value = event.target.value;
    setCardCVC(value);
  };
  function handleCardExpiryDateChange(event) {
    const { value } = event.target;
    let formattedValue = value.replace(/\D/g, "").slice(0, 4);
    if (formattedValue.length > 2) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
    }
    setCardExpiryDate(formattedValue);
  }

  async function handleAddUserPaymentMethod(event) {
    console.log("handleAddUserPaymentMethod:");
    if (!luhn.validate(cardNumber) || cardNumber === "") {
      toast.error(`Invalid card number`);
      return;
    }

    if (cardExpiryDate.length === 0) {
      toast.error(`Invalid expiry date`);
      return;
    }

    let expYear = parseInt("20" + cardExpiryDate.split("/")[1]);
    let expMonth = parseInt(cardExpiryDate.split("/")[0]);

    if (parseInt(expYear) < new Date().getFullYear()) {
      toast.error(`Invalid expiry Year`);
      return;
    }

    // Check that the expiration date is a valid future date
    const expDate = new Date(`${expYear}-${expMonth}-01`);
    const currentDate = new Date();
    if (expDate < currentDate || expMonth > 12 || parseInt(expMonth) === 0) {
      toast.error(`Card is expired`);
      return;
    }

    // Check that the CVC is a valid number
    const cvcRegex = /^[0-9]{3,4}$/; // Regex to match 3- or 4-digit numbers
    if (!cvcRegex.test(cardCVC)) {
      toast.error(`Invalid CVC`);
      return;
    }

    let body = {
      userID: secureUserData.userID,
      action: "addPaymentMethod",
      cardNumber: cardNumber,
      cardCVC: cardCVC,
      expMonth: cardExpiryDate.split("/")[0],
      expYear: cardExpiryDate.split("/")[1],
    };

    setClickPaymentMethodBtn(true);
    let res = await actionUserPaymentMethod(body);
    console.log("AddUserPaymentMethod:", res);
    setClickPaymentMethodBtn(false);

    if (res.data?.status) {
      toast.success(res.data.content.message);
      updatePaymentMethod();
      SetModalAddNewCard(false);
    } else {
      if (res.response?.data?.status !== true) {
        toast.error(res.response.data.error.msg);
      } else {
        toast.error("Unknown Error!");
      }
    }
  }

  async function handleEditUserPaymentMethod(event) {
    // if (!luhn.validate(m_cardNumber)) {
    //   toast.error(`Invalid card number`);
    //   return;
    // }
    let expYear = parseInt("20" + cardExpiryDate.split("/")[1]);
    let expMonth = parseInt(cardExpiryDate.split("/")[0]);

    if (cardExpiryDate.length === 0) {
      toast.error(`Invalid expiry date`);
      return;
    }

    if (parseInt(expYear) < new Date().getFullYear()) {
      toast.error(`Invalid expiry Year`);
      return;
    }

    // Check that the expiration date is a valid future date
    const expDate = new Date(`${expYear}-${expMonth}-01`);
    const currentDate = new Date();
    if (expDate < currentDate || expMonth > 12 || expMonth === 0) {
      toast.error(`Card is expired`);
      return;
    }

    // // Check that the CVC is a valid number
    // const cvcRegex = /^[0-9]{3,4}$/; // Regex to match 3- or 4-digit numbers
    // if (!cvcRegex.test(m_cardCVC)) {
    //   toast.error(`Invalid CVC`);
    //   return;
    // }

    let body = {
      userID: secureUserData.userID,
      paymentMethodID: selectedCard.paymentMethodID,
      action: "editPaymentMethod",
      // cardNumber: m_cardNumber.replace(/\D/g, ""),
      // cardCVC: m_cardCVC,
      expMonth: expMonth,
      expYear: expYear,
    };

    setClickPaymentMethodBtn(true);
    let res = await actionUserPaymentMethod(body);
    console.log("EditUserPaymentMethod:", res);
    setClickPaymentMethodBtn(false);

    if (res.data?.status) {
      toast.success(res.data.content.message);
      updatePaymentMethod();
      SetModalEditCard(false);
    } else {
      if (res.response?.data?.status !== true) {
        toast.error(res.response.data.error.msg);
      } else {
        toast.error("Unknown Error!");
      }
    }
  }

  async function handleDeleteUserPaymentMethod(event) {
    let body = {
      userID: secureUserData.userID,
      paymentMethodID: selectedCard.paymentMethodID,
      action: "deletePaymentMethod",
    };

    setClickPaymentMethodBtn(true);
    let res = await actionUserPaymentMethod(body);
    console.log("deleteUserPaymentMethod:", res);
    setClickPaymentMethodBtn(false);

    if (res.data?.status) {
      toast.success(res.data.content.message);
      updatePaymentMethod();
      SetModalDeleteCard(false);
    } else {
      if (res.response?.data?.status !== true) {
        toast.error(res.response.data.error.msg);
      } else {
        toast.error("Unknown Error!");
      }
    }
  }

  async function handleDefaultUserPaymentMethod(event) {
    let body = {
      userID: secureUserData.userID,
      paymentMethodID: selectedCard.paymentMethodID,
      action: "setDefaultPaymentMethod",
    };

    setClickPaymentMethodBtn(true);
    let res = await actionUserPaymentMethod(body);
    console.log("setDefaultUserPaymentMethod:", res);
    setClickPaymentMethodBtn(false);

    if (res.data?.status) {
      toast.success(res.data.content.message);
      updatePaymentMethod();
      SetModalDefaultCard(false);
    } else {
      if (res.response?.data?.status !== true) {
        toast.error(res.response.data.error.msg);
      } else {
        toast.error("Unknown Error!");
      }
    }
  }

  function updatePaymentMethod() {
    SetPaymentMethodChange(paymentMethodChange + 1);
  }

  async function actionUserPaymentMethod(body) {
    try {
      const res = await axios.post(APIURL + `/users/cardInfo`, body, header);
      console.log("addUserPaymentMethod:", res);
      return res;
    } catch (err) {
      console.log("result error:", err);
      return err;
    }
  }

  async function getUserPaymentMethodList(body) {
    try {
      const res = await axios.post(APIURL + `/users/cardInfo`, body, header);
      console.log("getUserPaymentMethods", res);

      if (res.data?.content?.status === 200) {
        let payment_method_list = [];
        if (Array.isArray(res.data?.content?.payment_method_list?.data)) {
          let default_payment_method = null;
          for (let i = 0; i < res.data.content.payment_method_list.data.length; i++) {
            let payment_method = {
              paymentMethodID: res.data.content.payment_method_list.data[i].id,
              cardBrand: res.data.content.payment_method_list.data[i].card.brand,
              cardNumber: "XXXXXXXXXXXX" + res.data.content.payment_method_list.data[i].card.last4,
              expMonth: res.data.content.payment_method_list.data[i].card.exp_month,
              expYear: res.data.content.payment_method_list.data[i].card.exp_year,
              last4: res.data.content.payment_method_list.data[i].card.last4,
              obj: res.data.content.payment_method_list.data[i],
            };

            if (payment_method.paymentMethodID === res.data.content.default_payment_method_id) {
              default_payment_method = payment_method;
            } else {
              payment_method_list.push(payment_method);
            }
          }
          // payment_method_list = payment_method_list.reverse();
          if (!res.data.content.default_payment_method_id) {
            let payment_method = {
              paymentMethodID: null,
              cardBrand: "____",
              cardNumber: "No default",
              expMonth: "XX",
              expYear: "XXXX",
              last4: "XXXX",
              obj: null,
            };
            payment_method_list.unshift(payment_method);
          } else {
            payment_method_list.unshift(default_payment_method);
          }
        }
        return payment_method_list;
      }

      return [];
    } catch (err) {
      console.log("result error:", err);
      return err;
    }
  }

  useEffect(() => {
    if (!secureUserData) {
      navigate("/login");
    } else {
      console.log("call payment method =--------------------------------------");
      getUserPaymentMethodList({ userID: secureUserData.userID, action: "getPaymentMethods" }).then((res) => {
        if (Array.isArray(res)) {
          SetUserPaymentMethodList(res);
        } else {
          SetUserPaymentMethodList([]);
        }
        setLoadComplete(true);
      });
    }
  }, [paymentMethodChange]);

  return (
    <>
      <Helmet>
        <title>Billing & Payment | Secure Transactions with Hendrix Archive Draw</title>
        <meta name="description" content="Effortlessly manage your billing details and transactions, knowing your information is handled with utmost security." />
      </Helmet>
      {/* <DashboardHeader active="payment-method" /> */}
      <ToastContainer />

      <Modal show={modalAddNewCard} onHide={() => SetModalAddNewCard(false)} size="md" centered>
        <Modal.Header closeButton style={{ position: "relative" }} className="payment-card-modal-header px-3">
          <Modal.Title>
            <div className="fw-bold branding-1">Add A New Card</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="payment-card-modal-body">
          <div className="px-3">
            <div className="row position-relative">
              <label htmlFor="card_number" className="p-0 mb-2">
                Card Number:
              </label>
              <div className="position-relative p-0">
                <input
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength={19}
                  className="rounded-pill w-100"
                  style={{ border: "1px solid #C9C9C9", padding: "13px 20px" }}
                />
                {/* Display the card brand logo */}
                {cardBrandLogo && (
                  <img
                    src={require(`../images/payment-logos/${cardBrandLogo}-logo.png`)}
                    className="position-absolute card-brand-logo-type"
                    style={{ width: "50px", right: "20px", top: "0px", bottom: "0px", margin: "auto" }}
                    alt="Card Brand Logo"
                  />
                )}
              </div>
            </div>
            {/* <div className='row mt-3 position-relative'>
              <label htmlFor="card_number" className='p-0 mb-2'>Card Holder Name:</label>
              <div className='position-relative p-0'>
              <input
                value={cardHolderName}
                onChange={handleCardHolderNameChange}
                placeholder="e.g. John Doe"
                maxLength={19}
                className='rounded-pill w-100'
                style={{ border: '1px solid #C9C9C9', padding: "13px 20px" }}
              />
              </div>
            </div> */}
            <div className="row mt-3">
              <div className="col-6">
                <div className="row pe-2">
                  <label className="p-0 mb-2">Expiry date:</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiryDate}
                    onChange={handleCardExpiryDateChange}
                    className="rounded-pill"
                    style={{ border: "1px solid #C9C9C9", padding: "13px 20px" }}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="row ps-2">
                  <label className="p-0 mb-2">CVC/CVV:</label>
                  <input
                    type="text"
                    value={cardCVC}
                    onChange={handleCardCVCChange}
                    placeholder="XXX"
                    maxLength={4}
                    className="rounded-pill"
                    style={{ border: "1px solid #C9C9C9", padding: "13px 20px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="payment-card-modal-footer">
          <div className="px-3 pb-3 w-100 d-flex justify-content-center card-foot-inner">
            <div className="row">
              <div
                style={{
                  display: "flex",
                }}
              >
                <div className="d-flex">
                  <div>
                    <input
                      className="btn text-white rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                      type="button"
                      name="submit"
                      value="Cancel"
                      onClick={() => {
                        SetModalAddNewCard(false);
                      }}
                      style={{ lineHeight: 2, width: "120px", backgroundColor: "#DC3545" }}
                    />
                  </div>
                  <div className="ms-3">
                    <input
                      className="btn bg-branding-1 text-white rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                      type="button"
                      name="submit"
                      value="Save"
                      disabled={clickPaymentMethodBtn}
                      onClick={() => {
                        handleAddUserPaymentMethod();
                      }}
                      style={{ lineHeight: 2, width: "120px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="trusted-secure text-center my-2 w-100 d-flex justify-content-center">
            <img src={require("../images/padlock.png")} className="d-inline-block" style={{ width: 20, height: "auto" }} />
            <span className="d-inline-block fw-bold branding-2 ms-1" style={{ color: "#999999" }}>
              Trusted Secure
            </span>
          </div>
        </Modal.Footer>
      </Modal>
      {selectedCard && (
        <Modal show={modalEditCard} onHide={() => SetModalEditCard(false)} size="md" centered>
          <Modal.Header closeButton style={{ position: "relative" }} className="payment-card-modal-header px-3">
            <Modal.Title>
              <div className="fw-bold branding-1">Edit Card</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="payment-card-modal-body">
            <div className="px-3">
              <div className="row">
                <label htmlFor="card_number" className="p-0 mb-2">
                  Card Number:
                </label>
                <div className="position-relative p-0">
                  <input
                    // disabled="true"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength={19}
                    className="rounded-pill w-100"
                    style={{ border: "1px solid #C9C9C9", padding: "13px 20px" }}
                  />
                  {/* Display the card brand logo */}
                  {cardBrandLogo && (
                    <img
                      src={require(`../images/payment-logos/${cardBrandLogo}-logo.png`)}
                      className="position-absolute card-brand-logo-type"
                      style={{ width: "50px", right: "20px", top: "0px", bottom: "0px", margin: "auto" }}
                      alt="Card Brand Logo"
                    />
                  )}
                </div>
              </div>
              {/* <div className='row mt-3'>
                <label htmlFor="card_number" className='p-0 mb-2'>Card Holder Name:</label>
                <div className='position-relative p-0'>
                <input
                  value={cardHolderName}
                  onChange={handleCardHolderNameChange}
                  placeholder="e.g. John Doe"
                  maxLength={19}
                  className='rounded-pill w-100'
                  style={{ border: '1px solid #C9C9C9', padding: "13px 20px" }}
                />
                </div>
              </div> */}
              <div className="row mt-3">
                <div className="col-6">
                  <div className="row pe-2">
                    <label className="p-0 mb-2">Expiry date:</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiryDate}
                      onChange={handleCardExpiryDateChange}
                      className="rounded-pill"
                      style={{ border: "1px solid #C9C9C9", padding: "13px 20px" }}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="row ps-2">
                    <label className="p-0 mb-2">CVC/CVV:</label>
                    <input
                      type="text"
                      // disabled="true"
                      value={cardCVC}
                      onChange={handleCardCVCChange}
                      placeholder="XXX"
                      maxLength={4}
                      className="rounded-pill"
                      style={{ border: "1px solid #C9C9C9", padding: "13px 20px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="payment-card-modal-footer">
            <div className="px-3 pb-3 w-100 d-flex justify-content-center card-foot-inner">
              <div className="row">
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div className="d-flex">
                    <div>
                      <input
                        className="btn text-white rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Cancel"
                        onClick={() => {
                          SetModalEditCard(false);
                        }}
                        style={{ lineHeight: 2, width: "120px", backgroundColor: "#DC3545" }}
                      />
                    </div>
                    <div className="ms-3">
                      <input
                        className="btn bg-branding-1 text-white rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Save"
                        disabled={clickPaymentMethodBtn}
                        onClick={() => {
                          handleEditUserPaymentMethod();
                        }}
                        style={{ lineHeight: 2, width: "120px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="trusted-secure text-center my-2 w-100 d-flex justify-content-center">
              <img src={require("../images/padlock.png")} className="d-inline-block" style={{ width: 20, height: "auto" }} />
              <span className="d-inline-block fw-bold branding-2 ms-1" style={{ color: "#999999" }}>
                Trusted Secure
              </span>
            </div>
          </Modal.Footer>
        </Modal>
      )}
      {selectedCard && (
        <Modal show={modalDeleteCard} onHide={() => SetModalDeleteCard(false)} size="md" centered>
          <Modal.Header closeButton style={{ position: "relative" }} className="payment-card-modal-header px-md-4 px-3">
            <Modal.Title>
              <div className="fw-bold branding-1">Remove Card</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="payment-card-modal-body px-md-4 px-3">
            <div>
              <div className="row">
                <h5>Are you sure you want to remove this payment method?</h5>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <div className="px-3 pb-3">
              <div className="row">
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div className="d-flex">
                    <div>
                      <input
                        className="btn text-white rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Cancel"
                        onClick={() => {
                          SetModalDeleteCard(false);
                        }}
                        style={{ lineHeight: 2, width: "120px", backgroundColor: "#DC3545" }}
                      />
                    </div>
                    <div className="ms-3">
                      <input
                        className="btn bg-branding-1 text-white rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Yes"
                        disabled={clickPaymentMethodBtn}
                        onClick={() => {
                          handleDeleteUserPaymentMethod();
                        }}
                        style={{ lineHeight: 2, width: "120px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      )}
      {selectedCard && (
        <Modal show={modalDefaultCard} onHide={() => SetModalDefaultCard(false)} size="md" centered>
          <Modal.Header closeButton style={{ position: "relative" }} className="payment-card-modal-header px-md-4 px-3">
            <Modal.Title>
              <div className="fw-bold branding-1">Set Default Card</div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="payment-card-modal-body px-md-4 px-3">
            <div>
              <div className="row">
                <h5>Would you like to set this as your default payment method?</h5>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <div className="px-3 pb-3">
              <div className="row">
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div className="d-flex">
                    <div>
                      <input
                        className="btn text-white rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Cancel"
                        onClick={() => {
                          SetModalDefaultCard(false);
                        }}
                        style={{ lineHeight: 2, width: "120px", backgroundColor: "#DC3545" }}
                      />
                    </div>
                    <div className="ms-3">
                      <input
                        className="btn bg-branding-1 text-white rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Yes"
                        disabled={clickPaymentMethodBtn}
                        onClick={() => {
                          handleDefaultUserPaymentMethod();
                        }}
                        style={{ lineHeight: 2, width: "120px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      )}

      {isLoaded ? (
        userPaymentMethodList.length === 0 ? (
          <div className="user-subscription-section font-face-sh pb-5">
            <div className="no-subscription-box bg-white rounded-3 p-4 mx-auto" style={{ maxWidth: 450, boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
              <div className="d-flex justify-content-center mb-3">
                <input
                  className="btn bg-branding-1 text-white text-uppercase text-center rounded-pill align-self-center px-3 py-2 fs-6 fw-bold"
                  type="button"
                  name="submit"
                  value="Add A New Card"
                  onClick={() => {
                    setCardNumber("");
                    setCardExpiryDate("");
                    setCardCVC("");
                    SetModalAddNewCard(true);
                  }}
                  style={{ lineHeight: 2, width: "200px", border: "1px solid #ccc" }}
                />
              </div>
              <p className="text-center fs-14 m-0" style={{ color: "#302d51" }}>
                <strong>There is no payment methods. Please add a new one.</strong>
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="user-subscription-section font-face-sh pb-5">
              <div className="no-subscription-box bg-white rounded-3 p-4 mx-auto container" style={{ boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
                <div className="d-flex justify-content-center mb-3">
                  <input
                    className="btn bg-branding-1 text-uppercase text-white text-center rounded-pill align-self-center px-3 py-2 fs-6 fw-bold"
                    type="button"
                    name="submit"
                    value="Add A New Card"
                    onClick={() => {
                      setCardNumber("");
                      setCardExpiryDate("");
                      setCardCVC("");
                      SetModalAddNewCard(true);
                    }}
                    style={{ lineHeight: 2, width: "200px", border: "1px solid #ccc" }}
                  />
                </div>

                {/* {
                  userPaymentMethodList.map((row, index) => {
                    return (
                      <div key={row.paymentMethodID} className='row mt-3'>
                        {
                          index === 0 && <div className='col-12 mb-2'>Default:</div>
                        }
                        {
                          index === 1 && <div className='col-12 mb-2'>Others:</div>
                        }

                        <div className='col-12' style={{ position: 'relative' }}>
                          <input type="text" name="method" placeholder="XXXX XXXX XXXX XXXX" value={"XXXX XXXX XXXX " + row.last4 + ' | ' + row.expMonth + '/' + row.expYear} disabled={true} className='rounded-pill align-self-center w-100 px-4 p-3 bg-white border-0' />

                          <div
                            style={{
                              position: 'absolute',
                              border: 'none',
                              right: '30px',
                              top: '10px',
                              fontSize: '20px',
                              background: 'transparent',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>

                            {
                              index !== 0 && <button
                                onClick={() => {
                                  setCardNumber("XXXX XXXX XXXX " + row.last4);
                                  setCardExpiryDate((row.expMonth > 9 ? row.expMonth : '0' + row.expMonth) + "/" + row.expYear.toString().substr(2, 3));
                                  setCardCVC('XXX');
                                  SetSelectedCard(row);
                                  SetModalDefaultCard(true);
                                }}
                                style={{
                                  border: 'none',
                                  fontSize: '20px',
                                  background: 'transparent',
                                }}>
                                <i className='fa fa-check-circle'></i>
                              </button>
                            }
                            {
                              index !== 0 && <button
                                onClick={() => {
                                  setCardNumber("XXXX XXXX XXXX " + row.last4);
                                  setCardExpiryDate((row.expMonth > 9 ? row.expMonth : '0' + row.expMonth) + "/" + row.expYear.toString().substr(2, 3));
                                  setCardCVC('XXX');
                                  SetSelectedCard(row);
                                  SetModalDeleteCard(true);
                                }}
                                style={{
                                  border: 'none',
                                  fontSize: '20px',
                                  background: 'transparent',
                                }}>
                                <i className='fa fa-trash'></i>
                              </button>
                            }
                            <button
                              onClick={() => {
                                setCardNumber("XXXX XXXX XXXX " + row.last4);
                                setCardExpiryDate((row.expMonth > 9 ? row.expMonth : '0' + row.expMonth) + "/" + row.expYear.toString().substr(2, 3));
                                setCardCVC('XXX');
                                SetSelectedCard(row);
                                SetModalEditCard(true);
                              }}
                              style={{
                                border: 'none',
                                fontSize: '20px',
                                background: 'transparent',
                              }}>
                              <i className='fa fa-edit'></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                } */}

                <div className="row mt-5 p-0 align-items-center justify-content-center">
                  {/* {
                        index === 0 && <div className='col-12 mb-2'>Default:</div>
                      }
                      {
                        index === 1 && <div className='col-12 mb-2'>Others:</div>
                      } */}
                  {userPaymentMethodList.map((row, index) => {
                    return (
                      <div key={index} className="col-lg-4 col-md-4 col-sm-12 p-0 mb-4" style={{ position: "relative" }}>
                        <div className="m-md-3 py-4 px-md-4 px-3 border border-2 shadow-lg bg-white position-relative" style={{ borderRadius: "20px" }}>
                          {index === 0 && (
                            <div
                              className="position-absolute"
                              style={{ right: "-11px", top: "-12px", backgroundColor: "#f4c00c", color: "#393011", padding: "1px 10px", borderRadius: "5px" }}
                            >
                              Default
                            </div>
                          )}
                          <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "-4px" }}>
                            <h4 className="fs-5 align-self-center w-100 bg-white border-0 mb-2 fw-bold text-capitalize payment-card-number">
                              XXXX XXXX XXXX {row.last4 ? row.last4 : "XXXX"}
                            </h4>
                            {row?.cardBrand === "visa" ? (
                              <img
                                src={require(`../images/payment-logos/visa-logo.png`)}
                                className="position-relative card-brand-logo"
                                style={{ width: "50px", top: "-3px" }}
                                alt="Card Brand Logo"
                              />
                            ) : (
                              ""
                            )}
                            {row?.cardBrand === "mastercard" ? (
                              <img
                                src={require(`../images/payment-logos/mastercard-logo.png`)}
                                className="position-relative card-brand-logo"
                                style={{ width: "50px", top: "-3px" }}
                                alt="Card Brand Logo"
                              />
                            ) : (
                              ""
                            )}
                            {row?.cardBrand === "amex" ? (
                              <img
                                src={require(`../images/payment-logos/amex-logo.png`)}
                                className="position-relative card-brand-logo"
                                style={{ width: "50px", top: "-3px" }}
                                alt="Card Brand Logo"
                              />
                            ) : (
                              ""
                            )}
                            {row?.cardBrand === "american-express" ? (
                              <img
                                src={require(`../images/payment-logos/american-express-logo.png`)}
                                className="position-relative card-brand-logo"
                                style={{ width: "50px", top: "-3px" }}
                                alt="Card Brand Logo"
                              />
                            ) : (
                              ""
                            )}
                            {row?.cardBrand === "discover" ? (
                              <img
                                src={require(`../images/payment-logos/discover-logo.png`)}
                                className="position-relative card-brand-logo"
                                style={{ width: "50px", top: "-3px" }}
                                alt="Card Brand Logo"
                              />
                            ) : (
                              ""
                            )}
                            {row?.cardBrand === "jcb" ? (
                              <img
                                src={require(`../images/payment-logos/jcb-logo.png`)}
                                className="position-relative card-brand-logo"
                                style={{ width: "50px", top: "-3px" }}
                                alt="Card Brand Logo"
                              />
                            ) : (
                              ""
                            )}
                            {row?.cardBrand === "diners-club" ? (
                              <img
                                src={require(`../images/payment-logos/diners-club-logo.png`)}
                                className="position-relative card-brand-logo"
                                style={{ width: "50px", top: "-3px" }}
                                alt="Card Brand Logo"
                              />
                            ) : (
                              ""
                            )}
                            {row?.cardBrand === "unionpay" ? (
                              <img
                                src={require(`../images/payment-logos/unionpay-logo.png`)}
                                className="position-relative card-brand-logo"
                                style={{ width: "50px", top: "-3px" }}
                                alt="Card Brand Logo"
                              />
                            ) : (
                              ""
                            )}
                            {row?.cardBrand === "maestro" ? (
                              <img
                                src={require(`../images/payment-logos/maestro-logo.png`)}
                                className="position-relative card-brand-logo"
                                style={{ width: "50px", top: "-3px" }}
                                alt="Card Brand Logo"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <h4 className="fs-5 align-self-center w-100 bg-white border-0 mb-2 payment-card-holdername">
                            {row?.obj?.billing_details?.name ? row?.obj?.billing_details?.name : userFirstName + " " + Lname ? userFirstName + " " + Lname : ""}
                          </h4>
                          {/* <h4 className='align-self-center w-100 bg-white border-0 mb-2 fs-5 mb-4' style={{color: '#7d7d7d'}}>Expires {row.expMonth + '/' + row.expYear}</h4> */}
                          <div className="mt-2 d-flex">
                            <div className=" me-5">
                              <p className="m-0" style={{ fontSize: "0.95rem", color: "#7d7d7d" }}>
                                EXP DATE
                              </p>
                              <p className="fw-bold" style={{ fontSize: "0.95rem", color: "#7d7d7d" }}>
                                {row.expMonth ? row.expMonth : "XX"}/{row.expYear ? row.expYear : "XX"}
                              </p>
                            </div>
                            <div className="">
                              <p className="m-0" style={{ fontSize: "0.95rem", color: "#7d7d7d" }}>
                                CVC
                              </p>
                              <p className="fw-bold" style={{ fontSize: "0.95rem", color: "#7d7d7d" }}>
                                XXX
                              </p>
                            </div>
                          </div>

                          <div
                            style={{
                              // position: 'absolute',
                              border: "none",
                              right: "30px",
                              top: "10px",
                              fontSize: "20px",
                              background: "transparent",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {/* {
                            index !== 0 &&  */}
                            <button
                              className="text-white fs-6 px-3 text-uppercase py-1 w-50 rounded-pill align-self-center fw-bold"
                              onClick={() => {
                                setCardNumber("XXXX XXXX XXXX " + row.last4);
                                setCardExpiryDate((row.expMonth > 9 ? row.expMonth : "0" + row.expMonth) + "/" + row.expYear.toString().substr(2, 3));
                                setCardCVC("XXX");
                                SetSelectedCard(row);
                                SetModalDeleteCard(true);
                              }}
                              style={{
                                border: "none",
                                lineHeight: 2,
                                backgroundColor: "#DC3545",
                                // fontSize: '20px',
                                // background: 'transparent',
                              }}
                            >
                              {/* <i className='fa fa-trash'></i> */}
                              Remove
                            </button>
                            {/* } */}
                            <button
                              className="bg-branding-1 text-uppercase text-white fs-6 px-3 py-1 ms-2 w-50 rounded-pill align-self-center fw-bold"
                              onClick={() => {
                                setCardNumber("XXXX XXXX XXXX " + row.last4);
                                setCardExpiryDate((row.expMonth > 9 ? row.expMonth : "0" + row.expMonth) + "/" + row.expYear.toString().substr(2, 3));
                                setCardCVC("XXX");
                                SetSelectedCard(row);
                                SetModalEditCard(true);
                              }}
                              style={{
                                border: "none",
                                lineHeight: 2,
                                // fontSize: '18px',
                                // background: 'transparent',
                              }}
                            >
                              {/* <i className='fa fa-edit'></i> */}
                              Edit
                            </button>
                            {index !== 0 && (
                              <button
                                className="bg-branding-green text-white fs-6 ms-2 rounded-circle d-flex align-items-center justify-content-center align-self-center fw-bold make-default-btn"
                                onClick={() => {
                                  setCardNumber("XXXX XXXX XXXX " + row.last4);
                                  setCardExpiryDate((row.expMonth > 9 ? row.expMonth : "0" + row.expMonth) + "/" + row.expYear.toString().substr(2, 3));
                                  setCardCVC("XXX");
                                  SetSelectedCard(row);
                                  SetModalDefaultCard(true);
                                }}
                                title="Make Default"
                                style={{
                                  border: "none",
                                  width: "50px",
                                  height: "40px",
                                }}
                              >
                                {/* Make Default */}
                                <i className="fa fa-check-circle fs-4"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
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
      <div className="mx-auto text-center pb-5 mb-5" style={{ maxWidth: 327 }}>
        <Link
          to={"/subscription-plan"}
          className="cta-large-button btn bg-branding-1 border-0 w-100 fs-5 font-face-sh-bold rounded-pill  py-2 mt-0 mb-2 lh-2 desktop-btn text-light"
          style={{ display: "block", height: 48 }}
        >
          Enter The Draw
        </Link>
      </div>
      <Footer />
    </>
  );
}
