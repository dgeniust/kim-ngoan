export type NotifyStatus = "success" | "error" | "warning" | "info" | "loading";

export type NotifyLink = { label: string; href: string; external?: boolean };
export type NotifyAction = { label: string; onClick: () => void | Promise<void> };

export type NotifyOptions = {
  /** Cùng id = cập nhật thông báo đang hiện (VD: “Đang lưu…” → “Đã lưu”). */
  id?: string | number;
  description?: string;
  action?: NotifyAction;
  link?: NotifyLink;
  /** ms; mặc định 4.5s, lỗi 7s, đang xử lý = đến khi được cập nhật. */
  duration?: number;
  /** Ghi vào lịch sử hoạt động (chuông thông báo của admin). Mặc định theo hook. */
  record?: boolean;
};

/** Nội dung cho từng trạng thái của `promise()`. */
export type NotifyMessage = string | ({ title: string } & Omit<NotifyOptions, "id">);

export type Activity = {
  id: string;
  status: Exclude<NotifyStatus, "loading">;
  title: string;
  description?: string;
  link?: NotifyLink;
  at: number;
};
