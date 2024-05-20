import React, { useState } from "react";
import MainModalEntity from "../../../UI/MainModals/MainModalEntity";
import Select from "react-select";
import { toast } from "sonner";

function CreateDashboardSelect({
  open,
  setOpen,
  selectedData,
  setSelectedData,
  selectModalID,
}) {
  const dataSets = [
    {
      name: "Entries",
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
  const dataSetsTwo = [
    {
      name: "Protocols",
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

  const [selectedE, setSelectedE] = useState([]);

  return (
    <MainModalEntity open={open} setOpen={setOpen}>
      <div className="h-[30vh] flex flex-col items-start justify-top w-full">
        <label htmlFor="" className="mt-2">
          Select Entity (Charts/Graphs)
        </label>
        <Select
          className="w-[80%] mt-2"
          options={
            selectModalID.limit === 2
              ? dataSetsTwo.map(
                  ({ name: label, charts: options, name: labelTwo }) => ({
                    label,
                    options: options.map(({ chartName: label, id: value }) => ({
                      label: `${labelTwo}-${label}`,
                      value: `${labelTwo}-${value}`,
                    })),
                  })
                )
              : dataSets.map(
                  ({ name: label, charts: options, name: labelTwo }) => ({
                    label,
                    options: options.map(({ chartName: label, id: value }) => ({
                      label: `${labelTwo}-${label}`,
                      value: `${labelTwo}-${value}`,
                    })),
                  })
                )
          }
          onChange={(e) => {
            let newArry = selectedData;
            if (selectModalID.limit === 1) {
              setSelectedE(e);
              newArry[selectModalID.id].data[0] = {
                id: 1,
                e: e,
              };
              setSelectedData(newArry);
              setOpen(false);
            } else {
              setSelectedE(e);
              newArry[selectModalID.id].data[selectModalID.id2] = {
                id: 1,
                e: e,
              };
              setSelectedData(newArry);
              setOpen(false);
            }
          }}
        />
      </div>{" "}
    </MainModalEntity>
  );
}

export default CreateDashboardSelect;
