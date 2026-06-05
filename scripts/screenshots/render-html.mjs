import { THEMES, layoutFor } from "./themes.mjs";

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", system-ui, sans-serif';

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statsFor(entry) {
  const id = Number(entry.id);
  return [
    { label: "Appareils", value: String(1200 + id * 17) },
    { label: "Conformes", value: String(980 + id * 3) },
    { label: "En attente", value: String(12 + (id % 8)) },
    { label: "Licences", value: String(450 + id * 5) },
  ];
}

function tableFor(entry) {
  const rows = [
    ["iPhone 15 Pro", "iOS 18.4", "Supervisé", "Intune Production", "Assigné"],
    ["iPad Air M2", "iPadOS 18.4", "Supervisé", "Intune Production", "Assigné"],
    ["MacBook Pro 14\"", "macOS 15.4", "Supervisé", "Jamf Pro", "Assigné"],
    ["iPhone SE", "iOS 17.7", "Supervisé", "Intune Production", "En attente"],
    ["Mac mini M4", "macOS 15.4", "Supervisé", "Jamf Pro", "Assigné"],
  ];
  return {
    headers: ["Appareil", "OS", "Mode", "Serveur MDM", "Statut"],
    rows: rows.slice(0, 4 + (Number(entry.id) % 2)),
  };
}

function baseStyles(theme) {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${FONT}; background: ${theme.body}; color: #1d1d1f; width: 1920px; height: 1080px; overflow: hidden; }
    .chrome { display: flex; height: 100vh; }
    .sidebar { width: 260px; background: ${theme.sidebar}; color: ${theme.sidebarText}; padding: 24px 0; border-right: 1px solid rgba(0,0,0,.06); flex-shrink: 0; }
    .sidebar .brand { padding: 0 20px 20px; font-size: 13px; font-weight: 600; opacity: .85; letter-spacing: -.01em; }
    .sidebar .product { padding: 0 20px 24px; font-size: 15px; font-weight: 700; }
    .nav-item { padding: 10px 20px; font-size: 14px; opacity: .75; }
    .nav-item.active { background: rgba(0,0,0,.05); opacity: 1; font-weight: 600; border-left: 3px solid ${theme.accent}; }
    .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .topbar { height: 52px; background: ${theme.header}; border-bottom: 1px solid rgba(0,0,0,.08); display: flex; align-items: center; padding: 0 28px; gap: 16px; font-size: 13px; color: #6e6e73; }
    .url { flex: 1; background: #f5f5f7; border-radius: 8px; padding: 8px 14px; color: #424245; font-size: 13px; }
    .content { flex: 1; padding: 32px 36px; overflow: hidden; }
    h1 { font-size: 28px; font-weight: 700; letter-spacing: -.02em; margin-bottom: 8px; }
    .subtitle { font-size: 15px; color: #6e6e73; margin-bottom: 28px; max-width: 900px; line-height: 1.5; }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    .card { background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 14px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
    .card .label { font-size: 12px; color: #86868b; text-transform: uppercase; letter-spacing: .04em; font-weight: 600; }
    .card .value { font-size: 32px; font-weight: 700; margin-top: 8px; color: ${theme.accent}; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid rgba(0,0,0,.08); font-size: 14px; }
    th { text-align: left; padding: 14px 18px; background: #f5f5f7; font-weight: 600; color: #424245; font-size: 12px; text-transform: uppercase; letter-spacing: .03em; }
    td { padding: 14px 18px; border-top: 1px solid rgba(0,0,0,.06); color: #1d1d1f; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #e8f5e9; color: #2e7d32; }
    .badge-warn { background: #fff3e0; color: #e65100; }
    .btn { display: inline-block; padding: 10px 22px; border-radius: 999px; background: ${theme.accent}; color: #fff; font-size: 14px; font-weight: 600; border: none; }
    .btn-secondary { background: #fff; color: ${theme.accent}; border: 1px solid ${theme.accent}; }
    .panel { background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 16px; padding: 28px; max-width: 720px; }
    .field { margin-bottom: 18px; }
    .field label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #424245; }
    .field input, .field select { width: 100%; padding: 12px 14px; border: 1px solid #d2d2d7; border-radius: 10px; font-size: 15px; background: #fafafa; }
    .steps { display: flex; gap: 8px; margin-bottom: 24px; }
    .step { flex: 1; height: 4px; border-radius: 2px; background: #e8e8ed; }
    .step.done { background: ${theme.accent}; }
    .step.current { background: ${theme.accent}; opacity: .6; }
    .training-tag { position: fixed; bottom: 16px; right: 20px; font-size: 11px; color: rgba(0,0,0,.25); font-weight: 500; }
  `;
}

function consoleShell(theme, entry, inner) {
  const nav = theme.nav.map((n, i) =>
    `<div class="nav-item${i === 1 ? " active" : ""}">${esc(n)}</div>`
  ).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${baseStyles(theme)}</style></head><body>
  <div class="chrome">
    <aside class="sidebar"><div class="brand">Enterprise</div><div class="product">${esc(theme.product)}</div>${nav}</aside>
    <div class="main">
      <div class="topbar"><span>🔒</span><div class="url">${esc(theme.url)}</div><span>Admin</span></div>
      <div class="content">${inner}</div>
    </div>
  </div>
  <div class="training-tag">Apple MDM Academy · Formation</div>
</body></html>`;
}

function renderLogin(theme, entry) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${baseStyles(theme)}
    body { display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg,#fbfbfd 0%,#eef2f7 100%); }
    .login-box { width: 420px; background: #fff; border-radius: 20px; padding: 48px 40px; box-shadow: 0 20px 60px rgba(0,0,0,.08); border: 1px solid rgba(0,0,0,.06); }
    .login-box h1 { font-size: 24px; text-align: center; margin-bottom: 6px; }
    .login-box p { text-align: center; color: #6e6e73; font-size: 14px; margin-bottom: 32px; }
    .org { text-align: center; font-size: 13px; color: #86868b; margin-top: 24px; }
  </style></head><body>
    <div class="login-box">
      <div style="text-align:center;font-size:42px;margin-bottom:16px">🍎</div>
      <h1>${esc(entry.title)}</h1>
      <p>${esc(entry.scenePrompt.split(",").slice(0, 2).join(" · "))}</p>
      <div class="field"><label>Apple ID</label><input value="admin@entreprise.com" readonly /></div>
      <div class="field"><label>Mot de passe</label><input type="password" value="••••••••" readonly /></div>
      <div style="margin-top:24px;text-align:center"><span class="btn">Se connecter</span></div>
      <p class="org">Contoso Enterprise · Managed Apple ID</p>
    </div>
    <div class="training-tag">Apple MDM Academy · Formation</div>
  </body></html>`;
}

function renderDashboard(theme, entry) {
  const stats = statsFor(entry);
  const cards = stats.map((s) =>
    `<div class="card"><div class="label">${esc(s.label)}</div><div class="value">${esc(s.value)}</div></div>`
  ).join("");
  const inner = `<h1>${esc(entry.title)}</h1><p class="subtitle">${esc(entry.scenePrompt)}</p><div class="cards">${cards}</div>`;
  const table = tableFor(entry);
  const rows = table.rows.map((r) =>
    `<tr>${r.map((c, i) => `<td>${i === 4 ? `<span class="badge${c.includes("attente") ? " badge-warn" : ""}">${esc(c)}</span>` : esc(c)}</td>`).join("")}</tr>`
  ).join("");
  return consoleShell(theme, entry, inner + `<table><thead><tr>${table.headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`);
}

function renderConsole(theme, entry) {
  const table = tableFor(entry);
  const rows = table.rows.map((r) =>
    `<tr>${r.map((c, i) => `<td>${i === 4 ? `<span class="badge">${esc(c)}</span>` : esc(c)}</td>`).join("")}</tr>`
  ).join("");
  const inner = `<h1>${esc(entry.title)}</h1><p class="subtitle">${esc(entry.scenePrompt)}</p>
    <div style="margin-bottom:20px;display:flex;gap:12px"><input style="flex:1;padding:12px 16px;border:1px solid #d2d2d7;border-radius:10px;font-size:15px" placeholder="Rechercher…" value="" />
    <span class="btn">Action</span></div>
    <table><thead><tr>${table.headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`;
  return consoleShell(theme, entry, inner);
}

function renderWizard(theme, entry) {
  const inner = `<div class="steps"><div class="step done"></div><div class="step current"></div><div class="step"></div><div class="step"></div></div>
    <h1>${esc(entry.title)}</h1><p class="subtitle">${esc(entry.scenePrompt)}</p>
    <div class="panel">
      <div class="field"><label>Nom du serveur MDM</label><input value="Intune Production" readonly /></div>
      <div class="field"><label>Clé publique / Token</label><input value="server_token.p7m — prêt au téléchargement" readonly /></div>
      <div class="field"><label>Organisation</label><input value="Contoso Enterprise" readonly /></div>
      <div style="margin-top:24px;display:flex;gap:12px"><span class="btn">Continuer</span><span class="btn btn-secondary">Annuler</span></div>
    </div>`;
  return consoleShell(theme, entry, inner);
}

function renderIosSetup(entry) {
  const title = entry.title.includes("Remote") ? "Remote Management" : entry.title.includes("géré") ? "Cet appareil est géré" : entry.title;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { margin:0; width:1920px; height:1080px; background:#000; font-family:${FONT}; display:flex; align-items:center; justify-content:center; }
    .phone { width:390px; height:844px; background: linear-gradient(180deg,#1a1a1a,#000); border-radius:48px; padding:12px; box-shadow:0 40px 80px rgba(0,0,0,.5); border:3px solid #333; }
    .screen { width:100%; height:100%; border-radius:38px; background: linear-gradient(180deg,#f2f2f7,#e5e5ea); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 32px; text-align:center; }
    .screen h2 { font-size:22px; font-weight:700; margin:20px 0 12px; color:#1d1d1f; }
    .screen p { font-size:15px; color:#6e6e73; line-height:1.5; max-width:280px; }
    .icon { width:72px; height:72px; background:#007aff; border-radius:18px; display:flex; align-items:center; justify-content:center; font-size:36px; color:#fff; }
    .btn-ios { margin-top:32px; background:#007aff; color:#fff; padding:14px 48px; border-radius:14px; font-size:17px; font-weight:600; }
    .org { margin-top:16px; font-size:13px; color:#86868b; }
  </style></head><body>
    <div class="phone"><div class="screen">
      <div class="icon">🏢</div>
      <h2>${esc(title)}</h2>
      <p>${esc(entry.scenePrompt)}</p>
      <p class="org">Contoso Enterprise</p>
      <div class="btn-ios">Continuer</div>
    </div></div>
    <div class="training-tag" style="color:rgba(255,255,255,.3)">Apple MDM Academy · ADE</div>
  </body></html>`;
}

function renderMacSetup(entry) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { margin:0; width:1920px; height:1080px; background: linear-gradient(135deg,#667eea 0%,#764ba2 100%); font-family:${FONT}; display:flex; align-items:center; justify-content:center; }
    .window { width:680px; background:rgba(255,255,255,.95); backdrop-filter:blur(20px); border-radius:16px; padding:48px; box-shadow:0 30px 80px rgba(0,0,0,.25); text-align:center; }
    h2 { font-size:26px; font-weight:700; margin:16px 0; }
    p { color:#6e6e73; font-size:15px; line-height:1.6; }
    .btn { display:inline-block; margin-top:28px; padding:12px 32px; background:#007aff; color:#fff; border-radius:8px; font-weight:600; }
  </style></head><body>
    <div class="window">
      <div style="font-size:48px">💻</div>
      <h2>${esc(entry.title)}</h2>
      <p>${esc(entry.scenePrompt)}</p>
      <p style="margin-top:12px;font-weight:600;color:#1d1d1f">Contoso Enterprise souhaite gérer ce Mac</p>
      <div class="btn">Autoriser</div>
    </div>
  </body></html>`;
}

function renderMacLogin(entry) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { margin:0; width:1920px; height:1080px; background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width=\"1920\" height=\"1080\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0%\" stop-color=\"%231a1a2e\"/><stop offset=\"100%\" stop-color=\"%2316213e\"/></linearGradient></defs><rect width=\"100%\" height=\"100%\" fill=\"url(%23g)\"/></svg>'); font-family:${FONT}; display:flex; align-items:center; justify-content:center; }
    .login { width:360px; text-align:center; color:#fff; }
    .avatar { width:80px; height:80px; border-radius:50%; background:#0078d4; margin:0 auto 16px; display:flex; align-items:center; justify-content:center; font-size:32px; }
    h2 { font-size:22px; font-weight:600; margin-bottom:8px; }
    p { font-size:14px; opacity:.8; margin-bottom:24px; }
    input { width:100%; padding:12px; border-radius:8px; border:none; margin-bottom:12px; font-size:15px; }
    .sso { font-size:12px; opacity:.7; margin-top:16px; }
  </style></head><body>
    <div class="login">
      <div class="avatar">👤</div>
      <h2>${esc(entry.title)}</h2>
      <p>Platform SSO · Microsoft Entra ID</p>
      <input placeholder="Mot de passe" value="••••••••" readonly />
      <div style="background:#0078d4;padding:12px;border-radius:8px;font-weight:600">Se connecter</div>
      <p class="sso">Authentification fédérée · mot de passe synchronisé</p>
    </div>
  </body></html>`;
}

function renderMfa(entry) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { margin:0; width:1920px; height:1080px; background:#f3f2f1; font-family:${FONT}; display:flex; align-items:center; justify-content:center; }
    .box { width:440px; background:#fff; border-radius:8px; padding:40px; box-shadow:0 4px 20px rgba(0,0,0,.1); text-align:center; border-top:4px solid #0078d4; }
    h2 { font-size:22px; margin-bottom:12px; color:#323130; }
    p { color:#605e5c; font-size:14px; margin-bottom:24px; }
    .code { display:flex; gap:8px; justify-content:center; margin:24px 0; }
    .digit { width:48px; height:56px; border:1px solid #d2d2d7; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:700; }
  </style></head><body>
    <div class="box">
      <div style="font-size:40px;margin-bottom:16px">📱</div>
      <h2>${esc(entry.title)}</h2>
      <p>${esc(entry.scenePrompt)}</p>
      <div class="code"><div class="digit">4</div><div class="digit">8</div><div class="digit">•</div><div class="digit">•</div><div class="digit">•</div><div class="digit">•</div></div>
      <p style="font-size:13px">Microsoft Authenticator</p>
    </div>
  </body></html>`;
}

function renderMacSettings(entry) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { margin:0; width:1920px; height:1080px; background:#f5f5f5; font-family:${FONT}; display:flex; }
    .sidebar { width:280px; background:#ebebeb; padding:24px 0; border-right:1px solid #d2d2d7; }
    .sidebar h3 { padding:0 20px 16px; font-size:13px; color:#6e6e73; font-weight:600; }
    .item { padding:10px 20px; font-size:14px; color:#1d1d1f; }
    .item.active { background:#007aff; color:#fff; border-radius:8px; margin:0 8px; }
    .pane { flex:1; padding:40px 48px; }
    h1 { font-size:28px; font-weight:700; margin-bottom:24px; }
    .row { display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid #e8e8ed; font-size:15px; }
    .on { color:#34c759; font-weight:600; }
  </style></head><body>
    <div class="sidebar"><h3>Réglages Système</h3>
      <div class="item">Général</div><div class="item active">Confidentialité et sécurité</div><div class="item">Réseau</div></div>
    <div class="pane">
      <h1>${esc(entry.title)}</h1>
      <div class="row"><span>${esc(entry.scenePrompt.split(",")[0])}</span><span class="on">Activé</span></div>
      <div class="row"><span>Statut MDM</span><span class="on">Géré par l'organisation</span></div>
      <div class="row"><span>Clé de récupération</span><span>Escrow Intune/Jamf</span></div>
      <div class="row"><span>Dernière vérification</span><span>5 juin 2026</span></div>
    </div>
  </body></html>`;
}

function renderExam(entry) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { margin:0; width:1920px; height:1080px; background:#f5f5f7; font-family:${FONT}; }
    .header { background:#1d1d1f; color:#fff; padding:20px 40px; display:flex; justify-content:space-between; align-items:center; }
    .header h1 { font-size:18px; font-weight:600; }
    .timer { background:#ff9500; padding:8px 16px; border-radius:8px; font-weight:700; font-size:14px; }
    .body { max-width:900px; margin:48px auto; padding:0 40px; }
    .q { font-size:13px; color:#86868b; margin-bottom:8px; }
    .question { font-size:22px; font-weight:600; margin-bottom:32px; line-height:1.4; }
    .opt { background:#fff; border:1px solid #d2d2d7; border-radius:12px; padding:18px 20px; margin-bottom:12px; font-size:16px; }
    .opt.selected { border-color:#0071e3; background:#f0f7ff; }
  </style></head><body>
    <div class="header"><h1>🍎 ${esc(entry.title)}</h1><div class="timer">⏱ 01:42:18</div></div>
    <div class="body">
      <p class="q">Question 24 / 100</p>
      <p class="question">${esc(entry.scenePrompt.split(".")[0])} — Quelle est la procédure correcte en entreprise ?</p>
      <div class="opt selected">A. Configurer via Apple Business Manager puis assigner au serveur MDM</div>
      <div class="opt">B. Enrôler manuellement sans supervision</div>
      <div class="opt">C. Utiliser un Apple ID personnel pour le déploiement</div>
      <div class="opt">D. Ignorer le certificat APNs pour les appareils supervisés</div>
    </div>
  </body></html>`;
}

function renderExamResults(entry) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { margin:0; width:1920px; height:1080px; background:linear-gradient(180deg,#f5f5f7,#e8f4fd); font-family:${FONT}; display:flex; align-items:center; justify-content:center; }
    .card { width:560px; background:#fff; border-radius:24px; padding:48px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,.08); }
    .score { font-size:72px; font-weight:800; color:#34c759; margin:16px 0; }
    h2 { font-size:24px; font-weight:700; }
    p { color:#6e6e73; margin-top:12px; font-size:15px; }
    .domains { margin-top:32px; text-align:left; }
    .domain { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #e8e8ed; font-size:14px; }
  </style></head><body>
    <div class="card">
      <h2>${esc(entry.title)}</h2>
      <div class="score">87%</div>
      <p>Réussi · Seuil 80%</p>
      <div class="domains">
        <div class="domain"><span>ABM & ADE</span><span style="color:#34c759;font-weight:600">92%</span></div>
        <div class="domain"><span>Intune Apple</span><span style="color:#34c759;font-weight:600">85%</span></div>
        <div class="domain"><span>APNs</span><span style="color:#ff9500;font-weight:600">78%</span></div>
      </div>
    </div>
  </body></html>`;
}

const JAMF_SCREENS = {
  "65": {
    section: "Computers",
    title: "Computers",
    subtitle: "Inventaire Mac avec recherche avancée, statut MDM et extension attributes.",
    headers: ["Computer", "Serial Number", "macOS", "Last Check-in", "FileVault", "MDM"],
    rows: [
      ["MacBook-Pro-141", "C02ZQ1ABQ6L4", "15.4", "Today 09:18", "Enabled", "Managed"],
      ["Mac-mini-M4-023", "FVFHK2QWP7QM", "15.4", "Today 08:52", "Enabled", "Managed"],
      ["MacBook-Air-Sales-17", "H9QK72LQ6L7X", "14.7", "Yesterday", "Pending", "Managed"],
      ["iMac-Design-04", "C07DFG45P8J2", "15.3", "2 days ago", "Enabled", "Managed"],
    ],
  },
  "67": {
    section: "Smart Computer Groups",
    title: "Smart Groups",
    subtitle: "Critères dynamiques utilisés pour le scope des policies et profils.",
    headers: ["Smart Group", "Criteria", "Operator", "Members", "Used by"],
    rows: [
      ["Macs - FileVault Missing", "FileVault 2 Status", "is not Encrypted", "18", "Security policy"],
      ["macOS 15 Production", "Operating System Version", "greater than 15.0", "326", "Configuration profiles"],
      ["Sales Department", "Department", "is Sales", "74", "Self Service"],
      ["Chrome Outdated", "Application Version", "less than 126", "41", "Patch policy"],
    ],
  },
  "68": {
    section: "Static Computer Groups",
    title: "Static Groups",
    subtitle: "Groupes manuels pour pilotes, exceptions et populations temporaires.",
    headers: ["Static Group", "Type", "Members", "Owner", "Purpose"],
    rows: [
      ["Pilot - macOS Update", "Computers", "12", "IT Operations", "Release validation"],
      ["VIP Exclusions", "Computers", "8", "Support L2", "Deployment exception"],
      ["Jamf 100 Lab Devices", "Computers", "15", "Training", "Hands-on labs"],
      ["Self Service Beta", "Users", "23", "Apps team", "Catalog pilot"],
    ],
  },
  "69": {
    section: "Policies",
    title: "Policy: Install Microsoft Teams",
    subtitle: "Déploiement de packages, scripts, triggers, fréquence et scope.",
    headers: ["Payload", "Value", "Status", "Frequency", "Scope"],
    rows: [
      ["Trigger", "Recurring Check-in + Self Service", "Enabled", "Ongoing", "Sales Macs"],
      ["Package", "Microsoft_Teams_2.1.pkg", "Ready", "Once per computer", "Required"],
      ["Script", "postinstall-teams-cache.sh", "Ready", "After install", "Required"],
      ["Maintenance", "Update Inventory", "Enabled", "After policy", "All scoped"],
    ],
  },
  "70": {
    section: "Configuration Profiles",
    title: "macOS Configuration Profile",
    subtitle: "Payloads Wi-Fi, restrictions, PPPC et certificats avec scope Jamf.",
    headers: ["Payload", "Identifier", "Platform", "Scope", "Status"],
    rows: [
      ["Wi-Fi", "com.apple.wifi.managed", "macOS", "All Managed Macs", "Distributed"],
      ["PPPC", "com.apple.TCC.configuration-profile-policy", "macOS", "EDR Macs", "Distributed"],
      ["Restrictions", "com.apple.applicationaccess", "iOS/iPadOS", "Corporate iPads", "Distributed"],
      ["Certificates", "com.apple.security.pkcs1", "macOS", "VPN Users", "Pending"],
    ],
  },
  "71": {
    section: "Packages",
    title: "Package Repository",
    subtitle: "PKG et DMG prêts à être déployés via policies Jamf.",
    headers: ["Package", "Version", "Category", "Size", "Indexed"],
    rows: [
      ["Microsoft_Office_16.86.pkg", "16.86", "Productivity", "2.1 GB", "Yes"],
      ["GoogleChrome.pkg", "126.0", "Browsers", "219 MB", "Yes"],
      ["CompanyVPN.pkg", "5.4.2", "Security", "84 MB", "Yes"],
      ["EDR-Agent.pkg", "7.12", "Security", "186 MB", "Yes"],
    ],
  },
  "72": {
    section: "Scripts",
    title: "Scripts",
    subtitle: "Scripts bash/zsh avec paramètres Jamf et journalisation.",
    headers: ["Script", "Language", "Parameters", "Last modified", "Used in policies"],
    rows: [
      ["enable-filevault-escrow.sh", "zsh", "$4 Recovery key policy", "Today", "3"],
      ["install-rosetta.sh", "bash", "None", "May 28", "6"],
      ["cleanup-user-cache.sh", "zsh", "$4 Username", "May 21", "2"],
      ["ea-check-crowdstrike.sh", "bash", "Extension Attribute", "May 12", "1"],
    ],
  },
  "73": {
    section: "Patch Management",
    title: "Patch Management",
    subtitle: "Conformité logicielle, versions disponibles et politiques de patch.",
    headers: ["Software title", "Latest", "Installed current", "Missing patch", "Policy"],
    rows: [
      ["Google Chrome", "126.0.6478", "82%", "31 Macs", "Required in 7 days"],
      ["Slack", "4.39", "91%", "12 Macs", "Self Service"],
      ["Zoom Workplace", "6.1", "78%", "48 Macs", "Required in 14 days"],
      ["Microsoft Teams", "2.1", "86%", "19 Macs", "Required"],
    ],
  },
  "75": {
    section: "Enrollment",
    title: "Automated Device Enrollment",
    subtitle: "Configuration ADE/DEP et liaison Apple Business Manager à Jamf Pro.",
    headers: ["MDM Server", "Token expires", "Devices assigned", "Last sync", "Status"],
    rows: [
      ["Jamf Pro Production", "Mar 21, 2027", "842", "Today 08:15", "Active"],
      ["Jamf Pro Pilot", "Nov 14, 2026", "36", "Today 08:12", "Active"],
      ["Legacy DEP Token", "Jul 03, 2026", "0", "Yesterday", "Retiring"],
      ["ABM Reseller Sync", "Connected", "18 new", "Today", "Healthy"],
    ],
  },
  "76": {
    section: "PreStage Enrollments",
    title: "macOS PreStage Enrollment",
    subtitle: "Skip Setup Assistant, compte admin local et packages initiaux.",
    headers: ["PreStage", "Platform", "Devices", "Account settings", "Status"],
    rows: [
      ["Mac - Production", "macOS", "412", "Local admin created", "Enabled"],
      ["Mac - Developers", "macOS", "86", "Admin hidden", "Enabled"],
      ["iPad - Shared", "iPadOS", "214", "Shared iPad", "Enabled"],
      ["Mac - Kiosk", "macOS", "19", "Auto advance setup", "Pilot"],
    ],
  },
  "77": {
    section: "Self Service",
    title: "Self Service Catalog",
    subtitle: "Catalogue utilisateur pour apps, scripts et ressources internes.",
    headers: ["Item", "Category", "Trigger", "Installs", "Visible to"],
    rows: [
      ["Install Microsoft Teams", "Productivity", "Self Service", "326", "All staff"],
      ["Reset Company VPN", "Support", "Self Service", "74", "VPN Users"],
      ["Install Chrome", "Browsers", "Self Service", "512", "All managed Macs"],
      ["Printer Setup", "Office", "Self Service", "91", "Paris Office"],
    ],
  },
  "78": {
    section: "Jamf Protect",
    title: "Jamf Protect Alerts",
    subtitle: "Analytics, menaces macOS, plans de protection et remédiation.",
    headers: ["Alert", "Severity", "Device", "MITRE tactic", "Status"],
    rows: [
      ["Suspicious LaunchAgent", "High", "MacBook-Pro-141", "Persistence", "Open"],
      ["Unsigned binary executed", "Medium", "iMac-Design-04", "Execution", "Investigating"],
      ["CIS benchmark failed", "Low", "Mac-mini-M4-023", "Defense Evasion", "Remediated"],
      ["Gatekeeper bypass attempt", "High", "MacBook-Air-Sales-17", "Execution", "Open"],
    ],
  },
};

function renderJamf(entry) {
  const screen = JAMF_SCREENS[entry.id] ?? JAMF_SCREENS["65"];
  const rows = screen.rows
    .map((row) => `<tr>${row.map((cell, i) => `<td${i === row.length - 1 ? ' class="state"' : ""}>${esc(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${FONT}; width: 1920px; height: 1080px; background: #f6f8fb; color: #1f2937; overflow: hidden; }
    .shell { display: flex; height: 100vh; }
    .side { width: 250px; background: #111827; color: #d1d5db; padding: 22px 0; }
    .brand { padding: 0 22px 24px; color: #fff; font-size: 20px; font-weight: 800; }
    .nav { padding: 11px 22px; font-size: 14px; color: #cbd5e1; }
    .nav.active { background: rgba(120,190,32,.16); color: #fff; border-left: 4px solid #78be20; padding-left: 18px; font-weight: 700; }
    .main { flex: 1; display: flex; flex-direction: column; }
    .top { height: 54px; background: #fff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; gap: 18px; padding: 0 28px; font-size: 13px; color: #6b7280; }
    .url { flex: 1; background: #f3f4f6; border-radius: 8px; padding: 8px 14px; color: #374151; }
    .content { padding: 34px 40px; }
    .eyebrow { color: #78be20; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
    h1 { font-size: 36px; letter-spacing: -.03em; margin-bottom: 8px; color: #111827; }
    .subtitle { color: #64748b; font-size: 16px; margin-bottom: 28px; }
    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px; box-shadow: 0 1px 2px rgba(15,23,42,.04); }
    .label { color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 700; }
    .value { color: #111827; font-size: 30px; font-weight: 800; margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 10px 24px rgba(15,23,42,.04); }
    th { text-align: left; padding: 16px 18px; background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
    td { padding: 17px 18px; border-top: 1px solid #eef2f7; font-size: 15px; color: #1f2937; }
    .state { color: #15803d; font-weight: 800; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .search { width: 420px; border: 1px solid #d1d5db; border-radius: 9px; padding: 11px 14px; color: #64748b; background: #fff; }
    .btn { background: #78be20; color: #fff; border-radius: 999px; padding: 10px 18px; font-weight: 800; font-size: 13px; }
  </style></head><body>
    <div class="shell">
      <aside class="side">
        <div class="brand">Jamf Pro</div>
        ${["Dashboard", "Computers", "Mobile Devices", "Policies", "Configuration Profiles", "Settings"].map((item) => `<div class="nav${screen.section.includes(item) || screen.title.includes(item) ? " active" : ""}">${item}</div>`).join("")}
      </aside>
      <main class="main">
        <div class="top"><span>🔒</span><div class="url">yourorg.jamfcloud.com</div><span>Contoso IT</span><span>Admin</span></div>
        <section class="content">
          <div class="eyebrow">${esc(screen.section)}</div>
          <h1>${esc(screen.title)}</h1>
          <p class="subtitle">${esc(screen.subtitle)}</p>
          <div class="cards">
            <div class="card"><div class="label">Managed Macs</div><div class="value">842</div></div>
            <div class="card"><div class="label">Policies</div><div class="value">128</div></div>
            <div class="card"><div class="label">Profiles</div><div class="value">47</div></div>
            <div class="card"><div class="label">Alerts</div><div class="value">9</div></div>
          </div>
          <div class="toolbar"><input class="search" value="Search ${esc(screen.section)}" readonly /><span class="btn">New</span></div>
          <table><thead><tr>${screen.headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>
        </section>
      </main>
    </div>
  </body></html>`;
}

function renderIntuneAbmImport(entry) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: ${FONT}; width: 1920px; height: 1080px; overflow: hidden; background: #faf9f8; color: #323130; }
    .shell { display: flex; height: 100vh; }
    .global-nav { width: 48px; background: #f3f2f1; border-right: 1px solid #edebe9; display: flex; flex-direction: column; align-items: center; padding-top: 12px; gap: 4px; }
    .global-nav span { width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #605e5c; }
    .global-nav span.active { background: #edebe9; color: #0078d4; }
    .sidebar { width: 248px; background: #faf9f8; border-right: 1px solid #edebe9; padding: 16px 0; flex-shrink: 0; }
    .sidebar-title { padding: 8px 20px 16px; font-size: 15px; font-weight: 600; color: #323130; }
    .nav-group { margin-bottom: 8px; }
    .nav-label { padding: 8px 20px 4px; font-size: 11px; font-weight: 600; color: #605e5c; text-transform: uppercase; letter-spacing: .04em; }
    .nav-item { padding: 8px 20px 8px 28px; font-size: 14px; color: #323130; }
    .nav-item.active { background: #edebe9; font-weight: 600; border-left: 3px solid #0078d4; padding-left: 25px; }
    .nav-item.sub { padding-left: 40px; font-size: 13px; color: #605e5c; }
    .nav-item.sub.active { color: #323130; font-weight: 600; }
    .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .topbar { height: 48px; background: #fff; border-bottom: 1px solid #edebe9; display: flex; align-items: center; padding: 0 24px; gap: 12px; font-size: 13px; color: #605e5c; }
    .search { flex: 1; max-width: 420px; background: #f3f2f1; border: 1px solid transparent; border-radius: 4px; padding: 6px 12px; font-size: 13px; color: #605e5c; }
    .content { flex: 1; padding: 24px 32px; position: relative; }
    .breadcrumb { font-size: 13px; color: #605e5c; margin-bottom: 16px; }
    .breadcrumb a { color: #0078d4; text-decoration: none; }
    h1 { font-size: 24px; font-weight: 600; color: #323130; margin-bottom: 4px; }
    .desc { font-size: 14px; color: #605e5c; margin-bottom: 24px; max-width: 720px; line-height: 1.5; }
    .toolbar { display: flex; gap: 8px; margin-bottom: 20px; }
    .btn-primary { background: #0078d4; color: #fff; border: none; padding: 6px 16px; border-radius: 2px; font-size: 14px; font-weight: 600; font-family: inherit; }
    .btn-default { background: #fff; color: #323130; border: 1px solid #8a8886; padding: 6px 16px; border-radius: 2px; font-size: 14px; font-family: inherit; }
    table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #edebe9; font-size: 13px; }
    th { text-align: left; padding: 10px 16px; background: #faf9f8; border-bottom: 1px solid #edebe9; font-weight: 600; color: #323130; }
    td { padding: 10px 16px; border-bottom: 1px solid #edebe9; color: #323130; }
    .status-active { color: #107c10; font-weight: 600; }
    .blade-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.25); display: flex; justify-content: flex-end; }
    .blade { width: 520px; height: 100%; background: #fff; box-shadow: -8px 0 24px rgba(0,0,0,.12); display: flex; flex-direction: column; }
    .blade-header { padding: 20px 24px 16px; border-bottom: 1px solid #edebe9; }
    .blade-header h2 { font-size: 20px; font-weight: 600; color: #323130; }
    .blade-header p { font-size: 13px; color: #605e5c; margin-top: 6px; line-height: 1.45; }
    .blade-body { flex: 1; padding: 24px; overflow: hidden; }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-size: 14px; font-weight: 600; color: #323130; margin-bottom: 6px; }
    .field label span { color: #a4262c; }
    .field input[type=text] { width: 100%; padding: 8px 10px; border: 1px solid #605e5c; border-radius: 2px; font-size: 14px; font-family: inherit; background: #fff; }
    .field .hint { font-size: 12px; color: #605e5c; margin-top: 6px; line-height: 1.4; }
    .upload-zone { border: 2px dashed #0078d4; border-radius: 4px; padding: 28px 20px; text-align: center; background: #f3f9fd; }
    .upload-zone .file { display: inline-flex; align-items: center; gap: 10px; background: #fff; border: 1px solid #edebe9; border-radius: 4px; padding: 10px 16px; margin-top: 12px; font-size: 13px; font-weight: 600; color: #323130; }
    .upload-zone .file-icon { width: 32px; height: 32px; background: #0078d4; border-radius: 4px; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
    .upload-zone p { font-size: 13px; color: #605e5c; }
    .info-box { background: #f3f2f1; border-left: 4px solid #0078d4; padding: 12px 16px; margin-top: 20px; font-size: 12px; color: #323130; line-height: 1.5; }
    .blade-footer { padding: 16px 24px; border-top: 1px solid #edebe9; display: flex; gap: 8px; justify-content: flex-end; background: #faf9f8; }
    .ms-logo { font-size: 13px; font-weight: 600; color: #0078d4; letter-spacing: -.01em; }
  </style></head><body>
  <div class="shell">
    <nav class="global-nav"><span>☰</span><span class="active">⊞</span><span>⚙</span></nav>
    <aside class="sidebar">
      <div class="sidebar-title">Microsoft Intune admin center</div>
      <div class="nav-group">
        <div class="nav-label">Devices</div>
        <div class="nav-item">Overview</div>
        <div class="nav-item active">Enroll devices</div>
        <div class="nav-item sub">Windows</div>
        <div class="nav-item sub active">Apple</div>
        <div class="nav-item sub">Android</div>
        <div class="nav-item">Monitor</div>
        <div class="nav-item">Manage devices</div>
      </div>
      <div class="nav-group">
        <div class="nav-label">Apps</div>
        <div class="nav-item">All apps</div>
      </div>
    </aside>
    <div class="main">
      <div class="topbar">
        <span class="ms-logo">Microsoft Intune</span>
        <input class="search" value="Search for resources, services, and docs" readonly />
        <span>Contoso Ltd</span>
        <span>Admin</span>
      </div>
      <div class="content">
        <div class="breadcrumb"><a href="#">Home</a> &gt; <a href="#">Devices</a> &gt; <a href="#">Enroll devices</a> &gt; Apple &gt; Enrollment program tokens</div>
        <h1>Enrollment program tokens</h1>
        <p class="desc">Import tokens from Apple Business Manager to enable Automated Device Enrollment (ADE) for supervised Apple devices.</p>
        <div class="toolbar">
          <button class="btn-primary">+ Add</button>
          <button class="btn-default">Refresh</button>
          <button class="btn-default">Export</button>
        </div>
        <table>
          <thead><tr><th>Token name</th><th>Serial number</th><th>Expiration date</th><th>Last sync</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td colspan="5" style="color:#605e5c;text-align:center;padding:32px">No tokens configured — use Add to import server_token.p7m from Apple Business Manager</td></tr>
          </tbody>
        </table>
        <div class="blade-overlay">
          <div class="blade">
            <div class="blade-header">
              <h2>Add enrollment program token</h2>
              <p>Upload the server token (.p7m) downloaded from Apple Business Manager after linking your MDM server.</p>
            </div>
            <div class="blade-body">
              <div class="field">
                <label>Token name <span>*</span></label>
                <input type="text" value="ABM Production — Contoso" readonly />
                <p class="hint">Friendly name to identify this token in Intune.</p>
              </div>
              <div class="field">
                <label>Apple ID <span>*</span></label>
                <input type="text" value="mdm-admin@contoso.com" readonly />
                <p class="hint">Apple ID used to download the token in Apple Business Manager.</p>
              </div>
              <div class="field">
                <label>Token file (.p7m) <span>*</span></label>
                <div class="upload-zone">
                  <p>Drag and drop your token file, or browse</p>
                  <div class="file">
                    <div class="file-icon">P7M</div>
                    <div>
                      <div>server_token.p7m</div>
                      <div style="font-weight:400;color:#605e5c;font-size:12px">12.4 KB · Ready to upload</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="info-box">
                After upload, Intune syncs devices assigned to this MDM server in Apple Business Manager. Renew the token before expiration (365 days).
              </div>
            </div>
            <div class="blade-footer">
              <button class="btn-default">Cancel</button>
              <button class="btn-primary">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body></html>`;
}

export function renderScreenshotHtml(entry) {
  const themeKey = entry.category === "apps-books" ? "apps-books" : entry.category;
  const theme = THEMES[themeKey] ?? THEMES["apple-business-manager"];
  const layout = layoutFor(entry);

  if (entry.category === "jamf") {
    return renderJamf(entry);
  }

  switch (layout) {
    case "login":
      return renderLogin(theme, entry);
    case "dashboard":
      return renderDashboard(theme, entry);
    case "wizard":
      return renderWizard(theme, entry);
    case "ios-setup":
      return renderIosSetup(entry);
    case "mac-setup":
      return renderMacSetup(entry);
    case "mac-login":
      return renderMacLogin(entry);
    case "mfa":
      return renderMfa(entry);
    case "mac-settings":
      return renderMacSettings(entry);
    case "exam":
      return renderExam(entry);
    case "exam-results":
      return renderExamResults(entry);
    case "intune-abm-import":
      return renderIntuneAbmImport(entry);
    default:
      return renderConsole(theme, entry);
  }
}
