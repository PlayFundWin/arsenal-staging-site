import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useDocumentTitle from "../components/useDocumentTitle";
import secureLocalStorage from "react-secure-storage";
import { Helmet } from "react-helmet";
import { TicketBundles } from "../components/TicketBundles";

export default function SubscriptionPlan() {
  useDocumentTitle("Subscription Plan");

  console.log(secureLocalStorage.getItem("UserData"));
  const navigate = useNavigate();

  if (!secureLocalStorage.getItem("UserData")?.email) {
    navigate("/login");
  }

  // useEffect(() => {
  // window.addEventListener("scroll", () => {
  //   setScroll(window.scrollY > 10);
  // });
  // axios.get(APIURL + "/sites/" + siteID + "/draws").then((res) => {
  //   let alldraw = res.data.content;
  //   let activeDraw = res.data.content.filter((item) => item.drawIsClosed != 1);
  //   let selectedDraw = {};
  //   if (activeDraw.length > 0) {
  //     selectedDraw = activeDraw[0];
  //   } else {
  //     selectedDraw = alldraw[0];
  //   }
  //   setDrawData(selectedDraw);
  // });
  // }, []);

  // const checkConsents = () => {
  //   if (!consent3) {
  //     toast("Please read and accept Terms & Conditions", { type: "error" });
  //   }
  // };

  if (!secureLocalStorage.getItem("UserData")) {
    console.log("Logout");
    navigate("/login");
  }

  return (
    <>
      <Helmet>
        <title>Win Big in the Hendrix Archive Community Draw | Support Hamel & Hendrix House to aid their mission</title>
        <meta
          name="description"
          content="Get rocking on your winning streak! Join the Hendrix Archive Community Prize Draw to win incredible prizes, and play a vital role in supporting Hendrix Archive's enduring mission preserve history."
        />
      </Helmet>
      <TicketBundles />

      <ToastContainer />
    </>
  );
}
