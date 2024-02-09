import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MainModalEntity from "../../UI/MainModals/MainModalEntity";

function TemplateModal({ setTemplateModal, templateModal, templateContent }) {
  console.log(templateContent);
  return (
    <MainModalEntity open={templateModal} setOpen={setTemplateModal}>
      <p className="font-normal text-gray-700 quill-read-only-editor">
        <ReactQuill
          theme="snow"
          readOnly
          value={JSON.parse(templateContent.blocks)}
        />
      </p>
    </MainModalEntity>
  );
}

export default TemplateModal;
