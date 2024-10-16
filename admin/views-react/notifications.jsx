import React from "react";
import { createRoot } from "react-dom/client";

import Header from "./components/Header";

const Notifications = () => {
  const pageUrl = bookingProNotifications.notificationsPageUrl;
  return (
    <div>
      <div className="bp-dash-container">
        <Header currentPage="notifications" url={pageUrl} />

        <div className="bp-dash-content">
          <div className="bp-dash-cont-inner">
            <div className="bpdci-top">
              <h2 style={{ fontSize: "23px" }}>Notifications</h2>
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

const initNotifications = () => {
  const notificationsDiv = document.getElementById("bp-notifications-root");

  if (notificationsDiv) {
    const root = createRoot(notificationsDiv);
    root.render(<Notifications />);
  } else {
    console.error("Notifications root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initNotifications);
