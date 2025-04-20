import React from 'react';
import { createRoot } from "react-dom/client";
import { HashRouter  as Router, Route, Routes, NavLink,Navigate } from 'react-router-dom';

import Header from "./components/Header";

// Import your setting components
import GeneralSettingPage from './components/generalSettingPage';
import TimeSlotSettingPage from './components/timeSlotSettingPage';



const Settings = () => {

  const pageUrl = bookingProSettings.settingsPageUrl;

  return (
    <div>
      <div className="bp-dash-container">
        <Header currentPage="settings" url={pageUrl} />

        <div className="bp-setting-content">
          <div className="bp-set-cont-inner">
            <div className="bpsci-top">
            <Router>
              <div className="settings-page">
                <nav>
                  <ul className='setting-nav'>
                    <li className='bp-nav-item'>
                      <NavLink 
                        to="/settings/general" 
                        className={({ isActive }) => isActive ? 'active-s-ul-li-a' : ''}
                      >
                        General
                      </NavLink>
                    </li>
                    <li className='bp-nav-item'>
                      <NavLink 
                        to="/settings/payment" 
                        className={({ isActive }) => isActive ? 'active-s-ul-li-a' : ''}
                      >
                        Time Slots
                      </NavLink>
                    </li>
                  </ul>
                </nav>

                <div className="settings-content">
                  <Routes>
                    <Route path="*" element={<Navigate to="/settings/general" />} />
                    <Route path="/settings/general" element={<GeneralSettingPage/>} />
                    <Route path="/settings/payment" element={<TimeSlotSettingPage />} />
                  </Routes>
                </div>
              </div>
            </Router>
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
