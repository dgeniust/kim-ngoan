/** Chạy một lần khi server khởi động: báo lỗi cấu hình môi trường ngay trong log thay vì đợi tới lúc đăng nhập. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { checkEnv } = await import("@/lib/env");
  const problems = checkEnv();
  if (problems.length) console.error(`\n[env] Cần kiểm tra cấu hình (.env.example):\n- ${problems.join("\n- ")}\n`);
}
