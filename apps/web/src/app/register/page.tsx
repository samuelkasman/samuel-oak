"use client";

import { Alert, Box, Container, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { RegisterCard } from "../../components/auth";
import type { RegisterFormValues } from "../../validation/auth/schemas";
import { trpc } from "../../lib/trpc";

export default function RegisterPage() {
  const router = useRouter();
  const meQuery = trpc.me.useQuery(undefined, {
    staleTime: 60_000,
  });

  const utils = trpc.useUtils();
  const registerMutation = trpc.auth.register.useMutation({
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

  if (meQuery.isSuccess) {
    router.replace("/dashboard");
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

