import { Elysia } from "elysia";

import JoinedActivityModel, { permissionList, PermissionType } from "@back/models/joined_activity";
import exit, { errorElysia } from "@back/utils/error";

import getActivity from "./getActivity";
import getUser from "./getUser";

const activityAuthorityService = (level?: PermissionType) => new Elysia()
  .use(getUser)
  .use(getActivity)
  .use(JoinedActivityModel)
  .guard({
    response: {
      ...errorElysia(["UNAUTHORIZED"])
    }
  })
  .resolve(async ({ activity, user, joinedActivityModel, error }) => {
    const user_id = user._id;
    const activity_id = activity._id;
    const local_level = level ?? activity.edit_permission;
    if (!local_level) return exit(error, "UNAUTHORIZED");
    const premissions = permissionList.slice(
      0,
      permissionList.indexOf(local_level) + 1
    );
    const joined_activity = await joinedActivityModel.db.find({
      activity_id,
      user_id,
      permission: {
        $in: premissions,
      }
    });
    if (!joined_activity || joined_activity.length < 1) return exit(error, "UNAUTHORIZED");
  })
  .as("plugin");

export default activityAuthorityService;
