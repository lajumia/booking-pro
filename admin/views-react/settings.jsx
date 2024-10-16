import React from "react";
import { createRoot } from "react-dom/client";

import Header from "./components/Header";

const Settings = () => {
  const pageUrl = bookingProSettings.settingsPageUrl;
  return (
    <div>
      <div className="bp-dash-container">
        <Header currentPage="settings" url={pageUrl} />

        <div className="bp-dash-content">
          <div className="bp-dash-cont-inner">
            <div className="bpdci-top">
              <h2 style={{ fontSize: "23px" }}>Settings</h2>
              <input
                className=".bpd-filter-by-date"
                type="date"
                style={{ visibility: "hidden" }}
                name=""
                id=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const initSettings = () => {
  const settingsDiv = document.getElementById("bp-settings-root");

  if (settingsDiv) {
    const root = createRoot(settingsDiv);
    root.render(<Settings />);
  } else {
    console.error("Settings root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initSettings);
