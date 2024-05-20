import React, { useState } from "react";
import BasicModalTailwind from "../../../UI/MainModals/BasicModalTailwind";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useSelector } from "react-redux";
import { storage } from "../../../firebase";
import SecondLoaderWithText from "../../Loaders/SecondLoaderWithText";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";

function InsertFileEditor({ open, setOpen, quill }) {
  const userLogin = useSelector((state) => state.userLogin);
  let { loading, error, userInfo } = userLogin;
  const [file, setFile] = useState();
  const [loaderText, setLoaderText] = useState("Uploading");
  const [loader, setLoader] = useState(false);
  const btnClick = async () => {
    setLoader(true);
    const editor = quill.current.editor;
    const imageRef = ref(
      storage,
      `files/${userInfo._id}/${file.name + uuid()}`
    );
    if (quill.current.getSelection()) {
      if (quill.current.getSelection().index) {
        uploadBytes(imageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            console.log(url);
            var delta = {
              ops: [
                {
                  retain: quill.current.getSelection().index,
                },
                {
                  insert: file.name,
                  attributes: {
                    link: `#custom#file#${url}`,
                    class: "custom-element-mention",
                  },
                },
              ],
            };
            setLoaderText("Inserting");
            window.setTimeout(() => {
              quill.current.updateContents(delta);
              setLoader(false);
              setOpen(false);
            }, 3000);
          });
        });
      } else {
        uploadBytes(imageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            console.log(url);
            var delta = {
              ops: [
                {
                  retain: 1,
                },
                {
                  insert: file.name,
                  attributes: {
                    link: `#custom#file#${url}`,
                    class: "custom-element-mention",
                  },
                },
              ],
            };
            setLoaderText("Inserting");
            window.setTimeout(() => {
              quill.current.updateContents(delta);
              setLoader(false);
              setOpen(false);
            }, 3000);
          });
        });
      }
    }
  };
  return (
    <BasicModalTailwind open={open} setOpen={setOpen}>
      {loader && <SecondLoaderWithText text={loaderText} />}

      <form>
        <label htmlFor="large-file-input" className="sr-only">
          Choose file
        </label>
        <input
          type="file"
          name="large-file-input"
          id="large-file-input"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
      file:bg-gray-50 file:border-0
      file:bg-gray-100 file:me-4
      file:py-3 file:px-4 file:sm:py-5"
        />
      </form>
      {file && (
        <div className="px-4 py-3 text-right sm:px-6">
          <button
            onClick={btnClick}
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Insert
          </button>
        </div>
      )}
    </BasicModalTailwind>
  );
}

export default InsertFileEditor;
