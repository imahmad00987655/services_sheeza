export function phpApiBase(): string {
  const raw = import.meta.env.VITE_PHP_API_BASE as string | undefined;
  return raw?.replace(/\/$/, "") ?? "";
}

export function isRemoteApi(): boolean {
  return phpApiBase().length > 0;
}
