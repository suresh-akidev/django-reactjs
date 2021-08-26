import React, { useState, useEffect } from "react";
// import { usePatch } from "../../Scheduler";
import Axios from "axios";
import { URLs, Cookies } from "./../../../Urls";
import { UnControlled as CodeMirror } from "react-codemirror2";
import useFullPageLoader from "../../../FullPageLoader/hooks/useFullPageLoader";
import Notification from "../../../Notification";
import PageLoader from "../../../FullPageLoader";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");

require("codemirror/mode/yaml/yaml.js");
require("codemirror/mode/javascript/javascript.js");

export const Config = ({ formData, setForm, navigation }) => {
  const [config, setConfig] = useState("");
  const [patch, setPatch] = useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const { patch_id, config_content, editExplanation } = formData;
  const [isError, setError] = useState("");
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const res = await Axios.get(
          URLs().PatchTech + formData.technology_id + "/"
        );
        setPatch(res.data);
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
      }
    };
    trackPromise(fetchData());
  }, [formData]);

  const onChangeTechnology = () => {
    if (formData.technology_id === "") {
      setError("Select the technology from the previous page");
    } else {
      showLoader();
      setError("");
      try {
        const data = {
          technology_id: formData.technology_id,
        };
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        Axios.post(URLs().Configuration, data)
          .then((res) => {
            setForm({
              target: {
                name: "config_content", // form element
                value: res.data.config_content, // the data/url
              },
            });
            setForm({
              target: {
                name: "editExplanation", // form element
                value: res.data.editExplanation, // the data/url
              },
            });
          })
          .catch((error) => {
            // console.log(error.toString());
            setError(error.toString());
            setForm({
              target: {
                name: "config_content", // form element
                value: "", // the data/url
              },
            });
            setForm({
              target: {
                name: "editExplanation", // form element
                value: "", // the data/url
              },
            });
          });
        // console.log(formData);
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
        setForm({
          target: {
            name: "config_content", // form element
            value: "", // the data/url
          },
        });
        setForm({
          target: {
            name: "editExplanation", // form element
            value: "", // the data/url
          },
        });
      }
      hideLoader();
    }
  };

  const onLoad = function (file) {
    if (file === undefined) {
      setError("Only allow one upload");
    } else {
      showLoader();
      var reader = new FileReader();
      reader.onload = function (e) {
        var content = e.target.result;
        //Here the content has been read successfuly
        // console.log(e.target.result);
        setForm({
          target: {
            name: "config_content", // form element
            value: content, // the data/url
          },
        });
      };
      reader.readAsText(file);
      hideLoader();
    }
  };

  const onCallClick = function () {
    if (formData.patch_id === "") {
      setError("Select the Patch");
    } else if (formData.config_content === "") {
      setError("Update / Upload the configuration");
    } else {
      showLoader();
      if (config === "") {
        navigation.next();
      } else {
        setForm({
          target: {
            name: "config_content", // form element
            value: config, // the data/url
          },
        });
        navigation.next();
      }
      hideLoader();
    }
  };

  return (
    <>
      {promiseInProgress && <PageLoader />}
      {loader}
      <section className="contact-from">
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-12 mx-auto">
              <div className="form-wrapper box-form-shadow">
                <div className="row ">
                  <div className="col-md-12">
                    <h4>Configuration</h4>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <select
                        name="patch_id"
                        className="form-control"
                        placeholder="Patch Name"
                        required
                        value={patch_id}
                        onChange={setForm}
                      >
                        <option value="">Patch Name</option>
                        {patch.map((d, index) => (
                          <option key={index} value={d.patch_id}>
                            {d.patch_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-medium btn-theme mr-2"
                          type="button"
                          onClick={onChangeTechnology}
                        >
                          <i className="fab fa-accusoft"></i>&nbsp;Use Template
                        </button>
                        <div className="filediv btn btn-medium btn-theme">
                          <i className="fas fa-file-import"></i>&nbsp;Import
                          File
                          <input
                            id="fileUpload"
                            type="file"
                            accept=".yml"
                            className="filebtn"
                            // onchange="onLoad(event)"
                            onChange={(e) => onLoad(e.target.files[0])}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <CodeMirror
                        value={config_content}
                        options={{
                          mode: "yaml",
                          theme: "material",
                          lineNumbers: true,
                        }}
                        onChange={(editor, data, value) => {
                          var obj = { value };
                          setConfig(obj.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <CodeMirror
                        value={editExplanation}
                        options={{
                          mode: "yaml",
                          theme: "material",
                          lineNumbers: true,
                          readOnly: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 float-right">
                  <button
                    className="btn btn-medium btn-theme mr-4"
                    onClick={() => navigation.previous()}
                  >
                    <i className="fas fa-chevron-left"></i>
                    &nbsp;Back
                  </button>
                  <button
                    className="btn btn-medium btn-theme"
                    onClick={() => onCallClick()}
                  >
                    <i className="fas fa-chevron-right"></i>&nbsp;Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Notification
        isError={isError}
        isInfo={""}
        class_name="col-md-12  mx-auto mb-5"
      />
    </>
  );
};
