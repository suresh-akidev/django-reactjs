import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import UploadForm from "../Forms/FormUpload";

export default function Upload(props) {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const closeBtn = (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );

  let button = (
    <button
      className="float-left mr-4 buttonIcone info"
      onClick={toggle}
      title="Upload"
    >
      <i className="fas fa-upload"></i>
    </button>
  );
  return (
    <>
      {button}
      <Modal isOpen={modal} toggle={toggle} className={props.className}>
        <ModalHeader toggle={toggle} close={closeBtn}>
          Upload Servers
        </ModalHeader>
        <ModalBody>
          <UploadForm
            addItemToState={props.addItemToState}
            updateState={props.updateState}
            updateErrorState={props.updateErrorState}
            toggle={toggle}
            comment={props.comment}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
