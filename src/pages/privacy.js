import { mountDocPage } from "./page-shell.js";
import { CONTACT } from "../modules/data/footer-config.js";
// Content only; layout lives in modules/doc-page.js.
// TODO: have a qualified Nigerian lawyer review this before public launch.
// It describes what the code does today; update it when features change
// (analytics, Mailchimp, profile pages, etc).

const email = `<a href="mailto:${CONTACT.email}">${CONTACT.email}</a>`;

mountDocPage({
  title: "Privacy Policy",
  updated: "2 October 2026",
  intro:
    "This policy explains what personal information NearImpact Nigeria collects when you use this website, why we collect it, and the choices you have.",
  sections: [
    {
      id: "who-we-are",
      heading: "Who we are",
      paragraphs: [
        "NearImpact Nigeria runs this website. NearImpact is an early-stage platform, and this policy covers the features that exist today. We will update it as the platform grows.",
      ],
    },
    {
      id: "what-we-collect",
      heading: "What we collect",
      items: [
        "<strong>Account details.</strong> When you create an account we collect your name, email address and password. Your password is stored only as a hashed value, so we cannot read it.",
        "<strong>Newsletter email.</strong> If you subscribe in the footer, we store your email address.",
        "<strong>Search text.</strong> What you type into the search box is sent to our server so it can return results. We do not link searches to your account.",
        "<strong>Location.</strong> If you choose &quot;Use current location&quot;, your browser asks for permission first. Your coordinates are used in your browser to sort nearby projects and are not sent to our servers.",
        "<strong>Listings you submit.</strong> The project or opportunity details you enter, plus the contact email and phone you give, are stored with your account and reviewed by us before anything is published.",
        "<strong>Impactmaker profiles.</strong> If you apply to become an impactmaker, we store the details you provide, such as your name, role, location, bio, contributions and links. Once approved, they appear publicly on the site, so only share what you are happy to be public. You can ask us to remove or change your profile at any time.",
        "<strong>Preferences.</strong> Your light or dark theme choice is saved in your own browser.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies",
      paragraphs: [
        "When you log in we set one cookie, <code>ni_session</code>, to keep you signed in. It is not readable by scripts on the page, is only sent to our own site, and expires after 7 days or when you sign out.",
        "We do not currently use advertising or analytics cookies. If that changes, we will update this page first.",
      ],
    },
    {
      id: "how-we-use-it",
      heading: "How we use your information",
      items: [
        "To create and run your account and keep you signed in.",
        "To send you the NearImpact newsletter, if you subscribed.",
        "To return search results and show projects near you.",
        "To keep the service secure and fix problems.",
      ],
      paragraphs: ["We do not sell your personal information."],
    },
    {
      id: "third-parties",
      heading: "Other services we rely on",
      paragraphs: [
        "Some of the technology behind the site is run by other companies, and they may process limited data to provide it:",
      ],
      items: [
        "<strong>Vercel</strong> hosts the website and its server functions.",
        "<strong>Aiven</strong> hosts our database, where account and newsletter details are stored.",
        "<strong>OpenStreetMap</strong> supplies the map images. Your browser requests them directly, so their servers can see your IP address.",
        "<strong>Google Fonts</strong> supplies the site's typefaces, with the same effect.",
      ],
    },
    {
      id: "keeping-it-safe",
      heading: "Keeping your information safe",
      paragraphs: [
        "Passwords are hashed, connections to the site and database are encrypted, and our database queries are written to resist injection. No system is perfectly secure, so please use a strong, unique password.",
        "We keep account details until you ask us to delete your account, and newsletter emails until you unsubscribe.",
      ],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      paragraphs: [
        "Under the Nigeria Data Protection Act 2023 you may have the right to access the personal information we hold about you, correct it, ask us to delete it, and object to certain uses, including the newsletter.",
        `To do any of this, email us at ${email}. If you are unhappy with how we handle your information, you can also complain to the Nigeria Data Protection Commission.`,
      ],
    },
    {
      id: "young-people",
      heading: "Young people",
      paragraphs: [
        "NearImpact is built for students. If you are under 18, please use the site with the knowledge of a parent or guardian. If you believe a child has given us personal information without permission, contact us and we will remove it.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      paragraphs: [
        "When we change this policy we will update the date at the top of this page.",
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      paragraphs: [
        `Questions about this policy? Email ${email} or <a href="${CONTACT.whatsapp.href}" target="_blank" rel="noopener noreferrer">WhatsApp ${CONTACT.whatsapp.label}</a>.`,
      ],
    },
  ],
});
