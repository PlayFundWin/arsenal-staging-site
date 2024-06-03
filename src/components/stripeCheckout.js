import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { addPaymentInfo, purchase } from "../utils/meta/metaPixelEvent";

const StripeForm = (props) => {
  const [email, setEmail] = useState("");
  const [oneoff, setOneoff] = useState(false);
  const [amount, setAmount] = useState("");
  const [userID, setUserId] = useState("");
  const [name, setName] = useState("");
  const [entries, setEntries] = useState("");

  const siteID = process.env.REACT_APP_SITE_ID;
  const APIURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    console.log("props====>", props);
    setEmail(props.email);
    setAmount(props.amount);
    setUserId(props.UserID);
    setName(props.name);
    setOneoff(props.oneoff);
    setEntries(props.entries);
  }, [props]);
  const handleSubmit = (stripe) => async () => {
    try {
      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
      if (error) {
        console.log("[error While Creating Element]", error);
      } else {
        props.hideModal();
        axios.get(APIURL + "/sites/" + siteID + "/draws").then(async (DrawData) => {
          const res = await toast.promise(
            axios
              .post(
                APIURL + `/transactions/stripe3ds/checkout`,
                {
                  amount: amount,
                  userEmail: email,
                  name: name?.trim() !== "" ? name : "Guest Checkout",
                  address1: "-",
                  address2: "-",
                  postcode: "-",
                  stripeToken: paymentMethod.id,
                  transactionItems: [
                    {
                      drawID: DrawData.data.content[0].drawID,
                      drawCauseID: DrawData.data.content[0].drawHostCauseID,
                      ticketPrice: amount,
                      ticketQuantity: entries,
                      itemTotal: amount,
                      bundleTotal: amount,
                      isSubscription: oneoff ? 0 : 1,
                    },
                  ],
                  transactionUserID: userID,
                  transactionSiteID: siteID,
                  product: [
                    {
                      name: DrawData.data.content[0].drawName,
                      price: amount,
                      description: DrawData.data.content[0].drawName + " Subscription",
                      metadata: {
                        email: email,
                      },
                      data: [
                        {
                          id: 6,
                          name: DrawData.data.content[0].drawName,
                          drawID: DrawData.data.content[0].drawID,
                          drawCauseID: DrawData.data.content[0].drawHostCauseID,
                          price: amount,
                          quantity: entries,
                          slug: DrawData.data.content[0].drawPageURL,
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
              )
              .catch((e) => {
                if (e.code === "ERR_BAD_REQUEST") console.log("Something went wrong", e);
                toast.error(e.response.data.message);
              }),
            {
              pending: "Please wait...",
              error: "Something went wrong",
            }
          );
          let transactionID = res.data.transactionID;

          if (res.data.actionRequired) {
            // We perform 3D Secure authentication
            const { paymentIntent, error } = await toast.promise(stripe.confirmCardPayment(res.data.clientSecret), {
              pending: "Please wait...",
              error: "3D Secure Failed",
            });
            if (error) {
              console.log("[error While Creating Element]", error);
            } else {
              props.hideModal();
              addPaymentInfo();
              axios.get(APIURL + "/sites/" + siteID + "/draws").then(async (DrawData) => {
                const res = await toast.promise(
                  axios
                    .post(
                      APIURL + `/transactions/stripe3ds/checkout`,
                      {
                        amount: amount,
                        userEmail: email,
                        name: name?.trim() !== "" ? name : "Guest Checkout",
                        address1: "-",
                        address2: "-",
                        postcode: "-",
                        stripeToken: paymentMethod.id,
                        transactionItems: [
                          {
                            drawID: DrawData.data.content[0].drawID,
                            drawCauseID: DrawData.data.content[0].drawHostCauseID,
                            ticketPrice: amount,
                            ticketQuantity: entries,
                            itemTotal: amount,
                            bundleTotal: amount,
                            isSubscription: oneoff ? 0 : 1,
                          },
                        ],
                        transactionUserID: userID,
                        transactionSiteID: siteID,
                        product: [
                          {
                            name: DrawData.data.content[0].drawName,
                            price: amount,
                            description: DrawData.data.content[0].drawName + " Subscription",
                            metadata: {
                              email: email,
                            },
                            data: [
                              {
                                id: 6,
                                name: DrawData.data.content[0].drawName,
                                drawID: DrawData.data.content[0].drawID,
                                drawCauseID: DrawData.data.content[0].drawHostCauseID,
                                price: amount,
                                quantity: entries,
                                slug: DrawData.data.content[0].drawPageURL,
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
                    )
                    .catch((e) => {
                      if (e.code === "ERR_BAD_REQUEST") console.log("Something went wrong", e);
                      toast.error(e.response.data.message);
                    }),
                  {
                    pending: "Please wait...",
                    error: "Something went wrong",
                  }
                );
                let transactionID = res.data.transactionID;

                if (res.data.actionRequired) {
                  // We perform 3D Secure authentication
                  const { paymentIntent, error } = await toast.promise(stripe.confirmCardPayment(res.data.clientSecret), {
                    pending: "Please wait...",
                    error: "3D Secure Failed",
                  });
                  if (error) {
                    await axios.post(APIURL + `/transactions/stripe3ds/updateStatus`, {
                      transactionProcessorID: error.payment_intent.id,
                      status: 4,
                    });
                    // console.log("3ds",error);
                    toast("3d Secure Failed.", { type: "error" });
                  }
                  if (paymentIntent.status === "succeeded") console.log(paymentIntent);
                  try {
                    const res2 = await axios.post(APIURL + `/transactions/stripe3ds/updateStatus`, {
                      transactionProcessorID: paymentIntent?.id,
                      sendMail: true,
                      mailData: res.data.mailData,
                      status: 3,
                    });
                    toast("Payment Done Successfully", { type: "success" });
                    const currency = "GBP";
                    const value = amount;
                    purchase(currency, value);
                    await props.timeout(2000);
                    console.log(`/payment-success/${transactionID.toString()}`);
                    props.navigate(`/payment-success/${transactionID.toString()}`);
                  } catch (e) {
                    console.log("3dsError Not Subs", e);
                  } finally {
                    toast("Payment Done Successfully", { type: "success" });
                    const currency = "GBP";
                    const value = amount;
                    purchase(currency, value);
                    await props.timeout(2000);
                    console.log(`/payment-success/${transactionID.toString()}`);
                    props.navigate(`/payment-success/${transactionID.toString()}`);
                  }
                } else {
                  toast("Payment Done Successfully", { type: "success" });
                  const currency = "GBP";
                  const value = amount;
                  purchase(currency, value);
                  await props.timeout(2000);
                  props.navigate(`/payment-success/${transactionID.toString()}`);
                }
              });
            }
            if (paymentIntent.status === "succeeded") console.log(paymentIntent);
            try {
              const res2 = await axios.post(APIURL + `/transactions/stripe3ds/updateStatus`, {
                transactionProcessorID: paymentIntent?.id,
                sendMail: true,
                mailData: res.data.mailData,
                status: 3,
              });
              toast("Payment Done Successfully", { type: "success" });
              await props.timeout(2000);
              console.log(`/payment-success/${transactionID.toString()}`);
              props.navigate(`/payment-success/${transactionID.toString()}`);
            } catch (e) {
              console.log("3dsError Not Subs", e);
            } finally {
              toast("Payment Done Successfully", { type: "success" });
              await props.timeout(2000);
              console.log(`/payment-success/${transactionID.toString()}`);
              props.navigate(`/payment-success/${transactionID.toString()}`);
            }
          } else {
            toast("Payment Done Successfully", { type: "success" });
            await props.timeout(2000);
            props.navigate(`/payment-success/${transactionID.toString()}`);
          }
        });
      }
    } catch (error) {
      console.error(error);
      return toast("Payment failed!", { type: "error" });
    }
  };

  const stripe = useStripe();
  const elements = useElements();

  return (
    <>
      {stripe && stripe._keyMode === "live" ? (
        ""
      ) : (
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
      <button className="bg-branding-1 text-light border-0 shadow rounded-4 px-3 w-100 py-3" onClick={handleSubmit(stripe, elements)}>
        Pay Now <strong> £{amount} </strong>
      </button>
      <span className="text-muted text-center d-flex justify-content-center mt-3">* 100% Secure & Safe Payment *</span>
    </>
  );
};

export default StripeForm;
