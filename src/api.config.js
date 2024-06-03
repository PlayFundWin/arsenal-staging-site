import axios from "axios";
import pako from "pako";
import secureLocalStorage from "react-secure-storage";

const apiClient = axios.create({
  withCredentials: true,
  credentials: "same-origin",
  siteID: process.env.REACT_APP_SITE_ID,
});

console.log({
  withCredentials: true,
  credentials: "same-origin",
  siteID: process.env.REACT_APP_SITE_ID,
});

function uint8ArrayToBase64(buffer) {
  const binary = [].map.call(buffer, (byte) => String.fromCharCode(byte)).join("");
  return window.btoa(binary);
}

async function getEncryptedGeoData() {
  try {
    const response = await axios.get("https://ipgeolocation.abstractapi.com/v1/?api_key=4f2cd4648e5f46a8a93a7ee599ecd845");
    const compressedDataUint8 = pako.deflate(JSON.stringify(response.data));
    const base64CompressedData = uint8ArrayToBase64(compressedDataUint8);
    return base64CompressedData;
  } catch (error) {
    console.error("Error fetching geo data:", error);
    return null;
  }
}

function getPageType() {
  if (window.location.pathname === "/") {
    return "home";
  } else if (window.location.pathname.startsWith("/login")) {
    return "login";
  } else if (window.location.pathname.startsWith("/signup")) {
    return "sign up";
  } else if (window.location.pathname.startsWith("/account/details")) {
    return "Settings";
  } else if (window.location.pathname.startsWith("/reset-password")) {
    return "Reset Password";
  } else if (window.location.pathname.startsWith("/user-reset-password")) {
    return "Reset Password Via Email";
  } else if (window.location.pathname.startsWith("/subscription-plan")) {
    return "Checkout";
  } else if (window.location.pathname.startsWith("/account/subscription")) {
    return "Subscription";
  }
  // ... add other conditions as needed
  else {
    return "unknown";
  }
}

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const performanceData = window.performance.timing;
      const pageLoadTime = performanceData.loadEventEnd - performanceData.navigationStart;
      const domReadyTime = performanceData.domContentLoadedEventEnd - performanceData.navigationStart;
      const utmParams = JSON.parse(secureLocalStorage.getItem("utmParams"));
      console.log("utmParams=======", utmParams);

      const geoData = await getEncryptedGeoData();
      const secureUserData = secureLocalStorage.getItem("UserData");
      console.log("userData", secureUserData);
      console.log("siteID", process.env.REACT_APP_SITE_ID);
      const pageType = getPageType();

      config.headers["X-GeoData"] = geoData;
      config.headers["userID"] = secureUserData?.userID;
      config.headers["siteID"] = process.env.REACT_APP_SITE_ID;
      config.headers["pageTitle"] = document.title;
      config.headers["pageURL"] = window.location.href;
      config.headers["pageType"] = pageType;
      config.headers["utmSource"] = utmParams?.utm_source ? utmParams?.utm_source : "";
      config.headers["utmMedium"] = utmParams?.utm_medium ? utmParams?.utm_medium : "";
      config.headers["utmCampaign"] = utmParams?.utm_campaign ? utmParams?.utm_campaign : "";
      config.headers["utmContent"] = utmParams?.utm_content ? utmParams?.utm_content : "";
      config.headers["domReadyTime"] = domReadyTime.toString();
      config.headers["pageLoadTime"] = pageLoadTime.toString();
    } catch (error) {
      console.error("Error setting the geoData header:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
