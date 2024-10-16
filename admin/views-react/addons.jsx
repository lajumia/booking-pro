import React from "react";
import { createRoot } from "react-dom/client";

import Header from "./components/Header";

const Addons = () => {
  const pageUrl = bookingProAddons.addonsPageUrl;
  return (
    <div>
      <div className="bp-dash-container">
        <Header currentPage="addons" url={pageUrl} />

        <div className="bp-dash-content">
          <div className="bp-dash-cont-inner">
            <div className="bpdci-top">
              <h2 style={{ fontSize: "23px" }}>Manage Add-ons</h2>
              <input
                className=".bpd-filter-by-date"
                type="date"
                style={{ visibility: "hidden" }}
                name=""
                id=""
              />
            </div>
            <div className="bpd-notifications">
              <div className="bpdn-inner">
                <div className="bpdn-item">
                  <div className="bpdni-left">
                    <div className="bpdni-img">
                      <h1 style={{ textAlign: "center" }}>Comming Soon</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const initAddons = () => {
  const addonsDiv = document.getElementById("bp-addons-root");

  if (addonsDiv) {
    const root = createRoot(addonsDiv);
    root.render(<Addons />);
  } else {
    console.error("Addons root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initAddons);
