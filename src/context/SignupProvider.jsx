import React, { useState, useContext, createContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import DrawDataSingleton from "./DrawDataSingleton";
import secureLocalStorage from "react-secure-storage";

const SignupContext = createContext();

function SignupProvider({ children }) {
  const [userData, setUserData] = useState({});
  const [localDrawData, setlocalDrawData] = useState(null);
  const [userID, setUserID] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // [true, false]
  const [remainLoggedIn, setRemainLoggedIn] = useState(false); // [true, false]
  const [step, setStep] = useState(""); // ["signup", "checkout"]
  const [email, setEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(0);
  const [SendDate, setSendDate] = useState();
  const [gender, setGender] = useState(1);
  const [fullName, setFullName] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("+44 ");
  const [personalDetails, setPersonalDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(false);
  const [SubscriptionPlan, setSubscriptionPlan] = useState(false);
  const [isActive1, setIsActive1] = useState(true);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive4, setIsActive4] = useState(false);
  const [amount, setAmount] = useState(10);
  const [entries, setEntries] = useState(10);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);
  const [oneShow, setOneShow] = useState(false);
  const [isStripe, setStripe] = useState(false);
  const [isOneOff, setIsOneOff] = useState(true);
  const [page, setPage] = useState("1");
  const [returnPage, setReturnPage] = useState("");

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function hideModal() {
    setOneShow(false);
  }

  useEffect(() => {
    const userData = secureLocalStorage.getItem("UserData");
    if (userData) {
      let userDetails;
      try {
        userDetails = JSON.parse(userData);
      } catch (error) {
        userDetails = userData;
      }
      if (userDetails && userDetails.userID && userDetails.userData) {
        setIsLoggedIn(true);
        setUserID(userDetails.userID);
        setUserFirstName(userDetails.userData.userFirstName);
        setUserSurname(userDetails.userData.userSurname);
      } else {
        setIsLoggedIn(false);
      }
    }
    const drawDataSingleton = new DrawDataSingleton();
    drawDataSingleton.fetchDrawData().then((data) => setlocalDrawData(data));
  }, []);

  return (
    <SignupContext.Provider
      value={{
        userData,
        setUserData,
        localDrawData,
        setlocalDrawData,
        userID,
        setUserID,
        isLoggedIn,
        setIsLoggedIn,
        remainLoggedIn,
        setRemainLoggedIn,
        step,
        setStep,
        page,
        setPage,
        returnPage,
        setReturnPage,
        password,
        setPassword,
        email,
        setEmail,
        userFirstName,
        setUserFirstName,
        userSurname,
        setUserSurname,
        dob,
        setDob,
        age,
        setAge,
        SendDate,
        setSendDate,
        gender,
        setGender,
        fullName,
        setFullName,
        userPhoneNumber,
        setUserPhoneNumber,
        personalDetails,
        setPersonalDetails,
        paymentDetails,
        setPaymentDetails,
        SubscriptionPlan,
        setSubscriptionPlan,
        isActive1,
        setIsActive1,
        isActive2,
        setIsActive2,
        isActive3,
        setIsActive3,
        isActive4,
        setIsActive4,
        amount,
        setAmount,
        entries,
        setEntries,
        consent1,
        setConsent1,
        consent2,
        setConsent2,
        consent3,
        setConsent3,
        oneShow,
        setOneShow,
        isStripe,
        setStripe,
        isOneOff,
        setIsOneOff,
        stripePromise,
        timeout,
        hideModal,
      }}
    >
      <Elements stripe={stripePromise}>{children}</Elements>
    </SignupContext.Provider>
  );
}

const useSignup = () => useContext(SignupContext);
export default SignupProvider;
export { SignupProvider, SignupContext, useSignup };
