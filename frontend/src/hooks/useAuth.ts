import { useMutation, useQuery } from "@tanstack/react-query";

import { ActivityWithPermission, Me } from "@common/types/responses";

import instance from "@front/utils/instance";

const useAuth = () => { 
  const { data: me } = useQuery<Me>({
    queryKey: ["my"],
    queryFn: async () => {
      const res = await instance.get("/auth/me");
      console.log(res.data);
      return res.data;
    },
    initialData: {
      _id: "",
      email: "",
      name: "",
      picture: "",
    },
  });

  const { data: myActivities } = useQuery<ActivityWithPermission[]>({
    queryKey: ["myActivities"],
    queryFn: async () => {
      const res = await instance.get("/activity/my");
      return res.data;
    },
    initialData: [
      {
        _id: "",
        name: "",
        big_type: "center",
        small_type: "",
        headline: "",
        description: "",
        logo_url: "",
        homepage_url: "",
        is_hidden: false,
        my_permission: "member",
        key_color: "",
        video_url: "",
        activity_history: "",
        awards: [],
        images_url: [],
        edit_permission: "member",
        instagram: "",
      }
    ],
  });

  const { mutate: logout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const res = await instance.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      window.location.href = "/auth";
    },
    onError: (error) => {
      console.log(error);
    }
  });


  return {
    me, logout, myActivities
  };
};

export default useAuth;