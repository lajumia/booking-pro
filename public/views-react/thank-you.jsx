
import { createRoot } from "react-dom/client";
import ThankYou from "./components/thank-you"; // Import the ThankYou component

const initThankYouPage = () => {
  const thankYouDiv = document.getElementById("bp-thank-you-page");

  if (thankYouDiv) {
    const root = createRoot(thankYouDiv);
    root.render(<ThankYou />);
  }
};

document.addEventListener("DOMContentLoaded", initThankYouPage);
