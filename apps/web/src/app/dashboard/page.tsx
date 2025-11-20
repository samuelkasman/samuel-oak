"use client";

import { Grid2 as Grid, Paper, Stack, Typography } from "@mui/material";
import { AuthGuard } from "../../components/auth";
import { DashboardLayout } from "../../components/layouts";
import { trpc } from "../../lib/trpc";

export default function DashboardPage() {
  const helloQuery = trpc.hello.useQuery({ name: "from dashboard" });
  const greetingMessage = helloQuery.isLoading
    ? "Contacting tRPC API…"
    : helloQuery.error
      ? `tRPC error: ${helloQuery.error.message}`
      : helloQuery.data?.message ?? "Connected to tRPC backend";

  return (
    <AuthGuard loadingMessage="Verifying your session…">
      <DashboardLayout title="Dashboard">
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h4" component="h1" fontWeight={700}>
              Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This is your secure workspace.
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  px: { xs: 3, md: 4 },
                  py: 3,
                  height: "100%",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  tRPC status
                </Typography>
                <Typography
                  variant="body1"
                  fontFamily="var(--font-geist-mono)"
                  color={helloQuery.error ? "error.main" : "text.primary"}
                >
                  {greetingMessage}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </DashboardLayout>
    </AuthGuard>
  );
}

