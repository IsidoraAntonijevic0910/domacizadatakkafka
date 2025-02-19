import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const App = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:8000');

    socket.on('message', (message) => {
      const newData = JSON.parse(message);
      setData((prevData) => [...prevData, newData]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    
    if (data.length > 0) {
      const chartLabels = data.map((entry) => {
        const date = new Date(entry.dt * 1000);
        return date.toLocaleDateString('en-GB'); 
      });

      const chartTemperatureData = data.map((entry) => entry.temperature_celsius);

      console.log(data);

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: 'Temperature in Celsius',
            data: chartTemperatureData,
            fill: false,
            borderColor: 'rgba(255,0,0)',
            tension: 0.1,
            elements: {
              point: {
                radius: 0,
              },
              line: {
                tension: 0.1,
              },
            },
          },
        ],
      });
    }
  }, [data]);

  return (
    <div>
      {}
      {chartData && <Line data={chartData} />}
    </div>
  );
};

export default App;