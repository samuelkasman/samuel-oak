"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField } from "@mui/material";
import {
  loginSchema,
  type LoginFormValues,
} from "../../validation/auth/schemas";

export type LoginFormProps = {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  isSubmittingExternally?: boolean;
  submitLabel?: string;
};

export function LoginForm({
  onSubmit,
  submitLabel = "Login",
  isSubmittingExternally = false,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const pending = isSubmitting || isSubmittingExternally;

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit?.(values);
  });

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={handleValidSubmit}
      noValidate
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        {...register("email")}
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disableElevation
        disabled={pending}
        fullWidth
      >
        {pending ? "Signing in..." : submitLabel}
      </Button>
    </Stack>
  );
}

