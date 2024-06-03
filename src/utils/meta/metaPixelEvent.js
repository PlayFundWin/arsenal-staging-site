// Path: /src/utils/meta/metaPixelEvent.js
export const completeRegistration = () => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "CompleteRegistration");
  }
};

// Path: /src/utils/meta/metaPixelEvent.js
export const addToCart = (currency, value) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "AddToCart", { currency, value });
  }
};

// Path: /src/utils/meta/metaPixelEvent.js
export const initiateCheckout = (currency, value) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", { currency, value });
  }
};

// Path: /src/utils/meta/metaPixelEvent.js
export const purchase = (currency, value) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "Purchase", { currency, value });
  }
};

// Path: /src/utils/meta/metaPixelEvent.js
export const addPaymentInfo = () => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "AddPaymentInfo");
  }
};
