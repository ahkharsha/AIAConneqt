import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import {
  AiOutlineEdit,
  AiOutlineVideoCameraAdd,
  AiOutlineCamera,
  AiOutlineFileText,
} from "react-icons/ai";
import { HiPhotograph } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";

// INTERNAL IMPORT
import { MainShareLink, Upload, BtnLoader } from "./index";
import { SOCAIL_MEDIA_Context } from "../../../context/context";

const postType = [
  {
    type: "Video",
    icon: <AiOutlineVideoCameraAdd />,
  },
  {
    type: "Image",
    icon: <HiPhotograph />,
  },
  {
    type: "Text",
    icon: <AiOutlineFileText />,
  },
];

const CreatePost = ({ setOpenCreatePost, CREATE_POST }) => {
  const { PINATA_API_KEY, PINATA_SECRECT_KEY, setLoader, loader } =
    useContext(SOCAIL_MEDIA_Context);

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const [fileURL, setFileURL] = useState("");
  const [uploadLoader, setUploadLoader] = useState(false);

  const [form, setForm] = useState({
    type: "Text", // Set default type to "Text"
    description: "",
  });

  const _calling_CreatePost = async () => {
    try {
      const { type, description } = form;

      if (!description) {
        return console.log("Please provide a description");
      } else {
        await CREATE_POST(fileURL, type || "Text", description); // Ensure type is "Text" if not set
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const uploadToInfura = async (file) => {
    if (file) {
      try {
        notifySuccess("Uploading to IPFS....");
        setUploadLoader(true);
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          maxBodyLength: "Infinity",
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRECT_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        console.log(response);
        setFileURL(ImgHash);
        setUploadLoader(false);
        notifySuccess("Uploaded to IPFS successfully");
      } catch (error) {
        setUploadLoader(false);
        notifyError("Unable to upload image to Pinata, Check your API Keys");
        console.log("Unable to upload image to Pinata", error);
      }
    }
  };

  const onDrop = useCallback(async (acceptedFile) => {
    await uploadToInfura(acceptedFile[0]);
  }, []);

  const {
    getInputProps,
    getRootProps,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({ onDrop, maxSize: 500000000000 });

  return (
    <div className="middle-sidebar-left">
      <div className="middle-wrap">
        <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
          <div className="card-body p-lg-5 p-4 w-100 border-0">
            <div className="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
              <div className="card-body p-0">
                <a
                  onClick={() => setOpenCreatePost(false)}
                  className="font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"
                >
                  <i className="btn-round-sm font-xs text-primary  me-2 bg-greylight">
                    <AiOutlineClose />
                  </i>
                  Create Post
                </a>
              </div>
            </div>

            <div className="card-body d-flex p-0 mt-0">
              {postType.map((type, index) => (
                <a
                  key={index}
                  onClick={() => setForm({ ...form, type: type.type })}
                  className="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"
                >
                  <i
                    className={`font-md ${
                      type.type === "Video"
                        ? "text-danger"
                        : type.type === "Image"
                        ? "text-success"
                        : "text-warning"
                    } me-2`}
                  >
                    {type.icon}
                  </i>
                  <span className="d-none-xs"> {type.type}</span>
                </a>
              ))}
            </div>

            <form action="#">
              <div className="row">
                {form.type && form.type !== "Text" && !fileURL && (
                  <div className="col-lg-12 mb-3">
                    <div className="card mt-3 border-0">
                      <div
                        {...getRootProps()}
                        className="card-body d-flex justify-content-between align-items-end p-0"
                      >
                        <div className="form-group mb-0 w-100">
                          <input
                            {...getInputProps({
                              onClick: (event) => event.stopPropagation(),
                            })}
                            type="file"
                            name="file"
                            id="file"
                            className="input-file"
                          />
                          <label
                            htmlFor="file"
                            onClick={(e) => e.preventDefault()}
                            className="rounded-3 text-center bg-white btn-tertiary js-labelFile p-4 w-100 border-dashed"
                          >
                            <i className="large-icon me-3 d-block">
                              <BsFillCloudUploadFill />
                            </i>
                            <span className="js-fileName">
                              Drag and drop or click to replace
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {fileURL && form.type === "Video" ? (
                  <video controls src={fileURL}></video>
                ) : fileURL && form.type === "Image" ? (
                  <img src={fileURL} alt="" />
                ) : null}

                <div className="col-lg-12 mb-3">
                  <label className="mont-font fw-600 font-xsss">Description</label>
                  <textarea
                    onChange={(e) => handleFormFieldChange("description", e)}
                    className="form-control mb-0 p-3 h100 bg-greylight lh-16"
                    rows="5"
                    placeholder="Write your message..."
                    spellCheck="false"
                  ></textarea>
                </div>

                <div className="col-lg-12">
                  {uploadLoader ? (
                    <BtnLoader />
                  ) : (
                    <a
                      onClick={() => _calling_CreatePost()}
                      className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block"
                    >
                      Create
                    </a>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

