<template>
  <header class="absolute inset-x-0 top-0 z-50">
    <nav class="flex items-center justify-between px-6 pt-6 pb-14 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <NuxtLink to="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Unburdy</span>
          <UnburdyLogo size="md" />
        </NuxtLink>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <NuxtLink to="/idee-hinter-unburdy" class="text-sm font-semibold leading-6 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors duration-200">Idee hinter Unburdy</NuxtLink>
        <NuxtLink to="/preise" class="text-sm font-semibold leading-6 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors duration-200">Preise</NuxtLink>
        <NuxtLink to="/legal/kontakt" class="text-sm font-semibold leading-6 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors duration-200">Kontakt</NuxtLink>
      </div>
            <!-- Color Mode Toggle - Additional toggle in content area -->
      <div class="">
        <ColorModeToggle />
      </div>
      <div class="lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
        <ColorModeToggle />
        <NuxtLink to="/lc/anmelden" class="text-sm font-semibold leading-6 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors duration-200">Anmelden <span aria-hidden="true">&rarr;</span></NuxtLink>
      </div>
    </nav>
  </header>
</template>
