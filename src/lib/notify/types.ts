export type NotifyStatus = "success" | "error" | "warning" | "info" | "loading";

export type NotifyLink = { label: string; href: string; external?: boolean };
export type NotifyAction = { label: string; onClick: () => void | Promise<void> };

export type NotifyOptions = {
  /** Same id = update the toast already shown (e.g. "Đang lưu…" → "Đã lưu"). */
  id?: string | number;
  description?: string;
  action?: NotifyAction;
  link?: NotifyLink;
  /** ms; default 4.5 s, errors 7 s, loading = until updated. */
  duration?: number;
  /** Record in the activity history (admin notification bell). Defaults to the hook's setting. */
  record?: boolean;
};

/** Content for each state of `promise()`. */
export type NotifyMessage = string | ({ title: string } & Omit<NotifyOptions, "id">);

export type Activity = {
  id: string;
  status: Exclude<NotifyStatus, "loading">;
  title: string;
  description?: string;
  link?: NotifyLink;
  at: number;
};
