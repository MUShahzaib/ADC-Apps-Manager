const loading = document.getElementById('loading');
const updatePopup = document.getElementById('updatePopup');
const updateAppId = document.getElementById('updateAppId');
const updateAppName = document.getElementById('updateAppName');
const updateShowAds = document.getElementById('updateShowAds');
const updateShowTestAds = document.getElementById('updateShowTestAds');
const appsTable = document.getElementById('appsTable').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('search');

const scriptUrl = 'https://script.google.com/macros/s/AKfycbxNsI-kTPU80ikKg10S85EEvUNeZ4kmhrZbdwJ1iVG3hEJIIRWpkmT3ZnEbWzP4vAyx/exec';

function showLoading() {
    loading.style.display = 'flex';
}

function hideLoading() {
    loading.style.display = 'none';
}

function fetchApps() {
    showLoading();
    fetch(scriptUrl + '?action=get')
        .then(response => response.json())
        .then(data => {
            appsTable.innerHTML = '';
            data.forEach((row, index) => {
                if (index === 0) return; // Skip header
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>
                        <button onclick="openUpdatePopup('${row[0]}', '${row[1]}', ${row[2]}, ${row[3]})">Update</button>
                        <button onclick="deleteApp('${row[0]}')">Delete</button>
                    </td>
                `;
                appsTable.appendChild(tr);
            });
            hideLoading();
        });
}

function addApp() {
    const appId = document.getElementById('appId').value;
    const appName = document.getElementById('appName').value;
    const showAds = document.getElementById('showAds').checked;
    const showTestAds = document.getElementById('showTestAds').checked;

    showLoading();
    fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
            action: 'add',
            appId,
            appName,
            showAds,
            showTestAds
        })
    }).then(() => {
        fetchApps();
        hideLoading();
    });
}

function deleteApp(appId) {
    showLoading();
    fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
            action: 'delete',
            appId
        })
    }).then(() => {
        fetchApps();
        hideLoading();
    });
}

function openUpdatePopup(appId, appName, showAds, showTestAds) {
   // console.log("show ads",showAds)
    updateAppId.value = appId;
    updateAppName.value = appName;
    updateShowAds.checked = showAds;
    updateShowTestAds.checked = showTestAds;
    updatePopup.style.display = 'flex';
}

function closePopup() {
    updatePopup.style.display = 'none';
}

function updateApp() {
    const appId = updateAppId.value;
    const appName = updateAppName.value;
    const showAds = updateShowAds.checked;
    const showTestAds = updateShowTestAds.checked;

    showLoading();
    fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
            action: 'update',
            appId,
            appName,
            showAds,
            showTestAds
        })
    }).then(() => {
        fetchApps();
        closePopup();
        hideLoading();
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

fetchApps();