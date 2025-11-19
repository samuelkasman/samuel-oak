"use client";

import { Card, CardContent, CardHeader, type CardProps } from "@mui/material";
import type { ReactNode } from "react";

type AuthFormCardProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
} & CardProps;

export function AuthFormCard({
  title,
  subtitle,
  action,
  children,
  ...cardProps
}: AuthFormCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", borderRadius: 1 }}
      {...cardProps}
    >
      <CardHeader
        title={title ?? ""}
        subheader={subtitle ?? ""}
        action={action}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

