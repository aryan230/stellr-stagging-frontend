import React from "react";
import ShowChartProjects from "./ShowChartsData/ShowChartProjects";
import ShowChartEntries from "./ShowChartsData/ShowChartEntries";
import ShowChartTasks from "./ShowChartsData/ShowChartTasks";
import ShowChartProtocols from "./ShowChartsData/ShowChartProtocols";
import ShowChartSamples from "./ShowChartsData/ShowChartSamples";
import ShowChartSOP from "./ShowChartsData/ShowChartSOP";

export default function ShowChartsMain({ i, j }) {
  return (
    <>
      {" "}
      {i.data[j] && i.data[j].e.value.split("-")[0] === "Projects" && (
        <ShowChartProjects c={i.data[j].e} />
      )}
      {i.data[j] && i.data[j].e.value.split("-")[0] === "Entries" && (
        <ShowChartEntries c={i.data[j].e} />
      )}
      {i.data[j] && i.data[j].e.value.split("-")[0] === "Tasks" && (
        <ShowChartTasks c={i.data[j].e} />
      )}
      {i.data[j] && i.data[j].e.value.split("-")[0] === "Protocols" && (
        <ShowChartProtocols c={i.data[j].e} />
      )}
      {i.data[j] && i.data[j].e.value.split("-")[0] === "Samples" && (
        <ShowChartSamples c={i.data[j].e} />
      )}
      {i.data[j] && i.data[j].e.value.split("-")[0] === "SOPS" && (
        <ShowChartSOP c={i.data[j].e} />
      )}
    </>
  );
}
