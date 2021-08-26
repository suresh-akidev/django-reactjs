import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Axios from "axios";
import { URLs, Cookies } from "../../Urls";
import { Zone } from "../Settings";
import useFullPageLoader from "../../FullPageLoader/hooks/useFullPageLoader";
import PageLoader from "../../FullPageLoader";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Notification from "../../Notification";

function GlobalConfig(props) {
  const [isError, setError] = useState("");
  const [isInfo, setInfo] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showValue, setShowValue] = useState("");
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const { promiseInProgress } = usePromiseTracker();
  const { register, handleSubmit, setValue, getValues } = useForm();

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Global + "get/");
        if (isMounted) {
          if (result && result.data && result.data.length) {
            setValue("account_name", result.data[0].account_name);
            setValue("smtp_mail_server", result.data[0].smtp_mail_server);
            setValue("from_address", result.data[0].from_address);
            setValue("timezone", result.data[0].timezone);
            setValue("itsm_api_url", result.data[0].itsm_api_url);
            setShowValue(result.data[0].itsm_api_url);
            if (result.data[0].itsm_api_url !== "NO") {
              setShowResults(true);
            }
            setInfo("");
          } else {
            setValue("account_name", "");
            setValue("smtp_mail_server", "");
            setValue("from_address", "");
            setValue("timezone", "");
            setValue("itsm_api_url", "");
            setShowValue("");
          }
        }
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
      }
    };
    trackPromise(fetchData());
    return () => {
      isMounted = false;
    };
  }, [setValue]);

  const onSubmit = (data) => {
    showLoader();
    try {
      Axios.post(URLs().Global, data).then((result) => {
        setValue("account_name", result.data.account_name);
        setValue("smtp_mail_server", result.data.smtp_mail_server);
        setValue("from_address", result.data.from_address);
        setValue("timezone", result.data.timezone);
        setValue("itsm_api_url", result.data.itsm_api_url);
        setShowValue(result.data.itsm_api_url);
        if (result.data.itsm_api_url !== "NO") {
          setShowResults(true);
        }
        setInfo("Gobal config has been created");
        props.addMenuToState(1);
      });
    } catch (error) {
      // console.log(error.toString());
      setError(error.toString());
    }
    hideLoader();
  };

  const onUpdate = (data) => {
    showLoader();
    try {
      Axios.patch(URLs().Global + data.account_name + "/", data).then(
        (result) => {
          setValue("account_name", result.data.account_name);
          setValue("smtp_mail_server", result.data.smtp_mail_server);
          setValue("from_address", result.data.from_address);
          setValue("timezone", result.data.timezone);
          setValue("itsm_api_url", result.data.itsm_api_url);
          setShowValue(result.data.itsm_api_url);
          if (result.data.itsm_api_url !== "NO") {
            setShowResults(true);
          }
          setInfo("Gobal config has been updated");
        }
      );
    } catch (error) {
      // console.log(error.toString());
      setError(error.toString());
    }
    hideLoader();
  };

  const onChange = () => {
    if (showResults) {
      setShowValue(getValues("itsm_api_url"));
      setValue("itsm_api_url", "NO");
    } else {
      setValue("itsm_api_url", showValue === "NO" ? "" : showValue);
    }
    setShowResults(!showResults);
  };

  return (
    <>
      {loader}
      {promiseInProgress && <PageLoader />}
      <section className="contact-from pt-4">
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-7 mx-auto">
              <div className="form-wrapper box-form-shadow">
                <div className="row ">
                  <div className="col-md-12">
                    <h4>Global Config form</h4>
                  </div>
                </div>
                <form
                  onSubmit={
                    getValues("account_name") === ""
                      ? handleSubmit(onSubmit)
                      : handleSubmit(onUpdate)
                  }
                >
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="account_name">Account Name</label>
                        <input
                          type="text"
                          name="account_name"
                          id="account_name"
                          required
                          className={
                            getValues("account_name") === ""
                              ? "form-control"
                              : "form-control form-read-only"
                          }
                          readOnly={
                            getValues("account_name") === "" ? false : true
                          }
                          placeholder="Account Name"
                          ref={register}
                        />
                        {/* {getValues("account_name") === "" ? (
                          <>
                            <input
                              type="text"
                              name="account_name"
                              id="account_name"
                              required
                              className="form-control"
                              placeholder="Account Name"
                              ref={register}
                            />
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              name="account_name"
                              id="account_name"
                              className="form-control form-read-only"
                              placeholder="Account Name"
                              readOnly
                              ref={register}
                            />
                          </>
                        )} */}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="from_address">From Address</label>
                        <input
                          type="email"
                          name="from_address"
                          id="from_address"
                          required
                          className="form-control"
                          placeholder="From Address"
                          ref={register}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="smtp_mail_server">
                          SMTP Mail Server
                        </label>
                        <input
                          type="text"
                          name="smtp_mail_server"
                          id="smtp_mail_server"
                          required
                          className="form-control"
                          placeholder="SMTP Mail Server"
                          ref={register}
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="timezone">Time Zone</label>
                        <select
                          name="timezone"
                          id="timezone"
                          className="form-control"
                          required
                          ref={register}
                        >
                          <option value="">Select Timezone</option>
                          {Zone().map((z, index) => (
                            <option key={index} value={z.value}>
                              {z.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group ml-2 mr-2">
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            name="snow_check"
                            className="custom-control-input"
                            id="snow_check"
                            checked={showResults}
                            onChange={() => {
                              onChange();
                            }}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="snow_check"
                          >
                            ITSM ticket verification
                          </label>
                          <label className="font-weight-light font-italic text-warning">
                            If option is checked, all patch jobs will require an
                            approved ITSM ticket to proceed
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="itsm_api_url">ITSM Api Url</label>
                        <input
                          type="text"
                          name="itsm_api_url"
                          id="itsm_api_url"
                          className={
                            showResults
                              ? "form-control"
                              : "form-control form-read-only"
                          }
                          placeholder="Itsm Api Url"
                          required
                          readOnly={!showResults}
                          ref={register}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 float-right">
                    {getValues("account_name") === "" ? (
                      <button className="btn btn-medium btn-theme">
                        <i className="fas fa-chevron-down"></i>&nbsp;Submit
                      </button>
                    ) : (
                      <button className="btn btn-medium btn-theme">
                        <i className="fas fa-chevron-right"></i>&nbsp;Update
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Notification
        isError={isError}
        isInfo={isInfo}
        class_name="col-md-7 mx-auto"
      />
    </>
  );
}

export default GlobalConfig;
