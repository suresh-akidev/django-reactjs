import React from "react";
import { useForm, useStep } from "react-hooks-helper";
import { ChangeNo } from "./stepForm/ChangeNo";
import { Jobs } from "./stepForm/Jobs";
import { Config } from "./stepForm/Config";
import { Servers } from "./stepForm/Servers";
import { Review } from "./stepForm/Review";
import { Submit } from "./stepForm/Submit";

const defaultData = {
  ItsmAPI: false,
  change_no: "",

  planned_startdate: "",
  planned_enddate: "",
  actual_startdate: "",
  actual_enddate: "",
  technology_id: "",

  patch_id: "",
  config_content: "",
  editExplanation: "",

  server_list: [],
};

const steps = [
  { id: "ChangeNo" },
  { id: "Jobs" },
  { id: "Config" },
  { id: "Servers" },
  { id: "review" },
  { id: "submit" },
];

export const MultiStepForm = () => {
  const [formData, setForm] = useForm(defaultData);

  const { step, navigation } = useStep({
    steps,
    initialStep: 0,
  });

  const props = { formData, setForm, navigation };

  switch (step.id) {
    case "ChangeNo":
      return <ChangeNo {...props} />;
    case "Jobs":
      return <Jobs {...props} />;
    case "Config":
      return <Config {...props} />;
    case "Servers":
      return <Servers {...props} />;
    case "review":
      return <Review {...props} />;
    case "submit":
      return <Submit {...props} />;
    default:
      return <ChangeNo {...props} />;
  }
};
