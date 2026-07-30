export function createEnv({
  server,
  runtimeEnv,
}: {
  server: Record<string, unknown>;
  runtimeEnv: Record<string, string | undefined>;
}) {
  const env: Record<string, string | undefined> = {};
  for (const key of Object.keys(server)) {
    env[key] = runtimeEnv[key];
  }
  return env as Record<string, string>;
}
