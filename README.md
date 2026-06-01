# Patrons climàtics del Mediterrani occidental

Web de storytelling visual per a la pràctica final de Visualització de dades.

## Estructura

- `index.html`: pàgina principal amb les escenes narratives, embeds de Flourish i explorador final.
- `style.css`: estils de la pàgina.
- `js/escena09.js`: exploradors de l'escena 9 amb Observable Plot.
- `data/escena_09_explorador_anomalies.csv`: CSV del primer heatmap interactiu de l'escena 9.
- `data/escena_09_explorador_episodis.csv`: CSV del segon heatmap interactiu de l'escena 9.

## Embeds de Flourish incorporats

- Escena 1: `29119742`
- Escena 2: `29119137`
- Escena 3: `29203605`, `29204466`, `29204843`
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

## Repositori

https://github.com/ipallaresc/vis-pra2-teleconnexions

## Publicació a GitHub Pages

1. Crear o actualitzar el repositori públic.
2. Pujar `index.html`, `style.css`, `README.md`, `js/` i `data/` a l'arrel del repositori.
3. Anar a `Settings > Pages`.
4. Seleccionar `Deploy from a branch`.
5. Triar `main` i `/root`.
6. Guardar i esperar que GitHub generi la URL pública.

## Iteració v7

Canvis principals:

- La nota dels diagrames de l'escena 3 s'ha mogut a sobre dels embeds.
- Els embeds de l'escena 3 tenen una alçada mínima superior per millorar la interacció en pantalles petites.
- El segon heatmap de l'escena 9 incorpora tots els indicadors extrems definits, tot i que alguns poden aparèixer buits fins que el CSV s'actualitzi.
- Les etiquetes numèriques dels heatmaps d'Observable Plot s'han fet més grans.
- Les definicions dels indicadors extrems mostren el nom llegible utilitzat al selector i el càlcul amb el nom tècnic de la variable.

## v8: SVG interactius de l'escena 3

L'escena 3 ja no depèn de Flourish. Els tres diagrames es carreguen com a SVG inline des de:

- `assets/svg/NAO.svg`
- `assets/svg/WeMO.svg`
- `assets/svg/ENSO.svg`

Cada SVG ha de tenir aquests quatre IDs:

- `boto_neg`
- `group_neg`
- `boto_pos`
- `group_pos`

Per defecte, la fase positiva queda activada i la negativa queda amagada. Quan es clica `boto_neg`, es mostra `group_neg` i s'amaga `group_pos`; quan es clica `boto_pos`, passa el contrari. El botó inactiu queda amb menys opacitat.
