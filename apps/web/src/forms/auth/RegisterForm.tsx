"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField } from "@mui/material";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../validation/auth/schemas";

export type RegisterFormProps = {
  onSubmit?: (values: RegisterFormValues) => Promise<void> | void;
  isSubmittingExternally?: boolean;
  submitLabel?: string;
};

export function RegisterForm({
  onSubmit,
  submitLabel = "Register",
  isSubmittingExternally = false,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
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
        autoComplete="new-password"
        placeholder="••••••••"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        {...register("password")}
      />

      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Repeat your password"
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disableElevation
        disabled={pending}
        fullWidth
      >
        {pending ? "Creating account..." : submitLabel}
      </Button>
    </Stack>
  );
}

