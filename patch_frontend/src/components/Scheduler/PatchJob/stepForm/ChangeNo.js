import React, { useEffect, useState } from "react";
import Notification from "../../../Notification";
import { URLs, Cookies } from "./../../../Urls";
import Axios from "axios";
import { Button, Modal } from "react-bootstrap";

export const ChangeNo = ({ formData, setForm, navigation }) => {
  const { ItsmAPI, change_no } = formData;
  const [isError, setError] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const res = await Axios.get(URLs().ItsmAPI);
        // eslint-disable-next-line max-len
        setForm({
          target: {
            name: "ItsmAPI",
            value: res.data.ItsmAPI,
          },
        });
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
      }
    };
    fetchData();
  }, []);

  const onCallClick = function () {
    if (change_no === "") {
      setError("Provide the valid change no");
    } else {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        Axios.get(URLs().ChangeApprove + change_no + "/")
          .then((res) => {
            if (res.data.change === "approved") {
              setForm({
                target: {
                  name: "planned_startdate", // form element
                  value: res.data.planned_startdate, // the data/url
                },
              });
              setForm({
                target: {
                  name: "planned_enddate", // form element
                  value: res.data.planned_enddate, // the data/url
                },
              });
              setForm({
                target: {
                  name: "actual_startdate", // form element
                  value: res.data.actual_startdate, // the data/url
                },
              });
              setForm({
                target: {
                  name: "actual_enddate", // form element
                  value: res.data.actual_enddate, // the data/url
                },
              });
              navigation.next();
            } else {
              setError("Change is " + res.data.change);
            }
          })
          .catch((error) => {
            // console.log(error.toString());
            setError(error.toString());
            setShow(true);
          });
        // console.log(formData);
      } catch (error) {
        // console.log(error.toString());
        setError(error.toString());
        setShow(true);
      }
    }
  };

  const onCallWithout = function () {
    // console.log(ItsmAPI);
    if (change_no === "") {
      setError("Provide the valid change no");
    } else {
      navigation.next();
    }
    // console.log(ItsmAPI);
  };

  const onCallWithout2 = function () {
    setForm({
      target: {
        name: "ItsmAPI",
        value: false,
      },
    });
    navigation.next();
  };
  return (
    <>
      <div>
        <section className="contact-from">
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-7 mx-auto">
                <div className="form-wrapper box-form-shadow">
                  <div className="row ">
                    <div className="col-md-12">
                      <h4>New Patch Job Schedule Form</h4>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Valid Ticket No."
                          aria-label="Valid Ticket No."
                          id="change_no"
                          name="change_no"
                          required
                          value={change_no}
                          onChange={setForm}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 float-right">
                    {ItsmAPI ? (
                      <button
                        className="btn btn-medium btn-theme"
                        onClick={() => onCallClick()}
                      >
                        <i className="fas fa-chevron-right"></i>&nbsp;Next
                      </button>
                    ) : (
                      <button
                        className="btn btn-medium btn-theme"
                        onClick={() => onCallWithout()}
                      >
                        <i className="fas fa-chevron-right"></i>&nbsp;Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Notification
          isError={isError}
          isInfo={""}
          class_name="col-md-7 mx-auto mb-5"
        />

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confimation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ITSM URL is not reachable!!!. Do you want to proceed with manual
            check instead?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              No, Auto
            </Button>
            <Button variant="success" onClick={onCallWithout2}>
              Yes, Manual
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};
