export function highlightJson(json: string): string {
  const safeJson = escapeHtml(json);

  return safeJson.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "color:rgb(0, 0, 0)"; // key - cyan
        } else {
          cls = "color:rgb(209, 59, 0)"; // string - light green/orange
        }
      } else if (/true|false/.test(match)) {
        cls = "color:rgb(199, 0, 182)"; // boolean - magenta
      } else if (/null/.test(match)) {
        cls = "color:rgb(70, 70, 70)"; // null - gray
      } else {
        cls = "color:rgb(33, 105, 0)"; // number - blue
      }
      return `<span style="${cls}">${match}</span>`;
    }
  );
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
