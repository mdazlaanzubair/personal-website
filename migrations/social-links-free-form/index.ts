import { at, defineMigration, set } from "sanity/migrate"

const PLATFORM_LABELS: Record<string, string> = {
  x: "X",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "Github",
  scholar: "Google Scholar",
  whatsapp: "WhatsApp",
}

// Links the site used to hard-code. They are added once, so the footer and
// CV keep showing them after moving to Sanity, and can be edited there.
const PREVIOUSLY_HARDCODED = [
  {
    label: "Website",
    url: "https://mdazlaanzubair.com/",
    // A footer link to the site you are already on adds nothing.
    hideFromPortfolio: true,
    hideFromResume: false,
  },
  {
    label: "Blog",
    url: "https://letinix.com/",
    hideFromPortfolio: false,
    hideFromResume: false,
  },
  {
    label: "Threads",
    url: "https://www.threads.com/@mdazlaanzubairr",
    hideFromPortfolio: false,
    hideFromResume: false,
  },
]

type LegacyLink = {
  _key: string
  _type?: string
  label?: string
  url?: string
  platform?: string
  username?: string
  isHidden?: boolean
  hideFromPortfolio?: boolean
  hideFromResume?: boolean
}

export default defineMigration({
  title: "Convert social profiles to free-form links",
  documentTypes: ["siteSettings"],
  migrate: {
    document(doc) {
      const current = (doc.socialMedia ?? []) as LegacyLink[]

      const converted = current.map((link) => {
        const hidden = link.isHidden === true
        return {
          _key: link._key,
          _type: "socialProfile",
          label:
            link.label ??
            (link.platform && PLATFORM_LABELS[link.platform]) ??
            "Link",
          url: link.url,
          // The old switch hid a profile everywhere.
          hideFromPortfolio: link.hideFromPortfolio ?? hidden,
          hideFromResume: link.hideFromResume ?? hidden,
        }
      })

      const hasLabel = (label: string) =>
        converted.some(
          (link) => link.label.toLowerCase() === label.toLowerCase()
        )
      const additions = PREVIOUSLY_HARDCODED.filter(
        (link) => !hasLabel(link.label)
      ).map((link, i) => ({
        _key: `migrated-link-${i}-${link.label.toLowerCase()}`,
        _type: "socialProfile",
        ...link,
      }))

      // Website first, as on the CV; the others after the existing links.
      const [website, ...rest] = additions
      const links =
        website?.label === "Website"
          ? [website, ...converted, ...rest]
          : [...converted, ...additions]

      return [at("socialMedia", set(links))]
    },
  },
})
