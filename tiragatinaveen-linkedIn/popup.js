
document.getElementById('clear_all').addEventListener('click',async()=>{
    await chrome.storage.local.set({ 'extractedData': [] });
})

document.getElementById('download_all').addEventListener('click',async()=>{
    const storedData = await chrome.storage.local.get('extractedData')
    console.log(storedData.extractedData)
    if (storedData) {
        const csvContent = convertToCSV(storedData.extractedData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        console.log(url)
        
        let downloadLink = document.createElement('a');

        downloadLink.href = window.URL.createObjectURL(blob);;
        downloadLink.download = 'profiles.csv';
        downloadLink.dataset.downloadurl = ['text/csv', downloadLink.download, downloadLink.href].join(':');
        document.body.appendChild(downloadLink);
        setTimeout(() => {
            downloadLink.click(); // Programmatically click the hidden download link
            URL.revokeObjectURL(url); // Clean up the object URL after download
        }, 2000);
        
        downloadLink.remove();

        console.log('Data is ready for download as profiles.csv');
    } else {
        console.log("No profiles found in localStorage.");
    }
})
function convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    const header = Object.keys(array[0]).join(',') + '\r\n';
    const rows = array.map(obj => Object.values(obj).join(',')).join('\r\n');
    return header + rows;
}