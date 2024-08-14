import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {
  LinkIcon,
  PlusSmIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import { PlusIcon } from "lucide-react";
import ShareUser from "./ShareUser";
import ShareLinks from "./ShareLinks";
import {
  listMyCollabOrgs,
  listMyOrgs,
} from "../../redux/actions/organizationActions";
import { getUserDetails } from "../../redux/actions/userActions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import URL from "./../../Data/data.json";
import MainLoader from "../Loaders/MainLoader";
import SecondLoaderWithText from "../Loaders/SecondLoaderWithText";
import InsideLoader from "../Loader/InsideLoader";
import SecondInsideLoader from "../Loader/SecondInsideLoader";
import SpinnerLoader from "../Loaders/SpinnerLoader";
import MainLoaderWithText from "../Loaders/MainLoaderWithText";
import CompleteLoader from "../Loaders/CompleteLoader";
import AdvancedShareSettings from "../AdvancedShareSettings/AdvancedShareSettings";
function ShareSidebar({
  open,
  setOpen,
  type,
  id,
  share,
  setUpdate,
  setShareData,
  events,
  customCollabs,
}) {
  const value = "650b013f2bc72230ddaff4be";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [advShare, setAdvShare] = useState(false);

  const [ownerUserData, setOwnerUserData] = useState();
  const [loader, setLoader] = useState(false);

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
    dispatch(getUserDetails("profile"));
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

  const ownerUser = async () => {
    var config = {
      method: "get",
      url: `${URL}api/users/${findOrg.user}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(async function(response) {
        if (response) {
          setOwnerUserData(response.data);
        } else {
          toast.error("No user found for that email.");
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (findOrg) {
      if (!ownerUserData) {
        ownerUser();
      }
    }
  }, [ownerUserData, findOrg]);

  const updateShare = async (newData) => {
    setLoader(true);
    var config = {
      method: "put",
      url: `${URL[0]}api/${type}/share/${id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: newData,
    };
    axios(config)
      .then(async function(response) {
        setShareData(response.data.share);
        setUpdate(true);
        setLoader(false);
        toast.success("Success.");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-[999999999]"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <AdvancedShareSettings
            open={advShare}
            setOpen={setAdvShare}
            findOrg={findOrg}
            userInfo={userInfo}
            ownerUserData={ownerUserData}
            share={
              share && JSON.parse(share) && JSON.parse(share).value === value
                ? JSON.parse(share)
                : null
            }
            updateShare={updateShare}
            typeFrom={type}
            events={events}
            customCollabs={customCollabs}
          />
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-3xl font-dmsans">
                <form className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
                  <div className="flex-1 h-0 overflow-y-auto">
                    <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          Share
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
                          Get started by sharing your {type} to organization
                          members.
                          <br />
                          Data-ID: {id}
                        </p>
                      </div>
                    </div>

                    {/*  */}
                    {findOrg ? (
                      <>
                        {loader ? (
                          <CompleteLoader />
                        ) : (
                          <>
                            <ShareUser
                              findOrg={findOrg}
                              updateShare={updateShare}
                              share={
                                share &&
                                JSON.parse(share) &&
                                JSON.parse(share).value === value
                                  ? JSON.parse(share)
                                  : null
                              }
                              userInfo={userInfo}
                              ownerUserData={ownerUserData}
                            />
                            <div className="inline-flex items-center justify-center w-full">
                              <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                              <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                                or
                              </span>
                            </div>

                            <ShareLinks
                              findOrg={findOrg}
                              updateShare={updateShare}
                              share={
                                share &&
                                JSON.parse(share) &&
                                JSON.parse(share).value === value
                                  ? JSON.parse(share)
                                  : null
                              }
                              setLoader={setLoader}
                              type={type}
                              id={id}
                              setOpen={setOpen}
                            />
                          </>
                        )}{" "}
                      </>
                    ) : (
                      <SecondLoaderWithText />
                    )}
                  </div>
                  <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => {
                        setAdvShare(true);
                      }}
                      className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Advanced share settings
                    </button> */}
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ShareSidebar;
