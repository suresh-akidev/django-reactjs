import React, { useState } from "react";
import ModelForm from "../Validation/ModelForm";
import {
  Running,
  Scheduled,
  Failed,
  Success,
} from "../../Notification/ReportsFlags";
import { Modal } from "react-bootstrap";

function DataTable(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [server, setServer] = useState();
  const [JobID, setJobID] = useState(props.JobID);

  function onClickRow(server, job_id) {
    setServer(server);
    if (job_id !== server) {
      setJobID(job_id);
    }
    handleShow();
  }
  const comments = props.comments.map((comment) => {
    return (
      <tr key={comment.summary_id ? comment.summary_id : comment.job_id}>
        <td>{comment.server_name}</td>
        <td>{comment.patch_id}</td>
        <td>{comment.patch_executiondate}</td>
        <td>
          {comment.status === "Success" ? (
            <Success />
          ) : comment.status === "Failed" ? (
            <Failed />
          ) : comment.status === "Scheduled" ? (
            <Scheduled />
          ) : (
            <Running />
          )}
        </td>
        {props.FormType !== "ActiveJob" && (
          <td>
            {comment.kernel_version === "NA" ? (
              <i className="fas fa-info-circle fa-lg text-info text-shadow"></i>
            ) : (
              comment.kernel_version
            )}
          </td>
        )}
        {comment.status === "Success" ? (
          <td
            onClick={() =>
              onClickRow(
                comment.server_name,
                comment.job_id ? comment.job_id : comment.server_name
              )
            }
            className="handsCursor"
          >
            <i className="fas fa-file-alt fa-lg text-success text-shadow"></i>
          </td>
        ) : (
          <td>
            {comment.status === "Running" ? (
              <i className="fas fa-sync fa-lg fa-spin icon-yellow text-shadow"></i>
            ) : (
              <i className="fas fa-info-circle fa-lg text-info text-shadow"></i>
            )}
          </td>
        )}
      </tr>
    );
  });

  return (
    <>
      <tbody>{comments}</tbody>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modalViewwidh90 datatableModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Job Validation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModelForm JobID={JobID} Server={server} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DataTable;
