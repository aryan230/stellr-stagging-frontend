import React from "react";
import { useState } from "react";
import MainModalEntity from "../../UI/MainModals/MainModalEntity";
import Select from "react-select";
import _ from "lodash";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const notificationMethods = [
  { id: "email", title: "Direct" },
  { id: "sms", title: "Time-Based" },
  { id: "push", title: "Event-Based" },
];
function AdvancedShareSettings({
  open,
  setOpen,
  findOrg,
  userInfo,
  ownerUserData,
  share,
  updateShare,
  typeFrom,
  events,
  customCollabs,
}) {
  const [selected, setSelected] = useState("email");
  const [assigned, setAssigned] = useState();
  const [collabs, setCollabs] = useState(
    findOrg &&
      findOrg.collaborators.map(({ user: value, userName: label }) => ({
        value,
        label,
      }))
  );
  const [customColl, setCustomColl] = useState(
    customCollabs
      ? customCollabs.map(({ user: value, userName: label }) => ({
          value,
          label,
        }))
      : []
  );
  const [user, setUser] = useState();
  const [role, setRole] = useState("view");
  const [roleModal, setRoleModal] = useState(false);
  const [expiry, setExpiry] = useState();
  const [type, setType] = useState(
    typeFrom && _.startCase(_.toLower(typeFrom))
  );

  console.log(type);
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
      name: "Sops",
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

  console.log(events);
  const filterFunction = (d) => {
    if (filter.condition == "equals") {
      return d[filter.field].toLowerCase() == filter.value.toLowerCase();
    } else if (filter.condition == "contains") {
      return d[filter.field].toLowerCase().includes(filter.value.toLowerCase());
    } else {
      return d;
    }
  };

  console.log(type);
  const shareExpTime = async () => {
    if (share) {
      if (share.users) {
        let old = share;
        let u = findOrg.collaborators.find((c) => c.user === user);
        u.access = role;
        u.expiry = expiry;
        if (old.users.find((c) => c.user === u.user)) {
          old.users.filter((c) => c.user != u.user);
        }
        old.users.push(u);
        var Newdata = JSON.stringify({
          share: JSON.stringify(old),
        });

        updateShare(Newdata, u.user, role);
      } else {
        let old = share;
        let u = findOrg.collaborators.find((c) => c.user === user);
        u.access = role;
        u.expiry = expiry;
        old.users.push(u);
        var Newdata = JSON.stringify({
          share: JSON.stringify(old),
        });

        updateShare(Newdata, u.user, role);
      }
    } else {
      let u = findOrg.collaborators.find((c) => c.user === user);
      u.access = role;
      u.expiry = expiry;
      let newData = {
        value: "650b013f2bc72230ddaff4be",
        users: [u],
        links: [],
      };
      var Newdata = JSON.stringify({
        share: JSON.stringify(newData),
      });

      updateShare(Newdata, u.user, role);
    }
  };

  const shareEvents = async () => {
    if (share) {
      if (share.users) {
        let old = share;
        let u1 =
          (await findOrg) && findOrg.collaborators.find((c) => c.user === user);
        let u2 =
          (await customCollabs) && customCollabs.find((c) => c.user === user);
        if (u1) {
          let u = u1;
          let users = old.users;
          if (users.find((c) => c.user === u.user)) {
            users = users.filter((item) => item.user !== u.user);
            u.access = role;
            let e = {
              fields,
              filter,
            };
            u.events = [e];
            users.push(u);
            old.users = users;
            var Newdata = JSON.stringify({
              share: JSON.stringify(old),
            });

            updateShare(Newdata, u.user, role);
          } else {
            u.access = role;
            let e = {
              fields,
              filter,
            };
            u.events = [e];
            old.users.push(u);
            var Newdata = JSON.stringify({
              share: JSON.stringify(old),
            });

            updateShare(Newdata, u.user, role);
          }
        } else {
          let u = u2;
          u.access = role;
          let e = {
            fields,
            filter,
          };
          u.events = [e];
          old.users.push(u);
          var Newdata = JSON.stringify({
            share: JSON.stringify(old),
          });

          updateShare(Newdata, u.user, role);
        }
      } else {
        let old = share;
        let u =
          (await findOrg) && findOrg.collaborators.find((c) => c.user === user);
        u.access = role;
        let e = {
          fields,
          filter,
        };
        u.events = [e];
        old.users.push(u);
        var Newdata = JSON.stringify({
          share: JSON.stringify(old),
        });

        updateShare(Newdata, u.user, role);
      }
    } else {
      let u1 =
        (await findOrg) && findOrg.collaborators.find((c) => c.user === user);
      let u2 =
        (await customCollabs) && customCollabs.find((c) => c.user === user);
      if (u1) {
        let u = u1;
        u.access = role;
        let e = {
          fields,
          filter,
        };
        u.events = [e];
        let newData = {
          value: "650b013f2bc72230ddaff4be",
          users: [u],
          links: [],
        };
        var Newdata = JSON.stringify({
          share: JSON.stringify(newData),
        });

        updateShare(Newdata, u.user, role);
      } else {
        let u = u2;
        u.access = role;
        let e = {
          fields,
          filter,
        };
        u.events = [e];
        let newData = {
          value: "650b013f2bc72230ddaff4be",
          users: [u],
          links: [],
        };
        var Newdata = JSON.stringify({
          share: JSON.stringify(newData),
        });

        updateShare(Newdata, u.user, role);
      }
    }
  };

  return (
    <MainModalEntity open={open} setOpen={setOpen}>
      <div className="max-w-3xl mx-auto py-10">
        {" "}
        <fieldset>
          <legend className="text-sm font-semibold leading-6 text-gray-900">
            Advanced Share Settings
          </legend>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            How do you prefer to share?
          </p>
          <div className="mt-6 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            {notificationMethods.map((notificationMethod) => (
              <div
                key={notificationMethod.id}
                className="flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(notificationMethod.id);
                }}
              >
                <input
                  id={notificationMethod.id}
                  name="notification-method"
                  type="radio"
                  defaultChecked={notificationMethod.id === "email"}
                  checked={notificationMethod.id === selected}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected(notificationMethod.id);
                  }}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor={notificationMethod.id}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {notificationMethod.title}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        {/* {expiry} */}
        <div className="mt-10"></div>
        {selected === "email" && (
          <div className="max-w-lg mx-auto">
            <div className="mt-5">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select a role
              </label>
              <select
                id="location"
                name="location"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue="Canada"
              >
                <option>Read</option>
                <option>Write</option>
                <option>Admin</option>
              </select>
            </div>{" "}
            <div className="mt-5">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select User
              </label>
              <Select
                isMulti
                name="colors"
                options={_.unionBy(collabs, customColl, "value")}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Assigned To"
                onChange={(e) => setAssigned(e)}
              />
            </div>
            <div className="mt-8">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Submit
              </button>
            </div>
          </div>
        )}
        {selected === "sms" && (
          <div className="max-w-lg mx-auto">
            <div className="mt-5">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select a role
              </label>
              <select
                id="location"
                name="location"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue="Canada"
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                <option value="Read">Read</option>
                <option value="Write">Write</option>
                <option value="Admin">Admin</option>
              </select>
            </div>{" "}
            <div className="isolate -space-y-px rounded-md shadow-sm mt-5">
              <div className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                <label
                  htmlFor="job-title"
                  className="block text-xs font-medium text-gray-900"
                >
                  Expiry Date and Time
                </label>
                <input
                  type="datetime-local"
                  name="job-title"
                  id="job-title"
                  className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Head of Tomfoolery"
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select User
              </label>
              <Select
                // isMulti
                name="colors"
                options={_.unionBy(collabs, customColl, "value")}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Assigned To"
                onChange={(e) => setUser(e.value)}
              />
            </div>
            <div className="mt-5">
              <label
                htmlFor="comment"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Add your comment
              </label>
              <div className="mt-2">
                <textarea
                  rows={4}
                  name="comment"
                  id="comment"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
            </div>
            <div className="mt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  shareExpTime();
                }}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Submit
              </button>
            </div>
          </div>
        )}
        {selected === "push" && (
          <>
            {" "}
            <div className="max-w-2xl mx-auto pt-0 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <h2 className="sr-only">Checkout</h2>

              <form className="lg:grid lg:gap-x-12 xl:gap-x-16">
                <div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Event Information
                    </h2>
                  </div>

                  <div className="mt-2 border-t border-gray-200 pt-10">
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
                          value={fields && fields}
                          options={
                            type && events
                              ? dataSets
                                  .find((e) => e.name === type)
                                  .fields.map((f) => ({
                                    label: _.startCase(f),
                                    value: f,
                                  }))
                                  .concat(
                                    events.map((f) => ({
                                      label: _.startCase(f),
                                      value: f,
                                    }))
                                  )
                              : dataSets
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
                      Create a condition
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
                    <div className="mt-5">
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Select User
                      </label>
                      <Select
                        // isMulti
                        name="colors"
                        options={_.unionBy(collabs, customColl, "value")}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Assigned To"
                        onChange={(e) => setUser(e.value)}
                      />
                    </div>
                    <div className="mt-5">
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Select a role
                      </label>
                      <select
                        id="location"
                        name="location"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue="Canada"
                        onChange={(e) => {
                          setRole(e.target.value);
                        }}
                      >
                        <option value="Read">Read</option>
                        <option value="Write">Write</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        shareEvents();
                      }}
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Submit
                    </button>
                  </div>
                  {/* Payment */}
                  {/* <div className="mt-10 border-t border-gray-200 pt-10">
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
              </div> */}
                </div>

                {/* Order summary */}
              </form>
            </div>
          </>
        )}
      </div>
    </MainModalEntity>
  );
}

export default AdvancedShareSettings;
