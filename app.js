document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initMiniCalcSwitcher();
  initCalculators();
  initVideos();
  initEducation();
  initNews();
  initNewsletter();
});

// ==========================================
// SPA ROUTER
// ==========================================
function initRouter() {
  const navLinks = document.querySelectorAll('[data-target]');
  const views = document.querySelectorAll('.section-view');

  function navigateTo(targetId) {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Toggle active link
    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Toggle active view
    views.forEach(view => {
      if (view.id === targetId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Run chart rendering or custom view initialization if needed
    if (targetId === 'investing') {
      calculateCompoundInterest();
    } else if (targetId === 'budgeting') {
      calculateBudget();
    } else if (targetId === 'saving') {
      calculateEmergencyFund();
    } else if (targetId === 'debt') {
      calculateDebtPayoff();
    } else if (targetId === 'education') {
      // triggers initial category rendering if needed
    } else if (targetId === 'news') {
      // triggers initial news rendering
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      navigateTo(targetId);
    });
  });

  // Intercept other internal CTA links
  document.body.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-go-to]');
    if (cta) {
      e.preventDefault();
      const targetId = cta.getAttribute('data-go-to');
      navigateTo(targetId);
    }
  });

  // Set default home active
  navigateTo('home');
}

// ==========================================
// MINI CALCULATOR SWITCHER
// ==========================================
function initMiniCalcSwitcher() {
  const switchers = document.querySelectorAll('[data-calc-switch]');
  const panes = document.querySelectorAll('.mini-calc-pane');

  switchers.forEach(btn => {
    btn.addEventListener('click', () => {
      switchers.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetPane = btn.getAttribute('data-calc-switch');
      panes.forEach(pane => {
        if (pane.id === `mini-pane-${targetPane}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

// ==========================================
// FINANCIAL CALCULATORS
// ==========================================
function initCalculators() {
  // Budget inputs listener
  const budgetInputs = ['budget-income', 'budget-needs-override', 'budget-wants-override', 'budget-savings-override'];
  budgetInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateBudget);
  });

  // Emergency Fund inputs listener
  const savingInputs = ['saving-expenses', 'saving-months', 'saving-current', 'saving-monthly'];
  savingInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateEmergencyFund);
  });

  // Compound Interest inputs listener
  const investInputs = ['invest-principal', 'invest-monthly', 'invest-rate', 'invest-years'];
  investInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateCompoundInterest);
  });

  // Debt Payoff inputs listener
  const debtInputs = ['debt-amount', 'debt-rate', 'debt-payment', 'debt-strategy'];
  debtInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateDebtPayoff);
  });

  // Home Page Mini Calculators listeners
  const homeBudgetIncome = document.getElementById('home-budget-income');
  if (homeBudgetIncome) {
    homeBudgetIncome.addEventListener('input', calculateHomeBudget);
  }

  const homeInvestPrincipal = document.getElementById('home-invest-principal');
  const homeInvestYears = document.getElementById('home-invest-years');
  if (homeInvestPrincipal && homeInvestYears) {
    homeInvestPrincipal.addEventListener('input', calculateHomeInvest);
    homeInvestYears.addEventListener('input', calculateHomeInvest);
  }

  const homeSipMonthly = document.getElementById('home-sip-monthly');
  const homeSipRate = document.getElementById('home-sip-rate');
  const homeSipYears = document.getElementById('home-sip-years');
  if (homeSipMonthly && homeSipRate && homeSipYears) {
    homeSipMonthly.addEventListener('input', calculateHomeSIP);
    homeSipRate.addEventListener('input', calculateHomeSIP);
    homeSipYears.addEventListener('input', calculateHomeSIP);
  }

  // Run initial calculations
  calculateHomeBudget();
  calculateHomeInvest();
  calculateHomeSIP();
}

// Format Currency Utility (Nepalese Rupees / Standard Currency Formatting)
function formatCurrency(val) {
  if (isNaN(val) || val === null) val = 0;
  return 'Rs. ' + Math.round(val).toLocaleString('en-IN');
}

// --- Home Budget Calc ---
function calculateHomeBudget() {
  const incomeEl = document.getElementById('home-budget-income');
  if (!incomeEl) return;
  const income = parseFloat(incomeEl.value) || 0;

  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;

  document.getElementById('home-budget-needs').textContent = formatCurrency(needs);
  document.getElementById('home-budget-wants').textContent = formatCurrency(wants);
  document.getElementById('home-budget-savings').textContent = formatCurrency(savings);

  // Update visual bar
  const bar = document.getElementById('home-budget-bar');
  if (bar && income > 0) {
    bar.innerHTML = `
      <div class="visual-bar-segment segment-needs" style="width: 50%"></div>
      <div class="visual-bar-segment segment-wants" style="width: 30%"></div>
      <div class="visual-bar-segment segment-savings" style="width: 20%"></div>
    `;
  }
}

// --- Home Invest Calc ---
function calculateHomeInvest() {
  const principalEl = document.getElementById('home-invest-principal');
  const yearsEl = document.getElementById('home-invest-years');
  if (!principalEl || !yearsEl) return;

  const principal = parseFloat(principalEl.value) || 0;
  const years = parseFloat(yearsEl.value) || 0;
  const rate = 0.12; // assume standard 12% stock market growth index

  // Compound Interest: A = P(1 + r)^n
  const total = principal * Math.pow(1 + rate, years);
  const interest = total - principal;

  document.getElementById('home-invest-interest').textContent = formatCurrency(interest);
  document.getElementById('home-invest-total').textContent = formatCurrency(total);
}

// --- Home SIP Calc (Systematic Investment Plan as per Nepal) ---
function calculateHomeSIP() {
  const monthlyEl = document.getElementById('home-sip-monthly');
  const rateEl = document.getElementById('home-sip-rate');
  const yearsEl = document.getElementById('home-sip-years');
  
  if (!monthlyEl || !rateEl || !yearsEl) return;

  const P = parseFloat(monthlyEl.value) || 0;
  const rate = parseFloat(rateEl.value) || 0;
  const years = parseFloat(yearsEl.value) || 0;

  const i = (rate / 100) / 12;
  const n = years * 12;

  let futureValue = 0;
  if (P > 0 && n > 0) {
    if (i > 0) {
      // Future Value of Annuity Due: FV = P * [((1 + i)^n - 1) / i] * (1 + i)
      futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      futureValue = P * n;
    }
  }

  const invested = P * n;
  const gain = Math.max(0, futureValue - invested);

  document.getElementById('home-sip-invested').textContent = formatCurrency(invested);
  document.getElementById('home-sip-gain').textContent = formatCurrency(gain);
  document.getElementById('home-sip-total').textContent = formatCurrency(futureValue);
}

// --- Full Tab: Budget Calculator ---
function calculateBudget() {
  const incomeVal = parseFloat(document.getElementById('budget-income').value) || 0;
  const needsOverride = parseFloat(document.getElementById('budget-needs-override').value) || 0;
  const wantsOverride = parseFloat(document.getElementById('budget-wants-override').value) || 0;
  const savingsOverride = parseFloat(document.getElementById('budget-savings-override').value) || 0;

  let needs = incomeVal * 0.5;
  let wants = incomeVal * 0.3;
  let savings = incomeVal * 0.2;

  // Custom Itemized overrides additions
  const totalOverrides = needsOverride + wantsOverride + savingsOverride;

  if (totalOverrides > 0) {
    needs = needsOverride;
    wants = wantsOverride;
    savings = savingsOverride;
  }

  const calculatedTotal = needs + wants + savings;
  const remaining = incomeVal - calculatedTotal;

  document.getElementById('result-budget-needs').textContent = formatCurrency(needs);
  document.getElementById('result-budget-wants').textContent = formatCurrency(wants);
  document.getElementById('result-budget-savings').textContent = formatCurrency(savings);

  const remainingEl = document.getElementById('result-budget-remaining');
  if (remaining < 0) {
    remainingEl.textContent = formatCurrency(remaining);
    remainingEl.style.color = 'var(--color-error)';
  } else {
    remainingEl.textContent = formatCurrency(remaining);
    remainingEl.style.color = 'var(--color-success)';
  }

  // Update percentages on breakdown indicators
  const total = calculatedTotal || incomeVal || 1;
  const pNeeds = Math.round((needs / total) * 100);
  const pWants = Math.round((wants / total) * 100);
  const pSavings = Math.round((savings / total) * 100);

  document.getElementById('pct-budget-needs').textContent = `${pNeeds}%`;
  document.getElementById('pct-budget-wants').textContent = `${pWants}%`;
  document.getElementById('pct-budget-savings').textContent = `${pSavings}%`;

  // Draw visual bar
  const bar = document.getElementById('budget-visual-bar');
  if (bar && calculatedTotal > 0) {
    bar.innerHTML = `
      <div class="visual-bar-segment segment-needs" style="width: ${(needs/calculatedTotal)*100}%"></div>
      <div class="visual-bar-segment segment-wants" style="width: ${(wants/calculatedTotal)*100}%"></div>
      <div class="visual-bar-segment segment-savings" style="width: ${(savings/calculatedTotal)*100}%"></div>
    `;
  }
}

// --- Full Tab: Emergency Fund Calculator ---
function calculateEmergencyFund() {
  const expenses = parseFloat(document.getElementById('saving-expenses').value) || 0;
  const targetMonths = parseFloat(document.getElementById('saving-months').value) || 6;
  const currentSavings = parseFloat(document.getElementById('saving-current').value) || 0;
  const monthlyContribution = parseFloat(document.getElementById('saving-monthly').value) || 0;

  const targetFund = expenses * targetMonths;
  const netNeeded = Math.max(0, targetFund - currentSavings);

  let monthsToTarget = 0;
  if (monthlyContribution > 0 && netNeeded > 0) {
    monthsToTarget = netNeeded / monthlyContribution;
  }

  document.getElementById('result-saving-target').textContent = formatCurrency(targetFund);
  document.getElementById('result-saving-current').textContent = formatCurrency(currentSavings);
  document.getElementById('result-saving-needed').textContent = formatCurrency(netNeeded);

  const durationEl = document.getElementById('result-saving-time');
  if (netNeeded === 0) {
    durationEl.textContent = 'Fund Fully Funded!';
    durationEl.style.color = 'var(--color-success)';
  } else if (monthlyContribution === 0) {
    durationEl.textContent = 'Indefinite (requires monthly contributions)';
    durationEl.style.color = 'var(--color-muted)';
  } else {
    durationEl.textContent = `${Math.ceil(monthsToTarget)} Months`;
    durationEl.style.color = 'var(--color-primary)';
  }
}

// --- Full Tab: Compound Interest Simulator ---
function calculateCompoundInterest() {
  const principal = parseFloat(document.getElementById('invest-principal').value) || 0;
  const monthly = parseFloat(document.getElementById('invest-monthly').value) || 0;
  const rateAnnual = (parseFloat(document.getElementById('invest-rate').value) || 0) / 100;
  const years = parseFloat(document.getElementById('invest-years').value) || 10;

  const monthlyRate = rateAnnual / 12;
  const totalMonths = years * 12;

  let totalPortfolio = principal;
  let totalContributions = principal;

  // Track values for the chart drawing
  const chartData = [];
  chartData.push({ month: 0, year: 0, contributions: totalContributions, balance: totalPortfolio });

  for (let m = 1; m <= totalMonths; m++) {
    // Balance grows by monthly interest
    totalPortfolio = totalPortfolio * (1 + monthlyRate) + monthly;
    totalContributions += monthly;

    // Save annual values or final values
    if (m % 12 === 0 || m === totalMonths) {
      chartData.push({
        month: m,
        year: m / 12,
        contributions: totalContributions,
        balance: totalPortfolio
      });
    }
  }

  const interestEarned = totalPortfolio - totalContributions;

  document.getElementById('result-invest-contributions').textContent = formatCurrency(totalContributions);
  document.getElementById('result-invest-interest').textContent = formatCurrency(interestEarned);
  document.getElementById('result-invest-total').textContent = formatCurrency(totalPortfolio);

  // Draw the chart
  renderCompoundChart(chartData);
}

// SVG Compound Interest Chart Renderer
function renderCompoundChart(data) {
  const svg = document.getElementById('compound-chart-svg');
  if (!svg) return;

  const width = svg.clientWidth || 500;
  const height = 200;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Clear previous contents
  svg.innerHTML = '';

  if (data.length === 0) return;

  // Max value in data for y-scaling
  const maxVal = Math.max(...data.map(d => d.balance)) || 1000;
  const maxYear = data[data.length - 1].year || 1;

  // Function to map values to coordinates
  function getX(year) {
    return paddingLeft + (year / maxYear) * chartWidth;
  }

  function getY(value) {
    return paddingTop + chartHeight - (value / maxVal) * chartHeight;
  }

  // Draw horizontal grid lines
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const yVal = (maxVal / ticks) * i;
    const yCo = getY(yVal);

    // Grid Line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', paddingLeft);
    line.setAttribute('y1', yCo);
    line.setAttribute('x2', width - paddingRight);
    line.setAttribute('y2', yCo);
    line.setAttribute('class', 'chart-grid-line');
    svg.appendChild(line);

    // Y Axis Text label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', paddingLeft - 8);
    text.setAttribute('y', yCo + 4);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('class', 'chart-axis-text');
    // Format large numbers (K, M)
    let label = '';
    if (yVal >= 10000000) label = (yVal / 10000000).toFixed(1) + 'Cr';
    else if (yVal >= 100000) label = (yVal / 100000).toFixed(1) + 'L';
    else if (yVal >= 1000) label = (yVal / 1000).toFixed(0) + 'k';
    else label = Math.round(yVal).toString();
    
    text.textContent = label;
    svg.appendChild(text);
  }

  // Draw lines paths
  let pathContrib = '';
  let pathBalance = '';

  data.forEach((d, idx) => {
    const x = getX(d.year);
    const yC = getY(d.contributions);
    const yB = getY(d.balance);

    if (idx === 0) {
      pathContrib = `M ${x} ${yC}`;
      pathBalance = `M ${x} ${yB}`;
    } else {
      pathContrib += ` L ${x} ${yC}`;
      pathBalance += ` L ${x} ${yB}`;
    }

    // Add Year Labels on X Axis
    if (data.length <= 11 || idx % Math.ceil(data.length / 6) === 0 || idx === data.length - 1) {
      const textX = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textX.setAttribute('x', x);
      textX.setAttribute('y', height - 6);
      textX.setAttribute('text-anchor', 'middle');
      textX.setAttribute('class', 'chart-axis-text');
      textX.textContent = `Yr ${Math.round(d.year)}`;
      svg.appendChild(textX);
    }
  });

  // Render Contributions line
  const pC = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pC.setAttribute('d', pathContrib);
  pC.setAttribute('class', 'chart-line-contributions');
  svg.appendChild(pC);

  // Render Balance line
  const pB = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pB.setAttribute('d', pathBalance);
  pB.setAttribute('class', 'chart-line-interest');
  svg.appendChild(pB);
}

// --- Full Tab: Debt Payoff Simulator ---
function calculateDebtPayoff() {
  const debt = parseFloat(document.getElementById('debt-amount').value) || 0;
  const rateAnnual = (parseFloat(document.getElementById('debt-rate').value) || 0) / 100;
  const payment = parseFloat(document.getElementById('debt-payment').value) || 0;
  const strategy = document.getElementById('debt-strategy').value;

  const monthlyRate = rateAnnual / 12;

  // Payoff calculations
  if (debt === 0) {
    document.getElementById('result-debt-months').textContent = '0 Months';
    document.getElementById('result-debt-interest').textContent = formatCurrency(0);
    document.getElementById('result-debt-total').textContent = formatCurrency(0);
    document.getElementById('result-debt-impact').textContent = 'Clear and free!';
    return;
  }

  // Monthly interest is debt * monthlyRate
  const firstMonthInterest = debt * monthlyRate;
  if (payment <= firstMonthInterest) {
    document.getElementById('result-debt-months').textContent = 'Never Paid Off';
    document.getElementById('result-debt-interest').textContent = 'Infinite';
    document.getElementById('result-debt-total').textContent = 'Infinite';
    document.getElementById('result-debt-impact').textContent = 'Warning: Monthly payment is lower than monthly interest generated!';
    document.getElementById('result-debt-impact').style.color = 'var(--color-error)';
    return;
  }

  let balance = debt;
  let months = 0;
  let totalInterestPaid = 0;

  // Let's cap simulation to 360 months (30 years) to prevent crash loops
  while (balance > 0 && months < 360) {
    months++;
    const interest = balance * monthlyRate;
    totalInterestPaid += interest;
    balance = balance + interest - payment;

    if (balance < 0) balance = 0;
  }

  document.getElementById('result-debt-months').textContent = `${months === 360 ? '30+ Years' : months + ' Months'}`;
  document.getElementById('result-debt-interest').textContent = formatCurrency(totalInterestPaid);
  document.getElementById('result-debt-total').textContent = formatCurrency(debt + totalInterestPaid);

  const impactEl = document.getElementById('result-debt-impact');
  impactEl.style.color = 'var(--color-primary)';
  if (strategy === 'avalanche') {
    impactEl.textContent = `Debt Avalanche: Focusing on highest interest first saves you an estimated ${formatCurrency(totalInterestPaid * 0.15)} in total interest compared to standard schedules.`;
  } else {
    impactEl.textContent = `Debt Snowball: Knocking out smallest balances first provides quick psychological wins to keep your payoff streak going!`;
  }
}

// ==========================================
// VIDEOS / MEDIA LIBRARY
// ==========================================
const VIDEO_DATABASE = [
  {
    id: 'spotlight',
    title: 'NEPSE Technical Analysis: Tweezers Bottom & Trends Explained',
    category: 'NEPSE Analysis',
    date: 'May 28, 2026',
    duration: '14:20',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder embed link
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    desc: 'An in-depth review of the Nepal Stock Exchange (NEPSE) index charts. Learn how the formation of a "Tweezers Bottom" candlestick pattern signalizes a bullish reversal and what steps retail investors should consider next.'
  },
  {
    id: 'vid-1',
    title: 'Understanding Double Bottom Patterns in NEPSE',
    category: 'Technical Indicators',
    date: 'May 24, 2026',
    duration: '11:15',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400',
    desc: 'How to spot double bottom chart formations and utilize volume confirmation to identify entry points on the Nepal stock market.'
  },
  {
    id: 'vid-2',
    title: '5 Practical Personal Finance Tips for Beginners',
    category: 'Personal Finance',
    date: 'May 15, 2026',
    duration: '8:45',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400',
    desc: 'A simple, non-jargon personal finance guide for high school graduates and young professionals. Starting emergency savings, understanding debts, and setting budgets.'
  },
  {
    id: 'vid-3',
    title: 'Budgeting Secrets: How to Stick to the 50/30/20 Rule',
    category: 'Budgeting Tips',
    date: 'May 02, 2026',
    duration: '10:30',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    desc: 'Step-by-step walkthrough of creating your monthly spending spreadsheet and avoiding common friction points that make budgets fail.'
  },
  {
    id: 'vid-4',
    title: 'Common Mistakes in Trading Stocks: Managing Risk',
    category: 'NEPSE Analysis',
    date: 'Apr 28, 2026',
    duration: '15:10',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=400',
    desc: 'Why over-leveraging and chasing speculative stocks ruins portfolios. Understanding the math of position sizing and stop-loss placements.'
  },
  {
    id: 'vid-5',
    title: 'Mutual Funds vs. Direct Stocks in Nepal',
    category: 'Personal Finance',
    date: 'Apr 12, 2026',
    duration: '12:00',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
    desc: 'Comparing the security and returns of SIP mutual funds with purchasing individual stocks. Find out which fits your risk tolerance.'
  }
];

function initVideos() {
  const spotlightContainer = document.getElementById('home-video-spotlight');
  const videosGrid = document.getElementById('videos-grid-container');
  const searchInput = document.getElementById('video-search-input');
  
  // Render Spotlight Card on Home Page
  if (spotlightContainer) {
    const spotlight = VIDEO_DATABASE.find(v => v.id === 'spotlight');
    if (spotlight) {
      spotlightContainer.innerHTML = `
        <div class="spotlight-card" data-video-id="${spotlight.id}">
          <div class="video-thumbnail-container">
            <img src="${spotlight.thumbnail}" alt="${spotlight.title}">
            <div class="play-overlay">
              <div class="play-btn-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="video-info">
            <span class="badge" style="margin-bottom: 0.75rem">${spotlight.category}</span>
            <h3>${spotlight.title}</h3>
            <p>${spotlight.desc}</p>
          </div>
        </div>
      `;
    }
  }

  // Render Video Grid on Videos Tab
  function renderVideoGrid(filteredList) {
    if (!videosGrid) return;
    
    if (filteredList.length === 0) {
      videosGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--color-muted)">
          <p>No videos found matching your search term. Try another keyword!</p>
        </div>
      `;
      return;
    }

    videosGrid.innerHTML = filteredList.map(vid => `
      <div class="video-card" data-video-id="${vid.id}">
        <div class="video-card-thumb">
          <img src="${vid.thumbnail}" alt="${vid.title}">
          <span class="play-mini">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </span>
        </div>
        <div class="video-card-body">
          <span class="video-tag">${vid.category}</span>
          <h3>${vid.title}</h3>
          <span class="video-date">${vid.date} • ${vid.duration}</span>
        </div>
      </div>
    `).join('');
  }

  // Initial Grid Render
  renderVideoGrid(VIDEO_DATABASE);

  // Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = VIDEO_DATABASE.filter(vid => 
        vid.title.toLowerCase().includes(q) || 
        vid.category.toLowerCase().includes(q) ||
        vid.desc.toLowerCase().includes(q)
      );
      renderVideoGrid(filtered);
    });
  }

  // Setup Video Click to Modal Popups
  document.body.addEventListener('click', (e) => {
    const card = e.target.closest('[data-video-id]');
    if (card) {
      const vidId = card.getAttribute('data-video-id');
      const video = VIDEO_DATABASE.find(v => v.id === vidId);
      if (video) {
        openVideoModal(video);
      }
    }
  });

  // Modal close trigger
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  
  if (modalClose) {
    modalClose.addEventListener('click', closeVideoModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeVideoModal();
      }
    });
  }
}

function openVideoModal(video) {
  const overlay = document.getElementById('modal-overlay');
  const iframeWrapper = document.getElementById('modal-iframe-container');
  const tag = document.getElementById('modal-video-tag');
  const title = document.getElementById('modal-video-title');
  const desc = document.getElementById('modal-video-desc');

  if (!overlay || !iframeWrapper) return;

  tag.textContent = video.category;
  title.textContent = video.title;
  desc.textContent = video.desc;

  // Let's create an actual YouTube iframe embed.
  // Use a neat embed template. If it's a real channel, standard embed will be used.
  iframeWrapper.innerHTML = `
    <iframe src="${video.videoUrl}?autoplay=1&rel=0" 
            title="${video.title}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
    </iframe>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // stop page scrolling
}

function closeVideoModal() {
  const overlay = document.getElementById('modal-overlay');
  const iframeWrapper = document.getElementById('modal-iframe-container');

  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.style.overflow = ''; // restore scrolling

  // Remove iframe to halt video audio playback
  if (iframeWrapper) {
    iframeWrapper.innerHTML = '';
  }
}

// ==========================================
// NEWSLETTER
// ==========================================
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      const msgEl = form.nextElementSibling; // the message paragraph next to form
      
      if (!emailInput || !emailInput.value) return;

      const email = emailInput.value.trim();
      
      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMsg(msgEl, 'Please enter a valid email address.', 'var(--color-error)');
        return;
      }

      // Visual success response
      showMsg(msgEl, 'Success! You are now subscribed to Smart Money Insights.', 'var(--color-accent)');
      emailInput.value = '';
    });
  });

  function showMsg(el, text, color) {
    if (!el) return;
    el.textContent = text;
    el.style.color = color;
    el.classList.add('active');

    setTimeout(() => {
      el.classList.remove('active');
    }, 4000);
  }
}

// ==========================================
// EDUCATION / WEALTH LIBRARY
// ==========================================
const BOOK_DATABASE = [
  {
    id: 'book-1',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'psychology',
    tagline: "Doing well with money isn't necessarily about what you know. It's about how you behave.",
    gradient: 'linear-gradient(135deg, #2c3e50, #bdc3c7)',
    description: 'A brilliant exploration of the psychological and behavioral quirks that govern how we interact with money. Through 19 short stories, Housel explains how personal experience and ego often drive financial choices more than equations.',
    takeaways: [
      { title: "No One's Crazy", detail: 'Our financial decisions are heavily shaped by when and where we grew up. Your risk appetite is biased by the generation you lived through.' },
      { title: 'Confounding Luck and Risk', detail: 'Nothing is as good or as bad as it looks. Successful investing requires humility, realizing that luck plays a massive role in returns.' },
      { title: 'Never Enough', detail: "Modern capitalism is great at making people feel inadequate. Knowing when to stop taking risk is key—don't jeopardize what you need for what you only want." },
      { title: 'Wealth vs. Richness', detail: 'Rich is current income (seen in cars, clothes, houses). Wealth is income not spent (unseen options, freedom, flexibility).' }
    ]
  },
  {
    id: 'book-2',
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    category: 'literature',
    tagline: 'What the rich teach their kids about money that the poor and middle class do not!',
    gradient: 'linear-gradient(135deg, #d35400, #f1c40f)',
    description: "A classic that advocates for financial literacy and cash flow independence. Explains how Robert learned contrasting financial philosophies from his academic father (Poor Dad) and his friend's entrepreneur father (Rich Dad).",
    takeaways: [
      { title: "The Rich Don't Work for Money", detail: 'The poor and middle class trade hours for checks, which are taxed heavily. The rich build or buy assets that generate income for them.' },
      { title: 'Asset vs. Liability', detail: 'An asset puts money *into* your pocket. A liability takes money *out* of your pocket. The middle class buys liabilities thinking they are assets (like a primary residence).' },
      { title: 'Mind Your Own Business', detail: 'Keep your day job, but begin buying real assets (stocks, real estate, IP) rather than spending your entire check on consumer items.' },
      { title: 'Financial Intelligence', detail: 'Learn accounting, investing, understanding markets, and law (corporate structures) to maximize profits and minimize tax liabilities.' }
    ]
  },
  {
    id: 'book-3',
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    category: 'investing',
    tagline: 'The classic text on value investing, teaching defensive discipline over speculation.',
    gradient: 'linear-gradient(135deg, #1b4d3e, #2d6a4f)',
    description: 'Known as the bible of value investing, Graham outlines strategies for the "defensive investor" and the "enterprising investor," teaching readers how to shield themselves from substantial losses and establish long-term strategies.',
    takeaways: [
      { title: 'Investment vs. Speculation', detail: 'An investment operation promises safety of principal and an adequate return. Speculative actions chase rapid market price movements.' },
      { title: 'Meet Mr. Market', detail: 'Imagine the market as a moody business partner offering to buy or sell shares daily. Buy when he is depressed (prices low) and sell when he is euphoric (prices high).' },
      { title: 'Margin of Safety', detail: 'Always purchase assets at a discount to their intrinsic value. This safety margin cushions you against errors, market drops, or unexpected economic cycles.' },
      { title: 'Dollar-Cost Averaging', detail: 'Graham advocates for the defensive investor to consistently purchase index assets at pre-set intervals, ignoring day-to-day market noise.' }
    ]
  },
  {
    id: 'book-4',
    title: 'Market Wizards',
    author: 'Jack D. Schwager',
    category: 'trading',
    tagline: 'Interviews with top traders who turned thousands into multi-millions.',
    gradient: 'linear-gradient(135deg, #7f8c8d, #2c3e50)',
    description: 'A curated collection of interviews with legendary trading figures, highlighting technical setups, mental disciplines, risk control mechanisms, and the traits shared by successful market operators.',
    takeaways: [
      { title: 'Risk Management is King', detail: 'Almost all wizards agree that cutting losses quickly is the most critical rule. Never risk more than 1-2% of your equity on a single trade.' },
      { title: 'Develop Your Own Style', detail: 'A trading plan must match your psychology. Do not blindly copy others; test and discover systems that suit your personal tolerance.' },
      { title: 'Patience and Discipline', detail: 'Wizards wait for setups that offer high-probability wins. They do not trade out of boredom or search for action.' },
      { title: 'Emotional Control', detail: 'Separate your self-worth from individual trade outcomes. Accept losses as standard business overhead costs.' }
    ]
  },
  {
    id: 'book-5',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    category: 'motivational',
    tagline: 'Whatever the mind can conceive and believe, it can achieve.',
    gradient: 'linear-gradient(135deg, #8e44ad, #2c3e50)',
    description: 'Based on 20 years of research studying wealthy individuals like Andrew Carnegie, Henry Ford, and Thomas Edison, Hill outlines 13 principles of personal achievement and mindset shifts necessary for wealth.',
    takeaways: [
      { title: 'Definite Major Purpose', detail: 'Vague dreams do not manifest. Write down a specific financial sum you desire, the exact date you will reach it, and what you will give in exchange.' },
      { title: 'Auto-suggestion', detail: 'Reprogram your subconscious mind by reading your goals aloud morning and night, visualising the wealth already in your possession.' },
      { title: 'Specialized Knowledge', detail: "General knowledge won't make you rich. Focus on specialized training and form a 'Master Mind' group of skilled individuals to execute projects." },
      { title: 'Persistence', detail: 'Defeat is temporary. Wiping out fear and building raw perseverance is the primary dividing line between success and failure.' }
    ]
  },
  {
    id: 'book-6',
    title: 'The 4-Hour Workweek',
    author: 'Timothy Ferriss',
    category: 'lifestyle',
    tagline: 'Escape 9-5, live anywhere, and join the New Rich.',
    gradient: 'linear-gradient(135deg, #1abc9c, #16a085)',
    description: 'A disruptive manifesto challenging the traditional retirement model. Ferriss outlines the DEAL framework (Definition, Elimination, Automation, Liberation) to design a lifestyle of mobility, cash flow, and time freedom.',
    takeaways: [
      { title: 'Relative Income vs. Absolute Income', detail: 'Absolute income is how much you earn. Relative income incorporates time. Earning Rs. 50,000 working 5 hours a week is wealthier than earning Rs. 2,00,000 working 60 hours.' },
      { title: 'Income Automation (Muse)', detail: 'Build a low-overhead cash generator (a "muse") using dropshipping, digital downloads, or licensing that runs on autopilot.' },
      { title: 'Low-Information Diet', detail: 'Eliminate attention-draining media and meetings. Focus on the 80/20 rule (20% of effort yielding 80% of results) and outsource tasks.' },
      { title: 'Geo-Arbitrage', detail: 'Earn in strong currencies and live/spend in lower-cost locations to amplify your purchasing power and freedom.' }
    ]
  },
  {
    id: 'book-7',
    title: 'The Richest Man in Babylon',
    author: 'George S. Clason',
    category: 'literature',
    tagline: 'The ancient secrets of financial success told through timeless parables.',
    gradient: 'linear-gradient(135deg, #d4af37, #8a7312)',
    description: 'Set in ancient Babylon, this book delivers fundamental personal finance rules through parables. It focuses on saving, investing wisely, avoiding debt, and seeking professional guidance.',
    takeaways: [
      { title: 'Pay Yourself First', detail: 'A part of all you earn is yours to keep. Save at least 10% (one-tenth) of your income before paying any bills or expenses.' },
      { title: 'Control Thy Expenditures', detail: 'Budget your wants so they do not confuse casual desires with necessary expenses.' },
      { title: 'Make Thy Gold Multiply', detail: 'Put your savings to work so they earn interest, and that interest earns interest, creating a stream of wealth helpers.' },
      { title: 'Guard Thy Treasures from Loss', detail: 'Invest only where your principal is safe. Seek counsel from experts who work in that field, not amateurs.' }
    ]
  }
];

function initEducation() {
  const booksGrid = document.getElementById('books-grid-container');
  const searchInput = document.getElementById('library-search-input');
  const categories = document.querySelectorAll('[data-lib-filter]');

  function renderBooksGrid(filteredList) {
    if (!booksGrid) return;
    
    if (filteredList.length === 0) {
      booksGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--color-muted)">
          <p>No books found matching your search term. Try another keyword!</p>
        </div>
      `;
      return;
    }

    booksGrid.innerHTML = filteredList.map(book => `
      <div class="book-card" data-book-id="${book.id}">
        <div class="book-cover-container">
          <div class="book-cover" style="background: ${book.gradient}">
            <div class="book-cover-title">${book.title}</div>
            <div class="book-cover-author">${book.author.split(' ').pop()}</div>
          </div>
        </div>
        <div class="book-meta">
          <span class="book-tag">${book.category}</span>
          <h3>${book.title}</h3>
          <span class="book-author-text">by ${book.author}</span>
          <p>${book.tagline}</p>
          <span class="book-lessons-preview">
            View Lessons &rarr;
          </span>
        </div>
      </div>
    `).join('');
  }

  // Initial render
  renderBooksGrid(BOOK_DATABASE);

  // Category Filtering
  categories.forEach(btn => {
    btn.addEventListener('click', () => {
      categories.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-lib-filter');
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

      const filtered = BOOK_DATABASE.filter(book => {
        const matchesCategory = filter === 'all' || book.category === filter;
        const matchesSearch = book.title.toLowerCase().includes(q) || 
                              book.author.toLowerCase().includes(q) || 
                              book.tagline.toLowerCase().includes(q) || 
                              book.description.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      });

      renderBooksGrid(filtered);
    });
  });

  // Search input filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const activeBtn = document.querySelector('.lib-cat-btn.active');
      const filter = activeBtn ? activeBtn.getAttribute('data-lib-filter') : 'all';

      const filtered = BOOK_DATABASE.filter(book => {
        const matchesCategory = filter === 'all' || book.category === filter;
        const matchesSearch = book.title.toLowerCase().includes(q) || 
                              book.author.toLowerCase().includes(q) || 
                              book.tagline.toLowerCase().includes(q) || 
                              book.description.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      });

      renderBooksGrid(filtered);
    });
  }

  // Event handler for book click to open modal
  document.body.addEventListener('click', (e) => {
    const card = e.target.closest('[data-book-id]');
    if (card) {
      const bookId = card.getAttribute('data-book-id');
      const book = BOOK_DATABASE.find(b => b.id === bookId);
      if (book) {
        openBookModal(book);
      }
    }
  });
}

function openBookModal(book) {
  const overlay = document.getElementById('modal-overlay');
  const banner = document.getElementById('modal-iframe-container');
  const tag = document.getElementById('modal-video-tag');
  const title = document.getElementById('modal-video-title');
  const desc = document.getElementById('modal-video-desc');

  if (!overlay || !banner) return;

  tag.textContent = book.category;
  title.textContent = book.title;

  banner.innerHTML = `
    <div style="background: ${book.gradient}; height: 160px; display: flex; align-items: center; justify-content: center; color: #fff; text-align: center; padding: 2rem; box-shadow: inset 0 0 100px rgba(0,0,0,0.2)">
      <div>
        <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.25rem;">${book.title}</h3>
        <p style="font-size: 0.85rem; opacity: 0.9;">by ${book.author}</p>
      </div>
    </div>
  `;

  const takeawaysHtml = book.takeaways.map(t => `
    <div class="modal-takeaway-item">
      <strong>${t.title}</strong>
      <span>${t.detail}</span>
    </div>
  `).join('');

  desc.innerHTML = `
    <p style="margin-bottom: 1.25rem; font-style: italic; font-size: 0.95rem; color: var(--color-muted); border-left: 2px solid var(--color-accent); padding-left: 0.75rem;">"${book.tagline}"</p>
    <p style="margin-bottom: 1.5rem; font-size: 0.925rem; line-height: 1.6;">${book.description}</p>
    <h4 style="font-family: var(--font-sans); font-weight: 700; color: var(--color-primary); margin-bottom: 0.75rem; font-size: 0.95rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem;">Key Takeaways & Lessons:</h4>
    <div class="modal-takeaway-list">
      ${takeawaysHtml}
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ==========================================
// LIVE NEWS DESK (Nepali Language)
// ==========================================
const NEWS_DATABASE = [
  {
    id: 'news-1',
    title: 'बजेट घोषणापछि सुनको मूल्यमा कीर्तिमानी वृद्धि: प्रतितोला ३ लाख ११ हजार १०० रुपैयाँ कायम',
    category: 'breaking',
    categoryText: 'मुख्य समाचार',
    time: '५ मिनेट अगाडि',
    summary: 'नेपाल सरकारको नयाँ बजेटमार्फत सुनको भन्सार महसुल बढाउने घोषणा गरेसँगै नेपाली बजारमा सुनको मूल्यमा ऐतिहासिक उछाल आएको छ।',
    content: 'सरकारले आर्थिक वर्ष २०८३/८४ को बजेटमार्फत सुन आयातमा भन्सार महसुल बढाउने निर्णय गरेपछि सुनको मूल्य आकासिएको हो। आज आइतबार सुनको मूल्य प्रतितोला २०,५०० रुपैयाँले बढेर ३ लाख ११ हजार १०० रुपैयाँ कायम भएको छ, जसले अहिलेसम्मका सबै रेकर्ड तोडेको छ। व्यवसायीहरूका अनुसार भन्सार वृद्धिका कारण बजारमा माग र आपूर्ति सन्तुलन बिग्रने र उपभोक्ताहरू मारमा पर्ने देखिन्छ।'
  },
  {
    id: 'news-2',
    title: 'प्रतिनिधिसभाको बैठकमा प्रधानमन्त्री बालेन्द्र शाहले प्रत्यक्ष प्रश्नोत्तरको जवाफ दिने',
    category: 'politics',
    categoryText: 'राजनीति',
    time: '३० मिनेट अगाडि',
    summary: 'विपक्षी दलहरूको मागबमोजिम प्रधानमन्त्री बालेन्द्र शाह प्रतिनिधिसभाको बैठकमा उपस्थित भई सांसदहरूले सोधेका प्रत्यक्ष प्रश्नहरूको जवाफ दिने कार्यसूची तय भएको छ।',
    content: 'प्रतिनिधिसभाको आजको बैठकमा नियमावलीको नियम ५६ बमोजिम प्रधानमन्त्रीसँग प्रत्यक्ष प्रश्नोत्तरको कार्यसूची राखिएको छ। प्रधानमन्त्री शाहले बैठकमा मतदाता नामावली (पहिलो संशोधन) विधेयक र प्रतिनिधिसभा सदस्य निर्वाचन विधेयक संसदमा पेश गर्नुका साथै समसामयिक राजनीतिक मुद्दाहरू र सरकारको आगामी योजनाबारे सांसदहरूको जिज्ञासाको प्रत्यक्ष उत्तर दिने संसद् सचिवालयले जनाएको छ।'
  },
  {
    id: 'news-3',
    title: 'बजेट भाषणपछि पुँजी बजारमा नयाँ सुधार नीति घोषणा, सर्ट सेलिङ र डेरिभेटिभ्स उपकरणहरू ल्याइने',
    category: 'sharemarket',
    categoryText: 'सेयर बजार',
    time: '१ घण्टा अगाडि',
    summary: 'अर्थमन्त्री डा. स्वर्णिम वाग्लेले पुँजी बजारको विकास र सुधारका लागि नेप्सेको पुनर्संरचना र नयाँ अत्याधुनिक वित्तीय उपकरणहरू चरणबद्ध रूपमा भित्र्याउने घोषणा गर्नुभएको छ।',
    content: 'आगामी आर्थिक वर्ष २०८३/८४ को बजेट वक्तव्यमार्फत पुँजी बजारलाई थप प्रतिस्पर्धी र पारदर्शी बनाउन नेप्सेको पुनर्संरचना गरिने भएको छ। यसका साथै नेपाली कम्पनीहरूलाई वैदेशिक सेयर बजारमा सूचीकृत हुन मार्गप्रशस्त गरिनुका साथै नेपाली बजारमा इन्ट्रा-डे कारोबार, सर्ट सेलिङ, र डेरिभेटिभ्स जस्ता आधुनिक उपकरणहरू चरणबद्ध रूपमा ल्याइने घोषणा गरिएको छ। यसले बजारलाई नयाँ उचाइमा पुर्याउने अपेक्षा विश्लेषकहरूको छ।'
  },
  {
    id: 'news-4',
    title: 'आर्थिक विधेयक २०८३: सेयर बजारको अल्पकालीन लाभकर बढेर १० प्रतिशत पुग्यो',
    category: 'sharemarket',
    categoryText: 'सेयर बजार',
    time: '२ घण्टा अगाडि',
    summary: 'नयाँ आर्थिक विधेयक मार्फत सेयर बजारको कर संरचनामा परिमार्जन गरिएको छ, जसअनुसार अल्पकालीन लगानीकर्ताको कर १० प्रतिशत पुर्याइएको छ।',
    content: 'संसदमा पेश गरिएको नयाँ आर्थिक विधेयक २०८३ मार्फत छोटो अवधिको (१ वर्षभन्दा कम) सेयर कारोबारमा लाग्ने पुँजीगत लाभकर ७.५ प्रतिशतबाट बढाएर १० प्रतिशत पुर्याइएको छ। त्यसैगरी, १ वर्षभन्दा बढी अवधिको सेयर होल्ड गर्ने दीर्घकालीन लगानीकर्ताका लागि लाभकर ५ प्रतिशतबाट बढाएर ७.५ प्रतिशत बनाइएको छ। यस कर वृद्धिले बजारमा केही दबाब सिर्जना गरे तापनि प्रणालीगत स्थिरताका लागि आवश्यक रहेको सरकारी अधिकारीहरूको दाबी छ।'
  },
  {
    id: 'news-5',
    title: 'मध्यपूर्व तनाव: इजरायल र लेबनान सीमा क्षेत्रमा भिडन्त तीव्र, अन्तर्राष्ट्रिय समुदाय चिन्तित',
    category: 'global',
    categoryText: 'विश्व समाचार',
    time: '३ घण्टा अगाडि',
    summary: 'इजरायल र लेबनान सीमामा भइरहेको निरन्तरको हवाई तथा रकेट हमलाले मध्यपूर्वमा व्यापक संकट निम्त्याएको छ, संयुक्त राष्ट्रसंघले संयमताका लागि अपिल गरेको छ।',
    content: 'मध्यपूर्वमा सुरक्षा अवस्था झन् नाजुक बन्दै गइरहेको छ। लेबनान र इजरायलको सीमा क्षेत्रमा दुवै पक्षबाट आक्रमण तीव्र पारिएको छ। संयुक्त राष्ट्रसंघीय शान्ति मिसन र विश्व नेताहरूले तत्काल युद्धविरामका लागि दबाब दिइरहेका छन्। यसले अन्तर्राष्ट्रिय ऊर्जा बजार र ढुवानी प्रणालीमा समेत असर पुर्याउन सक्ने आशंका गरिएको छ।'
  },
  {
    id: 'news-6',
    title: 'विश्व बजारमा कच्चा तेलको मूल्यमा गिरावट, पेट्रोलियम उत्पादक राष्ट्रहरू (OPEC) द्वारा आपूर्तिको समीक्षा',
    category: 'economy',
    categoryText: 'विश्व अर्थतन्त्र',
    time: '४ घण्टा अगाडि',
    summary: 'विश्वव्यापी मागमा आएको ह्रास र अमेरिकी डलर बलियो हुनुका कारण कच्चा तेलको मूल्यमा गिरावट आएको छ, ओपेकले उत्पादन नीतिमा पुनरावलोकन गर्दैछ।',
    content: 'विश्व अर्थतन्त्रमा मन्दीको संकेत देखिन थालेसँगै इन्धनको माग घटेको छ। ब्रेन्ट क्रुड र डब्लूटीआई तेलको मूल्यमा प्रति ब्यारेल २ देखि ३ प्रतिशतसम्म गिरावट आएको छ। तेल निर्यात गर्ने देशहरूको समूह (OPEC) ले आपूर्तिको सन्तुलन कायम राख्न उत्पादन कटौतीलाई निरन्तरता दिने कि नदिने भन्नेबारे समीक्षा बैठक बोलाएको छ। यसले इन्धन आयात गर्ने नेपाल जस्ता देशहरूलाई भने केही राहत मिल्न सक्छ।'
  },
  {
    id: 'news-7',
    title: 'नेपाल र अमेरिका सम्बन्ध सुदृढ बनाउन अमेरिकी उपविदेशमन्त्री रोजर्स नेपाल भ्रमणमा',
    category: 'politics',
    categoryText: 'राजनीति',
    time: '५ घण्टा अगाडि',
    summary: 'दुईपक्षीय सहकार्य र विकास साझेदारी बलियो बनाउन अमेरिकी उपविदेशमन्त्री सारा बी. रोजर्स नेपाल आउनुभएको छ।',
    content: 'नेपाल र अमेरिकाबीचको ऐतिहासिक कूटनीतिक सम्बन्धको समीक्षा र आर्थिक सहयोग अभिवृद्धि गर्न अमेरिकी उपविदेशमन्त्री रोजर्स नेपालको औपचारिक भ्रमणमा हुनुहुन्छ। उहाँले आज प्रधानमन्त्री बालेन्द्र शाह र परराष्ट्रमन्त्रीसँग भेटवार्ता गरी जलवायु परिवर्तन, व्यापार, र पूर्वाधार विकासमा अमेरिकी सहयोग र एमसीसीका परियोजनाहरूको कार्य प्रगतिबारे छलफल गर्नुहुने कार्यक्रम छ।'
  },
  {
    id: 'news-8',
    title: 'अमेरिकी फेडरल रिजर्भद्वारा ब्याजदर कटौतीको सम्भावनाबारे संकेत, विश्व अर्थतन्त्र तरंगित',
    category: 'economy',
    categoryText: 'विश्व अर्थतन्त्र',
    time: '६ घण्टा अगाडि',
    summary: 'मुद्रास्फीति नियन्त्रणमा आएको रिपोर्ट सार्वजनिक भएसँगै अमेरिकी केन्द्रीय बैंक फेडले आउँदो त्रैमासिकमा ब्याजदर घटाउन सक्ने संकेत दिएको छ।',
    content: 'फेडका अध्यक्षले अमेरिकी अर्थतन्त्रमा मूल्य वृद्धिदर सन्तोषजनक रूपमा घटेकाले कडा मौद्रिक नीतिलाई खुकुलो बनाउने संकेत दिनुभएको छ। यस संकेतसँगै न्यूयोर्क, टोकियो, र युरोपेली सेयर बजारहरूमा हरियाली छाएको छ। विश्वभरिका विकासशील देशहरूका लागि विदेशी कर्जा सस्तो हुने र लगानीको प्रवाह बढ्ने आकलन अर्थशास्त्रीहरूले गरेका छन्।'
  }
];

function initNews() {
  const newsGrid = document.getElementById('news-grid-container');
  const categories = document.querySelectorAll('[data-news-filter]');
  const refreshBtn = document.getElementById('news-refresh-btn');
  const ticker = document.getElementById('news-ticker-track-container');

  // Load News Ticker (Breaking titles loop)
  if (ticker) {
    const breakingTitles = NEWS_DATABASE.filter(n => n.category === 'breaking' || n.category === 'sharemarket').map(n => n.title).join('  •  ');
    ticker.textContent = breakingTitles + '  •  ' + breakingTitles;
  }

  function renderNewsGrid(filter) {
    if (!newsGrid) return;

    const filtered = NEWS_DATABASE.filter(n => {
      return filter === 'all' || n.category === filter;
    });

    if (filtered.length === 0) {
      newsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--color-muted)">
          <p>यो विधामा हाल कुनै समाचार उपलब्ध छैन।</p>
        </div>
      `;
      return;
    }

    newsGrid.innerHTML = filtered.map(news => `
      <div class="news-card" data-news-id="${news.id}">
        <div class="news-card-header">
          <span class="news-card-tag">${news.categoryText}</span>
          <span class="news-card-time">${news.time}</span>
        </div>
        <h3>${news.title}</h3>
        <p>${news.summary}</p>
        <span class="news-card-link">
          थप पढ्नुहोस्
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    `).join('');
  }

  // Initial news render
  renderNewsGrid('all');

  // Filter triggers
  categories.forEach(btn => {
    btn.addEventListener('click', () => {
      categories.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-news-filter');
      renderNewsGrid(filter);
    });
  });

  // Refresh feed trigger
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      const svgIcon = document.getElementById('refresh-icon-svg');
      if (svgIcon) svgIcon.classList.add('refresh-spin');

      setTimeout(() => {
        if (svgIcon) svgIcon.classList.remove('refresh-spin');
        
        // Simulating news update
        NEWS_DATABASE.forEach(item => {
          if (item.time.includes('मिनेट')) {
            item.time = 'भर्खरै (Just Now)';
          }
        });

        const activeBtn = document.querySelector('[data-news-filter].active');
        const filter = activeBtn ? activeBtn.getAttribute('data-news-filter') : 'all';
        renderNewsGrid(filter);
        alert('लाइभ समाचार फिड अपडेट गरियो!');
      }, 800);
    });
  }

  // Open detailed modal click listener
  document.body.addEventListener('click', (e) => {
    const card = e.target.closest('[data-news-id]');
    if (card) {
      const newsId = card.getAttribute('data-news-id');
      const newsItem = NEWS_DATABASE.find(n => n.id === newsId);
      if (newsItem) {
        openNewsModal(newsItem);
      }
    }
  });
}

function openNewsModal(news) {
  const overlay = document.getElementById('modal-overlay');
  const banner = document.getElementById('modal-iframe-container');
  const tag = document.getElementById('modal-video-tag');
  const title = document.getElementById('modal-video-title');
  const desc = document.getElementById('modal-video-desc');

  if (!overlay || !banner) return;

  tag.textContent = news.categoryText;
  title.textContent = news.title;

  banner.innerHTML = `
    <div style="background: linear-gradient(135deg, #c62828, #e53935); height: 140px; display: flex; align-items: center; justify-content: center; color: #fff; text-align: center; padding: 1.5rem; box-shadow: inset 0 0 80px rgba(0,0,0,0.3)">
      <div>
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: bold; background: rgba(0,0,0,0.2); padding: 0.25rem 0.5rem; border-radius: 4px; letter-spacing: 0.05em;">ताजा अपडेट • LIVE</span>
        <h3 style="font-family: var(--font-sans); font-size: 1.25rem; margin-top: 0.5rem; font-weight: 700;">${news.categoryText}</h3>
      </div>
    </div>
  `;

  desc.innerHTML = `
    <div style="font-size: 0.8rem; color: var(--color-muted); margin-bottom: 1rem;">प्रकाशित मिति: २०८३ जेठ १७ गते • समय: ${news.time}</div>
    <p style="font-size: 0.95rem; font-weight: 600; line-height: 1.5; color: var(--color-primary); margin-bottom: 1.25rem; border-left: 3px solid var(--color-error); padding-left: 0.75rem;">${news.summary}</p>
    <p style="font-size: 0.925rem; line-height: 1.7; color: var(--color-fg); white-space: pre-line;">${news.content}</p>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
