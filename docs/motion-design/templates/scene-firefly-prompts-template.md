# Template — Prompts Firefly / génération visuelle

> Copier vers `docs/motion-design/production/<slug>/firefly-prompts.md`.
> Marqueurs : `[À RENSEIGNER]` · `[À VÉRIFIER — SOURCE OFFICIELLE REQUISE]` · `[NON APPLICABLE]`
> Chaque prompt **doit** reprendre les interdictions listées ci-dessous (ou référencer le negative prompt global).

---

## En-tête

| Champ | Valeur |
|-------|--------|
| Identifiant scène | `[À RENSEIGNER]` |
| Style cible | `[À RENSEIGNER]` |
| Palette | `[À RENSEIGNER]` ou `[À VÉRIFIER — SOURCE OFFICIELLE REQUISE]` (tokens marque) |
| Ratio principal | `[À RENSEIGNER]` |

## Interdictions obligatoires (tous prompts)

Interdire explicitement :

- logos
- marques
- interfaces réelles (OS, consoles MDM, navigateurs identifiables)
- texte généré dans l’image
- mot de passe visible
- clé cryptographique / recovery key lisible
- données personnelles (noms, emails, serials, tenant IDs)
- effets gaming excessifs (néons agressifs, particules arcade)
- rendu photoréaliste ambigu pour une scène pédagogique

## Negative prompt réutilisable

```text
logo, brand mark, trademark, real UI, operating system screenshot, MDM console UI,
readable text, watermark, password field, visible password, recovery key digits,
cryptographic key string, personal data, email address, phone number, serial number,
tenant ID, photorealistic photo, 3D game VFX, neon glow overload, lens flare spam,
weapon, violence, celebrity likeness
```

---

## Sections de prompts

### Arrière-plan

```text
[À RENSEIGNER]

Negative: (réutiliser le negative prompt global)
```

### Objet principal

```text
[À RENSEIGNER]

Negative: (réutiliser le negative prompt global)
```

### Objets secondaires

```text
[À RENSEIGNER] ou [NON APPLICABLE]
```

### Composition complète

```text
[À RENSEIGNER]
```

### Miniature

```text
[À RENSEIGNER]
```

### Image vers vidéo

```text
[À RENSEIGNER] ou [NON APPLICABLE]
```

### Transition

```text
[À RENSEIGNER] ou [NON APPLICABLE]
```

### Variante 16:9

```text
[À RENSEIGNER]
```

### Variante 9:16

```text
[À RENSEIGNER] ou [NON APPLICABLE]
```

### Variante 1:1

```text
[À RENSEIGNER] ou [NON APPLICABLE]
```

### Cohérence inter-scènes

`[À RENSEIGNER]` — mêmes matériaux, angles, palette, épaisseur de trait, niveau d’abstraction.

### Retouches attendues

- `[À RENSEIGNER]`
- `[À RENSEIGNER]` ou `[NON APPLICABLE]`
