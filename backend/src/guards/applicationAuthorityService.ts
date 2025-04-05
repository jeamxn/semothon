import { Elysia } from "elysia";

import exit, { errorElysia } from "@back/utils/error";

import getApplication from "./getApplication";
import getUser from "./getUser";

const applicationAuthorityService = () => new Elysia()
  .use(getUser)
  .use(getApplication)
  .guard({
    response: {
      ...errorElysia(["UNAUTHORIZED"])
    }
  })
  .resolve(async ({ application, user, error }) => {
    if (application.userId.toString() !== user._id.toString()) {
      return exit(error, "UNAUTHORIZED");
    }
  })
  .as("plugin");

export default applicationAuthorityService; 