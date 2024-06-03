import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import { useSignup } from "../../context/SignupProvider";
import apiClient from "../../api.config";

export function SignupForm() {
  const {
    setUserData,
    isLoggedIn,
    email,
    setEmail,
    userFirstName,
    setUserFirstName,
    userSurname,
    setUserSurname,
    password,
    setPassword,
    setUserID,
    setStep,
    setPage,
    setReturnPage,
  } = useSignup();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  useEffect(() => {
    if (isLoggedIn) {
      setPage(2);
    }
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
      utm_content: urlParams.get("utm_content"),
    };
    setStep("signup");
    localStorage.setItem("utmParams", JSON.stringify(utmParams));
    console.log("utmParams", utmParams);
  }, []);

  async function userRegisterHandler(event) {
    event.preventDefault();
    const errorMessages = [];

    if (!email.trim()) {
      errorMessages.push("Please Enter Your Email");
    } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(email)) {
      errorMessages.push("Please Enter Your valid Email Address");
    }
    if (!userFirstName.trim()) {
      errorMessages.push("Please Enter First Name");
    }
    if (!userSurname.trim()) {
      errorMessages.push("Please Enter Last Name");
    }
    if (!password.trim()) {
      errorMessages.push("Please Enter Password");
    }
    try {
      const response = await apiClient.post(
        `${process.env.REACT_APP_API_URL}/users/email`,
        {
          userEmail: email,
        },
        {
          withCredentials: true,
          credentials: "same-origin",
        }
      );
      if (response.data.status === true && response.data.error === null && response.data.content.length !== 0) {
        alert("You already have an account with Play Fund Win. Please login");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        alert(error.response.data.error.validationErrors[0].msg);
        alert(error.response.data.error.msg);
      } else {
        alert(error.response.data.error.msg);
      }
    }

    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          userFirstName: userFirstName,
          userSurname: userSurname,
          userEmail: email,
          userPassword: password,
          userDateJoined: moment().format("YYYY-MM-DD hh:mm:ss"),
          userDateUpdated: moment().format("YYYY-MM-DD hh:mm:ss"),
          userRoleID: 1,
          userGender: 1,
          userLanguageID: 5,
          userAccountApproved: 1,
          userSelfExcluded: 0,
          userSelfExcludedDate: moment().format("YYYY-MM-DD hh:mm:ss"),
          userSelfExcludedExpiryDate: moment().format("YYYY-MM-DD hh:mm:ss"),
          userPurchaseLimits: 1000,
          userOptInMarketingPFW: 1,
          userOptInMarketingPartner: 1,
          userOptOutDate: moment().format("YYYY-MM-DD hh:mm:ss"),
          userLastLoggedIn: moment().format("YYYY-MM-DD hh:mm:ss"),
          userMeta: {
            website: "Hendrix",
          },
        },
        { withCredentials: true }
      );

      if (response.data.status === true && response.data.error === null) {
        setModalMessage("Successfully Created Account");
        setIsModalOpen(true);
        window.dataLayer.push({
          event: "user_signed_up",
          user_id: response.data.userID,
          user_email: email,
        });
        // Set data for user
        setUserData(response.data);
        setUserID(response.data.userID);
        setPage(2);
      } else {
        setModalMessage("Something went wrong While Creating Account");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        alert(error.response.data.error.validationErrors[0].msg);
        alert(error.response.data.error.msg);
      } else {
        alert(error.message);
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col w-1/2 justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Link to={"/"}>
                <img
                  className="h-10 w-auto"
                  src={"https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/a9b422ab-2309-45c4-afed-15527dc0053e-Handel%20%26amp%3B%20Hendrix%20Logo.png"}
                  alt="Your Company"
                />
              </Link>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Create Your Account</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:underline"
                  onClick={() => setReturnPage("signup")} // Add onclick event here
                >
                  Sign in
                </Link>{" "}
                to your account.
              </p>
            </div>

            <div className="mt-10">
              <form onSubmit={userRegisterHandler} className="space-y-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={userFirstName}
                      onChange={(e) => setUserFirstName(e.target.value)}
                      autoComplete="given-name"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={userSurname}
                      onChange={(e) => setUserSurname(e.target.value)}
                      autoComplete="family-name"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign up <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block bg-indigo-900" aria-hidden="true">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/7d0038f8-02bb-4460-80f1-21800106e106-Jimi%20Hendrix%20-%20Draw%20Header.jpg"
            alt=""
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Notification</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{modalMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignupForm;
