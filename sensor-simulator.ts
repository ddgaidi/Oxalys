import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ITIS_FABLAB_ID = '77e1c60c-41fe-40d0-a88d-1eeb9c3fd6e3'

const rand = (min: number, max: number) =>
    Math.random() * (max - min) + min

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value))

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
        const current = Number(station.air_qualite ?? rand(80, 180))

        // Variation progressive : entre -25 et +25 max
        const variation = rand(-25, 25)

        const nextAirQualite = Math.round(
            clamp(current + variation, 20, 700)
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
        console.log('Air qualité mis à jour progressivement 🚀')
    }
}

setInterval(updateStations, 1000)

updateStations()