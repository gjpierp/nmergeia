# Profiling, Mémorisation et Rendu Haute Performance

Votre application React utilise Zustand et React Query. L'architecture est impeccable. Cependant, lors du rendu d'un tableau de 5 000 enregistrements, le navigateur gèle, les champs de saisie subissent du *lag* lors de la frappe, et le ventilateur du processeur s'emballe.

Vous avez heurté l'enfer du Re-render (re-rendu). À ce niveau d'optimisation extrême (🔥), nous apprendrons à manier le bistouris pour éliminer les rendus inutiles et découper le code (Code Splitting).

## 1. Le Tueur Silencieux : Les Re-renders Inutiles

Par défaut, le comportement mathématique de React est : **« Si un composant Parent est mis à jour (ex. son état change), TOUS ses composants enfants, petits-enfants et arrière-petits-enfants sont à nouveau rendus »**, même si leurs `props` n'ont pas changé.

### La Solution : React.memo()

`React.memo` enveloppe votre composant fonctionnel et mémorise sa sortie. Si son Parent est rendu, React vérifiera les `props` de l'Enfant. Si elles sont identiques, React **interrompra** le rendu de cet enfant et réutilisera la photo précédente.

```jsx
import React, { memo } from 'react';

// Un composant extrêmement lourd (ex : Graphique 3D ou Tableau Massif)
const TablaMasiva = ({ data, onFiltro }) => {
  console.log("Tableau Rendu"); // Sans 'memo', ceci s'afficherait en continu
  return <BigGrid data={data} />;
};

// Nous enveloppons dans memo
export const TablaOptimizada = memo(TablaMasiva);
```

## 2. Briser le Memo : L'Égalité Référentielle (useCallback)

`React.memo` effectue une comparaison stricte (`===`). Cela fonctionne bien pour les chaînes de caractères et les booléens, mais échoue lamentablement avec les **Fonctions** et les **Objets**, car en JavaScript, deux objets ou fonctions ayant le même contenu ne sont pas égaux en mémoire.

Si un Parent transmet une fonction anonyme ou recréée à un Enfant protégé par `memo`, l'Enfant verra que la référence en mémoire de la fonction a changé à chaque rendu du Parent, ce qui brisera le `memo`.

C'est ici qu'intervient **useCallback** :

```jsx
import React, { useState, useCallback } from 'react';
import { TablaOptimizada } from './Tabla';

export const Dashboard = () => {
  const [texto, setTexto] = useState('');

  // Danger : Si nous n'utilisions pas useCallback, cette fonction naîtrait dans une
  // nouvelle adresse mémoire à chaque fois que l'utilisateur tape dans l'Input (setTexto).
  // Et cela forcerait la 'TablaOptimizada' à se re-rendre inutilement.
  const procesarFiltro = useCallback((filtroId) => {
    ejecutarQuery(filtroId);
  }, []); // Tableau vide : la fonction est créée UNE seule fois et conserve son adresse mémoire.

  return (
    <div>
      {/* En écrivant ici, 'texto' change, Dashboard se re-rend */}
      <input value={texto} onChange={e => setTexto(e.target.value)} />
      
      {/* Mais le tableau sera préservé, car la référence de 'procesarFiltro' n'a PAS changé */}
      <TablaOptimizada onFiltro={procesarFiltro} />
    </div>
  );
};
```

## 3. Optimisations Critiques Supplémentaires

### Virtualisation de Listes
Afficher 10 000 éléments dans le DOM réel détruira n'importe quel navigateur, peu importe à quel point vous optimisez React. Vous ne devez jamais dessiner d'éléments qui se trouvent en dehors de l'écran (hors du Viewport).
**Bibliothèque obligatoire :** `TanStack Virtual` ou `react-window`. Elles ne dessinent que les 10 ou 20 nœuds visibles par l'utilisateur, en les recyclant lors du défilement (comme le fait un RecyclerView sur Android).

### Code Splitting (Lazy Loading)
Un bundle (fichier JS principal) de 5 Mo est inacceptable. Vous devez découper votre application afin que l'utilisateur ne télécharge que ce qu'il visite.

```jsx
import React, { Suspense, lazy } from 'react';

// Le composant AdminPanel NE sera PAS téléchargé dans le bundle initial de la page d'accueil.
// Il ne sera téléchargé sur le réseau que lorsque cette ligne sera exécutée.
const AdminPanel = lazy(() => import('./AdminPanel'));

export const App = () => {
  return (
    <Suspense fallback={<SpinnerCarga />}>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
};
```

En appliquant la Mémorisation Chirurgicale, la Virtualisation pour les Données Massives (Big Data) et le Code Splitting massif au niveau des routes, votre application React fonctionnera à 60 fps constants, même sur des appareils bas de gamme. Vous êtes désormais un Ingénieur Front-End d'élite.
