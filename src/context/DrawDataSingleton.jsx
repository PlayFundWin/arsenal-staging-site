import secureLocalStorage from "react-secure-storage";
import apiClient from "../api.config";

const APIURL = process.env.REACT_APP_API_URL;
const siteID = process.env.REACT_APP_SITE_ID;
class DrawDataSingleton {
  static instance;

  constructor() {
    // Singleton pattern
    if (DrawDataSingleton.instance) {
      return DrawDataSingleton.instance;
    }

    DrawDataSingleton.instance = this;
  }

  async fetchDrawData() {
    const data = secureLocalStorage.getItem("drawData");
    const expiry = secureLocalStorage.getItem("drawDataExpiry");
    if (data && expiry && new Date(expiry) > new Date()) {
      return JSON.parse(data);
    } else {
      try {
        const response = await apiClient.get(`${APIURL}/sites/${siteID}/draws`);
        const newData = await response.data.content;
        secureLocalStorage.setItem("drawData", JSON.stringify(newData));
        // Set Draw Data expiry to 15 minutes
        secureLocalStorage.setItem("drawDataExpiry", new Date(Date.now() + 0.25 * 60 * 60 * 1000));
        return newData;
      } catch (error) {
        console.error("Failed to fetch draw data from API:", error);
        // Handle the error gracefully and continue with site operations
        return null;
      }
    }
  }
}

export default DrawDataSingleton;
