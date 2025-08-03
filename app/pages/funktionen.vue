<template>
  <div class="min-h-screen bg-background">

    <div class="relative isolate px-6 pt-24 lg:px-8">
      <!-- Hero Section -->
      <div class="mx-auto max-w-4xl py-16 sm:py-24">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Funktionen für deine Lerntherapie-Praxis
          </h1>
          <p class="mt-6 text-lg leading-8 text-secondary max-w-3xl mx-auto">
            Unburdy bietet alle Werkzeuge, die du für eine erfolgreiche Lerntherapie-Praxis brauchst –
            intuitiv, sicher und speziell für selbstständige Lerntherapeutinen und Lerntherapeuten entwickelt.
          </p>
        </div>
      </div>

      <!-- Functions Section -->

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Klientenverwaltung -->
        <div class="bg-surface rounded-xl p-6 shadow-sm border border-default">
          <div
            class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4">
            <Icon name="lucide:users" class="w-6 h-6 text-accent" />
          </div>
          <h3 class="text-lg font-semibold text-primary mb-2">Klientenverwaltung</h3>
          <p class="text-sm text-secondary">
            Behalte den Überblick über alle wichtigen Klientendaten: Name, Geburtsdatum, Diagnosen, Elternkontakte und
            Kostenträger – einfach und strukturiert.
          </p>
        </div>

        <!-- Therapieplanung -->
        <div class="bg-surface rounded-xl p-6 shadow-sm border border-default">
          <div
            class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4">
            <Icon name="lucide:clipboard-list" class="w-6 h-6 text-accent" />
          </div>
          <h3 class="text-lg font-semibold text-primary mb-2">Therapieplanung & Verlauf</h3>
          <p class="text-sm text-secondary">
            Dokumentiere Therapieziele, Sitzungsverlauf und Fortschritte. Unburdy hilft dir dabei, deine Förderplanung
            systematisch umzusetzen.
          </p>
        </div>

        <!-- Abrechnung -->
        <div class="bg-surface rounded-xl p-6 shadow-sm border border-default">
          <div
            class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4">
            <Icon name="lucide:calculator" class="w-6 h-6 text-accent" />
          </div>
          <h3 class="text-lg font-semibold text-primary mb-2">Abrechnung & Kostenträger</h3>
          <p class="text-sm text-secondary">
            Rechnungen schreiben mit nur wenigen Klicks – egal ob privat oder über Krankenkassen. Du wählst den
            Kostenträger, Unburdy kümmert sich um das Layout.
          </p>
        </div>

        <!-- DSGVO -->
        <div class="bg-surface rounded-xl p-6 shadow-sm border border-default">
          <div
            class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4">
            <Icon name="lucide:shield-check" class="w-6 h-6 text-accent" />
          </div>
          <h3 class="text-lg font-semibold text-primary mb-2">DSGVO & Datenschutz</h3>
          <p class="text-sm text-secondary">
            Wir hosten ausschließlich in Deutschland und verschlüsseln alle Daten – damit deine Praxis auch digital
            rechtssicher bleibt.
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mx-auto max-w-4xl px-6 lg:px-8 py-24">
        <div class="text-center">
          <h2 class="text-2xl font-bold tracking-tight text-primary mb-4">
            Bereit für den nächsten Schritt?
          </h2>
          <p class="text-lg text-secondary mb-8">
            Teste Unburdy 14 Tage kostenlos und überzeuge dich selbst.
          </p>
          <div class="flex items-center justify-center gap-x-6">
            <NuxtLink to="/anmelden"
              class="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              14 Tage kostenlos testen
            </NuxtLink>
            <NuxtLink to="/preise" class="text-sm font-semibold leading-6 text-primary">
              Preise ansehen <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Funktionen für deine Lerntherapie Praxis | Unburdy',
  description: 'Von Klientenverwaltung bis Abrechnung: Unburdy bietet alles, was du für deine Praxis brauchst – intuitiv und sicher.',
  ogTitle: 'Funktionen für deine Lerntherapie Praxis | Unburdy',
  ogDescription: 'Von Klientenverwaltung bis Abrechnung: Unburdy bietet alles, was du für deine Praxis brauchst – intuitiv und sicher.',
  twitterTitle: 'Funktionen für deine Lerntherapie Praxis | Unburdy',
  twitterDescription: 'Von Klientenverwaltung bis Abrechnung: Unburdy bietet alles, was du für deine Praxis brauchst – intuitiv und sicher.'
})
</script>

<style></style>