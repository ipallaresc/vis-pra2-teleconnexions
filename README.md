# Patrons climàtics del Mediterrani occidental

Web de storytelling visual per a la pràctica final de Visualització de dades.

## Estructura

- `index.html`: pàgina principal amb les escenes narratives, embeds de Flourish i explorador final.
- `style.css`: estils de la pàgina.
- `js/escena09.js`: interaccions dels botons de fase de l’escena 3 i exploradors de l’escena 9 amb Observable Plot.
- `data/escena_09_explorador_anomalies.csv`: CSV del primer heatmap interactiu de l'escena 9.
- `data/escena_09_explorador_episodis.csv`: CSV del segon heatmap interactiu de l'escena 9.

## Embeds de Flourish incorporats

- Escena 1: `29119742`
- Escena 2: `29119137`
- Escena 3: `29120992`, `29120194`, `29121645`, `29121359`, `29121220`, `29121115`
- Escena 4: `29096709`
- Escena 5: `29099761`
- Escena 6: `29097593`
- Escena 7: `29100330`
- Escena 8: `29098921`

## CSV necessari per al primer explorador de l'escena 9

Fitxer:

```text
data/escena_09_explorador_anomalies.csv
```

Columnes:

```text
Teleconnexió,Fase,Variable,Subregió,Estació,Període,Anomalia mitjana,Unitat,N mesos
```

## CSV necessari per al segon explorador de l'escena 9

Fitxer:

```text
data/escena_09_explorador_episodis.csv
```

Columnes:

```text
Indicador,Teleconnexió,Fase,Estació,Subregió,Període,Percentatge mesos,N episodis,N mesos
```

Valors recomanats per `Període`:

- `Tots`
- `1981-1990`
- `1991-2000`
- `2001-2010`
- `2011-2020`

Per a `Tots`, és millor calcular amb totals de mesos i episodis, no com una mitjana simple de les dècades.

## Provar en local

No obris `index.html` directament amb doble clic, perquè el navegador pot bloquejar la lectura dels CSV.

Des de la carpeta del projecte:

```bash
python -m http.server 8000
```

Després obre:

```text
http://localhost:8000
```

## Publicació a GitHub Pages

1. Crear un repositori públic.
2. Pujar `index.html`, `style.css`, `README.md`, `js/` i `data/` a l'arrel del repositori.
3. Anar a `Settings > Pages`.
4. Seleccionar `Deploy from a branch`.
5. Triar `main` i `/root`.
6. Guardar i esperar que GitHub generi la URL pública.
