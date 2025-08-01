<template>
  <div class="bg-background min-h-screen">
    <!-- Fortschrittsanzeige -->
    <OnboardingFortschritt />

    <div class="max-w-2xl mx-auto px-6 py-16">
      <div class="mb-12">
        <h1 class="text-3xl font-bold text-primary mb-4">
          Kontakte & Kostenträger
        </h1>
        <p class="text-lg text-secondary">
          Hinterlege wichtige Kontaktpersonen und Kostenträger-Informationen für eine reibungslose Abrechnung.
        </p>
      </div>

      <form @submit.prevent="saveAndContinue" class="space-y-8">
        <!-- Eltern/Erziehungsberechtigte -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-primary">Eltern/Erziehungsberechtigte</h2>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="hasParents" 
                v-model="hasParents"
                class="rounded border-default text-accent shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50"
              >
              <label for="hasParents" class="ml-2 text-sm text-secondary">
                Kontaktdaten erfassen
              </label>
            </div>
          </div>
          
          <div v-if="hasParents" class="space-y-6">
            <!-- Mutter -->
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="text-lg font-medium text-primary mb-4">Mutter</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="motherName" class="block text-sm font-medium text-secondary mb-2">
                    Name
                  </label>
                  <input 
                    type="text" 
                    id="motherName" 
                    v-model="contacts.mother.name"
                    class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                  >
                </div>
                <div>
                  <label for="motherPhone" class="block text-sm font-medium text-secondary mb-2">
                    Telefon
                  </label>
                  <input 
                    type="tel" 
                    id="motherPhone" 
                    v-model="contacts.mother.phone"
                    class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                  >
                </div>
                <div class="md:col-span-2">
                  <label for="motherEmail" class="block text-sm font-medium text-secondary mb-2">
                    E-Mail
                  </label>
                  <input 
                    type="email" 
                    id="motherEmail" 
                    v-model="contacts.mother.email"
                    class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                  >
                </div>
              </div>
            </div>

            <!-- Vater -->
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="text-lg font-medium text-primary mb-4">Vater</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="fatherName" class="block text-sm font-medium text-secondary mb-2">
                    Name
                  </label>
                  <input 
                    type="text" 
                    id="fatherName" 
                    v-model="contacts.father.name"
                    class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                  >
                </div>
                <div>
                  <label for="fatherPhone" class="block text-sm font-medium text-secondary mb-2">
                    Telefon
                  </label>
                  <input 
                    type="tel" 
                    id="fatherPhone" 
                    v-model="contacts.father.phone"
                    class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                  >
                </div>
                <div class="md:col-span-2">
                  <label for="fatherEmail" class="block text-sm font-medium text-secondary mb-2">
                    E-Mail
                  </label>
                  <input 
                    type="email" 
                    id="fatherEmail" 
                    v-model="contacts.father.email"
                    class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                  >
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="mt-2 text-sm text-tertiary">Keine Elternkontakte erforderlich</p>
          </div>
        </div>

        <!-- Kostenträger -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-primary mb-6">Kostenträger</h2>
          <div class="space-y-6">
            <div>
              <label for="insuranceType" class="block text-sm font-medium text-secondary mb-2">
                Art der Versicherung
              </label>
              <select 
                id="insuranceType" 
                v-model="insurance.type"
                class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
              >
                <option value="">Bitte wählen</option>
                <option value="gesetzlich">Gesetzliche Krankenversicherung</option>
                <option value="privat">Private Krankenversicherung</option>
                <option value="beihilfe">Beihilfe</option>
                <option value="selbstzahler">Selbstzahler</option>
              </select>
            </div>

            <div v-if="insurance.type && insurance.type !== 'selbstzahler'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="insuranceName" class="block text-sm font-medium text-secondary mb-2">
                  Name der Versicherung
                </label>
                <input 
                  type="text" 
                  id="insuranceName" 
                  v-model="insurance.name"
                  placeholder="z.B. AOK, TK, Allianz..."
                  class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                >
              </div>
              <div>
                <label for="insuranceNumber" class="block text-sm font-medium text-secondary mb-2">
                  Versicherungsnummer
                </label>
                <input 
                  type="text" 
                  id="insuranceNumber" 
                  v-model="insurance.number"
                  class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
                >
              </div>
            </div>

            <div v-if="insurance.type === 'gesetzlich'">
              <label for="doctorName" class="block text-sm font-medium text-secondary mb-2">
                Verordnender Arzt (optional)
              </label>
              <input 
                type="text" 
                id="doctorName" 
                v-model="insurance.doctor"
                placeholder="Dr. Max Mustermann"
                class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
              >
            </div>
          </div>
        </div>

        <!-- Notizen -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 class="text-xl font-semibold text-primary mb-6">Besondere Hinweise</h2>
          <div>
            <label for="notes" class="block text-sm font-medium text-secondary mb-2">
              Notizen (optional)
            </label>
            <textarea 
              id="notes" 
              v-model="notes"
              rows="4"
              placeholder="Besondere Hinweise zur Therapie, Terminplanung oder Abrechnung..."
              class="w-full px-3 py-2 rounded-xl border border-default bg-surface text-primary shadow-sm focus:border-accent focus:ring-accent focus:ring-2 focus:ring-opacity-20 transition-all duration-200"
            ></textarea>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center pt-8">
          <NuxtLink 
            to="/onboarding/schritt-3" 
            class="inline-flex items-center px-6 py-3 border border-default rounded-lg font-medium text-secondary bg-surface hover:bg-surface-secondary transition-colors duration-200"
          >
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Zurück
          </NuxtLink>
          
          <button 
            type="submit" 
            class="inline-flex items-center px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Weiter
            <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Meta-Tags für SEO
useHead({
  title: 'Kontakte & Kostenträger - Unburdy Onboarding',
  meta: [
    { name: 'description', content: 'Hinterlegen Sie Kontaktdaten und Kostenträger-Informationen.' }
  ]
})

// Store verwenden
const store = useOnboardingAutoSave()

// Reactive state aus dem Store
const hasParents = computed({
  get: () => store.hasParents,
  set: (value) => store.updateHasParents(value)
})

const contacts = computed({
  get: () => store.contacts,
  set: (value) => store.updateContacts(value)
})

const insurance = computed({
  get: () => store.insurance,
  set: (value) => store.updateInsurance(value)
})

const notes = computed({
  get: () => store.notes,
  set: (value) => store.updateNotes(value)
})

// Beim Laden der Seite
onMounted(() => {
  store.goToStep(4)
})

// Form submission
const saveAndContinue = async () => {
  // Daten sind bereits automatisch im Store gespeichert
  console.log('Kontakte & Kostenträger gespeichert:', {
    hasParents: store.hasParents,
    contacts: store.contacts,
    insurance: store.insurance,
    notes: store.notes
  })
  
  // Zum nächsten Schritt navigieren
  store.nextStep()
  await navigateTo('/onboarding/schritt-5')
}
</script>
