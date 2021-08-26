import React from "react";

export default function SwitchCase({ dropData }) {
  const Switches = () => {
    switch (dropData) {
      case 12:
        return "Last 12 Months";
      case 6:
        return "Last 6 Months";
      case 3:
        return "Last 3 Months";
      case 1:
        return "Current Month";
      default:
        return "Last 2 Months";
    }
  };
  return <Switches />;
}
