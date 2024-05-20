/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import ProjectReport from "./Reports/ViewReports/ProjectReport";
import SampleReport from "./Reports/ViewReports/SampleReport";
import ProtocolReport from "./Reports/ViewReports/ProtocolReport";
import EntryReport from "./Reports/ViewReports/EntryReport";
import TaskReport from "./Reports/ViewReports/TaskReport";
import SOPReport from "./Reports/ViewReports/SOPReport";
import { useSelector } from "react-redux";
import MainModalEntity from "../../UI/MainModals/MainModalEntity";
import CompleteLoader from "../Loaders/CompleteLoader";

function ViewReportMain({ viewReportContent, open, setOpen, openR, setOpenR }) {
  console.log(viewReportContent);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [mainData, setMainData] = useState();
  const [chartsData, setChartsData] = useState();

  useEffect(() => {
    if (viewReportContent) {
      setMainData(viewReportContent);
      setChartsData(JSON.parse(viewReportContent.dataSet).charts);
    }
  }, [viewReportContent]);

  useEffect(() => {
    if (openR) {
      window.setTimeout(() => {
        setOpenR(false);
      }, 2000);
    }
  }, [openR]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-[999999999]"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-7xl font-dmsans">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-medium text-white">
                        {mainData && mainData.name && mainData.name}
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-indigo-300">
                        Report ID: {mainData && mainData._id && mainData._id}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex-1 py-6 px-4 sm:px-6">
                    {openR ? (
                      <CompleteLoader />
                    ) : (
                      <div className="absolute inset-0 py-6 px-4 sm:px-6">
                        <div className="w-[80%] mx-auto py-10">
                          {" "}
                          {mainData && mainData.type === "SOPS" && (
                            <SOPReport data={mainData} />
                          )}
                          {mainData && mainData.type === "Tasks" && (
                            <TaskReport data={mainData} />
                          )}
                          {mainData && mainData.type === "Entries" && (
                            <EntryReport data={mainData} />
                          )}
                          {mainData && mainData.type === "Projects" && (
                            <ProjectReport data={mainData} />
                          )}
                          {mainData && mainData.type === "Samples" && (
                            <SampleReport data={mainData} />
                          )}
                          {mainData && mainData.type === "Protocols" && (
                            <ProtocolReport data={mainData} />
                          )}
                        </div>
                      </div>
                    )}
                    {/* Replace with your content */}

                    {/* /End replace */}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ViewReportMain;
