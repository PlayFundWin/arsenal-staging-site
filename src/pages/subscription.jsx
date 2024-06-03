import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
// import DashboardHeader from "../components/dashboard-header";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import apiClient from "../api.config";
import useDocumentTitle from "../components/useDocumentTitle";
import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";

let header = { withCredentials: true, credentials: "same-origin" };

export default function Subscription() {
  useDocumentTitle("Subscription");
  const navigate = useNavigate();
  const [isLoaded, setLoadComplete] = useState(false);
  const [PurchaseData, setPurchaseData] = useState([]);
  const secureUserData = secureLocalStorage.getItem("UserData");

  const siteID = process.env.REACT_APP_SITE_ID;
  const APIURL = process.env.REACT_APP_API_URL;

  console.log("DrawEntries", siteID);

  const [userSubscriptionList, SetUserSubscriptionList] = useState([]);
  const [subscriptioniChange, SetSubscriptionChange] = useState(1);
  const [modalCancelHost, SetModalCancelHost] = useState(false);
  const [modalCancelDraw, SetModalCancelDraw] = useState(false);
  const [modalEditDraw, SetModalEditDraw] = useState(false);
  const [editQuantity, SetEditQuantity] = useState(1);
  const [selectHost, SetSelectHost] = useState(null);
  const [selectDraw, SetSelectDraw] = useState(null);
  const [showDetails, SetShowDetails] = useState({});
  const [clickProcessBtn, SetClickProcessBtn] = useState(false);

  //----------------------------- apis ---------------------------
  async function getUserSubscriptionList(userID) {
    try {
      const res = await axios.get(APIURL + `/users/${userID}/subscription`, header);
      console.log("getUserSubscriptionList", res);
      let host_list = [];

      if (Array.isArray(res.data?.content)) {
        for (let i = 0; i < res.data.content.length; i++) {
          if (siteID != res.data.content[i].siteID) continue;

          let selected_host = null;
          for (let iHost = 0; iHost < host_list.length; iHost++) {
            if (host_list[iHost].hostID == res.data.content[i].userSubscriptionHostID) {
              selected_host = host_list[iHost];
              break;
            }
          }
          if (selected_host == null) {
            selected_host = {
              hostName: res.data.content[i].hostName,
              hostID: res.data.content[i].userSubscriptionHostID,
              amount: 0,
              subscriptionType: "Monthly",
              active: [],
              cancel: [],
              other: [],
            };
            host_list.push(selected_host);
          }
          if (res.data.content[i].userSubscriptionStatusID == 3) {
            // SUBSCRIPTION_ACTIVE
            selected_host.active.push(res.data.content[i]);
            selected_host.amount += res.data.content[i].userSubscriptionAmount;
          } else if (res.data.content[i].userSubscriptionStatusID == 6) {
            // SUBSCRIPTION_CANCELLED
            selected_host.cancel.push(res.data.content[i]);
          } else {
            selected_host.other.push(res.data.content[i]);
          }
        }
        return host_list;
      }
      return [];
    } catch (err) {
      console.log("result error:", err);
      return err;
    }
  }

  async function cancelUserSubscriptionDraw(body) {
    //userSubscriptionID
    try {
      const res = await apiClient.post(APIURL + `/transactions/stripe/cancelSubscriptionDraw`, body);
      return res;
    } catch (err) {
      console.log("result error:", err);
      return err;
    }
  }

  async function cancelUserSubscriptionHost(body) {
    //hostID, UserID
    try {
      const res = await apiClient.post(APIURL + `/transactions/stripe/cancelSubscriptionHost`, body);
      return res;
    } catch (err) {
      console.log("result error:", err);
      return err;
    }
  }

  async function editUserSubscription(body) {
    //quantity
    try {
      const res = await apiClient.post(APIURL + `/transactions/stripe/editSubscription`, body);
      return res;
    } catch (err) {
      console.log("result error:", err);
      return err;
    }
  }

  // ------------------------------ apis end -------------------------------

  function updateSubscription() {
    SetSubscriptionChange(subscriptioniChange + 1);
  }

  async function handleCancelHost() {
    let userID = secureUserData.userID;
    let hostID = selectHost.hostID;
    SetClickProcessBtn(true);
    let res = await cancelUserSubscriptionHost({ userID, hostID });
    if (res.status) {
      toast.success(`Host Subscription successfully cancelled.`);
      updateSubscription();
      SetModalCancelHost(false);
    } else {
      if (res.response.status === 403) {
        toast.error(`${res.response.data.content.message}`);
      } else {
        toast.error(`${res.message}`);
      }
      SetModalCancelHost(false);
    }
    SetClickProcessBtn(false);
  }

  async function handleCancelDraw() {
    console.log("cancel draw subscription process ...");
    let userSubscriptionID = selectDraw.userSubscriptionID;
    let res = await cancelUserSubscriptionDraw({ userSubscriptionID });
    if (res.status) {
      toast.success(`Draw subscription successfully cancelled.`);
      updateSubscription();
      SetModalCancelDraw(false);
    } else {
      if (res.response.status === 403) {
        toast.error(`${res.response.data.content.message}`);
      } else {
        toast.error(`${res.message}`);
      }
      SetModalCancelDraw(false);
    }
    SetClickProcessBtn(false);
  }

  async function handleEditDraw() {
    console.log("edit draw subscription process ...");
    SetClickProcessBtn(true);

    if (selectDraw.userSubscriptionQuantity === editQuantity) {
      toast.error(`Please enter the changed value.`);
      return;
    }

    if (editQuantity === "" || editQuantity < 1) {
      toast.error(`Please enter a valid value.`);
      return;
    }

    let res = await editUserSubscription({
      type: 2, //Draw Subscription
      userSubscriptionID: selectDraw.userSubscriptionID,
      newQuantity: editQuantity,
    });
    console.log("edit draw res:", res);
    SetClickProcessBtn(false);
    if (res.status) {
      toast.success(`Draw subscription successfully updated.`);
      updateSubscription();
    } else {
      if (res.response.status === 403) {
        toast.error(`${res.response.data.content.message}`);
      } else {
        toast.error(`${res.message}`);
      }
    }
    SetModalEditDraw(false);
  }

  const handleQuantityChange = (event) => {
    let value = event.target.value;
    value = parseInt(value);
    if (isNaN(value)) {
      value = "";
    }
    SetEditQuantity(value);
  };

  function showDetailsHandler(hostID) {
    let cloneShowDetails = { ...showDetails };
    let key = "key_" + hostID;
    if (cloneShowDetails[key] === false) {
      cloneShowDetails[key] = true;
    } else if (cloneShowDetails[key] === true) {
      cloneShowDetails[key] = false;
    } else {
      cloneShowDetails[key] = true;
    }
    SetShowDetails(cloneShowDetails);
  }

  useEffect(() => {
    if (!secureUserData) {
      navigate("/login");
    } else {
      getUserSubscriptionList(secureUserData.userID).then((res) => {
        if (Array.isArray(res)) {
          SetUserSubscriptionList(res);
        } else {
          SetUserSubscriptionList([]);
        }
        setLoadComplete(true);
      });
    }
  }, [subscriptioniChange]);

  return (
    <>
      <Helmet>
        <title>My Subscriptions | Stay Updated with Your Hendrix Archive Draw Entries</title>
        <meta name="description" content="Manage your draw subscriptions, ensuring you never miss a chance to win big and support a cause you believe in." />
      </Helmet>
      {/* <DashboardHeader active="subscription" /> */}
      <ToastContainer />

      {selectHost && (
        <Modal show={modalCancelHost} onHide={() => SetModalCancelHost(false)} size="lg">
          <Modal.Header closeButton style={{ position: "relative" }}>
            <Modal.Title>
              <div className="px-3"> Cancel Host </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="px-3">
              <div className="row">
                <h5>Are you sure you want to cancel this host subscription?</h5>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="px-3">
              <div className="row">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <div className="row" style={{ flexDirection: "row-reverse" }}>
                    <div style={{ width: "150px" }}>
                      <input
                        className="btn pfw-button-green rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Yes"
                        disabled={clickProcessBtn}
                        onClick={() => {
                          handleCancelHost();
                        }}
                        style={{ lineHeight: 2, width: "120px" }}
                      />
                    </div>
                    <div style={{ width: "150px" }}>
                      <input
                        className="btn pfw-button-green rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Cancel"
                        onClick={() => {
                          SetModalCancelHost(false);
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

      {selectHost && selectDraw && (
        <Modal show={modalCancelDraw} onHide={() => SetModalCancelDraw(false)} size="lg">
          <Modal.Header closeButton style={{ position: "relative" }}>
            <Modal.Title>
              <div className="px-3"> Cancel Draw </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="px-3">
              <div className="row">
                <h5>Are you sure you want to cancel this draw subscription?</h5>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="px-3">
              <div className="row">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <div className="row" style={{ flexDirection: "row-reverse" }}>
                    <div style={{ width: "150px" }}>
                      <input
                        className="btn pfw-button-green rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Yes"
                        disabled={clickProcessBtn}
                        onClick={() => {
                          handleCancelDraw();
                        }}
                        style={{ lineHeight: 2, width: "120px" }}
                      />
                    </div>
                    <div style={{ width: "150px" }}>
                      <input
                        className="btn pfw-button-green rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Cancel"
                        onClick={() => {
                          SetModalCancelDraw(false);
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

      {selectHost && selectDraw && (
        <Modal show={modalEditDraw} onHide={() => SetModalEditDraw(false)} size="lg">
          <Modal.Header closeButton style={{ position: "relative" }}>
            <Modal.Title>
              <div className="px-3"> Edit Host/Draw </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="px-3">
              <div className="row">
                <div className="col-12">
                  <label style={{ width: "100px", textAlign: "right", paddingRight: "20px" }}>Price:</label> £ {selectDraw.userSubscriptionPrice}
                </div>
                <div className="col-12 mt-5">
                  <label style={{ width: "100px", textAlign: "right", paddingRight: "20px" }}>Quantity:</label>
                  <input
                    value={editQuantity}
                    onChange={handleQuantityChange}
                    placeholder="quantity"
                    maxLength={10}
                    style={{ borderRadius: "5px", border: "1px solid #C9C9C9", padding: "5px 20px" }}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="px-3">
              <div className="row">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <div className="row" style={{ flexDirection: "row-reverse" }}>
                    <div style={{ width: "150px" }}>
                      <input
                        className="btn pfw-button-green rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Yes"
                        disabled={clickProcessBtn}
                        onClick={() => {
                          handleEditDraw();
                        }}
                        style={{ lineHeight: 2, width: "120px" }}
                      />
                    </div>
                    <div style={{ width: "150px" }}>
                      <input
                        className="btn pfw-button-green rounded-pill align-self-center px-2 py-2 fs-6 fw-bold"
                        type="button"
                        name="submit"
                        value="Cancel"
                        onClick={() => {
                          SetModalEditDraw(false);
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
        userSubscriptionList.reduce((totalActive, userSubscription) => totalActive + userSubscription.active.length, 0) === 0 ? (
          <div className="user-subscription-section font-face-sh pb-5">
            <div className="no-subscription-box bg-white rounded-3 p-4 mx-auto" style={{ maxWidth: 450, boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
              <p className="text-center fs-16 m-0" style={{ color: "#302d51" }}>
                You do not have any subscriptions. Please choose your preferred subscription plan here.
              </p>
            </div>
          </div>
        ) : (
          <>
            {userSubscriptionList.map((row, index) => {
              return (
                row.amount > 0 && (
                  <React.Fragment key={row.hostID}>
                    <div className="user-subscription-section font-face-sh pb-5">
                      <div className="no-subscription-box bg-white rounded-3 p-4 mx-auto" style={{ maxWidth: 450, boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
                        <div className="row" style={{ borderRadius: "10px", backgroundColor: "#FFF", marginTop: "10px", padding: "10px" }}>
                          <div className="col-12">
                            <label htmlFor="" style={{ fontSize: "18px", fontWeight: "bold" }}>
                              {" "}
                              Host: {row.hostName}{" "}
                            </label>
                          </div>
                          <div className="col-12">
                            <label htmlFor=""> Amount: {row.amount} </label>
                          </div>
                          <div className="col-6">
                            <label htmlFor=""> Subscription Type: {row.subscriptionType} </label>
                          </div>
                          <div className="col-6" style={{ justifyContent: "space-around", display: "flex" }}>
                            <input
                              className="btn pfw-button-green rounded-pill align-self-center px-1 py-1 fs-6 fw-bold"
                              type="button"
                              name="submit"
                              value="Cancel"
                              onClick={() => {
                                SetSelectHost(row);
                                SetModalCancelHost(true);
                              }}
                              style={{ lineHeight: 1.5, width: "150px" }}
                            />
                            {/* <input
                            className="btn pfw-button-green rounded-pill align-self-center px-1 py-1 fs-6 fw-bold"
                            type="button"
                            name="submit"
                            value="Edit"
                            onClick={() => {
                            }}
                            style={{ lineHeight: 1.5, width: '150px' }} /> */}
                          </div>
                          <div className="col-12">
                            <button
                              style={{ border: "none", padding: "10px" }}
                              onClick={() => {
                                showDetailsHandler(row.hostID);
                              }}
                            >
                              {showDetails["key_" + row.hostID] ? <i className="fa fa-minus-square"></i> : <i className="fa fa-plus-square"></i>} View details{" "}
                            </button>
                          </div>
                          {showDetails["key_" + row.hostID] && (
                            <div className="col-12">
                              <div
                                style={{
                                  padding: "30px 30px",
                                  background: "buttonface",
                                }}
                              >
                                {row.active.map((row2, index) => {
                                  return (
                                    <React.Fragment key={row2.userSubscriptionID}>
                                      <div className="row" style={{ borderBottom: "3px solid #FFF" }}>
                                        <div className="col-6">
                                          <div className="row">
                                            <div className="col-12" style={{}}>
                                              Draw Name: {row2.drawName}
                                            </div>
                                            <div className="col-12" style={{}}>
                                              Price: £{row2.userSubscriptionPrice}
                                            </div>
                                            <div className="col-12" style={{}}>
                                              Quantity: {row2.userSubscriptionQuantity}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-6" style={{ paddingTop: "20px", display: "flex", justifyContent: "space-around" }}>
                                          <input
                                            className="btn pfw-button-green rounded-pill align-self-center px-1 py-1 fs-6 fw-bold"
                                            type="button"
                                            name="submit"
                                            value="Cancel"
                                            onClick={() => {
                                              SetSelectHost(row);
                                              SetSelectDraw(row2);
                                              SetModalCancelDraw(true);
                                            }}
                                            style={{ lineHeight: 1.5, width: "150px" }}
                                          />
                                          <input
                                            className="btn pfw-button-green rounded-pill align-self-center px-1 py-1 fs-6 fw-bold"
                                            type="button"
                                            name="submit"
                                            value="Edit"
                                            onClick={() => {
                                              SetSelectHost(row);
                                              SetSelectDraw(row2);
                                              SetEditQuantity(row2.userSubscriptionQuantity);
                                              SetModalEditDraw(true);
                                            }}
                                            style={{ lineHeight: 1.5, width: "150px" }}
                                          />
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              );
            })}
          </>
        )
      ) : (
        <div className="user-subscription-section font-face-sh pb-5">
          <div className="no-subscription-box bg-white rounded-3 p-4 mx-auto" style={{ maxWidth: 327, boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
            <p className="text-center fs-16 m-0" style={{ color: "#302d51" }}>
              <strong>Loading...</strong>
            </p>
          </div>
        </div>
      )}
      <div className="mx-auto text-center pb-5" style={{ maxWidth: 327 }}>
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
