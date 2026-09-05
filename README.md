# 🐦 Blackbird Project

Gestion multi-agents d'un projet professionnel avec **3 développeurs IA spécialisés**.

## 🚀 Quick Start

### Prerequis
```bash
# Lire d'abord l'architecture
cat CLAUDE.md

# Vérifier la branche de développement
git branch -a
```

### Structure
```
blacckbird/
├── CLAUDE.md                    # Architecture & workflow
├── .claude/
│   └── agents.config.json       # Configuration multi-agents
├── src/                         # Code source
│   ├── core/                   # 🔧 Agent Backend
│   ├── api/                    # 🔧 Agent Backend
│   ├── ui/                     # 🎨 Agent Frontend
│   └── components/             # 🎨 Agent Frontend
├── tests/                      # 🧪 Agent QA
├── docs/                       # 📚 Agent QA
└── .github/                    # ⚙️ Agent QA
```

## 👨‍💻 Les 3 Agents

| Agent | Rôle | Répertoires |
|-------|------|-------------|
| 🔧 **Backend** | Infrastructure, APIs, Logique | `src/core/`, `src/api/` |
| 🎨 **Frontend** | UI, Composants, Styles | `src/ui/`, `src/components/` |
| 🧪 **QA/Tests** | Tests, Docs, CI/CD | `tests/`, `docs/`, `.github/` |

## 📋 Workflow par Agent

### Phase 1: ANALYSE
```
✓ Comprendre l'architecture
✓ Identifier les dépendances
✓ Détecter les risques
✓ Proposer un plan
```

### Phase 2: DÉVELOPPEMENT
```
✓ Modification unique à la fois
✓ Code propre et modulaire
✓ Respect architecture
✓ Éviter régressions
```

### Phase 3: VÉRIFICATION
```
✓ Tester la modification
✓ Vérifier le build
✓ Pas d'erreurs
✓ Projet fonctionnel
```

### Phase 4: GIT
```bash
git add .
git commit -m "feat: description claire"
git push origin claude/3-dev-agents-project-yphrrv
```

## 🔄 Coordination

Tous les agents travaillent sur : **`claude/3-dev-agents-project-yphrrv`**

```
Agent Backend
      ↓
   (APIs)
      ↓
Agent Frontend → Agent QA/Tests
      ↓              ↓
   (UI)        (validation)
      ↓              ↓
   main ←---← stable & tested
```

## 📊 Git Status

```bash
# Vérifier le status
git status

# Voir l'historique
git log --oneline -10

# Voir la branche actuelle
git branch -v
```

## ⚠️ Règles Critiques

- ❌ **JAMAIS** continuer sur une base cassée
- ❌ **JAMAIS** force-push sans permission
- ❌ **JAMAIS** ignorer une erreur
- ✅ **TOUJOURS** analyser avant de coder
- ✅ **TOUJOURS** tester après modification
- ✅ **TOUJOURS** commits atomiques

## 🆘 En cas de Problème

```bash
# Vérifier l'état du projet
git status
git diff

# Annuler le dernier commit
git revert HEAD

# Retourner à la version stable
git reset --hard origin/main
```

---

**Statut** : ✅ Prêt pour développement multi-agents  
**Branche active** : `claude/3-dev-agents-project-yphrrv`  
**Last Update** : 2026-09-05
