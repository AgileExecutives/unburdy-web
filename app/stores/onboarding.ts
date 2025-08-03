import { defineStore } from 'pinia'

export interface OnboardingSettings {
  title: string
  profession: string
  hourlyRate: number
  sessionDuration: number
  workingHours: {
    start: string
    end: string
  }
  workingDays: string[]
}

export interface OnboardingClient {
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  address: {
    street: string
    zipCode: string
    city: string
  }
  phone: string
  email: string
  diagnosis: string
  therapyStart: string
  frequency: string
}

export interface OnboardingContacts {
  mother: {
    name: string
    phone: string
    email: string
  }
  father: {
    name: string
    phone: string
    email: string
  }
}

export interface OnboardingInsurance {
  type: string
  name: string
  number: string
  doctor: string
}

export interface OnboardingState {
  currentStep: number
  isCompleted: boolean
  settings: OnboardingSettings
  client: OnboardingClient
  hasParents: boolean
  contacts: OnboardingContacts
  insurance: OnboardingInsurance
  notes: string
}

export const useOnboardingStore = defineStore('onboarding', {
  state: (): OnboardingState => ({
    currentStep: 1,
    isCompleted: false,
    settings: {
      title: '',
      profession: '',
      hourlyRate: 85,
      sessionDuration: 45,
      workingHours: {
        start: '08:00',
        end: '18:00'
      },
      workingDays: ['mo', 'di', 'mi', 'do', 'fr']
    },
    client: {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      address: {
        street: '',
        zipCode: '',
        city: ''
      },
      phone: '',
      email: '',
      diagnosis: '',
      therapyStart: '',
      frequency: ''
    },
    hasParents: false,
    contacts: {
      mother: {
        name: '',
        phone: '',
        email: ''
      },
      father: {
        name: '',
        phone: '',
        email: ''
      }
    },
    insurance: {
      type: '',
      name: '',
      number: '',
      doctor: ''
    },
    notes: ''
  }),

  getters: {
    progress: (state) => {
      return (state.currentStep / 5) * 100
    },
    
    isStepCompleted: (state) => (step: number) => {
      switch (step) {
        case 1:
          return true // Willkommensseite ist immer "abgeschlossen"
        case 2:
          return state.settings.profession !== '' && state.settings.hourlyRate > 0
        case 3:
          return state.client.firstName !== '' && state.client.lastName !== ''
        case 4:
          return state.insurance.type !== '' || state.hasParents
        case 5:
          return state.isCompleted
        default:
          return false
      }
    },

    stepTitle: () => (step: number) => {
      const titles = {
        1: 'Willkommen',
        2: 'Standard-Einstellungen',
        3: 'Erster Klient',
        4: 'Kontakte & Kostenträger',
        5: 'Abschluss'
      }
      return titles[step as keyof typeof titles] || 'Unbekannt'
    },

    completionSummary: (state) => {
      return {
        hasSettings: state.settings.profession !== '',
        hasClient: state.client.firstName !== '' && state.client.lastName !== '',
        hasContacts: state.hasParents && (state.contacts.mother.name !== '' || state.contacts.father.name !== ''),
        hasInsurance: state.insurance.type !== '',
        totalCompleted: [
          state.settings.profession !== '',
          state.client.firstName !== '' && state.client.lastName !== '',
          state.insurance.type !== ''
        ].filter(Boolean).length
      }
    }
  },

  actions: {
    nextStep() {
      if (this.currentStep < 5) {
        this.currentStep++
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    goToStep(step: number) {
      if (step >= 1 && step <= 5) {
        this.currentStep = step
      }
    },

    updateSettings(settings: Partial<OnboardingSettings>) {
      this.settings = { ...this.settings, ...settings }
    },

    updateClient(client: Partial<OnboardingClient>) {
      this.client = { ...this.client, ...client }
    },

    updateContacts(contacts: Partial<OnboardingContacts>) {
      this.contacts = { ...this.contacts, ...contacts }
    },

    updateInsurance(insurance: Partial<OnboardingInsurance>) {
      this.insurance = { ...this.insurance, ...insurance }
    },

    updateHasParents(hasParents: boolean) {
      this.hasParents = hasParents
    },

    updateNotes(notes: string) {
      this.notes = notes
    },

    completeOnboarding() {
      this.isCompleted = true
      this.currentStep = 5
    },

    resetOnboarding() {
      this.$reset()
    },

    // Hilfsfunktion zum Speichern der Daten (mit API-Calls)
    async saveData() {
      try {
        const { onboarding } = useApi()
        const { isAuthenticated } = useAuth()

        // Prüfen ob User authentifiziert ist
        if (!isAuthenticated.value) {
          throw new Error('User must be authenticated to save onboarding data')
        }
        
        console.log('Onboarding-Daten speichern:', {
          settings: this.settings,
          client: this.client,
          contacts: this.hasParents ? this.contacts : null,
          insurance: this.insurance,
          notes: this.notes
        })
        
        // API-Call über authenticated onboarding endpoint
        const result = await onboarding.saveBasicSettings(this.settings)
        
        return { success: true, data: result }
      } catch (error: any) {
        console.error('Fehler beim Speichern:', error)
        return { success: false, error: error?.message || 'Unbekannter Fehler' }
      }
    },

    // Ersten Klienten über API speichern
    async saveFirstClient() {
      try {
        const { onboarding } = useApi()
        const { isAuthenticated } = useAuth()

        if (!isAuthenticated.value) {
          throw new Error('User must be authenticated to create client')
        }

        console.log('Ersten Klienten erstellen:', this.client)
        
        const result = await onboarding.createFirstClient(this.client)
        
        return { success: true, data: result }
      } catch (error: any) {
        console.error('Fehler beim Erstellen des Klienten:', error)
        return { success: false, error: error?.message || 'Unbekannter Fehler' }
      }
    },

    // Kontakte und Versicherung über API speichern
    async saveContactsAndInsurance() {
      try {
        const { onboarding } = useApi()
        const { isAuthenticated } = useAuth()

        if (!isAuthenticated.value) {
          throw new Error('User must be authenticated to save contacts')
        }

        const contactsData = {
          hasParents: this.hasParents,
          contacts: this.hasParents ? this.contacts : null,
          insurance: this.insurance
        }

        console.log('Kontakte und Versicherung speichern:', contactsData)
        
        const result = await onboarding.saveContacts(contactsData)
        
        return { success: true, data: result }
      } catch (error: any) {
        console.error('Fehler beim Speichern der Kontakte:', error)
        return { success: false, error: error?.message || 'Unbekannter Fehler' }
      }
    },

    // Onboarding abschließen
    async finalizeOnboarding() {
      try {
        const { onboarding } = useApi()
        const { isAuthenticated } = useAuth()

        if (!isAuthenticated.value) {
          throw new Error('User must be authenticated to complete onboarding')
        }

        console.log('Onboarding abschließen')
        
        const result: any = await onboarding.completeOnboarding()
        
        if (result?.success) {
          this.completeOnboarding()
        }
        
        return { success: true, data: result }
      } catch (error: any) {
        console.error('Fehler beim Abschließen des Onboardings:', error)
        return { success: false, error: error?.message || 'Unbekannter Fehler' }
      }
    },

    // Daten aus LocalStorage laden (für Persistierung bei Seiten-Reload)
    loadFromStorage() {
      if (process.client) {
        const saved = localStorage.getItem('unburdy-onboarding')
        if (saved) {
          try {
            const data = JSON.parse(saved)
            this.$patch(data)
          } catch (error) {
            console.error('Fehler beim Laden der Onboarding-Daten:', error)
          }
        }
      }
    },

    // Daten in LocalStorage speichern
    saveToStorage() {
      if (process.client) {
        localStorage.setItem('unburdy-onboarding', JSON.stringify(this.$state))
      }
    }
  }
})

// Auto-Save bei Änderungen
export const useOnboardingAutoSave = () => {
  const store = useOnboardingStore()
  
  // Überwache Änderungen und speichere automatisch
  watch(() => store.$state, () => {
    store.saveToStorage()
  }, { deep: true })
  
  return store
}
