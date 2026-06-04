# Teleconnexions i variabilitat climàtica al Mediterrani occidental

Pràctica final de l’assignatura **M2.959 - Visualització de dades**  
Màster universitari en Ciència de Dades · Universitat Oberta de Catalunya  
**Juny de 2026**

## Enllaços principals

- **Web del projecte:** https://ipallaresc.github.io/vis-pra2-teleconnexions/
- **Repositori:** https://github.com/ipallaresc/vis-pra2-teleconnexions

## Resum del projecte

Aquest projecte explora com tres patrons de teleconnexió climàtica - **NAO**, **WeMO** i **ENSO/RONI** - s’associen amb la variabilitat climàtica del Mediterrani occidental entre **1981 i 2020**.

La visualització se centra en dades mensuals de precipitació, temperatura de l’aire, humitat del sòl i temperatura superficial del mar. El relat compara com aquests patrons apareixen en diferents variables, estacions, subregions i períodes, i tanca amb un espai d’exploració interactiva per provar combinacions concretes.

## Objectiu

L’objectiu és comunicar de manera visual quines associacions apareixen amb més claredat en les dades mensuals agregades.

El projecte no pretén construir un model causal ni fer una atribució climàtica formal. La intenció és utilitzar la visualització de dades per explorar patrons, contrastar hipòtesis i explicar de manera accessible com poden relacionar-se les teleconnexions amb algunes variables climàtiques del Mediterrani occidental.

Les preguntes que guien la visualització són:

- La **NAO** mostra el senyal més clar en precipitació?
- La **WeMO** destaca més en temperatura de l’aire i SST que en precipitació mensual?
- **ENSO/RONI** queda com un senyal més secundari en aquest àmbit regional?
- Les relacions canvien segons l’estació, la subregió o el període?
- Els episodis càlids amb baixa humitat del sòl augmenten en la darrera dècada analitzada?

## Dades

El conjunt de dades final s’ha construït a partir de diferents fonts climàtiques oficials i s’ha agregat a escala mensual i subregional.

### Fonts del dataset

- **Copernicus Climate Data Store - ERA5 monthly averaged data on single levels**  
  Variables climàtiques mensuals com temperatura, precipitació, pressió, vent i temperatura superficial del mar.  
  https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels-monthly-means

- **Copernicus Climate Data Store - ERA5-Land monthly averaged data**  
  Variables hidrològiques i de superfície terrestre, especialment humitat del sòl.  
  https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land-monthly-means

- **NOAA Physical Sciences Laboratory - North Atlantic Oscillation (NAO)**  
  Sèrie mensual de l’índex NAO.  
  https://psl.noaa.gov/data/timeseries/month/DS/NAO/

- **NOAA Climate Prediction Center - Relative Oceanic Niño Index (RONI)**  
  Sèrie utilitzada per representar ENSO/RONI i classificar les fases associades a El Niño, La Niña i situació neutral.  
  https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso/roni/

- **Climatic Research Unit (CRU) / University of East Anglia (UEA) - MOI / WeMO**  
  Fitxers d’índexs de l’Oscil·lació Mediterrània i l’Oscil·lació del Mediterrani occidental.  
  https://crudata.uea.ac.uk/cru/data/moi/

### Resum del dataset final

- **Període:** 1981-2020.
- **Resolució temporal:** mensual.
- **Unitat d’anàlisi:** combinació de mes, any i subregió. Per exemple: gener de 1998 a Catalunya-Balears.
- **Nombre d’observacions:** 1.920 registres.
- **Càlcul:** 12 mesos × 40 anys × 4 subregions.
- **Subregions:** Llevant Ibèric, Catalunya-Balears, Golf del Lleó i Mediterrani central occidental.
- **Variables principals:** precipitació, temperatura de l’aire, humitat del sòl, temperatura superficial del mar, NAO, WeMO i RONI/ENSO.
- **Variables derivades:** anomalies mensuals, fases de teleconnexió, períodes temporals i indicadors booleans d’episodis càlids, secs, humits o compostos.

### Altres fonts i referències de context

A més de les fonts de dades, s’han consultat treballs de context sobre la WeMO, la precipitació extrema i les possibles relacions entre teleconnexions i clima mediterrani:

- López-Bustins, J. A.; Arbiol-Roca, L.; Martin-Vide, J.; Barrera-Escoda, A.; Prohom, M. (2020). *Intra-annual variability of the Western Mediterranean Oscillation (WeMO) and occurrence of extreme torrential precipitation in Catalonia (NE Iberia)*. Natural Hazards and Earth System Sciences, 20, 2483–2501.  
  https://nhess.copernicus.org/articles/20/2483/2020/

- López-Bustins, J. A. (2007). *The Western Mediterranean Oscillation and Rainfall in the Catalan Countries*.  
  https://www.tdx.cat/bitstream/handle/10803/1953/12.JALB_introduction_ENG.pdf

- Vegas-Vilarrúbia, T. et al. (2012). *Connection between El Niño-Southern Oscillation events and the Mediterranean climate*.  
  http://www.c3.urv.cat/docs/publicacions/2012/JS_STOTEN_2012.pdf

## Visualització i narrativa

La web està organitzada com un relat visual. No presenta totes les anàlisis possibles, sinó una selecció d’escenes que ajuden a respondre la pregunta central del projecte.

L’estructura és la següent:

1. **Portada i context general**  
   Introducció del tema i de la pregunta principal.

2. **Dades i territori**  
   Presentació del dataset, les fonts i les quatre subregions analitzades.

3. **Teleconnexions**  
   Explicació visual de la NAO, la WeMO i l’ENSO/RONI mitjançant esquemes SVG interactius.

4. **NAO i precipitació**  
   Visualització de les anomalies mensuals de precipitació segons la fase de la NAO.

5. **NAO i humitat del sòl**  
   Exploració del percentatge de mesos amb sòl molt sec segons la fase de la NAO.

6. **WeMO, temperatura de l’aire i SST**  
   Comparació entre fases de la WeMO i anomalies de temperatura de l’aire i del mar.

7. **ENSO/RONI com a senyal secundari**  
   Comparació de la intensitat de les associacions entre teleconnexions i variables climàtiques.

8. **Canvi temporal recent**  
   Evolució dels mesos càlids amb baixa humitat del sòl entre 1981 i 2020.

9. **Exploració interactiva**  
   Dos heatmaps interactius que permeten provar combinacions de teleconnexió, fase, variable, estació, subregió i període.

## Eines utilitzades

El projecte combina diferents eines de preparació, anàlisi i visualització:

- **Python i Jupyter Notebook** per preparar les dades, calcular anomalies, classificar fases, crear variables derivades i generar els CSV finals.
- **Flourish** per a la majoria de gràfics narratius de la web.
- **HTML, CSS i JavaScript** per construir la pàgina web.
- **SVG interactius** per explicar les fases de les teleconnexions a l’escena 3.
- **Observable Plot** i JavaScript per crear els heatmaps interactius de l’apartat d’exploració.
- **GitHub Pages** per publicar la visualització final.
- **ChatGPT** com a assistent de suport en diferents parts del procés.

## Ús d’IA generativa

S’ha utilitzat ChatGPT com a assistent de suport durant el desenvolupament dels Jupyter notebooks, per la reutilització i adaptació d’una estructura web utilitzada a la PAC3, i generació del codi JavaScript dels heatmaps interactius a l'apartat d'exploració. Totes les sortides s’han revisat i adaptat manualment abans d’integrar-les al projecte.

## Execució local

La web pot obrir-se directament des de GitHub Pages. Si es vol provar en local, és recomanable servir la carpeta amb un servidor local perquè els fitxers CSV i SVG es carreguin correctament.

Des de l’arrel del repositori:

```bash
python -m http.server 8000
```

Després obrir al navegador:

```text
http://localhost:8000
```

## Carpeta `codi/`

La carpeta `codi/` conté tot el codi utilitzat en la pràctica. El procés s’ha fet des de zero amb Jupyter Notebook: preparació del dataset obtingut a la PRA1, estudi exploratori en profunditat, càlcul d’anomalies i variables derivades, classificació de fases de teleconnexió i creació dels CSV agregats utilitzats tant als gràfics de Flourish com als heatmaps interactius creats amb JavaScript i Observable Plot.

Aquesta carpeta inclou un README específic amb més detall sobre l’organització prevista del codi, les dades i els notebooks.

## Limitacions

Aquesta visualització treballa amb dades mensuals agregades i subregions definides de manera sintètica. Per tant, els resultats mostren associacions visuals i estadístiques, però no atribucions causals directes. Les relacions observades podrien canviar si s’utilitzessin dades diàries, episodis meteorològics puntuals, altres definicions de subregió o períodes més recents. A més, el període d’estudi s’acota a 1981–2020 per mantenir coherència entre totes les fonts, especialment per la disponibilitat de la sèrie WeMO.

## Llicència

El codi d’aquest repositori es publica sota llicència **MIT**. Les dades, gràfics o materials provinents de tercers mantenen les seves pròpies condicions d’ús.

- Codi: [`LICENSE`](LICENSE)
