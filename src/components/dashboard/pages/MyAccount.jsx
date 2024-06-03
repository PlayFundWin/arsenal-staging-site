// DashboardDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import apiClient from "../../../api.config";
import useDocumentTitle from "../../useDocumentTitle";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Helmet } from "react-helmet";

const DashboardDetails = () => {
  useDocumentTitle("Edit Profile");
  const navigate = useNavigate();
  const [isLoaded, setLoadComplete] = useState(false);
  const [PurchaseData, setPurchaseData] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setFirstName] = useState("");
  const [userLastName, setLastName] = useState("");
  const [userAddreess1, setAddreess1] = useState("");
  const [userAddreess2, setAddreess2] = useState("");
  const [userPostcode, setUserPostcode] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [defaultData, setDefaultData] = useState();
  const [userFetch, setUserFetch] = useState();
  const secureUserData = secureLocalStorage.getItem("UserData");

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
          setUserFetch(res.data.content);
          setUserEmail(res.data.content.userEmail);
          setFirstName(res.data.content.userFirstName);
          setLastName(res.data.content.userSurname);
          setAddreess1(res.data.content.userAddressLine1);
          setAddreess2(res.data.content.userAddressLine2);
          setUserPostcode(res.data.content.userAddressPostcode);
          setUserPhoneNumber(res.data.content.userPhoneNumber);
          setLoadComplete(true);
          setDefaultData({
            userEmail: res.data.content.userEmail,
            userFirstName: res.data.content.userFirstName,
            userSurname: res.data.content.userSurname,
            userAddressLine1: res.data.content.userAddressLine1,
            userAddressLine2: res.data.content.userAddressLine2,
            userAddressPostcode: res.data.content.userAddressPostcode,
            userPhoneNumber: res.data.content.userPhoneNumber,
          });
        });
    }
  }, []);

  const handleSubmit = async () => {
    let fieldsToUpdate = { userID: userFetch.userID };

    if (userEmail !== defaultData.userEmail) {
      if (!userEmail) {
        toast.warn("Email is important field");
        return;
      }
      fieldsToUpdate.userEmail = userEmail;
    }
    if (userFirstName !== defaultData.userFirstName) {
      if (!userFirstName) {
        toast.warn("First Name is important field");
        return;
      }
      fieldsToUpdate.userFirstName = userFirstName;
    }
    if (userLastName !== defaultData.userSurname) {
      if (!userLastName) {
        toast.warn("Last Name is important field");
        return;
      }
      fieldsToUpdate.userSurname = userLastName;
    }
    if (userAddreess1 !== defaultData.userAddressLine1) {
      if (!userAddreess1) {
        toast.warn("Address is important field");
        return;
      }
      fieldsToUpdate.userAddressLine1 = userAddreess1;
    }
    if (userAddreess2 !== defaultData.userAddressLine2) {
      fieldsToUpdate.userAddressLine2 = userAddreess2;
    }
    if (userPostcode !== defaultData.userAddressPostcode) {
      if (!userPostcode) {
        toast.warn("Address Postcode is important field");
        return;
      }
      fieldsToUpdate.userAddressPostcode = userPostcode;
    }
    if (userPhoneNumber !== defaultData.userPhoneNumber) {
      if (userPhoneNumber == undefined || userPhoneNumber?.length < 5) {
        toast.warn("Phone number is important field");
        return;
      } else {
        console.log("UserPhone", userPhoneNumber);
        fieldsToUpdate.userPhoneNumber = userPhoneNumber;
      }
    }
    try {
      await toast.promise(
        apiClient.put(`${process.env.REACT_APP_API_URL}/users`, fieldsToUpdate, {
          withCredentials: true,
          credentials: "same-origin",
        }),
        {
          pending: "Please wait...",
          success: "Update Successfully",
        }
      );
    } catch (error) {
      console.log(error?.response);
      console.log(error?.message);
      if (error?.response?.data?.error?.msg) {
        toast.error(error?.response?.data?.error?.msg);
      } else {
        toast.error(error?.message);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Account Settings | Tailor Your Hendrix Archive Draw Experience</title>
        <meta name="description" content="Fine-tune your account settings for a personalized, hassle-free experience as you contribute to a cause and aim for exciting prizes." />
      </Helmet>
      {isLoaded ? (
        <>
          <div className="user-subscription-section font-face-sh pb-5">
            <div className="no-subscription-box bg-white rounded-3 p-4 mx-auto" style={{ maxWidth: 500, boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
              <h3 className="text-start fs-14 pb-2 m-0" style={{ color: "#302d51" }}>
                <strong>Edit profile</strong>
              </h3>
              <div>
                <p className="text-start fs-14 my-2 m-0" style={{ color: "#302d51" }}>
                  <strong>First Name</strong>
                </p>
                <input
                  type="text"
                  id="userFirstName"
                  value={userFirstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First Name"
                  className="input"
                  style={{ display: "block" }}
                />

                <p className="text-start fs-14 my-2 m-0" style={{ color: "#302d51" }}>
                  <strong>Last Name</strong>
                </p>
                <input
                  type="text"
                  id="userFirstName"
                  value={userLastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Last Name"
                  className="input"
                  style={{ display: "block" }}
                />

                <p className="text-start fs-14 my-2 m-0" style={{ color: "#302d51" }}>
                  <strong>Email</strong>
                </p>
                <input
                  type="text"
                  id="userFirstName"
                  value={userEmail}
                  onChange={(event) => setUserEmail(event.target.value)}
                  placeholder="Email address"
                  className="input"
                  style={{ display: "block" }}
                />
                <p className="text-start fs-14 my-2 m-0" style={{ color: "#302d51" }}>
                  <strong>Phone Number</strong>
                </p>
                <PhoneInput
                  placeholder="+44 0000000000"
                  defaultCountry="GB"
                  countryCallingCodeEditable={false}
                  international
                  value={`${userPhoneNumber}`}
                  name="userPhoneNumber"
                  className="rounded-pill align-self-center w-100 px-3 p-3 bg-f2 input  border-0"
                  onChange={(e) => setUserPhoneNumber(`${e?.length ? e : ""}`)}
                />

                <p className="text-start fs-14 my-2 m-0" style={{ color: "#302d51" }}>
                  <strong>Address line 1</strong>
                </p>
                <input
                  type="text"
                  id="userFirstName"
                  value={userAddreess1}
                  onChange={(event) => setAddreess1(event.target.value)}
                  placeholder="Address line 1"
                  className="input"
                  style={{ display: "block" }}
                />

                <p className="text-start fs-14 my-2 m-0" style={{ color: "#302d51" }}>
                  <strong>Address line 2</strong>
                </p>
                <input
                  type="text"
                  id="userFirstName"
                  value={userAddreess2}
                  onChange={(event) => setAddreess2(event.target.value)}
                  placeholder="Address line 2"
                  className="input"
                  style={{ display: "block" }}
                />

                <p className="text-start fs-14 my-2 m-0" style={{ color: "#302d51" }}>
                  <strong>Address Postcode</strong>
                </p>
                <input
                  type="text"
                  id="userFirstName"
                  value={userPostcode}
                  onChange={(event) => setUserPostcode(event.target.value)}
                  placeholder="Address Postcode"
                  className="input"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          </div>
          <div className="mx-auto text-center pb-5" style={{ maxWidth: 327 }}>
            <button
              onClick={handleSubmit}
              className="cta-large-button btn bg-branding-1 border-0 w-100 fs-5 font-face-sh-bold rounded-pill  py-2 mt-3 mb-2 lh-2 desktop-btn text-light"
              style={{ display: "block", height: 48 }}
            >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="user-subscription-section font-face-sh pb-5">
          <div className="no-subscription-box bg-white rounded-3 p-4 mx-auto" style={{ maxWidth: 327, boxShadow: "0 4px 28px rgba(0,0,0,.08)" }}>
            <p className="text-center fs-14 m-0" style={{ color: "#302d51" }}>
              <strong>Loading...</strong>
            </p>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default DashboardDetails;
