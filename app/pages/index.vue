<script setup>
useSeoMeta({
  title: 'Lerntherapie Software für selbstständige Therapeutinnen und Therapeuten | Unburdy',
  description: 'Verwalte deine Lerntherapie-Praxis einfach & DSGVO-konform – mit der Software speziell für selbstständige Lerntherapeutinen und Lerntherapeuten. Jetzt 14 Tage kostenlos testen!',
  ogTitle: 'Lerntherapie Software für selbstständige Therapeutinnen und Therapeuten | Unburdy',
  ogDescription: 'Verwalte deine Lerntherapie-Praxis einfach & DSGVO-konform – mit der Software speziell für selbstständige Lerntherapeutinen und Lerntherapeuten. Jetzt 14 Tage kostenlos testen!',
  twitterTitle: 'Lerntherapie Software für selbstständige Therapeutinnen und Therapeuten | Unburdy',
  twitterDescription: 'Verwalte deine Lerntherapie-Praxis einfach & DSGVO-konform – mit der Software speziell für selbstständige Lerntherapeutinen und Lerntherapeuten. Jetzt 14 Tage kostenlos testen!'
})

// Animation setup
onMounted(() => {
  // Create intersection observer for scroll-triggered animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  // Observe all testimonial elements
  const testimonials = document.querySelectorAll('.animate-slide-in-left, .animate-slide-in-right')
  testimonials.forEach((testimonial) => {
    observer.observe(testimonial)
  })

  // Cleanup observer on unmount
  onUnmounted(() => {
    observer.disconnect()
  })
})

// Smooth scroll to testimonials section
const scrollToTestimonials = () => {
  const testimonialsSection = document.getElementById('testimonials')
  if (testimonialsSection) {
    testimonialsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Floating Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="floating-circle floating-circle-1"></div>
      <div class="floating-circle floating-circle-2"></div>
      <div class="floating-circle floating-circle-3"></div>
      <div class="floating-circle floating-circle-4"></div>
      <div class="floating-circle floating-circle-5"></div>
    </div>

    <div class="relative isolate px-6 pt-14 lg:px-8 z-10">
      
      <!-- Hero Section -->
      <div class="mx-auto max-w-7xl py-12 md:py-32 sm:py-48 lg:py-56">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Hero Content -->
          <div class="text-center lg:text-left">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                    Zeit für Menschen.<br />
        Zeit für Entwicklung.<br />
        Zeit für das Wesentliche.<br />
              Lerntherapie einfach verwalten – mit Unburdy
            </h1>
            <p class="mt-6 text-lg leading-8 text-secondary">
              Unburdy ist die intuitive Software für selbstständige Lerntherapeuten und Lerntherapeutinnen. 
              Verwalte Klienten, plane Sitzungen und Lerntherapien, dokumentiere Fortschritte und erstelle Abrechnungen – 
              alles an einem Ort, 100% DSGVO-konform.
            </p>
            
            <!-- Benefits -->
            <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div class="flex items-center justify-center lg:justify-start space-x-2">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
                <span class="text-secondary">Keine medizinische Bürokratie</span>
              </div>
              <div class="flex items-center justify-center lg:justify-start space-x-2">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
                <span class="text-secondary">Hosting in Deutschland</span>
              </div>
              <div class="flex items-center justify-center lg:justify-start space-x-2">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
                <span class="text-secondary">Klarer Fokus auf Lerntherapie</span>
              </div>
              <div class="flex items-center justify-center lg:justify-start space-x-2">
                <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
                <span class="text-secondary">Ab 29 € im Monat</span>
              </div>
            </div>

            
            <div class="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
              <NuxtLink to="/anmelden" class="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                14 Tage kostenlos testen
              </NuxtLink>
              <NuxtLink to="/idee-hinter-unburdy" class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Mehr über Unburdy <span aria-hidden="true">→</span>
              </NuxtLink>
            </div>

            <!-- Scroll to testimonials indicator - Mobile only -->
            <div class="mt-12 flex justify-center lg:hidden">
              <button 
                @click="scrollToTestimonials"
                class="group flex flex-col items-center space-y-2 text-secondary hover:text-primary transition-colors duration-200"
                aria-label="Scroll to testimonials"
              >
                <span class="text-sm font-medium">Mehr entdecken</span>
                <Icon 
                  name="lucide:chevron-down" 
                  class="w-6 h-6 animate-bounce group-hover:text-accent transition-colors duration-200" 
                />
              </button>
            </div>
          </div>

          <!-- Hero Image - Desktop only -->
          <div class="hidden lg:flex justify-center lg:justify-end relative">
            <div class="relative">
              <img 
                src="/images/pexels-olly-3768129.jpg" 
                alt="Zeit für Menschen - Lerntherapie mit Kindern" 
                class="w-64 h-64 rounded-full object-cover shadow-2xl"
              />
              <!-- Overlay text connecting to the claim -->
              <div class="absolute -bottom-4 -right-4 bg-accent text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Zeit für Menschen
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll to testimonials indicator - Desktop only -->
        <div id="testimonials" class="mt-16 hidden lg:flex justify-center">
          <button 
            @click="scrollToTestimonials"
            class="group flex flex-col items-center space-y-2 text-secondary hover:text-primary transition-colors duration-200"
            aria-label="Scroll to testimonials"
          >
            <span class="text-sm font-medium">Mehr entdecken</span>
            <Icon 
              name="lucide:chevron-down" 
              class="w-6 h-6 animate-bounce group-hover:text-accent transition-colors duration-200" 
            />
          </button>
        </div>
      </div>


      <!-- Testimonials Section -->
      <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div class="space-y-20">
          <!-- Testimonial 1 - Image Left -->
          <div class="flex flex-col md:flex-row items-center gap-8 animate-slide-in-left">
            <div class="md:w-1/3 flex-shrink-0">
              <img 
                src="/images/pexels-cottonbro-4098274.jpg" 
                alt="Lerntherapeutin" 
                class="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
              >
            </div>
            <div class="md:w-2/3 relative">
              <div class="text-6xl text-accent/20 font-bold absolute -top-4 -left-4">"</div>
              <blockquote class="text-xl md:text-2xl text-primary leading-relaxed italic pl-8">
                Endlich eine Software, die wirklich für Lerntherapie gemacht ist! 
                Als IT-Laie war ich skeptisch, aber Unburdy ist wirklich kinderleicht. 
                Nach 10 Minuten kann man direkt loslegen.
               </blockquote>
            </div>
          </div>

          <!-- Testimonial 2 - Image Right -->
          <div class="flex flex-col md:flex-row-reverse items-center gap-8 animate-slide-in-right">
            <div class="md:w-1/3 flex-shrink-0">
              <img 
                src="/images/pexels-olly-914931.jpg" 
                alt="Lerntherapeut" 
                class="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
              >
            </div>
            <div class="md:w-2/3 relative text-right">
              <div class="text-6xl text-accent/20 font-bold absolute -top-4 -right-4">"</div>
              <blockquote class="text-xl md:text-2xl text-primary leading-relaxed italic pr-8">
                Die Therapieplanung ist so viel einfacher geworden. Zeitersparnis bis zu 2 Stunden pro Woche. Und alles geht am Notebook oder mit einem Touch am Mobilgerät.
              </blockquote>
            </div>
          </div>

          <!-- Testimonial 3 - Image Left -->
          <div class="flex flex-col md:flex-row items-center gap-8 animate-slide-in-left">
            <div class="md:w-1/3 flex-shrink-0">
              <img 
                src="/images/pexels-olly-859265.jpg" 
                alt="Lerntherapeutin" 
                class="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
              >
            </div>
            <div class="md:w-2/3 relative">
              <div class="text-6xl text-accent/20 font-bold absolute -top-4 -left-4">"</div>
              <blockquote class="text-xl md:text-2xl text-primary leading-relaxed italic pl-8">
                Die DSGVO-Konformität war mir sehr wichtig. Mit Unburdy kann ich entspannt arbeiten, weil ich weiß, dass alles rechtssicher ist. 
              </blockquote>
            </div>
          </div>

          <!-- Testimonial 4 - Image Right -->
          <div class="flex flex-col md:flex-row-reverse items-center gap-8 animate-slide-in-right">
            <div class="md:w-1/3 flex-shrink-0">
              <img 
                src="/images/pexels-shvets-production-7176288.jpg" 
                alt="Lerntherapeutin" 
                class="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
              >
            </div>
            <div class="md:w-2/3 relative text-right">
              <div class="text-6xl text-accent/20 font-bold absolute -top-4 -right-4">"</div>
              <blockquote class="text-xl md:text-2xl text-primary leading-relaxed italic pr-8">
                Die Abrechnung war früher ein Alptraum. Mit Unburdy erstelle ich Rechnungen in Sekunden und behalte den Überblick über alle Zahlungen.
              </blockquote>
            </div>
          </div>

          <!-- Testimonial 5 - Image Left -->
          <div class="flex flex-col md:flex-row items-center gap-8 animate-slide-in-left">
            <div class="md:w-1/3 flex-shrink-0">
              <img 
                src="/images/pexels-pixabay-207756.jpg" 
                alt="Lerntherapeut" 
                class="w-48 h-48 rounded-full object-cover mx-auto shadow-lg"
              >
            </div>
            <div class="md:w-2/3 relative">
              <div class="text-6xl text-accent/20 font-bold absolute -top-4 -left-4">"</div>
              <blockquote class="text-xl md:text-2xl text-primary leading-relaxed italic pl-8">
                In der Lerntherapie ist Zeit kostbar. Unburdy hilft mir, mich auf das Wesentliche zu konzentrieren – die Arbeit mit meinen Klienten.
              </blockquote>
            </div>
          </div>
        </div>
      </div>


      <CallToActionDisturb />

      <!-- Why Unburdy Section -->
      <div class="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 lg:p-12">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold tracking-tight text-primary mb-4">
              Die beste Software für selbstständige Lerntherapeutinnen
            </h2>
            <p class="text-lg text-secondary max-w-3xl mx-auto">
              Andere Tools sind zu komplex, zu teuer oder nicht auf deine Arbeit zugeschnitten. Unburdy ist anders:
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:focus" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-primary mb-2">Keine überflüssigen Funktionen</h3>
              <p class="text-sm text-secondary">Fokus auf das, was du wirklich brauchst</p>
            </div>
            <div>
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:zap" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-primary mb-2">Intuitive Bedienung</h3>
              <p class="text-sm text-secondary">Einfach zu verstehen und zu verwenden</p>
            </div>
            <div>
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:headphones" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-primary mb-2">Direkter Support</h3>
              <p class="text-sm text-secondary">Persönliche Hilfe, wenn du sie brauchst</p>
            </div>
            <div>
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:refresh-cw" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-primary mb-2">Regelmäßig weiterentwickelt</h3>
              <p class="text-sm text-secondary">Mit echten Lerntherapeutinen und Lerntherapeuten</p>
            </div>
          </div>
        </div>
      </div>

          <!-- Image Credits Section (moved above footer) -->
    <div class=" text-center py-4 ">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Bildquelle: Pexels (by cottonbro studio, Olly, Pixabay, SHVETS production)
      </p>
    </div>
      <!-- Bottom decorative elements -->
      <div class="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div class="floating-circle floating-circle-6"></div>
        <div class="floating-circle floating-circle-7"></div>
      </div>
    </div>


  </div>
</template>

<style scoped>
/* Animated Background Gradient */
@keyframes gradientShift {
  0% {
    background: linear-gradient(-45deg, #f8fafc, #ffffff, #f1f5f9, #f8fafc);
    background-size: 200% 200%;
    background-position: 0% 50%;
  }
  50% {
    background: linear-gradient(-45deg, #f1f5f9, #f8fafc, #ffffff, #f1f5f9);
    background-size: 200% 200%;
    background-position: 100% 50%;
  }
  100% {
    background: linear-gradient(-45deg, #f8fafc, #ffffff, #f1f5f9, #f8fafc);
    background-size: 200% 200%;
    background-position: 0% 50%;
  }
}

@keyframes gradientShiftDark {
  0% {
    background: linear-gradient(-45deg, #1e293b, #111827, #1f2937, #1e293b);
    background-size: 200% 200%;
    background-position: 0% 50%;
  }
  50% {
    background: linear-gradient(-45deg, #1f2937, #1e293b, #111827, #1f2937);
    background-size: 200% 200%;
    background-position: 100% 50%;
  }
  100% {
    background: linear-gradient(-45deg, #1e293b, #111827, #1f2937, #1e293b);
    background-size: 200% 200%;
    background-position: 0% 50%;
  }
}

.bg-gradient-animated {
  animation: gradientShift 20s ease-in-out infinite;
  background-size: 200% 200%;
}

@media (prefers-color-scheme: dark) {
  .bg-gradient-animated {
    animation: gradientShiftDark 20s ease-in-out infinite;
  }
}

/* Floating Elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes floatReverse {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(20px) rotate(-180deg);
  }
}

@keyframes drift {
  0% {
    transform: translateX(0px) translateY(0px);
  }
  33% {
    transform: translateX(30px) translateY(-30px);
  }
  66% {
    transform: translateX(-20px) translateY(20px);
  }
  100% {
    transform: translateX(0px) translateY(0px);
  }
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(1px);
}

.floating-circle-1 {
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #3b82f6, #06b6d4);
  top: 10%;
  left: 10%;
  animation: float 8s ease-in-out infinite, drift 12s ease-in-out infinite;
}

.floating-circle-2 {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #06b6d4, #0891b2);
  top: 20%;
  right: 15%;
  animation: floatReverse 10s ease-in-out infinite, drift 15s ease-in-out infinite reverse;
  animation-delay: -2s;
}

.floating-circle-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #0891b2, #3b82f6);
  top: 60%;
  left: 5%;
  animation: float 12s ease-in-out infinite, drift 18s ease-in-out infinite;
  animation-delay: -4s;
}

.floating-circle-4 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #3b82f6, #06b6d4);
  top: 40%;
  right: 8%;
  animation: floatReverse 9s ease-in-out infinite, drift 14s ease-in-out infinite reverse;
  animation-delay: -1s;
}

.floating-circle-5 {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #06b6d4, #0891b2);
  top: 80%;
  left: 40%;
  animation: float 7s ease-in-out infinite, drift 11s ease-in-out infinite;
  animation-delay: -3s;
}

.floating-circle-6 {
  width: 110px;
  height: 110px;
  background: linear-gradient(45deg, #0891b2, #3b82f6);
  bottom: 20%;
  right: 30%;
  animation: floatReverse 11s ease-in-out infinite, drift 16s ease-in-out infinite reverse;
  animation-delay: -5s;
}

.floating-circle-7 {
  width: 90px;
  height: 90px;
  background: linear-gradient(45deg, #3b82f6, #06b6d4);
  bottom: 10%;
  left: 60%;
  animation: float 13s ease-in-out infinite, drift 20s ease-in-out infinite;
  animation-delay: -2.5s;
}

/* Testimonial Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slideInLeft 0.8s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

/* Add staggered animation delays for each testimonial */
.animate-slide-in-left:nth-child(1) {
  animation-delay: 0.2s;
}

.animate-slide-in-right:nth-child(2) {
  animation-delay: 0.4s;
}

.animate-slide-in-left:nth-child(3) {
  animation-delay: 0.6s;
}

.animate-slide-in-right:nth-child(4) {
  animation-delay: 0.8s;
}

.animate-slide-in-left:nth-child(5) {
  animation-delay: 1.0s;
}

/* Intersection Observer Animation (for scroll-triggered animations) */
@media (prefers-reduced-motion: no-preference) {
  .animate-slide-in-left,
  .animate-slide-in-right {
    opacity: 0;
    animation-play-state: paused;
  }
  
  .animate-slide-in-left.in-view {
    animation-play-state: running;
  }
  
  .animate-slide-in-right.in-view {
    animation-play-state: running;
  }
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .bg-gradient-animated,
  .floating-circle,
  .animate-slide-in-left,
  .animate-slide-in-right {
    animation: none !important;
  }
  
  .bg-gradient-animated {
    background: linear-gradient(-45deg, #f8fafc, #ffffff, #f1f5f9, #f8fafc);
  }
  
  @media (prefers-color-scheme: dark) {
    .bg-gradient-animated {
      background: linear-gradient(-45deg, #1e293b, #111827, #1f2937, #1e293b);
    }
  }
  
  .floating-circle {
    display: none;
  }
  
  .animate-slide-in-left,
  .animate-slide-in-right {
    opacity: 1;
    transform: none;
  }
}
</style>
