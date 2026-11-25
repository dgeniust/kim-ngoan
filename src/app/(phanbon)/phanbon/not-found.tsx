import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/phanbon/catalog/empty-state";

export default function NotFound() {
  return (
    <Container className="py-20">
      <EmptyState title="Không tìm thấy trang" description="Trang bạn tìm có thể đã bị xoá hoặc đường dẫn không đúng.">
        <Button asChild variant="sun">
          <Link href="/phanbon">Về trang chủ</Link>
        </Button>
      </EmptyState>
    </Container>
  );
}
