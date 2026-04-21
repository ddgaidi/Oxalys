# Oxalys 🔬

> La plateforme qui connecte makers et FabLabs partout en France.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth + DB + Storage)

---

## Structure du projet

```
oxalys/
├── app/
│   ├── page.tsx                    # Page Accueil
│   ├── layout.tsx                  # Layout racine (Navbar, Footer)
│   ├── globals.css                 # Styles globaux + variables CSS
│   ├── accueil/
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── PartnersSection.tsx
│   │   └── AboutSection.tsx
│   ├── tarifs/
│   │   └── page.tsx
│   ├── ton-fablab/
│   │   ├── page.tsx                # Liste des FabLabs + recherche
│   │   └── [slug]/
│   │       ├── page.tsx            # Détail FabLab
│   │       └── FabLabFavoriteButton.tsx
│   └── auth/
│       ├── page.tsx                # Page Auth (login/register)
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx        # Inscription multi-étapes
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── OxalysLogo.tsx
│       ├── SafetyBadge.tsx
│       ├── FabLabCard.tsx
│       ├── PlanCard.tsx
│       └── TrustedSection.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Supabase browser client
│   │   └── server.ts               # Supabase server client
│   ├── hooks/
│   │   ├── useFavorites.ts         # Gestion favoris (local + DB)
│   │   └── useCountUp.ts           # Compteur animé
│   ├── context/
│   │   └── ThemeContext.tsx        # Dark/light mode
│   └── data.ts                     # Mock data + constantes
│
├── types/
│   └── index.ts                    # TypeScript types globaux
│
└── supabase-schema.sql             # Schéma SQL à exécuter dans Supabase
```

---

## Démarrage rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez `.env.local.example` → `.env.local`
3. Renseignez votre URL et clé anonyme Supabase
4. Exécutez `supabase-schema.sql` dans l'éditeur SQL Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## Fonctionnalités

### 🏠 Accueil
- Hero animé avec orbes lumineux et cartes flottantes
- Compteurs animés au scroll (1 200+ FabLabs, 48 dép., 15 000+ makers)
- Section partenaires, "Qui sommes-nous ?", et références

### 💰 Tarifs
- Toggle Mensuel / Annuel (−30%)
- 3 plans : Starter, Pro, Enterprise
- CTA "Faire un devis" pour offres sur-mesure

### 🔬 Ton FabLab
- Recherche par nom, ville ou code postal
- Favoris : localStorage pour les visiteurs, Supabase pour les membres (max 5)
- Badge sécurité : ✅ Safe / ⚠️ Caution / 🚫 Danger
- Page détail par FabLab avec équipements, contacts, carte

### 🔐 Authentification
- Inscription multi-étapes (4 étapes)
- Connexion par email ou numéro de téléphone
- Dark / Light mode persistant

---

## Thème

Les couleurs principales sont définies via des classes Tailwind et des variables CSS :

| Variable | Dark | Light |
|---|---|---|
| `--bg` | `#050a12` | `#f8fafc` |
| `--bg-card` | `rgba(15,23,42,.8)` | `#ffffff` |
| `--text` | `#e2e8f0` | `#1e293b` |
| Accent bleu | `#38bdf8` | `#0ea5e9` |
| Accent vert | `#4ade80` | `#22c55e` |
