"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Toast viewport. The card UI lives in components/shared/notify-toast – trigger via the `useNotify` hook. */
const Toaster = (props: ToasterProps) => (
  <Sonner position="top-right" offset={16} mobileOffset={12} gap={10} visibleToasts={4} containerAriaLabel="Thông báo" {...props} />
);

export { Toaster };
