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
    "Sòl molt sec",
    "Mes molt càlid",
    "Mes molt sec",
    "Episodi càlid i sec"
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

function initFlourishPhaseButtons() {
  document.querySelectorAll("[data-flourish-panel]").forEach(button => {
    button.addEventListener("click", () => {
      const group = button.dataset.flourishTarget;
      const panelId = button.dataset.flourishPanel;
      document.querySelectorAll(`[data-flourish-target="${group}"]`).forEach(peer => peer.classList.remove("active"));
      button.classList.add("active");
      document.querySelectorAll(`.phase-flourish-panel[data-group="${group}"]`).forEach(panel => {
        panel.hidden = panel.id !== panelId;
        panel.classList.toggle("active", panel.id === panelId);
      });
    });
  });
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
        fontSize: 12,
        fontWeight: 750
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
        fontSize: 12,
        fontWeight: 760
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

  const indicadors = order.indicadors.filter(v => data.some(d => d.Indicador === v));
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

initFlourishPhaseButtons();
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
