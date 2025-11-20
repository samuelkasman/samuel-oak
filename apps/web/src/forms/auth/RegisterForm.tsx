"use client";

import { useMemo, type FormEventHandler } from "react";
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
    formState: { isSubmitting, touchedFields },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const values = watch();
  const validationResult = useMemo(() => registerSchema.safeParse(values), [values]);
  const fieldErrors = useMemo(
    () => (validationResult.success ? {} : validationResult.error.flatten().fieldErrors),
    [validationResult]
  );

  const emailErrors =
    touchedFields.email && fieldErrors.email?.length ? fieldErrors.email : undefined;
  const passwordErrors =
    touchedFields.password && fieldErrors.password?.length ? fieldErrors.password : undefined;
  const confirmErrors =
    touchedFields.confirmPassword && fieldErrors.confirmPassword?.length
      ? fieldErrors.confirmPassword
      : undefined;

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
        autoComplete="new-password"
        placeholder="••••••••"
        error={Boolean(passwordErrors)}
        helperText={passwordErrors?.join(" ") ?? " "}
        {...register("password")}
      />

      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Repeat your password"
        error={Boolean(confirmErrors)}
        helperText={confirmErrors?.join(" ") ?? " "}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disableElevation
        disabled={isSubmitDisabled}
        fullWidth
      >
        {pending ? "Creating account..." : submitLabel}
      </Button>
    </Stack>
  );
}

