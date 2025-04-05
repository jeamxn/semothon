import { useMutation, useQuery } from "@tanstack/react-query";

import { Me } from "@common/types/responses";

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
    me, logout
  };
};

export default useAuth;