"use client";

import NextLink from "next/link";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.background.default,
        py: { xs: 8, md: 12 },
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} textAlign="center">
          <Stack spacing={2}>
            <Typography variant="overline" color="secondary.main">
              Welcome to Samuel Oak
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A fullstack turborepo showcase featuring an Express + tRPC backend and a
              Next.js frontend with React Query, Zod, and Material UI.
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={NextLink}
              href="/login"
              variant="contained"
              size="large"
              disableElevation
            >
              Sign in
            </Button>
            <Button
              component={NextLink}
              href="/register"
              variant="outlined"
              size="large"
            >
              Create an account
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
