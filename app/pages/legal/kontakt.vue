<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 mt-16">
    <div class="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Kontakt
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Haben Sie Fragen zu Unburdy? Wir helfen gerne weiter!
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-1 gap-12">
        <!-- Contact Information - Commented out for now, will probably use later -->
        <!--
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Kontaktinformationen
          </h2>
          
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <Icon name="lucide:mail" class="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">E-Mail</h3>
                <p class="text-gray-600 dark:text-gray-300">support@unburdy.de</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <Icon name="lucide:phone" class="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Telefon</h3>
                <p class="text-gray-600 dark:text-gray-300">+49 (0) 761 123 456 78</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <Icon name="lucide:map-pin" class="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Adresse</h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Dr. Alexander Röhm<br>
                  Simone-de-Beauvoir-Weg 879<br>
                  79111 Freiburg im Breisgau<br>
                  Deutschland
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <Icon name="lucide:clock" class="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Support-Zeiten</h3>
                <p class="text-gray-600 dark:text-gray-300">
                  Montag - Freitag: 9:00 - 17:00 Uhr<br>
                  E-Mail-Support: 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
        -->

        <!-- Contact Form -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Nachricht senden
          </h2>
          
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                v-model="form.name"
                type="text"
                id="name"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-accent focus:border-accent dark:bg-gray-800 dark:text-white"
                placeholder="Ihr vollständiger Name"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-Mail-Adresse *
              </label>
              <input
                v-model="form.email"
                type="email"
                id="email"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-accent focus:border-accent dark:bg-gray-800 dark:text-white"
                placeholder="ihre.email@beispiel.de"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Betreff *
              </label>
              <select
                v-model="form.subject"
                id="subject"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-accent focus:border-accent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Bitte wählen Sie einen Betreff</option>
                <option value="Allgemeine Frage">Allgemeine Frage</option>
                <option value="Technischer Support">Technischer Support</option>
                <option value="Preise und Abonnements">Preise und Abonnements</option>
                <option value="Funktionen und Features">Funktionen und Features</option>
                <option value="Datenschutz und Sicherheit">Datenschutz und Sicherheit</option>
                <option value="Demo-Termin anfragen">Demo-Termin anfragen</option>
                <option value="Sonstiges">Sonstiges</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nachricht *
              </label>
              <textarea
                v-model="form.message"
                id="message"
                required
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-accent focus:border-accent dark:bg-gray-800 dark:text-white resize-vertical"
                placeholder="Beschreiben Sie Ihr Anliegen..."
              ></textarea>
            </div>

            <div class="flex items-start space-x-3">
              <input
                v-model="form.consent"
                type="checkbox"
                id="consent"
                required
                class="mt-1 h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label for="consent" class="text-sm text-gray-600 dark:text-gray-300">
                Ich stimme zu, dass meine Daten zur Bearbeitung meiner Anfrage gespeichert und verarbeitet werden. Weitere Informationen finden Sie in unserer 
                <NuxtLink to="/legal/datenschutz" class="text-accent hover:underline">Datenschutzerklärung</NuxtLink>.
              </label>
            </div>

            <div class="flex items-start space-x-3">
              <input
                v-model="form.newsletter"
                type="checkbox"
                id="newsletter"
                class="mt-1 h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label for="newsletter" class="text-sm text-gray-600 dark:text-gray-300">
                Ich möchte gerne über Neuigkeiten und Updates von Unburdy per E-Mail informiert werden. (optional)
              </label>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Icon v-if="isSubmitting" name="lucide:loader-2" class="w-5 h-5 mr-2 animate-spin" />
                <Icon v-else name="lucide:send" class="w-5 h-5 mr-2" />
                {{ isSubmitting ? 'Wird gesendet...' : 'Nachricht senden' }}
              </button>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="submitMessage" class="mt-4">
              <div 
                :class="[
                  'p-4 rounded-md',
                  submitSuccess ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                ]"
              >
                <div class="flex">
                  <Icon 
                    :name="submitSuccess ? 'lucide:check-circle' : 'lucide:alert-circle'" 
                    :class="[
                      'w-5 h-5 mr-3 mt-0.5',
                      submitSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    ]"
                  />
                  <p :class="submitSuccess ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
                    {{ submitMessage }}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// SEO Meta
useSeoMeta({
  title: 'Kontakt | Unburdy',
  description: 'Kontaktieren Sie uns bei Fragen zu Unburdy - Ihrer Lerntherapie Software. Wir helfen gerne weiter!'
})

// Form state
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  consent: false,
  newsletter: false
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)
const csrfToken = ref('')

// Get CSRF token on page load
onMounted(async () => {
  try {
    const response = await $fetch('/api/csrf-token')
    csrfToken.value = response.csrfToken
  } catch (error) {
    console.error('Failed to get CSRF token:', error)
  }
})

// Form submission
const submitForm = async () => {
  isSubmitting.value = true
  submitMessage.value = ''
  
  try {
    // Get fresh CSRF token if needed
    if (!csrfToken.value) {
      const tokenResponse = await $fetch('/api/csrf-token')
      csrfToken.value = tokenResponse.csrfToken
    }
    
    // Send contact form data through Nuxt server API route
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message,
        newsletter: form.value.newsletter,
        csrfToken: csrfToken.value
      }
    })

    // Success
    submitSuccess.value = true
    submitMessage.value = 'Vielen Dank für Ihre Nachricht! Wir werden uns zeitnah bei Ihnen melden.'
    
    // Reset form and get new CSRF token
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: '',
      consent: false,
      newsletter: false
    }
    
    // Get new CSRF token for next submission
    try {
      const tokenResponse = await $fetch('/api/csrf-token')
      csrfToken.value = tokenResponse.csrfToken
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error)
    }
    
  } catch (error) {
    console.error('Contact form submission error:', error)
    submitSuccess.value = false
    submitMessage.value = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per E-Mail.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
