(() => {
  'use strict';
  const requestedProduct = new URLSearchParams(location.search).get('product');
  const key = ['ava', 'memorx'].includes(requestedProduct) ? requestedProduct : null;
  if (!key) {
    document.title = 'AVA & MemorX | Investor presentations';
    return;
  }
  document.body.classList.remove('product-chooser');
  document.querySelector('.skip').textContent = 'Skip to presentation';
  document.querySelector('#stage').setAttribute('aria-label', 'Investor presentation');
  const deck = window.DECKS[key], media = window.DECK_MEDIA[key], round = window.FUNDING_ROUND, isAva = key === 'ava';
  const el = selector => document.querySelector(selector);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const money = (value, cents = false) => '$' + Number(value).toLocaleString('en-US', {minimumFractionDigits:cents ? 2 : 0, maximumFractionDigits:cents ? 2 : 0});
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${({arrow:'M4 12h16m-6-6 6 6-6 6',left:'m14 5-7 7 7 7',right:'m10 5 7 7-7 7',up:'M12 20V4m-6 6 6-6 6 6',down:'M12 4v16m-6-6 6 6 6-6',pin:'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',play:'m8 4 12 8-12 8V4Z',reset:'M4 10a8 8 0 1 1 1 9M4 4v6h6'})[name] || ''}"/></svg>`;
  const indexOf = type => deck.slides.findIndex(slide => slide.type === type);
  const intro = s => `<div class="slide-intro"><h2>${safe(s.title)}</h2>${s.body ? `<p class="lead">${safe(s.body)}</p>` : ''}</div>`;
  const rows = s => `<div class="feature-rows">${(s.rows || []).map(row => `<div class="feature-row"><h3>${safe(row.title)}</h3><p>${safe(row.text)}</p></div>`).join('')}</div>`;
  const source = s => {
    const links = (s.sourceindices || []).map(index => deck.sources[index]).filter(Boolean);
    return links.length ? `<div class="fine source-line">${links.map(link => `<a href="${safe(link.url)}" target="_blank" rel="noopener">${safe(link.title)}</a>`).join(' · ')}${!isAva && ['experience','proof'].includes(s.type) ? ' · HEIG-VD Geomatics (2026), selected photographs reconstructed and refined. CC BY 4.0.' : ''}</div>` : '';
  };
  const figures = (items, className = '') => `<div class="market-figures ${className}">${(items || []).map(item => `<div class="market-stat"><div class="market-figure">${safe(item.value)}</div><h3>${safe(item.label)}</h3>${item.detail ? `<p>${safe(item.detail)}</p>` : ''}</div>`).join('')}</div>`;
  const betaRows = s => (s.betaBreakdown || []).map(item => `<div class="beta-row"><span>${safe(item.label)}</span><strong>${money(item.value, Number(item.value) % 1 !== 0)}</strong></div>`).join('');
  const templates = {
    hero: s => `<div class="two-col"><div class="hero-copy"><h1>${safe(s.title)}</h1><p class="lead">${safe(s.body)}</p><div class="hero-actions"><button class="primary" data-go="${indexOf('experience')}">${safe(s.cta)} ${icon('arrow')}</button><span class="pill"><i class="status-dot"></i>Working MVP</span></div><div class="hero-signature">${safe(deck.tagline)}<br><br>Gebsill Labs · Investor presentation · November 2026</div></div><div class="hero-art">${isAva ? `<div class="hero-orbit"></div><div class="phone"><img src="assets/ava-hero-mobile.png" alt="AVA MVP sample chat on a mobile screen"></div><div class="float-message one"><small>MVP Sample</small>Saved you a cup.</div><div class="float-message two">The blue mug, please.<br>You know the one.</div>` : `<div class="space-art"><img src="assets/memorx-room.png" alt="MemorX working local classroom reconstruction"><div class="memory-tag"><span class="pin-icon">${icon('pin')}</span>The room. The view. The memory.</div></div><div class="photo-slip"><img src="assets/room-original.jpg" alt="Original HEIG-VD classroom photograph"></div>`}</div></div>${!isAva ? '<div class="fine source-line">HEIG-VD Geomatics classroom, CC BY 4.0. Reconstructed and refined; includes inferred appearance.</div>' : ''}`,
    film: s => `<div class="film-layout"><div><h2>${safe(s.title)}</h2><p class="lead">${safe(s.body)}</p><p class="quote-line">${isAva ? 'An archive keeps the words. AVA explores the familiarity between them.' : 'A photograph holds a view.<br>MemorX lets you explore the place around it.'}</p></div><div><div class="film-frame" id="film-frame">${media.video ? `<video controls playsinline preload="metadata" poster="${safe(media.poster || '')}" src="${safe(media.video)}" aria-label="${safe(deck.brandname)} introduction film"></video>${media.poster ? `<img class="film-print print-only" src="${safe(media.poster)}" alt="Still from the ${safe(deck.brandname)} introduction film">` : ''}` : `<div class="film-poster"><img src="assets/${key}-logo.png" alt="${safe(deck.brandname)}"><h3>${safe(deck.tagline)}</h3><button class="primary" id="choose-film">${icon('play')} Add final film</button></div>`}</div><input type="file" class="file-input" id="film-file" accept="video/*"><div class="film-controls"><button class="text-button" data-go="${indexOf('experience')}">Continue to the experience ${icon('arrow')}</button></div><p id="film-ready" class="fine" hidden></p></div></div>`,
    experience: s => isAva ? `<div class="two-col"><div><h2>${safe(s.title)}</h2><p class="lead">${safe(s.body)}</p><div class="mini-steps"><span>Shared context</span><span>Familiar language</span><span>Same comfort</span></div><p class="experience-hint">Choose a message to try the exchange.</p><div class="experience-links">${media.mvp ? `<a class="text-button" href="${safe(media.mvp)}" target="_blank" rel="noopener">Open working MVP ${icon('arrow')}</a>` : ''}</div></div><div><div class="chat-sample"><div class="chat-head"><span class="avatar">M</span><div><strong>Meera</strong><small>AI companion · MVP sample</small></div></div><div class="chat-messages" id="chat-messages" role="log" aria-live="polite"><div class="bubble out">Just got back. Tried your ginger tea recipe.<small>You</small></div><div class="bubble">And did you give the ginger its full five minutes this time?</div><div class="bubble out">I actually set a timer.<small>You</small></div></div><div class="chat-choices">${(s.starters || []).map((value,index) => `<button data-chat="${index}">${safe(value)}</button>`).join('')}</div></div></div></div>` : `<div class="room-layout"><div><h2>${safe(s.title)}</h2><p class="lead">${safe(s.body)}</p><p class="experience-hint">Drag to look. Use the movement controls.<br>Open the memory pin to see the original.</p><p class="fine">Actual MVP photographic reconstruction, rendered from its exported scene.</p></div><div><div class="room-shell"><div id="room-canvas"></div><div class="room-poster" id="room-poster"><button class="primary" id="load-room">Enter the actual room ${icon('arrow')}</button></div><button id="memory-pin" data-world-pin aria-label="Open original classroom photograph" hidden>${icon('pin')}</button><div id="room-status">Load on demand · 82.6 MB · Local sample</div><div class="room-buttons" hidden><button data-room-action="left" aria-label="Move left">${icon('left')}</button><button data-room-action="forward" aria-label="Move forward">${icon('up')}</button><button data-room-action="back" aria-label="Move back">${icon('down')}</button><button data-room-action="right" aria-label="Move right">${icon('right')}</button><button data-room-action="reset" aria-label="Reset view">${icon('reset')}</button></div><div class="memory-detail" id="memory-detail" hidden><button id="close-memory">Back to the room</button><h3>The room,<br>as photographed.</h3><img src="assets/room-original.jpg" alt="Original fisheye photograph of the classroom"><p>The original photograph stays attached to the place it records.</p><p class="fine">HEIG-VD Geomatics, 2026. CC BY 4.0.</p></div></div><p class="room-footnote">Reconstructed and refined from selected photographs. Includes inferred appearance.</p></div></div>${source(s)}`,
    proof: s => `${intro(s)}<div class="proof-layout"><div>${isAva ? `<div class="proof-images"><img class="proof-phone" src="assets/ava-clean-mobile.png" alt="AVA working AI response"><img class="proof-import" src="assets/ava-import.png" alt="AVA WhatsApp import and permission screen"></div>` : `<img class="screenshot" src="assets/memorx-room.png" alt="MemorX local studio showing the classroom reconstruction">`}</div><div>${rows(s)}</div></div>${source(s)}`,
    market: s => `${intro(s)}<div class="market-grid">${figures(s.marketFigures)}<div>${rows(s)}</div></div>${source(s)}`,
    opportunity: s => `${intro(s)}${figures(s.figures, 'opportunity-figures')}${s.calculation ? `<div class="market-calculation">${(s.calculation.steps || []).map((step,index) => ` ${index ? '<span class="calculation-sign" aria-hidden="true">×</span>' : ''}<div class="calculation-step"><strong>${safe(step.value)}</strong><span>${safe(step.label)}</span></div>`).join('')}<div class="calculation-result"><strong>${safe(s.calculation.result)}</strong><span>${safe(s.calculation.resultLabel)}</span></div></div>` : ''}${s.footer ? `<p class="calculation-footer">${safe(s.footer)}</p>` : ''}${source(s)}`,
    competition: s => `${intro(s)}<div class="competition-table" role="table" aria-label="Product comparison"><div class="competition-row competition-head" role="row">${(s.columns || ['Product','Focus','Approach']).map(value => `<div role="columnheader">${safe(value)}</div>`).join('')}</div>${(s.competitors || []).map(row => `<div class="competition-row${row.name === deck.brandname || row.name === 'AVA' && isAva ? ' own-product' : ''}" role="row"><strong role="cell">${safe(row.name)}</strong><span role="cell">${safe(row.focus)}</span><span role="cell">${safe(row.approach)}</span></div>`).join('')}</div>${s.edge?.length ? `<div class="competitive-edge">${s.edge.map(item => `<div><h3>${safe(item.title)}</h3><p>${safe(item.text)}</p></div>`).join('')}</div>` : ''}${source(s)}`,
    model: s => `${intro(s)}${isAva ? `<div class="model-grid"><div><div class="price-options">${(s.prices || []).map((value,index) => `<button class="${index === 0 ? 'selected' : ''}" data-price="${value}" aria-pressed="${index === 0}">${money(value,true)}<small>per month · price test</small></button>`).join('')}</div><div class="scenario"><label for="accounts">Illustrative paying accounts <strong id="account-count">100</strong></label><input type="range" id="accounts" min="10" max="1000" value="100" step="10"><div class="scenario-total"><span id="scenario-total">${money((s.prices?.[0] || 9.99) * 100)}</span><small>monthly gross subscription revenue</small></div><p class="fine">Scenario arithmetic, not a forecast. Before tax, fees, compute, support and other costs.</p></div></div><div><ul class="rule-list">${(s.rows || []).map(row => `<li><strong>${safe(row.title)}</strong><span>${safe(row.text)}</span></li>`).join('')}</ul></div></div>` : `<div class="model-grid"><div class="service-loop">${(s.rows || []).map((row,index) => `<button class="${index === 0 ? 'active' : ''}" data-service="${index}" aria-pressed="${index === 0}">${safe(row.title)} ${icon('arrow')}</button>`).join('')}</div><div class="service-detail" aria-live="polite" aria-atomic="true"><ul class="service-points" id="service-points" aria-label="${safe(s.rows?.[0]?.title)} details">${(s.rows?.[0]?.points || []).map(point => `<li>${safe(point)}</li>`).join('')}</ul></div></div>`}`,
    gtm: s => `${intro(s)}<div class="journey">${(s.rows || []).map(row => `<div class="journey-item"><h3>${safe(row.title)}</h3><p>${safe(row.text)}</p></div>`).join('')}</div>${s.highlights?.length ? `<div class="gtm-bottom">${s.highlights.map(item => `<div><strong>${safe(item.title)}</strong>${item.text ? `<span>${safe(item.text)}</span>` : ''}</div>`).join('')}</div>` : ''}`,
    projection: s => {
      const scenarios = s.scenarios || [];
      const maximum = Math.max(1, ...scenarios.map(item => Number(item.revenue) || 0));
      const hasCosts = scenarios.some(item => item.cost !== undefined);
      const hasContribution = scenarios.some(item => item.contribution !== undefined);
      const modelPrice = typeof s.modelPrice === 'number' ? money(s.modelPrice, s.modelPrice % 1 !== 0) : safe(s.modelPrice);
      const directCost = typeof s.modelDirectCost === 'number' ? money(s.modelDirectCost, s.modelDirectCost % 1 !== 0) : safe(s.modelDirectCost);
      return `${intro(s)}<div class="projection-key"><span class="projection-unit">${modelPrice} ${safe(s.modelUnit)}${s.modelDirectCost !== undefined ? ` · ${directCost} direct cost per unit` : ''}</span><span><i class="legend-revenue"></i>Revenue</span>${hasCosts ? '<span><i class="legend-cost"></i>Direct cost</span>' : ''}</div><div class="projection-chart${hasContribution ? '' : ' revenue-only'}">${scenarios.map(item => `<div class="projection-case"><div class="case-label"><h3>${safe(item.label)}</h3><span>${safe(item.volume)}</span></div><div class="case-bars"><div class="case-bar revenue-bar"><div style="--width:${Number(item.revenue) / maximum * 100}%"></div><strong>${money(item.revenue)}</strong></div>${item.cost !== undefined ? `<div class="case-bar cost-bar"><div style="--width:${Number(item.cost) / maximum * 100}%"></div><strong>${money(item.cost)}</strong></div>` : ''}</div>${item.contribution !== undefined ? `<div class="case-contribution"><strong>${money(item.contribution)}</strong><span>Contribution</span></div>` : ''}</div>`).join('')}</div>${s.projectionNote ? `<p class="projection-note">${safe(s.projectionNote)}</p>` : ''}${source(s)}`;
    },
    roadmap: s => `${intro(s)}<div class="roadmap">${(s.rows || []).map((row,index) => `<div class="roadmap-row${isAva ? '' : ' roadmap-simple'}">${isAva ? `<div class="period">${safe(row.title)}</div>` : ''}<h3>${safe(isAva ? row.heading || ['Build for the outside world.','Test the full trust flow.','Observe real use.'][index] || row.title : row.title)}</h3><p>${safe(row.text)}</p></div>`).join('')}</div>${isAva && s.footer ? `<p class="roadmap-footer">${safe(s.footer)}</p>` : ''}${source(s)}`,
    ask: s => `${intro(s)}<div class="ask-grid round-grid">
      <div class="round-summary">
        <span class="round-label">AVA + MemorX · proposed pre-seed round</span>
        <div class="ask-amount" data-count="${round.ask}">${money(round.ask)}</div>
        <span class="ask-currency">COMBINED ROUND · US DOLLARS</span>
        <p class="round-equity"><strong>${safe(round.equityPercent)}%</strong><span>total equity offered in this round</span></p>
        <dl class="round-valuations">
          <div><dt>Implied pre-money</dt><dd>${money(round.preMoney)}</dd></div>
          <div><dt>Implied post-money</dt><dd>${money(round.postMoney)}</dd></div>
        </dl>
        <div class="valuation-target"><span>Aspirational future valuation</span><strong>${money(round.futureTarget)}</strong><p>${safe(round.targetNote)}</p></div>
      </div>
      <div class="funding-detail">
        <div class="product-allocation"><span>${safe(deck.brandname)} product allocation</span><strong>${money(deck.ask)}</strong></div>
        <p class="ask-caption">${safe(s.caption || (isAva ? 'A hosted beta first. Productization guided by what users actually do.' : 'A walking beta first. A complete product experience next.'))}</p>
        <div class="allocation">${(s.allocations || []).map(item => `<div class="allocation-row"><div class="allocation-label"><span>${safe(item.label)}</span><strong>${money(item.value)}</strong></div><div class="bar" aria-hidden="true"><span style="--width:${item.value / deck.ask * 100}%"></span></div></div>`).join('')}</div>
        ${s.betaBreakdown?.length ? `${isAva ? `<button class="text-button" id="beta-toggle" aria-expanded="false" aria-controls="beta-breakdown">View the ${money(s.betaAsk)} beta breakdown</button>` : `<h3 class="beta-title">${money(s.betaAsk)} beta breakdown</h3>`}<div class="beta-breakdown${isAva ? '' : ' open'}" id="beta-breakdown">${betaRows(s)}</div>` : ''}
      </div>
    </div>`,
    team: s => `<div class="two-col"><div><img class="wordmark" src="assets/${key}-logo.png" alt="${safe(deck.brandname)}"><h2 class="close-line">${safe(s.title)}</h2><p class="lead">${safe(s.body)}</p>${s.cta ? `<p class="close-ask">${safe(s.cta)}</p>` : ''}<div class="close-contact"><a class="primary" href="mailto:${safe(deck.contact)}">${safe(deck.contact)} ${icon('arrow')}</a><a href="https://www.gebsill.com" target="_blank" rel="noopener">gebsill.com</a></div></div><div class="team-list">${deck.team.map(person => `<div class="team-member"><strong>${safe(person.name)}</strong><span>${safe(person.role)}</span></div>`).join('')}</div></div>`
  };

  document.body.classList.add(key);
  document.title = `${deck.brandname} | Investor presentation`;
  el('#brand-logo').src = `assets/${key}-logo.png`;
  el('#brand-logo').alt = deck.brandname;
  el('.brand').href = './';
  el('.brand').setAttribute('aria-label', 'Choose presentation');
  document.querySelector(`[data-product="${key}"]`).classList.add('active');
  document.querySelector(`[data-product="${key}"]`).setAttribute('aria-current', 'page');
  el('#stage').innerHTML = deck.slides.map((slide,index) => `<section class="slide ${safe(slide.type)}" id="${safe(slide.id || `${key}-${slide.type}`)}" data-slide="${index}" data-print-brand="${safe(deck.brandname)} · ${safe(deck.tagline)}" data-print-page="${index + 1} / ${deck.slides.length}" aria-label="Slide ${index + 1}: ${safe(slide.title)}">${templates[slide.type](slide)}</section>`).join('');
  el('#progress').innerHTML = deck.slides.map((slide,index) => `<button aria-label="Slide ${index + 1}: ${safe(slide.title)}" data-go="${index}" title="${safe(slide.title)}"></button>`).join('');
  const compactNavigation = matchMedia('(max-width: 800px)');
  function updateProgressNavigation() {
    const decorative = compactNavigation.matches;
    el('#progress').setAttribute('aria-hidden', String(decorative));
    document.querySelectorAll('#progress button').forEach(button => {
      button.disabled = decorative;
      button.tabIndex = decorative ? -1 : 0;
    });
  }
  compactNavigation.addEventListener('change', updateProgressNavigation);
  updateProgressNavigation();
  el('#sources-list').innerHTML = deck.sources.map(item => `<div class="source-item"><strong>${safe(item.title)}</strong><a href="${safe(item.url)}" target="_blank" rel="noopener">${safe(item.url)}</a></div>`).join('');

  let current = -1, counterFrame = 0;
  const chapterNames = {hero:'The promise',film:'The need',experience:'The experience',proof:'Working MVP',market:'First market',opportunity:'The opportunity',competition:'Our position',model:'Business model',gtm:'Customer path',projection:'Revenue scenarios',roadmap:'Milestones',ask:'The ask',team:'The team'};
  function countMoney(node,target) {
    if (!node) return;
    cancelAnimationFrame(counterFrame);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { node.textContent = money(target); return; }
    node.textContent = money(0);
    const start = performance.now();
    const tick = time => { const progress = Math.min((time - start) / 1100, 1), eased = 1 - Math.pow(1 - progress, 4); node.textContent = money(Math.round(target * eased)); if (progress < 1) counterFrame = requestAnimationFrame(tick); };
    counterFrame = requestAnimationFrame(tick);
  }
  function go(index) {
    index = Math.max(0, Math.min(deck.slides.length - 1, Number.isFinite(index) ? index : 0));
    if (index === current) return;
    current = index;
    document.querySelectorAll('.slide').forEach((slide,position) => {
      slide.classList.toggle('active', position === index);
      slide.setAttribute('aria-hidden', position === index ? 'false' : 'true');
      slide.inert = position !== index;
      if (position === index) slide.scrollTop = 0;
    });
    document.querySelectorAll('#progress button').forEach((button,position) => { button.classList.toggle('current', index === position); button.setAttribute('aria-current', index === position ? 'step' : 'false'); });
    el('#slide-count').textContent = `${String(index + 1).padStart(2, '0')} / ${deck.slides.length}`;
    const slide = deck.slides[index];
    el('#chapter-name').textContent = chapterNames[slide.type] || slide.title;
    el('#previous').disabled = index === 0;
    el('#next').disabled = index === deck.slides.length - 1;
    history.replaceState(null, '', `?product=${key}#${index + 1}`);
    document.querySelectorAll('video').forEach(video => video.pause());
    if (window.MemorXRoom) slide.type === 'experience' ? window.MemorXRoom.resume() : window.MemorXRoom.pause();
    if (slide.type === 'ask') { const amount = el('[data-count]'); countMoney(amount, Number(amount.dataset.count)); }
  }
  document.addEventListener('click', event => { const button = event.target.closest('[data-go]'); if (button) go(Number(button.dataset.go)); });
  el('#previous').onclick = () => go(current - 1);
  el('#next').onclick = () => go(current + 1);

  const settingsButton = el('#settings-toggle'), settingsMenu = el('#settings-menu');
  function closeSettings(returnFocus = false) { settingsMenu.hidden = true; settingsButton.setAttribute('aria-expanded', 'false'); if (returnFocus) settingsButton.focus(); }
  settingsButton.onclick = () => { const open = settingsMenu.hidden; settingsMenu.hidden = !open; settingsButton.setAttribute('aria-expanded', String(open)); if (open) settingsMenu.querySelector('a,button').focus(); };
  document.addEventListener('click', event => { if (!event.target.closest('.settings')) closeSettings(); });
  settingsMenu.addEventListener('keydown', event => {
    const items = [...settingsMenu.querySelectorAll('a,button')], position = items.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); items[(position + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
    if (event.key === 'Home') { event.preventDefault(); items[0].focus(); }
    if (event.key === 'End') { event.preventDefault(); items[items.length - 1].focus(); }
  });
  document.addEventListener('focusin', event => { if (!settingsMenu.hidden && !event.target.closest('.settings')) closeSettings(); });
  el('#sources-toggle').onclick = () => { closeSettings(); el('#sources').showModal(); };
  el('#sources-close').onclick = () => el('#sources').close();
  el('#sources').addEventListener('close', () => settingsButton.focus());
  el('#sources').addEventListener('click', event => { if (event.target === el('#sources')) { const bounds = el('#sources').getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) el('#sources').close(); } });
  function fullScreen() {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }
  el('#fullscreen').onclick = () => { closeSettings(true); fullScreen(); };
  document.addEventListener('fullscreenchange', () => { el('#fullscreen').textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen'; });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !settingsMenu.hidden) { event.preventDefault(); closeSettings(true); return; }
    if (el('#sources').open || !settingsMenu.hidden || event.target.closest('button,a,input,textarea,select,summary,video,audio,[contenteditable="true"],[role="button"],[role="slider"]') || event.target.tagName === 'CANVAS') return;
    if (['ArrowRight','PageDown',' '].includes(event.key)) { event.preventDefault(); go(current + 1); }
    if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); go(current - 1); }
    if (event.key.toLowerCase() === 'f') fullScreen();
    if (event.key === 'Home') { event.preventDefault(); go(0); }
    if (event.key === 'End') { event.preventDefault(); go(deck.slides.length - 1); }
  });

  if (el('#choose-film')) el('#choose-film').onclick = () => el('#film-file').click();
  let videoUrl;
  el('#film-file').onchange = event => {
    const file = event.target.files[0]; if (!file) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video'); video.controls = true; video.playsInline = true; video.src = videoUrl; video.preload = 'metadata'; video.setAttribute('aria-label', `${deck.brandname} introduction film`);
    el('#film-frame').replaceChildren(video);
    el('#film-ready').hidden = false; el('#film-ready').textContent = `${file.name} ready to play.`;
  };

  if (isAva) {
    let busy = false;
    const experience = deck.slides.find(slide => slide.type === 'experience');
    document.querySelectorAll('[data-chat]').forEach(button => button.onclick = () => {
      if (busy) return; busy = true;
      const index = Number(button.dataset.chat), log = el('#chat-messages');
      log.insertAdjacentHTML('beforeend', `<div class="bubble out">${safe(experience.starters[index])}<small>You</small></div><div class="bubble typing" id="typing" aria-label="Reply loading"><i></i><i></i><i></i></div>`);
      log.scrollTop = log.scrollHeight;
      setTimeout(() => { el('#typing')?.remove(); log.insertAdjacentHTML('beforeend', `<div class="bubble">${safe(experience.replies[index])}</div>`); log.scrollTop = log.scrollHeight; busy = false; }, 650);
    });
    let price = deck.slides.find(slide => slide.type === 'model').prices[0];
    const updateScenario = () => { const accounts = Number(el('#accounts').value); el('#account-count').textContent = accounts.toLocaleString('en-US'); el('#scenario-total').textContent = money(accounts * price, accounts * price % 1 !== 0); };
    el('#accounts').oninput = updateScenario;
    document.querySelectorAll('[data-price]').forEach(button => button.onclick = () => { price = Number(button.dataset.price); document.querySelectorAll('[data-price]').forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); }); updateScenario(); });
    if (el('#beta-toggle')) el('#beta-toggle').onclick = () => { const open = el('#beta-breakdown').classList.toggle('open'), ask = deck.slides.find(slide => slide.type === 'ask'); el('#beta-toggle').textContent = open ? 'Hide the beta breakdown' : `View the ${money(ask.betaAsk)} beta breakdown`; el('#beta-toggle').setAttribute('aria-expanded', String(open)); };
  } else {
    el('#load-room').onclick = async () => {
      const button = el('#load-room'); button.disabled = true; button.textContent = 'Loading the actual room…';
      try {
        if (!window.MemorXRoom) await new Promise((resolve,reject) => { const script = document.createElement('script'); script.src = 'room.js'; script.onload = resolve; script.onerror = reject; document.body.append(script); });
        await window.MemorXRoom.mount(el('#room-canvas'));
      } catch (error) { el('#room-status').textContent = 'Room could not load. Use the studio image on the next slide.'; button.disabled = false; button.textContent = 'Retry room'; }
    };
    window.addEventListener('room-ready', () => { el('#room-poster').hidden = true; el('#memory-pin').hidden = false; el('.room-buttons').hidden = false; el('#room-status').textContent = 'Drag to look · Movement controls · Home to reset'; });
    window.addEventListener('room-error', () => { el('#room-status').textContent = '3D unavailable. The next slide contains the actual studio capture.'; });
    el('#memory-pin').onclick = () => { el('#memory-detail').hidden = false; el('#close-memory').focus(); };
    el('#close-memory').onclick = () => { el('#memory-detail').hidden = true; el('#memory-pin').focus(); };
    const serviceRows = deck.slides.find(slide => slide.type === 'model').rows;
    document.querySelectorAll('[data-service]').forEach(button => button.onclick = () => { const row = serviceRows[Number(button.dataset.service)]; const list = el('#service-points'); list.setAttribute('aria-label', `${row.title} details`); list.innerHTML = (row.points || []).map(point => `<li>${safe(point)}</li>`).join(''); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) list.animate([{opacity:0.4,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}], {duration:300,easing:'ease-out'}); document.querySelectorAll('[data-service]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); }); });
  }
  window.Deck = {go,key,deck,get current() { return current; }};
  window.addEventListener('hashchange', () => go((Number(location.hash.slice(1)) || 1) - 1));
  window.addEventListener('beforeprint', () => { cancelAnimationFrame(counterFrame); if (el('[data-count]')) el('[data-count]').textContent = money(el('[data-count]').dataset.count); });
  go((Number(location.hash.slice(1)) || 1) - 1);
})();
