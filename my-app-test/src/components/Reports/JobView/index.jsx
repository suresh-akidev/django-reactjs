import React from "react";
import { useForm, useStep } from "react-hooks-helper";
import { InputForm } from "./stepForm/InputForm";
import { JobForm } from "./stepForm/JobForm";

const defaultData = {
  from_date: "",
  to_date: "",
  patch_id: "%",
};

const steps = [{ id: "InputForm" }, { id: "JobForm" }];

const JobView = () => {
  const [formData, setForm] = useForm(defaultData);
  const { step, navigation } = useStep({
    steps,
    initialStep: 0,
  });

  const props = { formData, setForm, navigation };

  switch (step.id) {
    case "InputForm":
      return <InputForm {...props} />;
    case "JobForm":
      return <JobForm {...props} />;
    default:
      return <InputForm {...props} />;
  }
};

export default JobView;
