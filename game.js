"use strict";

let CROPS = {};
let MARKETS = {};
let MARKET_SIGNALS = {};
let CROP_MARKET_RESPONSE = {};
let MARKET_SUPPLY_EFFECTS = {};
let BASE_TAGS = {};
let EQUIPMENT_TAGS = {};
let CROP_ENVIRONMENT = {};
let GROW_UNITS = {};
let GROW_UNIT_SLOT_LAYOUTS = {};
let PLANT_STAGE_SPRITES = {};
let AREA_PROFILES = {};
let PROPERTY_COMMENTS = {};
let FLOOR_DEVICES = {};
let ROBOT_SKILLS = {};
let ROBOT_PERSONALITIES = {};
let ROBOT_PERSONALITY_EFFECTS = {};
let ROBOT_PERSONALITY_TRIGGERS = [];
let ROBOT_PERSONALITY_RARITIES = [];
let SUPPORT_ROBOT_BLACKOUT_LINES = [];
let SUPPORT_ROBOT_TALK_EVENTS = [];
let EVENTS = [];
let QUIET_NEWS = [];
let EQUIPMENT = {};
let SOUND_FILES = {};
let SOUND_VOLUMES = {};
let AMBIENT_LAYERS = {};
let RADIO_PROGRAMS = {};
let UNLOCK_RULES = [];
let SCHEDULE_RUMORS = [];
let INFO_BOOKS = {};
let INFO_ENTRIES = [];
let CREDITS = [];
let ENDING_ROLL_ITEMS = [];
let ENDING_ROLL_TEXT = {};

const QUALITY = {
  C: { multiplier: 0.7, color: "#ff765e" },
  B: { multiplier: 1.0, color: "#78bfa5" },
  A: { multiplier: 1.3, color: "#72ffb8" },
  S: { multiplier: 1.8, color: "#f5d65b" }
};

const RESOURCE_CONSUMPTION_RATE = 1 / 6;
const RESOURCE_BASE_CAPACITY = Object.freeze({ water: 20, nutrient: 20 });
const RESOURCE_LEGACY_CARTRIDGE_CAPACITY = 10;
const RESOURCE_CARTRIDGE_PRODUCTION_BONUS = 1;
const RESOURCE_CARTRIDGE_ITEMS = Object.freeze({
  water_cartridge: Object.freeze({ resource: "water", productionBonus: RESOURCE_CARTRIDGE_PRODUCTION_BONUS }),
  nutrient_cartridge: Object.freeze({ resource: "nutrient", productionBonus: RESOURCE_CARTRIDGE_PRODUCTION_BONUS })
});
const NON_PURCHASABLE_RESOURCE_ITEMS = new Set(["water", "nutrient"]);
const REALTIME_DAY_MS = 20000;
const WITHER_DAYS = 1;
const LABOR_TUTORIAL_QA_PARAM = (() => {
  try {
    return new URLSearchParams(window.location.search).get("labortutorial");
  } catch (error) {
    return null;
  }
})();
const LABOR_TUTORIAL_QA_MODE = ["1", "true", "on", "qa"].includes(
  String(LABOR_TUTORIAL_QA_PARAM || "").trim().toLowerCase()
);
const PRIMARY_SAVE_KEY = "undergreen-save-v17";
// Repeated tutorial checks must never overwrite the player's regular save.
const SAVE_KEY = LABOR_TUTORIAL_QA_MODE
  ? `${PRIMARY_SAVE_KEY}-labor-tutorial-qa`
  : PRIMARY_SAVE_KEY;
const SAVE_BACKUP_KEY = `${SAVE_KEY}-backup`;
const LEGACY_SAVE_KEYS = [];
const DAY45_RECORDS_KEY = "undergreen-day45-records-v1";
const DAY60_RECORDS_KEY = "undergreen-day60-records-v1";
const FREE_RECORDS_KEY = "undergreen-free-records-v1";
const START_MODE_PREF_KEY = "undergreen-start-mode-view-v1";
const SETTINGS_PREF_KEY = "undergreen-settings-v1";
const PUBLIC_GAME_URL = "https://ziroz-tech.github.io/UnderGreen/";
const GOOGLE_FORM_PREFILL_URL = "https://docs.google.com/forms/d/1DhYFy45WvRujbb3CzGxlMpZXWnAe5eZFt62CczIPxqk/viewform?usp=pp_url";
const GOOGLE_FORM_FIELDS = {
  recordJson: "entry.1523070449",
  day45Count: "",
  day60Count: "",
  freeCount: "",
  latestRevenue: "",
  latestTitles: ""
};
const PLAY_MODES = {
  day45: {
    key: "day45",
    label: "DAY45モード",
    shortLabel: "DAY45",
    recordsTitle: "DAY45 RECORDS",
    recordEmpty: "まだDAY45モードの記録はありません。",
    storageKey: DAY45_RECORDS_KEY,
    limit: 45,
    startKicker: "DAY45 CHALLENGE",
    startTitle: "DAY45モード",
    startCopy: "現在のセーブデータを上書きして、DAY45終了時点の記録を残す競技モードを開始します。",
    startConfirm: "DAY45開始"
  },
  day60: {
    key: "day60",
    label: "DAY60モード",
    shortLabel: "DAY60",
    recordsTitle: "DAY60 RECORDS",
    recordEmpty: "まだDAY60モードの記録はありません。",
    storageKey: DAY60_RECORDS_KEY,
    limit: 60,
    startKicker: "DAY60 CHALLENGE",
    startTitle: "DAY60モード",
    startCopy: "現在のセーブデータを上書きして、DAY60終了時点の記録を残す長期チャレンジモードを開始します。",
    startConfirm: "DAY60開始"
  },
  free: {
    key: "free",
    label: "フリーモード",
    shortLabel: "FREE",
    recordsTitle: "FREE MODE RECORDS",
    recordEmpty: "フリーモードの記録はまだありません。",
    storageKey: FREE_RECORDS_KEY,
    limit: null,
    startKicker: "FREE OPERATION",
    startTitle: "フリーモード",
    startCopy: "期限なしで、現在のセーブデータを上書きしてゆったり遊ぶモードを開始します。",
    startConfirm: "フリー開始"
  }
};
const START_MODE_SEQUENCE = ["day45", "day60", "free"];
const TIMED_MODE_WARNING_DAYS = [10, 5];
const PROPERTY_REROLL_FEE = 100;
const PROCUREMENT_REROLL_FEE = 80;
const AUTOMATION_CATEGORY_UNLOCK_REVENUE = 2000;
const PRE_RESULT_STORY_ID = "story_pre_result_robot_interview";
const SHOP_CATEGORIES = {
  seeds: {
    label: "種子",
    title: "SEED CATALOG",
    subtitle: "植える作物を選ぶ",
    kind: "seeds"
  },
  supplies: {
    label: "資源・保管",
    title: "RESOURCE PRODUCTION",
    subtitle: "水・養液の生産と保管",
    kind: "equipment",
    items: ["filter", "tank", "water_cartridge", "nutrient_cartridge", "fridge"]
  },
  grow: {
    label: "栽培設備",
    title: "GROW HARDWARE",
    subtitle: "ポッド・ボックス・環境補助",
    kind: "equipment",
    items: ["pod", "box", "light", "fan"]
  },
  automation: {
    label: "自動化",
    title: "AUTOMATION",
    subtitle: "ロボット・高度自動化端末",
    kind: "equipment",
    items: ["support_robot", "procurement_terminal", "shipping_hatch", "support_os_storage"]
  }
};
const PROPERTY_LISTING_COUNT = 4;
const SAFE_ROOM_IMAGE = "assets/bases/safe-room.webp";
const DEFAULT_ENVIRONMENT = { temp: 24, humidity: 60, co2: 700 };
const ISO_TILE_WIDTH = 96;
const ISO_TILE_HEIGHT = 48;
const ISO_GRID_PAD_X = 64;
const ISO_GRID_PAD_Y = 96;
const FACILITY_ZOOM_MIN = 0.65;
const FACILITY_ZOOM_MAX = 1.8;
const FACILITY_ZOOM_STEP = 0.12;
const FACILITY_INITIAL_ZOOM = 1.44;
const UI_SCALE_BASE_WIDTH = 1900;
const UI_SCALE_BASE_HEIGHT = 1060;
const UI_SCALE_MAX = 1.45;
const SPRITE_ALPHA_THRESHOLD = 18;
const BOOT_ASSET_TIMEOUT_MS = 20000;
const AUDIO_CACHE_BUSTER = Date.now().toString(36);
const spriteAlphaCache = new Map();
let state;
let selectedSeed = "lettuce";
let selectedMarket = "lower";
let selectedShopCategory = "seeds";
let selectedInfoBookId = "gardening_intro";
let selectedInfoEntryId = "";
let selectedLaborRobotId = "";
let saleQuantities = {};
let pendingSaleSaveTimer = null;
let pendingSaleRenderTimer = null;
let saleBurstActiveUntil = 0;
let lastInventoryRenderSignature = "";
const SALE_SAVE_IDLE_MS = 240;
const SALE_RENDER_IDLE_MS = 700;
const SALE_POINTER_GUARD_MS = 900;
let selectedUnitId = null;
let selectedDeviceId = null;
let selectedBaseId = null;
let placementSelection = null;
let dragPayload = null;
let pointerDrag = null;
let pendingSeedDrag = null;
let harvestSwipe = null;
let harvestHold = null;
let facilityPan = null;
let facilityPinch = null;
let equipmentMenu = null;
let equipmentMenuTimer = null;
let cleanToolDrag = null;
const facilityPointers = new Map();
let facilityView = { x: 0, y: 0, zoom: FACILITY_INITIAL_ZOOM };
let facilityCameraTransitionTimer = null;
let facilityCameraViewSide = "front";
const laborBlueprintPointers = new Map();
let laborBlueprintView = { x: 34, y: 34, zoom: 1 };
let laborBlueprintDrag = null;
let laborBlueprintWireDrag = null;
let laborBlueprintPan = null;
let laborBlueprintPinch = null;
let suppressClickUntil = 0;
const farmRenderRequestedBaseIds = new Set();
const farmGridMarkupCache = new Map();
let lastTickAt = Date.now();
let lastRenderAt = 0;
let lastAutosaveAt = 0;
const timedModeCountdownState = {
  active: false,
  timer: null
};
let UI_TEXT = {};
let COMM_EVENTS = [];
let STORY_EVENTS = [];
let STORY_EVENT_SPEAKERS = {};
let STORY_EVENT_LINES = {};
let activeComms = null;
let pendingComms = [];
let activeStory = null;
let pendingStories = [];
let storyTextAnimationFrame = 0;
let storyVisualRevealToken = 0;
let commsVisualRevealToken = 0;
let startScreenOpen = true;
let pendingConfirmAction = null;
let pendingDangerAction = null;
let pendingExtraAction = null;
let pausedBeforeStartScreen = false;
let pendingDay30RecordId = null;
let startModeView = "day45";
let startTitleTapCount = 0;
let startTitleTapAt = 0;
let startLaunchPending = false;
const COMMS_DEDUPE_TRIGGERS = new Set(["plant_resource_shortage"]);
const LABOR_TUTORIAL_EVENT_TRIGGERS = new Set([
  "labor_first_open",
  "labor_tutorial_cleaning_completed",
  "labor_tutorial_completed"
]);
const GAME_TABS = ["farm", "market", "shop", "labor", "schedule", "broker", "radio", "info"];
const GAME_TAB_SHORTCUTS = {
  "1": "farm",
  "2": "market",
  "3": "shop",
  "4": "labor",
  "5": "schedule",
  "6": "broker",
  "7": "radio",
  "8": "info"
};
let currentUiScale = 1;
let lastLogToastMessage = "";
let lastLogToastAt = 0;
let settingsPanelOpen = false;
let pausedBeforeSettings = false;
let realtimeLoopId = null;
let appSettings = {
  lowSpecMode: false,
  masterVolume: 1
};

const INPUT_DIAGNOSTIC_PARAM = (() => {
  try {
    return new URLSearchParams(window.location.search).get("debuginput");
  } catch (error) {
    return null;
  }
})();
const INPUT_DIAGNOSTIC_ENABLED = INPUT_DIAGNOSTIC_PARAM === "1";
const inputDiagnosticState = {
  enabled: INPUT_DIAGNOSTIC_ENABLED,
  bootStage: "script-loaded",
  lastInput: "none",
  lastTopElement: "-",
  bootOverlayHidden: false,
  bindEventsReached: false,
  renderReached: false,
  startScreenReached: false,
  events: []
};
let inputDiagnosticRenderQueued = false;
const inputDiagnosticSeenEvents = new WeakSet();
window.__ugInputDiagnostics = inputDiagnosticState;

function isAppleTouchDevice() {
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  return /iPad|iPhone|iPod/i.test(ua)
    || (platform === "MacIntel" && Number(navigator.maxTouchPoints) > 1);
}

const APPLE_TOUCH_DEVICE = isAppleTouchDevice();
if (APPLE_TOUCH_DEVICE) {
  document.documentElement.classList.add("apple-touch-device");
}

function inputDiagnosticElementLabel(element) {
  if (!element) return "-";
  if (element === window) return "window";
  if (element === document) return "document";
  const tag = String(element.tagName || "node").toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const classText = typeof element.className === "string"
    ? element.className.trim().split(/\s+/).filter(Boolean).slice(0, 3).join(".")
    : "";
  return `${tag}${id}${classText ? `.${classText}` : ""}`;
}

function inputDiagnosticLayerLine(id) {
  const element = document.getElementById(id);
  if (!element) return `${id}:missing`;
  const style = window.getComputedStyle(element);
  const stateText = element.classList.contains("hidden") ? "hidden" : "shown";
  return `${id}:${stateText} display=${style.display} vis=${style.visibility} pe=${style.pointerEvents} z=${style.zIndex}`;
}

function inputDiagnosticLog(type, message = "") {
  if (!inputDiagnosticState.enabled) return;
  inputDiagnosticState.events.push({
    at: (performance.now() / 1000).toFixed(1),
    type,
    message: String(message || "").slice(0, 220)
  });
  if (inputDiagnosticState.events.length > 12) inputDiagnosticState.events.shift();
  scheduleInputDiagnosticRender();
}

function setInputDiagnosticStage(stage, detail = "") {
  if (!inputDiagnosticState.enabled) return;
  inputDiagnosticState.bootStage = stage;
  inputDiagnosticLog("stage", detail ? `${stage} // ${detail}` : stage);
}

function ensureInputDiagnosticPanel() {
  if (!inputDiagnosticState.enabled || !document.body) return null;
  let panel = document.getElementById("ios-input-diagnostic");
  if (panel) return panel;
  panel = document.createElement("aside");
  panel.id = "ios-input-diagnostic";
  panel.className = "ios-input-diagnostic";
  panel.setAttribute("aria-live", "polite");
  panel.innerHTML = `
    <div class="ios-input-diagnostic-title">iPad input diagnostic</div>
    <pre id="ios-input-diagnostic-body"></pre>
  `;
  document.body.appendChild(panel);
  return panel;
}

function renderInputDiagnosticPanel() {
  inputDiagnosticRenderQueued = false;
  const panel = ensureInputDiagnosticPanel();
  if (!panel) return;
  const body = document.getElementById("ios-input-diagnostic-body");
  if (!body) return;
  const viewport = window.visualViewport
    ? `${Math.round(window.visualViewport.width)}x${Math.round(window.visualViewport.height)} scale=${window.visualViewport.scale}`
    : `${window.innerWidth}x${window.innerHeight}`;
  const support = [
    `PointerEvent=${"PointerEvent" in window}`,
    `TouchEvent=${"TouchEvent" in window}`,
    `maxTouch=${navigator.maxTouchPoints || 0}`,
    `platform=${navigator.platform || "-"}`
  ].join(" ");
  const bodyStyle = document.body ? window.getComputedStyle(document.body) : null;
  const htmlClass = document.documentElement.className || "-";
  const layers = [
    inputDiagnosticLayerLine("boot-loading"),
    inputDiagnosticLayerLine("start-screen"),
    inputDiagnosticLayerLine("modal-backdrop"),
    inputDiagnosticLayerLine("story-comms-overlay"),
    inputDiagnosticLayerLine("confirm-widget")
  ].join("\n");
  const recent = inputDiagnosticState.events
    .map((event) => `${event.at}s ${event.type}: ${event.message}`)
    .join("\n");
  const assetFailures = Array.isArray(window.BOOT_ASSET_FAILURES) && window.BOOT_ASSET_FAILURES.length
    ? `assetFailures=${window.BOOT_ASSET_FAILURES.length} first=${window.BOOT_ASSET_FAILURES[0].path}`
    : "assetFailures=0";
  body.textContent = [
    `stage=${inputDiagnosticState.bootStage}`,
    "diag=weakset touchGuard=strict",
    `flags bind=${inputDiagnosticState.bindEventsReached} render=${inputDiagnosticState.renderReached} start=${inputDiagnosticState.startScreenReached} bootHidden=${inputDiagnosticState.bootOverlayHidden}`,
    `viewport=${viewport} inner=${window.innerWidth}x${window.innerHeight} dpr=${window.devicePixelRatio || 1}`,
    support,
    `appleTouch=${APPLE_TOUCH_DEVICE} htmlClass=${htmlClass} bodyZoom=${bodyStyle?.zoom || "-"}`,
    `lastInput=${inputDiagnosticState.lastInput}`,
    `lastTop=${inputDiagnosticState.lastTopElement}`,
    assetFailures,
    "layers:",
    layers,
    "recent:",
    recent || "-"
  ].join("\n");
}

function scheduleInputDiagnosticRender() {
  if (!inputDiagnosticState.enabled || inputDiagnosticRenderQueued) return;
  inputDiagnosticRenderQueued = true;
  window.requestAnimationFrame(renderInputDiagnosticPanel);
}

function inputDiagnosticRecordInput(event) {
  if (!inputDiagnosticState.enabled || inputDiagnosticSeenEvents.has(event)) return;
  inputDiagnosticSeenEvents.add(event);
  const touch = event.changedTouches?.[0] || event.touches?.[0] || null;
  const x = Number.isFinite(event.clientX) ? event.clientX : touch?.clientX;
  const y = Number.isFinite(event.clientY) ? event.clientY : touch?.clientY;
  const topElement = Number.isFinite(x) && Number.isFinite(y) ? document.elementFromPoint(x, y) : document.activeElement;
  inputDiagnosticState.lastTopElement = inputDiagnosticElementLabel(topElement);
  inputDiagnosticState.lastInput = [
    event.type,
    `target=${inputDiagnosticElementLabel(event.target)}`,
    `top=${inputDiagnosticState.lastTopElement}`,
    Number.isFinite(x) && Number.isFinite(y) ? `xy=${Math.round(x)},${Math.round(y)}` : "xy=-",
    event.pointerType ? `pointer=${event.pointerType}` : "",
    `trusted=${event.isTrusted}`
  ].filter(Boolean).join(" ");
  inputDiagnosticLog("input", inputDiagnosticState.lastInput);
}

function initInputDiagnostics() {
  if (!inputDiagnosticState.enabled) return;
  if (!document.body) {
    document.addEventListener("DOMContentLoaded", initInputDiagnostics, { once: true });
    return;
  }
  ensureInputDiagnosticPanel();
  const diagnosticTargets = [window, document, document.documentElement, document.body].filter(Boolean);
  ["touchstart", "touchend", "touchcancel", "pointerdown", "pointerup", "pointercancel", "click"].forEach((type) => {
    diagnosticTargets.forEach((target) => {
      target.addEventListener(type, inputDiagnosticRecordInput, { capture: true, passive: true });
    });
  });
  ["ontouchstart", "ontouchend", "onpointerdown", "onpointerup", "onclick"].forEach((property) => {
    diagnosticTargets.forEach((target) => {
      if (!target[property]) target[property] = inputDiagnosticRecordInput;
    });
  });
  window.addEventListener("error", (event) => {
    inputDiagnosticLog("error", event.message || String(event.error || event));
  });
  window.addEventListener("unhandledrejection", (event) => {
    inputDiagnosticLog("reject", event.reason?.message || String(event.reason));
  });
  window.setInterval(renderInputDiagnosticPanel, 1000);
  inputDiagnosticLog("init", "diagnostic panel ready");
}

initInputDiagnostics();
function normalizeUiGuide(guide) {
  if (!guide) return null;
  if (typeof guide === "string") return guide.trim() ? { target: guide.trim() } : null;
  const target = String(guide.target || "").trim();
  return target ? { ...guide, target } : null;
}

function ensureUiGuideState() {
  if (!state) return null;
  state.uiGuide = normalizeUiGuide(state.uiGuide);
  return state.uiGuide;
}

function uiGuideSelectors(target) {
  const value = String(target || "").trim();
  if (!value) return [];
  if (value.startsWith("tab:")) return [`[data-tab="${value.slice(4)}"]`];
  if (value === "sell-lettuce") return [`[data-guide-target="${value}"]`, `[data-tab="market"]:not(.locked)`];
  return [`[data-guide-target="${value}"]`];
}

function removeUiGuideHighlights() {
  document.querySelectorAll(".guide-pulse").forEach((element) => {
    element.classList.remove("guide-pulse");
    element.removeAttribute("data-guide-active");
  });
}

function isVisibleGuideTarget(element) {
  if (!element) return false;
  if (element.disabled || element.getAttribute("aria-disabled") === "true") return false;
  if (element.classList.contains("locked") || element.closest(".locked")) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function applyUiGuide() {
  removeUiGuideHighlights();
  const guide = ensureUiGuideState();
  if (!guide) return;
  if (startScreenOpen || !document.getElementById("start-screen")?.classList.contains("hidden") || dragPayload || pointerDrag || document.body?.classList.contains("drag-active")) return;
  const matches = uiGuideSelectors(guide.target).flatMap((selector) => Array.from(document.querySelectorAll(selector)));
  const visibleMatches = matches.filter(isVisibleGuideTarget);
  const targets = visibleMatches.length ? visibleMatches.slice(0, 3) : matches.slice(0, 1);
  targets.forEach((element) => {
    element.classList.add("guide-pulse");
    element.setAttribute("data-guide-active", "true");
  });
}

function setUiGuide(target, options = {}) {
  if (!state || !target) return;
  state.uiGuide = { target: String(target).trim(), setAt: Date.now() };
  if (options.persist !== false) saveGame();
  window.requestAnimationFrame(applyUiGuide);
}

function clearUiGuide(target = null, options = {}) {
  const guide = ensureUiGuideState();
  if (!guide) return false;
  if (target && guide.target !== target) return false;
  state.uiGuide = null;
  removeUiGuideHighlights();
  if (options.persist !== false) saveGame();
  return true;
}

function clearUiGuideTargets(targets, options = {}) {
  const guide = ensureUiGuideState();
  if (!guide) return false;
  const list = Array.isArray(targets) ? targets : [targets];
  return list.includes(guide.target) ? clearUiGuide(null, options) : false;
}

function preferredUiScale() {
  if (APPLE_TOUCH_DEVICE) return 1;
  const width = window.innerWidth || document.documentElement.clientWidth || 0;
  const height = window.innerHeight || document.documentElement.clientHeight || 0;
  if (width < 1800 || height < 940) return 1;
  const scale = Math.min(width / UI_SCALE_BASE_WIDTH, height / UI_SCALE_BASE_HEIGHT);
  return Math.max(1, Math.min(UI_SCALE_MAX, Math.round(scale * 100) / 100));
}

function applyUiScale() {
  const scale = preferredUiScale();
  currentUiScale = scale;
  if (APPLE_TOUCH_DEVICE) document.documentElement.classList.add("apple-touch-device");
  document.documentElement.style.setProperty("--ui-scale", scale.toFixed(2));
  document.body?.classList.toggle("ui-scale-large", scale > 1.01);
  document.body?.setAttribute("data-ui-scale", scale.toFixed(2));
  if (APPLE_TOUCH_DEVICE && document.body) document.body.style.zoom = "normal";
}

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || null;
}

function updateFullscreenButton() {
  const buttons = document.querySelectorAll("#fullscreen-button");
  if (!buttons.length) return;
  const active = Boolean(fullscreenElement());
  const title = active ? "Window mode" : "Fullscreen mode";
  buttons.forEach((button) => {
    button.classList.toggle("fullscreen-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.textContent = active ? "WIN" : "FULL";
    button.title = title;
    button.setAttribute("aria-label", title);
  });
}

async function toggleFullscreenMode() {
  const active = fullscreenElement();
  const target = document.documentElement;
  try {
    if (active) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (exit) await exit.call(document);
    } else {
      const request = target.requestFullscreen || target.webkitRequestFullscreen || target.msRequestFullscreen;
      if (!request) {
        toast("このブラウザではフルスクリーン切替を利用できません。", "warning");
        return;
      }
      await request.call(target);
    }
  } catch (error) {
    console.warn(error);
    toast("フルスクリーン切替がブラウザにブロックされました。", "warning");
  } finally {
    updateFullscreenButton();
    window.setTimeout(applyUiScale, 80);
  }
}

const SCHEDULE_DAYS = 30;
const SCHEDULE_REROLL_COST = 120;
const SCHEDULE_NON_TARGET_SIGNAL_CAP = 0.42;
const MARKET_SIGNAL_MIN = 0.05;
const MARKET_SIGNAL_MAX = 0.95;
const MARKET_SIGNAL_START_MIN = 0.38;
const MARKET_SIGNAL_START_MAX = 0.68;
const MARKET_SIGNAL_NATURAL_DRIFT = 0.028;
const MARKET_SIGNAL_NATURAL_CAP = 0.86;
const MARKET_EVENT_DEFAULT_RECOVERY_DAYS = 4;
const MARKET_EVENT_OFFSET_EPSILON = 0.004;
const MARKET_SUPPLY_EFFECT_EXPONENT = 0.68;
const MARKET_SUPPLY_EFFECT_MAX_DELTA = 0.12;
const SEED_MARKET_MIN_MULTIPLIER = 0.65;
const SEED_MARKET_MAX_MULTIPLIER = 1.45;
const SEED_MARKET_DAILY_SHOCK = 0.16;
const SEED_MARKET_MEAN_REVERSION = 0.18;
const SUPPORT_ROBOT_DEFAULT_RANGE = 2;
const SUPPORT_ROBOT_MAX_ENERGY = 100;
const SUPPORT_ROBOT_MAX_MORALE = 100;
const SUPPORT_MORALE_ENERGY_RATIO = 2;
const SUPPORT_MORALE_MIN_EFFICIENCY = 0.35;
const SUPPORT_CHARGE_BREAK_DAYS = 0.25;
const SUPPORT_CHARGE_MORALE_RECOVERY = 5;
const SUPPORT_FORCED_RECOVERY_DAYS = 1;
const SUPPORT_RESOURCE_EPSILON = 0.001;
const SUPPORT_TASK_BASE_COOLDOWN = { harvest: 0.055, plant: 0.06, care: 0.055, cleaning: 0.06, procure: 0.08, ship: 0.08, resource_collect: 0.06 };
const SUPPORT_TASK_BASE_COST = { harvest: 5, plant: 4, care: 4, cleaning: 6, procure: 4, ship: 4, resource_collect: 4 };
const SUPPORT_TASKS = Object.keys(SUPPORT_TASK_BASE_COOLDOWN);
const SUPPORT_TASK_LABELS = { harvest: '収穫', plant: '種まき', care: '育成管理', cleaning: '清掃', procure: '調達', ship: '出荷', resource_collect: '資源回収' };
const SUPPORT_ROBOT_IDLE_SCAN_MS = 400;
const supportRobotProfileReady = new WeakSet();
const supportAutomationStateReady = new WeakSet();
const supportRobotNextIdleScanAt = new WeakMap();
const SUPPORT_BLUEPRINT_ACTION_TYPES = ["harvest", "ship", "plant", "care", "procure", "cleaning", "resource_collect"];
const SUPPORT_BLUEPRINT_TASK_TYPES = [...SUPPORT_BLUEPRINT_ACTION_TYPES, "rest"];
const SUPPORT_PERSONALITY_TEAM_BONUS_CAP = 0.5;
const SUPPORT_BLUEPRINT_CONTROL_TYPES = ["branch", "sequence", "flipflop", "daily", "every", "random"];
const SUPPORT_BLUEPRINT_NODE_TYPES = [...SUPPORT_BLUEPRINT_CONTROL_TYPES, "condition", ...SUPPORT_BLUEPRINT_TASK_TYPES];
const SUPPORT_BLUEPRINT_STATUS = Object.freeze({
  SUCCESS: "success",
  FAILURE: "failure",
  RUNNING: "running"
});
const SUPPORT_BLUEPRINT_PIN_SCHEMAS = Object.freeze({
  event: {
    inputs: [],
    outputs: [{ id: "out", label: "開始", kind: "exec", maxLinks: 1 }]
  },
  sequence: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [
      { id: "first", label: "①", kind: "exec", maxLinks: 1 },
      { id: "second", label: "②", kind: "exec", maxLinks: 1 },
      { id: "third", label: "③", kind: "exec", maxLinks: 1 }
    ]
  },
  branch: {
    inputs: [
      { id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY },
      { id: "condition", label: "BOOL", kind: "boolean", maxLinks: 1 }
    ],
    outputs: [
      { id: "true", label: "はい", kind: "exec", maxLinks: 1 },
      { id: "false", label: "いいえ", kind: "exec", maxLinks: 1 }
    ]
  },
  flipflop: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [
      { id: "a", label: "A", kind: "exec", maxLinks: 1 },
      { id: "b", label: "B", kind: "exec", maxLinks: 1 }
    ]
  },
  daily: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [
      { id: "first", label: "本日初回", kind: "exec", maxLinks: 1 },
      { id: "already", label: "実行済み", kind: "exec", maxLinks: 1 }
    ]
  },
  every: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [
      { id: "nth", label: "N回目", kind: "exec", maxLinks: 1 },
      { id: "otherwise", label: "それ以外", kind: "exec", maxLinks: 1 }
    ]
  },
  random: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [
      { id: "hit", label: "当たり", kind: "exec", maxLinks: 1 },
      { id: "miss", label: "外れ", kind: "exec", maxLinks: 1 }
    ]
  },
  condition: {
    inputs: [],
    outputs: [{ id: "value", label: "BOOL", kind: "boolean", maxLinks: Number.POSITIVE_INFINITY }]
  },
  harvest: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [{ id: "failure", label: "次へ", kind: "exec", maxLinks: 1 }]
  },
  ship: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [{ id: "failure", label: "次へ", kind: "exec", maxLinks: 1 }]
  },
  plant: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [{ id: "failure", label: "次へ", kind: "exec", maxLinks: 1 }]
  },
  care: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [{ id: "failure", label: "次へ", kind: "exec", maxLinks: 1 }]
  },
  procure: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [{ id: "failure", label: "次へ", kind: "exec", maxLinks: 1 }]
  },
  cleaning: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [{ id: "failure", label: "次へ", kind: "exec", maxLinks: 1 }]
  },
  resource_collect: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [{ id: "failure", label: "次へ", kind: "exec", maxLinks: 1 }]
  },
  rest: {
    inputs: [{ id: "in", label: "実行", kind: "exec", maxLinks: Number.POSITIVE_INFINITY }],
    outputs: [{ id: "next", label: "次へ", kind: "exec", maxLinks: 1 }]
  }
});
const SUPPORT_PLANT_SHORTAGE_NOTICE_DAYS = 1;
const SUPPORT_CARE_GROWTH_BONUS_RATIO = 0.05;
const SUPPORT_CARE_QUALITY_BONUS = 0.04;
const SUPPORT_GRADE_MULTIPLIER = { S: 1.35, A: 1.12, B: 1, C: 0.78 };
const SUPPORT_GRADE_ORDER = ['C', 'B', 'A', 'S'];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (char !== "\r") {
      value += char;
    }
  }
  row.push(value);
  rows.push(row);
  const [headers, ...body] = rows.filter((entry) => entry.some((cell) => cell.trim() !== ""));
  if (!headers) return [];
  return body.map((entry) => Object.fromEntries(headers.map((header, index) => [header.trim().replace(/^\uFEFF/, ""), (entry[index] || "").trim()])));
}

const REQUIRED_GAME_DATA_PATHS = [
  "data/crops.csv",
  "data/markets.csv",
  "data/market_signals.csv",
  "data/crop_market_response.csv",
  "data/market_supply_effects.csv",
  "data/schedule_rumors.csv",
  "data/plant_sprites.csv",
  "data/grow_unit_slots.csv",
  "data/base_tags.csv",
  "data/equipment_tags.csv",
  "data/crop_environment.csv",
  "data/grow_units.csv",
  "data/floor_devices.csv",
  "data/support_robot_skills.csv",
  "data/support_robot_personalities.csv",
  "data/support_robot_personality_rarities.csv",
  "data/support_robot_personality_effects.csv",
  "data/support_robot_personality_triggers.csv",
  "data/support_robot_blackout_lines.csv",
  "data/support_robot_talk_events.csv",
  "data/equipment.csv",
  "data/unlocks.csv",
  "data/area_profiles.csv",
  "data/property_comments.csv",
  "data/events.csv",
  "data/quiet_news.csv",
  "data/audio.csv",
  "data/ambient_layers.csv",
  "data/radio_programs.csv",
  "data/info_books.csv",
  "data/info_entries.csv",
  "data/credits.csv",
  "data/ending_roll.csv",
  "data/comm_events.csv",
  "data/story_events.csv",
  "data/story_event_speakers.csv",
  "data/story_event_lines.csv",
  "data/labor_tooltips.csv",
  "data/ui_text.csv",
];
const csvTextCache = new Map();
const CHARACTER_ASSET_CACHE_KEY = Date.now().toString(36);

function freshCharacterAssetUrl(value) {
  const raw = String(value ?? "");
  const url = raw.trim();
  if (!/^(?:\.\/)?assets\/characters\//i.test(url) || /[?&]ugchar=/.test(url)) return raw;
  const hashIndex = url.indexOf("#");
  const base = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
  return `${base}${base.includes("?") ? "&" : "?"}ugchar=${CHARACTER_ASSET_CACHE_KEY}${hash}`;
}

async function loadCsv(path) {
  if (!csvTextCache.has(path)) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    csvTextCache.set(path, await response.text());
  }
  return parseCsv(csvTextCache.get(path));
}

function createGameDataError(failures) {
  const error = new Error(`${failures.length} required game file(s) could not be loaded`);
  error.name = "GameDataLoadError";
  error.failures = failures;
  return error;
}

async function verifyRequiredGameData(paths = REQUIRED_GAME_DATA_PATHS) {
  const failures = [];
  await Promise.all(paths.map(async (path) => {
    try {
      await loadCsv(path);
    } catch (error) {
      failures.push({ path, message: error?.message || String(error) });
    }
  }));
  failures.sort((a, b) => a.path.localeCompare(b.path));
  if (failures.length > 0) throw createGameDataError(failures);
}

function toNumber(value, fallback = 0) {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBool(value) {
  return String(value).toLowerCase() === "true";
}

function toList(value) {
  if (Array.isArray(value)) return value.map((entry) => String(entry).trim()).filter(Boolean);
  return value ? String(value).split("|").map((entry) => entry.trim()).filter(Boolean) : [];
}

function toRange(value) {
  const [min, max] = String(value).split("-").map((entry) => Number(entry));
  return [Number.isFinite(min) ? min : 0, Number.isFinite(max) ? max : min];
}

function toMap(value) {
  return Object.fromEntries(toList(value).map((entry) => {
    const [key, raw] = entry.split(":");
    return [key, toNumber(raw, 0)];
  }).filter(([key]) => key));
}

function parseRequirement(entry) {
  const match = String(entry).match(/^([^<>=!]+)(>=|<=|=|>|<)(.+)$/);
  if (!match) return null;
  return {
    key: match[1].trim(),
    operator: match[2],
    value: match[3].trim()
  };
}

function toRequirements(value) {
  return toList(value).map(parseRequirement).filter(Boolean);
}

function parseContextMatcher(entry) {
  const match = String(entry).match(/^([^!=]+)(!?=)(.*)$/);
  if (!match) return null;
  return {
    key: match[1].trim(),
    operator: match[2],
    value: match[3].trim()
  };
}

function toContextMatchers(value) {
  return toList(value).map(parseContextMatcher).filter(Boolean);
}

function parseCommsEffect(entry) {
  const raw = String(entry || "").trim();
  if (!raw) return null;
  const [conditionPart, actionPart = conditionPart] = raw.includes("->")
    ? raw.split("->").map((part) => part.trim())
    : ["choice:*", raw];
  let choice = "*";
  if (conditionPart && conditionPart !== "always") {
    const [kind, value] = conditionPart.split(":").map((part) => part.trim());
    if (kind === "choice") choice = value || "*";
  }
  const [action, value = ""] = actionPart.split(":").map((part) => part.trim());
  return action ? { choice, action, value } : null;
}

function toCommsEffects(value) {
  return toList(value).map(parseCommsEffect).filter(Boolean);
}

function normalizeStorySide(value) {
  const side = String(value || "").trim().toLowerCase();
  if (side === "right" || side === "r") return "right";
  if (side === "system" || side === "none" || side === "narrator" || side === "center") return "system";
  return "left";
}

function storySpeakerGroups(rows) {
  return rows.reduce((groups, row, index) => {
    const eventId = row.eventId;
    const speakerId = row.speakerId;
    if (!eventId || !speakerId) return groups;
    groups[eventId] ||= {};
    groups[eventId][speakerId] = {
      id: speakerId,
      side: normalizeStorySide(row.side),
      slot: toNumber(row.slot || row.order, index),
      name: row.name || speakerId,
      role: row.role || "",
      icon: freshCharacterAssetUrl(row.icon)
    };
    return groups;
  }, {});
}

function normalizeStoryDirectiveText(value) {
  let raw = String(value || "").trim();
  for (let index = 0; index < 2; index += 1) {
    const first = raw[0];
    const last = raw[raw.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'") || (first === "?" && last === "?")) {
      raw = raw.slice(1, -1).trim();
    }
  }
  return raw;
}

function parseStoryLineText(value) {
  const raw = normalizeStoryDirectiveText(value);
  const imageMatch = raw.match(/^\[\[image\s*:\s*([^|\]]+)(?:\|([^\]]+))?\]\]$/i);
  if (!imageMatch) return { kind: "text", text: value || "" };
  const imageUrl = imageMatch[1].trim();
  const imageSummary = String(imageMatch[2] || imageUrl).trim();
  return { kind: "image", text: "", imageUrl, imageSummary };
}

function storyLineGroups(rows) {
  return rows.reduce((groups, row) => {
    const eventId = row.eventId;
    if (!eventId) return groups;
    groups[eventId] ||= [];
    groups[eventId].push({
      speakerId: row.speakerId || "narrator",
      ...parseStoryLineText(row.text)
    });
    return groups;
  }, {});
}

function storySpeakerSideLists(speakers = {}) {
  const bySlot = (a, b) => (a.slot - b.slot) || a.id.localeCompare(b.id);
  const entries = Object.values(speakers).sort(bySlot);
  return {
    left: entries.filter((speaker) => speaker.side === "left").map((speaker) => speaker.id),
    right: entries.filter((speaker) => speaker.side === "right").map((speaker) => speaker.id)
  };
}

function rowsToObject(rows, mapper) {
  return Object.fromEntries(rows.map((row) => [row.id, mapper(row)]).filter(([id]) => id));
}

async function loadRequiredCsv(path, apply) {
  apply(await loadCsv(path));
}

async function loadExternalData() {
  await loadRequiredCsv("data/credits.csv", (rows) => {
    CREDITS = rows.map((row) => ({
      section: row.section || "credits",
      sectionLabel: row.sectionLabel || row.section || "CREDITS",
      name: row.name || "",
      role: row.role || "",
      note: row.note || "",
      url: row.url || "",
      order: toNumber(row.order, 0)
    })).filter((row) => row.name).sort((a, b) => a.order - b.order);
  });
  await loadRequiredCsv("data/ending_roll.csv", (rows) => {
    ENDING_ROLL_TEXT = Object.fromEntries(rows
      .filter((row) => row.kind === "config" && row.id)
      .map((row) => [row.id, row.text || ""]));
    ENDING_ROLL_ITEMS = rows
      .filter((row) => row.kind !== "config" && row.id)
      .map((row) => ({
        id: row.id,
        order: toNumber(row.order, 0),
        kind: row.kind || "story",
        text: row.text || "",
        gap: row.gap || "",
        anchor: toBool(row.anchor)
      }))
      .sort((a, b) => a.order - b.order);
  });
  await loadRequiredCsv("data/crops.csv", (rows) => {
    CROPS = rowsToObject(rows, (row) => ({
      name: row.name,
      days: toNumber(row.days),
      seedPrice: toNumber(row.seedPrice),
      packSize: toNumber(row.packSize),
      basePrice: toNumber(row.basePrice),
      water: toNumber(row.water),
      nutrient: toNumber(row.nutrient),
      icon: row.icon,
      color: row.color,
      note: row.note,
      unlock: row.unlock,
      primaryMarket: row.unlock,
      category: row.category,
      careStages: toList(row.careStages)
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0 && value < 1)
        .sort((left, right) => left - right)
    }));
  });
  await loadRequiredCsv("data/markets.csv", (rows) => {
    MARKETS = rowsToObject(rows, (row) => ({
      name: row.name,
      contact: row.contact,
      portrait: freshCharacterAssetUrl(row.portrait),
      description: row.description,
      risk: row.risk,
      multipliers: toMap(row.multipliers),
      accepts: toList(row.accepts),
      unlockHint: row.unlockHint
    }));
  });
  await loadRequiredCsv("data/market_signals.csv", (rows) => {
    MARKET_SIGNALS = rowsToObject(rows, (row) => ({
      axisA: row.axisA,
      axisALabel: row.axisALabel,
      axisADescription: row.axisADescription,
      axisB: row.axisB,
      axisBLabel: row.axisBLabel,
      axisBDescription: row.axisBDescription
    }));
  });
  await loadRequiredCsv("data/crop_market_response.csv", (rows) => {
    CROP_MARKET_RESPONSE = rows.reduce((entries, row) => {
      entries[row.marketId] ||= {};
      entries[row.marketId][row.cropId] = {
        axisAWeight: toNumber(row.axisAWeight),
        axisBWeight: toNumber(row.axisBWeight),
        synergy: toNumber(row.synergy),
        synergyMode: row.synergyMode || "highHigh",
        minMultiplier: toNumber(row.minMultiplier, 0.65),
        maxMultiplier: toNumber(row.maxMultiplier, 1.75),
        note: row.note
      };
      return entries;
    }, {});
  });
  await loadRequiredCsv("data/market_supply_effects.csv", (rows) => {
    MARKET_SUPPLY_EFFECTS = rows.reduce((entries, row) => {
      if (!row.marketId || !row.cropId) return entries;
      entries[row.marketId] ||= {};
      entries[row.marketId][row.cropId] = {
        axisAEffect: toNumber(row.axisAEffect, 0),
        axisBEffect: toNumber(row.axisBEffect, 0),
        note: row.note || ""
      };
      return entries;
    }, {});
  });
  await loadRequiredCsv("data/schedule_rumors.csv", (rows) => {
    SCHEDULE_RUMORS = rows.map((row) => ({
      id: row.id,
      type: row.type || "basic",
      startDay: toNumber(row.startDay, 1),
      duration: toNumber(row.duration, 1),
      marketId: row.marketId,
      axes: toList(row.axes || row.axis),
      cropIds: toList(row.cropIds || row.crops),
      strength: row.strength || "mid",
      chance: toNumber(row.chance, row.type === "rare" ? 0.45 : 1),
      jitter: toNumber(row.jitter, row.type === "rare" ? 2 : 0),
      signalBoost: toNumber(row.signalBoost, 0),
      signalDelta: toNumber(row.signalDelta, null),
      recoveryDays: toNumber(row.recoveryDays, MARKET_EVENT_DEFAULT_RECOVERY_DAYS),
      priceBoost: toNumber(row.priceBoost, 0),
      title: row.title,
      rumor: row.rumor,
      comment: row.comment
    })).filter((entry) => entry.id && entry.marketId && entry.axes.length);
  });
  await loadRequiredCsv("data/plant_sprites.csv", (rows) => {
    PLANT_STAGE_SPRITES = rows.reduce((entries, row) => {
      const cropId = row.cropId || row.id;
      if (!cropId) return entries;
      entries[cropId] = [row.stage1, row.stage2, row.stage3, row.stage4, row.stage5].filter(Boolean);
      return entries;
    }, {});
  });
  await loadRequiredCsv("data/grow_unit_slots.csv", (rows) => {
    GROW_UNIT_SLOT_LAYOUTS = rows.reduce((entries, row) => {
      const unitId = row.unitId || row.unit;
      const slotIndex = Math.max(0, Math.floor(toNumber(row.slotIndex, 0)));
      if (!unitId) return entries;
      entries[unitId] ||= [];
      entries[unitId][slotIndex] = {
        x: toNumber(row.x, 50),
        y: toNumber(row.y, 50),
        size: toNumber(row.size, 20),
        z: toNumber(row.z, slotIndex)
      };
      return entries;
    }, {});
  });
  await loadRequiredCsv("data/base_tags.csv", (rows) => {
    BASE_TAGS = rowsToObject(rows, (row) => ({
      name: row.name,
      text: row.text,
      effects: toMap(row.effects)
    }));
  });
  await loadRequiredCsv("data/equipment_tags.csv", (rows) => {
    EQUIPMENT_TAGS = rowsToObject(rows, (row) => ({
      name: row.name,
      text: row.text,
      effects: toMap(row.effects)
    }));
  });
  await loadRequiredCsv("data/crop_environment.csv", (rows) => {
    CROP_ENVIRONMENT = rowsToObject(rows, (row) => ({
      temp: toNumber(row.temp, DEFAULT_ENVIRONMENT.temp),
      humidity: toNumber(row.humidity, DEFAULT_ENVIRONMENT.humidity),
      co2: toNumber(row.co2, DEFAULT_ENVIRONMENT.co2)
    }));
  });
  await loadRequiredCsv("data/grow_units.csv", (rows) => {
    GROW_UNITS = rowsToObject(rows, (row) => ({
      name: row.name,
      code: row.code,
      slots: toNumber(row.slots),
      price: toNumber(row.price),
      upkeep: toNumber(row.upkeep),
      width: toNumber(row.width),
      height: toNumber(row.height),
      continuous: toBool(row.continuous),
      dirtMod: toNumber(row.dirtMod, 1),
      icon: row.icon,
      sprite: row.sprite,
      emptySprite: row.emptySprite,
      description: row.description
    }));
  });
  await loadRequiredCsv("data/floor_devices.csv", (rows) => {
    FLOOR_DEVICES = rowsToObject(rows, (row) => ({
      name: row.name,
      code: row.code,
      width: toNumber(row.width),
      height: toNumber(row.height),
      radius: toNumber(row.radius),
      upkeep: toNumber(row.upkeep),
      dirtMod: toNumber(row.dirtMod, 1),
      icon: row.icon,
      sprite: row.sprite,
      color: row.color,
      productionResource: row.productionResource,
      productionPerDay: Math.max(0, toNumber(row.productionPerDay, 0)),
      storageBonus: Math.max(0, toNumber(row.storageBonus, 0))
    }));
  });
  await loadRequiredCsv("data/support_robot_skills.csv", (rows) => {
    ROBOT_SKILLS = rowsToObject(rows, (row) => ({
      name: row.name,
      harvest: row.harvest || "B",
      plant: row.plant || row.planting || "B",
      care: row.care || row.plant || row.planting || "B",
      cleaning: row.cleaning || row.clean || "B",
      procure: row.procure || "B",
      ship: row.ship || "B",
      description: row.description
    }));
  });
  await loadRequiredCsv("data/support_robot_personalities.csv", (rows) => {
    ROBOT_PERSONALITIES = rowsToObject(rows, (row) => ({
      id: String(row.id || "").trim(),
      name: row.name,
      rangeMod: toNumber(row.rangeMod, 1),
      fuelMod: toNumber(row.fuelMod, 1),
      speedMod: toNumber(row.speedMod, 1),
      weight: Math.max(0, toNumber(row.weight, 1)),
      conflictGroup: String(row.conflictGroup || "").trim(),
      conflicts: String(row.conflicts || "").split("|").map((id) => id.trim()).filter(Boolean),
      description: row.description
    }));
  });
  await loadRequiredCsv("data/support_robot_personality_rarities.csv", (rows) => {
    ROBOT_PERSONALITY_RARITIES = rows.map((row, index) => ({
      id: String(row.id || `personality-rarity-${index + 1}`).trim(),
      count: Math.max(1, Math.floor(toNumber(row.count, 1))),
      weight: Math.max(0, toNumber(row.weight, 0)),
      name: String(row.name || row.id || "STANDARD").trim(),
      color: String(row.color || "#79a58f").trim()
    })).filter((entry) => entry.weight > 0).sort((a, b) => a.count - b.count);
  });
  await loadRequiredCsv("data/support_robot_personality_effects.csv", (rows) => {
    ROBOT_PERSONALITY_EFFECTS = rows.reduce((effectsByPersonality, row, index) => {
      const personalityId = String(row.personalityId || "").trim();
      const type = String(row.type || "").trim();
      if (!personalityId || !type || !ROBOT_PERSONALITIES[personalityId]) return effectsByPersonality;
      const effect = {
        id: String(row.effectId || `${personalityId}-${index + 1}`).trim(),
        personalityId,
        type,
        target: String(row.target || "self").trim(),
        value: toNumber(row.value, 0),
        maxBonus: Math.max(0, toNumber(row.maxBonus, 0)),
        stackMode: String(row.stackMode || "stack").trim()
      };
      effect.tasks = String(row.tasks || '').split('|').map((task) => task.trim()).filter(Boolean);
      effect.thresholdResource = String(row.thresholdResource || '').trim();
      effect.thresholdRatio = Math.max(0, Math.min(1, toNumber(row.thresholdRatio, 0)));
      effect.chance = Math.max(0, Math.min(1, toNumber(row.chance, 0)));
      effect.perDayCap = Math.max(0, Math.floor(toNumber(row.perDayCap, 0)));
      effect.resource = String(row.resource || '').trim();
      effect.targetCount = Math.max(0, Math.floor(toNumber(row.targetCount, 0)));
      effectsByPersonality[personalityId] ||= [];
      effectsByPersonality[personalityId].push(effect);
      return effectsByPersonality;
    }, {});
  });
  await loadRequiredCsv("data/support_robot_personality_triggers.csv", (rows) => {
    const triggerGroups = new Map();
    rows.forEach((row, index) => {
      const personalityId = String(row.personalityId || "").trim();
      const triggerId = String(row.triggerId || `${personalityId}-trigger-${index + 1}`).trim();
      const timing = String(row.timing || "day_start").trim();
      const enabled = String(row.enabled || "true").trim().toLowerCase() !== "false";
      if (!enabled || !personalityId || !triggerId || !ROBOT_PERSONALITIES[personalityId]) return;
      const groupKey = `${personalityId}:${triggerId}`;
      if (!triggerGroups.has(groupKey)) {
        triggerGroups.set(groupKey, {
          id: triggerId,
          personalityId,
          timing,
          scope: String(row.scope || "base").trim(),
          conditionType: String(row.conditionType || "same_base_robot_count").trim(),
          effectType: String(row.effectType || "resource_delta").trim(),
          effectTarget: String(row.effectTarget || "random_same_base").trim(),
          resource: String(row.resource || "morale").trim(),
          tiers: []
        });
      }
      triggerGroups.get(groupKey).tiers.push({
        minCount: Math.max(0, Math.floor(toNumber(row.minCount, 0))),
        chance: Math.max(0, Math.min(1, toNumber(row.chance, 0))),
        value: toNumber(row.value, 0),
        targetCount: Math.max(0, Math.floor(toNumber(row.targetCount, 1))),
        message: String(row.message || "").trim()
      });
    });
    ROBOT_PERSONALITY_TRIGGERS = [...triggerGroups.values()].map((trigger) => ({
      ...trigger,
      tiers: trigger.tiers.sort((a, b) => a.minCount - b.minCount)
    }));
  });
  await loadRequiredCsv("data/support_robot_blackout_lines.csv", (rows) => {
    SUPPORT_ROBOT_BLACKOUT_LINES = rows.map((row, index) => ({
      id: row.id || `blackout-${index + 1}`,
      text: row.text,
      weight: Math.max(0, toNumber(row.weight, 1)),
      enabled: String(row.enabled || "true").trim().toLowerCase() !== "false"
    })).filter((row) => row.text && row.enabled && row.weight > 0);
  });
  await loadRequiredCsv("data/support_robot_talk_events.csv", (rows) => {
    SUPPORT_ROBOT_TALK_EVENTS = rows.map((row, index) => ({
      id: String(row.id || ("support-robot-talk-" + (index + 1))).trim(),
      triggerType: String(row.triggerType || "flag").trim(),
      triggerKey: String(row.triggerKey || "").trim(),
      storyTrigger: String(row.storyTrigger || "").trim(),
      robotTarget: String(row.robotTarget || "initial").trim(),
      markerLabel: String(row.markerLabel || "会話があります").trim(),
      once: String(row.once || "true").trim().toLowerCase() !== "false",
      priority: toNumber(row.priority, 0),
      startDay: Math.max(1, Math.floor(toNumber(row.startDay, 1))),
      intervalDays: Math.max(1, Math.floor(toNumber(row.intervalDays, 1))),
      resource: String(row.resource || "").trim(),
      threshold: Math.max(0, toNumber(row.threshold, 0)),
      missingDevice: String(row.missingDevice || "").trim(),
      requirements: toRequirements(row.requirements),
      enabled: String(row.enabled || "true").trim().toLowerCase() !== "false"
    })).filter((entry) => entry.id && entry.storyTrigger && entry.enabled)
      .sort((a, b) => b.priority - a.priority);
  });  await loadRequiredCsv("data/equipment.csv", (rows) => {
    EQUIPMENT = rowsToObject(rows, (row) => ({
      name: row.name,
      icon: row.icon,
      sprite: row.sprite,
      basePrice: toNumber(row.basePrice),
      color: row.color,
      description: row.description
    }));
  });
  await loadRequiredCsv("data/unlocks.csv", (rows) => {
    UNLOCK_RULES = rows.map((row) => ({
      id: row.id,
      type: row.type,
      target: row.target,
      requirements: toRequirements(row.requirements),
      event: row.event,
      hint: row.hint,
      initiallyUnlocked: toBool(row.initiallyUnlocked)
    })).filter((row) => row.id && row.type && row.target);
  });
  await loadRequiredCsv("data/area_profiles.csv", (rows) => {
    AREA_PROFILES = rowsToObject(rows, (row) => ({
      areaNames: toList(row.areaNames),
      facilityNames: toList(row.facilityNames),
      cols: toRange(row.cols),
      rows: toRange(row.rows),
      prices: toRange(row.prices),
      upkeep: toRange(row.upkeep),
      image: row.image,
      allowedUnits: toList(row.allowedUnits),
      traits: toList(row.traits)
    }));
  });
  await loadRequiredCsv("data/property_comments.csv", (rows) => {
    PROPERTY_COMMENTS = rows.reduce((entries, row) => {
      const tier = row.tier || "drainage";
      entries[tier] ||= { lines: [], saleSuffix: "" };
      if (row.line) entries[tier].lines.push(row.line);
      if (row.saleSuffix) entries[tier].saleSuffix = row.saleSuffix;
      return entries;
    }, {});
  });
  await loadRequiredCsv("data/events.csv", (rows) => {
    EVENTS = rows.map((row) => ({
      id: row.id,
      forecastText: row.forecastText || row.text,
      activeText: row.activeText || row.text,
      label: row.label,
      leadDays: Math.max(2, Math.round(toNumber(row.leadDays, 5))),
      duration: Math.max(1, Math.round(toNumber(row.duration, 2))),
      allCropMod: row.allCropMod ? toNumber(row.allCropMod, 1) : undefined,
      cropMods: row.cropMods ? toMap(row.cropMods) : undefined,
      fee: row.fee ? toNumber(row.fee, 0) : undefined
    })).filter((row) => row.id && row.forecastText && row.activeText);
  });
  await loadRequiredCsv("data/quiet_news.csv", (rows) => {
    QUIET_NEWS = rows.map((row) => row.text).filter(Boolean);
  });
  await loadRequiredCsv("data/audio.csv", (rows) => {
    SOUND_FILES = rowsToObject(rows, (row) => row.file);
    SOUND_VOLUMES = rowsToObject(rows, (row) => toNumber(row.volume, 0.28));
  });
  await loadRequiredCsv("data/ambient_layers.csv", (rows) => {
    AMBIENT_LAYERS = rowsToObject(rows, (row) => ({
      label: row.label,
      file: row.file,
      volume: toNumber(row.volume, 0.15),
      condition: row.condition || "always",
      description: row.description
    }));
  });
  await loadRequiredCsv("data/radio_programs.csv", (rows) => {
    RADIO_PROGRAMS = rowsToObject(rows, (row) => ({
      name: row.name,
      kicker: row.kicker,
      description: row.description,
      file: row.file,
      volume: toNumber(row.volume, 0.2),
      unlocked: row.unlocked !== "false"
    }));
  });
  await loadRequiredCsv("data/info_books.csv", (rows) => {
    INFO_BOOKS = rowsToObject(rows, (row) => ({
      order: toNumber(row.order, 0),
      title: row.title,
      kicker: row.kicker,
      description: row.description,
      thumbnail: row.thumbnail,
      defaultEntryId: row.defaultEntryId,
      style: row.style || "book",
      unlocked: row.unlocked !== "false"
    }));
  });
  await loadRequiredCsv("data/info_entries.csv", (rows) => {
    INFO_ENTRIES = rows.map((row) => ({
      bookId: row.bookId,
      id: row.id,
      order: toNumber(row.order, 0),
      title: row.title,
      kicker: row.kicker,
      category: row.category,
      thumbnail: row.thumbnail,
      cropId: row.cropId,
      body: row.body,
      method: row.method,
      protagonistNote: row.protagonistNote
    })).filter((row) => row.bookId && row.id).sort((a, b) => a.order - b.order);
  });
  await loadRequiredCsv("data/comm_events.csv", (rows) => {
    COMM_EVENTS = rows.map((row) => ({
      id: row.id,
      trigger: row.trigger,
      speakerName: row.speakerName,
      speakerRole: row.speakerRole,
      icon: freshCharacterAssetUrl(row.icon),
      kicker: row.kicker,
      title: row.title,
      pages: toList(row.body),
      choices: toList(row.choices).map((entry) => {
        const [id, label] = entry.split("=");
        return { id, label: label || id };
      }),
      once: String(row.once || "").trim().toLowerCase() !== "false",
      blocking: toBool(row.blocking),
      priority: toNumber(row.priority, 0),
      requirements: toRequirements(row.requirements),
      context: toContextMatchers(row.context),
      sound: row.sound || "",
      soundVolume: row.soundVolume ? toNumber(row.soundVolume, null) : null,
      effects: toCommsEffects(row.effects)
    })).sort((a, b) => b.priority - a.priority);
  });
  const storyRows = await loadCsv("data/story_events.csv");
  STORY_EVENT_SPEAKERS = storySpeakerGroups(await loadCsv("data/story_event_speakers.csv"));
  STORY_EVENT_LINES = storyLineGroups(await loadCsv("data/story_event_lines.csv"));
  STORY_EVENTS = storyRows.map((row) => {
    const speakers = STORY_EVENT_SPEAKERS[row.id] || {};
    const pages = STORY_EVENT_LINES[row.id] || [];
    return {
      id: row.id,
      trigger: row.trigger,
      layout: row.layout || "duel",
      kicker: row.kicker,
      title: row.title,
      background: row.background,
      speakers,
      speakerSides: storySpeakerSideLists(speakers),
      pages,
      choices: toList(row.choices).map((entry) => {
        const [id, label] = entry.split("=");
        return { id, label: label || id };
      }),
      once: String(row.once || "").trim().toLowerCase() !== "false",
      blocking: toBool(row.blocking),
      priority: toNumber(row.priority, 0),
      requirements: toRequirements(row.requirements),
      context: toContextMatchers(row.context),
      sound: row.sound || "",
      soundVolume: row.soundVolume ? toNumber(row.soundVolume, null) : null,
      effects: toCommsEffects(row.effects)
    };
  }).filter((event) => event.id && event.trigger && event.pages.length).sort((a, b) => b.priority - a.priority);
  await loadRequiredCsv("data/labor_tooltips.csv", (rows) => {
    if (typeof window.configureLaborTooltips !== "function") {
      throw new Error("Labor tooltip loader is unavailable");
    }
    window.configureLaborTooltips(rows);
  });
  await loadRequiredCsv("data/ui_text.csv", applyUiText);
}

function setBootLoadingProgress(done, total, label = "素材を読み込んでいます...") {
  const overlay = document.getElementById("boot-loading");
  if (!overlay) return;
  const ratio = total ? Math.round((done / total) * 100) : 0;
  const fill = document.getElementById("boot-loading-fill");
  const textNode = document.getElementById("boot-loading-text");
  const count = document.getElementById("boot-loading-count");
  if (fill) fill.style.width = `${Math.max(0, Math.min(100, ratio))}%`;
  if (textNode) textNode.textContent = label;
  if (count) count.textContent = total ? `${done} / ${total} // ${ratio}%` : "0%";
}

function hideBootLoading() {
  const overlay = document.getElementById("boot-loading");
  inputDiagnosticState.bootOverlayHidden = true;
  inputDiagnosticLog("boot", "boot-loading hidden");
  if (!overlay || overlay.dataset.hiding === "true") return;
  overlay.dataset.hiding = "true";
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.pointerEvents = "none";
  overlay.style.visibility = "hidden";
  overlay.style.display = "none";
  window.requestAnimationFrame(() => overlay.remove());
}

function addAssetUrl(set, value) {
  const url = String(value || "").trim();
  if (!url || url.startsWith("#") || url.startsWith("data:")) return;
  if (!/\.(png|jpe?g|webp|gif|svg|ico)(\?|#|$)/i.test(url)) return;
  set.add(url);
}

function collectBootImageAssets() {
  const urls = new Set();
  document.querySelectorAll("img[src]").forEach((image) => {
    const current = image.getAttribute("src");
    const fresh = freshCharacterAssetUrl(current);
    if (fresh !== current) image.setAttribute("src", fresh);
  });
  document.querySelectorAll("img[src]:not([loading='lazy']), link[rel='icon'][href]").forEach((element) => {
    addAssetUrl(urls, element.getAttribute("src") || element.getAttribute("href"));
  });
  [SAFE_ROOM_IMAGE].forEach((url) => addAssetUrl(urls, url));
  Object.values(CROPS).forEach((entry) => addAssetUrl(urls, entry.icon));
  Object.values(GROW_UNITS).forEach((entry) => {
    addAssetUrl(urls, entry.icon);
    addAssetUrl(urls, entry.sprite);
    addAssetUrl(urls, entry.emptySprite);
  });
  Object.values(FLOOR_DEVICES).forEach((entry) => {
    addAssetUrl(urls, entry.icon);
    addAssetUrl(urls, entry.sprite);
  });
  Object.values(EQUIPMENT).forEach((entry) => {
    addAssetUrl(urls, entry.icon);
    addAssetUrl(urls, entry.sprite);
  });
  Object.values(AREA_PROFILES).forEach((entry) => addAssetUrl(urls, entry.image));
  Object.values(PLANT_STAGE_SPRITES).flat().forEach((url) => addAssetUrl(urls, url));
  Object.values(UI_TEXT).forEach((value) => addAssetUrl(urls, value));
  return [...urls];
}

function preloadImageAsset(url, timeoutMs = BOOT_ASSET_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const finish = (error = null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (error) reject(error);
      else resolve(url);
    };
    const timer = window.setTimeout(() => finish(new Error(`Image timed out: ${url}`)), timeoutMs);
    image.decoding = "async";
    image.onload = () => finish();
    image.onerror = () => finish(new Error(`Image failed to load: ${url}`));
    image.src = url;
    if (image.complete && image.naturalWidth > 0) image.onload();
  });
}

async function preloadBootAssets() {
  const urls = collectBootImageAssets();
  const failures = [];
  let done = 0;
  let nextIndex = 0;
  const workerCount = Math.min(6, Math.max(1, urls.length));
  setBootLoadingProgress(done, urls.length, "画像素材を確認しています...");
  async function preloadNext() {
    while (nextIndex < urls.length) {
      const currentIndex = nextIndex;
      const url = urls[currentIndex];
      nextIndex += 1;
      setBootLoadingProgress(done, urls.length, `読み込み中 (${Math.min(done + 1, urls.length)}/${urls.length}): ${url}`);
      try {
        await preloadImageAsset(url);
      } catch (error) {
        failures.push({ path: url, message: error.message });
        console.warn("Boot image preload skipped", url, error);
      }
      done += 1;
      setBootLoadingProgress(done, urls.length, `確認済み (${done}/${urls.length}): ${url}`);
    }
  }
  await Promise.all(Array.from({ length: workerCount }, preloadNext));
  window.BOOT_ASSET_FAILURES = failures;
  if (failures.length) throw createGameDataError(failures);
}
function applyUiText(rows) {
  rows.forEach((row) => {
    const value = freshCharacterAssetUrl(row.text);
    UI_TEXT[row.key] = value;
    if (!row.selector) return;
    const element = row.selector === "title" ? document.querySelector("title") : document.querySelector(row.selector);
    if (!element) return;
    if (row.attribute === "html") element.innerHTML = value;
    else if (row.attribute === "text") element.textContent = value;
    else element.setAttribute(row.attribute, value);
  });
}

function text(key, fallback, vars = {}) {
  return Object.entries(vars).reduce(
    (message, [name, value]) => message.replaceAll(`{${name}}`, value),
    UI_TEXT[key] || fallback
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textBlockMarkup(value, className = "") {
  const paragraphs = toList(value);
  if (!paragraphs.length) return "";
  const classAttr = className ? ` class="${escapeHtml(className)}"` : "";
  return paragraphs.map((paragraph) => `<p${classAttr}>${escapeHtml(paragraph)}</p>`).join("");
}

function optionalImageMarkup(src, alt = "", className = "") {
  const resolvedSrc = freshCharacterAssetUrl(src);
  return resolvedSrc ? `<img class="${escapeHtml(className)}" src="${escapeHtml(resolvedSrc)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">` : "";
}


function defaultAnalytics() {
  return {
    startedAt: Date.now(),
    timeline: {},
    purchaseOrder: [],
    recentFailures: [],
    plantingFailures: {},
    plants: {
      plantedByCrop: {},
      plantedByUnit: {},
      readyByCrop: {},
      harvestByCrop: {},
      harvestByUnit: {},
      harvestByQuality: {},
      degradedHarvests: 0,
      deaths: 0,
      deadRemoved: 0,
      harvestDelayTotalSec: 0,
      harvestDelayCount: 0,
      maxHarvestDelaySec: 0
    },
    sales: {
      saleCount: 0,
      byCropMarket: {},
      byQuality: {},
      premiumSales: 0,
      bestMarketMisses: 0,
      estimatedRevenueLoss: 0
    },
    resources: {
      waterUsed: 0,
      nutrientUsed: 0,
      waterUsedOnPlanting: 0,
      nutrientUsedOnPlanting: 0,
      waterUsedWhileGrowing: 0,
      nutrientUsedWhileGrowing: 0,
      waterProduced: 0,
      nutrientProduced: 0,
      waterProductionLost: 0,
      nutrientProductionLost: 0
    },
    tabs: {},
    equipment: {
      placements: 0,
      stocked: 0,
      sold: 0
    }
  };
}

function ensureAnalytics() {
  if (!state) return null;
  const defaults = defaultAnalytics();
  state.analytics = { ...defaults, ...(state.analytics || {}) };
  state.analytics.timeline ||= {};
  state.analytics.purchaseOrder = Array.isArray(state.analytics.purchaseOrder) ? state.analytics.purchaseOrder : [];
  state.analytics.recentFailures = Array.isArray(state.analytics.recentFailures) ? state.analytics.recentFailures : [];
  state.analytics.plantingFailures ||= {};
  state.analytics.plants = { ...defaults.plants, ...(state.analytics.plants || {}) };
  state.analytics.plants.plantedByCrop ||= {};
  state.analytics.plants.plantedByUnit ||= {};
  state.analytics.plants.readyByCrop ||= {};
  state.analytics.plants.harvestByCrop ||= {};
  state.analytics.plants.harvestByUnit ||= {};
  state.analytics.plants.harvestByQuality ||= {};
  state.analytics.sales = { ...defaults.sales, ...(state.analytics.sales || {}) };
  state.analytics.sales.byCropMarket ||= {};
  state.analytics.sales.byQuality ||= {};
  state.analytics.resources = { ...defaults.resources, ...(state.analytics.resources || {}) };
  state.analytics.tabs ||= {};
  state.analytics.equipment = { ...defaults.equipment, ...(state.analytics.equipment || {}) };
  if (!Number.isFinite(Number(state.analytics.startedAt))) state.analytics.startedAt = Date.now();
  return state.analytics;
}

function incrementMetric(record, key, amount = 1) {
  if (!record || !key) return;
  record[key] = Math.round((Number(record[key]) || 0) + amount);
}

function addMetric(record, key, amount = 0) {
  if (!record || !key) return;
  record[key] = Math.round((Number(record[key]) || 0) + amount);
}

function analyticsElapsedSeconds() {
  const analytics = ensureAnalytics();
  if (!analytics) return 0;
  return Math.max(0, Math.round((Date.now() - analytics.startedAt) / 1000));
}

function analyticsDayFloat() {
  return Number(((Number(state?.day) || 1) + (Number(state?.dayProgress) || 0)).toFixed(2));
}

function currentInventoryDayFloat() {
  return Math.max(1, (Number(state?.day) || 1) + (Number(state?.dayProgress) || 0));
}

function inventoryHarvestTimestamp() {
  return Number(currentInventoryDayFloat().toFixed(5));
}

function inventoryDegradeAfterDays() {
  return state?.equipment?.fridge ? 6 : 3;
}

function inventoryAgeDays(batch, atDay = currentInventoryDayFloat()) {
  const harvestedAt = Number(batch?.harvestedAtDay);
  if (Number.isFinite(harvestedAt)) {
    return Math.max(0, Math.floor(Number(atDay) - harvestedAt + 0.000001));
  }
  return Math.max(0, Math.floor(Number(batch?.age) || 0));
}

function normalizeInventoryBatch(item, atDay = currentInventoryDayFloat()) {
  const age = Math.max(0, Math.floor(Number(item.age) || 0));
  const harvestedAt = Number.isFinite(Number(item.harvestedAtDay))
    ? Number(item.harvestedAtDay)
    : Number((Number(atDay) - age).toFixed(5));
  const batch = {
    ...item,
    qty: Math.max(0, Number(item.qty) || 0),
    harvestedAtDay: harvestedAt
  };
  batch.age = inventoryAgeDays(batch, atDay);
  if (batch.age >= inventoryDegradeAfterDays()) batch.degraded = true;
  return batch;
}

function refreshInventoryAges(atDay = currentInventoryDayFloat()) {
  if (!Array.isArray(state?.inventory)) return;
  state.inventory.forEach((batch) => {
    batch.harvestedAtDay = Number.isFinite(Number(batch.harvestedAtDay))
      ? Number(batch.harvestedAtDay)
      : Number((Number(atDay) - (Number(batch.age) || 0)).toFixed(5));
    batch.age = inventoryAgeDays(batch, atDay);
    if (batch.age >= inventoryDegradeAfterDays()) batch.degraded = true;
  });
}

function isInventoryBatchDegraded(batch) {
  return Boolean(batch?.degraded) || inventoryAgeDays(batch) >= inventoryDegradeAfterDays();
}

function analyticsStamp(extra = {}) {
  return {
    day: Number(state?.day) || 1,
    dayFloat: analyticsDayFloat(),
    elapsedSec: analyticsElapsedSeconds(),
    ...extra
  };
}

function pushCapped(list, entry, limit = 120) {
  list.push(entry);
  if (list.length > limit) list.splice(0, list.length - limit);
}

function trackTimeline(key, context = {}) {
  const analytics = ensureAnalytics();
  if (!analytics || analytics.timeline[key]) return;
  analytics.timeline[key] = analyticsStamp(context);
}

function trackPurchase(kind, itemId, price = 0, extra = {}) {
  const analytics = ensureAnalytics();
  if (!analytics) return;
  const entry = analyticsStamp({ kind, itemId, price: Math.round(Number(price) || 0), ...extra });
  pushCapped(analytics.purchaseOrder, entry, 200);
  trackTimeline('firstPurchase', entry);
  trackTimeline('firstPurchase:' + kind, entry);
  if (itemId) trackTimeline('firstPurchase:' + kind + ':' + itemId, entry);
}

function plantingShortageReason(context = {}) {
  const waterMissing = Number(context.waterMissing) > 0;
  const nutrientMissing = Number(context.nutrientMissing) > 0;
  if (waterMissing && nutrientMissing) return 'water_and_nutrient';
  if (waterMissing) return 'water';
  if (nutrientMissing) return 'nutrient';
  return 'resource';
}

function trackPlantingFailure(reason, context = {}) {
  const analytics = ensureAnalytics();
  if (!analytics) return;
  incrementMetric(analytics.plantingFailures, reason || 'unknown');
  pushCapped(analytics.recentFailures, analyticsStamp({ type: 'planting', reason: reason || 'unknown', ...context }), 80);
}

function trackPlanting(cropId, unit, shelfIndex, slotIndex, plantingCost = {}) {
  const analytics = ensureAnalytics();
  if (!analytics) return;
  incrementMetric(analytics.plants.plantedByCrop, cropId);
  incrementMetric(analytics.plants.plantedByUnit, unit?.type || 'unknown');
  const water = Number(plantingCost.water) || 0;
  const nutrient = Number(plantingCost.nutrient) || 0;
  addMetric(analytics.resources, 'waterUsed', water);
  addMetric(analytics.resources, 'nutrientUsed', nutrient);
  addMetric(analytics.resources, 'waterUsedOnPlanting', water);
  addMetric(analytics.resources, 'nutrientUsedOnPlanting', nutrient);
  trackTimeline('firstPlant', { cropId, unitType: unit?.type, shelfIndex, slotIndex });
  trackTimeline('firstPlant:' + cropId, { cropId, unitType: unit?.type, shelfIndex, slotIndex });
  trackTimeline('firstPlantUnit:' + (unit?.type || 'unknown'), { cropId, unitType: unit?.type, shelfIndex, slotIndex });
}

function trackPlantReady(plant, shelf) {
  const analytics = ensureAnalytics();
  if (!analytics || !plant || plant.readyTracked) return;
  plant.readyTracked = true;
  plant.readyAtElapsedSec = analyticsElapsedSeconds();
  plant.readyAtDayFloat = analyticsDayFloat();
  incrementMetric(analytics.plants.readyByCrop, plant.crop);
  trackTimeline('firstReady', { cropId: plant.crop, unitType: shelf?.type });
  trackTimeline('firstReady:' + plant.crop, { cropId: plant.crop, unitType: shelf?.type });
}

function trackHarvestAnalytics(plant, shelf, qty = 1) {
  const analytics = ensureAnalytics();
  if (!analytics || !plant) return;
  const amount = Math.max(1, Number(qty) || 1);
  incrementMetric(analytics.plants.harvestByCrop, plant.crop, amount);
  incrementMetric(analytics.plants.harvestByUnit, shelf?.type || 'unknown', amount);
  incrementMetric(analytics.plants.harvestByQuality, plant.quality || 'unknown', amount);
  if (plant.degraded) analytics.plants.degradedHarvests += amount;
  if (Number.isFinite(Number(plant.readyAtElapsedSec))) {
    const delay = Math.max(0, analyticsElapsedSeconds() - Number(plant.readyAtElapsedSec));
    analytics.plants.harvestDelayTotalSec += delay * amount;
    analytics.plants.harvestDelayCount += amount;
    analytics.plants.maxHarvestDelaySec = Math.max(Number(analytics.plants.maxHarvestDelaySec) || 0, delay);
  }
  trackTimeline('firstHarvest', { cropId: plant.crop, unitType: shelf?.type, quality: plant.quality });
  trackTimeline('firstHarvest:' + plant.crop, { cropId: plant.crop, unitType: shelf?.type, quality: plant.quality });
}

function trackDeadPlantAnalytics(plant, shelf, reason = 'dead') {
  const analytics = ensureAnalytics();
  if (!analytics || !plant) return;
  if (reason === 'removed') {
    analytics.plants.deadRemoved += 1;
    return;
  }
  if (plant.deadTracked) return;
  plant.deadTracked = true;
  analytics.plants.deaths += 1;
  pushCapped(analytics.recentFailures, analyticsStamp({ type: 'plant_dead', reason, cropId: plant.crop, unitType: shelf?.type }), 80);
}

function trackSaleAnalytics(batch, marketId, qty, unitPrice, revenue, premiumSale = false) {
  const analytics = ensureAnalytics();
  if (!analytics || !batch) return;
  const amount = Math.max(1, Number(qty) || 1);
  analytics.sales.saleCount += 1;
  incrementMetric(analytics.sales.byQuality, batch.quality || 'unknown', amount);
  if (premiumSale) analytics.sales.premiumSales += amount;
  const key = batch.crop + ':' + marketId;
  const entry = analytics.sales.byCropMarket[key] || { cropId: batch.crop, marketId, qty: 0, revenue: 0 };
  entry.qty += amount;
  entry.revenue += Math.round(Number(revenue) || 0);
  analytics.sales.byCropMarket[key] = entry;
  const acceptedMarkets = Object.keys(MARKETS).filter((candidate) => canSellCropToMarket(batch.crop, candidate));
  const best = acceptedMarkets
    .map((candidate) => ({ marketId: candidate, price: getUnitPrice(batch, candidate) }))
    .sort((a, b) => b.price - a.price)[0];
  if (best && best.marketId !== marketId && best.price > unitPrice) {
    analytics.sales.bestMarketMisses += 1;
    analytics.sales.estimatedRevenueLoss += Math.round((best.price - unitPrice) * amount);
  }
  trackTimeline('firstSale', { cropId: batch.crop, marketId, qty: amount, revenue: Math.round(Number(revenue) || 0) });
  trackTimeline('firstSaleMarket:' + marketId, { cropId: batch.crop, marketId, qty: amount, revenue: Math.round(Number(revenue) || 0) });
}

function trackTabAnalytics(tabId, previousTab = '') {
  const analytics = ensureAnalytics();
  if (!analytics || !tabId) return;
  incrementMetric(analytics.tabs, tabId);
  trackTimeline('firstTab:' + tabId, { tabId, previousTab });
}

function trackResourceGrowthUse(water = 0, nutrient = 0) {
  const analytics = ensureAnalytics();
  if (!analytics) return;
  addMetric(analytics.resources, 'waterUsed', water);
  addMetric(analytics.resources, 'nutrientUsed', nutrient);
  addMetric(analytics.resources, 'waterUsedWhileGrowing', water);
  addMetric(analytics.resources, 'nutrientUsedWhileGrowing', nutrient);
}

function trackPlacementAnalytics(kind, item) {
  const analytics = ensureAnalytics();
  if (!analytics || !item) return;
  analytics.equipment.placements += 1;
  trackTimeline('firstPlaced:' + kind + ':' + item.type, { kind, itemId: item.type, x: item.x, y: item.y });
}

function trackStockAnalytics(kind, item) {
  const analytics = ensureAnalytics();
  if (!analytics || !item) return;
  analytics.equipment.stocked += 1;
}

function trackEquipmentSaleAnalytics(kind, item, refund = 0) {
  const analytics = ensureAnalytics();
  if (!analytics || !item) return;
  analytics.equipment.sold += 1;
  pushCapped(analytics.purchaseOrder, analyticsStamp({ kind: 'sell_' + kind, itemId: item.type, price: -Math.round(Number(refund) || 0) }), 200);
}

function createAnalyticsSummary() {
  const analytics = ensureAnalytics() || defaultAnalytics();
  const plants = analytics.plants || {};
  const totalSlots = allShelves().reduce((sum, shelf) => sum + (shelf.slots?.length || 0), 0);
  const active = activePlants();
  const plantedSlots = active.filter(({ plant }) => plant && !plant.dead).length;
  const readySlots = active.filter(({ plant }) => plant?.ready).length;
  const plantingFailureTotal = Object.values(analytics.plantingFailures || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
  return {
    startedAt: analytics.startedAt,
    elapsedSec: analyticsElapsedSeconds(),
    timeline: analytics.timeline,
    purchaseOrder: analytics.purchaseOrder,
    recentFailures: analytics.recentFailures,
    plantingFailures: analytics.plantingFailures,
    plantingFailureTotal,
    plants: {
      ...plants,
      averageHarvestDelaySec: plants.harvestDelayCount ? Math.round(plants.harvestDelayTotalSec / plants.harvestDelayCount) : 0
    },
    sales: analytics.sales,
    resources: analytics.resources,
    tabs: analytics.tabs,
    equipment: analytics.equipment,
    utilization: {
      totalSlots,
      plantedSlots,
      readySlots,
      occupancyRate: totalSlots ? Number((plantedSlots / totalSlots).toFixed(3)) : 0
    }
  };
}

function createDefaultSupportAutomation() {
  return {
    procurement: {
      selectedCropId: "lettuce",
      byCrop: Object.fromEntries(Object.keys(CROPS).map((cropId) => [cropId, { enabled: false, packs: 1 }]))
    },
    planting: { enabled: false, cropId: "lettuce" },
    shipping: {
      selectedCropId: "lettuce",
      byCrop: Object.fromEntries(Object.keys(CROPS).map((cropId) => [cropId, { enabled: false, marketId: "lower", qty: 1 }]))
    }
  };
}

const RADAR_FINE_RATES = Array.from({ length: 10 }, (_, index) => (index + 1) / 10);
const RADAR_MAX_PATROLS = 12;

function createDefaultRadarState() {
  return {
    unlocked: false,
    suspicion: 0,
    patrolCount: 3,
    fineLevel: 0,
    powerOn: true,
    demoPending: false,
    demoConsumed: false,
    tutorialActive: false,
    tutorialResolved: false,
    tutorialOutcome: "",
    lastApproachDayFloat: null,
    approachesStarted: 0,
    unlockConversationPending: false,
    finesPaid: 0,
    detections: 0
  };
}

function ensureRadarState() {
  if (!state) return createDefaultRadarState();
  const defaults = createDefaultRadarState();
  const saved = state.radar && typeof state.radar === "object" ? state.radar : {};
  const hadTutorialState = Object.prototype.hasOwnProperty.call(saved, "tutorialActive");
  const hadTutorialResolution = Object.prototype.hasOwnProperty.call(saved, "tutorialResolved");
  state.radar = { ...defaults, ...saved };
  state.radar.unlocked = Boolean(state.radar.unlocked || state.unlocks?.radar_access);
  state.radar.suspicion = Math.max(0, Math.min(100, Math.round(Number(state.radar.suspicion) || 0)));
  state.radar.patrolCount = Math.max(0, Math.min(RADAR_MAX_PATROLS, Math.round(Number(state.radar.patrolCount) || 0)));
  state.radar.fineLevel = Math.max(0, Math.min(RADAR_FINE_RATES.length - 1, Math.round(Number(state.radar.fineLevel) || 0)));
  state.radar.powerOn = state.radar.powerOn !== false;
  state.radar.demoPending = Boolean(state.radar.demoPending);
  state.radar.demoConsumed = Boolean(state.radar.demoConsumed);
  state.radar.tutorialActive = hadTutorialState ? Boolean(state.radar.tutorialActive) : state.radar.demoPending;
  state.radar.tutorialResolved = hadTutorialResolution
    ? Boolean(state.radar.tutorialResolved)
    : Boolean(state.radar.demoConsumed && !state.radar.demoPending);
  state.radar.tutorialOutcome = ["success", "failure"].includes(state.radar.tutorialOutcome)
    ? state.radar.tutorialOutcome
    : "";
  const lastApproachDayFloat = Number(state.radar.lastApproachDayFloat);
  state.radar.lastApproachDayFloat = Number.isFinite(lastApproachDayFloat) && lastApproachDayFloat >= 1
    ? Number(lastApproachDayFloat.toFixed(4))
    : null;
  state.radar.approachesStarted = Math.max(0, Math.round(Number(state.radar.approachesStarted) || 0));
  if (state.radar.unlocked && state.radar.lastApproachDayFloat === null) {
    state.radar.lastApproachDayFloat = Number(currentInventoryDayFloat().toFixed(4));
  }
  state.radar.unlockConversationPending = Boolean(state.radar.unlockConversationPending);
  state.radar.finesPaid = Math.max(0, Number(state.radar.finesPaid) || 0);
  state.radar.detections = Math.max(0, Math.round(Number(state.radar.detections) || 0));
  return state.radar;
}

function radarSnapshot() {
  if (!state) {
    return {
      ...createDefaultRadarState(),
      running: false,
      clockRunning: false,
      money: 0,
      totalRevenue: 0,
      day: 1,
      dayFloat: 1
    };
  }
  const radar = ensureRadarState();
  return {
    ...radar,
    running: isRadarSimulationRunning(),
    clockRunning: isGameTimeRunning(),
    money: Number(state.money) || 0,
    totalRevenue: Number(state.tradeStats?.revenue) || 0,
    day: Number(state.day) || 1,
    dayFloat: Number(currentInventoryDayFloat().toFixed(4))
  };
}

function radarSupportRobotBlackoutData() {
  if (!state) return { robots: [], lines: [] };
  const robots = supportRobotRoster()
    .filter(({ robot }) => robot.placed)
    .map(({ base, robot }) => ({
      id: robot.id,
      name: supportRobotDisplayName(robot),
      baseName: base.name || "UNKNOWN BASE",
      recoveryMode: supportRobotRecoveryMode(robot),
      energy: Math.round(Number(robot.supportEnergy) || 0),
      morale: Math.round(Number(robot.supportMorale) || 0)
    }));
  return {
    robots,
    lines: SUPPORT_ROBOT_BLACKOUT_LINES.map((line) => ({
      id: line.id,
      text: line.text,
      weight: line.weight
    }))
  };
}

function notifyRadarState() {
  window.dispatchEvent(new CustomEvent("undergreen:radar-state", { detail: radarSnapshot() }));
}

function setRadarSuspicion(value) {
  const radar = ensureRadarState();
  radar.suspicion = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  notifyRadarState();
  return radar.suspicion;
}

function addRadarSuspicion(amount) {
  const delta = Math.max(0, Math.round(Number(amount) || 0));
  if (!delta) return ensureRadarState().suspicion;
  return setRadarSuspicion(ensureRadarState().suspicion + delta);
}

function radarPurchaseSuspicion(cost) {
  return Math.max(1, Math.min(8, Math.ceil(Math.max(0, Number(cost) || 0) / 250)));
}

function radarShipmentSuspicion(qty, revenue) {
  const volume = Math.ceil(Math.max(0, Number(qty) || 0) / 4);
  const value = Math.floor(Math.max(0, Number(revenue) || 0) / 750);
  return Math.max(1, Math.min(12, volume + value));
}

function setRadarPatrolCount(value, { relative = false } = {}) {
  const radar = ensureRadarState();
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return radar.patrolCount;
  const next = relative ? radar.patrolCount + parsed : parsed;
  radar.patrolCount = Math.max(0, Math.min(RADAR_MAX_PATROLS, Math.round(next)));
  notifyRadarState();
  return radar.patrolCount;
}

function queueRadarDemo() {
  if (state?.debugMode) return false;
  const radar = ensureRadarState();
  radar.unlocked = true;
  radar.demoPending = true;
  radar.demoConsumed = false;
  radar.tutorialActive = true;
  radar.tutorialResolved = false;
  radar.tutorialOutcome = "";
  radar.lastApproachDayFloat = Number(currentInventoryDayFloat().toFixed(4));
  saveGame();
  notifyRadarState();
  return true;
}

function consumeRadarDemo() {
  const radar = ensureRadarState();
  if (!radar.demoPending) return false;
  radar.demoPending = false;
  radar.demoConsumed = true;
  saveGame();
  notifyRadarState();
  return true;
}

function markRadarApproachStarted({ tutorial = false, guaranteed = false } = {}) {
  if (state?.debugMode) return null;
  const radar = ensureRadarState();
  if (!radar.unlocked) return null;
  const dayFloat = Number(currentInventoryDayFloat().toFixed(4));
  radar.lastApproachDayFloat = dayFloat;
  radar.approachesStarted += 1;
  if (tutorial) radar.tutorialActive = true;
  saveGame();
  notifyRadarState();
  return { dayFloat, tutorial: Boolean(tutorial), guaranteed: Boolean(guaranteed) };
}

function resolveRadarTutorial(outcome) {
  const radar = ensureRadarState();
  const normalizedOutcome = outcome === "success" ? "success" : outcome === "failure" ? "failure" : "";
  if (!normalizedOutcome || (!radar.tutorialActive && radar.tutorialResolved)) return false;
  radar.demoPending = false;
  radar.demoConsumed = true;
  radar.tutorialActive = false;
  radar.tutorialResolved = true;
  radar.tutorialOutcome = normalizedOutcome;
  saveGame();
  notifyRadarState();
  window.setTimeout(() => {
    if (!state || state.ended) return;
    triggerComms(`radar_tutorial_${normalizedOutcome}`, {
      target: "radar",
      tutorialOutcome: normalizedOutcome
    });
  }, 0);
  return true;
}

function setRadarPower(powerOn) {
  const radar = ensureRadarState();
  radar.powerOn = Boolean(powerOn);
  saveGame();
  notifyRadarState();
  return radar.powerOn;
}

function applyRadarFine() {
  if (state?.debugMode) return null;
  const radar = ensureRadarState();
  if (!radar.unlocked || !radar.powerOn || radar.tutorialActive) return null;
  const fineIndex = Math.max(0, Math.min(RADAR_FINE_RATES.length - 1, radar.fineLevel));
  const rate = RADAR_FINE_RATES[fineIndex];
  const balance = Math.max(0, Math.floor(Number(state.money) || 0));
  const amount = Math.min(balance, Math.ceil(balance * rate));
  state.money -= amount;
  radar.fineLevel = Math.min(RADAR_FINE_RATES.length - 1, fineIndex + 1);
  radar.finesPaid += amount;
  radar.detections += 1;
  const percent = Math.round(rate * 100);
  setStatus(
    "巡回官憲に検知され、所持金の" + percent + "%（C" + amount + "）を徴収されました。",
    { log: false }
  );
  toast("検知ペナルティ " + percent + "% / -C" + amount, "error");
  playSoundFirst(["alert", "failure"], 0.28);
  pulseElement(document.getElementById("money-value"));
  saveGame();
  renderHeader();
  notifyRadarState();
  return { amount, rate, money: state.money, fineLevel: radar.fineLevel };
}

function triggerPendingRadarUnlockConversation() {
  if (!state || startScreenOpen) return false;
  const radar = ensureRadarState();
  if (state.debugMode) {
    radar.unlockConversationPending = false;
    return false;
  }
  if (!radar.unlockConversationPending || state.storySeen?.story_radar_unlocked) {
    radar.unlockConversationPending = false;
    return false;
  }
  radar.unlockConversationPending = false;
  triggerComms("radar_unlocked", {
    unlockId: "radar_access",
    unlockType: "radar",
    unlockTarget: "radar",
    target: "radar"
  });
  saveGame();
  notifyRadarState();
  return true;
}

window.UndergreenRadar = {
  getSnapshot: radarSnapshot,
  getSupportRobotBlackoutData: radarSupportRobotBlackoutData,
  setPower: setRadarPower,
  applyFine: applyRadarFine,
  consumeDemo: consumeRadarDemo,
  markApproachStarted: markRadarApproachStarted,
  resolveTutorial: resolveRadarTutorial,
  setPatrolCount: setRadarPatrolCount,
  setSuspicion: setRadarSuspicion
};

function createDefaultLaborTutorialState() {
  return {
    active: false,
    completed: false,
    phase: "idle",
    targetType: "cleaning",
    targetRobotId: "",
    targetNodeId: "",
    branchNodeId: "",
    conditionNodeId: "",
    restNodeId: "",
    completionQueued: false,
    pausedBefore: false,
    deferredStories: [],
    deferredComms: []
  };
}

function ensureLaborTutorialState() {
  if (!state) return createDefaultLaborTutorialState();
  const source = state.laborTutorial && typeof state.laborTutorial === "object"
    ? state.laborTutorial
    : {};
  const validPhases = new Set([
    "idle",
    "place_cleaning",
    "connect_cleaning",
    "cleaning_review",
    "disconnect_cleaning",
    "place_branch",
    "place_condition",
    "configure_condition",
    "place_rest",
    "connect_event_branch",
    "connect_condition_branch",
    "connect_true_rest",
    "connect_false_cleaning",
    "advanced_review"
  ]);
  const tutorial = {
    ...createDefaultLaborTutorialState(),
    ...source,
    active: Boolean(source.active),
    completed: Boolean(source.completed),
    phase: validPhases.has(source.phase) ? source.phase : (source.active ? "place_cleaning" : "idle"),
    targetType: "cleaning",
    targetRobotId: typeof source.targetRobotId === "string" ? source.targetRobotId : "",
    targetNodeId: typeof source.targetNodeId === "string" ? source.targetNodeId : "",
    branchNodeId: typeof source.branchNodeId === "string" ? source.branchNodeId : "",
    conditionNodeId: typeof source.conditionNodeId === "string" ? source.conditionNodeId : "",
    restNodeId: typeof source.restNodeId === "string" ? source.restNodeId : "",
    completionQueued: Boolean(source.completionQueued),
    pausedBefore: Boolean(source.pausedBefore),
    deferredStories: Array.isArray(source.deferredStories) ? source.deferredStories : [],
    deferredComms: Array.isArray(source.deferredComms) ? source.deferredComms : []
  };
  if (tutorial.completed) tutorial.active = false;
  if (state.debugMode && tutorial.active) {
    state.paused = tutorial.pausedBefore;
    tutorial.active = false;
    tutorial.phase = "idle";
    tutorial.completionQueued = false;
  } else if (tutorial.active) {
    state.paused = true;
  }
  state.laborTutorial = tutorial;
  return tutorial;
}

function isLaborTutorialActive() {
  return Boolean(state && !state.debugMode && ensureLaborTutorialState().active);
}

function laborTutorialTargetRecord() {
  const tutorial = ensureLaborTutorialState();
  const roster = supportRobotRoster();
  const record = roster.find(({ robot }) => robot.id === tutorial.targetRobotId)
    || roster.find(({ robot }) => robot.isInitialSupportRobot)
    || roster[0]
    || null;
  if (record && tutorial.targetRobotId !== record.robot.id) tutorial.targetRobotId = record.robot.id;
  return record;
}

function syncLaborTutorialLock() {
  const active = isLaborTutorialActive();
  const tutorial = active ? ensureLaborTutorialState() : null;
  document.body?.classList.toggle("labor-tutorial-active", active);
  if (document.body) document.body.dataset.laborTutorialPhase = active ? tutorial.phase : "";
  if (active && activeTabId() !== "labor") setActiveTabSilently("labor");
}

function startLaborTutorial() {
  if (!state || state.debugMode) return false;
  const current = ensureLaborTutorialState();
  if (current.completed || current.active) return false;
  const record = laborTutorialTargetRecord();
  if (!record) {
    toast("接続訓練を開始できるサポートロボットがいません。", "warning");
    return false;
  }
  ensureSupportRobotProfile(record.robot);
  record.robot.supportBlueprint = createDefaultSupportBlueprint();
  resetSupportBlueprintRuntime(record.robot);
  selectedLaborRobotId = record.robot.id;
  state.laborTutorial = {
    ...createDefaultLaborTutorialState(),
    active: true,
    phase: "place_cleaning",
    targetRobotId: record.robot.id,
    pausedBefore: Boolean(state.paused)
  };
  state.paused = true;
  lastTickAt = Date.now();
  suspendNonTutorialEventsForLaborTutorial();
  ensureOpenedTabs();
  state.openedTabs.labor = true;
  setActiveTabSilently("labor");
  syncLaborTutorialLock();
  saveGame();
  render();
  return true;
}

function continueAdvancedLaborTutorial() {
  if (!state || state.debugMode) return false;
  const tutorial = ensureLaborTutorialState();
  if (!tutorial.active || tutorial.phase !== "cleaning_review") return false;
  tutorial.phase = "disconnect_cleaning";
  tutorial.completionQueued = false;
  state.paused = true;
  lastTickAt = Date.now();
  syncLaborTutorialLock();
  saveGame();
  render();
  return true;
}

function completeLaborTutorial() {
  if (!state) return false;
  const tutorial = ensureLaborTutorialState();
  const pausedBefore = tutorial.pausedBefore;
  state.laborTutorial = {
    ...tutorial,
    active: false,
    completed: true,
    phase: "idle",
    completionQueued: false
  };
  state.paused = pausedBefore;
  lastTickAt = Date.now();
  restoreDeferredLaborTutorialEvents();
  syncLaborTutorialLock();
  saveGame();
  render();
  toast("接続訓練が完了しました。労務管理の全操作を利用できます。", "success");
  return true;
}

function onLaborTutorialConnectionComplete({ robotId = "", nodeId = "" } = {}) {
  if (!isLaborTutorialActive()) return false;
  const tutorial = ensureLaborTutorialState();
  if (robotId && robotId !== tutorial.targetRobotId) return false;
  if (tutorial.targetNodeId && nodeId && nodeId !== tutorial.targetNodeId) return false;
  const isCleaningReview = tutorial.phase === "cleaning_review";
  const isAdvancedReview = tutorial.phase === "advanced_review";
  if (!isCleaningReview && !isAdvancedReview) return false;
  if (nodeId) tutorial.targetNodeId = nodeId;
  syncLaborTutorialLock();
  if (tutorial.completionQueued) return true;
  tutorial.completionQueued = true;
  saveGame();
  const triggerName = isCleaningReview
    ? "labor_tutorial_cleaning_completed"
    : "labor_tutorial_completed";
  const opened = triggerStoryEvent(triggerName, {
    tabId: "labor",
    robotId: tutorial.targetRobotId,
    nodeId: tutorial.targetNodeId
  });
  if (!opened) {
    tutorial.completionQueued = false;
    if (isCleaningReview) continueAdvancedLaborTutorial();
    else completeLaborTutorial();
  }
  return true;
}

window.onLaborTutorialConnectionComplete = onLaborTutorialConnectionComplete;
window.syncLaborTutorialLock = syncLaborTutorialLock;

function createInitialState(mode = "day45") {
  const initialProperty = createInitialSafeRoom();
  initialProperty.ownedAt = Date.now();
  const initialPod = createStarterPod();
  return {
    day: 1,
    mode,
    debugMode: false,
    money: 300,
    water: 20,
    waterCapacity: 20,
    nutrient: 20,
    nutrientCapacity: 20,
    seeds: Object.fromEntries(Object.keys(CROPS).map((cropId) => [cropId, cropId === "lettuce" ? 6 : 0])),
    bases: [{
      ...initialProperty,
      shelves: [initialPod],
      floorDevices: []
    }],
    activeBaseId: initialProperty.id,
    propertyListings: generatePropertyListings(PROPERTY_LISTING_COUNT),
    procurementTags: {},
    unlocks: {},
    inventory: [],
    equipment: { fridge: false },
    resourceCartridges: { water: 0, nutrient: 0 },
    supportOS: { harvest: false, planting: false, cleaning: false, storage: false },
    automation: createDefaultSupportAutomation(),
    laborTutorial: createDefaultLaborTutorialState(),
    supportPersonalityTriggerState: { lastProcessed: {} },
    supportRobotTalk: createDefaultSupportRobotTalkState(),
    radar: createDefaultRadarState(),
    resourceRemainders: { water: 0, nutrient: 0 },
    dayProgress: 0,
    paused: false,
    timeUnlocked: false,
    marketFluctuation: {},
    seedMarket: createDefaultSeedMarketState(0),
    marketSignals: {},
    marketEventOffsets: [],
    marketEventQueue: [],
    monthlySchedule: generateMonthlySchedule(),
    nextMarketForecastDay: 3,
    newsHistory: [],
    tradeStats: {
      unitsSold: 0,
      revenue: 0,
      byMarket: { lower: 0, medical: 0, upper: 0, rebel: 0 },
      byMarketQty: { lower: 0, medical: 0, upper: 0, rebel: 0 },
      byCrop: {},
      eventRevenue: 0,
      foodToRebels: 0,
      weaponsToRebels: 0
    },
    titleTracking: {
      started: false,
      startedAtRevenue: null,
      byCropBaseline: {},
      byMarketBaseline: {},
      byMarketQtyBaseline: {}
    },
    analytics: defaultAnalytics(),
    marketUnlocked: { lower: true, medical: false, upper: false, rebel: false },
    marketTabUnlocked: false,
    automationTabUnlocked: false,
    shopUnlocked: false,
    brokerUnlocked: false,
    commsSeen: {},
    commsChoices: {},
    storySeen: {},
    storyChoices: {},
    timedModeWarningsSeen: {},
    openedTabs: { farm: true },
    viewedMarkets: {},
    viewedShopCategories: {},
    uiGuide: null,
    commsOpen: [],
    storyOpen: [],
    event: null,
    news: "",
    newsLabel: "",
    audio: {
      noiseCanceling: false,
      radioProgram: "off"
    },
    day30Recorded: false,
    day30RecordId: null,
    consecutiveDebtDays: 0,
    tomatoHarvested: false,
    prototypeReportShown: false,
    supportRobotGranted: false,
    ended: false,
    resultShown: false,
    pendingDay30Result: null,
    log: text("log_initial", "System online. Place the grow pod Mara sent you.")
  };
}

function createStarterPod() {
  return {
    id: makeId("unit"),
    type: "pod",
    led: false,
    fan: false,
    placed: false,
    x: null,
    y: null,
    tags: pickTagIds(EQUIPMENT_TAGS, 1),
    dirt: 0,
    slots: Array(GROW_UNITS.pod.slots).fill(null)
  };
}

function createInitialSafeRoom() {
  const drainageProfile = AREA_PROFILES.drainage || {};
  const tags = ["humid"];
  const tagEffects = combinedEffects(tags, BASE_TAGS);
  const property = {
    id: makeId("property"),
    tier: "safe_room",
    name: "下層貧民区のセーフルーム",
    code: "SAFE-ROOM-01",
    cols: 3,
    rows: 2,
    price: 0,
    basePrice: 0,
    onSale: false,
    discountRate: 0,
    blockedCells: [],
    upkeep: 0,
    image: SAFE_ROOM_IMAGE,
    allowedUnits: ["pod"],
    traits: ["初期拠点", "POD専用", "極小区画"],
    tags,
    environment: {
      temp: DEFAULT_ENVIRONMENT.temp + (tagEffects.temp || 0),
      humidity: DEFAULT_ENVIRONMENT.humidity + (tagEffects.humidity || 0),
      co2: DEFAULT_ENVIRONMENT.co2 + (tagEffects.co2 || 0)
    },
    description: ""
  };
  property.description = propertyFlavorDescription(property);
  return property;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pickTagIds(source, count = 1) {
  const ids = Object.keys(source).sort(() => Math.random() - 0.5);
  return ids.slice(0, count);
}

function tagMarkup(tags = [], source = {}) {
  return tags.length
    ? `<div class="tag-list">${tags.map((tagId) => `<span title="${source[tagId]?.text || ""}">${source[tagId]?.name || tagId}</span>`).join("")}</div>`
    : "";
}

function combinedEffects(tags = [], source = {}) {
  return tags.reduce((effects, tagId) => {
    Object.entries(source[tagId]?.effects || {}).forEach(([key, value]) => {
      if (key.endsWith("Mod") || key === "growthMod" || key === "leafGrowth" || key === "fruitGrowth" || key === "herbGrowth") {
        effects[key] = (effects[key] || 1) * value;
      } else {
        effects[key] = (effects[key] || 0) + value;
      }
    });
    return effects;
  }, {});
}

function ensureProcurementTags() {
  state.procurementTags ||= {};
  Object.keys(EQUIPMENT).forEach((itemId) => {
    if (GROW_UNITS[itemId] || FLOOR_DEVICES[itemId]) {
      state.procurementTags[itemId] ||= pickTagIds(EQUIPMENT_TAGS, Math.random() < 0.22 ? 2 : 1);
    }
  });
}

function unitTags(itemId) {
  ensureProcurementTags();
  return [...(state.procurementTags[itemId] || [])];
}

function cellKey(x, y) {
  return `${x},${y}`;
}

function blockedCellSet(base) {
  return new Set(base.blockedCells || []);
}

function isBlockedCell(base, x, y) {
  return blockedCellSet(base).has(cellKey(x, y));
}

function generateBlockedCells(cols, rows, discountRate = 0, initial = false) {
  if (initial || discountRate <= 0) return [];
  const totalCells = cols * rows;
  const minRatio = Math.max(0.04, discountRate * 0.22);
  const maxRatio = Math.min(0.34, discountRate * 0.78);
  const holeCount = Math.max(1, Math.min(totalCells - 2, Math.round(totalCells * randomBetween(minRatio, maxRatio))));
  const candidates = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      candidates.push({ x, y, edge: x === 0 || y === 0 || x === cols - 1 || y === rows - 1 });
    }
  }
  candidates.sort((a, b) => Number(b.edge) - Number(a.edge) || Math.random() - 0.5);
  return candidates.slice(0, holeCount).map(({ x, y }) => cellKey(x, y));
}

function usableCellCount(base) {
  return base.cols * base.rows - (base.blockedCells || []).length;
}

function propertyFlavorDescription(property, onSale = property.onSale) {
  const comments = PROPERTY_COMMENTS[property.tier] || PROPERTY_COMMENTS.drainage || { lines: [] };
  const pool = comments.lines && comments.lines.length ? comments.lines : ["Kido: No comment filed for this property. Check the preview."];
  const baseLine = pool[Math.abs(hashString(property.id || property.name || property.code)) % pool.length];
  return onSale ? baseLine + (comments.saleSuffix || "") : baseLine;
}

function hashString(value) {
  return String(value).split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function generateProperty(tier = "drainage", initial = false) {
  const profile = AREA_PROFILES[tier];
  const cols = initial ? 5 : randomInt(profile.cols[0], profile.cols[1]);
  const rows = initial ? 2 : randomInt(profile.rows[0], profile.rows[1]);
  const basePrice = initial ? 0 : Math.round(randomBetween(profile.prices[0], profile.prices[1]) / 50) * 50;
  const onSale = !initial && Math.random() < 0.38;
  const discountRate = onSale ? randomBetween(0.15, 0.55) : 0;
  const blockedCells = generateBlockedCells(cols, rows, discountRate, initial);
  const price = initial ? 0 : Math.max(50, Math.round(basePrice * (1 - discountRate) / 50) * 50);
  const traits = [...profile.traits].sort(() => Math.random() - 0.5).slice(0, 2);
  if (onSale) traits.unshift(`SALE -${Math.round(discountRate * 100)}%`);
  const tags = initial ? ["humid"] : pickTagIds(BASE_TAGS, Math.random() < 0.28 ? 2 : 1);
  const tagEffects = combinedEffects(tags, BASE_TAGS);
  const property = {
    id: makeId("property"),
    tier,
    name: `${pick(profile.areaNames)}の${pick(profile.facilityNames)}`,
    code: `${tier.toUpperCase()}-${randomInt(11, 99)}`,
    cols,
    rows,
    price,
    basePrice,
    onSale,
    discountRate,
    blockedCells,
    upkeep: initial ? 0 : randomInt(profile.upkeep[0], profile.upkeep[1]),
    image: profile.image,
    allowedUnits: [...profile.allowedUnits],
    traits,
    tags,
    environment: {
      temp: DEFAULT_ENVIRONMENT.temp + (tagEffects.temp || 0),
      humidity: DEFAULT_ENVIRONMENT.humidity + (tagEffects.humidity || 0),
      co2: DEFAULT_ENVIRONMENT.co2 + (tagEffects.co2 || 0)
    },
    description: ""
  };
  property.description = propertyFlavorDescription(property, onSale);
  return property;
}

function generatePropertyListings(count = PROPERTY_LISTING_COUNT) {
  const tiers = ["drainage", "drainage", "tunnel", "freight", "station"];
  return Array.from({ length: count }, (_, index) => generateProperty(tiers[Math.min(index, tiers.length - 1)]));
}

function ensureMarketNewsState() {
  state.marketEventQueue = Array.isArray(state.marketEventQueue) ? state.marketEventQueue : [];
  state.monthlySchedule = ensureMonthlyScheduleBasics(Array.isArray(state.monthlySchedule) && state.monthlySchedule.length ? state.monthlySchedule : generateMonthlySchedule());
  state.newsHistory = Array.isArray(state.newsHistory) ? state.newsHistory : [];
  if (!Number.isFinite(Number(state.nextMarketForecastDay))) {
    state.nextMarketForecastDay = Math.max(3, (Number(state.day) || 1) + 2);
  }
}

function marketEventById(eventId) {
  return EVENTS.find((entry) => entry.id === eventId);
}

function marketEventText(template, event, schedule) {
  const leadDays = Math.max(0, schedule.activeDay - schedule.announcedDay);
  const duration = Math.max(1, schedule.endDay - schedule.activeDay);
  return String(template || event.activeText || event.forecastText || "")
    .replaceAll("{leadDays}", leadDays)
    .replaceAll("{activeDay}", schedule.activeDay)
    .replaceAll("{duration}", duration);
}

function addNewsHistory(entry) {
  ensureMarketNewsState();
  const day = Number(entry.day) || Number(state.day) || 1;
  const key = entry.key || [entry.kind || "news", entry.eventId || "", day, entry.activeDay || ""].join(":");
  if (state.newsHistory.some((item) => item.key === key)) return;
  state.newsHistory.unshift({
    key,
    kind: entry.kind || "news",
    eventId: entry.eventId || "",
    label: entry.label || "LOWNET",
    text: entry.text || "",
    day,
    activeDay: Number(entry.activeDay) || null,
    endDay: Number(entry.endDay) || null
  });
  state.newsHistory = state.newsHistory.slice(0, 40);
}

function scheduleMarketForecast() {
  if (state?.debugMode || !EVENTS.length) return null;
  const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  const leadDays = Math.max(2, event.leadDays || 5);
  const duration = Math.max(1, event.duration || 2);
  const schedule = {
    id: makeId("market-event"),
    eventId: event.id,
    announcedDay: Number(state.day) || 1,
    activeDay: (Number(state.day) || 1) + leadDays,
    endDay: (Number(state.day) || 1) + leadDays + duration
  };
  state.marketEventQueue.push(schedule);
  state.nextMarketForecastDay = schedule.endDay + Math.floor(randomBetween(2, 5));
  return schedule;
}

function activeMarketSchedule() {
  return state.marketEventQueue.find((schedule) =>
    marketEventById(schedule.eventId)
    && state.day >= schedule.activeDay
    && state.day < schedule.endDay
  );
}

function seedMarketBasePrice(cropId) {
  const price = Number(CROPS[cropId]?.seedPrice);
  return Math.max(1, Math.round(Number.isFinite(price) ? price : 1));
}

function seedMarketPriceBounds(cropId) {
  const basePrice = seedMarketBasePrice(cropId);
  return {
    min: Math.max(1, Math.round(basePrice * SEED_MARKET_MIN_MULTIPLIER)),
    max: Math.max(1, Math.round(basePrice * SEED_MARKET_MAX_MULTIPLIER))
  };
}

function createDefaultSeedMarketState(lastUpdatedDay = 0) {
  const prices = Object.fromEntries(Object.keys(CROPS).map((cropId) => [cropId, seedMarketBasePrice(cropId)]));
  return {
    lastUpdatedDay: Math.max(0, Math.floor(Number(lastUpdatedDay) || 0)),
    prices,
    previousPrices: { ...prices }
  };
}

function ensureSeedMarketState() {
  const fallbackDay = Math.max(0, Math.floor(Number(state.day) || 1) - 1);
  const market = state.seedMarket && typeof state.seedMarket === "object"
    ? state.seedMarket
    : createDefaultSeedMarketState(fallbackDay);
  market.prices = market.prices && typeof market.prices === "object" ? market.prices : {};
  market.previousPrices = market.previousPrices && typeof market.previousPrices === "object"
    ? market.previousPrices
    : {};
  const savedDay = Number(market.lastUpdatedDay);
  market.lastUpdatedDay = Number.isFinite(savedDay) ? Math.max(0, Math.floor(savedDay)) : fallbackDay;
  Object.keys(CROPS).forEach((cropId) => {
    const bounds = seedMarketPriceBounds(cropId);
    const price = Number(market.prices[cropId]);
    const normalizedPrice = Number.isFinite(price)
      ? clamp(Math.round(price), bounds.min, bounds.max)
      : seedMarketBasePrice(cropId);
    const previous = Number(market.previousPrices[cropId]);
    market.prices[cropId] = normalizedPrice;
    market.previousPrices[cropId] = Number.isFinite(previous)
      ? clamp(Math.round(previous), bounds.min, bounds.max)
      : normalizedPrice;
  });
  state.seedMarket = market;
  return market;
}

function updateSeedMarketForDay(day = state.day) {
  const market = ensureSeedMarketState();
  const targetDay = Math.max(1, Math.floor(Number(day) || 1));
  while (market.lastUpdatedDay < targetDay) {
    Object.keys(CROPS).forEach((cropId) => {
      const basePrice = seedMarketBasePrice(cropId);
      const bounds = seedMarketPriceBounds(cropId);
      const currentPrice = clamp(Math.round(Number(market.prices[cropId]) || basePrice), bounds.min, bounds.max);
      const currentMultiplier = currentPrice / basePrice;
      const reversion = (1 - currentMultiplier) * SEED_MARKET_MEAN_REVERSION;
      const shock = randomBetween(-SEED_MARKET_DAILY_SHOCK, SEED_MARKET_DAILY_SHOCK);
      const nextMultiplier = clamp(
        currentMultiplier + reversion + shock,
        SEED_MARKET_MIN_MULTIPLIER,
        SEED_MARKET_MAX_MULTIPLIER
      );
      market.previousPrices[cropId] = currentPrice;
      market.prices[cropId] = clamp(Math.round(basePrice * nextMultiplier), bounds.min, bounds.max);
    });
    market.lastUpdatedDay += 1;
  }
  return market;
}

function currentSeedPrice(cropId) {
  const market = ensureSeedMarketState();
  return Math.max(1, Math.round(Number(market.prices[cropId]) || seedMarketBasePrice(cropId)));
}

function seedPriceTrend(cropId) {
  const market = ensureSeedMarketState();
  const current = currentSeedPrice(cropId);
  const previous = Math.max(1, Math.round(Number(market.previousPrices[cropId]) || current));
  const delta = current - previous;
  const percent = Math.round(Math.abs(delta) / previous * 100);
  return {
    current,
    previous,
    delta,
    percent,
    direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat",
    label: delta > 0 ? "▲ " + percent + "%" : delta < 0 ? "▼ " + percent + "%" : "± 0%"
  };
}

function updateMarketForDay(options = {}) {
  ensureMarketNewsState();
  updateSeedMarketForDay(state.day);
  Object.keys(CROPS).forEach((cropId) => {
    state.marketFluctuation[cropId] = randomBetween(0.94, 1.06);
  });
  ensureMarketSignalsState();
  if (options.drift) driftMarketSignalsForDay();
  if (state.debugMode) {
    state.marketEventQueue = [];
    state.marketEventOffsets = [];
    state.event = null;
    state.news = "DEBUG MODE // EVENTS DISABLED";
    state.newsLabel = "EVENTS OFF";
    if (!isMarketAvailable(selectedMarket)) selectedMarket = "lower";
    return;
  }
  updateMarketEventOffsets();

  state.marketEventQueue = state.marketEventQueue.filter((schedule) =>
    marketEventById(schedule.eventId) && state.day < schedule.endDay + 2
  );

  const activeSchedule = activeMarketSchedule();
  if (activeSchedule) {
    const activeEvent = marketEventById(activeSchedule.eventId);
    state.event = activeEvent;
    state.news = marketEventText(activeEvent.activeText, activeEvent, activeSchedule);
    state.newsLabel = `${activeEvent.label || "ACTIVE"} ${Math.max(1, activeSchedule.endDay - state.day)}D`;
    addNewsHistory({
      kind: "active",
      eventId: activeEvent.id,
      label: activeEvent.label || "MARKET EVENT",
      text: state.news,
      day: state.day,
      activeDay: activeSchedule.activeDay,
      endDay: activeSchedule.endDay
    });
  } else {
    state.event = null;
    const hasFutureEvent = state.marketEventQueue.some((schedule) =>
      marketEventById(schedule.eventId) && state.day < schedule.activeDay
    );
    const forecastSchedule = !hasFutureEvent && state.day >= state.nextMarketForecastDay
      ? scheduleMarketForecast()
      : null;
    if (forecastSchedule) {
      const forecastEvent = marketEventById(forecastSchedule.eventId);
      state.news = marketEventText(forecastEvent.forecastText, forecastEvent, forecastSchedule);
      state.newsLabel = `${forecastEvent.label || "FORECAST"} IN ${forecastSchedule.activeDay - state.day}D`;
      addNewsHistory({
        kind: "forecast",
        eventId: forecastEvent.id,
        label: forecastEvent.label || "FORECAST",
        text: state.news,
        day: state.day,
        activeDay: forecastSchedule.activeDay,
        endDay: forecastSchedule.endDay
      });
    } else {
      state.news = QUIET_NEWS[Math.floor(Math.random() * QUIET_NEWS.length)];
      state.newsLabel = "MARKET STABLE";
      addNewsHistory({
        kind: "quiet",
        label: state.newsLabel,
        text: state.news,
        day: state.day
      });
    }
  }
  if (!isMarketAvailable(selectedMarket)) selectedMarket = "lower";
}

function isMarketAvailable(marketId) {
  return Boolean(MARKETS[marketId] && state.marketUnlocked[marketId]);
}

function canMarketAcceptCrop(cropId, marketId) {
  return Boolean(CROPS[cropId] && MARKETS[marketId]?.accepts?.includes(cropId));
}

function canSellCropToMarket(cropId, marketId) {
  return isMarketAvailable(marketId) && canMarketAcceptCrop(cropId, marketId);
}

function normalizedStatRecord(source = {}) {
  return Object.fromEntries(Object.entries(source || {}).map(([key, value]) => [key, Math.max(0, Number(value) || 0)]));
}

function emptyMarketStatRecord() {
  return Object.fromEntries(Object.keys(MARKETS).map((marketId) => [marketId, 0]));
}

function ensureTitleTrackingState() {
  const source = state.titleTracking && typeof state.titleTracking === "object" ? state.titleTracking : {};
  const started = Boolean(source.started);
  state.titleTracking = {
    started,
    startedAtRevenue: started ? Math.max(0, Number(source.startedAtRevenue) || 0) : null,
    byCropBaseline: normalizedStatRecord(source.byCropBaseline),
    byMarketBaseline: { ...emptyMarketStatRecord(), ...normalizedStatRecord(source.byMarketBaseline) },
    byMarketQtyBaseline: { ...emptyMarketStatRecord(), ...normalizedStatRecord(source.byMarketQtyBaseline) }
  };
  return state.titleTracking;
}

function allMarketsUnlocked() {
  const marketIds = Object.keys(MARKETS);
  return marketIds.length > 0 && marketIds.every((marketId) => Boolean(state.marketUnlocked?.[marketId]));
}

function startTitleTrackingIfReady() {
  const tracking = ensureTitleTrackingState();
  if (tracking.started || !allMarketsUnlocked()) return false;
  tracking.started = true;
  tracking.startedAtRevenue = Math.max(0, Number(state.tradeStats?.revenue) || 0);
  tracking.byCropBaseline = normalizedStatRecord(state.tradeStats?.byCrop);
  tracking.byMarketBaseline = { ...emptyMarketStatRecord(), ...normalizedStatRecord(state.tradeStats?.byMarket) };
  tracking.byMarketQtyBaseline = { ...emptyMarketStatRecord(), ...normalizedStatRecord(state.tradeStats?.byMarketQty) };
  return true;
}

function statRecordDelta(current = {}, baseline = {}) {
  const keys = new Set([...Object.keys(current || {}), ...Object.keys(baseline || {})]);
  return Object.fromEntries(Array.from(keys).map((key) => [
    key,
    Math.max(0, (Number(current?.[key]) || 0) - (Number(baseline?.[key]) || 0))
  ]).filter(([, value]) => value > 0));
}

function titleStatsSinceAllMarketsUnlocked() {
  const tracking = ensureTitleTrackingState();
  if (!tracking.started) {
    return { byCrop: {}, byMarket: {}, byMarketQty: {}, startedAtRevenue: null };
  }
  return {
    byCrop: statRecordDelta(state.tradeStats?.byCrop, tracking.byCropBaseline),
    byMarket: statRecordDelta(state.tradeStats?.byMarket, tracking.byMarketBaseline),
    byMarketQty: statRecordDelta(state.tradeStats?.byMarketQty, tracking.byMarketQtyBaseline),
    startedAtRevenue: tracking.startedAtRevenue
  };
}

function occupiedGridCellCount(base) {
  if (!base) return 0;
  const occupiedCells = new Set();
  const markOccupiedCells = (item, kind) => {
    if (!item?.placed || !Number.isFinite(Number(item.x)) || !Number.isFinite(Number(item.y))) return;
    const size = footprint({ ...item, kind });
    for (let offsetY = 0; offsetY < size.height; offsetY += 1) {
      for (let offsetX = 0; offsetX < size.width; offsetX += 1) {
        const x = Number(item.x) + offsetX;
        const y = Number(item.y) + offsetY;
        if (x < 0 || y < 0 || x >= base.cols || y >= base.rows) continue;
        occupiedCells.add(cellKey(x, y));
      }
    }
  };
  (base.shelves || []).forEach((item) => markOccupiedCells(item, "unit"));
  (base.floorDevices || []).forEach((item) => markOccupiedCells(item, "device"));
  return occupiedCells.size;
}

function initialBaseOccupiedCellCount() {
  const bases = ownedBases();
  const initialBase = bases.find((base) => base.code === "SAFE-ROOM-01") || bases[0];
  return occupiedGridCellCount(initialBase);
}

function progressionValue(key) {
  if (key === "shopUnlocked") return state.shopUnlocked;
  if (key === "marketTabUnlocked") return state.marketTabUnlocked;
  if (key === "automationTabUnlocked") return state.automationTabUnlocked;
  if (key === "allMarketsUnlocked") return allMarketsUnlocked();
  if (key === "brokerUnlocked") return state.brokerUnlocked;
  if (key === "timeUnlocked") return state.timeUnlocked;
  if (key === "revenue") return state.tradeStats?.revenue || 0;
  if (key === "unitsSold") return state.tradeStats?.unitsSold || 0;
  if (key === "money") return state.money || 0;
  if (key === "baseCount") return ownedBases().length;
  if (key === "initialBaseOccupied") return initialBaseOccupiedCellCount();
  if (key === "radarUnlocked") return ensureRadarState().unlocked;
  if (key === "suspicion") return ensureRadarState().suspicion;
  if (key === "radarPatrols") return ensureRadarState().patrolCount;
  if (key.startsWith("marketUnlocked:")) return Boolean(state.marketUnlocked?.[key.split(":")[1]]);
  if (key.startsWith("marketRevenue:")) return state.tradeStats?.byMarket?.[key.split(":")[1]] || 0;
  if (key.startsWith("cropSold:")) return state.tradeStats?.byCrop?.[key.split(":")[1]] || 0;
  if (key.startsWith("unit:")) return unitCount(key.split(":")[1]);
  if (key.startsWith("unitPlaced:")) return allShelves().filter((unit) => unit.type === key.split(":")[1] && unit.placed).length;
  if (key.startsWith("device:")) return allFloorDevices().filter((device) => device.type === key.split(":")[1]).length;
  if (key.startsWith("equipment:")) return Boolean(state.equipment?.[key.split(":")[1]]);
  return 0;
}

function compareRequirement(actual, operator, expectedRaw) {
  const expected = expectedRaw === "true" ? true : expectedRaw === "false" ? false : Number(expectedRaw);
  const value = Number.isFinite(expected) ? Number(actual) : actual;
  if (operator === "=") return value === expected;
  if (operator === ">=") return value >= expected;
  if (operator === "<=") return value <= expected;
  if (operator === ">") return value > expected;
  if (operator === "<") return value < expected;
  return false;
}

function requirementsMet(requirements = []) {
  return requirements.every((requirement) =>
    compareRequirement(progressionValue(requirement.key), requirement.operator, requirement.value)
  );
}

function applyUnlock(rule) {
  state.unlocks[rule.id] = true;
  if (rule.type === "market") state.marketUnlocked[rule.target] = true;
  if (rule.type === "broker") {
    state.brokerUnlocked = true;
    if (!state.propertyListings?.length) state.propertyListings = generatePropertyListings(PROPERTY_LISTING_COUNT);
  }
  if (rule.type === "tab" && rule.target === "shop") state.shopUnlocked = true;
  if (rule.type === "tab" && rule.target === "market") state.marketTabUnlocked = true;
  if (rule.type === "tab" && rule.target === "automation") state.automationTabUnlocked = true;
  if (rule.type === "radar") {
    ensureRadarState().unlocked = true;
    notifyRadarState();
  }
}

function unlockEventContext(rule) {
  return {
    unlockId: rule.id,
    unlockType: rule.type,
    unlockTarget: rule.target,
    target: rule.target,
    marketId: rule.type === "market" ? rule.target : "",
    itemId: ["shop_item", "seed_item"].includes(rule.type) ? rule.target : "",
    cropId: rule.type === "seed_item" ? rule.target : ""
  };
}

function unresolvedStoryUnlockEvents(rule, context) {
  if (rule.type !== "story" || !rule.event || state?.debugMode) return [];
  return STORY_EVENTS
    .filter((event) => event.trigger === rule.event)
    .filter((event) => requirementsMet(event.requirements || []))
    .filter((event) => commsContextMatches(event.context || [], context))
    .filter((event) => !state.storyChoices?.[event.id] && !hasQueuedStory(event));
}

function updateProgressionUnlocks({ silent = false } = {}) {
  state.unlocks ||= {};
  const eventsEnabled = !silent && !state.debugMode;
  const unlockedEvents = [];
  const queuedEvents = new Set();
  UNLOCK_RULES.forEach((rule) => {
    if (!rule.initiallyUnlocked && !requirementsMet(rule.requirements)) return;
    const alreadyUnlocked = Boolean(state.unlocks[rule.id]);
    const context = unlockEventContext(rule);
    const pendingStoryEvents = eventsEnabled ? unresolvedStoryUnlockEvents(rule, context) : [];
    if (!alreadyUnlocked) applyUnlock(rule);
    const shouldQueueEvent = eventsEnabled
      && rule.event
      && (rule.type === "story" ? pendingStoryEvents.length > 0 : !alreadyUnlocked);
    if (!shouldQueueEvent || queuedEvents.has(rule.event)) return;
    pendingStoryEvents.forEach((event) => {
      if (state.storySeen) delete state.storySeen[event.id];
    });
    queuedEvents.add(rule.event);
    unlockedEvents.push({ event: rule.event, context });
  });
  startTitleTrackingIfReady();
  if (eventsEnabled) {
    unlockedEvents.forEach(({ event, context }) => triggerComms(event, context));
    if (unlockedEvents.length) playSound("unlock_notice", 0.18);
  }
}

function unlockRulesFor(type, target) {
  return UNLOCK_RULES.filter((rule) => rule.type === type && rule.target === target);
}

function isUnlocked(type, target) {
  const rules = unlockRulesFor(type, target);
  if (!rules.length) return true;
  return rules.some((rule) => state.unlocks?.[rule.id]);
}

function unlockHint(type, target, fallback = "Locked") {
  const rule = unlockRulesFor(type, target).find((entry) => !state.unlocks?.[entry.id]);
  return rule?.hint || fallback;
}

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Save read failed: ${key}`, error);
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Save write failed: ${key}`, error);
    return false;
  }
}

function normalizeAppSettings(value = {}) {
  return {
    lowSpecMode: Boolean(value.lowSpecMode),
    masterVolume: Math.max(0, Math.min(1, Number(value.masterVolume ?? 1) || 0))
  };
}

function loadAppSettings() {
  try {
    appSettings = normalizeAppSettings(JSON.parse(safeStorageGet(SETTINGS_PREF_KEY) || "{}"));
  } catch (error) {
    console.warn("Settings read failed", error);
    appSettings = normalizeAppSettings();
  }
}

function saveAppSettings() {
  safeStorageSet(SETTINGS_PREF_KEY, JSON.stringify(appSettings));
}

function isLowSpecMode() {
  return Boolean(appSettings.lowSpecMode);
}

function masterVolume() {
  return Math.max(0, Math.min(1, Number(appSettings.masterVolume) || 0));
}

function runtimeRenderIntervalMs() {
  return isLowSpecMode() ? 650 : 350;
}

function realtimeTickIntervalMs() {
  return isLowSpecMode() ? 350 : 200;
}

function restartRealtimeLoop() {
  if (realtimeLoopId !== null) window.clearInterval(realtimeLoopId);
  realtimeLoopId = window.setInterval(realtimeTick, realtimeTickIntervalMs());
}

function applyRuntimeSettings(options = {}) {
  document.documentElement.classList.toggle("low-spec-mode", isLowSpecMode());
  const lowSpecInput = document.getElementById("settings-low-spec");
  const lowSpecState = document.getElementById("settings-low-spec-state");
  const volumeInput = document.getElementById("settings-volume");
  const volumeValue = document.getElementById("settings-volume-value");
  if (lowSpecInput) lowSpecInput.checked = isLowSpecMode();
  if (lowSpecState) lowSpecState.textContent = isLowSpecMode() ? "ON" : "OFF";
  if (volumeInput) volumeInput.value = String(Math.round(masterVolume() * 100));
  if (volumeValue) volumeValue.textContent = `${Math.round(masterVolume() * 100)}%`;
  if (state) syncLoopAudio();
  if (options.restartLoop !== false && realtimeLoopId !== null) restartRealtimeLoop();
}

function settingsCreditsMarkup() {
  const groups = new Map();
  CREDITS.forEach((entry) => {
    const key = entry.section || "credits";
    if (!groups.has(key)) groups.set(key, { label: entry.sectionLabel || key, entries: [] });
    groups.get(key).entries.push(entry);
  });
  if (!groups.size) return `<p class="settings-empty">CREDITS NOT REGISTERED</p>`;
  return [...groups.values()].map((group) => `
    <section class="settings-credit-section">
      <h3>${escapeHtml(group.label)}</h3>
      ${group.entries.map((entry) => {
        const safeUrl = /^https?:\/\//i.test(entry.url || "") ? entry.url : "";
        const name = safeUrl
          ? `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(entry.name)}</a>`
          : `<strong>${escapeHtml(entry.name)}</strong>`;
        return `<article class="settings-credit-row"><span>${escapeHtml(entry.role || "")}</span>${name}${entry.note ? `<small>${toList(entry.note).map((line) => escapeHtml(line)).join("<br>")}</small>` : ""}</article>`;
      }).join("")}
    </section>
  `).join("");
}

function renderSettingsPanel(activeTab = null) {
  const overlay = document.getElementById("settings-overlay");
  if (!overlay) return;
  const selected = activeTab || overlay.dataset.activeTab || "system";
  overlay.dataset.activeTab = selected;
  overlay.querySelectorAll("[data-settings-tab]").forEach((button) => {
    const active = button.dataset.settingsTab === selected;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  overlay.querySelectorAll("[data-settings-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.settingsPanel === selected);
  });
  const credits = document.getElementById("settings-credits-list");
  if (credits) credits.innerHTML = settingsCreditsMarkup();
  applyRuntimeSettings({ restartLoop: false });
}

function openSettingsPanel(tab = "system") {
  const overlay = document.getElementById("settings-overlay");
  if (!overlay || settingsPanelOpen || isCommsBlocking() || isRobotGachaBlocking() || isTimedModeCountdownBlocking()) return;
  settingsPanelOpen = true;
  pausedBeforeSettings = Boolean(state?.paused);
  if (state) state.paused = true;
  clearDragState();
  clearEquipmentMenu();
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  renderSettingsPanel(tab);
  renderTimeControl();
  overlay.querySelector("[data-settings-close]")?.focus({ preventScroll: true });
}

function closeSettingsPanel() {
  const overlay = document.getElementById("settings-overlay");
  if (!overlay || !settingsPanelOpen) return;
  settingsPanelOpen = false;
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  if (state) state.paused = startScreenOpen ? true : pausedBeforeSettings;
  lastTickAt = Date.now();
  renderTimeControl();
}

function setLowSpecMode(enabled) {
  appSettings.lowSpecMode = Boolean(enabled);
  saveAppSettings();
  applyRuntimeSettings();
  if (state) {
    requestFarmRender();
    renderActiveScreen();
  }
}

function setMasterVolume(value) {
  appSettings.masterVolume = Math.max(0, Math.min(1, Number(value) / 100));
  saveAppSettings();
  applyRuntimeSettings({ restartLoop: false });
}

window.UndergreenRuntimeSettings = Object.freeze({
  getMasterVolume: masterVolume,
  isLowSpecMode
});
function isUsableSave(value) {
  return Boolean(
    value
    && typeof value === "object"
    && Number.isFinite(Number(value.day))
    && (Array.isArray(value.bases) || Array.isArray(value.shelves))
  );
}

function parseSavedState(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isUsableSave(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

function readSavedGame() {
  const keys = [SAVE_KEY, SAVE_BACKUP_KEY, ...LEGACY_SAVE_KEYS];
  for (const key of keys) {
    const parsed = parseSavedState(safeStorageGet(key));
    if (parsed) return { state: parsed, sourceKey: key };
  }
  return { state: null, sourceKey: null };
}

function saveGame() {
  if (!isUsableSave(state)) return false;
  let serialized;
  try {
    serialized = JSON.stringify(state);
  } catch (error) {
    console.warn("Save serialization failed", error);
    return false;
  }
  const previous = safeStorageGet(SAVE_KEY);
  if (parseSavedState(previous)) safeStorageSet(SAVE_BACKUP_KEY, previous);
  const saved = safeStorageSet(SAVE_KEY, serialized);
  if (saved) safeStorageSet(SAVE_BACKUP_KEY, serialized);
  return saved;
}

function playModeConfig(mode = "day45") {
  return PLAY_MODES[mode] || PLAY_MODES.day45;
}

function playModeLimit(mode = state?.mode) {
  const config = PLAY_MODES[mode];
  if (!config || config.limit === null || config.limit === undefined || config.limit === "") return Number.POSITIVE_INFINITY;
  const limit = Number(config.limit);
  return Number.isFinite(limit) && limit > 0 ? limit : Number.POSITIVE_INFINITY;
}

function isTimedPlayMode(mode = state?.mode) {
  const config = PLAY_MODES[mode];
  if (!config || config.limit === null || config.limit === undefined || config.limit === "") return false;
  const limit = Number(config.limit);
  return Number.isFinite(limit) && limit > 0;
}

function timedModeWarningDaysRemaining(mode = state?.mode, day = state?.day) {
  if (!isTimedPlayMode(mode)) return null;
  const remaining = playModeLimit(mode) - Math.max(1, Math.floor(Number(day) || 1));
  return TIMED_MODE_WARNING_DAYS.includes(remaining) ? remaining : null;
}

function isTimedModeCountdownBlocking() {
  return timedModeCountdownState.active;
}

function closeTimedModeCountdown() {
  if (timedModeCountdownState.timer) {
    window.clearTimeout(timedModeCountdownState.timer);
    timedModeCountdownState.timer = null;
  }
  const overlay = document.getElementById("timed-mode-countdown");
  if (overlay) {
    overlay.classList.remove("is-active", "critical");
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
  }
  timedModeCountdownState.active = false;
  lastTickAt = Date.now();
  if (state) {
    renderHeader();
    renderTimeControl();
  }
}

function showTimedModeCountdown(daysRemaining) {
  const overlay = document.getElementById("timed-mode-countdown");
  if (!overlay || !TIMED_MODE_WARNING_DAYS.includes(daysRemaining)) return false;
  if (timedModeCountdownState.timer) window.clearTimeout(timedModeCountdownState.timer);

  const critical = daysRemaining <= 5;
  document.getElementById("timed-mode-countdown-kicker").textContent = critical ? "FINAL PHASE" : "OPERATION DEADLINE";
  document.getElementById("timed-mode-countdown-days").textContent = String(daysRemaining);
  document.getElementById("timed-mode-countdown-title").textContent = "最終評価まであと" + daysRemaining + "日";
  document.getElementById("timed-mode-countdown-copy").textContent = critical
    ? "残された作業と在庫の処理を確認してください。"
    : "生産計画と販売先を見直してください。";

  timedModeCountdownState.active = true;
  lastTickAt = Date.now();
  overlay.classList.remove("hidden");
  overlay.classList.toggle("critical", critical);
  overlay.setAttribute("aria-hidden", "false");
  void overlay.offsetWidth;
  overlay.classList.add("is-active");
  renderHeader();
  renderTimeControl();
  playSoundFirst(["alert", "unlock_notice"], critical ? 0.3 : 0.22);
  hapticFeedback(critical ? [50, 45, 80] : [35, 35, 35]);

  const reducedMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  timedModeCountdownState.timer = window.setTimeout(closeTimedModeCountdown, reducedMotion ? 1400 : 3200);
  return true;
}

function maybeShowTimedModeCountdown() {
  if (!state || state.ended) return false;
  const daysRemaining = timedModeWarningDaysRemaining(state.mode, state.day);
  if (!daysRemaining) return false;
  state.timedModeWarningsSeen ||= {};
  if (state.timedModeWarningsSeen[String(daysRemaining)]) return false;
  if (!showTimedModeCountdown(daysRemaining)) return false;
  state.timedModeWarningsSeen[String(daysRemaining)] = true;
  return true;
}
function playModeLabel(mode = state?.mode) {
  return PLAY_MODES[mode]?.label || "通常モード";
}

function playModeShortLabel(mode = state?.mode) {
  return PLAY_MODES[mode]?.shortLabel || "NORMAL";
}

function validPlayMode(mode, fallback = "day45") {
  return PLAY_MODES[mode] ? mode : fallback;
}

function recordStorageKey(mode = "day45") {
  return playModeConfig(mode).storageKey;
}

function readPlayRecords(mode = "day45") {
  try {
    const raw = safeStorageGet(recordStorageKey(mode));
    const records = raw ? JSON.parse(raw) : [];
    return Array.isArray(records) ? records : [];
  } catch (error) {
    return [];
  }
}

function savePlayRecords(mode = "day45", records = []) {
  safeStorageSet(recordStorageKey(mode), JSON.stringify(records.slice(0, 50)));
}

function readDay30Records() {
  return readPlayRecords("day45");
}

function readDay60Records() {
  return readPlayRecords("day60");
}

function readFreeRecords() {
  return readPlayRecords("free");
}

function saveDay30Records(records) {
  savePlayRecords("day45", records);
}

function saveDay60Records(records) {
  savePlayRecords("day60", records);
}

function saveFreeRecords(records) {
  savePlayRecords("free", records);
}

function repairPlayableState() {
  let repaired = false;
  let starterKitRestored = false;
  state.seeds ||= {};
  Object.keys(CROPS).forEach((cropId) => {
    if (!Number.isFinite(Number(state.seeds[cropId]))) {
      state.seeds[cropId] = 0;
      repaired = true;
    }
  });
  state.inventory ||= [];
  state.inventory = state.inventory
    .map((item) => normalizeInventoryBatch(item))
    .filter((item) => item.qty > 0);
  state.equipment ||= { fridge: false };
  state.resourceRemainders ||= { water: 0, nutrient: 0 };
  state.water = Number.isFinite(Number(state.water)) ? Number(state.water) : 20;
  state.waterCapacity = Math.max(20, Number.isFinite(Number(state.waterCapacity)) ? Number(state.waterCapacity) : 20);
  state.nutrient = Number.isFinite(Number(state.nutrient)) ? Number(state.nutrient) : 20;
  state.nutrientCapacity = Math.max(20, Number.isFinite(Number(state.nutrientCapacity)) ? Number(state.nutrientCapacity) : 20);
  if (repairResourceCartridges()) repaired = true;
  const bases = ownedBases();
  syncResourceCapacities();
  if (repairEquipmentOwnership()) repaired = true;
  const anyEquipment = bases.some((base) => base.shelves.length || base.floorDevices.length);
  const earlyNoProgress = (state.day || 1) <= 2
    && !state.inventory.length
    && !state.tradeStats?.unitsSold
    && !state.tradeStats?.revenue;
  if (!anyEquipment && earlyNoProgress) {
    currentBase().shelves.push(createStarterPod());
    repaired = true;
    starterKitRestored = true;
  }
  const seedTotal = Object.values(state.seeds).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
  if (seedTotal <= 0 && earlyNoProgress) {
    state.seeds.lettuce = Math.max(6, Number(state.seeds.lettuce) || 0);
    repaired = true;
    starterKitRestored = true;
  }
  if (repaired) {
    if (starterKitRestored) state.log = "Starter kit restored. Place the grow pod and plant lettuce to begin.";
    saveGame();
  }
}

function prepareLaborTutorialQaState() {
  state.debugMode = false;
  state.ended = false;
  state.resultShown = false;
  state.paused = false;
  state.automationTabUnlocked = true;
  state.supportOS = { harvest: false, planting: false, cleaning: false, storage: false };
  state.openedTabs = { farm: true };
  grantFloorDevice("support_robot", { supportBlueprintPreset: "empty" });
  state.log = "LABOR TUTORIAL QA // 通常セーブから分離された接続訓練です。";
}

function loadGame() {
  const loaded = LABOR_TUTORIAL_QA_MODE
    ? { state: createInitialState("day45"), sourceKey: null }
    : readSavedGame();
  state = loaded.state || createInitialState();
  if (LABOR_TUTORIAL_QA_MODE) prepareLaborTutorialQaState();
  state.commsSeen ||= {};
  state.commsChoices ||= {};
  state.commsOpen ||= [];
  state.storySeen ||= {};
  state.storyChoices ||= {};
  state.storyOpen ||= [];
  state.timedModeWarningsSeen = {
    "10": Boolean(state.timedModeWarningsSeen?.["10"]),
    "5": Boolean(state.timedModeWarningsSeen?.["5"])
  };
  state.unlocks ||= {};
  state.mode = validPlayMode(state.mode || "day45", "day45");
  state.debugMode = Boolean(state.debugMode);
  ensureLaborTutorialState();
  state.day30Recorded = Boolean(state.day30Recorded);
  state.day30RecordId ||= null;
  state.supportRobotGranted = Boolean(state.supportRobotGranted);
  ensureSupportRobotTalkState();
  state.tradeStats ||= { unitsSold: 0, revenue: 0, byMarket: { lower: 0, medical: 0, upper: 0, rebel: 0 }, byMarketQty: { lower: 0, medical: 0, upper: 0, rebel: 0 }, byCrop: {}, eventRevenue: 0, foodToRebels: 0, weaponsToRebels: 0 };
  state.tradeStats.byMarket ||= { lower: 0, medical: 0, upper: 0, rebel: 0 };
  state.tradeStats.byMarketQty ||= { lower: 0, medical: 0, upper: 0, rebel: 0 };
  ["lower", "medical", "upper", "rebel"].forEach((marketId) => {
    state.tradeStats.byMarket[marketId] ||= 0;
    state.tradeStats.byMarketQty[marketId] ||= 0;
  });
  state.tradeStats.byCrop ||= {};
  state.tradeStats.eventRevenue ||= 0;
  state.tradeStats.foodToRebels ||= 0;
  state.tradeStats.weaponsToRebels ||= 0;
  state.marketUnlocked = { lower: true, medical: false, upper: false, rebel: false, ...(state.marketUnlocked || {}) };
  state.automationTabUnlocked = Boolean(state.automationTabUnlocked);
  ensureTitleTrackingState();
  const pendingResult = state.pendingDay30Result;
  state.pendingDay30Result = pendingResult && typeof pendingResult === "object" ? {
    completed: Boolean(pendingResult.completed),
    playedDays: Math.max(1, Number(pendingResult.playedDays) || Number(state.day) || 1),
    mode: validPlayMode(pendingResult.mode || state.mode || "day45"),
    interviewComplete: Boolean(pendingResult.interviewComplete)
  } : null;
  if (state.pendingDay30Result) state.paused = true;
  ensureAnalytics();
  state.marketFluctuation ||= {};
  if (!state.seedMarket || typeof state.seedMarket !== "object") {
    state.seedMarket = createDefaultSeedMarketState(Math.max(0, Math.floor(Number(state.day) || 1) - 1));
  }
  ensureSeedMarketState();
  updateSeedMarketForDay(state.day);
  state.marketSignals ||= {};
  state.marketEventOffsets = Array.isArray(state.marketEventOffsets) ? state.marketEventOffsets : [];
  ensureMarketSignalsState();
  ensureMarketEventOffsetsState();
  state.audio ||= {};
  state.audio.noiseCanceling = Boolean(state.audio.noiseCanceling);
  ensureSupportAutomationState();
  if (!RADIO_PROGRAMS[state.audio.radioProgram]) state.audio.radioProgram = "off";
  state.marketEventQueue = Array.isArray(state.marketEventQueue) ? state.marketEventQueue : [];
  state.monthlySchedule = ensureMonthlyScheduleBasics(Array.isArray(state.monthlySchedule) && state.monthlySchedule.length ? state.monthlySchedule : generateMonthlySchedule());
  state.newsHistory = Array.isArray(state.newsHistory) ? state.newsHistory : [];
  if (!Number.isFinite(Number(state.nextMarketForecastDay))) {
    state.nextMarketForecastDay = Math.max(3, (Number(state.day) || 1) + 2);
  }
  ensureOpenedTabs();
  ensureViewedSubsections();
  ensureUiGuideState();
  ownedBases();
  supportRobotRoster();
  ensureSupportPersonalityTriggerState();
  ensureProcurementTags();
  state.marketTabUnlocked = Boolean(state.marketTabUnlocked || state.tradeStats?.unitsSold > 0);
  state.automationTabUnlocked = Boolean(state.automationTabUnlocked || state.unlocks.automation_os_access);
  ensureRadarState();
  if (state.debugMode) {
    state.radar.unlockConversationPending = false;
    state.radar.demoPending = false;
    state.radar.demoConsumed = true;
    state.radar.tutorialActive = false;
    state.radar.tutorialResolved = true;
  }
  if (!state.unlocks.radar_access && (Number(state.tradeStats?.revenue) || 0) >= 250 && !state.storySeen.story_radar_unlocked) {
    state.radar.unlockConversationPending = true;
  }
  state.shopUnlocked = Boolean(state.shopUnlocked);
  state.brokerUnlocked = Boolean(state.brokerUnlocked);
  if (state.timeUnlocked === undefined) {
    state.timeUnlocked = Boolean(state.shopUnlocked || state.day > 1 || state.tradeStats?.unitsSold > 0);
  }
  updateProgressionUnlocks({ silent: true });
  repairPlayableState();
  ensureSupportRobotGrant();
  restoreStoryState();
  restoreCommsState();
  if (isLaborTutorialActive()) suspendNonTutorialEventsForLaborTutorial();
  if (!isMarketAvailable(selectedMarket)) selectedMarket = "lower";
  const hasLegacyImmediateEvent = state.event && !state.marketEventQueue.length;
  if (state.debugMode) updateMarketForDay();
  if (!state.news || !Object.keys(state.marketSignals).length || hasLegacyImmediateEvent) updateMarketForDay();
  applyScheduleMarketSignals();
  if (loaded.sourceKey && loaded.sourceKey !== SAVE_KEY) saveGame();
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeBase(base) {
  base.shelves ||= [];
  base.floorDevices ||= [];
  if (base.tier === "safe_room") base.image = SAFE_ROOM_IMAGE;
  base.allowedUnits = (base.allowedUnits || []).filter((unitId) => GROW_UNITS[unitId]);
  base.shelves = base.shelves.filter((unit) => GROW_UNITS[unit.type]);
  base.floorDevices = base.floorDevices.filter((device) => FLOOR_DEVICES[device.type]);
  base.ownedAt ||= Date.now();
  base.tags ||= pickTagIds(BASE_TAGS, 1);
  base.environment ||= { ...DEFAULT_ENVIRONMENT };
  base.cleanCells ||= [];
  base.description = propertyFlavorDescription(base);
  [...base.shelves, ...base.floorDevices].forEach((item) => {
    item.tags ||= [];
    item.dirt ||= 0;
  });
  base.floorDevices.forEach((device) => {
    const definition = FLOOR_DEVICES[device.type];
    if (["water", "nutrient"].includes(definition?.productionResource)) {
      const stored = Number(device.resourceStored);
      device.resourceStored = Number.isFinite(stored) ? Math.max(0, stored) : 0;
    }
    ensureSupportRobotProfile(device);
  });
  return base;
}

function ownedBases() {
  state.bases ||= [];
  if (!state.bases.length) {
    const fallback = state.property || createInitialSafeRoom();
    state.bases.push(normalizeBase({
      ...fallback,
      shelves: state.shelves || [],
      floorDevices: state.floorDevices || []
    }));
    state.activeBaseId = fallback.id;
  }
  state.bases.forEach(normalizeBase);
  if (!state.activeBaseId || !state.bases.some((base) => base.id === state.activeBaseId)) {
    state.activeBaseId = state.bases[0].id;
  }
  selectedBaseId = state.activeBaseId;
  return state.bases;
}

function supportRobotRoster() {
  const records = [];
  ownedBases().forEach((base) => {
    base.floorDevices.forEach((robot) => {
      if (robot.type !== "support_robot") return;
      ensureSupportRobotProfile(robot);
      records.push({ base, robot });
    });
  });
  const initialRecord = records.find((record) => record.robot.isInitialSupportRobot) || records[0] || null;
  records.forEach((record, index) => {
    record.robot.isInitialSupportRobot = record === initialRecord;
    if (record.robot.isInitialSupportRobot) record.robot.robotName = "サポートロボット";
    else if (!record.robot.robotName) record.robot.robotName = `SR-${String(index + 1).padStart(2, "0")}`;
  });
  return records;
}

function createDefaultSupportRobotTalkState() {
  return {
    pending: [],
    completed: {},
    activeConditions: {},
    resourceCycles: {},
    flagCounts: {}
  };
}

function ensureSupportRobotTalkState() {
  const source = state.supportRobotTalk && typeof state.supportRobotTalk === "object"
    ? state.supportRobotTalk
    : createDefaultSupportRobotTalkState();
  const seenKeys = new Set();
  source.pending = (Array.isArray(source.pending) ? source.pending : [])
    .map((entry) => ({
      key: String(entry?.key || "").trim(),
      ruleId: String(entry?.ruleId || "").trim(),
      storyTrigger: String(entry?.storyTrigger || "").trim(),
      robotId: String(entry?.robotId || "").trim(),
      baseId: String(entry?.baseId || "").trim(),
      queuedDay: Math.max(1, Number(entry?.queuedDay) || Number(state.day) || 1),
      priority: Number(entry?.priority) || 0,
      markerLabel: String(entry?.markerLabel || "会話があります"),
      context: entry?.context && typeof entry.context === "object" ? entry.context : {}
    }))
    .filter((entry) => {
      if (!entry.key || !entry.ruleId || !entry.storyTrigger || !entry.robotId || seenKeys.has(entry.key)) return false;
      seenKeys.add(entry.key);
      return true;
    });
  source.completed = source.completed && typeof source.completed === "object" ? source.completed : {};
  source.activeConditions = source.activeConditions && typeof source.activeConditions === "object" ? source.activeConditions : {};
  source.resourceCycles = source.resourceCycles && typeof source.resourceCycles === "object" ? source.resourceCycles : {};
  source.flagCounts = source.flagCounts && typeof source.flagCounts === "object" ? source.flagCounts : {};
  state.supportRobotTalk = source;
  return source;
}

function supportRobotTalkRule(ruleId) {
  return SUPPORT_ROBOT_TALK_EVENTS.find((entry) => entry.id === ruleId) || null;
}

function findSupportRobotRecordById(robotId) {
  for (const base of ownedBases()) {
    const robot = base.floorDevices?.find((device) => device.id === robotId && device.type === "support_robot");
    if (robot) return { base, robot };
  }
  return null;
}

function supportRobotTalkTargetRecord(rule, preferredRobotId = "") {
  const placed = supportRobotRoster().filter(({ robot }) => robot.placed);
  if (!placed.length) return null;
  const preferred = preferredRobotId
    ? placed.find(({ robot }) => robot.id === preferredRobotId)
    : null;
  if (rule.robotTarget === "context" && preferred) return preferred;
  if (rule.robotTarget === "current_base") {
    return placed.find(({ base }) => base.id === state.activeBaseId) || preferred || placed[0];
  }
  if (rule.robotTarget === "any") return preferred || placed[0];
  return placed.find(({ robot }) => robot.isInitialSupportRobot) || preferred || placed[0];
}

function supportRobotTalkContext(record, extra = {}) {
  const base = record?.base;
  const robot = record?.robot;
  const plants = (base?.shelves || []).flatMap((unit) => unit.slots || []).filter(Boolean);
  const readyCount = plants.filter((plant) => plant.ready && !plant.dead).length;
  const growingCount = plants.filter((plant) => !plant.ready && !plant.dead).length;
  const cleaningCount = [...(base?.shelves || []), ...(base?.floorDevices || [])].filter(needsCleaning).length;
  const inventoryCount = (state.inventory || []).reduce((sum, item) => sum + Math.max(0, Number(item.qty) || 0), 0);
  return {
    ...extra,
    robotId: robot?.id || "",
    robotName: robot ? supportRobotDisplayName(robot) : "サポートロボット",
    baseId: base?.id || "",
    baseName: base?.name || "農園",
    day: Math.max(1, Math.floor(Number(state.day) || 1)),
    water: formatResource(Math.max(0, Number(state.water) || 0)),
    nutrient: formatResource(Math.max(0, Number(state.nutrient) || 0)),
    money: formatNumber(Number(state.money) || 0),
    readyCount,
    growingCount,
    plantCount: readyCount + growingCount,
    cleaningCount,
    inventoryCount
  };
}

function supportRobotTalkStoryAvailable(rule) {
  return STORY_EVENTS.some((event) =>
    event.trigger === rule.storyTrigger
    && (!event.once || !state.storySeen?.[event.id])
  );
}

function supportRobotTalkResourceCondition(rule) {
  if (!["water", "nutrient"].includes(rule.resource)) return false;
  const belowThreshold = (Number(state[rule.resource]) || 0) < rule.threshold;
  const producerMissing = !rule.missingDevice
    || !allFloorDevices().some((device) => device.type === rule.missingDevice && device.placed);
  return belowThreshold && producerMissing && requirementsMet(rule.requirements || []);
}

function queueSupportRobotTalkRule(rule, occurrenceKey, context = {}, preferredRobotId = "") {
  if (!rule || !occurrenceKey || state.debugMode || state.ended) return false;
  const talk = ensureSupportRobotTalkState();
  if (rule.once && talk.completed[rule.id]) return false;
  if (talk.completed[occurrenceKey] || talk.pending.some((entry) => entry.key === occurrenceKey)) return false;
  if (!requirementsMet(rule.requirements || []) || !supportRobotTalkStoryAvailable(rule)) return false;
  const record = supportRobotTalkTargetRecord(rule, preferredRobotId || context.robotId);
  if (!record) return false;
  talk.pending.push({
    key: occurrenceKey,
    ruleId: rule.id,
    storyTrigger: rule.storyTrigger,
    robotId: record.robot.id,
    baseId: record.base.id,
    queuedDay: Math.max(1, Math.floor(Number(state.day) || 1)),
    priority: rule.priority,
    markerLabel: rule.markerLabel,
    context: supportRobotTalkContext(record, context)
  });
  talk.pending.sort((left, right) => (right.priority - left.priority) || (left.queuedDay - right.queuedDay));
  requestFarmRender(record.base);
  return true;
}

function queueSupportRobotTalkFlag(flag, context = {}, preferredRobotId = "") {
  if (!state || state.debugMode || state.ended) return false;
  const talk = ensureSupportRobotTalkState();
  const explicitOccurrenceKey = String(context.talkOccurrenceKey || "").trim();
  let changed = false;
  SUPPORT_ROBOT_TALK_EVENTS
    .filter((rule) => rule.triggerType === "flag" && rule.triggerKey === flag)
    .forEach((rule) => {
      talk.flagCounts[rule.id] = Math.max(0, Number(talk.flagCounts[rule.id]) || 0) + 1;
      const occurrenceKey = rule.once
        ? rule.id
        : explicitOccurrenceKey
          ? rule.id + ":" + explicitOccurrenceKey
          : rule.id + ":flag:" + talk.flagCounts[rule.id];
      if (queueSupportRobotTalkRule(rule, occurrenceKey, { ...context, talkFlag: flag }, preferredRobotId)) changed = true;
    });
  if (changed) saveGame();
  return changed;
}

function refreshSupportRobotTalkOpportunities({ persist = true } = {}) {
  if (!state || state.debugMode || state.ended) return false;
  const talk = ensureSupportRobotTalkState();
  let changed = false;

  talk.pending = talk.pending.filter((candidate) => {
    const rule = supportRobotTalkRule(candidate.ruleId);
    const record = findSupportRobotRecordById(candidate.robotId);
    const valid = Boolean(
      rule
      && record?.robot?.placed
      && !talk.completed[candidate.key]
      && (!rule.once || !talk.completed[rule.id])
      && supportRobotTalkStoryAvailable(rule)
      && requirementsMet(rule.requirements || [])
      && (rule.triggerType !== "resource_low" || supportRobotTalkResourceCondition(rule))
    );
    if (!valid) {
      changed = true;
      return false;
    }
    if (candidate.baseId !== record.base.id) {
      candidate.baseId = record.base.id;
      changed = true;
    }
    return true;
  });

  SUPPORT_ROBOT_TALK_EVENTS.filter((rule) => rule.triggerType === "resource_low").forEach((rule) => {
    const active = supportRobotTalkResourceCondition(rule);
    const wasActive = Boolean(talk.activeConditions[rule.id]);
    if (active !== wasActive) {
      talk.activeConditions[rule.id] = active;
      changed = true;
    }
    if (!active) return;
    if (!wasActive) {
      talk.resourceCycles[rule.id] = Math.max(0, Number(talk.resourceCycles[rule.id]) || 0) + 1;
    }
    if (talk.pending.some((candidate) => candidate.ruleId === rule.id)) return;
    const occurrenceKey = rule.once
      ? rule.id
      : rule.id + ":cycle:" + Math.max(1, Number(talk.resourceCycles[rule.id]) || 1);
    if (queueSupportRobotTalkRule(rule, occurrenceKey, {
      resource: rule.resource,
      resourceName: rule.resource === "water" ? "水" : "養液",
      threshold: rule.threshold,
      missingDevice: rule.missingDevice,
      missingDeviceName: FLOOR_DEVICES[rule.missingDevice]?.name || rule.missingDevice
    })) changed = true;
  });

  const day = Math.max(1, Math.floor(Number(state.day) || 1));
  SUPPORT_ROBOT_TALK_EVENTS.filter((rule) => rule.triggerType === "interval").forEach((rule) => {
    if (day < rule.startDay || !requirementsMet(rule.requirements || [])) return;
    if (talk.pending.some((candidate) => candidate.ruleId === rule.id)) return;
    const scheduledDay = rule.startDay + Math.floor((day - rule.startDay) / rule.intervalDays) * rule.intervalDays;
    const occurrenceKey = rule.id + ":day:" + scheduledDay;
    if (queueSupportRobotTalkRule(rule, occurrenceKey, { scheduledDay })) changed = true;
  });

  if (changed) {
    ownedBases().forEach((base) => requestFarmRender(base));
    if (persist) saveGame();
  }
  return changed;
}

function supportRobotTalkForRobot(robotId) {
  const talk = ensureSupportRobotTalkState();
  const candidate = talk.pending
    .filter((entry) => entry.robotId === robotId)
    .sort((left, right) => (right.priority - left.priority) || (left.queuedDay - right.queuedDay))[0];
  if (!candidate) return null;
  const rule = supportRobotTalkRule(candidate.ruleId);
  return rule ? { candidate, rule } : null;
}

function startSupportRobotTalk(robotId) {
  const talkEntry = supportRobotTalkForRobot(robotId);
  const record = findSupportRobotRecordById(robotId);
  if (!talkEntry || !record?.robot?.placed) return false;
  const { candidate, rule } = talkEntry;
  const context = supportRobotTalkContext(record, {
    ...candidate.context,
    talkEventId: rule.id,
    markerLabel: rule.markerLabel
  });
  if (!triggerStoryEvent(rule.storyTrigger, context)) {
    toast("会話データを開始できませんでした。", "warning");
    return false;
  }
  const talk = ensureSupportRobotTalkState();
  talk.pending = talk.pending.filter((entry) => entry.key !== candidate.key);
  talk.completed[candidate.key] = Date.now();
  if (rule.once) talk.completed[rule.id] = Date.now();
  if (rule.triggerKey === "additional_support_robot_placed") {
    record.robot.supportWorkforceSelectionHintPending = false;
  }
  requestFarmRender(record.base);
  saveGame();
  if (farmScreenIsActive() && record.base.id === currentBase().id) renderFarm();
  playSound("ui_click", 0.12);
  return true;
}

window.queueSupportRobotTalkFlag = queueSupportRobotTalkFlag;
window.refreshSupportRobotTalkOpportunities = refreshSupportRobotTalkOpportunities;
function supportRobotDisplayName(robot) {
  ensureSupportRobotProfile(robot);
  return robot.robotName || "サポートロボット";
}

function supportRobotLocationLabel(base, robot) {
  const baseName = base?.name || "UNKNOWN BASE";
  if (!robot?.placed) return `${baseName} / STOCK`;
  return `${baseName} / X${Number(robot.x) + 1}-Y${Number(robot.y) + 1}`;
}

function currentBase() {
  return ownedBases().find((base) => base.id === state.activeBaseId) || ownedBases()[0];
}

function farmRenderBaseId(baseOrId = null) {
  if (typeof baseOrId === "string") return baseOrId;
  return baseOrId?.id || state?.activeBaseId || "";
}

function requestFarmRender(baseOrId = null) {
  const baseId = farmRenderBaseId(baseOrId);
  if (baseId) farmRenderRequestedBaseIds.add(baseId);
}

function farmRenderIsRequested(baseOrId = null) {
  const baseId = farmRenderBaseId(baseOrId);
  return Boolean(baseId && farmRenderRequestedBaseIds.has(baseId));
}

function clearFarmRenderRequest(baseOrId = null) {
  const baseId = farmRenderBaseId(baseOrId);
  if (baseId) farmRenderRequestedBaseIds.delete(baseId);
}

function farmScreenIsActive() {
  return document.getElementById("farm-screen")?.classList.contains("active") || false;
}

function currentShelves() {
  return currentBase().shelves;
}

function currentFloorDevices() {
  return currentBase().floorDevices;
}

function switchBase(baseId) {
  if (!ownedBases().some((base) => base.id === baseId)) return;
  state.activeBaseId = baseId;
  selectedBaseId = baseId;
  selectedUnitId = null;
  selectedDeviceId = null;
  placementSelection = null;
  setStatus(`Active base switched to ${currentBase().name}.`);
  saveGame();
  renderFarm();
  updateTabIndicators();
  renderHeader();
}

function allShelves() {
  return ownedBases().flatMap((base) => base.shelves.map((shelf) => ({ ...shelf, baseId: base.id })));
}

function allFloorDevices() {
  return ownedBases().flatMap((base) => base.floorDevices.map((device) => ({ ...device, baseId: base.id })));
}

function findOwnedEquipment(kind, id) {
  for (const base of ownedBases()) {
    const collection = kind === "unit" ? base.shelves : base.floorDevices;
    const item = collection.find((entry) => entry.id === id);
    if (item) return { base, collection, item };
  }
  return null;
}

function sharedStockItems() {
  return ownedBases().flatMap((base) => [
    ...base.shelves.filter((item) => !item.placed).map((item) => ({ item, base, kind: "unit" })),
    ...base.floorDevices.filter((item) => !item.placed).map((item) => ({ item, base, kind: "device" }))
  ]);
}

function moveEquipmentToBase(record, targetBase) {
  if (!record || record.base.id === targetBase.id) return record;
  const index = record.collection.indexOf(record.item);
  if (index >= 0) record.collection.splice(index, 1);
  const targetCollection = record.item.type && GROW_UNITS[record.item.type] ? targetBase.shelves : targetBase.floorDevices;
  const duplicateIndex = targetCollection.findIndex((entry) => entry.id === record.item.id);
  if (duplicateIndex >= 0) targetCollection.splice(duplicateIndex, 1);
  targetCollection.push(record.item);
  removeDuplicateEquipmentEntries(record.item.type && GROW_UNITS[record.item.type] ? "unit" : "device", record.item.id, targetBase.id);
  return { base: targetBase, collection: targetCollection, item: record.item };
}

function removeDuplicateEquipmentEntries(kind, id, keepBaseId) {
  ownedBases().forEach((base) => {
    const collection = kind === "unit" ? base.shelves : base.floorDevices;
    for (let index = collection.length - 1; index >= 0; index -= 1) {
      if (collection[index].id === id && base.id !== keepBaseId) collection.splice(index, 1);
    }
  });
}

function repairEquipmentOwnership() {
  let repaired = false;
  ["unit", "device"].forEach((kind) => {
    const seen = new Map();
    ownedBases().forEach((base, baseIndex) => {
      const collection = kind === "unit" ? base.shelves : base.floorDevices;
      collection.forEach((item, itemIndex) => {
        const previous = seen.get(item.id);
        const entry = { base, baseIndex, collection, item, itemIndex };
        if (!previous) {
          seen.set(item.id, entry);
          return;
        }
        const preferCurrent = base.id === state.activeBaseId && previous.base.id !== state.activeBaseId;
        const preferPlaced = Boolean(item.placed) && !previous.item.placed;
        const keep = preferCurrent || (!previous.item.placed && preferPlaced) ? entry : previous;
        const discard = keep === entry ? previous : entry;
        const discardIndex = discard.collection.indexOf(discard.item);
        if (discardIndex >= 0) {
          discard.collection.splice(discardIndex, 1);
          repaired = true;
        }
        seen.set(item.id, keep);
      });
    });
  });
  return repaired;
}

function allPlacedObjects() {
  return [
    ...currentShelves().filter((item) => item.placed).map((item) => ({ ...item, kind: "unit" })),
    ...currentFloorDevices().filter((item) => item.placed).map((item) => ({ ...item, kind: "device" }))
  ];
}

function randomRecordId(record, fallback = "") {
  const ids = Object.keys(record || {});
  if (!ids.length) return fallback;
  return ids[Math.floor(Math.random() * ids.length)] || fallback;
}

function supportBlueprintPinSchema(type) {
  return SUPPORT_BLUEPRINT_PIN_SCHEMAS[type] || SUPPORT_BLUEPRINT_PIN_SCHEMAS.event;
}

function supportBlueprintPinDefinition(type, direction, pinId) {
  const collection = direction === "input"
    ? supportBlueprintPinSchema(type).inputs
    : supportBlueprintPinSchema(type).outputs;
  return collection.find((pin) => pin.id === pinId) || null;
}

function supportBlueprintDefaultPin(type, direction, kind = "exec") {
  const collection = direction === "input"
    ? supportBlueprintPinSchema(type).inputs
    : supportBlueprintPinSchema(type).outputs;
  return collection.find((pin) => pin.kind === kind)?.id || "";
}

function createDefaultSupportBlueprint() {
  const rootId = makeId("bp-root");
  return {
    version: 3,
    rootId,
    nodes: [{ id: rootId, type: "event", x: 54, y: 182 }],
    links: []
  };
}

function createSupportBlueprintPreset(presetId = "white-work") {
  const normalizedPresetId = String(presetId || "").trim();
  if (!normalizedPresetId || normalizedPresetId === "empty") {
    return createDefaultSupportBlueprint();
  }
  const result = typeof window.createLaborBlueprintPackageBlueprint === "function"
    ? window.createLaborBlueprintPackageBlueprint(normalizedPresetId)
    : null;
  return result?.ok && result.blueprint
    ? normalizeSupportBlueprint(result.blueprint)
    : createDefaultSupportBlueprint();
}

function migrateLegacySupportBlueprint(source) {
  const fallback = createDefaultSupportBlueprint();
  const rawNodes = Array.isArray(source?.nodes) ? source.nodes : [];
  const sourceRoot = rawNodes.find((node) => node?.type === "event")
    || rawNodes.find((node) => node?.id === source?.rootId);
  const root = {
    id: typeof sourceRoot?.id === "string" && sourceRoot.id ? sourceRoot.id : fallback.rootId,
    type: "event",
    x: Number.isFinite(Number(sourceRoot?.x)) ? Number(sourceRoot.x) : 54,
    y: Number.isFinite(Number(sourceRoot?.y)) ? Number(sourceRoot.y) : 182
  };
  const actionNodes = rawNodes
    .filter((node) => SUPPORT_BLUEPRINT_ACTION_TYPES.includes(node?.type))
    .map((node, index) => ({
      ...node,
      id: typeof node.id === "string" && node.id ? node.id : makeId("bp-node"),
      x: Number.isFinite(Number(node.x)) ? Number(node.x) : root.x + 520,
      y: Number.isFinite(Number(node.y)) ? Number(node.y) : 90 + index * 150
    }));
  if (!actionNodes.length) return { ...fallback, rootId: root.id, nodes: [root] };

  const priorityId = makeId("bp-priority");
  const oldNext = new Map((Array.isArray(source?.links) ? source.links : []).map((link) => [link?.from, link?.to]));
  const actionById = new Map(actionNodes.map((node) => [node.id, node]));
  const ordered = [];
  const visited = new Set();
  let currentId = oldNext.get(root.id);
  while (currentId && actionById.has(currentId) && !visited.has(currentId)) {
    visited.add(currentId);
    ordered.push(actionById.get(currentId));
    currentId = oldNext.get(currentId);
  }
  actionNodes.forEach((node) => {
    if (!visited.has(node.id)) ordered.push(node);
  });

  const priority = { id: priorityId, type: "priority", x: root.x + 270, y: root.y - 36 };
  const links = [
    { id: makeId("bp-link"), from: root.id, fromPin: "out", to: priorityId, toPin: "in", order: 0 },
    ...ordered.map((node, index) => ({
      id: makeId("bp-link"),
      from: priorityId,
      fromPin: "child",
      to: node.id,
      toPin: "in",
      order: index
    }))
  ];
  return { version: 2, rootId: root.id, nodes: [root, priority, ...ordered], links };
}

function migrateSupportBlueprintV2(source) {
  const rawNodes = Array.isArray(source?.nodes) ? source.nodes : [];
  const rawLinks = Array.isArray(source?.links) ? [...source.links] : [];
  const typeMap = {
    priority: "sequence",
    repeat_until_failure: "sequence",
    repeat_while: "branch"
  };
  const originalNodeById = new Map(rawNodes.map((node) => [node?.id, node]));
  const nodes = rawNodes.map((node) => ({
    ...node,
    type: typeMap[node?.type] || node?.type
  }));
  const orderedChildLinks = new Map();
  rawLinks
    .filter((link) => ["priority", "sequence"].includes(originalNodeById.get(link?.from)?.type) && link?.fromPin === "child")
    .sort((left, right) => (Number(left.order) || 0) - (Number(right.order) || 0))
    .forEach((link) => {
      const links = orderedChildLinks.get(link.from) || [];
      links.push(link);
      orderedChildLinks.set(link.from, links);
    });

  const sequencePins = ["first", "second", "third"];
  const links = rawLinks.map((link) => {
    const fromType = originalNodeById.get(link?.from)?.type;
    const next = { ...link };
    if (["priority", "sequence"].includes(fromType) && link.fromPin === "child") {
      const index = (orderedChildLinks.get(link.from) || []).indexOf(link);
      next.fromPin = sequencePins[index] || "";
    } else if (fromType === "repeat_until_failure" && link.fromPin === "body") {
      next.fromPin = "first";
    } else if (fromType === "repeat_while" && link.fromPin === "body") {
      next.fromPin = "true";
    }
    return next;
  }).filter((link) => link.fromPin);

  return {
    version: 3,
    rootId: source?.rootId,
    nodes,
    links
  };
}
function normalizeSupportBlueprintNode(rawNode, index) {
  const node = {
    id: typeof rawNode?.id === "string" && rawNode.id ? rawNode.id : makeId("bp-node"),
    type: rawNode?.type,
    x: Number.isFinite(Number(rawNode?.x)) ? Number(rawNode.x) : 300 + index * 36,
    y: Number.isFinite(Number(rawNode?.y)) ? Number(rawNode.y) : 130 + index * 26
  };
  if (node.type === "plant") node.cropId = rawNode.cropId === "*" || CROPS[rawNode.cropId] ? rawNode.cropId : "lettuce";
  if (node.type === "care") node.cropId = rawNode.cropId === "*" || CROPS[rawNode.cropId] ? rawNode.cropId : "*";
  if (node.type === "procure") {
    node.cropId = CROPS[rawNode.cropId] ? rawNode.cropId : "lettuce";
    node.packs = clamp(Math.floor(Number(rawNode.packs) || 1), 1, 12);
  }
  if (node.type === "ship") {
    node.cropId = CROPS[rawNode.cropId] ? rawNode.cropId : "lettuce";
    node.marketId = MARKETS[rawNode.marketId] ? rawNode.marketId : "lower";
  }
  if (node.type === "every") {
    node.everyN = [2, 3, 5].includes(Number(rawNode.everyN)) ? Number(rawNode.everyN) : 3;
  }
  if (node.type === "random") {
    node.probability = [25, 50, 75].includes(Number(rawNode.probability)) ? Number(rawNode.probability) : 50;
  }
  if (node.type === "condition") {
    const sources = ["action_available", "inventory", "seed", "seed_price", "money", "water", "nutrient", "energy", "morale"];
    const operators = ["gte", "gt", "lte", "lt", "eq"];
    node.conditionSource = sources.includes(rawNode.conditionSource) ? rawNode.conditionSource : "action_available";
    node.operator = operators.includes(rawNode.operator) ? rawNode.operator : "gte";
    node.value = Math.max(0, Math.min(999999, Number.isFinite(Number(rawNode.value)) ? Number(rawNode.value) : 1));
    node.cropId = rawNode.cropId === "*" || CROPS[rawNode.cropId] ? rawNode.cropId : "lettuce";
    node.actionType = SUPPORT_BLUEPRINT_ACTION_TYPES.includes(rawNode.actionType) ? rawNode.actionType : "plant";
    node.marketId = MARKETS[rawNode.marketId] ? rawNode.marketId : "lower";
    node.packs = clamp(Math.floor(Number(rawNode.packs) || 1), 1, 12);
  }
  return node;
}

function normalizeSupportBlueprint(source) {
  const fallback = createDefaultSupportBlueprint();
  if (!source || typeof source !== "object") return fallback;
  const hasLegacyLinks = (Number(source.version) || 1) < 2
    || (Array.isArray(source.links) && source.links.some((link) => !link?.fromPin || !link?.toPin));
  if (hasLegacyLinks) return normalizeSupportBlueprint(migrateLegacySupportBlueprint(source));
  if ((Number(source.version) || 2) < 3) {
    return normalizeSupportBlueprint(migrateSupportBlueprintV2(source));
  }

  const rawNodes = Array.isArray(source.nodes) ? source.nodes : [];
  const sourceRoot = rawNodes.find((node) => node?.type === "event")
    || rawNodes.find((node) => node?.id === source.rootId);
  const rootId = typeof sourceRoot?.id === "string" && sourceRoot.id ? sourceRoot.id : fallback.rootId;
  const nodes = [{
    id: rootId,
    type: "event",
    x: Number.isFinite(Number(sourceRoot?.x)) ? Number(sourceRoot.x) : 54,
    y: Number.isFinite(Number(sourceRoot?.y)) ? Number(sourceRoot.y) : 182
  }];
  const usedIds = new Set([rootId]);
  rawNodes.forEach((rawNode, index) => {
    if (!SUPPORT_BLUEPRINT_NODE_TYPES.includes(rawNode?.type)) return;
    const node = normalizeSupportBlueprintNode(rawNode, index);
    if (usedIds.has(node.id)) node.id = makeId("bp-node");
    usedIds.add(node.id);
    nodes.push(node);
  });

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const incomingCounts = new Map();
  const outgoingCounts = new Map();
  const adjacency = new Map();
  const links = [];
  const createsCycle = (from, to) => {
    const pending = [to];
    const visited = new Set();
    while (pending.length) {
      const current = pending.pop();
      if (current === from) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      (adjacency.get(current) || []).forEach((next) => pending.push(next));
    }
    return false;
  };

  (Array.isArray(source.links) ? source.links : []).forEach((rawLink, index) => {
    const fromNode = nodeById.get(rawLink?.from);
    const toNode = nodeById.get(rawLink?.to);
    if (!fromNode || !toNode || fromNode.id === toNode.id) return;
    const fromPin = rawLink.fromPin || supportBlueprintDefaultPin(fromNode.type, "output");
    const toPin = rawLink.toPin || supportBlueprintDefaultPin(toNode.type, "input");
    const output = supportBlueprintPinDefinition(fromNode.type, "output", fromPin);
    const input = supportBlueprintPinDefinition(toNode.type, "input", toPin);
    if (!output || !input || output.kind !== input.kind) return;

    const incomingKey = `${toNode.id}:${toPin}`;
    const outgoingKey = `${fromNode.id}:${fromPin}`;
    const incomingCount = incomingCounts.get(incomingKey) || 0;
    const outgoingCount = outgoingCounts.get(outgoingKey) || 0;
    if (incomingCount >= input.maxLinks || outgoingCount >= output.maxLinks) return;
    if (links.some((link) => link.from === fromNode.id && link.fromPin === fromPin && link.to === toNode.id && link.toPin === toPin)) return;
    if (createsCycle(fromNode.id, toNode.id)) return;

    incomingCounts.set(incomingKey, incomingCount + 1);
    outgoingCounts.set(outgoingKey, outgoingCount + 1);
    adjacency.set(fromNode.id, [...(adjacency.get(fromNode.id) || []), toNode.id]);
    links.push({
      id: typeof rawLink.id === "string" && rawLink.id ? rawLink.id : makeId("bp-link"),
      from: fromNode.id,
      fromPin,
      to: toNode.id,
      toPin,
      order: Number.isFinite(Number(rawLink.order)) ? Number(rawLink.order) : index
    });
  });
  return { version: 3, rootId, nodes, links };
}
function weightedRandomEntry(entries, weightKey = "weight") {
  const candidates = (entries || []).filter((entry) => entry && Number(entry[weightKey]) > 0);
  if (!candidates.length) return null;
  const totalWeight = candidates.reduce((total, entry) => total + Number(entry[weightKey]), 0);
  let roll = Math.random() * totalWeight;
  for (const entry of candidates) {
    roll -= Number(entry[weightKey]);
    if (roll <= 0) return entry;
  }
  return candidates[candidates.length - 1];
}

function supportPersonalityIdsConflict(firstId, secondId) {
  if (!firstId || !secondId || firstId === secondId) return true;
  const first = ROBOT_PERSONALITIES[firstId];
  const second = ROBOT_PERSONALITIES[secondId];
  if (!first || !second) return true;
  if (first.conflictGroup && first.conflictGroup === second.conflictGroup) return true;
  return first.conflicts.includes(secondId) || second.conflicts.includes(firstId);
}

function randomSupportRobotPersonalityIds() {
  const personalities = Object.values(ROBOT_PERSONALITIES).filter((entry) => entry?.id && entry.weight > 0);
  const fallbackId = ROBOT_PERSONALITIES.steady?.id || personalities[0]?.id || "steady";
  if (!personalities.length) return [fallbackId];
  const rarityPool = ROBOT_PERSONALITY_RARITIES.filter((entry) => entry.count <= personalities.length);
  const selectedRarity = weightedRandomEntry(rarityPool) || { count: 1 };
  const targetCount = Math.max(1, Math.min(personalities.length, selectedRarity.count));
  let bestSelection = [];
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const selected = [];
    let pool = [...personalities];
    while (selected.length < targetCount) {
      const compatible = pool.filter((candidate) => selected.every((id) => !supportPersonalityIdsConflict(id, candidate.id)));
      const next = weightedRandomEntry(compatible);
      if (!next) break;
      selected.push(next.id);
      pool = pool.filter((candidate) => candidate.id !== next.id);
    }
    if (selected.length > bestSelection.length) bestSelection = selected;
    if (selected.length === targetCount) return selected;
  }
  return bestSelection.length ? bestSelection : [fallbackId];
}

function normalizeSupportRobotPersonalityIds(device) {
  const legacyId = ROBOT_PERSONALITIES[device.robotPersonalityId] ? device.robotPersonalityId : "";
  const sourceIds = Array.isArray(device.robotPersonalityIds) ? device.robotPersonalityIds : (legacyId ? [legacyId] : []);
  const normalized = [];
  sourceIds.forEach((rawId) => {
    const id = String(rawId || "").trim();
    if (!ROBOT_PERSONALITIES[id] || normalized.includes(id)) return;
    if (normalized.some((selectedId) => supportPersonalityIdsConflict(selectedId, id))) return;
    normalized.push(id);
  });
  device.robotPersonalityIds = normalized.length ? normalized : randomSupportRobotPersonalityIds();
  delete device.robotPersonalityId;
  return device.robotPersonalityIds;
}

function supportRobotPersonalityIds(device) {
  ensureSupportRobotProfile(device);
  return [...device.robotPersonalityIds];
}

function supportRobotPersonalities(device) {
  return supportRobotPersonalityIds(device).map((id) => ROBOT_PERSONALITIES[id]).filter(Boolean);
}

function supportRobotPersonalityRarity(device) {
  const count = supportRobotPersonalityIds(device).length;
  const exact = ROBOT_PERSONALITY_RARITIES.find((entry) => entry.count === count);
  const fallback = [...ROBOT_PERSONALITY_RARITIES].reverse().find((entry) => count >= entry.count);
  return exact || fallback || { id: "standard", count: 1, weight: 1, name: "STANDARD", color: "#79a58f" };
}
function ensureSupportRobotProfile(device) {
  if (!device || device.type !== "support_robot") return device;
  if (supportRobotProfileReady.has(device)) return device;
  if (!ROBOT_SKILLS[device.robotSkillId]) device.robotSkillId = randomRecordId(ROBOT_SKILLS, "balanced");
  normalizeSupportRobotPersonalityIds(device);
  device.robotName = typeof device.robotName === "string" ? device.robotName.trim().slice(0, 24) : "";
  device.isInitialSupportRobot = Boolean(device.isInitialSupportRobot);
  const maxEnergy = SUPPORT_ROBOT_MAX_ENERGY;
  const maxMorale = SUPPORT_ROBOT_MAX_MORALE;
  device.supportEnergy = Number.isFinite(Number(device.supportEnergy))
    ? Math.max(0, Math.min(maxEnergy, Number(device.supportEnergy)))
    : maxEnergy;
  device.supportMorale = Number.isFinite(Number(device.supportMorale))
    ? Math.max(0, Math.min(maxMorale, Number(device.supportMorale)))
    : maxMorale;
  device.supportChargeRemaining = Number.isFinite(Number(device.supportChargeRemaining))
    ? Math.max(0, Number(device.supportChargeRemaining))
    : 0;
  device.supportChargeNodeId = typeof device.supportChargeNodeId === "string" ? device.supportChargeNodeId : "";
  device.supportRecoveryMode = device.supportChargeRemaining > 0
    ? (device.supportRecoveryMode === "forced" ? "forced" : "charge")
    : "";
  const previousSkillBonuses = device.supportSkillBonuses && typeof device.supportSkillBonuses === 'object'
    ? device.supportSkillBonuses
    : {};
  device.supportSkillBonuses = Object.fromEntries(SUPPORT_TASKS.map((task) => [
    task,
    Math.max(0, Math.min(SUPPORT_GRADE_ORDER.length - 1, Math.floor(Number(previousSkillBonuses[task]) || 0)))
  ]));
  const previousPersonalityRuntime = device.supportPersonalityRuntime && typeof device.supportPersonalityRuntime === 'object'
    ? device.supportPersonalityRuntime
    : {};
  device.supportPersonalityRuntime = {
    version: 1,
    dailyEffects: previousPersonalityRuntime.dailyEffects && typeof previousPersonalityRuntime.dailyEffects === 'object'
      ? previousPersonalityRuntime.dailyEffects
      : {},
    placementEffects: previousPersonalityRuntime.placementEffects && typeof previousPersonalityRuntime.placementEffects === 'object'
      ? previousPersonalityRuntime.placementEffects
      : {}
  };
  const legacyCooldown = Number.isFinite(Number(device.supportCooldown)) ? Number(device.supportCooldown) : 0;
  const previousCooldowns = device.supportTaskCooldowns || {};
  device.supportTaskCooldowns = {};
  SUPPORT_TASKS.forEach((task) => {
    const value = Number(previousCooldowns[task]);
    device.supportTaskCooldowns[task] = Number.isFinite(value) ? Math.max(0, value) : Math.max(0, legacyCooldown);
  });
  device.supportCooldown = Math.max(device.supportChargeRemaining, 0, ...Object.values(device.supportTaskCooldowns));
  const harvestSource = device.harvestAutomation || device.automation?.harvest || {};
  device.harvestAutomation = { enabled: harvestSource.enabled !== false };
  const plantingSource = device.plantingAutomation || device.automation?.planting || {};
  const shortageNoticeAtDay = plantingSource.shortageNoticeAtDay === null
    || plantingSource.shortageNoticeAtDay === undefined
    ? null
    : Number(plantingSource.shortageNoticeAtDay);
  device.plantingAutomation = {
    enabled: Boolean(plantingSource.enabled),
    cropId: CROPS[plantingSource.cropId] ? plantingSource.cropId : "lettuce",
    shortageNoticeKey: typeof plantingSource.shortageNoticeKey === "string" ? plantingSource.shortageNoticeKey : "",
    shortageNoticeAtDay: Number.isFinite(shortageNoticeAtDay) ? shortageNoticeAtDay : null
  };
  device.supportBlueprint = normalizeSupportBlueprint(device.supportBlueprint);
  const nodeIds = new Set(device.supportBlueprint.nodes.map((node) => node.id));
  const previousRuntime = device.supportBlueprintRuntime;
  const memory = previousRuntime?.version === 3 && previousRuntime.memory && typeof previousRuntime.memory === "object"
    ? Object.fromEntries(Object.entries(previousRuntime.memory).filter(([nodeId]) => nodeIds.has(nodeId)))
    : {};
  device.supportBlueprintRuntime = {
    version: 3,
    memory,
    nodeBadges: {},
    activeNodeId: nodeIds.has(previousRuntime?.activeNodeId) ? previousRuntime.activeNodeId : "",
    lastNodeId: nodeIds.has(previousRuntime?.lastNodeId) ? previousRuntime.lastNodeId : "",
    lastStatus: Object.values(SUPPORT_BLUEPRINT_STATUS).includes(previousRuntime?.lastStatus)
      ? previousRuntime.lastStatus
      : SUPPORT_BLUEPRINT_STATUS.FAILURE
  };
  supportRobotProfileReady.add(device);
  return device;
}

function resetSupportBlueprintRuntime(robot) {
  if (!robot) return;
  robot.supportBlueprintRuntime = {
    version: 3,
    memory: {},
    nodeBadges: {},
    activeNodeId: "",
    lastNodeId: "",
    lastStatus: SUPPORT_BLUEPRINT_STATUS.FAILURE
  };
}
function createFloorDevice(type, options = {}) {
  const device = { id: makeId("device"), type, placed: false, x: null, y: null, tags: unitTags(type), dirt: 0 };
  if (["water", "nutrient"].includes(FLOOR_DEVICES[type]?.productionResource)) device.resourceStored = 0;
  if (type === "support_robot") {
    const requestedPreset = typeof options.supportBlueprintPreset === "string"
      ? options.supportBlueprintPreset
      : hasAllBasicSupportOS()
        ? "white-work"
        : "empty";
    device.supportBlueprint = createSupportBlueprintPreset(requestedPreset);
  }
  ensureSupportRobotProfile(device);
  return device;
}

function normalizedCropAutomationEntry(source = {}, defaults = {}) {
  return {
    enabled: Boolean(source.enabled),
    packs: Math.max(1, Math.min(12, Math.round(Number(source.packs ?? defaults.packs ?? 1))))
  };
}

function normalizedShipAutomationEntry(source = {}, defaults = {}) {
  const marketId = MARKETS[source.marketId] ? source.marketId : (MARKETS[defaults.marketId] ? defaults.marketId : "lower");
  return {
    enabled: Boolean(source.enabled),
    marketId,
    qty: Math.max(1, Math.min(99, Math.round(Number(source.qty ?? defaults.qty ?? 1))))
  };
}

function ensureSupportAutomationState() {
  if (state && supportAutomationStateReady.has(state)) return;
  const previous = state.automation || {};
  const legacyProcCrop = CROPS[previous.procurement?.cropId] ? previous.procurement.cropId : "lettuce";
  const legacyShipCrop = CROPS[previous.shipping?.cropId] ? previous.shipping.cropId : "lettuce";
  state.supportOS = {
    harvest: Boolean(state.supportOS?.harvest),
    planting: Boolean(state.supportOS?.planting),
    cleaning: Boolean(state.supportOS?.cleaning),
    storage: Boolean(state.supportOS?.storage)
  };
  state.automation = {
    procurement: {
      selectedCropId: CROPS[previous.procurement?.selectedCropId] ? previous.procurement.selectedCropId : legacyProcCrop,
      byCrop: {}
    },
    planting: {
      enabled: Boolean(previous.planting?.enabled),
      cropId: CROPS[previous.planting?.cropId] ? previous.planting.cropId : legacyProcCrop
    },
    shipping: {
      selectedCropId: CROPS[previous.shipping?.selectedCropId] ? previous.shipping.selectedCropId : legacyShipCrop,
      byCrop: {}
    }
  };
  Object.keys(CROPS).forEach((cropId) => {
    const procSource = previous.procurement?.byCrop?.[cropId]
      || (cropId === legacyProcCrop ? previous.procurement : {});
    state.automation.procurement.byCrop[cropId] = normalizedCropAutomationEntry(procSource, { packs: 1 });
    const shipSource = previous.shipping?.byCrop?.[cropId]
      || (cropId === legacyShipCrop ? previous.shipping : {});
    state.automation.shipping.byCrop[cropId] = normalizedShipAutomationEntry(shipSource, { marketId: "lower", qty: 1 });
  });
  if (state.bases) {
    const legacyPlanting = previous.planting || {};
    const legacyPlantingCropId = CROPS[legacyPlanting.cropId] ? legacyPlanting.cropId : legacyProcCrop;
    state.bases.forEach((base) => base.floorDevices?.forEach((device) => {
      ensureSupportRobotProfile(device);
      if (device.type === "support_robot" && legacyPlanting.enabled && !device.plantingAutomation.enabled) {
        device.plantingAutomation = { enabled: true, cropId: legacyPlantingCropId };
      }
    }));
  }
  supportAutomationStateReady.add(state);
}
function supportRobotSkill(device) {
  ensureSupportRobotProfile(device);
  return ROBOT_SKILLS[device.robotSkillId] || ROBOT_SKILLS.balanced || { name: "Balanced", harvest: "B", plant: "B", care: "B", cleaning: "B", procure: "B", ship: "B" };
}

function supportRobotPersonality(device) {
  const personalities = supportRobotPersonalities(device);
  const ids = supportRobotPersonalityIds(device);
  return {
    id: ids.join("+"),
    name: personalities.map((entry) => entry.name).join(" / ") || "Steady",
    description: personalities.map((entry) => entry.description).filter(Boolean).join(" / "),
    rangeMod: personalities.reduce((value, entry) => value * (Number(entry.rangeMod) || 1), 1),
    fuelMod: personalities.reduce((value, entry) => value * (Number(entry.fuelMod) || 1), 1),
    speedMod: personalities.reduce((value, entry) => value * (Number(entry.speedMod) || 1), 1),
    rarity: supportRobotPersonalityRarity(device)
  };
}

function supportRobotPersonalityEffects(device) {
  return supportRobotPersonalityIds(device).flatMap((personalityId) => {
    const effects = ROBOT_PERSONALITY_EFFECTS[personalityId];
    return Array.isArray(effects) ? effects : [];
  });
}

function supportRobotHasPersonality(device, personalityId) {
  return supportRobotPersonalityIds(device).includes(personalityId);
}

function supportRobotAssignedTaskTypes(robot) {
  ensureSupportRobotProfile(robot);
  const blueprint = robot.supportBlueprint;
  const nodeById = new Map(blueprint.nodes.map((node) => [node.id, node]));
  const outgoing = new Map();
  blueprint.links.forEach((link) => {
    outgoing.set(link.from, [...(outgoing.get(link.from) || []), link.to]);
  });

  const assigned = new Set();
  const visited = new Set();
  const pending = [blueprint.rootId];
  while (pending.length) {
    const nodeId = pending.pop();
    if (!nodeId || visited.has(nodeId)) continue;
    visited.add(nodeId);
    const node = nodeById.get(nodeId);
    if (SUPPORT_BLUEPRINT_ACTION_TYPES.includes(node?.type)) assigned.add(node.type);
    (outgoing.get(nodeId) || []).forEach((nextId) => {
      if (!visited.has(nextId)) pending.push(nextId);
    });
  }
  return SUPPORT_BLUEPRINT_ACTION_TYPES.filter((task) => assigned.has(task));
}

function supportRobotBase(robot) {
  if (!robot) return null;
  return ownedBases().find((base) => base.floorDevices?.some((device) => device === robot)) || null;
}

function supportPersonalityEffectContribution(rawBonus, effect) {
  const bonus = Number(rawBonus) || 0;
  const cap = Number(effect?.maxBonus) || 0;
  if (cap <= 0) return bonus;
  return Math.max(-cap, Math.min(cap, bonus));
}

function supportRobotSameBaseRobots(robot) {
  const base = supportRobotBase(robot);
  if (!base) return [];
  return (base.floorDevices || [])
    .filter((device) => device.type === "support_robot" && device.placed)
    .map((device) => ensureSupportRobotProfile(device));
}

function supportRobotEffectThresholdMet(robot, effect) {
  if (!effect?.thresholdResource) return true;
  const property = supportPersonalityTriggerResourceProperty(effect.thresholdResource);
  const maximum = supportPersonalityTriggerResourceMax(robot, effect.thresholdResource);
  if (!property || maximum <= 0) return false;
  const current = Math.max(0, Number(robot[property]) || 0);
  return current / maximum <= effect.thresholdRatio + SUPPORT_RESOURCE_EPSILON;
}

function supportRobotSelfEfficiencyBonus(robot, assignedTaskCount) {
  const sameBaseRobotCount = supportRobotSameBaseRobots(robot).length;
  return supportRobotPersonalityEffects(robot).reduce((total, effect) => {
    if (effect.target !== "self") return total;
    let contribution = 0;
    if (effect.type === "task_variety" && assignedTaskCount > 0) {
      contribution = Math.max(0, assignedTaskCount - 1) * effect.value;
    } else if (effect.type === "task_focus" && assignedTaskCount > 0) {
      contribution = Math.max(0, SUPPORT_BLUEPRINT_ACTION_TYPES.length - assignedTaskCount) * effect.value;
    } else if (effect.type === "efficiency_bonus") {
      contribution = effect.value;
    } else if (effect.type === "alone_efficiency" && sameBaseRobotCount === 1) {
      contribution = effect.value;
    } else if (effect.type === "resource_threshold_efficiency" && supportRobotEffectThresholdMet(robot, effect)) {
      contribution = effect.value;
    }
    return total + supportPersonalityEffectContribution(contribution, effect);
  }, 0);
}

function supportRobotTeamEfficiencyBonus(robot) {
  if (!robot?.placed) return 0;
  const base = supportRobotBase(robot);
  if (!base) return 0;
  const appliedBaseEffects = new Set();
  const bonus = base.floorDevices.reduce((total, teammate) => {
    if (teammate === robot || teammate.type !== "support_robot" || !teammate.placed) return total;
    const teammateBonus = supportRobotPersonalityEffects(teammate).reduce((subtotal, effect) => {
      if (effect.target !== "other_same_base" || effect.type !== "efficiency_bonus") return subtotal;
      const effectKey = `${effect.personalityId}:${effect.id}`;
      if (effect.stackMode === "once_per_base") {
        if (appliedBaseEffects.has(effectKey)) return subtotal;
        appliedBaseEffects.add(effectKey);
      }
      return subtotal + supportPersonalityEffectContribution(effect.value, effect);
    }, 0);
    return total + teammateBonus;
  }, 0);
  return Math.max(-SUPPORT_PERSONALITY_TEAM_BONUS_CAP, Math.min(SUPPORT_PERSONALITY_TEAM_BONUS_CAP, bonus));
}

function ensureSupportPersonalityTriggerState() {
  if (!state.supportPersonalityTriggerState || typeof state.supportPersonalityTriggerState !== "object") {
    state.supportPersonalityTriggerState = {};
  }
  if (!state.supportPersonalityTriggerState.lastProcessed || typeof state.supportPersonalityTriggerState.lastProcessed !== "object") {
    state.supportPersonalityTriggerState.lastProcessed = {};
  }
  return state.supportPersonalityTriggerState;
}

function supportPersonalityTriggerRobots(base) {
  return (base?.floorDevices || [])
    .filter((robot) => robot.type === "support_robot" && robot.placed)
    .map((robot) => ensureSupportRobotProfile(robot));
}

function supportPersonalityTriggerConditionValue(trigger, context) {
  if (trigger.conditionType === "same_personality_count") return context.sources.length;
  if (trigger.conditionType === "same_base_other_robot_count") {
    return Math.max(0, context.robots.length - context.sources.length);
  }
  return context.robots.length;
}

function supportPersonalityTriggerTier(trigger, conditionValue) {
  let matched = null;
  trigger.tiers.forEach((tier) => {
    if (conditionValue >= tier.minCount) matched = tier;
  });
  return matched;
}

function supportPersonalityTriggerResourceProperty(resource) {
  if (resource === "energy") return "supportEnergy";
  if (resource === "morale") return "supportMorale";
  return "";
}

function supportPersonalityTriggerResourceMax(robot, resource) {
  if (resource === "energy") return supportRobotMaxEnergy(robot);
  if (resource === "morale") return supportRobotMaxMorale(robot);
  return 0;
}

function supportPersonalityTriggerEligibleRobots(trigger, tier, robots) {
  if (trigger.effectType !== "resource_delta") return robots;
  const property = supportPersonalityTriggerResourceProperty(trigger.resource);
  if (!property) return [];
  return robots.filter((robot) => {
    const current = Number(robot[property]) || 0;
    const maximum = supportPersonalityTriggerResourceMax(robot, trigger.resource);
    return tier.value < 0 ? current > SUPPORT_RESOURCE_EPSILON : current < maximum - SUPPORT_RESOURCE_EPSILON;
  });
}

function supportPersonalityTriggerTargets(trigger, tier, context) {
  let candidates = context.robots;
  if (trigger.effectTarget === "source_all" || trigger.effectTarget === "random_source") {
    candidates = context.sources;
  } else if (trigger.effectTarget === "other_same_base" || trigger.effectTarget === "random_other_same_base") {
    const sources = new Set(context.sources);
    candidates = context.robots.filter((robot) => !sources.has(robot));
  }
  candidates = supportPersonalityTriggerEligibleRobots(trigger, tier, candidates);
  const randomTarget = trigger.effectTarget.startsWith("random_");
  if (!randomTarget) return candidates;
  const shuffled = [...candidates];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.slice(0, Math.min(shuffled.length, tier.targetCount));
}

function applySupportPersonalityTriggerEffect(trigger, tier, targets) {
  if (trigger.effectType !== "resource_delta") return [];
  const property = supportPersonalityTriggerResourceProperty(trigger.resource);
  if (!property) return [];
  return targets.filter((robot) => {
    const current = Number(robot[property]) || 0;
    const maximum = supportPersonalityTriggerResourceMax(robot, trigger.resource);
    const next = Math.max(0, Math.min(maximum, current + tier.value));
    if (Math.abs(next - current) <= SUPPORT_RESOURCE_EPSILON) return false;
    robot[property] = next <= SUPPORT_RESOURCE_EPSILON ? 0 : next;
    if (supportRobotResourcesDepleted(robot)) startSupportRobotForcedRecovery(robot);
    return true;
  });
}

function supportPersonalityTriggerMessage(template, context, targets) {
  if (!template) return "";
  return template
    .replaceAll("{base}", context.base.name || "UNKNOWN BASE")
    .replaceAll("{count}", String(context.robots.length))
    .replaceAll("{targets}", targets.map((robot) => supportRobotDisplayName(robot)).join("・"));
}

function processSupportRobotPersonalityTriggers(timing) {
  if (!state || !Array.isArray(ROBOT_PERSONALITY_TRIGGERS)) return [];
  const day = Math.max(1, Math.floor(Number(state.day) || 1));
  const runtime = ensureSupportPersonalityTriggerState();
  const results = [];
  ownedBases().forEach((base) => {
    const robots = supportPersonalityTriggerRobots(base);
    if (!robots.length) return;
    ROBOT_PERSONALITY_TRIGGERS
      .filter((trigger) => trigger.timing === timing && trigger.scope === "base")
      .forEach((trigger) => {
        const sources = robots.filter((robot) => supportRobotHasPersonality(robot, trigger.personalityId));
        if (!sources.length) return;
        const processKey = `${trigger.personalityId}:${trigger.id}:${base.id}`;
        if (Number(runtime.lastProcessed[processKey]) === day) return;
        runtime.lastProcessed[processKey] = day;
        const context = { base, robots, sources };
        const conditionValue = supportPersonalityTriggerConditionValue(trigger, context);
        const tier = supportPersonalityTriggerTier(trigger, conditionValue);
        if (!tier || tier.chance <= 0 || Math.random() >= tier.chance) return;
        const targets = supportPersonalityTriggerTargets(trigger, tier, context);
        const affected = applySupportPersonalityTriggerEffect(trigger, tier, targets);
        if (!affected.length) return;
        results.push({
          triggerId: trigger.id,
          baseId: base.id,
          targets: affected.map((robot) => robot.id),
          message: supportPersonalityTriggerMessage(tier.message, context, affected)
        });
      });
  });
  return results;
}

function supportRobotEfficiencyBreakdown(robot) {
  ensureSupportRobotProfile(robot);
  const maxMorale = SUPPORT_ROBOT_MAX_MORALE;
  const morale = Math.max(0, Math.min(maxMorale, Number(robot.supportMorale) || 0));
  const moraleRatio = maxMorale > 0 ? morale / maxMorale : 0;
  const moraleEfficiency = SUPPORT_MORALE_MIN_EFFICIENCY
    + (1 - SUPPORT_MORALE_MIN_EFFICIENCY) * moraleRatio;
  const assignedTaskTypes = supportRobotAssignedTaskTypes(robot);
  const selfBonus = supportRobotSelfEfficiencyBonus(robot, assignedTaskTypes.length);
  const teamBonus = supportRobotTeamEfficiencyBonus(robot);
  const baseSpeedModifier = Math.max(0.1, Number(supportRobotPersonality(robot).speedMod) || 1);
  const personalityMultiplier = baseSpeedModifier * Math.max(0.1, 1 + selfBonus + teamBonus);
  return {
    assignedTaskTypes,
    assignedTaskCount: assignedTaskTypes.length,
    moraleEfficiency,
    baseSpeedModifier,
    selfBonus,
    teamBonus,
    personalityMultiplier,
    totalEfficiency: moraleEfficiency * personalityMultiplier
  };
}

function supportTaskGrade(device, task) {
  ensureSupportRobotProfile(device);
  const baseGrade = String(supportRobotSkill(device)[task] || "B").toUpperCase();
  const matchedBaseIndex = SUPPORT_GRADE_ORDER.indexOf(baseGrade);
  const baseIndex = matchedBaseIndex >= 0 ? matchedBaseIndex : SUPPORT_GRADE_ORDER.indexOf("B");
  const bonus = Math.max(0, Math.floor(Number(device.supportSkillBonuses?.[task]) || 0));
  return SUPPORT_GRADE_ORDER[Math.min(SUPPORT_GRADE_ORDER.length - 1, baseIndex + bonus)];
}

function supportTaskMultiplier(device, task) {
  return SUPPORT_GRADE_MULTIPLIER[supportTaskGrade(device, task)] || 1;
}

function supportRobotRange(device) {
  const baseRange = Number(FLOOR_DEVICES.support_robot?.radius) || SUPPORT_ROBOT_DEFAULT_RANGE;
  const personality = supportRobotPersonality(device);
  return Math.max(1, Math.round(baseRange * (Number(personality.rangeMod) || 1)));
}

function supportRobotTaskCooldownMultiplier(device, task) {
  return supportRobotPersonalityEffects(device).reduce((multiplier, effect) => {
    if (effect.type !== "task_cooldown" || effect.target !== "self") return multiplier;
    if (effect.tasks.length && !effect.tasks.includes(task)) return multiplier;
    if (!supportRobotEffectThresholdMet(device, effect)) return multiplier;
    return multiplier * Math.max(0.1, Number(effect.value) || 1);
  }, 1);
}

function supportRobotCooldownDays(device, task) {
  const speed = supportTaskMultiplier(device, task)
    * supportRobotMoraleEfficiency(device);
  const personalityMultiplier = supportRobotTaskCooldownMultiplier(device, task);
  return (SUPPORT_TASK_BASE_COOLDOWN[task] || 0.08) * personalityMultiplier / Math.max(0.25, speed);
}

function supportRobotEnergyCost(device, task) {
  const personality = supportRobotPersonality(device);
  const grade = supportTaskMultiplier(device, task);
  return Math.max(1, (SUPPORT_TASK_BASE_COST[task] || 4) * (Number(personality.fuelMod) || 1) / Math.max(0.45, grade));
}

function supportRobotMaxEnergy(device) {
  ensureSupportRobotProfile(device);
  return SUPPORT_ROBOT_MAX_ENERGY;
}

function supportRobotMaxMorale(device) {
  ensureSupportRobotProfile(device);
  return SUPPORT_ROBOT_MAX_MORALE;
}

function supportRobotMoraleEnergyRatio(device) {
  ensureSupportRobotProfile(device);
  return SUPPORT_MORALE_ENERGY_RATIO;
}

function supportRobotMoraleEfficiency(robot) {
  return supportRobotEfficiencyBreakdown(robot).totalEfficiency;
}

function supportRobotMoraleSubstituteCostMultiplier(robot) {
  return supportRobotPersonalityEffects(robot).reduce((multiplier, effect) => {
    if (effect.type !== "morale_substitute_cost" || effect.target !== "self") return multiplier;
    if (!supportRobotEffectThresholdMet(robot, effect)) return multiplier;
    return multiplier * Math.max(0.1, Number(effect.value) || 1);
  }, 1);
}

function supportRobotActionCostPlan(robot, task) {
  ensureSupportRobotProfile(robot);
  const required = Math.max(0, supportRobotEnergyCost(robot, task));
  const energyAvailable = Math.max(0, Number(robot.supportEnergy) || 0);
  const energySpent = Math.min(energyAvailable, required);
  const uncoveredCost = Math.max(0, required - energySpent);
  const ratio = Math.max(0.1, supportRobotMoraleEnergyRatio(robot));
  const moraleAvailable = Math.max(0, Number(robot.supportMorale) || 0);
  const moraleRequired = uncoveredCost / ratio * supportRobotMoraleSubstituteCostMultiplier(robot);
  const moraleSpent = Math.min(moraleAvailable, moraleRequired);
  const hasUsableRemainder = energyAvailable > SUPPORT_RESOURCE_EPSILON
    || moraleAvailable > SUPPORT_RESOURCE_EPSILON;
  return {
    required,
    energySpent,
    moraleSpent,
    affordable: required <= SUPPORT_RESOURCE_EPSILON || hasUsableRemainder
  };
}

function supportRobotChargeBreakDays() {
  return SUPPORT_CHARGE_BREAK_DAYS;
}

function supportRobotChargeMoraleRecovery() {
  return SUPPORT_CHARGE_MORALE_RECOVERY;
}

function supportRobotForcedRecoveryDays() {
  return SUPPORT_FORCED_RECOVERY_DAYS;
}

function supportRobotChargeRemainingDays(robot) {
  return Math.max(0, Number(robot?.supportChargeRemaining) || 0);
}

function supportRobotIsCharging(robot) {
  return supportRobotChargeRemainingDays(robot) > 0;
}

function supportRobotRecoveryMode(robot) {
  if (!supportRobotIsCharging(robot)) return "";
  return robot?.supportRecoveryMode === "forced" ? "forced" : "charge";
}

function supportRobotIsForcedRecovery(robot) {
  return supportRobotRecoveryMode(robot) === "forced";
}

function supportRobotResourcesDepleted(robot) {
  ensureSupportRobotProfile(robot);
  return (Number(robot.supportEnergy) || 0) <= SUPPORT_RESOURCE_EPSILON
    && (Number(robot.supportMorale) || 0) <= SUPPORT_RESOURCE_EPSILON;
}

function startSupportRobotRecovery(robot, days, mode, nodeId = "") {
  if (supportRobotIsCharging(robot)) return false;
  robot.supportChargeRemaining = Math.max(SUPPORT_RESOURCE_EPSILON, Number(days) || 0);
  robot.supportChargeNodeId = String(nodeId || "");
  robot.supportRecoveryMode = mode === "forced" ? "forced" : "charge";
  SUPPORT_TASKS.forEach((task) => {
    robot.supportTaskCooldowns[task] = Math.max(
      Number(robot.supportTaskCooldowns[task]) || 0,
      robot.supportChargeRemaining
    );
  });
  refreshSupportRobotCooldown(robot);
  return true;
}

function startSupportRobotChargeBreak(robot, nodeId = "") {
  ensureSupportRobotProfile(robot);
  if (supportRobotIsCharging(robot) || (Number(robot.supportEnergy) || 0) >= supportRobotMaxEnergy(robot) - 0.0001) {
    return false;
  }
  return startSupportRobotRecovery(robot, supportRobotChargeBreakDays(), "charge", nodeId);
}

function startSupportRobotForcedRecovery(robot) {
  ensureSupportRobotProfile(robot);
  if (!supportRobotResourcesDepleted(robot) || supportRobotIsCharging(robot)) return false;
  robot.supportEnergy = 0;
  robot.supportMorale = 0;
  return startSupportRobotRecovery(robot, supportRobotForcedRecoveryDays(), "forced");
}
function itemGridCenter(item, kind) {
  const size = footprint({ ...item, kind });
  return { x: item.x + (size.width - 1) / 2, y: item.y + (size.height - 1) / 2 };
}

function gridRangeDistance(aX, aY, bX, bY) {
  return Math.abs(Number(aX) - Number(bX)) + Math.abs(Number(aY) - Number(bY));
}

function isWithinGridRange(aX, aY, bX, bY, radius) {
  return gridRangeDistance(aX, aY, bX, bY) <= Number(radius || 0);
}

function gridRangeDistanceToFootprint(originX, originY, item, kind) {
  const size = footprint({ ...item, kind });
  const pointX = Number(originX);
  const pointY = Number(originY);
  const minX = Number(item?.x);
  const minY = Number(item?.y);
  if (![pointX, pointY, minX, minY].every(Number.isFinite)) return Infinity;

  const maxX = minX + Math.max(1, Number(size.width) || 1) - 1;
  const maxY = minY + Math.max(1, Number(size.height) || 1) - 1;
  const deltaX = pointX < minX ? minX - pointX : pointX > maxX ? pointX - maxX : 0;
  const deltaY = pointY < minY ? minY - pointY : pointY > maxY ? pointY - maxY : 0;
  return deltaX + deltaY;
}

function supportRobotCanReach(robot, item, kind) {
  if (!robot?.placed || !item?.placed) return false;
  // Multi-cell equipment is reachable when any occupied grid cell is in range.
  return gridRangeDistanceToFootprint(robot.x, robot.y, item, kind) <= supportRobotRange(robot);
}

function refreshSupportRobotCooldown(robot) {
  ensureSupportRobotProfile(robot);
  robot.supportCooldown = Math.max(
    supportRobotChargeRemainingDays(robot),
    0,
    ...Object.values(robot.supportTaskCooldowns || {})
  );
}

function tickSupportRobotCooldowns(robot, deltaDays) {
  ensureSupportRobotProfile(robot);
  const chargeNodeId = robot.supportChargeNodeId;
  const wasCharging = supportRobotIsCharging(robot);
  const recoveryMode = supportRobotRecoveryMode(robot);
  SUPPORT_TASKS.forEach((task) => {
    robot.supportTaskCooldowns[task] = Math.max(0, (Number(robot.supportTaskCooldowns[task]) || 0) - deltaDays);
  });
  if (wasCharging) {
    robot.supportChargeRemaining = Math.max(0, supportRobotChargeRemainingDays(robot) - deltaDays);
    if (!supportRobotIsCharging(robot)) {
      robot.supportEnergy = supportRobotMaxEnergy(robot);
      robot.supportMorale = recoveryMode === "forced"
        ? supportRobotMaxMorale(robot)
        : Math.min(
          supportRobotMaxMorale(robot),
          (Number(robot.supportMorale) || 0) + supportRobotChargeMoraleRecovery()
        );
      robot.supportChargeNodeId = "";
      robot.supportRecoveryMode = "";
    }
  }
  refreshSupportRobotCooldown(robot);
  return {
    chargeCompleted: wasCharging && !supportRobotIsCharging(robot),
    chargeNodeId,
    recoveryMode
  };
}
function supportRobotCooldownReady(robot, task) {
  ensureSupportRobotProfile(robot);
  return !supportRobotIsCharging(robot)
    && (Number(robot.supportCooldown) || 0) <= 0
    && (Number(robot.supportTaskCooldowns?.[task]) || 0) <= 0;
}

function supportRobotTaskReady(robot, task) {
  return supportRobotCooldownReady(robot, task) && supportRobotActionCostPlan(robot, task).affordable;
}

function supportRobotDailyEffectUsage(robot, effect) {
  ensureSupportRobotProfile(robot);
  const day = Math.max(1, Math.floor(Number(state.day) || 1));
  const key = `${effect.personalityId}:${effect.id}`;
  const previous = robot.supportPersonalityRuntime.dailyEffects[key];
  const usage = Number(previous?.day) === day
    ? { day, count: Math.max(0, Math.floor(Number(previous.count) || 0)) }
    : { day, count: 0 };
  robot.supportPersonalityRuntime.dailyEffects[key] = usage;
  return usage;
}

function applySupportRobotActionSuccessEffects(robot, task) {
  const sameBaseRobots = supportRobotSameBaseRobots(robot);
  if (sameBaseRobots.length <= 1) return [];
  const results = [];
  supportRobotPersonalityEffects(robot).forEach((effect) => {
    if (effect.type !== "action_success_resource") return;
    if (effect.tasks.length && !effect.tasks.includes(task)) return;
    if (!supportRobotEffectThresholdMet(robot, effect)) return;
    const usage = supportRobotDailyEffectUsage(robot, effect);
    if (effect.perDayCap > 0 && usage.count >= effect.perDayCap) return;
    if (effect.chance <= 0 || Math.random() >= effect.chance) return;
    const property = supportPersonalityTriggerResourceProperty(effect.resource);
    if (!property) return;
    const candidates = sameBaseRobots.filter((target) => {
      if (target === robot) return false;
      const current = Number(target[property]) || 0;
      const maximum = supportPersonalityTriggerResourceMax(target, effect.resource);
      return effect.value < 0 ? current > SUPPORT_RESOURCE_EPSILON : current < maximum - SUPPORT_RESOURCE_EPSILON;
    });
    if (!candidates.length) return;

    const targets = [];
    const pool = [...candidates];
    const targetCount = Math.max(1, effect.targetCount || 1);
    while (pool.length && targets.length < targetCount) {
      targets.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    const affected = targets.filter((target) => {
      const current = Number(target[property]) || 0;
      const maximum = supportPersonalityTriggerResourceMax(target, effect.resource);
      const next = Math.max(0, Math.min(maximum, current + effect.value));
      if (Math.abs(next - current) <= SUPPORT_RESOURCE_EPSILON) return false;
      target[property] = next <= SUPPORT_RESOURCE_EPSILON ? 0 : next;
      if (supportRobotResourcesDepleted(target)) startSupportRobotForcedRecovery(target);
      return true;
    });
    if (!affected.length) return;

    usage.count += 1;
    const names = affected.map((target) => supportRobotDisplayName(target)).join("・");
    botActionLog(`BOT // ${supportRobotDisplayName(robot)} encouraged ${names}. MORALE +${formatNumber(effect.value)}`);
    results.push({ effectId: effect.id, targets: affected.map((target) => target.id), value: effect.value });
  });
  return results;
}

function spendSupportRobotAction(robot, task) {
  ensureSupportRobotProfile(robot);
  const costPlan = supportRobotActionCostPlan(robot, task);
  if (!costPlan.affordable) return false;
  const remainingEnergy = Math.max(0, (Number(robot.supportEnergy) || 0) - costPlan.energySpent);
  const remainingMorale = Math.max(0, (Number(robot.supportMorale) || 0) - costPlan.moraleSpent);
  robot.supportEnergy = remainingEnergy <= SUPPORT_RESOURCE_EPSILON ? 0 : remainingEnergy;
  robot.supportMorale = remainingMorale <= SUPPORT_RESOURCE_EPSILON ? 0 : remainingMorale;
  const cooldown = supportRobotCooldownDays(robot, task);
  SUPPORT_TASKS.forEach((entryTask) => {
    robot.supportTaskCooldowns[entryTask] = cooldown;
  });
  refreshSupportRobotCooldown(robot);
  applySupportRobotActionSuccessEffects(robot, task);
  return true;
}

function applySupportRobotPlacementEffects(robot) {
  ensureSupportRobotProfile(robot);
  if (!robot.placed) return [];
  const base = supportRobotBase(robot);
  if (!base) return [];
  const teammates = supportRobotSameBaseRobots(robot).filter((candidate) => candidate !== robot);
  if (!teammates.length) return [];

  const results = [];
  supportRobotPersonalityEffects(robot)
    .filter((effect) => effect.type === "placement_skill_upgrade")
    .forEach((effect) => {
      const effectKey = `${effect.personalityId}:${effect.id}`;
      if (robot.supportPersonalityRuntime.placementEffects[effectKey]) return;
      const eligibleTasks = SUPPORT_TASKS.filter((task) => {
        const ownIndex = SUPPORT_GRADE_ORDER.indexOf(supportTaskGrade(robot, task));
        if (ownIndex < 0 || ownIndex >= SUPPORT_GRADE_ORDER.length - 1) return false;
        return teammates.some((teammate) => SUPPORT_GRADE_ORDER.indexOf(supportTaskGrade(teammate, task)) >= ownIndex);
      });
      if (!eligibleTasks.length) return;

      const task = pick(eligibleTasks);
      const fromGrade = supportTaskGrade(robot, task);
      const fromIndex = SUPPORT_GRADE_ORDER.indexOf(fromGrade);
      const toGrade = SUPPORT_GRADE_ORDER[Math.min(SUPPORT_GRADE_ORDER.length - 1, fromIndex + 1)];
      const rawBaseGrade = String(supportRobotSkill(robot)[task] || "B").toUpperCase();
      const rawBaseIndex = SUPPORT_GRADE_ORDER.indexOf(rawBaseGrade);
      const baseIndex = rawBaseIndex >= 0 ? rawBaseIndex : SUPPORT_GRADE_ORDER.indexOf("B");
      robot.supportSkillBonuses[task] = Math.max(
        Number(robot.supportSkillBonuses[task]) || 0,
        SUPPORT_GRADE_ORDER.indexOf(toGrade) - baseIndex
      );
      robot.supportPersonalityRuntime.placementEffects[effectKey] = {
        baseId: base.id,
        task,
        fromGrade,
        toGrade,
        day: Math.max(1, Math.floor(Number(state.day) || 1))
      };
      const taskLabel = SUPPORT_TASK_LABELS[task] || task;
      botActionLog(`BOT // ${supportRobotDisplayName(robot)} learned ${taskLabel}. ${fromGrade} > ${toGrade}`);
      toast(`${supportRobotDisplayName(robot)}が「見よう見まね」で${taskLabel}技能を${toGrade}へ上げました。`);
      results.push({ effectId: effect.id, task, fromGrade, toGrade });
    });
  return results;
}
function supportRobotExists() {
  return ownedBases().some((base) => base.floorDevices?.some((device) => device.type === "support_robot"));
}


function hasAnySupportOS() {
  return Boolean(state.supportOS?.harvest || state.supportOS?.planting || state.supportOS?.cleaning || state.supportOS?.storage);
}

function hasAllBasicSupportOS() {
  return Boolean(state.supportOS?.harvest && state.supportOS?.planting && state.supportOS?.cleaning);
}

function findSupportRobotById(robotId) {
  for (const base of ownedBases()) {
    const robot = base.floorDevices?.find((device) => device.id === robotId && device.type === "support_robot");
    if (robot) return robot;
  }
  return null;
}

function preferredSupportRobotPosition(base, item) {
  const candidates = [
    { x: Math.min(base.cols - 1, 2), y: Math.min(base.rows - 1, 1) },
    { x: Math.min(base.cols - 1, 2), y: 0 },
    { x: Math.min(base.cols - 1, 1), y: Math.min(base.rows - 1, 1) },
    { x: base.cols - 1, y: base.rows - 1 }
  ];
  for (const pos of candidates) {
    if (pos.x >= 0 && pos.y >= 0 && canPlace(item, pos.x, pos.y, item.id)) return pos;
  }
  return firstAvailablePosition(item);
}

function hasCompletedCommsTrigger(trigger) {
  const commCompleted = COMM_EVENTS.some((event) => event.trigger === trigger && state.commsChoices?.[event.id]);
  const storyCompleted = STORY_EVENTS.some((event) => event.trigger === trigger && state.storyChoices?.[event.id]);
  return commCompleted || storyCompleted;
}

function grantFloorDevice(type, options = {}) {
  if (!FLOOR_DEVICES[type]) return false;
  if (type === "support_robot") {
    if (supportRobotExists()) {
      state.supportRobotGranted = true;
      return false;
    }
    state.supportRobotGranted = true;
  }
  const device = createFloorDevice(type, type === "support_robot"
    ? {
        supportBlueprintPreset: typeof options.supportBlueprintPreset === "string"
          ? options.supportBlueprintPreset
          : "empty"
      }
    : options);
  if (type === "support_robot") {
    device.isInitialSupportRobot = true;
    device.robotName = "サポートロボット";
  }
  currentFloorDevices().push(device);
  if (type === "support_robot") supportRobotRoster();
  const item = { ...device, kind: "device" };
  const position = preferredSupportRobotPosition(currentBase(), item);
  if (position) {
    Object.assign(device, position, { placed: true });
    if (type === "support_robot") applySupportRobotPlacementEffects(device);
  }
  selectedDeviceId = null;
  placementSelection = null;
  if (type === "support_robot" && device.placed && device.isInitialSupportRobot) {
    queueSupportRobotTalkFlag("initial_support_robot_placed", {
      robotId: device.id,
      baseId: currentBase().id
    }, device.id);
  }
  return true;
}

function ensureSupportRobotGrant() {
  if (!state.supportRobotGranted && hasCompletedCommsTrigger("first_place") && grantFloorDevice("support_robot")) saveGame();
}

function footprint(item) {
  const definition = item.kind === "device" || FLOOR_DEVICES[item.type]
    ? FLOOR_DEVICES[item.type]
    : GROW_UNITS[item.type];
  return { width: definition.width, height: definition.height };
}

function facilityCameraSide() {
  return facilityCameraViewSide === "reverse" ? "reverse" : "front";
}

function isFacilityCameraReversed() {
  return facilityCameraSide() === "reverse";
}

function facilityCameraCell(x, y, base = currentBase()) {
  if (!isFacilityCameraReversed()) return { x, y };
  return {
    x: base.cols - 1 - x,
    y: base.rows - 1 - y
  };
}

function facilityCameraItemPlacement(item, kind, base = currentBase()) {
  const size = footprint({ ...item, kind });
  if (!isFacilityCameraReversed()) return { x: item.x, y: item.y, size };
  return {
    x: base.cols - item.x - size.width,
    y: base.rows - item.y - size.height,
    size
  };
}

function equipmentVisualDepth(item, kind, base = currentBase()) {
  const placement = facilityCameraItemPlacement(item, kind, base);
  const { size } = placement;
  const anchorX = placement.x + (size.width - 1) / 2;
  const anchorY = placement.y + size.height - 1;
  const footprintBias = Math.max(0, size.width - 1) * 0.35;
  return Math.round((anchorX + anchorY) * 100 + anchorY * 10 - footprintBias);
}

function canPlace(item, x, y, ignoreId = null) {
  const base = currentBase();
  const size = footprint(item);
  if (x < 0 || y < 0 || x + size.width > base.cols || y + size.height > base.rows) return false;
  for (let offsetY = 0; offsetY < size.height; offsetY += 1) {
    for (let offsetX = 0; offsetX < size.width; offsetX += 1) {
      if (isBlockedCell(base, x + offsetX, y + offsetY)) return false;
    }
  }
  return !allPlacedObjects().some((placed) => {
    if (placed.id === ignoreId) return false;
    const other = footprint(placed);
    return x < placed.x + other.width
      && x + size.width > placed.x
      && y < placed.y + other.height
      && y + size.height > placed.y;
  });
}

function firstAvailablePosition(item) {
  const base = currentBase();
  const size = footprint(item);
  for (let y = 0; y <= base.rows - size.height; y += 1) {
    for (let x = 0; x <= base.cols - size.width; x += 1) {
      if (canPlace(item, x, y, item.id)) return { x, y };
    }
  }
  return null;
}

function migrateLegacyPlacements() {
  [...currentShelves(), ...currentFloorDevices()].forEach((item) => {
    const needsMigration = item.needsPlacementMigration;
    delete item.needsPlacementMigration;
    if (!needsMigration) return;
    if (item.placed && canPlace(item, item.x, item.y, item.id)) return;
    item.placed = false;
    item.x = null;
    item.y = null;
    const position = firstAvailablePosition(item);
    if (position) Object.assign(item, position, { placed: true });
  });
}

function enforceBaseRestrictions() {
  currentShelves().forEach((unit) => {
    if (unit.placed && !canPlace({ ...unit, kind: "unit" }, unit.x, unit.y, unit.id)) {
      unit.placed = false;
      unit.x = null;
      unit.y = null;
    }
  });
  currentFloorDevices().forEach((device) => {
    if (device.placed && !canPlace({ ...device, kind: "device" }, device.x, device.y, device.id)) {
      device.placed = false;
      device.x = null;
      device.y = null;
    }
  });
}

function getUnitEffects(unit) {
  if (!unit.placed) return { light: false, fan: false };
  const size = footprint(unit);
  const centerX = unit.x + (size.width - 1) / 2;
  const centerY = unit.y + (size.height - 1) / 2;
  const base = ownedBases().find((entry) => entry.shelves.some((shelf) => shelf.id === unit.id)) || currentBase();
  const affected = (type) => base.floorDevices.some((device) => {
    if (!device.placed || device.type !== type) return false;
    const radius = FLOOR_DEVICES[type].radius;
    const deviceCenter = itemGridCenter(device, "device");
    return isWithinGridRange(centerX, centerY, deviceCenter.x, deviceCenter.y, radius);
  });
  return { light: affected("light"), fan: affected("fan") };
}

function unitTagEffects(unit) {
  return combinedEffects(unit.tags || [], EQUIPMENT_TAGS);
}

function baseTagEffects(base) {
  return combinedEffects(base.tags || [], BASE_TAGS);
}

function dirtyEfficiency(item) {
  const dirt = item.dirt || 0;
  if (dirt < 45) return 1;
  return Math.max(0.68, 1 - (dirt - 45) / 170);
}

function environmentScore(cropId, base) {
  const target = CROP_ENVIRONMENT[cropId] || DEFAULT_ENVIRONMENT;
  const env = base.environment || DEFAULT_ENVIRONMENT;
  const baseEffects = baseTagEffects(base);
  const co2Tolerance = baseEffects.co2Tolerance || 1;
  const tempPenalty = Math.abs(env.temp - target.temp) / 18;
  const humidityPenalty = Math.abs(env.humidity - target.humidity) / 70;
  const co2Penalty = Math.abs(env.co2 - target.co2) / (900 * co2Tolerance);
  const score = 1 - (tempPenalty + humidityPenalty + co2Penalty) / 3;
  return Math.max(0.85, Math.min(1.12, 0.92 + score * 0.18));
}

function cropBaseTagGrowth(cropId, base) {
  const crop = CROPS[cropId];
  const effects = baseTagEffects(base);
  let mod = 1;
  if (["lettuce", "spinach", "basil"].includes(cropId)) mod *= effects.leafGrowth || 1;
  if (crop.category === "luxury" || cropId === "tomato") mod *= effects.fruitGrowth || 1;
  if (crop.category === "medical") mod *= effects.herbGrowth || 1;
  return mod;
}

function unitPerformance(unit, cropId, base) {
  const effects = unitTagEffects(unit);
  const baseEffects = baseTagEffects(base);
  return {
    growth: (effects.growthMod || 1) * dirtyEfficiency(unit) * environmentScore(cropId, base) * cropBaseTagGrowth(cropId, base),
    water: (effects.waterMod || 1) * (baseEffects.waterMod || 1),
    nutrient: effects.nutrientMod || 1,
    upkeep: effects.upkeepMod || 1,
    dirt: (effects.dirtMod || 1) * (baseEffects.dirtMod || 1),
    qualityBonus: (effects.qualityBonus || 0) + (baseEffects.herbQuality && CROPS[cropId]?.category === "medical" ? baseEffects.herbQuality : 0)
  };
}

function formatNumber(value) {
  return Math.round(value).toLocaleString("ja-JP");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function cropEventMultiplier(cropId) {
  if (!state.event) return 1;
  return (state.event.allCropMod || 1) * ((state.event.cropMods && state.event.cropMods[cropId]) || 1);
}

function cropPrimaryMarket(cropId) {
  return CROPS[cropId]?.primaryMarket || CROPS[cropId]?.unlock || "lower";
}

function isMarketSpecialty(cropId, marketId) {
  if (cropId === "tomato" && (marketId === "lower" || marketId === "upper")) return true;
  return cropPrimaryMarket(cropId) === marketId;
}

function marketAxes(marketId) {
  const profile = MARKET_SIGNALS[marketId];
  return profile ? [profile.axisA, profile.axisB].filter(Boolean) : [];
}

function ensureMarketSignalsState() {
  state.marketSignals ||= {};
  Object.entries(MARKET_SIGNALS).forEach(([marketId, profile]) => {
    state.marketSignals[marketId] ||= {};
    marketAxes(marketId).forEach((axis) => {
      const value = Number(state.marketSignals[marketId][axis]);
      state.marketSignals[marketId][axis] = Number.isFinite(value)
        ? clamp(value, MARKET_SIGNAL_MIN, MARKET_SIGNAL_MAX)
        : randomBetween(MARKET_SIGNAL_START_MIN, MARKET_SIGNAL_START_MAX);
    });
  });
}

function ensureMarketEventOffsetsState() {
  state.marketEventOffsets = Array.isArray(state.marketEventOffsets) ? state.marketEventOffsets : [];
  state.marketEventOffsets = state.marketEventOffsets
    .map((offset) => ({
      key: String(offset.key || ""),
      groupKey: String(offset.groupKey || offset.key || ""),
      eventId: String(offset.eventId || ""),
      marketId: String(offset.marketId || ""),
      axis: String(offset.axis || ""),
      cropIds: Array.isArray(offset.cropIds) ? offset.cropIds : toList(offset.cropIds),
      signalDelta: toNumber(offset.signalDelta, 0),
      currentDelta: toNumber(offset.currentDelta, 0),
      recoveryDays: Math.max(1, Math.round(toNumber(offset.recoveryDays, MARKET_EVENT_DEFAULT_RECOVERY_DAYS))),
      priceBoost: Math.max(1, toNumber(offset.priceBoost, 1)),
      endDay: Math.max(1, Math.round(toNumber(offset.endDay, Number(state.day) || 1)))
    }))
    .filter((offset) => offset.key && offset.marketId && offset.axis && Math.abs(offset.currentDelta) > MARKET_EVENT_OFFSET_EPSILON);
}

function driftMarketSignalsForDay() {
  ensureMarketSignalsState();
  Object.entries(MARKET_SIGNALS).forEach(([marketId]) => {
    marketAxes(marketId).forEach((axis) => {
      const current = Number(state.marketSignals[marketId][axis]) || 0.5;
      state.marketSignals[marketId][axis] = clamp(
        current < MARKET_SIGNAL_NATURAL_CAP ? current + MARKET_SIGNAL_NATURAL_DRIFT : current,
        MARKET_SIGNAL_MIN,
        MARKET_SIGNAL_MAX
      );
    });
  });
}

function scheduleEntryAbsoluteRange(entry, day = Number(state.day) || 1) {
  const cycle = Math.floor((Math.max(1, Math.round(day)) - 1) / SCHEDULE_DAYS);
  const startDay = cycle * SCHEDULE_DAYS + scheduleClampDay(entry.startDay);
  const endDay = startDay + Math.max(1, Math.round(Number(entry.duration) || 1)) - 1;
  return { cycle, startDay, endDay };
}

function scheduleSignalDelta(entry) {
  const hasExplicit = entry.signalDelta !== undefined && entry.signalDelta !== null && String(entry.signalDelta).trim() !== "";
  const explicit = hasExplicit ? Number(entry.signalDelta) : NaN;
  if (Number.isFinite(explicit)) return clamp(explicit, -0.65, 0.65);
  const boost = Number(entry.signalBoost);
  if (Number.isFinite(boost) && boost > 0) return clamp((boost - 0.5) * 0.7, -0.45, 0.45);
  if (entry.strength === "rare") return 0.3;
  if (entry.strength === "high") return 0.26;
  return 0.22;
}

function eventOffsetKey(entry, range, axis) {
  return [range.startDay, entry.id, entry.marketId, axis].join(":");
}

function updateMarketEventOffsets(day = Number(state.day) || 1) {
  if (state?.debugMode) {
    state.marketEventOffsets = [];
    return;
  }
  ensureMarketEventOffsetsState();
  const offsets = new Map(state.marketEventOffsets.map((offset) => [offset.key, offset]));
  const activeKeys = new Set();
  ensureMonthlyScheduleBasics(state.monthlySchedule || []).forEach((entry) => {
    const range = scheduleEntryAbsoluteRange(entry, day);
    if (day < range.startDay || day > range.endDay) return;
    const signalDelta = scheduleSignalDelta(entry);
    const recoveryDays = Math.max(1, Math.round(toNumber(entry.recoveryDays, MARKET_EVENT_DEFAULT_RECOVERY_DAYS)));
    const priceBoost = Math.max(1, toNumber(entry.priceBoost, 1));
    const cropIds = scheduleCropIds(entry);
    const groupKey = [range.startDay, entry.id, entry.marketId].join(":");
    scheduleAxisList(entry).forEach((axis) => {
      if (!axis) return;
      const key = eventOffsetKey(entry, range, axis);
      activeKeys.add(key);
      offsets.set(key, {
        key,
        groupKey,
        eventId: entry.id,
        marketId: entry.marketId,
        axis,
        cropIds,
        signalDelta,
        currentDelta: signalDelta,
        recoveryDays,
        priceBoost,
        endDay: range.endDay
      });
    });
  });

  offsets.forEach((offset, key) => {
    if (activeKeys.has(key)) return;
    const current = Number(offset.currentDelta) || 0;
    const baseDelta = Number(offset.signalDelta) || current;
    const step = Math.abs(baseDelta) / Math.max(1, Number(offset.recoveryDays) || MARKET_EVENT_DEFAULT_RECOVERY_DAYS);
    if (current > 0) offset.currentDelta = Math.max(0, current - step);
    else if (current < 0) offset.currentDelta = Math.min(0, current + step);
  });

  state.marketEventOffsets = Array.from(offsets.values())
    .filter((offset) => Math.abs(Number(offset.currentDelta) || 0) > MARKET_EVENT_OFFSET_EPSILON);
}

function marketSignalOffsetValue(marketId, axis) {
  ensureMarketEventOffsetsState();
  return state.marketEventOffsets
    .filter((offset) => offset.marketId === marketId && offset.axis === axis)
    .reduce((sum, offset) => sum + (Number(offset.currentDelta) || 0), 0);
}

function marketSignalValue(marketId, axis) {
  ensureMarketSignalsState();
  const base = Number(state.marketSignals?.[marketId]?.[axis]);
  return clamp((Number.isFinite(base) ? base : 0.5) + marketSignalOffsetValue(marketId, axis), MARKET_SIGNAL_MIN, MARKET_SIGNAL_MAX);
}

function eventOffsetStrength(offset) {
  const signalDelta = Math.abs(Number(offset.signalDelta) || 0);
  const currentDelta = Math.abs(Number(offset.currentDelta) || 0);
  return signalDelta > 0 ? clamp(currentDelta / signalDelta, 0, 1) : clamp(currentDelta, 0, 1);
}

function applyMarketSupplyEffect(cropId, marketId, qty = 1) {
  const profile = MARKET_SIGNALS[marketId];
  const effect = MARKET_SUPPLY_EFFECTS[marketId]?.[cropId];
  if (!profile || !effect) return null;
  ensureMarketSignalsState();
  const marketSignals = state.marketSignals[marketId];
  const rawAmount = Math.max(1, Number(qty) || 1);
  const amount = Math.pow(rawAmount, MARKET_SUPPLY_EFFECT_EXPONENT);
  const changes = [];
  [
    [profile.axisA, effect.axisAEffect],
    [profile.axisB, effect.axisBEffect]
  ].forEach(([axis, perUnit]) => {
    if (!axis || !Number.isFinite(Number(perUnit)) || Number(perUnit) === 0) return;
    const before = Number(marketSignals[axis]) || 0.5;
    const delta = clamp(Number(perUnit) * amount, -MARKET_SUPPLY_EFFECT_MAX_DELTA, MARKET_SUPPLY_EFFECT_MAX_DELTA);
    const after = clamp(before + delta, MARKET_SIGNAL_MIN, MARKET_SIGNAL_MAX);
    marketSignals[axis] = after;
    changes.push({ axis, before, after, delta: after - before });
  });
  return changes.length ? changes : null;
}

function cropDemandMultiplier(cropId, marketId = selectedMarket) {
  const profile = MARKET_SIGNALS[marketId];
  const response = CROP_MARKET_RESPONSE[marketId]?.[cropId];
  if (!profile || !response || !isMarketSpecialty(cropId, marketId)) return 1;
  const axisA = marketSignalValue(marketId, profile.axisA);
  const axisB = marketSignalValue(marketId, profile.axisB);
  const sharedHigh = Math.max(0, Math.min(axisA, axisB) - 0.5) * 2;
  const sharedLow = Math.max(0, 0.5 - Math.max(axisA, axisB)) * 2;
  const shared = response.synergyMode === "lowLow" ? sharedLow : sharedHigh;
  const multiplier = 1
    + (axisA - 0.5) * response.axisAWeight
    + (axisB - 0.5) * response.axisBWeight
    + shared * response.synergy;
  return clamp(multiplier, response.minMultiplier, response.maxMultiplier);
}

function cropDemandNote(cropId, marketId = selectedMarket) {
  if (!isMarketSpecialty(cropId, marketId)) {
    if (marketId === "rebel") return "下層市場基準の1.5倍で固定";
    if (marketId !== "medical" && marketId !== "lower") return "下層市場基準の半額で固定";
    if (marketId === "medical") return "医療需要の影響なし";
  }
  const note = CROP_MARKET_RESPONSE[marketId]?.[cropId]?.note || "";
  return scheduleCropEventMultiplier(cropId, marketId) > 1
    ? (note ? `${note} / LOWNET噂補正` : "LOWNET噂補正")
    : note;
}


function scheduleClampDay(day) {
  return Math.max(1, Math.min(SCHEDULE_DAYS, Math.round(Number(day) || 1)));
}

function scheduleCalendarDay(day = state?.day || 1) {
  const absoluteDay = Math.max(1, Math.round(Number(day) || 1));
  return ((absoluteDay - 1) % SCHEDULE_DAYS) + 1;
}

function shouldRefreshMonthlyScheduleForDay(day = state?.day || 1) {
  const absoluteDay = Math.max(1, Math.round(Number(day) || 1));
  return absoluteDay > 1 && scheduleCalendarDay(absoluteDay) === 1;
}

function scheduleJitterDay(day, range = 2) {
  return scheduleClampDay(day + Math.floor(Math.random() * (range * 2 + 1)) - range);
}

function scheduleRumorDefinitions(type = "basic") {
  return SCHEDULE_RUMORS.filter((entry) => (entry.type || "basic") === type);
}

function scheduleDefinition(entryId) {
  return SCHEDULE_RUMORS.find((entry) => entry.id === entryId) || null;
}

function normalizeScheduleEntry(entry = {}) {
  const definition = scheduleDefinition(entry.id);
  const merged = definition ? { ...entry, ...definition } : { ...entry };
  if (definition && (definition.type || "basic") === "rare" && Number.isFinite(Number(entry.startDay))) {
    merged.startDay = Number(entry.startDay);
  }
  merged.type ||= "basic";
  merged.axes = Array.isArray(merged.axes) ? merged.axes : toList(merged.axes || merged.axis);
  merged.cropIds = Array.isArray(merged.cropIds) ? merged.cropIds : toList(merged.cropIds || merged.crops || merged.cropId);
  merged.startDay = scheduleClampDay(merged.startDay);
  merged.duration = Math.max(1, Math.round(Number(merged.duration) || 1));
  merged.chance = Number.isFinite(Number(merged.chance)) ? Number(merged.chance) : (merged.type === "rare" ? 0.45 : 1);
  merged.jitter = Math.max(0, Math.round(Number(merged.jitter) || 0));
  merged.signalBoost = Number.isFinite(Number(merged.signalBoost)) ? Number(merged.signalBoost) : 0;
  merged.priceBoost = Number.isFinite(Number(merged.priceBoost)) ? Number(merged.priceBoost) : 0;
  return merged;
}

function ensureMonthlyScheduleBasics(schedule = []) {
  const knownIds = new Set(SCHEDULE_RUMORS.map((entry) => entry.id));
  const entries = (Array.isArray(schedule) ? schedule : [])
    .map(normalizeScheduleEntry)
    .filter((entry) => entry.id && knownIds.has(entry.id));
  const seen = new Set(entries.map((entry) => entry.id));
  scheduleRumorDefinitions("basic").forEach((entry) => {
    if (!seen.has(entry.id)) entries.push(normalizeScheduleEntry({ ...entry, certainty: "known" }));
  });
  return entries.sort((a, b) => a.startDay - b.startDay || String(a.id).localeCompare(String(b.id)));
}

function generateMonthlySchedule() {
  const entries = scheduleRumorDefinitions("basic").map((entry) => normalizeScheduleEntry({ ...entry, certainty: "known" }));
  scheduleRumorDefinitions("rare").forEach((entry) => {
    const chance = Number.isFinite(Number(entry.chance)) ? Number(entry.chance) : 0.45;
    if (Math.random() < chance) {
      entries.push(normalizeScheduleEntry({ ...entry, startDay: scheduleJitterDay(entry.startDay, entry.jitter || 2), certainty: "rumor" }));
    }
  });
  if (entries.length > 5 && !entries.some((entry, index) => entries.some((other, otherIndex) => otherIndex !== index && scheduleEntryDays(other).includes(entry.startDay)))) {
    entries[entries.length - 1].startDay = entries[1].startDay;
  }
  return ensureMonthlyScheduleBasics(entries);
}

function scheduleEntryDays(entry) {
  return Array.from({ length: Math.max(1, Number(entry.duration) || 1) }, (_, index) => Number(entry.startDay) + index).filter((day) => day >= 1 && day <= SCHEDULE_DAYS);
}

function scheduleEntriesForDay(day) {
  return (state.monthlySchedule || []).map(normalizeScheduleEntry).filter((entry) => scheduleEntryDays(entry).includes(day));
}

function scheduleSignalBoost(entry) {
  if (Number(entry.signalBoost) > 0) return clamp(Number(entry.signalBoost), 0, 1);
  if (entry.strength === "rare") return 0.94;
  if (entry.strength === "high") return 0.9;
  return 0.84;
}

function schedulePriceBoost(entry) {
  if (Number(entry.priceBoost) > 0) return Math.max(1, Number(entry.priceBoost));
  if (entry.strength === "rare") return 1.65;
  if (entry.strength === "high") return 1.8;
  return 1.55;
}

function scheduleCropEventMultiplier(cropId, marketId = selectedMarket) {
  ensureMarketEventOffsetsState();
  const groups = new Map();
  state.marketEventOffsets.forEach((offset) => {
    if (offset.marketId !== marketId || !offset.cropIds.includes(cropId)) return;
    const strength = eventOffsetStrength(offset);
    const current = groups.get(offset.groupKey) || { strength: 0, priceBoost: 1 };
    current.strength = Math.max(current.strength, strength);
    current.priceBoost = Math.max(current.priceBoost, Number(offset.priceBoost) || 1);
    groups.set(offset.groupKey, current);
  });
  let multiplier = 1;
  groups.forEach((entry) => {
    multiplier = Math.max(multiplier, 1 + (entry.priceBoost - 1) * entry.strength);
  });
  return multiplier;
}

function activeScheduleEntries(day = state.day) {
  return scheduleEntriesForDay(scheduleCalendarDay(day));
}

function applyScheduleMarketSignals() {
  ensureMarketSignalsState();
  updateMarketEventOffsets();
}

function scheduleAxisList(entry) {
  return Array.isArray(entry?.axes) ? entry.axes : toList(entry?.axes || entry?.axis);
}

function scheduleCropIds(entry) {
  return Array.isArray(entry?.cropIds) ? entry.cropIds : toList(entry?.cropIds || entry?.crops || entry?.cropId);
}

function marketAxisLabels(marketId, axes) {
  const profile = MARKET_SIGNALS[marketId];
  return toList(axes).map((axis) => {
    if (!profile) return axis || "---";
    if (profile.axisA === axis) return profile.axisALabel;
    if (profile.axisB === axis) return profile.axisBLabel;
    return axis || "---";
  }).filter(Boolean);
}

function marketAxisLabel(marketId, axis) {
  return marketAxisLabels(marketId, axis).join(" / ") || "---";
}

function scheduleCropLabel(entry) {
  const names = scheduleCropIds(entry).map((cropId) => CROPS[cropId]?.name || cropId).filter(Boolean);
  return names.length ? names.join(" / ") : "---";
}

function scheduleMarketLabel(entry) {
  return MARKETS[entry.marketId]?.name || entry.marketId || "---";
}

function scheduleStrengthLabel(strength) {
  if (strength === "rare") return "RARE";
  if (strength === "high") return "HIGH";
  return "WATCH";
}


function findScheduleEntry(entryId) {
  const entry = (state.monthlySchedule || []).find((candidate) => candidate.id === entryId) || null;
  return entry ? normalizeScheduleEntry(entry) : null;
}

function scheduleDayRange(entry) {
  const endDay = Number(entry.startDay) + Math.max(1, Number(entry.duration) || 1) - 1;
  return "DAY " + String(entry.startDay).padStart(2, "0") + (endDay !== Number(entry.startDay) ? "-" + String(endDay).padStart(2, "0") : "");
}

function scheduleDetailMarkup(entry) {
  const axisLabel = marketAxisLabel(entry.marketId, scheduleAxisList(entry));
  return '<div class="schedule-detail-card ' + (entry.strength || 'mid') + '">'
    + '<div class="schedule-detail-meta"><span>' + escapeHtml(scheduleDayRange(entry)) + '</span><strong>' + escapeHtml(scheduleStrengthLabel(entry.strength)) + '</strong></div>'
    + '<p class="schedule-detail-rumor">' + escapeHtml(entry.rumor) + '</p>'
    + '<dl><dt>CROP</dt><dd>' + escapeHtml(scheduleCropLabel(entry)) + '</dd><dt>MARKET</dt><dd>' + escapeHtml(scheduleMarketLabel(entry)) + '</dd><dt>SIGNAL</dt><dd>' + escapeHtml(axisLabel) + '</dd></dl>'
    + '<blockquote>' + escapeHtml(entry.comment) + '</blockquote>'
    + '</div>';
}

function showScheduleEntryDetail(entryId, sourceElement = null) {
  const entry = findScheduleEntry(entryId);
  if (!entry) return;
  if (sourceElement) {
    sourceElement.classList.remove("schedule-chip-pulse");
    void sourceElement.offsetWidth;
    sourceElement.classList.add("schedule-chip-pulse");
  }
  playSound("tab_switch", 0.12);
  window.setTimeout(() => {
    showModal("LOWNET RUMOR", entry.title, scheduleDetailMarkup(entry), true);
    document.getElementById("modal-reset").style.display = "none";
  }, 170);
}

function rerollMonthlySchedule() {
  if (state.money < SCHEDULE_REROLL_COST) {
    toast("Credits insufficient for reinvestigation.", "warning");
    rejectFeedback();
    return;
  }
  state.money -= SCHEDULE_REROLL_COST;
  addRadarSuspicion(radarPurchaseSuspicion(SCHEDULE_REROLL_COST));
  state.monthlySchedule = generateMonthlySchedule();
  applyScheduleMarketSignals();
  state.log = "LOWNET rumors reinvestigated. Monthly schedule updated.";
  playSound("market_select", 0.22);
  saveGame();
  render();
}

function requestScheduleReroll() {
  openConfirmWidget({
    kicker: "LOWNET RECHECK",
    title: "\u518d\u8abf\u67fb",
    copy: "\u20a1" + SCHEDULE_REROLL_COST + "\u3092\u652f\u6255\u3044\u3001\u6708\u9593\u30b9\u30b1\u30b8\u30e5\u30fc\u30eb\u306e\u5642\u3092\u518d\u8abf\u67fb\u3057\u307e\u3059\u3002",
    confirmText: "\u518d\u8abf\u67fb",
    onConfirm: rerollMonthlySchedule
  });
}
function renderSchedule() {
  const calendar = document.getElementById("schedule-calendar");
  const summary = document.getElementById("schedule-summary");
  if (!calendar) return;
  state.monthlySchedule = ensureMonthlyScheduleBasics(Array.isArray(state.monthlySchedule) && state.monthlySchedule.length ? state.monthlySchedule : generateMonthlySchedule());
  const entries = state.monthlySchedule;
  const rareCount = entries.filter((entry) => entry.strength === "rare").length;
  if (summary) summary.innerHTML = '<span>RUMORS</span><strong>' + entries.length + '</strong><span>RARE</span><strong>' + rareCount + '</strong><button class="secondary-button schedule-reroll-button" data-reroll-schedule type="button" ' + (state.money < SCHEDULE_REROLL_COST ? 'disabled' : '') + '>\u518d\u8abf\u67fb \u20a1' + SCHEDULE_REROLL_COST + '</button>';
  calendar.innerHTML = Array.from({ length: SCHEDULE_DAYS }, (_, index) => {
    const day = index + 1;
    const dayEntries = scheduleEntriesForDay(day);
    const calendarToday = scheduleCalendarDay(state.day);
    const isToday = day === calendarToday;
    const isPast = day < calendarToday;
    const dayClass = 'schedule-day ' + (isToday ? 'today ' : '') + (isPast ? 'past ' : '') + (dayEntries.length ? 'has-rumor' : '');
    const chips = dayEntries.map((entry) => '<button class="schedule-chip ' + (entry.strength || 'mid') + '" data-schedule-entry="' + escapeHtml(entry.id) + '" type="button">' + escapeHtml(scheduleStrengthLabel(entry.strength)) + ' // ' + escapeHtml(scheduleCropLabel(entry)) + '</button>').join('');
    return '<article class="' + dayClass.trim() + '"><header><span>DAY</span><strong>' + String(day).padStart(2, "0") + '</strong></header><div class="schedule-day-events">' + chips + '</div></article>';
  }).join('');
}
function baseMarketUnitPrice(batch, marketId = selectedMarket, options = {}) {
  const crop = CROPS[batch.crop];
  const quality = QUALITY[batch.quality];
  let price = crop.basePrice
    * quality.multiplier
    * (MARKETS[marketId].multipliers[batch.crop] || 0.4)
    * state.marketFluctuation[batch.crop]
    * (options.ignoreDemand ? 1 : cropDemandMultiplier(batch.crop, marketId))
    * (options.ignoreDemand ? 1 : scheduleCropEventMultiplier(batch.crop, marketId))
    * cropEventMultiplier(batch.crop);

  if (isInventoryBatchDegraded(batch)) price *= 0.5;
  if (marketId === "upper" && batch.quality === "C") price *= 0.65;
  if (state.event && state.event.fee) price *= (1 - state.event.fee);
  return price;
}

function lowerMarketReferencePrice(batch) {
  return baseMarketUnitPrice(batch, "lower");
}

function getUnitPrice(batch, marketId = selectedMarket) {
  let price;
  if (marketId !== "medical" && marketId !== "lower" && !isMarketSpecialty(batch.crop, marketId)) {
    price = lowerMarketReferencePrice(batch) * (marketId === "rebel" ? 1.5 : 0.5);
  } else {
    price = baseMarketUnitPrice(batch, marketId);
  }
  return Math.max(1, Math.round(price));
}

function getQuote(cropId, marketId = selectedMarket) {
  return getUnitPrice({ crop: cropId, quality: "B", degraded: false }, marketId);
}

function bestAvailableQuote(cropOrBatch) {
  const batch = typeof cropOrBatch === "string"
    ? { crop: cropOrBatch, quality: "B", degraded: false }
    : cropOrBatch;
  if (!batch?.crop) return 1;
  const prices = Object.keys(MARKETS)
    .filter((marketId) => canSellCropToMarket(batch.crop, marketId))
    .map((marketId) => getUnitPrice(batch, marketId));
  return Math.max(1, ...prices);
}

function unitCount(type) {
  return ownedBases().reduce((sum, base) => sum + base.shelves.filter((unit) => unit.type === type).length, 0);
}

function growUnitPrice(type) {
  const definition = GROW_UNITS[type];
  const escalation = type === "pod" ? 10 : type === "box" ? 40 : 150;
  return definition.price + unitCount(type) * escalation;
}

function totalGrowSlots() {
  return ownedBases().reduce((sum, base) => sum + base.shelves.reduce((unitSum, unit) => unitSum + unit.slots.length, 0), 0);
}

function resourceCartridgeCount(resource) {
  return Math.max(0, Math.floor(Number(state?.resourceCartridges?.[resource]) || 0));
}

function repairResourceCartridges() {
  let repaired = false;
  const existing = state.resourceCartridges;
  if (!existing || typeof existing !== "object" || Array.isArray(existing)) {
    state.resourceCartridges = {};
    Object.keys(RESOURCE_BASE_CAPACITY).forEach((resource) => {
      const legacyCapacity = Math.max(
        RESOURCE_BASE_CAPACITY[resource],
        Number(state[resource + "Capacity"]) || 0,
        Number(state[resource]) || 0
      );
      state.resourceCartridges[resource] = Math.max(
        0,
        Math.ceil((legacyCapacity - RESOURCE_BASE_CAPACITY[resource]) / RESOURCE_LEGACY_CARTRIDGE_CAPACITY)
      );
    });
    return true;
  }
  Object.keys(RESOURCE_BASE_CAPACITY).forEach((resource) => {
    const normalized = resourceCartridgeCount(resource);
    if (existing[resource] !== normalized) {
      existing[resource] = normalized;
      repaired = true;
    }
  });
  return repaired;
}

function resourceCapacityLimit(resource) {
  const baseCapacity = Math.max(0, Number(RESOURCE_BASE_CAPACITY[resource]) || 0);
  const current = Math.max(0, Number(state?.[resource]) || 0);
  if (state?.debugMode) {
    return Math.max(baseCapacity, current, Number(state?.[resource + "Capacity"]) || 0);
  }
  // Old saves can temporarily retain resources above the new fixed capacity without losing them.
  return Math.max(baseCapacity, current);
}

function resourceProductionSnapshot() {
  const capacities = Object.fromEntries(Object.keys(RESOURCE_BASE_CAPACITY).map((resource) => [
    resource,
    resourceCapacityLimit(resource)
  ]));
  const snapshot = {
    production: { water: 0, nutrient: 0 },
    capacities,
    devices: { water: 0, nutrient: 0 },
    producers: []
  };
  allFloorDevices().forEach((device) => {
    if (!device.placed) return;
    const definition = FLOOR_DEVICES[device.type];
    const resource = definition?.productionResource;
    if (!Object.prototype.hasOwnProperty.call(snapshot.production, resource)) return;
    const baseProduction = Math.max(0, Number(definition.productionPerDay) || 0);
    const cartridgeBonus = resourceCartridgeCount(resource) * RESOURCE_CARTRIDGE_PRODUCTION_BONUS;
    const planned = baseProduction + cartridgeBonus;
    snapshot.production[resource] += planned;
    snapshot.devices[resource] += 1;
    snapshot.producers.push({
      deviceId: device.id,
      baseId: device.baseId,
      resource,
      planned,
      baseProduction,
      cartridgeBonus
    });
  });
  return snapshot;
}
function syncResourceCapacities() {
  const snapshot = resourceProductionSnapshot();
  state.waterCapacity = snapshot.capacities.water;
  state.nutrientCapacity = snapshot.capacities.nutrient;
  return snapshot;
}

function processDailyResourceProduction() {
  const snapshot = syncResourceCapacities();
  const analytics = ensureAnalytics();
  const actual = { water: 0, nutrient: 0 };
  const blocked = { water: 0, nutrient: 0 };
  const deviceOutputs = snapshot.producers.flatMap((producer) => {
    const record = findOwnedEquipment("device", producer.deviceId);
    if (!record?.item?.placed || producer.planned <= 0) return [];
    const stored = Math.max(0, Number(record.item.resourceStored) || 0);
    if (stored > SUPPORT_RESOURCE_EPSILON) {
      blocked[producer.resource] += 1;
      return [{ ...producer, actual: 0, stored, blocked: true }];
    }
    record.item.resourceStored = producer.planned;
    actual[producer.resource] += producer.planned;
    return [{ ...producer, actual: producer.planned, stored: record.item.resourceStored, blocked: false }];
  });
  ["water", "nutrient"].forEach((resource) => {
    if (analytics) addMetric(analytics.resources, resource + "Produced", actual[resource]);
  });
  return { ...snapshot, actual, blocked, deviceOutputs };
}
const RESOURCE_PRODUCTION_EFFECT_MS = 5200;
const RESOURCE_PRODUCTION_EFFECT_PENDING_MS = 60 * 60 * 1000;
const activeResourceProductionEffects = new Map();

function currentResourceProductionEffect(deviceId) {
  const effect = activeResourceProductionEffects.get(deviceId);
  if (!effect) return null;
  const now = Date.now();
  const expired = effect.status === "active"
    ? effect.expiresAt <= now
    : effect.pendingExpiresAt <= now;
  if (expired) {
    activeResourceProductionEffects.delete(deviceId);
    return null;
  }
  return effect;
}

function resourceProductionEffectElapsed(effect) {
  if (!effect || effect.status !== "active") return 0;
  return Math.max(0, Math.min(
    RESOURCE_PRODUCTION_EFFECT_MS,
    Date.now() - (Number(effect.startedAt) || Date.now())
  ));
}

function applyResourceProductionEffect(deviceElement, effect) {
  if (!deviceElement || !effect) return;
  const label = deviceElement.querySelector(".resource-production-label strong");
  if (label) {
    const resourceLabel = effect.resource === "water" ? "WATER" : "NUTRIENT";
    label.textContent = `${resourceLabel} +${formatResource(effect.actual)}`;
  }
  const token = String(effect.token || "");
  const alreadyRunning = deviceElement.dataset.resourceProductionEffectToken === token
    && deviceElement.classList.contains("resource-production-active");
  if (alreadyRunning) return;
  deviceElement.style.setProperty(
    "--resource-production-offset",
    `${-resourceProductionEffectElapsed(effect)}ms`
  );
  deviceElement.dataset.resourceProductionEffectToken = token;
  if (deviceElement.classList.contains("resource-production-active")) {
    deviceElement.classList.remove("resource-production-active");
    void deviceElement.offsetWidth;
  }
  deviceElement.classList.add("resource-production-active");
}

function restoreActiveResourceProductionEffects(baseId = currentBase()?.id) {
  if (!farmScreenIsActive() || !baseId || currentBase()?.id !== baseId) return;
  activeResourceProductionEffects.forEach((effect, deviceId) => {
    if (effect.baseId !== baseId || effect.status !== "active") return;
    if (!currentResourceProductionEffect(deviceId)) return;
    const deviceElement = Array.from(document.querySelectorAll("[data-select-device]"))
      .find((element) => element.dataset.selectDevice === deviceId);
    if (deviceElement) applyResourceProductionEffect(deviceElement, effect);
  });
}

function activateQueuedResourceProductionEffects(baseId = currentBase()?.id) {
  if (!farmScreenIsActive() || !baseId || currentBase()?.id !== baseId) return;
  const pending = Array.from(activeResourceProductionEffects.entries())
    .filter(([, effect]) => effect.baseId === baseId && effect.status === "pending" && !effect.scheduled);
  pending.forEach(([deviceId, effect], index) => {
    effect.scheduled = true;
    window.setTimeout(() => {
      const current = activeResourceProductionEffects.get(deviceId);
      if (current !== effect) return;
      if (!farmScreenIsActive() || currentBase()?.id !== effect.baseId) {
        effect.scheduled = false;
        return;
      }
      const deviceElement = Array.from(document.querySelectorAll("[data-select-device]"))
        .find((element) => element.dataset.selectDevice === deviceId);
      if (!deviceElement) {
        effect.scheduled = false;
        return;
      }
      effect.status = "active";
      effect.scheduled = false;
      effect.startedAt = Date.now();
      effect.expiresAt = effect.startedAt + RESOURCE_PRODUCTION_EFFECT_MS;
      applyResourceProductionEffect(deviceElement, effect);
      window.setTimeout(() => {
        if (activeResourceProductionEffects.get(deviceId)?.token === effect.token) {
          activeResourceProductionEffects.delete(deviceId);
        }
        const currentElement = Array.from(document.querySelectorAll("[data-select-device]"))
          .find((element) => element.dataset.selectDevice === deviceId);
        if (currentElement?.dataset.resourceProductionEffectToken === String(effect.token || "")) {
          currentElement.classList.remove("resource-production-active");
          currentElement.style.removeProperty("--resource-production-offset");
          delete currentElement.dataset.resourceProductionEffectToken;
        }
      }, RESOURCE_PRODUCTION_EFFECT_MS);
    }, index * 160);
  });
}

function showDailyResourceProductionEffects(resourceOutput) {
  if (!resourceOutput?.deviceOutputs?.length) return;
  const queuedAt = Date.now();
  resourceOutput.deviceOutputs
    .filter((output) => output.actual > 0)
    .forEach((output) => {
      activeResourceProductionEffects.set(output.deviceId, {
        token: `${queuedAt}-${output.deviceId}-${Math.random()}`,
        resource: output.resource,
        actual: output.actual,
        baseId: output.baseId,
        status: "pending",
        scheduled: false,
        pendingExpiresAt: queuedAt + RESOURCE_PRODUCTION_EFFECT_PENDING_MS,
        expiresAt: Number.POSITIVE_INFINITY
      });
    });
  activateQueuedResourceProductionEffects();
}
function resourceProductionDefinition(device) {
  const definition = device ? FLOOR_DEVICES[device.type] : null;
  return ["water", "nutrient"].includes(definition?.productionResource) ? definition : null;
}

function storedResourceAmount(device) {
  return resourceProductionDefinition(device) ? Math.max(0, Number(device.resourceStored) || 0) : 0;
}

function resourceDisplayName(resource) {
  return resource === "water" ? "水" : "養液";
}

function transferProducedResource(device) {
  const definition = resourceProductionDefinition(device);
  if (!definition) return { success: false, reason: "invalid" };
  const resource = definition.productionResource;
  const stored = storedResourceAmount(device);
  if (stored <= SUPPORT_RESOURCE_EPSILON) {
    return { success: false, reason: "empty", definition, resource, stored };
  }
  const snapshot = syncResourceCapacities();
  const current = Math.max(0, Number(state[resource]) || 0);
  const freeCapacity = Math.max(0, snapshot.capacities[resource] - current);
  if (freeCapacity <= SUPPORT_RESOURCE_EPSILON) {
    return { success: false, reason: "full", definition, resource, stored, freeCapacity };
  }
  const collected = Math.min(stored, freeCapacity);
  state[resource] = current + collected;
  device.resourceStored = Math.max(0, stored - collected);
  if (device.resourceStored <= SUPPORT_RESOURCE_EPSILON) device.resourceStored = 0;
  return {
    success: true,
    definition,
    resource,
    collected,
    remaining: storedResourceAmount(device)
  };
}

function resourceCollectionProfile(resource) {
  return resource === "water"
    ? { color: "#48dbea", soft: "rgba(72, 219, 234, .42)", label: "水", code: "WATER" }
    : { color: "#72ffb8", soft: "rgba(114, 255, 184, .42)", label: "養液", code: "NUTRIENT" };
}

function playResourceCollectionCelebration({ resource, amount, sourceRect, automated = false }) {
  const profile = resourceCollectionProfile(resource);
  const targetElement = document.getElementById(resource + "-card");
  const targetRect = feedbackRect(targetElement);
  const originRect = sourceRect || targetRect;
  if (!originRect) return;

  const fromX = originRect.left + originRect.width / 2;
  const fromY = originRect.top + originRect.height * 0.42;
  const toX = targetRect ? targetRect.left + targetRect.width / 2 : fromX;
  const toY = targetRect ? targetRect.top + targetRect.height / 2 : fromY - 90;
  const travelX = toX - fromX;
  const travelY = toY - fromY;
  const layer = document.createElement("div");
  layer.className = `resource-collect-celebration resource-collect-${resource}${automated ? " automated" : ""}`;
  layer.style.setProperty("--resource-color", profile.color);
  layer.style.setProperty("--resource-soft", profile.soft);

  const source = document.createElement("span");
  source.className = "resource-collect-source";
  source.style.left = fromX + "px";
  source.style.top = fromY + "px";
  for (let index = 0; index < 3; index += 1) {
    const ring = document.createElement("i");
    ring.style.setProperty("--ring-delay", index * 105 + "ms");
    source.appendChild(ring);
  }
  layer.appendChild(source);

  if (targetRect && !isLowSpecMode()) {
    const beam = document.createElement("span");
    beam.className = "resource-collect-beam";
    beam.style.left = fromX + "px";
    beam.style.top = fromY + "px";
    beam.style.width = Math.hypot(travelX, travelY) + "px";
    beam.style.transform = `rotate(${Math.atan2(travelY, travelX)}rad)`;
    layer.appendChild(beam);
  }

  const iconUrl = EQUIPMENT[resource]?.icon || `assets/icons/${resource}.webp`;
  const particleCount = isLowSpecMode() ? (automated ? 3 : 6) : (automated ? 7 : 15);
  for (let index = 0; index < particleCount; index += 1) {
    const useIcon = index % 4 === 0;
    const particle = document.createElement(useIcon ? "img" : "i");
    particle.className = `resource-collect-flight${useIcon ? " resource-collect-icon" : ""}`;
    if (useIcon) {
      particle.src = iconUrl;
      particle.alt = "";
    }
    const spread = (index - (particleCount - 1) / 2) * 4.2;
    const arc = 34 + (index % 5) * 9;
    particle.style.left = fromX + "px";
    particle.style.top = fromY + "px";
    particle.style.setProperty("--mid-x", travelX * 0.43 + spread + "px");
    particle.style.setProperty("--mid-y", travelY * 0.34 - arc + "px");
    particle.style.setProperty("--travel-x", travelX + "px");
    particle.style.setProperty("--travel-y", travelY + "px");
    particle.style.setProperty("--flight-delay", (index * 34 + Math.random() * 45) + "ms");
    particle.style.setProperty("--flight-scale", String(0.72 + (index % 4) * 0.12));
    layer.appendChild(particle);
  }

  const label = document.createElement("span");
  label.className = "resource-collect-label";
  label.style.left = fromX + "px";
  label.style.top = (fromY - Math.max(42, originRect.height * 0.38)) + "px";
  const eyebrow = document.createElement("small");
  eyebrow.textContent = automated ? "AUTO COLLECTION" : "RESOURCE SECURED";
  const value = document.createElement("strong");
  value.textContent = profile.label + " +" + formatResource(amount);
  label.append(eyebrow, value);
  layer.appendChild(label);

  document.body.appendChild(layer);
  if (sourceRect) burstEffect(sourceRect, profile.color, automated ? 10 : 26);
  if (targetElement) {
    targetElement.style.setProperty("--collect-color", profile.color);
    targetElement.classList.remove("resource-collect-target");
    void targetElement.offsetWidth;
    targetElement.classList.add("resource-collect-target");
    window.setTimeout(() => targetElement.classList.remove("resource-collect-target"), 1250);
  }
  if (!automated) {
    window.setTimeout(() => playSoundFirst(["ui_confirm", "resource_collect"], 0.16), 135);
  }
  window.setTimeout(() => layer.remove(), automated ? 1350 : 1750);
}
function collectProducedResource(device) {
  const definition = resourceProductionDefinition(device);
  if (!definition) return false;
  const sourceElement = Array.from(document.querySelectorAll("[data-select-device]"))
    .find((element) => element.dataset.selectDevice === device.id);
  const sourceRect = feedbackRect(sourceElement);
  const result = transferProducedResource(device);
  const resource = result.resource || definition.productionResource;
  const resourceName = resourceDisplayName(resource);
  if (!result.success && result.reason === "empty") {
    setStatus(definition.name + "には、まだ回収できる" + resourceName + "がありません。");
    toast(resourceName + "は生産中です", "warning");
    return true;
  }
  if (!result.success && result.reason === "full") {
    setStatus(resourceName + "の備蓄容量がいっぱいです。先に資源を使用してください。");
    toast(resourceName + "の備蓄容量がいっぱいです", "warning");
    rejectFeedback({ shake: false });
    return true;
  }
  if (!result.success) return false;

  setStatus(
    definition.name + "から" + resourceName + "を" + formatResource(result.collected) + "回収しました。"
    + (result.remaining > 0 ? " 設備内に" + formatResource(result.remaining) + "残っています。" : " 次の生産を開始できます。")
  );
  toast(resourceName + " +" + formatResource(result.collected));
  playSoundFirst(["resource_collect", "harvest_bulk", "ui_confirm"], 0.28);
  hapticFeedback([12, 20, 12, 34, 18]);
  saveGame();
  render();
  playResourceCollectionCelebration({
    resource,
    amount: result.collected,
    sourceRect,
    automated: false
  });
  return true;
}

function collectProducedResourceByRobot(base, device, robot) {
  const visibleDevice = base?.id === currentBase()?.id && farmScreenIsActive()
    ? Array.from(document.querySelectorAll("[data-select-device]"))
      .find((element) => element.dataset.selectDevice === device.id)
    : null;
  const sourceRect = feedbackRect(visibleDevice);
  const result = transferProducedResource(device);
  if (!result.success) return false;
  const resourceName = resourceDisplayName(result.resource);
  botActionLog(
    "BOT // " + result.definition.name + "から" + resourceName + "を"
    + formatResource(result.collected) + "回収。"
  );
  playSoundFirst(["resource_collect", "ui_confirm"], 0.1);
  if (sourceRect) {
    playResourceCollectionCelebration({
      resource: result.resource,
      amount: result.collected,
      sourceRect,
      automated: true
    });
  } else if (base?.id === currentBase()?.id) {
    pulseElement(document.getElementById(result.resource + "-card"));
  }
  requestFarmRender(base);
  return true;
}function dailyUpkeep() {
  return ownedBases().reduce((total, base) => {
    const leds = base.shelves.filter((shelf) => shelf.led).length;
    const fans = base.shelves.filter((shelf) => shelf.fan).length;
    const baseEffects = baseTagEffects(base);
    const units = base.shelves.reduce((sum, unit) => {
      const definition = GROW_UNITS[unit.type];
      return sum + (definition ? definition.upkeep * (unitTagEffects(unit).upkeepMod || 1) : 0);
    }, 0);
    const floorDevices = base.floorDevices.reduce((sum, device) =>
      sum + FLOOR_DEVICES[device.type].upkeep * (unitTagEffects(device).upkeepMod || 1) * (baseEffects.deviceUpkeepMod || 1), 0);
    return total + Math.round(units + floorDevices + leds * 5 + fans * 3 + (base.upkeep || 0));
  }, 0);
}

function activePlants() {
  return ownedBases().flatMap((base) =>
    base.shelves.flatMap((shelf, shelfIndex) =>
      shelf.slots
        .map((plant, slotIndex) => plant ? { plant, shelf, shelfIndex, slotIndex, baseId: base.id } : null)
        .filter(Boolean)
    )
  );
}

function currentActivePlants() {
  return activePlants().filter((entry) => entry.baseId === currentBase().id);
}

function cropCareStages(cropId) {
  const stages = CROPS[cropId]?.careStages;
  return Array.isArray(stages)
    ? stages.filter((value) => Number.isFinite(Number(value)) && Number(value) > 0 && Number(value) < 1)
      .map(Number)
      .sort((left, right) => left - right)
    : [];
}

function plantCareStatus(plant) {
  const crop = plant ? CROPS[plant.crop] : null;
  const stages = cropCareStages(plant?.crop);
  if (!plant || !crop || !stages.length || crop.days <= 0) {
    return { total: 0, completedCount: 0, missedCount: 0, pending: [], progress: 0 };
  }

  const completed = new Set(
    (Array.isArray(plant.careCompletedStages) ? plant.careCompletedStages : [])
      .map((value) => Math.floor(Number(value)))
      .filter((value) => value >= 0 && value < stages.length)
  );
  const careGrowthBonus = Math.max(0, Number(plant.careGrowthBonus) || 0);
  const naturalGrowth = Math.max(0, (Number(plant.growth) || 0) - careGrowthBonus);
  const progress = Math.min(1, naturalGrowth / crop.days);
  const pending = [];
  let missedCount = 0;

  stages.forEach((start, stageIndex) => {
    if (completed.has(stageIndex)) return;
    const deadline = stages[stageIndex + 1] ?? 1;
    if (plant.ready || plant.dead || progress >= deadline) {
      missedCount += 1;
    } else if (progress >= start) {
      pending.push({ stageIndex, start, deadline, urgency: Math.max(0, deadline - progress) });
    }
  });

  return {
    total: stages.length,
    completedCount: completed.size,
    missedCount,
    pending,
    progress
  };
}

function plantCareQualityBonus(plant) {
  const status = plantCareStatus(plant);
  return Math.min(0.2, status.completedCount * SUPPORT_CARE_QUALITY_BONUS);
}

function facilityMoodClasses(base) {
  const env = base.environment || DEFAULT_ENVIRONMENT;
  const classes = [];
  if (env.humidity >= 68) classes.push("humid-air");
  if (env.humidity <= 45) classes.push("dry-air");
  if (env.temp >= 28) classes.push("warm-air");
  if (env.temp <= 20) classes.push("cold-air");
  if (env.co2 >= 850) classes.push("rich-co2");
  return classes.join(" ");
}

function plantStageClass(unit) {
  const plants = unit.slots.filter(Boolean);
  if (!plants.length) return "stage-empty";
  if (plants.some((plant) => plant.dead)) return "stage-dead";
  const stage = unitGrowthStage(unit);
  if (plants.some((plant) => plant.ready)) return `stage-ready stage-${stage}`;
  return `stage-${stage}`;
}

function unitGrowthStage(unit) {
  const plants = unit.slots.filter(Boolean);
  if (!plants.length) return 0;
  if (plants.some((plant) => plant.ready)) return 5;
  const average = plants.reduce((sum, plant) => sum + plant.growth / CROPS[plant.crop].days, 0) / plants.length;
  return growthStageIndex(average);
}

function unitPrimaryCrop(unit) {
  const summary = unit.slots.filter(Boolean).reduce((entries, plant) => {
    const crop = CROPS[plant.crop];
    if (!crop) return entries;
    entries[plant.crop] ||= { count: 0, progress: 0 };
    entries[plant.crop].count += 1;
    entries[plant.crop].progress += plant.ready ? 1 : Math.max(0, Math.min(1, plant.growth / crop.days));
    return entries;
  }, {});
  return Object.entries(summary).sort(([, a], [, b]) =>
    b.count - a.count || b.progress - a.progress
  )[0]?.[0] || "";
}

function unitSprite(unit, definition) {
  const plants = unit.slots.filter(Boolean);
  if (!plants.length) return definition.emptySprite || definition.sprite;
  return definition.sprite;
}

function plantVisualStage(plant) {
  if (!plant) return 0;
  const crop = CROPS[plant.crop];
  if (!crop) return 1;
  if (plant.ready) return 5;
  if (plant.dead) return 1;
  return growthStageIndex(plant.growth / crop.days);
}

function plantSprite(plant) {
  if (!plant) return "";
  const stage = plantVisualStage(plant);
  const sprites = PLANT_STAGE_SPRITES[plant.crop];
  return sprites?.[Math.max(0, stage - 1)] || CROPS[plant.crop]?.icon || "";
}

function renderUnitPlantSlots(unit, shelfIndex) {
  const layout = GROW_UNIT_SLOT_LAYOUTS[unit.type];
  if (!layout?.length) return "";
  return `<span class="box-plant-slots" aria-hidden="false">${unit.slots.map((plant, slotIndex) => {
    const slot = layout[slotIndex] || { x: 50, y: 50, size: 20, z: slotIndex };
    const stage = plantVisualStage(plant);
    const crop = plant ? CROPS[plant.crop] : null;
    const ready = Boolean(plant?.ready);
    const dead = Boolean(plant?.dead);
    const sRankReady = ready && plant?.quality === "S";
    const sprite = plantSprite(plant);
    const now = Date.now();
    const stagePulse = Boolean(plant?.stagePulseAt && now - plant.stagePulseAt < 1500);
    const readyPulse = Boolean(plant?.readyPulseAt && now - plant.readyPulseAt < 1900);
    const careStatus = plant ? plantCareStatus(plant) : null;
    const carePending = Boolean(careStatus?.pending.length);
    const carePulse = Boolean(plant?.carePulseAt && now - plant.carePulseAt < 1500);
    const slotPulseClass = `${stagePulse ? "stage-pop" : ""} ${readyPulse ? "ready-pop" : ""} ${carePulse ? "care-pop" : ""}`.trim();
    const careLabel = carePending ? ` / 育成管理可能 ${careStatus.completedCount}/${careStatus.total}` : "";
    return `<span class="box-plant-slot ${plant ? "planted" : "empty"} ${ready ? "ready" : ""} ${sRankReady ? "s-rank-ready" : ""} ${dead ? "dead" : ""} ${carePending ? "care-pending" : ""} ${slotPulseClass} stage-${stage}" data-shelf="${shelfIndex}" data-slot="${slotIndex}" data-box-plant-slot style="--slot-x:${slot.x}%;--slot-y:${slot.y}%;--slot-size:${slot.size}%;--slot-z:${slot.z};--crop-color:${crop?.color || "#72ffb8"}" role="button" aria-label="${crop ? `${crop.name} slot ${slotIndex + 1}${careLabel}` : `Empty slot ${slotIndex + 1}`}">
      ${sprite ? `<img class="box-plant-sprite" src="${sprite}" alt="" draggable="false">` : ""}
      ${ready ? `<span class="box-ready-dot"></span>` : ""}
      ${carePending ? `<span class="box-care-dot" title="育成管理可能"></span>` : ""}
      ${sRankReady ? `<span class="s-rank-badge">S</span>` : ""}
    </span>`;
  }).join("")}</span>`;
}

function growthStageIndex(progress) {
  if (progress >= 0.68) return 4;
  if (progress >= 0.43) return 3;
  if (progress >= 0.18) return 2;
  return 1;
}

function updatePlantVisualStage(plant) {
  const crop = CROPS[plant.crop];
  if (!crop) return false;
  const nextStage = plant.ready ? 5 : plant.dead ? 1 : growthStageIndex(plant.growth / crop.days);
  if (plant.visualStage === nextStage) return false;
  plant.visualStage = nextStage;
  plant.stagePulseAt = Date.now();
  if (nextStage === 5) plant.readyPulseAt = plant.stagePulseAt;
  return true;
}

function observationForUnit(unit) {
  const plants = unit.slots.filter(Boolean);
  if (!plants.length) return `${GROW_UNITS[unit.type].name} is quiet. The lights are asleep.`;
  if (plants.some((plant) => plant.dead)) return "The leaves have gone dull. The room knows the failure before the terminal does.";
  if (plants.some((plant) => plant.ready)) return "The leaves push back against the light. Something is ready to cut.";
  const average = plants.reduce((sum, plant) => sum + plant.growth / CROPS[plant.crop].days, 0) / plants.length;
  if (average < 0.3) return "Small sprouts press through the medium. Fragile, but alive.";
  if (average < 0.75) return "The leaves are learning the fan. The green is a little louder than yesterday.";
  return "Almost there. The equipment is crowded with overlapping leaves.";
}

function resourceDemand() {
  return activePlants().reduce((total, entry) => {
    if (entry.plant.ready || entry.plant.dead) return total;
    const crop = CROPS[entry.plant.crop];
    if (!GROW_UNITS[entry.shelf.type]?.continuous) return total;
    const base = ownedBases().find((candidate) => candidate.id === entry.baseId) || currentBase();
    const perf = unitPerformance(entry.shelf, entry.plant.crop, base);
    total.water += crop.water * RESOURCE_CONSUMPTION_RATE * perf.water;
    total.nutrient += crop.nutrient * RESOURCE_CONSUMPTION_RATE * perf.nutrient * (getUnitEffects(entry.shelf).fan ? 0.9 : 1);
    return total;
  }, { water: 0, nutrient: 0 });
}

function formatResource(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function plantingResourceCost(cropId, unit) {
  const definition = GROW_UNITS[unit.type];
  if (!definition) return { water: 0, nutrient: 0 };
  if (definition.continuous) return { water: 0, nutrient: 0 };
  const crop = CROPS[cropId];
  const base = ownedBases().find((candidate) => candidate.shelves.some((shelf) => shelf.id === unit.id)) || currentBase();
  const perf = unitPerformance(unit, cropId, base);
  return {
    water: crop.water * RESOURCE_CONSUMPTION_RATE * crop.days * perf.water,
    nutrient: crop.nutrient * RESOURCE_CONSUMPTION_RATE * crop.days * perf.nutrient * (getUnitEffects(unit).fan ? 0.9 : 1)
  };
}

function resourceShortageContext(cropId, unit, cost) {
  const waterMissing = Math.max(0, cost.water - state.water);
  const nutrientMissing = Math.max(0, cost.nutrient - state.nutrient);
  const missing = [];
  if (waterMissing > 0.001) missing.push(`? ${formatResource(waterMissing)}`);
  if (nutrientMissing > 0.001) missing.push(`?? ${formatResource(nutrientMissing)}`);
  return {
    cropId,
    cropName: CROPS[cropId]?.name || cropId,
    unitType: unit.type,
    unitName: GROW_UNITS[unit.type]?.name || unit.type,
    waterRequired: formatResource(cost.water),
    nutrientRequired: formatResource(cost.nutrient),
    waterCurrent: formatResource(state.water),
    nutrientCurrent: formatResource(state.nutrient),
    waterMissing: formatResource(waterMissing),
    nutrientMissing: formatResource(nutrientMissing),
    missingResources: missing.join(' / ') || '??'
  };
}

function logLabelForType(type = "status") {
  if (type === "bot") return "BOT";
  if (type === "warning") return "WARN";
  if (type === "error") return "ERROR";
  if (type === "notice") return "NOTICE";
  if (type === "success") return "OK";
  return "LOG";
}

function pushLogEntry(message, type = "status", options = {}) {
  if (!message) return;
  const container = document.getElementById("toast-container");
  if (!container) return;
  const textValue = String(message);
  const now = Date.now();
  if (options.dedupe !== false && textValue === lastLogToastMessage && now - lastLogToastAt < 2200) return;
  lastLogToastMessage = textValue;
  lastLogToastAt = now;
  const element = document.createElement("div");
  element.className = `toast ${type}`.trim();
  element.dataset.logType = type || "status";

  const rail = document.createElement("i");
  rail.className = "toast-rail";
  const label = document.createElement("span");
  label.className = "toast-kicker";
  label.textContent = logLabelForType(type);
  const body = document.createElement("span");
  body.className = "toast-message";
  body.textContent = textValue;
  const sweep = document.createElement("i");
  sweep.className = "toast-sweep";
  element.append(rail, label, body, sweep);

  container.prepend(element);
  Array.from(container.children).slice(5).forEach((child) => child.remove());
  window.setTimeout(() => element.classList.add("toast-aging"), 2800);
  window.setTimeout(() => element.remove(), options.duration || 4800);
}

function setStatus(message, options = {}) {
  state.log = message;
  const status = document.getElementById("status-text");
  if (status) status.textContent = message;
  if (options.log !== false) pushLogEntry(message, options.type || "status");
}

const soundPool = {};
const loopAudioPool = {};

function cacheBustedAudioSource(source) {
  if (!source || /^(data:|blob:)/i.test(source)) return source;
  const separator = source.includes("?") ? "&" : "?";
  return `${source}${separator}audio=${AUDIO_CACHE_BUSTER}`;
}

function playSound(name, volume = null) {
  const source = SOUND_FILES[name];
  if (!source) return false;
  const finalVolume = Math.max(0, Math.min(1, (volume ?? SOUND_VOLUMES[name] ?? 0.28) * masterVolume()));
  if (finalVolume <= 0) return false;
  const audioSource = cacheBustedAudioSource(source);
  const audio = soundPool[name] || new Audio(audioSource);
  soundPool[name] = audio;
  audio.volume = finalVolume;
  audio.currentTime = 0;
  audio.play().catch(() => {});
  return true;
}

function playSoundFirst(names, volume = null) {
  const soundId = names.find((name) => SOUND_FILES[name]);
  if (!soundId) return false;
  return playSound(soundId, volume);
}

function playCommsSound(commsEntry, fallback = "comms_open") {
  const event = commsEntry?.event || commsEntry;
  playSound(event?.sound || fallback, event?.soundVolume ?? null);
}

function loopAudio(id, source) {
  if (!source || source === "none") return null;
  if (!loopAudioPool[id]) {
    const audio = new Audio(cacheBustedAudioSource(source));
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    loopAudioPool[id] = audio;
  }
  return loopAudioPool[id];
}

function setLoopVolume(id, source, volume) {
  const audio = loopAudio(id, source);
  if (!audio) return;
  const finalVolume = Math.max(0, Math.min(1, volume * masterVolume()));
  audio.volume = finalVolume;
  if (finalVolume > 0) {
    if (audio.paused) audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function currentAmbientConditions() {
  const placedUnits = allShelves().filter((unit) => unit.placed);
  const planted = activePlants().length;
  const cleaningNeeded = ownedBases().some((base) => [...base.shelves, ...base.floorDevices].some(needsCleaning));
  const fanDevice = allFloorDevices().some((device) => device.placed && device.type === "fan");
  const demand = resourceDemand();
  return {
    always: true,
    time_running: Boolean(state.timeUnlocked && !state.paused && !state.ended),
    plants: planted > 0,
    cleaning_needed: cleaningNeeded,
    fan_device: fanDevice,
    many_units: placedUnits.length >= 3,
    water_low: demand.water > 0 && state.water <= Math.max(2, demand.water * 3),
    market_unlocked: Boolean(state.marketTabUnlocked)
  };
}

function ambientLayerActive(layer) {
  const condition = layer.condition || "always";
  if (condition.startsWith("base_tier:")) {
    return currentBase().tier === condition.split(":")[1];
  }
  if (condition.startsWith("market:")) {
    return document.getElementById("market-screen")?.classList.contains("active")
      && selectedMarket === condition.split(":")[1];
  }
  const conditions = currentAmbientConditions();
  return Boolean(conditions[condition]);
}

function activeAmbientLayers() {
  if (state.audio?.noiseCanceling) return [];
  return Object.entries(AMBIENT_LAYERS).filter(([, layer]) => ambientLayerActive(layer));
}

function syncLoopAudio() {
  if (!state?.audio) return;
  const activeIds = new Set();
  activeAmbientLayers().forEach(([id, layer]) => {
    const audioId = `ambient:${id}`;
    activeIds.add(audioId);
    setLoopVolume(audioId, layer.file, layer.volume);
  });
  const radio = RADIO_PROGRAMS[state.audio.radioProgram];
  if (radio && radio.file && radio.file !== "none") {
    const audioId = `radio:${state.audio.radioProgram}`;
    activeIds.add(audioId);
    setLoopVolume(audioId, radio.file, radio.volume);
  }
  Object.entries(loopAudioPool).forEach(([id, audio]) => {
    if (activeIds.has(id)) return;
    audio.pause();
    audio.volume = 0;
  });
}

function setNoiseCanceling(enabled) {
  state.audio.noiseCanceling = Boolean(enabled);
  saveGame();
  renderRadio();
  syncLoopAudio();
  playSound(state.audio.noiseCanceling ? "environment_adjust" : "tab_switch", 0.14);
  hapticFeedback(state.audio.noiseCanceling ? [8, 26, 8] : 8);
  terminalSurfaceFeedback("radio");
  toast(state.audio.noiseCanceling ? "Noise canceling enabled." : "Ambient audio restored.");
}

function selectRadioProgram(programId) {
  if (!RADIO_PROGRAMS[programId]) return;
  state.audio.radioProgram = programId;
  saveGame();
  renderRadio();
  syncLoopAudio();
  playSound("radio_select", 0.12);
  hapticFeedback(8);
  terminalSurfaceFeedback("radio");
}

function burstEffect(target, color = "#72ffb8", count = 12) {
  if (!target) return;
  const rect = feedbackRect(target);
  if (!rect) return;
  const layer = document.createElement("div");
  layer.className = "effect-burst";
  layer.style.left = `${rect.left + rect.width / 2}px`;
  layer.style.top = `${rect.top + rect.height / 2}px`;
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("i");
    const angle = (Math.PI * 2 * index) / count + Math.random() * 0.35;
    const distance = 28 + Math.random() * 54;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--particle-color", color);
    layer.appendChild(particle);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 850);
}

function cleanSplashEffect(target) {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "clean-effect clean-splash-effect";
  layer.style.left = `${rect.left + rect.width / 2}px`;
  layer.style.top = `${rect.top + rect.height * 0.45}px`;
  for (let index = 0; index < 18; index += 1) {
    const drop = document.createElement("i");
    const angle = -Math.PI * 0.85 + Math.random() * Math.PI * 1.7;
    const distance = 18 + Math.random() * 70;
    drop.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    drop.style.setProperty("--dy", `${Math.sin(angle) * distance - Math.random() * 24}px`);
    drop.style.setProperty("--delay", `${Math.random() * 90}ms`);
    layer.appendChild(drop);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 900);
}

function brushCleanEffect(target) {
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "clean-effect brush-clean-effect";
  layer.style.left = `${rect.left + rect.width / 2}px`;
  layer.style.top = `${rect.top + rect.height * 0.45}px`;
  for (let index = 0; index < 7; index += 1) {
    const stroke = document.createElement("i");
    stroke.style.setProperty("--x", `${-34 + Math.random() * 68}px`);
    stroke.style.setProperty("--y", `${-26 + Math.random() * 52}px`);
    stroke.style.setProperty("--delay", `${index * 38}ms`);
    layer.appendChild(stroke);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 760);
}

function pulseElement(element, className = "reward-pulse") {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  window.setTimeout(() => element.classList.remove(className), 700);
}

function hapticFeedback(pattern = 10) {
  if (!navigator?.vibrate) return;
  try {
    navigator.vibrate(pattern);
  } catch (error) {}
}

function tactileFeedback(target, { sound = "click", volume = 0.08, vibration = 8, className = "tactile-pop" } = {}) {
  if (sound) playSound(sound, volume);
  if (vibration) hapticFeedback(vibration);
  if (target) pulseElement(target, className);
}

function feedbackRect(target) {
  if (!target) return null;
  if (typeof target.getBoundingClientRect === "function") {
    const rect = target.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  }
  if (["left", "top", "width", "height"].every((key) => Number.isFinite(target[key]))) return target;
  return null;
}

function floatingFeedback(target, textValue, color = "#f5d65b", className = "") {
  if (!target || !textValue) return;
  const rect = feedbackRect(target);
  if (!rect) return;
  const element = document.createElement("div");
  element.className = ("floating-feedback " + className).trim();
  element.textContent = textValue;
  element.style.left = (rect.left + rect.width / 2) + "px";
  element.style.top = (rect.top + rect.height * 0.32) + "px";
  element.style.setProperty("--float-color", color);
  document.body.appendChild(element);
  window.setTimeout(() => element.remove(), 980);
}

function animateMoneyCounter(fromValue, toValue) {
  const element = document.getElementById("money-value");
  if (!element) return;
  element.textContent = formatNumber(Number(toValue) || 0);
}

function saleStreamEffect(sourceElement, cropId, qty = 1, premium = false) {
  const target = document.getElementById("money-value");
  const crop = CROPS[cropId];
  if (!sourceElement || !target || !crop?.icon) return;
  const from = feedbackRect(sourceElement);
  const to = feedbackRect(target);
  if (!from || !to) return;
  const count = Math.min(7, Math.max(3, qty));
  const layer = document.createElement("div");
  layer.className = ("sale-stream " + (premium ? "premium" : "")).trim();
  for (let index = 0; index < count; index += 1) {
    const pip = document.createElement("img");
    pip.src = crop.icon;
    pip.alt = "";
    const startX = from.left + from.width * (0.3 + Math.random() * 0.4);
    const startY = from.top + from.height * (0.25 + Math.random() * 0.5);
    pip.style.left = startX + "px";
    pip.style.top = startY + "px";
    pip.style.setProperty("--dx", (to.left + to.width / 2 - startX + (Math.random() * 30 - 15)) + "px");
    pip.style.setProperty("--dy", (to.top + to.height / 2 - startY + (Math.random() * 20 - 10)) + "px");
    pip.style.setProperty("--delay", (index * 48) + "ms");
    layer.appendChild(pip);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 980);
}

function saleRewardEffect({ sourceElement, sourceRect, cropId, revenue, qty, quality, premium, fromMoney, toMoney }) {
  const source = sourceRect || sourceElement;
  floatingFeedback(source, "+?" + formatNumber(revenue), premium ? "#fff2a8" : "#f5d65b", premium ? "cash premium" : "cash");
  if (qty > 1) floatingFeedback(source, qty + " SOLD", CROPS[cropId]?.color || "#72ffb8", "small");
  saleStreamEffect(source, cropId, qty, premium);
  window.setTimeout(() => {
    animateMoneyCounter(fromMoney, toMoney);
    pulseElement(document.getElementById("money-value"), premium ? "cash-shock-premium" : "cash-shock");
  }, 120);
  if (premium) window.setTimeout(() => toast((CROPS[cropId]?.name || cropId) + " Sランク // Q-" + quality), 180);
}

function plantGrowthFeedback(target, plant) {
  if (!target || !plant) return;
  const crop = CROPS[plant.crop];
  floatingFeedback(target, plant.ready ? "READY" : "STAGE " + (plant.visualStage || plantVisualStage(plant)), plant.ready ? "#f5d65b" : crop?.color || "#72ffb8", plant.ready ? "ready" : "small");
  burstEffect(target, plant.ready ? "#f5d65b" : crop?.color || "#72ffb8", plant.ready ? 18 : 8);
}

function terminalSurfaceFeedback(tabId) {
  const screen = document.getElementById(tabId + "-screen");
  if (!screen) return;
  screen.classList.remove("terminal-flash");
  void screen.offsetWidth;
  screen.classList.add("terminal-flash");
  window.setTimeout(() => screen.classList.remove("terminal-flash"), 420);
}

function rejectFeedback(options = {}) {
  playSound("feedback_reject", 0.18);
  if (options.shake === false) return;
  pulseElement(document.getElementById("app"), "micro-shake");
}

function toast(message, type = "") {
  pushLogEntry(message, type || "notice", { dedupe: false, duration: 4200 });
}

function botActionLog(message) {
  setStatus(message, { log: false });
  toast(message, "bot");
}

function ensureOpenedTabs() {
  state.openedTabs ||= {};
  GAME_TABS.forEach((tabId) => {
    if (typeof state.openedTabs[tabId] !== "boolean") state.openedTabs[tabId] = tabId === "farm";
  });
  state.openedTabs.farm = true;
}

function ensureViewedSubsections() {
  if (!state.viewedMarkets || typeof state.viewedMarkets !== "object" || Array.isArray(state.viewedMarkets)) {
    state.viewedMarkets = {};
  }
  if (!state.viewedShopCategories || typeof state.viewedShopCategories !== "object" || Array.isArray(state.viewedShopCategories)) {
    state.viewedShopCategories = {};
  }
}

function hasViewedMarket(marketId) {
  ensureViewedSubsections();
  return state.viewedMarkets[marketId] === true;
}

function hasViewedShopCategory(categoryId) {
  ensureViewedSubsections();
  return state.viewedShopCategories[categoryId] === true;
}

function markMarketViewed(marketId) {
  ensureViewedSubsections();
  if (!MARKETS[marketId] || !isMarketAvailable(marketId) || hasViewedMarket(marketId)) return false;
  state.viewedMarkets[marketId] = true;
  saveGame();
  return true;
}

function markShopCategoryViewed(categoryId) {
  ensureViewedSubsections();
  if (!SHOP_CATEGORIES[categoryId] || !isShopCategoryAvailable(categoryId) || hasViewedShopCategory(categoryId)) return false;
  state.viewedShopCategories[categoryId] = true;
  saveGame();
  return true;
}

function hasUnseenMarketEntries() {
  return Object.keys(MARKETS).some((marketId) => isMarketAvailable(marketId) && !hasViewedMarket(marketId));
}

function hasUnseenShopCategories() {
  return Object.keys(SHOP_CATEGORIES).some((categoryId) => isShopCategoryAvailable(categoryId) && !hasViewedShopCategory(categoryId));
}

function unseenEntryBadge() {
  return '<i class="unseen-entry-badge" title="まだ見ていません" aria-hidden="true">!</i>';
}

function isOpeningFarmOnlyPhase() {
  return Boolean(state && !state.debugMode && !LABOR_TUTORIAL_QA_MODE && !state.marketTabUnlocked);
}

function isTabAvailable(tabId) {
  if (tabId === "farm") return true;
  if (isOpeningFarmOnlyPhase()) return false;
  if (tabId === "market") return Boolean(state.marketTabUnlocked);
  if (tabId === "shop") return Boolean(state.shopUnlocked);
  if (tabId === "schedule") return Boolean(state.shopUnlocked);
  if (tabId === "broker") return Boolean(state.brokerUnlocked);
  if (tabId === "labor") return Boolean(state.debugMode) || Boolean(state.automationTabUnlocked);
  return true;
}


function markTabOpened(tabId) {
  ensureOpenedTabs();
  if (!GAME_TABS.includes(tabId) || state.openedTabs[tabId]) return;
  state.openedTabs[tabId] = true;
  saveGame();
}

function updateTabIndicators() {
  if (!state) return;
  ensureOpenedTabs();
  ensureViewedSubsections();
  const cleaningNeeded = ownedBases().some((base) => [...base.shelves, ...base.floorDevices].some(needsCleaning));
  document.querySelectorAll(".tab[data-tab]").forEach((tab) => {
    const tabId = tab.dataset.tab;
    const available = isTabAvailable(tabId);
    const tutorialLocked = isLaborTutorialActive() && tabId !== "labor";
    const locked = !available || tutorialLocked;
    const active = tab.classList.contains("active");
    const nestedUnseen = tabId === "market"
      ? hasUnseenMarketEntries()
      : tabId === "shop" && hasUnseenShopCategories();
    tab.classList.toggle("locked", locked);
    tab.toggleAttribute("disabled", locked);
    tab.setAttribute("aria-disabled", String(locked));
    delete tab.dataset.lockHint;
    tab.removeAttribute("title");
    tab.removeAttribute("aria-label");
    tab.classList.toggle("new-tab-alert", available && !tutorialLocked && !active && (!state.openedTabs[tabId] || nestedUnseen));
    if (tabId === "farm") tab.classList.toggle("needs-cleaning-tab", cleaningNeeded);
  });
}

function switchTab(tabId) {
  const previousTab = document.querySelector(".screen.active")?.id?.replace("-screen", "");
  if (isLaborTutorialActive() && tabId !== "labor") {
    toast("接続訓練を完了するまで、ほかの操作はロックされています。", "warning");
    rejectFeedback();
    return;
  }
  if (!isTabAvailable(tabId)) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  if (tabId === "market" && !state.marketTabUnlocked) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  if (tabId === "shop" && !state.shopUnlocked) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  if (tabId === "schedule" && !state.shopUnlocked) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  if (tabId === "broker" && !state.brokerUnlocked) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === `${tabId}-screen`);
  });
  markTabOpened(tabId);
  if (tabId === "market") markMarketViewed(selectedMarket);
  if (tabId === "shop") markShopCategoryViewed(selectedShopCategory);
  clearUiGuide(`tab:${tabId}`, { persist: false });
  updateTabIndicators();
  renderActiveScreen(tabId);
  if (tabId === "schedule") triggerComms("schedule_opened", { tabId: "schedule" });
  if (tabId === "radio") triggerComms("radio_first_open", { tabId: "radio" });
  if (tabId === "labor") triggerComms("labor_first_open", { tabId: "labor" });
  if (previousTab !== tabId) {
    playSound("tab_switch", 0.18);
    hapticFeedback(8);
    trackTabAnalytics(tabId, previousTab);
    terminalSurfaceFeedback(tabId);
  }
}

function activeTabId() {
  return document.querySelector(".screen.active")?.id?.replace("-screen", "") || "farm";
}

function renderActiveScreen(tabId = activeTabId()) {
  if (tabId === "farm") renderFarm();
  else if (tabId === "market") renderMarkets();
  else if (tabId === "schedule") renderSchedule();
  else if (tabId === "shop") renderShop();
  else if (tabId === "broker") renderBroker();
  else if (tabId === "radio") renderRadio();
  else if (tabId === "labor") renderLabor();
  else if (tabId === "info") renderInfo();
}

function syncGameTabNavigation() {
  const navigation = document.querySelector('.tabs[aria-label="ゲーム画面"]');
  if (!navigation) return;
  GAME_TABS.forEach((tabId, index) => {
    const button = navigation.querySelector(`.tab[data-tab="${tabId}"]`);
    if (!button) return;
    const ordinal = button.querySelector("span");
    if (ordinal) ordinal.textContent = String(index + 1).padStart(2, "0");
    navigation.appendChild(button);
  });
}

function setActiveTabSilently(tabId = "farm") {
  const safeTabId = GAME_TABS.includes(tabId) ? tabId : "farm";
  document.querySelectorAll(".tab[data-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === safeTabId);
  });
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === `${safeTabId}-screen`);
  });
}

function resetOperationSurface({ resetAudio = false } = {}) {
  selectedSeed = "lettuce";
  selectedMarket = "lower";
  selectedShopCategory = "seeds";
  selectedInfoBookId = "gardening_intro";
  selectedInfoEntryId = "";
  selectedLaborRobotId = "";
  laborBlueprintView = { x: 34, y: 34, zoom: 1 };
  setActiveTabSilently("farm");
  if (resetAudio && state?.audio) {
    state.audio.noiseCanceling = false;
    state.audio.radioProgram = "off";
  }
  if (state?.audio) syncLoopAudio();
}

function ensureActiveTabAvailable() {
  if (isLaborTutorialActive()) {
    if (activeTabId() !== "labor") setActiveTabSilently("labor");
    return;
  }
  const tabId = activeTabId();
  if (!GAME_TABS.includes(tabId) || !isTabAvailable(tabId)) setActiveTabSilently("farm");
}

function commsContextValue(context = {}, key = "") {
  if (key in context) return context[key];
  if (key === "cropName" && context.cropId) return CROPS[context.cropId]?.name;
  if (key === "marketName" && context.marketId) return MARKETS[context.marketId]?.name;
  if (key === "itemName" && context.itemId) {
    return EQUIPMENT[context.itemId]?.name || CROPS[context.itemId]?.name || GROW_UNITS[context.itemId]?.name || FLOOR_DEVICES[context.itemId]?.name;
  }
  if (key === "unitName" && context.unitType) return GROW_UNITS[context.unitType]?.name;
  if (key === "deviceName" && context.deviceType) return FLOOR_DEVICES[context.deviceType]?.name;
  return undefined;
}

function commsContextMatches(matchers = [], context = {}) {
  return matchers.every((matcher) => {
    const actual = commsContextValue(context, matcher.key);
    const expected = matcher.value;
    const actualText = actual === undefined || actual === null ? "" : String(actual);
    return matcher.operator === "!=" ? actualText !== expected : actualText === expected;
  });
}

function commsEventMatches(entry, trigger, context = {}) {
  return entry.trigger === trigger
    && (!entry.once || !state.commsSeen[entry.id])
    && requirementsMet(entry.requirements || [])
    && commsContextMatches(entry.context || [], context);
}

function commsVariables(context = {}) {
  const itemId = context.itemId || context.cropId || context.unitType || context.deviceType || "";
  return {
    ...context,
    cropName: context.cropName || (context.cropId ? CROPS[context.cropId]?.name : "") || "",
    marketName: context.marketName || (context.marketId ? MARKETS[context.marketId]?.name : "") || "",
    itemName: context.itemName || (itemId ? (EQUIPMENT[itemId]?.name || CROPS[itemId]?.name || GROW_UNITS[itemId]?.name || FLOOR_DEVICES[itemId]?.name) : "") || "",
    unitName: context.unitName || (context.unitType ? GROW_UNITS[context.unitType]?.name : "") || "",
    deviceName: context.deviceName || (context.deviceType ? FLOOR_DEVICES[context.deviceType]?.name : "") || ""
  };
}

function formatCommsText(template = "", context = {}) {
  const vars = commsVariables(context);
  return String(template).replaceAll(/\{([^}]+)\}/g, (_, key) => {
    const value = vars[key.trim()];
    return value === undefined || value === null ? "" : String(value);
  });
}

function commsDedupeContextKey(trigger, context = {}) {
  if (trigger === "plant_resource_shortage") return plantingShortageReason(context);
  return "";
}

function commsDedupeKey(entry) {
  const trigger = entry?.event?.trigger || "";
  if (!COMMS_DEDUPE_TRIGGERS.has(trigger)) return "";
  return trigger + ":" + commsDedupeContextKey(trigger, entry.context || {});
}

function hasMatchingQueuedComms(event, context = {}) {
  if (!COMMS_DEDUPE_TRIGGERS.has(event?.trigger)) return false;
  const key = commsDedupeKey({ event, context });
  if (!key) return false;
  return [activeComms, ...pendingComms].some((entry) => commsDedupeKey(entry) === key);
}


function storyEventMatches(entry, trigger, context = {}) {
  return entry.trigger === trigger
    && (!entry.once || !state.storySeen?.[entry.id])
    && requirementsMet(entry.requirements || [])
    && commsContextMatches(entry.context || [], context);
}

function storyEntryStillValid(entry) {
  return requirementsMet(entry?.event?.requirements || [])
    && commsContextMatches(entry?.event?.context || [], entry?.context || {});
}

function hasQueuedStory(event) {
  return [activeStory, ...pendingStories].some((entry) => entry?.event?.id === event?.id);
}

function isLaborTutorialEventTrigger(trigger = "") {
  return LABOR_TUTORIAL_EVENT_TRIGGERS.has(String(trigger));
}

function shouldDeferEventForLaborTutorial(trigger = "") {
  return isLaborTutorialActive() && !isLaborTutorialEventTrigger(trigger);
}

function cloneDeferredEventContext(context = {}) {
  try {
    return JSON.parse(JSON.stringify(context || {}));
  } catch {
    return {};
  }
}

function deferredEventEntryKey(entry = {}) {
  let contextKey = "";
  try {
    contextKey = JSON.stringify(entry.context || {});
  } catch {
    contextKey = "";
  }
  return String(entry.id || "") + "|" + contextKey;
}

function appendLaborTutorialDeferredEntries(target, entries = []) {
  const keys = new Set(target.map(deferredEventEntryKey));
  entries.forEach((entry) => {
    if (!entry?.id) return;
    const normalized = {
      id: String(entry.id),
      page: Math.max(0, Number(entry.page) || 0),
      context: cloneDeferredEventContext(entry.context)
    };
    const key = deferredEventEntryKey(normalized);
    if (keys.has(key)) return;
    keys.add(key);
    target.push(normalized);
  });
}

function suspendNonTutorialEventsForLaborTutorial() {
  if (!isLaborTutorialActive()) return false;
  const tutorial = ensureLaborTutorialState();
  const stories = [activeStory, ...pendingStories].filter(Boolean);
  const tutorialStories = stories.filter((entry) => isLaborTutorialEventTrigger(entry?.event?.trigger));
  appendLaborTutorialDeferredEntries(
    tutorial.deferredStories,
    stories
      .filter((entry) => !isLaborTutorialEventTrigger(entry?.event?.trigger))
      .map(serializeStoryEntry)
      .filter(Boolean)
  );
  activeStory = tutorialStories.shift() || null;
  pendingStories = tutorialStories;

  const comms = [activeComms, ...pendingComms].filter(Boolean);
  const tutorialComms = comms.filter((entry) => isLaborTutorialEventTrigger(entry?.event?.trigger));
  appendLaborTutorialDeferredEntries(
    tutorial.deferredComms,
    comms
      .filter((entry) => !isLaborTutorialEventTrigger(entry?.event?.trigger))
      .map(serializeCommsEntry)
      .filter(Boolean)
  );
  activeComms = tutorialComms.shift() || null;
  pendingComms = tutorialComms;

  persistStoryState();
  persistCommsState();
  renderStoryComms();
  renderComms();
  return true;
}

function deferStoryEventsForLaborTutorial(trigger, context = {}) {
  if (!shouldDeferEventForLaborTutorial(trigger)) return false;
  const tutorial = ensureLaborTutorialState();
  const deferredIds = new Set(tutorial.deferredStories.map((entry) => entry?.id));
  const events = STORY_EVENTS
    .filter((entry) => storyEventMatches(entry, trigger, context))
    .filter((event) => !hasQueuedStory(event) && !deferredIds.has(event.id));
  if (!events.length) return false;
  state.storySeen ||= {};
  const capturedAt = Date.now();
  const serialized = events.map((event) => {
    state.storySeen[event.id] = capturedAt;
    return { id: event.id, page: 0, context };
  });
  appendLaborTutorialDeferredEntries(tutorial.deferredStories, serialized);
  return true;
}

function deferCommsEventsForLaborTutorial(trigger, context = {}) {
  if (!shouldDeferEventForLaborTutorial(trigger)) return false;
  const tutorial = ensureLaborTutorialState();
  const deferredKeys = new Set(tutorial.deferredComms.map(deferredEventEntryKey));
  const events = COMM_EVENTS
    .filter((entry) => commsEventMatches(entry, trigger, context))
    .filter((event) => !hasMatchingQueuedComms(event, context))
    .filter((event) => !deferredKeys.has(deferredEventEntryKey({ id: event.id, context })));
  if (!events.length) return false;
  state.commsSeen ||= {};
  const capturedAt = Date.now();
  const serialized = events.map((event) => {
    state.commsSeen[event.id] = capturedAt;
    return { id: event.id, page: 0, context };
  });
  appendLaborTutorialDeferredEntries(tutorial.deferredComms, serialized);
  return true;
}

function deferCommsTriggerForLaborTutorial(trigger, context = {}, options = {}) {
  if (!shouldDeferEventForLaborTutorial(trigger)) return false;
  const storyDeferred = !options.skipStory && deferStoryEventsForLaborTutorial(trigger, context);
  const deferred = storyDeferred || deferCommsEventsForLaborTutorial(trigger, context);
  if (deferred) saveGame();
  return deferred;
}

function activatePendingCommsAfterStories() {
  if (activeStory || activeComms || !pendingComms.length) return false;
  activeComms = pendingComms.shift() || null;
  persistCommsState();
  renderComms();
  return Boolean(activeComms);
}

function restoreDeferredLaborTutorialEvents() {
  if (!state) return false;
  const tutorial = ensureLaborTutorialState();
  const deferredStories = tutorial.deferredStories.splice(0);
  const deferredComms = tutorial.deferredComms.splice(0);

  const restoredStories = deferredStories
    .map((entry) => {
      const event = STORY_EVENTS.find((candidate) => candidate.id === entry.id);
      return event ? { event, page: Math.max(0, Number(entry.page) || 0), context: entry.context || {} } : null;
    })
    .filter(Boolean)
    .filter(storyEntryStillValid)
    .filter((entry) => !hasQueuedStory(entry.event));
  if (activeStory) {
    pendingStories.push(...restoredStories);
  } else {
    activeStory = restoredStories.shift() || null;
    pendingStories.push(...restoredStories);
  }

  const queuedCommsKeys = new Set(
    [activeComms, ...pendingComms]
      .filter(Boolean)
      .map(serializeCommsEntry)
      .map(deferredEventEntryKey)
  );
  const restoredComms = deferredComms
    .map((entry) => {
      const event = COMM_EVENTS.find((candidate) => candidate.id === entry.id);
      return event ? { event, page: Math.max(0, Number(entry.page) || 0), context: entry.context || {} } : null;
    })
    .filter(Boolean)
    .filter(commsEntryStillValid)
    .filter((entry) => {
      const key = deferredEventEntryKey(serializeCommsEntry(entry));
      if (queuedCommsKeys.has(key)) return false;
      queuedCommsKeys.add(key);
      return true;
    });
  if (activeStory || activeComms) {
    pendingComms.push(...restoredComms);
  } else {
    activeComms = restoredComms.shift() || null;
    pendingComms.push(...restoredComms);
  }

  persistStoryState();
  persistCommsState();
  renderStoryComms();
  renderComms();
  return Boolean(activeStory || activeComms || pendingStories.length || pendingComms.length);
}

function triggerStoryEvent(trigger, context = {}) {
  if (!state || state.ended || state.debugMode) return false;
  if (shouldDeferEventForLaborTutorial(trigger)) {
    const deferred = deferStoryEventsForLaborTutorial(trigger, context);
    if (deferred) saveGame();
    return deferred;
  }
  const events = STORY_EVENTS
    .filter((entry) => storyEventMatches(entry, trigger, context))
    .filter((event) => !hasQueuedStory(event));
  if (!events.length) {
    if (activeStory) renderStoryComms();
    return false;
  }
  const nextEvents = events.map((event) => {
    state.storySeen[event.id] = Date.now();
    return { event, page: 0, context };
  });
  if (activeStory) {
    pendingStories.push(...nextEvents);
  } else {
    activeStory = nextEvents.shift();
    pendingStories.push(...nextEvents);
  }
  persistStoryState();
  renderStoryComms();
  playCommsSound(activeStory, "comms_open");
  saveGame();
  return true;
}

function serializeStoryEntry(entry) {
  if (!entry?.event?.id) return null;
  return {
    id: entry.event.id,
    page: Math.max(0, Number(entry.page) || 0),
    context: entry.context || {}
  };
}

function persistStoryState() {
  if (!state) return;
  state.storyOpen = [activeStory, ...pendingStories]
    .map(serializeStoryEntry)
    .filter(Boolean);
}

function restoreStoryState() {
  if (state?.debugMode) {
    activeStory = null;
    pendingStories = [];
    state.storyOpen = [];
    return;
  }
  let sourceEntries = state.storyOpen || [];
  if (!sourceEntries.length) {
    sourceEntries = STORY_EVENTS
      .filter((event) => event.blocking && state.storySeen?.[event.id] && !state.storyChoices?.[event.id])
      .map((event) => ({ id: event.id, page: 0, context: {} }));
  }
  const restored = sourceEntries.map((entry) => {
    const event = STORY_EVENTS.find((candidate) => candidate.id === entry.id);
    if (!event) return null;
    const maxPage = Math.max(0, event.pages.length - 1);
    return {
      event,
      page: Math.max(0, Math.min(Number(entry.page) || 0, maxPage)),
      context: entry.context || {}
    };
  }).filter(Boolean).filter(storyEntryStillValid);
  activeStory = restored.shift() || null;
  pendingStories = restored;
  persistStoryState();
}

function isStoryBlocking() {
  return Boolean(activeStory?.event?.blocking);
}

function storyCssUrl(url) {
  return String(url || "").replaceAll('"', "%22");
}

function storyPageFor(event, page) {
  return event.pages?.[page] || { speakerId: "narrator", text: "" };
}

function storySpeakerForPage(event, page) {
  return String(storyPageFor(event, page).speakerId || "narrator").trim();
}

function storyTextForPage(event, page) {
  const line = storyPageFor(event, page);
  if (line.kind === "image") return line.imageSummary || "IMAGE DATA RECEIVED";
  return String(line.text || "");
}

function storyHistoryTextForLine(line) {
  if (line?.kind === "image") return `[IMAGE] ${line.imageSummary || line.imageUrl || "IMAGE DATA"}`;
  return line?.text || "";
}

function storySpeakerMeta(event, speakerId) {
  const id = String(speakerId || "narrator").trim();
  const speaker = event.speakers?.[id];
  if (speaker) return speaker;
  return { id, name: id === "narrator" ? "??" : id, role: "", side: "system", slot: 999, icon: "" };
}

function storyHistoryMarkup(event, context, currentPage) {
  const pages = event.pages.length ? event.pages : [{ speakerId: "narrator", text: "" }];
  const start = Math.max(0, currentPage - 3);
  return pages.slice(start, currentPage).map((line, index) => {
    const pageIndex = start + index;
    const speakerId = storySpeakerForPage(event, pageIndex);
    const meta = storySpeakerMeta(event, speakerId);
    return `<p data-speaker="${escapeHtml(meta.side)}" data-speaker-id="${escapeHtml(speakerId)}"><b>${escapeHtml(formatCommsText(meta.name, context))}</b><span>${escapeHtml(formatCommsText(storyHistoryTextForLine(line), context))}</span></p>`;
  }).join("");
}

function storySpeakerCardMarkup(speaker, side, currentSpeakerId, context, depth) {
  const speaking = speaker.id === currentSpeakerId;
  const stackDepth = speaking ? 0 : depth;
  const x = side === "left" ? -14 * stackDepth : 14 * stackDepth;
  const y = 10 * stackDepth;
  const scale = Math.max(0.82, 1 - stackDepth * 0.045);
  const opacity = speaking ? 1 : 0.92;
  const z = speaking ? 20 : Math.max(1, 12 - stackDepth);
  const iconMarkup = speaker.icon
    ? `<img src="${escapeHtml(speaker.icon)}" alt="" loading="eager" decoding="async">`
    : `<span class="story-side-placeholder">NO IMAGE</span>`;
  return `<article class="story-side story-side-card story-side-${side}${speaking ? " speaking" : " is-behind"}" style="--story-card-x:${x}px;--story-card-y:${y}px;--story-card-scale:${scale};--story-card-opacity:${opacity};z-index:${z};" data-speaker-id="${escapeHtml(speaker.id)}">
    <div class="story-side-frame">${iconMarkup}</div>
    <small>${escapeHtml(formatCommsText(speaker.role || "---", context))}</small>
    <strong>${escapeHtml(formatCommsText(speaker.name || speaker.id, context))}</strong>
  </article>`;
}

function renderStorySideStack(event, side, currentSpeakerId, context) {
  const stack = document.getElementById(`story-${side}-stack`);
  if (!stack) return;
  const ids = event.speakerSides?.[side] || [];
  const speakers = ids.map((id) => event.speakers?.[id]).filter(Boolean).sort((a, b) => (a.slot - b.slot) || a.id.localeCompare(b.id));
  stack.classList.toggle("hidden", !speakers.length);
  if (!speakers.length) {
    stack.textContent = "";
    delete stack.dataset.renderKey;
    return;
  }

  const renderKey = `${event.id}|${side}|${ids.join("|")}`;
  if (stack.dataset.renderKey !== renderKey) {
    stack.innerHTML = speakers.map((speaker) => storySpeakerCardMarkup(speaker, side, "", context, 0)).join("");
    stack.dataset.renderKey = renderKey;
  }

  const cards = new Map(
    [...stack.querySelectorAll(".story-side-card")].map((card) => [card.dataset.speakerId, card])
  );
  let depth = 1;
  speakers.forEach((speaker) => {
    const card = cards.get(speaker.id);
    if (!card) return;
    const speaking = speaker.id === currentSpeakerId;
    const stackDepth = speaking ? 0 : depth;
    const x = side === "left" ? -14 * stackDepth : 14 * stackDepth;
    card.classList.toggle("speaking", speaking);
    card.classList.toggle("is-behind", !speaking);
    card.style.setProperty("--story-card-x", `${x}px`);
    card.style.setProperty("--story-card-y", `${10 * stackDepth}px`);
    card.style.setProperty("--story-card-scale", String(Math.max(0.82, 1 - stackDepth * 0.045)));
    card.style.setProperty("--story-card-opacity", speaking ? "1" : "0.92");
    card.style.zIndex = String(speaking ? 20 : Math.max(1, 12 - stackDepth));
    if (!speaking) depth += 1;
  });
}


function renderStoryImagePopup(line, context = {}) {
  const popup = document.getElementById("story-image-popup");
  if (!popup) return;
  const isImageLine = line?.kind === "image" && line.imageUrl;
  popup.classList.toggle("hidden", !isImageLine);
  popup.setAttribute("aria-hidden", isImageLine ? "false" : "true");
  if (!isImageLine) return;
  const imageUrl = formatCommsText(line.imageUrl, context);
  const summary = formatCommsText(line.imageSummary || line.imageUrl, context);
  const image = document.getElementById("story-image-popup-img");
  const caption = document.getElementById("story-image-popup-caption");
  if (image) {
    if (image.getAttribute("src") !== imageUrl) image.src = imageUrl;
    image.loading = "eager";
    image.decoding = "async";
    image.alt = summary;
  }
  if (caption) caption.textContent = summary;
}

function decodeCommsImage(image) {
  if (typeof image?.decode !== "function") return Promise.resolve();
  try {
    return image.decode().catch(() => undefined);
  } catch {
    return Promise.resolve();
  }
}

function waitForCommsImageReady(image) {
  if (!image) return Promise.resolve();
  if (image.complete) return decodeCommsImage(image);
  return new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      image.removeEventListener("load", finish);
      image.removeEventListener("error", fail);
    };
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      decodeCommsImage(image).then(resolve);
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", fail, { once: true });
    if (image.complete) finish();
  });
}

function waitForCommsBackgroundReady(source) {
  if (!source) return Promise.resolve();
  const loader = new Image();
  loader.src = source;
  return waitForCommsImageReady(loader);
}

function storyCommsVisualKey(event, line, context = {}) {
  const imageUrl = line?.kind === "image" && line.imageUrl
    ? formatCommsText(line.imageUrl, context)
    : "";
  const speakerIcons = Object.values(event.speakers || {})
    .map((speaker) => speaker?.icon || "")
    .filter(Boolean)
    .sort();
  return JSON.stringify([event.id, event.background || "", imageUrl, ...speakerIcons]);
}

function prepareCommsVisual(container, key) {
  if (container.dataset.visualReadyKey === key) {
    container.classList.remove("visual-pending");
    container.removeAttribute("aria-busy");
    return false;
  }
  container.classList.add("visual-pending");
  container.setAttribute("aria-busy", "true");
  if (container.dataset.visualPendingKey === key) return false;
  container.dataset.visualPendingKey = key;
  return true;
}

function clearCommsVisualState(container) {
  if (!container) return;
  container.classList.remove("visual-pending");
  container.removeAttribute("aria-busy");
  delete container.dataset.visualReadyKey;
  delete container.dataset.visualPendingKey;
}

function revealStoryCommsWhenReady(overlay, key, backgroundSource) {
  const token = ++storyVisualRevealToken;
  const images = Array.from(overlay.querySelectorAll(".story-side-stack img"));
  const popup = document.getElementById("story-image-popup");
  const popupImage = document.getElementById("story-image-popup-img");
  if (popupImage && popup && !popup.classList.contains("hidden")) images.push(popupImage);
  Promise.all([
    ...images.map(waitForCommsImageReady),
    waitForCommsBackgroundReady(backgroundSource)
  ]).then(() => {
    if (token !== storyVisualRevealToken || !activeStory) return;
    if (overlay.dataset.visualPendingKey !== key) return;
    overlay.dataset.visualReadyKey = key;
    delete overlay.dataset.visualPendingKey;
    overlay.classList.remove("visual-pending");
    overlay.removeAttribute("aria-busy");
  });
}

function revealCompactCommsWhenReady(banner, image, key) {
  const token = ++commsVisualRevealToken;
  waitForCommsImageReady(image).then(() => {
    if (token !== commsVisualRevealToken || !activeComms) return;
    if (banner.dataset.visualPendingKey !== key) return;
    banner.dataset.visualReadyKey = key;
    delete banner.dataset.visualPendingKey;
    banner.classList.remove("visual-pending");
    banner.removeAttribute("aria-busy");
  });
}

function advanceStoryImagePopup() {
  if (!activeStory) return;
  const pages = activeStory.event.pages.length ? activeStory.event.pages : [{ speakerId: "narrator", text: "" }];
  if (activeStory.page >= pages.length - 1) closeStoryComms("image_close");
  else nextStoryPage();
}


function renderStoryComms() {
  const overlay = document.getElementById("story-comms-overlay");
  if (!overlay || !activeStory) {
    if (overlay) {
      storyVisualRevealToken += 1;
      clearCommsVisualState(overlay);
      overlay.classList.add("hidden");
      overlay.setAttribute("aria-hidden", "true");
    }
    ["left", "right"].forEach((side) => {
      const stack = document.getElementById(`story-${side}-stack`);
      if (!stack) return;
      stack.textContent = "";
      delete stack.dataset.renderKey;
    });
    if (storyTextAnimationFrame) {
      window.cancelAnimationFrame(storyTextAnimationFrame);
      storyTextAnimationFrame = 0;
    }
    document.body.classList.remove("story-comms-active");
    renderStoryImagePopup(null);
    return;
  }
  const { event, page } = activeStory;
  const pages = event.pages.length ? event.pages : [{ speakerId: "narrator", text: "" }];
  const currentLine = storyPageFor(event, page);
  const imageLine = currentLine.kind === "image" && currentLine.imageUrl;
  const lastPage = page >= pages.length - 1;
  const visualKey = storyCommsVisualKey(event, currentLine, activeStory.context);
  const shouldWaitForVisuals = prepareCommsVisual(overlay, visualKey);
  document.body.classList.add("story-comms-active");
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  overlay.classList.toggle("blocking", Boolean(event.blocking));
  const bg = document.getElementById("story-comms-bg");
  if (bg) {
    bg.style.backgroundImage = event.background
      ? `linear-gradient(90deg, rgba(0,0,0,.74), rgba(0,0,0,.24) 42%, rgba(0,0,0,.68)), radial-gradient(circle at 50% 48%, rgba(72,219,234,.12), transparent 38%), url("${storyCssUrl(event.background)}")`
      : "";
  }
  const closeButton = document.getElementById("story-comms-close");
  if (closeButton) closeButton.hidden = Boolean(event.blocking);
  const canSkip = page < pages.length - 1;
  const skipLabel = event.choices.length > 1
    ? "選択肢まで会話をスキップ"
    : "この会話を最後までスキップ";
  document.querySelectorAll("[data-story-skip]").forEach((button) => {
    const belongsToImagePopup = button.classList.contains("story-image-skip");
    button.hidden = !canSkip || (imageLine ? !belongsToImagePopup : belongsToImagePopup);
    button.setAttribute("aria-label", skipLabel);
    button.title = skipLabel;
  });
  const kickerElement = document.getElementById("story-kicker");
  const titleElement = document.getElementById("story-comms-title");
  const storyKicker = formatCommsText(event.kicker || "", activeStory.context).trim();
  const storyTitle = formatCommsText(event.title || "", activeStory.context).trim();
  if (kickerElement) {
    kickerElement.textContent = storyKicker;
    kickerElement.hidden = !storyKicker;
  }
  if (titleElement) {
    titleElement.textContent = storyTitle;
    titleElement.hidden = !storyTitle;
  }
  const speaker = storySpeakerForPage(event, page);
  const speakerMeta = storySpeakerMeta(event, speaker);
  overlay.dataset.speaker = speakerMeta.side;
  overlay.dataset.speakerId = speaker;
  const currentName = document.getElementById("story-current-name");
  const currentRole = document.getElementById("story-current-role");
  if (currentName) currentName.textContent = formatCommsText(speakerMeta.name, activeStory.context);
  if (currentRole) {
    const roleText = formatCommsText(speakerMeta.role, activeStory.context).trim();
    currentRole.textContent = roleText;
    currentRole.hidden = !roleText;
  }
  const historyElement = document.getElementById("story-history");
  if (historyElement) historyElement.innerHTML = storyHistoryMarkup(event, activeStory.context, page);
  const textElement = document.getElementById("story-text");
  textElement.textContent = formatCommsText(storyTextForPage(event, page), activeStory.context);
  textElement.classList.toggle("story-image-line", Boolean(imageLine));
  textElement.classList.remove("live");
  if (storyTextAnimationFrame) window.cancelAnimationFrame(storyTextAnimationFrame);
  storyTextAnimationFrame = window.requestAnimationFrame(() => {
    textElement.classList.add("live");
    storyTextAnimationFrame = 0;
  });
  document.getElementById("story-progress").textContent = pages.length > 1 ? `PACKET ${page + 1}/${pages.length}` : "";
  renderStorySideStack(event, "left", speaker, activeStory.context);
  renderStorySideStack(event, "right", speaker, activeStory.context);
  renderStoryImagePopup(currentLine, activeStory.context);
  document.getElementById("story-actions").innerHTML = imageLine
    ? ""
    : lastPage
      ? (event.choices.length ? event.choices : [{ id: "close", label: text("comms_close", "LINK CLOSE") }]).map((choice) =>
        `<button class="story-link-button" data-story-choice="${escapeHtml(choice.id)}"><span>${escapeHtml(choice.label)}</span><i></i></button>`
      ).join("")
      : `<button class="story-link-button story-next-button" data-story-next><span>NEXT</span><i></i></button>`;
  if (shouldWaitForVisuals) revealStoryCommsWhenReady(overlay, visualKey, event.background || "");
}

function storyEffectApplies(effect, choiceId) {
  return !effect.choice || effect.choice === "*" || effect.choice === choiceId;
}

function runStoryEffect(effect, context = {}) {
  if (!effect) return;
  if (effect.action === "story") {
    triggerStoryEvent(effect.value, context);
    return;
  }
  if (effect.action === "comms") {
    triggerComms(effect.value, context, { skipStory: true });
    return;
  }
  if (effect.action === "grant_support_os" && effect.value) {
    const supportOS = state.supportOS || (state.supportOS = {
      harvest: false,
      planting: false,
      cleaning: false,
      storage: false
    });
    String(effect.value)
      .split("+")
      .map((osId) => osId.trim())
      .filter((osId) => ["harvest", "planting", "cleaning", "storage"].includes(osId))
      .forEach((osId) => {
        supportOS[osId] = true;
      });
    return;
  }
  if (effect.action === "labor_tutorial" && effect.value) {
    if (effect.value === "start") startLaborTutorial();
    if (effect.value === "advanced") continueAdvancedLaborTutorial();
    if (effect.value === "complete") completeLaborTutorial();
    return;
  }
  if (effect.action === "activate_labor_package_all" && effect.value) {
    const result = typeof window.activateLaborBlueprintPackageForAll === "function"
      ? window.activateLaborBlueprintPackageForAll(effect.value)
      : { ok: false, reason: "unavailable" };
    if (result?.ok) {
      toast("ホワイト労働を所有ロボット" + result.count + "台へ設定しました。", "success");
    } else {
      toast("自動設定に失敗しました。労務管理から手動で設定してください。", "warning");
    }
    return;
  }
  if (effect.action === "activate_labor_package" && effect.value) {
    const result = typeof window.activateLaborBlueprintPackage === "function"
      ? window.activateLaborBlueprintPackage(effect.value)
      : { ok: false, reason: "unavailable" };
    if (result?.ok) {
      toast("ホワイト労働を初期ロボットへ設定しました。", "success");
    } else {
      toast("自動設定に失敗しました。労務管理から手動で設定してください。", "warning");
    }
    return;
  }
  runCommsEffect(effect);
}

function applyStoryEffects(event, choiceId, context = {}) {
  (event.effects || [])
    .filter((effect) => storyEffectApplies(effect, choiceId))
    .forEach((effect) => runStoryEffect(effect, context));
}

function nextStoryPage() {
  if (!activeStory) return;
  activeStory.page += 1;
  persistStoryState();
  renderStoryComms();
  playSound("comms_page", 0.12);
}

function skipStoryComms() {
  if (!activeStory) return;
  const { event } = activeStory;
  const pages = event.pages.length ? event.pages : [{ speakerId: "narrator", text: "" }];
  const lastPage = pages.length - 1;
  if (activeStory.page >= lastPage) return;

  if (event.choices.length > 1) {
    activeStory.page = lastPage;
    persistStoryState();
    renderStoryComms();
    playSound("comms_page", 0.12);
    return;
  }

  closeStoryComms(event.choices[0]?.id || "close");
}

function closeStoryComms(choiceId = "close") {
  if (!activeStory) return;
  const closed = activeStory;
  state.storyChoices[closed.event.id] = choiceId;
  if (closed.event.id === PRE_RESULT_STORY_ID && state.pendingDay30Result) {
    state.pendingDay30Result.interviewComplete = true;
  }
  pendingStories = pendingStories.filter(storyEntryStillValid);
  activeStory = pendingStories.shift() || null;
  persistStoryState();
  renderStoryComms();
  applyStoryEffects(closed.event, choiceId, closed.context || {});
  if (!activeStory) activatePendingCommsAfterStories();
  if (activeStory) playCommsSound(activeStory, "comms_next");
  else if (activeComms) playCommsSound(activeComms, "comms_next");
  saveGame();
  completePendingDay30ResultIfReady();
}

function clearStoryForTrigger(trigger) {
  const ids = STORY_EVENTS.filter((event) => event.trigger === trigger).map((event) => event.id);
  ids.forEach((id) => {
    delete state.storySeen[id];
    delete state.storyChoices[id];
  });
  const keepEntry = (entry) => entry?.event ? !ids.includes(entry.event.id) : !ids.includes(entry?.id);
  if (activeStory && !keepEntry(activeStory)) activeStory = null;
  pendingStories = pendingStories.filter(keepEntry);
  state.storyOpen = (state.storyOpen || []).filter(keepEntry);
}

function triggerComms(trigger, context = {}, options = {}) {
  if (!state || state.ended || state.debugMode) return false;
  if (shouldDeferEventForLaborTutorial(trigger)) {
    return deferCommsTriggerForLaborTutorial(trigger, context, options);
  }
  if (!options.skipStory && triggerStoryEvent(trigger, context)) return true;
  const events = COMM_EVENTS
    .filter((entry) => commsEventMatches(entry, trigger, context))
    .filter((event) => !hasMatchingQueuedComms(event, context));
  if (!events.length) {
    if (activeComms) renderComms();
    return;
  }
  const nextEvents = events.map((event) => {
    state.commsSeen[event.id] = Date.now();
    return { event, page: 0, context };
  });
  if (activeComms) pendingComms.push(...nextEvents);
  else activeComms = nextEvents.shift();
  pendingComms.push(...nextEvents);
  persistCommsState();
  renderComms();
  playCommsSound(activeComms, "comms_open");
  saveGame();
}

function serializeCommsEntry(entry) {
  if (!entry?.event?.id) return null;
  return {
    id: entry.event.id,
    page: Math.max(0, Number(entry.page) || 0),
    context: entry.context || {}
  };
}

function persistCommsState() {
  if (!state) return;
  state.commsOpen = [activeComms, ...pendingComms]
    .map(serializeCommsEntry)
    .filter(Boolean);
}

function restoreCommsState() {
  if (state?.debugMode) {
    activeComms = null;
    pendingComms = [];
    state.commsOpen = [];
    return;
  }
  let sourceEntries = state.commsOpen || [];
  if (!sourceEntries.length) {
    sourceEntries = COMM_EVENTS
      .filter((event) => event.blocking && state.commsSeen?.[event.id] && !state.commsChoices?.[event.id])
      .map((event) => ({ id: event.id, page: 0, context: {} }));
  }
  const restoredDedupeKeys = new Set();
  const restored = sourceEntries.map((entry) => {
    const event = COMM_EVENTS.find((candidate) => candidate.id === entry.id);
    if (!event) return null;
    const maxPage = Math.max(0, event.pages.length - 1);
    return {
      event,
      page: Math.max(0, Math.min(Number(entry.page) || 0, maxPage)),
      context: entry.context || {}
    };
  }).filter(Boolean).filter(commsEntryStillValid).filter((entry) => {
    const key = commsDedupeKey(entry);
    if (!key) return true;
    if (restoredDedupeKeys.has(key)) return false;
    restoredDedupeKeys.add(key);
    return true;
  });
  activeComms = restored.shift() || null;
  pendingComms = restored;
  persistCommsState();
}

function isCommsBlocking() {
  return Boolean(activeStory?.event?.blocking || activeComms?.event?.blocking);
}

function isRadarSimulationRunning() {
  return Boolean(
    state
    && !state.debugMode
    && state.timeUnlocked
    && !state.paused
    && !isLaborTutorialActive()
    && !state.ended
    && !startScreenOpen
    && !settingsPanelOpen
    && !isCommsBlocking()
    && !isRobotGachaBlocking()
    && !isTimedModeCountdownBlocking()
  );
}

function isGameTimeRunning() {
  return Boolean(isRadarSimulationRunning() && !state.radar?.tutorialActive);
}

function isCommsInteractionTarget(target) {
  return Boolean(target?.closest?.("#story-comms-overlay, #comms-banner, #modal-backdrop, #toast-container, #confirm-widget, #start-screen, #settings-overlay, #robot-gacha-overlay, #timed-mode-countdown"));
}

function renderComms() {
  const banner = document.getElementById("comms-banner");
  if (!banner || !activeComms) {
    if (banner) {
      commsVisualRevealToken += 1;
      clearCommsVisualState(banner);
      banner.classList.add("hidden");
    }
    document.body.classList.remove("comms-modal-active");
    return;
  }
  const { event, page } = activeComms;
  const pages = event.pages.length ? event.pages : [""];
  const lastPage = page >= pages.length - 1;
  document.body.classList.toggle("comms-modal-active", Boolean(event.blocking));
  banner.classList.toggle("blocking", Boolean(event.blocking));
  const commsIcon = document.getElementById("comms-icon");
  const commsIconSource = event.icon || text("comms_fallback_icon", "assets/icons/credit.webp");
  const visualKey = JSON.stringify([event.id, commsIconSource]);
  const shouldWaitForVisuals = prepareCommsVisual(banner, visualKey);
  if (commsIcon?.getAttribute("src") !== commsIconSource) commsIcon.src = commsIconSource;
  if (commsIcon) commsIcon.loading = "eager";
  document.getElementById("comms-kicker").textContent = event.kicker || "COMMS";
  document.getElementById("comms-speaker-name").textContent = event.speakerName || "---";
  document.getElementById("comms-speaker-role").textContent = event.speakerRole || "---";
  document.getElementById("comms-title").textContent = formatCommsText(event.title || "INCOMING MESSAGE", activeComms.context);
  document.getElementById("comms-text").textContent = formatCommsText(pages[page], activeComms.context);
  document.getElementById("comms-progress").textContent = pages.length > 1 ? `${page + 1}/${pages.length}` : "";
  document.getElementById("comms-actions").innerHTML = lastPage
    ? (event.choices.length ? event.choices : [{ id: "close", label: text("comms_close", "Close") }]).map((choice) =>
      `<button data-comms-choice="${choice.id}">${choice.label}</button>`
    ).join("")
    : `<button data-comms-next>${text("comms_next", "次へ")}</button>`;
  banner.classList.remove("hidden");
  if (shouldWaitForVisuals) revealCompactCommsWhenReady(banner, commsIcon, visualKey);
}

function commsEffectApplies(effect, choiceId) {
  return !effect.choice || effect.choice === "*" || effect.choice === choiceId;
}

function runCommsEffect(effect) {
  if (!effect) return;
  if (effect.action === "tab" && effect.value) {
    switchTab(effect.value);
    return;
  }
  if (effect.action === "unlock_time") {
    unlockTutorialTime();
    return;
  }
  if (effect.action === "add_device" && effect.value) {
    if (grantFloorDevice(effect.value)) render();
    return;
  }
  if (effect.action === "guide" && effect.value) {
    setUiGuide(effect.value, { persist: false });
    return;
  }
  if (effect.action === "radar_demo") {
    queueRadarDemo();
    return;
  }
  if (effect.action === "radar_patrols" && effect.value) {
    const rawValue = String(effect.value).trim();
    setRadarPatrolCount(Number(rawValue), { relative: /^[+-]/.test(rawValue) });
    return;
  }
  if (effect.action === "radar_suspicion" && effect.value) {
    const rawValue = String(effect.value).trim();
    const value = Number(rawValue);
    if (/^[+-]/.test(rawValue)) setRadarSuspicion(ensureRadarState().suspicion + value);
    else setRadarSuspicion(value);
    return;
  }
  if (effect.action === "clear_guide") {
    clearUiGuide(effect.value || null, { persist: false });
    return;
  }
}

function applyCommsEffects(event, choiceId) {
  (event.effects || [])
    .filter((effect) => commsEffectApplies(effect, choiceId))
    .forEach(runCommsEffect);
}

function commsEntryStillValid(entry) {
  return requirementsMet(entry?.event?.requirements || [])
    && commsContextMatches(entry?.event?.context || [], entry?.context || {});
}

function closeComms(choiceId = "close") {
  if (!activeComms) return;
  const closedEvent = activeComms.event;
  state.commsChoices[closedEvent.id] = choiceId;
  applyCommsEffects(closedEvent, choiceId);
  pendingComms = pendingComms.filter(commsEntryStillValid);
  activeComms = pendingComms.shift() || null;
  persistCommsState();
  renderComms();
  if (activeComms) playCommsSound(activeComms, "comms_next");
  saveGame();
}

function isFreshOperationState() {
  const shelves = allShelves();
  const hasPlacedUnit = shelves.some((unit) => unit.placed);
  const hasPlant = shelves.some((unit) => unit.slots?.some(Boolean));
  return state.day === 1
    && !hasPlacedUnit
    && !hasPlant
    && !state.inventory.length
    && !state.tradeStats?.unitsSold
    && !state.shopUnlocked
    && !state.marketTabUnlocked;
}

function clearCommsForTrigger(trigger) {
  const ids = COMM_EVENTS.filter((event) => event.trigger === trigger).map((event) => event.id);
  ids.forEach((id) => {
    delete state.commsSeen[id];
    delete state.commsChoices[id];
  });
  const keepEntry = (entry) => entry?.event ? !ids.includes(entry.event.id) : !ids.includes(entry?.id);
  if (activeComms && !keepEntry(activeComms)) activeComms = null;
  pendingComms = pendingComms.filter(keepEntry);
  state.commsOpen = (state.commsOpen || []).filter(keepEntry);
}

function topEntry(record = {}) {
  return Object.entries(record)
    .filter(([, value]) => Number(value) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]))[0] || [null, 0];
}

function maintainedEquipmentCount() {
  const hardware = state.equipment?.fridge ? 1 : 0;
  return allShelves().length + allFloorDevices().length + hardware;
}

function marketLabel(marketId) {
  return MARKETS[marketId]?.name || marketId || "---";
}

function cropLabel(cropId) {
  return CROPS[cropId]?.name || cropId || "---";
}

function resultRankingStats(record = {}) {
  const hasTrackedRanking = [
    "titleTrackingStartedAtRevenue",
    "titleByCrop",
    "titleByMarket",
    "titleByMarketQty"
  ].some((key) => Object.prototype.hasOwnProperty.call(record, key));
  if (!hasTrackedRanking) {
    return {
      scopeLabel: "旧集計",
      trackingStarted: true,
      topCropId: record.topCropId || null,
      topCropQty: Math.max(0, Number(record.topCropQty) || 0),
      topMarketRevenueId: record.topMarketRevenueId || null,
      topMarketRevenue: Math.max(0, Number(record.topMarketRevenue) || 0),
      topMarketQtyId: record.topMarketQtyId || null,
      topMarketQty: Math.max(0, Number(record.topMarketQty) || 0)
    };
  }

  const trackingStarted = record.titleTrackingStartedAtRevenue !== null
    && record.titleTrackingStartedAtRevenue !== undefined;
  const [derivedCropId, derivedCropQty] = topEntry(record.titleByCrop || {});
  const [derivedMarketRevenueId, derivedMarketRevenue] = topEntry(record.titleByMarket || {});
  const [derivedMarketQtyId, derivedMarketQty] = topEntry(record.titleByMarketQty || {});
  return {
    scopeLabel: "全市場解放後",
    trackingStarted,
    topCropId: trackingStarted ? (record.titleTopCropId || derivedCropId || null) : null,
    topCropQty: trackingStarted ? Math.max(0, Number(record.titleTopCropQty ?? derivedCropQty) || 0) : 0,
    topMarketRevenueId: trackingStarted ? (record.titleTopMarketRevenueId || derivedMarketRevenueId || null) : null,
    topMarketRevenue: trackingStarted ? Math.max(0, Number(record.titleTopMarketRevenue ?? derivedMarketRevenue) || 0) : 0,
    topMarketQtyId: trackingStarted ? (record.titleTopMarketQtyId || derivedMarketQtyId || null) : null,
    topMarketQty: trackingStarted ? Math.max(0, Number(record.titleTopMarketQty ?? derivedMarketQty) || 0) : 0
  };
}

function resultRankingCropText(record = {}) {
  const ranking = resultRankingStats(record);
  if (!ranking.trackingStarted) return "未計測（全市場未解放）";
  if (!ranking.topCropId || ranking.topCropQty <= 0) return "記録なし";
  return `${cropLabel(ranking.topCropId)} x${formatNumber(ranking.topCropQty)}`;
}

function resultRankingMarketRevenueText(record = {}) {
  const ranking = resultRankingStats(record);
  if (!ranking.trackingStarted) return "未計測（全市場未解放）";
  if (!ranking.topMarketRevenueId || ranking.topMarketRevenue <= 0) return "記録なし";
  return `${marketLabel(ranking.topMarketRevenueId)} ₡${formatNumber(ranking.topMarketRevenue)}`;
}

function resultRankingMarketQtyText(record = {}) {
  const ranking = resultRankingStats(record);
  if (!ranking.trackingStarted) return "未計測（全市場未解放）";
  if (!ranking.topMarketQtyId || ranking.topMarketQty <= 0) return "記録なし";
  return `${marketLabel(ranking.topMarketQtyId)} x${formatNumber(ranking.topMarketQty)}`;
}

function day30Titles(summary) {
  const titles = [];
  const topCropId = summary.titleTopCropId || null;
  const topMarketRevenueId = summary.titleTopMarketRevenueId || null;
  const topMarketQtyId = summary.titleTopMarketQtyId || null;
  if (topMarketRevenueId === "upper" && topMarketQtyId === "lower") titles.push("義賊");
  if (summary.propertyCount === 1) titles.push("押し入れ農家");
  if (summary.eventRevenue >= 800 && summary.eventRevenue >= summary.revenue * 0.2) titles.push("市場読み");
  if (topCropId === "lettuce") titles.push("レタスマニア");
  else if (topCropId) titles.push(`${cropLabel(topCropId)}好き`);
  if (summary.unitsSold > 0 && Object.keys(summary.byCrop).filter((cropId) => summary.byCrop[cropId] > 0).every((cropId) => cropId === "lettuce")) {
    titles.push("レタス命");
  }
  if (topMarketQtyId === "lower") titles.push("庶民の味方");
  if (topMarketRevenueId === "medical") titles.push("医療区画御用達");
  if (topMarketRevenueId === "upper") titles.push("金の亡者");
  if (topMarketRevenueId === "rebel") titles.push("抵抗の補給線");
  if (summary.averageUnitPrice >= 180 && summary.unitsSold >= 6) titles.push("高級志向");
  if (summary.unitsSold >= 24 && summary.averageUnitPrice <= 85) titles.push("薄利多売");
  return [...new Set(titles)];
}

function createDay30Summary(options = {}) {
  const recordMode = validPlayMode(options.mode || state.mode || "day45");
  const modeConfig = playModeConfig(recordMode);
  const modeLimit = playModeLimit(recordMode);
  const byCrop = { ...(state.tradeStats?.byCrop || {}) };
  const byMarket = { ...(state.tradeStats?.byMarket || {}) };
  const byMarketQty = { ...(state.tradeStats?.byMarketQty || {}) };
  const [topCropId, topCropQty] = topEntry(byCrop);
  const [topMarketRevenueId, topMarketRevenue] = topEntry(byMarket);
  const [topMarketQtyId, topMarketQty] = topEntry(byMarketQty);
  const titleStats = titleStatsSinceAllMarketsUnlocked();
  const [titleTopCropId, titleTopCropQty] = topEntry(titleStats.byCrop);
  const [titleTopMarketRevenueId, titleTopMarketRevenue] = topEntry(titleStats.byMarket);
  const [titleTopMarketQtyId, titleTopMarketQty] = topEntry(titleStats.byMarketQty);
  const unitsSold = Number(state.tradeStats?.unitsSold) || 0;
  const revenue = Math.round(Number(state.tradeStats?.revenue) || 0);
  const completed = Boolean(options.completed ?? (Number.isFinite(modeLimit) && state.day > modeLimit));
  const fallbackDay = completed && Number.isFinite(modeLimit) ? modeLimit : state.day;
  const playedDays = Math.max(1, Math.min(modeLimit, Number(options.playedDays ?? fallbackDay) || 1));
  const records = readPlayRecords(recordMode);
  const summary = {
    id: options.id || makeId(recordMode),
    mode: recordMode,
    modeLabel: modeConfig.label,
    modeLimit: Number.isFinite(modeLimit) ? modeLimit : null,
    recordedAt: new Date().toISOString(),
    runLabel: `RUN ${String(records.length + 1).padStart(2, "0")}`,
    playerName: options.playerName || "未記名",
    completed,
    day: playedDays,
    revenue,
    money: Math.round(Number(state.money) || 0),
    unitsSold,
    averageUnitPrice: unitsSold ? Math.round(revenue / unitsSold) : 0,
    byCrop,
    byMarket,
    byMarketQty,
    topCropId,
    topCropQty,
    topMarketRevenueId,
    topMarketRevenue: Math.round(Number(topMarketRevenue) || 0),
    topMarketQtyId,
    topMarketQty,
    titleTrackingStartedAtRevenue: titleStats.startedAtRevenue,
    titleByCrop: titleStats.byCrop,
    titleByMarket: titleStats.byMarket,
    titleByMarketQty: titleStats.byMarketQty,
    titleTopCropId,
    titleTopCropQty,
    titleTopMarketRevenueId,
    titleTopMarketRevenue: Math.round(Number(titleTopMarketRevenue) || 0),
    titleTopMarketQtyId,
    titleTopMarketQty,
    equipmentCount: maintainedEquipmentCount(),
    propertyCount: ownedBases().length,
    eventRevenue: Math.round(Number(state.tradeStats?.eventRevenue) || 0),
    analytics: createAnalyticsSummary(),
    titles: []
  };
  summary.titles = day30Titles(summary);
  return summary;
}
function recordDay30Run(options = {}) {
  if (state.day30Recorded) return null;
  const summary = createDay30Summary(options);
  const records = readPlayRecords(summary.mode);
  records.unshift(summary);
  savePlayRecords(summary.mode, records);
  state.day30Recorded = true;
  state.day30RecordId = summary.id;
  pendingDay30RecordId = summary.id;
  return summary;
}

function updateDay30RecordName(recordId, playerName) {
  const name = String(playerName || "").trim() || "未記名";
  for (const mode of START_MODE_SEQUENCE) {
    const records = readPlayRecords(mode);
    const record = records.find((entry) => entry.id === recordId);
    if (record) {
      record.playerName = name;
      savePlayRecords(mode, records);
      return record;
    }
  }
  return null;
}

function unlockTutorialTime() {
  if (state.timeUnlocked) return;
  state.timeUnlocked = true;
  state.dayProgress = 0;
  state.paused = false;
  lastTickAt = Date.now();
  setStatus("Realtime clock linked. Growth, demand, and daily market drift are now live.");
  render();
}

function nextCommsPage() {
  if (!activeComms) return;
  activeComms.page += 1;
  persistCommsState();
  renderComms();
  playSound("comms_page", 0.12);
}

function spriteContentRect(image, rect) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const rectRatio = rect.width / rect.height;
  if (rectRatio > imageRatio) {
    const width = rect.height * imageRatio;
    return {
      left: rect.left + (rect.width - width) / 2,
      top: rect.top,
      width,
      height: rect.height
    };
  }
  const height = rect.width / imageRatio;
  return {
    left: rect.left,
    top: rect.bottom - height,
    width: rect.width,
    height
  };
}

function canvasForSprite(image) {
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) return null;
  const key = image.currentSrc || image.src;
  const cached = spriteAlphaCache.get(key);
  if (cached && cached.width === image.naturalWidth && cached.height === image.naturalHeight) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  try {
    context.drawImage(image, 0, 0);
  } catch (error) {
    return null;
  }
  const entry = { context, width: canvas.width, height: canvas.height };
  spriteAlphaCache.set(key, entry);
  return entry;
}

function isOpaqueImagePoint(image, clientX, clientY) {
  if (!image) return false;
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) return true;
  const rect = image.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  const contentRect = spriteContentRect(image, rect);
  if (
    clientX < contentRect.left ||
    clientX > contentRect.left + contentRect.width ||
    clientY < contentRect.top ||
    clientY > contentRect.top + contentRect.height
  ) {
    return false;
  }
  const canvas = canvasForSprite(image);
  if (!canvas) return true;
  const normalizedPixelX = Math.min(canvas.width - 1, Math.max(0, Math.floor(((clientX - contentRect.left) / contentRect.width) * canvas.width)));
  const facingLayer = image.closest(".facility-facing-layer");
  const mirrored = Boolean(facingLayer?.closest(".facility-grid.camera-reverse"));
  const pixelX = mirrored ? canvas.width - 1 - normalizedPixelX : normalizedPixelX;
  const pixelY = Math.min(canvas.height - 1, Math.max(0, Math.floor(((clientY - contentRect.top) / contentRect.height) * canvas.height)));
  try {
    return canvas.context.getImageData(pixelX, pixelY, 1, 1).data[3] > SPRITE_ALPHA_THRESHOLD;
  } catch (error) {
    return true;
  }
}

function isOpaqueEquipmentPoint(element, clientX, clientY) {
  const image = element?.querySelector?.(".equipment-sprite");
  if (!image) return true;
  return isOpaqueImagePoint(image, clientX, clientY);
}

function isOpaqueEquipmentPointer(element, event) {
  return isOpaqueEquipmentPoint(element, event.clientX, event.clientY);
}

function compareVisualStack(a, b) {
  const zIndexDifference = (Number.parseInt(getComputedStyle(b).zIndex, 10) || 0) - (Number.parseInt(getComputedStyle(a).zIndex, 10) || 0);
  if (zIndexDifference) return zIndexDifference;
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? 1 : -1;
}

function comparePlantSlotStack(a, b) {
  const itemA = a.closest(".facility-item");
  const itemB = b.closest(".facility-item");
  if (itemA && itemB && itemA !== itemB) return compareVisualStack(itemA, itemB);
  return compareVisualStack(a, b);
}

function equipmentItemAtSpritePoint(clientX, clientY, ignoredItem = null) {
  return Array.from(document.querySelectorAll(".facility-item[data-drag-kind][data-drag-id]"))
    .filter((item) => item !== ignoredItem)
    .sort(compareVisualStack)
    .find((item) => isOpaqueEquipmentPoint(item, clientX, clientY)) || null;
}

function elementFromPointWithSpriteAlpha(clientX, clientY) {
  const skipped = [];
  try {
    for (let index = 0; index < 8; index += 1) {
      const hovered = document.elementFromPoint(clientX, clientY);
      const item = hovered?.closest?.(".facility-item[data-drag-kind][data-drag-id]");
      if (!item || isOpaqueEquipmentPoint(item, clientX, clientY)) return hovered;
      skipped.push({ item, pointerEvents: item.style.pointerEvents });
      item.style.pointerEvents = "none";
    }
    return document.elementFromPoint(clientX, clientY);
  } finally {
    skipped.forEach(({ item, pointerEvents }) => {
      item.style.pointerEvents = pointerEvents;
    });
  }
}

function interactiveElementFromPoint(clientX, clientY, ignoredItem = null) {
  return equipmentItemAtSpritePoint(clientX, clientY, ignoredItem) || elementFromPointWithSpriteAlpha(clientX, clientY);
}

function gridCellAtPoint(clientX, clientY) {
  return document.elementsFromPoint(clientX, clientY)
    .map((element) => element.closest?.("[data-grid-x][data-grid-y]"))
    .find(Boolean) || null;
}

function equipmentDefinition(kind, type) {
  return kind === "unit" ? GROW_UNITS[type] : FLOOR_DEVICES[type];
}

function equipmentRecordFromElement(element) {
  if (!element) return null;
  const kind = element.dataset.dragKind;
  const id = element.dataset.dragId;
  if (!kind || !id) return null;
  const record = findOwnedEquipment(kind, id);
  if (!record) return null;
  return { ...record, kind, id, definition: equipmentDefinition(kind, record.item.type) };
}

function canReturnEquipmentToStock(kind, item) {
  return kind !== "unit" || !item.slots.some(Boolean);
}

function canSellEquipment(kind, item) {
  if (kind === "device" && item.type === "support_robot") return false;
  return kind !== "unit" || !item.slots.some(Boolean);
}
function canOpenAutomationPanel(kind, item) {
  return kind === "device" && ["support_robot", "procurement_terminal", "shipping_hatch"].includes(item.type);
}

function openAutomationPanelForEquipment(kind, id) {
  const record = findOwnedEquipment(kind, id);
  const item = record?.item;
  if (!item || !canOpenAutomationPanel(kind, item)) return false;
  if (item.type === "support_robot") {
    selectedLaborRobotId = item.id;
    switchTab("labor");
    renderLabor();
    return true;
  }
  if (item.type === "procurement_terminal") {
    showProcurementTerminal();
    return true;
  }
  if (item.type === "shipping_hatch") {
    showShippingTerminal();
    return true;
  }
  return false;
}

function equipmentCleanText(item) {
  const dirt = Math.round(item.dirt || 0);
  if (dirt >= 60) return `DIRT ${dirt}% // CLEAN NEEDED`;
  if (dirt >= 25) return `DIRT ${dirt}% // WATCH`;
  return `DIRT ${dirt}% // CLEAN`;
}

function cancelEquipmentMenuTimer() {
  if (!equipmentMenuTimer) return;
  clearTimeout(equipmentMenuTimer.timerId);
  equipmentMenuTimer = null;
}

function clearEquipmentMenu() {
  cancelEquipmentMenuTimer();
  if (equipmentMenu?.menu) equipmentMenu.menu.remove();
  if (equipmentMenu?.source?.releasePointerCapture) {
    try {
      equipmentMenu.source.releasePointerCapture(equipmentMenu.pointerId);
    } catch (error) {}
  }
  equipmentMenu = null;
}

function setEquipmentMenuAction(action) {
  if (!equipmentMenu) return;
  equipmentMenu.activeAction = action;
  equipmentMenu.menu.querySelectorAll("[data-pie-action]").forEach((button) => {
    const active = button.dataset.pieAction === action;
    button.classList.toggle("active", active);
  });
}

function updateEquipmentMenu(event) {
  if (!equipmentMenu || event.pointerId !== equipmentMenu.pointerId) return false;
  const dx = event.clientX - equipmentMenu.centerX;
  const dy = event.clientY - equipmentMenu.centerY;
  const distance = Math.hypot(dx, dy);
  if (distance < 22) {
    setEquipmentMenuAction(null);
  } else {
    const action = equipmentMenu.automationAvailable && dy > 18 && Math.abs(dy) > Math.abs(dx) * 0.72
      ? "automation"
      : (dx < 0 ? "stock" : "sell");
    const disabled = (action === "stock" && equipmentMenu.stockDisabled)
      || (action === "sell" && equipmentMenu.sellDisabled)
      || (action === "automation" && !equipmentMenu.automationAvailable);
    setEquipmentMenuAction(disabled ? null : action);
  }
  event.preventDefault();
  return true;
}

function finishEquipmentMenu(event) {
  if (!equipmentMenu || event.pointerId !== equipmentMenu.pointerId) return false;
  updateEquipmentMenu(event);
  const action = equipmentMenu.activeAction;
  const { kind, id } = equipmentMenu;
  clearEquipmentMenu();
  suppressClickUntil = Date.now() + 260;
  executeEquipmentMenuAction(kind, id, action);
  return true;
}

function executeEquipmentMenuAction(kind, id, action) {
  if (action === "stock") {
    returnItemToStock(kind, id);
  } else if (action === "sell") {
    sellOwnedItem(kind, id);
  } else if (action === "automation") {
    openAutomationPanelForEquipment(kind, id);
  }
}

function openEquipmentMenu(element, event, options = {}) {
  const record = equipmentRecordFromElement(element);
  if (!record || !record.item.placed) return false;
  if (harvestHold && harvestHold.source === element) harvestHold = null;
  clearEquipmentMenu();
  const stockDisabled = !canReturnEquipmentToStock(record.kind, record.item);
  const sellDisabled = !canSellEquipment(record.kind, record.item);
  const automationAvailable = canOpenAutomationPanel(record.kind, record.item);
  const menu = document.createElement("div");
  menu.className = `equipment-pie-menu ${options.persistent ? "persistent-menu" : ""}`.trim();
  menu.style.left = `${event.clientX}px`;
  menu.style.top = `${event.clientY}px`;
  const tags = tagMarkup(record.item.tags, EQUIPMENT_TAGS);
  menu.innerHTML = `
    <div class="equipment-mini-window">
      <p class="eyebrow">${record.definition.code || record.item.type}</p>
      <strong>${record.definition.name}</strong>
      <small>${equipmentCleanText(record.item)}</small>
      ${tags}
    </div>
    <button class="pie-action pie-stock ${stockDisabled ? "disabled" : ""}" data-pie-action="stock" type="button" ${stockDisabled ? "disabled" : ""}><span>STOCK</span></button>
    <button class="pie-action pie-sell ${sellDisabled ? "disabled" : ""}" data-pie-action="sell" type="button" ${sellDisabled ? "disabled" : ""}><span>SELL</span></button>
    ${automationAvailable ? `<button class="pie-action pie-auto" data-pie-action="automation" type="button"><span>AUTO</span></button>` : ""}`;
  document.body.appendChild(menu);
  if (options.persistent) {
    menu.querySelectorAll("[data-pie-action]").forEach((button) => {
      button.addEventListener("click", (clickEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        if (button.disabled) return;
        const action = button.dataset.pieAction;
        const { kind, id } = equipmentMenu;
        clearEquipmentMenu();
        executeEquipmentMenuAction(kind, id, action);
      });
    });
  }
  equipmentMenu = {
    pointerId: event.pointerId,
    source: element,
    menu,
    kind: record.kind,
    id: record.id,
    centerX: event.clientX,
    centerY: event.clientY,
    activeAction: null,
    stockDisabled,
    sellDisabled,
    automationAvailable,
    persistent: Boolean(options.persistent)
  };
  if (element.setPointerCapture) {
    try {
      element.setPointerCapture(event.pointerId);
    } catch (error) {}
  }
  playSound("equipment_menu_open", 0.18);
  suppressClickUntil = Date.now() + 300;
  event.preventDefault();
  return true;
}

function beginEquipmentMenuHold(element, event) {
  cancelEquipmentMenuTimer();
  const holdDelay = event.pointerType === "mouse" ? 360 : 520;
  equipmentMenuTimer = {
    pointerId: event.pointerId,
    source: element,
    startX: event.clientX,
    startY: event.clientY,
    timerId: window.setTimeout(() => {
      const pending = equipmentMenuTimer;
      if (!pending || pending.pointerId !== event.pointerId) return;
      equipmentMenuTimer = null;
      openEquipmentMenu(pending.source, {
        pointerId: pending.pointerId,
        clientX: pending.startX,
        clientY: pending.startY,
        pointerType: event.pointerType,
        preventDefault() {}
      });
    }, holdDelay)
  };
  if (element.setPointerCapture) {
    try {
      element.setPointerCapture(event.pointerId);
    } catch (error) {}
  }
  suppressClickUntil = Date.now() + holdDelay + 80;
  event.preventDefault();
  return true;
}

function beginPointerDrag(source, event, payload, startX = event.clientX, startY = event.clientY) {
  dragPayload = payload;
  source?.classList.remove("guide-pulse");
  source?.removeAttribute("data-guide-active");
  source?.querySelectorAll?.(".guide-pulse, [data-guide-active]").forEach((element) => {
    element.classList.remove("guide-pulse");
    element.removeAttribute("data-guide-active");
  });
  event.preventDefault();
  let anchor = { x: 0, y: 0 };
  if (dragPayload.type === "equipment") {
    const record = findOwnedEquipment(dragPayload.kind, dragPayload.id);
    if (record) anchor = dragAnchorForItem(record.item, dragPayload.kind, startX, startY);
  }
  pointerDrag = {
    source,
    startX,
    startY,
    pointerId: event.pointerId,
    anchorX: anchor.x,
    anchorY: anchor.y,
    dropOrigin: null,
    dropUnitId: null,
    moved: false,
    ghost: null,
    ghostHalfWidth: 78,
    ghostHalfHeight: 46
  };
  if (pointerDrag.source.setPointerCapture) {
    try {
      pointerDrag.source.setPointerCapture(event.pointerId);
    } catch (error) {}
  }
}

function updatePendingEquipmentMenu(event) {
  if (!equipmentMenuTimer || event.pointerId !== equipmentMenuTimer.pointerId) return false;
  const distance = Math.hypot(event.clientX - equipmentMenuTimer.startX, event.clientY - equipmentMenuTimer.startY);
  if (distance > 10) {
    const pending = equipmentMenuTimer;
    cancelEquipmentMenuTimer();
    beginPointerDrag(pending.source, event, {
      type: "equipment",
      kind: pending.source.dataset.dragKind,
      id: pending.source.dataset.dragId
    }, pending.startX, pending.startY);
    return false;
  }
  event.preventDefault();
  return true;
}

function clearCleanToolTarget() {
  document.querySelectorAll(".clean-tool-target").forEach((element) => element.classList.remove("clean-tool-target"));
}

function clearCleanToolDrag() {
  if (!cleanToolDrag) return;
  cleanToolDrag.source?.classList.remove("dragging");
  cleanToolDrag.ghost?.remove();
  clearCleanToolTarget();
  document.body.classList.remove("clean-tool-active");
  cleanToolDrag = null;
}

function beginCleanToolDrag(button, event) {
  cleanToolDrag = {
    pointerId: event.pointerId,
    source: button,
    tool: button.dataset.cleanTool,
    startX: event.clientX,
    startY: event.clientY,
    ghost: null,
    target: null,
    lastSoundAt: 0
  };
  button.classList.add("dragging");
  document.body.classList.add("clean-tool-active");
  if (button.setPointerCapture) {
    try {
      button.setPointerCapture(event.pointerId);
    } catch (error) {}
  }
  playSound("clean_tool_grab", 0.18);
  event.preventDefault();
}

function updateCleanToolDrag(event) {
  if (!cleanToolDrag || event.pointerId !== cleanToolDrag.pointerId) return false;
  if (!cleanToolDrag.ghost) {
    cleanToolDrag.ghost = cleanToolDrag.source.cloneNode(true);
    cleanToolDrag.ghost.className = `clean-tool-ghost tool-${cleanToolDrag.tool}`;
    document.body.appendChild(cleanToolDrag.ghost);
  }
  cleanToolDrag.ghost.style.left = `${event.clientX}px`;
  cleanToolDrag.ghost.style.top = `${event.clientY}px`;
  clearCleanToolTarget();
  const target = equipmentItemAtSpritePoint(event.clientX, event.clientY);
  cleanToolDrag.target = target;
  if (target) {
    target.classList.add("clean-tool-target");
    const now = Date.now();
    if (cleanToolDrag.tool === "brush" && now - cleanToolDrag.lastSoundAt > 420) {
      playSound("clean_tool_brush_loop", 0.08);
      cleanToolDrag.lastSoundAt = now;
    }
  }
  event.preventDefault();
  return true;
}

function finishCleanToolDrag(event) {
  if (!cleanToolDrag || event.pointerId !== cleanToolDrag.pointerId) return false;
  const target = equipmentItemAtSpritePoint(event.clientX, event.clientY);
  const record = equipmentRecordFromElement(target);
  const tool = cleanToolDrag.tool;
  clearCleanToolDrag();
  suppressClickUntil = Date.now() + 220;
  if (record) {
    cleanItem(record.kind, record.id, tool);
  } else {
    rejectFeedback();
  }
  return true;
}

function selectedPlacementItem() {
  if (!placementSelection) return null;
  const record = findOwnedEquipment(placementSelection.kind, placementSelection.id);
  return record ? { ...record.item, kind: placementSelection.kind } : null;
}

function cancelPlacementSelection() {
  if (!placementSelection) return;
  placementSelection = null;
  selectedUnitId = null;
  selectedDeviceId = null;
  setStatus("設置をキャンセルしました。未設置の設備はストックから再配置できます。");
  renderFarm();
}

function placeSelectedAt(x, y) {
  const selected = selectedPlacementItem();
  if (!selected) return;
  placeItemAt(selected.kind, selected.id, x, y);
}

function placeItemAt(kind, id, x, y, targetElement = null, options = {}) {
  const selectAfterPlace = options.selectAfterPlace !== false;
  let record = findOwnedEquipment(kind, id);
  if (!record) return false;
  const selected = { ...record.item, kind };
  if (!canPlace(selected, x, y, selected.id)) {
    toast("Action failed.", "error");
    rejectFeedback();
    return false;
  }
  record = moveEquipmentToBase(record, currentBase());
  const item = record.item;
  Object.assign(item, { x, y, placed: true });
  if (kind === "device" && item.type === "support_robot") {
    applySupportRobotPlacementEffects(item);
    if (item.supportWorkforceSelectionHintPending) {
      queueSupportRobotTalkFlag("additional_support_robot_placed", {
        robotId: item.id,
        baseId: currentBase().id,
        talkOccurrenceKey: "robot:" + item.id
      }, item.id);
    }
  }
  trackPlacementAnalytics(kind, item);
  removeDuplicateEquipmentEntries(kind, item.id, record.base.id);
  placementSelection = null;
  if (!selectAfterPlace) {
    selectedUnitId = null;
    selectedDeviceId = null;
  } else if (kind === "unit") {
    selectedUnitId = selected.id;
    selectedDeviceId = null;
  } else {
    selectedDeviceId = selected.id;
    selectedUnitId = null;
  }
  setStatus(`${kind === "unit" ? GROW_UNITS[item.type].name : FLOOR_DEVICES[item.type].name}を区画 (${x + 1}, ${y + 1}) に設置しました。`);
  playSound("equipment_place");
  burstEffect(targetElement, kind === "unit" ? "#72ffb8" : FLOOR_DEVICES[item.type].color, 14);
  clearUiGuideTargets([`place-${item.type}`, `place-${kind}-${item.type}`], { persist: false });
  triggerComms("first_place", { kind, itemId: item.type });
  updateProgressionUnlocks();
  saveGame();
  render();
  return true;
}

function dragAnchorForItem(item, kind, clientX, clientY) {
  const size = footprint({ ...item, kind });
  if (!item.placed) {
    return {
      x: Math.floor((size.width - 1) / 2),
      y: Math.floor((size.height - 1) / 2)
    };
  }
  let nearest = { x: 0, y: 0, distance: Infinity };
  for (let offsetY = 0; offsetY < size.height; offsetY += 1) {
    for (let offsetX = 0; offsetX < size.width; offsetX += 1) {
      const cell = document.querySelector(`[data-grid-x="${item.x + offsetX}"][data-grid-y="${item.y + offsetY}"]`);
      if (!cell) continue;
      const rect = cell.getBoundingClientRect();
      const distance = Math.hypot(clientX - (rect.left + rect.width / 2), clientY - (rect.top + rect.height / 2));
      if (distance < nearest.distance) nearest = { x: offsetX, y: offsetY, distance };
    }
  }
  return { x: nearest.x, y: nearest.y };
}

function movingCoverageRadius(item, kind) {
  if (kind !== "device") return 0;
  if (item.type === "support_robot") return supportRobotRange(item);
  return Number(FLOOR_DEVICES[item.type]?.radius) || 0;
}

function highlightMovingCoverage(item, kind, originX, originY) {
  const radius = movingCoverageRadius(item, kind);
  if (radius <= 0) return;
  const size = footprint({ ...item, kind });
  const centerX = originX + Math.floor((size.width - 1) / 2);
  const centerY = originY + Math.floor((size.height - 1) / 2);
  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      if (!isWithinGridRange(x, y, centerX, centerY, radius)) continue;
      const cell = document.querySelector(`[data-grid-x="${x}"][data-grid-y="${y}"]`);
      if (cell && !cell.classList.contains("blocked-cell")) {
        cell.classList.add("moving-coverage", `moving-coverage-${item.type}`);
      }
    }
  }
}

function clearMovingCoverageClasses(element) {
  element.classList.remove("dragging", "drop-target", "drop-footprint", "seed-drop-target", "moving-coverage");
  Array.from(element.classList)
    .filter((className) => className.startsWith("moving-coverage-"))
    .forEach((className) => element.classList.remove(className));
}

function highlightDragFootprint(item, kind, originX, originY) {
  highlightMovingCoverage(item, kind, originX, originY);
  const size = footprint({ ...item, kind });
  for (let offsetY = 0; offsetY < size.height; offsetY += 1) {
    for (let offsetX = 0; offsetX < size.width; offsetX += 1) {
      const cell = document.querySelector(`[data-grid-x="${originX + offsetX}"][data-grid-y="${originY + offsetY}"]`);
      if (cell) cell.classList.add("drop-target", "drop-footprint");
    }
  }
}

function isoGridMetrics(base) {
  const rawPoints = [
    { x: 0, y: 0 },
    { x: base.cols - 1, y: 0 },
    { x: 0, y: base.rows - 1 },
    { x: base.cols - 1, y: base.rows - 1 }
  ].map(({ x, y }) => ({
    x: ((y - x) * ISO_TILE_WIDTH) / 2,
    y: ((x + y) * ISO_TILE_HEIGHT) / 2
  }));
  const minX = Math.min(...rawPoints.map((point) => point.x));
  const maxX = Math.max(...rawPoints.map((point) => point.x));
  const minY = Math.min(...rawPoints.map((point) => point.y));
  const maxY = Math.max(...rawPoints.map((point) => point.y));
  const width = maxX - minX + ISO_TILE_WIDTH + ISO_GRID_PAD_X * 2;
  const height = maxY - minY + ISO_TILE_HEIGHT + ISO_GRID_PAD_Y * 2 + 120;
  return {
    width,
    height,
    originX: ISO_GRID_PAD_X + ISO_TILE_WIDTH / 2 - minX,
    originY: ISO_GRID_PAD_Y + ISO_TILE_HEIGHT / 2 - minY
  };
}

function gridToIso(x, y, base = currentBase()) {
  const metrics = isoGridMetrics(base);
  return {
    x: metrics.originX + ((y - x) * ISO_TILE_WIDTH) / 2,
    y: metrics.originY + ((x + y) * ISO_TILE_HEIGHT) / 2
  };
}

function equipmentIsoPosition(item, kind, base = currentBase()) {
  const placement = facilityCameraItemPlacement(item, kind, base);
  const { size } = placement;
  return {
    ...gridToIso(placement.x + (size.width - 1) / 2, placement.y + (size.height - 1) / 2, base),
    size
  };
}

function clampFacilityZoom(value) {
  return Math.max(FACILITY_ZOOM_MIN, Math.min(FACILITY_ZOOM_MAX, value));
}

function applyFacilityView() {
  const grid = document.getElementById("facility-grid");
  if (!grid) return;
  grid.style.setProperty("--view-x", `${facilityView.x}px`);
  grid.style.setProperty("--view-y", `${facilityView.y}px`);
  grid.style.setProperty("--view-zoom", facilityView.zoom.toFixed(2));
}

function resetFacilityView() {
  facilityView = { x: 0, y: 0, zoom: FACILITY_INITIAL_ZOOM };
  applyFacilityView();
}

function zoomFacility(delta) {
  facilityView.zoom = clampFacilityZoom(facilityView.zoom + delta);
  applyFacilityView();
}

function toggleFacilityCamera() {
  const shell = document.querySelector(".facility-grid-shell");
  if (!shell || facilityPinch || facilityPan || pointerDrag || cleanToolDrag) return;
  clearDragState();
  clearTimeout(facilityCameraTransitionTimer);
  shell.classList.remove("camera-turning");
  void shell.offsetWidth;
  shell.classList.add("camera-turning");
  facilityCameraViewSide = isFacilityCameraReversed() ? "front" : "reverse";
  playSound("tab_switch", 0.16);
  hapticFeedback([7, 24, 7]);
  window.requestAnimationFrame(() => renderFarm());
  facilityCameraTransitionTimer = window.setTimeout(() => {
    document.querySelector(".facility-grid-shell")?.classList.remove("camera-turning");
    facilityCameraTransitionTimer = null;
  }, 720);
}

function pointerPairMetrics() {
  const points = Array.from(facilityPointers.values());
  if (points.length < 2) return null;
  const [first, second] = points;
  return {
    distance: Math.max(1, Math.hypot(second.x - first.x, second.y - first.y)),
    centerX: (first.x + second.x) / 2,
    centerY: (first.y + second.y) / 2
  };
}

function beginFacilityPinch(shell) {
  const metrics = pointerPairMetrics();
  if (!metrics) return;
  facilityPinch = {
    startDistance: metrics.distance,
    startCenterX: metrics.centerX,
    startCenterY: metrics.centerY,
    startZoom: facilityView.zoom,
    viewX: facilityView.x,
    viewY: facilityView.y,
    moved: false
  };
  facilityPan = null;
  harvestSwipe = null;
  clearDragState();
  shell.classList.add("panning");
}

function updateFacilityPinch(event) {
  if (!facilityPinch || !facilityPointers.has(event.pointerId)) return false;
  facilityPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const metrics = pointerPairMetrics();
  if (!metrics) return false;
  event.preventDefault();
  facilityPinch.moved = true;
  facilityView.zoom = clampFacilityZoom(facilityPinch.startZoom * (metrics.distance / facilityPinch.startDistance));
  facilityView.x = facilityPinch.viewX + (metrics.centerX - facilityPinch.startCenterX);
  facilityView.y = facilityPinch.viewY + (metrics.centerY - facilityPinch.startCenterY);
  applyFacilityView();
  return true;
}

function endFacilityPointer(event) {
  facilityPointers.delete(event.pointerId);
  if (facilityPinch && facilityPointers.size < 2) {
    const shell = document.querySelector(".facility-grid-shell");
    if (shell) shell.classList.remove("panning");
    if (facilityPinch.moved) suppressClickUntil = Date.now() + 180;
    facilityPinch = null;
  }
}

function startPlacement(kind, id) {
  const record = findOwnedEquipment(kind, id);
  if (!record) return;
  const item = record.item;
  item.placed = false;
  item.x = null;
  item.y = null;
  placementSelection = { kind, id };
  selectedUnitId = kind === "unit" ? id : null;
  selectedDeviceId = kind === "device" ? id : null;
  setStatus("Select a destination that fits the whole equipment. Dragging uses the grabbed point as the anchor.");
  saveGame();
  renderFarm();
}

function returnItemToStock(kind, id) {
  const record = findOwnedEquipment(kind, id);
  if (!record) return;
  const item = record.item;
  if (kind === "unit" && item.slots.some(Boolean)) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  const definition = kind === "unit" ? GROW_UNITS[item.type] : FLOOR_DEVICES[item.type];
  item.placed = false;
  item.x = null;
  item.y = null;
  trackStockAnalytics(kind, item);
  placementSelection = null;
  selectedUnitId = null;
  selectedDeviceId = null;
  setStatus(`${definition.name}をStockへ戻しました。`);
  toast(`${definition.name}をStockへ収納`);
  playSound("stock_store", 0.2);
  saveGame();
  renderFarm();
}

function refreshPropertyListings() {
  const fee = PROPERTY_REROLL_FEE;
  if (state.money < fee) {
    toast("Action failed.", "error");
    return;
  }
  state.money -= fee;
  addRadarSuspicion(radarPurchaseSuspicion(fee));
  state.propertyListings = generatePropertyListings(PROPERTY_LISTING_COUNT);
  setStatus(`不動産ブローカーへ更新料 ₡${PROPERTY_REROLL_FEE}を支払い、新しい物件情報を取得しました。`);
  playSound("property_refresh");
  saveGame();
  render();
}

function refreshProcurementLineup() {
  if (state.money < PROCUREMENT_REROLL_FEE) {
    toast("Action failed.", "error");
    return;
  }
  state.money -= PROCUREMENT_REROLL_FEE;
  addRadarSuspicion(radarPurchaseSuspicion(PROCUREMENT_REROLL_FEE));
  state.procurementTags = {};
  ensureProcurementTags();
  setStatus(`マラへ更新料 ₡${PROCUREMENT_REROLL_FEE}を支払い、タグ付き設備ラインナップを引き直しました。`);
  playSound("procurement_refresh");
  saveGame();
  render();
}

function sellOwnedItem(kind, id) {
  const record = findOwnedEquipment(kind, id);
  if (!record) return;
  const { collection, item } = record;
  if (kind === "unit" && item.slots.some(Boolean)) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  const definition = kind === "unit" ? GROW_UNITS[item.type] : FLOOR_DEVICES[item.type];
  const basePrice = EQUIPMENT[item.type]?.basePrice || definition.price || 50;
  const refund = Math.max(10, Math.round(basePrice * 0.45 * (1 - Math.min(0.35, (item.dirt || 0) / 240))));
  const index = collection.indexOf(item);
  collection.splice(index, 1);
  state.money += refund;
  trackEquipmentSaleAnalytics(kind, item, refund);
  selectedUnitId = selectedUnitId === id ? null : selectedUnitId;
  selectedDeviceId = selectedDeviceId === id ? null : selectedDeviceId;
  placementSelection = null;
  setStatus(`${definition.name}を解体売却し、₡${formatNumber(refund)}を回収しました。`);
  toast(`売却 +₡${formatNumber(refund)}`);
  playSoundFirst(["equipment_sell", "sale"], 0.26);
  saveGame();
  render();
}

function contractProperty(propertyId) {
  const property = state.propertyListings.find((item) => item.id === propertyId);
  if (!property || state.money < property.price) {
    toast("Action failed.", "error");
    return;
  }
  state.money -= property.price;
  addRadarSuspicion(radarPurchaseSuspicion(property.price));
  const newBase = normalizeBase({ ...property, price: 0, shelves: [], floorDevices: [], ownedAt: Date.now() });
  state.bases.push(newBase);
  trackPurchase("property", propertyId, property.price, { itemName: property.name, width: newBase.width, height: newBase.height, tier: newBase.tier });
  state.activeBaseId = newBase.id;
  placementSelection = null;
  selectedUnitId = null;
  selectedDeviceId = null;
  state.propertyListings = generatePropertyListings(PROPERTY_LISTING_COUNT);
  setStatus(`${property.name}を追加拠点として契約しました。新しい区画を選択中です。`);
  toast(`NEW BASE ADDED // ${property.name}`);
  playSound("property_contract");
  triggerComms("relocate", { propertyId });
  updateProgressionUnlocks();
  saveGame();
  render();
  switchTab("farm");
}

function checkFactionProgression() {
  updateProgressionUnlocks();
}

function plantSeed(shelfIndex, slotIndex, cropId = selectedSeed, sourceElement = null) {
  if (state.ended) return;
  if (!cropId || state.seeds[cropId] <= 0) {
    trackPlantingFailure("seed_unavailable", { cropId });
    toast("Action failed.", "error");
    rejectFeedback();
    return;
  }
  const unit = currentShelves()[shelfIndex];
  const slot = unit.slots[slotIndex];
  if (slot) {
    trackPlantingFailure("occupied_slot", { cropId, unitType: unit.type, shelfIndex, slotIndex });
    return;
  }

  const plantingCost = plantingResourceCost(cropId, unit);
  if (state.water < plantingCost.water || state.nutrient < plantingCost.nutrient) {
    const shortageContext = resourceShortageContext(cropId, unit, plantingCost);
    trackPlantingFailure(plantingShortageReason(shortageContext), shortageContext);
    toast(`資源不足: ${shortageContext.missingResources}`, "warning");
    triggerComms("plant_resource_shortage", shortageContext);
    rejectFeedback();
    return;
  }

  state.water -= plantingCost.water;
  state.nutrient -= plantingCost.nutrient;
  state.seeds[cropId] -= 1;
  const plantedAt = Date.now();
  unit.slots[slotIndex] = {
    id: makeId("plant"),
    crop: cropId,
    growth: 0,
    ready: false,
    readyAge: 0,
    degraded: false,
    waterShortage: false,
    nutrientShortage: false,
    witherProgress: 0,
    dead: false,
    visualStage: 1,
    stagePulseAt: plantedAt,
    prepaid: !GROW_UNITS[unit.type].continuous,
    quality: null,
    careCompletedStages: [],
    careGrowthBonus: 0
  };
  trackPlanting(cropId, unit, shelfIndex, slotIndex, plantingCost);
  const resourceNote = plantingCost.water || plantingCost.nutrient
    ? ` Initial feed: water ${formatResource(plantingCost.water)} / nutrient ${formatResource(plantingCost.nutrient)}`
    : " Continuous feed while growing.";
  setStatus(`${CROPS[cropId].name} planted in ${GROW_UNITS[unit.type].name} ${shelfIndex + 1}.${resourceNote}`);
  const plantTarget = sourceElement || document.querySelector(`[data-shelf="${shelfIndex}"][data-slot="${slotIndex}"]`);
  playSound("plant_seed");
  hapticFeedback(12);
  burstEffect(plantTarget, CROPS[cropId].color, 14);
  pulseElement(document.querySelector(`[data-select-unit="${unit.id}"]`), "equipment-confirm");
  const commsContext = {
    cropId,
    cropName: CROPS[cropId]?.name || cropId,
    unitType: unit.type,
    unitName: GROW_UNITS[unit.type]?.name || unit.type,
    shelfIndex,
    slotIndex
  };
  clearUiGuideTargets([`seed-${cropId}`, `plant-${cropId}`], { persist: false });
  triggerComms("first_plant", commsContext);
  triggerComms("plant", commsContext);
  saveGame();
  render();
}

function determineQuality(plant, hasLed, hasFan, qualityBonus = 0) {
  let roll = Math.random();
  let quality;
  const ledBonus = hasLed ? 0.1 : 0;
  const fanBonus = hasFan ? 0.05 : 0;
  const tagBonus = (qualityBonus || 0) + plantCareQualityBonus(plant);

  if (roll < 0.05 + ledBonus * 0.35 + fanBonus * 0.2 + tagBonus * 0.35) quality = "S";
  else if (roll < 0.2 + ledBonus + fanBonus + tagBonus) quality = "A";
  else quality = "B";

  let index = ["C", "B", "A", "S"].indexOf(quality);
  if (plant.waterShortage) index -= 1;
  if (plant.nutrientShortage) index -= 1;
  return ["C", "B", "A", "S"][Math.max(0, index)];
}

function triggerSRankReadyComms(plant, shelf, base = null) {
  if (!plant || plant.quality !== "S") return;
  triggerComms("first_s_rank_crop", {
    cropId: plant.crop,
    cropName: CROPS[plant.crop]?.name || plant.crop,
    quality: plant.quality,
    unitType: shelf?.type || "",
    unitName: GROW_UNITS[shelf?.type]?.name || shelf?.type || "",
    baseId: base?.id || "",
    baseName: base?.name || ""
  });
}

function harvest(shelfIndex, slotIndex, sourceElement = null) {
  const shelf = currentShelves()[shelfIndex];
  const plant = shelf.slots[slotIndex];
  if (!plant || !plant.ready) return;

  addInventoryFromPlant(plant);
  trackHarvestAnalytics(plant, shelf, 1);
  if (plant.crop === "tomato") state.tomatoHarvested = true;
  const harvestTarget = sourceElement || document.querySelector(`[data-shelf="${shelfIndex}"][data-slot="${slotIndex}"]`);
  shelf.slots[slotIndex] = null;
  setStatus(`${CROPS[plant.crop].name}を収穫。品質 ${plant.quality} を在庫へ移しました。`);
  toast(`${CROPS[plant.crop].name}を収穫しました`);
  playSound("harvest_single");
  hapticFeedback(10);
  burstEffect(harvestTarget, QUALITY[plant.quality].color, 24);
  floatingFeedback(harvestTarget, "+1 " + CROPS[plant.crop].name, QUALITY[plant.quality].color, "harvest");
  state.marketTabUnlocked = true;
  const commsContext = {
    cropId: plant.crop,
    cropName: CROPS[plant.crop]?.name || plant.crop,
    quality: plant.quality,
    unitType: shelf.type,
    unitName: GROW_UNITS[shelf.type]?.name || shelf.type,
    shelfIndex,
    slotIndex,
    qty: 1
  };
  triggerComms("first_harvest", commsContext);
  triggerComms("harvest", commsContext);
  checkVictory();
  saveGame();
  render();
}

function harvestReadyPlantsInUnit(unitId, sourceElement = null) {
  const shelfIndex = currentShelves().findIndex((unit) => unit.id === unitId);
  const shelf = currentShelves()[shelfIndex];
  if (!shelf) return false;
  const readySlots = shelf.slots
    .map((plant, slotIndex) => plant?.ready ? slotIndex : -1)
    .filter((slotIndex) => slotIndex >= 0);
  if (!readySlots.length) return false;

  let harvested = 0;
  let lastCrop = null;
  let lastQuality = null;
  readySlots.forEach((slotIndex) => {
    const plant = shelf.slots[slotIndex];
    addInventoryFromPlant(plant);
    trackHarvestAnalytics(plant, shelf, 1);
    if (plant.crop === "tomato") state.tomatoHarvested = true;
    lastCrop = plant.crop;
    lastQuality = plant.quality;
    const slotTarget = document.querySelector(`[data-shelf="${shelfIndex}"][data-slot="${slotIndex}"]`);
    if (slotTarget) {
      const qualityColor = QUALITY[plant.quality]?.color || "#72ffb8";
      window.setTimeout(() => {
        burstEffect(slotTarget, qualityColor, 10);
        floatingFeedback(slotTarget, "+1", qualityColor, "harvest small");
      }, harvested * 55);
    }
    shelf.slots[slotIndex] = null;
    harvested += 1;
  });

  const definition = GROW_UNITS[shelf.type];
  setStatus(`${definition.name}から${harvested}株を収穫しました。品質 ${lastQuality} を在庫へ移しました。`);
  toast(`${definition.name} 収穫 +${harvested}`);
  playSound("harvest_bulk");
  hapticFeedback([8, 32, 8]);
  const bulkTarget = sourceElement || document.querySelector(`[data-select-unit="${unitId}"]`);
  burstEffect(bulkTarget, QUALITY[lastQuality]?.color || "#72ffb8", 26);
  floatingFeedback(bulkTarget, "+" + harvested + " STOCK", QUALITY[lastQuality]?.color || "#72ffb8", "harvest");
  state.marketTabUnlocked = true;
  if (lastCrop) {
    const commsContext = {
      cropId: lastCrop,
      cropName: CROPS[lastCrop]?.name || lastCrop,
      quality: lastQuality,
      unitType: shelf.type,
      unitName: GROW_UNITS[shelf.type]?.name || shelf.type,
      unitId,
      qty: harvested
    };
    triggerComms("first_harvest", commsContext);
    triggerComms("harvest", commsContext);
  }
  checkVictory();
  saveGame();
  render();
  return true;
}

function harvestReadyUnitAtPoint(clientX, clientY) {
  const slot = plantSlotElementAtPoint(clientX, clientY);
  if (slot) return harvestReadySlotElement(slot);
  const item = equipmentItemAtSpritePoint(clientX, clientY);
  const unitId = item?.dataset.selectUnit;
  if (!unitId || harvestSwipe?.harvested?.has(unitId)) return false;
  const unit = currentShelves().find((entry) => entry.id === unitId);
  if (!unit || GROW_UNIT_SLOT_LAYOUTS[unit.type]?.length || !unit.slots.some((plant) => plant?.ready)) return false;
  harvestSwipe?.harvested?.add(unitId);
  return harvestReadyPlantsInUnit(unitId, item);
}

function harvestReadyUnitElement(element) {
  const slot = element?.closest?.("[data-box-plant-slot]");
  if (slot) return harvestReadySlotElement(slot);
  const unitId = element?.dataset.selectUnit;
  if (!unitId || harvestSwipe?.harvested?.has(unitId)) return false;
  const unit = currentShelves().find((entry) => entry.id === unitId);
  if (!unit || GROW_UNIT_SLOT_LAYOUTS[unit.type]?.length || !unit.slots.some((plant) => plant?.ready)) return false;
  harvestSwipe?.harvested?.add(unitId);
  return harvestReadyPlantsInUnit(unitId, element);
}

function plantSlotElementAtPoint(clientX, clientY) {
  const directSlot = document.elementsFromPoint(clientX, clientY)
    .map((element) => element.closest?.("[data-box-plant-slot]"))
    .find(Boolean);
  if (directSlot) return directSlot;
  return Array.from(document.querySelectorAll("[data-box-plant-slot].planted"))
    .sort(comparePlantSlotStack)
    .find((slot) => isOpaqueImagePoint(slot.querySelector(".box-plant-sprite"), clientX, clientY)) || null;
}

function harvestReadySlotElement(element) {
  const shelfIndex = Number(element?.dataset.shelf);
  const slotIndex = Number(element?.dataset.slot);
  const key = `slot:${shelfIndex}:${slotIndex}`;
  if (!Number.isInteger(shelfIndex) || !Number.isInteger(slotIndex) || harvestSwipe?.harvested?.has(key)) return false;
  const plant = currentShelves()[shelfIndex]?.slots?.[slotIndex];
  if (!plant?.ready) return false;
  harvestSwipe?.harvested?.add(key);
  harvest(shelfIndex, slotIndex, element);
  return true;
}

function handleFacilityEquipmentTap(element, event) {
  const resourceMarker = event.target.closest?.("[data-resource-ready]");
  if (!element || (!resourceMarker && !isOpaqueEquipmentPointer(element, event))) return false;
  const unitButton = element.closest("[data-select-unit]");
  if (unitButton) {
    const unit = currentShelves().find((entry) => entry.id === unitButton.dataset.selectUnit);
    if (unit?.slots.some((plant) => plant?.ready) && !GROW_UNIT_SLOT_LAYOUTS[unit.type]?.length) {
      harvestReadyPlantsInUnit(unit.id, unitButton);
      return true;
    }
    if (unit) {
      setStatus(observationForUnit(unit));
      return true;
    }
    return false;
  }

  const deviceButton = element.closest("[data-select-device]");
  if (deviceButton) {
    const device = currentFloorDevices().find((entry) => entry.id === deviceButton.dataset.selectDevice);
    if (resourceProductionDefinition(device)) return collectProducedResource(device);
    if (device?.type === "support_robot") {
      setStatus("Support robot selected. Long press or right click, then choose AUTO.");
      return true;
    }
    if (device?.type === "procurement_terminal") {
      setStatus("Procurement terminal selected. Long press or right click, then choose AUTO.");
      return true;
    }
    if (device?.type === "shipping_hatch") {
      setStatus("Shipping hatch selected. Long press or right click, then choose AUTO.");
      return true;
    }
    if (device) {
      setStatus(`${FLOOR_DEVICES[device.type].name}が低く唸っています。周囲の空気だけが少し違う速度で動いています。`);
      return true;
    }
  }
  return false;
}

function handleSlotClick(shelfIndex, slotIndex) {
  const plant = currentShelves()[shelfIndex].slots[slotIndex];
  if (!plant) plantSeed(shelfIndex, slotIndex);
  else if (plant.dead) removeDeadPlant(shelfIndex, slotIndex);
  else if (plant.ready) harvest(shelfIndex, slotIndex, document.querySelector(`[data-shelf="${shelfIndex}"][data-slot="${slotIndex}"]`));
}

function removeDeadPlant(shelfIndex, slotIndex) {
  const plant = currentShelves()[shelfIndex].slots[slotIndex];
  if (!plant || !plant.dead) return;
  trackDeadPlantAnalytics(plant, currentShelves()[shelfIndex], "removed");
  currentShelves()[shelfIndex].slots[slotIndex] = null;
  setStatus(`枯死した${CROPS[plant.crop].name}を撤去しました。`);
  saveGame();
  render();
}

function buySeed(cropId) {
  if (!isUnlocked("seed_item", cropId)) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  const crop = CROPS[cropId];
  const price = currentSeedPrice(cropId);
  if (state.money < price) {
    toast("Action failed.", "error");
    return;
  }
  state.money -= price;
  addRadarSuspicion(radarPurchaseSuspicion(price));
  state.seeds[cropId] = (state.seeds[cropId] || 0) + crop.packSize;
  trackPurchase("seed", cropId, price, {
    itemName: crop.name,
    packSize: crop.packSize,
    packCount: 1,
    unitPrice: price,
    basePrice: seedMarketBasePrice(cropId)
  });
  selectedSeed = cropId;
  setStatus(crop.name + " seed pack purchased for ₡" + formatNumber(price) + ". +" + crop.packSize + " seeds.");
  playSound("buy_seed");
  pulseElement(document.getElementById("money-value"));
  const commsContext = {
    itemId: cropId,
    itemKind: "seed",
    cropId,
    cropName: crop.name,
    itemName: crop.name,
    packSize: crop.packSize,
    price
  };
  triggerComms("buy_seed", commsContext);
  triggerComms("buy_item", commsContext);
  saveGame();
  render();
}
const supportRobotGachaState = {
  active: false,
  phase: "idle",
  candidates: [],
  offer: null,
  pendingIndex: -1,
  selectedRobot: null,
  timers: new Set(),
  intervals: new Set()
};

function isRobotGachaBlocking() {
  return supportRobotGachaState.active;
}
function supportRobotGachaReducedMotion() {
  return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
}

function supportRobotGachaTimeout(callback, delay) {
  const timer = window.setTimeout(() => {
    supportRobotGachaState.timers.delete(timer);
    callback();
  }, delay);
  supportRobotGachaState.timers.add(timer);
  return timer;
}

function supportRobotGachaInterval(callback, delay) {
  const timer = window.setInterval(callback, delay);
  supportRobotGachaState.intervals.add(timer);
  return timer;
}

function clearSupportRobotGachaTimers() {
  supportRobotGachaState.timers.forEach((timer) => window.clearTimeout(timer));
  supportRobotGachaState.intervals.forEach((timer) => window.clearInterval(timer));
  supportRobotGachaState.timers.clear();
  supportRobotGachaState.intervals.clear();
}

function supportRobotGachaColor(value) {
  const color = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : "#79a58f";
}

function supportRobotGachaSerial(robot, index = 0) {
  const suffix = String(robot?.id || "").replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase();
  return "UG-" + (suffix || String(index + 1).padStart(4, "0"));
}

function supportRobotGachaCandidateLabel(index) {
  return "CANDIDATE " + String(index + 1).padStart(2, "0");
}

function supportRobotGachaCandidateMarkup(robot, index) {
  const skill = supportRobotSkill(robot);
  const personalities = supportRobotPersonalities(robot);
  const rarity = supportRobotPersonalityRarity(robot);
  const personalityNames = personalities.map((entry) => entry.name).join(" / ") || "未設定";
  const personalityDescription = personalities
    .map((entry) => entry.description)
    .filter(Boolean)
    .join(" / ");
  const taskDefinitions = [
    ["収穫", "harvest"],
    ["種まき", "plant"],
    ["清掃", "cleaning"],
    ["調達", "procure"],
    ["出荷", "ship"],
    ["資源回収", "resource_collect"]
  ];
  const grades = taskDefinitions.map(([label, task]) => {
    const grade = supportTaskGrade(robot, task);
    return '<span>' + escapeHtml(label) + '<b class="grade-' + escapeHtml(grade.toLowerCase()) + '">' + escapeHtml(grade) + '</b></span>';
  }).join("");
  const sprite = FLOOR_DEVICES.support_robot?.sprite || FLOOR_DEVICES.support_robot?.icon || "assets/characters/supportRobot-iso-leftdown.webp";
  const blueprintTaskCount = robot.supportBlueprint?.nodes?.filter((node) => node.type === "task").length || 0;
  const tags = tagMarkup(robot.tags, EQUIPMENT_TAGS);
  return [
    '<div class="robot-gacha-card-inner">',
      '<div class="robot-gacha-card-top">',
        '<div class="robot-gacha-card-image"><img src="' + escapeHtml(sprite) + '" alt=""></div>',
        '<div>',
          '<span class="robot-gacha-card-kicker">' + escapeHtml(supportRobotGachaCandidateLabel(index)) + ' // ' + escapeHtml(supportRobotGachaSerial(robot, index)) + '</span>',
          '<h3>' + escapeHtml(skill.name || robot.robotSkillId || "SUPPORT UNIT") + '</h3>',
          '<span class="robot-gacha-rarity-chip">' + escapeHtml(rarity.name || "STANDARD") + ' // ' + personalities.length + ' TAG' + (personalities.length === 1 ? "" : "S") + '</span>',
        '</div>',
      '</div>',
      '<div class="robot-gacha-personalities">',
        '<strong>' + escapeHtml(personalityNames) + '</strong>',
        '<small>' + escapeHtml(personalityDescription || "性格特性の説明は未設定です。") + '</small>',
      '</div>',
      '<div class="robot-gacha-grades">' + grades + '</div>',
      '<div class="robot-gacha-metrics">',
        '<span>RANGE<b>' + escapeHtml(supportRobotRange(robot)) + ' GRID</b></span>',
        '<span>POWER<b>' + Math.round(Number(robot.supportEnergy) || 0) + '</b></span>',
        '<span>MORALE<b>' + Math.round(Number(robot.supportMorale) || 0) + '</b></span>',
      '</div>',
      '<p class="robot-gacha-skill-note">' + escapeHtml(skill.description || "作業適性データを読み込みました。") + '<br>BLUEPRINT // ' + (blueprintTaskCount ? blueprintTaskCount + ' TASK NODES' : "READY FOR SETUP") + '</p>',
      tags,
      '<span class="robot-gacha-card-pick">SELECT TO CONTRACT</span>',
    '</div>'
  ].join("");
}

function supportRobotGachaBestRarity() {
  return supportRobotGachaState.candidates
    .map((robot) => supportRobotPersonalityRarity(robot))
    .sort((a, b) => Number(b.count) - Number(a.count))[0]
    || { name: "STANDARD", color: "#79a58f" };
}

function resetSupportRobotGachaOverlay() {
  const drop = document.getElementById("robot-gacha-drop");
  const reveal = document.getElementById("robot-gacha-reveal");
  const confirm = document.getElementById("robot-gacha-confirm");
  const boot = document.getElementById("robot-gacha-boot");
  [drop, reveal, confirm, boot].forEach((element) => element?.classList.add("hidden"));
  drop?.classList.remove("is-active");
  boot?.classList.remove("awake");
  const seal = document.getElementById("robot-gacha-seal");
  if (seal) {
    seal.textContent = "SEAL";
    seal.classList.remove("locked");
    seal.style.removeProperty("color");
    seal.style.removeProperty("border-color");
    seal.style.removeProperty("box-shadow");
  }
}

function startSupportRobotGachaPurchase(price, tags) {
  if (supportRobotGachaState.active) return;
  const overlay = document.getElementById("robot-gacha-overlay");
  if (!overlay) {
    toast("サポートロボットの契約画面を開けませんでした。", "error");
    return;
  }
  supportRobotGachaState.active = true;
  lastTickAt = Date.now();
  supportRobotGachaState.phase = "drop";
  supportRobotGachaState.offer = { price, tags: [...tags] };
  supportRobotGachaState.pendingIndex = -1;
  supportRobotGachaState.selectedRobot = null;
  supportRobotGachaState.candidates = Array.from({ length: 3 }, () => {
    const robot = createFloorDevice("support_robot");
    robot.tags = [...tags];
    return robot;
  });
  clearSupportRobotGachaTimers();
  resetSupportRobotGachaOverlay();
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("robot-gacha-active");
  renderHeader();
  renderTimeControl();
  const drop = document.getElementById("robot-gacha-drop");
  drop?.classList.remove("hidden");
  if (drop) {
    void drop.offsetWidth;
    drop.classList.add("is-active");
  }
  playSoundFirst(["buy_equipment", "equipment_purchase", "purchase"]);
  hapticFeedback(12);
  startSupportRobotGachaDropSequence();
}

function startSupportRobotGachaDropSequence() {
  const log = document.getElementById("robot-gacha-decode-log");
  const seal = document.getElementById("robot-gacha-seal");
  if (log) log.textContent = "";
  const rarityCycle = ROBOT_PERSONALITY_RARITIES.length
    ? ROBOT_PERSONALITY_RARITIES
    : [{ name: "STANDARD", color: "#79a58f" }];
  let cycleIndex = 0;
  supportRobotGachaInterval(() => {
    const hex = Array.from({ length: 6 }, () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0")).join(" ");
    if (log) {
      log.textContent = ("> DECRYPT " + hex + " :: " + (Math.random() < 0.82 ? "SYNC" : "RETRY") + "\n" + log.textContent).slice(0, 1800);
    }
  }, 92);
  supportRobotGachaInterval(() => {
    if (!seal) return;
    const rarity = rarityCycle[cycleIndex % rarityCycle.length];
    const color = supportRobotGachaColor(rarity.color);
    seal.style.color = color;
    seal.style.borderColor = color;
    seal.style.boxShadow = "0 0 22px " + color + "88";
    cycleIndex += 1;
  }, 150);

  const reduced = supportRobotGachaReducedMotion();
  supportRobotGachaTimeout(() => {
    const rarity = supportRobotGachaBestRarity();
    const color = supportRobotGachaColor(rarity.color);
    if (seal) {
      seal.textContent = rarity.name || "LOCK";
      seal.style.color = color;
      seal.style.borderColor = color;
      seal.style.boxShadow = "0 0 30px " + color + "aa";
      seal.classList.add("locked");
    }
    playSound("alert", 0.12);
    hapticFeedback(18);
  }, reduced ? 30 : 2200);
  supportRobotGachaTimeout(showSupportRobotGachaReveal, reduced ? 80 : 3100);
}

function showSupportRobotGachaReveal() {
  if (!supportRobotGachaState.active || supportRobotGachaState.phase !== "drop") return;
  clearSupportRobotGachaTimers();
  supportRobotGachaState.phase = "reveal";
  document.getElementById("robot-gacha-drop")?.classList.add("hidden");
  const reveal = document.getElementById("robot-gacha-reveal");
  const cards = document.getElementById("robot-gacha-cards");
  const hint = document.getElementById("robot-gacha-selection-hint");
  reveal?.classList.remove("hidden");
  if (hint) hint.textContent = "候補情報を復号しています";
  if (!cards) return;
  cards.innerHTML = supportRobotGachaState.candidates.map((robot, index) => {
    const rarity = supportRobotPersonalityRarity(robot);
    const color = supportRobotGachaColor(rarity.color);
    const label = supportRobotGachaCandidateLabel(index);
    return '<button class="robot-gacha-card" style="--gacha-rarity-color:' + color + '" type="button" role="listitem" data-robot-gacha-candidate="' + index + '" aria-label="' + escapeHtml(label) + 'を復号中" disabled><span class="robot-gacha-card-cover">ENCRYPTED</span></button>';
  }).join("");

  const reduced = supportRobotGachaReducedMotion();
  supportRobotGachaState.candidates.forEach((robot, index) => {
    supportRobotGachaTimeout(() => {
      const card = cards.querySelector('[data-robot-gacha-candidate="' + index + '"]');
      if (!card) return;
      card.classList.add("scanning");
      playSound("click", 0.06);
      supportRobotGachaTimeout(() => {
        card.classList.remove("scanning");
        card.classList.add("revealed");
        card.innerHTML = supportRobotGachaCandidateMarkup(robot, index);
        card.disabled = false;
        const personalityNames = supportRobotPersonalities(robot).map((entry) => entry.name).join(" / ");
        card.setAttribute("aria-label", supportRobotGachaCandidateLabel(index) + "、" + personalityNames + "を選択");
        playSound(index === 2 ? "unlock_notice" : "click", index === 2 ? 0.13 : 0.08);
        hapticFeedback(6 + index * 2);
        if (index === supportRobotGachaState.candidates.length - 1) {
          if (hint) hint.textContent = "カードを選ぶと契約内容を確認できます";
          cards.querySelector(".robot-gacha-card")?.focus({ preventScroll: true });
        }
      }, reduced ? 10 : 520);
    }, reduced ? 10 + index * 20 : 250 + index * 820);
  });
}

function askSupportRobotGachaContract(index) {
  if (!supportRobotGachaState.active || supportRobotGachaState.phase !== "reveal") return;
  const robot = supportRobotGachaState.candidates[index];
  if (!robot) return;
  supportRobotGachaState.pendingIndex = index;
  const personalities = supportRobotPersonalities(robot);
  const rarity = supportRobotPersonalityRarity(robot);
  const textNode = document.getElementById("robot-gacha-confirm-text");
  if (textNode) {
    const names = personalities.map((entry) => entry.name).join(" / ") || "未設定";
    textNode.textContent = supportRobotGachaCandidateLabel(index) + " // " + rarity.name + " // " + names + " と契約します。契約額は ₡" + formatNumber(supportRobotGachaState.offer?.price || 0) + " です。";
  }
  const confirm = document.getElementById("robot-gacha-confirm");
  confirm?.classList.remove("hidden");
  confirm?.querySelector("[data-robot-gacha-confirm]")?.focus({ preventScroll: true });
  playSound("click", 0.1);
}

function cancelSupportRobotGachaContract() {
  supportRobotGachaState.pendingIndex = -1;
  document.getElementById("robot-gacha-confirm")?.classList.add("hidden");
  document.querySelector(".robot-gacha-card.revealed")?.focus({ preventScroll: true });
}

function commitSupportRobotGachaContract() {
  const index = supportRobotGachaState.pendingIndex;
  const robot = supportRobotGachaState.candidates[index];
  const offer = supportRobotGachaState.offer;
  if (!robot || !offer || supportRobotGachaState.phase !== "reveal") return;
  if (state.money < offer.price) {
    toast("契約時に所持金が不足しました。", "error");
    closeSupportRobotGachaOverlay();
    render();
    return;
  }

  supportRobotGachaState.phase = "contracted";
  supportRobotGachaState.selectedRobot = robot;
  document.getElementById("robot-gacha-confirm")?.classList.add("hidden");
  state.money -= offer.price;
  addRadarSuspicion(radarPurchaseSuspicion(offer.price));
  robot.supportWorkforceSelectionHintPending = true;
  currentFloorDevices().push(robot);
  supportRobotRoster();

  const itemName = EQUIPMENT.support_robot?.name || "サポートロボット";
  setStatus(itemName + "と契約しました。栽培区画の設備ストックに追加しました。");
  toast(supportRobotDisplayName(robot) + "を契約しました。");
  pulseElement(document.getElementById("money-value"));
  trackPurchase("device", "support_robot", offer.price, {
    itemName,
    tags: [...offer.tags],
    placementRequired: true,
    candidateCount: supportRobotGachaState.candidates.length,
    personalityIds: supportRobotPersonalityIds(robot),
    skillId: robot.robotSkillId
  });
  const commsContext = {
    itemId: "support_robot",
    itemKind: "device",
    itemName,
    deviceType: "support_robot",
    robotId: robot.id,
    robotName: supportRobotDisplayName(robot)
  };
  triggerComms("buy_support_robot", commsContext);
  triggerComms("buy_item", commsContext);
  updateProgressionUnlocks();
  checkVictory();
  saveGame();
  render();

  const selectedCard = document.querySelector('[data-robot-gacha-candidate="' + index + '"]');
  selectedCard?.insertAdjacentHTML("beforeend", '<span class="robot-gacha-contract-stamp">CONTRACTED</span>');
  document.querySelectorAll(".robot-gacha-card").forEach((card) => {
    if (card !== selectedCard) card.classList.add("rejected");
  });
  playSound("equipment_place", 0.25);
  hapticFeedback(24);
  supportRobotGachaTimeout(showSupportRobotGachaBoot, supportRobotGachaReducedMotion() ? 30 : 900);
}

function showSupportRobotGachaBoot() {
  const robot = supportRobotGachaState.selectedRobot;
  if (!robot || !supportRobotGachaState.active) return;
  supportRobotGachaState.phase = "boot";
  document.getElementById("robot-gacha-reveal")?.classList.add("hidden");
  const boot = document.getElementById("robot-gacha-boot");
  const image = document.getElementById("robot-gacha-boot-image");
  const name = document.getElementById("robot-gacha-boot-name");
  const rarityNode = document.getElementById("robot-gacha-boot-rarity");
  const line = document.getElementById("robot-gacha-boot-line");
  const rarity = supportRobotPersonalityRarity(robot);
  const personalities = supportRobotPersonalities(robot);
  const sprite = FLOOR_DEVICES.support_robot?.sprite || FLOOR_DEVICES.support_robot?.icon || "assets/characters/supportRobot-iso-leftdown.webp";
  if (image) image.src = sprite;
  if (name) name.textContent = supportRobotDisplayName(robot);
  if (rarityNode) {
    rarityNode.textContent = (rarity.name || "STANDARD") + " // " + supportRobotGachaSerial(robot);
    rarityNode.style.color = supportRobotGachaColor(rarity.color);
  }
  if (line) line.textContent = "";
  boot?.classList.remove("hidden", "awake");
  const message = "起動確認。性格タグ「" + (personalities.map((entry) => entry.name).join(" / ") || "未設定") + "」と作業適性「" + supportRobotSkill(robot).name + "」を読み込みました。配置地点の指定を待機します。";
  supportRobotGachaTimeout(() => {
    boot?.classList.add("awake");
    playSound("unlock_notice", 0.16);
    if (!line) return;
    if (supportRobotGachaReducedMotion()) {
      line.textContent = message;
      document.getElementById("robot-gacha-done")?.focus({ preventScroll: true });
      return;
    }
    let cursor = 0;
    const typing = supportRobotGachaInterval(() => {
      cursor += 1;
      line.textContent = message.slice(0, cursor);
      if (cursor >= message.length) {
        window.clearInterval(typing);
        supportRobotGachaState.intervals.delete(typing);
        document.getElementById("robot-gacha-done")?.focus({ preventScroll: true });
      }
    }, 28);
  }, supportRobotGachaReducedMotion() ? 10 : 420);
}

function closeSupportRobotGachaOverlay() {
  clearSupportRobotGachaTimers();
  const overlay = document.getElementById("robot-gacha-overlay");
  resetSupportRobotGachaOverlay();
  overlay?.classList.add("hidden");
  overlay?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("robot-gacha-active");
  supportRobotGachaState.active = false;
  supportRobotGachaState.phase = "idle";
  supportRobotGachaState.candidates = [];
  supportRobotGachaState.offer = null;
  supportRobotGachaState.pendingIndex = -1;
  supportRobotGachaState.selectedRobot = null;
  lastTickAt = Date.now();
  render();
  document.querySelector('.tab[data-tab="shop"]')?.focus({ preventScroll: true });
}

function bindSupportRobotGachaEvents() {
  const overlay = document.getElementById("robot-gacha-overlay");
  if (!overlay || overlay.dataset.bound === "true") return;
  overlay.dataset.bound = "true";
  overlay.addEventListener("click", (event) => {
    const skip = event.target.closest("[data-robot-gacha-skip]");
    if (skip) showSupportRobotGachaReveal();
    const candidate = event.target.closest("[data-robot-gacha-candidate]");
    if (candidate && candidate.classList.contains("revealed")) {
      askSupportRobotGachaContract(Number(candidate.dataset.robotGachaCandidate));
    }
    if (event.target.closest("[data-robot-gacha-cancel]")) cancelSupportRobotGachaContract();
    if (event.target.closest("[data-robot-gacha-confirm]")) commitSupportRobotGachaContract();
    if (event.target.closest("#robot-gacha-done")) closeSupportRobotGachaOverlay();
    event.stopPropagation();
  });
  document.addEventListener("keydown", (event) => {
    if (!supportRobotGachaState.active) return;
    if (event.key === "Escape" && !document.getElementById("robot-gacha-confirm")?.classList.contains("hidden")) {
      event.preventDefault();
      cancelSupportRobotGachaContract();
    } else if (!["Tab", "Enter", " "].includes(event.key)) {
      event.preventDefault();
    }
    event.stopImmediatePropagation();
  });
}
function buyEquipment(itemId) {
  if (NON_PURCHASABLE_RESOURCE_ITEMS.has(itemId)) {
    toast("水と養液は生産設備から補給してください。", "warning");
    rejectFeedback();
    return;
  }
  if (!EQUIPMENT[itemId]) return;
  if (!isUnlocked("shop_item", itemId)) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  let price = EQUIPMENT[itemId].basePrice;
  if (GROW_UNITS[itemId]) price = growUnitPrice(itemId);
  const tags = (GROW_UNITS[itemId] || FLOOR_DEVICES[itemId]) ? unitTags(itemId) : [];
  const tagEffects = combinedEffects(tags, EQUIPMENT_TAGS);
  if (tags.length) price = Math.max(1, Math.round(price * (tagEffects.priceMod || 1)));

  if (itemId === "fridge" && state.equipment.fridge) {
    toast("Action unavailable right now.", "warning");
    return;
  }
  if (state.money < price) {
    toast("Action failed.", "error");
    return;
  }

  if (itemId === "support_robot") {
    startSupportRobotGachaPurchase(price, tags);
    return;
  }

  state.money -= price;
  addRadarSuspicion(radarPurchaseSuspicion(price));
  const resourceCartridge = RESOURCE_CARTRIDGE_ITEMS[itemId];
  if (resourceCartridge) {
    state.resourceCartridges ||= { water: 0, nutrient: 0 };
    const resource = resourceCartridge.resource;
    state.resourceCartridges[resource] = resourceCartridgeCount(resource) + 1;
    syncResourceCapacities();
  }
  if (GROW_UNITS[itemId]) {
    const definition = GROW_UNITS[itemId];
    const unit = {
      id: makeId("unit"),
      type: itemId,
      led: false,
      fan: false,
      placed: false,
      x: null,
      y: null,
      tags,
      dirt: 0,
      slots: Array(definition.slots).fill(null)
    };
    currentShelves().push(unit);
  }
  if (FLOOR_DEVICES[itemId]) {
    const device = createFloorDevice(itemId);
    device.tags = tags;
    currentFloorDevices().push(device);
    if (itemId === "support_robot") supportRobotRoster();
  }
  if (itemId === "fridge") state.equipment.fridge = true;
  if (itemId === "support_os_harvest") state.supportOS.harvest = true;
  if (itemId === "support_os_planting") state.supportOS.planting = true;
  if (itemId === "support_os_cleaning") state.supportOS.cleaning = true;
  if (itemId === "support_os_storage") state.supportOS.storage = true;

  const placementNote = GROW_UNITS[itemId] || FLOOR_DEVICES[itemId] ? " 栽培区画の設備ストックに追加しました。" : "";
  setStatus(`${EQUIPMENT[itemId].name}を購入しました。${placementNote}`);
  toast(`${EQUIPMENT[itemId].name}を調達`);
  playSoundFirst(["buy_equipment", "equipment_purchase", "purchase"]);
  pulseElement(document.getElementById("money-value"));
  const itemKind = GROW_UNITS[itemId] ? "unit" : FLOOR_DEVICES[itemId] ? "device" : ["water", "nutrient"].includes(itemId) ? "resource" : "upgrade";
  trackPurchase(itemKind, itemId, price, {
    itemName: EQUIPMENT[itemId]?.name || itemId,
    tags,
    placementRequired: Boolean(GROW_UNITS[itemId] || FLOOR_DEVICES[itemId])
  });
  const commsContext = {
    itemId,
    itemKind,
    itemName: EQUIPMENT[itemId]?.name || itemId,
    unitType: GROW_UNITS[itemId] ? itemId : "",
    deviceType: FLOOR_DEVICES[itemId] ? itemId : ""
  };
  triggerComms(`buy_${GROW_UNITS[itemId] ? `unit_${itemId}` : itemId}`, commsContext);
  triggerComms("buy_item", commsContext);
  updateProgressionUnlocks();
  checkVictory();
  saveGame();
  render();
}

function inventorySaleQuote(marketId = selectedMarket) {
  refreshInventoryAges();
  if (!isMarketAvailable(marketId)) return { marketId, items: [], qty: 0, revenue: 0 };
  const items = state.inventory.flatMap((batch) => {
    const qty = Math.max(0, Number(batch.qty) || 0);
    if (!qty || !canSellCropToMarket(batch.crop, marketId)) return [];
    if (isInventoryBatchDegraded(batch)) batch.degraded = true;
    const unitPrice = getUnitPrice(batch, marketId);
    return [{
      batchId: batch.id,
      cropId: batch.crop,
      qty,
      unitPrice,
      revenue: unitPrice * qty
    }];
  });
  return {
    marketId,
    items,
    qty: items.reduce((sum, item) => sum + item.qty, 0),
    revenue: items.reduce((sum, item) => sum + item.revenue, 0)
  };
}

function executeBatchSale(batchId, options = {}) {
  const marketId = options.marketId || selectedMarket;
  const batch = state.inventory.find((item) => item.id === batchId);
  if (!batch || !canSellCropToMarket(batch.crop, marketId)) return null;
  refreshInventoryAges();
  const availableQty = Math.max(0, Number(batch.qty) || 0);
  if (!availableQty) return null;
  const requestedQty = options.qty ?? saleQuantities[batchId] ?? 1;
  const qty = Math.max(1, Math.min(availableQty, Number(requestedQty) || 1));
  const batchAge = inventoryAgeDays(batch);
  if (isInventoryBatchDegraded(batch)) batch.degraded = true;
  const unitPrice = Number.isFinite(Number(options.unitPrice))
    ? Math.max(1, Math.round(Number(options.unitPrice)))
    : getUnitPrice(batch, marketId);
  const revenue = unitPrice * qty;
  const moneyBeforeSale = state.money;
  const premiumSale = unitPrice >= Math.round((CROPS[batch.crop]?.basePrice || unitPrice) * (batch.quality === "S" ? 1.25 : 1.15));

  batch.qty -= qty;
  state.money += revenue;
  state.tradeStats.unitsSold = (Number(state.tradeStats.unitsSold) || 0) + qty;
  state.tradeStats.revenue = (Number(state.tradeStats.revenue) || 0) + revenue;
  state.tradeStats.byMarket ||= { lower: 0, medical: 0, upper: 0, rebel: 0 };
  state.tradeStats.byMarket[marketId] = (Number(state.tradeStats.byMarket[marketId]) || 0) + revenue;
  state.tradeStats.byMarketQty ||= { lower: 0, medical: 0, upper: 0, rebel: 0 };
  state.tradeStats.byMarketQty[marketId] = (Number(state.tradeStats.byMarketQty[marketId]) || 0) + qty;
  state.tradeStats.byCrop ||= {};
  state.tradeStats.byCrop[batch.crop] = (Number(state.tradeStats.byCrop[batch.crop]) || 0) + qty;
  if (state.event) state.tradeStats.eventRevenue = (Number(state.tradeStats.eventRevenue) || 0) + revenue;
  trackSaleAnalytics(batch, marketId, qty, unitPrice, revenue, premiumSale);
  if (marketId === "rebel") {
    if (CROPS[batch.crop].category === "weapon") {
      state.tradeStats.weaponsToRebels = (Number(state.tradeStats.weaponsToRebels) || 0) + revenue;
    } else if (CROPS[batch.crop].category === "food") {
      state.tradeStats.foodToRebels = (Number(state.tradeStats.foodToRebels) || 0) + revenue;
    }
  }
  if (options.applySupply !== false) applyMarketSupplyEffect(batch.crop, marketId, qty);
  const remainingQty = Math.max(0, Number(batch.qty) || 0);
  if (!remainingQty) {
    state.inventory = state.inventory.filter((item) => item.id !== batchId);
    delete saleQuantities[batchId];
  }

  return {
    batchId,
    cropId: batch.crop,
    cropName: CROPS[batch.crop]?.name || batch.crop,
    cropCategory: CROPS[batch.crop]?.category || "",
    marketId,
    marketName: MARKETS[marketId]?.name || marketId,
    qty,
    unitPrice,
    revenue,
    quality: batch.quality,
    age: batchAge,
    ageDays: batchAge,
    aged: batchAge >= 1,
    premium: premiumSale,
    remainingQty,
    fromMoney: moneyBeforeSale,
    toMoney: state.money
  };
}

function aggregateSaleContexts(results) {
  const grouped = new Map();
  results.forEach((result) => {
    const key = `${result.marketId}:${result.cropId}`;
    const current = grouped.get(key);
    if (!current) {
      grouped.set(key, { ...result });
      return;
    }
    current.qty += result.qty;
    current.revenue += result.revenue;
    current.age = Math.max(current.age, result.age);
    current.ageDays = current.age;
    current.aged = current.aged || result.aged;
    current.premium = current.premium || result.premium;
    current.toMoney = result.toMoney;
  });
  return Array.from(grouped.values());
}

function triggerSaleCommsForResults(results) {
  aggregateSaleContexts(results).forEach((context) => {
    clearUiGuideTargets([`sell-${context.cropId}`], { persist: false });
    triggerComms("first_sale", context);
    if (context.aged) triggerComms("first_aged_sale", context);
    triggerComms("sale", context);
    if (context.marketId === "medical" && context.cropCategory === "medical") {
      triggerComms("medical_specialty_sale", context);
    }
  });
}

function inventoryRowForBatch(batchId) {
  return Array.from(document.querySelectorAll(".inventory-row[data-inventory-id]"))
    .find((row) => row.dataset.inventoryId === batchId) || null;
}

function updateSaleRowAfterTransaction(result) {
  const row = inventoryRowForBatch(result.batchId);
  if (!row) return;
  const batch = state.inventory.find((item) => item.id === result.batchId);
  const cropQty = row.querySelector(".inventory-crop strong");
  const qtyValue = row.querySelector(".qty-control span");
  const qtyButtons = row.querySelectorAll(".qty-control button");
  const unitValue = row.querySelector(".unit-price-cell strong");
  const sellButton = row.querySelector(".sell-button");

  if (!batch) {
    const inventoryList = row.parentElement;
    const nextInventoryRow = row.nextElementSibling?.matches(".inventory-row") ? row.nextElementSibling : null;
    const removedRowHeight = row.getBoundingClientRect().height;
    row.remove();
    if (inventoryList && nextInventoryRow && removedRowHeight > 0) {
      const spacer = document.createElement("div");
      spacer.className = "inventory-sale-spacer";
      spacer.setAttribute("aria-hidden", "true");
      spacer.style.height = `${removedRowHeight}px`;
      spacer.style.pointerEvents = "none";
      inventoryList.append(spacer);
    }
    if (inventoryList && !inventoryList.querySelector(".inventory-row")) {
      inventoryList.innerHTML = `<div class="inventory-empty">NO HARVEST STOCK // 収穫物はまだありません</div>`;
    }
    return;
  }

  const batchQty = Math.max(0, Number(batch.qty) || 0);
  const nextQty = Math.max(1, Math.min(batchQty, saleQuantities[batch.id] || 1));
  const nextUnitPrice = getUnitPrice(batch, result.marketId);
  if (cropQty) cropQty.textContent = `${result.cropName} x${batchQty}`;
  if (qtyValue) qtyValue.textContent = String(nextQty);
  if (qtyButtons[0]) qtyButtons[0].disabled = nextQty <= 1;
  if (qtyButtons[1]) qtyButtons[1].disabled = nextQty >= batchQty;
  if (unitValue) unitValue.textContent = `₡${formatNumber(nextUnitPrice)}`;
  if (sellButton) sellButton.textContent = `C${formatNumber(nextUnitPrice * nextQty)} SELL`;
}

function scheduleSalePersistence() {
  if (pendingSaleSaveTimer) window.clearTimeout(pendingSaleSaveTimer);
  pendingSaleSaveTimer = window.setTimeout(() => {
    pendingSaleSaveTimer = null;
    saveGame();
  }, SALE_SAVE_IDLE_MS);
}

function flushPendingSalePersistence() {
  if (!pendingSaleSaveTimer) return;
  window.clearTimeout(pendingSaleSaveTimer);
  pendingSaleSaveTimer = null;
  saveGame();
}

function scheduleSaleRender(delay = SALE_RENDER_IDLE_MS) {
  saleBurstActiveUntil = Date.now() + delay;
  if (pendingSaleRenderTimer) window.clearTimeout(pendingSaleRenderTimer);
  pendingSaleRenderTimer = window.setTimeout(() => {
    pendingSaleRenderTimer = null;
    lastInventoryRenderSignature = "";
    render();
  }, delay);
}

function finishManualSale(results, options = {}) {
  const validResults = results.filter(Boolean);
  if (!validResults.length) return;
  const totalQty = validResults.reduce((sum, result) => sum + result.qty, 0);
  const totalRevenue = validResults.reduce((sum, result) => sum + result.revenue, 0);
  const representative = validResults.reduce((best, result) => result.revenue > best.revenue ? result : best);
  const premiumSale = validResults.some((result) => result.premium);
  const marketId = representative.marketId;
  const fromMoney = validResults[0].fromMoney;
  addRadarSuspicion(radarShipmentSuspicion(totalQty, totalRevenue));

  validResults.forEach(updateSaleRowAfterTransaction);
  updateInventorySummary();
  updateSellAllButton();
  animateMoneyCounter(fromMoney, state.money);

  const statusMessage = options.bulk
    ? `${MARKETS[marketId].name}で在庫${totalQty}個を一括売却。₡${formatNumber(totalRevenue)}を受領。`
    : `${MARKETS[marketId].name}で${representative.cropName}を${totalQty}個売却。₡${formatNumber(totalRevenue)}を受領。`;
  setStatus(statusMessage, { log: false });
  toast(`${options.bulk ? "一括売却成立" : "売却成立"} +₡${formatNumber(totalRevenue)}`);
  playSoundFirst(["sell_crop", "sale"], premiumSale ? 0.42 : 0.34);
  hapticFeedback(options.bulk ? [14, 30, 14] : premiumSale ? [12, 34, 12] : 14);
  burstEffect(options.sourceElement, premiumSale ? "#fff2a8" : "#f5d65b", options.bulk ? 22 : premiumSale ? 14 : 10);
  saleRewardEffect({
    sourceElement: options.sourceElement,
    sourceRect: options.sourceRect,
    cropId: representative.cropId,
    revenue: totalRevenue,
    qty: totalQty,
    quality: representative.quality,
    premium: premiumSale,
    fromMoney,
    toMoney: state.money
  });

  scheduleSalePersistence();
  scheduleSaleRender();
  window.setTimeout(() => {
    triggerSaleCommsForResults(validResults);
    checkFactionProgression();
  }, 0);
}

function sellBatch(batchId) {
  const batch = state.inventory.find((item) => item.id === batchId);
  if (!batch) return;
  if (!isMarketAvailable(selectedMarket)) {
    selectedMarket = "lower";
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    renderMarkets();
    return;
  }
  if (!canSellCropToMarket(batch.crop, selectedMarket)) {
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    return;
  }
  const saleSourceElement = document.querySelector(`[data-sell-id="${batchId}"]`);
  const saleSourceRect = feedbackRect(saleSourceElement);
  const result = executeBatchSale(batchId);
  finishManualSale([result], {
    sourceElement: saleSourceElement,
    sourceRect: saleSourceRect
  });
}

function sellAllInventory(sourceElement) {
  if (!isMarketAvailable(selectedMarket)) {
    selectedMarket = "lower";
    toast("Action unavailable right now.", "warning");
    rejectFeedback();
    renderMarkets();
    return;
  }
  const quote = inventorySaleQuote(selectedMarket);
  if (!quote.items.length) {
    toast("この市場で売却できる在庫がありません。", "warning");
    rejectFeedback({ shake: false });
    return;
  }

  const sourceRect = feedbackRect(sourceElement);
  const results = [];
  const supplyByCrop = {};
  quote.items.forEach((item) => {
    const result = executeBatchSale(item.batchId, {
      marketId: quote.marketId,
      qty: item.qty,
      unitPrice: item.unitPrice,
      applySupply: false
    });
    if (!result) return;
    results.push(result);
    supplyByCrop[result.cropId] = (supplyByCrop[result.cropId] || 0) + result.qty;
  });
  Object.entries(supplyByCrop).forEach(([cropId, qty]) => {
    applyMarketSupplyEffect(cropId, quote.marketId, qty);
  });
  finishManualSale(results, {
    sourceElement,
    sourceRect,
    bulk: true
  });
}

function changeSaleQty(batchId, delta) {
  const batch = state.inventory.find((item) => item.id === batchId);
  if (!batch) return;
  saleQuantities[batchId] = Math.max(1, Math.min(batch.qty, (saleQuantities[batchId] || 1) + delta));
  renderInventory();
}

function supportRobotPlantGrowthMultiplier(base, shelf) {
  if (!base || !shelf?.placed) return 1;
  const appliedEffects = new Set();
  let bonus = 0;
  (base.floorDevices || []).forEach((robot) => {
    if (robot.type !== "support_robot" || !robot.placed || !supportRobotCanReach(robot, shelf, "unit")) return;
    supportRobotPersonalityEffects(robot).forEach((effect) => {
      if (effect.type !== "plant_growth_aura" || effect.target !== "plants_in_range") return;
      const effectKey = effect.stackMode === "once_per_target"
        ? `${effect.personalityId}:${effect.id}`
        : `${robot.id}:${effect.id}`;
      if (appliedEffects.has(effectKey)) return;
      appliedEffects.add(effectKey);
      bonus += supportPersonalityEffectContribution(effect.value, effect);
    });
  });
  return Math.max(0.1, 1 + bonus);
}

function completePlantGrowth(plant, shelf, base, performance = null) {
  const crop = plant ? CROPS[plant.crop] : null;
  if (!plant || !crop || plant.ready || plant.dead || plant.growth < crop.days) return false;
  const perf = performance || unitPerformance(shelf, plant.crop, base);
  plant.growth = crop.days;
  plant.ready = true;
  plant.readyPulseAt = Date.now();
  updatePlantVisualStage(plant);
  const effects = getUnitEffects(shelf);
  plant.quality = determineQuality(plant, effects.light, effects.fan, perf.qualityBonus);
  trackPlantReady(plant, shelf);
  triggerSRankReadyComms(plant, shelf, base);
  toast(`${crop.name}が収穫可能になりました`);
  requestFarmRender(base);
  playSound("crop_ready", 0.24);
  return true;
}

function processRealtimeGrowth(deltaDays) {
  const plants = activePlants().filter(({ plant }) => !plant.ready && !plant.dead);
  if (deltaDays <= 0) return;
  if (state.timeUnlocked) processDirt(deltaDays);
  if (!plants.length) return;

  const continuousPlants = plants.filter(({ shelf }) => GROW_UNITS[shelf.type]?.continuous);
  const requested = continuousPlants.reduce((total, { plant, shelf, baseId }) => {
    const crop = CROPS[plant.crop];
    const base = ownedBases().find((candidate) => candidate.id === baseId) || currentBase();
    const perf = unitPerformance(shelf, plant.crop, base);
    total.water += crop.water * RESOURCE_CONSUMPTION_RATE * perf.water * deltaDays;
    total.nutrient += crop.nutrient * RESOURCE_CONSUMPTION_RATE * perf.nutrient * (getUnitEffects(shelf).fan ? 0.9 : 1) * deltaDays;
    return total;
  }, { water: 0, nutrient: 0 });

  const waterRatio = requested.water > 0 ? Math.min(1, state.water / requested.water) : 1;
  const nutrientRatio = requested.nutrient > 0 ? Math.min(1, state.nutrient / requested.nutrient) : 1;
  state.water = Math.max(0, state.water - requested.water * waterRatio);
  state.nutrient = Math.max(0, state.nutrient - requested.nutrient * nutrientRatio);
  trackResourceGrowthUse(requested.water * waterRatio, requested.nutrient * nutrientRatio);

  const growthMultiplierCache = new Map();
  const growthMultiplierFor = (base, shelf) => {
    const key = `${base.id}:${shelf.id}`;
    if (!growthMultiplierCache.has(key)) {
      growthMultiplierCache.set(key, supportRobotPlantGrowthMultiplier(base, shelf));
    }
    return growthMultiplierCache.get(key);
  };

  plants.forEach(({ plant, shelf, baseId }) => {
    const base = ownedBases().find((candidate) => candidate.id === baseId) || currentBase();
    const perf = unitPerformance(shelf, plant.crop, base);
    const personalityGrowth = growthMultiplierFor(base, shelf);
    const continuous = Boolean(GROW_UNITS[shelf.type]?.continuous);
    if (!continuous) {
      plant.growth += deltaDays * perf.growth * personalityGrowth;
      if (!completePlantGrowth(plant, shelf, base, perf) && updatePlantVisualStage(plant)) requestFarmRender(base);
      return;
    }

    const noWater = waterRatio <= 0.001;
    const noNutrient = nutrientRatio <= 0.001;
    if (waterRatio < 0.999) plant.waterShortage = true;
    if (nutrientRatio < 0.999) plant.nutrientShortage = true;

    if (noWater && noNutrient) {
      plant.witherProgress = (plant.witherProgress || 0) + deltaDays;
      if (plant.witherProgress >= WITHER_DAYS) {
        plant.dead = true;
        trackDeadPlantAnalytics(plant, shelf, "wither");
        plant.ready = false;
        requestFarmRender(base);
        playSound("plant_wither", 0.2);
      }
      return;
    }

    plant.witherProgress = Math.max(0, (plant.witherProgress || 0) - deltaDays * 0.5);
    const growthFactor = Math.max(0.25, Math.min(waterRatio, nutrientRatio));
    plant.growth += deltaDays * growthFactor * perf.growth * personalityGrowth;
    if (!completePlantGrowth(plant, shelf, base, perf) && updatePlantVisualStage(plant)) requestFarmRender(base);
  });
}

function processDirt(deltaDays) {
  ownedBases().forEach((base) => {
    const baseEffects = baseTagEffects(base);
    [...base.shelves, ...base.floorDevices].forEach((item) => {
      const active = item.slots ? item.slots.some(Boolean) : item.placed;
      if (!active) return;
      const definition = item.slots ? GROW_UNITS[item.type] : FLOOR_DEVICES[item.type];
      const dirtMod = (Number(definition?.dirtMod) || 1) * (unitTagEffects(item).dirtMod || 1) * (baseEffects.dirtMod || 1);
      const wasCleanEnough = !needsCleaning(item);
      item.dirt = Math.min(100, (item.dirt || 0) + deltaDays * 7 * dirtMod);
      if (wasCleanEnough && needsCleaning(item)) {
        requestFarmRender(base);
        triggerComms("first_cleaning_needed", { kind: item.slots ? "unit" : "device", itemId: item.type });
      }
    });
  });
}

function needsCleaning(item) {
  return (item.dirt || 0) >= 60;
}

function cleanItem(kind, id, tool = "brush") {
  const collection = kind === "unit" ? currentShelves() : currentFloorDevices();
  const item = collection.find((entry) => entry.id === id);
  if (!item) return;
  const definition = kind === "unit" ? GROW_UNITS[item.type] : FLOOR_DEVICES[item.type];
  const target = document.querySelector(`[data-drag-kind="${kind}"][data-drag-id="${id}"]`);
  item.dirt = 0;
  setStatus(`${definition.name} cleaned. Dirt penalty removed.`);
  toast(`${definition.name} cleaned.`);
  if (tool === "bucket") {
    cleanSplashEffect(target);
    playSound("clean_bucket", 0.2);
  } else {
    brushCleanEffect(target);
    playSound("clean_brush", 0.14);
  }
  saveGame();
  render();
}

function currentBaseElementSelector(kind, id) {
  return `[data-drag-kind="${kind}"][data-drag-id="${id}"]`;
}

function addInventoryFromPlant(plant, harvestedAtDay = inventoryHarvestTimestamp()) {
  const normalizedHarvestedAt = Number(harvestedAtDay);
  const degraded = Boolean(plant.degraded);
  const existing = state.inventory.find((batch) =>
    batch.crop === plant.crop
    && batch.quality === plant.quality
    && Boolean(batch.degraded) === degraded
    && Number(batch.harvestedAtDay) === normalizedHarvestedAt
  );
  if (existing) {
    existing.qty += 1;
    existing.age = inventoryAgeDays(existing);
    return existing;
  }
  const batch = {
    id: `${Date.now()}-${Math.random()}`,
    crop: plant.crop,
    quality: plant.quality,
    qty: 1,
    age: 0,
    harvestedAtDay: normalizedHarvestedAt,
    degraded
  };
  state.inventory.push(batch);
  return batch;
}

function harvestPlantByRobot(base, unit, slotIndex, robot) {
  const plant = unit.slots?.[slotIndex];
  if (!plant?.ready) return false;
  addInventoryFromPlant(plant);
  trackHarvestAnalytics(plant, unit, 1);
  if (plant.crop === "tomato") state.tomatoHarvested = true;
  unit.slots[slotIndex] = null;
  requestFarmRender(base);
  state.marketTabUnlocked = true;
  const target = base.id === currentBase().id ? document.querySelector(`[data-shelf="${currentShelves().findIndex((entry) => entry.id === unit.id)}"][data-slot="${slotIndex}"]`) : null;
  if (target) {
    burstEffect(target, QUALITY[plant.quality]?.color || "#72ffb8", 12);
    floatingFeedback(target, "BOT +1", QUALITY[plant.quality]?.color || "#72ffb8", "harvest small");
  }
  botActionLog(`BOT // ${CROPS[plant.crop]?.name || plant.crop} harvested.`);
  playSound("harvest_single", 0.12);
  triggerComms("first_harvest", { cropId: plant.crop, cropName: CROPS[plant.crop]?.name || plant.crop, quality: plant.quality, unitType: unit.type, unitName: GROW_UNITS[unit.type]?.name || unit.type, qty: 1 });
  triggerComms("harvest", { cropId: plant.crop, cropName: CROPS[plant.crop]?.name || plant.crop, quality: plant.quality, unitType: unit.type, unitName: GROW_UNITS[unit.type]?.name || unit.type, qty: 1 });
  return true;
}

function cleanItemByRobot(base, kind, item, robot) {
  if (!needsCleaning(item)) return false;
  item.dirt = 0;
  const target = base.id === currentBase().id ? document.querySelector(currentBaseElementSelector(kind, item.id)) : null;
  if (target) brushCleanEffect(target);
  botActionLog(`BOT // ${kind === "unit" ? GROW_UNITS[item.type]?.name : FLOOR_DEVICES[item.type]?.name} cleaned.`);
  playSound("clean_brush", 0.1);
  return true;
}

function plantSeedByRobot(base, unit, slotIndex, cropId, robot) {
  const crop = CROPS[cropId];
  if (!crop || !unit?.placed || unit.slots?.[slotIndex]) return false;
  if ((state.seeds[cropId] || 0) <= 0) return false;
  const plantingCost = plantingResourceCost(cropId, unit);
  if (state.water < plantingCost.water || state.nutrient < plantingCost.nutrient) {
    notifySupportPlantingShortage(base, robot, cropId, unit, plantingCost);
    return false;
  }
  clearSupportPlantingShortageNotice(robot);
  state.water -= plantingCost.water;
  state.nutrient -= plantingCost.nutrient;
  state.seeds[cropId] -= 1;
  const plantedAt = Date.now();
  unit.slots[slotIndex] = {
    id: makeId("plant"),
    crop: cropId,
    growth: 0,
    ready: false,
    readyAge: 0,
    degraded: false,
    waterShortage: false,
    nutrientShortage: false,
    witherProgress: 0,
    dead: false,
    visualStage: 1,
    stagePulseAt: plantedAt,
    prepaid: !GROW_UNITS[unit.type].continuous,
    quality: null,
    careCompletedStages: [],
    careGrowthBonus: 0
  };
  const shelfIndex = base.shelves.findIndex((entry) => entry.id === unit.id);
  trackPlanting(cropId, unit, shelfIndex, slotIndex, plantingCost);
  const target = base.id === currentBase().id ? document.querySelector(`[data-shelf="${shelfIndex}"][data-slot="${slotIndex}"]`) : null;
  if (target) {
    burstEffect(target, crop.color, 12);
    floatingFeedback(target, "BOT PLANT", crop.color, "small");
  }
  botActionLog(`BOT // ${crop.name} planted.`);
  playSound("plant_seed", 0.12);
  triggerComms("first_plant", { cropId, cropName: crop.name, unitType: unit.type, unitName: GROW_UNITS[unit.type]?.name || unit.type, shelfIndex, slotIndex, automated: true });
  triggerComms("plant", { cropId, cropName: crop.name, unitType: unit.type, unitName: GROW_UNITS[unit.type]?.name || unit.type, shelfIndex, slotIndex, automated: true });
  return true;
}

function carePlantByRobot(base, unit, slotIndex, stageIndex, robot) {
  const plant = unit?.slots?.[slotIndex];
  const crop = plant ? CROPS[plant.crop] : null;
  const status = plantCareStatus(plant);
  if (!plant || !crop || !status.pending.some((entry) => entry.stageIndex === stageIndex)) return false;

  const completed = new Set(Array.isArray(plant.careCompletedStages) ? plant.careCompletedStages : []);
  completed.add(stageIndex);
  plant.careCompletedStages = [...completed]
    .map((value) => Math.floor(Number(value)))
    .filter((value) => value >= 0 && value < status.total)
    .sort((left, right) => left - right);
  const growthBonus = crop.days * SUPPORT_CARE_GROWTH_BONUS_RATIO;
  plant.careGrowthBonus = Math.max(0, Number(plant.careGrowthBonus) || 0) + growthBonus;
  plant.growth = Math.min(crop.days, (Number(plant.growth) || 0) + growthBonus);
  plant.carePulseAt = Date.now();

  const shelfIndex = base.shelves.findIndex((entry) => entry.id === unit.id);
  const target = base.id === currentBase().id
    ? document.querySelector(`[data-shelf="${shelfIndex}"][data-slot="${slotIndex}"]`)
    : null;
  if (target) {
    burstEffect(target, "#69f5c1", 10);
    floatingFeedback(target, "BOT CARE +5%", "#69f5c1", "small");
  }
  botActionLog(`BOT // ${crop.name} care ${stageIndex + 1}/${status.total} complete.`);
  playSoundFirst(["plant_seed", "ui_confirm"], 0.1);
  const perf = unitPerformance(unit, plant.crop, base);
  if (!completePlantGrowth(plant, unit, base, perf)) {
    updatePlantVisualStage(plant);
    requestFarmRender(base);
  }
  return true;
}

function configuredProcurementEntries() {
  ensureSupportAutomationState();
  return Object.entries(state.automation.procurement.byCrop || {})
    .filter(([cropId, config]) => CROPS[cropId] && config.enabled);
}

function configuredShippingEntries() {
  ensureSupportAutomationState();
  return Object.entries(state.automation.shipping.byCrop || {})
    .filter(([cropId, config]) => CROPS[cropId] && config.enabled);
}

function supportRobotSeedPriceMultiplier(robot) {
  if (!robot) return 1;
  return supportRobotPersonalityEffects(robot).reduce((multiplier, effect) => {
    if (effect.type !== "seed_price" || effect.target !== "self") return multiplier;
    if (effect.tasks.length && !effect.tasks.includes("procure")) return multiplier;
    if (!supportRobotEffectThresholdMet(robot, effect)) return multiplier;
    return multiplier * Math.max(0.1, Number(effect.value) || 1);
  }, 1);
}

function supportRobotSeedQuote(robot, cropId, packs = 1) {
  const packCount = clamp(Math.floor(Number(packs) || 1), 1, 12);
  const marketUnitPrice = currentSeedPrice(cropId);
  const discountMultiplier = supportRobotSeedPriceMultiplier(robot);
  const unitPrice = Math.max(1, Math.floor(marketUnitPrice * discountMultiplier));
  return { packCount, marketUnitPrice, discountMultiplier, unitPrice, totalPrice: unitPrice * packCount };
}

function buySeedPacksByRobot(robot, cropId, packs = 1) {
  const crop = CROPS[cropId];
  if (!crop || !isUnlocked("seed_item", cropId)) return false;
  const quote = supportRobotSeedQuote(robot, cropId, packs);
  const { packCount, unitPrice, totalPrice } = quote;
  if (state.money < totalPrice) return false;

  const seedCount = crop.packSize * packCount;
  state.money -= totalPrice;
  addRadarSuspicion(radarPurchaseSuspicion(totalPrice));
  state.seeds[cropId] = (state.seeds[cropId] || 0) + seedCount;
  trackPurchase("seed", cropId, totalPrice, {
    itemName: crop.name,
    packSize: seedCount,
    packCount,
    unitPrice,
    marketUnitPrice: quote.marketUnitPrice,
    discountMultiplier: quote.discountMultiplier,
    basePrice: seedMarketBasePrice(cropId),
    automated: true
  });
  botActionLog("BOT // " + crop.name + " seed packs purchased. x" + packCount + " / ₡" + formatNumber(totalPrice));
  playSound("buy_seed", 0.11);
  return true;
}

function buySeedsByRobot(robot) {
  const entry = configuredProcurementEntries().find(([cropId, config]) => {
    const crop = CROPS[cropId];
    if (!crop || !isUnlocked("seed_item", cropId)) return false;
    const targetSeeds = crop.packSize * Math.max(1, config.packs || 1);
    return (state.seeds[cropId] || 0) < targetSeeds && state.money >= supportRobotSeedQuote(robot, cropId, 1).totalPrice;
  });
  if (!entry) return false;
  return buySeedPacksByRobot(robot, entry[0], 1);
}
function sellInventoryByRobot(cropId, marketId) {
  if (!canSellCropToMarket(cropId, marketId)) return false;
  const batches = state.inventory.filter((item) => item.crop === cropId && Math.max(0, Number(item.qty) || 0) > 0);
  if (!batches.length) return false;

  let totalQty = 0;
  let totalRevenue = 0;
  let premiumSale = false;
  let agedSale = false;
  let maxBatchAge = 0;
  batches.forEach((batch) => {
    const amount = Math.max(0, Number(batch.qty) || 0);
    const batchAge = inventoryAgeDays(batch);
    if (isInventoryBatchDegraded(batch)) batch.degraded = true;
    const unitPrice = getUnitPrice(batch, marketId);
    const revenue = unitPrice * amount;
    if (amount <= 0) return;
    if (batchAge >= 1) agedSale = true;
    maxBatchAge = Math.max(maxBatchAge, batchAge);
    totalQty += amount;
    totalRevenue += revenue;
    premiumSale = premiumSale || unitPrice >= bestAvailableQuote(batch) * 0.98;
    trackSaleAnalytics(batch, marketId, amount, unitPrice, revenue, unitPrice >= bestAvailableQuote(batch) * 0.98);
    batch.qty = 0;
  });

  if (totalQty <= 0) return false;
  state.money += totalRevenue;
  addRadarSuspicion(radarShipmentSuspicion(totalQty, totalRevenue));
  state.inventory = state.inventory.filter((item) => item.crop !== cropId || item.qty > 0);
  state.tradeStats.byCrop ||= {};
  state.tradeStats.byMarket ||= { lower: 0, medical: 0, upper: 0, rebel: 0 };
  state.tradeStats.unitsSold = (Number(state.tradeStats.unitsSold) || 0) + totalQty;
  state.tradeStats.revenue = (Number(state.tradeStats.revenue) || 0) + totalRevenue;
  state.tradeStats.byCrop[cropId] = (state.tradeStats.byCrop[cropId] || 0) + totalQty;
  state.tradeStats.byMarket[marketId] = (state.tradeStats.byMarket[marketId] || 0) + totalRevenue;
  state.tradeStats.byMarketQty ||= { lower: 0, medical: 0, upper: 0, rebel: 0 };
  state.tradeStats.byMarketQty[marketId] = (state.tradeStats.byMarketQty[marketId] || 0) + totalQty;
  if (marketId === "rebel") {
    if (CROPS[cropId]?.category === "weapon") state.tradeStats.weaponsToRebels += totalQty;
    else state.tradeStats.foodToRebels += totalQty;
  }
  applyMarketSupplyEffect(cropId, marketId, totalQty);

  const cropName = CROPS[cropId]?.name || cropId;
  const marketName = MARKETS[marketId]?.name || marketId;
  botActionLog(`BOT // ${cropName} shipped to ${marketName}. x${totalQty} +C${formatNumber(totalRevenue)}`);
  playSoundFirst(["sell_crop", "sale"], premiumSale ? 0.18 : 0.12);
  const commsContext = { cropId, cropName, marketId, marketName, qty: totalQty, revenue: totalRevenue, automated: true, age: maxBatchAge, ageDays: maxBatchAge, aged: agedSale };
  triggerComms("first_sale", commsContext);
  if (agedSale) triggerComms("first_aged_sale", commsContext);
  triggerComms("sale", commsContext);
  return true;
}
function sellConfiguredInventoryByRobot() {
  let soldAny = false;
  configuredShippingEntries().forEach(([cropId, config]) => {
    if (!canSellCropToMarket(cropId, config.marketId)) return;
    const hasStock = state.inventory.some((item) => item.crop === cropId && Math.max(0, Number(item.qty) || 0) > 0);
    if (!hasStock) return;
    if (sellInventoryByRobot(cropId, config.marketId)) soldAny = true;
  });
  return soldAny;
}

function findSupportHarvestTarget(base, robot, respectLegacyToggle = false) {
  ensureSupportRobotProfile(robot);
  if (!state.supportOS?.harvest) return null;
  if (respectLegacyToggle && !robot.harvestAutomation?.enabled) return null;
  for (const unit of base.shelves) {
    if (!unit.placed || !supportRobotCanReach(robot, unit, "unit")) continue;
    const slotIndex = unit.slots.findIndex((plant) => plant?.ready);
    if (slotIndex >= 0) return { unit, slotIndex };
  }
  return null;
}

function findSupportCareTarget(base, robot, node = null) {
  ensureSupportRobotProfile(robot);
  if (!state.supportOS?.planting) return null;
  const cropFilter = node?.cropId === "*" ? "*" : (CROPS[node?.cropId] ? node.cropId : "*");
  let bestTarget = null;
  for (const unit of base.shelves) {
    if (!unit.placed || !supportRobotCanReach(robot, unit, "unit")) continue;
    unit.slots.forEach((plant, slotIndex) => {
      if (!plant || (cropFilter !== "*" && plant.crop !== cropFilter)) return;
      const status = plantCareStatus(plant);
      const pendingStage = status.pending[0];
      if (!pendingStage) return;
      if (!bestTarget || pendingStage.urgency < bestTarget.urgency) {
        bestTarget = {
          unit,
          slotIndex,
          plant,
          stageIndex: pendingStage.stageIndex,
          urgency: pendingStage.urgency
        };
      }
    });
  }
  return bestTarget;
}

function clearSupportPlantingShortageNotice(robot) {
  if (!robot?.plantingAutomation) return;
  robot.plantingAutomation.shortageNoticeKey = "";
  robot.plantingAutomation.shortageNoticeAtDay = null;
}

function notifySupportPlantingShortage(base, robot, cropId, unit, plantingCost) {
  ensureSupportRobotProfile(robot);
  const context = {
    ...resourceShortageContext(cropId, unit, plantingCost),
    automated: true,
    baseId: base?.id || "",
    robotId: robot?.id || ""
  };
  const noticeKey = `${cropId}:${unit?.type || "unit"}:${plantingShortageReason(context)}`;
  const currentDay = (Number(state.day) || 1) + Math.max(0, Number(state.dayProgress) || 0);
  const previousDay = Number(robot.plantingAutomation.shortageNoticeAtDay);
  const recentlyNotified = robot.plantingAutomation.shortageNoticeKey === noticeKey
    && Number.isFinite(previousDay)
    && currentDay - previousDay < SUPPORT_PLANT_SHORTAGE_NOTICE_DAYS;
  if (recentlyNotified) return false;

  robot.plantingAutomation.shortageNoticeKey = noticeKey;
  robot.plantingAutomation.shortageNoticeAtDay = currentDay;
  trackPlantingFailure(plantingShortageReason(context), context);
  triggerComms("plant_resource_shortage", context);
  return true;
}

function firstAvailableSupportSeedId() {
  // CROPS preserves the CSV/menu order, so automatic planting remains predictable.
  return Object.keys(CROPS).find((cropId) => (
    isUnlocked("seed_item", cropId)
    && Math.max(0, Number(state.seeds?.[cropId]) || 0) > 0
  )) || "";
}

function findSupportPlantingTarget(base, robot, cropIdOverride = "", { silent = false } = {}) {
  ensureSupportRobotProfile(robot);
  const planting = robot.plantingAutomation || {};
  const usesAutomaticBlueprintCrop = cropIdOverride === "*";
  const usesBlueprintCrop = Boolean(cropIdOverride && CROPS[cropIdOverride]);
  if (!state.supportOS?.planting || (!usesAutomaticBlueprintCrop && !usesBlueprintCrop && !planting.enabled)) {
    if (!silent) clearSupportPlantingShortageNotice(robot);
    return null;
  }
  const cropId = usesAutomaticBlueprintCrop
    ? firstAvailableSupportSeedId()
    : (usesBlueprintCrop
      ? cropIdOverride
      : (CROPS[planting.cropId] ? planting.cropId : "lettuce"));
  if (!cropId || (usesBlueprintCrop && !isUnlocked("seed_item", cropId)) || (state.seeds[cropId] || 0) <= 0) {
    if (!silent) clearSupportPlantingShortageNotice(robot);
    return null;
  }

  let shortageTarget = null;
  for (const unit of base.shelves) {
    if (!unit.placed || !supportRobotCanReach(robot, unit, "unit")) continue;
    const slotIndex = unit.slots.findIndex((plant) => !plant);
    if (slotIndex < 0) continue;
    const plantingCost = plantingResourceCost(cropId, unit);
    if (state.water < plantingCost.water || state.nutrient < plantingCost.nutrient) {
      if (!shortageTarget) shortageTarget = { unit, plantingCost };
      continue;
    }
    clearSupportPlantingShortageNotice(robot);
    return { unit, slotIndex, cropId };
  }

  if (!silent && shortageTarget) {
    notifySupportPlantingShortage(base, robot, cropId, shortageTarget.unit, shortageTarget.plantingCost);
  } else if (!silent) {
    clearSupportPlantingShortageNotice(robot);
  }
  return null;
}

function findSupportCleaningTarget(base, robot) {
  if (!state.supportOS?.cleaning) return null;
  const unit = base.shelves.find((item) => item.placed && needsCleaning(item) && supportRobotCanReach(robot, item, "unit"));
  if (unit) return { kind: "unit", item: unit };
  const device = base.floorDevices.find((item) => item.placed && needsCleaning(item) && supportRobotCanReach(robot, item, "device"));
  if (device) return { kind: "device", item: device };
  return null;
}

function findSupportResourceCollectionTarget(base, robot) {
  if (!state.supportOS?.storage) return null;
  return base.floorDevices.find((device) => {
    const definition = resourceProductionDefinition(device);
    if (!device.placed || !definition || storedResourceAmount(device) <= SUPPORT_RESOURCE_EPSILON) return false;
    if (!supportRobotCanReach(robot, device, "device")) return false;
    const resource = definition.productionResource;
    const current = Math.max(0, Number(state[resource]) || 0);
    return resourceCapacityLimit(resource) - current > SUPPORT_RESOURCE_EPSILON;
  }) || null;
}
function baseHasReachableDevice(base, robot, type) {
  return base.floorDevices.some((device) => device.type === type && device.placed && supportRobotCanReach(robot, device, "device"));
}
function reachableSupportRobotCountForDevice(type, base = currentBase()) {
  return base.floorDevices.filter((device) => device.type === "support_robot" && device.placed && baseHasReachableDevice(base, device, type)).length;
}

function supportAutomationRunHint(type) {
  if (!state.timeUnlocked) return "ゲーム内時間が始まると自動処理が動きます。";
  if (state.paused) return "現在は一時停止中です。再開すると自動処理が動きます。";
  const reachable = reachableSupportRobotCountForDevice(type);
  if (reachable <= 0) return "この拠点では、搬出口の範囲内にサポートロボットがいません。";
  return `搬出口に接続できるサポートロボット: ${reachable}体`;
}


function supportProcurementTargetExists(robot) {
  return configuredProcurementEntries().some(([cropId, config]) => {
    const crop = CROPS[cropId];
    if (!crop || !isUnlocked("seed_item", cropId)) return false;
    const targetSeeds = crop.packSize * Math.max(1, config.packs || 1);
    return (state.seeds[cropId] || 0) < targetSeeds && state.money >= supportRobotSeedQuote(robot, cropId, 1).totalPrice;
  });
}

function findSupportProcurementTarget(base, robot, node) {
  const cropId = CROPS[node?.cropId] ? node.cropId : "";
  const packs = clamp(Math.floor(Number(node?.packs) || 1), 1, 12);
  if (!cropId || !isUnlocked("seed_item", cropId)) return null;
  if (!baseHasReachableDevice(base, robot, "procurement_terminal")) return null;
  const quote = supportRobotSeedQuote(robot, cropId, packs);
  if (state.money < quote.totalPrice) return null;
  return { cropId, packs, ...quote };
}
function findSupportShippingTarget(base, robot, node) {
  const cropId = CROPS[node?.cropId] ? node.cropId : "";
  const marketId = MARKETS[node?.marketId] ? node.marketId : "";
  if (!cropId || !marketId || !baseHasReachableDevice(base, robot, "shipping_hatch")) return null;
  if (!canSellCropToMarket(cropId, marketId)) return null;
  const hasStock = state.inventory.some((batch) => (
    batch.crop === cropId && Math.max(0, Number(batch.qty) || 0) > 0
  ));
  return hasStock ? { cropId, marketId } : null;
}

function supportBlueprintActionUnlocked(type) {
  if (!SUPPORT_BLUEPRINT_ACTION_TYPES.includes(type)) return false;
  if (typeof supportBlueprintNodeUnlockState === "function") {
    return Boolean(supportBlueprintNodeUnlockState(type)?.unlocked);
  }
  if (type === "harvest") return Boolean(state.supportOS?.harvest);
  if (type === "plant") return Boolean(state.supportOS?.planting);
  if (type === "care") return Boolean(state.supportOS?.planting);
  if (type === "cleaning") return Boolean(state.supportOS?.cleaning);
  if (type === "resource_collect") return Boolean(state.supportOS?.storage);
  if (type === "ship") {
    return ownedBases().some((base) => base.floorDevices?.some((device) => device.type === "shipping_hatch"));
  }
  if (type === "procure") {
    return ownedBases().some((base) => base.floorDevices?.some((device) => device.type === "procurement_terminal"));
  }
  return false;
}

function supportBlueprintActionTarget(base, robot, node, { silent = false } = {}) {
  if (!node || !supportBlueprintActionUnlocked(node.type)) return null;
  if (node.type === "harvest") return findSupportHarvestTarget(base, robot);
  if (node.type === "ship") return findSupportShippingTarget(base, robot, node);
  if (node.type === "plant") return findSupportPlantingTarget(base, robot, node.cropId, { silent });
  if (node.type === "care") return findSupportCareTarget(base, robot, node);
  if (node.type === "procure") return findSupportProcurementTarget(base, robot, node);
  if (node.type === "cleaning") return findSupportCleaningTarget(base, robot);
  if (node.type === "resource_collect") return findSupportResourceCollectionTarget(base, robot);
  return null;
}

function supportBlueprintCompareNumber(actual, operator, expected) {
  const left = Number(actual) || 0;
  const right = Number(expected) || 0;
  if (operator === "gt") return left > right;
  if (operator === "lte") return left <= right;
  if (operator === "lt") return left < right;
  if (operator === "eq") return Math.abs(left - right) < 0.0001;
  return left >= right;
}

function supportBlueprintConditionValue(base, robot, node) {
  if (!node || node.type !== "condition") return false;
  if (node.conditionSource === "action_available") {
    const actionNode = {
      type: SUPPORT_BLUEPRINT_ACTION_TYPES.includes(node.actionType) ? node.actionType : "plant",
      cropId: node.cropId === "*" || CROPS[node.cropId] ? node.cropId : "lettuce",
      marketId: MARKETS[node.marketId] ? node.marketId : "lower",
      packs: clamp(Math.floor(Number(node.packs) || 1), 1, 12)
    };
    return Boolean(supportBlueprintActionTarget(base, robot, actionNode, { silent: true }));
  }

  let actual = 0;
  if (node.conditionSource === "inventory") {
    actual = node.cropId === "*"
      ? state.inventory.reduce((sum, batch) => sum + Math.max(0, Number(batch.qty) || 0), 0)
      : cropStockCount(CROPS[node.cropId] ? node.cropId : "lettuce");
  } else if (node.conditionSource === "seed") {
    actual = state.seeds[CROPS[node.cropId] ? node.cropId : "lettuce"] || 0;
  } else if (node.conditionSource === "seed_price") {
    actual = currentSeedPrice(CROPS[node.cropId] ? node.cropId : "lettuce");
  } else if (node.conditionSource === "money") {
    actual = state.money;
  } else if (node.conditionSource === "water") {
    actual = state.water;
  } else if (node.conditionSource === "nutrient") {
    actual = state.nutrient;
  } else if (node.conditionSource === "energy") {
    actual = robot.supportEnergy;
  } else if (node.conditionSource === "morale") {
    actual = robot.supportMorale;
  }
  return supportBlueprintCompareNumber(actual, node.operator, node.value);
}

function supportBlueprintOrderedLinks(context, fromId, fromPin) {
  return context.blueprint.links
    .filter((link) => link.from === fromId && link.fromPin === fromPin)
    .sort((left, right) => {
      const leftNode = context.nodeById.get(left.to);
      const rightNode = context.nodeById.get(right.to);
      const yDelta = (Number(leftNode?.y) || 0) - (Number(rightNode?.y) || 0);
      if (Math.abs(yDelta) > 0.001) return yDelta;
      const xDelta = (Number(leftNode?.x) || 0) - (Number(rightNode?.x) || 0);
      if (Math.abs(xDelta) > 0.001) return xDelta;
      return (Number(left.order) || 0) - (Number(right.order) || 0);
    });
}

function supportBlueprintBooleanInput(context, nodeId, pinId = "condition") {
  const link = context.blueprint.links.find((entry) => entry.to === nodeId && entry.toPin === pinId);
  if (!link) return null;
  const source = context.nodeById.get(link.from);
  if (!source || source.type !== "condition" || link.fromPin !== "value") return null;
  return supportBlueprintConditionValue(context.base, context.robot, source);
}

function resetSupportBlueprintSubtreeMemory(context, nodeId, visited = new Set()) {
  if (!nodeId || visited.has(nodeId)) return;
  visited.add(nodeId);
  delete context.runtime.memory[nodeId];
  const node = context.nodeById.get(nodeId);
  if (!node) return;
  supportBlueprintPinSchema(node.type).outputs
    .filter((pin) => pin.kind === "exec")
    .forEach((pin) => {
      supportBlueprintOrderedLinks(context, node.id, pin.id)
        .forEach((link) => resetSupportBlueprintSubtreeMemory(context, link.to, visited));
    });
}

function setSupportBlueprintNodeBadge(context, nodeId, text, kind = "") {
  if (!context.runtime.nodeBadges || typeof context.runtime.nodeBadges !== "object") {
    context.runtime.nodeBadges = {};
  }
  context.runtime.nodeBadges[nodeId] = {
    text: String(text || ""),
    kind: ["ok", "skip", "block"].includes(kind) ? kind : ""
  };
}

function executeSupportBlueprintAction(context, node) {
  const task = node.type;
  if (!supportBlueprintActionUnlocked(task)) {
    setSupportBlueprintNodeBadge(context, node.id, "OS LOCKED", "block");
    return SUPPORT_BLUEPRINT_STATUS.FAILURE;
  }
  const cooldownReady = supportRobotCooldownReady(context.robot, task);
  const target = supportBlueprintActionTarget(context.base, context.robot, node, { silent: !cooldownReady });
  if (!target || !cooldownReady || context.actionBudget <= 0 || !supportRobotTaskReady(context.robot, task)) {
    setSupportBlueprintNodeBadge(context, node.id, "次へ", "skip");
    return SUPPORT_BLUEPRINT_STATUS.FAILURE;
  }

  let completed = false;
  if (task === "harvest") {
    completed = harvestPlantByRobot(context.base, target.unit, target.slotIndex, context.robot);
  } else if (task === "ship") {
    completed = sellInventoryByRobot(target.cropId, target.marketId);
  } else if (task === "plant") {
    completed = plantSeedByRobot(context.base, target.unit, target.slotIndex, target.cropId, context.robot);
  } else if (task === "care") {
    completed = carePlantByRobot(context.base, target.unit, target.slotIndex, target.stageIndex, context.robot);
  } else if (task === "procure") {
    completed = buySeedPacksByRobot(context.robot, target.cropId, target.packs);
  } else if (task === "cleaning") {
    completed = cleanItemByRobot(context.base, target.kind, target.item, context.robot);
  } else if (task === "resource_collect") {
    completed = collectProducedResourceByRobot(context.base, target, context.robot);
  }
  if (!completed) {
    setSupportBlueprintNodeBadge(context, node.id, "次へ", "skip");
    return SUPPORT_BLUEPRINT_STATUS.FAILURE;
  }

  spendSupportRobotAction(context.robot, task);
  context.actionBudget -= 1;
  context.actedCount += 1;
  context.runtime.activeNodeId = node.id;
  setSupportBlueprintNodeBadge(context, node.id, "実行!", "ok");
  return SUPPORT_BLUEPRINT_STATUS.SUCCESS;
}

function tickSupportBlueprintNode(context, nodeId) {
  if (!nodeId || context.steps >= 96 || context.visiting.has(nodeId)) {
    return SUPPORT_BLUEPRINT_STATUS.FAILURE;
  }
  const node = context.nodeById.get(nodeId);
  if (!node) return SUPPORT_BLUEPRINT_STATUS.FAILURE;
  context.steps += 1;
  context.visiting.add(nodeId);
  context.runtime.lastNodeId = nodeId;

  let result = SUPPORT_BLUEPRINT_STATUS.FAILURE;
  if (node.type === "event") {
    const child = supportBlueprintOrderedLinks(context, node.id, "out")[0];
    result = child ? tickSupportBlueprintNode(context, child.to) : SUPPORT_BLUEPRINT_STATUS.FAILURE;
  } else if (node.type === "sequence") {
    setSupportBlueprintNodeBadge(context, node.id, "順に探索");
    for (const pinId of ["first", "second", "third"]) {
      const child = supportBlueprintOrderedLinks(context, node.id, pinId)[0];
      if (!child) continue;
      const childResult = tickSupportBlueprintNode(context, child.to);
      if (childResult !== SUPPORT_BLUEPRINT_STATUS.FAILURE) {
        result = childResult;
        break;
      }
    }
  } else if (node.type === "branch") {
    const condition = supportBlueprintBooleanInput(context, node.id);
    if (condition === null) {
      setSupportBlueprintNodeBadge(context, node.id, "BOOL未接続", "block");
    } else {
      const outputPin = condition ? "true" : "false";
      setSupportBlueprintNodeBadge(context, node.id, condition ? "→ はい" : "→ いいえ");
      const child = supportBlueprintOrderedLinks(context, node.id, outputPin)[0];
      result = child ? tickSupportBlueprintNode(context, child.to) : SUPPORT_BLUEPRINT_STATUS.FAILURE;
    }
  } else if (node.type === "flipflop") {
    const memory = context.runtime.memory[node.id] || { next: "a" };
    const outputPin = memory.next === "b" ? "b" : "a";
    context.runtime.memory[node.id] = { next: outputPin === "a" ? "b" : "a" };
    setSupportBlueprintNodeBadge(context, node.id, "→ " + outputPin.toUpperCase());
    const child = supportBlueprintOrderedLinks(context, node.id, outputPin)[0];
    result = child ? tickSupportBlueprintNode(context, child.to) : SUPPORT_BLUEPRINT_STATUS.FAILURE;
  } else if (node.type === "daily") {
    const day = Math.max(1, Math.floor(Number(state.day) || 1));
    const memory = context.runtime.memory[node.id] || { lastDay: null };
    const firstToday = memory.lastDay !== day;
    context.runtime.memory[node.id] = { lastDay: day };
    const outputPin = firstToday ? "first" : "already";
    setSupportBlueprintNodeBadge(context, node.id, firstToday ? "→ 本日初回" : "→ 実行済み");
    const child = supportBlueprintOrderedLinks(context, node.id, outputPin)[0];
    result = child ? tickSupportBlueprintNode(context, child.to) : SUPPORT_BLUEPRINT_STATUS.FAILURE;
  } else if (node.type === "every") {
    const everyN = [2, 3, 5].includes(Number(node.everyN)) ? Number(node.everyN) : 3;
    const count = Math.max(0, Number(context.runtime.memory[node.id]?.count) || 0) + 1;
    context.runtime.memory[node.id] = { count };
    const isNth = count % everyN === 0;
    const outputPin = isNth ? "nth" : "otherwise";
    setSupportBlueprintNodeBadge(context, node.id, count + " / " + everyN + (isNth ? " → N回目" : " → それ以外"));
    const child = supportBlueprintOrderedLinks(context, node.id, outputPin)[0];
    result = child ? tickSupportBlueprintNode(context, child.to) : SUPPORT_BLUEPRINT_STATUS.FAILURE;
  } else if (node.type === "random") {
    const probability = [25, 50, 75].includes(Number(node.probability)) ? Number(node.probability) : 50;
    const hit = Math.random() * 100 < probability;
    const outputPin = hit ? "hit" : "miss";
    setSupportBlueprintNodeBadge(context, node.id, hit ? "→ 当たり" : "→ 外れ");
    const child = supportBlueprintOrderedLinks(context, node.id, outputPin)[0];
    result = child ? tickSupportBlueprintNode(context, child.to) : SUPPORT_BLUEPRINT_STATUS.FAILURE;
  } else if (node.type === "condition") {
    const value = supportBlueprintConditionValue(context.base, context.robot, node);
    setSupportBlueprintNodeBadge(context, node.id, value ? "TRUE" : "FALSE", value ? "ok" : "skip");
    result = value ? SUPPORT_BLUEPRINT_STATUS.SUCCESS : SUPPORT_BLUEPRINT_STATUS.FAILURE;
  } else if (node.type === "rest") {
    const child = supportBlueprintOrderedLinks(context, node.id, "next")[0];
    if (startSupportRobotChargeBreak(context.robot, node.id)) {
      context.actedCount += 1;
      context.runtime.activeNodeId = node.id;
      setSupportBlueprintNodeBadge(context, node.id, "充電開始", "ok");
      result = SUPPORT_BLUEPRINT_STATUS.RUNNING;
    } else if (child) {
      setSupportBlueprintNodeBadge(context, node.id, "充電不要 → 次へ", "skip");
      result = tickSupportBlueprintNode(context, child.to);
    } else {
      setSupportBlueprintNodeBadge(context, node.id, "充電不要 / 接続なし", "skip");
      result = SUPPORT_BLUEPRINT_STATUS.FAILURE;
    }
  } else if (SUPPORT_BLUEPRINT_ACTION_TYPES.includes(node.type)) {
    result = executeSupportBlueprintAction(context, node);
    if (result === SUPPORT_BLUEPRINT_STATUS.FAILURE) {
      const child = supportBlueprintOrderedLinks(context, node.id, "failure")[0];
      if (child) result = tickSupportBlueprintNode(context, child.to);
    }
  }

  context.visiting.delete(nodeId);
  return result;
}

function runSupportBlueprint(base, robot, { startNodeId = "", completedNodeId = "" } = {}) {
  ensureSupportRobotProfile(robot);
  const blueprint = robot.supportBlueprint;
  const runtime = robot.supportBlueprintRuntime;
  runtime.activeNodeId = "";
  runtime.lastNodeId = "";
  runtime.nodeBadges = {};
  const context = {
    base,
    robot,
    blueprint,
    runtime,
    nodeById: new Map(blueprint.nodes.map((node) => [node.id, node])),
    visiting: new Set(),
    actionBudget: 1,
    actedCount: 0,
    steps: 0
  };
  if (completedNodeId && context.nodeById.has(completedNodeId)) {
    setSupportBlueprintNodeBadge(context, completedNodeId, "充電完了 → 次へ", "ok");
  }
  const entryNodeId = startNodeId && context.nodeById.has(startNodeId) ? startNodeId : blueprint.rootId;
  const status = tickSupportBlueprintNode(context, entryNodeId);
  runtime.lastStatus = status;
  return { status, acted: context.actedCount > 0 };
}
function processSupportRobots(deltaDays) {
  ensureSupportAutomationState();
  if (!state.timeUnlocked || state.ended || state.paused) return;
  let acted = false;
  const scanNow = typeof performance !== "undefined" ? performance.now() : Date.now();
  const markActed = (base) => {
    acted = true;
    requestFarmRender(base);
  };
  ownedBases().forEach((base) => {
    base.floorDevices
      .filter((device) => device.type === "support_robot" && device.placed)
      .forEach((robot) => {
        ensureSupportRobotProfile(robot);
        const cooldownTick = tickSupportRobotCooldowns(robot, deltaDays);

        if (!supportRobotIsCharging(robot) && supportRobotResourcesDepleted(robot)) {
          if (startSupportRobotForcedRecovery(robot)) markActed(base);
        }
        if (supportRobotIsCharging(robot)) {
          const nodeId = robot.supportChargeNodeId;
          const seconds = supportRobotChargeRemainingDays(robot) * REALTIME_DAY_MS / 1000;
          robot.supportBlueprintRuntime.activeNodeId = nodeId;
          robot.supportBlueprintRuntime.lastNodeId = nodeId;
          robot.supportBlueprintRuntime.lastStatus = SUPPORT_BLUEPRINT_STATUS.RUNNING;
          robot.supportBlueprintRuntime.nodeBadges = nodeId
            ? { [nodeId]: { text: `充電中 ${seconds.toFixed(1)} SEC`, kind: "ok" } }
            : {};
          return;
        }
        let chargeContinuation = null;
        if (cooldownTick.chargeCompleted) {
          markActed(base);
          if (cooldownTick.recoveryMode === "charge" && cooldownTick.chargeNodeId) {
            chargeContinuation = robot.supportBlueprint.links.find((link) => (
              link.from === cooldownTick.chargeNodeId && link.fromPin === "next"
            )) || null;
          }
        }

        const nextIdleScanAt = supportRobotNextIdleScanAt.get(robot) || 0;
        if (!chargeContinuation && scanNow < nextIdleScanAt) return;

        const blueprintResult = runSupportBlueprint(base, robot, chargeContinuation ? {
          startNodeId: chargeContinuation.to,
          completedNodeId: cooldownTick.chargeNodeId
        } : undefined);
        if (blueprintResult.acted) {
          supportRobotNextIdleScanAt.delete(robot);
          markActed(base);
          return;
        }

        const blueprintHandlesProcurement = robot.supportBlueprint.nodes.some((node) => node.type === "procure");
        const canProcure = !blueprintHandlesProcurement
          && baseHasReachableDevice(base, robot, "procurement_terminal")
          && supportProcurementTargetExists(robot);
        if (canProcure && supportRobotTaskReady(robot, "procure") && buySeedsByRobot(robot)) {
          spendSupportRobotAction(robot, "procure");
          supportRobotNextIdleScanAt.delete(robot);
          markActed(base);
          return;
        }
        supportRobotNextIdleScanAt.set(robot, scanNow + SUPPORT_ROBOT_IDLE_SCAN_MS);
      });
  });
  const laborActive = document.getElementById("labor-screen")?.classList.contains("active");
  if (laborActive && typeof updateLaborBlueprintRuntime === "function") {
    updateLaborBlueprintRuntime();
    updateLaborRobotVitals();
  }
  if (acted) {
    if (document.getElementById("market-screen")?.classList.contains("active")) renderMarkets();
    if (document.getElementById("shop-screen")?.classList.contains("active")) renderShop();

    const activeModalTitle = document.getElementById("modal-backdrop")?.classList.contains("hidden")
      ? ""
      : document.getElementById("modal-title")?.textContent;
    if (activeModalTitle === "自動出荷設定") showShippingTerminal();
    if (activeModalTitle === "自動種子調達") showProcurementTerminal();
    updateTabIndicators();
    renderHeader();
    saveGame();
    checkVictory();
  }
}

function automationButtonClass(active) {
  return active ? "secondary-button active" : "secondary-button";
}

function supportRobotHarvestPanel(device) {
  ensureSupportRobotProfile(device);
  const config = device.harvestAutomation || { enabled: true };
  const locked = !state.supportOS?.harvest;
  return `<div class="automation-config compact-config robot-harvest-config">
    <div class="automation-section"><h4>自動収穫設定</h4>
      ${locked ? `<div class="automation-detail-card"><p class="automation-hint">収穫OSを購入すると、このロボットごとの自動収穫を切り替えられます。</p></div>` : `<div class="automation-detail-card">
        <div class="automation-row compact"><strong>収穫AI</strong><button class="${automationButtonClass(config.enabled)}" data-auto-action="robot-harvest-toggle" data-robot-id="${device.id}">${config.enabled ? "ONLINE" : "OFFLINE"}</button></div>
        <small class="automation-hint">ONLINE中は、この個体の行動範囲内に収穫可能な株があれば、一株ずつ収穫します。</small>
      </div>`}
    </div>
  </div>`;
}
function supportRobotPlantingPanel(device) {
  ensureSupportRobotProfile(device);
  const config = device.plantingAutomation || { enabled: false, cropId: "lettuce" };
  const cropId = CROPS[config.cropId] ? config.cropId : "lettuce";
  const locked = !state.supportOS?.planting;
  const cropButtons = Object.entries(CROPS).map(([entryCropId, crop]) => {
    const seedLocked = !isUnlocked("seed_item", entryCropId);
    return `<button class="${automationButtonClass(entryCropId === cropId)}" data-auto-action="robot-plant-select" data-robot-id="${device.id}" data-crop-id="${entryCropId}" ${locked || seedLocked ? "disabled" : ""}>${escapeHtml(crop.name)}</button>`;
  }).join("");
  return `<div class="automation-config compact-config robot-planting-config">
    <div class="automation-section"><h4>自動植え付け設定</h4>
      <p>このロボット個体が範囲内の空きスロットへ植える種を指定します。種と水と養液がある限り、一株ずつ植え付けます。</p>
      ${locked ? `<div class="automation-detail-card"><p class="automation-hint">植え付けOSを購入すると、このロボットごとの自動植え付け設定を変更できます。</p></div>` : `<div class="automation-buttons crop-selector">${cropButtons}</div>
      <div class="automation-detail-card">
        ${selectedAutomationCropCard(cropId, "procurement")}
        <div class="automation-row compact"><strong>植え付けAI</strong><button class="${automationButtonClass(config.enabled)}" data-auto-action="robot-plant-toggle" data-robot-id="${device.id}" data-crop-id="${cropId}">${config.enabled ? "ONLINE" : "OFFLINE"}</button></div>
        <small class="automation-hint">ONLINE中は、この個体の行動範囲内に空きスロットがあれば、選択中の種をあるだけ植えていきます。</small>
      </div>`}
    </div>
  </div>`;
}

function showSupportRobotPanel(device) {
  ensureSupportRobotProfile(device);
  const skill = supportRobotSkill(device);
  const personalities = supportRobotPersonalities(device);
  const rarity = supportRobotPersonalityRarity(device);
  const personalityNames = personalities.map((entry) => entry.name).join(" / ") || "未設定";
  const personalityDescriptions = personalities
    .map((entry) => `${escapeHtml(entry.name)}: ${escapeHtml(entry.description || "説明未設定")}`)
    .join("<br>");
  const efficiency = supportRobotEfficiencyBreakdown(device);
  const percentLabel = (value) => {
    const percent = Math.round((Number(value) || 0) * 1000) / 10;
    return `${percent >= 0 ? "+" : ""}${percent}%`;
  };
  const html = `<div class="device-detail support-automation-panel"><img src="${FLOOR_DEVICES.support_robot?.sprite || FLOOR_DEVICES.support_robot?.icon}" alt=""><div><h3>${escapeHtml(FLOOR_DEVICES.support_robot?.name || "Support Robot")}</h3><p>特技: ${escapeHtml(skill.name || device.robotSkillId)} // 収穫${supportTaskGrade(device, "harvest")} 植付${supportTaskGrade(device, "plant")} 育成${supportTaskGrade(device, "care")} 清掃${supportTaskGrade(device, "cleaning")} 調達${supportTaskGrade(device, "procure")} 出荷${supportTaskGrade(device, "ship")} 回収${supportTaskGrade(device, "resource_collect")}</p><p>性格タグ: [${escapeHtml(rarity.name)}] ${escapeHtml(personalityNames)}</p><p>${personalityDescriptions || "性格特性の説明は未設定です。"}</p><p>担当作業 ${efficiency.assignedTaskCount}種類 / 個体補正 ${percentLabel(efficiency.selfBonus)} / 同拠点補正 ${percentLabel(efficiency.teamBonus)}</p><p>範囲 ${supportRobotRange(device)} / 電力 ${Math.round(Number(device.supportEnergy) || 0)} / 気力 ${Math.round(Number(device.supportMorale) || 0)} / 共通効率 ${Math.round(efficiency.totalEfficiency * 100)}%</p><p>OS: 収穫 ${state.supportOS.harvest ? "ONLINE" : "LOCKED"} / 植付・育成 ${state.supportOS.planting ? "ONLINE" : "LOCKED"} / 清掃 ${state.supportOS.cleaning ? "ONLINE" : "LOCKED"} / 資源回収 ${state.supportOS.storage ? "ONLINE" : "LOCKED"}</p></div></div>${supportRobotHarvestPanel(device)}${supportRobotPlantingPanel(device)}`;
  showModal("SUPPORT ROBOT", "支援ロボット個体情報", html, true, false, "閉じる");
}
function cropChoiceButtons(actionPrefix, selectedCropId, { seedLocked = false } = {}) {
  return Object.entries(CROPS).map(([cropId, crop]) => {
    const locked = seedLocked && !isUnlocked("seed_item", cropId);
    return `<button class="${automationButtonClass(cropId === selectedCropId)}" data-auto-action="${actionPrefix}" data-crop-id="${cropId}" ${locked ? "disabled" : ""}>${escapeHtml(crop.name)}</button>`;
  }).join("");
}

function cropStockCount(cropId) {
  return state.inventory.filter((item) => item.crop === cropId).reduce((sum, item) => sum + Math.max(0, Number(item.qty) || 0), 0);
}

function selectedAutomationCropCard(cropId, mode) {
  const crop = CROPS[cropId] || CROPS.lettuce;
  const seedPrice = currentSeedPrice(cropId);
  const trend = seedPriceTrend(cropId);
  const subline = mode === "shipping"
    ? `STOCK ${cropStockCount(cropId)}`
    : `SEED ${state.seeds[cropId] || 0} / PACK ${crop.packSize} / PRICE ₡${formatNumber(seedPrice)} ${trend.label}`;
  return `<div class="automation-selected-crop" style="--crop-color:${crop.color}">
    <img src="${crop.icon}" alt="">
    <div><strong>${escapeHtml(crop.name)}</strong><small>${subline}</small><p>${escapeHtml(crop.note || "")}</p></div>
  </div>`;
}

function procurementSelectedPanel() {
  const cropId = CROPS[state.automation.procurement.selectedCropId] ? state.automation.procurement.selectedCropId : "lettuce";
  const crop = CROPS[cropId];
  const config = state.automation.procurement.byCrop[cropId] || { enabled: false, packs: 1 };
  const locked = !isUnlocked("seed_item", cropId);
  return `<div class="automation-detail-card">
    ${selectedAutomationCropCard(cropId, "procurement")}
    <div class="automation-row compact"><strong>調達</strong><button class="${automationButtonClass(config.enabled)}" data-auto-action="proc-toggle" data-crop-id="${cropId}" ${locked ? "disabled" : ""}>${locked ? "LOCKED" : config.enabled ? "ONLINE" : "OFFLINE"}</button></div>
    <div class="automation-row compact"><strong>PACKS</strong><span class="automation-stepper"><button class="secondary-button" data-auto-action="proc-packs" data-crop-id="${cropId}" data-delta="-1" ${locked ? "disabled" : ""}>-</button><strong>${config.packs}</strong><button class="secondary-button" data-auto-action="proc-packs" data-crop-id="${cropId}" data-delta="1" ${locked ? "disabled" : ""}>+</button></span></div>
    <small class="automation-hint">${locked ? "この種はまだ購入できません。" : `目標 ${crop.packSize * config.packs}粒を下回ると1パックずつ購入します。`}</small>
  </div>`;
}
function availableShippingMarketsForCrop(cropId) {
  return Object.entries(MARKETS).filter(([marketId]) => canSellCropToMarket(cropId, marketId));
}

function shippingMarketButtons(cropId, selectedMarketId) {
  const markets = availableShippingMarketsForCrop(cropId);
  if (!markets.length) return `<span class="automation-empty">NO AVAILABLE MARKET</span>`;
  return markets.map(([marketId, market]) => `<button class="${automationButtonClass(marketId === selectedMarketId)}" data-auto-action="ship-market" data-crop-id="${cropId}" data-market-id="${marketId}">${escapeHtml(market.name)}</button>`).join("");
}

function shippingSelectedPanel() {
  const cropId = CROPS[state.automation.shipping.selectedCropId] ? state.automation.shipping.selectedCropId : "lettuce";
  const config = state.automation.shipping.byCrop[cropId] || { enabled: false, marketId: "lower", qty: 1 };
  const markets = availableShippingMarketsForCrop(cropId);
  if (markets.length && !canSellCropToMarket(cropId, config.marketId)) {
    config.marketId = markets[0][0];
    config.enabled = false;
  } else if (!markets.length) {
    config.enabled = false;
  }
  return `<div class="automation-detail-card">
    ${selectedAutomationCropCard(cropId, "shipping")}
    <div class="automation-row compact"><strong>出荷</strong><button class="${automationButtonClass(config.enabled)}" data-auto-action="ship-toggle" data-crop-id="${cropId}" ${markets.length ? "" : "disabled"}>${markets.length ? (config.enabled ? "ONLINE" : "OFFLINE") : "NO ROUTE"}</button></div>
    <div class="automation-row compact market-row"><strong>MARKET</strong><div class="automation-buttons market-buttons">${shippingMarketButtons(cropId, config.marketId)}</div></div>
    <p class="automation-hint">在庫がある場合、この作物を一括で自動出荷します。</p>
    <small class="automation-hint">${markets.length ? supportAutomationRunHint("shipping_hatch") : "この作物を出荷できる解放済み市場がありません。"}</small>
  </div>`;
}
function showProcurementTerminal() {
  ensureSupportAutomationState();
  const selectedCropId = state.automation.procurement.selectedCropId;
  const html = `<div class="automation-config compact-config"><p>SEEDで作物を選び、種子の自動調達だけを作物ごとに設定します。植え付けAIは各サポートロボットをクリックして設定します。</p>
    <div class="automation-section"><h4>SEED</h4><div class="automation-buttons crop-selector">${cropChoiceButtons("proc-select", selectedCropId)}</div>${procurementSelectedPanel()}</div></div>`;
  showModal("PROCUREMENT TERMINAL", "自動種子調達", html, true, false, "閉じる");
}
function showShippingTerminal() {
  ensureSupportAutomationState();
  const selectedCropId = state.automation.shipping.selectedCropId;
  const html = `<div class="automation-config compact-config"><p>CROPで作物を選び、作物ごとに出荷ON/OFFと販売先を設定します。出荷時は指定作物の在庫を一括で売却します。</p>
    <div class="automation-section"><h4>CROP</h4><div class="automation-buttons crop-selector">${cropChoiceButtons("ship-select", selectedCropId)}</div>${shippingSelectedPanel()}</div></div>`;
  showModal("SHIPPING HATCH", "自動出荷設定", html, true, false, "閉じる");
}
function handleAutomationControl(button) {
  ensureSupportAutomationState();
  const action = button.dataset.autoAction;
  const cropId = button.dataset.cropId;

  if (action === "robot-harvest-toggle") {
    const robot = findSupportRobotById(button.dataset.robotId);
    if (!robot || !state.supportOS?.harvest) return;
    ensureSupportRobotProfile(robot);
    robot.harvestAutomation.enabled = !robot.harvestAutomation.enabled;
    playSound("tab_switch", 0.08);
    saveGame();
    showSupportRobotPanel(robot);
    return;
  }

  if (action?.startsWith("robot-plant")) {
    const robot = findSupportRobotById(button.dataset.robotId);
    if (!robot || !state.supportOS?.planting) return;
    ensureSupportRobotProfile(robot);
    if (action === "robot-plant-select" && CROPS[cropId]) robot.plantingAutomation.cropId = cropId;
    if (action === "robot-plant-toggle") {
      const targetCropId = CROPS[cropId] ? cropId : robot.plantingAutomation.cropId;
      robot.plantingAutomation.cropId = targetCropId;
      robot.plantingAutomation.enabled = !(robot.plantingAutomation.enabled && robot.plantingAutomation.cropId === targetCropId);
    }
    playSound("tab_switch", 0.08);
    saveGame();
    showSupportRobotPanel(robot);
    return;
  }

  if (action === "proc-select" && CROPS[cropId]) state.automation.procurement.selectedCropId = cropId;
  if (action === "ship-select" && CROPS[cropId]) state.automation.shipping.selectedCropId = cropId;
  if (action === "proc-toggle" && CROPS[cropId]) state.automation.procurement.byCrop[cropId].enabled = !state.automation.procurement.byCrop[cropId].enabled;
  if (action === "proc-packs" && CROPS[cropId]) state.automation.procurement.byCrop[cropId].packs = Math.max(1, Math.min(12, state.automation.procurement.byCrop[cropId].packs + Number(button.dataset.delta || 0)));
  if (action === "ship-toggle" && CROPS[cropId] && availableShippingMarketsForCrop(cropId).length) state.automation.shipping.byCrop[cropId].enabled = !state.automation.shipping.byCrop[cropId].enabled;
  if (action === "ship-market" && CROPS[cropId] && canSellCropToMarket(cropId, button.dataset.marketId)) state.automation.shipping.byCrop[cropId].marketId = button.dataset.marketId;
  playSound("tab_switch", 0.08);
  saveGame();
  if (action.startsWith("ship")) showShippingTerminal();
  else showProcurementTerminal();
}

function adjustEnvironment(key, delta) {
  const base = currentBase();
  base.environment ||= { ...DEFAULT_ENVIRONMENT };
  const ranges = {
    temp: [16, 32],
    humidity: [35, 85],
    co2: [450, 1100]
  };
  const [min, max] = ranges[key] || [0, 9999];
  base.environment[key] = Math.max(min, Math.min(max, base.environment[key] + delta));
  setStatus(`${base.name} environment updated: temp ${base.environment.temp}C / humidity ${base.environment.humidity}% / CO2 ${base.environment.co2}ppm.`);
  playSound("environment_adjust", 0.12);
  saveGame();
  renderFarm();
}

function processDayBoundary() {
  if (state.ended) return;

  activePlants().forEach(({ plant }) => {
    if (plant.ready) {
      plant.readyAge += 1;
      const degradeAfter = state.equipment.fridge ? 6 : 3;
      if (plant.readyAge >= degradeAfter) plant.degraded = true;
    }
  });

  const upkeep = dailyUpkeep();
  state.money -= upkeep;
  if (state.money < 0) state.consecutiveDebtDays += 1;
  else state.consecutiveDebtDays = 0;

  state.day += 1;
  refreshInventoryAges();
  const modeLimit = playModeLimit(state.mode);
  const debugMode = Boolean(state.debugMode);
  if (!debugMode && isTimedPlayMode(state.mode) && state.day > modeLimit) {
    finalizeDay30Run({ completed: true, playedDays: modeLimit, mode: state.mode });
    return;
  }
  if (shouldRefreshMonthlyScheduleForDay(state.day)) {
    state.monthlySchedule = generateMonthlySchedule();
  }
  let resourceOutput = null;
  const operationFailed = !debugMode && (state.money <= -500 || state.consecutiveDebtDays >= 3);
  if (operationFailed && isTimedPlayMode(state.mode)) {
    finalizeDay30Run({ completed: false, playedDays: state.day, mode: state.mode });
    return;
  }
  if (operationFailed && state.mode !== "free") {
    state.ended = true;
    state.paused = true;
    showEndReport();
  } else {
    resourceOutput = processDailyResourceProduction();
    const personalityTriggerResults = processSupportRobotPersonalityTriggers("day_start");
    updateMarketForDay({ drift: true });
    const blockedCount = (resourceOutput.blocked.water || 0) + (resourceOutput.blocked.nutrient || 0);
    const productionParts = [];
    if (resourceOutput.actual.water > 0 || resourceOutput.actual.nutrient > 0) {
      productionParts.push(
        "設備に蓄積 水 +" + formatResource(resourceOutput.actual.water)
        + "・養液 +" + formatResource(resourceOutput.actual.nutrient)
      );
    }
    if (blockedCount > 0) productionParts.push("未回収のため生産停止 " + blockedCount + "基");
    const productionText = productionParts.length ? " / " + productionParts.join(" / ") : "";
    setStatus(`DAY ${state.day} 開始：維持費 ₡${upkeep}を支払いました${productionText}。`);
    toast(`DAY ${String(state.day).padStart(2, "0")} 開始`);
    if (productionText) {
      toast(`RESOURCE STORED // 水 +${formatResource(resourceOutput.actual.water)} / 養液 +${formatResource(resourceOutput.actual.nutrient)}`);
    }
    maybeShowTimedModeCountdown();
    personalityTriggerResults.forEach((result) => {
      if (result.message) toast(result.message, "bot");
    });
    if (state.mode === "normal" && state.day > 30 && !state.prototypeReportShown) {
      state.prototypeReportShown = true;
      setStatus("30 day evaluation complete. Endless mode begins.");
      toast("Notification.");
    }
    checkVictory();
  }

  saveGame();
  render();
  showDailyResourceProductionEffects(resourceOutput);

}

function realtimeTick() {
  const now = Date.now();
  const elapsedMs = Math.min(1000, Math.max(0, now - lastTickAt));
  lastTickAt = now;
  const dayProgressValue = Number(state.dayProgress);
  state.dayProgress = Number.isFinite(dayProgressValue) ? Math.max(0, dayProgressValue) : 0;
  if (state.dayProgress > 3) state.dayProgress %= 1;
  if (settingsPanelOpen || isCommsBlocking() || isRobotGachaBlocking() || isTimedModeCountdownBlocking()) return;
  if (startScreenOpen) {
    if (now - lastRenderAt >= Math.max(500, runtimeRenderIntervalMs())) {
      renderRuntime();
      lastRenderAt = now;
    }
    return;
  }
  if (state.ended || state.paused || isLaborTutorialActive() || state.radar?.tutorialActive) {
    if (now - lastRenderAt >= Math.max(500, runtimeRenderIntervalMs())) {
      renderRuntime();
      lastRenderAt = now;
    }
    return;
  }

  const deltaDays = elapsedMs / REALTIME_DAY_MS;
  processRealtimeGrowth(deltaDays);
  processSupportRobots(deltaDays);
  if (!state.timeUnlocked) {
    state.dayProgress = 0;
    if (now - lastRenderAt >= runtimeRenderIntervalMs()) {
      renderRuntime();
      lastRenderAt = now;
    }
    if (now - lastAutosaveAt >= 5000) {
      saveGame();
      lastAutosaveAt = now;
    }
    return;
  }
  state.dayProgress += deltaDays;
  let dayBoundaryGuard = 0;
  while (state.dayProgress >= 1 && !state.ended && !isTimedModeCountdownBlocking() && dayBoundaryGuard < 3) {
    state.dayProgress -= 1;
    dayBoundaryGuard += 1;
    processDayBoundary();
  }
  if (dayBoundaryGuard >= 3 && state.dayProgress >= 1) {
    state.dayProgress %= 1;
    console.warn('Day progress guard clamped excessive progress.');
  }

  if (now - lastRenderAt >= runtimeRenderIntervalMs()) {
    renderRuntime();
    lastRenderAt = now;
  }
  if (now - lastAutosaveAt >= 5000) {
    saveGame();
    lastAutosaveAt = now;
  }
}

function togglePause() {
  if (isRobotGachaBlocking()) return;
  if (isTimedModeCountdownBlocking()) return;
  if (isCommsBlocking()) {
    setStatus("重要通信中です。通信を閉じるまで時計は停止しています。");
    return;
  }
  if (state.ended || !state.timeUnlocked) {
    setStatus("Tutorial link active. The day clock is locked, but plants continue growing.");
    return;
  }
  state.paused = !state.paused;
  lastTickAt = Date.now();
  setStatus(state.paused ? "Paused." : "Realtime growth resumed.");
  saveGame();
  render();
}

function checkVictory() {
  checkFactionProgression();
}

function reportMarkup() {
  const planted = activePlants().length;
  const inventoryCount = state.inventory.reduce((sum, item) => sum + item.qty, 0);
  return `<div class="modal-report">
    <div><span>到達日</span><strong>DAY ${Math.min(state.day, playModeLimit(state.mode))}</strong></div>
    <div><span>所持金</span><strong>₡${formatNumber(state.money)}</strong></div>
    <div><span>栽培設備</span><strong>P${unitCount("pod")} / B${unitCount("box")}</strong></div>
    <div><span>栽培中 / 在庫</span><strong>${planted} / ${inventoryCount}</strong></div>
  </div>`;
}

function showEndReport() {
  let title = "Operation Ended";
  let copy = "The underground farm can no longer continue.";
  let kicker = "OPERATION CLOSED";
  if (state.money <= -500) {
    title = "Supply Network Collapse";
    copy = "Debt crossed the limit and supply routes stopped.";
  } else if (state.consecutiveDebtDays >= 3) {
    title = "Maintenance Failed";
    copy = "Three deficit days pushed collaborators away.";
  }
  showModal(kicker, title, `<p class="modal-copy">${copy}</p>${reportMarkup()}`, false);
}

function commitDay30Run({ completed = false, playedDays = state.day, mode = state.mode } = {}) {
  state.pendingDay30Result = null;
  state.ended = true;
  state.paused = true;
  const summary = recordDay30Run({ completed, playedDays, mode }) || createDay30Summary({
    completed,
    playedDays,
    mode,
    id: state.day30RecordId || undefined
  });
  setStartModeView(validPlayMode(summary.mode, "day45"));
  pendingDay30RecordId = summary.id;
  showDay30Report(summary);
  saveGame();
  render();
}

function completePendingDay30ResultIfReady() {
  const pending = state.pendingDay30Result;
  if (!pending?.interviewComplete || activeStory) return false;
  commitDay30Run(pending);
  return true;
}

function finalizeDay30Run({ completed = false, playedDays = state.day, mode = state.mode } = {}) {
  if (state.ended || state.pendingDay30Result) return;
  state.paused = true;
  state.pendingDay30Result = {
    completed: Boolean(completed),
    playedDays: Math.max(1, Number(playedDays) || Number(state.day) || 1),
    mode: validPlayMode(mode || state.mode || "day45"),
    interviewComplete: false
  };
  const interviewStarted = triggerStoryEvent("pre_result_robot_interview", {
    completed: Boolean(completed),
    playedDays: state.pendingDay30Result.playedDays,
    mode: state.pendingDay30Result.mode
  });
  if (!interviewStarted) {
    state.pendingDay30Result.interviewComplete = true;
    completePendingDay30ResultIfReady();
    return;
  }
  saveGame();
  render();
}

function randomResultTitle(summary) {
  const titles = Array.isArray(summary?.titles) ? summary.titles.filter(Boolean) : [];
  if (!titles.length) return "\u9055\u6cd5\u30ec\u30bf\u30b9\u8fb2\u5bb6";
  return titles[Math.floor(Math.random() * titles.length)];
}

function publicGameUrl() {
  const host = window.location.hostname;
  if (!host || host === "127.0.0.1" || host === "localhost") return PUBLIC_GAME_URL;
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.pathname = url.pathname.replace(/index\.html$/i, "");
  return url.href;
}

function currentDay30Record() {
  if (!pendingDay30RecordId) return null;
  for (const mode of START_MODE_SEQUENCE) {
    const record = readPlayRecords(mode).find((entry) => entry.id === pendingDay30RecordId);
    if (record) return record;
  }
  return null;
}

function currentResultSummary() {
  applyDay30PlayerName();
  return currentDay30Record() || createDay30Summary({
    id: pendingDay30RecordId || undefined,
    mode: state.mode || "day45",
    completed: state.ended,
    playedDays: Math.min(playModeLimit(state.mode), state.day),
    playerName: currentDay30PlayerName()
  });
}

function xShareDraft(summary) {
  const title = randomResultTitle(summary);
  return "\u3042\u306a\u305f\u306f\u9055\u6cd5\u30ec\u30bf\u30b9\u3092\u58f2\u3063\u3066\u3001"
    + formatNumber(summary.revenue || 0)
    + "\u5186\u7a3c\u304e\u3001"
    + title
    + "\u3068\u547c\u3070\u308c\u307e\u3057\u305f\u3002\n#UnderGreen #\u9055\u6cd5\u30ec\u30bf\u30b9\u683d\u57f9\n"
    + publicGameUrl();
}

function openXShareDraft() {
  const summary = currentResultSummary();
  const textValue = xShareDraft(summary);
  legacyCopyToClipboard(textValue);
  window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(textValue), "_blank", "noopener,noreferrer");
  toast("X post draft opened.");
}

function latestPlayRecordForExport() {
  return [...readDay30Records(), ...readDay60Records(), ...readFreeRecords()]
    .sort((a, b) => String(b.recordedAt || "").localeCompare(String(a.recordedAt || "")))[0] || null;
}

const GOOGLE_FORM_RECORD_MAX_CHARS = 1800;

function compactMapSummary(values = {}, labeler = (value) => value) {
  return Object.entries(values)
    .filter(([, value]) => Number(value) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 5)
    .map(([key, value]) => `${labeler(key)}:${formatNumber(value)}`)
    .join(" / ") || "-";
}

function compactTimelineSummary(record = {}) {
  const timeline = record.analytics?.timeline || {};
  const keys = [
    "firstPlant",
    "firstHarvest",
    "firstSale",
    "firstPurchase:unit:pod",
    "firstPurchase:unit:box",
    "firstPurchase:property",
    "firstPurchase:device:support_robot"
  ];
  return keys
    .map((key) => [key, timeline[key]])
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=DAY${value.day ?? "?"}`)
    .join(" / ") || "-";
}

function compactRecordForGoogleForm(record) {
  if (!record) return "LATEST: -";
  const ranking = resultRankingStats(record);
  const lines = [
    `[${record.runLabel || record.id || "RUN"}] ${record.modeLabel || record.mode || "MODE"}`,
    `player=${record.playerName || "未記名"} / day=${record.day || 0}${record.completed ? " / completed" : " / unfinished"}`,
    `money=C${formatNumber(record.money || 0)} / revenue=C${formatNumber(record.revenue || 0)} / units=${formatNumber(record.unitsSold || 0)} / avg=C${formatNumber(record.averageUnitPrice || 0)}`,
    `rankingScope=${ranking.scopeLabel} / topCrop=${resultRankingCropText(record)} / topMarketRevenue=${resultRankingMarketRevenueText(record)} / topMarketQty=${resultRankingMarketQtyText(record)}`,
    `equipment=${formatNumber(record.equipmentCount || 0)} / property=${formatNumber(record.propertyCount || 0)} / elapsed=${formatNumber(record.analytics?.elapsedSec || 0)}sec`,
    `crops=${compactMapSummary(record.byCrop, cropLabel)}`,
    `markets(amount)=${compactMapSummary(record.byMarket, marketLabel)}`,
    `markets(qty)=${compactMapSummary(record.byMarketQty, marketLabel)}`,
    `titles=${record.titles?.length ? record.titles.join(" / ") : "-"}`,
    `timeline=${compactTimelineSummary(record)}`
  ];
  return lines.join("\n");
}

function truncateGoogleFormText(text) {
  if (text.length <= GOOGLE_FORM_RECORD_MAX_CHARS) return text;
  const suffix = "\n...trimmed for Google Form URL. Full JSON is available from LOG > COPY.";
  return text.slice(0, Math.max(0, GOOGLE_FORM_RECORD_MAX_CHARS - suffix.length)) + suffix;
}

function googleFormRecordText(records, latest) {
  const header = [
    "UNDERGREEN PLAY LOG",
    `exportedAt=${records.exportedAt}`,
    `records day45=${records.records.day45.length} / day60=${records.records.day60.length} / free=${records.records.free.length}`,
    "",
    compactRecordForGoogleForm(latest)
  ].join("\n");
  return truncateGoogleFormText(header);
}

function googleFormExportPayload() {
  const records = playRecordsExportPayload();
  const latest = latestPlayRecordForExport();
  return {
    recordJson: googleFormRecordText(records, latest),
    day45Count: String(records.records.day45.length),
    day60Count: String(records.records.day60.length),
    freeCount: String(records.records.free.length),
    latestRevenue: latest ? String(latest.revenue || 0) : "0",
    latestTitles: latest?.titles?.join(" / ") || ""
  };
}

function googleFormConfigured() {
  return Boolean(GOOGLE_FORM_PREFILL_URL && Object.values(GOOGLE_FORM_FIELDS).some(Boolean));
}

function googleFormPrefillUrl() {
  const url = new URL(GOOGLE_FORM_PREFILL_URL);
  const payload = googleFormExportPayload();
  Object.entries(GOOGLE_FORM_FIELDS).forEach(([key, entryId]) => {
    if (!entryId || payload[key] === undefined) return;
    url.searchParams.set(entryId, payload[key]);
  });
  return url.href;
}

function openGoogleFormRecordExport() {
  const payload = googleFormExportPayload();
  if (!googleFormConfigured()) {
    showModal("FORM SETUP", "Google Form setting required", `<p class="modal-copy">Set GOOGLE_FORM_PREFILL_URL and GOOGLE_FORM_FIELDS in game.js. The payload below is what will be sent.</p><textarea class="record-export-field" readonly>${escapeHtml(JSON.stringify(payload, null, 2))}</textarea>`, true);
    document.getElementById("modal-reset").style.display = "none";
    window.setTimeout(() => {
      const field = document.querySelector(".record-export-field");
      if (field) field.select();
    }, 0);
    return;
  }
  window.open(googleFormPrefillUrl(), "_blank", "noopener,noreferrer");
  toast("Google Form opened.");
}
const resultPresentation = (() => {
  const PARTICLE_LIMIT = 320;
  const PARTICLE_COLORS = [
    "113,255,184",
    "72,219,234",
    "200,107,255",
    "255,95,208",
    "245,214,91"
  ];

  let canvas = null;
  let particleContext = null;
  let particleFrame = 0;
  let particles = [];
  let audioContext = null;
  let activeSequence = null;

  function reducedMotionRequested() {
    return isLowSpecMode() || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }

  function ensureCanvas() {
    if (canvas?.isConnected && particleContext) return true;
    canvas = document.getElementById("result-fx-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "result-fx-canvas";
      canvas.setAttribute("aria-hidden", "true");
      document.body.appendChild(canvas);
    }
    particleContext = canvas.getContext("2d");
    resizeCanvas();
    return Boolean(particleContext);
  }

  function resizeCanvas() {
    if (!canvas || !particleContext) return;
    const ratio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    particleContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function startParticleLoop() {
    if (!particleFrame) particleFrame = requestAnimationFrame(drawParticles);
  }

  function spawnParticle(x, y, options = {}) {
    if (reducedMotionRequested() || !ensureCanvas()) return;
    if (particles.length >= PARTICLE_LIMIT) particles.shift();

    const life = options.life || 58;
    particles.push({
      x,
      y,
      vx: options.vx ?? (Math.random() - 0.5) * 5,
      vy: options.vy ?? (-2 - Math.random() * 4),
      gravity: options.gravity ?? 0.11,
      drag: options.drag ?? 0.992,
      size: options.size || (2 + Math.random() * 4),
      life,
      maxLife: life,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.22,
      color: options.color || PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      kind: options.kind || "spark"
    });

    canvas.classList.add("active");
    startParticleLoop();
  }

  function drawParticles() {
    particleFrame = 0;
    if (!particleContext || !canvas) return;

    particleContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles = particles.filter((particle) => {
      particle.life -= 1;
      if (particle.life <= 0) return false;

      particle.vx *= particle.drag;
      particle.vy = particle.vy * particle.drag + particle.gravity;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.spin;

      const alpha = Math.max(0, particle.life / particle.maxLife);
      particleContext.save();
      particleContext.globalAlpha = alpha;
      particleContext.translate(particle.x, particle.y);
      particleContext.rotate(particle.rotation);

      if (particle.kind === "coin") {
        particleContext.fillStyle = "rgba(" + particle.color + "," + alpha + ")";
        particleContext.fillRect(-particle.size, -particle.size * 0.32, particle.size * 2, particle.size * 0.64);
        particleContext.strokeStyle = "rgba(255,255,220," + alpha + ")";
        particleContext.lineWidth = 0.8;
        particleContext.strokeRect(-particle.size, -particle.size * 0.32, particle.size * 2, particle.size * 0.64);
      } else if (particle.kind === "spore") {
        particleContext.fillStyle = "rgba(" + particle.color + "," + alpha + ")";
        particleContext.shadowColor = "rgba(" + particle.color + ",0.8)";
        particleContext.shadowBlur = 10;
        particleContext.beginPath();
        particleContext.arc(0, 0, particle.size, 0, Math.PI * 2);
        particleContext.fill();
      } else {
        particleContext.fillStyle = "rgba(" + particle.color + "," + alpha + ")";
        particleContext.shadowColor = "rgba(" + particle.color + ",0.9)";
        particleContext.shadowBlur = 8;
        particleContext.fillRect(-particle.size * 0.5, -particle.size * 0.5, particle.size, particle.size);
      }

      particleContext.restore();
      return true;
    });

    if (particles.length) {
      startParticleLoop();
    } else {
      canvas.classList.remove("active");
      particleContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  function elementCenter(element) {
    const rect = element?.getBoundingClientRect();
    if (!rect) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function burst(element, count = 34, color = null) {
    const center = elementCenter(element);
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.28;
      const speed = 2.2 + Math.random() * 5.4;
      spawnParticle(center.x, center.y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        gravity: 0.08,
        life: 44 + Math.random() * 38,
        size: 2 + Math.random() * 4,
        color: color || undefined
      });
    }
  }

  function coinShower(element) {
    const center = elementCenter(element);
    for (let index = 0; index < 42; index += 1) {
      spawnParticle(center.x + (Math.random() - 0.5) * 210, center.y - 30 - Math.random() * 90, {
        vx: (Math.random() - 0.5) * 2.8,
        vy: 0.5 + Math.random() * 2.4,
        gravity: 0.13,
        drag: 0.997,
        life: 78 + Math.random() * 46,
        size: 3 + Math.random() * 3,
        color: "245,214,91",
        kind: "coin"
      });
    }
  }

  function clearParticles() {
    particles = [];
    if (particleFrame) cancelAnimationFrame(particleFrame);
    particleFrame = 0;
    canvas?.classList.remove("active");
    particleContext?.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function ensureAudioContext() {
    if (audioContext) return audioContext;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    try {
      audioContext = new AudioContextClass();
    } catch (error) {
      audioContext = null;
    }
    return audioContext;
  }

  function primeAudio() {
    const context = ensureAudioContext();
    if (context?.state === "suspended") context.resume().catch(() => {});
  }

  function tone(frequency, duration, type = "sine", volume = 0.035, delay = 0) {
    const context = ensureAudioContext();
    const finalVolume = Math.max(0, Math.min(1, volume * masterVolume()));
    if (!context || context.state !== "running" || finalVolume <= 0) return;

    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, finalVolume), start + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  function playTick(index = 0) {
    tone(420 + index * 42, 0.075, "square", 0.018);
  }

  function playSlide() {
    tone(185, 0.11, "sawtooth", 0.018);
    tone(275, 0.1, "square", 0.014, 0.035);
  }

  function playCoin() {
    tone(820, 0.12, "sine", 0.042);
    tone(1240, 0.18, "sine", 0.032, 0.075);
  }

  function playStamp() {
    tone(90, 0.16, "sawtooth", 0.05);
    tone(54, 0.22, "square", 0.028);
  }

  function playFanfare() {
    [392, 523.25, 659.25, 783.99].forEach((frequency, index) => {
      tone(frequency, 0.48, "triangle", 0.035, index * 0.085);
    });
    tone(196, 0.72, "sine", 0.025);
  }

  function playChord() {
    [392, 493.88, 587.33, 783.99].forEach((frequency) => {
      tone(frequency, 0.76, "sine", 0.024);
    });
  }

  function clearSequenceTimers(sequence) {
    sequence.timers.forEach((timer) => window.clearTimeout(timer));
    sequence.intervals.forEach((timer) => window.clearInterval(timer));
    sequence.timers.clear();
    sequence.intervals.clear();
  }

  function revealLateElement(element) {
    if (!element) return;
    element.classList.add("on");
    element.removeAttribute("aria-hidden");
    if ("inert" in element) element.inert = false;
  }

  function concealLateElement(element) {
    if (!element) return;
    element.classList.add("fx-late");
    element.classList.remove("on");
    element.setAttribute("aria-hidden", "true");
    if ("inert" in element) element.inert = true;
  }

  function stop() {
    if (activeSequence) {
      clearSequenceTimers(activeSequence);
      activeSequence.modal.removeEventListener("pointerdown", activeSequence.skip, true);
      activeSequence.lateElements.forEach(revealLateElement);
      activeSequence.modal.classList.remove("fx-result", "fx-result-done");
      activeSequence = null;
    }

    document.querySelectorAll(".modal.fx-result, .modal.fx-result-done").forEach((modal) => {
      modal.classList.remove("fx-result", "fx-result-done");
    });
    clearParticles();
  }

  function play(content, summary) {
    stop();
    if (!content || reducedMotionRequested()) return;

    const modal = content.closest(".modal");
    const report = content.querySelector(".modal-report");
    if (!modal || !report) return;

    const hero = document.createElement("div");
    hero.className = "fx-result-hero";
    hero.setAttribute("aria-label", "Operation complete");
    hero.innerHTML = "<span>OPERATION</span><strong>COMPLETE</strong>";
    content.prepend(hero);

    const rows = Array.from(report.children);
    rows.forEach((row) => row.classList.add("fx-stat"));

    const revenueRow = rows[1] || null;
    const revenueStrong = revenueRow?.querySelector("strong") || null;
    const revenueDigits = [];
    if (revenueRow && revenueStrong) {
      revenueRow.classList.add("fx-revenue-row");
      revenueStrong.classList.add("fx-revenue");
      const value = Array.from(revenueStrong.textContent || "");
      revenueStrong.textContent = "";
      value.forEach((character) => {
        const digit = document.createElement("i");
        digit.className = "fx-digit";
        digit.textContent = character;
        revenueStrong.appendChild(digit);
        revenueDigits.push(digit);
      });
    }

    const directCopy = Array.from(content.children).filter((element) => element.classList.contains("modal-copy"));
    const intro = directCopy[0] || null;
    const titleLine = directCopy[directCopy.length - 1] || null;
    const titleBadges = [];

    if (titleLine && titleLine !== intro) {
      titleLine.classList.add("fx-title-line");
      titleLine.textContent = "";

      const titleLabel = document.createElement("span");
      titleLabel.className = "fx-title-label";
      titleLabel.textContent = "EARNED TITLES";
      titleLine.appendChild(titleLabel);

      const badgeList = document.createElement("span");
      badgeList.className = "fx-title-badges";
      const titles = Array.isArray(summary?.titles) && summary.titles.length ? summary.titles : ["NO TITLE"];
      titles.forEach((title) => {
        const badge = document.createElement("strong");
        badge.className = "fx-title-badge";
        if (title === "NO TITLE") badge.classList.add("no-title");
        badge.textContent = title;
        badgeList.appendChild(badge);
        titleBadges.push(badge);
      });
      titleLine.appendChild(badgeList);
    }

    const lateElements = [
      intro,
      content.querySelector(".day30-name-field"),
      content.querySelector(".day30-share-actions"),
      content.querySelector(".day30-result-actions")
    ].filter(Boolean);
    lateElements.forEach(concealLateElement);

    modal.classList.add("fx-result");
    modal.classList.remove("fx-result-done");

    const sequence = {
      modal,
      lateElements,
      timers: new Set(),
      intervals: new Set(),
      finished: false,
      skip: null,
      finish: null
    };

    function schedule(callback, delay) {
      const timer = window.setTimeout(() => {
        sequence.timers.delete(timer);
        if (activeSequence === sequence) callback();
      }, delay);
      sequence.timers.add(timer);
      return timer;
    }

    sequence.finish = () => {
      if (sequence.finished || activeSequence !== sequence) return;
      sequence.finished = true;
      clearSequenceTimers(sequence);
      sequence.modal.removeEventListener("pointerdown", sequence.skip, true);
      hero.classList.add("on");
      rows.forEach((row) => row.classList.add("on"));
      revenueDigits.forEach((digit) => digit.classList.add("on"));
      revenueStrong?.classList.add("done");
      titleBadges.forEach((badge) => badge.classList.add("on"));
      lateElements.forEach(revealLateElement);
      modal.classList.add("fx-result-done");
    };

    sequence.skip = () => sequence.finish();
    activeSequence = sequence;
    modal.addEventListener("pointerdown", sequence.skip, true);

    schedule(() => {
      hero.classList.add("on");
      playStamp();
      playFanfare();
      burst(hero, 52, "245,214,91");
      schedule(() => burst(hero, 34, "113,255,184"), 210);
    }, 120);

    let cursor = 720;
    rows.forEach((row, index) => {
      schedule(() => {
        row.classList.add("on");
        playSlide();
        const marker = row.querySelector("strong") || row;
        burst(marker, index === 1 ? 18 : 8, index === 1 ? "245,214,91" : "72,219,234");
      }, cursor);
      cursor += 240;
    });

    cursor += 120;
    revenueDigits.forEach((digit, index) => {
      schedule(() => {
        digit.classList.add("on");
        if (/\d/.test(digit.textContent || "")) playTick(index % 7);
      }, cursor);
      cursor += /\d/.test(digit.textContent || "") ? 130 : 60;
    });

    schedule(() => {
      revenueStrong?.classList.add("done");
      playCoin();
      if (revenueStrong) coinShower(revenueStrong);
    }, cursor);
    cursor += 620;

    titleBadges.forEach((badge) => {
      schedule(() => {
        badge.classList.add("on");
        playStamp();
        burst(badge, 22, "200,107,255");
      }, cursor);
      cursor += 420;
    });

    cursor += 200;
    schedule(() => {
      lateElements.forEach(revealLateElement);
      playChord();
      burst(content.querySelector(".day30-result-actions") || modal, 26, "113,255,184");

      let sporeCount = 0;
      const sporeTimer = window.setInterval(() => {
        if (activeSequence !== sequence || sporeCount >= 28) {
          window.clearInterval(sporeTimer);
          sequence.intervals.delete(sporeTimer);
          return;
        }
        const rect = modal.getBoundingClientRect();
        spawnParticle(rect.left + Math.random() * rect.width, rect.bottom - 8, {
          vx: (Math.random() - 0.5) * 0.7,
          vy: -0.8 - Math.random() * 1.5,
          gravity: -0.008,
          drag: 0.998,
          life: 80 + Math.random() * 55,
          size: 1.4 + Math.random() * 2.8,
          color: Math.random() > 0.45 ? "113,255,184" : "200,107,255",
          kind: "spore"
        });
        sporeCount += 1;
      }, 85);
      sequence.intervals.add(sporeTimer);
    }, cursor);

    schedule(sequence.finish, cursor + 2500);
  }

  document.addEventListener("pointerdown", primeAudio, {
    once: true,
    capture: true,
    passive: true
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) activeSequence?.finish();
  });
  window.addEventListener("resize", resizeCanvas, { passive: true });

  return { play, stop };
})();
function endingRollText(id, fallback = "") {
  return ENDING_ROLL_TEXT[id] || fallback;
}

function appendEndingRollText(element, value) {
  String(value || "").split("|").forEach((line, index) => {
    if (index > 0) element.append(document.createElement("br"));
    element.append(document.createTextNode(line));
  });
}

function appendEndingRollGap(parent, gap) {
  if (!new Set(["s", "m", "l", "xl"]).has(gap)) return;
  const spacer = document.createElement("div");
  spacer.className = `ending-roll-gap-${gap}`;
  spacer.setAttribute("aria-hidden", "true");
  parent.append(spacer);
}

function appendEndingRollCredits(parent) {
  const groups = new Map();
  CREDITS.forEach((entry) => {
    const key = entry.section || "credits";
    if (!groups.has(key)) groups.set(key, { section: key, label: entry.sectionLabel || key, entries: [] });
    groups.get(key).entries.push(entry);
  });

  groups.forEach((group) => {
    const role = document.createElement("div");
    role.className = "ending-roll-role";
    appendEndingRollText(role, group.label);
    parent.append(role);

    group.entries.forEach((entry) => {
      const name = document.createElement("div");
      name.className = group.section === "music"
        ? "ending-roll-song"
        : group.section === "materials"
          ? "ending-roll-credit-line"
          : "ending-roll-name";
      appendEndingRollText(name, entry.name);
      parent.append(name);

      if (entry.note) {
        const note = document.createElement("div");
        note.className = "ending-roll-credit-note";
        appendEndingRollText(note, entry.note);
        parent.append(note);
      }
    });

    appendEndingRollGap(parent, "m");
  });
}

function buildEndingRollTrack() {
  const track = document.getElementById("ending-roll-track");
  if (!track) return null;
  track.replaceChildren();

  ENDING_ROLL_ITEMS.forEach((item) => {
    if (item.kind === "credits") {
      appendEndingRollCredits(track);
      appendEndingRollGap(track, item.gap);
      return;
    }

    let element;
    if (item.kind === "divider") {
      element = document.createElement("hr");
    } else {
      element = document.createElement("div");
      const classes = {
        section: "ending-roll-section",
        story: "ending-roll-story",
        story_first: "ending-roll-story ending-roll-story-first",
        title: "ending-roll-title",
        subtitle: "ending-roll-subtitle"
      };
      element.className = classes[item.kind] || "ending-roll-story";
      appendEndingRollText(element, item.text);
    }
    if (item.anchor) element.id = "ending-roll-fade-anchor";
    track.append(element);
    appendEndingRollGap(track, item.gap);
  });

  return track;
}

const endingRollPresentation = (() => {
  const DURATION = 129.98;
  const ROLL_START = 3;
  const ROLL_END = DURATION - 10;
  const FIN_TIME = DURATION - 9;
  const FADE_DURATION = 15;
  const AUDIO_PATH = "assets/audio/support-robot-ending-theme.mp3";
  const ART_PRIMARY_PATH = "assets/ending/support-robots-ending-watercolor-v2.webp?ending=20260720e1";
  const ART_FINAL_PATH = "assets/ending/support-robots-ending-watercolor-v5.webp?ending=20260720e1";

  const overlay = document.getElementById("ending-roll-overlay");
  const artPrimary = document.getElementById("ending-roll-art-primary");
  const artFinal = document.getElementById("ending-roll-art-final");
  const artVeil = document.getElementById("ending-roll-art-veil");
  const band = document.getElementById("ending-roll-band");
  const track = document.getElementById("ending-roll-track");
  const fin = document.getElementById("ending-roll-fin");
  const skipButton = document.getElementById("ending-roll-skip");
  const replayButton = document.getElementById("ending-roll-replay");
  const exitButton = document.getElementById("ending-roll-exit");
  const audio = document.getElementById("ending-roll-audio");
  const canvas = document.getElementById("ending-roll-motes");
  const context = canvas?.getContext("2d") || null;

  let active = false;
  let finished = false;
  let useClock = true;
  let clockOrigin = 0;
  let timelinePaused = false;
  let pausedAt = 0;
  let fadeTime = 30;
  let frameId = 0;
  let lastFrameAt = performance.now();
  let canvasDpr = 1;
  let motes = [];

  function currentTime() {
    if (timelinePaused) return pausedAt;
    if (useClock || !audio) return Math.max(0, (performance.now() - clockOrigin) / 1000);
    return Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
  }

  function useFallbackClock(time = 0) {
    useClock = true;
    clockOrigin = performance.now() - Math.max(0, time) * 1000;
  }

  function seek(time) {
    const nextTime = Math.max(0, Math.min(DURATION, Number(time) || 0));
    if (timelinePaused) pausedAt = nextTime;
    useFallbackClock(nextTime);
    if (audio) {
      try {
        audio.currentTime = nextTime;
      } catch (error) {
        // Metadata may still be loading; the fallback clock keeps the roll moving.
      }
    }
  }

  function playAudioFrom(time = 0) {
    seek(time);
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, 0.86 * masterVolume()));
    const playback = audio.play();
    if (!playback?.then) return;
    playback.then(() => {
      if (active && !timelinePaused) useClock = false;
    }).catch(() => {
      if (active && !timelinePaused) useFallbackClock(time);
    });
  }

  function computeFadeTime() {
    if (!track) return;
    const anchor = document.getElementById("ending-roll-fade-anchor");
    if (!anchor) {
      fadeTime = 30;
      return;
    }
    const height = track.offsetHeight;
    const viewportHeight = window.innerHeight;
    const center = anchor.offsetTop + anchor.offsetHeight / 2;
    const progress = (viewportHeight + center - viewportHeight * 0.55) / Math.max(1, viewportHeight + height);
    fadeTime = ROLL_START + Math.max(0, Math.min(1, progress)) * (ROLL_END - ROLL_START);
  }

  function resizeCanvas() {
    if (!canvas || !context) return;
    canvasDpr = Math.min(isLowSpecMode() ? 1 : 2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(window.innerWidth * canvasDpr));
    canvas.height = Math.max(1, Math.round(window.innerHeight * canvasDpr));
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  function resetMotes() {
    const count = isLowSpecMode() ? 0 : 40;
    motes = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.012,
      vy: -(Math.random() * 0.02 + 0.008),
      phase: Math.random() * Math.PI * 2
    }));
  }

  function drawMotes(now, delta) {
    if (!canvas || !context || !motes.length) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.setTransform(canvasDpr, 0, 0, canvasDpr, 0, 0);
    const width = window.innerWidth;
    const height = window.innerHeight;
    motes.forEach((mote) => {
      mote.x += mote.vx * delta + Math.sin(now / 1400 + mote.phase) * 0.00025;
      mote.y += mote.vy * delta;
      if (mote.y < -0.02) {
        mote.y = 1.02;
        mote.x = Math.random();
      }
      if (mote.x < -0.02) mote.x = 1.02;
      if (mote.x > 1.02) mote.x = -0.02;
      const twinkle = 0.5 + 0.5 * Math.sin(now / 700 + mote.phase * 3);
      context.beginPath();
      context.fillStyle = `rgba(160, 205, 150, ${0.2 + twinkle * 0.24})`;
      context.arc(mote.x * width, mote.y * height, mote.radius * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
      context.fill();
    });
  }

  function renderFrame(time, now) {
    if (!track || !fin) return;
    const finishMix = Math.min(1, Math.max(0, (time - FIN_TIME) / 3));
    const artMix = Math.min(1, Math.max(0, (time - fadeTime) / FADE_DURATION));

    if (artPrimary) artPrimary.style.opacity = String(artMix * (1 - finishMix));
    if (artFinal) artFinal.style.opacity = String(artMix * finishMix);
    if (artVeil) artVeil.style.opacity = String(artMix * (1 - finishMix * 0.65));
    if (band) band.style.opacity = String(artMix * (1 - finishMix));
    track.classList.toggle("lit", time > fadeTime + FADE_DURATION * 0.35);

    if (!isLowSpecMode()) {
      if (artMix > 0 && artPrimary) {
        const progress = Math.min(1, Math.max(0, (time - fadeTime) / Math.max(1, DURATION - fadeTime)));
        artPrimary.style.transform = `scale(${1.08 - progress * 0.06}) translateY(${(progress - 0.5) * -1.4}%)`;
      }
      if (finishMix > 0 && artFinal) {
        const finalProgress = Math.min(1, Math.max(0, (time - FIN_TIME) / Math.max(1, DURATION - FIN_TIME)));
        artFinal.style.transform = `scale(${1.05 - finalProgress * 0.03})`;
      }
    }

    const trackHeight = track.offsetHeight;
    const viewportHeight = window.innerHeight;
    const rollProgress = Math.min(1, Math.max(0, (time - ROLL_START) / Math.max(1, ROLL_END - ROLL_START)));
    const y = viewportHeight - rollProgress * (viewportHeight + trackHeight);
    track.style.transform = `translate3d(-50%, ${y}px, 0)`;
    fin.style.opacity = String(finishMix);

    const delta = Math.min(0.05, Math.max(0, (now - lastFrameAt) / 1000));
    lastFrameAt = now;
    drawMotes(now, delta);
  }

  function finish() {
    if (!active || finished) return;
    finished = true;
    if (audio) audio.pause();
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    renderFrame(DURATION, performance.now());
    fin?.classList.add("done");
    if (skipButton) skipButton.hidden = true;
    replayButton?.focus({ preventScroll: true });
  }

  function frame(now) {
    frameId = 0;
    if (!active || finished) return;
    const time = currentTime();
    renderFrame(time, now);
    if (time >= DURATION - 0.1 || audio?.ended) {
      finish();
      return;
    }
    frameId = window.requestAnimationFrame(frame);
  }

  function scheduleFrame() {
    if (!frameId && active && !finished) frameId = window.requestAnimationFrame(frame);
  }

  function resetVisuals() {
    if (artPrimary) {
      artPrimary.style.opacity = "0";
      artPrimary.style.transform = isLowSpecMode() ? "none" : "scale(1.08) translateY(0.7%)";
    }
    if (artFinal) {
      artFinal.style.opacity = "0";
      artFinal.style.transform = isLowSpecMode() ? "none" : "scale(1.05)";
    }
    if (artVeil) artVeil.style.opacity = "0";
    if (band) band.style.opacity = "0";
    if (track) {
      track.classList.remove("lit");
      track.style.transform = "translate3d(-50%, 100vh, 0)";
    }
    if (fin) {
      fin.classList.remove("done");
      fin.style.opacity = "0";
    }
    if (skipButton) skipButton.hidden = false;
  }

  function configureText() {
    const finTitle = document.getElementById("ending-roll-fin-title");
    const finSubtitle = document.getElementById("ending-roll-fin-subtitle");
    if (finTitle) finTitle.textContent = endingRollText("fin_title", "FIN");
    if (finSubtitle) finSubtitle.textContent = endingRollText("fin_subtitle", "UNDERGREEN");
    if (skipButton) skipButton.textContent = endingRollText("skip_label", "スキップ ▸");
    if (replayButton) replayButton.textContent = endingRollText("replay_label", "もう一度観る");
    if (exitButton) exitButton.textContent = endingRollText("exit_label", "スタートへ戻る");
  }

  function stop() {
    active = false;
    finished = false;
    timelinePaused = false;
    pausedAt = 0;
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    if (audio) {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch (error) {
        // The source may not have loaded yet.
      }
    }
    overlay?.classList.add("hidden");
    overlay?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("ending-roll-active");
  }

  function play() {
    if (!overlay || !track || !fin) return;
    resultPresentation.stop();
    applyDay30PlayerName();
    buildEndingRollTrack();
    configureText();
    resetVisuals();
    resizeCanvas();
    resetMotes();
    computeFadeTime();

    active = true;
    finished = false;
    timelinePaused = false;
    pausedAt = 0;
    lastFrameAt = performance.now();
    state.paused = true;
    document.getElementById("modal-backdrop")?.classList.add("hidden");
    document.body.classList.add("ending-roll-active");
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    Object.values(loopAudioPool).forEach((loop) => {
      loop.pause();
      loop.volume = 0;
    });

    if (artPrimary) artPrimary.style.backgroundImage = `url("${ART_PRIMARY_PATH}")`;
    if (artFinal) artFinal.style.backgroundImage = `url("${ART_FINAL_PATH}")`;
    if (audio && !audio.dataset.endingSourceReady) {
      audio.src = cacheBustedAudioSource(AUDIO_PATH);
      audio.dataset.endingSourceReady = "true";
      audio.load();
    }

    playAudioFrom(0);
    scheduleFrame();
  }

  function skip() {
    if (!active || finished) return;
    seek(FIN_TIME);
    scheduleFrame();
  }

  function replay() {
    if (!active) return;
    finished = false;
    timelinePaused = false;
    pausedAt = 0;
    resetVisuals();
    computeFadeTime();
    lastFrameAt = performance.now();
    playAudioFrom(0);
    scheduleFrame();
  }

  function exit() {
    if (!active) return;
    stop();
    day30ResultToStart();
  }

  skipButton?.addEventListener("click", skip);
  replayButton?.addEventListener("click", replay);
  exitButton?.addEventListener("click", exit);
  audio?.addEventListener("ended", finish);
  window.addEventListener("resize", () => {
    if (!active) return;
    resizeCanvas();
    computeFadeTime();
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!active || finished) return;
    if (document.hidden) {
      pausedAt = currentTime();
      timelinePaused = true;
      audio?.pause();
      return;
    }
    timelinePaused = false;
    playAudioFrom(pausedAt);
    scheduleFrame();
  });
  document.addEventListener("keydown", (event) => {
    if (!active || event.key !== "Escape") return;
    event.preventDefault();
    if (finished) exit();
    else skip();
  });

  return { play, stop, skip, replay, isActive: () => active };
})();
function day30ReportMarkup(summary) {
  const config = playModeConfig(summary.mode);
  const status = summary.completed ? "完走" : "途中終了";
  const modeName = config.label;
  const rankingScope = resultRankingStats(summary).scopeLabel;
  return `<p class="modal-copy">${escapeHtml(modeName)}の記録を保存しました。名前はこの端末の記録一覧に表示されます。</p>
  <label class="day30-name-field">
    <span>PLAYER NAME</span>
    <input id="day30-player-name" type="text" maxlength="18" value="${escapeHtml(summary.playerName || "")}" placeholder="名前を入力">
  </label>
  <div class="modal-report">
    <div><span>到達</span><strong>${status} / DAY ${summary.day}</strong></div>
    <div><span>累計稼得金額</span><strong>₡${formatNumber(summary.revenue)}</strong></div>
    <div><span>最多作物（${rankingScope}）</span><strong>${resultRankingCropText(summary)}</strong></div>
    <div><span>設備 / 不動産</span><strong>${summary.equipmentCount} / ${summary.propertyCount}</strong></div>
    <div><span>最多市場(金・${rankingScope})</span><strong>${resultRankingMarketRevenueText(summary)}</strong></div>
    <div><span>最多市場(量・${rankingScope})</span><strong>${resultRankingMarketQtyText(summary)}</strong></div>
  </div>
  <p class="modal-copy">称号: ${summary.titles.length ? summary.titles.join(" / ") : "なし"}</p>
  <div class="day30-share-actions">
    <button class="secondary-button" data-day30-result="share-x">X POST DRAFT</button>
  </div>
  <div class="day30-result-actions">
    <button class="secondary-button" data-day30-result="start">スタートへ戻る</button>
    <button class="secondary-button" data-day30-result="view">閲覧モード</button>
  </div>`;
}
function showDay30Report(summary) {
  const config = playModeConfig(summary.mode);
  showModal(`${config.shortLabel} RESULT`, `${config.label}終了`, day30ReportMarkup(summary), false);
  document.getElementById("modal-reset").style.display = "none";
  resultPresentation.play(document.getElementById("modal-content"), summary);
}
function showModal(kicker, title, content, canContinue, showReset = true, closeLabel = "続ける") {
  resultPresentation.stop();
  document.getElementById("modal-kicker").textContent = kicker;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-content").innerHTML = content;
  const closeButton = document.getElementById("modal-close");
  const resetButton = document.getElementById("modal-reset");
  closeButton.textContent = closeLabel;
  closeButton.hidden = !canContinue;
  closeButton.style.display = canContinue ? "" : "none";
  resetButton.hidden = !showReset;
  resetButton.style.display = showReset ? "" : "none";
  document.getElementById("modal-backdrop").classList.remove("hidden");
}

function clearSessionInteractionState() {
  clearDragState();
  clearEquipmentMenu();
  clearCleanToolDrag();
  selectedSeed = "lettuce";
  selectedMarket = "lower";
  selectedShopCategory = "seeds";
  saleQuantities = {};
  selectedUnitId = null;
  selectedDeviceId = null;
  selectedBaseId = null;
  placementSelection = null;
  dragPayload = null;
  pointerDrag = null;
  harvestSwipe = null;
  harvestHold = null;
  facilityPan = null;
  facilityPinch = null;
  equipmentMenu = null;
  equipmentMenuTimer = null;
  cleanToolDrag = null;
  activeComms = null;
  pendingComms = [];
  activeStory = null;
  pendingStories = [];
  resetOperationSurface({ resetAudio: true });
}

function hasStartProgress() {
  const shelves = allShelves();
  return state.day > 1
    || state.tradeStats?.unitsSold > 0
    || ownedBases().length > 1
    || shelves.some((unit) => unit.placed || unit.slots?.some(Boolean))
    || allFloorDevices().some((device) => device.placed);
}

function startSelectedModeGame() {
  if (startModeView === "free") startFreeGame();
  else startNewGame(startModeView);
}

function runStartLaunchFeedback(action) {
  if (startLaunchPending) return;
  startLaunchPending = true;
  const screen = document.getElementById("start-screen");
  screen?.classList.add("start-activating");
  playSoundFirst(["unlock_notice", "tab_switch", "start_mode_toggle"], 0.22);
  hapticFeedback([14, 28, 14]);
  window.setTimeout(() => {
    startLaunchPending = false;
    screen?.classList.remove("start-activating");
    action?.();
  }, 320);
}

function handleStartPrimary() {
  runStartLaunchFeedback(() => {
    if (hasStartProgress()) requestSelectedModeGame();
    else startSelectedModeGame();
  });
}

function handleStartContinue() {
  runStartLaunchFeedback(() => {
    if (hasStartProgress()) closeStartScreen();
  });
}

function unlockDebugState() {
  state.mode = "free";
  state.debugMode = true;
  state.ended = false;
  state.resultShown = false;
  state.paused = false;
  state.consecutiveDebtDays = 0;
  state.money = 99999;
  state.water = Math.max(Number(state.water) || 0, 999);
  state.waterCapacity = Math.max(Number(state.waterCapacity) || 0, 999);
  state.nutrientCapacity = Math.max(Number(state.nutrientCapacity) || 0, 999);
  state.nutrient = Math.max(Number(state.nutrient) || 0, 999);
  state.seeds = Object.fromEntries(Object.keys(CROPS).map((cropId) => [cropId, 99]));
  state.marketUnlocked = Object.fromEntries(Object.keys(MARKETS).map((marketId) => [marketId, true]));
  state.marketTabUnlocked = true;
  state.automationTabUnlocked = true;
  state.shopUnlocked = true;
  state.brokerUnlocked = true;
  state.supportOS = { harvest: true, planting: true, cleaning: true, storage: true };
  state.timeUnlocked = true;
  grantFloorDevice("support_robot", { supportBlueprintPreset: "white-work" });
  state.unlocks ||= {};
  UNLOCK_RULES.forEach((rule) => {
    state.unlocks[rule.id] = true;
    applyUnlock(rule);
  });
  startTitleTrackingIfReady();
  state.equipment = {
    ...(state.equipment || {}),
    fridge: true
  };
  state.propertyListings = generatePropertyListings(PROPERTY_LISTING_COUNT);
  state.log = "DEBUG OPERATION READY // all routes and procurement unlocked.";
}

function startDebugGame() {
  clearSessionInteractionState();
  facilityCameraViewSide = "front";
  state = createInitialState("free");
  unlockDebugState();
  updateMarketForDay();
  startScreenOpen = false;
  lastTickAt = Date.now();
  document.getElementById("start-screen")?.classList.add("hidden");
  document.body.classList.remove("start-screen-open");
  document.getElementById("start-screen")?.setAttribute("aria-hidden", "true");
  document.getElementById("modal-backdrop")?.classList.add("hidden");
  document.getElementById("comms-banner")?.classList.add("hidden");
  saveGame();
  render();
  toast("DEBUG OPERATION READY");
  playSound("unlock_notice", 0.2);
}

function handleStartTitleTap() {
  const now = Date.now();
  startTitleTapCount = now - startTitleTapAt > 1600 ? 1 : startTitleTapCount + 1;
  startTitleTapAt = now;
  if (startTitleTapCount < 5) return;
  startTitleTapCount = 0;
  startDebugGame();
}

const APPLE_TOUCH_ACTION_RESUME_BLOCK_MS = 1800;
let appleTouchActionBlockedUntil = 0;
let appleTouchActionGuardsBound = false;
let appleTouchGestureHadMultiplePoints = false;
let appleTouchIntentControl = null;
let appleTouchClickAllowedUntil = 0;

function armAppleTouchActionGuard(reason) {
  if (!APPLE_TOUCH_DEVICE) return;
  appleTouchIntentControl = null;
  appleTouchClickAllowedUntil = 0;
  appleTouchActionBlockedUntil = Math.max(appleTouchActionBlockedUntil, Date.now() + APPLE_TOUCH_ACTION_RESUME_BLOCK_MS);
  inputDiagnosticLog("touch-guard", reason);
}

function refreshAppleStartScreenSurface(options = {}) {
  if (!APPLE_TOUCH_DEVICE || !startScreenOpen) return;
  const { resetScroll = false } = options;
  window.requestAnimationFrame(() => {
    const screen = document.getElementById("start-screen");
    if (!screen || screen.classList.contains("hidden")) return;
    if (resetScroll) window.scrollTo(0, 0);
    screen.getBoundingClientRect();
  });
}

function blockAppleUnsafeStartClick(event) {
  if (!APPLE_TOUCH_DEVICE) return;
  const control = event.target?.closest?.("#start-screen button");
  if (!control) return;
  const now = Date.now();
  const hasTouchIntent = control === appleTouchIntentControl && now <= appleTouchClickAllowedUntil;
  const isKeyboardAction = event.detail === 0 && document.activeElement === control;
  const isMouseAction = event.pointerType === "mouse";
  appleTouchIntentControl = null;
  appleTouchClickAllowedUntil = 0;
  if (now >= appleTouchActionBlockedUntil || hasTouchIntent || isKeyboardAction || isMouseAction) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  inputDiagnosticLog("touch-skip", `guarded-click=${control.id || inputDiagnosticElementLabel(control)}`);
}

function noteAppleTouchMultiplicity(event) {
  if (!APPLE_TOUCH_DEVICE) return;
  const touchCount = event.touches?.length || 0;
  if (touchCount > 1) {
    appleTouchGestureHadMultiplePoints = true;
    armAppleTouchActionGuard("multi-touch");
    return;
  }
  if (event.type === "touchstart" && touchCount === 1 && !appleTouchGestureHadMultiplePoints) {
    appleTouchIntentControl = event.target?.closest?.("#start-screen button") || null;
    appleTouchClickAllowedUntil = 0;
  }
}

function finishAppleTouchGesture(event) {
  if (!APPLE_TOUCH_DEVICE || (event.touches?.length || 0) !== 0) return;
  if (!appleTouchGestureHadMultiplePoints && appleTouchIntentControl) {
    const endControl = event.target?.closest?.("#start-screen button") || null;
    if (endControl === appleTouchIntentControl) appleTouchClickAllowedUntil = Date.now() + 900;
    else appleTouchIntentControl = null;
  } else {
    appleTouchIntentControl = null;
    appleTouchClickAllowedUntil = 0;
  }
  if (appleTouchGestureHadMultiplePoints) {
    armAppleTouchActionGuard("multi-touch-end");
    refreshAppleStartScreenSurface({ resetScroll: true });
  }
  appleTouchGestureHadMultiplePoints = false;
}

function bindAppleTouchActionGuards() {
  if (!APPLE_TOUCH_DEVICE || appleTouchActionGuardsBound) return;
  appleTouchActionGuardsBound = true;
  window.addEventListener("pagehide", () => armAppleTouchActionGuard("pagehide"));
  window.addEventListener("pageshow", () => {
    armAppleTouchActionGuard("pageshow");
    refreshAppleStartScreenSurface({ resetScroll: true });
  });
  window.addEventListener("blur", () => armAppleTouchActionGuard("blur"));
  window.addEventListener("focus", () => {
    armAppleTouchActionGuard("focus");
    refreshAppleStartScreenSurface({ resetScroll: true });
  });
  window.addEventListener("orientationchange", () => {
    armAppleTouchActionGuard("orientationchange");
    refreshAppleStartScreenSurface({ resetScroll: true });
  });
  document.addEventListener("visibilitychange", () => {
    armAppleTouchActionGuard(`visibility=${document.visibilityState}`);
    if (document.visibilityState === "visible") refreshAppleStartScreenSurface({ resetScroll: true });
  });
  document.addEventListener("touchstart", noteAppleTouchMultiplicity, { capture: true, passive: true });
  document.addEventListener("touchmove", noteAppleTouchMultiplicity, { capture: true, passive: true });
  document.addEventListener("touchend", finishAppleTouchGesture, { capture: true, passive: true });
  document.addEventListener("touchcancel", (event) => {
    appleTouchGestureHadMultiplePoints = true;
    finishAppleTouchGesture(event);
  }, { capture: true, passive: true });
  ["gesturestart", "gesturechange", "gestureend"].forEach((type) => {
    document.addEventListener(type, () => {
      appleTouchGestureHadMultiplePoints = true;
      armAppleTouchActionGuard(type);
      if (type === "gestureend") {
        refreshAppleStartScreenSurface({ resetScroll: true });
        appleTouchGestureHadMultiplePoints = false;
      }
    }, { capture: true, passive: true });
  });
  document.addEventListener("click", blockAppleUnsafeStartClick, true);
}


function bindAppleTouchStartControls() {
  if (!APPLE_TOUCH_DEVICE) return;
  bindAppleTouchActionGuards();
  refreshAppleStartScreenSurface({ resetScroll: true });
}

function startNewGame(mode = "day45") {
  clearSessionInteractionState();
  facilityCameraViewSide = "front";
  state = createInitialState(mode);
  updateMarketForDay();
  clearStoryForTrigger("game_start");
  clearCommsForTrigger("game_start");
  startScreenOpen = false;
  lastTickAt = Date.now();
  document.getElementById("start-screen")?.classList.add("hidden");
  document.body.classList.remove("start-screen-open");
  document.getElementById("modal-backdrop").classList.add("hidden");
  document.getElementById("comms-banner")?.classList.add("hidden");
  document.getElementById("story-comms-overlay")?.classList.add("hidden");
  document.body.classList.remove("story-comms-active");
  document.getElementById("modal-close").hidden = false;
  document.getElementById("modal-close").style.display = "";
  saveGame();
  render();
  triggerComms("game_start");
}

function startDay30Game() {
  startNewGame("day45");
}

function startDay60Game() {
  startNewGame("day60");
}

function startFreeGame() {
  startNewGame("free");
}

function selectedStartModeLabel() {
  return playModeLabel(startModeView);
}

function setStartModeView(mode) {
  startModeView = validPlayMode(mode, "day45");
  safeStorageSet(START_MODE_PREF_KEY, startModeView);
  updateStartScreen();
}

function toggleStartModeView() {
  const index = START_MODE_SEQUENCE.indexOf(startModeView);
  setStartModeView(START_MODE_SEQUENCE[(index + 1) % START_MODE_SEQUENCE.length]);
  playSound("start_mode_toggle", 0.12);
}

function openStartScreen(options = {}) {
  endingRollPresentation.stop();
  resultPresentation.stop();
  const { persist = true } = options;
  document.body.classList.add("start-screen-open");
  startScreenOpen = true;
  pausedBeforeStartScreen = Boolean(state.paused);
  state.paused = true;
  clearDragState();
  clearEquipmentMenu();
  clearCleanToolDrag();
  removeUiGuideHighlights();
  resetOperationSurface({ resetAudio: true });
  document.getElementById("modal-backdrop")?.classList.add("hidden");
  document.getElementById("comms-banner")?.classList.add("hidden");
  document.getElementById("news-history-panel")?.classList.add("hidden");
  updateStartScreen();
  const screen = document.getElementById("start-screen");
  if (screen) {
    screen.classList.remove("start-activating");
    screen.classList.remove("hidden");
    screen.setAttribute("aria-hidden", "false");
  }
  refreshAppleStartScreenSurface({ resetScroll: true });
  if (persist) {
    state.paused = pausedBeforeStartScreen;
    saveGame();
    state.paused = true;
  }
}

function closeStartScreen() {
  startScreenOpen = false;
  document.body.classList.remove("start-screen-open");
  state.paused = pausedBeforeStartScreen;
  const screen = document.getElementById("start-screen");
  if (screen) {
    screen.classList.add("hidden");
    screen.setAttribute("aria-hidden", "true");
  }
  lastTickAt = Date.now();
  render();
  window.requestAnimationFrame(applyUiGuide);
  if (isFreshOperationState()) {
    clearStoryForTrigger("game_start");
    clearCommsForTrigger("game_start");
  }
  if (isFreshOperationState() || activeComms) triggerComms("game_start");
  if (!state.debugMode) updateProgressionUnlocks();
  triggerPendingRadarUnlockConversation();
}

function updateStartScreen() {
  const status = document.getElementById("start-status");
  const continueButton = document.getElementById("start-continue");
  const modeButton = document.getElementById("start-day30");
  const modeLabel = document.getElementById("start-mode-label");
  const recordsTitle = document.getElementById("start-records-title");
  if (!status || !continueButton) return;
  const hasProgress = hasStartProgress();
  const selectedConfig = playModeConfig(startModeView);
  const newButton = document.getElementById("start-new");
  const endingButton = document.getElementById("start-ending");
  continueButton.textContent = `${selectedConfig.label}で新規開始`;
  if (modeButton) {
    modeButton.hidden = true;
    modeButton.textContent = selectedConfig.label;
    modeButton.classList.toggle("free-mode", startModeView === "free");
    modeButton.classList.toggle("day60-mode", startModeView === "day60");
  }
  if (modeLabel) {
    modeLabel.textContent = `${selectedConfig.shortLabel} MODE`;
    modeLabel.dataset.mode = startModeView;
  }
  if (newButton) {
    newButton.hidden = !hasProgress;
    newButton.textContent = "続きから開始";
  }
  if (endingButton) endingButton.textContent = endingRollText("result_button_label", "\u30a8\u30f3\u30c7\u30a3\u30f3\u30b0\u3092\u898b\u308b");
  if (recordsTitle) recordsTitle.textContent = selectedConfig.recordsTitle;
  status.textContent = hasProgress
    ? `SAVE SIGNAL // ${PLAY_MODES[state.mode] ? playModeShortLabel(state.mode) : "NORMAL"} // DAY ${String(state.day).padStart(2, "0")} // C${formatNumber(state.money)}`
    : `NO SAVE SIGNAL // ${selectedConfig.shortLabel} READY`;
  renderDay30Records();
}
function renderDay30Records() {
  const list = document.getElementById("day30-record-list");
  const count = document.getElementById("day30-record-count");
  if (!list || !count) return;
  const records = readPlayRecords(startModeView);
  count.textContent = `${records.length} RUN${records.length === 1 ? "" : "S"}`;
  list.replaceChildren();
  if (!records.length) {
    const empty = document.createElement("p");
    empty.className = "day30-record-empty";
    empty.textContent = playModeConfig(startModeView).recordEmpty;
    list.appendChild(empty);
    return;
  }
  records.slice(0, 12).forEach((record) => {
    const item = document.createElement("article");
    item.className = "day30-record";

    const main = document.createElement("div");
    main.className = "day30-record-main";
    const score = document.createElement("strong");
    score.textContent = `₡${formatNumber(record.revenue || 0)}`;
    const label = document.createElement("span");
    const resultStatus = record.mode === "free" ? "終了" : record.completed ? "完走" : "途中終了";
    label.textContent = `${record.playerName || "未記名"} // ${playModeShortLabel(record.mode)} ${resultStatus} DAY ${record.day || 0} // ${new Date(record.recordedAt).toLocaleDateString("ja-JP")}`;
    main.append(score, label);

    const sub = document.createElement("div");
    sub.className = "day30-record-sub";
    const rankingScope = resultRankingStats(record).scopeLabel;
    [
      `最多作物(${rankingScope}) ${resultRankingCropText(record)}`,
      `市場(金・${rankingScope}) ${resultRankingMarketRevenueText(record)}`,
      `市場(量・${rankingScope}) ${resultRankingMarketQtyText(record)}`,
      `設備 ${record.equipmentCount || 0}`,
      `物件 ${record.propertyCount || 0}`
    ].forEach((textValue) => {
      const span = document.createElement("span");
      span.textContent = textValue;
      sub.appendChild(span);
    });

    const titles = document.createElement("div");
    titles.className = "day30-record-titles";
    (record.titles?.length ? record.titles : ["称号なし"]).forEach((title) => {
      const badge = document.createElement("span");
      badge.className = "day30-record-title";
      badge.textContent = title;
      titles.appendChild(badge);
    });

    item.append(main, sub, titles);
    list.appendChild(item);
  });
}

function openConfirmWidget({ kicker = "CONFIRM", title, copy, confirmText = "実行", onConfirm }) {
  pendingConfirmAction = onConfirm;
  pendingDangerAction = null;
  pendingExtraAction = null;
  document.getElementById("confirm-kicker").textContent = kicker;
  document.getElementById("confirm-title").textContent = title;
  document.getElementById("confirm-copy").textContent = copy;
  document.getElementById("confirm-ok").textContent = confirmText;
  const dangerButton = document.getElementById("confirm-danger");
  if (dangerButton) dangerButton.classList.add("hidden");
  const extraButton = document.getElementById("confirm-extra");
  if (extraButton) extraButton.classList.add("hidden");
  const widget = document.getElementById("confirm-widget");
  widget.classList.remove("hidden");
  widget.setAttribute("aria-hidden", "false");
}

function closeConfirmWidget() {
  pendingConfirmAction = null;
  pendingDangerAction = null;
  pendingExtraAction = null;
  document.getElementById("confirm-danger")?.classList.add("hidden");
  document.getElementById("confirm-extra")?.classList.add("hidden");
  const widget = document.getElementById("confirm-widget");
  widget.classList.add("hidden");
  widget.setAttribute("aria-hidden", "true");
}

function confirmWidgetAction() {
  const action = pendingConfirmAction;
  closeConfirmWidget();
  if (action) action();
}

function confirmWidgetDangerAction() {
  const action = pendingDangerAction;
  closeConfirmWidget();
  if (action) action();
}

function confirmWidgetExtraAction() {
  const action = pendingExtraAction;
  closeConfirmWidget();
  if (action) action();
}

function requestNewGame() {
  requestSelectedModeGame();
}

function requestTimedModeGame(mode = startModeView) {
  const config = playModeConfig(mode);
  openConfirmWidget({
    kicker: config.startKicker,
    title: config.startTitle,
    copy: config.startCopy,
    confirmText: config.startConfirm,
    onConfirm: () => startNewGame(config.key)
  });
}

function requestDay30Game() {
  requestTimedModeGame("day45");
}

function requestSelectedModeGame() {
  const config = playModeConfig(startModeView);
  if (startModeView === "free") {
    openConfirmWidget({
      kicker: config.startKicker,
      title: config.startTitle,
      copy: config.startCopy,
      confirmText: config.startConfirm,
      onConfirm: startFreeGame
    });
    return;
  }
  requestTimedModeGame(startModeView);
}
function playRecordsExportPayload() {
  return {
    app: "UNDERGREEN",
    exportedAt: new Date().toISOString(),
    records: {
      day45: readDay30Records(),
      day60: readDay60Records(),
      free: readFreeRecords()
    }
  };
}

function legacyCopyToClipboard(text) {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "0";
  field.style.top = "0";
  field.style.width = "1px";
  field.style.height = "1px";
  field.style.opacity = "0.01";
  field.style.zIndex = "9999";
  document.body.appendChild(field);
  field.focus({ preventScroll: true });
  field.select();
  field.setSelectionRange(0, field.value.length);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }
  field.remove();
  return copied;
}

function showRecordExportFallback(text) {
  showModal("RECORD EXPORT", "コピー用データ", `<p class="modal-copy">ブラウザがクリップボード更新を拒否しました。下のデータ欄を選択してコピーしてください。</p><textarea class="record-export-field" readonly>${escapeHtml(text)}</textarea>`, true);
  document.getElementById("modal-reset").style.display = "none";
  window.setTimeout(() => {
    const field = document.querySelector(".record-export-field");
    if (!field) return;
    field.focus({ preventScroll: true });
    field.select();
  }, 0);
}

async function copyPlayRecordsToClipboard() {
  const text = JSON.stringify(playRecordsExportPayload(), null, 2);
  if (legacyCopyToClipboard(text)) {
    toast("プレイレコードをクリップボードにコピーしました。");
    setStatus("Play records exported to clipboard.");
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else if (!legacyCopyToClipboard(text)) {
      showRecordExportFallback(text);
      return;
    }
    toast("プレイレコードをクリップボードにコピーしました。");
    setStatus("Play records exported to clipboard.");
  } catch (error) {
    console.warn("Record export failed", error);
    if (legacyCopyToClipboard(text)) {
      toast("プレイレコードをクリップボードにコピーしました。");
      setStatus("Play records exported to clipboard.");
      return;
    }
    showRecordExportFallback(text);
    toast("クリップボードへのコピーに失敗しました。");
    setStatus("Record export failed. Browser permission may be blocking clipboard access.");
  }
}

function clearPlayRecords() {
  saveDay30Records([]);
  saveDay60Records([]);
  saveFreeRecords([]);
  renderDay30Records();
  toast("この端末のプレイレコードを消去しました。");
  setStatus("Local play records cleared.");
}

function requestClearPlayRecords() {
  openConfirmWidget({
    kicker: "DELETE RECORDS",
    title: "記録消去",
    copy: "この端末に保存されているDAY45/DAY60/フリーモードのプレイレコードをすべて消去します。",
    confirmText: "消去",
    onConfirm: clearPlayRecords
  });
}

function requestRecordExport() {
  openConfirmWidget({
    kicker: "RECORD EXPORT",
    title: "記録書き出し",
    copy: "この端末に保存されているDAY45/DAY60/フリーモードのプレイレコードをコピー、または消去できます。",
    confirmText: "コピー",
    onConfirm: copyPlayRecordsToClipboard
  });
  pendingDangerAction = requestClearPlayRecords;
  const dangerButton = document.getElementById("confirm-danger");
  if (dangerButton) {
    dangerButton.textContent = "記録消去";
    dangerButton.classList.remove("hidden");
  }
  pendingExtraAction = openGoogleFormRecordExport;
  const extraButton = document.getElementById("confirm-extra");
  if (extraButton) {
    extraButton.textContent = "GOOGLE FORM";
    extraButton.classList.remove("hidden");
  }
}

function currentDay30PlayerName() {
  return document.getElementById("day30-player-name")?.value || "未記名";
}

function applyDay30PlayerName() {
  if (!pendingDay30RecordId) return;
  updateDay30RecordName(pendingDay30RecordId, currentDay30PlayerName());
  renderDay30Records();
}

function day30ResultToStart() {
  applyDay30PlayerName();
  openStartScreen();
}

function enterDay30ViewMode() {
  resultPresentation.stop();
  applyDay30PlayerName();
  startScreenOpen = false;
  document.body.classList.remove("start-screen-open");
  state.ended = true;
  state.paused = true;
  document.getElementById("modal-backdrop").classList.add("hidden");
  document.getElementById("modal-close").hidden = false;
  document.getElementById("modal-reset").style.display = "";
  setStatus(`${playModeLabel(state.mode)}閲覧モード。時計は停止しています。`);
  saveGame();
  render();
}

function requestExitToStart() {
  if (isTimedPlayMode(state.mode) && !state.day30Recorded && !state.ended) {
    const config = playModeConfig(state.mode);
    openConfirmWidget({
      kicker: `${config.shortLabel} RETIRE`,
      title: "途中終了しますか",
      copy: `現在のDAYまでの内容で${config.label}の記録を保存し、結果画面へ進みます。`,
      confirmText: "記録する",
      onConfirm: () => finalizeDay30Run({ completed: false, playedDays: state.day, mode: state.mode })
    });
    return;
  }
  if (state.mode === "free" && !state.day30Recorded && !state.ended) {
    openConfirmWidget({
      kicker: "FREE OPERATION CLOSE",
      title: "フリーモードを終了しますか",
      copy: "現在までの内容でプレイレコードを保存し、結果画面へ進みます。",
      confirmText: "記録する",
      onConfirm: () => finalizeDay30Run({ completed: false, playedDays: state.day, mode: "free" })
    });
    return;
  }
  openConfirmWidget({
    kicker: "CLOSE TERMINAL",
    title: "終了しますか",
    copy: "現在の状態を保存し、スタート画面へ戻ります。",
    confirmText: "終了",
    onConfirm: openStartScreen
  });
}
function renderHeader() {
  refreshSupportRobotTalkOpportunities();
  const resourceProduction = syncResourceCapacities();
  document.getElementById("day-value").textContent = String(state.day).padStart(2, "0");
  const modeLimit = playModeLimit(state.mode);
  document.getElementById("day-limit").textContent = state.mode === "free"
    ? " / FREE"
    : Number.isFinite(modeLimit) ? ` / ${playModeShortLabel(state.mode)}` : state.day > 30 ? " / inf" : " / 30";
  document.getElementById("money-value").textContent = formatNumber(state.money);
  document.getElementById("water-value").textContent = formatResource(Math.max(0, state.water));
  document.getElementById("water-capacity").textContent = ` / ${state.waterCapacity}`;
  document.getElementById("nutrient-value").textContent = formatResource(Math.max(0, state.nutrient));
  document.getElementById("nutrient-capacity").textContent = ` / ${state.nutrientCapacity}`;
  document.getElementById("upkeep-value").textContent = dailyUpkeep();
  document.getElementById("slot-value").textContent = totalGrowSlots();
  document.getElementById("news-text").textContent = state.news;
  const newsEffect = document.getElementById("news-effect");
  if (newsEffect) newsEffect.textContent = state.newsLabel;
  const status = document.getElementById("status-text");
  if (status) status.textContent = state.log;
  document.getElementById("day-progress-fill").style.width = state.timeUnlocked ? `${Math.min(100, state.dayProgress * 100)}%` : "0%";
  document.getElementById("time-remaining").textContent = state.timeUnlocked
    ? `${((1 - state.dayProgress) * REALTIME_DAY_MS / 1000).toFixed(1)} SEC`
    : "DAY HOLD";
  renderResourceAlert("water", state.water, resourceDemand().water, resourceProduction.production.water);
  renderResourceAlert("nutrient", state.nutrient, resourceDemand().nutrient, resourceProduction.production.nutrient);
  const radar = ensureRadarState();
  const suspicionCard = document.getElementById("radar-suspicion-card");
  const suspicionValue = document.getElementById("radar-suspicion-value");
  const suspicionLabel = document.getElementById("radar-suspicion-label");
  const suspicionFill = document.getElementById("radar-suspicion-fill");
  if (suspicionValue) suspicionValue.textContent = String(radar.suspicion);
  if (suspicionFill) suspicionFill.style.width = String(radar.suspicion) + "%";
  if (suspicionLabel) suspicionLabel.textContent = radar.suspicion >= 60 ? "HIGH" : radar.suspicion >= 25 ? "WATCH" : "CLEAR";
  if (suspicionCard) {
    suspicionCard.classList.toggle("radar-warning", radar.suspicion >= 25 && radar.suspicion < 60);
    suspicionCard.classList.toggle("radar-danger", radar.suspicion >= 60);
  }
  renderNewsHistory();
  updateFullscreenButton();
}

function newsHistoryTiming(entry) {
  const age = Math.max(0, (Number(state.day) || 1) - (Number(entry.day) || 1));
  const parts = [`DAY ${String(entry.day).padStart(2, "0")}`, age === 0 ? "今日" : `${age}日前`];
  if (entry.activeDay && state.day < entry.activeDay) {
    parts.push(`発効まで${entry.activeDay - state.day}日`);
  } else if (entry.endDay && state.day >= entry.activeDay && state.day < entry.endDay) {
    parts.push(`残り${entry.endDay - state.day}日`);
  } else if (entry.activeDay && state.day >= entry.endDay) {
    parts.push("終了済み");
  }
  return parts;
}

function newsHistoryKindLabel(kind) {
  if (kind === "forecast") return "重要予報";
  if (kind === "active") return "市場変動中";
  return "";
}

function renderNewsHistory() {
  const list = document.getElementById("news-history-list");
  if (!list) return;
  ensureMarketNewsState();
  list.replaceChildren();
  if (!state.newsHistory.length) {
    const empty = document.createElement("p");
    empty.className = "news-history-empty";
    empty.textContent = "まだ記録されたニュースはありません。";
    list.appendChild(empty);
    return;
  }
  state.newsHistory.forEach((entry) => {
    const item = document.createElement("article");
    item.className = `news-history-item ${entry.kind || "news"}`;

    const meta = document.createElement("div");
    meta.className = "news-history-meta";
    const kindText = newsHistoryKindLabel(entry.kind);
    if (kindText) {
      const kind = document.createElement("span");
      kind.className = `news-history-kind ${entry.kind || "news"}`;
      kind.textContent = kindText;
      meta.appendChild(kind);
    }

    const label = document.createElement("span");
    label.className = "news-history-label";
    label.textContent = entry.label || "LOWNET";
    meta.appendChild(label);
    newsHistoryTiming(entry).forEach((part) => {
      const span = document.createElement("span");
      span.textContent = part;
      meta.appendChild(span);
    });

    const textLine = document.createElement("p");
    textLine.textContent = entry.text || "";

    item.append(meta, textLine);
    list.appendChild(item);
  });
}

function openNewsHistory() {
  renderNewsHistory();
  const panel = document.getElementById("news-history-panel");
  if (!panel) return;
  panel.classList.remove("hidden");
  panel.setAttribute("aria-hidden", "false");
}

function closeNewsHistory() {
  const panel = document.getElementById("news-history-panel");
  if (!panel) return;
  panel.classList.add("hidden");
  panel.setAttribute("aria-hidden", "true");
}

function renderResourceAlert(type, amount, dailyDemand, productionPerDay = 0) {
  const card = document.getElementById(`${type}-card`);
  const label = document.getElementById(`${type}-alert`);
  const critical = amount <= 0.05;
  const warning = !critical && amount <= Math.max(2, dailyDemand * 3);
  const productionLabel = productionPerDay > 0 ? `+${formatResource(productionPerDay)}/D` : "";
  card.classList.toggle("critical", critical);
  card.classList.toggle("warning", warning);
  label.textContent = [critical ? "EMPTY" : warning ? "LOW" : "", productionLabel].filter(Boolean).join(" ");
}

function renderFarm() {
  const base = currentBase();
  clearFarmRenderRequest(base);
  const shelves = currentShelves();
  const floorDevices = currentFloorDevices();
  const placementItem = selectedPlacementItem();
  const baseTabs = ownedBases().map((entry, index) => {
    const planted = entry.shelves.reduce((sum, unit) => sum + unit.slots.filter(Boolean).length, 0);
    return `<button class="base-switch ${entry.id === base.id ? "active" : ""}" data-select-base="${entry.id}">
      <span>BASE ${index + 1}</span><strong>${entry.name}</strong><small>${entry.cols} x ${entry.rows} / ${planted}株</small>
    </button>`;
  }).join("");
  document.getElementById("base-banner").style.backgroundImage = `linear-gradient(90deg, rgba(3, 10, 8, .94), rgba(3, 10, 8, .28)), url("${base.image}")`;
  document.getElementById("base-banner").innerHTML = `
    <div><p class="eyebrow">${base.code} // BASE ${ownedBases().findIndex((entry) => entry.id === base.id) + 1}/${ownedBases().length}</p><h3>${base.name}</h3>${tagMarkup(base.tags, BASE_TAGS)}</div>
    <strong>${base.cols} x ${base.rows}<small>${base.cols * base.rows} GRID CELLS</small></strong>
    <div class="base-switcher">${baseTabs}</div>`;

  const dirtyCount = [...shelves, ...floorDevices].filter(needsCleaning).length;
  const cameraReverse = isFacilityCameraReversed();
  const cameraControl = `<button type="button" class="facility-camera-button ${cameraReverse ? "active" : ""}" data-view-camera aria-pressed="${cameraReverse ? "true" : "false"}" title="${cameraReverse ? "正面側の視点に戻す" : "栽培区画を反対側から見る"}">
    <span class="facility-camera-icon" aria-hidden="true">↻</span>
    <span class="facility-camera-copy"><strong>視点切替</strong><small>${cameraReverse ? "正面へ // VIEW A" : "反対側へ // VIEW B"}</small></span>
  </button>`;
  const placementStatus = placementItem
    ? `<span class="placement-active">配置中 // ${placementItem.kind === "unit" ? GROW_UNITS[placementItem.type].name : FLOOR_DEVICES[placementItem.type].name}</span><div class="placement-tools"><small>空いているマスに置いてください</small><button type="button" data-cancel-placement>キャンセル</button></div>`
    : `<span class="facility-toolbar-status">${dirtyCount ? `<b class="clean-alert">清掃 ${dirtyCount}</b>` : ""}</span>`;
  document.getElementById("facility-grid-toolbar").innerHTML = `${placementStatus}${cameraControl}`;

  const coverageDevices = floorDevices.map((device) => {
    const definition = FLOOR_DEVICES[device.type];
    const radius = device.type === "support_robot" ? supportRobotRange(device) : Number(definition?.radius) || 0;
    const center = itemGridCenter(device, "device");
    return { ...device, coverageRadius: radius, coverageX: center.x, coverageY: center.y };
  }).filter((device) => device.placed && device.coverageRadius > 0);
  const cellMarkup = Array.from({ length: base.cols * base.rows }, (_, index) => {
    const x = index % base.cols;
    const y = Math.floor(index / base.cols);
    const blocked = isBlockedCell(base, x, y);
    const coverageTypes = coverageDevices
      .filter((device) => isWithinGridRange(x, y, device.coverageX, device.coverageY, device.coverageRadius))
      .map((device) => device.type);
    const coverageClass = !blocked && coverageTypes.length
      ? ["covered", ...new Set(coverageTypes.map((type) => `covered-${type}`))].join(" ")
      : "";
    const placeable = !blocked && placementItem && canPlace(placementItem, x, y, placementItem.id);
    return `<button class="facility-cell ${blocked ? "blocked-cell" : ""} ${coverageClass} ${placeable ? "placeable" : ""}"
      style="grid-column:${x + 1};grid-row:${y + 1}" data-grid-x="${x}" data-grid-y="${y}" aria-label="${blocked ? "Blocked cell" : "Grid cell"} ${x + 1}, ${y + 1}" ${blocked ? "disabled" : ""}></button>`;
  }).join("");

  const placedUnits = shelves.filter((unit) => unit.placed).map((unit) => {
    const shelfIndex = shelves.findIndex((entry) => entry.id === unit.id);
    const definition = GROW_UNITS[unit.type];
    const occupied = unit.slots.filter(Boolean).length;
    const running = occupied > 0;
    const usesSlotWidget = Boolean(GROW_UNIT_SLOT_LAYOUTS[unit.type]?.length);
    const sprite = usesSlotWidget ? (definition.emptySprite || definition.sprite) : unitSprite(unit, definition);
    const spriteCrop = unitPrimaryCrop(unit);
    const plantSlots = renderUnitPlantSlots(unit, shelfIndex);
    const ready = unit.slots.some((plant) => plant?.ready);
    const sRankReady = unit.slots.some((plant) => plant?.ready && plant.quality === "S");
    return `<button class="facility-item grow-item type-${unit.type} ${usesSlotWidget ? "unit-widget" : ""} ${running ? "unit-running" : "unit-idle"} ${plantStageClass(unit)} ${ready ? "harvest-glow" : ""} ${sRankReady ? "s-rank-ready" : ""} ${needsCleaning(unit) ? "needs-cleaning" : ""} ${selectedUnitId === unit.id ? "selected" : ""}" aria-label="${definition.name} ${occupied}/${definition.slots}株 ${running ? "稼働中" : "停止中"}"
      style="grid-column:${unit.x + 1}/span ${definition.width};grid-row:${unit.y + 1}/span ${definition.height};z-index:${20 + unit.y}"
      data-select-unit="${unit.id}" data-drag-kind="unit" data-drag-id="${unit.id}" data-sprite-crop="${spriteCrop}">
      <span class="facility-facing-layer"><img class="equipment-sprite growth-stage-sprite ${usesSlotWidget ? "widget-body-sprite" : ""}" src="${sprite}" alt="" draggable="false">${plantSlots}</span><span class="unit-aura"></span>${sRankReady ? `<span class="unit-rank-badge">S</span>` : ""}<span class="item-label"><strong>${definition.name}</strong><small>${occupied}/${definition.slots} plants</small></span>
    </button>`;
  }).join("");

  const placedDevices = floorDevices.filter((device) => device.placed).map((device) => {
    const definition = FLOOR_DEVICES[device.type];
    const deviceLabel = device.type === "light" ? "LED" : device.type === "fan" ? "FAN" : definition.code || definition.name;
    const productionResource = ["water", "nutrient"].includes(definition.productionResource) ? definition.productionResource : "";
    const storedProduction = productionResource ? storedResourceAmount(device) : 0;
    const productionVisual = productionResource ? currentResourceProductionEffect(device.id) : null;
    const productionCode = productionResource === "water" ? "WATER" : "NUTRIENT";
    const productionIcon = productionResource
      ? EQUIPMENT[productionResource]?.icon || `assets/icons/${productionResource}.webp`
      : "";
    const productionParticles = productionResource
      ? Array.from({ length: isLowSpecMode() ? 6 : 15 }, (_, index) => {
          const start = -38 + (index % 8) * 11;
          const end = -46 + ((index * 17) % 94);
          const scale = 0.58 + (index % 5) * 0.14;
          const drift = -12 + (index % 4) * 8;
          return `<span class="resource-production-particle" style="--particle-start:${start}px;--particle-end:${end}px;--particle-delay:${index * 58}ms;--particle-scale:${scale};--particle-drift:${drift}px"></span>`;
        }).join("")
      : "";
    const productionEffect = productionResource
      ? `<span class="resource-production-fx resource-production-${productionResource}" aria-hidden="true">
          <span class="resource-production-flash"></span>
          <span class="resource-production-column"></span>
          <span class="resource-production-scan"></span>
          <span class="resource-production-halo halo-one"></span>
          <span class="resource-production-halo halo-two"></span>
          <span class="resource-production-halo halo-three"></span>
          ${productionParticles}
          <span class="resource-production-label"><img src="${productionIcon}" alt=""><span><small>PRODUCTION COMPLETE</small><strong>${productionVisual ? `${productionCode} +${formatResource(productionVisual.actual)}` : productionCode + " READY"}</strong></span></span>
        </span>`
      : "";
    const resourceReadyBubble = storedProduction > 0
      ? `<span class="resource-ready-bubble resource-ready-${productionResource}" data-resource-ready="${productionResource}" aria-hidden="true" title="${resourceDisplayName(productionResource)}を${formatResource(storedProduction)}回収"><img src="${EQUIPMENT[productionResource]?.icon || `assets/icons/${productionResource}.webp`}" alt=""><strong>${formatResource(storedProduction)}</strong></span>`
      : "";
    const talkEntry = device.type === "support_robot" ? supportRobotTalkForRobot(device.id) : null;
    const talkLabel = talkEntry
      ? supportRobotDisplayName(device) + "と話す：" + (talkEntry.rule.markerLabel || "会話があります")
      : "";
    const talkMarker = talkEntry
      ? '<span class="support-robot-talk-marker" data-support-robot-talk="' + escapeHtml(device.id) + '" aria-hidden="true" title="' + escapeHtml(talkLabel) + '"><span class="support-robot-talk-glyph">?</span></span>'
      : "";
    const recoveryMode = device.type === "support_robot" ? supportRobotRecoveryMode(device) : "";
    const recoveryLabel = recoveryMode === "forced" ? "休養中" : recoveryMode === "charge" ? "充電休憩中" : "";
    const recoveryMarker = recoveryMode
      ? `<span class="support-robot-rest-marker ${recoveryMode === "forced" ? "forced-rest" : "charge-break"}" role="img" aria-label="${recoveryLabel}" title="${recoveryLabel}"><span aria-hidden="true">${recoveryMode === "forced" ? "Z" : "⚡"}</span></span>`
      : "";
    return `<button class="facility-item floor-device device-${device.type} device-running ${needsCleaning(device) ? "needs-cleaning" : ""} ${selectedDeviceId === device.id ? "selected" : ""} ${storedProduction > 0 ? "resource-ready" : ""} ${talkEntry ? "has-robot-talk" : ""}"
      aria-label="${definition.name}${storedProduction > 0 ? `、${resourceDisplayName(productionResource)}${formatResource(storedProduction)}回収可能` : ""}" style="grid-column:${device.x + 1};grid-row:${device.y + 1};z-index:${20 + device.y}" data-select-device="${device.id}" data-drag-kind="device" data-drag-id="${device.id}">
      <span class="facility-facing-layer"><img class="equipment-sprite" src="${freshCharacterAssetUrl(definition.sprite)}" alt="" draggable="false"></span><span class="device-field"></span>${productionEffect}${resourceReadyBubble}${talkMarker}${recoveryMarker}<span class="item-label">${deviceLabel}</span>
    </button>`;
  }).join("");

  const cleanMarkers = [
    ...shelves.filter((unit) => unit.placed && needsCleaning(unit)).map((unit) => ({ kind: "unit", type: unit.type, id: unit.id })),
    ...floorDevices.filter((device) => device.placed && needsCleaning(device)).map((device) => ({ kind: "device", type: device.type, id: device.id }))
  ].map((marker) => `<span class="clean-marker clean-marker-${marker.kind} clean-marker-${marker.type}" data-clean-marker-kind="${marker.kind}" data-clean-marker-id="${marker.id}">清掃</span>`).join("");
  const grid = document.getElementById("facility-grid");
  const gridShell = document.querySelector(".facility-grid-shell");
  const metrics = isoGridMetrics(base);
  const cameraTurning = gridShell.classList.contains("camera-turning");
  gridShell.className = `facility-grid-shell ${base.rows <= 3 ? "compact-grid" : ""} ${placementItem ? "equipment-placement-mode" : ""} ${facilityMoodClasses(base)}`.trim();
  gridShell.classList.toggle("camera-reverse", cameraReverse);
  if (cameraTurning) gridShell.classList.add("camera-turning");
  grid.classList.toggle("camera-reverse", cameraReverse);
  const cameraTransitionLabel = gridShell.querySelector("[data-camera-transition-label]");
  if (cameraTransitionLabel) cameraTransitionLabel.textContent = cameraReverse ? "VIEW B // REVERSE" : "VIEW A // FRONT";
  grid.style.setProperty("--iso-width", `${metrics.width}px`);
  grid.style.setProperty("--iso-height", `${metrics.height}px`);
  grid.style.setProperty("--tile-w", `${ISO_TILE_WIDTH}px`);
  grid.style.setProperty("--tile-h", `${ISO_TILE_HEIGHT}px`);
  grid.style.setProperty("--grid-cols", base.cols);
  grid.style.setProperty("--grid-rows", base.rows);
  applyFacilityView();
  const gridMarkup = cellMarkup + placedUnits + placedDevices + cleanMarkers;
  const markupChanged = grid.dataset.renderedBaseId !== base.id || farmGridMarkupCache.get(base.id) !== gridMarkup;
  if (markupChanged) {
    grid.innerHTML = gridMarkup;
    grid.dataset.renderedBaseId = base.id;
    farmGridMarkupCache.set(base.id, gridMarkup);
  }

  const cameraSide = facilityCameraSide();
  const cameraChanged = grid.dataset.cameraSide !== cameraSide;
  if (markupChanged || cameraChanged) {
    grid.querySelectorAll(".facility-cell").forEach((cell) => {
      const x = Number(cell.dataset.gridX);
      const y = Number(cell.dataset.gridY);
      const displayCell = facilityCameraCell(x, y, base);
      const pos = gridToIso(displayCell.x, displayCell.y, base);
      cell.style.left = `${pos.x}px`;
      cell.style.top = `${pos.y}px`;
    });
    grid.querySelectorAll("[data-select-unit]").forEach((element) => {
      const unit = shelves.find((entry) => entry.id === element.dataset.selectUnit);
      if (!unit) return;
      const definition = GROW_UNITS[unit.type];
      const pos = equipmentIsoPosition(unit, "unit", base);
      element.style.left = `${pos.x}px`;
      element.style.top = `${pos.y}px`;
      element.style.setProperty("--footprint-w", definition.width);
      element.style.setProperty("--footprint-h", definition.height);
      element.style.zIndex = String(100 + equipmentVisualDepth(unit, "unit", base));
    });
    grid.querySelectorAll("[data-select-device]").forEach((element) => {
      const device = floorDevices.find((entry) => entry.id === element.dataset.selectDevice);
      if (!device) return;
      const pos = equipmentIsoPosition(device, "device", base);
      element.style.left = `${pos.x}px`;
      element.style.top = `${pos.y}px`;
      element.style.setProperty("--footprint-w", pos.size.width);
      element.style.setProperty("--footprint-h", pos.size.height);
      element.style.zIndex = String(100 + equipmentVisualDepth(device, "device", base));
    });
    grid.querySelectorAll("[data-clean-marker-kind][data-clean-marker-id]").forEach((element) => {
      const kind = element.dataset.cleanMarkerKind;
      const collection = kind === "unit" ? shelves : floorDevices;
      const item = collection.find((entry) => entry.id === element.dataset.cleanMarkerId);
      if (!item) return;
      const pos = equipmentIsoPosition(item, kind, base);
      element.style.left = `${pos.x}px`;
      element.style.top = `${pos.y}px`;
    });
  }
  restoreActiveResourceProductionEffects(base.id);
  grid.dataset.cameraSide = cameraSide;
  const detailPanel = document.getElementById("selected-unit-panel");
  if (detailPanel) detailPanel.innerHTML = "";
const unplaced = sharedStockItems();
  document.getElementById("placement-palette").innerHTML = unplaced.length ? unplaced.map(({ item: stockItem, kind, base: stockBase }) => {
    const item = { ...stockItem, kind };
    const definition = kind === "unit" ? GROW_UNITS[item.type] : FLOOR_DEVICES[item.type];
    const active = placementSelection && placementSelection.id === item.id;
    const compatible = true;
    const dragAttributes = `data-place-kind="${kind}" data-place-id="${item.id}" data-drag-kind="${kind}" data-drag-id="${item.id}" data-guide-target="place-${item.type}"`;
    const stockLabel = stockBase.id === base.id ? "CURRENT BASE" : `STOCK // ${stockBase.name}`;
    const sellButton = canSellEquipment(kind, item) ? `<button class="stock-sell-button" data-sell-stock-kind="${item.kind}" data-sell-stock-id="${item.id}">売却</button>` : "";
    return `<div class="placement-stock-row">
      <button class="placement-stock stock-${item.type} ${active ? "active" : ""}" title="${stockLabel}" ${dragAttributes}>
        <img src="${definition.emptySprite || definition.sprite || definition.icon}" alt=""><span><strong>${definition.name}</strong><small>${definition.width} x ${definition.height}マス${compatible ? "" : " / 非対応"}</small>${tagMarkup(item.tags, EQUIPMENT_TAGS)}</span>
      </button>
      ${sellButton}
    </div>`;
  }).join("") : `<p class="palette-empty">未配置の設備はありません</p>`;

  document.getElementById("seed-selector").innerHTML = Object.entries(CROPS).filter(([, crop]) =>
    state.marketUnlocked[crop.unlock]
  ).map(([cropId, crop]) => `
    <button class="seed-option ${selectedSeed === cropId ? "active" : ""}" data-seed="${cropId}" data-drag-crop="${cropId}" data-guide-target="seed-${cropId}" ${state.seeds[cropId] <= 0 ? "disabled" : ""} style="--crop-color:${crop.color}">
      <span class="seed-glyph"><img src="${crop.icon}" alt=""></span>
      <span><strong>${crop.name}</strong><small>成長 ${crop.days}日</small></span>
      <b>x${state.seeds[cropId]}</b>
    </button>
  `).join("");

  const demand = resourceDemand();
  const visiblePlants = currentActivePlants();
  const ready = visiblePlants.filter(({ plant }) => plant.ready).length;
  const dead = visiblePlants.filter(({ plant }) => plant.dead).length;
  const growing = visiblePlants.length - ready - dead;
  const carePending = visiblePlants.filter(({ plant }) => plantCareStatus(plant).pending.length > 0).length;
  const waterDemandEl = document.getElementById("water-demand");
  if (waterDemandEl) waterDemandEl.textContent = `${formatResource(demand.water)} / DAY`;
  const nutrientDemandEl = document.getElementById("nutrient-demand");
  if (nutrientDemandEl) nutrientDemandEl.textContent = `${formatResource(demand.nutrient)} / DAY`;
  const unitCountEl = document.getElementById("unit-count");
  if (unitCountEl) unitCountEl.textContent = `${shelves.length} / ${allShelves().length} UNIT`;
  const continuousCountEl = document.getElementById("continuous-count");
  if (continuousCountEl) continuousCountEl.textContent = `${allShelves().filter((unit) => GROW_UNITS[unit.type]?.continuous).length} UNIT`;
  document.getElementById("farm-summary").innerHTML = `<span>生育中</span><strong>${growing}</strong><span>収穫可能</span><strong>${ready}</strong>${carePending ? `<span>手入れ待ち</span><strong class="care-summary-count">${carePending}</strong>` : ""}${dead ? `<span>枯死</span><strong class="danger-text">${dead}</strong>` : ""}`;
  applyUiGuide();
  activateQueuedResourceProductionEffects(base.id);
}

function renderSlot(plant, shelfIndex, slotIndex) {
  if (!plant) {
    return `<button class="slot empty" data-shelf="${shelfIndex}" data-slot="${slotIndex}">
      <span><span class="empty-plus">+</span><span class="empty-label">EMPTY SLOT</span></span>
    </button>`;
  }

  const crop = CROPS[plant.crop];
  if (plant.dead) {
    return `<button class="slot dead" data-shelf="${shelfIndex}" data-slot="${slotIndex}" style="--crop-color:#76656a">
      <span class="plant-visual"><img src="${crop.icon}" alt=""></span>
      <strong class="crop-name">${crop.name}</strong>
      <span class="slot-meta"><span>WITHERED</span><span>撤去待ち</span></span>
      <span class="dead-badge">枯死 // クリックで撤去</span>
    </button>`;
  }
  const progress = Math.min(100, Math.round((plant.growth / crop.days) * 100));
  const remaining = Math.max(0, crop.days - plant.growth);
  const qualityText = plant.ready ? `Q-${plant.quality}` : estimateQuality(plant);
  const careStatus = plantCareStatus(plant);
  const carePending = careStatus.pending.length > 0;
  const careBadge = careStatus.total
    ? `<span class="care-progress-badge ${carePending ? "pending" : ""}">${carePending ? "育成管理 対応可" : "育成管理"} // ${careStatus.completedCount}/${careStatus.total}</span>`
    : "";
  let badge = "";
  if (plant.degraded) badge = `<span class="degraded-badge">DEGRADED // 収穫</span>`;
  else if (plant.ready) badge = `<span class="ready-badge">HARVEST READY</span>`;

  return `<button class="slot" data-shelf="${shelfIndex}" data-slot="${slotIndex}" style="--crop-color:${crop.color}">
    <span class="plant-visual"><img src="${crop.icon}" alt=""></span>
    <strong class="crop-name">${crop.name}</strong>
    <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
    <span class="slot-meta"><span>${plant.ready ? "READY" : `残り ${remaining.toFixed(1)}日`}</span><span>${qualityText}</span></span>
    ${careBadge}
    ${badge}
  </button>`;
}

function estimateQuality(plant) {
  if (plant.waterShortage && plant.nutrientShortage) return "予測 C";
  if (plant.waterShortage || plant.nutrientShortage) return "予測 C-B";
  return "予測 B-S";
}

function marketIds() {
  return Object.keys(MARKETS);
}

function availableMarketIds() {
  return marketIds().filter(isMarketAvailable);
}

function cycleMarket(direction = 1) {
  const available = availableMarketIds();
  if (!available.length) return;
  const currentIndex = Math.max(0, available.indexOf(selectedMarket));
  selectedMarket = available[(currentIndex + direction + available.length) % available.length];
  markMarketViewed(selectedMarket);
  playSound("market_select", 0.2);
  hapticFeedback(8);
  renderMarkets(direction > 0 ? "next" : "prev");
}

function marketCarouselPosition(marketId) {
  const ids = marketIds();
  const selectedIndex = Math.max(0, ids.indexOf(selectedMarket));
  const index = ids.indexOf(marketId);
  const count = ids.length;
  let offset = index - selectedIndex;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  if (offset === 0) return "center";
  if (offset === -1 || offset === count - 1) return "left";
  if (offset === 1 || offset === 1 - count) return "right";
  return offset < 0 ? "far-left" : "far-right";
}

function renderMarkets(direction = "") {
  const selector = document.getElementById("market-selector");
  if (selector) {
    selector.className = ("market-selector market-carousel " + (direction ? "slide-" + direction : "")).trim();
    if (direction) window.setTimeout(() => selector.classList.remove("slide-" + direction), 360);
  }
  document.getElementById("market-selector").innerHTML = `
    <button class="market-cycle-button cycle-prev" data-market-cycle="-1" aria-label="Previous market">&lsaquo;</button>
    <div class="market-carousel-stage">
      ${Object.entries(MARKETS).map(([marketId, market]) => {
        const available = isMarketAvailable(marketId);
        const position = marketCarouselPosition(marketId);
        const unseen = available && !hasViewedMarket(marketId);
        return `<button class="market-card carousel-market ${position} ${selectedMarket === marketId ? "active" : ""} ${available ? "" : "locked"} ${unseen ? "has-unseen-entry" : ""}" data-market="${marketId}" ${available ? "" : "disabled"} aria-label="${escapeHtml(market.name)}${unseen ? "（未確認）" : ""}">
          ${unseen ? unseenEntryBadge() : ""}
          <img class="market-portrait" src="${market.portrait}" alt="${market.contact}">
          <span class="market-copy">
            <span class="market-contact">${market.contact}</span>
            <strong>${market.name}</strong>
            <small>${market.description}</small>
            <span class="market-risk">${available
              ? `Permanent trade // total C${formatNumber(state.tradeStats.byMarket[marketId])}`
              : `LOCKED // ${market.unlockHint}`}</span>
          </span>
        </button>`;
      }).join("")}
    </div>
    <button class="market-cycle-button cycle-next" data-market-cycle="1" aria-label="Next market">&rsaquo;</button>
  `;

  const shortcuts = document.getElementById("market-shortcuts");
  if (shortcuts) {
    shortcuts.innerHTML = Object.entries(MARKETS).map(([marketId, market]) => {
      const available = isMarketAvailable(marketId);
      const active = selectedMarket === marketId;
      const unseen = available && !hasViewedMarket(marketId);
      return `<button class="market-shortcut ${active ? "active" : ""} ${available ? "" : "locked"} ${unseen ? "has-unseen-entry" : ""}" data-market="${marketId}" type="button" ${available ? "" : "disabled"} aria-current="${active ? "true" : "false"}" aria-label="${escapeHtml(market.name)}${unseen ? "（未確認）" : ""}">
        ${unseen ? unseenEntryBadge() : ""}
        <img src="${market.portrait}" alt="" loading="lazy" decoding="async">
        <span><strong>${market.name}</strong>${available ? "" : "<small>ROUTE LOCKED</small>"}</span>
      </button>`;
    }).join("");
  }

  const signalProfile = MARKET_SIGNALS[selectedMarket];
  const signals = state.marketSignals?.[selectedMarket] || {};
  document.getElementById("market-signal-row").innerHTML = signalProfile ? [signalProfile.axisA, signalProfile.axisB].map((axis, index) => {
    const label = index === 0 ? signalProfile.axisALabel : signalProfile.axisBLabel;
    const description = index === 0 ? signalProfile.axisADescription : signalProfile.axisBDescription;
    const value = marketSignalValue(selectedMarket, axis);
    return `<div class="market-signal">
      <span>${label}</span>
      <strong>${Math.round(value * 100)}%</strong>
      <i style="--signal:${Math.round(value * 100)}%"></i>
      <small>${description}</small>
    </div>`;
  }).join("") : "";

  document.getElementById("price-grid").innerHTML = Object.entries(CROPS).filter(([cropId]) =>
    canMarketAcceptCrop(cropId, selectedMarket)
  ).map(([cropId, crop]) => {
    const fluctuation = state.marketFluctuation[cropId];
    const demand = cropDemandMultiplier(cropId, selectedMarket);
    const scheduleBoost = scheduleCropEventMultiplier(cropId, selectedMarket);
    const totalTrend = fluctuation * demand * scheduleBoost * cropEventMultiplier(cropId);
    const delta = Math.round((totalTrend - 1) * 100);
    const trendClass = delta > 0 ? "up" : delta < 0 ? "down" : "";
    return `<div class="price-cell" style="--crop-color:${crop.color}">
      <header><img src="${crop.icon}" alt=""><strong>${crop.name}</strong></header>
      <span class="quote">C${formatNumber(getQuote(cropId))}</span>
      <span class="trend ${trendClass}">${delta >= 0 ? "UP" : "DOWN"} ${Math.abs(delta)}% TODAY</span>
      <span class="demand-note">${cropDemandNote(cropId, selectedMarket)}</span>
    </div>`;
  }).join("");

  renderInventory();
}

function updateInventorySummary() {
  const summary = document.getElementById("inventory-summary");
  if (!summary) return;
  const count = state.inventory.reduce((sum, batch) => sum + Math.max(0, Number(batch.qty) || 0), 0);
  summary.innerHTML = `
    <span>在庫 ${count} / 累計販売 ${state.tradeStats.unitsSold}</span>
    <strong>₡${formatNumber(state.tradeStats.revenue)} VOLUME</strong>`;
}

function updateSellAllButton(quote = inventorySaleQuote(selectedMarket)) {
  const button = document.getElementById("sell-all-button");
  if (!button) return;
  const hasStock = quote.items.length > 0;
  const label = button.querySelector("[data-sell-all-label]");
  const value = button.querySelector("[data-sell-all-value]");
  button.disabled = !hasStock;
  button.classList.toggle("has-stock", hasStock);
  if (label) label.textContent = hasStock ? `${quote.qty}個を一括売却` : "一括売却";
  if (value) value.textContent = hasStock ? `₡${formatNumber(quote.revenue)} SELL ALL` : "NO STOCK";
  button.setAttribute("aria-label", hasStock
    ? `${MARKETS[quote.marketId]?.name || quote.marketId}で${quote.qty}個を一括売却、売却額₡${formatNumber(quote.revenue)}`
    : "この市場で一括売却できる在庫はありません");
}

function inventoryRenderSignature() {
  refreshInventoryAges();
  const rows = state.inventory.map((batch) => {
    const accepted = canSellCropToMarket(batch.crop, selectedMarket);
    const unitPrice = accepted ? getUnitPrice(batch, selectedMarket) : 0;
    return [
      batch.id,
      batch.crop,
      Number(batch.qty) || 0,
      batch.quality,
      inventoryAgeDays(batch),
      isInventoryBatchDegraded(batch) ? 1 : 0,
      accepted ? 1 : 0,
      unitPrice,
      saleQuantities[batch.id] || 1
    ].join(":");
  });
  return `${selectedMarket}|${rows.join("|")}`;
}

function renderInventory() {
  refreshInventoryAges();
  const inventoryList = document.getElementById("inventory-list");
  if (!inventoryList) return;
  updateInventorySummary();
  updateSellAllButton();
  const signature = inventoryRenderSignature();
  if (signature === lastInventoryRenderSignature && inventoryList.childElementCount) return;
  lastInventoryRenderSignature = signature;

  if (!state.inventory.length) {
    inventoryList.innerHTML = `<div class="inventory-empty">NO HARVEST STOCK // 収穫物はまだありません</div>`;
    return;
  }

  inventoryList.innerHTML = state.inventory.map((batch) => {
    const crop = CROPS[batch.crop];
    const batchQty = Math.max(0, Number(batch.qty) || 0);
    const qty = Math.max(1, Math.min(batchQty, saleQuantities[batch.id] || 1));
    const accepted = canSellCropToMarket(batch.crop, selectedMarket);
    const batchAge = inventoryAgeDays(batch);
    const degraded = isInventoryBatchDegraded(batch);
    const unitPrice = accepted ? getUnitPrice(batch) : 0;
    return `<div class="inventory-row" data-inventory-id="${batch.id}" style="--crop-color:${crop.color};--quality-color:${QUALITY[batch.quality].color}">
      <div class="inventory-crop">
        <span class="crop-glyph"><img src="${crop.icon}" alt=""></span>
        <span><strong>${crop.name} x${batchQty}</strong><small>${degraded ? "劣化品 / 売値50%" : "FRESH HARVEST"}</small></span>
      </div>
      <div class="quality-cell"><span class="quality-badge">${batch.quality}</span></div>
      <div class="age-cell"><span class="inventory-label">AGE</span><br><strong>${batchAge} DAY</strong></div>
      <div class="unit-price-cell"><span class="inventory-label">UNIT</span><br><strong>${accepted ? `₡${formatNumber(unitPrice)}` : "--"}</strong></div>
      <div class="qty-control">
        <button type="button" data-qty-id="${batch.id}" data-delta="-1" ${qty <= 1 ? "disabled" : ""}>-</button>
        <span>${qty}</span>
        <button type="button" data-qty-id="${batch.id}" data-delta="1" ${qty >= batchQty ? "disabled" : ""}>+</button>
      </div>
      <button type="button" class="sell-button" data-sell-id="${batch.id}" data-guide-target="sell-${batch.crop}" ${accepted ? "" : "disabled"}>${accepted ? `C${formatNumber(unitPrice * qty)} SELL` : "NOT ACCEPTED"}</button>
    </div>`;
  }).join("");
  applyUiGuide();
}

function shopCategoryCount(category) {
  if (category.kind === "seeds") {
    const total = Object.keys(CROPS).length;
    const available = Object.keys(CROPS).filter((cropId) => isUnlocked("seed_item", cropId)).length;
    return `${available}/${total}`;
  }
  const ids = (category.items || []).filter((itemId) => EQUIPMENT[itemId]);
  const available = ids.filter((itemId) => isUnlocked("shop_item", itemId)).length;
  return `${available}/${ids.length}`;
}

function shopCategoryIds() {
  return Object.keys(SHOP_CATEGORIES);
}

function isShopCategoryAvailable(categoryId) {
  return categoryId !== "automation" || Boolean(state.automationTabUnlocked);
}

function selectableShopCategoryIds() {
  return shopCategoryIds().filter((categoryId) => isShopCategoryAvailable(categoryId));
}

function shopCategoryCycleDirection(targetCategoryId) {
  const ids = shopCategoryIds();
  const currentIndex = Math.max(0, ids.indexOf(selectedShopCategory));
  const targetIndex = ids.indexOf(targetCategoryId);
  if (targetIndex < 0 || targetIndex === currentIndex) return "";
  const forward = (targetIndex - currentIndex + ids.length) % ids.length;
  const backward = (currentIndex - targetIndex + ids.length) % ids.length;
  return forward <= backward ? "next" : "prev";
}

function cycleShopCategory(direction = 1) {
  const ids = selectableShopCategoryIds();
  if (!ids.length) return;
  const currentIndex = Math.max(0, ids.indexOf(selectedShopCategory));
  selectedShopCategory = ids[(currentIndex + direction + ids.length) % ids.length];
  markShopCategoryViewed(selectedShopCategory);
  playSound("tab_switch", 0.12);
  hapticFeedback(6);
  renderShop(direction > 0 ? "next" : "prev");
}

function shopCategoryCarouselPosition(categoryId) {
  const ids = shopCategoryIds();
  const selectedIndex = Math.max(0, ids.indexOf(selectedShopCategory));
  const index = ids.indexOf(categoryId);
  const count = ids.length;
  let offset = index - selectedIndex;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  if (offset === 0) return "center";
  if (offset === -1 || offset === count - 1) return "left";
  if (offset === 1 || offset === 1 - count) return "right";
  return offset < 0 ? "far-left" : "far-right";
}

function cropResourcePreview(crop) {
  const water = formatResource((Number(crop.water) || 0) * RESOURCE_CONSUMPTION_RATE * (Number(crop.days) || 1));
  const nutrient = formatResource((Number(crop.nutrient) || 0) * RESOURCE_CONSUMPTION_RATE * (Number(crop.days) || 1));
  return `1株目安 水 ${water} / 養液 ${nutrient}`;
}

function renderSeedShopCard(cropId, crop) {
  const available = isUnlocked("seed_item", cropId);
  const price = currentSeedPrice(cropId);
  const trend = seedPriceTrend(cropId);
  return `
    <article class="shop-card ${available ? "" : "locked"}" style="--item-color:${crop.color}">
      <div class="shop-glyph"><img src="${crop.icon}" alt=""></div>
      <h3>${crop.name} 種子 x${crop.packSize}</h3>
      <p>${available ? crop.note : unlockHint("seed_item", cropId, crop.note)}<br>${crop.packSize}粒パック / 成長 ${crop.days}日 / 基準 ₡${formatNumber(seedMarketBasePrice(cropId))}<br>${cropResourcePreview(crop)}</p>
      <footer>
        <span class="shop-price seed-market-price">₡${formatNumber(price)} <small class="seed-market-trend ${trend.direction}">${trend.label}</small></span>
        <button class="buy-button" data-buy-seed="${cropId}" data-guide-target="buy-seed-${cropId}" ${!available || state.money < price ? "disabled" : ""}>${available ? `購入 +${crop.packSize}` : "LOCKED"}</button>
      </footer>
    </article>`;
}

function renderEquipmentShopCard(itemId, item) {
  const available = isUnlocked("shop_item", itemId);
  const owned = (itemId === "fridge" && state.equipment.fridge)
    || (itemId === "support_os_harvest" && state.supportOS?.harvest)
    || (itemId === "support_os_planting" && state.supportOS?.planting)
    || (itemId === "support_os_cleaning" && state.supportOS?.cleaning)
    || (itemId === "support_os_storage" && state.supportOS?.storage);
  let price = item.basePrice;
  if (GROW_UNITS[itemId]) price = growUnitPrice(itemId);
  const tags = (GROW_UNITS[itemId] || FLOOR_DEVICES[itemId]) ? unitTags(itemId) : [];
  const tagEffects = combinedEffects(tags, EQUIPMENT_TAGS);
  if (tags.length) price = Math.max(1, Math.round(price * (tagEffects.priceMod || 1)));
  const disabled = !available || owned || state.money < price;
  let count = "";
  if (GROW_UNITS[itemId]) count = ` x${unitCount(itemId)}`;
  if (FLOOR_DEVICES[itemId]) count = ` x${allFloorDevices().filter((device) => device.type === itemId).length}`;
  const resourceCartridge = RESOURCE_CARTRIDGE_ITEMS[itemId];
  if (resourceCartridge) count = " x" + resourceCartridgeCount(resourceCartridge.resource);
  const description = resourceCartridge && available
    ? item.description
      + "<br>現在の生産補正 +" + formatNumber(resourceCartridgeCount(resourceCartridge.resource) * resourceCartridge.productionBonus)
      + " / 対応設備 " + formatNumber(resourceProductionSnapshot().devices[resourceCartridge.resource]) + "基"
    : available ? item.description : unlockHint("shop_item", itemId, item.description);
  return `<article class="shop-card ${available ? "" : "locked"} ${owned ? "owned" : ""}" style="--item-color:${item.color}">
      ${owned ? `<span class="owned-tag">INSTALLED</span>` : ""}
      <div class="shop-glyph"><img src="${item.sprite || item.icon}" alt=""></div>
      <h3>${item.name}${count}</h3>
      <p>${description}</p>
      <footer>
        <span class="shop-price">₡${price}</span>
        <button class="buy-button" data-buy-item="${itemId}" data-guide-target="buy-item-${itemId}" ${disabled ? "disabled" : ""}>${!available ? "LOCKED" : owned ? "OWNED" : "BUY"}</button>
      </footer>
    </article>`;
}

function renderShop(direction = "") {
  ensureProcurementTags();
  if (!SHOP_CATEGORIES[selectedShopCategory] || !isShopCategoryAvailable(selectedShopCategory)) {
    selectedShopCategory = "seeds";
  }
  const category = SHOP_CATEGORIES[selectedShopCategory];
  const tabs = document.getElementById("shop-category-tabs");
  if (tabs) {
    const categories = shopCategoryIds();
    tabs.className = ("shop-category-carousel " + (direction ? "slide-" + direction : "")).trim();
    if (direction) window.setTimeout(() => tabs.classList.remove("slide-" + direction), 360);
    tabs.innerHTML = `
      <button class="shop-category-cycle cycle-prev" data-shop-category-cycle="-1" aria-label="Previous procurement category">&lsaquo;</button>
      <div class="shop-category-stage">
        ${categories.map((categoryId, index) => {
          const entry = SHOP_CATEGORIES[categoryId];
          const position = shopCategoryCarouselPosition(categoryId);
          const available = isShopCategoryAvailable(categoryId);
          const unseen = available && !hasViewedShopCategory(categoryId);
          const subtitle = available
            ? entry.subtitle
            : `累計売上 ₡${formatNumber(AUTOMATION_CATEGORY_UNLOCK_REVENUE)}で接続`;
          return `<button class="shop-category-card ${position} ${selectedShopCategory === categoryId ? "active" : ""} ${available ? "" : "locked"} ${unseen ? "has-unseen-entry" : ""}" data-shop-category="${categoryId}" type="button" aria-disabled="${available ? "false" : "true"}" aria-label="${escapeHtml(entry.label)}${unseen ? "（未確認）" : ""}">
            ${unseen ? unseenEntryBadge() : ""}
            <span class="shop-category-kicker">PROCUREMENT // ${String(index + 1).padStart(2, "0")}</span>
            <strong>${entry.label}</strong>
            <small>${subtitle}</small>
            <b>${available ? shopCategoryCount(entry) : "LOCKED"}</b>
          </button>`;
        }).join("")}
      </div>
      <button class="shop-category-cycle cycle-next" data-shop-category-cycle="1" aria-label="Next procurement category">&rsaquo;</button>
    `;
  }
  const label = document.getElementById("shop-category-label");
  if (label) label.innerHTML = `<span>${category.title}</span><small>${category.subtitle}</small>`;

  const grid = document.getElementById("procurement-shop");
  if (!grid) return;
  if (category.kind === "seeds") {
    grid.className = "shop-grid procurement-grid seed-procurement-grid";
    grid.innerHTML = Object.entries(CROPS).map(([cropId, crop]) => renderSeedShopCard(cropId, crop)).join("");
    return;
  }

  grid.className = "shop-grid procurement-grid equipment-grid";
  const itemCards = (category.items || [])
    .filter((itemId) => EQUIPMENT[itemId])
    .map((itemId) => renderEquipmentShopCard(itemId, EQUIPMENT[itemId]));
  grid.innerHTML = itemCards.join("")
    || `<div class="inventory-empty">このカテゴリの取引はありません</div>`;
}

function renderBroker() {
  const totalUsable = ownedBases().reduce((sum, base) => sum + usableCellCount(base), 0);
  document.getElementById("property-summary").innerHTML = `<span>OWNED BASES ${ownedBases().length}</span><strong>${totalUsable} usable grid cells</strong>`;
  document.getElementById("refresh-properties").disabled = state.money < PROPERTY_REROLL_FEE;
  document.getElementById("property-list").innerHTML = state.propertyListings.map((property) => {
    property.description = propertyFlavorDescription(property);
    const blocked = blockedCellSet(property);
    const preview = Array.from({ length: property.cols * property.rows }, (_, index) => {
      const x = index % property.cols;
      const y = Math.floor(index / property.cols);
      return `<i class="${blocked.has(cellKey(x, y)) ? "hole" : ""}" title="${x + 1},${y + 1}"></i>`;
    }).join("");
    const saleMarkup = property.onSale
      ? `<small class="sale-note">SALE ${Math.round(property.discountRate * 100)}% OFF / 通常 ₡${formatNumber(property.basePrice)}</small>`
      : "";
    const visibleTraits = property.traits.filter((trait) => !trait.startsWith("Missing"));
    return `
    <article class="property-card">
      <div class="property-visual">
        <img src="${property.image}" alt="">
      </div>
      <div class="property-copy">
        <p class="eyebrow">${property.code}</p>
        <h3>${property.name}</h3>
        ${tagMarkup(property.tags, BASE_TAGS)}
        <div class="property-preview" style="--preview-cols:${property.cols};--preview-rows:${property.rows}" aria-label="物件マス形状プレビュー">${preview}</div>
        <div class="property-tags">${visibleTraits.map((trait) => `<span>${trait}</span>`).join("")}</div>
      </div>
      <div class="property-contract">
        <strong>${property.cols} x ${property.rows}</strong>
        <small>維持費 ₡${property.upkeep}/日</small>
        ${saleMarkup}
        <b>₡${formatNumber(property.price)}</b>
        <button class="buy-button" data-contract-property="${property.id}" ${state.money < property.price ? "disabled" : ""}>CONTRACT</button>
      </div>
    </article>
  `;
  }).join("");
}

function renderRadio() {
  const summary = document.getElementById("radio-summary");
  const noiseButton = document.getElementById("noise-cancel-toggle");
  const noiseState = document.getElementById("noise-cancel-state");
  const ambientList = document.getElementById("ambient-layer-list");
  const radioList = document.getElementById("radio-program-list");
  if (!summary || !noiseButton || !noiseState || !ambientList || !radioList) return;

  const activeLayers = new Set(activeAmbientLayers().map(([id]) => id));
  const radio = RADIO_PROGRAMS[state.audio.radioProgram] || RADIO_PROGRAMS.off;
  summary.innerHTML = `<span>${state.audio.noiseCanceling ? "NOISE CANCELING" : `${activeLayers.size} AMBIENT LAYERS`}</span><strong>${radio?.name || "OFF"}</strong>`;
  noiseButton.classList.toggle("active", state.audio.noiseCanceling);
  noiseState.textContent = state.audio.noiseCanceling ? "ON" : "OFF";

  const visibleAmbientLayers = Object.entries(AMBIENT_LAYERS).filter(([id]) => activeLayers.has(id));
  ambientList.innerHTML = visibleAmbientLayers.map(([id, layer]) => {
    return `<article class="ambient-layer active">
      <span>LIVE // ${escapeHtml(layer.condition)}</span>
      <strong>${escapeHtml(layer.label || id)}</strong>
      <p>${escapeHtml(layer.description || "")}</p>
    </article>`;
  }).join("") || `<p class="ambient-layer-empty">現在再生中の環境音はありません</p>`;

  radioList.innerHTML = Object.entries(RADIO_PROGRAMS).filter(([, program]) => program.unlocked).map(([id, program]) => `
    <button class="radio-program ${state.audio.radioProgram === id ? "active" : ""}" data-radio-program="${id}" type="button">
      <span>${escapeHtml(program.kicker || "RADIO")}</span>
      <strong>${escapeHtml(program.name || id)}</strong>
      <p>${escapeHtml(program.description || "")}</p>
    </button>
  `).join("");
}

function infoBookEntries(bookId) {
  return INFO_ENTRIES.filter((entry) => entry.bookId === bookId).sort((a, b) => a.order - b.order);
}

function infoBookList() {
  return Object.entries(INFO_BOOKS)
    .filter(([, book]) => book.unlocked)
    .sort(([, a], [, b]) => a.order - b.order);
}

function ensureInfoSelection() {
  const books = infoBookList();
  if (!books.length) return { books, bookId: "", book: null, entries: [], entry: null };
  if (!INFO_BOOKS[selectedInfoBookId]?.unlocked) selectedInfoBookId = books[0][0];
  const book = INFO_BOOKS[selectedInfoBookId];
  const entries = infoBookEntries(selectedInfoBookId);
  if (!entries.some((entry) => entry.id === selectedInfoEntryId)) {
    selectedInfoEntryId = book.defaultEntryId && entries.some((entry) => entry.id === book.defaultEntryId)
      ? book.defaultEntryId
      : entries[0]?.id || "";
  }
  const entry = entries.find((item) => item.id === selectedInfoEntryId) || null;
  return { books, bookId: selectedInfoBookId, book, entries, entry };
}

function infoEntryThumbnail(entry, book) {
  if (entry?.thumbnail) return entry.thumbnail;
  if (entry?.cropId && CROPS[entry.cropId]?.icon) return CROPS[entry.cropId].icon;
  return book?.thumbnail || "assets/icons/locked.webp";
}

function infoCropStatsMarkup(cropId) {
  const crop = CROPS[cropId];
  if (!crop) return "";
  const market = MARKETS[crop.unlock]?.name || crop.unlock || "-";
  return `<div class="info-stat-grid">
    <div><span>成長</span><strong>${escapeHtml(crop.days)}日</strong></div>
    <div><span>種子時価</span><strong>₡${formatNumber(currentSeedPrice(cropId))} ${escapeHtml(seedPriceTrend(cropId).label)}</strong></div>
    <div><span>基準種価</span><strong>₡${formatNumber(seedMarketBasePrice(cropId))}</strong></div>
    <div><span>1パック</span><strong>${escapeHtml(crop.packSize)}粒</strong></div>
    <div><span>基礎価格</span><strong>₡${formatNumber(crop.basePrice)}</strong></div>
    <div><span>水</span><strong>${escapeHtml(crop.water)}/日</strong></div>
    <div><span>養液</span><strong>${escapeHtml(crop.nutrient)}/日</strong></div>
    <div><span>主販路</span><strong>${escapeHtml(market)}</strong></div>
    <div><span>分類</span><strong>${escapeHtml(crop.category || "-")}</strong></div>
  </div>`;
}

function renderInfo() {
  const summary = document.getElementById("info-summary");
  const bookList = document.getElementById("info-book-list");
  const entryList = document.getElementById("info-entry-list");
  const detail = document.getElementById("info-detail");
  if (!summary || !bookList || !entryList || !detail) return;

  const { books, bookId, book, entries, entry } = ensureInfoSelection();
  summary.innerHTML = `<span>${books.length} BOOKS / ${entries.length} ENTRIES</span><strong>${escapeHtml(book?.title || "NO DATA")}</strong>`;
  if (!books.length) {
    bookList.innerHTML = `<div class="inventory-empty">INFO DATA NOT FOUND</div>`;
    entryList.innerHTML = "";
    detail.innerHTML = "";
    return;
  }

  bookList.innerHTML = books.map(([id, item]) => `
    <button class="info-book-card ${id === bookId ? "active" : ""}" data-info-book="${escapeHtml(id)}" type="button">
      ${optionalImageMarkup(item.thumbnail, item.title, "info-book-thumb")}
      <span>${escapeHtml(item.kicker || "ARCHIVE")}</span>
      <strong>${escapeHtml(item.title || id)}</strong>
      <p>${escapeHtml(item.description || "")}</p>
    </button>
  `).join("");

  entryList.innerHTML = entries.map((item) => {
    const crop = item.cropId ? CROPS[item.cropId] : null;
    const color = crop?.color || "#72ffb8";
    return `<button class="info-entry-card ${item.id === selectedInfoEntryId ? "active" : ""}" style="--entry-color:${escapeHtml(color)}" data-info-entry="${escapeHtml(item.id)}" type="button">
      <img src="${escapeHtml(infoEntryThumbnail(item, book))}" alt="" loading="lazy" decoding="async">
      <span><small>${escapeHtml(item.kicker || item.category || "ENTRY")}</small><strong>${escapeHtml(item.title || item.id)}</strong></span>
    </button>`;
  }).join("") || `<div class="inventory-empty">NO ENTRIES</div>`;

  if (!entry) {
    detail.innerHTML = `<div class="inventory-empty">項目を選択してください</div>`;
    return;
  }

  const crop = entry.cropId ? CROPS[entry.cropId] : null;
  const bookStyle = book?.style === "handwritten" ? " handwritten-reader" : "";
  const bodyTitle = entry.cropId ? "旧世界の概要" : "記録";
  const methodMarkup = entry.method ? `<section class="info-reader-section"><h4>水耕栽培の方法</h4>${textBlockMarkup(entry.method)}</section>` : "";
  const statMarkup = entry.cropId ? `<section class="info-reader-section"><h4>ゲーム内ステータス</h4>${infoCropStatsMarkup(entry.cropId)}</section>` : "";
  const noteTitle = entry.cropId ? "主人公の書き込み" : "私的メモ";
  detail.innerHTML = `
    <article class="info-page${bookStyle}" style="--entry-color:${escapeHtml(crop?.color || "#72ffb8")}">
      <header class="info-page-header">
        <div>
          <p class="eyebrow">${escapeHtml(book?.kicker || "ARCHIVE")} // ${escapeHtml(entry.category || "ENTRY")}</p>
          <h3>${escapeHtml(entry.title || entry.id)}</h3>
          <small>${escapeHtml(entry.kicker || "")}</small>
        </div>
        <img src="${escapeHtml(infoEntryThumbnail(entry, book))}" alt="" loading="lazy" decoding="async">
      </header>
      <section class="info-reader-section"><h4>${bodyTitle}</h4>${textBlockMarkup(entry.body)}</section>
      ${methodMarkup}
      ${statMarkup}
      ${entry.protagonistNote ? `<section class="info-hand-note"><h4>${noteTitle}</h4>${textBlockMarkup(entry.protagonistNote)}</section>` : ""}
    </article>
  `;
}
function render() {
  syncLaborTutorialLock();
  ensureActiveTabAvailable();
  const cleaningNeeded = ownedBases().some((base) => [...base.shelves, ...base.floorDevices].some(needsCleaning));
  document.querySelector('[data-tab="farm"]')?.classList.toggle("needs-cleaning-tab", cleaningNeeded);
  document.querySelector('[data-tab="market"]')?.classList.toggle("locked", !state.marketTabUnlocked);
  document.querySelector('[data-tab="market"]')?.toggleAttribute("disabled", !state.marketTabUnlocked);
  document.querySelector('[data-tab="shop"]')?.classList.toggle("locked", !state.shopUnlocked);
  document.querySelector('[data-tab="shop"]')?.toggleAttribute("disabled", !state.shopUnlocked);
  document.querySelector('[data-tab="schedule"]')?.classList.toggle("locked", !state.shopUnlocked);
  document.querySelector('[data-tab="schedule"]')?.toggleAttribute("disabled", !state.shopUnlocked);
  document.querySelector('[data-tab="broker"]')?.classList.toggle("locked", !state.brokerUnlocked);
  document.querySelector('[data-tab="broker"]')?.toggleAttribute("disabled", !state.brokerUnlocked);
  updateTabIndicators();
  renderHeader();
  if (!farmScreenIsActive()) requestFarmRender();
  renderActiveScreen();
  renderTimeControl();
  syncLoopAudio();
  applyUiGuide();
}

function renderRuntime() {
  syncLaborTutorialLock();
  ensureActiveTabAvailable();
  updateTabIndicators();
  renderHeader();
  if (farmScreenIsActive()) {
    if (farmRenderIsRequested(currentBase())) renderFarm();
    else updateFarmProgress();
  }
  if (document.getElementById("market-screen")?.classList.contains("active") && Date.now() >= saleBurstActiveUntil) renderInventory();
  if (document.getElementById("schedule-screen")?.classList.contains("active")) renderSchedule();
  if (document.getElementById("radio-screen")?.classList.contains("active")) renderRadio();
  if (document.getElementById("labor-screen")?.classList.contains("active")) updateLaborRobotVitals();
  if (document.getElementById("info-screen")?.classList.contains("active")) renderInfo();
  renderTimeControl();
  syncLoopAudio();
  applyUiGuide();
}

function updateFarmProgress() {
  currentActivePlants().forEach(({ plant, shelfIndex, slotIndex }) => {
    const slot = document.querySelector(`[data-shelf="${shelfIndex}"][data-slot="${slotIndex}"]`);
    if (!slot || plant.ready || plant.dead) return;
    const crop = CROPS[plant.crop];
    const progress = Math.min(100, (plant.growth / crop.days) * 100);
    const fill = slot.querySelector(".progress-fill");
    const remaining = slot.querySelector(".slot-meta span");
    if (fill) fill.style.width = `${progress}%`;
    if (remaining) remaining.textContent = `残り ${Math.max(0, crop.days - plant.growth).toFixed(1)}日`;
  });
}

function renderTimeControl() {
  const button = document.getElementById("end-day-button");
  const commsPaused = isCommsBlocking();
  const gachaPaused = isRobotGachaBlocking();
  const deadlinePaused = isTimedModeCountdownBlocking();
  const settingsPaused = settingsPanelOpen;
  const tutorialPaused = isLaborTutorialActive();
  const interactionLocked = settingsPaused || commsPaused || gachaPaused || deadlinePaused || tutorialPaused;
  button.disabled = state.ended || interactionLocked;
  button.classList.toggle("paused", state.paused || !state.timeUnlocked || interactionLocked);
  document.getElementById("time-control-label").textContent = state.ended ? "OPERATION CLOSED" : settingsPaused ? "SETTINGS OPEN" : deadlinePaused ? "DEADLINE NOTICE" : gachaPaused ? "CONTRACT PAUSED" : commsPaused ? "COMMS PAUSED" : tutorialPaused ? "CONNECTION TRAINING" : !state.timeUnlocked ? "TUTORIAL DAY LOCK" : state.paused ? "REALTIME PAUSED" : "REALTIME RUNNING";
  document.getElementById("time-control-text").textContent = state.ended ? "Game ended" : settingsPaused ? "設定中" : deadlinePaused ? "残り日数を確認" : gachaPaused ? "契約演出中" : commsPaused ? "通信中" : tutorialPaused ? "接続訓練中" : !state.timeUnlocked ? "DAY停止中" : state.paused ? "Resume" : "Pause";
  document.getElementById("time-control-icon").textContent = state.ended ? "■" : interactionLocked || !state.timeUnlocked ? "LOCK" : state.paused ? "▶" : "Ⅱ";
}

let laborTutorialBlockedFeedbackAt = 0;

function isLaborTutorialInteractionTarget(target, eventType = "") {
  if (!target?.closest) return false;
  if (target.closest("#story-comms-overlay, #comms-banner, #toast-container, #start-screen")) return true;
  if (target.closest('.tab[data-tab="labor"]')) return true;
  const tutorial = ensureLaborTutorialState();
  if (tutorial.phase.endsWith("_review")) return false;
  if (target.closest("#labor-screen .labor-quick-guide")) return true;
  if (target.closest("#labor-screen #labor-blueprint-editor")) return true;
  if (eventType === "wheel" && target.closest("#labor-screen")) return true;
  if (tutorial.phase.startsWith("place_") && target.closest("#labor-screen .blueprint-palette-panel")) return true;
  return false;
}

function bindLaborTutorialInputGuard() {
  const guard = (event) => {
    if (!isLaborTutorialActive() || isLaborTutorialInteractionTarget(event.target, event.type)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (["click", "pointerdown"].includes(event.type) && Date.now() - laborTutorialBlockedFeedbackAt > 900) {
      laborTutorialBlockedFeedbackAt = Date.now();
      toast("接続訓練中です。表示された手順を完了してください。", "warning");
    }
  };
  ["pointerdown", "click", "contextmenu", "wheel", "keydown"].forEach((type) => {
    document.addEventListener(type, guard, { capture: true, passive: false });
  });
}

function bindEvents() {
  bindLaborTutorialInputGuard();
  bindSupportRobotGachaEvents();
  document.getElementById("settings-button")?.addEventListener("click", () => openSettingsPanel("system"));
  document.getElementById("start-settings-button")?.addEventListener("click", () => openSettingsPanel("system"));
  document.getElementById("settings-overlay")?.addEventListener("click", (event) => {
    if (event.target === event.currentTarget || event.target.closest("[data-settings-close]")) closeSettingsPanel();
    const tab = event.target.closest("[data-settings-tab]");
    if (tab) renderSettingsPanel(tab.dataset.settingsTab);
  });
  document.getElementById("settings-low-spec")?.addEventListener("change", (event) => setLowSpecMode(event.target.checked));
  document.getElementById("settings-volume")?.addEventListener("input", (event) => setMasterVolume(event.target.value));
  window.addEventListener("pagehide", flushPendingSalePersistence);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushPendingSalePersistence();
  });
  document.addEventListener("click", (event) => {
    const scheduleEntryAction = event.target.closest("[data-schedule-entry]");
    if (scheduleEntryAction) {
      event.preventDefault();
      showScheduleEntryDetail(scheduleEntryAction.dataset.scheduleEntry, scheduleEntryAction);
      return;
    }

    const scheduleRerollAction = event.target.closest("[data-reroll-schedule]");
    if (scheduleRerollAction) {
      event.preventDefault();
      requestScheduleReroll();
      return;
    }

    const day30ResultAction = event.target.closest("[data-day30-result]");
    if (day30ResultAction) {
      event.preventDefault();
      if (day30ResultAction.dataset.day30Result === "start") day30ResultToStart();
      if (day30ResultAction.dataset.day30Result === "view") enterDay30ViewMode();
      if (day30ResultAction.dataset.day30Result === "share-x") openXShareDraft();
      return;
    }

    if (event.target.closest("#confirm-cancel")) {
      event.preventDefault();
      closeConfirmWidget();
      return;
    }

    if (event.target.closest("#confirm-ok")) {
      event.preventDefault();
      confirmWidgetAction();
      return;
    }

    const storyImageClose = event.target.closest("[data-story-image-close]");
    if (storyImageClose) {
      event.preventDefault();
      advanceStoryImagePopup();
      return;
    }

    const storyNext = event.target.closest("[data-story-next]");
    if (storyNext) {
      event.preventDefault();
      nextStoryPage();
      return;
    }

    const storySkip = event.target.closest("[data-story-skip]");
    if (storySkip) {
      event.preventDefault();
      skipStoryComms();
      return;
    }

    const storyChoice = event.target.closest("[data-story-choice]");
    if (storyChoice) {
      event.preventDefault();
      closeStoryComms(storyChoice.dataset.storyChoice);
      return;
    }

    if (event.target.closest("#story-comms-close")) {
      event.preventDefault();
      closeStoryComms("dismiss");
      return;
    }

    const commsNext = event.target.closest("[data-comms-next]");
    if (commsNext) {
      event.preventDefault();
      nextCommsPage();
      return;
    }

    const commsChoice = event.target.closest("[data-comms-choice]");
    if (commsChoice) {
      event.preventDefault();
      closeComms(commsChoice.dataset.commsChoice);
      return;
    }

    if (event.target.closest("#comms-close")) {
      event.preventDefault();
      closeComms("dismiss");
      return;
    }

    if (isCommsBlocking() && !isCommsInteractionTarget(event.target)) {
      event.preventDefault();
      return;
    }
    const supportRobotTalkMarker = event.target.closest("[data-support-robot-talk]");
    if (supportRobotTalkMarker) {
      event.preventDefault();
      startSupportRobotTalk(supportRobotTalkMarker.dataset.supportRobotTalk);
      return;
    }
    if (event.target.closest("#news-history-button")) {
      event.preventDefault();
      openNewsHistory();
      return;
    }
    if (event.target.closest("#news-history-close")) {
      event.preventDefault();
      closeNewsHistory();
      return;
    }
    if (event.target.id === "news-history-panel") {
      event.preventDefault();
      closeNewsHistory();
      return;
    }
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      return;
    }

    const baseSwitch = event.target.closest("[data-select-base]");
    if (baseSwitch) {
      event.preventDefault();
      switchBase(baseSwitch.dataset.selectBase);
      return;
    }

    const noiseToggle = event.target.closest("#noise-cancel-toggle");
    if (noiseToggle) {
      event.preventDefault();
      setNoiseCanceling(!state.audio.noiseCanceling);
      return;
    }

    const radioProgram = event.target.closest("[data-radio-program]");
    if (radioProgram) {
      event.preventDefault();
      selectRadioProgram(radioProgram.dataset.radioProgram);
      return;
    }

    const infoBook = event.target.closest("[data-info-book]");
    if (infoBook) {
      event.preventDefault();
      selectedInfoBookId = infoBook.dataset.infoBook;
      selectedInfoEntryId = "";
      playSound("tab_switch", 0.1);
      hapticFeedback(5);
      renderInfo();
      return;
    }

    const infoEntry = event.target.closest("[data-info-entry]");
    if (infoEntry) {
      event.preventDefault();
      selectedInfoEntryId = infoEntry.dataset.infoEntry;
      playSound("ui_click", 0.12);
      hapticFeedback(4);
      renderInfo();
      return;
    }

    const automationControl = event.target.closest("[data-auto-action]");
    if (automationControl) {
      event.preventDefault();
      handleAutomationControl(automationControl);
      return;
    }

    const tab = event.target.closest(".tab");
    if (tab) {
      event.preventDefault();
      switchTab(tab.dataset.tab);
      syncLoopAudio();
      return;
    }

    const seedOption = event.target.closest("[data-seed]");
    if (seedOption) {
      selectedSeed = seedOption.dataset.seed;
      playSound("seed_select", 0.16);
      renderFarm();
    }

    const slot = plantSlotElementAtPoint(event.clientX, event.clientY) || event.target.closest("[data-shelf][data-slot]");
    if (slot) {
      handleSlotClick(Number(slot.dataset.shelf), Number(slot.dataset.slot));
      return;
    }

    const alphaTarget = placementSelection
      ? (gridCellAtPoint(event.clientX, event.clientY) || event.target)
      : (interactiveElementFromPoint(event.clientX, event.clientY) || event.target);
    const gridCell = alphaTarget.closest("[data-grid-x][data-grid-y]");
    if (gridCell && placementSelection) {
      placeSelectedAt(Number(gridCell.dataset.gridX), Number(gridCell.dataset.gridY));
      return;
    }

    const placementStock = event.target.closest("[data-place-kind][data-place-id]");
    if (placementStock) {
      placementSelection = { kind: placementStock.dataset.placeKind, id: placementStock.dataset.placeId };
      renderFarm();
    }

    const stockSellButton = event.target.closest("[data-sell-stock-kind][data-sell-stock-id]");
    if (stockSellButton) {
      sellOwnedItem(stockSellButton.dataset.sellStockKind, stockSellButton.dataset.sellStockId);
      return;
    }

    const envButton = event.target.closest("[data-env][data-env-delta]");
    if (envButton) {
      adjustEnvironment(envButton.dataset.env, Number(envButton.dataset.envDelta));
      return;
    }

    if (event.target.closest("[data-view-camera]")) {
      toggleFacilityCamera();
      return;
    }

    const zoomButton = event.target.closest("[data-view-zoom]");
    if (zoomButton) {
      zoomFacility(Number(zoomButton.dataset.viewZoom) * FACILITY_ZOOM_STEP);
      renderFarm();
      return;
    }

    if (event.target.closest("[data-view-reset]")) {
      resetFacilityView();
      renderFarm();
      return;
    }

    if (event.target.closest("[data-cancel-placement]")) {
      cancelPlacementSelection();
      return;
    }

    const resourceReadyTarget = event.target.closest?.("[data-resource-ready]")?.closest("[data-select-device]");
    const spriteEquipment = resourceReadyTarget || equipmentItemAtSpritePoint(event.clientX, event.clientY);
    const unitButton = spriteEquipment?.closest("[data-select-unit]") || event.target.closest("[data-select-unit]");
    if (unitButton) {
      if (!isOpaqueEquipmentPointer(unitButton, event)) return;
      const unit = currentShelves().find((entry) => entry.id === unitButton.dataset.selectUnit);
      if (unit?.slots.some((plant) => plant?.ready) && !GROW_UNIT_SLOT_LAYOUTS[unit.type]?.length) {
        harvestReadyPlantsInUnit(unit.id, unitButton);
        return;
      }
      if (unit) setStatus(observationForUnit(unit));
      return;
    }

    const deviceButton = resourceReadyTarget || spriteEquipment?.closest("[data-select-device]") || event.target.closest("[data-select-device]");
    if (deviceButton) {
      if (!resourceReadyTarget && !isOpaqueEquipmentPointer(deviceButton, event)) return;
      const device = currentFloorDevices().find((entry) => entry.id === deviceButton.dataset.selectDevice);
      if (resourceProductionDefinition(device)) {
        collectProducedResource(device);
        return;
      }
      if (device?.type === "support_robot") {
        setStatus("Support robot selected. Long press or right click, then choose AUTO.");
        return;
      }
      if (device?.type === "procurement_terminal") {
        setStatus("Procurement terminal selected. Long press or right click, then choose AUTO.");
        return;
      }
      if (device?.type === "shipping_hatch") {
        setStatus("Shipping hatch selected. Long press or right click, then choose AUTO.");
        return;
      }
      if (device) setStatus(`${FLOOR_DEVICES[device.type].name}が低く唸っています。周囲の空気だけが少し違う速度で動いています。`);
      return;
    }

    const moveUnitButton = event.target.closest("[data-move-unit]");
    if (moveUnitButton) startPlacement("unit", moveUnitButton.dataset.moveUnit);

    const moveDeviceButton = event.target.closest("[data-move-device]");
    if (moveDeviceButton) startPlacement("device", moveDeviceButton.dataset.moveDevice);

    const stockUnitButton = event.target.closest("[data-stock-unit]");
    if (stockUnitButton) returnItemToStock("unit", stockUnitButton.dataset.stockUnit);

    const stockDeviceButton = event.target.closest("[data-stock-device]");
    if (stockDeviceButton) returnItemToStock("device", stockDeviceButton.dataset.stockDevice);

    const sellUnitButton = event.target.closest("[data-sell-unit]");
    if (sellUnitButton) sellOwnedItem("unit", sellUnitButton.dataset.sellUnit);

    const sellDeviceButton = event.target.closest("[data-sell-device]");
    if (sellDeviceButton) sellOwnedItem("device", sellDeviceButton.dataset.sellDevice);

    const contractButton = event.target.closest("[data-contract-property]");
    if (contractButton) contractProperty(contractButton.dataset.contractProperty);
    const marketCycle = event.target.closest("[data-market-cycle]");
    if (marketCycle) {
      event.preventDefault();
      cycleMarket(Number(marketCycle.dataset.marketCycle) || 1);
      return;
    }

    const market = event.target.closest("[data-market]");
    if (market) {
      if (!isMarketAvailable(market.dataset.market)) {
        rejectFeedback();
        return;
      }
      selectedMarket = market.dataset.market;
      markMarketViewed(selectedMarket);
      playSound("market_select", 0.18);
      hapticFeedback(8);
      renderMarkets();
    }

    const shopCategoryCycle = event.target.closest("[data-shop-category-cycle]");
    if (shopCategoryCycle) {
      cycleShopCategory(Number(shopCategoryCycle.dataset.shopCategoryCycle) || 1);
      return;
    }

    const shopCategoryButton = event.target.closest("[data-shop-category]");
    if (shopCategoryButton) {
      const categoryId = shopCategoryButton.dataset.shopCategory;
      if (SHOP_CATEGORIES[categoryId] && !isShopCategoryAvailable(categoryId)) {
        toast(`自動化OSは累計売上 ₡${formatNumber(AUTOMATION_CATEGORY_UNLOCK_REVENUE)}で接続されます`);
        rejectFeedback({ shake: false });
        return;
      }
      const newlyViewed = SHOP_CATEGORIES[categoryId] && markShopCategoryViewed(categoryId);
      if (SHOP_CATEGORIES[categoryId] && selectedShopCategory !== categoryId) {
        const direction = shopCategoryCycleDirection(categoryId);
        selectedShopCategory = categoryId;
        playSound("tab_switch", 0.12);
        hapticFeedback(6);
        renderShop(direction);
      } else if (newlyViewed) {
        renderShop();
      }
      return;
    }
    const buySeedButton = event.target.closest("[data-buy-seed]");
    if (buySeedButton) buySeed(buySeedButton.dataset.buySeed);

    const buyItemButton = event.target.closest("[data-buy-item]");
    if (buyItemButton) buyEquipment(buyItemButton.dataset.buyItem);

    const sellAllButton = event.target.closest("[data-sell-all]");
    if (sellAllButton) {
      sellAllInventory(sellAllButton);
      return;
    }

    const qtyButton = event.target.closest("[data-qty-id]");
    if (qtyButton) {
      changeSaleQty(qtyButton.dataset.qtyId, Number(qtyButton.dataset.delta));
      return;
    }

    const sellButton = event.target.closest("[data-sell-id]");
    if (sellButton) {
      sellBatch(sellButton.dataset.sellId);
      return;
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "day30-player-name") applyDay30PlayerName();
  });

  document.addEventListener("pointerdown", (event) => {
    const saleControl = event.target.closest?.("[data-sell-id], [data-sell-all], [data-qty-id]");
    if (saleControl) {
      saleBurstActiveUntil = Date.now() + SALE_POINTER_GUARD_MS;
      if (pendingSaleRenderTimer) scheduleSaleRender(SALE_POINTER_GUARD_MS);
    }
    if (cleanToolDrag) clearCleanToolDrag();
    if (isCommsInteractionTarget(event.target)) return;
    if (isCommsBlocking() && !isCommsInteractionTarget(event.target)) {
      event.preventDefault();
      return;
    }
    if (event.target.closest?.("[data-support-robot-talk]")) return;
    if (event.target.closest?.("[data-resource-ready]")) return;
    if (event.target.closest?.("[data-select-base]")) return;
    if (pointerDrag) return;
    if (equipmentMenu?.persistent) {
      if (event.target.closest(".equipment-pie-menu")) return;
      clearEquipmentMenu();
    }
    if (event.button !== undefined && event.button !== 0) return;
    const cleanTool = event.target.closest("[data-clean-tool]");
    if (cleanTool) {
      beginCleanToolDrag(cleanTool, event);
      return;
    }
    const seed = event.target.closest("[data-drag-crop]");
    const plantSlotTarget = plantSlotElementAtPoint(event.clientX, event.clientY) || event.target.closest("[data-box-plant-slot]");
    const equipment = equipmentItemAtSpritePoint(event.clientX, event.clientY) || event.target.closest("[data-drag-kind][data-drag-id]");
    const opaqueEquipment = equipment && isOpaqueEquipmentPointer(equipment, event);
    const placedEquipment = equipment?.classList.contains("facility-item");
    const gridShell = event.target.closest(".facility-grid-shell");
    if (gridShell && event.pointerType !== "mouse") {
      facilityPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (gridShell.setPointerCapture) gridShell.setPointerCapture(event.pointerId);
      if (facilityPointers.size >= 2 && !placementSelection) {
        beginFacilityPinch(gridShell);
        event.preventDefault();
        return;
      }
    }
    if (facilityPinch) return;
    const harvestableUnit = equipment?.dataset.selectUnit
      ? currentShelves().find((unit) => unit.id === equipment.dataset.selectUnit && unit.slots.some((plant) => plant?.ready))
      : null;
    if (plantSlotTarget) {
      const shelfIndex = Number(plantSlotTarget.dataset.shelf);
      const slotIndex = Number(plantSlotTarget.dataset.slot);
      const plant = currentShelves()[shelfIndex]?.slots?.[slotIndex];
      if (plant?.ready) {
        harvestSwipe = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          harvested: new Set()
        };
        harvestReadySlotElement(plantSlotTarget);
        suppressClickUntil = Date.now() + 250;
        event.preventDefault();
        return;
      }
    }
    if (equipment && opaqueEquipment && harvestableUnit && !plantSlotTarget) {
      if (event.pointerType === "mouse") {
        harvestSwipe = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          harvested: new Set()
        };
        harvestReadyUnitElement(equipment);
        suppressClickUntil = Date.now() + 250;
        event.preventDefault();
        return;
      }
      harvestHold = {
        pointerId: event.pointerId,
        source: equipment,
        unitId: harvestableUnit.id,
        startX: event.clientX,
        startY: event.clientY
      };
      beginEquipmentMenuHold(equipment, event);
      event.preventDefault();
      return;
    }
    if (equipment && opaqueEquipment && placedEquipment && event.pointerType !== "mouse") {
      beginEquipmentMenuHold(equipment, event);
      return;
    }
    if (seed && state.seeds[seed.dataset.dragCrop] > 0) {
      if (event.pointerType !== "mouse") {
        pendingSeedDrag = {
          source: seed,
          pointerId: event.pointerId,
          cropId: seed.dataset.dragCrop,
          startX: event.clientX,
          startY: event.clientY
        };
        return;
      }
      dragPayload = { type: "seed", cropId: seed.dataset.dragCrop };
    } else if (equipment && opaqueEquipment) {
      dragPayload = { type: "equipment", kind: equipment.dataset.dragKind, id: equipment.dataset.dragId };
    } else if (gridShell && !placementSelection && !event.target.closest("[data-shelf], .facility-grid-toolbar, .selected-unit-panel") && !opaqueEquipment) {
      facilityPan = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        viewX: facilityView.x,
        viewY: facilityView.y,
        moved: false
      };
      gridShell.classList.add("panning");
      if (gridShell.setPointerCapture) gridShell.setPointerCapture(event.pointerId);
      return;
    } else {
      return;
    }
    beginPointerDrag(seed || equipment, event, dragPayload);
  });

  document.addEventListener("pointermove", (event) => {
    if (updateCleanToolDrag(event)) return;
    if (updateEquipmentMenu(event)) return;
    if (pendingSeedDrag && event.pointerId === pendingSeedDrag.pointerId) {
      const dx = event.clientX - pendingSeedDrag.startX;
      const dy = event.clientY - pendingSeedDrag.startY;
      const distance = Math.hypot(dx, dy);
      if (distance < 9) return;
      if (Math.abs(dy) > Math.abs(dx) * 1.15) {
        pendingSeedDrag = null;
        return;
      }
      const pending = pendingSeedDrag;
      pendingSeedDrag = null;
      beginPointerDrag(pending.source, event, { type: "seed", cropId: pending.cropId }, pending.startX, pending.startY);
    }
    if (harvestHold && event.pointerId === harvestHold.pointerId) {
      const distance = Math.hypot(event.clientX - harvestHold.startX, event.clientY - harvestHold.startY);
      if (distance < 9) {
        event.preventDefault();
        return;
      }
      const pending = harvestHold;
      harvestHold = null;
      cancelEquipmentMenuTimer();
      harvestSwipe = {
        pointerId: event.pointerId,
        startX: pending.startX,
        startY: pending.startY,
        harvested: new Set()
      };
      harvestReadyUnitElement(pending.source);
      harvestReadyUnitAtPoint(event.clientX, event.clientY);
      suppressClickUntil = Date.now() + 250;
      event.preventDefault();
      return;
    }
    if (updatePendingEquipmentMenu(event)) return;
    if (facilityPinch && updateFacilityPinch(event)) return;
    if (harvestSwipe && event.pointerId === harvestSwipe.pointerId) {
      const distance = Math.hypot(event.clientX - harvestSwipe.startX, event.clientY - harvestSwipe.startY);
      if (distance >= 6) {
        event.preventDefault();
        harvestReadyUnitAtPoint(event.clientX, event.clientY);
      }
      return;
    }
    if (facilityPan && event.pointerId === facilityPan.pointerId) {
      const dx = event.clientX - facilityPan.startX;
      const dy = event.clientY - facilityPan.startY;
      if (!facilityPan.moved && Math.hypot(dx, dy) < 4) return;
      facilityPan.moved = true;
      event.preventDefault();
      facilityView.x = facilityPan.viewX + dx;
      facilityView.y = facilityPan.viewY + dy;
      applyFacilityView();
      return;
    }
    if (!pointerDrag || !dragPayload || event.pointerId !== pointerDrag.pointerId) return;
    const distance = Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY);
    if (!pointerDrag.moved && distance < 7) return;
    if (!pointerDrag.moved) {
      pointerDrag.moved = true;
      pointerDrag.source.classList.add("dragging");
      document.documentElement.classList.add("drag-active");
      document.body.classList.add("drag-active");
      if (dragPayload.type === "equipment") {
        document.documentElement.classList.add("equipment-drag-active");
        document.body.classList.add("equipment-drag-active");
      }
      pointerDrag.ghost = pointerDrag.source.cloneNode(true);
      pointerDrag.ghost.className = "drag-ghost";
      pointerDrag.ghost.removeAttribute("data-guide-active");
      pointerDrag.ghost.querySelectorAll?.(".guide-pulse, [data-guide-active]").forEach((element) => {
        element.classList.remove("guide-pulse");
        element.removeAttribute("data-guide-active");
      });
      document.body.appendChild(pointerDrag.ghost);
      const ghostRect = pointerDrag.ghost.getBoundingClientRect();
      pointerDrag.ghostHalfWidth = Math.max(48, Math.min(ghostRect.width / 2, 96));
      pointerDrag.ghostHalfHeight = Math.max(32, Math.min(ghostRect.height / 2, 72));
    }
    event.preventDefault();
    const ghostMargin = 8;
    const ghostX = Math.min(Math.max(event.clientX, pointerDrag.ghostHalfWidth + ghostMargin), window.innerWidth - pointerDrag.ghostHalfWidth - ghostMargin);
    const ghostY = Math.min(Math.max(event.clientY, pointerDrag.ghostHalfHeight + ghostMargin), window.innerHeight - pointerDrag.ghostHalfHeight - ghostMargin);
    pointerDrag.ghost.style.left = `${ghostX}px`;
    pointerDrag.ghost.style.top = `${ghostY}px`;
    const ignoredItem = dragPayload.type === "equipment" ? pointerDrag.source : null;
    const hovered = interactiveElementFromPoint(event.clientX, event.clientY, ignoredItem);
    const slot = hovered && hovered.closest("[data-shelf][data-slot]");
    const unitTarget = hovered && hovered.closest("[data-select-unit]");
    const cell = dragPayload.type === "equipment"
      ? gridCellAtPoint(event.clientX, event.clientY)
      : hovered && hovered.closest("[data-grid-x][data-grid-y]");
    document.querySelectorAll(".drop-target, .drop-footprint, .seed-drop-target, .moving-coverage").forEach(clearMovingCoverageClasses);
    pointerDrag.dropOrigin = null;
    pointerDrag.dropUnitId = null;
    if (dragPayload.type === "seed" && slot) {
      const plant = currentShelves()[Number(slot.dataset.shelf)]?.slots[Number(slot.dataset.slot)];
      if (!plant) {
        slot.classList.add("drop-target");
      }
    } else if (dragPayload.type === "seed" && unitTarget) {
      const unit = currentShelves().find((entry) => entry.id === unitTarget.dataset.selectUnit);
      if (unit && unit.slots.some((plant) => !plant)) {
        pointerDrag.dropUnitId = unit.id;
        unitTarget.classList.add("seed-drop-target");
      }
    }
    if (dragPayload.type === "equipment" && cell) {
      const record = findOwnedEquipment(dragPayload.kind, dragPayload.id);
      const item = record?.item;
      const originX = Number(cell.dataset.gridX) - pointerDrag.anchorX;
      const originY = Number(cell.dataset.gridY) - pointerDrag.anchorY;
      if (item && canPlace({ ...item, kind: dragPayload.kind }, originX, originY, item.id)) {
        pointerDrag.dropOrigin = { x: originX, y: originY };
        highlightDragFootprint(item, dragPayload.kind, originX, originY);
      } else {
        pointerDrag.dropOrigin = null;
      }
    }
  });

  document.addEventListener("pointerup", (event) => {
    endFacilityPointer(event);
    if (finishCleanToolDrag(event)) return;
    if (finishEquipmentMenu(event)) return;
    if (equipmentMenuTimer && event.pointerId === equipmentMenuTimer.pointerId) {
      const pending = equipmentMenuTimer;
      cancelEquipmentMenuTimer();
      if (harvestHold && event.pointerId === harvestHold.pointerId) harvestHold = null;
      if (handleFacilityEquipmentTap(pending.source, event)) {
        suppressClickUntil = Date.now() + 220;
        event.preventDefault();
        return;
      }
      suppressClickUntil = Date.now() + 180;
      return;
    }
    if (harvestHold && event.pointerId === harvestHold.pointerId) {
      harvestHold = null;
      suppressClickUntil = Date.now() + 120;
      return;
    }
    if (harvestSwipe && event.pointerId === harvestSwipe.pointerId) {
      suppressClickUntil = Date.now() + 180;
      harvestSwipe = null;
      return;
    }
    if (pendingSeedDrag && event.pointerId === pendingSeedDrag.pointerId) {
      pendingSeedDrag = null;
      return;
    }
    if (facilityPan && event.pointerId === facilityPan.pointerId) {
      const shell = document.querySelector(".facility-grid-shell");
      if (shell) shell.classList.remove("panning");
      if (facilityPan.moved) suppressClickUntil = Date.now() + 120;
      facilityPan = null;
      return;
    }
    if (!pointerDrag || !dragPayload || event.pointerId !== pointerDrag.pointerId) return;
    if (!pointerDrag.moved) {
      clearDragState();
      return;
    }
    const payload = { ...dragPayload };
    const ignoredItem = payload.type === "equipment" ? pointerDrag.source : null;
    const hovered = interactiveElementFromPoint(event.clientX, event.clientY, ignoredItem);
    const slot = hovered && hovered.closest("[data-shelf][data-slot]");
    const cell = payload.type === "equipment"
      ? gridCellAtPoint(event.clientX, event.clientY)
      : hovered && hovered.closest("[data-grid-x][data-grid-y]");
    const validSeedDrop = payload.type === "seed" && slot && slot.classList.contains("drop-target");
    const seedUnitId = pointerDrag.dropUnitId;
    const validUnitSeedDrop = payload.type === "seed" && Boolean(seedUnitId);
    const equipmentOrigin = pointerDrag.dropOrigin ? { ...pointerDrag.dropOrigin } : null;
    const validEquipmentDrop = payload.type === "equipment" && Boolean(equipmentOrigin);
    suppressClickUntil = Date.now() + 250;
    clearDragState();
    if (validSeedDrop) {
      selectedSeed = payload.cropId;
      plantSeed(Number(slot.dataset.shelf), Number(slot.dataset.slot), payload.cropId, slot);
    } else if (validUnitSeedDrop) {
      const shelfIndex = currentShelves().findIndex((unit) => unit.id === seedUnitId);
      const slotIndex = currentShelves()[shelfIndex]?.slots.findIndex((plant) => !plant);
      if (shelfIndex >= 0 && slotIndex >= 0) {
        selectedSeed = payload.cropId;
        plantSeed(shelfIndex, slotIndex, payload.cropId, document.querySelector(`[data-select-unit="${seedUnitId}"]`));
      }
    } else if (validEquipmentDrop) {
      placeItemAt(payload.kind, payload.id, equipmentOrigin.x, equipmentOrigin.y, cell, { selectAfterPlace: false });
    } else {
      rejectFeedback(payload.type === "seed" ? { shake: false } : {});
    }
  });

  document.addEventListener("pointercancel", (event) => {
    endFacilityPointer(event);
    if (cleanToolDrag && event.pointerId === cleanToolDrag.pointerId) clearCleanToolDrag();
    if (equipmentMenu && event.pointerId === equipmentMenu.pointerId) clearEquipmentMenu();
    if (equipmentMenuTimer && event.pointerId === equipmentMenuTimer.pointerId) cancelEquipmentMenuTimer();
    if (pendingSeedDrag && event.pointerId === pendingSeedDrag.pointerId) pendingSeedDrag = null;
    if (harvestHold && event.pointerId === harvestHold.pointerId) harvestHold = null;
    if (harvestSwipe && event.pointerId === harvestSwipe.pointerId) harvestSwipe = null;
    if (facilityPan && event.pointerId === facilityPan.pointerId) {
      const shell = document.querySelector(".facility-grid-shell");
      if (shell) shell.classList.remove("panning");
      facilityPan = null;
    }
  });

  document.addEventListener("wheel", (event) => {
    if (isCommsBlocking() && !isCommsInteractionTarget(event.target)) {
      event.preventDefault();
      return;
    }
    const shell = event.target.closest(".facility-grid-shell");
    if (!shell) return;
    if (event.target.closest(".selected-unit-panel")) return;
    event.preventDefault();
    zoomFacility(event.deltaY > 0 ? -FACILITY_ZOOM_STEP : FACILITY_ZOOM_STEP);
    renderFarm();
  }, { passive: false });

  document.addEventListener("contextmenu", (event) => {
    if (event.target.closest?.("[data-support-robot-talk]")) {
      event.preventDefault();
      return;
    }
    if (isCommsBlocking() && !isCommsInteractionTarget(event.target)) {
      event.preventDefault();
      return;
    }
    const equipment = equipmentItemAtSpritePoint(event.clientX, event.clientY) || event.target.closest(".facility-item[data-drag-kind][data-drag-id]");
    if (!equipment || !equipment.classList.contains("facility-item") || !isOpaqueEquipmentPointer(equipment, event)) return;
    event.preventDefault();
    clearDragState();
    clearEquipmentMenu();
    openEquipmentMenu(equipment, {
      pointerId: "contextmenu",
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: "mouse",
      preventDefault() {}
    }, { persistent: true });
  });

  document.addEventListener("pointercancel", clearDragState);
  window.addEventListener("blur", clearDragState);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearDragState();
  });
  document.addEventListener("dragstart", (event) => {
    if (event.target.closest("[data-drag-kind], [data-drag-crop]")) event.preventDefault();
  });

  document.getElementById("end-day-button").addEventListener("click", togglePause);
  document.getElementById("refresh-properties").addEventListener("click", refreshPropertyListings);
  document.getElementById("reset-button").addEventListener("click", requestExitToStart);
  document.getElementById("fullscreen-button")?.addEventListener("click", toggleFullscreenMode);
  document.getElementById("modal-reset").addEventListener("click", requestNewGame);
  document.getElementById("start-continue").addEventListener("click", handleStartPrimary);
  document.getElementById("start-day30")?.addEventListener("click", requestSelectedModeGame);
  document.getElementById("start-new").addEventListener("click", handleStartContinue);
  document.getElementById("start-ending")?.addEventListener("click", () => endingRollPresentation.play());
  document.getElementById("start-mode-toggle").addEventListener("click", toggleStartModeView);
  document.getElementById("start-title")?.addEventListener("click", handleStartTitleTap);
  bindAppleTouchStartControls();
  document.getElementById("record-export-button").addEventListener("click", requestRecordExport);
  document.getElementById("confirm-cancel").addEventListener("click", closeConfirmWidget);
  document.getElementById("confirm-ok").addEventListener("click", confirmWidgetAction);
  document.getElementById("confirm-danger").addEventListener("click", confirmWidgetDangerAction);
  document.getElementById("confirm-extra").addEventListener("click", confirmWidgetExtraAction);
  document.getElementById("modal-close").addEventListener("click", () => {
    resultPresentation.stop();
    document.getElementById("modal-backdrop").classList.add("hidden");
  });
  window.addEventListener("resize", applyUiScale);
  window.visualViewport?.addEventListener("resize", applyUiScale);
  document.addEventListener("fullscreenchange", () => { updateFullscreenButton(); applyUiScale(); });
  document.addEventListener("webkitfullscreenchange", () => { updateFullscreenButton(); applyUiScale(); });
  document.addEventListener("msfullscreenchange", () => { updateFullscreenButton(); applyUiScale(); });

  document.addEventListener("keydown", (event) => {
    if (settingsPanelOpen) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSettingsPanel();
      }
      return;
    }
    if (isCommsBlocking()) {
      const targetInComms = isCommsInteractionTarget(event.target) || isCommsInteractionTarget(document.activeElement);
      if (!targetInComms || !["Enter", " ", "Tab"].includes(event.key)) {
        event.preventDefault();
        return;
      }
    }
    if (event.key === "Escape" && !document.getElementById("news-history-panel")?.classList.contains("hidden")) {
      closeNewsHistory();
      return;
    }
    if (event.key === "Escape" && !document.getElementById("confirm-widget")?.classList.contains("hidden")) {
      closeConfirmWidget();
      return;
    }
    if (event.key === "Escape" && placementSelection) {
      cancelPlacementSelection();
      return;
    }
    const shortcutTab = GAME_TAB_SHORTCUTS[event.key];
    if (shortcutTab) switchTab(shortcutTab);
  });
}

function clearDragState() {
  if (cleanToolDrag) clearCleanToolDrag();
  dragPayload = null;
  pendingSeedDrag = null;
  harvestHold = null;
  harvestSwipe = null;
  if (pointerDrag && pointerDrag.ghost) pointerDrag.ghost.remove();
  pointerDrag = null;
  if (facilityPan) {
    document.querySelector(".facility-grid-shell")?.classList.remove("panning");
    facilityPan = null;
  }
  document.documentElement.classList.remove("drag-active", "equipment-drag-active");
  document.body.classList.remove("drag-active", "equipment-drag-active");
  document.querySelectorAll(".dragging, .drop-target, .drop-footprint, .seed-drop-target, .moving-coverage").forEach(clearMovingCoverageClasses);
  window.requestAnimationFrame(applyUiGuide);
}

function launchLaborTutorialQaMode() {
  clearSessionInteractionState();
  startScreenOpen = false;
  pausedBeforeStartScreen = false;
  state.paused = isLaborTutorialActive();
  lastTickAt = Date.now();
  document.body.classList.remove("start-screen-open");
  document.body.classList.add("labor-tutorial-qa");
  const startScreen = document.getElementById("start-screen");
  startScreen?.classList.add("hidden");
  startScreen?.setAttribute("aria-hidden", "true");
  document.getElementById("modal-backdrop")?.classList.add("hidden");
  document.getElementById("comms-banner")?.classList.add("hidden");
  document.getElementById("story-comms-overlay")?.classList.add("hidden");
  switchTab("labor");
}

async function bootstrap() {
  loadAppSettings();
  applyRuntimeSettings({ restartLoop: false });
  setInputDiagnosticStage("bootstrap:start");
  setBootLoadingProgress(0, REQUIRED_GAME_DATA_PATHS.length, "CSVデータを読み込んでいます...");
  setInputDiagnosticStage("data:verify");
  await verifyRequiredGameData();
  setInputDiagnosticStage("data:load");
  await loadExternalData();
  setInputDiagnosticStage("assets:preload");
  await preloadBootAssets();
  setBootLoadingProgress(1, 1, "画面を準備しています...");
  startModeView = validPlayMode(safeStorageGet(START_MODE_PREF_KEY), "day45");
  setInputDiagnosticStage("game:load");
  loadGame();
  applyUiScale();
  setInputDiagnosticStage("events:bind");
  syncGameTabNavigation();
  bindEvents();
  inputDiagnosticState.bindEventsReached = true;
  updateFullscreenButton();
  markTabOpened("farm");
  setInputDiagnosticStage("render");
  render();
  inputDiagnosticState.renderReached = true;
  pushLogEntry(state.log, "status", { duration: 5200 });
  if (LABOR_TUTORIAL_QA_MODE) {
    setInputDiagnosticStage("labor-tutorial-qa");
    launchLaborTutorialQaMode();
  } else {
    setInputDiagnosticStage("start-screen");
    openStartScreen({ persist: false });
  }
  inputDiagnosticState.startScreenReached = true;
  hideBootLoading();
  setInputDiagnosticStage("ready");
  restartRealtimeLoop();
}

function missingDataListHtml(error) {
  const failures = Array.isArray(error?.failures) ? error.failures : [];
  if (failures.length === 0) return "";
  const items = failures.map((failure) => (
    `<li><code>${escapeHtml(failure.path)}</code><small>${escapeHtml(failure.message)}</small></li>`
  )).join("");
  return `<div class="modal-copy"><strong>Missing required files</strong></div><ul class="modal-copy boot-error-list">${items}</ul>`;
}

function showBootstrapError(error) {
  hideBootLoading();
  setInputDiagnosticStage("boot:error", error?.message || String(error));
  console.error(error);
  const isFile = window.location.protocol === "file:";
  const failures = Array.isArray(error?.failures) ? error.failures : [];
  const message = isFile
    ? "Direct file launch cannot load the CSV data in Chrome. Start a local server and open http://127.0.0.1:8766/index.html."
    : failures.length > 0
      ? `${failures.length} required game file(s) could not be loaded.`
      : `Game data failed to load: ${error.message}`;
  const status = document.getElementById("status-text");
  if (status) status.textContent = message;
  const news = document.getElementById("news-text");
  if (news) news.textContent = message;
  const modal = document.getElementById("modal-backdrop");
  if (modal) {
    document.getElementById("modal-kicker").textContent = "BOOT ERROR";
    document.getElementById("modal-title").textContent = "Game data could not be loaded";
    const content = [`<p class="modal-copy">${escapeHtml(message)}</p>`, missingDataListHtml(error)].filter(Boolean).join("");
    document.getElementById("modal-content").innerHTML = content;
    const closeButton = document.getElementById("modal-close");
    const reloadButton = document.getElementById("modal-reset");
    if (closeButton) {
      closeButton.hidden = false;
      closeButton.style.display = "";
      closeButton.textContent = "\u9589\u3058\u308b";
      closeButton.onclick = () => modal.classList.add("hidden");
    }
    if (reloadButton) {
      reloadButton.hidden = false;
      reloadButton.style.display = "";
      reloadButton.textContent = "\u518d\u8aad\u307f\u8fbc\u307f";
      reloadButton.onclick = () => window.location.reload();
    }
    modal.classList.remove("hidden");
  }
}

bootstrap().catch(showBootstrapError);
