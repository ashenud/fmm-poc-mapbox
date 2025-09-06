// 🔑 Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYXNoZW51ZCIsImEiOiJjazlsZG83ZDQwM2g0M2dxdTJ5OTQ4OHh1In0.j_bRFfw78u98EwF_pTaNWw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [10, 23.6345],
  zoom: 2,
});

map.on('load', () => {
  // 🌊 Background
  map.setPaintProperty('background', 'background-color', '#6e6fff');
  map.setPaintProperty('background', 'background-opacity', 0.5);

  // 🌍 Country boundaries
  map.addSource('countries', {
    type: 'vector',
    url: 'mapbox://mapbox.country-boundaries-v4',
  });

  map.addLayer({
    id: 'land-fills',
    type: 'fill',
    source: 'countries',
    'source-layer': 'country_boundaries',
    paint: {
      'fill-color': '#ffffff',
      'fill-opacity': 1,
    },
  });

  map.addLayer({
    id: 'land-borders',
    type: 'line',
    source: 'countries',
    'source-layer': 'country_boundaries',
    paint: {
      'line-color': '#c0c0c0',
      'line-width': 0.5,
    },
  });

  // 🎥 Zoom smoothly into the US
  map.flyTo({
    center: [-98.5795, 39.8283], // roughly geographic center of US
    zoom: 3.5,
    speed: 0.6,
  });
});

// 📊 Load login data
fetch('data/logins.json')
  .then((res) => res.json())
  .then((cities) => {
    // total users
    const total = cities.reduce((sum, c) => sum + c.userCount, 0);
    $('#totalUsers').text(total.toLocaleString());

    // top 5
    const sorted = [...cities].sort((a, b) => b.userCount - a.userCount);
    $('#topList').empty();
    sorted.slice(0, 5).forEach((c) => {
      $('#topList').append(`
        <div class="d-flex justify-content-between small">
          <span>${c.title}</span>
          <span class="fw-bold">${c.userCount}</span>
        </div>
      `);
    });

    // markers
    cities.forEach((city) => {
      const card = document.createElement('div');
      card.className = 'city-card';
      card.innerHTML = `
        <div class="popup-card">
          <strong>${city.title}</strong><br>
          <small>Users: ${city.userCount}</small>
        </div>
      `;

      new mapboxgl.Marker({
        element: card,
        anchor: 'bottom',
      })
        .setLngLat([city.longitude, city.latitude])
        .addTo(map);
    });
  })
  .catch((err) => console.error('Error loading cities JSON:', err));
