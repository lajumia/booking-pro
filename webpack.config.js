const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

// Admin configuration
const adminConfig = {
  ...defaultConfig, // Extend the default @wordpress/scripts config
  entry: {
    dashboard: "./admin/views-react/dashboard.jsx", // Entry point for the Dashboard page
    calender: "./admin/views-react/calender.jsx", // Entry point for the Calendar page
    appointments: "./admin/views-react/appointments.jsx", // Entry point for Admin Appointments page
    services: "./admin/views-react/services.jsx", // Entry point for Services
    staff: "./admin/views-react/staff.jsx", // Entry point for Staff
    customers: "./admin/views-react/customers.jsx", // Entry point for Customers
    notifications: "./admin/views-react/notifications.jsx", // Entry point for Notifications
    addons: "./admin/views-react/addons.jsx", // Entry point for Addons
    settings: "./admin/views-react/settings.jsx", // Entry point for Settings
  },
  output: {
    path: path.resolve(__dirname, "admin/views"), // Output directory for admin files
    filename: "[name].js", // Output file naming
  },
};

// Public configuration
const publicConfig = {
  ...defaultConfig, // Extend the default @wordpress/scripts config
  entry: {
    appointments: "./public/views-react/appointments.jsx", // Entry point for Public Appointments
    thankyou: "./public/views-react/thank-you.jsx", // Entry point for Thank You page
  },
  output: {
    path: path.resolve(__dirname, "public/views"), // Output directory for public files
    filename: "[name].js", // Output file naming
  },
};

// Export both configurations as an array
module.exports = [adminConfig, publicConfig];
