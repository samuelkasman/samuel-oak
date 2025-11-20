import "server-only";

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import type { AppRouter } from "../../../api/src/routers";
import { webEnv } from "./env";

async function forwardHeaders() {
  try {
    const [cookieStore, incomingHeaders] = await Promise.all([getCookies(), getHeaders()]);

    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const headers: Record<string, string> = {};

    if (cookieHeader) {
      headers.cookie = cookieHeader;
    }

    const authorization = incomingHeaders.get("authorization");
    if (authorization) {
      headers.authorization = authorization;
    }

    return headers;
  } catch {
    return {};
  }
}

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${webEnv.apiBaseUrl}/trpc`,
      headers: forwardHeaders,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});