import Elysia from "elysia";

import ActivityModel from "@back/models/activity";
import exit from "@back/utils/error";

const getActivity = new Elysia()
  .use(ActivityModel)
  .resolve(async ({ activityModel, params, error }) => {
    try {
      const { id } = params as { id: string };
      if (!id) {
        return exit(error, "NO_ACTIVITY_ID");
      }
      const activitySearch = await activityModel.db.findById(id);
      if (!activitySearch) {
        return exit(error, "NO_ACTIVITY");
      }
      return {
        activity: activitySearch.toObject(),
      };
    }
    catch {
      return exit(error, "INVALID_ID_TYPE");
    }
  })
  .as("plugin");

export default getActivity;
