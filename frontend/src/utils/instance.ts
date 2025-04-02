import { treaty } from "@elysiajs/eden";

import type { App } from "@back/index";

const instance = treaty<App>(process.env.NEXT_PUBLIC_API_URL ?? "", {
  fetcher: (url, options) => fetch(url, {
    ...options,
    credentials: "include",
  }),
});

export default instance;
