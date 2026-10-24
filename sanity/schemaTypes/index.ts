import { academic } from "./documents/academic"
import { caseStudy } from "./documents/caseStudy"
import { clientProject } from "./documents/clientProject"
import { experience } from "./documents/experience"
import { publication } from "./documents/publication"
import { service } from "./documents/service"
import { serviceTestimonial } from "./documents/serviceTestimonial"
import { siteSettings } from "./documents/siteSettings"
import { work } from "./documents/work"
import { company } from "./objects/company"
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
import { projectSummary } from "./objects/projectSummary"
import { seo } from "./objects/seo"
import { skill } from "./objects/skill"
import { socialProfile } from "./objects/socialProfile"

export const schemaTypes = [
  caseStudy,
  publication,
  work,
  service,
  serviceTestimonial,
  clientProject,
  experience,
  academic,
  siteSettings,
  company,
  projectSummary,
  seo,
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
