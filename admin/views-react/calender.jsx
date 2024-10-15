import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "./components/Header";
import AppointmentDetails from "./components/appointmentDetails"; // Import the modal

const localizer = momentLocalizer(moment);

const Calender = () => {
  const pageURL = bookingProCalender.calenderPageUrl;

  // Define the time range
  const minTime = new Date();
  minTime.setHours(9, 0, 0); // Start at 8:00 AM

  const maxTime = new Date();
  maxTime.setHours(21, 0, 0); // End at 5:00 PM

  // Fetch appointments from the API
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${bookingProCalender.api_base_url}get-appointments-by-status`
      );
      const response_data = await response.json();
      const data = response_data.data;

      // Format the data to match the calendar's event structure
      const formattedAppointments = data.map((appointment) => {
        const { start, end } = parseTimeRange(
          appointment.appointment_time,
          appointment.appointment_date
        );

        return {
          id: appointment.id,
          title: appointment.full_name,
          start, // Parsed start Date object
          end, // Parsed end Date object
        };
      });

      setAppointments(formattedAppointments); // Set the events in the state
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Helper function to parse the time range and return start and end Date objects
  const parseTimeRange = (timeRange, date) => {
    const [startTime, endTime] = timeRange.split(" - "); // Split into start and end time
    const start = moment(`${date} ${startTime}`, "YYYY-MM-DD h:mm A").toDate();
    const end = moment(`${date} ${endTime}`, "YYYY-MM-DD h:mm A").toDate();
    return { start, end };
  };

  const handleSelectEvent = (event) => {
    setSelectedAppointment(event); // Set the selected appointment
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null); // Close the modal
  };

  return (
    <div className="bp-dash-container">
      <Header currentPage="calendar" url={pageURL} />

      <div className="bp-dash-content">
        <div className="bp-dash-cont-inner">
          <div className="bpdci-top">
            <h2 style={{ fontSize: "23px" }}>Dashboard</h2>
            <input
              className="bpd-filter-by-date"
              style={{ visibility: "hidden" }}
              type="date"
            />
          </div>

          <Calendar
            localizer={localizer}
            events={appointments} // Add your events here
            defaultView="week" // Choose between 'week' or 'day'
            views={["month", "week", "day"]} // Allow day and week views
            step={30} // 30-minute intervals for time slots
            timeslots={2} // Number of timeslots per step
            min={minTime} // Set minimum time (8 AM)
            max={maxTime} // Set maximum time (5 PM)
            style={{ height: 600 }}
            formats={{
              timeGutterFormat: (date, culture, localizer) =>
                localizer.format(date, "h:mm A", culture), // Custom time format for left-side time slots
              eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                `${localizer.format(
                  start,
                  "h:mm A",
                  culture
                )} – ${localizer.format(end, "h:mm A", culture)}`, // Format for event time range
            }}
            onSelectEvent={handleSelectEvent} // Handle event clicks
          />
        </div>
      </div>
      {/* Show the modal if an appointment is selected */}
      <AppointmentDetails
        appointment={selectedAppointment}
        onClose={handleCloseModal}
      />
    </div>
  );
};

const initCalender = () => {
  const calenderDiv = document.getElementById("bp-calender-root");

  if (calenderDiv) {
    const root = createRoot(calenderDiv);
    root.render(<Calender />);
  } else {
    console.error("Calendar root element not found.");
  }
};

document.addEventListener("DOMContentLoaded", initCalender);
