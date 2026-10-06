import { mountDocPage } from "./page-shell.js";
import { CONTACT } from "../modules/data/footer-config.js";
// Content only; layout lives in modules/doc-page.js.
// TODO: have a qualified Nigerian lawyer review this before public launch.

const email = `<a href="mailto:${CONTACT.email}">${CONTACT.email}</a>`;

mountDocPage({
  title: "Terms of Use",
  updated: "2 October 2026",
  intro:
    "These terms apply when you use the NearImpact Nigeria website. By using it, you agree to them. If you don't agree, please don't use the site.",
  sections: [
    {
      id: "the-service",
      heading: "The service",
      paragraphs: [
        "NearImpact helps people discover sustainability projects, opportunities and impactmakers in Nigeria. The platform is in an early stage: features change, and some listings are sample content while we build the real directory.",
      ],
    },
    {
      id: "your-account",
      heading: "Your account",
      items: [
        "Give accurate details when you register.",
        "Keep your password private. You are responsible for activity on your account.",
        "Tell us straight away if you think someone else has accessed it.",
      ],
    },
    {
      id: "acceptable-use",
      heading: "Acceptable use",
      paragraphs: ["Please don't:"],
      items: [
        "Break the law or help someone else to.",
        "Post false, misleading, abusive or hateful content.",
        "Try to access other people's accounts or our systems without permission.",
        "Overload, scrape or interfere with the site or its servers.",
        "Pretend to be another person or organisation.",
      ],
    },
    {
      id: "listings-and-third-parties",
      heading: "Listings and third parties",
      paragraphs: [
        "Most projects, fellowships, grants, internships and jobs shown on NearImpact are run by other organisations. We do not employ, endorse or guarantee them, and we cannot promise any listing is accurate, current or will lead to an offer.",
        "Please check details and the organisation yourself before you apply, share personal information or travel to an event.",
      ],
    },
    {
      id: "your-content",
      heading: "Content you submit",
      paragraphs: [
        "You keep ownership of anything you submit, such as a project listing. By submitting it you give NearImpact permission to display it on the platform and to promote the platform with it. You confirm you have the right to share it.",
        "We may remove content that breaks these terms.",
      ],
    },
    {
      id: "our-content",
      heading: "Our content",
      paragraphs: [
        "The NearImpact name, logo, design and original text belong to NearImpact Nigeria or its contributors. SDG artwork and partner logos belong to their owners. Please don't copy or reuse them without permission.",
      ],
    },
    {
      id: "no-warranty",
      heading: "No guarantees",
      paragraphs: [
        "We work to keep the site available and accurate, but it is provided &quot;as is&quot;. We do not promise it will be uninterrupted or error-free.",
      ],
    },
    {
      id: "liability",
      heading: "Limits on our liability",
      paragraphs: [
        "To the extent the law allows, NearImpact Nigeria is not liable for losses that come from using the site or relying on a listing, including decisions you make about third-party opportunities. Nothing here limits any right you have under Nigerian law that cannot be limited.",
      ],
    },
    {
      id: "suspension",
      heading: "Suspending accounts",
      paragraphs: [
        "We may suspend or close an account that breaks these terms or puts others at risk. You can stop using the site, or ask us to delete your account, at any time.",
      ],
    },
    {
      id: "governing-law",
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of the Federal Republic of Nigeria.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      paragraphs: [
        "We may update these terms as the platform grows. The date at the top shows the latest version, and continuing to use the site means you accept the update.",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      paragraphs: [
        `Questions about these terms? Email ${email} or <a href="${CONTACT.whatsapp.href}" target="_blank" rel="noopener noreferrer">WhatsApp ${CONTACT.whatsapp.label}</a>.`,
      ],
    },
  ],
});
