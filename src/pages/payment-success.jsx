import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/footer";
import secureLocalStorage from "react-secure-storage";
import useDocumentTitle from "../components/useDocumentTitle";
import { Helmet } from "react-helmet";
import LogoWhite from "../images/mancity-vertical-dark.png";
import shareImage from "../images/sharethanks.png";
import facebookThank from "../images/facebook-thank.png";
import twitterThank from "../images/twitter-thank.png";
import linkedinThank from "../images/linkedin-thank.png";
import whatsappThank from "../images/whatsapp-thank.png";
import axios from "axios";

export default function ThankYou(props) {
  useDocumentTitle("Payment Success");

  const params = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isValid, setisValid] = useState(false);
  const [transactionContent, setTransactionContent] = useState({});
  const [entriesContent, setEntriesContent] = useState([]);
  const [entryContent, setEntryContent] = useState([]);
  const [entryData, setEntryData] = useState([]);
  const [tickets, setTickets] = useState("");
  const [login, setLogin] = useState(secureLocalStorage.getItem("UserData") ? secureLocalStorage.getItem("UserData").loggedin : false);
  const TransactionID = params.transactionID;
  const [entryDrawData, setEntryDrawData] = useState([]);
  const secureUserData = secureLocalStorage.getItem("UserData");

  function logout() {
    secureLocalStorage.clear();
    axios.delete(`${process.env.REACT_APP_API_URL}/auth/logout`);
    setLogin(false);
  }

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/transactions/paymentSuccess/${TransactionID}`, {
        withCredentials: true,
        credentials: "same-origin",
      })
      .then((res) => {
        if (res.data.content.transaction && res.data.content.entries[0]) {
          setisValid(true);
          setTransactionContent(res.data.content.transaction);
          setEntriesContent(res.data.content.entries);
          setEntryData(res.data.content.entries[0]);
          setEntryDrawData(res.data.content?.entries[0]?.draw);
          setEntryContent(res.data.content?.entries[0]?.draw?.content?.contentBody ? JSON.parse(res.data.content.entries[0].draw.content.contentBody) : []);
          let t = "";
          {
            res.data.content.entries[0].tickets?.map((e, index) => {
              t += `${e.ticketNumber}${res.data.content.entries[0]?.tickets?.length == index + 1 ? "" : ", "}`;
            });
          }
          setTickets(t);
        } else {
          setisValid(false);
        }
        setIsLoaded(true);
      });
  }, []);

  // Data Layer Push for Purchase event
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        purchase: {
          actionField: {
            transaction_id: TransactionID,
            affiliation: "Online",
            value: entryData.drawEntryTotal,
            item_name: entryDrawData.drawName,
            item_id: entryDrawData.drawID,
            user_id: secureUserData?.userID ? secureUserData?.userID : "Guest User",
            tax: "0",
            shipping: "0",
            currency: "GBP",
            coupon: "",
          },
          items: [
            {
              item_name: entryDrawData.drawName,
              item_id: entryDrawData.drawID,
              price: entryData.drawEntryTotal,
              item_brand: "Sport",
              item_category:
                entryDrawData.drawCategoryID === 1
                  ? "Fixed Cash Prize"
                  : entryDrawData.drawCategoryID === 2
                  ? "Split Cash Prize"
                  : entryDrawData.drawCategoryID === 3
                  ? "Experiential"
                  : entryDrawData.drawCategoryID === 4
                  ? "Hybrid"
                  : "",
              item_variant: entryData.drawEntryType != 1 ? "Subscription" : "One-off",
              quantity: entryData.drawEntries,
            },
          ],
        },
        user_id: secureUserData?.userID ? secureUserData?.userID : "Guest User",
        user_email: secureUserData?.email ? secureUserData?.email : "Guest User",
      },
    });
  }, [entryData, entryDrawData, secureUserData, TransactionID]);

  return (
    <>
      <Helmet>
        <title>Welcome Aboard | Thank You for Signing Up with Hendrix Archive Draw</title>
        <meta name="description" content="You've taken the first step towards winning big and supporting a noble cause. Explore and enjoy the journey with Hendrix Archive Draw!" />
      </Helmet>
      {!isLoaded ? (
        <></>
      ) : (
        <div>
          <div
            className="relative container-fluid mb-md-0 bg-indigo-800 text-white"
            style={{
              // background: `linear-gradient( #6daac863, #6da9c8),url(${require(`../images/man-city-thankyou-image.jpg`)})`,
              paddingTop: 90,
              paddingBottom: 90,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-white">Thank You!</h1>
                  <h3 className="text-xl md:text-2xl text-white mt-2">For entering the Hendrix Archive Prize Draw</h3>
                </div>
                <div className="md:w-1/3 text-center relative mt-4 md:mt-0">
                  <div className="w-2/3 mx-auto">
                    <img src={shareImage} alt="Share" />
                    <div className="flex justify-center mt-4">
                      <a
                        className="mx-1"
                        href={`http://www.facebook.com/sharer.php?u=${window.location.href}&quote=I have entered the ${
                          entryContent.name ? entryContent.name : entryData?.draw?.drawName
                        } to raise essential funds for ${entryContent.name ? entryContent.name : entryData?.draw?.drawName}. Please join me by buying a ticket here: ${
                          window.location.href
                        }. PlayFundWin #Fundraising`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={facebookThank} alt="Facebook" />
                      </a>
                      <a
                        className="mx-1"
                        href={`https://twitter.com/share?url=${window.location.href}&text=I just helped ${
                          entryContent.name ? entryContent.name : entryData?.draw?.drawName
                        } by entering the ${entryContent.name ? entryContent.name : entryData?.draw?.drawName} via @playfundwin. Join me by entering the draw here: ${
                          window.location.href
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={twitterThank} alt="Twitter" />
                      </a>
                      <a
                        className="mx-1"
                        href={`https://www.linkedin.com/shareArticle?url=${window.location.href}&title=${
                          entryContent.name ? entryContent.name : entryData?.draw?.drawName
                        }&summary=I’m helping ${
                          entryContent.name ? entryContent.name : entryData?.draw?.drawName
                        } to raise essential funds. Join me in supporting this brilliant cause by buying a ticket here: ${window.location.href}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={linkedinThank} alt="LinkedIn" />
                      </a>
                      <a
                        className="mx-1"
                        href={`https://wa.me/?text=Hi! I just entered the ${entryContent.name ? entryContent.name : entryData?.draw?.drawName}. Join me by buying a ticket here: ${
                          window.location.href
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={whatsappThank} alt="WhatsApp" />
                      </a>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 mt-5 rounded-lg shadow-md">
                    <img
                      src={"https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/a9b422ab-2309-45c4-afed-15527dc0053e-Handel%20%26amp%3B%20Hendrix%20Logo.png"}
                      className="mx-auto"
                      alt="Logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto mt-20 mb-20">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-4">You're in the draw!</h2>
              <p className="text-lg mb-2">Your ticket numbers are:</p>
              <p className="text-lg font-semibold mb-4">{tickets}</p>
              <hr className="border-gray-300 mb-4" />
              <p className="text-lg mb-2">
                Amount : <span className="font-bold text-xl">£{entryData.drawEntryTotal}</span>
              </p>
              <p className="text-lg mb-2">You're in the draw, Good Luck, Fingers crossed you are the lucky winners!</p>
              <hr className="border-gray-300 mb-4" />
              <p className="text-lg mb-4">Keep an eye on your emails to find out if you have won!</p>
              <Link to="/account/my-tickets" className="bg-indigo-600 text-white rounded-full px-6 py-3">
                View your ticket
              </Link>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
