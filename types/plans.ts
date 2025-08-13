export interface Plan {
  name: string
  price: string
  slug: string
  currency: string
  anmeldeLink: string
  features: string[]
  highlight: boolean
  description: string
  invoicing: string
  invoice_period: string
  actionText: string
  max_organizations: number
  max_users: number
  max_clients: number
}

export interface PlansConfig {
  basis: Plan
  pro: Plan
  praxis: Plan
  trial14: Plan
}

export const plans: PlansConfig = {
  basis: {
    name: "Basis",
    price: "29",
    slug: "basis-free30",
    currency: "EUR",
    anmeldeLink: "/anmelden/basis-free30",
    features: [
      "Klientenverwaltung",
      "Terminplanung",
      "Einfache Rechnungen",
      "Datenschutz DSGVO"
    ],
    highlight: false,
    description: "Perfekt für Einzeltherapeuten, die gerade starten",
    invoicing: "€29/Monat",
    invoice_period: "monthly",
    actionText: "30 Tage kostenlos testen",
    max_organizations: 1,
    max_users: 1,
    max_clients: 200
  },
  pro: {
    name: "Pro",
    price: "49",
    currency: "EUR",
    slug: "pro-free30",
    anmeldeLink: "/anmelden/pro-free30",
    features: [
      "Alles aus Basis",
      "Diagnose-Verwaltung",
      "Therapieberichte",
      "Statistiken",
      "E-Mail Support"
    ],
    highlight: true,
    description: "Der beliebteste Plan für etablierte Praxen",
    invoicing: "€49/Monat",
    invoice_period: "monthly",
    actionText: "30 Tage kostenlos testen",
    max_organizations: 1,
    max_users: 1,
    max_clients: 200
  },
  praxis: {
    name: "Praxis",
    price: "89",
    currency: "EUR",
    slug: "praxis-free30",
    anmeldeLink: "/anmelden/praxis-free30",
    features: [
      "Alles aus Pro",
      "Mehrere Therapeuten",
      "Team-Verwaltung",
      "Prioritäts-Support",
      "API-Zugang"
    ],
    highlight: false,
    description: "Für größere Praxen mit mehreren Therapeuten",
    invoicing: "€89/Monat",
    invoice_period: "monthly",
    actionText: "30 Tage kostenlos testen",
    max_organizations: 1,
    max_users: 10,
    max_clients: 500
  },
  trial14: {
    name: "Trial",
    price: "0",
    currency: "EUR",
    slug: "trial14",
    anmeldeLink: "/anmelden/trial14",
    features: [
      "Vollständiger Zugang zu allen Features",
      "Klientenverwaltung",
      "Terminplanung",
      "Diagnose-Verwaltung",
      "Therapieberichte",
      "DSGVO-konform"
    ],
    highlight: false,
    description: "14 Tage kostenloses Testen aller Features",
    invoicing: "Kostenlos",
    invoice_period: "none",
    actionText: "14 Tage kostenlos testen",
    max_organizations: 1,
    max_users: 1,
    max_clients: 200
  }
}

// Hilfsfunktionen für den Zugriff auf die Pläne
export const getPlan = (planId: keyof PlansConfig): Plan => {
  return plans[planId]
}

export const getPlans = (planIds: (keyof PlansConfig)[]): Plan[] => {
  return planIds.map(planId => plans[planId])
}

export const getAllPlans = (): Plan[] => {
  return Object.values(plans)
}

export const getHighlightedPlan = (): Plan => {
  return Object.values(plans).find(plan => plan.highlight) || plans.pro
}

export const getPlanByName = (name: string): Plan | undefined => {
  return Object.values(plans).find(plan => 
    plan.name.toLowerCase() === name.toLowerCase()
  )
}
