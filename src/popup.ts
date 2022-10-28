export { };
async function makeList(orderd: boolean, currentTabGroupId: number) {
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
    if (tab.groupId !== currentTabGroupId) {
      continue;
    }
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

async function getCurrentTabGroupId(): Promise<number> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0 && tabs[0] !== undefined) {
    return tabs[0].groupId;
  }
  throw new Error("Current Active Tab Not found.");
}


await makeList(false, await getCurrentTabGroupId());

document
  .getElementById("button-bullet")
  ?.addEventListener("click", async () => {
    await makeList(false, await getCurrentTabGroupId());
  });
document
  .getElementById("button-orderd")
  ?.addEventListener("click", async () => {
    await makeList(true, await getCurrentTabGroupId());
  });
