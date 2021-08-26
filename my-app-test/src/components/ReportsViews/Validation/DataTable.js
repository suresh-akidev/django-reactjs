import React from "react";
import Axios from "axios";
import { URLs, Cookies } from "../../Urls";

function DataTable(props) {
  function onClickRow(ev) {
    try {
      const data = {
        path: ev,
      };
      let configHeader = {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies("csrftoken"),
        },
      };
      Axios.post(URLs().Path, data, configHeader)
        .then((res) => {
          // console.log(res.data);
          props.addItemToState(res.data.validation_logs);
        })
        .catch((error) => {
          console.log(error);
        });
      // console.log(formData);
    } catch (error) {
      console.log(error);
    }
  }
  const renderSwitch = (param) => {
    switch (param) {
      case "PASS":
        return (
          <i className="fas fa-check-circle fa-lg text-success text-shadow"></i>
        );
      case "FAIL":
        return (
          <i className="fas fa-times-circle fa-lg text-danger text-shadow"></i>
        );
      default:
        return (
          <i className="fas fa-info-circle fa-lg text-info text-shadow"></i>
        );
    }
  };
  const comments = props.comments.map((comment) => {
    return (
      <tr key={comment.validation_id}>
        <td>{comment.check_name}</td>
        <td>{renderSwitch(comment.status)}</td>
        <td
          onClick={() => onClickRow(comment.prepatch_outputpath)}
          className="handsCursor"
        >
          <i className="fas fa-book fa-lg text-success text-shadow"></i>
        </td>
        <td
          onClick={() => onClickRow(comment.postpatch_outputpath)}
          className="handsCursor"
        >
          <i className="fas fa-journal-whills fa-lg text-success text-shadow"></i>
        </td>
      </tr>
    );
  });

  return (
    <>
      <tbody>{comments}</tbody>
    </>
  );
}

export default DataTable;
