// This is the complete and final script.js file with all features.

document.addEventListener('DOMContentLoaded', function() {

    // --- Animation on Scroll Logic ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    });
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // --- Home Page Tracking Form Logic ---
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const trackingInput = document.getElementById('trackingInput');
            const trackingNumber = trackingInput.value.trim();
            if (trackingNumber) {
                localStorage.setItem('trackingNumberToSearch', trackingNumber);
                window.location.href = `tracking.html?id=${trackingNumber}`;
            } else {
                alert('Please enter a valid tracking number.');
            }
        });
    }

    // --- Tracking Results Page Logic ---
    const resultsContainer = document.getElementById('tracking-results-container');
    if (resultsContainer) {
        // Create a URL object from the current page's URL
        const urlParams = new URLSearchParams(window.location.search);
        // Try to get the tracking ID from the URL (e.g., from ?id=PKG-123)
        const trackingIdFromUrl = urlParams.get('id');
        // Fallback to getting it from localStorage (old method, for safety)
        const trackingIdFromStorage = localStorage.getItem('trackingNumberToSearch');

        // Decide which tracking number to use: URL is priority
        const trackingNumber = trackingIdFromUrl || trackingIdFromStorage;

        if (trackingNumber) {
            // Clear storage so it doesn't interfere with future link clicks
            localStorage.removeItem('trackingNumberToSearch'); 
            fetchTrackingData(trackingNumber);
        } else {
            // If no ID is found in the URL or storage, show an error.
            showError();
        }
    }

    function fetchTrackingData(trackingNumber) {
        // !!! IMPORTANT: REPLACE WITH YOUR SheetDB API URL !!!
        const apiUrl = `https://sheetdb.io/api/v1/4v9hnyzvha1st/search?TrackingNumber=${trackingNumber}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    displayTrackingResults(data[0]);
                } else {
                    showError();
                }
            })
            .catch(error => {
                console.error('SheetDB API Error:', error);
                showError();
            });
    }

    function displayTrackingResults(data) {
        const loadingSpinner = document.getElementById('loading-spinner');
        const resultsContent = document.getElementById('results-content');
        
        const status = data.StatusText.toLowerCase();
        let progress = 10;
        if (status.includes('in transit')) progress = 50;
        if (status.includes('out for delivery')) progress = 75;
        if (status.includes('delivered') || status.includes('completed')) progress = 100;
        
        const historyEvents = data.History.split('|').map(item => item.trim());
        const currentStatusIndex = historyEvents.findIndex(event => event.toLowerCase() === data.StatusText.toLowerCase());

        const historyItems = historyEvents.map((item, index) => {
            let stateClass = 'incomplete';
            if (index < currentStatusIndex) {
                stateClass = 'completed';
            } else if (index === currentStatusIndex) {
                stateClass = 'active';
            }
            const iconContent = (stateClass === 'completed') ? '<i class="bi bi-check"></i>' : '';
            return `
                <li class="timeline-item ${stateClass}">
                    <div class="timeline-icon">${iconContent}</div>
                    <div class="timeline-body">${item}</div>
                </li>
            `;
        }).join('');

        const resultsHTML = `
            <div class="card shadow-lg">
                <div class="card-header bg-dark text-white">
                    <h3 class="mb-0">Tracking ID: ${data.TrackingNumber}</h3>
                </div>
                <div class="card-body p-4">
                    <div class="row">
                        <div class="col-md-6">
                            <h4>Current Status: <span class="text-primary">${data.StatusText}</span></h4>
                            <p class="lead"><strong>Location:</strong> ${data.CurrentLocation}</p>
                            <p class="lead"><strong>Estimated Delivery:</strong> ${data.ETA}</p>
                        </div>
                        <div class="col-md-6 align-self-center">
                            <div class="progress" style="height: 25px;">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress}%</div>
                            </div>
                        </div>
                    </div>
                    <hr class="my-4">
                    <div class="row">
                        <div class="col-md-6">
                            <h4>Shipment History</h4>
                            <ul class="timeline">${historyItems}</ul>
                        </div>
                        <div class="col-md-6">
                            <h4>Current Location Map</h4>
                            <div id="tracking-map" style="height: 300px; border-radius: 8px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        resultsContent.innerHTML = resultsHTML;
        loadingSpinner.classList.add('d-none');
        resultsContent.classList.remove('d-none');
        
        initializeMap(data);
    }

    function showError() {
        const loadingSpinner = document.getElementById('loading-spinner');
        const errorMessage = document.getElementById('error-message');
        loadingSpinner.classList.add('d-none');
        errorMessage.classList.remove('d-none');
    }

    function initializeMap(data) {
        const mapContainer = document.getElementById('tracking-map');
        const locationName = data.CurrentLocation;

        if (data.MapCoordinates && data.MapCoordinates.includes(',')) {
            try {
                const [lat, lon] = data.MapCoordinates.split(',').map(Number);
                createMap([lat, lon], locationName);
                return;
            } catch (error) {
                console.error("Invalid coordinates in sheet:", error);
            }
        }

        // !!! IMPORTANT: REPLACE WITH YOUR PositionStack API KEY !!!
        const geoApiKey = 'b6409a80dd70b07e3299b7050642b6ab';
        const geoApiUrl = `https://api.positionstack.com/v1/forward?access_key=${geoApiKey}&query=${encodeURIComponent(locationName)}`;

        fetch(geoApiUrl)
            .then(response => response.json())
            .then(geoData => {
                if (geoData.data && geoData.data.length > 0) {
                    const { latitude, longitude } = geoData.data[0];
                    createMap([latitude, longitude], locationName);
                } else {
                    throw new Error('No results found for location.');
                }
            })
            .catch(error => {
                console.error("Geocoding API Error:", error);
                mapContainer.innerHTML = `<p class="text-danger p-3">Could not find location: "${locationName}" on the map.</p>`;
            });
    }

    function createMap(coords, locationName) {
        const map = L.map('tracking-map').setView(coords, 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker(coords).addTo(map)
            .bindPopup(`<b>${locationName}</b>`)
            .openPopup();
    }

}); // End of DOMContentLoaded