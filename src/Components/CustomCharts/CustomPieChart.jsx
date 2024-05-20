import React, { useState } from "react";
import Chart from "react-apexcharts";
function CustomPieChart({ labels, seriesData }) {
  const [isDark, setIsDark] = useState(false);

  const series = seriesData;

  const options = {
    labels: labels,
    dataLabels: {
      enabled: true,
    },

    colors: [
      "#0074D9", // Blue
      "#FF4136", // Red
      "#2ECC40", // Green
      "#FF851B", // Orange
      "#7FDBFF", // Light Blue
      "#FFDC00", // Yellow
      "#001f3f", // Navy
      "#39CCCC", // Teal
      "#B10DC9", // Purple
      "#01FF70", // Lime
      "#85144b", // Maroon
      "#F012BE", // Fuchsia
      "#3D9970", // Olive
      "#111111", // Black
      "#AAAAAA", // Gray
    ],
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontFamily: "Poppins",
      fontWeight: 400,
      labels: {
        colors: isDark ? "#CBD5E1" : "#475569",
      },
      markers: {
        width: 6,
        height: 6,
        offsetY: -1,
        offsetX: -5,
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  return (
    <div>
      <Chart options={options} series={series} type="pie" height="300" />
    </div>
  );
}

export default CustomPieChart;
