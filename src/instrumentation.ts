/** Runs once at server start-up: reports env misconfiguration in the log instead of waiting for the first login. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { checkEnv } = await import("@/lib/env");
  const problems = checkEnv();
  if (problems.length) console.error(`\n[env] Cần kiểm tra cấu hình (.env.example):\n- ${problems.join("\n- ")}\n`);
}
