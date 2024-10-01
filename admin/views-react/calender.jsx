import React, { useState } from 'react';
import { createRoot } from "react-dom/client";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header from "./components/Header";


const localizer = momentLocalizer(moment);

const Calender = () => {
     const [events, setEvents] = useState([
        {
            title: 'Booking 1',
            start: new Date(2024, 9, 10, 9, 0), // Example event
            end: new Date(2024, 9, 10, 10, 0),
        },
        {
            title: 'Booking 2',
            start: new Date(2024, 9, 11, 12, 0),
            end: new Date(2024, 9, 11, 13, 0),
        },
    ]);

    return (
        <>
            <div className="bp-dash-container">
                <Header />

                <div className="bp-dash-content">
                    <div className="bp-dash-cont-inner">
                        <div className="bpdci-top">
                            <h2 style={{fontSize:"23px"}}>Dashboard</h2>
                            <input className=".bpd-filter-by-date" type="date" name="" id="" />
                        </div>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                        />
                    </div>
                </div>
            </div>  
        </>
    );
};

const initCalender = () => {
    const calenderDiv = document.getElementById('bp-calender-root');

    if (calenderDiv) {
        const root = createRoot(calenderDiv);
        root.render(<Calender />);
    } else {
        console.error('Calender root element not found.');
    }
};

document.addEventListener('DOMContentLoaded', initCalender);