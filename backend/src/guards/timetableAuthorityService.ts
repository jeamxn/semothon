import { Elysia } from "elysia";

import ActivityModel from "@back/models/activity";
import JoinedActivityModel, { permissionList } from "@back/models/joined_activity";
import TimetableModel from "@back/models/timetable";
import exit, { errorElysia } from "@back/utils/error";

import getUser from "./getUser";

const timetableAuthorityService = () =>
  new Elysia()
    .use(getUser)
    .use(ActivityModel)
    .use(JoinedActivityModel)
    .use(TimetableModel)
    .guard({
      response: {
        ...errorElysia(["UNAUTHORIZED"]),
      },
    })
    .resolve(async ({ user, error, body, query, params, timetableModel, activityModel, joinedActivityModel }) => {
      type RequestInput = { timetable_id?: string };

      const timetableId =
        (body as RequestInput)?.timetable_id ??
        (query as RequestInput)?.timetable_id ??
        (params as RequestInput)?.timetable_id;


      if (!timetableId) return exit(error, "UNAUTHORIZED");

      const timetable = await timetableModel.db.findById(timetableId);
      if (!timetable) return exit(error, "UNAUTHORIZED");

      const ownerType = timetable.owner_type;
      const ownerId = timetable.owner?.toString();
      const userId = user._id.toString();

      if ((ownerType === "user" || ownerType === "global") && ownerId === userId) {
        return;
      }

      if (ownerType === "activity") {
        const activity = await activityModel.db.findById(timetable.owner);
        if (!activity) return exit(error, "UNAUTHORIZED");

        const permissionIndex = permissionList.indexOf("vice_president");
        const allowedPermissions = permissionList.slice(0, permissionIndex + 1);

        const joined = await joinedActivityModel.db.findOne({
          activity_id: timetable.owner,
          user_id: user._id,
          permission: { $in: allowedPermissions },
        });

        if (!joined) return exit(error, "UNAUTHORIZED");
        return;
      }

      return exit(error, "UNAUTHORIZED");
    })
    .as("plugin");

export default timetableAuthorityService;