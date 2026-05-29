<template>
  <section class="map-section" id="map">
    <p class="section-label">Find Us</p>
    <h2>Choose Your Region</h2>
    <p class="map-sub">Click a city marker to see available barber shops</p>

    <div class="map-wrapper">
      <div id="leaflet-map" class="leaflet-map"></div>

      <!-- Shop Panel -->
      <transition name="slide">
        <div class="shop-panel" v-if="selected">
          <div class="panel-header">
            <div>
              <p class="panel-region">{{ selected.name }}</p>
              <p class="panel-count">{{ selected.shops.length }} barber shop{{ selected.shops.length > 1 ? 's' : '' }}</p>
            </div>
            <button class="close-btn" @click="selected = null; chosenShop = null">✕</button>
          </div>
          <div class="shop-list">
            <div
                v-for="shop in selected.shops"
                :key="shop.id"
                class="shop-card"
                :class="{ chosen: chosenShop?.id === shop.id }"
                @click="chosenShop = shop"
            >
              <div class="shop-top">
                <span class="shop-name">{{ shop.name }}</span>
                <span class="shop-rating">★ {{ shop.rating }}</span>
              </div>
              <p class="shop-address">📍 {{ shop.address }}</p>
              <p class="shop-phone">📞 {{ shop.phone }}</p>
              <a v-if="chosenShop?.id === shop.id" :href="'tel:' + shop.phone" class="book-btn">Book Now</a>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { regions } from '../data/barbers.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const selected = ref(null)
const chosenShop = ref(null)

const cityCoords = {
  skopje:       { lat: 41.9981, lng: 21.4254 },
  kumanovo:     { lat: 42.1322, lng: 21.7144 },
  tetovo:       { lat: 42.0103, lng: 20.9716 },
  veles:        { lat: 41.7157, lng: 21.7757 },
  ohrid:        { lat: 41.1231, lng: 20.8016 },
  bitola:       { lat: 41.0297, lng: 21.3294 },
  strumica:     { lat: 41.4378, lng: 22.6430 },
  stip:         { lat: 41.7457, lng: 22.1961 },
  gostivar:     { lat: 41.7957, lng: 20.9083 },
  prilep:       { lat: 41.3447, lng: 21.5542 },
  kavadarci:    { lat: 41.4333, lng: 22.0167 },
  kocani:       { lat: 41.9167, lng: 22.4167 },
  struga:       { lat: 41.1775, lng: 20.6783 },
  negotino:     { lat: 41.4833, lng: 22.0833 },
  debar:        { lat: 41.5239, lng: 20.5239 },
  radovis:      { lat: 41.6333, lng: 22.4667 },
  delcevo:      { lat: 41.9667, lng: 22.7667 },
  berovo:       { lat: 41.7039, lng: 22.8508 },
  gevgelija:    { lat: 41.1417, lng: 22.5017 },
  kriva_palanka:{ lat: 42.2028, lng: 22.3314 },
  vinica:       { lat: 41.8833, lng: 22.5167 },
  sveti_nikole: { lat: 41.8667, lng: 21.9500 },
  probistip:    { lat: 41.9833, lng: 22.1833 },
  kratovo:      { lat: 42.0833, lng: 22.1833 },
  krusevo:      { lat: 41.3667, lng: 21.2500 },
  resen:        { lat: 41.0892, lng: 21.0103 },
  demir_hisar:  { lat: 41.2167, lng: 21.2000 },
  makedonski_brod: { lat: 41.5167, lng: 21.2167 },
  valandovo:    { lat: 41.3167, lng: 22.5667 },
  bogdanci:     { lat: 41.2000, lng: 22.5667 },
  demir_kapija: { lat: 41.4000, lng: 22.2500 },
}

onMounted(() => {
  // Init map centered on Macedonia
  const map = L.map('leaflet-map', {
    center: [41.6, 21.7],
    zoom: 8,
    zoomControl: true,
  })

  // Dark tile layer (matches your site theme)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{
    attribution: '© OpenStreetMap © CARTO',
    maxZoom: 19,
  }).addTo(map)

  // Custom gold marker icon
  const goldIcon = L.divIcon({
    className: '',
    html: `<div style="
      width: 14px; height: 14px;
      background: #2e2e2e;
      border: 2px solid #c9a84c;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })

  const activeIcon = L.divIcon({
    className: '',
    html: `<div style="
      width: 18px; height: 18px;
      background: #c9a84c;
      border: 2px solid #e8c97a;
      border-radius: 50%;
      cursor: pointer;
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })

  const markers = {}

  // Add a marker for each region
  regions.forEach(region => {
    const coords = cityCoords[region.id]
    if (!coords) return

    const marker = L.marker([coords.lat, coords.lng], { icon: goldIcon })
        .addTo(map)
        .bindTooltip(region.name, {
          permanent: true,
          direction: 'top',
          offset: [0, -10],
          className: 'city-tooltip',
        })

    marker.on('click', () => {
      // Reset all markers
      Object.values(markers).forEach(m => m.setIcon(goldIcon))
      // Set active marker
      marker.setIcon(activeIcon)
      selected.value = region
      chosenShop.value = null
    })

    markers[region.id] = marker
  })
})
</script>

<style scoped>
.map-section {
  padding: 6rem 3rem;
  border-bottom: 1px solid var(--border);
}
.section-label {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.75rem;
}
.map-section h2 {
  font-family: var(--font-head);
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.map-sub {
  color: var(--muted);
  margin-bottom: 3rem;
  font-size: 0.95rem;
}
.map-wrapper {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}
.leaflet-map {
  height: 500px;
  border-radius: 4px;
  border: 1px solid var(--border);
  z-index: 0;
}

/* Shop panel */
.shop-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border);
}
.panel-region {
  font-family: var(--font-head);
  font-size: 1.3rem;
  color: var(--text);
}
.panel-count {
  font-size: 0.8rem;
  color: var(--gold);
  margin-top: 2px;
}
.close-btn {
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}
.close-btn:hover { color: var(--text); }
.shop-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 420px;
  overflow-y: auto;
}
.shop-card {
  padding: 1rem 1.2rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}
.shop-card:hover { border-color: var(--gold); transform: translateX(4px); }
.shop-card.chosen { border-color: var(--gold); background: rgba(201,168,76,0.05); }
.shop-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}
.shop-name { font-weight: 500; font-size: 0.95rem; color: var(--text); }
.shop-rating { color: var(--gold); font-size: 0.85rem; }
.shop-address, .shop-phone { font-size: 0.8rem; color: var(--muted); margin-top: 2px; }
.book-btn {
  display: inline-block;
  margin-top: 0.8rem;
  padding: 0.45rem 1.2rem;
  border: 1px solid var(--gold);
  color: var(--gold);
  text-decoration: none;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
  transition: all 0.2s;
}
.book-btn:hover { background: var(--gold); color: var(--bg); }

/* Transition */
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from { opacity: 0; transform: translateX(20px); }
.slide-leave-to { opacity: 0; transform: translateX(20px); }

@media (max-width: 768px) {
  .map-wrapper { grid-template-columns: 1fr; }
  .map-section { padding: 4rem 1.5rem; }
}
</style>