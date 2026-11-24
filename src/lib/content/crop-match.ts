import { normalize } from "@/lib/mock/search";
import { CROPS } from "@/lib/content/hub-extras";

/** Khoá so khớp tên cây: “Cây cà phê” = “Cà phê”, “Hồ tiêu” = “Tiêu”. */
export function cropKey(name: string) {
  return normalize(name)
    .replace(/^cay\s+/, "")
    .replace(/^ho\s+tieu$/, "tieu")
    .replace(/\s+/g, "-");
}

/** Lịch mùa vụ (hub-extras) của một cây, nếu có. */
export function calendarFor(key: string) {
  return CROPS.find((c) => cropKey(c.name) === key);
}
