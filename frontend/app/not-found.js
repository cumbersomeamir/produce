import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-main py-24 text-center">
      <p className="text-caption text-primary">404 • Lost in the oddverse</p>
      <h1 className="mt-2 font-display text-5xl text-secondary">That page escaped the catalog.</h1>
      <p className="mx-auto mt-3 max-w-xl text-text-muted">
        The weird find you wanted is unavailable or moved. The store is still full of ridiculous things.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button as={Link} href="/products">
          Shop Products
        </Button>
        <Button as={Link} href="/" variant="ghost">
          Back Home
        </Button>
      </div>
    </div>
  );
}
