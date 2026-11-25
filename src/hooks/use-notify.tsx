"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { NotifyToast } from "@/components/shared/notify-toast";
import { activityStore } from "@/lib/notify/activity-store";
import type { NotifyMessage, NotifyOptions, NotifyStatus } from "@/lib/notify/types";


const DURATION: Record<NotifyStatus, number> = { success: 4500, info: 4500, warning: 6000, error: 7000, loading: Infinity };
let seq = 0;

function createNotifier({ record: recordDefault = false }: { record?: boolean }) {
  function show(status: NotifyStatus, title: string, opts: NotifyOptions = {}) {
    const id = opts.id ?? `kn-${++seq}`;
    toast.custom((t) => <NotifyToast status={status} title={title} description={opts.description} action={opts.action} link={opts.link} onDismiss={() => toast.dismiss(t)} />, {
      id,
      duration: opts.duration ?? DURATION[status],
      unstyled: true,
    });
    if (status !== "loading" && (opts.record ?? recordDefault)) activityStore.push({ status, title, description: opts.description, link: opts.link });
    return id;
  }

  const msg = (m: NotifyMessage) => (typeof m === "string" ? { title: m } : m);

  return {
    success: (title: string, opts?: NotifyOptions) => show("success", title, opts),
    error: (title: string, opts?: NotifyOptions) => show("error", title, opts),
    warning: (title: string, opts?: NotifyOptions) => show("warning", title, opts),
    info: (title: string, opts?: NotifyOptions) => show("info", title, opts),
    loading: (title: string, opts?: NotifyOptions) => show("loading", title, opts),
    dismiss: (id?: string | number) => toast.dismiss(id),
    /**
     * Shows "working…" and then turns the same toast into success / error.
     * A `{ ok: false, error }` result (server action) also counts as an error.
     * Returns the result itself for the caller; never throws.
     */
    async promise<T>(
      task: Promise<T>,
      m: { loading: NotifyMessage; success: NotifyMessage | ((v: T) => NotifyMessage); error: NotifyMessage | ((e: unknown) => NotifyMessage) },
    ): Promise<T | undefined> {
      const { title, ...rest } = msg(m.loading);
      const id = show("loading", title, rest);
      const fail = (e: unknown) => {
        const { title: t, ...o } = msg(typeof m.error === "function" ? m.error(e) : m.error);
        show("error", t, { ...o, id });
      };
      try {
        const v = await task;
        if (v && typeof v === "object" && "ok" in v && (v as { ok: unknown }).ok === false) {
          fail(v);
          return v;
        }
        const { title: t, ...o } = msg(typeof m.success === "function" ? m.success(v) : m.success);
        show("success", t, { ...o, id });
        return v;
      } catch (e) {
        fail(e);
        return undefined;
      }
    },
  };
}

type Notifier = ReturnType<typeof createNotifier>;

/** For use outside React (e.g. in utility functions). Not recorded in the history. */
export const notify: Notifier = createNotifier({});

/**
 * Site-wide notification hook.
 * - Public pages: `useNotify()` – shows toasts only.
 * - Admin: `useNotify({ record: true })` – also records them in the notification-bell history.
 */
export function useNotify(options: { record?: boolean } = {}): Notifier {
  const record = options.record ?? false;
  return useMemo(() => (record ? createNotifier({ record }) : notify), [record]);
}
