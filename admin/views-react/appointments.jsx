import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

import Header from "./components/Header";
import noDataImg from "../assets/images/no-data.png";

const Appointments = () => {
  const pageURL = bookingProAppointment.appointmentPageUrl;

  return (
    <>
      <div className="bp-appointments-container">
        <Header currentPage="appointments" url={pageURL} />
        <div className="bp-app-content">
          <div className="bp-app-cont-inner">
            <div className="bp-app-ci-top">
              <h2 style={{ fontSize: "23px" }}>Manage Appointments</h2>
              <input
                className="add-appointments"
                //onClick={openPopup}
                type="button"
                value="Add New Appointment"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const initAppointments = () => {
  const appointmentsDiv = document.getElementById("bp-appointments-root");

  if (appointmentsDiv) {
    const root = createRoot(appointmentsDiv);
    root.render(<Appointments />);
  } else {
    console.error("Appointments root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initAppointments);
