import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const AppointmentsChart = () => {
    // Sample data for appointments vs days
    const data = {
        labels: ['1 Sep', '2 Sep', '3 Sep', '4 Sep', '5 Sep', '6 Sep', '7 Sep'], // Replace with dynamic labels
        datasets: [
            {
                label: 'Appointments',
                data: [5, 10, 8, 12, 6, 7, 9], // Replace with dynamic data
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
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
            <Pie data={data} />
        </div>
    );
};

export default AppointmentsChart;
