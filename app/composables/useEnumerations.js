import { ref, computed } from 'vue'
import { $fetch } from 'ofetch'

const enumerations = ref(null)
const isLoading = ref(false)
const error = ref(null)

export const useEnumerations = () => {
  const loadEnumerations = async () => {
    if (enumerations.value) {
      return enumerations.value // Return cached data
    }

    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch('/api/static/enumerations')
      enumerations.value = response
      return response
    } catch (err) {
      console.error('Error fetching enumerations:', err)
      error.value = err.message || 'Fehler beim Laden der Daten'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const focusAreas = computed(() => enumerations.value?.focus_areas || {})
  const serviceOffers = computed(() => enumerations.value?.service_offers || {})

  return {
    enumerations,
    focusAreas,
    serviceOffers,
    isLoading,
    error,
    loadEnumerations
  }
}
