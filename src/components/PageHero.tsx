import Link from 'next/link'

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string
  title: string
  description?: string
  breadcrumb?: string
}) {
  const breadcrumbText = breadcrumb || title

  return (
    <section className="page-hero">
      <div className="container">
        <nav className="page-hero-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span>{breadcrumbText}</span>
        </nav>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </section>
  )
}

