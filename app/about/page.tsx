import type { Metadata } from "next"
import Link from "next/link"

import { SitePage } from "@/components/site/site-page"
import { SITE_LINKS } from "@/lib/site-links"
import { createLandingMetadata, SITE_AUTHOR, SITE_PATHS, APP_PATHS } from "@/lib/site-metadata"

const title = "About the DEAFCS Widget project"
const description = "Learn who maintains DEAFCS Widget, how the open-source project works, and what data it uses for OBS overlays."

export const metadata: Metadata = createLandingMetadata({ title, description, path: SITE_PATHS.about })

export default function AboutPage() {
  return (
    <SitePage
      title={title}
      description={description}
      path={SITE_PATHS.about}
      showBuilderCta
      pageType="AboutPage"
    >
      <h2>What DEAFCS Widget does</h2>
      <p>
        DEAFCS Widget is a free, open-source web application for creating DEAFCS CS2 statistics overlays. Streamers can use the generated page as a Browser source in OBS Studio or Streamlabs Desktop to show public player information such as ELO, DEAFCS level, Challenger status, regional ranking, country ranking, K/D, and recent match results.
      </p>
      <p>
        The project is designed to stay simple: choose a preset, select the fields that belong in your scene, tune the visual style, and copy one URL. It does not require a desktop plugin or a DEAFCS password, and it is not an account-management or matchmaking tool.
      </p>

      <h2>How the project works</h2>
      <ol>
        <li>You enter a public DEAFCS nickname in the <Link href={APP_PATHS.builder}>widget builder</Link>.</li>
        <li>The service requests the public statistics needed for the selected layout.</li>
        <li>The browser-source page renders the overlay and checks for changed values about every two minutes while it is open.</li>
      </ol>
      <p>
        A completed match can take a little time to appear because the result must first be published by DEAFCS. The <Link href={SITE_PATHS.liveDeafcsStatsGuide}>live stats guide</Link> explains what the refresh can update, and the <Link href={SITE_PATHS.deafcsWidgetObsGuide}>OBS setup guide</Link> covers the Browser source configuration.
      </p>

      <h2>Maintainer and source code</h2>
      <p>
        DEAFCS Widget is maintained by <a href={SITE_AUTHOR.url} target="_blank" rel="noreferrer">{SITE_AUTHOR.name}</a>. The source code, issue tracker, setup notes, and contribution history are available in the public <a href={SITE_LINKS.github} target="_blank" rel="noreferrer">GitHub repository</a>. Technical questions, bug reports, and feature requests should be opened there so they can be answered and searched by other streamers.
      </p>

      <h2>Privacy and affiliation</h2>
      <p>
        The widget uses public DEAFCS statistics for the nickname requested. It does not ask for a password, OAuth token, private account permission, or payment details. Hosting and security providers may process limited technical request data needed to deliver the service. See the <Link href={SITE_PATHS.privacy}>privacy page</Link> for details.
      </p>
      <p>
        This is an independent community project. DEAFCS Widget is not affiliated with, endorsed by, or operated by DEAFCS. For account, matchmaking, moderation, or platform support, contact DEAFCS directly. For questions about this project, use the <Link href={SITE_PATHS.contact}>contact page</Link>.
      </p>
    </SitePage>
  )
}
