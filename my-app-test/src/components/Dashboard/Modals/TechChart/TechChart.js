import React from "react";
import ReactApexChart from "react-apexcharts";
export default function TechChart(props) {
  const { total, compliant, noncompliant, categories } = props;

  const state = {
    series: [
      {
        name: "Total",
        data: total,
      },
      {
        name: "Compliant",
        data: compliant,
      },
      {
        name: "Non-Compliant",
        data: noncompliant,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 300,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      title: {
        text: "Compliant",
        align: "left",
        floating: true,
      },
      xaxis: {
        categories: categories,
      },
      yaxis: {
        title: {
          text: "Servers",
          style: {
            color: "#007bff",
          },
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: "center",
      },
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={300}
      />
    </div>
  );
}
