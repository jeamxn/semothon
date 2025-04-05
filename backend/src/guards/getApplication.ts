import Elysia, { t } from "elysia";

import { IActivity } from "@back/models/activity";
import ApplicationModel from "@back/models/application";
import exit, { errorElysia } from "@back/utils/error";

const getApplication = new Elysia()
  .use(ApplicationModel)
  .guard({
    params: t.Object({
      application_id: t.String({
        description: "지원서 ID",
      }),
    }),
    response: {
      ...errorElysia(["NO_APPLICATION_ID", "NO_APPLICATION", "INVALID_ID_TYPE"]),
    }
  })
  .resolve(async ({ applicationModel, params, error }): Promise<{
    application: any;
  }> => {
    try {
      const { application_id } = params;
      if (!application_id) {
        return exit(error, "NO_APPLICATION_ID");
      }
      const application = await applicationModel.db.findById(application_id)
        .populate<{ activityId: IActivity }>("activityId");
      if (!application) {
        return exit(error, "NO_APPLICATION");
      }
      return {
        application: application.toObject(),
      };
    }
    catch {
      return exit(error, "INVALID_ID_TYPE");
    }
  })
  .as("plugin");

export default getApplication;