"use client";

import { useCallback } from "react";
import { Box, Container, Stack } from "@mui/material";
import { RegisterCard } from "../../components/auth";
import type { RegisterFormValues } from "../../validation/auth/schemas";

export default function RegisterPage() {
  const handleRegister = useCallback(async (values: RegisterFormValues) => {
    console.info("Register submission (placeholder):", values);
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
          <RegisterCard onSubmit={handleRegister} />
        </Stack>
      </Container>
    </Box>
  );
}

