"use client";

import React from "react";

import { Activity } from "@common/types/responses";

import SubmitModal from "./submitModal";

const ModalButton = ({
  info
}: {
  info: Activity;
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-full max-w-2xl px-4 absolute bottom-4">
      <SubmitModal open={open} setOpen={setOpen} info={info} />
      <button
        className="bg-dark flex flex-col items-center justify-center w-full px-4 py-3 rounded-full shadow-2xl shadow-dark"
        onClick={() => setOpen(true)}
      >
        <p className="text-white font-bold">지원하기 D-</p>
      </button>
    </div>
  );
};

export default ModalButton;