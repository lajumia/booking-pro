import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const RevenueChart = () => {
  const [chartData, setChartData] = useState({
    labels: [], // Empty initially, will be populated with dynamic data
    datasets: [
      {
        label: "Revenue",
        data: [], // Empty initially, will be populated with dynamic data
        fill: false,
        backgroundColor: "rgb(113, 236, 164, .6)",
        borderColor: "rgb(113, 236, 164, 1)",
      },
    ],
  });

  useEffect(() => {
    // Fetch data from the WordPress REST API
    fetch(`${bookingProDashboard.api_base_url}get-revenue-chart`, {
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
          // Extract labels (dates) and data (revenue)
          const labels = results.map((item) => item.date);
          const revenues = results.map((item) => item.revenue);

          // Update the chart data
          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Revenue",
                data: revenues,
                fill: false,
                backgroundColor: "rgb(113, 236, 164, .6)",
                borderColor: "rgb(113, 236, 164, 1)",
              },
            ],
          });
        }
      })
      .catch((error) => console.error("Error fetching revenue data:", error));
  }, []);

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "200px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;
