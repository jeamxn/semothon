"use client";

import Link from "next/link";
import React from "react";

import Icons from "@front/components/icons";
import useAuth from "@front/hooks/useAuth";

const Home = () => {
  const { me, myActivities } = useAuth();
  const [activityI, setActivityI] = React.useState(0);

  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <div className="w-full flex justify-between items-center px-4">
        <p className="logo_font text-2xl text-key">Khulub</p>
        <Icons.Notification
          size={24}
          className="fill-dark/20"
        />
      </div>

      <div className="flex flex-col gap-4 px-4">
        <p className="text-2xl font-bold">내 소속 동아리</p>
        <div className="relative px-4 py-6 bg-key rounded-2xl flex flex-row gap-4 items-center justify-start">
          <img src={myActivities[activityI].logo_url} alt="club" className="w-16 h-16 object-cover rounded-full bg-white" />
          <Link href={`/activity/${myActivities[activityI]["_id"]}/belong`} prefetch>
            <div className="flex flex-col gap-1">
              <p className="text-white text-2xl font-bold">{myActivities[activityI].name}</p>
              <div className="flex flex-row gap-1 items-center">
                <p className="text-white/60 text-base font-bold whitespace-nowrap">
                  {
                    myActivities[activityI].my_permission === "president" ? "회장" : myActivities[activityI].my_permission === "vice_president" ? "부회장" : myActivities[activityI].my_permission === "member" ? "부원" : "비회원"
                  }
                </p>
                <p className="text-white text-base font-bold">{me.name}</p>
              </div>
            </div>
          </Link>
          <div className=" absolute right-4 top-4">
            <Link href="/my" prefetch>
              <p className="text-white/60 font-bold underline cursor-pointer">마이페이지</p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-key/70 font-bold text-sm">동아리 전환</p>
          <div className="flex flex-row gap-2 items-center justify-start">
            {
              myActivities.map((activity, index) => (
                <button
                  key={index}
                  className={`cursor-pointer w-10 h-10 rounded-full bg-white ${activityI === index ? "border-2 border-key" : ""}`}
                  onClick={() => setActivityI(index)}
                >
                  <img src={activity.logo_url} alt="club" className="w-full h-full object-cover rounded-full" />
                </button>
              ))
            }
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-row justify-between items-center px-4">
          <p className="text-2xl font-bold">모집 중인 동아리</p>
          <p className="text-base font-bold text-dark/50 underline">전체보기</p>
        </div>

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
                      <div>
                        <p className="text-key text-sm font-bold">마감 3일 전</p>
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
          <p className="text-2xl font-bold">업데이트 된 동아리</p>
          <p className="text-base font-bold text-dark/50 underline">전체보기</p>
        </div>
        <div className="flex flex-col gap-4">
          {
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex flex-row gap-4 items-center">
                <img src="/images/club.png" alt="club" className="h-16 aspect-video object-cover rounded-2xl bg-white" />
                <div className="flex flex-col gap-0">
                  <p className="font-bold">세틀러</p>
                  <p className="text-dark/35">벤드 동아리</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      


    </div>
  );
};

export default Home;  