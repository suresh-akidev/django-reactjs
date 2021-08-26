import React, { useEffect, useState } from "react";
import Axios from "axios";
import { URLs, Cookies } from "../../Urls";
import { UnControlled as CodeMirror } from "react-codemirror2";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/theme/abcdef.css");

require("codemirror/mode/crystal/crystal.js");
require("codemirror/mode/javascript/javascript.js");

export default function JobLogs(props) {
  const [valiLogs, setValiLogs] = useState("");
  const JobID = props.JobID;
  useEffect(() => {
    const fetchData = async () => {
      // console.log(JobID);
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const res = await Axios.get(URLs().LogsPath + JobID + "/");
        // console.log(result.data);
        setValiLogs(res.data.validation_logs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [JobID]);
  return (
    <>
      <div className="col-md-12 mx-auto">
        <div className="row text-center">
          <div className="col-md-12">
            <div className="form-group">
              <CodeMirror
                value={valiLogs}
                className="text-left"
                options={{
                  mode: "crystal",
                  theme: "abcdef",
                  lineNumbers: true,
                  readOnly: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
