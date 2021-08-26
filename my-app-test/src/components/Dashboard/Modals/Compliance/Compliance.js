import React from "react";
import ReactApexChart from "react-apexcharts";
export default function Compliance(props) {
  const { ComplianceHeader, ComplianceValue } = props;
  const state = {
    series: [
      {
        data: ComplianceValue,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 380,
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      colors: ["#28a745", "#ffc107", "#fd7e14", "#dc3545"],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: ComplianceHeader,
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: "Compliance",
        align: "center",
        floating: true,
      },

      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    },
  };

  return (
    <div className="col-12">
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={300}
        />
      </div>
    </div>
  );
}
