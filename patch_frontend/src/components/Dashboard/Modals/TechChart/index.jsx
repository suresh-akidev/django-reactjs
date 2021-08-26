import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import TechChart from "./TechChart";

export default function TechIndex() {
  const [techChart, setTechChart] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Dashboard + "compliant/");
        // console.log(result.data);
        setTechChart(result.data);
      } catch (error) {
        // console.log(error.toString());
        // setError(error.toString());
      }
    };
    fetchData();
  }, []);

  return (
    <div className="col-lg-8 col-sm-6">
      <div className="card-stats card">
        <div className="card-body">
          <TechChart
            total={techChart.total ? techChart.total : []}
            compliant={techChart.Compliant ? techChart.Compliant : []}
            noncompliant={techChart.NonCompliant ? techChart.NonCompliant : []}
            categories={techChart.categories ? techChart.categories : []}
          />
        </div>
      </div>
    </div>
  );
}
TechIndex.propTypes = {
  total: PropTypes.array,
  compliant: PropTypes.array,
  noncompliant: PropTypes.array,
  categories: PropTypes.array,
};
