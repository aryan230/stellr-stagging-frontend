import React, { useEffect, useState } from "react";
import MainModalEntity from "../../UI/MainModals/MainModalEntity";
import { storage } from "../../firebase";
import { getMetadata, ref } from "firebase/storage";
import { FileIcon, defaultStyles } from "react-file-icon";
import SecondLoaderWithText from "../Loaders/SecondLoaderWithText";
import mime from "mime";

function FilePreview({ open, setOpen, data }) {
  const [mainData, setMainData] = useState();
  const [styles, setStyles] = useState("zip");
  const [loader, setLoader] = useState(false);

  const getDetails = async () => {
    // setLoader(true);

    if (data) {
      const fileRef = ref(storage, data);
      getMetadata(fileRef)
        .then((metadata) => {
          // Metadata contains information about the file
          setMainData(metadata);
          console.log(metadata);
          setStyles(mime.getExtension(metadata.contentType));
          setLoader(false);
        })
        .catch((error) => {
          setLoader(false);
          console.error("Error getting file metadata:", error);
        });
    }
  };

  useEffect(() => {
    getDetails();
  }, [data]);

  return (
    <MainModalEntity open={open} setOpen={setOpen}>
      {loader && <SecondLoaderWithText text="Loading File" />}
      <div className="relative bg-white rounded-lg">
        <div className="p-4 md:p-5 text-center">
          <div
            style={{
              width: "10%",
              margin: "0 auto",
              marginBottom: "1rem",
            }}
          >
            <FileIcon size={16} extension={styles} {...defaultStyles[styles]} />
          </div>
          <h3 className="mb-8 text-2xl font-normal text-gray-700">
            {mainData && mainData.name}
            {/* <p className="text-sm pt-1">- {data}</p> */}
          </h3>

          <a
            href={data}
            target="_blank"
            data-modal-hide="popup-modal"
            type="button"
            className="text-white bg-indigo-600 hover:bg-indigo-800 focus:outline-none focus:ring-indigo-300  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
          >
            Download
          </a>
          <button
            data-modal-hide="popup-modal"
            type="button"
            onClick={() => {
              setOpen(false);
            }}
            className="text-gray-500 bg-white hover:bg-gray-100 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
          >
            No, cancel
          </button>
        </div>
      </div>
    </MainModalEntity>
  );
}

export default FilePreview;
