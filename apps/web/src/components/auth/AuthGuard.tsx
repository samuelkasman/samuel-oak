"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { trpc } from "../../lib/trpc";

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
  const meQuery = trpc.me.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (meQuery.isError) {
      router.replace(redirectTo);
    }
  }, [meQuery.isError, redirectTo, router]);

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

  if (meQuery.isError) {
    return null;
  }

  return <>{children}</>;
}

