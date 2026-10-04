<div align="center">
  <a href="https://deafcs-widget.vercel.app">
    <img src=".github/assets/preview.png" alt="DEAFCS Widget preview" width="920">
  </a>

  <h1>DEAFCS Widget — Free Stats Widget for OBS</h1>

  <p>Live DEAFCS CS2 stats for OBS browser sources.</p>

  <p>
    <a href="https://deafcs-widget.vercel.app">Create your widget</a>
    &middot;
    <a href="https://deafcs-widget.vercel.app/deafcs-widget-obs">OBS setup</a>
    &middot;
    <a href="https://github.com/bodkul/deafcs-widget">Source code</a>
  </p>

  <p>
    <a href="https://deafcs-widget.vercel.app">
      <img src="https://img.shields.io/badge/website-deafcs--widget.vercel.app-111111?style=flat-square" alt="Website">
    </a>
    <a href="https://github.com/bodkul/deafcs-widget">
      <img src="https://img.shields.io/badge/open%20source-GitHub-111111?style=flat-square&logo=github&logoColor=white" alt="Open source on GitHub">
    </a>
    <a href="https://github.com/bodkul/deafcs-widget/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
    </a>
  </p>
</div>

The official project website is [deafcs-widget.vercel.app](https://deafcs-widget.vercel.app). This repository contains the source code for DEAFCS Widget, a free open-source DEAFCS stats widget for OBS Studio and Streamlabs Desktop. Build an overlay, choose the stats you want to show, and add the generated URL to OBS. No plugin or DEAFCS login is required.

DEAFCS Widget turns a public DEAFCS nickname into a browser-source overlay for CS2. It can show ELO, DEAFCS level, regional ranking, country ranking, K/D, and recent match results while you stream.

## Use it

1. Open the [widget builder](https://deafcs-widget.vercel.app/builder).
2. Enter your DEAFCS nickname and choose a preset.
3. Adjust the content, style, map, and motion settings.
4. Copy the generated URL.
5. Add it as an OBS **Browser Source**.

The widget page is transparent and starts at the top-left corner. Position and crop it in OBS without changing the URL.

Read the [OBS setup guide](https://deafcs-widget.vercel.app/deafcs-widget-obs) for the browser-source settings. The [live stats guide](https://deafcs-widget.vercel.app/live-deafcs-stats) explains caching and match refreshes. The [About page](https://deafcs-widget.vercel.app/about) explains how the independent open-source project works and how to contribute.

## What you can configure

- Presets for ELO, DEAFCS level, regional and country rankings, K/D, recent matches, and session stats.
- Visible fields, fonts, colors, scale, radius, borders, background mode, and map artwork.
- Automatic stat rotation on the larger presets.
- PNG export.
- Live updates after DEAFCS publishes the result of a completed match.

### Requirements

- Node.js 22 or newer
- An API key for the DEAFCS API

Install the dependencies:

```bash
npm install
```

Copy the example environment file and add your key:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values.

| Variable | Runtime | Required | Purpose |
| --- | --- | --- | --- |
| `DEAFCS_API_URL` | Server | Yes | GraphQL endpoint of the DEAFCS API. |
| `DEAFCS_API_KEY` | Server | Yes | API key for the DEAFCS API. Never expose it to the browser. |

## Project structure

```text
app/                 Routes, metadata, guides, builder, and widget page
components/ui/       Reusable shadcn and Base UI components
components/widget/   Widget renderer, presets, builder, and animation
lib/widget/          Config, types, serialization, ranking, and API client
public/              Level icons, flags, maps, and static assets
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server (after `npm run build`). |
| `npm test` | Run the Vitest suite. |
| `npm run typecheck` | Check TypeScript without emitting files. |
| `npm run lint` | Run ESLint. |

## Contributing

Bug reports and focused pull requests are welcome. Use the [bug report template](https://github.com/bodkul/deafcs-widget/issues/new?template=bug_report.yml) and include the OBS or streaming-software version, widget URL, browser, and clear reproduction steps for rendering issues.

## License

MIT. See the [license file](https://github.com/bodkul/deafcs-widget/blob/main/LICENSE).

DEAFCS Widget is an unofficial community project. It is not affiliated with or endorsed by [DEAFCS](https://deafcs.net).