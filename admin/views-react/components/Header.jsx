import React from "react";

import calLogo from "../../assets/images/calender.png";
import appLogo from "../../assets/images/appointments.png";
import serLogo from "../../assets/images/services.png";
import staLogo from "../../assets/images/staff.png";
import cusLogo from "../../assets/images/customers.png";
import notLogo from "../../assets/images/notifications.png";
import addLogo from "../../assets/images/addons.png";
import setLogo from "../../assets/images/settings.png";

const Header = ({ currentPage, url }) => {
  const menuItems = [
    {
      name: "Calendar",
      logo: calLogo,
      page: "calendar",
      pageurl: `${url}bp-calender`, // Dynamically append the "bp-" prefix and the page name
    },
    {
      name: "Appointments",
      logo: appLogo,
      page: "appointments",
      pageurl: `${url}bp-appointments`, // Use "bp-appointments"
    },
    {
      name: "Services",
      logo: serLogo,
      page: "services",
      pageurl: `${url}bp-services`,
    },
    {
      name: "Staff",
      logo: staLogo,
      page: "staff",
      pageurl: `${url}bp-staff`,
    },
    {
      name: "Customers",
      logo: cusLogo,
      page: "customers",
      pageurl: `${url}bp-customers`,
    },
    {
      name: "Notifications",
      logo: notLogo,
      page: "notifications",
      pageurl: `${url}bp-notifications`,
    },
    {
      name: "Add-ons",
      logo: addLogo,
      page: "addons",
      pageurl: `${url}bp-addons`,
    },
    {
      name: "Settings",
      logo: setLogo,
      page: "settings",
      pageurl: `${url}bp-settings`,
    },
  ];

  return (
    <>
      <div className="bp-dash-header">
        <div className="bp-dash-inner">
          <ul className="bp-nav-menu">
            {menuItems.map((item) => (
              <li key={item.page}>
                <a
                  className={currentPage == item.page ? "active" : ""}
                  href={`${item.pageurl}`}
                >
                  <img className="bp-nav-logo" src={item.logo} alt="" />
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
