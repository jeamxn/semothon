
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import { Activity } from "@common/types/responses";

import Icons from "@front/components/icons";
import instance from "@front/utils/instance";

import BackButton from "../backButton";
import ModalButton from "../modalButton";
import SetColor from "../setColor";

const Club = async ({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    type: string;
  }>;
  }) => {
  try {
    const { id } = await params;
    const { type } = await searchParams;

    const { data: info } = await instance.get<Activity>(`/activity/${id}`);

    return (
      <div className="w-full py-4 flex flex-col gap-4">
        <div className="px-4 flex flex-row gap-3 items-center">
          <BackButton>
            <Icons.Back
              size={24}
              className="fill-dark"
            />
          </BackButton>
          <p className="text-2xl font-bold">{type === "update" ? "업데이트 된 동아리" : "모집 중인 동아리"}</p>
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

        <p className="text-2xl font-bold text-dark px-4 mt-4">동아리 소개</p>

        {
          info.images_url && info.images_url?.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex flex-row gap-4 overflow-x-auto snap scrollbar-hide px-4">
                {
                  info.images_url.map((image, index) => (
                    <div key={index}>
                      <div className="flex flex-col gap-2 w-56 snap-item">
                        <img
                          src={image}
                          alt="동아리 이미지"
                          className="w-56 aspect-video object-cover rounded-2xl bg-white"
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ) : null
        }

        <div className="w-full px-4">
          <div className="bg-white w-full p-4 rounded-2xl flex flex-col gap-2">
            <p className="text-xl text-dark font-bold">{info.headline}</p>
            <p className="text-dark/50">{info.description}</p>
          </div>
        </div>

        {
          info.activity_history ? (
            <div className="w-full px-4">
              <div className="bg-white w-full p-4 rounded-2xl flex flex-col gap-2">
                <p className="text-xl text-dark font-bold">활동 계획</p>
                <p className="text-dark/50">{info.activity_history}</p>
              </div>
            </div>
          ) : null
        }

        {
          info.video_url ? (
            <div className="w-full px-4">
              <iframe
                src={`https://www.youtube.com/embed/${info.video_url}`}
                className="border-0 rounded-2xl w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : null
        }

        {
          info.awards && info.awards.length > 0 ? (
            <div className="w-full px-4">
              <div className="bg-white w-full p-4 rounded-2xl flex flex-col gap-2">
                <p className="text-xl text-dark font-bold">수상 내역</p>
                {
                  info.awards?.map((award, index) => (
                    <div key={index} className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-2">
                        <p className="font-bold">{award.type}</p>
                        <p className="text-dark/50">{award.name}</p>
                      </div>
                      <p className="text-dark/30">{award.date}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          ) : null
        }

        <div className="w-full px-4">
          <div className="bg-white w-full p-4 rounded-2xl flex flex-col gap-2">
            <p className="text-xl text-dark font-bold">우리는 다음과 같이 선발해요.</p>
            <p className="text-dark/50">...</p>
          </div>
        </div>
        
        <SetColor color={info.key_color} />

        {
          type === "update" ? null : (
            <>
              <div className="w-full h-12" />
              <ModalButton info={info} />
            </>
          )
        }
      </div>
    );
  }
  catch {
    return redirect("/main");
  }
};

export default Club;