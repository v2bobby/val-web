// REEP — Live App Dashboard (simulated)
// Uses localStorage to persist demo state across sessions.

const APP_STORAGE_KEY = 'reep_app_state_v1';

const DEFAULT_STATE = {
  vault: {
    health: 92,
    assets: 14,
    storageUsed: 1.2,
    storageTotal: 10,
    lastCheckIn: new Date().toISOString(),
    checkInWindow: 30,
    status: 'live',
  },
  assets: [
    { id: 1, category: 'financial', title: 'Primary crypto wallet', detail: 'BTC / ETH seed phrase · 2-of-3 guardians', updated: '2026-07-20' },
    { id: 2, category: 'financial', title: 'Insurance policies', detail: 'Life & home policy documents', updated: '2026-07-18' },
    { id: 3, category: 'legal', title: 'Will & power of attorney', detail: 'Notarized PDF · uploaded 2026-06-12', updated: '2026-06-12' },
    { id: 4, category: 'legal', title: 'Birth certificate scan', detail: 'Official scan · encrypted', updated: '2026-06-10' },
    { id: 5, category: 'identity', title: 'Google Account credentials', detail: 'Recovery key stored', updated: '2026-07-15' },
    { id: 6, category: 'identity', title: 'Domain registrar access', detail: 'Namecheap + Cloudflare', updated: '2026-07-01' },
    { id: 7, category: 'personal', title: 'Letter to my children', detail: 'Video message · 4 min', updated: '2026-07-22' },
    { id: 8, category: 'personal', title: 'Family photo archive', detail: '1.2 GB · encrypted', updated: '2026-05-30' },
  ],
  guardians: [
    { id: 1, name: 'Adaeze Okeke', relation: 'Sister', email: 'adaeze@example.com', status: 'verified', joined: '2026-06-15' },
    { id: 2, name: 'Marcus Chen', relation: 'Family lawyer', email: 'marcus@example.com', status: 'verified', joined: '2026-06-20' },
    { id: 3, name: 'Ibrahim K.', relation: 'Close friend', email: 'ibrahim@example.com', status: 'pending', joined: '2026-07-24' },
  ],
  beneficiaries: [
    { id: 1, name: 'Adaeze Okeke', relation: 'Daughter', release: 'immediate', items: 8 },
    { id: 2, name: 'Jonas U. Jr.', relation: 'Son', release: 'age_18', items: 4 },
    { id: 3, name: 'Ngozi Foundation', relation: 'Charity', release: 'probate', items: 2 },
  ],
  activity: [
    { id: 1, action: 'Heartbeat check-in confirmed', time: 'Today, 08:14 AM', type: 'success' },
    { id: 2, action: 'Guardian invite sent to Ibrahim K.', time: 'Yesterday, 04:22 PM', type: 'info' },
    { id: 3, action: 'Video message added to Personal vault', time: 'Jul 22, 2026', type: 'info' },
    { id: 4, action: 'Crypto wallet seed phrase updated', time: 'Jul 20, 2026', type: 'warning' },
    { id: 5, action: 'Vault encryption keys rotated', time: 'Jul 15, 2026', type: 'success' },
  ],
  audit: [
    { id: 1, event: 'Vault accessed from Chrome · Nigeria', time: '2026-07-25 08:14 UTC', hash: 'a7f3...9e2c' },
    { id: 2, event: 'Guardian verification request viewed', time: '2026-07-24 16:02 UTC', hash: 'b8e1...4d5a' },
    { id: 3, event: 'Asset added: Video message', time: '2026-07-22 11:30 UTC', hash: 'c9d2...1f8b' },
    { id: 4, event: 'Encryption key rotation', time: '2026-07-15 09:45 UTC', hash: 'd0e3...7c6d' },
  ],
  viewedWelcome: false,
};

function loadState() {
  try {
    const raw = localStorage.getItem(APP_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return structuredClone(DEFAULT_STATE);
}

function saveState(state) {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

let state = loadState();

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function timeAgo(iso) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const minutes = Math.floor((now - then) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function categoryLabel(cat) {
  const map = {
    financial: 'Financial & Crypto',
    legal: 'Legal & Identity',
    identity: 'Digital Identity',
    personal: 'Personal Legacy',
  };
  return map[cat] || cat;
}

function categoryIcon(cat) {
  const map = {
    financial: '<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/>',
    legal: '<path d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 7-3.5A4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10Z"/>',
    identity: '<circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
    personal: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  };
  return map[cat] || '';
}

function renderNav() {
  const links = document.querySelectorAll('.app-nav a');
  links.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const section = a.dataset.section;
      showSection(section);
    });
  });
}

function setActiveNav(section) {
  document.querySelectorAll('.app-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.section === section);
  });
}

function showSection(section) {
  setActiveNav(section);
  const main = document.getElementById('appMainContent');
  if (!main) return;

  const renderers = {
    dashboard: renderDashboard,
    vault: renderVault,
    guardians: renderGuardians,
    heartbeat: renderHeartbeat,
    beneficiaries: renderBeneficiaries,
    security: renderSecurity,
  };

  main.innerHTML = renderers[section] ? renderers[section]() : renderDashboard();
  main.scrollTop = 0;
  attachSectionHandlers(section);
  closeMobileSidebar();
}

function renderDashboard() {
  const health = state.vault.health;
  const storagePct = Math.round((state.vault.storageUsed / state.vault.storageTotal) * 100);
  const lastCheck = timeAgo(state.vault.lastCheckIn);

  return `
    <div class="app-section-title">
      <div>
        <div class="eyebrow" style="margin-bottom:0.5rem;">Dashboard</div>
        <h2>Vault overview</h2>
      </div>
      <span class="status-pill live"><span class="status-dot live"></span> Systems operational</span>
    </div>

    <div class="app-grid" style="margin-bottom:1.5rem;">
      <div class="app-card">
        <p style="color:var(--slate);font-size:0.85rem;font-weight:500;">Vault health</p>
        <div class="app-metric">${health}%</div>
        <div class="progress-bar" style="margin-top:0.75rem;"><span style="width:${health}%"></span></div>
      </div>
      <div class="app-card">
        <p style="color:var(--slate);font-size:0.85rem;font-weight:500;">Assets secured</p>
        <div class="app-metric">${state.assets.length}</div>
        <p style="color:var(--slate-dim);font-size:0.82rem;margin-top:0.35rem;">Across 4 categories</p>
      </div>
      <div class="app-card">
        <p style="color:var(--slate);font-size:0.85rem;font-weight:500;">Storage used</p>
        <div class="app-metric">${state.vault.storageUsed} <span style="font-size:1rem;color:var(--slate-dim);">/ ${state.vault.storageTotal} GB</span></div>
        <div class="progress-bar" style="margin-top:0.75rem;"><span style="width:${storagePct}%"></span></div>
      </div>
      <div class="app-card">
        <p style="color:var(--slate);font-size:0.85rem;font-weight:500;">Last heartbeat</p>
        <div class="app-metric" style="font-size:1.6rem;">${lastCheck}</div>
        <p style="color:var(--slate-dim);font-size:0.82rem;margin-top:0.35rem;">Window: ${state.vault.checkInWindow} days</p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:1.5rem;">
      <div class="app-card">
        <div class="app-section-title" style="margin-bottom:0.75rem;">
          <h3>Recent activity</h3>
          <button class="btn btn-sm btn-secondary" onclick="appResetState()">Reset demo</button>
        </div>
        <div style="display:flex;flex-direction:column;">
          ${state.activity.slice(0, 5).map(item => `
            <div class="app-activity-item">
              <div class="app-activity-icon">
                <svg class="app-icon" viewBox="0 0 24 24" style="stroke:var(--continuity-deep);">${activityIcon(item.type)}</svg>
              </div>
              <div style="flex:1;">
                <p style="color:var(--ink);font-weight:500;font-size:0.95rem;">${item.action}</p>
                <p style="color:var(--slate-dim);font-size:0.82rem;margin-top:0.15rem;">${item.time}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="app-card-dark">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
          <span class="status-dot live"></span>
          <span style="font-size:0.85rem;font-weight:600;">Heartbeat active</span>
        </div>
        <p style="color:var(--mist);font-size:0.95rem;line-height:1.6;margin-bottom:1.25rem;">Your next check-in is not due for ${Math.max(0, state.vault.checkInWindow - 1)} days. If you miss it, guardians will be notified to begin verification.</p>
        <button class="btn btn-primary" onclick="appCheckIn()">Check in now</button>
        <div class="heartbeat-line" style="margin-top:1.25rem;height:40px;">
          <svg viewBox="0 0 1200 64" preserveAspectRatio="none">
            <path class="heartbeat-path" d="M0,32 L260,32 L300,32 L320,8 L345,58 L368,16 L390,32 L460,32 L900,32 L925,32 L945,10 L968,54 L990,20 L1010,32 L1200,32"/>
          </svg>
        </div>
      </div>
    </div>
  `;
}

function activityIcon(type) {
  if (type === 'success') return '<polyline points="20 6 9 17 4 12"/>';
  if (type === 'warning') return '<path d="M12 9v4m0 4h.01"/><circle cx="12" cy="12" r="10"/>';
  return '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>';
}

function renderVault() {
  const categories = ['financial', 'legal', 'identity', 'personal'];
  return `
    <div class="app-section-title">
      <div>
        <div class="eyebrow" style="margin-bottom:0.5rem;">Vault</div>
        <h2>Your secured assets</h2>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openAddAssetModal()">+ Add asset</button>
    </div>

    <div class="app-grid">
      ${categories.map(cat => {
        const items = state.assets.filter(a => a.category === cat);
        return `
          <div class="app-card" style="display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;">
              <div style="width:36px;height:36px;border-radius:10px;background:rgba(43,179,137,0.1);display:flex;align-items:center;justify-content:center;">
                <svg class="app-icon" viewBox="0 0 24 24" style="stroke:var(--continuity-deep);width:18px;height:18px;">${categoryIcon(cat)}</svg>
              </div>
              <h3 style="margin:0;">${categoryLabel(cat)}</h3>
            </div>
            <p style="color:var(--slate);font-size:0.9rem;margin-bottom:1rem;flex:1;">${items.length} item${items.length === 1 ? '' : 's'} stored · zero-knowledge encrypted</p>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              ${items.slice(0, 3).map(item => `
                <div style="padding:0.75rem;background:var(--sand);border-radius:var(--radius-md);font-size:0.85rem;">
                  <p style="color:var(--ink);font-weight:500;">${item.title}</p>
                  <p style="color:var(--slate-dim);font-size:0.78rem;margin-top:0.2rem;">${item.detail}</p>
                </div>
              `).join('')}
              ${items.length > 3 ? `<p style="color:var(--slate-dim);font-size:0.78rem;margin-top:0.35rem;">+ ${items.length - 3} more</p>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="app-card" style="margin-top:1.5rem;">
      <h3 style="margin-bottom:1rem;">All assets</h3>
      <table class="data-table">
        <thead>
          <tr><th>Asset</th><th>Category</th><th>Updated</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${state.assets.map(a => `
            <tr>
              <td>
                <p style="font-weight:500;">${a.title}</p>
                <p style="color:var(--slate-dim);font-size:0.78rem;margin-top:0.15rem;">${a.detail}</p>
              </td>
              <td><span class="pill pill-green">${categoryLabel(a.category)}</span></td>
              <td style="color:var(--slate-dim);">${a.updated}</td>
              <td><span class="status-pill live"><span class="status-dot live"></span> Secured</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderGuardians() {
  return `
    <div class="app-section-title">
      <div>
        <div class="eyebrow" style="margin-bottom:0.5rem;">Guardians</div>
        <h2>Trusted contacts</h2>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openInviteGuardianModal()">+ Invite guardian</button>
    </div>

    <div class="app-card">
      <p style="color:var(--slate);margin-bottom:1.25rem;line-height:1.6;">Guardians must reach consensus before any legacy transfer is initiated. Reep recommends 2–5 trusted contacts.</p>
      <table class="data-table">
        <thead>
          <tr><th>Name</th><th>Relation</th><th>Email</th><th>Status</th><th>Joined</th></tr>
        </thead>
        <tbody>
          ${state.guardians.map(g => `
            <tr>
              <td style="font-weight:500;">${g.name}</td>
              <td style="color:var(--slate);">${g.relation}</td>
              <td style="color:var(--slate-dim);font-family:var(--font-mono);font-size:0.82rem;">${g.email}</td>
              <td>${g.status === 'verified' ? '<span class="status-pill live"><span class="status-dot live"></span> Verified</span>' : '<span class="status-pill warn"><span class="status-dot warn"></span> Pending</span>'}</td>
              <td style="color:var(--slate-dim);">${g.joined}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="app-grid" style="margin-top:1.5rem;">
      <div class="app-card">
        <h3>Consensus threshold</h3>
        <p style="font-size:1.6rem;font-weight:700;font-family:var(--font-display);color:var(--ink);margin-top:0.5rem;">2 of ${state.guardians.length}</p>
        <p style="color:var(--slate-dim);font-size:0.85rem;margin-top:0.35rem;">Guardians required to approve a release</p>
      </div>
      <div class="app-card">
        <h3>Verification method</h3>
        <p style="font-size:1.1rem;font-weight:600;color:var(--ink);margin-top:0.5rem;">Email + identity confirmation</p>
        <p style="color:var(--slate-dim);font-size:0.85rem;margin-top:0.35rem;">Each guardian verifies via a secure link</p>
      </div>
    </div>
  `;
}

function renderHeartbeat() {
  const due = new Date(state.vault.lastCheckIn);
  due.setDate(due.getDate() + state.vault.checkInWindow);
  const daysLeft = Math.max(0, Math.ceil((due.getTime() - Date.now()) / 86400000));

  return `
    <div class="app-section-title">
      <div>
        <div class="eyebrow" style="margin-bottom:0.5rem;">Heartbeat</div>
        <h2>Life-event verification</h2>
      </div>
      <button class="btn btn-primary btn-sm" onclick="appCheckIn()">Check in now</button>
    </div>

    <div class="app-grid">
      <div class="app-card">
        <h3>Status</h3>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.75rem;">
          <span class="status-dot live"></span>
          <span style="font-size:1.25rem;font-weight:700;color:var(--ink);">Active</span>
        </div>
        <p style="color:var(--slate);font-size:0.9rem;margin-top:0.75rem;line-height:1.6;">Your heartbeat was last confirmed ${timeAgo(state.vault.lastCheckIn)}. Guardians will only be contacted if the inactivity window expires.</p>
      </div>
      <div class="app-card">
        <h3>Next check-in due</h3>
        <div class="app-metric-sm" style="margin-top:0.5rem;">${daysLeft} day${daysLeft === 1 ? '' : 's'}</div>
        <p style="color:var(--slate-dim);font-size:0.85rem;margin-top:0.35rem;">on ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
      </div>
      <div class="app-card">
        <h3>Inactivity window</h3>
        <div style="margin-top:0.75rem;">
          <label class="app-form-label">Days before guardians are notified</label>
          <select class="app-select" id="checkInWindow" onchange="appUpdateWindow(this.value)">
            <option value="14" ${state.vault.checkInWindow == 14 ? 'selected' : ''}>14 days</option>
            <option value="30" ${state.vault.checkInWindow == 30 ? 'selected' : ''}>30 days</option>
            <option value="60" ${state.vault.checkInWindow == 60 ? 'selected' : ''}>60 days</option>
            <option value="90" ${state.vault.checkInWindow == 90 ? 'selected' : ''}>90 days</option>
          </select>
        </div>
      </div>
    </div>

    <div class="app-card" style="margin-top:1.5rem;">
      <h3 style="margin-bottom:1rem;">How it works</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;">
        <div>
          <p class="font-mono" style="color:var(--continuity-deep);font-size:0.75rem;letter-spacing:0.05em;">LAYER 1</p>
          <p style="font-weight:600;color:var(--ink);margin-top:0.35rem;">Regular check-ins</p>
          <p style="color:var(--slate);font-size:0.9rem;margin-top:0.25rem;line-height:1.5;">Email, SMS, or app prompts keep your vault active.</p>
        </div>
        <div>
          <p class="font-mono" style="color:var(--continuity-deep);font-size:0.75rem;letter-spacing:0.05em;">LAYER 2</p>
          <p style="font-weight:600;color:var(--ink);margin-top:0.35rem;">Guardian consensus</p>
          <p style="color:var(--slate);font-size:0.9rem;margin-top:0.25rem;line-height:1.5;">Multiple guardians must independently confirm a life event.</p>
        </div>
        <div>
          <p class="font-mono" style="color:var(--continuity-deep);font-size:0.75rem;letter-spacing:0.05em;">LAYER 3</p>
          <p style="font-weight:600;color:var(--ink);margin-top:0.35rem;">Official records</p>
          <p style="color:var(--slate);font-size:0.9rem;margin-top:0.25rem;line-height:1.5;">High-tier accounts can require verified documentation.</p>
        </div>
      </div>
    </div>
  `;
}

function renderBeneficiaries() {
  return `
    <div class="app-section-title">
      <div>
        <div class="eyebrow" style="margin-bottom:0.5rem;">Beneficiaries</div>
        <h2>Legacy recipients</h2>
      </div>
      <button class="btn btn-primary btn-sm" onclick="openAddBeneficiaryModal()">+ Add beneficiary</button>
    </div>

    <div class="app-grid">
      ${state.beneficiaries.map(b => `
        <div class="app-card" style="display:flex;flex-direction:column;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <h3 style="margin:0;">${b.name}</h3>
              <p style="color:var(--slate);font-size:0.9rem;margin-top:0.25rem;">${b.relation}</p>
            </div>
            <span class="pill pill-green">${releaseLabel(b.release)}</span>
          </div>
          <div style="margin-top:1.25rem;flex:1;">
            <p style="color:var(--slate-dim);font-size:0.85rem;">Assigned assets</p>
            <p style="font-size:1.6rem;font-weight:700;font-family:var(--font-display);color:var(--ink);">${b.items}</p>
          </div>
          <button class="btn btn-sm btn-secondary" style="margin-top:1rem;" onclick="appPreviewLegacy(${b.id})">Preview legacy dashboard</button>
        </div>
      `).join('')}
    </div>

    <div class="app-card" style="margin-top:1.5rem;">
      <h3 style="margin-bottom:1rem;">Release conditions</h3>
      <table class="data-table">
        <thead>
          <tr><th>Beneficiary</th><th>Condition</th><th>Assets</th></tr>
        </thead>
        <tbody>
          ${state.beneficiaries.map(b => `
            <tr>
              <td style="font-weight:500;">${b.name}</td>
              <td style="color:var(--slate);">${releaseLabel(b.release)}</td>
              <td style="font-weight:600;">${b.items}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function releaseLabel(release) {
  const map = { immediate: 'Immediate release', age_18: 'Release at age 18', probate: 'After probate', time_delay: 'Time-delayed' };
  return map[release] || release;
}

function renderSecurity() {
  return `
    <div class="app-section-title">
      <div>
        <div class="eyebrow" style="margin-bottom:0.5rem;">Security</div>
        <h2>Zero-knowledge vault</h2>
      </div>
      <span class="status-pill live"><span class="status-dot live"></span> Encrypted</span>
    </div>

    <div class="app-grid">
      <div class="app-card">
        <h3>Encryption status</h3>
        <p style="font-size:1.1rem;font-weight:600;color:var(--ink);margin-top:0.75rem;">Client-side AES-256</p>
        <p style="color:var(--slate);font-size:0.9rem;margin-top:0.35rem;line-height:1.6;">Your data is encrypted before it leaves your browser. Reep servers only store ciphertext.</p>
      </div>
      <div class="app-card">
        <h3>Key custody</h3>
        <p style="font-size:1.1rem;font-weight:600;color:var(--ink);margin-top:0.75rem;">You hold the keys</p>
        <p style="color:var(--slate);font-size:0.9rem;margin-top:0.35rem;line-height:1.6;">Reep has no master key, support override, or backdoor.</p>
      </div>
      <div class="app-card">
        <h3>Audit trail</h3>
        <p style="font-size:1.1rem;font-weight:600;color:var(--ink);margin-top:0.75rem;">Tamper-evident log</p>
        <p style="color:var(--slate);font-size:0.9rem;margin-top:0.35rem;line-height:1.6;">Every vault interaction is hashed and logged for review.</p>
      </div>
    </div>

    <div class="app-card" style="margin-top:1.5rem;">
      <h3 style="margin-bottom:1rem;">Audit log</h3>
      <table class="data-table">
        <thead>
          <tr><th>Event</th><th>Time (UTC)</th><th>Hash</th></tr>
        </thead>
        <tbody>
          ${state.audit.map(a => `
            <tr>
              <td style="font-weight:500;">${a.event}</td>
              <td style="color:var(--slate-dim);font-family:var(--font-mono);font-size:0.82rem;">${a.time}</td>
              <td style="color:var(--continuity-deep);font-family:var(--font-mono);font-size:0.82rem;">${a.hash}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ---------------- Modals ---------------- */

function openModal(content) {
  const modal = document.getElementById('appModal');
  const panel = document.getElementById('appModalPanel');
  if (!modal || !panel) return;
  panel.innerHTML = content;
  modal.classList.add('open');
}

function closeModal() {
  const modal = document.getElementById('appModal');
  if (modal) modal.classList.remove('open');
}

function openAddAssetModal() {
  openModal(`
    <h3 style="margin-bottom:0.25rem;">Add asset</h3>
    <p style="color:var(--slate);font-size:0.9rem;margin-bottom:1.25rem;">Simulate adding a new item to your vault.</p>
    <div class="app-form-group">
      <label class="app-form-label">Asset title</label>
      <input class="app-input" id="assetTitle" placeholder="e.g., Secondary bank account">
    </div>
    <div class="app-form-group">
      <label class="app-form-label">Category</label>
      <select class="app-select" id="assetCategory">
        <option value="financial">Financial & Crypto</option>
        <option value="legal">Legal & Identity</option>
        <option value="identity">Digital Identity</option>
        <option value="personal">Personal Legacy</option>
      </select>
    </div>
    <div class="app-form-group">
      <label class="app-form-label">Details</label>
      <input class="app-input" id="assetDetail" placeholder="Short description">
    </div>
    <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="appAddAsset()">Add asset</button>
    </div>
  `);
}

function openInviteGuardianModal() {
  openModal(`
    <h3 style="margin-bottom:0.25rem;">Invite guardian</h3>
    <p style="color:var(--slate);font-size:0.9rem;margin-bottom:1.25rem;">Simulate inviting a trusted contact.</p>
    <div class="app-form-group">
      <label class="app-form-label">Full name</label>
      <input class="app-input" id="guardianName" placeholder="e.g., Sarah Mensah">
    </div>
    <div class="app-form-group">
      <label class="app-form-label">Relation</label>
      <input class="app-input" id="guardianRelation" placeholder="e.g., Cousin">
    </div>
    <div class="app-form-group">
      <label class="app-form-label">Email</label>
      <input class="app-input" id="guardianEmail" type="email" placeholder="sarah@example.com">
    </div>
    <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="appInviteGuardian()">Send invite</button>
    </div>
  `);
}

function openAddBeneficiaryModal() {
  openModal(`
    <h3 style="margin-bottom:0.25rem;">Add beneficiary</h3>
    <p style="color:var(--slate);font-size:0.9rem;margin-bottom:1.25rem;">Simulate adding a legacy recipient.</p>
    <div class="app-form-group">
      <label class="app-form-label">Full name</label>
      <input class="app-input" id="beneficiaryName" placeholder="e.g., Ngozi Okeke">
    </div>
    <div class="app-form-group">
      <label class="app-form-label">Relation</label>
      <input class="app-input" id="beneficiaryRelation" placeholder="e.g., Niece">
    </div>
    <div class="app-form-group">
      <label class="app-form-label">Release condition</label>
      <select class="app-select" id="beneficiaryRelease">
        <option value="immediate">Immediate release</option>
        <option value="age_18">Release at age 18</option>
        <option value="probate">After probate</option>
        <option value="time_delay">Time-delayed</option>
      </select>
    </div>
    <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="appAddBeneficiary()">Add beneficiary</button>
    </div>
  `);
}

/* ---------------- Actions ---------------- */

function appAddAsset() {
  const title = document.getElementById('assetTitle').value.trim();
  const category = document.getElementById('assetCategory').value;
  const detail = document.getElementById('assetDetail').value.trim() || 'Encrypted entry';
  if (!title) return;

  state.assets.unshift({
    id: Date.now(),
    category,
    title,
    detail,
    updated: new Date().toISOString().split('T')[0],
  });
  state.vault.assets = state.assets.length;
  state.activity.unshift({
    id: Date.now(),
    action: `Asset added: ${title}`,
    time: 'Just now',
    type: 'info',
  });
  saveState(state);
  closeModal();
  showSection('vault');
}

function appInviteGuardian() {
  const name = document.getElementById('guardianName').value.trim();
  const relation = document.getElementById('guardianRelation').value.trim() || 'Trusted contact';
  const email = document.getElementById('guardianEmail').value.trim() || 'pending@example.com';
  if (!name) return;

  state.guardians.push({
    id: Date.now(),
    name,
    relation,
    email,
    status: 'pending',
    joined: new Date().toISOString().split('T')[0],
  });
  state.activity.unshift({
    id: Date.now(),
    action: `Guardian invite sent to ${name}`,
    time: 'Just now',
    type: 'info',
  });
  saveState(state);
  closeModal();
  showSection('guardians');
}

function appAddBeneficiary() {
  const name = document.getElementById('beneficiaryName').value.trim();
  const relation = document.getElementById('beneficiaryRelation').value.trim() || 'Beneficiary';
  const release = document.getElementById('beneficiaryRelease').value;
  if (!name) return;

  state.beneficiaries.push({
    id: Date.now(),
    name,
    relation,
    release,
    items: 0,
  });
  state.activity.unshift({
    id: Date.now(),
    action: `Beneficiary added: ${name}`,
    time: 'Just now',
    type: 'info',
  });
  saveState(state);
  closeModal();
  showSection('beneficiaries');
}

function appUpdateWindow(days) {
  state.vault.checkInWindow = parseInt(days, 10);
  saveState(state);
  showSection('heartbeat');
}

function appCheckIn() {
  state.vault.lastCheckIn = new Date().toISOString();
  state.vault.status = 'live';
  state.activity.unshift({
    id: Date.now(),
    action: 'Heartbeat check-in confirmed',
    time: 'Just now',
    type: 'success',
  });
  saveState(state);
  showSection('dashboard');
}

function appResetState() {
  if (!confirm('Reset demo data? This will restore the default sample vault.')) return;
  state = structuredClone(DEFAULT_STATE);
  saveState(state);
  showSection('dashboard');
}

function appPreviewLegacy(id) {
  const b = state.beneficiaries.find(x => x.id === id);
  if (!b) return;
  openModal(`
    <div style="text-align:center;margin-bottom:1rem;">
      <div style="width:56px;height:56px;border-radius:50%;background:rgba(43,179,137,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;">
        <svg class="app-icon" viewBox="0 0 24 24" style="stroke:var(--continuity-deep);width:24px;height:24px;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </div>
      <h3>Legacy Dashboard for ${b.name}</h3>
      <p style="color:var(--slate);font-size:0.9rem;margin-top:0.25rem;">${releaseLabel(b.release)} · ${b.items} assigned assets</p>
    </div>
    <div style="background:var(--sand);border-radius:var(--radius-md);padding:1rem;margin-bottom:1rem;">
      <p style="font-weight:600;color:var(--ink);margin-bottom:0.5rem;">Available when released</p>
      <ul style="color:var(--slate);font-size:0.9rem;line-height:1.8;list-style:disc;padding-left:1.25rem;">
        <li>Funeral instructions</li>
        <li>Financial account access</li>
        <li>Personal video messages</li>
        <li>Domain and subscription credentials</li>
      </ul>
    </div>
    <div style="display:flex;justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="closeModal()">Close preview</button>
    </div>
  `);
}

/* ---------------- Mobile sidebar ---------------- */

function toggleMobileSidebar() {
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) sidebar.classList.remove('open');
}

/* ---------------- Init ---------------- */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('appMainContent')) return;
  renderNav();
  showSection('dashboard');

  // Close modal on backdrop click
  const modal = document.getElementById('appModal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }
});
