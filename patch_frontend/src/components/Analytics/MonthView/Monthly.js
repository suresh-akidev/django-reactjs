import React from "react";
const Monthly = ({ data, OnClickList }) => {
  return (
    <>
      <div className="col-md-2 col-xs-6">
        <div className="mb-3 bg-white rounded pinterest">
          <span className="text-justify ">
            {data.month} {data.year}
          </span>
          <div className="line"></div>
          <div className="row text-center">
            <div
              title="No.of Jobs"
              className={`col text-primary ${
                data.job !== 0 ? "handsCursor" : ""
              }`}
              onClick={() => data.job !== 0 && OnClickList(data.myear, false)}
            >
              <i className="fas fa-tasks fa-sm"></i> {data.job}
            </div>

            <div
              title="No.of Servers"
              className={`col server ${
                data.servers !== 0 ? "handsCursor" : ""
              }`}
              onClick={() =>
                data.servers !== 0 && OnClickList(data.myear, true)
              }
            >
              <i className="fas fa-server fa-sm"></i> {data.servers}
            </div>
          </div>
          <div className="progress">
            {/* bg-success */}
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{
                width: data.percentage === 0 ? 1 : data.percentage + "%",
              }} //
              aria-valuenow={data.percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {data.percentage.toFixed(2)}%
            </div>
          </div>
          <div className="row text-center">
            <div className="col text-success" title="No.of Success Server">
              <i className="fas fa-check-circle fa-xs"></i> {data.pass}
            </div>
            <div className="col text-danger" title="No.of Failed Server">
              <i className="fas fa-times-circle fa-xs"></i> {data.fail}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Monthly;
