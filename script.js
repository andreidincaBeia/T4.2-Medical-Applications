document.addEventListener('DOMContentLoaded', function () {
    const csvUrl = 'https://raw.githubusercontent.com/andreidincaBeia/T4.2-Medical-Applications/35189588daf570e870e14ba0bc65012b883c04f0/T4.2%20-%20Medical%20Applications.csv';

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function(results) {
                    const appsData = results.data.filter(app => app['Name of aplication'] && app['Icon App Link'] && app['Description'] && app['Link Google Play'] && app['Website'] && app['Link AppStore']); // Filter out invalid rows
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
                        appDescription.textContent = app['Description'];
                        appDetails.appendChild(appDescription);

                        const buttonContainer = document.createElement('div');
                        buttonContainer.classList.add('button-container');

                        const appButton = document.createElement('a');
                        appButton.classList.add('app-button');
                        appButton.textContent = 'Website';
                        appButton.href = app['Website'];
                        appButton.target = '_blank'; // Open link in new tab
                        appDetails.appendChild(appButton);

                        const appButton2 = document.createElement('a');
                        appButton2.classList.add('app-button');
                        appButton2.textContent = 'Google Play';
                        appButton2.href = app['Link Google Play'];;
                        buttonContainer.appendChild(appButton2);

                        const appButton3 = document.createElement('a');
                        appButton3.classList.add('app-button');
                        appButton3.textContent = 'App Store';
                        appButton3.href = app['Link AppStore'];;
                        buttonContainer.appendChild(appButton3);


                        appDetails.appendChild(buttonContainer);
                        appCard.appendChild(appDetails);
                        appContainer.appendChild(appCard);
                    });
                }
            });
        });
});

function adjustContentPadding() {
    var header = document.getElementById('page-title');
    var content = document.getElementById('appContainer');
    var headerHeight = header.offsetHeight;
    content.style.paddingTop = headerHeight + 'px';
  }

  // Adjust padding on load
  window.onload = adjustContentPadding;

  // Adjust padding if the window is resized
  window.onresize = adjustContentPadding;
