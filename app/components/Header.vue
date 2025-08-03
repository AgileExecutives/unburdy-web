<template>
  <header class="absolute inset-x-0 top-0 z-50">
    <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <NuxtLink to="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Unburdy</span>
          <UnburdyLogo size="md" />
        </NuxtLink>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <NuxtLink to="/funktionen" class="text-sm font-semibold leading-6 text-accent hover:text-accent-hover transition-colors duration-200">Funktionen</NuxtLink>
        <NuxtLink to="/preise" class="text-sm font-semibold leading-6 text-accent hover:text-accent-hover transition-colors duration-200">Preise</NuxtLink>
        <NuxtLink to="/legal/kontakt" class="text-sm font-semibold leading-6 text-accent hover:text-accent-hover transition-colors duration-200">Kontakt</NuxtLink>
      </div>
      <div class="lg:flex lg:flex-1 lg:justify-end">
        <NuxtLink to="/anmelden" class="text-sm font-semibold leading-6 text-accent hover:text-accent-hover transition-colors duration-200">Anmelden <span aria-hidden="true">&rarr;</span></NuxtLink>
      </div>
    </nav>
  </header>
</template>
