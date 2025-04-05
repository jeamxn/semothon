import Elysia from "elysia";

import list from "./list";

const BoardRouter = new Elysia({
  name: "board router",
  prefix: "board",
})
  .use(list);

export default BoardRouter;
