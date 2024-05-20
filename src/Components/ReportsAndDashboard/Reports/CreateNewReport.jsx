import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/solid";
import MainModalEntity from "../../../UI/MainModals/MainModalEntity";
import Select from "react-select";
import { useSelector } from "react-redux";
import axios from "axios";
import URL from "./../../../Data/data.json";
import { X } from "lucide-react";
import MainLoader from "../../Loaders/MainLoader";
import CompleteLoader from "../../Loaders/CompleteLoader";
import SecondLoaderWithText from "../../Loaders/SecondLoaderWithText";
import _ from "lodash";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CreateNewReport({
  reportTab,
  setReportTab,
  dataValue,
  newReport,
  typeFrom,
  setNewReport,
  setActiveReport,
}) {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [type, setType] = useState(typeFrom && typeFrom);
  const [filter, setFilter] = useState({
    value: "",
    condition: "contains",
    field: "_id",
  });
  const [charts, setCharts] = useState([]);
  const [fields, setFields] = useState([
    {
      label: "Id",
      value: "_id",
    },
  ]);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoader(true);
    let insideData = await JSON.stringify(dataValue);
    var data = await JSON.stringify({
      name,
      description,
      type,
      dataSet: JSON.stringify({
        charts: charts,
        insideData,
        fields: fields,
        filter: filter,
        typeOfReport: "new",
      }),
    });
    var config = {
      method: "post",
      url: `${URL[0]}api/reports`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function(response) {
        setNewReport(true);
        setActiveReport("reports");
        setReportTab(false);
        setLoader(false);
      })
      .catch(function(error) {
        console.log(error);
        setLoader(false);
      });
    console.log(data);
  };

  const dataSets = [
    {
      name: "Entries",
      fields: ["_id", "name", "updatedAt", "createdAt"],
      charts: [
        {
          id: "area",
          chartName: "Area Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/05/area-chart-spline.svg",
        },
        {
          id: "line",
          chartName: "Line Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/01/basic-line-chart.svg",
        },
      ],
    },
    {
      name: "Tasks",
      fields: ["_id", "subject", "updatedAt", "createdAt"],
      charts: [
        {
          id: "area",
          chartName: "Area Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/05/area-chart-spline.svg",
        },
        {
          id: "line",
          chartName: "Line Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/01/basic-line-chart.svg",
        },
      ],
    },
    {
      name: "Protocols",
      fields: ["_id", "title", "updatedAt", "createdAt"],
      charts: [
        {
          id: "area",
          chartName: "Area Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/05/area-chart-spline.svg",
        },
        {
          id: "pie",
          chartName: "Pie Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2020/01/pie-chart-2.png",
        },
        {
          id: "line",
          chartName: "Line Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/01/basic-line-chart.svg",
        },
      ],
    },
    {
      name: "SOPS",
      fields: ["_id", "title", "updatedAt", "createdAt"],
      charts: [
        {
          id: "area",
          chartName: "Area Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/05/area-chart-spline.svg",
        },
        {
          id: "pie",
          chartName: "Pie Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2020/01/pie-chart-2.png",
        },
        {
          id: "line",
          chartName: "Line Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/01/basic-line-chart.svg",
        },
      ],
    },
    {
      name: "Samples",
      fields: ["_id", "type", "updatedAt", "createdAt", "sampleId", "__v"],
      charts: [
        {
          id: "area",
          chartName: "Area Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/05/area-chart-spline.svg",
        },
        {
          id: "pie",
          chartName: "Pie Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2020/01/pie-chart-2.png",
        },
        {
          id: "line",
          chartName: "Line Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/01/basic-line-chart.svg",
        },
      ],
    },
    {
      name: "Projects",
      fields: ["_id", "name", "updatedAt", "createdAt"],
      charts: [
        {
          id: "line",
          chartName: "Line Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/01/basic-line-chart.svg",
        },
        {
          id: "column",
          chartName: "Column Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/05/barcharts-distributed-column-chart.svg",
        },
        {
          id: "area",
          chartName: "Area Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2018/05/area-chart-spline.svg",
        },
        {
          id: "pie",
          chartName: "Pie Chart",
          des: "",
          url:
            "https://apexcharts.com/wp-content/uploads/2020/01/combine-other-slice-in-pie-chart.png",
        },
        {
          id: "funnel",
          chartName: "Funnel Chart",
          des: "",
          url:
            "https://www.automateexcel.com/excel/wp-content/uploads/2020/10/sales-funnel-chart.png",
        },
      ],
    },
  ];
  console.log(filter);

  const filterFunction = (d) => {
    if (filter.condition == "equals") {
      return d[filter.field].toLowerCase() == filter.value.toLowerCase();
    } else if (filter.condition == "contains") {
      return d[filter.field].toLowerCase().includes(filter.value.toLowerCase());
    } else {
      return d;
    }
  };
  return (
    <MainModalEntity open={reportTab} setOpen={setReportTab} width="80vw">
      <div className="bg-gray-50 relative">
        {loader && <SecondLoaderWithText text="Generating your report" />}

        <div
          className="absolute top-5 right-5"
          onClick={(e) => {
            setReportTab(false);
          }}
        >
          <X className="text-gray-600 w-7 h-7" />
        </div>
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Checkout</h2>

          <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Report Information
                </h2>

                <div className="mt-4">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter name for report
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="email-address"
                      name="email-address"
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="email"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Report Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      rows={4}
                      name="comment"
                      id="comment"
                      onChange={(e) => setDescription(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">
                  Select Fields
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Select Entity
                    </label>
                    <select
                      disabled={typeFrom ? "true" : "false"}
                      id="countries_disabled"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      name="location"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select an option</option>
                      <option value="Samples">Samples</option>
                      <option value="Projects">Projects</option>
                      <option value="Entries">Entries</option>
                      <option value="Tasks">Tasks</option>
                      <option value="Protocols">Protocols</option>
                      <option value="SOPS">SOPS</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="" className="mb-1">
                      Select Columns
                    </label>
                    <Select
                      isMulti
                      value={fields}
                      options={
                        type &&
                        dataSets
                          .find((e) => e.name === type)
                          .fields.map((f) => ({
                            label: _.startCase(f),
                            value: f,
                          }))
                      }
                      onChange={(e) => setFields(e)}
                      isOptionDisabled={() => fields.length >= 5}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">
                  Filter By Properties
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                  <div className="">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Select Field
                    </label>
                    <select
                      id="countries_disabled"
                      value={filter.field}
                      onChange={(e) => {
                        setFilter((f) => ({
                          ...f,
                          field: e.target.value,
                        }));
                      }}
                      name="location"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {fields.map((f) => (
                        <option value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Condition
                    </label>
                    <select
                      id="countries_disabled"
                      value={filter.condition}
                      onChange={(e) => {
                        setFilter((f) => ({
                          ...f,
                          condition: e.target.value,
                        }));
                      }}
                      name="location"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="contains">contains</option>
                      <option value="equals">equals</option>
                      <option value="starts with">starts with</option>
                      <option value="ends with">ends with</option>
                    </select>
                  </div>
                  <div className="">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter value
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="email-address"
                        name="email-address"
                        onChange={(e) => {
                          setFilter((f) => ({
                            ...f,
                            value: e.target.value,
                          }));
                        }}
                        autoComplete="email"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="mt-10 border-t border-gray-200 pt-10">
                <div className="w-full">
                  <div className="w-full">
                    <h3 className="mb-5 text-lg font-medium text-gray-900">
                      Choose Charts:
                    </h3>
                    <ul className="grid w-full gap-6 md:grid-cols-2">
                      {type &&
                        dataSets
                          .find((e) => e.name === type)
                          .charts.map((c) => (
                            <li>
                              <input
                                type="checkbox"
                                id={c.id}
                                defaultValue=""
                                className="hidden peer"
                                required=""
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCharts((prev) => [...prev, c.id]);
                                  } else {
                                    setCharts((prev) =>
                                      prev.filter((e) => e != c.id)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={c.id}
                                className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50"
                              >
                                <div className="block">
                                  <img
                                    src={c.url}
                                    alt=""
                                    className="w-15 h-15"
                                  />
                                  <div className="w-full text-lg font-semibold">
                                    {c.chartName}
                                  </div>
                                  <div className="w-full text-sm">
                                    Visualization of data throughput over time.
                                  </div>
                                </div>
                              </label>
                            </li>
                          ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                Report summary
              </h2>

              <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="sr-only">Items in your cart</h3>

                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="overflow-hidden">
                        <table className="min-w-full">
                          <thead>
                            <tr>
                              {fields.map((f) => (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                                >
                                  {f.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {type === "SOPS" ||
                            type === "Protocols" ||
                            type === "Samples"
                              ? dataValue &&
                                dataValue
                                  .filter(filterFunction)
                                  .map((person) => (
                                    <tr>
                                      {fields.map((f) => (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {person[f.value].toString()}
                                        </td>
                                      ))}
                                    </tr>
                                  ))
                              : type === "Projects"
                              ? dataValue &&
                                dataValue.projects
                                  .filter(filterFunction)
                                  .map((person) => (
                                    <tr>
                                      {fields.map((f) => (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {person[f.value].toString()}
                                        </td>
                                      ))}
                                    </tr>
                                  ))
                              : type === "Entries"
                              ? dataValue &&
                                dataValue.entries
                                  .filter(filterFunction)
                                  .map((person) => (
                                    <tr>
                                      {fields.map((f) => (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {person[f.value].toString()}
                                        </td>
                                      ))}
                                    </tr>
                                  ))
                              : dataValue &&
                                dataValue.tasks
                                  .filter(filterFunction)
                                  .map((person) => (
                                    <tr>
                                      {fields.map((f) => (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {person[f.value].toString()}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <button
                  type="submit"
                  onClick={submitHandler}
                  className="w-[70%] font-dmsans bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainModalEntity>
  );
}

export default CreateNewReport;
