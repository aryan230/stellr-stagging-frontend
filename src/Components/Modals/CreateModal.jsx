import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../redux/actions/projectActions";
import { PROJECT_CREATE_RESET } from "../../redux/constants/projectConstants";
import MainModalTailwind from "../../UI/MainModals/MainModalTailwind";
import InputWithLabel from "../../UI/Input/InputWithLabel";
import TextareaWithLabel from "../../UI/Input/TextareaWithLabel";
import ButtonGroupSample from "../../UI/Button/ButtonGroupSample";
import DefaultButton from "../../UI/Button/DefaultButton";
import MainLoaderWithText from "../Loaders/MainLoaderWithText";

function CreateModal({
  setModal,
  setMiddleNav,
  setId,
  setActiveProject,
  setActiveProjectId,
  setProjectListActive,
  setHomeActive,
  setProfileActive,
  setProjectInsideActive,
  setProjectInsideActiveId,
  setWhichTabisActive,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState();
  const [des, setDes] = useState();
  const [loader, setLoader] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const projectCreate = useSelector((state) => state.projectCreate);
  const { project, sucess, error, loading: orderCreateLoading } = projectCreate;
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (userInfo) {
      await dispatch(
        createProject({
          name,
          description: des,
        })
      );
      await dispatch({
        type: PROJECT_CREATE_RESET,
      });
      setLoader(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sucess) {
      setModal(false);
      setId(project._id);
      setMiddleNav(false);
      setProjectInsideActiveId(project._id);
      setProjectInsideActive(true);
      setWhichTabisActive("projectList");
    }
  }, [navigate, sucess]);
  return (
    <MainModalTailwind
      iconName="Folders"
      modalName="Create Project"
      setCloseModal={setModal}
    >
      {loader && <MainLoaderWithText text="Creating your project" />}
      <form onSubmit={submitHandler}>
        {" "}
        <InputWithLabel
          label="Enter a name for your project"
          placeholder="Project Name"
          required={true}
          onChange={(e) => setName(e.target.value)}
        />
        <TextareaWithLabel
          label="Enter Description for your project"
          placeholder="Description for your project"
          required={true}
          onChange={(e) => setDes(e.target.value)}
        />
        <DefaultButton label="Create New Project" />
      </form>
    </MainModalTailwind>

    // <div className="modal">
    //   <div className="modal-inside">
    //     <div className="top-modal">
    //       <button
    //         onClick={() => {
    //           setModal(false);
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
    //       <h1>Create New Project</h1>
    //       <form onSubmit={submitHandler}>
    //         <input
    //           type="text"
    //           placeholder="Enter a name for your project"
    //           onChange={(e) => setName(e.target.value)}
    //           required
    //         />
    //         <textarea
    //           type="text"
    //           placeholder="Description for your project"
    //           onChange={(e) => setDes(e.target.value)}
    //           required
    //         ></textarea>
    //         <button type="submit">Submit</button>
    //       </form>
    //     </>
    //   </div>
    // </div>
  );
}

export default CreateModal;
