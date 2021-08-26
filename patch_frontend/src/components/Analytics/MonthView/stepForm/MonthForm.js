import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { PatchForm } from "../../../ReportsViews/Patches/PatchForm";
import { ServerForm } from "../../../ReportsViews/Summary/ServerForm";
import Axios from "axios";
import { URLs, Cookies } from "../../../Urls";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import PageLoader from "../../../FullPageLoader";
import Notification from "../../../Notification";
import Monthly from "../Monthly";
import ReactApexChart from "react-apexcharts";

Modal.setAppElement("#root");

export const MonthForm = ({ formData }) => {
  const [serList, setSerList] = useState(false);
  const [myear, setMyear] = useState("");

  const [isError, setError] = useState("");
  const { promiseInProgress } = usePromiseTracker();
  const [report, setReport] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [servers, setServers] = useState([]);
  const [success, setSuccess] = useState([]);
  const [failed, setFailed] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    setIsOpen(!isOpen);
  }
  const state = {
    series: [
      // {
      //   name: "Servers",
      //   type: "line",
      //   data: servers,
      // },
      {
        name: "Success",
        type: "column",
        data: success,
      },
      {
        name: "Failed",
        type: "column",
        data: failed,
      },
      // {
      //   name: "Jobs",
      //   type: "line",
      //   data: jobs,
      // },
    ],
    options: {
      xaxis: {
        categories: categories,
      },
      fill: {
        opacity: 1,
      },
      chart: {
        id: "chart",
        // stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],

      plotOptions: {
        bar: {
          horizontal: false,
        },
      },

      colors: ["#28a745", "#dc3545"], // "#d39e00", , "#007bff"
      title: {
        text: "Monthly Analytics",
        align: "left",
        offsetX: 0,
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#007bff",
          },
          labels: {
            style: {
              colors: "#007bff",
            },
          },
          title: {
            text: "Servers",
            style: {
              color: "#007bff",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      ],
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

  const stateLine = {
    series: [
      {
        name: "Servers",
        type: "line",
        data: servers,
      },
      // {
      //   name: "Success",
      //   type: "column",
      //   data: success,
      // },
      // {
      //   name: "Failed",
      //   type: "column",
      //   data: failed,
      // },
      {
        name: "Jobs",
        type: "line",
        data: jobs,
      },
    ],
    options: {
      xaxis: {
        categories: categories,
      },
      fill: {
        opacity: 1,
      },
      chart: {
        id: "chart",
        // stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],

      plotOptions: {
        bar: {
          horizontal: false,
        },
      },

      colors: ["#d39e00", "#007bff"], //, "#28a745", "#dc3545"
      title: {
        text: "Monthly Analytics",
        align: "left",
        offsetX: 0,
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#007bff",
          },
          labels: {
            style: {
              colors: "#007bff",
            },
          },
          title: {
            text: "Servers",
            style: {
              color: "#007bff",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      ],
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = new FormData();
        // data.append("from_date", formData.from_date);
        // data.append("to_date", formData.to_date);
        data.append("interval", formData.interval);
        let configHeader = {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies("csrftoken"),
          },
        };
        await Axios.post(URLs().MonthlyJobs + "get/", data, configHeader).then(
          (result) => {
            // setDict(result.data);
            setReport(result.data.report);
            setCategories(result.data.categories);
            setJobs(result.data.jobs);
            setServers(result.data.servers);
            setSuccess(result.data.pass);
            setFailed(result.data.fail);
            // console.log(result.data);
          }
        );
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
      }
    };
    trackPromise(fetchData());
  }, [formData]);

  const OnClickList = (myr, list) => {
    setMyear(myr);
    setSerList(list);
    // handleShow();
    toggleModal();
  };

  return (
    <>
      {promiseInProgress && <PageLoader />}
      <div className="datatablenew">
        <h4 className="h4Server text-center"> Monthly Job Details</h4>
        <div className="row justify-content-center">
          {report &&
            report.map((d, index) => (
              <Monthly key={index} data={d} OnClickList={OnClickList} />
            ))}
        </div>
      </div>

      <div className="text-center">
        <div className="mixed-chart">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="line"
            width="100%"
            height={350}
          />
        </div>
      </div>
      <div className="text-center">
        <div className="mixed-chart">
          <ReactApexChart
            options={stateLine.options}
            series={stateLine.series}
            type="line"
            width="100%"
            height={350}
          />
        </div>
      </div>
      <Notification
        isError={isError}
        isInfo={""}
        class_name="col-md-10 mx-auto"
      />

      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={500}
      >
        <div className="row">
          <div className="col-4">
            <div className="numbers">
              <h5 className="h4Server">
                {serList ? "Server Summary" : "Job Summary"}
              </h5>
            </div>
          </div>
          <div className="col-8">
            <button
              type="button"
              className="close buttonIcone danger"
              aria-label="Close"
              onClick={toggleModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
        {serList ? <ServerForm Myear={myear} /> : <PatchForm Myear={myear} />}
      </Modal>
    </>
  );
};
