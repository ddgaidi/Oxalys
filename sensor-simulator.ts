import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import WebSocket from 'ws'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        realtime: {
            transport: WebSocket
        }
    }
)

const ITIS_FABLAB_ID = '77e1c60c-41fe-40d0-a88d-1eeb9c3fd6e3'

const rand = (min: number, max: number) =>
    Math.random() * (max - min) + min

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value))

// --- NOUVEAUX SEUILS OXALYS ---
const SEUIL_OPTIMAL = 180
const SEUIL_MOYEN = 260
const SEUIL_ALERTE = 390

// Etats possibles simulés
type EtatAir =
    | 'OPTIMAL'
    | 'MOYEN'
    | 'ALERTE'
    | 'DANGER'

// Choix aléatoire pondéré
function genererEtat(): EtatAir {
    const r = Math.random()

    if (r < 0.60) return 'OPTIMAL'
    if (r < 0.85) return 'MOYEN'
    if (r < 0.97) return 'ALERTE'

    return 'DANGER'
}

// Génère une valeur cohérente avec les seuils
function genererValeurSelonEtat(etat: EtatAir): number {

    switch (etat) {

        case 'OPTIMAL':
            return rand(120, 179)

        case 'MOYEN':
            return rand(180, 259)

        case 'ALERTE':
            return rand(260, 389)

        case 'DANGER':
            return rand(390, 550)
    }
}

async function updateStations() {

    const { data: stations, error } = await supabase
        .from('station')
        .select('id, air_qualite, fablab_id')
        .neq('fablab_id', ITIS_FABLAB_ID)

    if (error || !stations) {
        console.error(error)
        return
    }

    const updates = stations.map((station) => {

        const current = Number(
            station.air_qualite ?? rand(130, 170)
        )

        // Etat cible
        const etat = genererEtat()

        // Valeur cible cohérente
        const target = genererValeurSelonEtat(etat)

        // Variation progressive
        const diff = target - current

        // Limite la vitesse de changement
        const variation = clamp(
            diff,
            -20,
            20
        )

        const nextAirQualite = Math.round(
            clamp(
                current + variation,
                80,
                550
            )
        )

        return {
            id: station.id,
            air_qualite: nextAirQualite,
        }
    })

    const { error: updateError } = await supabase
        .from('station')
        .upsert(updates, {
            onConflict: 'id',
        })

    if (updateError) {
        console.error(updateError)
    } else {
        console.log('Air qualité Oxalys mise à jour 🌫️')
    }
}

setInterval(updateStations, 1000)

updateStations()