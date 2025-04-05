"use client";

import Link from "next/link";
import React from "react";

import Icons from "@front/components/icons";
import useRecentUpdated from "@front/hooks/useRecentUpdated";

const Recruiting = () => {
  const { recent_updated } = useRecentUpdated();

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-4">
      <div className=" flex flex-row gap-3 items-center">
        <Link href="/main" prefetch>
          <Icons.Back
            size={24}
            className="fill-dark"
          />
        </Link>
        <p className="text-2xl font-bold">업데이트 된 동아리</p>
      </div>

      {
        recent_updated.slice(0, 3).map((activity, index) => (
          <Link href={`/activity/${activity._id}/outside`} key={index} className="flex flex-row gap-4 items-center">
            <img src={activity.logo_url} alt="club" className="h-16 aspect-video object-cover rounded-2xl bg-white" />
            <div className="flex flex-col gap-0">
              <p className="font-bold">{activity.name}</p>
              <p className="text-dark/35">{activity.small_type}</p>
            </div>
          </Link>
        ))
      }


    </div>
  );
};

export default Recruiting;