document.addEventListener('DOMContentLoaded', function () {
    const csvUrl = 'https://raw.githubusercontent.com/andreidincaBeia/T4.2-Medical-Applications/main/T4.2%20-%20Medical%20Applications.csv';

    let appsData = []; // To store the app data globally
    let categories = new Set(); // To store unique categories
    let trlLevels = new Set(); // To store unique TRL levels
    let platforms = new Set(); // To store unique platforms
    
    // Filter state
    let activeFilters = {
        categories: new Set(),
        trlLevels: new Set(),
        platforms: new Set()
    };

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
                        if (app['TRL level']) {
                            const trlLevel = app['TRL level'].toLowerCase(); // Normalize to lowercase
                            trlLevels.add(trlLevel);
                        }
                        if (app['Where it works']) {
                            // Split platforms by common separators and clean them up
                            const platformText = app['Where it works'].toLowerCase();
                            const platformList = platformText.split(/[,&]+/).map(p => p.trim());
                            platformList.forEach(platform => {
                                if (platform && platform !== '') {
                                    platforms.add(platform);
                                }
                            });
                        }
                    });

                    // Populate filter options
                    populateFilterOptions('categoryOptions', Array.from(categories).map(toSentenceCase).sort(), 'categories');
                    populateFilterOptions('trlOptions', Array.from(trlLevels).map(toSentenceCase).sort(), 'trlLevels');
                    populateFilterOptions('platformOptions', Array.from(platforms).map(toSentenceCase).sort(), 'platforms');
                    
                    displayApps(appsData); // Display all apps initially
                    initializeFilterMenu();
                }
            });
        });

    function initializeFilterMenu() {
        const menuHeader = document.getElementById('filterMenuHeader');
        const menuContent = document.getElementById('filterMenuContent');
        const clearBtn = document.getElementById('clearFiltersBtn');
        const applyBtn = document.getElementById('applyFiltersBtn');

        // Toggle menu
        menuHeader.addEventListener('click', function() {
            menuHeader.classList.toggle('active');
            menuContent.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuHeader.contains(event.target) && !menuContent.contains(event.target)) {
                menuHeader.classList.remove('active');
                menuContent.classList.remove('active');
            }
        });

        // Clear all filters
        clearBtn.addEventListener('click', function() {
            activeFilters.categories.clear();
            activeFilters.trlLevels.clear();
            activeFilters.platforms.clear();
            updateFilterDisplay();
            applyFilters();
        });

        // Apply filters
        applyBtn.addEventListener('click', function() {
            applyFilters();
            menuHeader.classList.remove('active');
            menuContent.classList.remove('active');
        });
    }

    function populateFilterOptions(containerId, options, filterType) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'filter-option';
            optionElement.textContent = option;
            optionElement.dataset.value = option.toLowerCase();
            optionElement.dataset.type = filterType;

            optionElement.addEventListener('click', function() {
                const value = this.dataset.value;
                const type = this.dataset.type;
                
                if (this.classList.contains('selected')) {
                    // Remove from active filters
                    activeFilters[type].delete(value);
                    this.classList.remove('selected');
                } else {
                    // Add to active filters
                    activeFilters[type].add(value);
                    this.classList.add('selected');
                }
                
                updateFilterDisplay();
            });

            container.appendChild(optionElement);
        });
    }

    function updateFilterDisplay() {
        const totalFilters = activeFilters.categories.size + activeFilters.trlLevels.size + activeFilters.platforms.size;
        const filterCount = document.getElementById('filterCount');
        
        if (totalFilters === 0) {
            filterCount.textContent = '0 active';
        } else if (totalFilters === 1) {
            filterCount.textContent = '1 filter active';
        } else {
            filterCount.textContent = `${totalFilters} filters active`;
        }

        // Update option states
        document.querySelectorAll('.filter-option').forEach(option => {
            const value = option.dataset.value;
            const type = option.dataset.type;
            
            if (activeFilters[type].has(value)) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    }

    function applyFilters() {
        let filteredApps = appsData;

        // Filter by categories
        if (activeFilters.categories.size > 0) {
            filteredApps = filteredApps.filter(app => {
                if (!app['Disease']) return false;
                const category = app['Disease'].toLowerCase();
                return activeFilters.categories.has(category);
            });
        }

        // Filter by TRL levels
        if (activeFilters.trlLevels.size > 0) {
            filteredApps = filteredApps.filter(app => {
                if (!app['TRL level']) return false;
                const trlLevel = app['TRL level'].toLowerCase();
                return activeFilters.trlLevels.has(trlLevel);
            });
        }

        // Filter by platforms
        if (activeFilters.platforms.size > 0) {
            filteredApps = filteredApps.filter(app => {
                if (!app['Where it works']) return false;
                const platformText = app['Where it works'].toLowerCase();
                return Array.from(activeFilters.platforms).some(platform => 
                    platformText.includes(platform)
                );
            });
        }

        displayApps(filteredApps);
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
