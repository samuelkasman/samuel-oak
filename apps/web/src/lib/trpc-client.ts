import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../api/src/routers";

export const trpcClient = createTRPCReact<AppRouter>();


