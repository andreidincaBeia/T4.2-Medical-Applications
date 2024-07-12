document.addEventListener('DOMContentLoaded', function () {
    const csvUrl = 'https://raw.githubusercontent.com/LidiaTeo/T4.2-Medical-Applications/patch-1/T4.2%20-%20Medical%20Applications.csv';

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function(results) {
                    const appsData = results.data.filter(app => app['Name of aplication'] && app['Icon App Link'] && app[' Description'] && app['Link Google Play']); // Filter out invalid rows
                    const appContainer = document.getElementById('appContainer');

                    appsData.forEach(app => {
                        const appCard = document.createElement('div');
                        appCard.classList.add('app-card');

                        const appIcon = document.createElement('img');
                        appIcon.classList.add('app-icon');
                        appIcon.src = app['Icon App Link'];
                        appCard.appendChild(appIcon);

                        const appDetails = document.createElement('div');
                        appDetails.classList.add('app-details');

                        const appName = document.createElement('div');
                        appName.classList.add('app-name');
                        appName.textContent = app['Name of aplication'];
                        appDetails.appendChild(appName);

                        const appDescription = document.createElement('div');
                        appDescription.classList.add('app-description');
                        appDescription.textContent = app[' Description'];
                        appDetails.appendChild(appDescription);

                        const appButton = document.createElement('a');
                        appButton.classList.add('app-button');
                        appButton.textContent = 'Website';
                        appButton.href = app['Link Google Play'];
                        appButton.target = '_blank'; // Open link in new tab
                        appDetails.appendChild(appButton);

                        appCard.appendChild(appDetails);
                        appContainer.appendChild(appCard);
                    });
                }
            });
        });
});
