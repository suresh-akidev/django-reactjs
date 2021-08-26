import React from "react";

export default function index(props) {
  return (
    <>
      <div className="container">
        <div className="row mt-3">
          <div className={props.class_name}>
            {props.isInfo !== "" && (
              <div className="alert alert-primary" role="alert">
                {props.isInfo}
              </div>
            )}
            {props.isError !== "" && (
              <div className="alert alert-danger" role="alert">
                {props.isError}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
