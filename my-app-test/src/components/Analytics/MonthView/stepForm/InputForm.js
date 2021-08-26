import React, { useState } from "react";
import useFullPageLoader from "../../../FullPageLoader/hooks/useFullPageLoader";
import Notification from "../../../Notification";

export const InputForm = ({ formData, setForm, navigation }) => {
  const { interval } = formData;
  const [isError, setError] = useState("");

  const [loader, showLoader] = useFullPageLoader();

  const onCallClick = function () {
    if (interval === "") {
      setError("Select Option");
    } else {
      showLoader();
      navigation.next();
    }
  };
  return (
    <>
      <div>
        {loader}
        <section className="contact-from pt-4">
          <div className="container">
            <div className="row mt-3">
              <div className="col-md-7 mx-auto">
                <div className="form-wrapper box-form-shadow">
                  <div className="row ">
                    <div className="col-md-12">
                      <h4>Month View</h4>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="interval">Options</label>
                        <select
                          name="interval"
                          className="form-control"
                          placeholder="Options"
                          required
                          value={interval}
                          onChange={setForm}
                        >
                          {/* <option value="">Select Option</option> */}
                          <option value="12">Last 12 Months</option>
                          <option value="6">Last 6 Months</option>
                          <option value="3">Last 3 Months</option>
                          <option value="1">Current Month</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 float-right">
                    <button
                      className="btn btn-medium btn-theme"
                      onClick={() => onCallClick()}
                    >
                      <i className="fas fa-asterisk fa-spin"></i>
                      &nbsp;View
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
          class_name="col-md-7 mx-auto"
        />
      </div>
    </>
  );
};
