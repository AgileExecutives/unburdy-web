<template>
  <div class="min-h-screen bg-background">
    <div class="relative isolate px-6 pt-24 lg:px-8">
      <!-- Hero Section -->
      <div class="mx-auto max-w-4xl py-16 sm:py-24">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Für wen ist Unburdy gemacht?
          </h1>
          <p class="mt-6 text-lg leading-8 text-secondary max-w-3xl mx-auto">
            Unburdy wurde speziell für selbstständige Lerntherapeutinen und Lerntherapeuten entwickelt. 
            Egal ob du gerade startest oder bereits eine etablierte Praxis führst – wir unterstützen dich im Alltag.
          </p>
        </div>
      </div>

      <!-- Target Groups Section -->
      <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center bg-surface rounded-xl p-8 shadow-sm border border-default">
            <div class="w-16 h-16 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <Icon name="lucide:graduation-cap" class="w-8 h-8 text-accent" />
            </div>
            <h3 class="text-xl font-semibold text-primary mb-3">Lerntherapeutinen und Lerntherapeuten</h3>
            <p class="text-secondary mb-4">in Einzelpraxen</p>
            <p class="text-sm text-tertiary">
              Du arbeitest selbstständig und brauchst eine einfache, aber vollständige Lösung für deine Praxisverwaltung ohne medizinische Komplexität.
            </p>
          </div>
          
          <div class="text-center bg-surface rounded-xl p-8 shadow-sm border border-default">
            <div class="w-16 h-16 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <Icon name="lucide:rocket" class="w-8 h-8 text-accent" />
            </div>
            <h3 class="text-xl font-semibold text-primary mb-3">Praxisgründer und -gründerinnen</h3>
            <p class="text-secondary mb-4">die einfach starten wollen</p>
            <p class="text-sm text-tertiary">
              Du planst den Schritt in die Selbstständigkeit und suchst eine Software, die von Anfang an mitwächst und dir hilft, professionell aufzutreten.
            </p>
          </div>
          
          <div class="text-center bg-surface rounded-xl p-8 shadow-sm border border-default">
            <div class="w-16 h-16 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <Icon name="lucide:clock" class="w-8 h-8 text-accent" />
            </div>
            <h3 class="text-xl font-semibold text-primary mb-3">Freie Therapeutinnen und Therapeuten</h3>
            <p class="text-secondary mb-4">mit wenig Zeit für Verwaltung</p>
            <p class="text-sm text-tertiary">
              Du möchtest dich auf die Therapie konzentrieren und administrative Aufgaben so effizient wie möglich erledigen.
            </p>
          </div>
          
          <div class="text-center bg-surface rounded-xl p-8 shadow-sm border border-default">
            <div class="w-16 h-16 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-6 mx-auto">
              <Icon name="lucide:clipboard-check" class="w-8 h-8 text-accent" />
            </div>
            <h3 class="text-xl font-semibold text-primary mb-3">Heilpädagoginnen und Heilpädagogen</h3>
            <p class="text-secondary mb-4">mit Förderbedarf-Management</p>
            <p class="text-sm text-tertiary">
              Du arbeitest mit Kindern mit besonderen Bedürfnissen und brauchst eine strukturierte Dokumentation für Förderplanung und Verlaufskontrolle.
            </p>
          </div>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div class="bg-accent-light dark:bg-accent-dark/20 rounded-2xl p-8 lg:p-12">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold tracking-tight text-primary mb-4">
              Warum Unburdy perfekt für dich ist
            </h2>
            <p class="text-lg text-secondary max-w-3xl mx-auto">
              Unburdy versteht die besonderen Anforderungen von Lerntherapie und Heilpädagogik
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:heart" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-primary mb-2">Kein medizinischer Ballast</h3>
              <p class="text-sm text-secondary">Nur die Funktionen, die du wirklich brauchst – ohne überflüssige medizinische Features</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:trending-up" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-primary mb-2">Wächst mit dir mit</h3>
              <p class="text-sm text-secondary">Egal ob 5 oder 50 Klienten – Unburdy passt sich deinem Wachstum an</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:shield" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-primary mb-2">Rechtssicher & DSGVO-konform</h3>
              <p class="text-sm text-secondary">Hosting in Deutschland, vollständige Datenschutz-Compliance</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mx-auto max-w-4xl px-6 lg:px-8 pb-24">
        <div class="text-center">
          <h2 class="text-2xl font-bold tracking-tight text-primary mb-4">
            Gehörst du zu unserer Zielgruppe?
          </h2>
          <p class="text-lg text-secondary mb-8">
            Teste Unburdy 14 Tage kostenlos und finde heraus, ob wir zusammenpassen.
          </p>
          <div class="flex items-center justify-center gap-x-6">
            <NuxtLink to="/anmelden" class="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              14 Tage kostenlos testen
            </NuxtLink>
            <NuxtLink to="/funktionen" class="text-sm font-semibold leading-6 text-primary">
              Funktionen ansehen <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Für wen Unburdy ideal ist | Lerntherapie & Heilpädagogik',
  description: 'Egal ob Einzelpraxis oder Neustart – Unburdy unterstützt selbstständige Lerntherapeutinen und Lerntherapeuten im Alltag.',
  ogTitle: 'Für wen Unburdy ideal ist | Lerntherapie & Heilpädagogik',
  ogDescription: 'Egal ob Einzelpraxis oder Neustart – Unburdy unterstützt selbstständige Lerntherapeutinen und Lerntherapeuten im Alltag.',
  twitterTitle: 'Für wen Unburdy ideal ist | Lerntherapie & Heilpädagogik',
  twitterDescription: 'Egal ob Einzelpraxis oder Neustart – Unburdy unterstützt selbstständige Lerntherapeutinen und Lerntherapeuten  im Alltag.'
})
</script>

<style>

</style>