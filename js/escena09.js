import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const ANOMALIES_URL = "data/escena_09_explorador_anomalies.csv";
const EPISODIS_URL = "data/escena_09_explorador_episodis.csv";

const order = {
  teleconnexions: ["NAO", "WeMO", "RONI/ENSO"],
  fases: ["Negativa", "Neutral", "Positiva"],
  variables: ["Precipitació", "Temperatura", "Humitat del sòl", "SST"],
  estacions: ["Hivern", "Primavera", "Estiu", "Tardor"],
  periodes: ["Tots", "1981-1990", "1991-2000", "2001-2010", "2011-2020"],
  subregions: [
    "Llevant Ibèric",
    "Catalunya-Balears",
    "Golf del Lleó",
    "Mediterrani central occidental"
  ],
  indicadors: [
    "Episodi càlid amb baixa humitat del sòl",
    "Episodi càlid i sec",
    "Episodi fred i humit",
    "Sòl molt sec",
    "Sòl molt humit",
    "Mes molt càlid",
    "Mes molt fred",
    "Mes molt sec",
    "Mes molt humit"
  ]
};

const unitByVariable = {
  "Precipitació": "mm",
  "Temperatura": "°C",
  "Humitat del sòl": "m³/m³",
  "SST": "°C"
};

const anomalyControls = {
  teleconnexio: document.querySelector("#control-teleconnexio"),
  fase: document.querySelector("#control-fase"),
  variable: document.querySelector("#control-variable"),
  period: document.querySelector("#control-period")
};

const episodeControls = {
  indicador: document.querySelector("#control-indicador"),
  estacio: document.querySelector("#control-episodi-estacio"),
  subregio: document.querySelector("#control-episodi-subregio"),
  period: document.querySelector("#control-episodi-period")
};

const anomalyContainer = document.querySelector("#heatmap-escena-09");
const episodeContainer = document.querySelector("#heatmap-episodis-09");

function rewriteSvgIds(svg, key) {
  const elementsWithId = Array.from(svg.querySelectorAll("[id]"));
  const idMap = new Map(elementsWithId.map(el => [el.id, `${key}-${el.id}`]));

  for (const el of elementsWithId) {
    el.id = idMap.get(el.id);
  }

  const allElements = [svg, ...Array.from(svg.querySelectorAll("*"))];
  for (const el of allElements) {
    for (const attr of Array.from(el.attributes || [])) {
      let value = attr.value;
      for (const [oldId, newId] of idMap) {
        value = value
          .replaceAll(`url(#${oldId})`, `url(#${newId})`)
          .replaceAll(`href="#${oldId}"`, `href="#${newId}"`)
          .replaceAll(`xlink:href="#${oldId}"`, `xlink:href="#${newId}"`)
          .replaceAll(`#${oldId}`, `#${newId}`);
      }
      if (value !== attr.value) el.setAttribute(attr.name, value);
    }
  }

  return idMap;
}

async function loadInteractiveSvg(container) {
  const svgUrl = container.dataset.svg;
  const key = container.dataset.svgKey || `svg-${Math.random().toString(36).slice(2)}`;
  const defaultPhase = container.dataset.defaultPhase || "pos";

  try {
    const response = await fetch(svgUrl);
    if (!response.ok) throw new Error(`No s'ha pogut carregar ${svgUrl}`);
    const svgText = await response.text();
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) throw new Error(`El fitxer ${svgUrl} no conté cap SVG vàlid`);

    const idMap = rewriteSvgIds(svg, key);
    container.replaceChildren(svg);

    const botoNeg = container.querySelector(`#${CSS.escape(idMap.get("boto_neg") || "")}`);
    const botoPos = container.querySelector(`#${CSS.escape(idMap.get("boto_pos") || "")}`);
    const groupNeg = container.querySelector(`#${CSS.escape(idMap.get("group_neg") || "")}`);
    const groupPos = container.querySelector(`#${CSS.escape(idMap.get("group_pos") || "")}`);

    if (!botoNeg || !botoPos || !groupNeg || !groupPos) {
      throw new Error(`Falten els IDs esperats al SVG ${svgUrl}`);
    }

    svg.setAttribute("width", "100%");
    svg.removeAttribute("height");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.classList.add("inline-phase-svg");

    botoNeg.style.cursor = "pointer";
    botoPos.style.cursor = "pointer";
    botoNeg.setAttribute("role", "button");
    botoPos.setAttribute("role", "button");
    botoNeg.setAttribute("tabindex", "0");
    botoPos.setAttribute("tabindex", "0");
    botoNeg.setAttribute("aria-label", "Mostra la fase negativa");
    botoPos.setAttribute("aria-label", "Mostra la fase positiva");

    function setButtonState(activeButton, inactiveButton) {
      activeButton.style.opacity = "1";
      inactiveButton.style.opacity = "0.42";
      activeButton.classList.add("phase-svg-active");
      inactiveButton.classList.remove("phase-svg-active");
      activeButton.setAttribute("aria-pressed", "true");
      inactiveButton.setAttribute("aria-pressed", "false");
    }

    function showPhase(phase) {
      const showPositive = phase === "pos";
      groupPos.style.display = showPositive ? "" : "none";
      groupNeg.style.display = showPositive ? "none" : "";
      setButtonState(showPositive ? botoPos : botoNeg, showPositive ? botoNeg : botoPos);
      container.dataset.activePhase = phase;
    }

    function bindPhase(button, phase) {
      button.addEventListener("click", () => showPhase(phase));
      button.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showPhase(phase);
        }
      });
    }

    bindPhase(botoNeg, "neg");
    bindPhase(botoPos, "pos");
    showPhase(defaultPhase);
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="empty-state">No s'ha pogut carregar el diagrama SVG. Revisa el fitxer i els IDs <code>boto_neg</code>, <code>group_neg</code>, <code>boto_pos</code> i <code>group_pos</code>.</p>`;
  }
}

function initInteractiveSvgs() {
  document.querySelectorAll(".svg-interactive").forEach(loadInteractiveSvg);
}

function fillSelect(select, values, defaultValue) {
  if (!select) return;
  select.innerHTML = "";
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }
  if (defaultValue && values.includes(defaultValue)) select.value = defaultValue;
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return d3.format(`.${digits}f`)(value);
}

function colorRange(variable) {
  if (variable === "Precipitació" || variable === "Humitat del sòl") {
    return ["#a06a3b", "#f7f7f7", "#3a86ff"];
  }
  return ["#2166ac", "#f7f7f7", "#b2182b"];
}

function availablePeriods(data) {
  if (!data.some(d => d.Període)) return ["Tots"];
  const present = new Set(data.map(d => d.Període).filter(Boolean));
  return order.periodes.filter(p => p === "Tots" || present.has(p));
}

function periodRows(data, period) {
  if (!data.some(d => d.Període)) return data;
  if (period === "Tots") {
    const explicitAll = data.filter(d => d.Període === "Tots");
    if (explicitAll.length) return explicitAll;
    return data.filter(d => d.Període !== "Tots");
  }
  return data.filter(d => d.Període === period);
}

function weightedMean(rows, valueKey, weightKey = "N mesos") {
  const valid = rows.filter(d => Number.isFinite(d[valueKey]) && Number.isFinite(d[weightKey]) && d[weightKey] > 0);
  const totalWeight = d3.sum(valid, d => d[weightKey]);
  if (!totalWeight) return NaN;
  return d3.sum(valid, d => d[valueKey] * d[weightKey]) / totalWeight;
}

function aggregateAnomalies(rows, selectedPeriod) {
  const grouped = d3.rollups(
    rows,
    cellRows => {
      const n = d3.sum(cellRows, d => d["N mesos"]);
      return {
        "Anomalia mitjana": weightedMean(cellRows, "Anomalia mitjana"),
        "N mesos": n,
        "Període": selectedPeriod,
        "Unitat": cellRows[0]?.Unitat ?? ""
      };
    },
    d => d.Subregió,
    d => d.Estació
  );

  return grouped.flatMap(([subregio, stationGroups]) =>
    stationGroups.map(([estacio, values]) => ({
      Subregió: subregio,
      Estació: estacio,
      ...values
    }))
  );
}

function getColorDomain(data, variable) {
  const values = data
    .filter(d => d.Variable === variable)
    .map(d => Math.abs(d["Anomalia mitjana"]))
    .filter(Number.isFinite);
  const max = d3.max(values) || 1;
  return [-max, 0, max];
}

function renderAnomalies(data) {
  if (!anomalyContainer) return;
  const selectedTele = anomalyControls.teleconnexio.value;
  const selectedFase = anomalyControls.fase.value;
  const selectedVariable = anomalyControls.variable.value;
  const selectedPeriod = anomalyControls.period?.value || "Tots";

  const base = data.filter(d =>
    d["Teleconnexió"] === selectedTele &&
    d.Fase === selectedFase &&
    d.Variable === selectedVariable
  );

  const filtered = aggregateAnomalies(periodRows(base, selectedPeriod), selectedPeriod).map(d => ({
    ...d,
    "Teleconnexió": selectedTele,
    Fase: selectedFase,
    Variable: selectedVariable
  }));

  const unit = unitByVariable[selectedVariable] || filtered[0]?.Unitat || "";
  const colorDomain = getColorDomain(data, selectedVariable);
  const width = Math.max(720, Math.min(920, anomalyContainer.clientWidth || 920));

  const plot = Plot.plot({
    width,
    height: 405,
    marginLeft: 205,
    marginBottom: 54,
    marginTop: 30,
    style: {
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "14px",
      background: "transparent",
      color: "#203142"
    },
    x: { domain: order.estacions, label: null, tickSize: 0 },
    y: { domain: order.subregions, label: null, tickSize: 0 },
    color: {
      type: "linear",
      domain: colorDomain,
      range: colorRange(selectedVariable),
      legend: true,
      label: `Anomalia mitjana (${unit})`
    },
    marks: [
      Plot.cell(filtered, {
        x: "Estació",
        y: "Subregió",
        fill: "Anomalia mitjana",
        inset: 2,
        rx: 7,
        title: d =>
          `${d.Subregió} · ${d.Estació}\n` +
          `Teleconnexió: ${d["Teleconnexió"]}\n` +
          `Fase: ${d.Fase}\n` +
          `Variable: ${d.Variable}\n` +
          `Període: ${d.Període}\n` +
          `Anomalia mitjana: ${formatNumber(d["Anomalia mitjana"], d.Variable === "Precipitació" ? 1 : 2)} ${d.Unitat || unit}\n` +
          `Mesos inclosos: ${d["N mesos"]}`
      }),
      Plot.text(filtered, {
        x: "Estació",
        y: "Subregió",
        text: d => formatNumber(d["Anomalia mitjana"], d.Variable === "Precipitació" ? 1 : 2),
        fill: d => Math.abs(d["Anomalia mitjana"]) > Math.abs(colorDomain[2]) * 0.58 ? "white" : "#203142",
        fontSize: 14,
        fontWeight: 780
      })
    ]
  });

  anomalyContainer.replaceChildren(plot);
}

function aggregateEpisodes(data, indicator, estacio, subregio, period) {
  let filtered = data.filter(d => d.Indicador === indicator);
  if (estacio !== "Totes") filtered = filtered.filter(d => d.Estació === estacio);
  if (subregio !== "Totes") filtered = filtered.filter(d => d.Subregió === subregio);
  filtered = periodRows(filtered, period);

  const grouped = d3.rollups(
    filtered,
    rows => {
      const n = d3.sum(rows, d => d["N mesos"]);
      const events = d3.sum(rows, d => d["N episodis"]);
      return {
        "Percentatge mesos": n ? (events / n) * 100 : NaN,
        "N episodis": events,
        "N mesos": n,
        "Període": period
      };
    },
    d => d["Teleconnexió"],
    d => d.Fase
  );

  return grouped.flatMap(([tele, phaseGroups]) =>
    phaseGroups.map(([fase, values]) => ({
      Indicador: indicator,
      Teleconnexió: tele,
      Fase: fase,
      ...values
    }))
  );
}

function renderEpisodes(data) {
  if (!episodeContainer) return;
  const indicator = episodeControls.indicador.value;
  const estacio = episodeControls.estacio.value;
  const subregio = episodeControls.subregio.value;
  const period = episodeControls.period?.value || "Tots";
  const aggregated = aggregateEpisodes(data, indicator, estacio, subregio, period);

  if (!aggregated.length) {
    episodeContainer.innerHTML = `<div class="empty-state">Encara no hi ha dades per a l’indicador seleccionat. Quan actualitzis el CSV amb aquest indicador, el heatmap es generarà automàticament.</div>`;
    return;
  }

  const xDomain = order.fases.filter(f => aggregated.some(d => d.Fase === f));
  const width = Math.max(720, Math.min(920, episodeContainer.clientWidth || 920));

  const plot = Plot.plot({
    width,
    height: 365,
    marginLeft: 120,
    marginBottom: 56,
    marginTop: 28,
    style: {
      fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "14px",
      background: "transparent",
      color: "#203142"
    },
    x: { domain: xDomain, label: null, tickSize: 0 },
    y: { domain: order.teleconnexions, label: null, tickSize: 0 },
    color: {
      type: "linear",
      domain: [0, Math.max(40, d3.max(aggregated, d => d["Percentatge mesos"]) || 40)],
      range: ["#f7e6c4", "#d98c45", "#8b2e1a"],
      legend: true,
      label: "% de mesos"
    },
    marks: [
      Plot.cell(aggregated, {
        x: "Fase",
        y: "Teleconnexió",
        fill: "Percentatge mesos",
        inset: 2,
        rx: 7,
        title: d =>
          `${d["Teleconnexió"]} · ${d.Fase}\n` +
          `Indicador: ${d.Indicador}\n` +
          `Estació: ${estacio}\n` +
          `Subregió: ${subregio}\n` +
          `Període: ${d.Període}\n` +
          `Mesos amb l'indicador: ${formatNumber(d["Percentatge mesos"], 1)}%\n` +
          `Episodis: ${d["N episodis"]} de ${d["N mesos"]} mesos`
      }),
      Plot.text(aggregated, {
        x: "Fase",
        y: "Teleconnexió",
        text: d => `${formatNumber(d["Percentatge mesos"], 1)}%`,
        fill: d => d["Percentatge mesos"] > 25 ? "white" : "#203142",
        fontSize: 14,
        fontWeight: 780
      })
    ]
  });

  episodeContainer.replaceChildren(plot);
}

async function initAnomalies() {
  if (!anomalyContainer) return;
  const data = await d3.csv(ANOMALIES_URL, d => ({
    ...d,
    Període: d.Període || "Tots",
    Fase: d.Fase === "La Niña" ? "Negativa" : d.Fase === "El Niño" ? "Positiva" : d.Fase,
    "Anomalia mitjana": +d["Anomalia mitjana"],
    "N mesos": +d["N mesos"]
  }));

  const teleconnexions = order.teleconnexions.filter(v => data.some(d => d["Teleconnexió"] === v));
  const fases = order.fases.filter(v => data.some(d => d.Fase === v));
  const variables = order.variables.filter(v => data.some(d => d.Variable === v));
  const periodes = availablePeriods(data);

  fillSelect(anomalyControls.teleconnexio, teleconnexions, "NAO");
  fillSelect(anomalyControls.fase, fases, "Positiva");
  fillSelect(anomalyControls.variable, variables, "Precipitació");
  fillSelect(anomalyControls.period, periodes, "Tots");

  for (const control of Object.values(anomalyControls)) {
    control?.addEventListener("change", () => renderAnomalies(data));
  }
  window.addEventListener("resize", () => renderAnomalies(data));

  renderAnomalies(data);
}

async function initEpisodes() {
  if (!episodeContainer) return;
  const data = await d3.csv(EPISODIS_URL, d => ({
    ...d,
    Període: d.Període || "Tots",
    Fase: d.Fase === "La Niña" ? "Negativa" : d.Fase === "El Niño" ? "Positiva" : d.Fase,
    "Percentatge mesos": +d["Percentatge mesos"],
    "N episodis": +d["N episodis"],
    "N mesos": +d["N mesos"]
  }));

  const indicadors = order.indicadors;
  const periodes = availablePeriods(data);
  fillSelect(episodeControls.indicador, indicadors, "Episodi càlid amb baixa humitat del sòl");
  fillSelect(episodeControls.estacio, ["Totes", ...order.estacions], "Totes");
  fillSelect(episodeControls.subregio, ["Totes", ...order.subregions], "Totes");
  fillSelect(episodeControls.period, periodes, "Tots");

  for (const control of Object.values(episodeControls)) {
    control?.addEventListener("change", () => renderEpisodes(data));
  }
  window.addEventListener("resize", () => renderEpisodes(data));

  renderEpisodes(data);
}

initInteractiveSvgs();
initAnomalies().catch(error => {
  console.error(error);
  if (anomalyContainer) {
    anomalyContainer.innerHTML = `<p style="color:#9b1c1c">No s'ha pogut carregar l'explorador d'anomalies. Revisa la ruta del CSV i els noms de columna.</p>`;
  }
});
initEpisodes().catch(error => {
  console.error(error);
  if (episodeContainer) {
    episodeContainer.innerHTML = `<p style="color:#9b1c1c">No s'ha pogut carregar l'explorador d'episodis. Revisa la ruta del CSV i els noms de columna.</p>`;
  }
});
