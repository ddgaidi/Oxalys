import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT pour write
)

// random helper
const rand = (min: number, max: number) =>
    Math.random() * (max - min) + min

async function updateStations() {
    // récupérer toutes les stations
    const { data: stations, error } = await supabase
        .from('station')
        .select('id')

    if (error || !stations) {
        console.error(error)
        return
    }

    // update chaque station avec valeurs différentes
    const updates = stations.map((s) => ({
        id: s.id,
        co2_moyen: Math.round(rand(10, 200)),
        voc_moyen: Math.round(rand(10, 200)),
        temperature_moyenne: parseFloat(rand(15, 50).toFixed(1)),
        humidite_moyenne: Math.round(rand(30, 80)) // cohérent
    }))

    const { error: updateError } = await supabase
        .from('station')
        .upsert(updates)

    if (updateError) {
        console.error(updateError)
    } else {
        console.log('Stations mises à jour 🚀')
    }
}

// loop toutes les 20 secondes
setInterval(updateStations, 20000)

// run direct au lancement
updateStations()