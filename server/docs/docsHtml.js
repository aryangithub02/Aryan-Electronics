/**
 * Aryan Electronics - API Documentation HTML Generator
 * Provides an interactive developer portal at /docs with Swagger UI integration.
 */

const getDocsHtml = (spec) => {
  const specJsonString = JSON.stringify(spec).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aryan Electronics | Developer API Documentation</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <!-- Tailwind Play CDN for rich styles -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Swagger UI CDN for embedded Swagger tab -->
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            brand: {
              50: '#eef8ff',
              500: '#0284c7',
              600: '#0369a1',
            }
          }
        }
      }
    };
  </script>
  <style>
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #0b0f19; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #334155; }

    /* Swagger Dark Theme Overrides */
    .swagger-ui { filter: invert(88%) hue-rotate(180deg); background: #fff; border-radius: 12px; padding: 20px; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 20px 0; }
  </style>
</head>
<body class="bg-[#0b0f19] text-slate-100 font-sans min-h-screen antialiased flex flex-col selection:bg-blue-600 selection:text-white">

  <!-- ================= TOP NAVIGATION BAR ================= -->
  <header class="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Left: Logo & Title -->
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-white text-base tracking-tight">Aryan Electronics</span>
              <span class="text-[10px] font-mono uppercase bg-blue-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-blue-500/30">API v0.5.0</span>
            </div>
            <p class="text-xs text-slate-400">Interactive REST API Reference</p>
          </div>
        </a>
      </div>

      <!-- Center: View Mode Tabs -->
      <div class="hidden md:flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium">
        <button id="tab-btn-explorer" onclick="switchView('explorer')" class="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold transition-all">
          Interactive Explorer
        </button>
        <button id="tab-btn-swagger" onclick="switchView('swagger')" class="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all">
          Swagger UI
        </button>
        <button id="tab-btn-spec" onclick="switchView('spec')" class="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all">
          Raw OpenAPI JSON
        </button>
      </div>

      <!-- Right: Environment Selector & Authorize Modal Trigger -->
      <div class="flex items-center gap-2.5">
        <!-- Environment Selector -->
        <div class="relative hidden sm:block">
          <select id="server-base-select" onchange="updateBaseUrl(this.value)" class="bg-slate-900 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-mono px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="http://localhost:5000">Local (http://localhost:5000)</option>
            <option value="https://aryan-electronics.vercel.app">Production (Vercel Edge)</option>
            <option value="">Current Origin</option>
          </select>
        </div>

        <!-- Auth Status & Button -->
        <button onclick="openAuthModal()" id="auth-btn" class="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-lg transition-all">
          <span id="auth-status-dot" class="w-2 h-2 rounded-full bg-slate-500"></span>
          <span id="auth-btn-label">Authorize</span>
        </button>

        <a href="/docs/openapi.json" target="_blank" download="openapi.json" class="hidden lg:flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 p-1.5 hover:bg-slate-800/80 rounded-lg transition-colors" title="Download OpenAPI 3.0 JSON">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        </a>
      </div>
    </div>
  </header>

  <!-- ================= AUTH MODAL ================= -->
  <div id="auth-modal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
      <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white p-1">✕</button>
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">🔒</div>
        <h3 class="text-base font-bold text-white">API Authorization (JWT)</h3>
      </div>
      <p class="text-xs text-slate-400 mb-4">
        Protected routes require a Bearer token. You can either paste an existing JWT token or use one-click demo login below.
      </p>

      <!-- Quick Fill Buttons -->
      <div class="mb-4 space-y-2">
        <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quick Demo Logins</label>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="quickLogin('admin@aryanelectronics.com', 'AdminPass123!', 'admin')" class="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl p-2.5 text-left transition-colors">
            <div class="text-xs font-bold text-cyan-400">Admin Account</div>
            <div class="text-[10px] text-slate-400 font-mono">admin@aryanelectronics.com</div>
          </button>
          <button onclick="quickLogin('demo@aryanelectronics.com', 'DemoPassword123!', 'user')" class="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl p-2.5 text-left transition-colors">
            <div class="text-xs font-bold text-emerald-400">Demo User</div>
            <div class="text-[10px] text-slate-400 font-mono">demo@aryanelectronics.com</div>
          </button>
        </div>
      </div>

      <!-- Token Input -->
      <div class="mb-4">
        <label class="text-xs font-semibold text-slate-300 block mb-1">Bearer Token Value</label>
        <textarea id="jwt-input" rows="3" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-2">
        <button onclick="clearToken()" class="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 mr-auto">Clear Token</button>
        <button onclick="closeAuthModal()" class="text-xs text-slate-400 hover:text-white px-3 py-1.5">Cancel</button>
        <button onclick="saveToken()" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">Save & Apply</button>
      </div>
    </div>
  </div>

  <!-- ================= MAIN CONTAINER ================= -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">

    <!-- ================= VIEW 1: INTERACTIVE EXPLORER ================= -->
    <div id="view-explorer" class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
      
      <!-- Left Sidebar: Search & Category Filter -->
      <aside class="lg:col-span-3 space-y-4">
        <div class="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sticky top-20 shadow-xl space-y-4">
          <!-- Search Endpoints Input -->
          <div>
            <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Search Endpoints</label>
            <div class="relative">
              <input type="text" id="endpoint-search" oninput="filterEndpoints(this.value)" placeholder="e.g. /products, auth, admin..." class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              <svg class="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          <!-- Tags Navigation -->
          <div>
            <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Categories</label>
            <nav id="tags-nav" class="space-y-1 text-xs">
              <!-- Dynamically populated -->
            </nav>
          </div>

          <!-- Quick Metrics Banner -->
          <div class="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div class="flex justify-between"><span>Dataset Size:</span> <span class="font-mono text-cyan-400 font-semibold">688 Products</span></div>
            <div class="flex justify-between"><span>Sectors:</span> <span class="font-mono text-cyan-400 font-semibold">8 Categories</span></div>
            <div class="flex justify-between"><span>Total Routes:</span> <span class="font-mono text-cyan-400 font-semibold" id="total-routes-count">0</span></div>
          </div>
        </div>
      </aside>

      <!-- Center: Endpoints Content Feed -->
      <section class="lg:col-span-9 space-y-6" id="endpoints-container">
        <!-- Dynamically rendered endpoint cards -->
      </section>
    </div>

    <!-- ================= VIEW 2: SWAGGER UI TAB ================= -->
    <div id="view-swagger" class="hidden flex-1">
      <div class="bg-white rounded-2xl p-4 shadow-2xl border border-slate-800 overflow-hidden">
        <div id="swagger-ui-mount"></div>
      </div>
    </div>

    <!-- ================= VIEW 3: RAW OPENAPI SPEC TAB ================= -->
    <div id="view-spec" class="hidden flex-1 space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-mono font-bold text-slate-300">OpenAPI 3.0.3 JSON Specification</h2>
        <button onclick="copyRawSpec()" class="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-lg border border-slate-700">
          Copy Spec JSON
        </button>
      </div>
      <pre class="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-cyan-300 overflow-auto max-h-[75vh]"><code id="spec-code-block"></code></pre>
    </div>

  </main>

  <!-- ================= FOOTER ================= -->
  <footer class="mt-auto border-t border-slate-800/80 bg-[#0f172a] py-6 px-4 text-center text-xs text-slate-500">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
      <div>Aryan Electronics &copy; 2026. Industrial & Commercial Electronics Aggregator.</div>
      <div class="flex items-center gap-4">
        <a href="/" class="hover:text-cyan-400 transition-colors">Storefront Home</a>
        <a href="/api/health" target="_blank" class="hover:text-cyan-400 transition-colors">Health Endpoint</a>
        <a href="/docs/openapi.json" target="_blank" class="hover:text-cyan-400 transition-colors">OpenAPI JSON</a>
      </div>
    </div>
  </footer>

  <!-- ================= SCRIPTS & INTERACTION ENGINE ================= -->
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    // Injection of complete OpenAPI 3.0 specification from server
    const spec = ${specJsonString};

    // State
    let authToken = localStorage.getItem('aryan_docs_jwt') || '';
    let authUserRole = localStorage.getItem('aryan_docs_role') || '';
    let selectedBaseUrl = localStorage.getItem('aryan_docs_base') || (window.location.origin.includes('localhost') ? 'http://localhost:5000' : window.location.origin);
    let selectedTag = 'all';
    let searchQuery = '';

    // Method Color Palette
    const METHOD_COLORS = {
      get: { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', btn: 'bg-emerald-600 hover:bg-emerald-500' },
      post: { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', btn: 'bg-blue-600 hover:bg-blue-500' },
      put: { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', btn: 'bg-amber-600 hover:bg-amber-500' },
      patch: { badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30', btn: 'bg-purple-600 hover:bg-purple-500' },
      delete: { badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30', btn: 'bg-rose-600 hover:bg-rose-500' }
    };

    // Initialize Page
    document.addEventListener('DOMContentLoaded', () => {
      // Sync Base URL select dropdown
      const sel = document.getElementById('server-base-select');
      if (sel) {
        if (Array.from(sel.options).some(o => o.value === selectedBaseUrl)) {
          sel.value = selectedBaseUrl;
        } else {
          sel.value = '';
        }
      }
      
      updateAuthUI();
      renderTagsNavigation();
      renderEndpoints();
      renderSpecCodeBlock();
      initSwaggerUI();
    });

    // View Switching
    function switchView(view) {
      document.getElementById('view-explorer').classList.add('hidden');
      document.getElementById('view-swagger').classList.add('hidden');
      document.getElementById('view-spec').classList.add('hidden');

      ['explorer', 'swagger', 'spec'].forEach(v => {
        const btn = document.getElementById('tab-btn-' + v);
        btn.className = 'px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all';
      });

      document.getElementById('view-' + view).classList.remove('hidden');
      document.getElementById('tab-btn-' + view).className = 'px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold transition-all';
    }

    function updateBaseUrl(val) {
      selectedBaseUrl = val || window.location.origin;
      localStorage.setItem('aryan_docs_base', selectedBaseUrl);
      renderEndpoints();
    }

    // Auth Modal Handlers
    function openAuthModal() {
      document.getElementById('auth-modal').classList.remove('hidden');
      document.getElementById('jwt-input').value = authToken;
    }

    function closeAuthModal() {
      document.getElementById('auth-modal').classList.add('hidden');
    }

    function saveToken() {
      const val = document.getElementById('jwt-input').value.trim();
      authToken = val;
      authUserRole = val ? 'custom' : '';
      localStorage.setItem('aryan_docs_jwt', authToken);
      localStorage.setItem('aryan_docs_role', authUserRole);
      updateAuthUI();
      closeAuthModal();
      renderEndpoints();
    }

    function clearToken() {
      authToken = '';
      authUserRole = '';
      localStorage.removeItem('aryan_docs_jwt');
      localStorage.removeItem('aryan_docs_role');
      document.getElementById('jwt-input').value = '';
      updateAuthUI();
      closeAuthModal();
      renderEndpoints();
    }

    async function quickLogin(email, password, role) {
      try {
        const base = selectedBaseUrl || window.location.origin;
        const res = await fetch(base + '/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data && data.token) {
          authToken = data.token;
          authUserRole = role;
          localStorage.setItem('aryan_docs_jwt', authToken);
          localStorage.setItem('aryan_docs_role', authUserRole);
          document.getElementById('jwt-input').value = authToken;
          updateAuthUI();
          closeAuthModal();
          renderEndpoints();
        } else {
          alert('Login failed: ' + (data?.error?.message || 'Invalid response'));
        }
      } catch (err) {
        alert('Network error connecting to ' + selectedBaseUrl + ': ' + err.message);
      }
    }

    function updateAuthUI() {
      const dot = document.getElementById('auth-status-dot');
      const label = document.getElementById('auth-btn-label');
      if (authToken) {
        dot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
        label.innerText = authUserRole ? 'Auth: ' + authUserRole : 'Authenticated';
      } else {
        dot.className = 'w-2 h-2 rounded-full bg-slate-500';
        label.innerText = 'Authorize';
      }
    }

    // Build Category Tag List
    function renderTagsNavigation() {
      const nav = document.getElementById('tags-nav');
      nav.innerHTML = '';

      // Count endpoints by tag
      const tagCounts = { all: 0 };
      let total = 0;
      Object.keys(spec.paths).forEach(p => {
        Object.keys(spec.paths[p]).forEach(m => {
          total++;
          const t = spec.paths[p][m].tags?.[0] || 'Other';
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      });
      tagCounts.all = total;
      document.getElementById('total-routes-count').innerText = total;

      // Add "All" tag
      const allBtn = createTagBtn('all', 'All Endpoints', tagCounts.all);
      nav.appendChild(allBtn);

      // Add other tags from spec
      (spec.tags || []).forEach(t => {
        const count = tagCounts[t.name] || 0;
        const btn = createTagBtn(t.name, t.name, count);
        nav.appendChild(btn);
      });
    }

    function createTagBtn(id, label, count) {
      const b = document.createElement('button');
      b.className = 'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ' +
        (selectedTag === id ? 'bg-blue-600/20 text-cyan-300 font-semibold border border-blue-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60');
      b.onclick = () => {
        selectedTag = id;
        renderTagsNavigation();
        renderEndpoints();
      };
      b.innerHTML = '<span class="truncate">' + label + '</span><span class="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-400">' + count + '</span>';
      return b;
    }

    function filterEndpoints(query) {
      searchQuery = (query || '').toLowerCase().trim();
      renderEndpoints();
    }

    // Render Endpoints Feed
    function renderEndpoints() {
      const container = document.getElementById('endpoints-container');
      container.innerHTML = '';

      const matchedList = [];

      Object.entries(spec.paths).forEach(([pathName, methods]) => {
        Object.entries(methods).forEach(([methodName, operation]) => {
          const tag = operation.tags?.[0] || 'Other';
          if (selectedTag !== 'all' && tag !== selectedTag) return;

          if (searchQuery) {
            const matchText = (pathName + ' ' + methodName + ' ' + (operation.summary || '') + ' ' + (operation.description || '')).toLowerCase();
            if (!matchText.includes(searchQuery)) return;
          }

          matchedList.push({ path: pathName, method: methodName.toLowerCase(), op: operation });
        });
      });

      if (matchedList.length === 0) {
        container.innerHTML = '<div class="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400"><p class="text-sm">No API endpoints match your search criteria.</p></div>';
        return;
      }

      matchedList.forEach((item, index) => {
        const card = createEndpointCard(item, index);
        container.appendChild(card);
      });
    }

    function createEndpointCard({ path, method, op }, index) {
      const colors = METHOD_COLORS[method] || METHOD_COLORS.get;
      const isProtected = !!(op.security && op.security.length > 0);
      const cardId = 'endpoint-' + index;

      const card = document.createElement('div');
      card.className = 'bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700/80 transition-all';
      card.id = cardId;

      // Extract parameter inputs
      const parameters = op.parameters || [];
      const hasBody = !!op.requestBody;
      let bodySample = '';
      if (hasBody) {
        const schema = op.requestBody?.content?.['application/json']?.schema;
        if (schema?.properties) {
          const sampleObj = {};
          Object.keys(schema.properties).forEach(k => {
            sampleObj[k] = schema.properties[k].example !== undefined ? schema.properties[k].example : (schema.properties[k].type === 'number' ? 0 : 'sample');
          });
          bodySample = JSON.stringify(sampleObj, null, 2);
        } else {
          bodySample = '{\\n  "key": "value"\\n}';
        }
      }

      card.innerHTML = \`
        <!-- Header Strip -->
        <div class="p-4 sm:p-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-900/40">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="font-mono text-xs font-bold uppercase px-2.5 py-1 rounded-lg border \${colors.badge}">\${method}</span>
            <span class="font-mono text-sm font-semibold text-white tracking-wide">\${path}</span>
            \${isProtected ? '<span class="text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">🔒 Bearer Auth</span>' : '<span class="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Public</span>'}
          </div>
          <span class="text-xs text-slate-400 font-medium">\${op.tags?.[0] || ''}</span>
        </div>

        <!-- Description & Summary -->
        <div class="p-5 space-y-4">
          <div>
            <h4 class="text-sm font-bold text-slate-100 mb-1">\${op.summary || ''}</h4>
            <p class="text-xs text-slate-400 leading-relaxed">\${op.description || ''}</p>
          </div>

          <!-- Parameter Fields Grid -->
          \${parameters.length > 0 ? \`
            <div class="space-y-2 pt-2 border-t border-slate-800/60">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Parameters</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                \${parameters.map(p => \`
                  <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-mono font-semibold text-cyan-300">\${p.name}</span>
                      <span class="text-[10px] text-slate-500 font-mono">\${p.in} \${p.required ? '• <span class="text-rose-400">required</span>' : ''}</span>
                    </div>
                    <input type="text" id="param-\${cardId}-\${p.name}" value="\${p.schema?.default || p.schema?.example || ''}" placeholder="\${p.description || p.name}" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono" />
                  </div>
                \`).join('')}
              </div>
            </div>
          \` : ''}

          <!-- Request Body JSON Area -->
          \${hasBody ? \`
            <div class="space-y-1.5 pt-2 border-t border-slate-800/60">
              <div class="flex items-center justify-between">
                <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Request Body (JSON)</label>
                <span class="text-[10px] font-mono text-slate-500">application/json</span>
              </div>
              <textarea id="body-\${cardId}" rows="4" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-blue-500">\${bodySample}</textarea>
            </div>
          \` : ''}

          <!-- Actions: Try It Out & Snippet Generator -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
            <button onclick="executeRequest('\${cardId}', '\${method}', '\${path}', \${JSON.stringify(parameters)}, \${hasBody})" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition-all \${colors.btn}">
              <span>Send Request</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>

            <button onclick="toggleSnippetView('\${cardId}')" class="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
              Code Snippets (cURL/JS/Python)
            </button>
          </div>

          <!-- Code Snippets Box -->
          <div id="snippet-box-\${cardId}" class="hidden pt-3 border-t border-slate-800/80 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex gap-1.5 text-xs font-mono">
                <button onclick="setSnippetTab('\${cardId}', 'curl')" id="btn-curl-\${cardId}" class="px-2.5 py-1 rounded-md bg-blue-600 text-white font-semibold">cURL</button>
                <button onclick="setSnippetTab('\${cardId}', 'fetch')" id="btn-fetch-\${cardId}" class="px-2.5 py-1 rounded-md text-slate-400 hover:text-white">JavaScript</button>
                <button onclick="setSnippetTab('\${cardId}', 'python')" id="btn-python-\${cardId}" class="px-2.5 py-1 rounded-md text-slate-400 hover:text-white">Python</button>
              </div>
              <button onclick="copySnippet('\${cardId}')" class="text-xs text-cyan-400 hover:underline">Copy Code</button>
            </div>
            <pre class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto"><code id="snippet-code-\${cardId}"></code></pre>
          </div>

          <!-- Live Response Console Area -->
          <div id="response-box-\${cardId}" class="hidden pt-4 border-t border-slate-800/80 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-300">Live Response:</span>
                <span id="response-status-\${cardId}" class="text-xs font-mono px-2 py-0.5 rounded-full font-bold">200 OK</span>
                <span id="response-time-\${cardId}" class="text-[11px] font-mono text-slate-400">45ms</span>
              </div>
              <button onclick="copyResponse('\${cardId}')" class="text-xs text-cyan-400 hover:underline">Copy Response JSON</button>
            </div>
            <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-72"><code id="response-code-\${cardId}"></code></pre>
          </div>

        </div>
      \`;

      return card;
    }

    // Execute Live HTTP Request
    async function executeRequest(cardId, method, pathTemplate, params, hasBody) {
      const respBox = document.getElementById('response-box-' + cardId);
      const statusEl = document.getElementById('response-status-' + cardId);
      const timeEl = document.getElementById('response-time-' + cardId);
      const codeEl = document.getElementById('response-code-' + cardId);

      respBox.classList.remove('hidden');
      statusEl.className = 'text-xs font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 animate-pulse';
      statusEl.innerText = 'Sending...';
      codeEl.innerText = '// Dispatching request to ' + (selectedBaseUrl || window.location.origin) + '...';

      // Build target URL
      let targetPath = pathTemplate;
      const queryParams = new URLSearchParams();

      (params || []).forEach(p => {
        const inp = document.getElementById('param-' + cardId + '-' + p.name);
        const val = inp ? inp.value.trim() : '';
        if (p.in === 'path') {
          targetPath = targetPath.replace('{' + p.name + '}', encodeURIComponent(val || '1'));
        } else if (p.in === 'query' && val) {
          queryParams.append(p.name, val);
        }
      });

      const queryString = queryParams.toString();
      const base = selectedBaseUrl || window.location.origin;
      const fullUrl = base + targetPath + (queryString ? '?' + queryString : '');

      const headers = { 'Accept': 'application/json' };
      if (authToken) {
        headers['Authorization'] = 'Bearer ' + authToken;
      }

      let reqBody = undefined;
      if (hasBody) {
        const bodyInput = document.getElementById('body-' + cardId);
        if (bodyInput && bodyInput.value.trim()) {
          headers['Content-Type'] = 'application/json';
          reqBody = bodyInput.value.trim();
        }
      }

      const startTime = performance.now();
      try {
        const response = await fetch(fullUrl, {
          method: method.toUpperCase(),
          headers,
          body: (method !== 'get' && method !== 'head') ? reqBody : undefined
        });

        const elapsed = Math.round(performance.now() - startTime);
        timeEl.innerText = elapsed + 'ms';

        let data;
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = text;
        }

        const isSuccess = response.status >= 200 && response.status < 300;
        statusEl.className = 'text-xs font-mono px-2 py-0.5 rounded-full font-bold ' +
          (isSuccess ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30');
        statusEl.innerText = response.status + ' ' + response.statusText;

        codeEl.innerText = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
      } catch (err) {
        const elapsed = Math.round(performance.now() - startTime);
        timeEl.innerText = elapsed + 'ms';
        statusEl.className = 'text-xs font-mono px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30';
        statusEl.innerText = 'Network Error';
        codeEl.innerText = '// Failed to fetch: ' + err.message + '\\n// Ensure server is running at ' + (selectedBaseUrl || window.location.origin);
      }
    }

    // Code Snippet Helpers
    function toggleSnippetView(cardId) {
      const box = document.getElementById('snippet-box-' + cardId);
      box.classList.toggle('hidden');
      if (!box.classList.contains('hidden')) {
        updateSnippetCode(cardId, 'curl');
      }
    }

    function setSnippetTab(cardId, tab) {
      ['curl', 'fetch', 'python'].forEach(t => {
        const btn = document.getElementById('btn-' + t + '-' + cardId);
        if (btn) btn.className = 'px-2.5 py-1 rounded-md text-slate-400 hover:text-white';
      });
      const activeBtn = document.getElementById('btn-' + tab + '-' + cardId);
      if (activeBtn) activeBtn.className = 'px-2.5 py-1 rounded-md bg-blue-600 text-white font-semibold';
      updateSnippetCode(cardId, tab);
    }

    function updateSnippetCode(cardId, type) {
      const card = document.getElementById(cardId);
      const codeBlock = document.getElementById('snippet-code-' + cardId);
      // Construct sample
      const base = selectedBaseUrl || window.location.origin;
      const pathText = card.querySelector('span.text-sm.font-semibold.text-white')?.innerText || '/api/products';
      const methodText = card.querySelector('span.font-mono.text-xs.font-bold.uppercase')?.innerText || 'GET';
      const authHeader = authToken ? '  -H "Authorization: Bearer ' + authToken + '" \\\\\\n' : '';

      if (type === 'curl') {
        codeBlock.innerText = 'curl -X ' + methodText + ' "' + base + pathText + '" \\\\\\n' +
          '  -H "Accept: application/json" \\\\\\n' + authHeader +
          '  -H "Content-Type: application/json"';
      } else if (type === 'fetch') {
        codeBlock.innerText = 'fetch("' + base + pathText + '", {\\n' +
          '  method: "' + methodText + '",\\n' +
          '  headers: {\\n' +
          '    "Content-Type": "application/json"' + (authToken ? ',\\n    "Authorization": "Bearer ' + authToken + '"' : '') + '\\n' +
          '  }\\n' +
          '}).then(res => res.json())\\n.then(data => console.log(data));';
      } else if (type === 'python') {
        codeBlock.innerText = 'import requests\\n\\nurl = "' + base + pathText + '"\\nheaders = {\\n' +
          '    "Accept": "application/json"' + (authToken ? ',\\n    "Authorization": "Bearer ' + authToken + '"' : '') + '\\n}\\n' +
          'response = requests.' + methodText.toLowerCase() + '(url, headers=headers)\\nprint(response.json())';
      }
    }

    function copySnippet(cardId) {
      const code = document.getElementById('snippet-code-' + cardId)?.innerText;
      if (code) navigator.clipboard.writeText(code).then(() => alert('Code copied to clipboard!'));
    }

    function copyResponse(cardId) {
      const code = document.getElementById('response-code-' + cardId)?.innerText;
      if (code) navigator.clipboard.writeText(code).then(() => alert('Response JSON copied to clipboard!'));
    }

    function copyRawSpec() {
      navigator.clipboard.writeText(JSON.stringify(spec, null, 2)).then(() => alert('OpenAPI 3.0 JSON specification copied!'));
    }

    function renderSpecCodeBlock() {
      const el = document.getElementById('spec-code-block');
      if (el) el.innerText = JSON.stringify(spec, null, 2);
    }

    // Swagger UI Initialization
    function initSwaggerUI() {
      try {
        SwaggerUIBundle({
          spec: spec,
          dom_id: '#swagger-ui-mount',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset
          ],
          layout: "BaseLayout"
        });
      } catch (e) {
        console.warn('Swagger UI Bundle delayed init:', e.message);
      }
    }
  </script>
</body>
</html>`;
};

module.exports = { getDocsHtml };
