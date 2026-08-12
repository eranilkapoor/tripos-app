import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="TripOS home">
        <span>T</span>
        <strong>TripOS</strong>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/#modules">Modules</Link>
        <Link href="/#plans">Plans</Link>
        <Link href="/#demo">Demo</Link>
      </nav>
    </header>
  );
}
