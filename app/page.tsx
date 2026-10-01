import type { Metadata } from "next"

import { Hero } from "@/components/home/hero"
import { HomeStory } from "@/components/home/home-story"
import { SiteFooter } from "@/components/home/site-footer"
import { AnnouncementBar } from "@/components/site/announcement-bar"
import { SITE_LINKS } from "@/lib/site-links"
import { SITE_AUTHOR, SITE_LAST_MODIFIED, SITE_METADATA, SITE_PATHS } from "@/lib/site-metadata"

const examplePlayer = "bodkul"

export const metadata: Metadata = {
  title: { absolute: SITE_METADATA.title },
  description: SITE_METADATA.description,
  alternates: { canonical: SITE_PATHS.home },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_METADATA.url}/#website`,
      url: `${SITE_METADATA.url}/`,
      name: SITE_METADATA.name,
      alternateName: ["deafcs-widget.vercel.app", "DEAFCS Widget for OBS"],
      description: SITE_METADATA.description,
      inLanguage: "en",
      dateModified: SITE_LAST_MODIFIED,
      author: { "@id": `${SITE_AUTHOR.url}#person` },
      publisher: { "@id": `${SITE_METADATA.url}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_METADATA.url}/#webpage`,
      url: `${SITE_METADATA.url}/`,
      name: SITE_METADATA.title,
      description: SITE_METADATA.description,
      isPartOf: { "@id": `${SITE_METADATA.url}/#website` },
      inLanguage: "en",
      dateModified: SITE_LAST_MODIFIED,
      author: { "@id": `${SITE_AUTHOR.url}#person` },
      publisher: { "@id": `${SITE_METADATA.url}/#organization` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_AUTHOR.url}#person`,
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
      sameAs: [SITE_AUTHOR.url],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_METADATA.url}/#organization`,
      name: SITE_METADATA.name,
      url: `${SITE_METADATA.url}/`,
      logo: `${SITE_METADATA.url}/logo.svg`,
      description: SITE_METADATA.description,
      alternateName: "DEAFCS Widget for OBS",
      sameAs: [SITE_LINKS.github, SITE_AUTHOR.url],
      founder: { "@id": `${SITE_AUTHOR.url}#person` },
      dateModified: SITE_LAST_MODIFIED,
      knowsAbout: ["FACEIT CS2 statistics", "OBS browser-source overlays"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Technical support",
        url: `${SITE_LINKS.github}/issues`,
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_METADATA.url}/#application`,
      name: SITE_METADATA.name,
      url: `${SITE_METADATA.url}/`,
      description: SITE_METADATA.description,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      brand: { "@id": `${SITE_METADATA.url}/#organization` },
      isPartOf: { "@id": `${SITE_METADATA.url}/#website` },
      publisher: { "@id": `${SITE_METADATA.url}/#organization` },
      dateModified: SITE_LAST_MODIFIED,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_METADATA.url}/#faq`,
      url: `${SITE_METADATA.url}/#faq`,
      isPartOf: { "@id": `${SITE_METADATA.url}/#webpage` },
      mainEntity: [
        {
          "@type": "Question",
          name: "Does it work with OBS and Streamlabs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The generated page is intended for a Browser source, so it works in OBS Studio and Streamlabs Desktop without installing a separate plugin.",
          },
        },
        {
          "@type": "Question",
          name: "Does DEAFCS Widget need my account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. DEAFCS Widget uses the public statistics associated with the nickname you enter. It does not require a FACEIT password, API key, or private token.",
          },
        },
        {
          "@type": "Question",
          name: "Is DEAFCS Widget open source?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. DEAFCS Widget is an independent open-source community project. Its source code and issue tracker are available in the public GitHub repository.",
          },
        },
      ],
    },
  ],
}

export default function Home() {
  return (
    <main data-home-page className="relative min-h-svh overflow-x-clip bg-background">
      <AnnouncementBar />
      <div className="relative flex min-h-svh flex-col overflow-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgb(255_255_255/10%),transparent_30%),radial-gradient(circle_at_78%_58%,rgb(255_255_255/3%),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgb(255_255_255/4%)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/4%)_1px,transparent_1px)] bg-size-[92px_92px] mask-[linear-gradient(to_bottom,black,transparent_72%)]" />
        <Hero player={examplePlayer} />
        <SiteFooter />
      </div>
      <HomeStory />
    </main>
  )
}
