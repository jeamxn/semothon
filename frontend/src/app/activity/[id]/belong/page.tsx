
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import { Activity, BoardInfo } from "@common/types/responses";

import Icons from "@front/components/icons";
import instance from "@front/utils/instance";

import BackButton from "../backButton";

const Club = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
  }) => {
  try {
    const { id } = await params;
    const { data: info } = await instance.get<Activity>(`/activity/${id}`);
    const { data: boardInfo } = await instance.get<BoardInfo[]>(`/board/list/activity/${id}`);

    return (
      <div className="w-full py-4 flex flex-col gap-4">
        <div className="px-4 flex flex-row gap-3 items-center">
          <BackButton>
            <Icons.Back
              size={24}
              className="fill-dark"
            />
          </BackButton>
          <p className="text-2xl font-bold">내 소속 동아리</p>
        </div>

        <div className="px-4 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-start gap-5">
            <img
              src={info.logo_url}
              alt="동아리 로고"
              className="w-24 h-24 object-cover rounded-full bg-white"
            />
            <div className="flex flex-col gap-1">
              <p className="font-bold text-2xl text-dark">{info.name}</p>
              <p className="font-bold text-dark/40">{info.small_type}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 justify-center items-end">
            {
              info.homepage_url ? (
                <Link
                  href={info.homepage_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-dark/40 font-bold underline">홈페이지</p>
                </Link>
              ) : null
            }
            {
              info.instagram ? (
                <Link
                  href={`https://instagram.com/${info.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-dark/40 font-bold underline">인스타그램</p>
                </Link>
              ) : null
            }
          </div>
        </div>

        
        {
          boardInfo.map((board) => (
            <React.Fragment key={board._id}>
              <div className="flex flex-row items-center justify-between px-4">
                <p className="text-2xl font-bold text-dark mt-4">{board.name}</p>
                <p className="text-dark/40 font-bold underline cursor-pointer">전체보기</p>
              </div>
            </React.Fragment>
          ))
        }
        

      </div>
    );
  }
  catch {
    return redirect("/main");
  }
};

export default Club;