const appId = document.getElementById('appId');
const updatePopup = document.getElementById('updatePopup');
const updateAppId = document.getElementById('updateAppId');
const updateAppName = document.getElementById('updateAppName');
const updateShowAds = document.getElementById('updateShowAds');
const updateShowTestAds = document.getElementById('updateShowTestAds');
const appsTable = document.getElementById('appsTable').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('search');

//const scriptUrl = 'https://script.google.com/macros/s/AKfycbxNsI-kTPU80ikKg10S85EEvUNeZ4kmhrZbdwJ1iVG3hEJIIRWpkmT3ZnEbWzP4vAyx/exec';
const scriptUrl='https://script.google.com/macros/s/AKfycbySq59sjwoqAJ8kSd2bhqxs7Exp-cIk7TP2Z5c-_tqkFkVV2q0IfAIJDVjqGTfvsRtp5w/exec';

document.addEventListener('DOMContentLoaded',async ()=>{
    await fetchApps();
    appId.focus();
});



async function fetchApps() {
    showPopup("Loading apps...");
    const response=await fetch(scriptUrl + '?action=get');
    const appsData = await response.json(); // Convert to JSON
    loadAppsInTable(appsData);
    hidePopup();
}

function loadAppsInTable(data){
    appsTable.innerHTML = '';
    data.forEach((row, index) => {
      if (index === 0) return; // Skip header

      // Convert boolean values to "Yes" or "No"
      const showAds = row[2] === "true" || row[2] === true ? "Yes" : "No";
      const showTestAds = row[3] === "true" || row[3] === true ? "Yes" : "No";

      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${row[0]}</td>
            <td>${row[1]}</td>
            <td>${showAds}</td>
            <td>${showTestAds}</td>
            <td>
             <button class='update-app-btn' onclick="openUpdatePopup('${row[0]}', '${row[1]}', ${row[2]}, ${row[3]})">
               <i class="fas fa-edit"></i>
             </button>
             <button class='delete-app-btn' onclick="deleteApp('${row[0]}')">
              <i class="fas fa-trash-alt"></i>
             </button>
            </td>
        `;
      appsTable.appendChild(tr);
    });
}

function addApp() {
    const appId = document.getElementById('appId').value;
    const appName = document.getElementById('appName').value;
    const showAds = document.getElementById('showAds').checked;
    const showTestAds = document.getElementById('showTestAds').checked;

   showPopup("Adding new app...");
    fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
            action: 'add',
            appId,
            appName,
            showAds,
            showTestAds
        })
    }).then(async () => {
        await fetchApps();
        hidePopup();
    });
}

function deleteApp(appId) {
    showPopup("Deleting app...");
    fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
            action: 'delete',
            appId
        })
    }).then(async () => {
        await fetchApps();
        hidePopup();
    });
}

function openUpdatePopup(appId, appName, showAds, showTestAds) {
    updateAppId.value = appId;
    updateAppName.value = appName;
    updateShowAds.checked = showAds;
    updateShowTestAds.checked = showTestAds;
    updatePopup.style.display = 'flex';
    updateAppName.focus();
}

function closePopup() {
    updatePopup.style.display = 'none';
}

function updateApp() {
    const appId = updateAppId.value;
    const appName = updateAppName.value;
    const showAds = updateShowAds.checked;
    const showTestAds = updateShowTestAds.checked;

    showPopup("Updating app...");
    fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
            action: 'update',
            appId,
            appName,
            showAds,
            showTestAds
        })
    }).then(async () => {
        await fetchApps();
        closePopup();
        hidePopup();
    });
}

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = appsTable.getElementsByTagName('tr');
    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        let match = false;
        for (let cell of cells) {
            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                match = true;
                break;
            }
        }
        row.style.display = match ? '' : 'none';
    }
});

