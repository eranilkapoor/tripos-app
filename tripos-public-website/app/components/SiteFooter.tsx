import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>&copy; {new Date().getFullYear()} TripOS</span>
      <nav aria-label="Legal">
        <Link href="/privacy">Privacy policy</Link>
        <Link href="/terms">Terms of service</Link>
        <Link href="/refund-policy">Refund policy</Link>
      </nav>
    </footer>
  );
}
