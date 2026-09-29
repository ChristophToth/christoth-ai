/** Small Markdown renderer for METHODOLOGY.md. Enough for headings, lists, links, and code. */

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inline(value: string): string {
  const linked = escapeHtml(value).replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_match, label: string, href: string) => {
      const safeHref = href.startsWith("http") || href.startsWith("/") || href.startsWith("#") ? href : "#";
      return `<a href="${safeHref}">${label}</a>`;
    },
  );
  return linked
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const parts: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (line.startsWith("```")) {
      const buffer: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? "").startsWith("```")) {
        buffer.push(lines[index] ?? "");
        index += 1;
      }
      index += 1;
      parts.push(`<pre><code>${escapeHtml(buffer.join("\n"))}</code></pre>`);
      continue;
    }

    if (line.trim().length === 0) {
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const buffer: string[] = [];
      while (index < lines.length && (lines[index] ?? "").startsWith("|")) {
        buffer.push(lines[index] ?? "");
        index += 1;
      }
      parts.push(`<pre class="table">${escapeHtml(buffer.join("\n"))}</pre>`);
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1]?.length ?? 1;
      parts.push(`<h${level}>${inline(heading[2] ?? "")}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      const buffer: string[] = [];
      while (index < lines.length && (lines[index] ?? "").startsWith("> ")) {
        buffer.push((lines[index] ?? "").slice(2));
        index += 1;
      }
      parts.push(`<blockquote><p>${inline(buffer.join(" "))}</p></blockquote>`);
      continue;
    }

    if (line.startsWith("- ")) {
      const buffer: string[] = [];
      while (index < lines.length && (lines[index] ?? "").startsWith("- ")) {
        buffer.push(`<li>${inline((lines[index] ?? "").slice(2))}</li>`);
        index += 1;
      }
      parts.push(`<ul>${buffer.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const buffer: string[] = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index] ?? "")) {
        buffer.push(`<li>${inline((lines[index] ?? "").replace(/^\d+\.\s/, ""))}</li>`);
        index += 1;
      }
      parts.push(`<ol>${buffer.join("")}</ol>`);
      continue;
    }

    if (line.trim() === "---") {
      parts.push("<hr>");
      index += 1;
      continue;
    }

    const buffer: string[] = [];
    while (index < lines.length) {
      const current = lines[index] ?? "";
      if (
        current.trim().length === 0 ||
        current.startsWith("#") ||
        current.startsWith("```") ||
        current.startsWith("|") ||
        current.startsWith("- ") ||
        current.startsWith("> ") ||
        /^\d+\.\s/.test(current) ||
        current.trim() === "---"
      ) {
        break;
      }
      buffer.push(current);
      index += 1;
    }
    parts.push(`<p>${inline(buffer.join(" "))}</p>`);
  }

  return parts.join("\n");
}
