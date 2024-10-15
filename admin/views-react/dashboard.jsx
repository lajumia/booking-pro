import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import AppointmentsChart from "./components/appointmentsChart";
import RevenueChart from "./components/RevenueChart";
import Header from "./components/Header";
import HashLoader from "react-spinners/HashLoader";

import editLogo from "../assets/images/edit.png";

const Dashboard = () => {
  const pageUrl = bookingProDashboard.dashboardPageUrl;
  const overrideCss = {
    position: "absolute",
    top: "50%",
    left: "45%",
  };
  const [overview, setOverview] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null); // State for expanded rows

  // Fetch upcomming and overview for appointments start
  const fetchUpcomingAppointments = () => {
    fetch(`${bookingProDashboard.api_base_url}get-upcomming-appointments`, {
      method: "GET",
      headers: {
        "X-WP-Nonce": bookingProDashboard.nonce,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUpcomingAppointments(data.data);
        console.log(data.data);
      })
      .catch((err) => console.log(err));
  };
  const fetchOverview = () => {
    fetch(`${bookingProDashboard.api_base_url}get-appointments-overview`, {
      method: "GET",
      headers: {
        "X-WP-Nonce": bookingProDashboard.nonce,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOverview(data.data);
        //console.log(data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOverview();
    fetchUpcomingAppointments();
  }, []);
  // Fetch upcomming and overview for appointments end

  // If overview is null, you may want to show a loading indicator or placeholder
  if (!overview && !upcomingAppointments) {
    return (
      <div>
        <HashLoader color="#687de8" cssOverride={overrideCss} />
      </div>
    ); // Show loading until data is available
  }

  return (
    <div>
      <div className="bp-dash-container">
        <Header currentPage="dashboard" url={pageUrl} />

        <div className="bp-dash-content">
          <div className="bp-dash-cont-inner">
            <div className="bpdci-top">
              <h2 style={{ fontSize: "23px" }}>Dashboard</h2>
              <input
                className=".bpd-filter-by-date"
                type="date"
                style={{ visibility: "hidden" }}
                name=""
                id=""
              />
            </div>
            <div className="bpdci-second">
              <div
                style={{ backgroundColor: "rgba(112, 132, 233, 0.20)" }}
                className="bpdci-card"
              >
                <h1>{overview.total_appointments}</h1>
                <p>Total Appointments</p>
              </div>
              <div
                style={{ backgroundColor: "rgba(243, 249, 0, 0.20)" }}
                className="bpdci-card"
              >
                <h1>{overview.scheduled_appointments}</h1>
                <p>Pending Appointments</p>
              </div>
              <div
                style={{ backgroundColor: "rgba(113, 236, 164, 0.20)" }}
                className="bpdci-card"
              >
                <h1>{overview.completed_appointments}</h1>
                <p>Completed Appointments</p>
              </div>
              <div
                style={{ backgroundColor: "rgba(235, 112, 112, 0.20)" }}
                className="bpdci-card"
              >
                <h1>{overview.cancelled_appointments}</h1>
                <p>Rejected Appointments</p>
              </div>
              <div
                style={{ backgroundColor: "rgba(113, 236, 164, 0.20)" }}
                className="bpdci-card"
              >
                <h1>${overview.total_revenue}</h1>
                <p>Total Revenue</p>
              </div>
              <div
                style={{ backgroundColor: "rgba(185, 107, 231, 0.20)" }}
                className="bpdci-card"
              >
                <h1>{overview.total_customers}</h1>
                <p>Total Customers</p>
              </div>
            </div>
            <div className="bpdci-appointments">
              <h2 style={{ fontSize: "20px", padding: "10px 0px" }}>
                Upcoming Appointments
              </h2>
            </div>
            <div className="bpdci-third">
              <table>
                <thead className="bpd-table-head">
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Staff</th>
                    <th>Duration</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments &&
                    upcomingAppointments.map((appointment) => (
                      <React.Fragment key={appointment.appointment_id}>
                        <tr className="bpd-table-item">
                          <td>{appointment.appointment_id}</td>
                          <td>{appointment.customer_name}</td>
                          <td>{appointment.service_name}</td>
                          <td>{appointment.staff_name}</td>
                          <td>{appointment.service_duration} minutes</td>
                          <td>{appointment.appointment_date}</td>
                          <td>{appointment.appointment_time}</td>
                          <td>${appointment.service_price}</td>
                          <td></td>
                        </tr>
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="bpdci-analytics">
              <h2 style={{ fontSize: "20px", padding: "30px 0px" }}>
                Analytics
              </h2>
            </div>
            <div className="bpdci-fourth">
              <div className="appointments">
                <AppointmentsChart />
              </div>
              <div className="renenue">
                <RevenueChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const initDashboard = () => {
  const dashboardDiv = document.getElementById("bp-dashboard-root");

  if (dashboardDiv) {
    const root = createRoot(dashboardDiv);
    root.render(<Dashboard />);
  } else {
    console.error("Dashboard root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initDashboard);
