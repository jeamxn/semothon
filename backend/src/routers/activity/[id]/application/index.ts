import Elysia from "elysia";

import getActivity from "@back/guards/getActivity";

import list from "./list";
import listQuestion from "./list-question";

const applicationRouter = new Elysia({
  name: "Application Router",
  prefix: "application",
})
  .use(getActivity)
  .use(listQuestion)
  .use(list);

export default applicationRouter; 