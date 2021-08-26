import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import TechnologyForm from "../Forms/FormTechnology";

export default function Technology(props) {
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
      className="float-left mr-4 buttonIcone primary"
      onClick={toggle}
      title="Technology"
    >
      <i className="fas fa-graduation-cap"></i>
    </button>
  );

  return (
    <>
      {button}
      <Modal isOpen={modal} toggle={toggle} className={props.className}>
        <ModalHeader toggle={toggle} close={closeBtn}>
          Technology
        </ModalHeader>
        <ModalBody>
          <TechnologyForm
            toggle={toggle}
            updateErrorState={props.updateErrorState}
            updateInfoState={props.updateInfoState}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
