import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AddEditForm from "../Forms/FormAddEdit";

function ModelForm(props) {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const closeBtn = (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );
  const label = props.buttonLabel;

  let button = "";
  let title = "";

  if (label === "Edit") {
    button = (
      <button
        className="mr-4 buttonIcone primary"
        onClick={toggle}
        title={label}
      >
        <i className="far fa-edit"></i>
      </button>
    );
    title = "Edit Patch";
  } else {
    button = (
      <button
        className="float-left mr-4 buttonIcone success"
        onClick={toggle}
        title={label}
      >
        <i className="fas fa-plus"></i>
      </button>
    );
    title = "Add New Patch";
  }

  return (
    <>
      {button}
      <Modal isOpen={modal} toggle={toggle} className={props.className}>
        <ModalHeader toggle={toggle} close={closeBtn}>
          {title}
        </ModalHeader>
        <ModalBody>
          <AddEditForm
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

export default ModelForm;
