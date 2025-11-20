"use client";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { type ReactNode } from "react";
import { trpc } from "../../lib/trpc";
import { useLogout } from "../../hooks/useLogout";

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

export function DashboardLayout({
  children,
  title = "Dashboard",
}: DashboardLayoutProps) {
  const meQuery = trpc.me.useQuery(undefined, { staleTime: 60_000 });
  const { logout, isLoading: isLoggingOut } = useLogout();

  const userInitial =
    meQuery.data?.email?.charAt(0)?.toUpperCase() ?? meQuery.data?.email ?? "?";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: (theme) => theme.palette.background.default }}>
      <AppBar position="fixed" color="inherit" elevation={1}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title={meQuery.data?.email ?? "Signed in user"}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {userInitial}
              </Avatar>
            </Tooltip>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={logout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {children}
      </Container>
    </Box>
  );
}

