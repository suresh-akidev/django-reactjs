import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import BulkForm from "../Forms/FormBulk";

export default function Bulk(props) {
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
      className="float-left mr-4 buttonIcone dark"
      onClick={toggle}
      title="Technology Bulk Update"
    >
      <i className="fas fa-crop-alt"></i>
    </button>
  );

  return (
    <>
      {button}
      <Modal isOpen={modal} toggle={toggle} className={props.className}>
        <ModalHeader toggle={toggle} close={closeBtn}>
          Technology Bulk Update
        </ModalHeader>
        <ModalBody>
          <BulkForm
            toggle={toggle}
            updateErrorState={props.updateErrorState}
            updateInfoState={props.updateInfoState}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
