"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../lib/trpc";

export function useLogout(redirectTo: string = "/login") {
  const router = useRouter();
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await Promise.all([
        queryClient.clear(),
        utils.me.invalidate(),
        utils.getUsers.invalidate().catch(() => undefined),
      ]);
      router.push(redirectTo);
    },
  });

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return {
    logout,
    isLoading: logoutMutation.isPending,
    error: logoutMutation.error,
  };
}

