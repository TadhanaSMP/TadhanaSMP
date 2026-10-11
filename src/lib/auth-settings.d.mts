export function configuredOrigin(
  env: Record<string, string | undefined>,
  production?: boolean,
): string;
export function authenticationReady(
  env: Record<string, string | undefined>,
  production?: boolean,
): boolean;
export function matchesOrigin(
  header: string | null,
  env: Record<string, string | undefined>,
  production?: boolean,
): boolean;
