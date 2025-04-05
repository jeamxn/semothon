import Elysia from "elysia";

import applicationIdRouter from "./[id]";
import list from "./list";

const application = new Elysia({
  name: "Application Router",
  prefix: "application",
})
  .use(list)
  .use(applicationIdRouter);

export default application; 