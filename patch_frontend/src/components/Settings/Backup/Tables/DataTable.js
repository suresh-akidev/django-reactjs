import React, { useState } from "react";
import ModelForm from "../Modals/Modal";
import { URLs, Cookies } from "../../../Urls";
import Axios from "axios";
import { Button, Modal } from "react-bootstrap";

function DataTable(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [confid, setConfid] = useState();
  function deleteItemConf(id) {
    setConfid(id);
    handleShow();
  }

  const deleteItem = () => {
    // let confirmDelete = window.confirm("Delete item forever?");
    // if (confirmDelete) {
    try {
      Axios.defaults.headers.common = {
        "X-CSRFToken": Cookies("csrftoken"),
      };
      Axios.delete(URLs().Backup + confid + "/")
        .then((res) => {
          // console.log(res.data);
          props.deleteItemFromState(confid);
          handleClose();
        })
        .catch((error) => {
          props.updateErrorState(error.toString());
        });
    } catch (error) {
      // console.log(error);
      props.updateErrorState(error.toString());
    }
    handleClose();
  };

  const comments = props.comments.map((comment) => {
    return (
      <tr key={comment.backup_server}>
        <td>{comment.account_name}</td>
        <td>{comment.backup_server}</td>
        <td>{comment.server_ip}</td>
        <td>{comment.backup_url}</td>
        <td>
          <div className="d-flex justify-content-between">
            <ModelForm
              buttonLabel="Edit"
              comment={comment}
              updateState={props.updateState}
              updateErrorState={props.updateErrorState}
              className="datatableModal modalViewwidh50"
            />

            <button
              className="buttonIcone danger"
              onClick={() => deleteItemConf(comment.backup_server)}
              title="Delete"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <tbody>{comments}</tbody>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confimation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete item forever?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteItem}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DataTable;
