import { Elysia } from "elysia";

import ActivityModel from "@back/models/activity";
import JoinedActivityModel, { permissionList } from "@back/models/joined_activity";
import TimetableModel from "@back/models/timetable";
import exit, { errorElysia } from "@back/utils/error";

import getEvent from "./getEvent";
import getUser from "./getUser";

const eventAuthorityService = () =>
  new Elysia()
    .use(getUser)
    .use(getEvent)
    .use(ActivityModel)
    .use(JoinedActivityModel)
    .use(TimetableModel)
    .guard({
      response: {
        ...errorElysia(["UNAUTHORIZED"])
      }
    })
    .resolve(async ({
      event,
      user,
      activityModel,
      joinedActivityModel,
      timetableModel,
      error
    }) => {
      const userId = user._id.toString();

      const timetable = await timetableModel.db.findById(event.timetable_id);
      if (!timetable) return exit(error, "UNAUTHORIZED");

      const ownerType = timetable.owner_type;
      const ownerId = timetable.owner?.toString();

      if ((ownerType === "user" || ownerType === "global") && ownerId === userId) {
        return;
      }

      if (ownerType === "activity") {
        const activity = await activityModel.db.findById(ownerId);
        if (!activity) return exit(error, "UNAUTHORIZED");

        const permissionIndex = permissionList.indexOf("vice_president");
        const allowedPermissions = permissionList.slice(0, permissionIndex + 1);

        const joined = await joinedActivityModel.db.findOne({
          activity_id: ownerId,
          user_id: userId,
          permission: { $in: allowedPermissions },
        });

        if (!joined) return exit(error, "UNAUTHORIZED");
        return;
      }

      return exit(error, "UNAUTHORIZED");
    })
    .as("plugin");

export default eventAuthorityService;