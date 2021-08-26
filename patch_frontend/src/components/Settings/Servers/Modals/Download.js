import React, { useState } from "react";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import { Button, Modal } from "react-bootstrap";
import fileDownload from "react-file-download";

const Download = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [message, setMessage] = useState("Loadings");

  const handleDownload = () => {
    try {
      let filename = "serverlist-template.xlsx";
      Axios.defaults.headers.common = {
        "X-CSRFToken": Cookies("csrftoken"),
      };
      Axios.get(URLs().ServersDownload, {
        responseType: "blob",
      })
        .then((res) => {
          // console.log(res.data);
          fileDownload(res.data, filename);
          setMessage("Download has been completed");
        })
        .catch((error) => {
          setMessage("Download not started");
        });
    } catch (error) {
      // console.log(error);
      setMessage("Download not started");
    }
    handleShow();
  };
  return (
    <>
      <button
        className="float-left mr-4 buttonIcone secondary"
        title="Download"
        onClick={handleDownload}
      >
        <i className="fas fa-download"></i>
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confimation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Download;
