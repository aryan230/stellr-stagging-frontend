import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listMyTemplates } from "../redux/actions/entryTemplatesActions";
import InsideLoader from "./Loader/InsideLoader";
import Select from "react-select";
import TemplateModal from "./TemplateSettings/TemplateModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import URL from "./../Data/data.json";
import {
  ChevronDownIcon,
  SearchIcon,
  SortAscendingIcon,
} from "@heroicons/react/solid";
import { MailIcon, PhoneIcon } from "@heroicons/react/solid";
import { Eye, FileText, Tag, Trash } from "lucide-react";
import { addTime } from "./Functions/addTime";

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  // More people...
];

function TemplateSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputSearch, setInputSearch] = useState("");
  const [id, setId] = useState();
  const [templateModal, setTemplateModal] = useState(false);
  const [templateContent, setTemplateContent] = useState();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [customSamples, setCustomSamples] = useState();

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
            response.data.map(({ name: label, _id: value, ...rest }) => ({
              _id: value,
              name: label,
              sampleInsideType: "Sample",
              ...rest,
            }))
          );
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const entryTemplateListMy = useSelector((state) => state.entryTemplateListMy);
  const { templates, loading, error } = entryTemplateListMy;

  useEffect(() => {
    dispatch(listMyTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (!customSamples) {
      getMySamples();
    }
  }, [customSamples]);

  //   useEffect(() => {
  //     if (newSop) {
  //       dispatch(listMySops(userInfo._id));
  //       setNewSop(false);
  //     }
  //   }, [newSop]);

  const deleteHandler = async (id) => {
    var config = {
      method: "delete",
      url: `${URL[0]}api/entry/templates/${id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    axios(config)
      .then(function(response) {
        console.log(JSON.stringify(response.data));
        toast.success("Template Deleted sucessfully");
        dispatch(listMyTemplates());
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  return (
    <div className="project-component">
      {templateModal && (
        <TemplateModal
          templateModal={templateModal}
          setTemplateModal={setTemplateModal}
          templateContent={templateContent}
        />
      )}

      <div className="project-component-inside">
        <div className="w-[80%] h-[100%] mx-auto">
          {" "}
          <div className="font-body pt-5 pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Template Settings
            </h3>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <label htmlFor="mobile-search-candidate" className="sr-only">
                Search
              </label>
              <label htmlFor="desktop-search-candidate" className="sr-only">
                Search
              </label>
              <div className="flex rounded-md shadow-sm">
                <div className="relative flex-grow focus-within:z-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    name="mobile-search-candidate"
                    id="mobile-search-candidate"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:hidden border-gray-300"
                    placeholder="Search"
                  />
                  <input
                    type="text"
                    name="desktop-search-candidate"
                    id="desktop-search-candidate"
                    className="hidden focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-none rounded-l-md pl-10 sm:block sm:text-sm border-gray-300"
                    placeholder="Search templates by name"
                    onChange={(e) => setInputSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <ul
            role="list"
            className="w-[100%] px-5 h-[80%] overflow-y-auto flex flex-wrap items-start justify-left"
          >
            {customSamples &&
              customSamples.length > 0 &&
              customSamples
                .filter(
                  (entry) =>
                    entry.name
                      .toLowerCase()
                      .includes(inputSearch.toLowerCase()) ||
                    entry._id.toLowerCase().includes(inputSearch.toLowerCase())
                )
                .map(
                  (doc, index) =>
                    !doc.deleted && (
                      <div className="relative m-5 font-body flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
                        <div className="p-6">
                          <Tag className="w-6 h-6 mb-4 text-gray-900" />
                          <h5 className="block mb-2 font-body text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            {doc.name}
                          </h5>
                          <p className="block font-body text-base antialiased font-light leading-relaxed text-inherit">
                            Created on {addTime(doc.createdAt)}.
                          </p>
                        </div>
                        <div className="p-6 pt-0">
                          <a href="#" className="inline-block">
                            <button
                              className="flex items-center gap-2 px-4 py-2 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
                              type="button"
                            >
                              View
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                />
                              </svg>
                            </button>
                          </a>
                        </div>
                      </div>
                    )
                )}
            {templates &&
              templates.length > 0 &&
              templates
                .filter(
                  (entry) =>
                    entry.name
                      .toLowerCase()
                      .includes(inputSearch.toLowerCase()) ||
                    entry._id.toLowerCase().includes(inputSearch.toLowerCase())
                )
                .map(
                  (doc, index) =>
                    !doc.deleted && (
                      <div className="relative m-5 font-body flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
                        <div className="p-6">
                          <FileText className="w-6 h-6 mb-4 text-gray-900" />
                          <h5 className="block mb-2 font-body text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                            {doc.name}
                          </h5>
                          <p className="block font-body text-base antialiased font-light leading-relaxed text-inherit">
                            Created on {addTime(doc.createdAt)}.
                          </p>
                        </div>
                        <div className="p-6 pt-0">
                          <a href="#" className="inline-block">
                            <button
                              className="flex items-center gap-2 px-4 py-2 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
                              type="button"
                              onClick={async (e) => {
                                e.preventDefault();
                                setTemplateContent(doc);
                                setTemplateModal(true);
                              }}
                            >
                              View
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                />
                              </svg>
                            </button>
                          </a>
                        </div>
                      </div>
                    )
                )}
          </ul>
        </div>

        {/* <div className="project-c-header">
          <div className="project-c-header-left">
            <button className="p-c-h-l-t">
              {" "}
              <h1> Browse Templates</h1>
            </button>
            <Select placeholder="Select Template from" />
          </div>

          <input
            type="text"
            placeholder={`Search templates by name`}
            onChange={(e) => setInputSearch(e.target.value)}
          />
        </div>

        <div className="project-c-bottom">
          {loading ? (
            <InsideLoader />
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Template Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Template Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Template Type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3">
                      View
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templates &&
                    templates.length > 0 &&
                    templates
                      .filter(
                        (entry) =>
                          entry.name
                            .toLowerCase()
                            .includes(inputSearch.toLowerCase()) ||
                          entry._id
                            .toLowerCase()
                            .includes(inputSearch.toLowerCase())
                      )
                      .map(
                        (doc, index) =>
                          !doc.deleted && (
                            <tr className="bg-white border-b">
                              <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                              >
                                {doc._id}
                              </th>
                              <td className="px-6 py-4">{doc.name}</td>
                              <td className="px-6 py-4">Entry</td>
                              <td className="px-6 py-4">
                                {new Date(doc.createdAt).toLocaleString(
                                  "en-GB"
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <a
                                  href="#"
                                  className="text-indigo-600"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    setTemplateContent(doc);
                                    setTemplateModal(true);
                                  }}
                                >
                                  View
                                </a>
                              </td>
                              <td className="px-6 py-4">
                                <a
                                  href="#"
                                  className="text-red-600"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    deleteHandler(doc._id);
                                  }}
                                >
                                  Delete
                                </a>
                              </td>
                            </tr>
                          )
                      )}
                </tbody>
              </table>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default TemplateSettings;
