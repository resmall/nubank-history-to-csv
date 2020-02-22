chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "NuCSV",
    title: "Baixar histórico em CSV",
    type: "normal",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener(function(item, tab) {
  "use strict";
  if (item.menuItemId == "NuCSV") {
    chrome.tabs.sendMessage(tab.id, "downloadNubankHistory");
  }
});
