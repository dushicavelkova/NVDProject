<template>
  <NavBar />

  <!-- Hero -->
  <section class="hero">
    <!-- Slideshow background -->
    <div class="slideshow">
      <div
          v-for="(img, index) in images"
          :key="index"
          class="slide"
          :class="{ active: currentSlide === index }"
          :style="{ backgroundImage: `url(${img})` }"
      ></div>
      <div class="overlay"></div>
    </div>
    <!--Hello-->
    <!-- Hero content -->
    <div class="hero-content">
      <p class="hero-label">Est. 2026 — Premium Grooming</p>
      <h1>The Art of<br/>The Perfect Cut</h1>
      <p class="hero-sub">Where tradition meets precision. Step in, leave sharp.</p>
      <a href="#booking" class="btn">Book Your Session</a>
    </div>
  </section>

  <BarberMap></BarberMap>
  <!-- Services -->
  <section class="services" id="services">
    <p class="section-label">What We Offer</p>
    <h2>Our Services</h2>
    <div class="grid">
      <ServiceCard
          icon="✂️"
          title="Classic Cut"
          description="A timeless haircut tailored to your face shape and style."
          price="$25"
      />
      <ServiceCard
          icon="🪒"
          title="Hot Shave"
          description="Traditional straight razor shave with hot towel treatment."
          price="$35"
      />
      <ServiceCard
          icon="👑"
          title="The Full Package"
          description="Haircut, beard trim, hot shave and styling — the works."
          price="$65"
      />
    </div>
  </section>


  <!-- Booking -->
  <section class="booking" id="booking">
    <p class="section-label">Ready?</p>
    <h2>Book Your Appointment</h2>
    <p class="booking-sub">Walk-ins welcome. Reservations preferred.</p>
    <a href="tel:+1234567890" class="btn">Call to Book</a>
  </section>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import ServiceCard from './components/ServiceCard.vue'
import BarberMap from './components/BarberMap.vue'
import { ref, onMounted, onUnmounted } from 'vue'

import hero1 from './assets/hero1.jpg'
import hero2 from './assets/hero2.jpg'
import hero3 from './assets/hero3.jpg'

const images = [hero1, hero2, hero3]
const currentSlide = ref(0)
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % images.length
  }, 4000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
/* Hero */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Slideshow */
.slideshow {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.2s ease;
}
.slide.active {
  opacity: 1;
}
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 1;
}

/* Hero content */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 4rem 2rem;
}
.hero-label {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.5rem;
}
.hero-content h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
}
.hero-sub {
  color: var(--muted);
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Button */
.btn {
  display: inline-block;
  padding: 0.9rem 2.5rem;
  border: 1px solid var(--gold);
  color: var(--gold);
  text-decoration: none;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.2s;
  border-radius: 2px;
}
.btn:hover {
  background: var(--gold);
  color: var(--bg);
}

/* Services */
.services {
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
.services h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* Booking */
.booking {
  padding: 6rem 3rem;
  text-align: center;
}
.booking h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.booking-sub {
  color: var(--muted);
  margin-bottom: 2.5rem;
}
</style>