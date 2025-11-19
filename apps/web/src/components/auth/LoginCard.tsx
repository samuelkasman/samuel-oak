"use client";

import NextLink from "next/link";
import { Link as MuiLink, Stack, Typography } from "@mui/material";
import type { LoginFormValues } from "../../validation/auth/schemas";
import { AuthFormCard } from "./AuthFormCard";
import {
  LoginForm as LoginFormFields,
  type LoginFormProps,
} from "../../forms/auth/LoginForm";

export type LoginCardProps = Omit<LoginFormProps, "submitLabel"> & {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
};

export function LoginCard(props: LoginCardProps) {
  return (
    <AuthFormCard
      title="Sign in"
      subtitle="Welcome back. Enter your credentials to continue."
    >
      <Stack spacing={2.5}>
        <LoginFormFields submitLabel="Login" {...props} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Don&apos;t have an account?{" "}
          <MuiLink component={NextLink} href="/register">
            Create one
          </MuiLink>
        </Typography>
      </Stack>
    </AuthFormCard>
  );
}

