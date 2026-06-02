# Codi del projecte

Aquesta carpeta conté els notebooks, dades processades i fitxers auxiliars utilitzats per preparar les dades i generar els CSV finals de la visualització.

## Estructura

```text
codi/
├── data_processed/   # Dataset final i resultats processats
├── data_flourish/    # CSV finals utilitzats a Flourish
├── data_raw/         # Dades originals, si es publiquen
├── docker/           # Configuració de l'entorn Docker
├── figures/          # Figures generades als notebooks
└── notebooks/        # Notebooks del projecte
````

## Execució amb Docker

Des de la carpeta `docker/`, aixeca l'entorn:

```bash
docker compose up --build
```

Un cop el contenidor estigui en marxa, obre Jupyter Notebook o JupyterLab amb l'enllaç que apareix al terminal.

Si no s'utilitza `docker-compose.yml`, es pot construir i executar manualment:

```bash
docker build -t vis-pra2 .
docker run -p 8888:8888 -v "$PWD":/workspace vis-pra2
```

## Ordre d'execució dels notebooks

Els notebooks s'han d'executar en ordre.

### 01 — Preparació del dataset

Construeix el dataset principal a partir de les fonts climàtiques i dels índexs de teleconnexió.

Fa principalment:

* lectura o descàrrega de dades
* definició de subregions
* agregació mensual per subregió
* càlcul d'anomalies
* assignació de fases de NAO, WeMO i RONI/ENSO
* creació de variables booleanes d'episodis extrems.

Output principal:

```text
data_processed/teleconnections_catalonia_1981_2020_main_v2.csv
```

### 02 — Exploració inicial

Explora el dataset generat al notebook 01.

Fa principalment:

* comprovació del rang temporal
* revisió de nuls i duplicats
* distribució de les variables climàtiques
* visualització de les subregions
* evolució temporal de NAO, WeMO i RONI/ENSO.

Outputs principals:

```text
figures/
```

### 03 — Primeres relacions

Analitza les primeres associacions entre teleconnexions i variables climàtiques.

Fa principalment:

* correlacions globals
* correlacions per estació
* correlacions per subregió
* comparació inicial entre NAO, WeMO i RONI/ENSO
* identificació de patrons útils per a la narrativa visual.

Outputs principals:

```text
figures/
data_processed/03_*.csv
```

### 04 — Anàlisi exhaustiva

Amplia l'anàlisi estadística i valida els patrons detectats.

Fa principalment:

* correlacions per múltiples àmbits
* càlcul de p-valors
* correcció FDR per múltiples comparacions
* anàlisi d'episodis extrems
* resum de les hipòtesis principals.

Output principal:

```text
data_processed/04_correlacions_exhaustives.csv
```

Aquest fitxer és necessari per generar alguns CSV finals del notebook 05.

### 05 — CSV per a Flourish

Prepara els CSV finals utilitzats a les visualitzacions de la web.

Fa principalment:

* adapta el dataset principal a cada escena
* genera taules agregades per Flourish
* exporta els CSV finals a `data_flourish/`.

Outputs finals:

```text
data_flourish/escena_04_nao_precipitacio_hivern.csv
data_flourish/escena_05_nao_percent_mesos_sol_molt_sec.csv
data_flourish/escena_06_wemo_fases_temperatura_sst_global.csv
data_flourish/escena_07_distribucio_forca_correlacions.csv
data_flourish/escena_08_episodis_calor_sol_sec_wide_subregions.csv
data_flourish/escena_09_explorador_anomalies.csv
data_flourish/escena_09_explorador_episodis.csv
```
