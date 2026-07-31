# Gestion de l'État Global (Redux Toolkit & Zustand)

L'API Context de React est formidable pour les dépendances statiques (comme un Thème Sombre/Clair ou la Session Utilisateur). Cependant, lorsque nous construisons des Tableaux de Bord (Dashboards) massifs (comme NMergeIA) où les données changent des milliers de fois par seconde (sockets, filtres, graphiques en temps réel), **Context s'effondre d'un point de vue architectural**.

Pourquoi ? Parce que si une valeur à l'intérieur d'un Context Provider change, **TOUS** les composants abonnés à ce contexte sont re-rendus instantanément, même s'ils n'ont besoin que d'une fraction minime de ces données.

## 1. L'Émergence des Gestionnaires Atomiques / Flux

Nous avons besoin d'un gestionnaire permettant des **Sélecteurs Sélectifs** : Si un composant a seulement besoin de lire le `nombre` (nom) de l'utilisateur, il ne devrait pas être re-rendu si l'`edad` (âge) change.

### Architecture Zustand (Le standard moderne)
Fini le code répétitif de Redux classique (Actions, Reducers, Types). Aujourd'hui, Zustand domine l'écosystème grâce à sa simplicité et sa puissance.

```mermaid
graph LR
    subgraph sub_1 [Zustand Store]
        Estado[(État Global)]
        Acciones[Mutateurs (Setters)]
    end
    
    ComponenteA[Composant A (Lit le Nom)] -->|Sélecteur Sélectif| Estado
    ComponenteB[Composant B (Modifie lÂge)] -->|Invoque| Acciones
    Acciones -->|Mute de manière immuable| Estado
```

## 2. Implémentation d'un Store dans Zustand

Zustand permet de créer un hook d'état global en dehors de l'arbre React, éliminant ainsi le besoin des `<Provider>` étouffants dans `App.jsx`.

```jsx
// store/useUserStore.js
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  // État Initial
  usuario: { nombre: 'Alice', edad: 25 },
  tema: 'oscuro',
  
  // Actions (Mutateurs)
  setNombre: (nuevoNombre) => set((state) => ({
    usuario: { ...state.usuario, nombre: nuevoNombre }
  })),
  
  toggleTema: () => set((state) => ({
    tema: state.tema === 'oscuro' ? 'claro' : 'oscuro'
  }))
}));
```

## 3. Sélecteurs Chirurgicaux (Le secret de la performance)

C'est ici que Zustand écrase l'API Context. Dans notre composant, nous n'appellerons PAS tout l'état, nous utiliserons une fonction de rappel (callback) pour extraire *uniquement* ce qui nous intéresse.

```jsx
import { useUserStore } from './store/useUserStore';

export const UserBadge = () => {
  // Sélecteur Chirurgical : Si 'tema' change, ce composant ne sera PAS re-rendu.
  // Il réagira uniquement si 'usuario.nombre' change.
  const nombre = useUserStore((state) => state.usuario.nombre);
  
  return <div className="badge">{nombre}</div>;
};

export const ThemeSwitcher = () => {
  // Nous déstructurons l'action mutatrice
  const toggleTema = useUserStore((state) => state.toggleTema);
  
  return <button onClick={toggleTema}>Changer de Thème</button>;
};
```

## 4. Middleware et Persistance

Étant situés en dehors du cycle de React, ces gestionnaires permettent d'injecter des « Middlewares » natifs en une seule ligne de code. Vous voulez que l'état survive à un F5 (Rechargement de page) ?

```jsx
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      filtros: [],
      addFiltro: (f) => set((s) => ({ filtros: [...s.filtros, f] }))
    }),
    {
      name: 'nmerge-storage', // Zustand sauvegardera et synchronisera automatiquement avec le LocalStorage
    }
  )
);
```

Au **Niveau Expert**, nous laisserons l'état de côté et nous nous concentrerons sur l'enfer le plus redouté des développeurs React : La gestion asynchrone profonde, la mise en cache des requêtes HTTP avec React Query, et le SSR.
