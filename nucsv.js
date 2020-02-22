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
      csv.push(['Categoria', 'Nome', 'Valor', 'Tags', 'Dia', 'Mes']);

      for (let i = 0; i < all.length; i++) {
        if (all[i].children.length === 6) {
          const elements = all[i].children;
          let tags = Array.from(elements[Fields.TAGS].children);
          tags = tags.length ? tags.map((v) => v.innerText).join(';') : '';
          
          try {
            let transaction = {
              category: elements[Fields.CATEGORY].innerText,
              name: elements[Fields.NAME].innerText,
              amount: elements[Fields.AMOUNT].innerText.replace('.', '').replace(',', '.').replace('R$ ', ''),
              tags,
              day: elements[Fields.TIME].innerText.split(' ')[0],
              month: elements[Fields.TIME].innerText.split(' ')[1]
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
