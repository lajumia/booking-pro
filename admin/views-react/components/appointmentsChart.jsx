import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const AppointmentsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Appointments",
        data: [],
        backgroundColor: "rgb(113, 236, 164, .6)",
        borderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  });

  // Function to fetch data from your API
  const fetchAppointmentsData = () => {
    fetch(`${bookingProDashboard.api_base_url}get-appointments-chart`, {
      method: "GET",
      headers: {
        "X-WP-Nonce": bookingProDashboard.nonce,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const results = data.data;
        if (results) {
          const labels = results.map((item) => item.date);
          const appointments = results.map((item) => item.appointments);

          // Update the chart data
          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Appointments",
                data: appointments,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
              },
            ],
          });
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchAppointmentsData();
  }, []);

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <Bar data={chartData} />
    </div>
  );
};

export default AppointmentsChart;
