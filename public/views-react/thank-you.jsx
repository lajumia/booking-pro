import React from "react";
import { createRoot } from "react-dom/client";


const ThankYou = () => {
  return (
    <div className="content">
      <div className="wrapper-1">
        <div className="wrapper-2">
          <h2 className="thank-you">Thank you!</h2>
          <p>Your appointment submited succesfully </p>

          <div className="go-home-cont">
            <a className="go-home" href={`${window.location.origin}/`}>Go Home</a>
          </div>

        </div>
       
      </div>
    </div>
  );
};

const initThankYouPage = () => {
  const thankYouDiv = document.getElementById("bp-thank-you-page");

  if (thankYouDiv) {
    const root = createRoot(thankYouDiv);
    root.render(<ThankYou />);
  }
};

document.addEventListener("DOMContentLoaded", initThankYouPage);
