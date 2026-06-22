<template>
  <section class="map-section" id="map">
    <p class="section-label">Find Us</p>
    <h2>Choose Your Region</h2>
    <p class="map-sub">Click a city marker to see available barber shops</p>
    <div class="global-search">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search city or barber shop..."
      class="booking-input"
    />
  </div>
    <div class="top-rated">
    <h3>🏆 Top Rated Barbers</h3>

    <div
      v-for="shop in topRatedShops"
      :key="shop.id"
      class="top-rated-card"
    >
      <span>{{ shop.name }}</span>
      <span>⭐ {{ shop.rating }}</span>
    </div>
  </div>

    <div class="map-wrapper">
      <div id="leaflet-map" class="leaflet-map"></div>

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
              v-for="shop in filteredRegions"
              :key="shop.id"
              class="shop-card"
              :class="{ chosen: chosenShop?.id === shop.id }"
              @click="
                chosenShop = shop;
                selectedDate = '';
                selectedTime = '';
                appointmentConfirmed = false;
              "
            >
              <div class="shop-top">
                <span class="shop-name">{{ shop.name }}</span>
                <span class="shop-rating">★ {{ shop.rating }}</span>
              </div>
              <p class="shop-address">📍 {{ shop.address }}</p>
              <p class="shop-phone">📞 {{ shop.phone }}</p>

              <div v-if="chosenShop?.id === shop.id" class="booking-box">
                <p class="time-title">Select Service</p>
                <div class="filters">
                  <select v-model="sortBy" class="booking-input">
                    <option value="">Sort by</option>
                    <option value="rating">Rating (high to low)</option>
                  </select>
                </div>

                <div class="times-grid">
                  <button
                    v-for="s in services"
                    :key="s"
                    type="button"
                    class="time-btn"
                    :class="{ activeTime: selectedService === s }"
                    @click.stop="selectedService = s"
                  >
                    {{ s }}
                  </button>
                </div>
                
                <p v-if="selectedService" class="success-message">
                  Price: {{ servicePrices[selectedService] }} €
                </p>

                <label>Select Date</label>
                <input
                  type="date"
                  v-model="selectedDate"
                  @change="appointmentConfirmed = false"
                  class="booking-input"
                >

                <p class="time-title">Select Time</p>
                <div class="times-grid">
                  <button
                    type="button"
                    v-for="time in availableTimes"
                    :key="time"
                    class="time-btn"
                    :class="{
                      activeTime: selectedTime === time,
                      disabled: isBooked(chosenShop?.id, selectedDate, time)
                    }"
                    :disabled="isBooked(chosenShop?.id, selectedDate, time)"
                    @click.stop="
                      selectedTime = time;
                      appointmentConfirmed = false;
                    "
                  >
                    {{ time }}
                  </button>
                </div>

                <button
                  type="button"
                  class="book-btn"
                  @click.stop="confirmBooking"
                  :disabled="!selectedDate || !selectedTime || !selectedService"
                >
                  Confirm Appointment
                </button>

                <p v-if="appointmentConfirmed" class="success-message">
                  ✅ {{ selectedService }} booked for {{ selectedDate }} at {{ selectedTime }}
                  <br>
                  💰 Price: {{ servicePrices[selectedService] }} €
                </p>
              </div> </div> </div> <hr style="border: 0; border-top: 1px solid var(--border); margin: 0;" />

          <section class="my-bookings">
            <h2>My Bookings</h2>

            <p v-if="myBookings.length === 0" style="color: var(--muted); font-size: 0.9rem;">
              No bookings yet.
            </p>

            <div v-for="(b, index) in myBookings" :key="index" class="booking-card">
              <p><strong>{{ b.shop }}</strong></p>
              <p>✂️ {{ b.service }}</p>
              <p>📅 {{ b.date }} at {{ b.time }}</p>
              <p>💰 {{ b.price }} €</p>

              <button class="cancel-btn" @click="cancelBooking(index)">
                Cancel
              </button>
            </div>
          </section>

        </div> </transition>
    </div>
  </section>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { computed, watch } from 'vue'
import { regions } from '../data/barbers.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const selected = ref(null)
const myBookings = ref([])

const selectedDate = ref('')
const selectedTime = ref('')
const searchQuery = ref("")
const selectedCity = ref("")
const sortBy = ref("")
const appointmentConfirmed = ref(false)
const filteredRegions = computed(() => {
  const region = selected.value
  if (!region || !region.shops) return []

  const query = searchQuery.value?.toLowerCase() || ""
  if (!query) return region.shops

  if (region.name.toLowerCase().includes(query)) {
    return region.shops
  }

  return region.shops.filter(shop =>
    shop.name.toLowerCase().includes(query)
  )
})
const confirmBooking = () => {
  if (
    !chosenShop.value ||
    !selectedDate.value ||
    !selectedTime.value ||
    !selectedService.value
  ) return

  const key = `${chosenShop.value.id}_${selectedDate.value}`

  if (!bookedSlots.value[key]) {
    bookedSlots.value[key] = []
  }

  // Спречуваме дуплирање во состојбата на апликацијата
  if (!bookedSlots.value[key].includes(selectedTime.value)) {
    // Чуваме само стринг (на пр. "09:00") наместо објект
    bookedSlots.value[key].push(selectedTime.value)
  }

  localStorage.setItem("bookedSlots", JSON.stringify(bookedSlots.value))

  myBookings.value.push({
    shopId: chosenShop.value.id,
    shop: chosenShop.value.name,
    service: selectedService.value,
    date: selectedDate.value,
    time: selectedTime.value,
    price: servicePrices[selectedService.value]
  })

  localStorage.setItem("myBookings", JSON.stringify(myBookings.value))

  appointmentConfirmed.value = true
}

const cancelBooking = (index) => {
  const booking = myBookings.value[index]
  const key = `${booking.shopId}_${booking.date}`

  if (bookedSlots.value[key]) {
    bookedSlots.value[key] = bookedSlots.value[key].filter(
      t => t !== booking.time
    )
    
    if (bookedSlots.value[key].length === 0) {
      delete bookedSlots.value[key]
    }
  }

  myBookings.value.splice(index, 1)

  localStorage.setItem("myBookings", JSON.stringify(myBookings.value))
  localStorage.setItem("bookedSlots", JSON.stringify(bookedSlots.value))
}

const availableTimes = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00'
]
const chosenShop = ref(null)
const bookedSlots = ref({})
const saved = localStorage.getItem("bookedSlots")
if (saved) {
  bookedSlots.value = JSON.parse(saved)
}

const services = ["Haircut", "Beard", "Fade", "Full cut"]

const selectedService = ref("")

const servicePrices = {
  Haircut: 10,
  Beard: 5,
  Fade: 15,
  "Full cut": 20
}
const topRatedShops = computed(() => {
  return regions
    .flatMap(region => region.shops)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
})
const isBooked = (shopId, date, time) => {
  const key = `${shopId}_${date}`
  return bookedSlots.value[key]?.includes(time) || false
}

watch(chosenShop, () => {
  selectedDate.value = ""
  selectedTime.value = ""
  selectedService.value = ""
  appointmentConfirmed.value = false
})

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
watch(searchQuery, (value) => {
  const query = value.toLowerCase()

  const foundRegion = regions.find(region =>
    region.name.toLowerCase().toLowerCase().includes(query)
  )

  if (foundRegion) {
    selected.value = foundRegion
    return
  }

  const foundShopRegion = regions.find(region =>
    region.shops.some(shop =>
      shop.name.toLowerCase().includes(query)
    )
  )

  if (foundShopRegion) {
    selected.value = foundShopRegion
  }
})

onMounted(() => {
  // Init map centered on Macedonia
  const map = L.map('leaflet-map', {
    center: [41.6, 21.7],
    zoom: 8,
    zoomControl: true,
  })

  const savedBookings = localStorage.getItem("myBookings")
if (savedBookings) {
  myBookings.value = JSON.parse(savedBookings)
}

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
.global-search {
  margin-bottom: 2rem;
  max-width: 500px;
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
.booking-box {
  margin-top: 1rem;
}

.booking-input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.4rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
}

.time-title {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--gold);
}

.times-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.time-btn {
  padding: 0.5rem;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  cursor: pointer;
}

.time-btn:hover {
  border-color: var(--gold);
}

.activeTime {
  background: var(--gold);
  color: black;
}

.success-message {
  margin-top: 1rem;
  color: #4caf50;
  font-weight: 600;
}
.disabled {
  opacity: 0.3;
  pointer-events: none;
}
.my-bookings {
  padding: 1.5rem;
  border-top: 1px solid var(--border);
}
.my-bookings h2 {
  font-size: 1.2rem; 
  margin-bottom: 1rem;
}

.booking-card {
  border: 1px solid var(--border);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background: var(--surface);
}

.cancel-btn {
  margin-top: 0.5rem;
  padding: 0.4rem 1rem;
  border: 1px solid red;
  background: transparent;
  color: red;
  cursor: pointer;
}

.cancel-btn:hover {
  background: red;
  color: white;
}
.top-rated {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 4px;
}

.top-rated h3 {
  margin-bottom: 1rem;
  color: var(--gold);
}

.top-rated-card {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem;
  border-bottom: 1px solid var(--border);
}

.top-rated-card:last-child {
  border-bottom: none;
}

/* Transition */
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from { opacity: 0; transform: translateX(20px); }
.slide-leave-to { opacity: 0; transform: translateX(20px); }

@media (max-width: 768px) {
  .map-wrapper { grid-template-columns: 1fr; }
  .map-section { padding: 4rem 1.5rem; }
}
</style>