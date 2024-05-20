import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { createSample } from "../../../redux/actions/sampleActions";
import { SAMPLE_CREATE_RESET } from "../../../redux/constants/sampleConstants";
import ReactQuill from "react-quill";
import DefaultRTE from "../../../UI/RichTextEditor/DefaultRTE";
import DefaultButton from "../../../UI/Button/DefaultButton";
import { PROTOCOL_CREATE_RESET } from "../../../redux/constants/protocolConstants";
import { createProtocol } from "../../../redux/actions/protocolActions";
import { PlusIcon } from "lucide-react";

function CustomProtocols({
  formData,
  setNewProtocol,
  setCreateNewProtocol,
  setWhichTabisActive,
}) {
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [title, setTitle] = useState();
  const [collabs, setCollabs] = useState();
  const [sample, setSomeSample] = useState();
  const [assigned, setAssigned] = useState();
  const protocolCreate = useSelector((state) => state.protocolCreate);
  const { loading, error, sucess, protocol } = protocolCreate;

  const [insdieFormData, setIndieFormData] = useState(
    JSON.parse(formData.data)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    data.protocolTypeInsideCustom = "Custom";
    const newData = JSON.stringify(data);
    const taskObject = {
      title: title,
      data: newData,
    };
    console.log(taskObject);
    await dispatch(createProtocol(taskObject));
    await dispatch({ type: PROTOCOL_CREATE_RESET });
  };

  const handleChange = (name, value) => {
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  useEffect(() => {
    if (sucess) {
      setWhichTabisActive("listProtocols");
      setNewProtocol(true);
      setCreateNewProtocol(false);
    }
  }, [sucess]);
  console.log(insdieFormData && insdieFormData);
  return (
    <div className="">
      <div className="max-w-md mx-auto font-dmsans">
        {insdieFormData.map(
          (t) =>
            t.type === "Text" && (
              <div className="mt-4">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t.name}
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="email-address"
                    placeholder={
                      t.placeholder ? t.placeholder : `Field Placeholder`
                    }
                    onChange={(e) => {
                      if (t.name == "Title") {
                        setTitle(e.target.value);
                      } else {
                        handleChange(t.slug ? t.slug : t.name, e.target.value);
                      }
                    }}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
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
              <div className="label-input mt-4">
                {" "}
                <div className="custom-rte-editor-input">
                  <ReactQuill
                    theme="snow"
                    placeholder={
                      t.placeholder ? t.placeholder : `Field Placeholder`
                    }
                    onChange={(e) => {
                      handleChange(t.name, e);
                    }}
                  />
                </div>
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
        <button
          onClick={(e) => {
            handleSubmit(e);
          }}
          type="button"
          className="mt-5 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create new protocol
          <PlusIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default CustomProtocols;
