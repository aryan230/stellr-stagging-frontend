import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { createSample } from "../../../redux/actions/sampleActions";
import { SAMPLE_CREATE_RESET } from "../../../redux/constants/sampleConstants";
import ReactQuill from "react-quill";
import DefaultRTE from "../../../UI/RichTextEditor/DefaultRTE";
import DefaultButton from "../../../UI/Button/DefaultButton";

function CustomSampleRecord({
  projects,
  setSampleModal,
  sampleType,
  formData,
  setNewSample,
  setWhichTabisActive,
}) {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [project, setProject] = useState(projects.length && projects[0]._id);
  const [collabs, setCollabs] = useState();
  const [sample, setSomeSample] = useState();
  const [assigned, setAssigned] = useState();
  const sampleCreate = useSelector((state) => state.sampleCreate);
  const { loading, error, sucess, sample: sampleCreated } = sampleCreate;

  console.log(formData);

  const [insdieFormData, setIndieFormData] = useState(
    JSON.parse(formData.data)
  );
  console.log(insdieFormData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    data.sampleTypeInsideCustom = "Custom";
    const newData = JSON.stringify(data);
    const taskObject = {
      type: sampleType.label,
      data: newData,
      assigned: {},
    };
    console.log(taskObject);
    await dispatch(createSample(taskObject));
    await dispatch({ type: SAMPLE_CREATE_RESET });
  };

  const handleChange = (name, value) => {
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  useEffect(() => {
    if (sucess) {
      setNewSample(true);
      setWhichTabisActive("sampleList");
      setSampleModal(false);
    }
  }, [sucess]);
  return (
    <div className="forms-inside-div">
      <form onSubmit={handleSubmit}>
        {insdieFormData.map(
          (t) =>
            t.type === "Text" && (
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  {t.name}
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder={
                    t.placeholder ? t.placeholder : `Field Placeholder`
                  }
                  required=""
                  onChange={(e) =>
                    handleChange(t.slug ? t.slug : t.name, e.target.value)
                  }
                />
              </div>
            )
        )}
        {insdieFormData.map(
          (t) =>
            t.type === "Textarea" && (
              <div className="my-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  {t.name}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    t.placeholder ? t.placeholder : `Field Placeholder`
                  }
                  defaultValue={""}
                  onChange={(e) => handleChange(t.name, e.target.value)}
                />
              </div>
            )
        )}
        {insdieFormData.map(
          (t) =>
            t.type === "Integer" && (
              <div className="my-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  {t.name}
                </label>
                <input
                  type="number"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder={
                    t.placeholder ? t.placeholder : `Field Placeholder`
                  }
                  required=""
                  onChange={(e) => handleChange(t.name, e.target.value)}
                />
              </div>
            )
        )}
        {insdieFormData.map(
          (t) =>
            t.type === "Date/Time" && (
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  {t.name}
                </label>
                <input
                  type="datetime-local"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder={
                    t.placeholder ? t.placeholder : `Field Placeholder`
                  }
                  required=""
                  onChange={(e) => handleChange(t.name, e.target.value)}
                />
              </div>
            )
        )}
        {insdieFormData.map(
          (t) =>
            t.type === "Date" && (
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  {t.name}
                </label>
                <input
                  type="date"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder={
                    t.placeholder ? t.placeholder : `Field Placeholder`
                  }
                  required=""
                  onChange={(e) => handleChange(t.name, e.target.value)}
                />
              </div>
            )
        )}
        {insdieFormData.map(
          (t) =>
            t.type === "Time" && (
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  {t.name}
                </label>
                <input
                  type="time"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder={
                    t.placeholder ? t.placeholder : `Field Placeholder`
                  }
                  required=""
                  onChange={(e) => handleChange(t.name, e.target.value)}
                />
              </div>
            )
        )}
        {insdieFormData.map(
          (t) =>
            t.type === "Rich Text Editor" && (
              <div className="label-input">
                {" "}
                <DefaultRTE label={t.placeholder} />
              </div>
            )
        )}
        {insdieFormData.map(
          (t) =>
            t.type === "Picklist" && (
              <div className="py-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.name}
                </label>
                <select
                  id="location"
                  name="location"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  defaultValue="Canada"
                  onChange={(e) => {
                    handleChange(t.name, e.target.value);
                  }}
                >
                  {t.options.map((o) => (
                    <option>{o.name}</option>
                  ))}
                </select>
              </div>
            )
        )}
        <DefaultButton label="Create New Sample" />
      </form>
    </div>
  );
}

export default CustomSampleRecord;
