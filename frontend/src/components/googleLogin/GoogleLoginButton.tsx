"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import React from "react";

import instance from "@front/utils/instance";

const GoogleLoginButton = () => {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (res) => {
      const { data } = await instance.post("/auth/login", {
        token: res.access_token,
      });
      if (data.success) {
        router.replace("/");
      } else {
        alert("로그인에 실패했습니다.");
      }
    },
    hosted_domain: "khu.ac.kr",
    flow: "implicit",
  });

  return (
    <button 
      className="w-full bg-background py-4 px-5 border border-text/5 rounded flex flex-row items-center justify-center gap-2 select-none cursor-pointer drag_none"
      onClick={() => login()}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
        <path d="M18.8334 10.193C18.8334 9.4938 18.7766 8.98359 18.6539 8.4545H10.6701V11.6102H15.3564C15.2619 12.3944 14.7517 13.5754 13.6179 14.369L13.602 14.4747L16.1263 16.4302L16.3012 16.4477C17.9074 14.9643 18.8334 12.7818 18.8334 10.193Z" fill="#4285F4"></path>
        <path d="M10.6701 18.5069C12.9659 18.5069 14.8934 17.751 16.3012 16.4472L13.6179 14.3685C12.8998 14.8693 11.9361 15.2189 10.6701 15.2189C8.4214 15.2189 6.51287 13.7355 5.83254 11.6853L5.73281 11.6937L3.108 13.7251L3.07367 13.8205C4.47199 16.5983 7.34426 18.5069 10.6701 18.5069Z" fill="#34A853"></path>
        <path d="M5.83256 11.6851C5.65305 11.156 5.54916 10.5891 5.54916 10.0033C5.54916 9.41752 5.65305 8.85065 5.82312 8.32156L5.81836 8.20887L3.16065 6.14487L3.07369 6.18623C2.49738 7.33893 2.16669 8.63336 2.16669 10.0033C2.16669 11.3733 2.49738 12.6677 3.07369 13.8204L5.83256 11.6851Z" fill="#FBBC05"></path>
        <path d="M10.6701 4.78796C12.2668 4.78796 13.3439 5.47768 13.958 6.05406L16.3579 3.71088C14.884 2.3409 12.9659 1.5 10.6701 1.5C7.34426 1.5 4.47199 3.40853 3.07367 6.18628L5.82309 8.32161C6.51287 6.27135 8.4214 4.78796 10.6701 4.78796Z" fill="#EB4335"></path>
      </svg>
      <p className="text-sm font-medium drag_none">학교 구글 계정으로 로그인</p>
    </button>
  );
};

export default GoogleLoginButton;
