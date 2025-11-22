document.addEventListener('DOMContentLoaded', function() {
    
    // --- GLOBAL VARIABLES ---
    let map = null; // Global map instance
    let currentMarker = null;

    // --- 1. ANIMATE ON SCROLL ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // --- 2. TRACKING FORM LISTENER ---
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const trackingInput = document.getElementById('trackingInput');
            const trackingNumber = trackingInput.value.trim();
            
            if (trackingNumber) {
                // If we are on tracking.html, fetch directly
                if (window.location.pathname.includes('tracking.html')) {
                    resetUI();
                    fetchTrackingData(trackingNumber);
                } else {
                    // If on home page, save and redirect
                    localStorage.setItem('trackingNumberToSearch', trackingNumber);
                    window.location.href = `tracking.html?id=${trackingNumber}`;
                }
            }
        });
    }

    // --- 3. PAGE LOAD LOGIC ---
    // Check if we should run tracking immediately (URL param or LocalStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const trackingIdFromUrl = urlParams.get('id');
    const trackingIdFromStorage = localStorage.getItem('trackingNumberToSearch');
    const trackingNumber = trackingIdFromUrl || trackingIdFromStorage;

    if (trackingNumber && document.getElementById('results-content')) {
        localStorage.removeItem('trackingNumberToSearch'); 
        // Fill the search box
        const input = document.getElementById('trackingInput');
        if(input) input.value = trackingNumber;
        
        resetUI();
        fetchTrackingData(trackingNumber);
    }

    // --- 4. FETCH DATA (SheetDB) ---
    function fetchTrackingData(id) {
        // Show Spinner
        document.getElementById('loading-spinner').classList.remove('d-none');
        
        // YOUR API URL
        const apiUrl = `https://sheetdb.io/api/v1/4v9hnyzvha1st/search?TrackingNumber=${id}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                document.getElementById('loading-spinner').classList.add('d-none');
                if (data.length > 0) {
                    updateDashboard(data[0]);
                } else {
                    showError();
                }
            })
            .catch(error => {
                console.error('API Error:', error);
                document.getElementById('loading-spinner').classList.add('d-none');
                showError();
            });
    }

    // --- 5. UPDATE DASHBOARD UI ---
    function updateDashboard(data) {
        const results = document.getElementById('results-content');
        const errorMsg = document.getElementById('error-message');
        
        // Hide Error, Show Results
        errorMsg.classList.add('d-none');
        results.classList.remove('d-none');

        // 1. Update Header Info
        document.getElementById('res-id').textContent = data.TrackingNumber;
        document.getElementById('res-status').textContent = data.StatusText;
        document.getElementById('res-eta').textContent = data.ETA || 'Pending';
        document.getElementById('map-loc-name').textContent = data.CurrentLocation;
        
        // 2. Calculate Progress
        const status = data.StatusText.toLowerCase();
        let progress = 10;
        if (status.includes('transit')) progress = 50;
        if (status.includes('out')) progress = 75;
        if (status.includes('delivered')) progress = 100;
        document.getElementById('res-progress').style.width = `${progress}%`;

        // 3. Generate Timeline
        const timelineContainer = document.getElementById('timeline-container');
        timelineContainer.innerHTML = ''; // Clear old

        const historyEvents = data.History.split('|').map(item => item.trim());
        // Simple logic: Assumes the LAST item in the list is the most recent
        // Adjust this index logic if your sheet order is reversed
        
        historyEvents.forEach((eventText, index) => {
            const li = document.createElement('li');
            
            // Determine state based on position in array
            // (This is a simplification, usually you compare dates)
            let stateClass = 'incomplete'; 
            if (index === 0) stateClass = 'active'; // Top item is active
            else stateClass = 'completed';

            const iconContent = (stateClass === 'completed') ? '<i class="bi bi-check"></i>' : '';
            
            li.className = `timeline-item ${stateClass}`;
            li.innerHTML = `
                <div class="timeline-icon">${iconContent}</div>
                <div class="timeline-body">${eventText}</div>
            `;
            timelineContainer.appendChild(li);
        });

        // 4. Show Map Widget
        document.getElementById('map-widget').style.display = 'block';

        // 5. Initialize Map
        initializeMap(data);
    }

    // --- 6. MAP LOGIC ---
    function initializeMap(data) {
        const locationName = data.CurrentLocation;
        
        // Ensure container exists
        if (!document.getElementById('tracking-map')) return;

        // Helper to Create Map
        const drawMap = (lat, lng) => {
            // Remove old map if exists to prevent error
            if (map !== null) {
                map.remove();
                map = null;
            }

            // Create new map
            map = L.map('tracking-map').setView([lat, lng], 13);

            // Use "Light" tiles for Pro look
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            // Custom Marker
            const truckIcon = L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/713/713311.png',
                iconSize: [38, 38],
                iconAnchor: [19, 19],
                popupAnchor: [0, -20]
            });

            L.marker([lat, lng], {icon: truckIcon}).addTo(map)
                .bindPopup(`<b>${data.StatusText}</b><br>${locationName}`)
                .openPopup();
                
            // Force resize calculation after a small delay
            setTimeout(() => { map.invalidateSize(); }, 200);
        };

        // Logic: Check Coordinates first, then Geocode
        if (data.MapCoordinates && data.MapCoordinates.includes(',')) {
            try {
                const [lat, lon] = data.MapCoordinates.split(',').map(Number);
                drawMap(lat, lon);
            } catch (e) { console.error('Coord parse error', e); }
        } else {
            // Geocode Fallback
            const geoApiKey = '9948205a702f123424ebbc0a480abb16'; // Your Key
            const geoApiUrl = `https://api.positionstack.com/v1/forward?access_key=${geoApiKey}&query=${encodeURIComponent(locationName)}`;

            fetch(geoApiUrl)
                .then(res => res.json())
                .then(geoData => {
                    if (geoData.data && geoData.data.length > 0) {
                        drawMap(geoData.data[0].latitude, geoData.data[0].longitude);
                    }
                })
                .catch(err => console.error("Geocode Error", err));
        }
    }

    // --- HELPER FUNCTIONS ---
    function resetUI() {
        document.getElementById('results-content').classList.add('d-none');
        document.getElementById('error-message').classList.add('d-none');
        document.getElementById('map-widget').style.display = 'none';
    }

    function showError() {
        document.getElementById('error-message').classList.remove('d-none');
        document.getElementById('results-content').classList.add('d-none');
    }

});