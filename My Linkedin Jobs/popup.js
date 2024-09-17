document
  .getElementById("start_scraping")
  .addEventListener("click", async () => {
    document.getElementById("progress_text").innerText =
      "Scraping in progress...";
    // Trigger job scraping logic (this needs to be implemented or triggered from the content.js)
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate scraping delay
    document.getElementById("progress_text").innerText = "Scraping completed!";
  });

document.getElementById("clear_all").addEventListener("click", async () => {
  await chrome.storage.local.set({ extractedData: [] });
  document.getElementById("status").innerText =
    "All data cleared successfully.";
  setTimeout(() => {
    document.getElementById("status").innerText = "";
  }, 3000);
});

document.getElementById("download_all").addEventListener("click", async () => {
  const storedData = await chrome.storage.local.get("extractedData");
  if (
    storedData &&
    storedData.extractedData &&
    storedData.extractedData.length > 0
  ) {
    const csvContent = convertToCSV(storedData.extractedData);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "profiles.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(url);
    downloadLink.remove();

    document.getElementById("status").innerText =
      "Data downloaded as profiles.csv.";
  } else {
    document.getElementById("status").innerText =
      "No profiles found in storage.";
  }
  setTimeout(() => {
    document.getElementById("status").innerText = "";
  }, 3000);
});

function convertToCSV(objArray) {
  const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
  const header = Object.keys(array[0]).join(",") + "\r\n";
  const rows = array.map((obj) => Object.values(obj).join(",")).join("\r\n");
  return header + rows;
}
