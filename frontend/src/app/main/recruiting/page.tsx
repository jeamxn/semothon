"use client";

import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

import Icons from "@front/components/icons";
import useRecruiting from "@front/hooks/useRecruiting";

const Recruiting = () => {
  const { recruiting } = useRecruiting();

  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <div className="px-4 flex flex-row gap-3 items-center">
        <Link href="/main" prefetch>
          <Icons.Back
            size={24}
            className="fill-dark"
          />
        </Link>
        <p className="text-2xl font-bold">모집 중인 동아리</p>
      </div>

      <div className="w-full flex flex-row flex-wrap gap-4 items-center justify-center">
        {
          recruiting.map((activity, index) => (
            <Link href={`/activity/${activity._id}/outside`} className="cursor-pointer w-[calc(50%-20px)]" key={index}>
              <div className="flex flex-col gap-2 w-full snap-item">
                <img src={activity.logo_url} alt="club" className="w-full aspect-video object-cover rounded-2xl bg-white" />
                <div className="flex flex-row items-start justify-between w-full">
                  <div className="flex flex-col gap-0">
                    <p className="font-bold">{activity.name}</p>
                    <p className="text-dark/35">{activity.small_type}</p>
                  </div>
                  <p className="text-key text-sm font-bold">마감 {
                    dayjs(activity.document_screening_period?.end).diff(dayjs(), "day") > 0 ? dayjs(activity.document_screening_period?.end).diff(dayjs(), "day") : 0
                  }일 전</p>
                </div>
              </div>
            </Link>
          ))
        }
      </div>


    </div>
  );
};

export default Recruiting;