"use client";

import { useEffect } from "react";
import { Alert, Box, Container, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { LoginCard } from "../../components/auth";
import type { LoginFormValues } from "../../validation/auth/schemas";
import { trpcClient } from "../../lib/trpc-client";

export default function LoginPage() {
  const router = useRouter();
  const meQuery = trpcClient.me.useQuery(undefined, {
    staleTime: 60_000,
  });

  useEffect(() => {
    if (meQuery.data) {
      router.replace("/dashboard");
    }
  }, [meQuery.data, router]);

  const utils = trpcClient.useUtils();
  const loginMutation = trpcClient.auth.login.useMutation({
    onSuccess: async () => {
      await utils.me.invalidate();
      router.push("/dashboard");
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    await loginMutation.mutateAsync(values);
  };

  const errorMessage =
    loginMutation.error?.message ??
    (loginMutation.isError ? "Unable to sign in. Please try again." : null);

  if (meQuery.data) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default,
        py: { xs: 6, md: 10 },
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <LoginCard
            onSubmit={handleSubmit}
            isSubmittingExternally={loginMutation.isPending}
          />
        </Stack>
      </Container>
    </Box>
  );
}

