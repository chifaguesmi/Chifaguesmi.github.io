# Chifa Guesmi — Portfolio

Portfolio personnel développé avec **React + Vite**, déployé automatiquement sur GitHub Pages.

## 🚀 Stack
- React 18
- Vite
- CSS-in-JS (inline styles + animations CSS)
- GitHub Actions (CI/CD auto-deploy)

## 📁 Structure
```
├── src/
│   ├── App.jsx        # Composant principal
│   ├── main.jsx       # Entry point React
│   └── index.css      # Animations CSS globales
├── public/
│   ├── profile.jpg    # ← Ajouter ta photo ici
│   ├── Chifa_Guesmi_CV.pdf  # ← Ajouter ton CV ici
│   └── favicon.svg
├── .github/workflows/
│   └── deploy.yml     # Auto-deploy sur GitHub Pages
├── index.html
├── vite.config.js
└── package.json
```

## 🛠️ Dev local
```bash
npm install
npm run dev
```

## 📸 Ajouter ta photo & ton CV
Placer les fichiers dans `/public/` :
- `profile.jpg` — ta photo de profil
- `Chifa_Guesmi_CV.pdf` — ton CV

## 🌐 Déploiement
Le déploiement se fait **automatiquement** à chaque push sur `main` via GitHub Actions.
