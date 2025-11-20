"use client";

import { useMemo, type FormEventHandler } from "react";
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
    formState: { isSubmitting, touchedFields },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const values = watch();
  const validationResult = useMemo(() => loginSchema.safeParse(values), [values]);
  const fieldErrors = useMemo(
    () => (validationResult.success ? {} : validationResult.error.flatten().fieldErrors),
    [validationResult]
  );

  const emailErrors =
    touchedFields.email && fieldErrors.email?.length ? fieldErrors.email : undefined;
  const passwordErrors =
    touchedFields.password && fieldErrors.password?.length ? fieldErrors.password : undefined;

  const pending = isSubmitting || isSubmittingExternally;
  const isSubmitDisabled = pending || !validationResult.success;

  const handleValidSubmit = handleSubmit(
    async (formValues) => {
      await onSubmit?.(formValues);
    },
    () => undefined
  );

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    await handleValidSubmit(event);
  };

  return (
    <Stack
      component="form"
      spacing={2.5}
      onSubmit={handleFormSubmit}
      noValidate
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={Boolean(emailErrors)}
        helperText={emailErrors?.join(" ") ?? " "}
        {...register("email")}
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={Boolean(passwordErrors)}
        helperText={passwordErrors?.join(" ") ?? " "}
        {...register("password")}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disableElevation
        disabled={isSubmitDisabled}
        fullWidth
      >
        {pending ? "Signing in..." : submitLabel}
      </Button>
    </Stack>
  );
}

