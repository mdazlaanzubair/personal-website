import { academic } from "./documents/academic"
import { clientProject } from "./documents/clientProject"
import { experience } from "./documents/experience"
import { publication } from "./documents/publication"
import { service } from "./documents/service"
import { serviceTestimonial } from "./documents/serviceTestimonial"
import { siteSettings } from "./documents/siteSettings"
import { work } from "./documents/work"
import { experienceCompany } from "./objects/experienceCompany"
import { institute } from "./objects/institute"
import {
  callout,
  codeBlock,
  portableImage,
  portableText,
  relatedContent,
  tableBlock,
  tableRow,
} from "./objects/portableText"
import { skill } from "./objects/skill"
import { socialProfile } from "./objects/socialProfile"

export const schemaTypes = [
  publication,
  work,
  service,
  serviceTestimonial,
  clientProject,
  experience,
  academic,
  siteSettings,
  experienceCompany,
  institute,
  socialProfile,
  skill,
  portableImage,
  codeBlock,
  callout,
  tableRow,
  tableBlock,
  relatedContent,
  portableText,
]
