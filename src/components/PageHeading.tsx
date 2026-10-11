import Link from "next/link";
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{eyebrow}</span>
      </nav>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
    </div>
  );
}
