<template>
    <div class="min-h-screen flex flex-col">
        <!-- Progress Bar -->
        <div class="bg-surface border-b border-default py-4">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-2">
                    <h1 class="text-lg font-semibold text-primary">Praxiseinrichtung</h1>
                    <span class="text-sm text-secondary">Schritt 1 von 4</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-accent h-2 rounded-full transition-all duration-300" style="width: 25%"></div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 ">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Step Header -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        1
                    </div>
                    <h2 class="text-3xl font-bold text-primary mb-2">Praxisinformationen</h2>
                    <p class="text-lg text-secondary">
                        Erzähle uns etwas über deine Praxis und deine grundlegenden Einstellungen
                    </p>
                </div>

                
                <!-- Content Card -->
                <div class="bg-surface rounded-lg border border-default p-8 mb-8">

                    <!-- Search Result Card (shown when user data is found) -->
                    <transition name="card-fade" mode="out-in">
                        <div v-if="showSearchResult" class="mb-8 p-6 dark:bg-green-900/20 border border-green-200 rounded-lg">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div class="ml-3">
                                        <h3 class="text-lg font-medium text-green-800">
                                            Deine Praxisdaten wurden gefunden!
                                        </h3>
                                        <p class="text-sm text-green-700">
                                            Wir haben passende Informationen zu deiner Praxis gefunden. Wenn du sie übernimmst, kannst du noch Korrekturen vornehmen.
                                        </p>
                                    </div>
                            </div>
                            <button 
                                @click="dicardSearchResults"
                                class="text-green-400 hover:text-green-600"
                            >
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <!-- Practice Name -->
                            <div class="flex flex-col items-center justify-between p-4 rounded dark:bg-gray-100/10">
                                    <span class="ml-2">{{ semanticFlowData.practiceName || 'Nicht verfügbar' }}</span>
                                    <span class="ml-2">
                                        {{ formatAddress(semanticFlowData) }}
                                    </span>
                                    <span class="ml-2">{{ semanticFlowData.contactPerson || 'Nicht verfügbar' }}</span>
                            </div>


                            <!-- Focus Areas -->
                            <div v-if="semanticFlowData.selectedFocusAreas && semanticFlowData.selectedFocusAreas.length" 
                                 class="p-3 bg-white rounded border">
                                <span class="text-sm font-medium text-gray-700">Fachbereiche:</span>
                                <div class="mt-2 flex flex-wrap gap-2">
                                    <span v-for="area in semanticFlowData.selectedFocusAreas" 
                                          :key="area"
                                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {{ focusAreas[area] || area }}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="flex space-x-3 pt-4">
                                <button 
                                    @click="acceptSearchResult"
                                    class="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Diese Daten übernehmen
                                </button>
                                <button 
                                    @click="dicardSearchResults"
                                    class="flex-1 bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                                >
                                    Manuell eingeben
                                </button>
                            </div>
                        </div>
                    </div>
                    </transition>

                    <!-- Manual Search Card (shown when no user data match) -->
                    <transition name="card-fade" mode="out-in">
                        <div v-if="showManualSearchCard" class="mb-8 p-6 bg-yellow-50 dark:bg-yellow-500/20 border border-yellow-200 rounded-lg">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-lg font-medium text-yellow-800">
                                        Es geht vielleicht einfacher.
                                    </h3>
                                    <p class="text-sm text-yellow-700">
Fang mit deiner Postleitzahl an – vielleicht findest du so deine Praxis.        
                                    </p>
                                </div>
                            </div>
                            <button 
                                @click="closeManualSearchCard"
                                class="text-yellow-400 hover:text-yellow-600"
                            >
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <!-- Search Input -->
                            <div>
                                <input
                                    v-model="manualSearchZip"
                                    type="text"
                                    maxlength="5"
                                    pattern="[0-9]{5}"
                                    class="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm placeholder-yellow-500 bg-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="PLZ eingeben (z.B. 10117) - automatische Suche ab 3 Stellen"
                                    @input="validateManualSearchZip"
                                />
                                <!-- Loading indicator -->
                                <div v-if="isManualSearching" class="flex items-center justify-center mt-2">
                                    <svg class="animate-spin h-5 w-5 text-yellow-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span class="text-yellow-600 text-sm">Suche läuft...</span>
                                </div>
                            </div>

                            <!-- Search Results -->
                            <div v-if="manualSearchResults.length > 0" class="space-y-3">
                                <div 
                                    v-for="(customer, index) in manualSearchResults"
                                    :key="index"
                                    class="flex items-center justify-between p-4 bg-yellow-100/20 rounded-lg"
                                >
                                    <div class="flex-1">
                                        <div class="font-medium">
                                            {{ customer.name || 'Unbekannt' }}
                                        </div>
                                        <div class="text-sm ">
                                            {{ customer.email || 'Keine E-Mail' }}
                                        </div>
                                        <div class="text-sm">
                                            {{ formatCustomerAddress(customer) }}
                                        </div>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                              :class="customer.score >= 0.9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                            {{ Math.round(customer.score * 100) }}%
                                        </span>
                                        <button
                                            @click="acceptManualSearchResult(customer)"
                                            class="px-3 py-1 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                        >
                                            Übernehmen
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- No Results Message -->
                            <div v-else-if="manualSearchZip.length === 5 && manualSearchResults.length === 0 && !isManualSearching" 
                                 class="text-center py-4 text-yellow-700">
                                <p>Keine Ergebnisse für PLZ {{ manualSearchZip }} gefunden.</p>
                            </div>
                            
                            <!-- Cancel Button -->
                            <div class="mt-4 pt-4 border-yellow-200">
                                <button 
                                    @click="closeManualSearchCard"
                                    class="w-full bg-gray-200/20 text-gray-300 px-4 py-2 rounded-md text-sm font-medium border border-yellow-100 hover:bg-gray-200/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    Abbrechen - manuell fortfahren
                                </button>
                            </div>
                        </div>
                    </div>
                    </transition>

                    <!-- High Score Matches Card (shown when multiple good matches found) -->
                    <transition name="card-fade" mode="out-in">
                        <div v-if="showHighScoreMatches" class="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-lg font-medium text-green-800">
                                        Mögliche Praxisübereinstimmungen gefunden!
                                    </h3>
                                    <p class="text-sm text-green-700">
                                        Basierend auf deinen Daten haben wir folgende mögliche Übereinstimmungen gefunden. Wähle die passende Praxis aus oder fahre manuell fort.
                                    </p>
                                </div>
                            </div>
                            <button 
                                @click="closeHighScoreMatches"
                                class="text-green-400 hover:text-green-600"
                            >
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div class="space-y-3">
                            <div 
                                v-for="(customer, index) in highScoreMatches"
                                :key="index"
                                class="flex items-start justify-between p-4 bg-white border border-green-200 rounded-lg"
                            >
                                <div class="flex-1">
                                    <div class="font-medium text-gray-900 mb-1">
                                        {{ customer.name || 'Unbekannt' }}
                                    </div>
                                    <div class="text-sm text-gray-500 mb-1">
                                        {{ customer.email || 'Keine E-Mail' }}
                                    </div>
                                    <div class="text-sm text-gray-500 mb-2">
                                        {{ formatCustomerAddress(customer) }}
                                    </div>
                                    
                                    <!-- Focus Areas Preview -->
                                    <div v-if="customer.focus_areas && customer.focus_areas.length" class="mt-2">
                                        <div class="flex flex-wrap gap-1">
                                            <span v-for="area in customer.focus_areas.slice(0, 3)" 
                                                  :key="area"
                                                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {{ focusAreas[area] || area }}
                                            </span>
                                            <span v-if="customer.focus_areas.length > 3" 
                                                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                +{{ customer.focus_areas.length - 3 }} weitere
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex flex-col items-end space-y-2 ml-4">
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                          :class="customer.score >= 0.9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                        {{ Math.round(customer.score * 100) }}%
                                    </span>
                                    <button
                                        @click="acceptHighScoreMatch(customer)"
                                        class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Diese Praxis wählen
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 pt-4 border-t border-green-200">
                            <button 
                                @click="proceedManuallyFromHighScore"
                                class="w-full bg-white text-green-700 px-4 py-2 rounded-md text-sm font-medium border border-green-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Keine der Praxen ist richtig - manuell fortfahren
                            </button>
                        </div>
                    </div>
                    </transition>

                    <!-- Loading state -->
                    <div v-if="isLoading" class="text-center py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p class="text-secondary">Lade Optionen...</p>
                    </div>

                    <!-- Error state -->
                    <div v-else-if="error" class="text-center py-12">
                        <div class="text-red-500 mb-4">
                            <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p class="text-red-600 mb-4">{{ error }}</p>
                        <button 
                            @click="loadEnumerations"
                            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                        >
                            Erneut versuchen
                        </button>
                    </div>

                    <!-- Form Content -->
                    <div v-else class="space-y-8">
                        <!-- Two Column Layout -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Left Column -->
                            <div class="space-y-8">
                                <!-- ZIP Code -->
                                <div class="relative">
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Postleitzahl deiner Praxis</h3>
                                    <div>
                                        <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-2">
                                            Postleitzahl *
                                        </label>
                                        <input
                                            id="postalCode"
                                            v-model="formData.postalCode"
                                            type="text"
                                            required
                                            maxlength="5"
                                            pattern="[0-9]{5}"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                            placeholder="z.B. 10117"
                                            @input="validatePostalCode"
                                            @blur="checkPotentialCustomers"
                                        />
                                    </div>

                                    <!-- Street (only shown when address data is available) -->
                                    <div v-if="showAddressFields" class="mt-4">
                                        <label for="street" class="block text-sm font-medium text-gray-700 mb-2">
                                            Straße und Hausnummer
                                        </label>
                                        <input
                                            id="street"
                                            v-model="formData.street"
                                            type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                            placeholder="z.B. Musterstraße 123"
                                        />
                                    </div>

                                    <!-- Inline Potential Customers (for scores 0.8-0.98) -->
                                    <div v-if="showInlinePotentialCustomers && inlinePotentialCustomers.length > 0" class="mt-4">
                                        <p class="text-sm text-gray-600 mb-3">
                                            Mögliche Übereinstimmungen gefunden:
                                        </p>
                                        <div class="space-y-2">
                                            <div 
                                                v-for="(customer, index) in inlinePotentialCustomers"
                                                :key="index"
                                                class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                                            >
                                                <div class="flex-1">
                                                    <div class="font-medium text-gray-900">
                                                        {{ customer.name || 'Unbekannt' }}
                                                    </div>
                                                    <div class="text-sm text-gray-500">
                                                        {{ customer.email || 'Keine E-Mail' }}
                                                    </div>
                                                </div>
                                                <div class="flex items-center space-x-3">
                                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                                          :class="customer.score >= 0.9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                                        {{ Math.round(customer.score * 100) }}%
                                                    </span>
                                                    <button
                                                        @click="adoptInlineCustomerData(customer)"
                                                        class="px-3 py-1 bg-accent text-white text-xs font-medium rounded hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                                                    >
                                                        Übernehmen
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Potential Customers Overlay -->
                                    <div 
                                        v-if="showPotentialCustomers && potentialCustomers.length > 0"
                                        class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                                        @click="closePotentialCustomersOverlay"
                                    >
                                        <div 
                                            class="bg-surface rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-hidden"
                                            @click.stop
                                        >
                                            <div class="px-6 border-b border-gray-200">
                                                <div class="flex items-center justify-between">
                                                    <h4 class="text-lg font-semibold text-gray-900">
                                                        Ist das deine Praxis?
                                                    </h4>
                                                    <button
                                                        @click="closePotentialCustomersOverlay"
                                                        class="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="max-h-64 overflow-y-auto">
                                                <div class="space-y-3">
                                                    <div 
                                                        v-for="(customer, index) in potentialCustomers"
                                                        :key="index"
                                                        class="flex items-center text-xs justify-between p-4  border-gray-200 rounded-lg hover:bg-gray-800"
                                                    >
                                                        <div class="flex-1 ">
                                                            <div v-if="customer.name">
                                                                {{ customer.name }}
                                                            </div>
                                                            <div class="mt-1" v-if="customer.email">
                                                                {{ customer.email }}
                                                            </div>
                                                        </div>
                                                        
                                                        <div class="flex items-center space-x-3">
                                                            <div class="text-right">
                                                                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                                                      :class="customer.score >= 0.9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                                                    {{ Math.round(customer.score * 100) }}%
                                                                </span>
                                                            </div>
                                                            <button
                                                                @click="adoptCustomerData(customer)"
                                                                class="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                                                            >
                                                                Übernehmen
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Practice Name -->
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Praxisname</h3>
                                    <div>
                                        <label for="practiceName" class="block text-sm font-medium text-gray-700 mb-2">
                                            Praxisname *
                                        </label>
                                        <input
                                            id="practiceName"
                                            v-model="formData.practiceName"
                                            type="text"
                                            required
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                            placeholder="Name deiner Praxis"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Right Column -->
                            <div class="space-y-8">
                                <!-- City -->
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Stadt deiner Praxis</h3>
                                    <div>
                                        <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                                            Stadt *
                                        </label>
                                        <input
                                            id="city"
                                            v-model="formData.city"
                                            type="text"
                                            required
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                            placeholder="z.B. Berlin"
                                        />
                                    </div>
                                    <p class="mt-2 text-sm text-gray-600">
                                        Diese Information hilft uns, passende regionale Einstellungen vorzunehmen.
                                    </p>
                                </div>

                                <!-- Contact Person -->
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Ansprechpartner</h3>
                                    <div>
                                        <label for="contactPerson" class="block text-sm font-medium text-gray-700 mb-2">
                                            Ansprechpartner
                                        </label>
                                        <input
                                            id="contactPerson"
                                            v-model="formData.contactPerson"
                                            type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                            placeholder="Dein Name oder der des Ansprechpartners"
                                        />
                                    </div>
                                </div>

                                <!-- Additional Notes -->
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900 mb-4">Zusätzliche Informationen</h3>
                                    <div>
                                        <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                                            Zusätzliche Informationen
                                        </label>
                                        <textarea
                                            id="notes"
                                            v-model="formData.notes"
                                            rows="4"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent"
                                            placeholder="Weitere Informationen zu deiner Praxis, besonderen Spezialisierungen oder Arbeitsweise..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Focus Areas and Service Offers Card -->
                <div class="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
                    <div class="grid md:grid-cols-2 gap-8">
                        <!-- Focus Areas -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Arbeitsschwerpunkte</h3>
                            <p class="text-sm text-gray-600 mb-4">
                                Bitte wähle deine hauptsächlichen Arbeitsbereiche aus. So können wir dir relevante Vernetzungspartner vorschlagen.
                            </p>
                            <div class="grid grid-cols-1 gap-3">
                                <label
                                    v-for="(label, key) in focusAreas"
                                    :key="key"
                                    class="relative flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <div class="flex items-center h-5">
                                        <input
                                            :id="`focus-${key}`"
                                            :value="key"
                                            v-model="formData.selectedFocusAreas"
                                            type="checkbox"
                                            class="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                        />
                                    </div>
                                    <div class="ml-3 text-sm">
                                        <span class="font-medium text-gray-900">{{ label }}</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Service Offers -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Angebotene Leistungen</h3>
                            <p class="text-sm text-gray-600 mb-4">
                                Welche Therapie- und Beratungsformen bietest du an?
                            </p>
                            <div class="grid grid-cols-1 gap-3">
                                <label
                                    v-for="(label, key) in serviceOffers"
                                    :key="key"
                                    class="relative flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <div class="flex items-center h-5">
                                        <input
                                            :id="`service-${key}`"
                                            :value="key"
                                            v-model="formData.selectedServiceOffers"
                                            type="checkbox"
                                            class="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                        />
                                    </div>
                                    <div class="ml-3 text-sm">
                                        <span class="font-medium text-gray-900">{{ label }}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <div class="flex justify-between items-center">
                    <button 
                        @click="goBack"
                        class="inline-flex items-center px-4 py-2 border border-default rounded-md shadow-sm text-sm font-medium text-secondary bg-surface hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                    >
                        <svg class="mr-2 -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        Zurück
                    </button>

                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-secondary">1 von 4</span>
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-accent rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                        </div>
                    </div>

                    <button 
                        @click="goNext"
                        class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
                    >
                        Weiter
                        <svg class="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, navigateTo } from '#app'
import { useOnboarding } from '~/composables/useOnboarding'
import { useEnumerations } from '~/composables/useEnumerations'

// Layout
definePageMeta({
    layout: 'onboarding'
})

// Meta-Tags für SEO
useHead({
    title: 'Praxisinformationen - Unburdy Onboarding',
    meta: [
        { name: 'description', content: 'Schritt 1: Grundlegende Informationen zu deiner Praxis einrichten.' }
    ]
})

// Composables
const router = useRouter()
const { updateOnboardingData, getOnboardingData, setCurrentStep } = useOnboarding()
const { focusAreas, serviceOffers, isLoading, error, loadEnumerations } = useEnumerations()

// Form data
const formData = ref({
    postalCode: '',
    city: '',
    street: '',
    practiceName: '',
    contactPerson: '',
    selectedFocusAreas: [],
    selectedServiceOffers: [],
    notes: ''
})

// Show address fields when customer data includes address
const showAddressFields = ref(false)

// Potential customers state
const potentialCustomers = ref([])
const showPotentialCustomers = ref(false)
const isCheckingCustomers = ref(false)

// Semantic flow state
const showSearchResult = ref(false)
const semanticFlowData = ref({})

// Inline potential customers (for scores 0.8-0.98)
const inlinePotentialCustomers = ref([])
const showInlinePotentialCustomers = ref(false)

// Manual search card (for when no match found)
const showManualSearchCard = ref(false)
const manualSearchZip = ref('')
const manualSearchResults = ref([])
const isManualSearching = ref(false)

// High score matches card (for when user data finds multiple good matches)
const showHighScoreMatches = ref(false)
const highScoreMatches = ref([])

// User data matching
const isInitialDataCheck = ref(true)

// Load existing data if available
const existingData = getOnboardingData()
console.log('Existing onboarding data:', existingData)

if (existingData?.stepData?.step1) {
    formData.value = { ...formData.value, ...existingData.stepData.step1 }
}

// Update current step
setCurrentStep(1)

// Methods
const validatePostalCode = (event) => {
    // Only allow digits and limit to 5 characters
    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 5)
    formData.value.postalCode = value
    
    // Automatically search when 3rd digit of ZIP is entered
    if (value.length >= 3) {
        checkPotentialCustomers(true)
    }
}

// Parse address from customer data into separate components
const parseAddress = (address) => {
    if (!address || typeof address !== 'string') {
        return { street: '', city: '', postalCode: '' }
    }

    // Common German address patterns
    // Pattern 1: "Musterstraße 123, 10115 Berlin"
    // Pattern 2: "Musterstraße 123\n10115 Berlin"
    // Pattern 3: "Musterstraße 123 10115 Berlin"
    
    const addressParts = address.split(/[,\n]/).map(part => part.trim())
    
    if (addressParts.length >= 2) {
        const street = addressParts[0]
        const cityLine = addressParts[1]
        
        // Extract postal code and city from "10115 Berlin"
        const cityMatch = cityLine.match(/^(\d{5})\s+(.+)$/)
        if (cityMatch) {
            return {
                street: street,
                postalCode: cityMatch[1],
                city: cityMatch[2]
            }
        }
    }
    
    // Single line address: try to extract postal code pattern
    const singleLineMatch = address.match(/^(.+?)\s+(\d{5})\s+(.+)$/)
    if (singleLineMatch) {
        return {
            street: singleLineMatch[1],
            postalCode: singleLineMatch[2],
            city: singleLineMatch[3]
        }
    }
    
    // Fallback: return original as street
    return { street: address, city: '', postalCode: '' }
}

const checkPotentialCustomers = async (autoFill = false) => {
    // Start searching when 3rd digit is entered
    const minLength = 3
    if (formData.value.postalCode.length < minLength) {
        return
    }

    try {
        isCheckingCustomers.value = true
        
        // Get user data for enhanced search
        const onboardingData = getOnboardingData()
        const userData = onboardingData?.stepData?.user || {}
        
        // Combine ZIP code with user data for comprehensive search
        const queryParams = new URLSearchParams({
            zip: formData.value.postalCode,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || ''
        })
        
        console.log('Searching with ZIP and user data:', {
            zip: formData.value.postalCode,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || ''
        })
        
        const response = await $fetch(`/api/fuzzy/potential-customers?${queryParams.toString()}`)
        console.log('Potential customers found:', response)

        if (response?.results?.length > 0) {
            const processedCustomers = response.results.map((item) => ({ ...item.customer, score: item.score }))
            
            // For very high confidence matches (>0.98) - auto adopt with semantic flow
            const veryHighScoreCustomers = processedCustomers.filter(customer => customer.score > 0.98)
            if (veryHighScoreCustomers.length >= 1) {
                const bestMatch = veryHighScoreCustomers[0]
                showSearchResultWithData(bestMatch)
                return
            }
            
            // Apply new filtering rules for inline display
            const highScoreCustomers = processedCustomers.filter(customer => customer.score > 0.85)
            const mediumScoreCustomers = processedCustomers.filter(customer => customer.score > 0.7 && customer.score <= 0.85)
            
            // Show all results over 0.85, plus max 3 results under 0.85
            let customersToShow = [...highScoreCustomers]
            if (mediumScoreCustomers.length > 0) {
                const maxMediumResults = Math.min(3, mediumScoreCustomers.length)
                customersToShow = [...customersToShow, ...mediumScoreCustomers.slice(0, maxMediumResults)]
            }
            
            if (customersToShow.length > 0) {
                // Sort by score (highest first)
                customersToShow.sort((a, b) => b.score - a.score)
                inlinePotentialCustomers.value = customersToShow
                showInlinePotentialCustomers.value = true
                return
            }
        }
    } catch (err) {
        console.error('Error checking potential customers:', err)
        // Silently fail - this is not critical functionality
    } finally {
        isCheckingCustomers.value = false
    }
}

const closePotentialCustomersOverlay = () => {
    showPotentialCustomers.value = false
}

// Handle keyboard events
const handleKeydown = (event) => {
    if (event.key === 'Escape' && showPotentialCustomers.value) {
        closePotentialCustomersOverlay()
    }
}

const adoptCustomerData = (customer, isAutoFill = false) => {
    // Get existing user data
    const existingData = getOnboardingData()
    
    // Pre-fill form with customer data
    if (customer.name) {
        formData.value.practiceName = customer.name
    }
    if (customer.email) {
        formData.value.contactPerson = customer.email
    } else if (existingData?.stepData?.user) {
        // Fallback to user data if no customer email
        const firstName = existingData.stepData.user.first_name || ''
        const lastName = existingData.stepData.user.last_name || ''
        if (firstName || lastName) {
            formData.value.contactPerson = `${firstName} ${lastName}`.trim()
        }
    }
    
    // Parse and set address information
    if (customer.address) {
        const addressParts = parseAddress(customer.address)
        
        if (addressParts.street) {
            formData.value.street = addressParts.street
            showAddressFields.value = true
        }
        if (addressParts.city && !formData.value.city) {
            formData.value.city = addressParts.city
        }
        if (addressParts.postalCode && !formData.value.postalCode) {
            formData.value.postalCode = addressParts.postalCode
        }
    } else {
        // Individual address fields
        if (customer.street) {
            formData.value.street = customer.street
            showAddressFields.value = true
        }
        if (customer.city && !formData.value.city) {
            formData.value.city = customer.city
        }
    }
    
    // Set focus areas if available
    if (customer.focus_areas && Array.isArray(customer.focus_areas)) {
        formData.value.selectedFocusAreas = customer.focus_areas
    } else if (customer.selectedFocusAreas && Array.isArray(customer.selectedFocusAreas)) {
        formData.value.selectedFocusAreas = customer.selectedFocusAreas
    }
    
    // Set service offers if available
    if (customer.service_offers && Array.isArray(customer.service_offers)) {
        formData.value.selectedServiceOffers = customer.service_offers
    } else if (customer.selectedServiceOffers && Array.isArray(customer.selectedServiceOffers)) {
        formData.value.selectedServiceOffers = customer.selectedServiceOffers
    }
    
    // Set additional notes if available
    if (customer.notes) {
        formData.value.notes = customer.notes
    }
    
    // Close the overlay (only if not auto-fill)
    if (!isAutoFill) {
        closePotentialCustomersOverlay()
    }
    
    // Save the updated data
    saveFormData()
}

// New methods for semantic flow and user data matching
const checkInitialUserDataMatch = async () => {
    const userData = existingData?.stepData?.user || {}
    
    // If we have user data, check if it matches existing customers
    if (userData.email || (userData.first_name && userData.last_name)) {
        try {
            const queryParams = new URLSearchParams({
                zip: userData.postal_code || '',
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || ''
            })
            
            const response = await $fetch(`/api/fuzzy/potential-customers?${queryParams.toString()}`)
            console.log('Initial user data match response:', response)
            if (response?.results?.length > 0) {
                const processedCustomers = response.results.map((item) => ({ ...item.customer, score: item.score }))
                
                // Filter customers with high scores (>0.8)
                const highScoreCustomers = processedCustomers.filter(customer => customer.score > 0.8)
                
                if (highScoreCustomers.length > 0) {
                    // Find very high matches (>0.98) for automatic adoption
                    const veryHighScoreCustomers = highScoreCustomers.filter(customer => customer.score > 0.98)
                    
                    if (veryHighScoreCustomers.length === 1) {
                        // Single very high match - show semantic flow immediately
                        showSearchResultWithData(veryHighScoreCustomers[0])
                    } else if (highScoreCustomers.length === 1 && highScoreCustomers[0].score > 0.9) {
                        // Single high match - show semantic flow
                        showSearchResultWithData(highScoreCustomers[0])
                    } else if (highScoreCustomers.length > 1) {
                        // Multiple high matches - show selection card
                        highScoreMatches.value = highScoreCustomers.sort((a, b) => b.score - a.score)
                        showHighScoreMatches.value = true
                        // Also populate basic form with user data
                        fillFormWithUserData(userData)
                    } else {
                        // Single medium match - populate ZIP and let user search
                        if (highScoreCustomers[0].postal_code) {
                            formData.value.postalCode = highScoreCustomers[0].postal_code
                        }
                        fillFormWithUserData(userData)
                    }
                } else {
                    // No high score match - show manual search card and populate form with user data
                    showManualSearchCard.value = true
                    fillFormWithUserData(userData)
                }
            } else {
                // No API results - show manual search card and populate form with user data
                showManualSearchCard.value = true
                fillFormWithUserData(userData)
            }
        } catch (error) {
            console.error('Error checking initial user data:', error)
            // Fallback to user data and show manual search
            showManualSearchCard.value = true
            fillFormWithUserData(userData)
        }
    }
}

const fillFormWithUserData = (userData) => {
    if (userData.first_name || userData.last_name) {
        formData.value.contactPerson = `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
    }
    if (userData.postal_code) {
        formData.value.postalCode = userData.postal_code
    }
    if (userData.city) {
        formData.value.city = userData.city
    }
    if (userData.street) {
        formData.value.street = userData.street
        showAddressFields.value = true
    }
}

const showSearchResultWithData = (customerData) => {
    semanticFlowData.value = {
        ...customerData,
        ...parseCustomerData(customerData)
    }
    showSearchResult.value = true
}

const parseCustomerData = (customer) => {
    const parsed = {
        practiceName: customer.name || '',
        contactPerson: customer.email || '',
        selectedFocusAreas: customer.focus_areas || customer.selectedFocusAreas || [],
        selectedServiceOffers: customer.service_offers || customer.selectedServiceOffers || [],
        notes: customer.notes || ''
    }
    
    // Parse address
    if (customer.address) {
        const addressParts = parseAddress(customer.address)
        parsed.street = addressParts.street
        parsed.city = addressParts.city
        parsed.postalCode = addressParts.postalCode
    } else {
        parsed.street = customer.street || ''
        parsed.city = customer.city || ''
        parsed.postalCode = customer.postal_code || customer.postalCode || ''
    }
    
    return parsed
}

const acceptSearchResult = () => {
    // Apply all semantic flow data to form
    Object.assign(formData.value, semanticFlowData.value)
    if (semanticFlowData.value.street) {
        showAddressFields.value = true
    }
    showSearchResult.value = false
    saveFormData()
}

const dicardSearchResults = () => {
    // Fill form with user data only
    const userData = existingData?.stepData?.user || {}
    fillFormWithUserData(userData)
    showSearchResult.value = false
}

const adoptInlineCustomerData = (customer) => {
    const parsedData = parseCustomerData(customer)
    showSearchResultWithData(parsedData)
    // Hide inline customers
    showInlinePotentialCustomers.value = false
}

const formatAddress = (data) => {
    const parts = []
    if (data.street) parts.push(data.street)
    if (data.postalCode && data.city) {
        parts.push(`${data.postalCode} ${data.city}`)
    } else if (data.city) {
        parts.push(data.city)
    }
    return parts.join(', ') || 'Nicht verfügbar'
}

const saveFormData = () => {
    updateOnboardingData({
        step1: formData.value
    })
}

const goBack = async () => {
    saveFormData() // Save data before navigating
    await navigateTo('/onboarding/start')
}

const goNext = async () => {
    saveFormData() // Save data before navigating
    await navigateTo('/onboarding/schritt/2')
}

// Manual search functionality
const validateManualSearchZip = (event) => {
    // Only allow digits and limit to 5 characters
    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 5)
    manualSearchZip.value = value
    
    // Clear results if ZIP changes
    if (manualSearchResults.value.length > 0) {
        manualSearchResults.value = []
    }
    
    // Automatically search when there are at least 3 digits
    if (value.length >= 3) {
        performManualSearch()
    }
}

const performManualSearch = async () => {
    // Search when there are at least 3 digits
    if (manualSearchZip.value.length < 3) return
    
    try {
        isManualSearching.value = true
        manualSearchResults.value = []
        
        // Get user data for enhanced search
        const onboardingData = getOnboardingData()
        const userData = onboardingData?.stepData?.user || {}
        
        // Search with ZIP code AND user data for better matching
        const queryParams = new URLSearchParams({
            zip: manualSearchZip.value,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || ''
        })
        
        console.log('Manual search with combined data:', {
            zip: manualSearchZip.value,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || ''
        })
        
        const response = await $fetch(`/api/fuzzy/potential-customers?${queryParams.toString()}`)
        
        if (response?.results?.length > 0) {
            manualSearchResults.value = response.results.map((item) => ({ ...item.customer, score: item.score }))
        }
    } catch (error) {
        console.error('Error performing manual search:', error)
    } finally {
        isManualSearching.value = false
    }
}

const acceptManualSearchResult = (customer) => {
    // Same logic as adoptCustomerData but close the search card
    adoptCustomerData(customer)
    closeManualSearchCard()
}

const closeManualSearchCard = () => {
    showManualSearchCard.value = false
    manualSearchZip.value = ''
    manualSearchResults.value = []
}

// High score matches functionality
const acceptHighScoreMatch = (customer) => {
    // Use the same logic as adoptCustomerData to fill the form
    adoptCustomerData(customer)
    closeHighScoreMatches()
}

const closeHighScoreMatches = () => {
    showHighScoreMatches.value = false
    highScoreMatches.value = []
}

const proceedManuallyFromHighScore = () => {
    // Fill form with user data only and close the matches card
    const userData = existingData?.stepData?.user || {}
    fillFormWithUserData(userData)
    closeHighScoreMatches()
}

const formatCustomerAddress = (customer) => {
    if (customer.address) {
        return customer.address
    }
    
    const parts = []
    if (customer.street) parts.push(customer.street)
    if (customer.postal_code && customer.city) {
        parts.push(`${customer.postal_code} ${customer.city}`)
    } else if (customer.city) {
        parts.push(customer.city)
    } else if (customer.postal_code) {
        parts.push(customer.postal_code)
    }
    
    return parts.join(', ') || 'Adresse nicht verfügbar'
}

// Load enumerations on mount
onMounted(async () => {
    try {
        await loadEnumerations()
        
        // Check for initial user data match
        await checkInitialUserDataMatch()
        
        // Add keyboard event listener for ESC key
        document.addEventListener('keydown', handleKeydown)
    } catch (err) {
        console.error('Failed to load enumerations or check user data:', err)
    }
})

// Clean up event listener on unmount
onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>
