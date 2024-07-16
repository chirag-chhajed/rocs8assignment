import { readFile } from "node:fs/promises";
import path from "node:path";

// @reference: https://github.com/disposable-email-domains/disposable-email-domains
export async function loadEmailBlockList() {
  const filePath = path.join(
    import.meta.dirname,
    "..",
    "..",
    "..",
    "public",
    "disposable_email_blocklist.conf",
  );

  const content = await readFile(filePath, {
    encoding: "utf-8",
  });

  return content.split(/\r?\n/).filter((line) => line.trim() !== "");
}
