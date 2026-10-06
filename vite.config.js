import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// Every HTML page must be listed here, or `npm run build` leaves it out.
// If you already have a vite.config.js, keep your existing settings and
// only add the build.rollupOptions.input block.
const page = (file) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: page("./index.html"),
        about: page("./about.html"),
        privacy: page("./privacy.html"),
        terms: page("./terms.html"),
        impactmakers: page("./impactmakers.html"),
        impactmaker: page("./impactmaker.html"),
        becomeImpactmaker: page("./become-impactmaker.html"),
        listProject: page("./list-project.html"),

        "all-opportunities": page("./all-opportunities.html"),
        "all-projects": page("./all-projects.html"),
        detail: page("./detail.html"),
        sdgs: page("./sdgs.html"), 
        sdg: page("./sdg.html"),
      },
    },
  },
});
