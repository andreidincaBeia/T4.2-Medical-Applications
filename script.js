document.addEventListener('DOMContentLoaded', function () {
    const csvUrl = 'https://raw.githubusercontent.com/andreidincaBeia/T4.2-Medical-Applications/main/T4.2%20-%20Medical%20Applications.csv';

    let appsData = []; // To store the app data globally
    let categories = new Set(); // To store unique categories

    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function (results) {
                    // Filter out rows with incomplete data
                    appsData = results.data.filter(app => app['Name of application'] && app['Icon App Link'] && app['Description'] && app['Link Google Play'] && app['Website'] && app['Link AppStore']);

                    // Extract unique categories (case-insensitive)
                    appsData.forEach(app => {
                        if (app['Disease']) {
                            const category = app['Disease'].toLowerCase(); // Normalize to lowercase
                            categories.add(category);
                        }
                    });

                    // Convert categories to sentence case and populate the dropdown
                    populateCategoryFilter(Array.from(categories).map(toSentenceCase));
                    displayApps(appsData); // Display all apps initially
                }
            });
        });

    const filterDropdown = document.getElementById('categoryFilter');
    filterDropdown.addEventListener('change', function () {
        const selectedCategory = filterDropdown.value.toLowerCase(); // Normalize for comparison
        if (selectedCategory === 'all') {
            displayApps(appsData);
        } else {
            const filteredApps = appsData.filter(app => app['Disease'] && app['Disease'].toLowerCase() === selectedCategory);
            displayApps(filteredApps);
        }
    });

    function populateCategoryFilter(categoryList) {
        const filterDropdown = document.getElementById('categoryFilter');
        filterDropdown.innerHTML = ''; // Clear existing options

        // Add "All" option
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All';
        filterDropdown.appendChild(allOption);

        // Add categories dynamically
        categoryList.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase(); // Normalize value for case-insensitive comparison
            option.textContent = category; // Keep in sentence case
            filterDropdown.appendChild(option);
        });
    }

    function displayApps(appList) {
        const appContainer = document.getElementById('appContainer');
        appContainer.innerHTML = ''; // Clear current apps

        appList.forEach(app => {
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
            appName.textContent = app['Name of application'];
            appDetails.appendChild(appName);

            const appDescription = document.createElement('div');
            appDescription.classList.add('app-description');
            appDescription.textContent = app['Description'];
            appDetails.appendChild(appDescription);

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            const appButton = createButton('Website', app['Website']);
            buttonContainer.appendChild(appButton);

            const appButton2 = createButton('Google Play', app['Link Google Play']);
            buttonContainer.appendChild(appButton2);

            const appButton3 = createButton('App Store', app['Link AppStore']);
            buttonContainer.appendChild(appButton3);

            appDetails.appendChild(buttonContainer);
            appCard.appendChild(appDetails);
            appContainer.appendChild(appCard);
        });
    }

    function createButton(text, link) {
        const button = document.createElement('a');
        button.classList.add('app-button');
        button.textContent = text;

        if (link && link !== '-') {
            button.href = link;
            button.target = '_blank';
        } else {
            button.classList.add('disabled');
            button.style.backgroundColor = 'gray';
            button.style.cursor = 'not-allowed';
            button.textContent = `${text} `;
            button.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent default action if clicked
            });
        }

        return button;
    }

    function adjustContentPadding() {
        const header = document.getElementById('overlay');
        const content = document.getElementById('appContainer');
        const headerHeight = header.offsetHeight;
        content.style.paddingTop = headerHeight + 'px';
    }

    // Convert string to sentence case
    function toSentenceCase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Adjust padding on load
    window.onload = adjustContentPadding;

    // Adjust padding if the window is resized
    window.onresize = adjustContentPadding;
});
