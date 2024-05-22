import { useEffect, useRef, useState } from "react";
import React from "react";
// import EditorToolbar, { modules, formats } from "./EditorToolbar";
import ImageResize from "quill-image-resize-module-react";
import { Tooltip } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import CustomEmbedBlot from "./Tools/CustomReactBlot";
import RichTextEditor from "quill-react-commercial";
import URL from "./../../Data/data.json";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import "highlight.js/styles/darcula.css";
import Tribute from "tributejs";
import "quill-mention";
import { MentionBlot } from "./Tools/MentionBlot";
import "tributejs/dist/tribute.css";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import ReactQuill from "react-quill";
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  Biohazard,
  Blocks,
  Book,
  BookMarked,
  Bookmark,
  Check,
  ClipboardCheck,
  Cloud,
  CloudCog,
  Eye,
  FileInput,
  FileText,
  Info,
  LayoutPanelTop,
  Lock,
  LockKeyhole,
  Pen,
  SquareGanttIcon,
  Table2,
  Trash,
  UploadCloud,
  Vote,
  X,
} from "lucide-react";
import { Fragment } from "react";
import { Disclosure, Menu, Popover, Transition } from "@headlessui/react";
import {
  ArchiveIcon,
  ArrowCircleRightIcon,
  BellIcon,
  DocumentTextIcon,
  DuplicateIcon,
  HeartIcon,
  MenuIcon,
  PencilAltIcon,
  TrashIcon,
  UserAddIcon,
  XIcon,
} from "@heroicons/react/outline";
import WarningModal from "../Modals/WarningModal";
import Loader from "../../css/utils/Loader";
import { Box, Drawer } from "@mui/material";
import DrawerInformation from "./Drawer/DrawerInformation";
import DrawerHistory from "./Drawer/DrawerHistory";
import DrawerEdit from "./Drawer/DrawerEdit";
import DrawerVesionControl from "./Drawer/DrawerVesionControl";
import { createEntryTemplate } from "../../redux/actions/entryTemplatesActions";
import { listMySamples } from "../../redux/actions/sampleActions";
import { getProjectDetails } from "../../redux/actions/projectActions";
import { listMyEntries } from "../../redux/actions/entryActions";
import { listMyProtocols } from "../../redux/actions/protocolActions";
import { listMySops } from "../../redux/actions/sopActions";
import _ from "lodash";
import CompleteLoader from "../Loaders/CompleteLoader";
import MainLoader from "../Loaders/MainLoader";
import MainLoaderWithText from "../Loaders/MainLoaderWithText";
import {
  ChartBarIcon,
  CursorClickIcon,
  DocumentReportIcon,
  RefreshIcon,
  ShieldCheckIcon,
  ViewGridIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import htmlDocx from "html-docx-fixed/dist/html-docx";
import { saveAs } from "file-saver";
import "quill/dist/quill.snow.css";
import "highlight.js/styles/darcula.css";
import "quill-mention";
import { pdfExporter } from "quill-to-pdf";
import { toast } from "sonner";
import JSZip from "jszip";
import { downloadObjectAsJson } from "../Functions/downloadJson";
import DetailSlideOver from "../../UI/SlideOvers/DetailSlideOver";
import Delta from "quill-delta";
import EditNameEditor from "./EditorSettings/EditNameEditor";
import ChemicalDrawingEntry from "./EditorSettings/ChemicalDrawingEntry";
import Quill from "quill";
import LogsModal from "../Logs/LogsModal";
import DropdownBasic from "../../UI/Dropdown/DropdownBasic";
import { Details } from "@mui/icons-material";
import moment from "moment";
import ConformationModal from "../../UI/MainModals/ConformationModal";
import axios from "axios";
import { CART_RESET } from "../../redux/constants/cartConstants";
import SubmitForApproval from "../Approval/SubmitForApproval";
import { addEntryLogs } from "../Functions/addEntryLogs";
import ViewDetails from "../Approval/ViewDetails";
import { addNotification } from "../Functions/addNotification";
import CustomLogs from "../CustomLogs/CustomLogs";
import InsertFileEditor from "./EditorSettings/InsertFileEditor";
import FilePreview from "../Preview/FilePreview";
import { addToCart, removeFromCart } from "../../redux/actions/cartActions";
import { addToRC } from "../../redux/actions/rcActions";
import { addTime } from "../Functions/addTime";
import ShareMain from "../Share/ShareMain";
import ViewOnly from "../Share/ViewOnly";
import { addToState } from "../../redux/actions/stateActions";
import EntryTimeline from "./Drawer/EntryTimeline";

const zip = new JSZip();

const fileOptions = [
  {
    name: "Save as Template",
    slug: "saveAsTemplates",
  },
];

const exportOptions = [
  {
    name: "Microsoft Word (.docx)",
    slug: "docx",
  },
  {
    name: "PDF Document (.pdf)",
    slug: "pdf",
  },

  {
    name: "Web Page (.html)",
    slug: "html",
  },
  {
    name: "JavaScript Object Notation (.json)",
    slug: "json",
  },
];

const solutions = [
  {
    name: "Analytics",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "#",
    icon: ChartBarIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers in a more meaningful way.",
    href: "#",
    icon: CursorClickIcon,
  },
  {
    name: "Security",
    description: "Your customers' data will be safe and secure.",
    href: "#",
    icon: ShieldCheckIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools that you're already using.",
    href: "#",
    icon: ViewGridIcon,
  },
  {
    name: "Automations",
    description:
      "Build strategic funnels that will drive your customers to convert",
    href: "#",
    icon: RefreshIcon,
  },
  {
    name: "Reports",
    description:
      "Get detailed reports that will help you make more informed decisions ",
    href: "#",
    icon: DocumentReportIcon,
  },
];
const resources = [
  {
    name: "Help Center",
    description:
      "Get all of your questions answered in our forums or contact support.",
    href: "#",
  },
  {
    name: "Guides",
    description:
      "Learn how to maximize our platform to get the most out of it.",
    href: "#",
  },
  {
    name: "Events",
    description:
      "See what meet-ups and other events we might be planning near you.",
    href: "#",
  },
  {
    name: "Security",
    description: "Understand how we take your privacy seriously.",
    href: "#",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function TextEditorTwo({
  tab,
  active,
  project,
  userType,
  setProjectSettings,
  setNewCollab,
  setProjectUpdatedProfilers,
  setUpdatedUserCollabRole,
  setEntryUpdate,
  setWhichTabisActive,
  setSampleContent,
  setSampleModal,
  setCreateDrawingModal,
  setTabId,
}) {
  const [text, setText] = useState("");
  const quill = useRef(null);
  const reactQuill = useRef(null);
  const [value, setValue] = useState();

  const [socket, setSocket] = useState();
  const [htmlData, setHtmlData] = useState("");
  const [oldDelta, setOldDelta] = useState(true);

  const atValues = [
    { id: 1, value: "Fredrik Sundqvist" },
    { id: 2, value: "Patrik Sjölin" },
  ];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSpreadSheetOpen, setIsSpreadSheetOpen] = useState(false);
  const [drawerInformations, setDrawerInformations] = useState(false);
  const [isDrawerEdit, setIsDrawerEdit] = useState(false);
  const [isDrawerVersionControl, setIsDrawerVersionControl] = useState(false);
  const [loader, setLoader] = useState(false);
  const [versionControlTab, setVersionControlTab] = useState(false);
  const [versionControlValue, setVersionControlValue] = useState();
  const [originalContent, setOriginalContent] = useState();
  const [warningModal, setWarningModal] = useState(false);
  const [mainLoader, setMainLoader] = useState(true);
  const [users, setUsers] = useState([]);
  const [chemicalDrawing, setChemicalDrawing] = useState(false);
  const [insertFile, setInsertFile] = useState(false);
  const [logs, setLogs] = useState(false);
  const [savingData, setSavingData] = useState(false);
  const [customLogs, setCustomLogs] = useState(false);
  const [filePreview, setFilePreview] = useState(false);
  const [fileData, setFileData] = useState();
  const [bottom, setBottom] = useState(false);
  const [entryTimeline, setEntryTimeline] = useState(false);
  const onScroll = () => {};

  //e-sign
  // useEffect(() => {
  //   if (document.querySelectorAll(".ql-editor")) {
  //     if (document.getElementById("eSignData")) {
  //       document.querySelectorAll(".ql-editor").forEach((el, index) => {
  //         if (el.scrollHeight > el.clientHeight) {
  //           el.addEventListener("scroll", (event) => {
  //             const { scrollHeight, scrollTop, clientHeight } = event.target;
  //             const sign = document.getElementById("eSignData");
  //             if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
  //               setBottom(true);
  //             } else {
  //               setBottom(false);
  //             }
  //           });
  //         } else {
  //         }
  //       });
  //     }
  //   }
  // }, [
  //   document.querySelectorAll(".ql-editor"),
  //   document.getElementById("eSignData"),
  // ]);

  const sampleListMy = useSelector((state) => state.sampleListMy);
  const {
    samples,
    loading: loadingSamples,
    error: errorSamples,
  } = sampleListMy;

  const protocolListMy = useSelector((state) => state.protocolListMy);
  const {
    protocols,
    loading: loadingProtocols,
    error: errorProtocols,
  } = protocolListMy;

  const sopListMy = useSelector((state) => state.sopListMy);
  const { sops, loading: loadingSops, error: errorSops } = sopListMy;

  const entriesListMy = useSelector((state) => state.entriesListMy);
  const {
    entries,
    loading: loadingEntries,
    error: errorEntries,
  } = entriesListMy;

  const hashValues = [
    { id: 3, value: "Fredrik Sundqvist 2" },
    { id: 4, value: "Patrik Sjölin 2" },
  ];

  const getQuill = (quillIns) => {
    return (quill.current = quillIns);
  };
  const dispatch = useDispatch();

  const [state, setState] = useState({ value: null });
  const handleChange = (value) => {
    console.log(value);
    setState({ value });
  };
  const quillRef = useRef();
  const userLogin = useSelector((state) => state.userLogin);
  let { loading, error, userInfo } = userLogin;

  const insertCustomEmbed = () => {
    const value = '<div class="custom-embed">Custom Embed Content</div>';
    const quill = quillRef.current.getEditor();
    quill.insertEmbed(quill.getSelection(true).index, "custom-embed", value);
  };

  function undoChange() {
    this.quill.history.undo();
  }
  function redoChange() {
    this.quill.history.redo();
  }

  const SAVE_INTERVAL_MS = 2000;

  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: ["", "arial", "inter", "roboto", "open-sans", "karla"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["blockquote", "code-block", "image"],
    ["link"],
    ["clean"],
    ["video"],
    ["img"],
    ["fileUploadAttach"],
    ["igAttach"],
  ];

  // const modules = {
  //   toolbar: TOOLBAR_OPTIONS,
  // };

  console.log({
    ops: [
      {
        insert: `Hello world`,
      },
    ],
  });

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
  ];

  const handleTextChange = (value) => {
    setText(value);
  };

  // Text to insert
  var newText = "This is some inserted text.";

  const handleSaveTemplate = async () => {
    setLoader(true);
    const newData = JSON.stringify(quill.current.getContents());
    const data = {
      name: tab.name,
      description: tab.name,
      blocks: newData,
    };
    await dispatch(createEntryTemplate(data));
    toast.success("Saved as Template");
    setLoader(false);

    // console.log(localStorage.getItem("tab"));
    // console.log(localStorage.getItem("project"));
  };

  const diplayLoader = async () => {};

  useEffect(() => {
    if (socket == null || quill.current == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source != "user") return;
      let cursorData = quill.current.getBounds(
        quill.current.getSelection().index
      );
      console.log(cursorData);
      const newStyle = setCoordinates(
        cursorData.left,
        cursorData.bottom,
        cursorData.top,
        cursorData.right
      );
      setStyle(newStyle);
      if (tab.isEdit) {
        socket.emit("send-changes", delta);
      }
    };
    quill.current.on("text-change", handler);
    return () => {
      quill.current.off("text-change", handler);
    };
  }, [socket, quill, tab]);

  useEffect(() => {
    if (socket == null || quill.current == null) return;
    const handler = (delta) => {
      quill.current.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-change", handler);
    };
  }, [socket, quill]);
  console.log(tab);
  useEffect(() => {
    if (socket == null || quill.current == null) return;
    socket.on("userJoined", (user) => {
      console.log(user);
      setUsers((prevUsers) => [...prevUsers, user]);
    });

    socket.on("userLeft", (user) => {
      console.log(user);
      setUsers((prevUsers) => prevUsers.filter((u) => u !== user));
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, quill]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  const projectDetails = useSelector((state) => state.projectDetails);
  const { project: mainProjectList } = projectDetails;
  const orgListMy = useSelector((state) => state.orgListMy);
  const { orgs } = orgListMy;

  const orgListMyCollab = useSelector((state) => state.orgListMyCollab);
  const { sucess: sucessCollab, orgs: orgsCollab } = orgListMyCollab;
  const findOrg =
    orgs && orgs.length > 0
      ? orgs[0]
      : orgsCollab && orgsCollab.length > 0
      ? orgsCollab[0]
      : null;

  useEffect(() => {
    dispatch(listMySamples(userInfo._id));
    dispatch(getProjectDetails(project._id));
    dispatch(listMyEntries(project._id));
    dispatch(listMyProtocols(userInfo._id));
    dispatch(listMySops(userInfo._id));
  }, [dispatch, tab]);

  console.log(userType);

  const [userCollabs, setUserCollabs] = useState(
    mainProjectList &&
      mainProjectList.collaborators &&
      mainProjectList.collaborators.length > 0
      ? mainProjectList.collaborators.map(({ userName: key, user: value }) => ({
          key,
          value,
          mainType: "User",
        }))
      : []
  );

  const [userOrgCollabs, setOrgCollabs] = useState(
    findOrg && findOrg.collaborators && findOrg.collaborators.length > 0
      ? findOrg.collaborators.map(({ userName: key, user: value }) => ({
          key,
          value,
          mainType: "User",
        }))
      : []
  );

  const [entryOptions, setEntryOptions] = useState(
    entries
      ? entries
          .filter((entry) => entry.deleted === false)
          .map(({ name: key, _id: value, type: type }) => ({
            key,
            value,
            type,
            mainType: "Entry",
          }))
      : []
  );

  const [sampleOptions, setSampleOptions] = useState(
    samples
      ? samples.map(({ _id: value, data: key }) => ({
          value,
          key: JSON.parse(key).sampleName ? JSON.parse(key).sampleName : "",
          type: "Sample",
          mainType: "Sample",
        }))
      : []
  );

  const [protocolOptions, setProtocolOptions] = useState(
    protocols
      ? protocols.map(({ _id: value, title: key }) => ({
          value,
          key,
          type: "Protocol",
          mainType: "Protocol",
        }))
      : []
  );

  const commonUsers = _.unionBy(
    userCollabs,
    userOrgCollabs,
    entryOptions,
    sampleOptions,
    protocolOptions,
    "value"
  );

  const [editName, setEditName] = useState(false);

  useEffect(() => {
    if (quill == null) return;
    if (userType && userType === "Read") {
      const toolbar = document.querySelector(".ql-toolbar");
      const editor = document.querySelector(".ql-editor");
      const main = document.querySelector(".ql-container");
      if (toolbar) {
        toolbar.style.display = "none";
      }
      if (editor && main) {
        editor.style.position = "relative";
      }
    }
  }, [quill, userType]);

  const [quillLength, setQuillLength] = useState();

  useEffect(() => {
    if (quill == null) return;
    if (tab && tab.isEdit === false) {
      const toolbar = document.querySelector(".ql-toolbar");
      const editor = document.querySelector(".ql-editor");
      const main = document.querySelector(".ql-container");

      if (toolbar) {
        toolbar.style.display = "none";
      }
      if (editor && main) {
        window.setTimeout(() => {
          if (tab.eSign) {
            quill.current.editor.insertText(
              quill.current.getLength(),
              "\n\neSigned By",
              "bold",
              true
            );

            quill.current.editor.insertEmbed(
              quill.current.getLength() + 5,
              "image",
              JSON.parse(tab.eSign).sign
            );
            quill.current.editor.insertText(
              quill.current.getLength() + 5,
              `\n${JSON.parse(tab.eSign).name} - ${JSON.parse(tab.eSign).job}`
            );
            quill.current.editor.insertText(
              quill.current.getLength() + 5,
              `${addTime(JSON.parse(tab.eSign).date)}`
            );
          }
        }, 3000);
      }
    }
  }, [quill, tab]);

  useEffect(() => {
    if (quill == null) return;
    quill.current.format("p", "customAttr", "custom-value");
  }, [quill]);

  useEffect(() => {
    if (document.querySelectorAll('a[href*="custom"]')) {
      let elements = document.querySelectorAll('a[href*="custom"]');
      if (elements) {
        elements.forEach((e) => {
          e.setAttribute("contenteditable", "false");
          e.setAttribute("class", "custom-element-mention");
          e.addEventListener("click", (el) => {
            if (e.getAttribute("href").split("#")[2] == "file") {
              el.preventDefault();
              setFileData(e.getAttribute("href").split("#")[3]);
              setFilePreview(true);
              // window.open(e.getAttribute("href").split("#")[3], "_blank");
            } else {
              el.preventDefault();
            }
          });
        });
      }
    }
  }, [document.querySelectorAll('a[href*="custom"]'), quill]);

  console.log(commonUsers && commonUsers);
  var tribute;

  // useEffect(() => {
  //   if (quill) {
  //     const editor = quill.current.editor;
  //     editor.insertEmbed(
  //       quill.current.scroll.length(),
  //       "image",
  //       "https://cdn.pixabay.com/photo/2022/02/08/09/28/boats-7001054_1280.jpg"
  //     );
  //   }
  // }, [quill]);

  const getMenuTemplate = async (item) => {};
  useEffect(() => {
    if (commonUsers) {
      tribute = new Tribute({
        values: commonUsers ? commonUsers : [],
        lookup: "key",
        fillAttr: "value",
        menuItemTemplate: (item) => {
          if (item.original.type === "Lab Notebook") {
            return `<span class="tribute-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              Lab Entry: ${item.original.key}</span>`;
          } else if (item.original.type === "Lab Sheet") {
            return `<span class="tribute-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f9d58" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table-2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
            Lab Sheet: ${item.original.key}</span>`;
          } else if (item.original.type === "Sample") {
            return `<span class="tribute-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-conical"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>
          Sample: ${item.original.key}</span>`;
          } else if (item.original.type === "Protocol") {
            return `<span class="tribute-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-minus"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M9 10h6"/></svg>
          Protocol: ${item.original.key}</span>`;
          } else {
            return `<span class="tribute-item">
                
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5d00d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
         
       User: ${item.original.key}</span>`;
          }
        },
        selectTemplate: (item) => {
          return `<a href='#custom#${item.original.mainType}#${item.original.value}' contenteditable="false" class="custom-element-mention">@${item.original.key}</a>`;
        },
      });
    }
  }, [commonUsers]);

  useEffect(() => {
    if (document.getElementById(tab._id)) {
      let parent = document
        .getElementById(tab._id)
        .getElementsByClassName("ql-editor")[0];

      tribute.attach(parent);
    }
  }, [document.getElementById(tab._id)]);

  useEffect(() => {
    if (socket == null || quill.current == null) return;
    if (!mainLoader) {
      const interval = setInterval(() => {
        console.log(quill.current.getContents());
        if (tab.isEdit) {
          socket.emit("save-document", {
            data: quill.current.getContents(),
            user: userInfo._id,
          });
        }
      }, SAVE_INTERVAL_MS);
      return () => {
        clearInterval(interval);
      };
    }
  }, [socket, quill, mainLoader, tab]);

  useEffect(() => {
    const s = io(URL[0].substring(0, URL[0].length - 1), {
      maxHttpBufferSize: 1e8,
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [tab._id]);

  useEffect(() => {
    if (socket == null || quill.current == null) return;
    socket.once("load-document", ({ document, user }) => {
      socket.emit("joinLobby", userInfo);
      console.log(document);
      setQuillLength(quill.current.scroll.length());
      if (typeof document === "string") {
        setHtmlData(document);
        setMainLoader(false);
      } else {
        setHtmlData(document);
        setMainLoader(false);
      }
      if (!tab.isEdit) {
        quill.current.enable(false);
      } else {
        quill.current.enable();
      }
    });
    socket.emit("get-document", {
      documentId: tab._id,
      user: userInfo,
    });
  }, [socket, quill, tab, value]);

  // useEffect(() => {
  //   if (document.querySelectorAll('li[data-list="bullet"]')) {
  //     let element = document.querySelectorAll('li[data-list="bullet"]')[0]
  //       .parentElement;
  //     let ul = document.createElement("ul");
  //     ul.innerHTML = element.innerHTML;
  //     console.log()
  //   }
  // }, [document.querySelectorAll('li[data-list="bullet"]')]);
  const [details, setDetails] = useState(false);
  const [deleteEnt, setDelete] = useState(false);
  const modules = 1;
  const handleDelete = async (id) => {
    var config = {
      method: "delete",
      url: `${URL[0]}api/entries/p/${id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    axios(config)
      .then(function(response) {
        console.log(JSON.stringify(response.data));
        toast.success("Entry Deleted");
        setDelete(false);
        setEntryUpdate(true);
        setWhichTabisActive("listProjects");
        dispatch({ type: CART_RESET });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const [approval, setApproval] = useState(false);
  const [approvalDetails, setApprovalDetails] = useState(false);
  const [submittedforApproval, setSubmittedForApproval] = useState(
    tab.submittedForApproval
  );

  const resubmitforApproval = async (id) => {
    setApproval(true);
    var data = JSON.stringify({
      userName: userInfo.name,
      statusMessage: "This entry has been resubmitted",
      status: "Draft",
    });

    var config = {
      method: "put",
      url: `${URL[0]}api/entries/status/${tab._id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function(response) {
        setLoader(false);
        const logObject = {
          entryId: tab._id,
          user: userInfo._id,
          userName: userInfo.name,
          userEmail: userInfo.email,
          message: `Submitted the entry for approval`,
        };
        await addEntryLogs(logObject);
        setEntryUpdate(true);
        setWhichTabisActive("projectList");
        setApproval(false);
        await dispatch(removeFromCart(tab._id));
        toast.success("Updated");
      })
      .catch(function(error) {
        setLoader(false);
        console.log(error);
      });
  };

  const reEdit = async () => {
    setLoader(true);
    var data = JSON.stringify({
      submittedforApproval: false,
      isEdit: true,
    });

    var config = {
      method: "put",
      url: `${URL[0]}api/entries/status/${tab._id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function(response) {
        setLoader(false);
        const logObject = {
          entryId: tab._id,
          user: userInfo._id,
          userName: userInfo.name,
          userEmail: userInfo.email,
          message: `Changed the status of the Entry With Name ${tab.name}  and id ${tab._id} to 'edit'.`,
        };
        await addEntryLogs(logObject);
        await dispatch(removeFromCart(tab._id));
        setEntryUpdate(true);
        setWhichTabisActive("projectList");
        window.setTimeout(() => {
          document.querySelector(`[tokenid="${tab._id}"]`).click();
          setLoader(false);
        }, 3000);
      })
      .catch(function(error) {
        setLoader(false);
        console.log(error);
      });
  };

  const [style, setStyle] = useState({
    position: "absolute",
    width: "3px",
    height: "20px",
    backgroundColor: "blue",
    zIndex: 9999999,
  });
  const setCoordinates = (left, bottom, top, right) => {
    // You don't need whitespace in here, I added it for readability
    // I would recommend using something like EmotionJS for this
    return {
      position: "absolute",
      width: "3px",
      height: "20px",
      backgroundColor: "blue",
      left: left,
      bottom: bottom,
      top: top,
      right: right,
      zIndex: 9999999,
    };
  };

  useEffect(() => {
    dispatch(
      addToRC({
        _id: tab._id,
        type: "Lab Entry",
        name: tab.name,
        time: Date.now(),
      })
    );
  }, [dispatch]);

  return (
    <>
      {warningModal && (
        <WarningModal
          setWarningModal={setWarningModal}
          versionControlValue={versionControlValue}
        />
      )}

      {loader && <Loader />}
      {
        <EntryTimeline
          open={entryTimeline}
          setOpen={setEntryTimeline}
          logs={[]}
          project={project}
          tab={tab}
        />
      }
      {
        <DetailSlideOver
          open={details}
          setOpen={setDetails}
          data={{
            name: tab.name,
            type: "Entry",
            description: `This entry was created ${tab.createdAt &&
              moment(tab.createdAt).fromNow()}`,
            createdby: userInfo.name,
            created: addTime(tab.createdAt),
            modified: addTime(tab.updatedAt),
            size: "5KB",
            shared: [],
          }}
        />
      }
      <CustomLogs
        open={customLogs}
        setOpen={setCustomLogs}
        logs={[]}
        project={project}
        tab={tab}
      />
      {
        <ConformationModal
          open={deleteEnt}
          setOpen={setDelete}
          heading="Are you sure?"
          details="You want to delete this entity."
          onClick={async () => {
            handleDelete(tab._id);
          }}
        />
      }
      {
        <SubmitForApproval
          open={approval}
          setOpen={setApproval}
          tab={tab}
          setEntryUpdate={setEntryUpdate}
          setWhichTabisActive={setWhichTabisActive}
        />
      }
      {
        <ViewDetails
          open={approvalDetails}
          setOpen={setApprovalDetails}
          data={{
            _id: tab._id,
            user: tab.user,
            name: tab.name,
            description: `This entity was created ${tab.createdAt &&
              moment(tab.createdAt).fromNow()}`,
            type: "entries",
            status: tab.status,
            statusMessage: tab.statusMessage ? tab.statusMessage : "",
            statusBy: tab.statusBy ? tab.statusBy : "",
            logs: tab.logs,
          }}
          role={userType}
          resubmitforApproval={resubmitforApproval}
        />
      }
      {/* <DrawerHistory
        quill={quill}
        tab={tab}
        project={project}
        open={isDrawerOpen}
        setOpen={setIsDrawerOpen}
      /> */}
      {/* <LogsModal setOpen={setLogs} open={logs}/> */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box width="500px" p={2} role="presentation">
          <DrawerHistory quill={quill} tab={tab} project={project} />
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={isDrawerVersionControl}
        onClose={() => setIsDrawerVersionControl(false)}
      >
        <Box width="500px" p={2} role="presentation">
          <DrawerVesionControl
            doc={tab}
            project={project}
            setVersionControlValue={setVersionControlValue}
            setVersionControlTab={setVersionControlTab}
            setIsDrawerVersionControl={setIsDrawerVersionControl}
          />
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={isDrawerEdit}
        onClose={() => setIsDrawerEdit(false)}
      >
        <Box width="500px" p={2} role="presentation">
          <DrawerEdit
            quill={quill}
            tab={tab}
            project={project}
            setEntryUpdate={setEntryUpdate}
            setWhichTabisActive={setWhichTabisActive}
          />
        </Box>
      </Drawer>
      {quill && (
        <Drawer
          anchor="right"
          open={drawerInformations}
          onClose={() => setDrawerInformations(false)}
        >
          <Box width="500px" p={2} role="presentation">
            <DrawerInformation
              quill={quill.current}
              tab={tab}
              project={project}
              setEntryUpdate={setEntryUpdate}
              setWhichTabisActive={setWhichTabisActive}
            />
          </Box>
        </Drawer>
      )}
      <EditNameEditor
        open={editName}
        setOpen={setEditName}
        quill={quill}
        tab={tab}
        project={project}
        setEntryUpdate={setEntryUpdate}
        setWhichTabisActive={setWhichTabisActive}
      />
      <ChemicalDrawingEntry
        open={chemicalDrawing}
        setOpen={setChemicalDrawing}
        quill={quill}
        tab={tab}
        project={project}
        setCreateDrawingModal={setCreateDrawingModal}
      />
      <InsertFileEditor
        open={insertFile}
        setOpen={setInsertFile}
        quill={quill}
      />
      <FilePreview
        open={filePreview}
        setOpen={setFilePreview}
        data={fileData}
      />
      <div
        className={`editor-holder-reactjs-new ${active && "active"}`}
        id={tab._id}
      >
        {mainLoader && <MainLoaderWithText text="Getting your entry ready" />}

        {tab && tab.submittedForApproval && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 w-[100%] h-[100%] bg-white bg-opacity-95 flex items-center justify-center z-[999999]">
            <div className="main-loader-scss-inside">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Blocks className="text-indigo-600" size={36} />

                <span className="text-xl text-slate-800 font-dmsans">
                  This entry is under review.
                  <br />
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setApprovalDetails(true);
                    }}
                    className="text-indigo-600 underline font-sans text-base"
                  >
                    View Details
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
        <Popover
          className={`relative bg-white font-body ${userType === "Read" &&
            "z-[99999999999999999]"}`}
        >
          <div className="flex justify-between items-center px-4 py-6 sm:px-6 md:justify-start md:space-x-6">
            <div>
              <a href="#" className="flex">
                <FileText size={30} color="#2563eb" strokeWidth={1.5} />
              </a>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>
            <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
              <Popover.Group as="nav" className="flex space-x-2">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center shadow-sm hover:shadow-lg w-full rounded-md border-gray-0 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                      File
                      <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
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
                    <Menu.Items className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                const editor = quill.current.editor;
                                setEditName(true);
                                //
                                // const imageUrl =
                                //   "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg";
                                // editor.insertEmbed(
                                //   quill.current.getSelection(),
                                //   "image",
                                //   imageUrl
                                // );
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <PencilAltIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Edit Entry Name
                            </a>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSaveTemplate();
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <DuplicateIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Save as Template
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                const editor = quill.current.editor;
                                setDetails(true);
                                //
                                // const imageUrl =
                                //   "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg";
                                // editor.insertEmbed(
                                //   quill.current.getSelection(),
                                //   "image",
                                //   imageUrl
                                // );
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <Info
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              View Details
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                const editor = quill.current.editor;
                                setEntryTimeline(true);
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <SquareGanttIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              View Timeline
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      {/* <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-sm"
                              )}
                            >
                              <ArchiveIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Archive
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-sm"
                              )}
                            >
                              <ArrowCircleRightIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Move
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-sm"
                              )}
                            >
                              <UserAddIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Share
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-sm"
                              )}
                            >
                              <HeartIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Add to favorites
                            </a>
                          )}
                        </Menu.Item>
                      </div> */}
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                // setIsDrawerOpen(true);
                                setCustomLogs(true);
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <DocumentTextIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              View Logs
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setDelete(true);
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <Trash
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Delete Entry
                            </a>
                          )}
                        </Menu.Item>
                        {/* <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <TrashIcon
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Delete
                            </a>
                          )}
                        </Menu.Item> */}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center w-full shadow-sm hover:shadow-lg rounded-md border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                      Insert
                      <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
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
                    <Menu.Items className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                const editor = quill.current.editor;
                                setChemicalDrawing(true);
                                //
                                // const imageUrl =
                                //   "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg";
                                // editor.insertEmbed(
                                //   quill.current.getSelection(),
                                //   "image",
                                //   imageUrl
                                // );
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <Biohazard
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Chemical Drawing
                            </a>
                          )}
                        </Menu.Item>
                        {/* <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                const editor = quill.current.editor;
                                setChemicalDrawing(true);
                                
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <Table2
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Lab Sheet
                            </a>
                          )}
                        </Menu.Item> */}
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                const editor = quill.current.editor;
                                setInsertFile(true);
                                //
                                // const imageUrl =
                                //   "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg";
                                // editor.insertEmbed(
                                //   quill.current.getSelection(),
                                //   "image",
                                //   imageUrl
                                // );
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <UploadCloud
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Attach File
                            </a>
                          )}
                        </Menu.Item>
                        {/* <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                const editor = quill.current.editor;
                                setChemicalDrawing(true);
                                
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              <Table2
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Lab Sheet
                            </a>
                          )}
                        </Menu.Item> */}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex justify-center shadow-sm hover:shadow-lg w-full rounded-md border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                      Export
                      <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
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
                    <Menu.Items className="origin-top-right absolute left-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                const quillContents =
                                  quill.current.root.innerHTML;
                                if (tab.eSign) {
                                  const sign = `
                                    <hr/>
                                    <p>e-Signed by</p>
                                    <img src='${JSON.parse(tab.eSign).sign}'/>
                                    <h3>${JSON.parse(tab.eSign).name} - ${
                                    JSON.parse(tab.eSign).job
                                  }</h3>
                                    <p>${addTime(
                                      JSON.parse(tab.eSign).date
                                    )}</p> 
                                    `;
                                  const final = quillContents + sign;
                                  var converted = htmlDocx.asBlob(final);
                                  saveAs(converted, tab.name);
                                } else {
                                  var converted = htmlDocx.asBlob(
                                    quillContents
                                  );
                                  saveAs(converted, tab.name);
                                }
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              Microsoft Word (.docx)
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={async (e) => {
                                e.preventDefault();
                                const delta = quill.current.getContents();
                                if (tab.eSign) {
                                  const final = [
                                    {
                                      insert: "\n\n",
                                    },
                                    {
                                      insert: "e-Signed By",
                                    },
                                    {
                                      attributes: {
                                        alt: "signature",
                                        width: "256",
                                      },
                                      insert: {
                                        image: JSON.parse(tab.eSign).sign,
                                      },
                                    },
                                    {
                                      insert: `${
                                        JSON.parse(tab.eSign).name
                                      } - ${JSON.parse(tab.eSign).job}`,
                                    },
                                    {
                                      insert: "\n",
                                    },
                                    {
                                      insert: `${addTime(
                                        JSON.parse(tab.eSign).date
                                      )}`,
                                    },
                                  ];
                                  const arr1 = delta.ops;
                                  const finArr = arr1.concat(final);
                                  const newDelta = new Delta(finArr);
                                  const pdfAsBlob = await pdfExporter.generatePdf(
                                    newDelta
                                  );
                                  saveAs(pdfAsBlob, "pdf-export.pdf");
                                } else {
                                  console.log(delta.ops);
                                  const pdfAsBlob = await pdfExporter.generatePdf(
                                    delta
                                  );
                                  saveAs(pdfAsBlob, "pdf-export.pdf");
                                }
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              PDF Document (.pdf)
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={async (e) => {
                                e.preventDefault();
                                let html = `
                                                                <html>
                                                            <head>
                                                            <link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.snow.css">
                                                            <style>
                                                            .mention {
                                                              height: 24px;
                                                              width: 65px;
                                                              border-radius: 6px;
                                                              background-color: #4655ff;
                                                              color: white;
                                                              padding: 3px 0;
                                                              margin-right: 2px;
                                                              user-select: all;
                                                            }

                                                            .mention > span {
                                                              margin: 0 3px;
                                                            }

                                                            a#file-opener {
                                                              &::after {
                                                                content: attr(title);
                                                              }

                                                              &:hover {
                                                                cursor: pointer;
                                                              }
                                                            }

                                                            button#spreadsheet-opener {
                                                              &::after {
                                                                content: attr(dataName);
                                                              }

                                                              &:hover {
                                                                cursor: pointer;
                                                              }
                                                            }
                                                            </style>
                                                            </head>
                                                            <body>
                                                            ${quill.current.root.innerHTML}
                                                            </body>
                                                            </html>
                                                                `;
                                let entry = zip.folder("entry");
                                entry.file(`entry.html`, html);
                                zip
                                  .generateAsync({ type: "blob" })
                                  .then((content) => {
                                    saveAs(content, `export.zip`);
                                  });
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              Web Page (.html)
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={async (e) => {
                                e.preventDefault();
                                const deltas = quill.current.getContents();

                                if (!deltas) {
                                  return alert("Content not found");
                                }
                                downloadObjectAsJson(deltas.ops, "editor-text");
                              }}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "group flex items-center px-4 py-2 text-base"
                              )}
                            >
                              Javascript Object Notation (.json)
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* <a
                  href="#"
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Edit
                </a>
                <a
                  href="#"
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  View
                </a>
                <a
                  href="#"
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Format
                </a>
                <a
                  href="#"
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Tools
                </a>
                <a
                  href="#"
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Extensions
                </a>

                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={classNames(
                          open ? "text-gray-900" : "text-gray-500",
                          "group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        )}
                      >
                        <span>Help</span>
                        <ChevronDownIcon
                          className={classNames(
                            open ? "text-gray-600" : "text-gray-400",
                            "ml-2 h-5 w-5 group-hover:text-gray-500"
                          )}
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0">
                          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                              {resources.map((item) => (
                                <a
                                  key={item.name}
                                  href={item.href}
                                  className="-m-3 p-3 block rounded-md hover:bg-gray-50"
                                >
                                  <p className="text-base font-medium text-gray-900">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.description}
                                  </p>
                                </a>
                              ))}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover> */}
              </Popover.Group>
              <div className="flex items-center md:ml-12">
                {tab.isEdit ? (
                  <>
                    {savingData ? (
                      <div aria-label="Loading..." role="status">
                        <svg
                          className="animate-spin w-6 h-6 fill-slate-800"
                          viewBox="3 3 18 18"
                        >
                          <path
                            className="opacity-20"
                            d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                          ></path>
                          <path d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"></path>
                        </svg>
                      </div>
                    ) : (
                      <p className="flex items-center justify-center font-sans text-xs">
                        {" "}
                        <svg
                          className="w-6 h-6 mr-1 text-indigo-300"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke="#CCCCCC"
                            strokeWidth="0.72"
                          />
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              d="M9 13.2222L10.8462 15L15 11M8.4 19C5.41766 19 3 16.6044 3 13.6493C3 11.2001 4.8 8.9375 7.5 8.5C8.34694 6.48637 10.3514 5 12.6893 5C15.684 5 18.1317 7.32251 18.3 10.25C19.8893 10.9449 21 12.6503 21 14.4969C21 16.9839 18.9853 19 16.5 19L8.4 19Z"
                              stroke="gray"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />{" "}
                          </g>
                        </svg>
                        This file is being autosaved.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="flex items-center justify-center font-dmsans text-xs">
                      <Eye className="w-6 h-6 mr-1 text-indigo-300" /> Read Only
                    </p>
                  </>
                )}

                {!tab.isEdit && (
                  <a
                    href="#"
                    onClick={async (e) => {
                      e.preventDefault();
                      reEdit();
                    }}
                    className="ml-5 font-karla flex items-center text-sm justify-center bg-indigo-600 text-white py-3 px-5 rounded-lg"
                  >
                    <Pen className="mr-2" size={16} />
                    Edit
                  </a>
                )}
                {!tab.isEdit ? (
                  <a
                    href="#"
                    onClick={async (e) => {
                      e.preventDefault();
                      window.setTimeout(() => {
                        setApprovalDetails(true);
                      }, Math.floor(Math.random() * 3) + 1);
                    }}
                    className="ml-2 font-karla flex items-center text-sm justify-center bg-indigo-600 text-white py-3 px-5 rounded-lg"
                  >
                    <Bookmark className="mr-2" size={16} />
                    Check Status
                  </a>
                ) : (
                  <a
                    href="#"
                    onClick={async (e) => {
                      e.preventDefault();
                      window.setTimeout(() => {
                        setApproval(true);
                      }, Math.floor(Math.random() * 3) + 1);
                    }}
                    className="ml-5 font-karla flex items-center text-sm justify-center bg-indigo-600 text-white py-3 px-5 rounded-lg"
                  >
                    <ClipboardCheck className="mr-2" size={16} />
                    Submit for Approval
                  </a>
                )}

                {/* {users &&
                  users.length > 0 &&
                  users.map((u) => (
                    <Tooltip title={u.email}>
                      <span className="inline-block relative hover:cursor-pointer">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?background=random&name=${u.name}`}
                          alt=""
                        />
                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400" />
                      </span>
                    </Tooltip>
                  ))} */}

                {/* <a
                  href="#"
                  className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Submit for approval
                </a> */}
              </div>
            </div>
          </div>

          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-[999999]"
            >
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 px-5">
                  <div className="flex items-center justify-between">
                    <div>{tab.name}</div>
                    <div className="-mr-2">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Close menu</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <div className="py-6 px-5">
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditName(true);
                      }}
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                    >
                      Edit Entry Name
                    </a>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSaveTemplate();
                      }}
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                    >
                      Save as Template
                    </a>

                    <a
                      href="#"
                      className="text-base font-medium text-gray-900 hover:text-gray-700"
                    >
                      Enterprise
                    </a>
                  </div>
                  {/* <div className="mt-6">
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Sign up
                    </a>
                    <p className="mt-6 text-center text-base font-medium text-gray-500">
                      Existing customer?{" "}
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        Sign in
                      </a>
                    </p>
                  </div> */}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
        {userType && userType === "Read" && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 w-[100%] overflow-y-auto h-[100%] bg-white bg-opacity-50 flex items-center justify-center z-[999999]"></div>
        )}

        {userType && userType != "Read" ? (
          <ShareMain
            styles="absolute bottom-10 right-10 z-[9999999]"
            type="entries"
            id={tab._id}
            share={tab.share}
            setUpdate={setEntryUpdate}
          />
        ) : (
          <ViewOnly />
        )}

        <div
          id="eSignData"
          className={`absolute bottom-10 right-[100px] ${
            bottom ? "opacity-1" : "opacity-0"
          } z-[9999999] font-dmsans bg-white rounded-sm py-5 px-12 transition ease-in-out delay-150 duration-300 shadow-lg`}
        >
          <X
            className="absolute top-2 right-2 w-5 h-5 hover:cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setBottom(false);
            }}
          />
          {tab.eSign ? (
            <>
              <span>e-Signed By</span>
              <img src={JSON.parse(tab.eSign).sign} className="my-2" />
              <hr />
              <h4 className="mt-3 mb-1">
                {JSON.parse(tab.eSign).name} - {JSON.parse(tab.eSign).job}
              </h4>
              <span>{addTime(JSON.parse(tab.eSign).date)}</span>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Ban />
              <h2 className="mt-2">No signature</h2>
            </div>
          )}
        </div>

        <RichTextEditor
          className="relative"
          modules={{
            table: {},
            codeHighlight: true,
            toolbarOptions: [
              ["undo", "redo"],
              [
                {
                  font: ["arial", "inter", "roboto", "open-sans", "karla"],
                },
                { size: ["12px", "14px", "18px", "36px"] },
              ],
              [{ color: [] }, { background: [] }],
              ["bold", "italic", "underline", "strike"],
              [
                { list: "ordered" },
                // { list: "bullet" },
                // { list: "check" },
                { indent: "-1" },
                { indent: "+1" },
                { align: [] },
              ],
              [
                "blockquote",
                "code-block",
                "link",
                "image",
                { script: "sub" },
                { script: "super" },
                "table",
                "clean",
                // "custom-bullet-list",
              ],
            ],
            mention: {
              allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
              mentionDenotationChars: ["@", "#"],
              source: function(searchTerm, renderList, mentionChar) {
                let values;

                if (mentionChar === "@") {
                  values = atValues;
                } else {
                  values = hashValues;
                }

                if (searchTerm.length === 0) {
                  renderList(values, searchTerm);
                } else {
                  const matches = [];
                  for (let i = 0; i < values.length; i++)
                    if (
                      ~values[i].value
                        .toLowerCase()
                        .indexOf(searchTerm.toLowerCase())
                    )
                      matches.push(values[i]);
                  renderList(matches, searchTerm);
                }
              },
            },
          }}
          getQuill={getQuill}
          ref={quill}
          content={htmlData}
          placeholder=" "
        ></RichTextEditor>
      </div>
    </>
  );
}

export default TextEditorTwo;
