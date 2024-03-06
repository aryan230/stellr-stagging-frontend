/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
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
function ViewReportMain({ viewReportContent, open, setOpen }) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [mainData, setMainData] = useState(viewReportContent);
  const [chartsData, setChartsData] = useState(
    viewReportContent && JSON.parse(viewReportContent.dataSet).charts
  );

  return (
    <MainModalEntity open={open} setOpen={setOpen}>
      {" "}
      {mainData && mainData.type === "SOPS" && <SOPReport data={mainData} />}
      {mainData && mainData.type === "Tasks" && <TaskReport data={mainData} />}
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
    </MainModalEntity>
  );
}

export default ViewReportMain;
