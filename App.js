import React, { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

function App() {

  const [score, setScore] = useState(0);
  const [pieData, setPieData] = useState({});
  const [dailyData, setDailyData] = useState({});

  useEffect(() => {

    fetch("http://localhost:5000/score")
      .then(res => res.json())
      .then(data => setScore(data.productivityScore));

    fetch("http://localhost:5000/analytics-data")
      .then(res => res.json())
      .then(data => {
        setPieData({
          labels: ["Productive", "Unproductive", "Neutral"],
          datasets: [{
            data: [
              data.productiveTime,
              data.unproductiveTime,
              data.neutralTime
            ]
          }]
        });
      });

    fetch("http://localhost:5000/daily-breakdown")
      .then(res => res.json())
      .then(data => {
        setDailyData({
          labels: Object.keys(data),
          datasets: [{
            label: "Daily Productivity %",
            data: Object.values(data)
          }]
        });
      });

  }, []);

  return (
    <div style={{
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Arial",
      color: "white"
    }}>

      <h1 style={{ textAlign: "center" }}>Productivity Dashboard</h1>

      <div style={{
        background: "#1e293b",
        padding: "30px",
        margin: "20px auto",
        width: "300px",
        textAlign: "center",
        borderRadius: "12px"
      }}>
        <h2>Weekly Score</h2>
        <h1 style={{ fontSize: "50px", color: "#22c55e" }}>
          {score}%
        </h1>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap"
      }}>

        <div style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          width: "400px",
          margin: "20px"
        }}>
          <h3>Usage Distribution</h3>
          {pieData.datasets && <Pie data={pieData} />}
        </div>

        <div style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          width: "500px",
          margin: "20px"
        }}>
          <h3>Daily Productivity</h3>
          {dailyData.datasets && <Bar data={dailyData} />}
        </div>

      </div>

    </div>
  );
}

export default App;
