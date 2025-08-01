<script setup>
useSeoMeta({
  title: 'Lerntherapie Software für selbstständige Therapeut:innen | Unburdy',
  description: 'Verwalte deine Lerntherapie-Praxis einfach & DSGVO-konform – mit der Software speziell für selbstständige Lerntherapeut:innen. Jetzt 14 Tage kostenlos testen!',
  ogTitle: 'Lerntherapie Software für selbstständige Therapeut:innen | Unburdy',
  ogDescription: 'Verwalte deine Lerntherapie-Praxis einfach & DSGVO-konform – mit der Software speziell für selbstständige Lerntherapeut:innen. Jetzt 14 Tage kostenlos testen!',
  twitterTitle: 'Lerntherapie Software für selbstständige Therapeut:innen | Unburdy',
  twitterDescription: 'Verwalte deine Lerntherapie-Praxis einfach & DSGVO-konform – mit der Software speziell für selbstständige Lerntherapeut:innen. Jetzt 14 Tage kostenlos testen!'
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <header class="absolute inset-x-0 top-0 z-50">
      <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div class="flex lg:flex-1">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Unburdy</span>
            <UnburdyLogo size="md" />
          </a>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <NuxtLink to="/funktionen" class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Funktionen</NuxtLink>
          <NuxtLink to="/preise" class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Preise</NuxtLink>
        </div>
        <div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <NuxtLink to="/anmelden" class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Anmelden <span aria-hidden="true">&rarr;</span></NuxtLink>
        </div>
      </nav>
    </header>

    <div class="relative isolate px-6 pt-14 lg:px-8">
      <!-- Decorative background elements -->
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent/20 to-accent-hover/30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
      
      <!-- Hero Section -->
      <div class="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Lerntherapie einfach verwalten – mit Unburdy
          </h1>
          <p class="mt-6 text-lg leading-8 text-secondary max-w-3xl mx-auto">
            Unburdy ist die intuitive Software für selbstständige Lerntherapeut:innen. 
            Verwalte Klienten, plane Therapien, dokumentiere Fortschritte und erstelle Abrechnungen – 
            alles an einem Ort, 100% DSGVO-konform.
          </p>
          
          <!-- Benefits -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div class="flex items-center justify-center space-x-2">
              <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
              <span class="text-secondary">Keine medizinische Bürokratie</span>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
              <span class="text-secondary">Hosting in Deutschland</span>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
              <span class="text-secondary">Klarer Fokus auf Lerntherapie</span>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <Icon name="lucide:check-circle" class="w-5 h-5 text-green-500" />
              <span class="text-secondary">Ab 29 € im Monat</span>
            </div>
          </div>

          <p class="mt-6 text-sm text-accent font-medium">
            <Icon name="lucide:target" class="inline w-4 h-4 mr-1" /> Entwickelt für Einzelpraxen in Deutschland – keine IT-Kenntnisse nötig.
          </p>
          
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <NuxtLink to="/anmelden" class="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              14 Tage kostenlos testen
            </NuxtLink>
            <NuxtLink to="/funktionen" class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Funktionen ansehen <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Functions Section -->
      <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Alles, was du für deine Lerntherapiepraxis brauchst
          </h2>
          <p class="mt-4 text-lg text-secondary">
            Entwickelt speziell für selbstständige Lerntherapeut:innen in Deutschland
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Klientenverwaltung -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4">
              <Icon name="lucide:users" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Klientenverwaltung</h3>
            <p class="text-sm text-secondary">
              Behalte den Überblick über alle wichtigen Klientendaten: Name, Geburtsdatum, Diagnosen, Elternkontakte und Kostenträger – einfach und strukturiert.
            </p>
          </div>

          <!-- Therapieplanung -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4">
              <Icon name="lucide:clipboard-list" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Therapieplanung & Verlauf</h3>
            <p class="text-sm text-secondary">
              Dokumentiere Therapieziele, Sitzungsverlauf und Fortschritte. Unburdy hilft dir dabei, deine Förderplanung systematisch umzusetzen.
            </p>
          </div>

          <!-- Abrechnung -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4">
              <Icon name="lucide:calculator" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Abrechnung & Kostenträger</h3>
            <p class="text-sm text-secondary">
              Rechnungen schreiben mit nur wenigen Klicks – egal ob privat oder über Krankenkassen. Du wählst den Kostenträger, Unburdy kümmert sich um das Layout.
            </p>
          </div>

          <!-- DSGVO -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4">
              <Icon name="lucide:shield-check" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">DSGVO & Datenschutz</h3>
            <p class="text-sm text-secondary">
              Wir hosten ausschließlich in Deutschland und verschlüsseln alle Daten – damit deine Praxis auch digital rechtssicher bleibt.
            </p>
          </div>
        </div>
      </div>

      <!-- Why Unburdy Section -->
      <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div class="bg-accent-light dark:bg-accent-dark/20 rounded-2xl p-8 lg:p-12">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Die beste Software für selbstständige Lerntherapeut:innen
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
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Keine überflüssigen Funktionen</h3>
              <p class="text-sm text-secondary">Fokus auf das, was du wirklich brauchst</p>
            </div>
            <div>
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:zap" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Intuitive Bedienung</h3>
              <p class="text-sm text-secondary">Einfach zu verstehen und zu verwenden</p>
            </div>
            <div>
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:headphones" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Direkter Support</h3>
              <p class="text-sm text-secondary">Persönliche Hilfe, wenn du sie brauchst</p>
            </div>
            <div>
              <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Icon name="lucide:refresh-cw" class="w-6 h-6 text-accent" />
              </div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Regelmäßig weiterentwickelt</h3>
              <p class="text-sm text-secondary">Mit echten Lerntherapeut:innen</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Target Groups Section -->
      <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Für wen ist Unburdy gemacht?
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Icon name="lucide:graduation-cap" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Lerntherapeut:innen</h3>
            <p class="text-sm text-secondary">in Einzelpraxen</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Icon name="lucide:rocket" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Praxisgründer:innen</h3>
            <p class="text-sm text-secondary">die einfach starten wollen</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Icon name="lucide:clock" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Freie Therapeut:innen</h3>
            <p class="text-sm text-secondary">mit wenig Zeit für Verwaltung</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-accent-light dark:bg-accent-dark/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Icon name="lucide:clipboard-check" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Heilpädagog:innen</h3>
            <p class="text-sm text-secondary">mit Förderbedarf-Management</p>
          </div>
        </div>
      </div>

      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-cyan-200/20 to-blue-200/30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    </div>
  </div>
</template>
