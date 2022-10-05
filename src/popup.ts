export {};
async function makeList(orderd: boolean) {
  let tabs = await chrome.tabs.query({
    currentWindow: true,
  });

  tabs.sort((a, b) => {
    if (a.index < b.index) {
      return -1;
    } else if (a.index > b.index) {
      return 1;
    }
    return 0;
  });

  const lines = [];
  let order = 0;
  for (const tab of tabs) {
    let line = "";
    order++;

    if (typeof tab.title === "undefined") {
      continue;
    }
    const title: string = escapeMarkdownTitle(tab.title);

    if (orderd) {
      line = `${order}. [${title}](${tab.url})`;
    } else {
      line = `- [${title}](${tab.url})`;
    }
    lines.push(line);
  }

  const textarea = document.getElementsByTagName("textarea")[0];
  if (typeof textarea === "undefined") {
    return;
  }

  textarea.textContent = lines.join("\n");
}

function escapeMarkdownTitle(title: string): string {
  return title.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}
await makeList(false);

document
  .getElementById("button-bullet")
  ?.addEventListener("click", async () => {
    await makeList(false);
  });
document
  .getElementById("button-orderd")
  ?.addEventListener("click", async () => {
    await makeList(true);
  });
