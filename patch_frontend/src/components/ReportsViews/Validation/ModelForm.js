import React, { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import { URLs, Cookies } from "../../Urls";
import DataTable from "./DataTable";
import { Table } from "reactstrap";
import {
  TableHeader,
  Pagination,
  Search,
} from "../../PaginationSearch/DataTable";
import { UnControlled as CodeMirror } from "react-codemirror2";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/theme/abcdef.css");

require("codemirror/mode/crystal/crystal.js");
require("codemirror/mode/javascript/javascript.js");

export default function ModelForm(props) {
  const JobID = props.JobID;
  const Server = props.Server;
  const [comments, setComments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({
    field: "check_name",
    order: "asc",
  });
  const [valiLogs, setValiLogs] = useState("");

  const addItemToState = (logs) => {
    setValiLogs(logs);
  };

  useEffect(() => {
    const fetchData = async () => {
      // console.log(JobID);
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(
          URLs().Validation + "job/" + JobID + "/server/" + Server + "/"
        );
        // console.log(result.data);
        setComments(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [JobID, Server]);

  const ITEMS_PER_PAGE = 7;
  const headers = [
    { name: "Check Name", field: "check_name", sortable: true },
    { name: "Status", field: "status", sortable: false },
    { name: "Prepatch", field: "prepatch_outputpath", sortable: false },
    { name: "Postpatch", field: "postpatch_outputpath", sortable: false },
  ];

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        (comment) =>
          comment.status.toLowerCase().includes(search.toLowerCase()) ||
          comment.check_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedComments.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedComments = computedComments.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedComments.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [comments, currentPage, search, sorting]);

  return (
    <>
      <div className="row mt-0">
        <div className="col-md-12 mx-auto">
          <div className="row text-center">
            <div className="col-md-4">
              <div className="w-auto float-right">
                <Search
                  onSearch={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="col-md-8">
              <span className="text-primary">{Server}</span>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-md-4">
              <div className="form-group">
                <div className="react-bs-table react-bs-table-bordered">
                  <div className="react-bs-container-header table-header-wrapper">
                    <Table className="table table-bordered table-striped">
                      <TableHeader
                        headers={headers}
                        onSorting={(field, order) =>
                          setSorting({ field, order })
                        }
                      />
                      <DataTable
                        comments={commentsData}
                        JobID={JobID}
                        addItemToState={addItemToState}
                      />
                    </Table>
                  </div>
                </div>
                <div className="w-auto float-right mb-5 mt-2">
                  <Pagination
                    total={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="form-group">
                <CodeMirror
                  value={valiLogs}
                  className="text-left"
                  options={{
                    mode: "crystal",
                    theme: "abcdef",
                    lineNumbers: true,
                    readOnly: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
