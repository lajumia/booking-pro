import React, { useState, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header from "./components/Header";

const localizer = momentLocalizer(moment);

const Calender = () => {
    const pageURL = bookingProCalender.calenderPageUrl;

    // Define the time range
    const minTime = new Date();
    minTime.setHours(8, 0, 0); // Start at 8:00 AM

    const maxTime = new Date();
    maxTime.setHours(17, 0, 0); // End at 5:00 PM

    // Fetch appointments from the API
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${bookingProCalender.api_base_url}get-appointments-by-status`);
            const response_data = await response.json();
            const data = response_data.data;
            //console.log(data);

            // Format the data to match the calendar's event structure
            const formattedAppointments = data.map(appointment => ({
                id: appointment.id,
                title: appointment.full_name,
                start: new Date(appointment.appointment_time), // Convert start time to Date object
                end: new Date(appointment.appointment_time),   // Convert end time to Date object
            }));

            setAppointments(formattedAppointments); // Set the events in the state
            
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    return (
        <div className="bp-dash-container">
            <Header currentPage="calendar" url={pageURL} />

            <div className="bp-dash-content">
                <div className="bp-dash-cont-inner">
                    <div className="bpdci-top">
                        <h2 style={{ fontSize: "23px" }}>Dashboard</h2>
                        <input className="bpd-filter-by-date" type="date" />
                    </div>
                    {console.log(appointments)}
                    <Calendar
                        localizer={localizer}
                        events={appointments} // Add your events here
                        defaultView="week" // Choose between 'week' or 'day'
                        views={['month', 'week', 'day']} // Allow day and week views
                        step={30} // 30-minute intervals for time slots
                        timeslots={2} // Number of timeslots per step
                        min={minTime} // Set minimum time (8 AM)
                        max={maxTime} // Set maximum time (5 PM)
                        style={{ height: 600 }}
                    />
                </div>
            </div>
        </div>
    );
};

const initCalender = () => {
    const calenderDiv = document.getElementById('bp-calender-root');

    if (calenderDiv) {
        const root = createRoot(calenderDiv);
        root.render(<Calender />);
    } else {
        console.error('Calendar root element not found.');
    }
};

document.addEventListener('DOMContentLoaded', initCalender);
