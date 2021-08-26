import React from "react";
import { useForm, useStep } from "react-hooks-helper";
import { InputForm } from "./stepForm/InputForm";
import { ServerForm } from "./stepForm/ServerForm";

const defaultData = {
  from_date: "",
  to_date: "",
  technology: "%",
};

const steps = [{ id: "InputForm" }, { id: "ServerForm" }];

const ServerView = () => {
  const [formData, setForm] = useForm(defaultData);
  const { step, navigation } = useStep({
    steps,
    initialStep: 0,
  });

  const props = { formData, setForm, navigation };

  switch (step.id) {
    case "InputForm":
      return <InputForm {...props} />;
    case "ServerForm":
      return <ServerForm {...props} />;
    default:
      return <InputForm {...props} />;
  }
};

export default ServerView;
