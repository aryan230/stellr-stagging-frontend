import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Chip, Drawer, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createCollabProject } from "../../redux/actions/projectActions";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { PROJECT_CREATE_COLLAB_RESET } from "../../redux/constants/projectConstants";
import URL from "../../Data/data.json";
import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";
import SettingsModal from "../Settings/SettingsModal";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import ProjectLog from "./ProjectLog";
import DrawerEditProject from "./DrawerEditProject";
import { Disclosure, Menu, RadioGroup, Transition } from "@headlessui/react";
import { HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsideLoader from "../Loader/InsideLoader";
import { userRoleExtract } from "../Functions/userRoleFunction";
import { addProjectLogs } from "../Functions/addProjectLogs";
import LoaderInside from "../../css/utils/LoaderInside";
import { addNotification } from "../Functions/addNotification";
import ProjectSettingsNew from "./ProjectSettingsNew";
import MainModalEntity from "../../UI/MainModals/MainModalEntity";
import SecondLoaderWithText from "../Loaders/SecondLoaderWithText";
import moment from "moment";
import { addTime } from "../Functions/addTime";

function ProjectSettings({
  projectSettings,
  setProjectSettings,
  project,
  setNewCollab,
  setProjectUpdatedProfilers,
  setUpdatedUserCollabRole,
  userType,
  setProjectInsideActive,
  setWhichTabisActive,
}) {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [email, setEmail] = useState();
  const [settingsModal, setSettingsModal] = useState(false);
  const [updateUserId, setUpdateUserId] = useState();
  const [updatedUserEmail, setUpdatedUserEmail] = useState();
  const [updatedUser, setUpdatedUser] = useState(false);
  const [viewLogs, setViewLogs] = useState(false);
  const [data, setData] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState();
  const [ownerUserData, setOwnerUserData] = useState();
  const [loader, setLoader] = useState(false);
  const [loaderText, setLoaderText] = useState("Loading");
  const projectCollabCreate = useSelector((state) => state.projectCollabCreate);
  let { loading, error, project: newProject, sucess } = projectCollabCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const ownerUser = async () => {
    var config = {
      method: "get",
      url: `${URL}api/users/${project.user}`,
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

  const getUserData = async (id) => {
    var config = {
      method: "get",
      url: `${URL}api/users/${id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(async function(response) {
        if (response) {
          return response.data;
        } else {
          toast.error("No user found for that email.");
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!ownerUserData) {
      ownerUser();
    }
  }, [ownerUserData]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoader(true);
    setLoaderText("Checking for user");
    var data = JSON.stringify({
      email: `${email}`,
    });

    var config = {
      method: "post",
      url: `${URL}api/users/email`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function(response) {
        if (response.data.length > 0) {
          setLoaderText("Adding");
          const logObject = {
            entryId: project._id,
            user: userInfo._id,
            userName: userInfo.name,
            userEmail: userInfo.email,
            message: `Added the user With  ${email}`,
          };
          await dispatch(
            createCollabProject({
              projectId: project._id,
              collabDetails: {
                user: response.data[0]._id,
                userName: response.data[0].name ? response.data[0].name : "",
              },
              userEmail: response.data[0].email,
            })
          );
          await dispatch({
            type: PROJECT_CREATE_COLLAB_RESET,
          });

          await addProjectLogs(logObject);
          await addNotification({
            id: response.data[0]._id,
            type: "Not read",
            value: JSON.stringify({
              subject:
                "You have been added to a new project with name" +
                project.name +
                " by " +
                userInfo.name,
              date: new Date(),
            }),
            token: userInfo.token,
          });
          setLoader(false);
        } else {
          setLoader(false);
          toast.error("No user found for that email.");
        }
      })
      .catch(function(error) {
        toast.error(error.message);
        setLoader(false);
      });
  };

  const deleteHandlerCollab = async (id, email) => {
    setLoader(true);
    var data = JSON.stringify({
      projectId: project._id,
      collabDetails: {
        user: id,
      },
    });

    var config = {
      method: "delete",
      url: `${URL}api/projects/collab`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function(response) {
        if (response) {
          const logObject = {
            entryId: project._id,
            user: userInfo._id,
            userName: userInfo.name,
            userEmail: userInfo.email,
            message: `Removed the user With  ${email}  and id ${id}`,
          };
          await addNotification({
            id: id,
            type: "Not read",
            value: JSON.stringify({
              subject:
                "You have been removed from the project with name " +
                project.name +
                " by " +
                userInfo.name,
              date: new Date(),
            }),
            token: userInfo.token,
          });
          await addProjectLogs(logObject);
          setNewCollab(true);
          setProjectSettings(false);
          setLoader(false);
          toast.success("User Sucessfully deleted.");
        } else {
          setLoader(false);
          toast.error("No user found for that email.");
        }
      })
      .catch(function(error) {
        setLoader(false);
        toast.error(error.message);
      });
  };
  const getUserRole = async (userRole) => {
    console.log(userRole);
    const newRole = await userRoleExtract(userRole);
    setUserRole(newRole);
  };
  useEffect(() => {
    if (sucess) {
      setNewCollab(true);
      setProjectSettings(false);
    }
    if (error) {
      toast.error("There was some error");
      console.log(error);
    }
  }, [sucess, error]);

  useEffect(() => {
    if (userType) {
      if (!userRole) {
        getUserRole(userType);
      }
    }
  }, [userRole, userType]);

  const [deleteTask, setDelete] = useState(false);
  const [openChange, setOpenChange] = useState(false);

  const handleDelete = async (id) => {
    var config = {
      method: "delete",
      url: `${URL[0]}api/projects/p/${id}`,
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    axios(config)
      .then(function(response) {
        console.log(JSON.stringify(response.data));
        toast.success("Project Deleted");
        setDelete(false);
        setProjectSettings(false);
        setNewCollab(true);
        setProjectInsideActive(false);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  return (
    <MainModalEntity open={projectSettings} setOpen={setProjectSettings}>
      {loader && <SecondLoaderWithText text={loaderText} />}
      {settingsModal && updateUserId && (
        <SettingsModal
          settingsModal={settingsModal}
          setProjectSettings={setProjectSettings}
          setSettingsModal={setSettingsModal}
          project={project}
          id={updateUserId}
          email={updatedUserEmail}
          setUpdatedUserCollabRole={setUpdatedUserCollabRole}
          setNewCollab={setNewCollab}
        />
      )}
      <ProjectSettingsNew
        handleDelete={handleDelete}
        deleteTask={deleteTask}
        setDelete={setDelete}
        setUpdateUserId={setUpdateUserId}
        setSettingsModal={setSettingsModal}
        setEmail={setEmail}
        ownerUser={ownerUserData}
        submitAddnewCollab={submitHandler}
        submitDeleteCollab={deleteHandlerCollab}
        data={{
          id: project._id,
          name: project.name,
          tag: `This project was created on ${project.createdAt}`,
          description: project.description,
          createdBy: "",
          tabs: [
            {
              name: "General",
              current: true,
              insideData: [
                {
                  type: "text",
                  key: "Name",
                  value: project.name,
                },
                {
                  type: "text",
                  key: "Description",
                  value: project.description,
                },
                {
                  type: "text",
                  key: "Created By",
                  value: project.user,
                },
                {
                  type: "text",
                  key: "Created On",
                  value: addTime(project.createdAt),
                },
                {
                  type: "text",
                  key: "Last Updated On",
                  value: addTime(project.updatedAt),
                },
              ],
            },
            {
              name: "Logs",
              dataType: "Logs",
              insideData: [
                {
                  type: "table",
                  tableData: project.logs,
                },
              ],
            },
            {
              name: "Collaborators",
              dataType: "Collaborators",
              insideData: [
                {
                  type: "collab",
                  collabData: project.collaborators,
                },
              ],
            },
            {
              name: "Archive Settings",
              dataType: "Buttons",
              insideData: [
                {
                  type: "dangerZone",
                },
              ],
            },
          ],
          teamMembers: project.collaborators,
          logs: project.logs,
        }}
      />
    </MainModalEntity>
  );
}

export default ProjectSettings;
