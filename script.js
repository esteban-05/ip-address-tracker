// 1. Inicializar el mapa (centrado en una coordenada por defecto)
const map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Icono personalizado para el marcador
const customIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [46, 56],
    iconAnchor: [23, 56]
});

let marker;

// 2. Elementos del DOM
const searchForm = document.getElementById('search-form');
const ipInput = document.getElementById('ip-input');
const ipDisplay = document.getElementById('ip-display');
const locationDisplay = document.getElementById('location-display');
const timezoneDisplay = document.getElementById('timezone-display');
const ispDisplay = document.getElementById('isp-display');

// 3. Función para obtener datos de la API
async function getIpData(query = '') {
    const apiKey = 'at_phPv3ZiuTpeiBNi5250gFJURQAswf'; // 
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${query}&domain=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        alert("No se pudo encontrar la información. Revisa la IP o dominio.");
        console.error(error);
    }
}

// 4. Función para actualizar la interfaz y el mapa
function updateUI(data) {
    const { ip, location, isp, as } = data;

    // Actualizar texto
    ipDisplay.innerText = ip;
    locationDisplay.innerText = `${location.city}, ${location.region} ${location.postalCode}`;
    timezoneDisplay.innerText = `UTC ${location.timezone}`;
    ispDisplay.innerText = isp;

    // Actualizar Mapa
    const lat = location.lat;
    const lng = location.lng;

    map.setView([lat, lng], 13);

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    }
}

// 5. Escuchar el evento del formulario
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (ipInput.value !== '') {
        getIpData(ipInput.value);
    }
});

// 6. Cargar la IP del usuario al iniciar
getIpData();