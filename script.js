const appId = document.getElementById('appId');
const updatePopup = document.getElementById('updatePopup');
const updateAppId = document.getElementById('updateAppId');
const updateAppName = document.getElementById('updateAppName');
const updatePackageName = document.getElementById('updatePackageName');
const updateShowAds = document.getElementById('updateShowAds');
const updateShowTestAds = document.getElementById('updateShowTestAds');
const updatePlayStoreLink = document.getElementById('updatePlayStoreLink');
const updateAppStoreLink = document.getElementById('updateAppStoreLink');
const updateCreativesLink = document.getElementById('updateCreativesLink');
const appsTable = document.getElementById('appsTable').getElementsByTagName('tbody')[0];
const searchInput = document.getElementById('search');

//const scriptUrl = 'https://script.google.com/macros/s/AKfycbxNsI-kTPU80ikKg10S85EEvUNeZ4kmhrZbdwJ1iVG3hEJIIRWpkmT3ZnEbWzP4vAyx/exec';
const scriptUrl='https://script.google.com/macros/s/AKfycbwO5GCX9kINLt3XN4oKTv5mnLeG2Rw0XATL3SvDituDgGZlEYgUk3iiKx6RCV8qNvPm3Q/exec';

document.addEventListener('DOMContentLoaded',async ()=>{
    await fetchApps();
    appId.focus();
});

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

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

      const appId=row[0];
      const appName=row[1];
      // Convert boolean values to "Yes" or "No"
      const showAds = row[2] === "true" || row[2] === true ? "Yes" : "No";
      const showTestAds = row[3] === "true" || row[3] === true ? "Yes" : "No";
      const packageName=row[4];
      const playStoreLink= row[5];
      const appStoreLink=row[6];
      const creativesLink=row[7];

      const showAdsValue= row[2];
      const showTestAdsValue=row[3];
      //console.log("s",showAdsValue);
     const appInfo={
        appId,appName,packageName,showAdsValue,showTestAdsValue,playStoreLink,appStoreLink,creativesLink
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${appId}</td>
            <td>${packageName}</td>
            <td>${appName}</td>
            <td>${showAds}</td>
            <td>${showTestAds}</td>
            <td><a href='${playStoreLink}' target='_blank'>Store link</a></td>
            <td><a href='${appStoreLink}' target='_blank'>AppStore link</a></td>
            <td><a href='${creativesLink}' target='_blank'>Creatives</a></td>
            <td class="checkbox-group">
            <button class='update-app-btn' onclick="openUpdatePopup('${JSON.stringify(appInfo).replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">
            <i class="fas fa-edit"></i>
            </button></br>
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
    const packageName = document.getElementById('packageName').value;
    const showAds = document.getElementById('showAds').checked;
    const showTestAds = document.getElementById('showTestAds').checked;
    const playStoreLink= document.getElementById('playStoreLink').value;
    const appStoreLink= document.getElementById('appStoreLink').value;
    const creativesLink= document.getElementById('creativesLink').value;


   showPopup("Adding new app...");
    fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
            action: 'add',
            appId,
            appName,
            showAds,
            showTestAds,
            packageName,
            playStoreLink,
            appStoreLink,
            creativesLink
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

function openUpdatePopup(appInfoJson) {
   // console.log('here'+appInfoJson.showTestAdsValue);
    const appInfo = JSON.parse(appInfoJson);
    updateAppId.value = appInfo.appId;
    updateAppName.value = appInfo.appName;
    updatePackageName.value=appInfo.packageName;
    updateShowAds.checked = appInfo.showAdsValue;
    updateShowTestAds.checked = appInfo.showTestAdsValue;
    updatePlayStoreLink.value=appInfo.playStoreLink;
    updateAppStoreLink.value=appInfo.appStoreLink;
    updateCreativesLink.value=appInfo.creativesLink;
    updatePopup.style.display = 'flex';
    updateAppName.focus();
}

 function closePopup() {
    updatePopup.style.display = 'none';
    //await fetchApps();
}

function updateApp() {
    const appId = updateAppId.value;
    const appName = updateAppName.value;
    const showAds = updateShowAds.checked;
    const showTestAds = updateShowTestAds.checked;
    const packageName= updatePackageName.value;
    const playStoreLink= updatePlayStoreLink.value;
    const appStoreLink=updateAppStoreLink.value;
    const creativesLink=updateCreativesLink.value;

   // console.log('playstore link',playStoreLink);

    showPopup("Updating app...");
    fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
            action: 'update',
            appId,
            appName,
            showAds,
            showTestAds,
            packageName,
            playStoreLink,
            appStoreLink,
            creativesLink
        })
    }).then(async () => {
        closePopup();
        await fetchApps();
       // hidePopup();
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

