import React, { useState, useEffect, lazy, Suspense } from "react";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import PropTypes from "prop-types";
import PageLoader from "../../../FullPageLoader";
const Servers = lazy(() => import("./Servers"));
const ActiveJobs = lazy(() => import("./ActiveJobs"));
const Scheduled = lazy(() => import("./Scheduled"));
const Running = lazy(() => import("./Running"));
const Success = lazy(() => import("./Success"));
const Failed = lazy(() => import("./Failed"));

export default function ServerWise(props) {
  const [serverWise, setServerWise] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(
          URLs().DashboardServer + props.dropData + "/"
        );
        // console.log(result.data);
        setServerWise(result.data);
      } catch (error) {
        // console.log(error.toString());
        props.setError(error.toString());
      }
    };
    fetchData();
  }, [props]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Servers Servers={serverWise.Servers} />
      <ActiveJobs
        Scheduled={serverWise.Scheduled}
        Running={serverWise.Running}
        dropData={props.dropData}
      />
      <Scheduled Scheduled={serverWise.Scheduled} dropData={props.dropData} />
      <Running Running={serverWise.Running} dropData={props.dropData} />
      <Success Success={serverWise.Success} dropData={props.dropData} />
      <Failed Failed={serverWise.Failed} dropData={props.dropData} />
    </Suspense>
  );
}
ServerWise.propTypes = {
  dropData: PropTypes.number,
  Servers: PropTypes.number,
  Scheduled: PropTypes.number,
  Running: PropTypes.number,
  Success: PropTypes.number,
  Failed: PropTypes.number,
};
