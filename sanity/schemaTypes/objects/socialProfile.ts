import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe"
import { defineField, defineType } from "sanity"

export const socialProfile = defineType({
  name: "socialProfile",
  title: "Link",
  type: "object",
  icon: EarthGlobeIcon,
  initialValue: {
    hideFromPortfolio: false,
    hideFromResume: false,
  },
  fields: [
    defineField({
      name: "label",
      type: "string",
      description: "The link text, for example LinkedIn, Blog or WhatsApp.",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description:
        "A full link, such as https://…, mailto:… or a WhatsApp chat link like https://wa.me/923113046692.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https", "mailto", "tel"] })
          .error("Use a complete https://, mailto: or tel: link."),
    }),
    defineField({
      name: "hideFromPortfolio",
      title: "Hide from portfolio",
      description:
        "Leave it out of the website footer and search results data.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "hideFromResume",
      title: "Hide from resume",
      description: "Leave it out of the resume and academic CV.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      label: "label",
      url: "url",
      hideFromPortfolio: "hideFromPortfolio",
      hideFromResume: "hideFromResume",
    },
    prepare({ label, url, hideFromPortfolio, hideFromResume }) {
      const hidden = [
        hideFromPortfolio && "portfolio",
        hideFromResume && "resume",
      ].filter(Boolean)

      return {
        title: label ?? "Untitled link",
        subtitle: `${url ?? "Missing URL"}${
          hidden.length > 0 ? ` · Hidden from ${hidden.join(" and ")}` : ""
        }`,
      }
    },
  },
})
