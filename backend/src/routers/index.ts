import Elysia from "elysia";

import ActivityRouter from "./activity";
import AuthRouter from "./auth";

const IndexRouter = new Elysia({
  name: "Index",
  prefix: "",
})
  .use(AuthRouter)
  .use(ActivityRouter);

export default IndexRouter;
