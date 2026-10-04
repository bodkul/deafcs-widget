import type { Metadata } from "next"
import Link from "next/link"

import { SitePage } from "@/components/site/site-page"
import { SITE_LINKS } from "@/lib/site-links"
import { createLandingMetadata, SITE_PATHS } from "@/lib/site-metadata"

const title = "Contact DEAFCS Widget"
const description = "Report a bug, suggest an improvement, or ask about using DEAFCS Widget with OBS."

export const metadata: Metadata = createLandingMetadata({ title, description, path: SITE_PATHS.contact })

export default function ContactPage() {
  return (
    <SitePage title={title} description={description} path={SITE_PATHS.contact}>
      <h2>GitHub is the contact channel</h2>
      <p>
        DEAFCS Widget is maintained as an open-source community project. The best place to report a problem or ask a technical
        question is the <a href={SITE_LINKS.github} target="_blank" rel="noreferrer">GitHub repository</a>. Public issues keep the conversation searchable and let
        other streamers confirm a problem, add details, or test a fix.
      </p>
      <p>
        For a broken widget, use the <a href={SITE_LINKS.bugReport} target="_blank" rel="noreferrer">bug report template</a>. Include the browser or streaming
        software version, the widget URL, the preset name, the DEAFCS nickname if it is safe to share, and the exact behavior you
        expected. Do not include passwords, API keys, private tokens, or information from someone else&apos;s account.
      </p>

      <h2>Suggestions and changes</h2>
      <p>
        Feature requests belong in the <a href={SITE_LINKS.suggestIdea} target="_blank" rel="noreferrer">feedback template</a>. A useful request explains the stream
        setup, the preset being used, and the result you want viewers to see. Screenshots are welcome when they show the widget
        itself. Keep DEAFCS account credentials and unrelated personal information out of screenshots.
      </p>

      <h2>Before opening an issue</h2>
      <ul>
        <li>Check the <Link href={SITE_PATHS.deafcsWidgetObsGuide}>OBS setup guide</Link> for browser-source settings.</li>
        <li>Check the <Link href={SITE_PATHS.liveDeafcsStatsGuide}>live stats guide</Link> when a completed match is not visible yet.</li>
        <li>Confirm that the nickname resolves to the intended public DEAFCS CS2 profile.</li>
      </ul>
      <p>
        This project does not provide official DEAFCS support. Account, matchmaking, moderation, and platform problems belong with
        DEAFCS directly.
      </p>
    </SitePage>
  )
}
