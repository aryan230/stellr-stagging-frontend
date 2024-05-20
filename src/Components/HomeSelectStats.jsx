import React, { useState } from "react";
import MainModalEntity from "../UI/MainModals/MainModalEntity";
import { Atom, Book, FileLineChart, FileText, Tags } from "lucide-react";
import { toast } from "sonner";

function HomeSelectStats({ open, setOpen, submitHandlerProfile }) {
  const [data, setData] = useState([]);
  const stats = [
    {
      id: "protocols",
      name: "Protocols",
      icon: <Book className="mb-2 w-7 h-7 text-slate-500" />,
    },
    {
      id: "samples",
      name: "Samples",
      icon: <Tags className="mb-2 w-7 h-7 text-slate-500" />,
    },
    {
      id: "ChemicalDrawings",
      name: "Chemical Drawings",
      icon: <Atom className="mb-2 w-7 text-slate-500" />,
    },
    {
      id: "SOPs",
      name: "SOPs",
      icon: <FileText className="mb-2 w-7 text-slate-500" />,
    },
    {
      id: "Reports",
      name: "Reports",
      icon: <FileLineChart className="mb-2 w-7 text-slate-500" />,
    },
  ];

  return (
    <MainModalEntity open={open} setOpen={setOpen}>
      <>
        <h3 className="mb-5 text-lg font-medium text-gray-900">
          Choose stats:
        </h3>
        <div
          className="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Please select upto 3 stats!</span> (
            {data.length} selected)
          </div>
        </div>

        <ul className="grid w-full gap-6 md:grid-cols-3 py-8">
          {stats.map((s) => (
            <li key={s.id}>
              <input
                type="checkbox"
                id={s.id}
                defaultValue={true}
                className="hidden peer"
                required=""
                checked={data.find((e) => e == s.id) ? true : false}
                onChange={(e) => {
                  if (e.target.checked) {
                    if (data.length >= 3) {
                      toast.error("You can only select upto 3 stats");
                    } else {
                      setData((prev) => [...prev, s.id]);
                    }
                  } else {
                    setData((prev) => prev.filter((e) => e != s.id));
                  }
                }}
              />
              <label
                htmlFor={s.id}
                className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50"
              >
                <div className="block">
                  {s.icon}

                  <div className="w-full text-lg font-semibold">{s.name}</div>
                </div>
              </label>
            </li>
          ))}
        </ul>

        <button
          type="button"
          disabled={data.length < 3}
          onClick={(e) => {
            e.preventDefault();
            submitHandlerProfile(data);
          }}
          className="mt-5 inline-flex items-center px-10 py-3 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </>
    </MainModalEntity>
  );
}

export default HomeSelectStats;
