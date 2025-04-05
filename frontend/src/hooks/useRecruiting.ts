import { useQuery } from "@tanstack/react-query";

import { Activity } from "@common/types/responses";

import instance from "@front/utils/instance";

const useRecruiting = () => { 

  const { data: recruiting } = useQuery<Activity[]>({
    queryKey: ["recruiting"],
    queryFn: async () => {
      const res = await instance.get("/activity/list-recruiting");
      return res.data.data;
    },
    initialData: [],
  });
  

  return {
    recruiting,
  };
};

export default useRecruiting;