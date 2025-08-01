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
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">Therapie-Management leicht gemacht</h1>
          <p class="mt-6 text-lg leading-8 text-secondary">Unburdy ist die moderne, intuitive und sichere Software für Therapeuten und Praxen. Verwalten Sie Klienten, Termine und Rechnungen an einem Ort.</p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <NuxtLink to="/anmelden" class="rounded-md bg-accent px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Jetzt kostenlos starten</NuxtLink>
            <NuxtLink to="/funktionen" class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Mehr erfahren <span aria-hidden="true">→</span></NuxtLink>
          </div>
        </div>
      </div>
      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-cyan-200/20 to-blue-200/30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    </div>
  </div>
</template>
