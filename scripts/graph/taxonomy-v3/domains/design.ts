import { s, type SkillDef } from "../types";

export const DESIGN: SkillDef[] = [
  // ── Core Design Tools ──
  s("figma", "Figma", "design-tool", ["figma design", "figma components", "figma auto layout", "figma variables", "figma interactive prototypes", "figma design system", "figma plugins"], ["high-demand", "core"]),
  s("sketch-design", "Sketch", "design-tool", ["sketch app", "sketch symbol libraries", "sketch design"]),
  s("adobe-xd", "Adobe XD", "design-tool", ["adobe xd", "xd prototypes", "adobe xd ui"]),
  s("framer-tool", "Framer", "design-tool", ["framer", "framer interactive design", "framer web builder", "framer react components"], ["trending"]),
  s("invision-app", "InVision", "design-tool", ["invision", "invision prototype", "invision boards"]),
  s("zeplin-handoff", "Zeplin", "design-tool", ["zeplin", "zeplin developer handoff", "zeplin styleguides"]),
  s("miro-whiteboard", "Miro", "collaboration-tool", ["miro", "miro user journey maps", "miro workshop boards"]),
  s("figjam", "FigJam", "collaboration-tool", ["figjam brainstorming", "figjam diagramming", "figma figjam"]),
  s("adobe-photoshop", "Adobe Photoshop", "graphic-tool", ["photoshop", "ps", "raster graphics", "photo manipulation"]),
  s("adobe-illustrator", "Adobe Illustrator", "graphic-tool", ["illustrator", "ai", "vector illustration", "iconography illustrator"]),
  s("adobe-after-effects", "Adobe After Effects", "motion-tool", ["after effects", "ae", "lottie animations after effects", "ui motion after effects"]),

  // ── Product & User Experience (UX) Design ──
  s("ux-design", "User Experience (UX) Design", "ux-discipline", ["ux design", "user experience", "ux architecture", "user journey mapping", "experience strategy", "service design"], ["high-demand", "core"]),
  s("ui-design", "User Interface (UI) Design", "ui-discipline", ["ui design", "user interface", "visual ui design", "digital interface design", "pixel perfect ui"], ["high-demand", "core"]),
  s("product-design-discipline", "Digital Product Design", "product-design", ["product design", "end-to-end product design", "product design thinking", "saas product design"], ["high-demand", "core"]),
  s("user-research", "UX Research & User Testing", "ux-research", ["user research", "generative user interviews", "usability testing", "moderated testing", "unmoderated user testing", "maze testing", "usertesting.com", "user personas", "empathy mapping", "jobs to be done jtbd"], ["high-demand", "core"]),
  s("information-architecture", "Information Architecture (IA)", "ux-discipline", ["information architecture", "ia sitemaps", "card sorting", "tree testing", "navigation taxonomy design"]),
  s("wireframing", "Wireframing & Low-Fidelity Prototyping", "ux-technique", ["wireframing", "wireframes", "low fidelity sketches", "balsamiq wireframes", "paper prototyping"]),
  s("interactive-prototyping", "High-Fidelity Interactive Prototyping", "ui-technique", ["prototyping", "micro-interactions prototyping", "clickable prototypes", "proto.io", "origami studio"]),
  s("design-systems-discipline", "Design Systems Architecture & Tokens", "design-system", ["design systems", "design tokens", "component libraries", "style guides", "atomic design methodology", "brad frost atomic design", "design system governance"], ["high-demand", "core"]),
  s("interaction-design", "Interaction Design (IxD)", "ux-discipline", ["ixd", "interaction patterns", "human computer interaction hci", "gestural interaction"]),
  s("motion-design-ui", "UI Motion Design & Micro-Animations", "ui-discipline", ["motion design", "ui micro-animations", "lottie files", "rive app", "animation easing curves"]),
  s("typography-design", "Typography & Hierarchy", "ui-discipline", ["typography", "type scales", "font pairing", "readability contrast"]),
  s("color-theory-design", "Color Theory & Palette Design", "ui-discipline", ["color theory", "color palettes", "wcag contrast ratios", "dark mode theme design"]),
  s("responsive-ui-design", "Responsive & Adaptive Layout Design", "ui-discipline", ["responsive ui", "mobile-first design", "fluid grid systems", "breakpoint layouts"]),
  s("accessible-design", "Inclusive & Accessible Design (a11y Design)", "ux-discipline", ["accessible design", "screen reader consideration", "focus state design", "cognitive accessibility"]),
  s("design-thinking-methodology", "Design Thinking Methodology", "methodology", ["design thinking", "double diamond process", "empathize define ideate prototype test", "human-centered design hcd"]),
];
