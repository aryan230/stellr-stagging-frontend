import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import URL from "./../../Data/data.json";
import { addProtocolLogs } from "../Functions/addProtocolLogs";
import { logout } from "../../redux/actions/userActions";
import { useNavigate } from "react-router-dom";
import BasicModalTailwind from "../../UI/MainModals/BasicModalTailwind";
import DefaultButton from "../../UI/Button/DefaultButton";
import SignaturePad from "react-signature-canvas";
import {
  listMyCollabOrgs,
  listMyOrgs,
} from "../../redux/actions/organizationActions";
import { InformationCircleIcon } from "@heroicons/react/outline";

function UpdateStatus({ open, setOpen, data: dataValue, type }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sigPad = useRef(null);
  const [selectedExport, setSelectedExport] = useState({
    value: dataValue.status,
    label: dataValue.status,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orgListMy = useSelector((state) => state.orgListMy);
  const { loading: loading, error: error, sucess: sucess, orgs } = orgListMy;

  const orgListMyCollab = useSelector((state) => state.orgListMyCollab);
  const { sucess: sucessCollab, orgs: orgsCollab } = orgListMyCollab;

  useEffect(() => {
    dispatch(listMyOrgs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listMyCollabOrgs());
  }, [dispatch]);

  const findOrg =
    orgs && orgs.length > 0
      ? orgs[0]
      : orgsCollab && orgsCollab.length > 0
      ? orgsCollab[0]
      : null;

  const findOrgRole =
    orgs && orgs.length > 0
      ? orgs[0].user == userInfo._id && "Owner"
      : orgsCollab && orgsCollab.length > 0
      ? orgsCollab[0].collaborators.find((e) => e.user == userInfo._id) &&
        orgsCollab[0].collaborators.find((e) => e.user == userInfo._id)
          .permissions
      : null;

  {
    /* /Draft, In Progress, Approved, Rejected */
  }

  const roleOptions = [
    {
      label: "Draft",
      value: "Draft",
    },
    {
      label: "In Progress",
      value: "In Progress",
    },
    {
      value: "Approved",
      label: "Approved",
    },
    {
      value: "Rejected",
      label: "Rejected",
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    const signature = await sigPad.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    const signData = {
      name: userInfo.name,
      job: findOrgRole ? findOrgRole : "",
      date: new Date(),
      sign: signature,
    };

    if (dataValue._id) {
      localStorage.removeItem("stellrStatusUpdate");
      localStorage.removeItem("stellrStatusUpdateData");
      let authorData = {
        name: userInfo.name,
        date: new Date(),
        sign: signature,
      }
      var data = await JSON.stringify({
        status: selectedExport.value,
        userName: userInfo.name,
        statusMessage: statusMessage,
        eSign: JSON.stringify(signData),
        isEdit: false,
        submittedForApproval: false,
      });

      const logData = await JSON.stringify({
        anyData: JSON.stringify(authorData),
        user: userInfo._id,
        entryId: dataValue._id,
        userName: userInfo.name,
        userEmail: userInfo.email,
        message: `The status of the entity '${dataValue.name}' was changed to ${selectedExport.value} with the message ${statusMessage} by ${userInfo.name}.`,
      });

      const finalData = await JSON.stringify({
        sendData: data,
        logData: logData,
        type: type,
        user: userInfo._id,
        to: dataValue.user,
      });
      console.log(finalData)
      await localStorage.setItem("stellrStatusUpdate", true);
      await localStorage.setItem("stellrStatusUpdateData", finalData);

      dispatch(logout());
      navigate("/login");
    }

    // var config = {
    //   method: "put",
    //   url: `${URL}api/protocols/status/${orgStatusContent._id}`,
    //   headers: {
    //     Authorization: `Bearer ${userInfo.token}`,
    //     "Content-Type": "application/json",
    //   },
    //   data: data,
    // };

    // axios(config)
    //   .then(async function(response) {
    //     console.log(response.data);

    //     await addProtocolLogs(logData);
    //     setNewCollab(true);
    //     setOrgStatus(false);
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  };
  return (
    <BasicModalTailwind open={open} setOpen={setOpen}>
      {" "}
      <div className="settings-top-modal-top">
        {/* <div className="setting-top-modal-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M14.375 12.5L14.375 3.75L3.75 3.75L3.75 12.5L14.375 12.5Z"
              fill="white"
              stroke="black"
              stroke-opacity="0.65"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M26.25 26.25V17.5L15.625 17.5L15.625 26.25H26.25Z"
              fill="white"
              stroke="black"
              stroke-opacity="0.65"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M19.375 3.75V12.5H26.25V3.75H19.375Z"
              fill="white"
              stroke="black"
              stroke-opacity="0.65"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M3.75 17.5L3.75 26.25H10.625V17.5H3.75Z"
              fill="white"
              stroke="black"
              stroke-opacity="0.65"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
          <h1>Change Status</h1>
        </div> */}
        <div className="setting-main-div-modal">
          <div className="settings-main-div-modal-inside">
            <div className="s-m-d-i-right">
              <form onSubmit={handleSubmit}>
                {" "}
                <Select
                  value={selectedExport}
                  options={roleOptions}
                  onChange={(e) => setSelectedExport(e)}
                  placeholder="Select Status"
                  required
                />
                <div className="margin-maker"></div>
                <>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your message here..."
                    defaultValue={""}
                    onChange={(e) => {
                      setStatusMessage(e.target.value);
                    }}
                  />
                </>
                <div className="margin-maker"></div>
                <div className="w-full font-dmsans">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Signature
                  </label>
                  <SignaturePad
                    canvasProps={{
                      width: 250,
                      height: 100,
                      className: "bg-gray-50 rounded-lg border border-gray-300",
                      //,
                    }}
                    ref={sigPad}
                  />
                </div>
                <span className="relative z-0 inline-flex shadow-sm rounded-md mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      sigPad.current.clear();
                    }}
                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    Clear canvas
                  </button>
                </span>
                <div className="rounded-md bg-blue-50 p-4 mt-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon
                        className="h-5 w-5 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-700">
                        You are electronically signing the document and its
                        equivalent of your signature on paper
                      </p>
                    </div>
                  </div>
                </div>
                <div className="margin-maker"></div>
                <DefaultButton label="Submit" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </BasicModalTailwind>
  );
}

export default UpdateStatus;
