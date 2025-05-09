import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "./routers/profile";
import { publicationsRouter } from "./routers/publications";
import { adminRouter } from "./routers/admin";
import { aboutRouter } from "./routers/about";
import { eventsRouter } from "./routers/events";
import { policyRouter } from "./routers/policy";
import { membershipRouter } from "./routers/memberships";
import { contactRouter } from "./routers/contact";
import { searchRouter } from "./routers/search";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  publications: publicationsRouter,
  admin: adminRouter,
  about: aboutRouter,
  events: eventsRouter,
  policy: policyRouter,
  memberships: membershipRouter,
  contact: contactRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
