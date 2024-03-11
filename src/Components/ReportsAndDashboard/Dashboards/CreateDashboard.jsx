import React, { useState } from "react";
import MainModalEntity from "../../../UI/MainModals/MainModalEntity";
import {
  AreaChart,
  CheckCircle2,
  Columns,
  Plus,
  PlusCircle,
  Square,
  Squirrel,
} from "lucide-react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import Select from "react-select";
import CreateDashboardSelect from "./CreateDashboardSelect";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";
import URL from "./../../../Data/data.json";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CreateDashboard({
  setCreateNewDash,
  newDash,
  setNewDash,
  createNewDash,
}) {
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [selectedData, setSelectedData] = useState([
    {
      id: 1,
      layout: 2,
      data: [],
    },
    { id: 2, layout: 1, data: [] },
  ]);
  const layouts = [
    {
      id: 1,
      name: "Single Column Layout",
    },
    {
      id: 2,
      name: "Multiple Column Layout",
    },
  ];

  const [selectModal, setSelectModal] = useState(false);
  const [selectModalID, setSelectModalID] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    let insideData = await JSON.stringify(selectedData);
    var data = await JSON.stringify({
      name,
      description,
      dataSet: JSON.stringify({
        insideData,
        typeofDash: "new",
      }),
    });
    var config = {
      method: "post",
      url: `${URL[0]}api/dashboards`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function(response) {
        console.log(response.data);
        setCreateNewDash(false);
        setNewDash(true);
      })
      .catch(function(error) {
        console.log(error);
      });
    console.log(data);
  };

  return (
    <MainModalEntity setOpen={setCreateNewDash} open={createNewDash}>
      <CreateDashboardSelect
        setOpen={setSelectModal}
        open={selectModal}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        selectModalID={selectModalID}
      />
      <div className="mt-4">
        <label
          htmlFor="email-address"
          className="block text-sm font-medium text-gray-700"
        >
          Enter name for dashboard
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
          Dashboard Description
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
      <div className="">
        {selectedData.map((d, index) =>
          d.layout === 1 ? (
            <div className="mt-4 p-5 relative" key={d.id}>
              <div className="absolute top-2 right-2 flex flex-col">
                {/* <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedData(selectedData.filter((p) => p.id != d.id));
                  }}
                  className="mb-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  edit
                </button> */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedData(selectedData.filter((p) => p.id != d.id));
                  }}
                  className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  remove
                </button>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectModal(true);
                  setSelectModalID({
                    limit: 1,
                    id: index,
                    dd: d.data.length,
                  });
                }}
                className={`relative block w-[80%] mx-auto border-2 ${
                  d.data && d.data.length > 0
                    ? "border-indigo-600 hover:border-indigo-700"
                    : "border-gray-300 border-dashed hover:border-gray-400"
                } rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {d.data && d.data.length > 0 ? (
                  <CheckCircle2 className="mx-auto h-12 w-12 text-indigo-600" />
                ) : (
                  <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
                )}

                <span className="mt-2 block text-sm font-medium text-gray-900">
                  {d.data && d.data.length > 0
                    ? d.data[0].e.label
                    : "add charts/graphs"}
                </span>
              </button>
            </div>
          ) : (
            <div className="mt-4 p-5 relative" key={d.id}>
              {" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedData(selectedData.filter((p) => p.id != d.id));
                }}
                className="absolute inline-flex top-2 right-2 items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                remove
              </button>
              <div className="flex w-[80%] mx-auto items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectModal(true);
                    setSelectModalID({
                      limit: 2,
                      id: index,
                      id2: 0,
                      dd: d.data.length,
                    });
                  }}
                  className={`relative block w-[48%] border-2 ${
                    d.data && d.data.length > 0 && d.data[0]
                      ? "border-indigo-600 hover:border-indigo-700"
                      : "border-gray-300 border-dashed hover:border-gray-400"
                  } rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {d.data && d.data.length > 0 && d.data[0] ? (
                    <CheckCircle2 className="mx-auto h-12 w-12 text-indigo-600" />
                  ) : (
                    <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
                  )}

                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {d.data && d.data.length > 0 && d.data[0]
                      ? d.data[0].e.label
                      : "add charts/graphs"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectModal(true);
                    setSelectModalID({
                      limit: 2,
                      id: index,
                      id2: 1,
                      dd: d.data.length,
                    });
                  }}
                  className={`relative block w-[48%] border-2 ${
                    d.data && d.data.length > 0 && d.data[1]
                      ? "border-indigo-600 hover:border-indigo-700"
                      : "border-gray-300 border-dashed hover:border-gray-400"
                  } rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {d.data && d.data.length > 0 && d.data[1] ? (
                    <CheckCircle2 className="mx-auto h-12 w-12 text-indigo-600" />
                  ) : (
                    <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
                  )}

                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {d.data && d.data.length > 0 && d.data[1]
                      ? d.data[1].e.label
                      : "add charts/graphs"}
                  </span>
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <div className="flex items-center justify-start">
        {" "}
        <a
          href=""
          className="text-indigo-600 mt-4 block"
          onClick={(e) => {
            e.preventDefault();
            if (selectedData.length > 3) {
              toast.error("Please select only upto 4");
            } else {
              setSelectedData((selectedData) => [
                ...selectedData,
                {
                  id: selectedData.length + 1,
                  layout: 1,
                  data: [],
                },
              ]);
            }
          }}
        >
          add single column layout
        </a>
        <a
          href=""
          className="text-indigo-600 mt-4 block ml-5"
          onClick={(e) => {
            e.preventDefault();
            if (selectedData.length > 3) {
              toast.error("Please select only upto 4");
            } else {
              setSelectedData((selectedData) => [
                ...selectedData,
                {
                  id: selectedData.length + 1,
                  layout: 2,
                  data: [],
                },
              ]);
            }
          }}
        >
          add Multi-column layout
        </a>
      </div>

      <button
        type="button"
        onClick={submitHandler}
        className="inline-flex mt-10 items-center px-4 py-2 border border-transparent text-base font-dmsans rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Generate Dashboard
      </button>
    </MainModalEntity>
  );
}

export default CreateDashboard;
