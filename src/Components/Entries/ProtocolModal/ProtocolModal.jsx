import _ from "lodash";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UpdateProtocolStepperOne from "./UpdateProtocol/UpdateProtocolStepperOne";
import UpdateProtocolModal from "./UpdateProtocolModal";
import { Box, Drawer } from "@mui/material";
import DrawerProtocolLogs from "./DrawerProtocolLogs";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import ShieldIcon from "@mui/icons-material/Shield";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  CodeIcon,
  DotsVerticalIcon,
  FlagIcon,
  InformationCircleIcon,
  StarIcon,
} from "@heroicons/react/solid";
import {
  BellIcon,
  Book,
  BookMinus,
  Brackets,
  BracketsIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  Eye,
  MoreHorizontal,
  MoreHorizontalIcon,
  MoreVertical,
  Search,
  Share,
  Share2,
  X,
} from "lucide-react";
import ShareModal from "./ShareModal";
import LogsModal from "../../Logs/LogsModal";
import ConformationModal from "../../../UI/MainModals/ConformationModal";
import URL from "./../../../Data/data.json";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { addToRC } from "../../../redux/actions/rcActions";
import { useDispatch } from "react-redux";
import ShareMain from "../../Share/ShareMain";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { MagnifyingGlass } from "react-loader-spinner";
import NewProtocolModal from "./NewProtocolModal";
import MainModalEntity from "../../../UI/MainModals/MainModalEntity";
// import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
// import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProtocolModal({
  setProtocolModal,
  doc,
  setWhichTabisActive,
  setNewProtocol,
  protocolModal,
}) {
  const dispatch = useDispatch();
  console.log(doc);
  const [insideData, setInsideData] = useState(
    doc.data ? Object.entries(JSON.parse(doc.data)) : []
  );
  const [agreed, setAgreed] = useState(false);
  const [images, setImages] = useState(doc.image && JSON.parse(doc.image));
  const [files, setFiles] = useState(doc.file && JSON.parse(doc.file));
  const [updateProtocolModal, setUpdateProtocolModal] = useState(false);
  const [isDrawerOpenLogs, setIsDrawerOpenLogs] = useState(false);
  const [logs, setLogs] = useState(false);
  const [share, setShare] = useState(false);
  const [deleteEle, setDelete] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  let { userInfo } = userLogin;
  const actions = [
    {
      icon: <ShieldIcon />,
      name: "Logs",
      operation: "showlogs",
    },
    {
      icon: <EditIcon />,
      name: "Edit",
      operation: "showedit",
    },
  ];
  function handleClick(e, operation) {
    e.preventDefault();
    if (operation == "showlogs") {
      // do something
      setIsDrawerOpenLogs(true);
    } else {
      setUpdateProtocolModal(true);
      //do something else
    }
  }

  const handleDelete = async (id) => {
    var config = {
      method: "delete",
      url: `${URL[0]}api/protocols/p/${id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    axios(config)
      .then(function(response) {
        console.log(JSON.stringify(response.data));
        toast.success("Template Deleted sucessfully");
        setDelete(false);
        setProtocolModal(false);
        setNewProtocol(true);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    dispatch(
      addToRC({
        _id: doc._id,
        type: "Protocol",
        name: doc.title,
        time: Date.now(),
      })
    );
  }, [dispatch]);

  const user = {
    name: "Tom Cook",
    email: "tom@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };
  const navigation = [
    {
      name: "Overview",
      href: "#",
      current: true,
      onClick: (e) => {
        e.preventDefault();
      },
    },
    {
      name: "View Logs",
      href: "#",
      current: false,
      onClick: (e) => {
        e.preventDefault();
        if (doc.iData) {
          if (doc.iData.logs) {
            setLogs(true);
          } else {
            toast.error("You dont have permission.");
          }
        } else {
          setLogs(true);
        }
      },
    },
    {
      name: "Edit",
      href: "#",
      current: false,
      onClick: (e) => {
        e.preventDefault();
        if (doc.iData) {
          if (doc.iData.edit) {
            setUpdateProtocolModal(true);
          } else {
            toast.error("You dont have permission.");
          }
        } else {
          setUpdateProtocolModal(true);
        }
      },
    },
    {
      name: "Share",
      href: "#",
      current: false,
      onClick: (e) => {
        e.preventDefault();

        setShare(true);
      },
    },
    {
      name: "Archive",
      href: "#",
      current: false,
      onClick: (e) => {
        e.preventDefault();
        if (doc.iData) {
          if (doc.iData.edit) {
            setDelete(true);
          } else {
            toast.error("You dont have permission.");
          }
        } else {
          setDelete(true);
        }
      },
    },
  ];
  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#" },
  ];

  return (
    <MainModalEntity
      open={protocolModal}
      setOpen={setProtocolModal}
      width="max-w-6xl"
      custom="test"
    >
      {share && (
        <ShareModal
          open={share}
          setOpen={setShare}
          setModal={setProtocolModal}
          doc={doc}
          setNew={setNewProtocol}
        />
      )}
      {deleteEle && (
        <ConformationModal
          open={deleteEle}
          setOpen={setDelete}
          heading="Are you sure?"
          details="You want to delete this entity."
          onClick={(e) => {
            e.preventDefault();
            handleDelete(doc._id);
          }}
        />
      )}
      <LogsModal setOpen={setLogs} open={logs} logs={doc ? doc.logs : []} />
      {updateProtocolModal && (
        <UpdateProtocolModal
          doc={doc}
          setProtocolModal={setProtocolModal}
          setUpdateProtocolModal={setUpdateProtocolModal}
          setWhichTabisActive={setWhichTabisActive}
          setNewProtocol={setNewProtocol}
          files={files && files}
          images={images && images}
        />
      )}
      <Drawer
        anchor="right"
        open={isDrawerOpenLogs}
        onClose={() => setIsDrawerOpenLogs(false)}
      >
        <Box width="500px" p={2} role="presentation">
          <DrawerProtocolLogs
            task={doc}
            setIsDrawerOpen={setIsDrawerOpenLogs}
          />
        </Box>
      </Drawer>
      <div className="min-h-full">
        {doc.access && doc.access === "view" ? (
          <div className="absolute bottom-10 right-10 z-[9999999]">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex items-center justify-center w-full rounded-md p-3 border border-gray-300 shadow-sm bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                  <Eye size={16} className="mr-2" />
                  View Only
                </Menu.Button>
              </div>
            </Menu>
          </div>
        ) : (
          <ShareMain
            styles="absolute bottom-10 right-10 z-[9999999] mr-4"
            type="protocols"
            id={doc._id}
            share={doc.share}
            setUpdate={setNewProtocol}
          />
        )}
        <Disclosure
          as="nav"
          className="bg-indigo-600 rounded-md sticky top-5 z-[9999999]"
        >
          {({ open }) => (
            <div className="">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Book className="h-6 w-6 text-white" />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            onClick={item.onClick}
                            className={classNames(
                              item.current
                                ? "bg-indigo-700 text-white"
                                : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {doc.access && doc.access === "view" ? (
                        <div
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div className="flex items-center justify-center w-full rounded-md p-3 border border-gray-300 shadow-sm bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                            <Eye size={16} className="mr-2" />
                            View Only
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="rounded-full bg-indigo-600 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                        >
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      )}

                      {/* Profile dropdown */}
                      {/* <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-indigo-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu> */}
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <X className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <BracketsIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-indigo-700 text-white"
                          : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-indigo-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-indigo-300">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full border-2 border-transparent bg-indigo-600 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {doc.title}
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            {insideData &&
              insideData.map((d) => (
                <div className="w-full p-5 mt-7 rounded-lg">
                  <h2 className="text-2xl font-bold mb-2 font-dmsans border-b-2 pb-1">
                    {_.startCase(d[0])}
                  </h2>
                  <p className="font-dmsans quill-read-only-editor">
                    <ReactQuill theme="snow" readOnly value={d[1]} />
                  </p>
                </div>
              ))}

            {/* /End replace */}
          </div>
        </main>
      </div>{" "}
    </MainModalEntity>
    // <div className="modal">
    //   {share && (
    //     <ShareModal
    //       open={share}
    //       setOpen={setShare}
    //       setModal={setProtocolModal}
    //       doc={doc}
    //       setNew={setNewProtocol}
    //     />
    //   )}
    //   {deleteEle && (
    //     <ConformationModal
    //       open={deleteEle}
    //       setOpen={setDelete}
    //       heading="Are you sure?"
    //       details="You want to delete this entity."
    //       onClick={(e) => {
    //         e.preventDefault();
    //         handleDelete(doc._id);
    //       }}
    //     />
    //   )}
    //   <LogsModal setOpen={setLogs} open={logs} logs={doc ? doc.logs : []} />
    //   {updateProtocolModal && (
    //     <UpdateProtocolModal
    //       doc={doc}
    //       setProtocolModal={setProtocolModal}
    //       setUpdateProtocolModal={setUpdateProtocolModal}
    //       setWhichTabisActive={setWhichTabisActive}
    //       setNewProtocol={setNewProtocol}
    //       files={files && files}
    //       images={images && images}
    //     />
    //   )}
    //   <Drawer
    //     anchor="right"
    //     open={isDrawerOpenLogs}
    //     onClose={() => setIsDrawerOpenLogs(false)}
    //   >
    //     <Box width="500px" p={2} role="presentation">
    //       <DrawerProtocolLogs
    //         task={doc}
    //         setIsDrawerOpen={setIsDrawerOpenLogs}
    //       />
    //     </Box>
    //   </Drawer>
    //   <div className="relative w-full max-w-7xl max-h-full font-body">
    //     {doc.access && doc.access === "view" ? (
    //       <div className="absolute bottom-10 right-10 z-[9999999]">
    //         <Menu as="div" className="relative inline-block text-left">
    //           <div>
    //             <Menu.Button className="flex items-center justify-center w-full rounded-full p-3 border border-gray-300 shadow-sm bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
    //               <Eye size={16} className="mr-2" />
    //               View Only
    //             </Menu.Button>
    //           </div>
    //         </Menu>
    //       </div>
    //     ) : (
    //       <div className="">
    //         <ShareMain
    //           styles="absolute bottom-10 right-20 z-[9999999] mr-6"
    //           type="protocols"
    //           id={doc._id}
    //           share={doc.share}
    //           setUpdate={setNewProtocol}
    //         />
    //         <div className="absolute bottom-10 right-10 z-[9999999]">
    //           <Menu as="div" className="relative inline-block text-left">
    //             <div>
    //               <Menu.Button className="inline-flex justify-center w-full rounded-full p-3 border border-gray-300 shadow-sm bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
    //                 <MoreHorizontalIcon size={20} />
    //               </Menu.Button>
    //             </div>

    //             <Transition
    //               as={Fragment}
    //               enter="transition ease-out duration-100"
    //               enterFrom="transform opacity-0 scale-95"
    //               enterTo="transform opacity-100 scale-100"
    //               leave="transition ease-in duration-75"
    //               leaveFrom="transform opacity-100 scale-100"
    //               leaveTo="transform opacity-0 scale-95"
    //             >
    //               <Menu.Items className="origin-bottom-right absolute right-[100%] bottom-0 mt-2 mr-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
    //                 <div className="py-1">
    //                   <Menu.Item>
    //                     {({ active }) => (
    //                       <a
    //                         href="#"
    //                         onClick={(e) => {
    //                           e.preventDefault();
    //                           setLogs(true);
    //                         }}
    //                         className={classNames(
    //                           active
    //                             ? "bg-gray-100 text-gray-900"
    //                             : "text-gray-700",
    //                           "block px-4 py-2 text-sm"
    //                         )}
    //                       >
    //                         View Logs
    //                       </a>
    //                     )}
    //                   </Menu.Item>
    //                   <Menu.Item>
    //                     {({ active }) => (
    //                       <a
    //                         href="#"
    //                         onClick={(e) => {
    //                           e.preventDefault();
    //                           setUpdateProtocolModal(true);
    //                         }}
    //                         className={classNames(
    //                           active
    //                             ? "bg-gray-100 text-gray-900"
    //                             : "text-gray-700",
    //                           "block px-4 py-2 text-sm"
    //                         )}
    //                       >
    //                         Edit
    //                       </a>
    //                     )}
    //                   </Menu.Item>
    //                   {/* <Menu.Item>
    //                   {({ active }) => (
    //                     <a
    //                       href="#"
    //                       className={classNames(
    //                         active
    //                           ? "bg-gray-100 text-gray-900"
    //                           : "text-gray-700",
    //                         "block px-4 py-2 text-sm"
    //                       )}
    //                     >
    //                       License
    //                     </a>
    //                   )}
    //                 </Menu.Item> */}
    //                   <form
    //                     onSubmit={(e) => {
    //                       e.preventDefault();
    //                       setShare(true);
    //                     }}
    //                   >
    //                     <Menu.Item>
    //                       {({ active }) => (
    //                         <button
    //                           type="submit"
    //                           className={classNames(
    //                             active
    //                               ? "bg-gray-100 text-gray-900"
    //                               : "text-gray-700",
    //                             "block w-full text-left px-4 py-2 text-sm"
    //                           )}
    //                         >
    //                           Share
    //                         </button>
    //                       )}
    //                     </Menu.Item>
    //                   </form>
    //                   <Menu.Item>
    //                     {({ active }) => (
    //                       <a
    //                         href="#"
    //                         onClick={(e) => {
    //                           e.preventDefault();
    //                           setDelete(true);
    //                         }}
    //                         className={classNames(
    //                           active
    //                             ? "bg-gray-100 text-gray-900"
    //                             : "text-gray-700",
    //                           "block px-4 py-2 text-sm"
    //                         )}
    //                       >
    //                         Delete
    //                       </a>
    //                     )}
    //                   </Menu.Item>
    //                 </div>
    //               </Menu.Items>
    //             </Transition>
    //           </Menu>
    //         </div>
    //       </div>
    //     )}
    //     {/* <Box
    //       sx={{
    //         position: "absolute",
    //         height: 320,
    //         bottom: 10,
    //         right: 10,
    //         flexGrow: 1,
    //       }}
    //     >
    //       <SpeedDial
    //         ariaLabel="SpeedDial basic example"
    //         sx={{
    //           position: "absolute",
    //           bottom: 16,
    //           right: 16,
    //         }}
    //         icon={<SpeedDialIcon />}
    //         FabProps={{
    //           sx: {
    //             bgcolor: "#6200d2",
    //             "&:hover": {
    //               bgcolor: "#6200d2",
    //             },
    //           },
    //         }}
    //       >
    //         {actions.map((action) => (
    //           <SpeedDialAction
    //             key={action.name}
    //             icon={action.icon}
    //             tooltipTitle={action.name}
    //             onClick={(e) => {
    //               handleClick(e, action.operation);
    //             }}
    //           />
    //         ))}
    //       </SpeedDial>
    //     </Box> */}
    //     {/* Modal content */}
    //     {/* border-2 border-slate-700 */}
    //     <>
    //       {/*
    //   This example requires updating your template:

    //   ```
    //   <html class="h-full bg-gray-100">
    //   <body class="h-full">
    //   ```
    // */}
    //     </>{" "}
    //   </div>

    //   {/* <div
    //           href="#"
    //           className="block max-full p-6 bg-white border border-gray-200 rounded-lg shadow"
    //         >
    //           {insideData &&
    //             insideData.map((d) => (
    //               <div className="border-b border-gray-500 p-5 border-dashed">
    //                 {" "}
    //                 <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
    //                   {_.startCase(d[0])}
    //                 </h5>
    //                 <p className="font-normal text-gray-700 quill-read-only-editor">
    //                   <ReactQuill theme="snow" readOnly value={d[1]} />
    //                 </p>
    //               </div>
    //             ))}
    //         </div>
    //         {images &&
    //           images.length > 0 &&
    //           images.map((i) => (
    //             <a
    //               href="#"
    //               className="block max-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
    //             >
    //               <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
    //                 {i.name}
    //               </h5>
    //               <p className="font-normal text-gray-700 flex-col">
    //                 {i.images.map((img) => (
    //                   <a
    //                     href={img.url}
    //                     target="_blank"
    //                     className="font-medium text-blue-600  hover:underline p-2"
    //                   >
    //                     {img.name}
    //                   </a>
    //                 ))}
    //               </p>
    //             </a>
    //           ))} */}
    //   {/* <div className="modal-inside-protocol">
    //     <div className="top-modal">
    //       <button
    //       className="sticky"
    //         onClick={() => {
    //           setProtocolModal(false);
    //         }}
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="46"
    //           height="46"
    //           viewBox="0 0 46 46"
    //           fill="none"
    //         >
    //           <path
    //             d="M28.2838 15.7712L22.6269 21.4281L16.9701 15.7712C16.72 15.5212 16.3809 15.3807 16.0273 15.3807C15.6737 15.3807 15.3345 15.5212 15.0845 15.7712C14.8344 16.0213 14.6939 16.3604 14.6939 16.714C14.6939 17.0676 14.8344 17.4068 15.0845 17.6568L20.7413 23.3137L15.0845 28.9705C14.8344 29.2206 14.6939 29.5597 14.6939 29.9134C14.6939 30.267 14.8344 30.6061 15.0845 30.8562C15.3345 31.1062 15.6737 31.2467 16.0273 31.2467C16.3809 31.2467 16.72 31.1062 16.9701 30.8562L22.6269 25.1993L28.2838 30.8562C28.5338 31.1062 28.873 31.2467 29.2266 31.2467C29.5802 31.2467 29.9194 31.1062 30.1694 30.8562C30.4195 30.6061 30.5599 30.267 30.5599 29.9134C30.5599 29.5597 30.4195 29.2206 30.1694 28.9705L24.5126 23.3137L30.1694 17.6568C30.4195 17.4068 30.5599 17.0676 30.5599 16.714C30.5599 16.3604 30.4195 16.0213 30.1694 15.7712C29.9194 15.5212 29.5802 15.3807 29.2266 15.3807C28.873 15.3807 28.5338 15.5212 28.2838 15.7712Z"
    //             fill="#8F8585"
    //           />
    //         </svg>
    //       </button>
    //     </div>
    //     <>
    //       {" "}
    //       <div className="top-modal-in-in">
    //         <div className="top-modal-protocol-in">
    //           <h1>{doc.title}</h1>
    //           <a
    //             onClick={(e) => {
    //               e.preventDefault();
    //               setIsDrawerOpenLogs(true);
    //             }}
    //             className="text-indigo-500 mt-5 hover:cursor-pointer"
    //           >
    //             View Logs
    //           </a>
    //         </div>
    //         <button
    //           onClick={(e) => {
    //             e.preventDefault();
    //             setUpdateProtocolModal(true);
    //           }}
    //         >
    //           Edit Protocol
    //         </button>
    //       </div>
    //       <div className="protocol-stepper">
    //         <div className="protocol-shower">
    //           {insideData &&
    //             insideData.map((d) => (
    //               <div className="protocol-shower-inside">
    //                 <div className="protocol-shower-left">
    //                   <h2>{_.startCase(d[0])}</h2>
    //                 </div>
    //                 <div className="protocol-shower-right">
    //                   <ReactQuill theme="snow" readOnly value={d[1]} />
    //                 </div>
    //               </div>
    //             ))}
    //           {images &&
    //             images.length > 0 &&
    //             images.map((i) => (
    //               <div className="protocol-shower-inside">
    //                 <div className="protocol-shower-left">
    //                   <h2>{i.name}</h2>
    //                 </div>
    //                 <div className="protocol-shower-right">
    //                   {i.images.map((img) => (
    //                     <img src={img.url} width="50px"></img>
    //                   ))}
    //                 </div>
    //               </div>
    //             ))}
    //           {files &&
    //             files.length > 0 &&
    //             files.map((i) => (
    //               <div className="protocol-shower-inside">
    //                 <div className="protocol-shower-left">
    //                   <h2>{i.name}</h2>
    //                 </div>
    //                 <div className="protocol-shower-right">
    //                   {i.images.map((img) => (
    //                     <a href={img.url} target="_blank" width="50px">
    //                       {img.name}
    //                     </a>
    //                   ))}
    //                 </div>
    //               </div>
    //             ))}
    //         </div>
    //       </div>
    //     </>
    //   </div> */}
    // </div>
  );
}

export default ProtocolModal;
