"use client";

import NextLink from "next/link";
import { Link as MuiLink, Stack, Typography } from "@mui/material";
import type { RegisterFormValues } from "../../validation/auth/schemas";
import { AuthFormCard } from "./AuthFormCard";
import {
  RegisterForm as RegisterFormFields,
  type RegisterFormProps,
} from "../../forms/auth/RegisterForm";

export type RegisterCardProps = Omit<RegisterFormProps, "submitLabel"> & {
  onSubmit?: (values: RegisterFormValues) => Promise<void> | void;
};

export function RegisterCard(props: RegisterCardProps) {
  return (
    <AuthFormCard
      title="Create an account"
      subtitle="Register to start using the Samuel Oak platform."
    >
      <Stack spacing={2.5}>
        <RegisterFormFields submitLabel="Register" {...props} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already have an account?{" "}
          <MuiLink component={NextLink} href="/login">
            Sign in instead
          </MuiLink>
        </Typography>
      </Stack>
    </AuthFormCard>
  );
}

