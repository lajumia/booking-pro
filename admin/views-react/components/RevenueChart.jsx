import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const RevenueChart = () => {
    // Sample data for appointments vs days
    const data = {
        labels: ['1 Sep', '2 Sep', '3 Sep', '4 Sep', '5 Sep', '6 Sep', '7 Sep'], // Replace with dynamic labels
        datasets: [
            {
                label: 'Revenue',
                data: [50, 100, 80, 120, 60, 70, 90], // Replace with dynamic data
                fill: false,
                backgroundColor: 'rgb(113, 236, 164, .6)',
                borderColor: 'rgb(113, 236, 164, 1',
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
            <Line data={data} options={options} />
        </div>
    );
};

export default RevenueChart;
