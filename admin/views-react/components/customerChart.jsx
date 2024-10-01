import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const CustomersChart = () => {
    // Sample data for appointments vs days
    const data = {
        labels: ['1 Sep', '2 Sep', '3 Sep', '4 Sep', '5 Sep', '6 Sep', '7 Sep'], // Replace with dynamic labels
        datasets: [
            {
                label: 'Customers',
                data: [5, 10, 8, 12, 6, 7, 9], // Replace with dynamic data
                fill: false,
                backgroundColor: 'rgb(113, 236, 164, .6)',
                borderColor: 'rgba(54, 162, 235, 1)',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '200px' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default CustomersChart;
