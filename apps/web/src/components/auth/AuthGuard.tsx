"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { trpcClient } from "../../lib/trpc-client";

type AuthGuardProps = {
  children: ReactNode;
  redirectTo?: string;
  loadingMessage?: string;
};

export function AuthGuard({
  children,
  redirectTo = "/login",
  loadingMessage = "Checking your session…",
}: AuthGuardProps) {
  const router = useRouter();
  const meQuery = trpcClient.me.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });

  const isUnauthenticated = meQuery.status === "success" && !meQuery.data;

  useEffect(() => {
    if (isUnauthenticated) {
      router.replace(redirectTo);
    }
  }, [isUnauthenticated, redirectTo, router]);

  if (meQuery.isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        spacing={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {loadingMessage}
        </Typography>
      </Stack>
    );
  }

  if (isUnauthenticated) {
    return null;
  }

  if (meQuery.isError) {
    return null;
  }

  return <>{children}</>;
}

