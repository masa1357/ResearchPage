// DOMContentLoadedイベントリスナーを追加
document.addEventListener("DOMContentLoaded", function () {
  // HTMLファイルから渡されたcsvFilePathを取得
  const tableElement = document.querySelector("table[csvfilepath]");
  const csvFilePath = tableElement
    ? tableElement.getAttribute("csvfilepath")
    : null;

  // fetchを使ってCSVファイルを読み込む
  fetch(csvFilePath)
    .then((response) => response.text())
    .then((data) => {
      // CSVデータを処理する
      processCSVData(data);
    })
    .catch((error) => {
      console.error("CSVファイルの読み込みに失敗しました:", error);
    });
});

function processCSVData(csvData) {
  const rows = csvData.split("\n");
  const tbody = document.getElementById("tableContainer");

  for (let i = 1; i < rows.length; i++) {
    const rowData = rows[i].split(",");
    if (rowData[0].trim() !== "") {
      const tr = document.createElement("tr");

      // Date (as `th` instead of `td`)
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = rowData[0]; // 仮定: 最初の列は日付
      tr.appendChild(th);

      // Title and other columns
      for (let j = 1; j < rowData.length; j++) {
        const td = document.createElement("td");

        if (j > 1) {
          // 仮定: 3列目以降はリンクが必要
          if (rowData[j].trim() !== "") {
            const a = document.createElement("a");
            a.href = rowData[j];
            a.target = "_blank";

            const icon = getIconName(j);
            if (icon) {
              const svg = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              );
              svg.setAttribute("width", "24");
              svg.setAttribute("height", "24");
              svg.setAttribute("fill", "currentColor");

              const use = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "use"
              );
              use.setAttribute("href", `${icon}`);

              svg.appendChild(use);
              a.appendChild(svg);
            }
            td.appendChild(a);
          }
        } else {
          td.textContent = rowData[j];
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }
}

function getIconName(cellIndex) {
  const iconPaths = {
    2: "#icon-pdf",
    3: "#icon-ppt",
    4: "#icon-abst",
    5: "#icon-tex",
  };

  return iconPaths[cellIndex] || null;
}
