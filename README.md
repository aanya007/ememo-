#ememo

a place for feelings that have no name.

ememo is a multimedia emotional time-capsule app. it collects everything that makes up a specific feeling — a song, a place, a photo, a film, a late-night thought — into one capsule you can revisit, share, or gift to someone you love.

when you want to relive a feeling, you usually end up jumping between five different apps — spotify, maps, notes, your camera roll. ememo is the one place that holds it all together.


# what it does


build a capsule around a feeling, not a date or a topic — "dancing in the rain at night," "3am solitude," "the last day of summer"
add anything that belongs to it: music, images, places, articles, journal entries, or any link — ememo pulls in the metadata automatically
revisit it as a living scrapbook — a spinning vinyl record for the song, an expandable map pin for the café, your own handwritten note sitting next to it all
gift a capsule to someone — instantly, on a timed reveal, or locked until they ask for it
fork a public capsule into your own collection and make it yours


# why

most note apps and mood boards are built around projects, topics, or chronology. ememo is built around a single emotional anchor — the idea that a feeling has a texture made of music and place and memory all at once, and that texture is worth collecting deliberately instead of letting it scatter across a dozen apps.


# tech stack


- Next.js 14 (App Router) — frontend + API routes
- Supabase — Postgres database, auth, file storage
- Tailwind CSS — styling, dark-mode-only design system
- Framer Motion — spring-physics animation, 3D card interactions
- Spotify Web API — track metadata + embedded playback
- Google Places API — location search + map embeds
- OpenGraph scraping — universal link previews for articles, films, recipes, anything else


# project structure

app/                    routes (App Router)
  capsule/[id]/         capsule view + gift flow
  capsule/new/          capsule creation
  explore/               public capsule feed
  gift/[token]/         gift recipient view
  home/                  capsule shelf
  api/                   serverless routes (og scraping, spotify metadata)
components/
  capsule/               capsule card, shelf, content blocks
  media/                 vinyl + map thumbnails
  ui/                    buttons, tags, shared primitives
lib/                     mock data, app state
types/                   shared TypeScript types

design system, component specs, and product requirements live in DESIGN.md and PRD.md in this repo.

# status

this is an early, actively-developed personal project. expect rough edges.

# license

no license has been added yet — all rights reserved by default until one is added.
