import React from "react";
import {
  AiOutlineEdit,
  AiOutlineVideoCameraAdd,
  AiOutlineFileText,
} from "react-icons/ai";
import { HiPhotograph } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";

//INTERNAL IMPRT
import { MainShareLink } from "./index";

const MainCreatePost = ({ setOpenCreatePost }) => {
  return (
    <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
      <div class="card-body p-2">
        <a class="font-xsss fw-800 text-grey-600 card-body p-0 d-flex align-items-center">
          <i class="btn-round-xl font-xl text-primary  me-2 bg-greylight">
            <AiOutlineEdit />
          </i>
          Create Post
        </a>
      </div>
      <div class="card-body p-0 mt-3 position-relative">
        <figure class="avatar position-absolute ms-2 mt-1 top-5">
          <img
            src="images/you.png"
            alt="image"
            class="shadow-sm rounded-circle w30"
          />
        </figure>
        <textarea
          onClick={() => setOpenCreatePost(true)}
          name="message"
          class="h100 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg"
          cols="30"
          rows="10"
          placeholder="Click to create your post"
        ></textarea>
      </div>
      
    </div>
  );
};

export default MainCreatePost;
