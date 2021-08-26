import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import Compliance from "./Compliance";

export default function ComplianceIndex() {
  const [compliance, setCompliance] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Dashboard + "compliance/");
        // console.log(result.data);
        setCompliance(result.data);
      } catch (error) {
        // console.log(error.toString());
        // setError(error.toString());
      }
    };
    fetchData();
  }, []);
  return (
    <div className="col-lg-4 col-sm-6">
      <div className="card-stats card">
        <div className="card-body">
          <Compliance
            ComplianceHeader={compliance.header ? compliance.header : []}
            ComplianceValue={compliance.value ? compliance.value : []}
          />
        </div>
      </div>
    </div>
  );
}
ComplianceIndex.propTypes = {
  ComplianceHeader: PropTypes.array,
  ComplianceValue: PropTypes.array,
};
