import { useQuery } from "@tanstack/react-query";

import { Activity } from "@common/types/responses";

import instance from "@front/utils/instance";

const useRecentUpdated = () => { 

  const { data: recent_updated } = useQuery<Activity[]>({
    queryKey: ["recent_updated"],
    queryFn: async () => {
      const res = await instance.get("/activity/recent_updated");
      return res.data;
    },
    initialData: [],
  });
  

  return {
    recent_updated,
  };
};

export default useRecentUpdated;