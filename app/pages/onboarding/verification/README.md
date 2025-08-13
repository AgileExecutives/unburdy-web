# E-Mail-Verifizierung System

## Übersicht

Das E-Mail-Verifizierungssystem implementiert eine vollständige Verifizierungslogik mit Token-Management und Login-Schutz:

1. **Speichert Verifizierungstoken mit Benutzern**
2. **Gibt HTTP 200 bei Erfolg oder entsprechende Fehlercodes zurück**
3. **Entfernt Token nach erfolgreicher Verifizierung**
4. **Blockiert Login für Benutzer mit ausstehenden Verifizierungstoken**

## Server-Endpunkte

### `/api/verify` - E-Mail-Verifizierung
- **Datei**: `server/api/verify.get.ts`
- **Methode**: GET
- **Parameter**: `token` (query parameter)
- **Rückgabe**: `VerificationResponse` mit JWT-Token und Benutzerdaten
- **Funktionen**:
  - Validiert Verifizierungstoken über Backend-API
  - Entfernt Token nach erfolgreicher Verifizierung
  - Aktiviert Benutzerkonto (setzt `verified_at`)
- **HTTP Status Codes**:
  - `200`: Erfolgreiche Verifizierung
  - `400`: Ungültiger/falsch formatierter Token
  - `404`: Token nicht gefunden oder abgelaufen
  - `410`: Token bereits verwendet
  - `422`: Benutzer bereits verifiziert

### `/api/login` - Login mit Verifizierungsprüfung
- **Datei**: `server/api/login.post.ts`
- **Methode**: POST
- **Parameter**: `{ email, password }`
- **Funktionen**:
  - Überprüft Anmeldedaten über Backend-API
  - **Blockiert Login für nicht-verifizierte Benutzer**
  - Gibt spezielle Antwort für unverifizierten Status
- **Rückgabe**: 
  - Bei Erfolg: JWT-Token und Benutzerdaten
  - Bei unverifiziertem Account: `requiresVerification: true`
- **Rate Limiting**: 5 Versuche pro 15 Minuten pro IP

### Frontend-Seiten

#### Token als Path Parameter
- **Route**: `/onboarding/verification/[token]`
- **URL-Format**: `https://example.com/onboarding/verification/abc123xyz`
- **Verwendung**: Direkte Links mit Token im Pfad

## Funktionen

### Automatische Verifizierung
- Token wird automatisch beim Laden der Seite verifiziert
- Loading-Zustand während der Verifizierung
- Erfolgs- oder Fehlermeldung basierend auf dem Ergebnis

### Fehlerbehandlung
- **Ungültiger Token**: Token ist falsch formatiert
- **Token nicht gefunden**: Token existiert nicht oder ist abgelaufen
- **Token bereits verwendet**: Token wurde bereits einmal verwendet
- **Allgemeine Fehler**: Unerwartete Server- oder Netzwerkfehler

### Benutzerinteraktion
- **Erfolg**: Direkter Link zur Login-Seite
- **Fehler**: Option zum erneuten Versuch oder neuen Account erstellen
- **Hilfe**: Link zur Kontaktseite bei Problemen

### Analytics-Tracking
- Erfolgreiche Verifizierungen werden getrackt
- Fehlgeschlagene Verifizierungen werden mit Fehlercode getrackt

## Deutsche Benutzerfreundlichkeit

Alle Nachrichten sind in deutscher Sprache:
- Erfolg: "E-Mail erfolgreich bestätigt!"
- Fehler: Spezifische Fehlermeldungen je nach Problem
- Aktionen: "Zum Login", "Erneut versuchen", etc.

## Sicherheit

- Token-Validierung erfolgt server-seitig
- Keine sensiblen Daten im Client-Code
- Proper Error-Handling verhindert Information-Leakage
- CSRF-Schutz durch Server-Endpunkt
