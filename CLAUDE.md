# Blackbird Project - Multi-Agent Architecture

## 🎯 Architecture à 3 Agents Développeurs

Ce projet est géré par **3 agents développeurs spécialisés** travaillant en parallèle sur une branche dédiée `claude/3-dev-agents-project-yphrrv`.

### 👨‍💻 Les 3 Agents

#### 1. **AGENT BACKEND** (Agent Core/Infrastructure)
- **Responsabilités** :
  - Architecture globale
  - Logique métier
  - APIs et données
  - Sécurité & performance
- **Répertoires** : `src/core/`, `src/api/`, `src/services/`
- **Préfixe commits** : `feat/core:`, `fix/core:`, `refactor/core:`

#### 2. **AGENT FRONTEND** (Agent UI/UX)
- **Responsabilités** :
  - Interface utilisateur
  - Composants visuels
  - Intégration APIs
  - Responsive design
- **Répertoires** : `src/ui/`, `src/components/`, `public/`
- **Préfixe commits** : `feat/ui:`, `fix/ui:`, `refactor/ui:`

#### 3. **AGENT QA/TESTS** (Agent Qualité)
- **Responsabilités** :
  - Tests unitaires
  - Tests d'intégration
  - Documentation
  - CI/CD & validation
  - Performance & monitoring
- **Répertoires** : `tests/`, `docs/`, `.github/`
- **Préfixe commits** : `test:`, `docs:`, `ci:`, `perf:`

---

## 🔄 Workflow Obligatoire (Respecté par tous les agents)

Chaque agent suit ce workflow **STRICT** :

### 1️⃣ **ANALYSE**
```
- Analyser l'architecture
- Identifier les dépendances
- Détecter les risques possibles
- Proposer un plan clair avant d'écrire du code
```

### 2️⃣ **DÉVELOPPEMENT** (Petites étapes)
```
- Une seule modification à la fois
- Code propre et modulaire
- Respect de l'architecture existante
- Éviter les régressions
```

### 3️⃣ **VÉRIFICATION** (OBLIGATOIRE)
```
- Tests automatisés (unitaires, intégration)
- Vérification du build
- Pas d'erreurs console
- Projet reste fonctionnel
```

### 4️⃣ **VERSIONNING GIT**
```bash
git checkout -b feature/description    # Créer une feature branch
git add .                              # Staged all changes
git commit -m "feat: description"      # Commit avec message clair
git push origin feature/description    # Push to remote
```

**Format des commits** :
```
feat: nouvelle fonctionnalité
fix: correction bug
refactor: amélioration structure  
docs: documentation
test: tests unitaires
perf: optimisation
security: correctif sécurité
ci: pipeline & configuration
```

---

## ⚠️ Gestion des Erreurs (Très Important)

Si une modification échoue :

1. **Identifier précisément** la cause
2. **Proposer la solution** la plus sûre
3. **Tenter une correction** propre
4. **Si instabilité** : ROLLBACK IMMÉDIAT
   ```bash
   git revert <commit>      # Annuler un commit spécifique
   git reset --hard HEAD~1  # Annuler le dernier commit
   ```

### ❌ INTERDIT ABSOLUMENT
- ❌ Supprimer du code critique sans validation
- ❌ Modifications massives non testées
- ❌ Ignorer une erreur et continuer
- ❌ Architecture incohérente ou "quick and dirty"
- ❌ Continuer sur une base cassée

---

## 📊 Coordination Inter-Agents

Les 3 agents se **coordonnent via Git** :

- **Branche commune** : `claude/3-dev-agents-project-yphrrv`
- **Communication** : Commits atomiques + PR comments
- **Conflits** : Merge avec résolution propre (jamais force-push)
- **Dépendances** : Agent QA valide le travail des autres agents

### 🔗 Dépendances par Agent
```
Frontend → Backend (APIs + données)
        ↓
QA/Tests (valide tout)

Backend → QA/Tests (couverture 80%+ min)

QA/Tests → CI/CD (pipeline vert)
```

---

## 📁 Structure du Projet

```
blacckbird/
├── src/
│   ├── core/              # AGENT BACKEND
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── api/              # AGENT BACKEND
│   │   ├── routes/
│   │   └── middleware/
│   ├── ui/               # AGENT FRONTEND
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   └── components/       # AGENT FRONTEND
├── tests/                # AGENT QA
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                 # AGENT QA
├── public/               # AGENT FRONTEND
├── .github/              # AGENT QA
│   └── workflows/
├── .claude/              # Configuration agents
│   └── agents.config.json
└── CLAUDE.md            # This file
```

---

## 🚀 Règles de Sécurité & Stabilité

### ✅ OBLIGATOIRE
- ✅ Analyser avant de coder
- ✅ Expliquer les modifications avant d'écrire
- ✅ Tester après chaque modification
- ✅ Garder une version fonctionnelle
- ✅ Vérifier l'impact avant un changement
- ✅ Commit atomique = 1 logique métier

### 🔐 SÉCURITÉ
- Pas de secrets en git (USE `.env.example`)
- Validation input à tous les points
- OWASP Top 10 awareness
- Audit des dépendances externes

### 📈 PERFORMANCE
- Tests de charge avant production
- Monitoring & alertes
- Logs structurés
- Métriques claires

---

## 📋 Checklist Pre-Merge

**Avant de merger sur `main`** :

- [ ] Tous les tests passent (CI/CD vert)
- [ ] Code review approuvé
- [ ] Pas de régressions
- [ ] Documentation à jour
- [ ] Commits clairs et atomiques
- [ ] Pas de code commented
- [ ] Pas de console.log() en production
- [ ] Performance acceptable

---

## 🔗 Commandes Utiles

```bash
# Synchroniser avec main
git fetch origin main
git merge origin/main

# Voir l'historique du projet
git log --oneline --graph --all

# Vérifier les dépendances de branche
git log --oneline origin/main..origin/claude/3-dev-agents-project-yphrrv

# Annuler un commit
git revert <commit-hash>

# Status complet
git status -s
```

---

## 📞 Escalade

- **Bloqué** : Demander aux autres agents (via PR comment)
- **Architecture** : Valider avec l'équipe
- **Production** : Double validation obligatoire
- **Sécurité** : Alert immédiatement

---

**Dernière mise à jour** : 2026-09-05  
**Status** : Projet initialisé - Prêt pour 3 agents en parallèle
