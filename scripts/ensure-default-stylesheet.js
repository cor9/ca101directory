/* Ensures the default stylesheet file exists in the Next.js build output.
 * Some Next.js runtimes attempt to read `.next/browser/default-stylesheet.css`.
 * This script creates a minimal placeholder so the file is always present.
 */

const fs = require("fs");
const path = require("path");

function ensureDefaultStylesheet() {
  const browserDir = path.join(process.cwd(), ".next", "browser");
  const targetFile = path.join(browserDir, "default-stylesheet.css");

  try {
    fs.mkdirSync(browserDir, { recursive: true });
    if (!fs.existsSync(targetFile)) {
      fs.writeFileSync(
        targetFile,
        "/* Placeholder default stylesheet to satisfy runtime lookup */\n",
        "utf8",
      );
    }
    // eslint-disable-next-line no-console
    console.log("[ensure-default-stylesheet] ensured", targetFile);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[ensure-default-stylesheet] failed", error);
    process.exit(1);
  }
}

ensureDefaultStylesheet();
