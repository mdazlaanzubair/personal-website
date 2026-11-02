const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/

/**
 * The 11-character video ID from any common YouTube link: watch?v=, youtu.be,
 * /shorts/, /embed/ and /live/. Returns null for anything else.
 */
export function getYouTubeId(input: string | null | undefined) {
  if (!input) return null

  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }

  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "")
  let id: string | null = null

  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const [, first, second] = url.pathname.split("/")
    id =
      first === "watch"
        ? url.searchParams.get("v")
        : ["shorts", "embed", "live", "v"].includes(first)
          ? (second ?? null)
          : null
  }

  return id && YOUTUBE_ID.test(id) ? id : null
}

/** A privacy-enhanced embed URL (no cookies until the viewer plays it). */
export function youTubeEmbedUrl(
  id: string,
  options: { background?: boolean; autoplay?: boolean } = {}
) {
  const params = new URLSearchParams({
    playsinline: "1",
    rel: "0",
    iv_load_policy: "3",
  })

  if (options.background || options.autoplay) {
    // Browsers only allow autoplay when muted.
    params.set("autoplay", "1")
    params.set("mute", "1")
  }

  if (options.background) {
    // Looping and control-free, like an uploaded preview clip.
    params.set("loop", "1")
    params.set("playlist", id)
    params.set("controls", "0")
    params.set("disablekb", "1")
  }

  return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}

/** YouTube's own still for a video, used when a project has no images. */
export const youTubeThumbnailUrl = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
