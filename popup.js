async function makeList(orderd){
    let tabs = await chrome.tabs.query({
        "currentWindow": true,
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
    for ( const tab of tabs ) {
        let line = "";
        order++;
        const title = await escapeMarkdownTitle(tab.title);
        if (orderd) {
            line = `${order}. [${title}](${tab.url})`;
        } else {
            line = `- [${title}](${tab.url})`;
        }
        lines.push(line);
    }

    const textarea = document.getElementsByTagName("textarea")[0];

    textarea.textContent = lines.join("\n");
}
async function escapeMarkdownTitle(title) {
    return title.replaceAll("[", "\\[").replaceAll("]", "\\]");
}
await makeList(false);


document.getElementById("button-bullet").addEventListener(
    "click",
    async () => {
        await makeList(false);
    });
document.getElementById("button-orderd").addEventListener(
    "click",
    async () => {
        await makeList(true);
    });
