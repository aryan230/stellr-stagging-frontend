import React, { useEffect, useRef } from "react";
import MainModalEntity from "../../../UI/MainModals/MainModalEntity";
import RichTextEditor from "quill-react-commercial";
import { RotateCcw } from "lucide-react";

function ViewVersionControl({ open, setOpen, currenVData, setHtmlData }) {
  console.log(currenVData);
  const quill = useRef(null);
  useEffect(() => {
    if (quill) {
      if (quill.current) quill.current.enable(false);
    }
  }, [quill]);
  return (
    <MainModalEntity open={open} setOpen={setOpen} width="50vw">
      <div className="h-[80vh]">
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setHtmlData(currenVData);
              setOpen(false);
            }}
            className="bg-indigo-600 mb-5 flex items-center justify-start py-3 px-10 shadow-md rounded-md text-white"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Restore
          </button>
        </div>{" "}
        <div className="editor-holder-reactjs-new active">
          {" "}
          <RichTextEditor
            className="relative"
            ref={quill}
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
            }}
            placeholder=" "
            content={currenVData ? currenVData : ""}
          ></RichTextEditor>
        </div>
      </div>
    </MainModalEntity>
  );
}

export default ViewVersionControl;
