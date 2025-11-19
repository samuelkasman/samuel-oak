type WebEnv = {
  apiBaseUrl: string;
};

function createWebEnv(): WebEnv {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Create apps/web/.env.local based on apps/web/.env.local.example."
    );
  }

  return {
    apiBaseUrl: apiUrl.replace(/\/$/, ""),
  };
}

export const webEnv = createWebEnv();

