import React, { useState } from "react";

const Header = ({ headers, onSorting }) => {
  const [sortingField, setSortingField] = useState("");
  const [sortingOrder, setSortingOrder] = useState("asc");

  const onSortingChange = (field) => {
    const order =
      field === sortingField && sortingOrder === "asc" ? "desc" : "asc";

    setSortingField(field);
    setSortingOrder(order);
    onSorting(field, order);
  };

  return (
    <thead className="thead-inverse">
      <tr>
        {headers.map(({ name, field, sortable }) => (
          <th
            key={name}
            onClick={() => (sortable ? onSortingChange(field) : null)}
            className={sortable ? "handsCursor" : ""}
            style={
              name === "Action" || name === "Status"
                ? { width: "100px" }
                : { width: "none" }
            }
          >
            {name}
            {sortingField && sortingField === field && (
              <i
                className={
                  sortingOrder === "asc"
                    ? "fas fa-arrow-down"
                    : "fas fa-arrow-up"
                }
              ></i>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Header;
