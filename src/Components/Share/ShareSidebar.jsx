import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { FireIcon, XIcon } from "@heroicons/react/outline";
import {
  LinkIcon,
  PlusSmIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";
import {
  Banknote,
  BellIcon,
  BookMarkedIcon,
  ChevronLeftIcon,
  CogIcon,
  ExternalLink,
  HomeIcon,
  InboxIcon,
  KeyIcon,
  Magnet,
  MessageSquarePlus,
  PlusIcon,
  Share,
  UserIcon,
} from "lucide-react";
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
import AdvancedSecuritySettings from "../AdvancedSecuritySettings/AdvancedSecuritySettings";
import { addNotification } from "../Functions/addNotification";

const subNavigation = [
  {
    name: "Share",
    description:
      "Allows users to grant access to others for collaborating on specific projects or entities.",
    href: "#",
    icon: ExternalLink,
    current: true,
  },
  {
    name: "Notifications",
    description:
      "Sends real-time alerts when a project or entity is shared or access permissions are modified.",
    href: "#",
    icon: BellIcon,
    current: false,
  },
  {
    name: "Security",
    description:
      " Provides controls to manage who can share, restrict sharing to certain roles, and set access expiration rules for enhanced security.",
    href: "#",
    icon: KeyIcon,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
  console.log(type);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [advShare, setAdvShare] = useState(false);
  const [security, setSecurity] = useState(false);
  const [availableToHire, setAvailableToHire] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allowCommenting, setAllowCommenting] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);
  const [ownerUserData, setOwnerUserData] = useState();
  const [loader, setLoader] = useState(false);
  const [actIndex, setActIndex] = useState(0);
  const [sharePrivate, setSharePrivate] = useState(0);

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

  const updateShare = async (newData, user, role) => {
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
        await addNotification({
          id: user,
          type: "Not read",

          value: JSON.stringify({
            t: "new",
            e: type,
            user: userInfo.name,
            email: userInfo.email,
            subject:
              "You have been given access to " + role + " by " + userInfo.name,
            date: new Date(),
            entity: id,
          }),
          token: userInfo.token,
        });
        setAdvShare(false);
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
          <AdvancedSecuritySettings
            open={security}
            setOpen={setSecurity}
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
              <div className="w-screen max-w-7xl font-dmsans shadow-2xl">
                <main className="flex flex-1 bg-white h-full">
                  <div className="flex flex-1 flex-col h-full">
                    {/* Breadcrumb */}
                    <nav
                      aria-label="Breadcrumb"
                      className="border-b border-blue-gray-200 bg-white xl:hidden"
                    >
                      <div className="mx-auto flex max-w-3xl items-start py-3 px-4 sm:px-6 lg:px-8">
                        <a
                          href="#"
                          className="-ml-1 inline-flex items-center space-x-3 text-sm font-medium text-blue-gray-900"
                        >
                          <ChevronLeftIcon
                            className="h-5 w-5 text-blue-gray-400"
                            aria-hidden="true"
                          />
                          <span>Settings</span>
                        </a>
                      </div>
                    </nav>

                    <div className="flex flex-1 h-full">
                      {/* Secondary sidebar */}
                      <nav
                        aria-label="Sections"
                        className="hidden w-96 flex-shrink-0 border-r border-blue-gray-200 bg-white xl:flex xl:flex-col"
                      >
                        <div className="flex h-16 flex-shrink-0 items-center border-b border-blue-gray-200 px-6">
                          <p className="text-lg font-medium text-blue-gray-900">
                            Settings
                          </p>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto">
                          {subNavigation.map((item, index) => (
                            <a
                              key={item.name}
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                setActIndex(index);
                              }}
                              className={classNames(
                                index === actIndex
                                  ? "bg-indigo-50 bg-opacity-50"
                                  : "hover:bg-indigo-50 hover:bg-opacity-50",
                                "flex p-6 border-b border-blue-gray-200"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              <item.icon
                                className="-mt-0.5 h-6 w-6 flex-shrink-0 text-blue-gray-400"
                                aria-hidden="true"
                              />
                              <div className="ml-3 text-sm">
                                <p className="font-medium text-blue-gray-900">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-blue-gray-500">
                                  {item.description}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </nav>

                      {/* Main content */}
                      <div className="flex-1 overflow-y-auto h-full">
                        {actIndex === 2 && (
                          <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-blue-gray-900">
                              Security settings
                            </h1>

                            <form className="divide-y-blue-gray-200 mt-6 space-y-8 divide-y">
                              {" "}
                              {findOrg ? (
                                <>
                                  {loader ? (
                                    <CompleteLoader />
                                  ) : (
                                    <>
                                      <div className="divide-y divide-gray-200 pt-6">
                                        <div className="px-4 sm:px-6">
                                          <div>
                                            <h2 className="text-lg font-medium leading-6 text-gray-900">
                                              Privacy
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                              Manage who can view, edit, and
                                              share your documents with
                                              customizable privacy settings,
                                              including role-based access,
                                              expiration controls, and
                                              permission requests.
                                            </p>
                                          </div>
                                          <div className="mt-5">
                                            <label
                                              htmlFor="location"
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              Select role
                                            </label>
                                            <select
                                              id="location"
                                              name="location"
                                              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                              defaultValue={sharePrivate}
                                              onChange={(e) => {
                                                setSharePrivate(e.target.value);
                                              }}
                                            >
                                              <option value={0}>Read</option>
                                              <option value={1}>Write</option>
                                              <option value={2}>Admin</option>
                                            </select>
                                          </div>
                                          <ul
                                            role="list"
                                            className="mt-2 divide-y divide-gray-200"
                                          >
                                            <Switch.Group
                                              as="li"
                                              className="flex items-center justify-between py-4"
                                            >
                                              <div className="flex flex-col">
                                                <Switch.Label
                                                  as="p"
                                                  className="text-sm font-medium text-gray-900"
                                                  passive
                                                >
                                                  Allowed to view logs
                                                </Switch.Label>
                                                <Switch.Description className="text-sm text-gray-500">
                                                  Grants users permission to
                                                  access activity logs and track
                                                  actions taken within the
                                                  entity.
                                                </Switch.Description>
                                              </div>
                                              <Switch
                                                checked={
                                                  sharePrivate == 0
                                                    ? true
                                                    : false
                                                }
                                                onChange={setAvailableToHire}
                                                className={classNames(
                                                  availableToHire
                                                    ? "bg-indigo-500"
                                                    : "bg-gray-200",
                                                  "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                                )}
                                              >
                                                <span
                                                  aria-hidden="true"
                                                  className={classNames(
                                                    availableToHire
                                                      ? "translate-x-5"
                                                      : "translate-x-0",
                                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                  )}
                                                />
                                              </Switch>
                                            </Switch.Group>
                                            <Switch.Group
                                              as="li"
                                              className="flex items-center justify-between py-4"
                                            >
                                              <div className="flex flex-col">
                                                <Switch.Label
                                                  as="p"
                                                  className="text-sm font-medium text-gray-900"
                                                  passive
                                                >
                                                  Allowed to edit
                                                </Switch.Label>
                                                <Switch.Description className="text-sm text-gray-500">
                                                  Enables users to modify
                                                  content, settings, or data
                                                  within specific areas of the
                                                  entity based on their role.
                                                </Switch.Description>
                                              </div>
                                              <Switch
                                                checked={privateAccount}
                                                onChange={setPrivateAccount}
                                                className={classNames(
                                                  privateAccount
                                                    ? "bg-indigo-500"
                                                    : "bg-gray-200",
                                                  "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                                )}
                                              >
                                                <span
                                                  aria-hidden="true"
                                                  className={classNames(
                                                    privateAccount
                                                      ? "translate-x-5"
                                                      : "translate-x-0",
                                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                  )}
                                                />
                                              </Switch>
                                            </Switch.Group>
                                            <Switch.Group
                                              as="li"
                                              className="flex items-center justify-between py-4"
                                            >
                                              <div className="flex flex-col">
                                                <Switch.Label
                                                  as="p"
                                                  className="text-sm font-medium text-gray-900"
                                                  passive
                                                >
                                                  Allowed to open notifications
                                                </Switch.Label>
                                                <Switch.Description className="text-sm text-gray-500">
                                                  Allows users to access and
                                                  view notifications regarding
                                                  updates, alerts, and changes
                                                  in the entity.
                                                </Switch.Description>
                                              </div>
                                              <Switch
                                                checked={allowCommenting}
                                                onChange={setAllowCommenting}
                                                className={classNames(
                                                  allowCommenting
                                                    ? "bg-indigo-500"
                                                    : "bg-gray-200",
                                                  "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                                )}
                                              >
                                                <span
                                                  aria-hidden="true"
                                                  className={classNames(
                                                    allowCommenting
                                                      ? "translate-x-5"
                                                      : "translate-x-0",
                                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                  )}
                                                />
                                              </Switch>
                                            </Switch.Group>
                                            <Switch.Group
                                              as="li"
                                              className="flex items-center justify-between py-4"
                                            >
                                              <div className="flex flex-col">
                                                <Switch.Label
                                                  as="p"
                                                  className="text-sm font-medium text-gray-900"
                                                  passive
                                                >
                                                  Allowed to Archive
                                                </Switch.Label>
                                                <Switch.Description className="text-sm text-gray-500">
                                                  Grants users permission to
                                                  archive entity.
                                                </Switch.Description>
                                              </div>
                                              <Switch
                                                checked={allowMentions}
                                                onChange={setAllowMentions}
                                                className={classNames(
                                                  allowMentions
                                                    ? "bg-indigo-500"
                                                    : "bg-gray-200",
                                                  "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                                )}
                                              >
                                                <span
                                                  aria-hidden="true"
                                                  className={classNames(
                                                    allowMentions
                                                      ? "translate-x-5"
                                                      : "translate-x-0",
                                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                  )}
                                                />
                                              </Switch>
                                            </Switch.Group>
                                            <Switch.Group
                                              as="li"
                                              className="flex items-center justify-between py-4"
                                            >
                                              <div className="flex flex-col">
                                                <Switch.Label
                                                  as="p"
                                                  className="text-sm font-medium text-gray-900"
                                                  passive
                                                >
                                                  Allowed to Open Share Settings
                                                </Switch.Label>
                                                <Switch.Description className="text-sm text-gray-500">
                                                  Permits users to access and
                                                  manage sharing options,
                                                  including modifying access
                                                  permissions and sharing
                                                  preferences for projects or
                                                  entities.
                                                </Switch.Description>
                                              </div>
                                              <Switch
                                                checked={allowMentions}
                                                onChange={setAllowMentions}
                                                className={classNames(
                                                  allowMentions
                                                    ? "bg-indigo-500"
                                                    : "bg-gray-200",
                                                  "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                                )}
                                              >
                                                <span
                                                  aria-hidden="true"
                                                  className={classNames(
                                                    allowMentions
                                                      ? "translate-x-5"
                                                      : "translate-x-0",
                                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                  )}
                                                />
                                              </Switch>
                                            </Switch.Group>
                                          </ul>
                                        </div>
                                      </div>
                                    </>
                                  )}{" "}
                                </>
                              ) : (
                                <SecondLoaderWithText />
                              )}
                              <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                                <button
                                  type="button"
                                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  onClick={() => setOpen(false)}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSecurity(true);
                                  }}
                                  className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                  Advanced security settings
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                        {actIndex === 0 && (
                          <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-blue-gray-900">
                              Share settings
                            </h1>

                            <form className="divide-y-blue-gray-200 mt-6 space-y-8 divide-y">
                              {" "}
                              {findOrg ? (
                                <>
                                  {loader ? (
                                    <CompleteLoader />
                                  ) : (
                                    <>
                                      <ShareUser
                                        findOrg={findOrg}
                                        updateShare={updateShare}
                                        type={type}
                                        id={id}
                                        share={
                                          share &&
                                          JSON.parse(share) &&
                                          JSON.parse(share).value === value
                                            ? JSON.parse(share)
                                            : null
                                        }
                                        userInfo={userInfo}
                                        ownerUserData={ownerUserData}
                                        customCollabs={customCollabs}
                                      />

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
                              <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                                <button
                                  type="button"
                                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  onClick={() => setOpen(false)}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdvShare(true);
                                  }}
                                  className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                  Advanced share settings
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                        {actIndex === 1 && (
                          <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-blue-gray-900">
                              Notification settings
                            </h1>

                            <form className="divide-y-blue-gray-200 mt-6 space-y-8 divide-y">
                              {" "}
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ShareSidebar;
