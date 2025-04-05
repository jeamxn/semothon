"use client";

import Link from "next/link";
import React from "react";

import Icons from "@front/components/icons";
import useAuth from "@front/hooks/useAuth";

import EditModal from "./editModal";

const My = () => {
  const { me } = useAuth();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <div className="px-4 flex flex-row gap-3 items-center">
        <Link href="/main" prefetch>
          <Icons.Back
            size={24}
            className="fill-dark"
          />
        </Link>
        <p className="text-2xl font-bold">마이페이지</p>
      </div>

      <div className="flex flex-row gap-4 px-4 items-center">
        <img src={me.picture} alt="club" className="object-cover rounded-full bg-white w-24 h-24" />
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-2 items-center">
            <p className="text-drak text-2xl font-bold">{me.name}</p>
            <button className="cursor-pointer" onClick={() => setOpen(true)}>
              <Icons.Settings
                size={24}
                className="fill-dark/20"
              />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-dark/50">{me.email}</p>
            <p className="text-sm text-dark/50">건축학과 25학번</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <p className="text-2xl font-bold px-4">소속 동아리</p>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-row gap-4 overflow-x-auto snap scrollbar-hide px-4">
            {
              Array(20).fill(0).map((_, index) => (
                <div key={index}>
                  <div className="flex flex-col gap-2 w-48 snap-item">
                    <img src="/images/club.png" alt="club" className="w-full aspect-video object-cover rounded-2xl bg-white" />
                    <div className="flex flex-row justify-between items-start w-full">
                      <div className="flex flex-col gap-0">
                        <p className="font-bold">세틀러</p>
                        <p className="text-dark/35">벤드 동아리</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-4 px-4 mt-12">
        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl font-bold">내 활동</p>
        </div>
        <div className="flex flex-col gap-4">
          {
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-4 items-center">
                  <img src="/images/club.png" alt="club" className="h-16 aspect-video object-cover rounded-2xl bg-white" />
                  <div className="flex flex-col gap-0">
                    <p className="font-bold">세틀러</p>
                    <p className="text-dark/35">벤드 동아리</p>
                  </div>
                </div>
                <div className="bg-white rounded-full px-4 py-1.5 flex flex-row gap-2 items-center">
                  <p className="text-key text-base font-bold">합격</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <EditModal open={open} setOpen={setOpen} />
      
    </div>
  );
};

export default My;