"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Vùng hiển thị thông báo. Giao diện thẻ nằm ở components/shared/notify-toast – gọi qua hook `useNotify`. */
const Toaster = (props: ToasterProps) => (
  <Sonner position="top-right" offset={16} mobileOffset={12} gap={10} visibleToasts={4} containerAriaLabel="Thông báo" {...props} />
);

export { Toaster };
