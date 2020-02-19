(function() {
  "use strict";
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('chamou')
    if (request == "downloadNubankHistory") {
      let table = document.getElementById("feedTable");
      if (table === null) {
        alert(
          'Histórico não encontrado, certifique-se de estar na aba "Histórico".'
        );
        return;
      }

      let all = document.querySelectorAll(".transaction");
      const Fields = {
        TYPE: 0,
        CATEGORY: 1,
        NAME: 2,
        AMOUNT: 3,
        TAGS: 4,
        TIME: 5
      };

      const csv = [];

      for (let i = 0; i < all.length; i++) {
        if (all[i].children.length === 6) {
          try {
            let transaction = {
              category: all[i].children[Fields.CATEGORY].innerText,
              name: all[i].children[Fields.NAME].innerText,
              amount: all[i].children[Fields.AMOUNT].innerText.replace('.', '').replace(',', '.'),
              tags: all[i].children[Fields.TAGS].innerText,
              time: all[i].children[Fields.TIME].innerText
            };
            csv.push(Object.values(transaction));
          } catch (e) {
            console.error(
              "Não foi possível importar, formato incorreto.",
              all[i].children
            );
          }
        }
      }

      let downloadLink = document.createElement("a");
      let fileName = prompt("Nome do arquivo: ", "Extrato Nubank");
      if (fileName == null) return;
      downloadLink.download = fileName != "" ? fileName + ".csv" : "table.csv";
      downloadLink.href = window.URL.createObjectURL(
        new Blob([csv.join("\r\n")], { type: "text/csv" })
      );
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }
  });
})();
