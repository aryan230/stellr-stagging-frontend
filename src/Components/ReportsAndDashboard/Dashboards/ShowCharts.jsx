import React from "react";
import ShowChartProjects from "./ShowChartsData/ShowChartProjects";
import ShowChartEntries from "./ShowChartsData/ShowChartEntries";
import ShowChartTasks from "./ShowChartsData/ShowChartTasks";
import ShowChartProtocols from "./ShowChartsData/ShowChartProtocols";
import ShowChartSamples from "./ShowChartsData/ShowChartSamples";
import ShowChartSOP from "./ShowChartsData/ShowChartSOP";
import ShowChartsMain from "./ShowChartsMain";

function ShowCharts({ insideData }) {
  console.log(insideData);
  return (
    <>
      {" "}
      {insideData &&
        insideData.length > 0 &&
        insideData.map((i) =>
          i.layout === 1 ? (
            <div className="">
              <ShowChartsMain i={i} j={0} />
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <div className="w-[48%]">
                {" "}
                <ShowChartsMain i={i} j={0} />
              </div>
              <div className="w-[48%]">
                <ShowChartsMain i={i} j={1} />
              </div>
            </div>
          )
        )}
    </>

    // <>
    // {insideData &&
    //   insideData.length > 0 &&
    //   insideData.map(
    //     (c) =>
    //       c.value.split("-")[0] === "Projects" && <ShowChartProjects c={c} />
    //   )}
    // {insideData &&
    //   insideData.length > 0 &&
    //   insideData.map(
    //     (c) =>
    //       c.value.split("-")[0] === "Entries" && <ShowChartEntries c={c} />
    //   )}
    // {insideData &&
    //   insideData.length > 0 &&
    //   insideData.map(
    //     (c) => c.value.split("-")[0] === "Tasks" && <ShowChartTasks c={c} />
    //   )}
    // {insideData &&
    //   insideData.length > 0 &&
    //   insideData.map(
    //     (c) =>
    //       c.value.split("-")[0] === "Protocols" && (
    //         <ShowChartProtocols c={c} />
    //       )
    //   )}
    // {insideData &&
    //   insideData.length > 0 &&
    //   insideData.map(
    //     (c) =>
    //       c.value.split("-")[0] === "Samples" && <ShowChartSamples c={c} />
    //   )}
    // {insideData &&
    //   insideData.length > 0 &&
    //   insideData.map(
    //     (c) => c.value.split("-")[0] === "SOPS" && <ShowChartSOP c={c} />
    //   )}
    // </>
  );
}

export default ShowCharts;
