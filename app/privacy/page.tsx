import type { Metadata } from "next"
import Link from "next/link"

import { SitePage } from "@/components/site/site-page"
import { SITE_LINKS } from "@/lib/site-links"
import { createLandingMetadata, SITE_PATHS } from "@/lib/site-metadata"

const title = "Privacy at DEAFCS Widget"
const description = "What DEAFCS Widget receives and what the widget does not collect."

export const metadata: Metadata = createLandingMetadata({ title, description, path: SITE_PATHS.privacy })

export default function PrivacyPage() {
  return (
    <SitePage title={title} description={description} path={SITE_PATHS.privacy}>
      <h2>What the widget uses</h2>
      <p>
        The widget uses public DEAFCS profile and CS2 statistics to render the layout selected in the builder. The service may
        receive a DEAFCS nickname or player ID and the selected widget configuration so it can display the requested
        public statistics in the browser source.
      </p>
      <p>
        DEAFCS Widget does not ask for a DEAFCS password, OAuth token, private account permission, or payment details. It does not
        modify a DEAFCS profile. Do not put secrets or private information in a widget URL, GitHub issue, or feedback message.
      </p>

      <h2>Technical data</h2>
      <p>
        Hosting and security providers may process limited technical request data needed to deliver and protect the site. This
        project does not use that information to build profiles of players or identify people. It does not contain a DEAFCS
        password or account access token.
      </p>

      <h2>Questions and requests</h2>
      <p>
        This is an independent open-source project and is not affiliated with DEAFCS. For questions about the site or a request to
        correct project content, use the <a href={SITE_LINKS.github} target="_blank" rel="noreferrer">GitHub repository</a>. DEAFCS account and platform requests
        should go to DEAFCS support. See the <Link href={SITE_PATHS.contact}>contact page</Link> for issue templates and the information
        that helps reproduce a widget problem.
      </p>
    </SitePage>
  )
}
