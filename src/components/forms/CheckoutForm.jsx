import { useNavigate, Link } from "react-router-dom";
import { useSignup } from "../../context/SignupProvider";
import { useEffect } from "react";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { purchase } from "../../utils/meta/metaPixelEvent"; // Assuming you have a purchase function to track events

const CheckoutForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const {
    localDrawData,
    consent1,
    setConsent1,
    consent2,
    setConsent2,
    consent3,
    setConsent3,
    amount,
    email,
    setEmail,
    fullName,
    setFullName,
    userFirstName,
    userSurname,
    entries,
    userID,
    isOneOff,
  } = useSignup();

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("[error]", error);
    } else {
      try {
        const APIURL = process.env.REACT_APP_API_URL;
        const siteID = process.env.REACT_APP_SITE_ID;
        // If there is draw data, use it, otherwise fetch it from the API
        let drawData = localDrawData[0];

        // If there is no draw data, return an error message to the user
        if (!drawData) {
          const response = await axios.get(`${APIURL}/sites/${siteID}/draws`);
          if (response.data.content.length === 0) {
            console.error("No draw data found");
            toast.error("There are no draws currently live! Please try again later.");
            return;
          } else {
            drawData = response.data.content[0];
          }
        }

        const transactionResponse = await toast.promise(
          axios.post(
            `${APIURL}/transactions/stripe3ds/checkout`,
            {
              amount: amount,
              userEmail: email,
              name: fullName.trim() !== "" ? fullName : "Guest Checkout",
              address1: "-",
              address2: "-",
              postcode: "-",
              stripeToken: paymentMethod.id,
              transactionItems: [
                {
                  drawID: drawData.drawID,
                  drawCauseID: drawData.drawHostCauseID,
                  ticketPrice: amount,
                  ticketQuantity: entries,
                  itemTotal: amount,
                  bundleTotal: amount,
                  isSubscription: isOneOff ? 0 : 1,
                },
              ],
              transactionUserID: userID,
              transactionSiteID: siteID,
              product: [
                {
                  name: drawData.drawName,
                  price: amount,
                  description: `${drawData.drawName} Subscription`,
                  metadata: {
                    email: email,
                  },
                  data: [
                    {
                      id: 6,
                      name: drawData.drawName,
                      drawID: drawData.drawID,
                      drawCauseID: drawData.drawHostCauseID,
                      price: amount,
                      quantity: entries,
                      slug: drawData.drawPageURL,
                      subscription: !isOneOff,
                      subscriptionPeriod: "month",
                      itemTotal: amount,
                    },
                  ],
                },
              ],
            },
            {
              withCredentials: true,
              credentials: "same-origin",
            }
          ),
          {
            pending: "Please wait...",
            error: "Something went wrong",
          }
        );

        const transactionID = transactionResponse.data.transactionID;

        if (transactionResponse.data.actionRequired) {
          const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(transactionResponse.data.clientSecret);

          if (confirmError) {
            console.error("3D Secure Failed", confirmError);
            await axios.post(`${APIURL}/transactions/stripe3ds/updateStatus`, {
              transactionProcessorID: confirmError.payment_intent.id,
              status: 4,
            });
            toast.error("3D Secure Authorisation Failed.");
            return;
          }

          if (paymentIntent.status === "succeeded") {
            await handleSuccessfulPayment(transactionID, transactionResponse.data.mailData, paymentIntent.id);
          }
        } else {
          await handleSuccessfulPayment(transactionID, transactionResponse.data.mailData);
        }
      } catch (error) {
        console.error("Payment failed!", error);
        toast.error("Payment failed!");
      }
    }
  };

  const handleSuccessfulPayment = async (transactionID, mailData, paymentIntentId = null) => {
    const APIURL = process.env.REACT_APP_API_URL;

    if (paymentIntentId) {
      await axios.post(`${APIURL}/transactions/stripe3ds/updateStatus`, {
        transactionProcessorID: paymentIntentId,
        sendMail: true,
        mailData: mailData,
        status: 3,
      });
    }

    toast.success("Payment Done Successfully");
    const currency = "GBP";
    const value = amount;
    purchase(currency, value);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    navigate(`/payment-success/${transactionID.toString()}`);
  };

  const checkConsents = () => {
    if (!consent3) {
      alert("Please accept the terms and conditions.");
    }
  };

  useEffect(() => {
    setFullName(`${userFirstName} ${userSurname}`);
  }, [userFirstName, userSurname, setFullName]);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col sm:flex-row">
        <div className="flex flex-1 flex-col items-start bg-indigo-600 w-full sm:w-1/2 justify-start px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 sm:order-first md:order-last h-16 sm:h-auto">
          <section
            aria-labelledby="summary-heading"
            className="bg-indigo-900 py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-2 md:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0 h-16 sm:h-auto"
          >
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <h2 id="summary-heading" className="sr-only">
                Order summary
              </h2>
              <dl>
                <dt className="text-sm font-medium">Amount due</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-white">£{amount}</dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium">Number of Tickets</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-white">{entries}</dd>
              </dl>
            </div>
          </section>
        </div>
        <div className="flex flex-1 flex-col sm:flex-row w-full sm:w-1/2 justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 sm:order-last md:order-first">
          <div className="mx-auto my-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Checkout</h2>
            </div>
            <div className="mt-10">
              <form onSubmit={handleCheckout} className="space-y-6">
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="full-name"
                      name="full-name"
                      autoComplete="full-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      id="email-address"
                      name="email-address"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Payment details</label>
                  <div className="mt-2">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                              color: "#aab7c4",
                            },
                          },
                          invalid: {
                            color: "#9e2146",
                          },
                        },
                      }}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="form-checkbox mt-10">
                  <ul className="checkbox-list list-unstyled">
                    <li className="checkbox-item mb-4">
                      <label className="input-checkbox d-flex">
                        <input checked={consent1} onChange={() => setConsent1(!consent1)} type="checkbox" name="consentId1" value="1" />
                        <span className="input-checkbox_check"></span>
                        <span className="input-checkbox-label">Yes, I’d like to receive updates about Hendrix Archive via email.</span>
                      </label>
                    </li>
                    <li className="checkbox-item">
                      <label className="input-checkbox d-flex">
                        <input checked={consent2} onChange={() => setConsent2(!consent2)} type="checkbox" name="consentId2" value="10" />
                        <span className="input-checkbox_check"></span>
                        <span className="input-checkbox-label">Yes, Hendrix Archive can contact me about their work via email.</span>
                      </label>
                    </li>
                    <li className="checkbox-item">
                      <label
                        className="step-payment-details_consent_description mt-5 input-checkbox d-flex"
                        style={{ backgroundColor: "rgb(198,29,35,.1)", color: "#302d51", padding: "14px 18px", borderRadius: 20, fontSize: 13 }}
                      >
                        <input checked={consent3} onChange={() => setConsent3(!consent3)} type="checkbox" name="consentId3" value="10" />
                        <span className="input-checkbox_check"></span>
                        <span>
                          By clicking on Confirm you agree to Hendrix Archive
                          <Link to={"/terms-conditions"} style={{ color: "#302d51" }}>
                            Terms & Conditions of Use
                          </Link>
                          ,{" "}
                          <Link to={"/privacy-policy"} style={{ color: "#302d51" }}>
                            Privacy Policy
                          </Link>{" "}
                          and that you <strong>are at least 18 years old.</strong>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>

                {!consent3 ? (
                  <button onClick={checkConsents} className="cta-large-button btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-md py-2 mt-5 w-full text-center">
                    Pay now
                  </button>
                ) : (
                  <button type="submit" className="cta-large-button btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 rounded-md py-2 mt-5 w-full text-center">
                    Pay now
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const StripeForm = (props) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { setEmail, setAmount, setUserID, setFullName, setIsOneOff, setEntries, timeout, amount, email, name, oneoff, entries, userId, stripePromise } = useSignup();

  const siteID = process.env.REACT_APP_SITE_ID;
  const APIURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setEmail(props.email);
    setAmount(props.amount);
    setUserID(props.UserID);
    setFullName(props.name);
    setIsOneOff(1);
    setEntries(props.entries);
  }, [props, setEmail, setAmount, setUserID, setFullName, setIsOneOff, setEntries]);

  const handleSubmit = async () => {
    try {
      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        console.log("[error While Creating Element]", error);
        return;
      }

      const response = await axios.get(`${APIURL}/sites/${siteID}/draws`);
      const drawData = response.data.content[0];
      // If there is no draw data, return an error message to the user
      if (!drawData) {
        console.error("No draw data found");
        return;
      }

      const transactionResponse = await axios.post(
        `${APIURL}/transactions/stripe3ds/checkout`,
        {
          amount: amount,
          userEmail: email,
          name: name.trim() !== "" ? name : "Guest Checkout",
          address1: "-",
          address2: "-",
          postcode: "-",
          stripeToken: paymentMethod.id,
          transactionItems: [
            {
              drawID: drawData.drawID,
              drawCauseID: drawData.drawHostCauseID,
              ticketPrice: amount,
              ticketQuantity: entries,
              itemTotal: amount,
              bundleTotal: amount,
              isSubscription: oneoff ? 0 : 1,
            },
          ],
          transactionUserID: userId,
          transactionSiteID: siteID,
          product: [
            {
              name: drawData.drawName,
              price: amount,
              description: `${drawData.drawName} Subscription`,
              metadata: {
                email: email,
              },
              data: [
                {
                  id: 6,
                  name: drawData.drawName,
                  drawID: drawData.drawID,
                  drawCauseID: drawData.drawHostCauseID,
                  price: amount,
                  quantity: entries,
                  slug: drawData.drawPageURL,
                  subscription: !oneoff,
                  subscriptionPeriod: "month",
                  itemTotal: amount,
                },
              ],
            },
          ],
        },
        {
          withCredentials: true,
          credentials: "same-origin",
        }
      );

      const transactionID = transactionResponse.data.transactionID;

      if (transactionResponse.data.actionRequired) {
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(transactionResponse.data.clientSecret);

        if (confirmError) {
          console.error("3D Secure Failed", confirmError);
          await axios.post(`${APIURL}/transactions/stripe3ds/updateStatus`, {
            transactionProcessorID: confirmError.payment_intent.id,
            status: 4,
          });
          return;
        }

        if (paymentIntent.status === "succeeded") {
          await handleSuccessfulPayment(transactionID, transactionResponse.data.mailData, paymentIntent.id);
        }
      } else {
        await handleSuccessfulPayment(transactionID, transactionResponse.data.mailData);
      }
    } catch (error) {
      console.error("Payment failed!", error);
      // Assuming you have a function to display toast notifications
      alert("Payment failed!", "error");
    }
  };

  const handleSuccessfulPayment = async (transactionID, mailData, paymentIntentId = null) => {
    if (paymentIntentId) {
      await axios.post(`${APIURL}/transactions/stripe3ds/updateStatus`, {
        transactionProcessorID: paymentIntentId,
        sendMail: true,
        mailData: mailData,
        status: 3,
      });
    }
    // Assuming you have a function to display toast notifications
    alert("Payment Done Successfully", "success");
    const currency = "GBP";
    const value = amount;
    purchase(currency, value);
    await timeout(2000);
    navigate(`/payment-success/${transactionID.toString()}`);
  };

  return (
    <>
      <Elements stripe={stripePromise}>
        {stripe && stripe._keyMode === "live" ? null : (
          <div className="d-flex justify-content-center mb-2">
            <span className="text-white text-center bg-danger px-3 py-1" style={{ marginTop: "-25px" }}>
              Stripe : {stripe?._keyMode} Mode
            </span>
          </div>
        )}
        <h3 className="branding1 text-center">Play Fund Win</h3>
        <span className="text-muted text-center d-flex justify-content-center mt-3">{props.email}</span>
        <div className="p-3 my-3 border rounded-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
        <button className="bg-branding-1 text-light border-0 shadow rounded-4 px-3 w-100 py-3" onClick={handleSubmit}>
          Pay Now <strong> £{amount} </strong>
        </button>
        <span className="text-muted text-center d-flex justify-content-center mt-3">* 100% Secure & Safe Payment *</span>
      </Elements>
    </>
  );
};

export default CheckoutForm;
