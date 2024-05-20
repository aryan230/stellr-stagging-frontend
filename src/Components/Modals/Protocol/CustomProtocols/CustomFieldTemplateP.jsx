import React, { useEffect, useState } from "react";
import URL from "./../../../../Data/data.json";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Select from "react-select";
import MainLoaderWithText from "../../../Loaders/MainLoaderWithText";
import HelperText from "../../../../UI/Input/HelperText";
import _ from "lodash";
import { PlusIcon } from "lucide-react";
import MainModalEntity from "../../../../UI/MainModals/MainModalEntity";
function CustomFieldTemplateP({
  customFeild,
  setCustomFeild,
  customSampleData,
  setCustomSampleData,
}) {
  const userLogin = useSelector((state) => state.userLogin);
  let { loading, error, userInfo } = userLogin;

  const [name, setName] = useState();
  const [type, setType] = useState();
  const [description, setDescription] = useState();
  const [newField, setNewField] = useState();
  const [fieldOptions, setFieldOptions] = useState();
  const [selectedField, setSelectedField] = useState();
  const [loader, setLoader] = useState(false);
  const [placeholder, setPlaceholder] = useState();
  const [slug, setSlug] = useState();
  const [loaderText, setLoaderText] = useState("Loading");

  const [picklist, setPicklist] = useState([
    {
      name: "",
    },
  ]);
  const fields = [
    {
      name: "Text",
    },
    {
      name: "Textarea",
    },
    {
      name: "Integer",
    },
    {
      name: "Rich Text Editor",
    },
    {
      name: "Date/Time",
    },
    {
      name: "Date",
    },
    {
      name: "Time",
    },
    {
      name: "Picklist",
    },
  ];

  const handleAddFeild = async () => {
    setLoaderText("Creating new field");
    setLoader(true);
    let textBlock = {
      type,
      isRequired: false,
      slug,
      placeholder,
      options: picklist,
    };
    var data = JSON.stringify({
      name,
      description,
      data: JSON.stringify(textBlock),
    });

    var config = {
      method: "post",
      url: `${URL[0]}api/fields`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function(response) {
        toast.success(`Custom field with ${name} was successfully created`);
        setLoaderText("Adding feild to your sample data");
        await setCustomSampleData((current) => [
          ...current,
          {
            id: response.data._id,
            name: response.data.name,
            type: JSON.parse(response.data.data).type,
            description: description,
            placeholder: JSON.parse(response.data.data).placeholder,
            slug: JSON.parse(response.data.data).placeholder,
            options: JSON.parse(response.data.data).options
              ? JSON.parse(response.data.data).options
              : [],
          },
        ]);
        setLoader(false);
        setCustomFeild(false);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const handleAddFieldInSample = async () => {
    if (selectedField) {
      setLoaderText("Adding Field to your sample data");
      setLoader(true);
      window.setTimeout(async () => {
        await setCustomSampleData((current) => [
          ...current,
          {
            id: selectedField.value,
            name: selectedField.label,
            type: JSON.parse(selectedField.data).type,
            description: description,
            placeholder: JSON.parse(selectedField.data).placeholder,
            slug: JSON.parse(selectedField.data).slug,
            options: JSON.parse(selectedField.data).options
              ? JSON.parse(selectedField.data).options
              : [],
          },
        ]);
        setLoader(false);
        setCustomFeild(false);
      }, 3000);
    }
  };

  const getMyFields = async () => {
    var config = {
      method: "get",
      url: `${URL}api/fields/myfields`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function(response) {
        console.log(response.data);
        if (response.data.length > 0) {
          console.log();
          setFieldOptions(
            response.data.map(({ name: label, _id: value, ...rest }) => ({
              value,
              label,
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
    if (!fieldOptions) {
      getMyFields();
    }
  }, [fieldOptions]);
  return (
    <MainModalEntity open={customFeild} setOpen={setCustomFeild}>
      {" "}
      <div className="relative w-full max-w-xl font-sans mx-auto">
        {loader && <MainLoaderWithText text={loaderText} />}

        <div className="p-6 space-y-6 min-h-[50%] max-h-fit">
          <>
            <div className="flex items-center pl-4 border border-gray-200 rounded">
              <input
                id="bordered-radio-1"
                type="radio"
                defaultValue=""
                name="bordered-radio"
                onClick={(e) => {
                  setNewField("exist");
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
              />
              <label
                htmlFor="bordered-radio-1"
                className="w-full py-4 ml-2 text-sm font-medium text-gray-900"
              >
                Use an existing field
              </label>
            </div>
            {newField && newField === "exist" && (
              <div className="w-[80%] py-10 mx-auto">
                {" "}
                <Select
                  options={fieldOptions ? fieldOptions : []}
                  onChange={(e) => setSelectedField(e)}
                  placeholder="Select Field"
                  required
                  maxMenuHeight={150}
                />{" "}
                <div className="margin-maker"></div>
                <button
                  type="submit"
                  onClick={handleAddFieldInSample}
                  className="mx-2 my-2 bg-white transition duration-150 ease-in-out hover:border-indigo-600 rounded hover:bg-indigo-600 hover:text-white border border-indigo-700 text-indigo-700 px-6 py-2 text-base"
                >
                  Add Field
                </button>
              </div>
            )}
            <div className="flex items-center pl-4 border border-gray-200 rounded">
              <input
                defaultChecked=""
                id="bordered-radio-2"
                type="radio"
                defaultValue=""
                name="bordered-radio"
                onClick={(e) => {
                  setNewField("new");
                }}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="bordered-radio-2"
                className="w-full py-4 ml-2 text-sm font-medium text-gray-900"
              >
                Create new field
              </label>
            </div>
          </>

          {newField && newField === "new" && (
            <div className="w-[80%] mx-auto">
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Enter name for field
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Field Name"
                  required=""
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(_.camelCase(e.target.value));
                  }}
                />
              </div>

              <div className="my-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Description
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Description"
                  defaultValue={""}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </div>

              <div className="my-4">
                <label
                  htmlFor="countries"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Select a field type
                </label>
                <select
                  id="countries"
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option selected="true" disabled>
                    Select a field
                  </option>
                  {fields.map((f) => (
                    <option value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>
              {type === "Picklist" && (
                <div className="pb-3 font-body">
                  <h3 className="pt-3">Enter Options ({picklist.length})</h3>
                  {picklist.map((p, index) => (
                    <div className="py-2">
                      <label htmlFor="email" className="sr-only">
                        Email
                      </label>
                      <input
                        type="text"
                        name="option"
                        id="option"
                        onChange={(e) => {
                          picklist[index].name = e.target.value;
                        }}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter option here"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={(e) => {
                      setPicklist((p) => [
                        ...p,
                        {
                          name: "",
                        },
                      ]);
                    }}
                    className="my-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              )}
              <div className="my-4">
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Enter value for placeholder
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Placeholder"
                  required=""
                  onChange={(e) => {
                    setPlaceholder(e.target.value);
                  }}
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Enter Slug
                </label>
                <input
                  type="text"
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Slug"
                  required=""
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                  }}
                />
              </div>
              <HelperText text="This field is used to hold your field with a custom variable" />
              <div className="margin-maker"></div>
              {/* <div className="flex items-center my-4">
          <input
            id="default-checkbox"
            type="checkbox"
            defaultValue=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="default-checkbox"
            className="ml-2 text-sm font-medium text-gray-900"
          >
            Is Required
          </label>
        </div> */}
              <button
                type="submit"
                onClick={handleAddFeild}
                className="mx-2 my-2 bg-white transition duration-150 ease-in-out hover:border-indigo-600 rounded hover:bg-indigo-600 hover:text-white border border-indigo-700 text-indigo-700 px-6 py-2 text-base"
              >
                Add Field
              </button>
            </div>
          )}
        </div>
      </div>
    </MainModalEntity>
  );
}

export default CustomFieldTemplateP;
