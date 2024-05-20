import React, { useRef, useState } from "react";
import CustomLine from "../../../CustomCharts/CustomLine";
import CustomPieChart from "../../../CustomCharts/CustomPieChart";
import { useSelector } from "react-redux";
import CustomAreaChart from "../../../CustomCharts/CustomAreaChart";
import CustomColumnChartDist from "../../../CustomCharts/CustomColumnChartDist";
import CustomFunnel from "../../../CustomCharts/CustomFunnel";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import TopDataReport from "./TopDataReport";
import { addTime } from "../../../Functions/addTime";
function EntryReport({ data }) {
  const pdfRef = useRef();

  const [chartsData, setChartsData] = useState(JSON.parse(data.dataSet).charts);
  const [newArr, setNewArr] = useState(
    JSON.parse(JSON.parse(data.dataSet).insideData).newArr
  );

  const [entries, setEntries] = useState(
    JSON.parse(JSON.parse(data.dataSet).insideData).entries
  );
  console.log(data);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [fields, setFields] = useState(
    JSON.parse(data.dataSet).typeOfReport && JSON.parse(data.dataSet).fields
  );

  const [typeOfreport, setTypeofreport] = useState(
    JSON.parse(data.dataSet).typeOfReport ? true : false
  );

  const [filter, setFilter] = useState(
    JSON.parse(data.dataSet).filter && JSON.parse(data.dataSet).filter
  );

  const filterFunction = (d) => {
    if (filter) {
      if (filter.condition == "equals") {
        return d[filter.field].toLowerCase() == filter.value.toLowerCase();
      } else if (filter.condition == "contains") {
        return d[filter.field]
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      } else {
        return d;
      }
    } else {
      return d;
    }
  };

  let dataInsideLine = entries && {
    name: "Entries",
    data: [
      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "01").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "02").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "03").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "04").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "05").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "06").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "07").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "08").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "09").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "10").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "11").length,

      entries &&
        entries.filter((e) => e.createdAt.split("-")[1] == "12").length,
    ],
  };

  const labels = ["My Projects", "Collaborated Projects"];

  return (
    <div ref={pdfRef}>
      <TopDataReport data={data} pdfRef={pdfRef} />
      <div className="view-report-charts">
        {chartsData.map(
          (e) =>
            e === "line" && (
              <div className="py-10">
                <CustomLine dataInside={dataInsideLine ? dataInsideLine : []} />
              </div>
            )
        )}
        {/* {chartsData.map(
          (e) =>
            e === "pie" && (
              <div className="py-10">
                <CustomPieChart
                  labels={labels}
                  seriesData={
                    newArr
                      ? [
                          newArr.filter((p) => p.user == userInfo._id).length,
                          newArr.length -
                            newArr.filter((p) => p.user == userInfo._id).length,
                        ]
                      : []
                  }
                />
              </div>
            )
        )} */}
        {chartsData.map(
          (e) =>
            e === "area" && (
              <div className="py-10">
                <CustomAreaChart
                  dataInside={dataInsideLine ? dataInsideLine : []}
                />
              </div>
            )
        )}
        {/* {chartsData.map(
          (e) =>
            e === "column" && (
              <div className="py-10">
                <CustomColumnChartDist
                  dataInside={
                    projectStats
                      ? {
                          name: "Record Count",
                          data: projectStats.stats.map((e) => e.entries),
                        }
                      : []
                  }
                  dataLabel={
                    projectStats ? projectStats.stats.map((e) => e.name) : []
                  }
                />
              </div>
            )
        )}
        {chartsData.map(
          (e) =>
            e === "funnel" && (
              <div className="py-10">
                <CustomFunnel
                  dataInside={
                    projectStats
                      ? {
                          name: "Record Count",
                          data: projectStats.stats.map((e) => e.entries),
                        }
                      : []
                  }
                  dataLabel={projectStats.stats.map((e) => e.name)}
                />
              </div>
            )
        )} */}
      </div>
      <div className="view-report-data-grid">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              {typeOfreport ? (
                <tr>
                  {fields.map((f) => (
                    <th scope="col" className="px-6 py-3">
                      {f.label}
                    </th>
                  ))}
                </tr>
              ) : (
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Project ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Project Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Updated At
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {entries &&
                entries.length > 0 &&
                entries.filter(filterFunction).map((p) =>
                  typeOfreport ? (
                    <tr className="bg-white border-b">
                      {fields.map((f) => (
                        <td className="px-6 py-4">{p[f.value].toString()}</td>
                      ))}
                    </tr>
                  ) : (
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {p._id}
                      </th>
                      <td className="px-6 py-4">{p.name}</td>
                      <td className="px-6 py-4">{addTime(p.createdAt)}</td>
                      <td className="px-6 py-4">{addTime(p.updatedAt)}</td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EntryReport;
