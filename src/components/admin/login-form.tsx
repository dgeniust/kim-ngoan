"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { BTN_PRIMARY } from "./notion-ui";

const INPUT = "w-full rounded-lg border border-hub-line bg-hub-paper px-3 py-2.5 text-[15px] outline-none transition-[border-color,box-shadow] duration-200 focus:border-hub-blue focus:shadow-[0_0_0_3px_var(--color-hub-blue-tint)]";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-hub-ink/75">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={INPUT} placeholder="admin@kimngoan.vn" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-hub-ink/75">Mật khẩu</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={INPUT} />
      </div>
      {state && !state.ok && (
        <p role="alert" className="rounded-lg bg-hub-coral-soft px-3 py-2 text-sm text-[#9b2c1f]">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className={`${BTN_PRIMARY} h-10 w-full`}>
        {pending && <Loader2 className="animate-spin" />} Đăng nhập
      </button>
    </form>
  );
}
