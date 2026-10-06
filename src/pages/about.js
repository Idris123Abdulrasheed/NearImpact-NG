import { mountDocPage } from "./page-shell.js";
import { CONTACT } from "../modules/data/footer-config.js";
// Content only; layout lives in modules/doc-page.js.

mountDocPage({
  title: "About Us",
  intro:
    "NearImpact Nigeria is a student-led sustainability and community-impact initiative starting in Nigeria, with a long-term vision to grow across Africa.",
  sections: [
    {
      id: "what-we-do",
      heading: "What we do",
      paragraphs: [
        "We turn students' ideas, skills and passion into practical community impact. We help them spot real problems around their schools and communities, work together on solutions, build practical projects, and link that work to the United Nations Sustainable Development Goals (SDGs).",
        "This platform makes that easier: a place to discover opportunities, share ideas, collaborate on projects and show the difference you are making.",
      ],
    },
    {
      id: "mission",
      heading: "Our mission",
      paragraphs: [
        "To empower students to turn ideas and skills into practical solutions for real community problems, while creating meaningful impact aligned with the Sustainable Development Goals.",
      ],
    },
    {
      id: "why-nearby",
      heading: "Why start nearby",
      paragraphs: [
        "The problems closest to us are opportunities to create impact. Students shouldn't have to wait until graduation to make a difference.",
        "By giving them the tools, community and opportunities to act, we want to build a generation of young people who can identify problems, build solutions and contribute to their communities, starting now.",
      ],
    },
    {
      id: "what-you-can-do",
      heading: "What you can do here",
      items: [
        "Find sustainability projects near you on the map.",
        "Browse fellowships, grants, internships and jobs.",
        "Meet impactmakers working on causes you care about.",
        "Explore the 17 SDGs and see which goals a project supports.",
      ],
    },
    {
      id: "where-we-are",
      heading: "Where we are today",
      paragraphs: [
        "NearImpact is an early-stage platform. Some of the projects and opportunities you see are sample listings while we build the real directory with partners and communities.",
      ],
    },
    {
      id: "where-next",
      heading: "Where we are headed",
      paragraphs: ["We want young people across Africa to be able to:"],
      items: [
        "Discover real problems in their communities.",
        "Find other students who share their interests.",
        "Turn ideas into practical projects.",
        "Collaborate across schools and communities.",
        "Connect projects to the SDGs.",
        "Discover opportunities to learn and contribute.",
        "Measure and show their impact.",
      ],
    },
    {
      id: "get-in-touch",
      heading: "Get in touch",
      paragraphs: [
        "We welcome partnerships with NGOs, schools, universities, youth networks, foundations and SDG-focused initiatives.",
        `Email us at <a href="mailto:${CONTACT.email}">${CONTACT.email}</a> or <a href="${CONTACT.whatsapp.href}" target="_blank" rel="noopener noreferrer">WhatsApp ${CONTACT.whatsapp.label}</a>.`,
      ],
    },
  ],
});
