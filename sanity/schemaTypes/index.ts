import { academic } from "./documents/academic"
import { caseStudy } from "./caseStudy"
import { company } from "./company"
import { technology } from "./technology"
import {
  caseStudyImage,
  caseStudyPoint,
  caseStudyResult,
  externalLink,
  richText,
  seo,
  teamMember,
} from "./objects"
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
import { projectSummary } from "./objects/projectSummary"
import { skill } from "./objects/skill"
import { socialProfile } from "./objects/socialProfile"

export const schemaTypes = [
  // Case studies (case-study-schema.md)
  caseStudy,
  company,
  technology,
  richText,
  caseStudyPoint,
  caseStudyResult,
  teamMember,
  externalLink,
  caseStudyImage,
  seo,
  // Portfolio content
  publication,
  work,
  service,
  serviceTestimonial,
  clientProject,
  experience,
  academic,
  siteSettings,
  projectSummary,
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
