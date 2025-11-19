"use client";

import { useCallback } from "react";
import { Box, Container, Stack } from "@mui/material";
import { LoginCard } from "../../components/auth";
import type { LoginFormValues } from "../../validation/auth/schemas";

export default function LoginPage() {
  const handleLogin = useCallback(async (values: LoginFormValues) => {
    console.info("Login submission (placeholder):", values);
  }, []);

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
        <Stack spacing={4}>
          <LoginCard onSubmit={handleLogin} />
        </Stack>
      </Container>
    </Box>
  );
}

