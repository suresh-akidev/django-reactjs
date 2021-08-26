import React from "react";
import { useJsonToCsv } from "react-json-csv";

export default function Download(props) {
  const { saveAsCsv } = useJsonToCsv();
  const filename = props.filename,
    fields = props.fields,
    // style = {
    //   padding: "5px",
    // },
    data = props.data;
  return (
    <>
      <button
        className="btn btn-medium btn-theme btn-sm"
        onClick={() => saveAsCsv({ data, fields, filename })}
      >
        <i className="fas fa-file-csv"></i>&nbsp;Download
      </button>
    </>
  );
}
