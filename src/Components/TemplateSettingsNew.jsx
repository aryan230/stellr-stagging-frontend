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
import {
  Eye,
  FileText,
  FlaskConical,
  Package,
  PackageOpen,
  Tag,
  Trash,
} from "lucide-react";
import { addTime } from "./Functions/addTime";
import SampleTemplateModal from "./TemplateSettings/SampleTemplateModal";

const user = {
  name: "Whitney Francis",
  email: "whitneyfrancis@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Applicants", href: "#", current: false },
  { name: "Jobs", href: "#", current: false },
  { name: "Company", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];
const tabs = [
  { name: "Applied", href: "#", count: "2", current: false },
  { name: "Phone Screening", href: "#", count: "4", current: false },
  { name: "Interview", href: "#", count: "6", current: true },
  { name: "Offer", href: "#", current: false },
  { name: "Disqualified", href: "#", current: false },
];
const candidates = [
  {
    name: "Emily Selman",
    email: "emilyselman@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    applied: "January 7, 2020",
    appliedDatetime: "2020-07-01T15:34:56",
    status: "Completed phone screening",
  },
  // More candidates...
];
const publishingOptions = [
  {
    name: "Published",
    description: "This job posting can be viewed by anyone who has the link.",
    current: true,
  },
  {
    name: "Draft",
    description: "This job posting will no longer be publicly accessible.",
    current: false,
  },
];
const payments = [
  {
    id: 1,
    date: "1/1/2020",
    datetime: "2020-01-01",
    description: "Business Plan - Annual Billing",
    amount: "CA$109.00",
    href: "#",
  },
  // More payments...
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function TemplateSettingsNew() {
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

  const [sampleTemplateModal, setSampleTemplateModal] = useState(false);
  const [sampleData, setSampleData] = useState(false);
  return (
    <div className="project-component">
      {templateModal && (
        <TemplateModal
          templateModal={templateModal}
          setTemplateModal={setTemplateModal}
          templateContent={templateContent}
        />
      )}

      {sampleTemplateModal && (
        <SampleTemplateModal
          setSampleTemplateModal={setSampleTemplateModal}
          sampleTemplateModal={sampleTemplateModal}
          data={sampleData}
        />
      )}
      <div className="project-component-inside">
        <div div className="xl:w-3/4 2xl:w-4/5 w-full mx-auto font-dmsans">
          <div className="px-4 md:px-10 py-4 md:py-7">
            <div className="sm:flex items-center justify-between">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800">
                Template Settings
              </p>
              <div className="mt-4 sm:mt-0">
                {/* <button className="inline-flex sm:ml-3 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
                  <p className="text-sm font-medium leading-none text-white"></p>
                </button> */}
              </div>
            </div>
          </div>
          <div className="bg-white px-4 md:px-10 pb-5">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <tbody>
                  {customSamples &&
                    customSamples.length > 0 &&
                    customSamples
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
                            <tr className="text-sm leading-none text-gray-600 h-16">
                              <td className="w-1/2">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 mb-4 lg:mb-0 mr-4">
                                    <Package className="h-full w-full" />
                                  </div>
                                  <div className="pl-2">
                                    <p className="text-sm font-medium leading-none text-gray-800">
                                      {doc.name}
                                    </p>
                                    <p className="text-xs leading-3 text-gray-600 mt-2">
                                      Created on {addTime(doc.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="pl-16">
                                <p>sample</p>
                              </td>
                              <td>
                                <p className="pl-16">
                                  Last updated at {addTime(doc.updatedAt)}
                                </p>
                              </td>
                              <td>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSampleData(doc);
                                    setSampleTemplateModal(true);
                                  }}
                                  className="inline-flex sm:ml-3 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
                                >
                                  <p className="text-sm font-medium leading-none text-white">
                                    View
                                  </p>
                                </button>
                              </td>
                              {/* <td>
                                <button className="inline-flex sm:ml-3 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
                                  <p className="text-sm font-medium leading-none text-white">
                                    Archive
                                  </p>
                                </button>
                              </td> */}
                            </tr>
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
                          entry._id
                            .toLowerCase()
                            .includes(inputSearch.toLowerCase())
                      )
                      .map(
                        (doc, index) =>
                          !doc.deleted && (
                            <tr className="text-sm leading-none text-gray-600 h-16">
                              <td className="w-1/2">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 mb-4 lg:mb-0 mr-4">
                                    <FileText className="h-full w-full" />
                                  </div>
                                  <div className="pl-2">
                                    <p className="text-sm font-medium leading-none text-gray-800">
                                      {doc.name}
                                    </p>
                                    <p className="text-xs leading-3 text-gray-600 mt-2">
                                      Created on {addTime(doc.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="pl-16">
                                <p>entry</p>
                              </td>
                              <td>
                                <p className="pl-16">
                                  Last updated at {addTime(doc.updatedAt)}
                                </p>
                              </td>
                              <td>
                                <button
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    setTemplateContent(doc);
                                    setTemplateModal(true);
                                  }}
                                  className="inline-flex sm:ml-3 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
                                >
                                  <p className="text-sm font-medium leading-none text-white">
                                    View
                                  </p>
                                </button>
                              </td>
                              {/* <td>
                                <button className="inline-flex sm:ml-3 items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded">
                                  <p className="text-sm font-medium leading-none text-white">
                                    Archive
                                  </p>
                                </button>
                              </td> */}
                            </tr>
                          )
                      )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateSettingsNew;
