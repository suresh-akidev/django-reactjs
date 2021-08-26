import React from "react";
import { useForm, useStep } from "react-hooks-helper";
import { InputForm } from "./stepForm/InputForm";
import { MonthForm } from "./stepForm/MonthForm";

const defaultData = {
  month: "",
  year: "",
  interval: "12",
};

const steps = [{ id: "InputForm" }, { id: "MonthForm" }];

const MonthView = () => {
  const [formData, setForm] = useForm(defaultData);
  const { step, navigation } = useStep({
    steps,
    initialStep: 0,
  });

  const props = { formData, setForm, navigation };

  switch (step.id) {
    case "InputForm":
      return <InputForm {...props} />;
    case "MonthForm":
      return <MonthForm {...props} />;
    default:
      return <InputForm {...props} />;
  }
};

export default MonthView;
