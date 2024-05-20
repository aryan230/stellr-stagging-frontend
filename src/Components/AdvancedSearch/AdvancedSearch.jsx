import { Configuration, OpenAIApi } from "openai";
import React, { useEffect, useState } from "react";
import ListSampleSubject from "../ListSampleComponent/ListSampleSubject";
import ListSampleOther from "../ListSampleComponent/ListSampleOther";
import InsideLoader from "../Loader/InsideLoader";
import SecondInsideLoader from "../Loader/SecondInsideLoader";
import SampleSearchResult from "./SearchResults/SampleSearchResult";
import ProjectSearchResult from "./SearchResults/ProjectSearchResult";
import ProtocolSearchResult from "./SearchResults/ProtocolSearchResult";
import axios from "axios";
import URL from "./../../Data/data.json";
import SOPSearchResult from "./SearchResults/SOPSearchResutl";
import { toast } from "sonner";
import DrawingSearchResult from "./SearchResults/DrawingSearchResult";
import EntrySearchResult from "./SearchResults/EntrySearchResult";
import { quillGetHTML } from "../Functions/quillGetHTML";
import { Bot, BrainCircuit, Search, X } from "lucide-react";
function AdvancedSearch({
  setAdvancedSearch,
  samples,
  projects,
  protocols,
  tasks,
  entries,
  sops,
  drawings,
  setSampleContent,
  setSampleModal,
  setWhichTabisActive,
  setProjectInsideActiveId,
  setProjectInsideActive,
  setProtocolContent,
  setProtocolModal,
  setSopContent,
  setSopModal,
}) {
  console.log(protocols);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [responseTwo, setResponseTwo] = useState();
  const [apikey, setApikey] = useState();
  const [responseType, setResponseType] = useState();
  const [searchResult, setSearchResult] = useState();
  const finalData = [
    {
      samples: samples,
    },
    {
      tasks: tasks,
    },
  ];
  const configuration = new Configuration({
    apiKey: apikey,
  });

  const getApiKey = async () => {
    var config = {
      method: "get",
      url: `${URL[0]}api/config/openai`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function(response) {
        setApikey(response.data.apikey);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!apikey) {
      getApiKey();
    }
  }, [apikey]);

  const [entryResult, setEntryResult] = useState();

  const openai = new OpenAIApi(configuration);

  const newPromptforSample = `${message} using the data ${JSON.stringify(
    samples
  )} and do not include any explanations, only return output as ids in RFC8259 compliant JSON response without deviation and without missing brackets using following format.
  
  The JSON response: 
  ["", ""]
  `;

  const newPromptforProjects = `${message} using the data ${JSON.stringify(
    projects
  )} and do not include any explanations, only return output as ids in RFC8259 compliant JSON response without deviation and without missing brackets using following format.
  
  The JSON response: 
  ["", ""]
  `;

  const newPromptforProtocols = `${message} using the data ${JSON.stringify(
    protocols
  )} and do not include any explanations, only return output as ids in RFC8259 compliant JSON response without deviation and without missing brackets using following format.
  
  The JSON response: 
  ["", ""]
  `;

  const newPromptforSops = `${message} using the data ${JSON.stringify(
    sops
  )} and do not include any explanations, only return output as ids in RFC8259 compliant JSON response without deviation and without missing brackets using following format.
  
  The JSON response: 
  ["", ""]
  `;

  const newPromptforTasks = `${message} using the data ${JSON.stringify(
    tasks
  )} and do not include any explanations, only return output in RFC8259 compliant JSON response without deviation and without missing brackets`;

  const newPromptforDrawings = `${message} using the data ${JSON.stringify(
    drawings
  )} and do not include any explanations, only return output as ids in RFC8259 compliant JSON response without deviation and without missing brackets using following format.
  
  The JSON response: 
  ["", ""]
  `;

  const newPromptforEntriesOne = `${message} using the data ${JSON.stringify(
    entries.map((e) => ({
      _id: e._id,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }))
  )} and do not include any explanations, only return output as ids in RFC8259 compliant JSON response without deviation and without missing brackets using following format.
  
  The JSON response: 
  ["", ""]
  `;

  const newPromptforEntriesTwo = `${message} using the data ${JSON.stringify(
    responseTwo
  )} and do not include any explanations, only return output as ids in RFC8259 compliant JSON response without deviation and without missing brackets using following format.
  
  The JSON response: 
  ["", ""]
  `;

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const fetchOpenAIResultCase = async () => {
    if (message.includes("samples") || message.includes("sample")) {
      setLoading(true);
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: newPromptforSample,
          },
        ],
      });
      const { data } = response;
      setResponseType("Sample");
      setSearchResult(data.choices[0].message);
      setLoading(false);
      console.log("data is ", data);
      console.log(data.choices[0].message);
    } else if (message.includes("entries") || message.includes("entry")) {
      setLoading(true);
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "user",
            content: `${message}. Check if this prompt is searching for keyword or not and do not include any explanations, only return output as ids in RFC8259 compliant JSON response without deviation and without missing brackets using following format.
  
            The JSON response: 
            ["yes or no", "if yes then the keyword"]`,
          },
        ],
      });
      const searchResult = response.data.choices[0].message;
      console.log(searchResult.content);
      const data = JSON.parse(searchResult.content);
      const result = [];

      if (data[0] === "yes") {
        const keyword = data[1];
        entries.forEach(async (p) => {
          const html = await quillGetHTML(p.data[0].block.ops);
          const reg = new RegExp(keyword, "g");
          if (html.match(reg)) {
            result.push(p._id);
          }
        });
        console.log(result);
        setResponseType("Entry");
        setSearchResult([1, 2]);
        setEntryResult(result);
        setLoading(false);
      } else {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "user",
              content: newPromptforEntriesOne,
            },
          ],
        });
        const searchResult = response.data.choices[0].message;
        const { data } = response;
        const jsonValid = await isJsonString(data.choices[0].message.content);
        if (jsonValid) {
          setResponseType("Entry");
          setSearchResult(data.choices[0].message);
          setEntryResult(JSON.parse(data.choices[0].message.content));
          setLoading(false);
          console.log("data is ", data);
          console.log(data.choices[0].message);
        } else {
          setLoading(false);
          toast.error("There was some error");
        }
      }
    } else if (message.includes("protocols") || message.includes("protocol")) {
      console.log("Protocol");
      setLoading(true);
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
          {
            role: "user",
            content: newPromptforProtocols,
          },
        ],
      });
      const { data } = response;
      setResponseType("Protocol");
      setSearchResult(data.choices[0].message);
      setLoading(false);
      console.log("data is ", data);
      console.log(data.choices[0].message);
    } else if (message.includes("projects") || message.includes("project")) {
      console.log("Project");
      setLoading(true);
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
          {
            role: "user",
            content: newPromptforProjects,
          },
        ],
      });
      const { data } = response;
      setResponseType("Project");
      setSearchResult(data.choices[0].message);
      setLoading(false);
      console.log("data is ", data);
      console.log(data.choices[0].message);
    } else if (message.includes("tasks") || message.includes("task")) {
      setLoading(true);
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
          {
            role: "user",
            content: newPromptforTasks,
          },
        ],
      });
      const { data } = response;
      setSearchResult(data.choices[0].message);
      setLoading(false);
      console.log("data is ", data);
      console.log(data.choices[0].message);
    } else if (message.includes("sops") || message.includes("sop")) {
      setLoading(true);
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: newPromptforSops,
          },
        ],
      });
      const { data } = response;
      setResponseType("SOP");
      setSearchResult(data.choices[0].message);
      setLoading(false);
      console.log("data is ", data);
      console.log(data.choices[0].message);
    } else if (
      message.includes("cd") ||
      message.includes("chemical drawing") ||
      message.includes("chemical drawings")
    ) {
      setLoading(true);
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: newPromptforDrawings,
          },
        ],
      });
      const { data } = response;
      setResponseType("Drawing");
      setSearchResult(data.choices[0].message);
      setLoading(false);
      console.log("data is ", data);
      console.log(data.choices[0].message);
    } else {
      setLoading(true);
      window.setTimeout(() => {
        setLoading(false);
        toast.error("Please provide more details");
      }, 3000);
      console.log("No  result");
    }
  };

  // const data =
  //   searchResult &&
  //   JSON.parse(
  //     searchResult.content.substring(
  //       searchResult.content.indexOf("["),
  //       searchResult.content.lastIndexOf("]") + 1
  //     )
  //   ).map((e) => {
  //     return projects.find((ele) => ele._id == e);
  //   });

  // console.log(data);

  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100%] bg-[#3925ffd9] z-[99]">
      <a
        className="absolute top-20 right-5 rounded-sm bg-white py-2 px-5 hover:cursor-pointer z-[99999999999]"
        onClick={(e) => {
          e.preventDefault();
          setAdvancedSearch(false);
        }}
      >
        Close AI Search
      </a>
      <div className="w-[80%] mx-auto h-[90%] flex flex-col items-center justify-center">
        {loading ? (
          <SecondInsideLoader message={message} />
        ) : (
          <div className="relative xl:w-3/4 2xl:w-4/5 w-full bg-white rounded-lg shadow max-h-[90%]">
            <div className="absolute top-5 right-5">
              <X
                className="w-6 h-6 text-gray-600 hover:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setAdvancedSearch(false);
                }}
              />
            </div>
            {apikey && (
              <div className="border rounded-lg border-gray-100 h-[90%]">
                <div className="py-4 md:py-6 pl-8 h-fit">
                  <div className="px-6 py-6">
                    <p className="text-2xl font-bold leading-5 text-gray-800">
                      AI Search
                    </p>

                    <div className="my-5 border rounded border-gray-200 bg-gray-50 relative">
                      <input
                        placeholder="What are you looking for?"
                        type="text"
                        onChange={(e) => setMessage(e.target.value)}
                        className="text-sm leading-none text-gray-600 w-full focus:outline-none pl-4 py-3 bg-transparent placeholder-gray-600"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (message) {
                            fetchOpenAIResultCase();
                          } else {
                            toast.error("Please enter a prompt");
                          }
                        }}
                        className="focus:outline-none px-3 py-2.5 bg-indigo-700 border border-indigo-700 hover:bg-opacity-80 rounded-tr absolute h-full right-0 rounded-br"
                      >
                        <Search className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="text-xs leading-3 text-gray-600 dark:text-gray-300 flex items-center">
                      <p>
                        Be precise in your prompts for the AI search to get the
                        best results.
                      </p>
                    </div>
                  </div>
                </div>
                {searchResult && (
                  <div className="overflow-x-auto h-[70%]">
                    <table className="w-full whitespace-nowrap">
                      <thead className="sticky top-0">
                        <tr className="bg-gray-50 h-16 w-full text-sm leading-none text-gray-800">
                          <th className="font-normal text-left pl-8">
                            Record Id
                          </th>
                          <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                            Record Name
                          </th>
                          <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                            Record Type
                          </th>
                          <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                            Created Date
                          </th>
                          <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                            Last Updated Date
                          </th>
                          <th className="font-normal text-left px-10 lg:px-6 xl:px-0">
                            View
                          </th>
                        </tr>
                      </thead>
                      <tbody className="w-full">
                        {responseType === "Entry" &&
                          entryResult &&
                          entryResult
                            .map((e) => {
                              return entries.find((ele) => ele._id == e);
                            })
                            .map((sample, index) => (
                              <EntrySearchResult
                                sample={sample}
                                index={index}
                                responseType={responseType}
                                setSampleContent={setSampleContent}
                                setSampleModal={setSampleModal}
                              />
                            ))}

                        {responseType === "Sample" &&
                          searchResult &&
                          JSON.parse(searchResult.content)
                            .map((e) => {
                              return samples.find((ele) => ele._id == e);
                            })
                            .map((sample, index) => (
                              <SampleSearchResult
                                sample={sample}
                                index={index}
                                responseType={responseType}
                                setSampleContent={setSampleContent}
                                setSampleModal={setSampleModal}
                              />
                            ))}
                        {responseType === "Project" &&
                          searchResult &&
                          JSON.parse(searchResult.content)
                            .map((e) => {
                              return projects.find((ele) => ele._id == e);
                            })
                            .map((sample, index) => (
                              <ProjectSearchResult
                                project={sample}
                                index={index}
                                responseType={responseType}
                                setProjectInsideActiveId={
                                  setProjectInsideActiveId
                                }
                                setProjectInsideActive={setProjectInsideActive}
                                setWhichTabisActive={setWhichTabisActive}
                              />
                            ))}
                        {responseType === "Protocol" &&
                          searchResult &&
                          JSON.parse(searchResult.content)
                            .map((e) => {
                              return protocols.find((ele) => ele._id == e);
                            })
                            .map((sample, index) => (
                              <ProtocolSearchResult
                                protocol={sample}
                                index={index}
                                responseType={responseType}
                                setProtocolContent={setProtocolContent}
                                setProtocolModal={setProtocolModal}
                              />
                            ))}
                        {responseType === "SOP" &&
                          searchResult &&
                          JSON.parse(searchResult.content)
                            .map((e) => {
                              return sops.find((ele) => ele._id == e);
                            })
                            .map((sample, index) => (
                              <SOPSearchResult
                                sop={sample}
                                index={index}
                                responseType={responseType}
                                setSopContent={setSopContent}
                                setSopModal={setSopModal}
                              />
                            ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    // <div className="search-modal">
    //   {" "}
    //   {loading ? (
    //     <SecondInsideLoader message={message} />
    //   ) : (
    //     apikey && (
    //       <div className="search-modal-inside">
    //         <div className="top-modal">
    //           <button
    //             onClick={() => {
    //               setAdvancedSearch(false);
    //             }}
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               width="46"
    //               height="46"
    //               viewBox="0 0 46 46"
    //               fill="none"
    //             >
    //               <path
    //                 d="M28.2838 15.7712L22.6269 21.4281L16.9701 15.7712C16.72 15.5212 16.3809 15.3807 16.0273 15.3807C15.6737 15.3807 15.3345 15.5212 15.0845 15.7712C14.8344 16.0213 14.6939 16.3604 14.6939 16.714C14.6939 17.0676 14.8344 17.4068 15.0845 17.6568L20.7413 23.3137L15.0845 28.9705C14.8344 29.2206 14.6939 29.5597 14.6939 29.9134C14.6939 30.267 14.8344 30.6061 15.0845 30.8562C15.3345 31.1062 15.6737 31.2467 16.0273 31.2467C16.3809 31.2467 16.72 31.1062 16.9701 30.8562L22.6269 25.1993L28.2838 30.8562C28.5338 31.1062 28.873 31.2467 29.2266 31.2467C29.5802 31.2467 29.9194 31.1062 30.1694 30.8562C30.4195 30.6061 30.5599 30.267 30.5599 29.9134C30.5599 29.5597 30.4195 29.2206 30.1694 28.9705L24.5126 23.3137L30.1694 17.6568C30.4195 17.4068 30.5599 17.0676 30.5599 16.714C30.5599 16.3604 30.4195 16.0213 30.1694 15.7712C29.9194 15.5212 29.5802 15.3807 29.2266 15.3807C28.873 15.3807 28.5338 15.5212 28.2838 15.7712Z"
    //                 fill="white"
    //               />
    //             </svg>
    //           </button>
    //         </div>
    //         <form
    //           onSubmit={(e) => {
    //             e.preventDefault();
    //             fetchOpenAIResultCase();
    //           }}
    //         >
    //           <label
    //             htmlFor="default-search"
    //             className="mb-2 text-sm font-medium text-gray-900 sr-only"
    //           >
    //             Search
    //           </label>
    //           <div className="relative">
    //             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
    //             <input
    //               type="search"
    //               id="default-search"
    //               className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
    //               placeholder="What are you looking for?"
    //               required
    //               onChange={(e) => setMessage(e.target.value)}
    //               autocomplete="off"
    //             />
    //             <button
    //               type="submit"
    //               className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
    //             >
    //               Search
    //             </button>
    //           </div>
    //         </form>

    //         {searchResult && (
    //           <div className="relative overflow-x-auto mt-4 rounded-lg">
    //             <table className="w-full text-sm text-left text-gray-500">
    //               <thead className="text-xs text-gray-700 uppercase bg-gray-50">
    //                 <tr>
    //                   <th scope="col" className="px-6 py-3">
    //                     Record Id
    //                   </th>
    //                   <th scope="col" className="px-6 py-3">
    //                     Record Name
    //                   </th>
    //                   <th scope="col" className="px-6 py-3">
    //                     Record Type
    //                   </th>
    //                   <th scope="col" className="px-6 py-3">
    //                     Created Date
    //                   </th>
    //                   <th scope="col" className="px-6 py-3">
    //                     Last Updated Date
    //                   </th>
    //                   <th scope="col" className="px-6 py-3">
    //                     View
    //                   </th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {responseType === "Entry" &&
    //                   entryResult &&
    //                   entryResult
    //                     .map((e) => {
    //                       return entries.find((ele) => ele._id == e);
    //                     })
    //                     .map((sample, index) => (
    //                       <EntrySearchResult
    //                         sample={sample}
    //                         index={index}
    //                         responseType={responseType}
    //                         setSampleContent={setSampleContent}
    //                         setSampleModal={setSampleModal}
    //                       />
    //                     ))}
    //                 {responseType === "Sample" &&
    //                   searchResult &&
    //                   JSON.parse(searchResult.content)
    //                     .map((e) => {
    //                       return samples.find((ele) => ele._id == e);
    //                     })
    //                     .map((sample, index) => (
    //                       <SampleSearchResult
    //                         sample={sample}
    //                         index={index}
    //                         responseType={responseType}
    //                         setSampleContent={setSampleContent}
    //                         setSampleModal={setSampleModal}
    //                       />
    //                     ))}
    //                 {responseType === "Project" &&
    //                   searchResult &&
    //                   JSON.parse(searchResult.content)
    //                     .map((e) => {
    //                       return projects.find((ele) => ele._id == e);
    //                     })
    //                     .map((sample, index) => (
    //                       <ProjectSearchResult
    //                         project={sample}
    //                         index={index}
    //                         responseType={responseType}
    //                         setProjectInsideActiveId={setProjectInsideActiveId}
    //                         setProjectInsideActive={setProjectInsideActive}
    //                         setWhichTabisActive={setWhichTabisActive}
    //                       />
    //                     ))}
    //                 {responseType === "Protocol" &&
    //                   searchResult &&
    //                   JSON.parse(searchResult.content)
    //                     .map((e) => {
    //                       return protocols.find((ele) => ele._id == e);
    //                     })
    //                     .map((sample, index) => (
    //                       <ProtocolSearchResult
    //                         protocol={sample}
    //                         index={index}
    //                         responseType={responseType}
    //                         setProtocolContent={setProtocolContent}
    //                         setProtocolModal={setProtocolModal}
    //                       />
    //                     ))}
    //                 {responseType === "SOP" &&
    //                   searchResult &&
    //                   JSON.parse(searchResult.content)
    //                     .map((e) => {
    //                       return sops.find((ele) => ele._id == e);
    //                     })
    //                     .map((sample, index) => (
    //                       <SOPSearchResult
    //                         sop={sample}
    //                         index={index}
    //                         responseType={responseType}
    //                         setSopContent={setSopContent}
    //                         setSopModal={setSopModal}
    //                       />
    //                     ))}
    //                 {responseType === "Drawing" &&
    //                   searchResult &&
    //                   JSON.parse(searchResult.content)
    //                     .map((e) => {
    //                       return drawings.find((ele) => ele._id == e);
    //                     })
    //                     .map((sample, index) => (
    //                       <DrawingSearchResult
    //                         drawing={sample}
    //                         index={index}
    //                         responseType={responseType}
    //                         setSopContent={setSopContent}
    //                         setSopModal={setSopModal}
    //                       />
    //                     ))}
    //               </tbody>
    //             </table>
    //           </div>
    //         )}
    //       </div>
    //     )
    //   )}
    // </div>
  );
}

export default AdvancedSearch;
