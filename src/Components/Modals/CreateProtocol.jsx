import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MultiStep from "react-multistep";
import StepOne from "./Protocol/StepOne";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StepperContainer from "./Protocol/Stepper";
import Select from "react-select";
import StepperTwo from "./Protocol/StepperTwo";
import StepperThree from "./Protocol/StepperThree";
import { PlusCircle } from "lucide-react";
import CustomProtocolTemplate from "./Protocol/CustomProtocols/CustomProtocolTemplate";
import { useSelector } from "react-redux";
import URL from "./../../Data/data.json";
import axios from "axios";
import CustomProtocols from "./Protocol/CustomProtocols";

function CreateProtocol({
  setCreateNewProtocol,
  setNewProtocol,
  setWhichTabisActive,
}) {
  const [value, setValue] = useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [protocolType, setProtocolType] = useState();
  const [customP, setCustomP] = useState(false);
  const [customSamples, setCustomSamples] = useState();

  console.log(protocolType);

  const steps = [
    "Select master blaster campaign settings",
    "Create an ad group",
    "Create an ad",
  ];
  const isStepOptional = (step) => {
    return step === 1;
  };
  const options = [
    {
      value: "Basic Protocol Template",
      label: "Basic Protocol Template",
    },
    {
      value: "Comprehensive Protocol Template",
      label: "Comprehensive Protocol Template",
    },
    {
      value: "Interactive Protocol Template",
      label: "Interactive Protocol Template",
    },
  ];
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const userLogin = useSelector((state) => state.userLogin);
  let { userInfo } = userLogin;
  const getMySamples = async () => {
    var config = {
      method: "get",
      url: `${URL}api/sampleTemplates/myfields`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function(response) {
        console.log(response.data);
        if (response.data.length > 0) {
          console.log(response.data);
          setCustomSamples(
            response.data
              .filter((f) => f.type == "protocol")
              .map(({ name: label, _id: value, ...rest }) => ({
                value,
                label,
                protocolInsideType: "Custom",
                ...rest,
              }))
          );
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!customSamples) {
      getMySamples();
    }
  }, [customSamples]);
  return (
    <div className="modal">
      <CustomProtocolTemplate
        open={customP}
        setOpen={setCustomP}
        setCreateNewProtocol={setCreateNewProtocol}
      />
      <div className="modal-inside-protocol">
        <div className="top-modal">
          <button
            onClick={() => {
              setCreateNewProtocol(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="46"
              height="46"
              viewBox="0 0 46 46"
              fill="none"
            >
              <path
                d="M28.2838 15.7712L22.6269 21.4281L16.9701 15.7712C16.72 15.5212 16.3809 15.3807 16.0273 15.3807C15.6737 15.3807 15.3345 15.5212 15.0845 15.7712C14.8344 16.0213 14.6939 16.3604 14.6939 16.714C14.6939 17.0676 14.8344 17.4068 15.0845 17.6568L20.7413 23.3137L15.0845 28.9705C14.8344 29.2206 14.6939 29.5597 14.6939 29.9134C14.6939 30.267 14.8344 30.6061 15.0845 30.8562C15.3345 31.1062 15.6737 31.2467 16.0273 31.2467C16.3809 31.2467 16.72 31.1062 16.9701 30.8562L22.6269 25.1993L28.2838 30.8562C28.5338 31.1062 28.873 31.2467 29.2266 31.2467C29.5802 31.2467 29.9194 31.1062 30.1694 30.8562C30.4195 30.6061 30.5599 30.267 30.5599 29.9134C30.5599 29.5597 30.4195 29.2206 30.1694 28.9705L24.5126 23.3137L30.1694 17.6568C30.4195 17.4068 30.5599 17.0676 30.5599 16.714C30.5599 16.3604 30.4195 16.0213 30.1694 15.7712C29.9194 15.5212 29.5802 15.3807 29.2266 15.3807C28.873 15.3807 28.5338 15.5212 28.2838 15.7712Z"
                fill="#8F8585"
              />
            </svg>
          </button>
        </div>
        <>
          {" "}
          <h1>Create New Protocol</h1>
          <div className="form-element font-dmsans">
            <Select
              options={customSamples ? options.concat(customSamples) : options}
              onChange={(e) => setProtocolType(e)}
              placeholder="Select Template for New Protocol"
              required
            />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCustomP(true);
              }}
              className="flex items-center justify-start text-indigo-500 mt-5"
            >
              <PlusCircle className="mr-2 w-5 h-5" />
              Create custom protocol
            </a>
          </div>
          {protocolType && protocolType.protocolInsideType === "Custom" && (
            <CustomProtocols
              formData={protocolType}
              sampleType={protocolType}
              setWhichTabisActive={setWhichTabisActive}
              setNewProtocol={setNewProtocol}
              setCreateNewProtocol={setCreateNewProtocol}
            />
          )}
          {protocolType && protocolType.value === "Basic Protocol Template" && (
            <div className="protocol-stepper">
              <StepperContainer
                setNewProtocol={setNewProtocol}
                setCreateNewProtocol={setCreateNewProtocol}
                setWhichTabisActive={setWhichTabisActive}
              />
            </div>
          )}
          {protocolType &&
            protocolType.value === "Comprehensive Protocol Template" && (
              <div className="protocol-stepper">
                <StepperTwo
                  setNewProtocol={setNewProtocol}
                  setCreateNewProtocol={setCreateNewProtocol}
                  setWhichTabisActive={setWhichTabisActive}
                />
              </div>
            )}
          {protocolType &&
            protocolType.value === "Interactive Protocol Template" && (
              <div className="protocol-stepper">
                <StepperThree
                  setNewProtocol={setNewProtocol}
                  setCreateNewProtocol={setCreateNewProtocol}
                  setWhichTabisActive={setWhichTabisActive}
                />
              </div>
            )}
          {}
          {/* <div className="protocol-stepper">
            <StepperContainer
              setNewProtocol={setNewProtocol}
              setCreateNewProtocol={setCreateNewProtocol}
              setWhichTabisActive={setWhichTabisActive}
            />
          </div> */}
          {/* <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Enter a Title"
              required
            />
            <div className="margin-maker"></div>
            <div className="label-input">
              <label htmlFor="">Enter Objective</label>{" "}
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </div>
            <div className="margin-maker"></div>
            <div className="label-input">
              <label htmlFor="">Enter Scope</label>{" "}
              <ReactQuill theme="snow" value={value} onChange={setValue} />
            </div>
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              placeholder={"Enter Scope"}
            />
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              placeholder={"Enter Procedure Steps"}
            />
            <button type="submit">Submit</button>
          </form> */}
        </>
      </div>
    </div>
  );
}

export default CreateProtocol;
