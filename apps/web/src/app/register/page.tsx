"use client";

import { useEffect } from "react";
import { Alert, Box, Container, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { RegisterCard } from "../../components/auth";
import type { RegisterFormValues } from "../../validation/auth/schemas";
import { trpcClient } from "../../lib/trpc-client";

export default function RegisterPage() {
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
  const registerMutation = trpcClient.auth.register.useMutation({
    onSuccess: async () => {
      await utils.me.invalidate();
      router.push("/dashboard");
    },
  });

  const handleSubmit = async ({ email, password }: RegisterFormValues) => {
    await registerMutation.mutateAsync({ email, password });
  };

  const errorMessage =
    registerMutation.error?.message ??
    (registerMutation.isError
      ? "Unable to create account. Please try again."
      : null);

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
          <RegisterCard
            onSubmit={handleSubmit}
            isSubmittingExternally={registerMutation.isPending}
          />
        </Stack>
      </Container>
    </Box>
  );
}

