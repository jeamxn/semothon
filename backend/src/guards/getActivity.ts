import Elysia, { t } from "elysia";

import ActivityModel, { IActivity } from "@back/models/activity";
import exit, { errorElysia } from "@back/utils/error";

const getActivity = new Elysia()
  .use(ActivityModel)
  .guard({
    params: t.Object({
      activity_id: t.String({
        description: "활동(동아리) ID",
      }),
    }),
    response: {
      ...errorElysia(["NO_ACTIVITY_ID", "NO_ACTIVITY", "INVALID_ID_TYPE"]),
    }
  })
  .resolve(async ({ activityModel, params, error }): Promise<{
    activity: IActivity;
  }> => {
    try {
      const { activity_id } = params;
      if (!activity_id) {
        return exit(error, "NO_ACTIVITY_ID");
      }
      const activitySearch = await activityModel.db.findById(activity_id);
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
