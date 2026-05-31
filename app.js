document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initMiniCalcSwitcher();
  initCalculators();
  initVideos();
  initEducation();
  initNews();
  initNewsletter();
  initNepseChart();
});

// ==========================================
// SPA ROUTER
// ==========================================
function initRouter() {
  const navLinks = document.querySelectorAll('[data-target]');
  const views = document.querySelectorAll('.section-view');
  const mainNav = document.querySelector('nav');
  const mobileToggle = document.getElementById('mobile-menu-toggle');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  const validSections = ['home', 'charts', 'budgeting', 'saving', 'investing', 'debt', 'education', 'news', 'videos'];

  function navigateTo(targetId) {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile menu dropdown
    if (mainNav) {
      mainNav.classList.remove('active');
    }

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
    } else if (targetId === 'charts') {
      initTerminalChart();
      if (termChartInst) {
        setTimeout(resizeTerminalCharts, 50);
      }
    }
  }

  function handleRouting() {
    let hash = window.location.hash.substring(1);
    if (!hash || !validSections.includes(hash)) {
      hash = 'home';
    }
    navigateTo(hash);
  }

  window.addEventListener('hashchange', handleRouting);

  // Initial routing check
  handleRouting();
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
    title: 'NEPSE BREAKOUT: 2745 Crossed! TEMA 9 & MACD Bullish Crossover Explained',
    category: 'NEPSE Analysis',
    date: 'May 28, 2026',
    duration: '12:45',
    videoUrl: 'https://www.youtube.com/embed/bfENsVP77VQ',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
    desc: 'An in-depth technical analysis of the Nepal Stock Exchange (NEPSE) index breaking out past the 2745 level. Learn about TEMA 9 and MACD bullish crossover indicators and how to trade them.'
  },
  {
    id: 'vid-1',
    title: 'NEPSE Volume Crash: Why Did a "Buyers Strike" Happen?',
    category: 'Market Analysis',
    date: 'May 24, 2026',
    duration: '25:52',
    videoUrl: 'https://www.youtube.com/embed/ifOu7F38k9k',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400',
    desc: 'Analyzing the massive 40% drop in trading volume on the Nepal Stock Exchange (NEPSE). Understanding why buyers are staying on the sidelines and what it means for trend direction.'
  },
  {
    id: 'vid-2',
    title: 'Top 5 Best Hydropower Stocks in NEPSE (Multibagger Potential)',
    category: 'Stock Picks',
    date: 'May 15, 2026',
    duration: '11:15',
    videoUrl: 'https://www.youtube.com/embed/vuj_GcsHvoo',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400',
    desc: 'A detailed study of the hydropower sector in Nepal. Evaluating the top 5 hydropower stocks with strong fundamentals and potential to deliver multibagger returns.'
  },
  {
    id: 'vid-3',
    title: 'The Dark Side of SIP in Nepal: Detailed Analysis',
    category: 'Personal Finance',
    date: 'May 02, 2026',
    duration: '18:30',
    videoUrl: 'https://www.youtube.com/embed/INiRLCG1fM8',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    desc: 'Is Systematic Investment Plan (SIP) always safe? Examining the hidden risks, charges, and long-term realities of investing in SIP mutual funds in Nepal.'
  },
  {
    id: 'vid-4',
    title: 'Volume Analysis: The Correct Way to Read & Understand the Market',
    category: 'Technical Indicators',
    date: 'Apr 28, 2026',
    duration: '15:10',
    videoUrl: 'https://www.youtube.com/embed/rDd5zNQ4d-Y',
    thumbnail: 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=400',
    desc: 'Volume precedes price. Learn how to combine volume indicators with price action to detect institutional buying (Smart Money) and avoid retail traps.'
  },
  {
    id: 'vid-5',
    title: 'The Ultimate Guide to Swing Trading for Beginners 2026',
    category: 'Trading Strategy',
    date: 'Apr 12, 2026',
    duration: '12:00',
    videoUrl: 'https://www.youtube.com/embed/UWKNLR4jOI0',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
    desc: 'Step-by-step swing trading course. Learn how to identify support/resistance levels, trend breakouts, and plan your risk-reward ratio effectively.'
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

  const details = document.querySelector('.modal-details');
  if (details) details.scrollTop = 0;

  tag.textContent = video.category;
  title.textContent = video.title;
  desc.textContent = video.desc;

  iframeWrapper.className = 'modal-iframe-wrapper has-video';

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

  // Reset scrollbar position to the top after DOM rendering
  const details = document.querySelector('.modal-details');
  if (details) {
    details.scrollTop = 0;
    setTimeout(() => { details.scrollTop = 0; }, 50);
  }
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
    iframeWrapper.className = 'modal-iframe-wrapper';
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

  banner.className = 'modal-iframe-wrapper has-banner';

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

  // Reset scrollbar position to the top after DOM rendering
  const details = document.querySelector('.modal-details');
  if (details) {
    details.scrollTop = 0;
    setTimeout(() => { details.scrollTop = 0; }, 50);
  }
}

// ==========================================
// LIVE NEWS DESK (Nepali Language)
// ==========================================
const NEWS_DATABASE = [
  {
    "id": "news-1",
    "title": "बजेट घोषणापछि सुनको मूल्यमा कीर्तिमानी वृद्धि: प्रतितोला ३ लाख ११ हजार १०० रुपैयाँ कायम",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "५ मिनेट अगाडि",
    "summary": "नेपाल सरकारको नयाँ बजेटमार्फत सुनको भन्सार महसुल बढाउने घोषणा गरेसँगै नेपाली बजारमा सुनको मूल्यमा ऐतिहासिक उछाल आएको छ।",
    "content": "सरकारले आर्थिक वर्ष २०८३/८४ को बजेटमार्फत सुन आयातमा भन्सार महसुल बढाउने निर्णय गरेपछि सुनको मूल्य आकासिएको हो। आज आइतबार सुनको मूल्य प्रतितोला २०,५०० रुपैयाँले बढेर ३ लाख ११ हजार १०० रुपैयाँ कायम भएको छ, जसले अहिलेसम्मका सबै रेकर्ड तोडेको छ। व्यवसायीहरूका अनुसार भन्सार वृद्धिका कारण बजारमा माग र आपूर्ति सन्तुलन बिग्रने र उपभोक्ताहरू मारमा पर्ने देखिन्छ।"
  },
  {
    "id": "news-b2",
    "title": "नेपालमा डिजिटल रुपैयाँको परीक्षण सफल, छिट्टै प्रयोगमा ल्याइने",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "१५ मिनेट अगाडि",
    "summary": "नेपाल राष्ट्र बैंकले परीक्षण गरेको डिजिटल मुद्रा (Central Bank Digital Currency - CBDC) को पहिलो चरणको पाइलट प्रोजेक्ट सफलतापूर्वक सम्पन्न भएको छ।",
    "content": "नेपाल राष्ट्र बैंकले वित्तीय समावेशीता र कारोबारको लागत घटाउन डिजिटल नेपाली रुपैयाँ (CBDC) को परीक्षण गरेको थालनी थियो। नेपालका अग्रणी वाणिज्य बैंकहरूसँगको सहकार्यमा गरिएको उक्त परीक्षण सफल भएसँगै यसलाई सर्वसाधारणका लागि जारी गर्ने तयारी भइरहेको छ। यस डिजिटल रुपैयाँले नगदरहित डिजिटल भुक्तानीलाई थप सुरक्षित र प्रभावकारी बनाउने दाबी राष्ट्र बैंकका अधिकारीहरूको छ।"
  },
  {
    "id": "news-b3",
    "title": "काठमाडौंमा ७.२ रेक्टर स्केलको कृत्रिम भूकम्प अभ्यास सम्पन्न",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "२५ मिनेट अगाडि",
    "summary": "विपद् व्यवस्थापन पूर्वतयारीलाई सुदृढ बनाउन गृह मन्त्रालय र नेपाली सेनाको अगुवाइमा उपत्यकाव्यापी विपद् उद्धार अभ्यास गरिएको छ।",
    "content": "सम्भावित ठूलो भूकम्पबाट हुन सक्ने क्षति न्यूनीकरण र उद्धार कार्यमा चुस्तता ल्याउन काठमाडौंका विभिन्न १० स्थानमा एकसाथ नक्कली विपद् सिर्जना गरी अभ्यास गरिएको हो। नेपाल प्रहरी, सशस्त्र प्रहरी, रेडक्रस र विभिन्न अस्पतालहरूको सहभागिता रहेको उक्त अभ्यासमा घाइतेहरूको हवाइ उद्धार, आगलागी नियन्त्रण र भग्नावशेषबाट जीवितै उद्धार गर्ने प्रविधिको प्रदर्शन गरिएको थियो।"
  },
  {
    "id": "news-b4",
    "title": "मेलम्ची खानेपानी आयोजनाको नयाँ सुरुङ खन्ने काम सम्पन्न",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "४० मिनेट अगाडि",
    "summary": "काठमाडौंबासीलाई वर्षैभरि खानेपानी आपूर्ति सहज बनाउन मेलम्ची आयोजनाको नयाँ सहायक सुरुङ निर्माण सम्पन्न भएको छ।",
    "content": "वर्षायामको बाढीले मुख्य सुरुङमा पुर्याउने क्षतिबाट बचाउन र हिउँदमा थप पानी ल्याउन वैकल्पिक मुहान जोड्ने सहायक सुरुङ खन्ने काम निर्धारित समयभित्र सकिएको हो। इन्जिनियरहरूका अनुसार यो सुरुङ सञ्चालनमा आएसँगै मेलम्चीको पानी बाह्रै महिना नियमित रूपमा उपत्यका पठाउन सकिनेछ, जसले राजधानीमा खानेपानीको हाहाकार सधैंका लागि अन्त्य गर्ने अपेक्षा छ।"
  },
  {
    "id": "news-b5",
    "title": "नेपाल र भारतबीच थप ४०० मेगावाट जलविद्युत निर्यात गर्ने ऐतिहासिक सम्झौता",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "५० मिनेट अगाडि",
    "summary": "नेपाल विद्युत प्राधिकरण र भारतको एनटीपीसी विद्युत व्यापार निगमबीच थप बिजुली निर्यातका लागि नयाँ सम्झौतामा हस्ताक्षर भएको छ।",
    "content": "नेपालमा उत्पादित बढी बिजुली छिमेकी बजारमा बिक्री गरी विदेशी मुद्रा आर्जन गर्ने सरकारी योजना अनुसार यो सम्झौता भएको हो। यससँगै नेपालबाट भारततर्फ निर्यात हुने कुल जलविद्युतको क्षमता करिब १,००० मेगावाट पुग्नेछ। नयाँ सम्झौताले आगामी वर्षायाममा नेपालको बिजुली खेर जाने समस्या पूर्ण रूपमा समाधान गर्ने र नेपालको व्यापार घाटा न्यूनीकरणमा ठूलो टेवा पुग्ने नेपाल विद्युत प्राधिकरणका कार्यकारी निर्देशकले बताए।"
  },
  {
    "id": "news-b6",
    "title": "त्रिभुवन अन्तर्राष्ट्रिय विमानस्थलको रनवे स्तरोन्नतिका लागि दैनिक ६ घण्टा बन्द हुने",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "१ घण्टा अगाडि",
    "summary": "नेपालको एक मात्र प्रमुख अन्तर्राष्ट्रिय विमानस्थलको धावनमार्ग पुनर्निर्माण र मर्मतका लागि उडान समय तालिकामा फेरबदल गरिएको छ।",
    "content": "नेपाल नागरिक उड्डयन प्राधिकरणका अनुसार रनवेको सुरक्षा र दिगोपन सुदृढ गर्न आउँदो असार १५ देखि तीन महिनासम्म राति १० बजेदेखि बिहान ४ बजेसम्म सबै उडानहरू रोकिनेछन्। मर्मत अवधिभर उडान प्रभावित हुने भएकाले एयरलाइन्सहरूलाई दिउँसो र बिहानको उडान संख्या बढाउन आग्रह गरिएको छ। यसबाट यात्रुहरूलाई पर्न सक्ने असुविधाप्रति प्राधिकरणले क्षमायाचना गरेको छ।"
  },
  {
    "id": "news-b7",
    "title": "नेपाल वायुसेवा निगमको वाइडबडी विमानमा प्राविधिक गडबडी, उडानहरू प्रभावित",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "१.५ घण्टा अगाडि",
    "summary": "काठमाडौंबाट जापानको नारिता उडानको तयारीमा रहेको निगमको ए३३० विमानको हाइड्रोलिक प्रणालीमा खराबी आएपछि उडान स्थगित भएको छ।",
    "content": "उडान भर्न ठीक परेको बेला विमानको ककपिटमा प्राविधिक सूचकले हाइड्रोलिक लिक भएको देखाएपछि सुरक्षाका कारण २६० जना यात्रु ओरालिएको थियो। निगमका इन्जिनियरहरूले मर्मतको प्रयास गरिरहेका छन् र आवश्यक पार्टपुर्जा सिंगापुरबाट मगाउनु पर्ने भएकाले विमान दुई दिनसम्म ग्राउन्डेड हुन सक्ने बताइएको छ। यात्रुहरूलाई वैकल्पिक उडान र होटलको व्यवस्था गरिएको निगमले जनाएको छ।"
  },
  {
    "id": "news-b8",
    "title": "सरकारद्वारा आगामी आर्थिक वर्षको नयाँ नीति तथा कार्यक्रम संसदमा प्रस्तुत",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "२ घण्टा अगाडि",
    "summary": "राष्ट्रपतिद्वारा संघीय संसदको संयुक्त बैठकमा सरकारको वार्षिक नीति तथा बजेट प्राथमिकताको रूपरेखा प्रस्तुत गरिएको छ।",
    "content": "नयाँ नीति तथा कार्यक्रममा कृषि, जलविद्युत, उत्पादनमूलक उद्योग र सूचना प्रविधिको विकासलाई मुख्य प्राथमिकतामा राखिएको छ। सरकारले पाँच वर्षभित्र मुलुकलाई आत्मनिर्भर बनाउने र सार्वजनिक सेवा प्रवाहमा पूर्ण डिजिटल प्रणाली लागू गर्ने प्रतिबद्धता व्यक्त गरेको छ। यो नीतिमा आधारित भएर अर्थ मन्त्रालयले आगामी जेठ १५ गते नयाँ बजेट प्रस्तुत गर्नेछ।"
  },
  {
    "id": "news-b9",
    "title": "चिनियाँ राष्ट्रपति सी जिनपिङको नेपाल भ्रमणको तयारी सुरु",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "२.५ घण्टा अगाडि",
    "summary": "नेपाल सरकारले चिनियाँ राष्ट्रपतिको सम्भावित नेपाल भ्रमणलाई सफल बनाउन उच्चस्तरीय कूटनीतिक तयारी र पूर्वाधार निर्माण तीव्रता दिएको छ।",
    "content": "परराष्ट्र मन्त्रालयका अनुसार दुई देशबीचको आर्थिक र रणनीतिक साझेदारीलाई नयाँ उचाइमा पुर्याउन यो भ्रमण निकै महत्वपूर्ण हुनेछ। भ्रमणका क्रममा बेल्ट एण्ड रोड इनिसिएटिभ (BRI) अन्तर्गतका परियोजनाहरू, सीमा नाकाहरूको आधुनिकीकरण र नयाँ उत्तर-दक्षिण सडक करिडोरका सम्झौताहरूमा हस्ताक्षर हुने सम्भावना छ। सुरक्षा व्यवस्था र सुरक्षा कूटनीतिको तयारीका लागि गृह मन्त्रालयले विशेष कार्यदल गठन गरेको छ।"
  },
  {
    "id": "news-b10",
    "title": "नेपाल राष्ट्र बैंकद्वारा कडा मौद्रिक नीतिको अर्धवार्षिक समीक्षा सार्वजनिक",
    "category": "breaking",
    "categoryText": "मुख्य समाचार",
    "time": "३ घण्टा अगाडि",
    "summary": "बैंक तथा वित्तीय संस्थाको तरलता सहज बनाउन र कर्जा प्रवाह प्रोत्साहन गर्न केही लचिलो व्यवस्थाहरू ल्याइएको छ।",
    "content": "राष्ट्र बैंकका गभर्नरले चालु वर्षको मौद्रिक नीतिको अर्धवार्षिक समीक्षामार्फत नीतिगत दरलाई ६.५ प्रतिशतबाट घटाएर ६ प्रतिशत कायम गरिएको घोषणा गर्नुभयो। यसका साथै घरजग्गा र सेयर धितो कर्जाको सीमामा केही खुकुलो बनाइएको छ जसले बजारमा आर्थिक गतिविधि बढाउने विश्वास गरिएको छ। यद्यपि, मुद्रास्फीतिको दबाब यथावत रहेकाले अनुत्पादक क्षेत्रको कर्जा नियन्त्रण जारी रहनेछ।"
  },
  {
    "id": "news-2",
    "title": "प्रतिनिधिसभाको बैठकमा प्रधानमन्त्री बालेन्द्र शाहले प्रत्यक्ष प्रश्नोत्तरको जवाफ दिने",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "३० मिनेट अगाडि",
    "summary": "विपक्षी दलहरूको मागबमोजिम प्रधानमन्त्री बालेन्द्र शाह प्रतिनिधिसभाको बैठकमा उपस्थित भई सांसदहरूले सोधेका प्रत्यक्ष प्रश्नहरूको जवाफ दिने कार्यसूची तय भएको छ।",
    "content": "प्रतिनिधिसभाको आजको बैठकमा नियमावलीको नियम ५६ बमोजिम प्रधानमन्त्रीसँग प्रत्यक्ष प्रश्नोत्तरको कार्यसूची राखिएको छ। प्रधानमन्त्री शाहले बैठकमा मतदाता नामावली (पहिलो संशोधन) विधेयक र प्रतिनिधिसभा सदस्य निर्वाचन विधेयक संसदमा पेश गर्नुका साथै समसामयिक राजनीतिक मुद्दाहरू र सरकारको आगामी योजनाबारे सांसदहरूको जिज्ञासाको प्रत्यक्ष उत्तर दिने संसद् सचिवालयले जनाएको छ।"
  },
  {
    "id": "news-7",
    "title": "नेपाल र अमेरिका सम्बन्ध सुदृढ बनाउन अमेरिकी उपविदेशमन्त्री रोजर्स नेपाल भ्रमणमा",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "५ घण्टा अगाडि",
    "summary": "दुईपक्षीय सहकार्य र विकास साझेदारी बलियो बनाउन अमेरिकी उपविदेशमन्त्री सारा बी. रोजर्स नेपाल आउनुभएको छ।",
    "content": "नेपाल र अमेरिकाबीचको ऐतिहासिक कूटनीतिक सम्बन्धको समीक्षा र आर्थिक सहयोग सहयोग अभिवृद्धि गर्न अमेरिकी उपविदेशमन्त्री रोजर्स नेपालको औपचारिक भ्रमणमा हुनुहुन्छ। उहाँले आज प्रधानमन्त्री बालेन्द्र शाह र परराष्ट्रमन्त्रीसँग भेटवार्ता गरी जलवायु परिवर्तन, व्यापार, र पूर्वाधार विकासमा अमेरिकी सहयोग र एमसीसीका परियोजनाहरूको कार्य प्रगतिबारे छलफल गर्नुहुने कार्यक्रम छ।"
  },
  {
    "id": "news-p3",
    "title": "नयाँ मन्त्रीमण्डल विस्तार, युवा अनुहारहरूलाई बढी प्राथमिकता",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "१ दिन अगाडि",
    "summary": "प्रधानमन्त्रीले मन्त्रीमण्डल पुनर्गठन गर्दै चार नयाँ राज्यमन्त्री नियुक्त गर्नुभएको छ, जसमा अधिकांश युवा र प्राविधिक पृष्ठभूमि भएका व्यक्ति छन्।",
    "content": "मन्त्रिपरिषद्लाई कार्यदक्ष र परिणाममुखी बनाउन भन्दै प्रधानमन्त्रीले युवा सांसदहरूलाई नयाँ जिम्मेवारी सुम्पनुभएको हो। नवियुक्त मन्त्रीहरूमा उर्जा, सञ्चार, र विज्ञान प्रविधि क्षेत्रका विज्ञहरू परेका छन्। राजनीतिक वृत्तमा यस पुनर्गठनलाई मिश्रित प्रतिक्रिया मिलेको छ। नयाँ मन्त्रीहरूले आजै राष्ट्रपति समक्ष पद तथा गोपनीयताको शपथ ग्रहण गरेका छन्।"
  },
  {
    "id": "news-p4",
    "title": "निर्वाचन प्रणाली सुधारका लागि सर्वदलीय सहमति खोज्ने सरकारको निर्णय",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "२ दिन अगाडि",
    "summary": "मुलुकको निर्वाचन प्रणालीलाई थप पारदर्शी र कम खर्चिलो बनाउन सरकारले राजनीतिक दलहरूसँग उच्चस्तरीय परामर्श सुरु गरेको छ।",
    "content": "मन्त्रिपरिषद्को बैठकले निर्वाचन प्रणालीमा देखिएका प्राविधिक कमजोरी हटाउन र विदेशमा रहेका नेपालीहरूलाई मताधिकार दिने कानुनी व्यवस्था मिलाउन सर्वदलीय कार्यदल गठन गर्ने निर्णय गरेको छ। निर्वाचन आयोगले तयार पारेको मस्यौदा विधेयकमाथि संसदमा विस्तृत छलफल गर्नुअघि राजनीतिक दलहरूबीच साझा धारणा बनाउन लागिएको कानुन मन्त्रीले जानकारी दिनुभयो।"
  },
  {
    "id": "news-p5",
    "title": "संघ र प्रदेशको क्षेत्राधिकार विवाद सुल्झाउन उच्चस्तरीय संयन्त्र गठन",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "३ दिन अगाडि",
    "summary": "प्रदेश सरकारहरूले उठाएको प्रहरी समायोजन र प्राकृतिक स्रोत बाँडफाँडको मुद्दा सम्बोधन गर्न प्रधानमन्त्रीको अध्यक्षतामा विशेष बैठक बस्दैछ।",
    "content": "नेपालको संघीय शासन प्रणाली कार्यान्वयनमा देखिएका मुख्य जटिलता हल गर्न राष्ट्रिय समन्वय परिषदको बैठक बोलाइएको छ। मुख्यमन्त्रीहरूले उठाएका अधिकार प्रत्यायोजन सम्बन्धी सवालहरू, वन तथा खानी व्यवस्थापन र प्रदेश तहमा निजामती कर्मचारीको स्थायी व्यवस्थापनका लागि नयाँ कार्यविधि पारित गर्ने तयारी बैठकको छ।"
  },
  {
    "id": "news-p6",
    "title": "नागरिकता सम्बन्धी नयाँ विधेयकमा प्रमुख राजनीतिक दलहरूबीच मतभेद",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "४ दिन अगाडि",
    "summary": "राज्य व्यवस्था समितिमा छलफलमा रहेको नागरिकता ऐन संशोधन विधेयकमा वैवाहिक अंगीकृत नागरिकताको समयसीमालाई लिएर विवाद बढेको छ।",
    "content": "विधेयकको विवादित दफामा नेपाली नागरिकसँग विवाह गर्ने विदेशी महिलालाई कति वर्षपछि नागरिकता दिने भन्ने विषयमा सत्तापक्ष र प्रतिपक्षबीच कुरा मिलेको छैन। सत्तापक्षले राष्ट्रिय सुरक्षाको दृष्टिले ७ वर्षको समयसीमा राख्नुपर्ने अडान लिएको छ भने विपक्षी दलहरूले साविककै व्यवस्था सहज हुनुपर्ने धारणा राखेका छन्। सहमति नजुटे विधेयकलाई बहुमतबाट पारित गर्ने सत्तापक्षको योजना छ।"
  },
  {
    "id": "news-p7",
    "title": "स्थानीय तहको निर्वाचन मिति तोक्ने विषयमा निर्वाचन आयोग र सरकारबीच छलफल",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "५ दिन अगाडि",
    "summary": "निर्वाचन आयोगले आउँदो चैत महिनाभित्र रिक्त रहेका स्थानीय तहहरूको उपनिर्वाचन सम्पन्न गर्न सरकारलाई मिति सिफारिस गरेको छ।",
    "content": "देशभरका विभिन्न स्थानीय तहहरूमा प्रमुख, उपप्रमुख र वडा अध्यक्षका पदहरू रिक्त रहेका छन्। आयोगले निर्वाचनको प्रशासनिक र प्राविधिक पूर्वतयारीका लागि कम्तीमा ९० दिनको समय आवश्यक पर्ने स्पष्ट पारेको छ। सरकारले छिट्टै गृह मन्त्रालयको समन्वयमा निर्वाचनको मिति घोषणा गर्ने र आवश्यक बजेट विनियोजन गर्ने आश्वासन दिएको छ।"
  },
  {
    "id": "news-p8",
    "title": "परराष्ट्रमन्त्रीको चीन भ्रमणका क्रममा व्यापार र नाका खोल्ने सहमति",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "६ दिन अगाडि",
    "summary": "नेपाल र चीनबीच उत्तरी सीमा नाकाहरूलाई बाह्रै महिना सञ्चालन गर्ने र द्विपक्षीय व्यापार सहज बनाउने सहमति भएको छ।",
    "content": "बेइजिङमा चिनियाँ समकक्षीसँग भएको द्विपक्षीय वार्तामा नेपालको कृषिजन्य उत्पादन चीन निर्यात गर्न कृषि प्राविधिक प्रमाणीकरण प्रक्रिया छिटो टुङ्ग्याउने समझदारी भएको हो। यसका साथै रसुवागढी, तातोपानी र हिल्सा नाकामा अध्यागमन र भन्सार पूर्वाधार सुधार गर्न चीनले थप अनुदान सहयोग उपलब्ध गराउने प्रतिबद्धता जनाएको छ।"
  },
  {
    "id": "news-p9",
    "title": "विपक्षी दलहरूको गठबन्धनद्वारा संसदमा अर्थ विधेयक विरुद्ध आन्दोलनको चेतावनी",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "१ हप्ता अगाडि",
    "summary": "सरकारले ल्याएको नयाँ आर्थिक विधेयकमा करका दरहरू हेरफेर गर्दा आम जनतालाई आर्थिक भार थपिएको विपक्षी दलहरूको दाबी छ।",
    "content": "संसदको बैठकमा विशेष समय लिएर बोल्दै विपक्षी दलका नेताले दैनिक उपभोग्य वस्तु र स्वास्थ्य सेवामा लाग्ने कर फिर्ता लिन माग गर्नुभयो। कर फिर्ता नभए संसदको बैठक अवरुद्ध गर्ने र सडक आन्दोलनमा जाने चेतावनी उहाँहरूले दिएका छन्। सरकारले भने मुलुकको विकासका लागि राजस्वको आधार बढाउन कर परिमार्जन आवश्यक रहेको दाबी गरेको छ।"
  },
  {
    "id": "news-p10",
    "title": "भ्रष्ट्राचार नियन्त्रणका लागि अख्तियारलाई थप शक्तिशाली बनाउने मस्यौदा तयार",
    "category": "politics",
    "categoryText": "राजनीति",
    "time": "१ हप्ता अगाडि",
    "summary": "सार्वजनिक निकायहरूमा हुने अनियमितता रोक्न अख्तियार दुरुपयोग अनुसन्धान आयोग ऐनमा व्यापक संशोधन प्रस्ताव गरिएको छ।",
    "content": "कानुन मन्त्रालयले तयार पारेको विधेयक मस्यौदामा निजी क्षेत्र र बैंकिङ क्षेत्रमा हुने ठूला वित्तीय अपराधहरूमा पनि अख्तियारले अनुसन्धान गर्न पाउने नयाँ व्यवस्था प्रस्ताव गरिएको छ। नीतिगत निर्णयको आडमा हुने भ्रष्टाचारलाई परिभाषित गर्दै त्यस्ता निर्णयहरूमा संलग्न पदाधिकारीमाथि मुद्दा चलाउने कानुनी बाटो खोल्न खोजिएको छ। यस विधेयकले सुशासन कायम गर्न नयाँ आयाम थप्ने सरकारको विश्वास छ।"
  },
  {
    "id": "news-3",
    "title": "बजेट भाषणपछि पुँजी बजारमा नयाँ सुधार नीति घोषणा, सर्ट सेलिङ र डेरिभेटिभ्स उपकरणहरू ल्याइने",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "१ घण्टा अगाडि",
    "summary": "अर्थमन्त्री डा. स्वर्णिम वाग्लेले पुँजी बजारको विकास र सुधारका लागि नेप्सेको पुनर्संरचना र नयाँ अत्याधुनिक वित्तीय उपकरणहरू चरणबद्ध रूपमा भित्र्याउने घोषणा गर्नुभएको छ।",
    "content": "आगामी आर्थिक वर्ष २०८३/८४ को बजेट वक्तव्यमार्फत पुँजी बजारलाई थप प्रतिस्पर्धी र पारदर्शी बनाउन नेप्सेको पुनर्संरचना गरिने भएको छ। यसका साथै नेपाली कम्पनीहरूलाई वैदेशिक सेयर बजारमा सूचीकृत हुन मार्गप्रशस्त गरिनुका साथै नेपाली बजारमा इन्ट्रा-डे कारोबार, सर्ट सेलिङ, र डेरिभेटिभ्स जस्ता आधुनिक उपकरणहरू चरणबद्ध रूपमा ल्याइने घोषणा गरिएको छ। यसले बजारलाई नयाँ उचाइमा पुर्याउने अपेक्षा विश्लेषकहरूको छ।"
  },
  {
    "id": "news-4",
    "title": "आर्थिक विधेयक २०८३: सेयर बजारको अल्पकालीन लाभकर बढेर १० प्रतिशत पुग्यो",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "२ घण्टा अगाडि",
    "summary": "नयाँ आर्थिक विधेयक मार्फत सेयर बजारको कर संरचनामा परिमार्जन गरिएको छ, जसअनुसार अल्पकालीन लगानीकर्ताको कर १० प्रतिशत पुर्याइएको छ।",
    "content": "संसदमा पेश गरिएको नयाँ आर्थिक विधेयक २०८३ मार्फत छोटो अवधिको (१ वर्षभन्दा कम) सेयर कारोबारमा लाग्ने पुँजीगत लाभकर ७.५ प्रतिशतबाट बढाएर १० प्रतिशत पुर्याइएको छ। त्यसैगरी, १ वर्षभन्दा बढी अवधिको सेयर होल्ड गर्ने दीर्घकालीन लगानीकर्ताका लागि लाभकर ५ प्रतिशतबाट बढाएर ७.५ प्रतिशत बनाइएको छ। यस कर वृद्धिले बजारमा केही दबाब सिर्जना गरे तापनि प्रणालीगत स्थिरताका लागि आवश्यक रहेको सरकारी अधिकारीहरूको दाबी छ।"
  },
  {
    "id": "news-s3",
    "title": "नेप्से इन्डेक्स २७४५ अंकमा बन्द, कारोबार रकममा भारी वृद्धि",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "४ घण्टा अगाडि",
    "summary": "साताको पहिलो दिन नेप्सेमा सकारात्मक वातावरण सिर्जना भएको छ। कारोबार रकम ८ अर्ब माथि पुग्दा बजारका मुख्य सूचक हरियो भएका छन्।",
    "content": "सेयर बजार परिसूचक नेप्से आज ३८.६७ अंकले बढेर २,७४५.३२ को बिन्दुमा बन्द भएको छ। हाइड्रोपावर र बैंकिङ उपसमूहमा लगानीकर्ताको आकर्षण बढेकाले कारोबार रकममा समेत व्यापक वृद्धि भई ८ अर्ब ६७ करोड रुपैयाँ पुगेको छ। प्राविधिक रूपमा बजारले २,७०० को बलियो प्रतिरोध तह पार गरेको हुनाले आगामी दिनमा बजारमा थप चमक आउने विश्लेषकहरू बताउँछन्।"
  },
  {
    "id": "news-s4",
    "title": "बीमा कम्पनीहरूको चुक्ता पुँजी वृद्धि योजना सार्वजनिक",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "५ घण्टा अगाडि",
    "summary": "नेपाल बीमा प्राधिकरणले जीवन तथा निर्जीवन बीमा कम्पनीहरूका लागि चुक्ता पुँजी वृद्धि गर्ने नयाँ नीति तथा समयावधि घोषणा गरेको छ।",
    "content": "बीमा क्षेत्रको व्यावसायिक सुरक्षा र जोखिम बहन क्षमता बढाउन चुक्ता पुँजीको न्यूनतम सीमा थप २५ प्रतिशतले बढाइएको छ। प्राधिकरणले कम्पनीहरूलाई मर्जरमा जान प्रोत्साहन गर्दै चालू आर्थिक वर्षको अन्त्यसम्ममा नयाँ पुँजी संरचना बुझाउन निर्देशन दिएको छ। यस नीतिले गर्दा सेयर बजारमा बीमा समूहका कम्पनीहरूबीच मर्जर र हकप्रद (Right) सेयर जारी गर्ने क्रम बढ्ने देखिएको छ।"
  },
  {
    "id": "news-s5",
    "title": "थप ३ वटा जलविद्युत कम्पनीहरूको आईपिओ (IPO) स्वीकृत, आवेदन असार ५ देखि खुल्यो",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "१ दिन अगाडि",
    "summary": "धितोपत्र बोर्ड (SEBON) ले नयाँ जलविद्युत आयोजनाहरूलाई स्थानीय बासिन्दा र सर्वसाधारणका लागि सेयर जारी गर्ने अनुमति दिएको छ।",
    "content": "धितोपत्र बोर्डका अनुसार अनुमति पाउने हाइड्रोपावर कम्पनीहरूमा कुल ६५ मेगावाट क्षमताका आयोजनाहरू छन्। सेयर निष्कासनमार्फत प्राप्त पुँजी आयोजनाको कर्जा भुक्तानी र निर्माण कार्य सम्पन्न गर्न प्रयोग गरिनेछ। साना लगानीकर्ताहरूका लागि यो आईपीओ निकै राम्रो अवसर हुन सक्नेछ। आवेदकहरूले मेरोसेयर एपमार्फत न्यूनतम १० कित्ताका लागि आवेदन दिन सक्नेछन्।"
  },
  {
    "id": "news-s6",
    "title": "गैरआवासीय नेपाली (NRN) लाई सेयर बजारमा भित्र्याउन नयाँ निर्देशिका जारी",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "२ दिन अगाडि",
    "summary": "धितोपत्र बोर्ड र नेपाल राष्ट्र बैंकको संयुक्त पहलमा गैरआवासीय नेपालीहरूलाई नेपाली सेयर बजारमा सिधै लगानी गर्न बाटो खुला गरिएको छ।",
    "content": "नयाँ निर्देशिका अनुसार एनआरएनहरूले विदेशी मुद्रा नेपाल ल्याएर तोकिएका वाणिज्य बैंकहरूमा विशेष खाता खोली दोस्रो बजारमा सेयर खरिद-बिक्री गर्न सक्नेछन्। यद्यपि, उनीहरूले नाफा फिर्ता लैजाँदा लाग्ने कर र विनिमय सर्तहरू पालना गर्नुपर्नेछ। यो ऐतिहासिक कदमले सेयर बजारमा वैदेशिक तरलता बढाउन र विदेशी मुद्रा सञ्चिति बलियो बनाउन ठूलो सहयोग पुग्ने विश्वास छ।"
  },
  {
    "id": "news-s7",
    "title": "म्युचुअल फन्डहरूको खुद सम्पत्ति मूल्य (NAV) मा आकर्षक सुधार",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "३ दिन अगाडि",
    "summary": "नेप्से सूचक बढेसँगै सामूहिक लगानी कोष (म्युचुअल फन्ड) हरूको न्याभ मूल्यमा औसत १५ प्रतिशतको वृद्धि देखिएको छ।",
    "content": "विगत केही महिनादेखि सेयर बजार लगातार बढेकाले म्युचुअल फन्डहरूको पोर्टफोलियो मूल्य बलियो बनेको हो। अधिकांश फन्डहरूको न्याभ १० रुपैयाँको आधारभूत मूल्यभन्दा माथि पुगेको छ र कतिपय फन्डहरूले लगानीकर्तालाई वार्षिक लाभांश वितरण गर्ने घोषणा पनि गरेका छन्। कम जोखिम लिन चाहने साना लगानीकर्ताहरूका लागि सामूहिक लगानी कोष उपयुक्त माध्यम बनेको छ।"
  },
  {
    "id": "news-s8",
    "title": "नेप्सेमा सूचीकृत वाणिज्य बैंकहरूको तेस्रो त्रैमासिक रिपोर्ट सार्वजनिक, नाफामा सुधार",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "४ दिन अगाडि",
    "summary": "आर्थिक मन्दीका बाबजुद वाणिज्य बैंकहरूले खराब कर्जा (NPL) नियन्त्रण गर्दै नाफा वृद्धि गरेको वित्तीय विवरण सार्वजनिक गरेका छन्।",
    "content": "वाणिज्य बैंकहरूको तेस्रो त्रैमासिक रिपोर्ट अनुसार धेरैजसो बैंकको वितरणयोग्य नाफा र प्रतिसेयर आम्दानी (EPS) मा अघिल्लो वर्षको तुलनामा सुधार आएको छ। कर्जा प्रवाह सहज हुनु र ब्याजदर घट्नुले बैंकहरूको नाफा बढाउन सहयोग गरेको हो। यो विवरण सार्वजनिक भएसँगै बैंकिङ उपसमूहको सेयर मूल्यमा पनि सुधार देखिएको छ।"
  },
  {
    "id": "news-s9",
    "title": "सेयर ब्रोकरहरूको शाखा विस्तार अब ७७ वटै जिल्लामा गरिने",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "५ दिन अगाडि",
    "summary": "नेपाल धितोपत्र बोर्डले सेयर बजारलाई ग्रामीण क्षेत्रसम्म पुर्याउन ब्रोकर कार्यालयहरूलाई दुर्गम जिल्लामा पनि शाखा खोल्न प्रोत्साहन गर्ने भएको छ।",
    "content": "काठमाडौं उपत्यका र ठूला सहरहरूमा मात्र सीमित रहेको सेयर कारोबारलाई देशव्यापी बनाउन बोर्डले नयाँ नीति ल्याएको हो। अब ब्रोकर कम्पनीहरूले दुर्गम क्षेत्रमा शाखा खोल्दा धरौटी र दस्तुरमा विशेष छुट पाउनेछन्। यसले गर्दा दूरदराजका सर्वसाधारण लगानीकर्ताहरूले पनि सजिलै डिम्याट खाता खोलेर सेयर खरिद-बिक्री गर्न सक्ने वातावरण बन्नेछ।"
  },
  {
    "id": "news-s10",
    "title": "नेप्सेमा अनलाइन प्रणाली (TMS) को नयाँ संस्करण सार्वजनिक",
    "category": "sharemarket",
    "categoryText": "सेयर बजार",
    "time": "६ दिन अगाडि",
    "summary": "नेप्सेले पुरानो टिएमएस प्रणालीमा देखिएका प्राविधिक समस्या समाधान गर्दै थप सुरक्षित र चलाउन सजिलो नयाँ प्लेटफर्म प्लेटफर्म अपडेट गरेको छ।",
    "content": "नयाँ अनलाइन प्रणालीमा रियल-टाइम डेटा लोड हुने दर तीव्र बनाइएको छ र चार्टिङ टुल पनि थपिएको छ। लगानीकर्ताहरूले अब आफ्नै खाताबाट सीधै अनलाइन बैंक खाता जोडेर छिटो रकम लोड र फन्ड ट्रान्सफर गर्न सक्नेछन्। नेप्सेले यस अपडेटपछि सेयर कारोबारको क्रममा आउने सर्भर डाउन हुने र अर्डर रद्द हुने समस्या सदाका लागि अन्त्य भएको दाबी गरेको छ।"
  },
  {
    "id": "news-5",
    "title": "मध्यपूर्व तनाव: इजरायल र लेबनान सीमा क्षेत्रमा भिडन्त तीव्र, अन्तर्राष्ट्रिय समुदाय चिन्तित",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "३ घण्टा अगाडि",
    "summary": "इजरायल र लेबनान सीमामा भइरहेको निरन्तरको हवाई तथा रकेट हमलाले मध्यपूर्वमा व्यापक संकट निम्त्याएको छ, संयुक्त राष्ट्रसंघले संयमताका लागि अपिल गरेको छ।",
    "content": "मध्यपूर्वमा सुरक्षा अवस्था झन् नाजुक बन्दै गइरहेको छ। लेबनान र इजरायलको सीमा क्षेत्रमा दुवै पक्षबाट आक्रमण तीव्र पारिएको छ। संयुक्त राष्ट्रसंघीय शान्ति मिसन र विश्व नेताहरूले तत्काल युद्धविरामका लागि दबाब दिइरहेका छन्। यसले अन्तर्राष्ट्रिय ऊर्जा बजार र ढुवानी प्रणालीमा समेत असर पुर्याउन सक्ने आशंका गरिएको छ।"
  },
  {
    "id": "news-g2",
    "title": "अमेरिकी राष्ट्रपतीय चुनावको बहस सुरु, ट्रम्प र डेमोक्र्याट उम्मेदवारबीच कडा टक्कर",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "५ घण्टा अगाडि",
    "summary": "आगामी चुनावका लागि भएको पहिलो प्रत्यक्ष टेलिभिजन बहसमा अर्थतन्त्र, कर र वैदेशिक नीतिका विषयमा उम्मेदवारहरूबीच घोचपेच भएको छ।",
    "content": "अमेरिकी राष्ट्रपतीय निर्वाचन नजिकिएसँगै उम्मेदवारहरूबीचको चुनावी प्रतिस्पर्धा झन् रोचक बनेको छ। पहिलो प्रत्यक्ष बहसमा मुद्रास्फीति नियन्त्रण, रोजगारी सिर्जना र युक्रेन-इजरायल युद्धमा अमेरिकी सहयोगको भविष्य जस्ता गम्भीर राष्ट्रिय सवालहरूमा उम्मेदवारहरूले आ-आफ्ना नीति स्पष्ट पारेका छन्। यो बहसपछि विश्व बजार र लगानीकर्ताहरू पनि अमेरिकी नीतिको परिवर्तनको आकलनमा जुटेका छन्।"
  },
  {
    "id": "news-g3",
    "title": "युरोपेली युनियनद्वारा नयाँ हरित ऊर्जा सम्झौता पारित, कोइला प्रयोग घटाइने",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "८ घण्टा अगाडि",
    "summary": "कठिन वार्ता पछि युरोपेली युनियनका सदस्य राष्ट्रहरूले कोइला र खनिज इन्धनको प्रयोग सन् २०३५ सम्ममा ठूलो मात्रामा घटाउने निर्णय गरेका छन्।",
    "content": "यस नयाँ ऐतिहासिक हरित सम्झौता (Green Deal) अन्तर्गत नवीकरणीय उर्जा (सौर्य र हावा) को उत्पादन क्षमता बढाउन अर्बौं युरो लगानी गरिनेछ। कोइला उद्योगमा निर्भर देशहरूलाई वैकल्पिक रोजगारी सिर्जना गर्न युनियनले वित्तीय सहयोग दिनेछ। यस कदमले विश्वभरका अन्य राष्ट्रहरूलाई पनि कार्बन उत्सर्जन कटौती गर्न दबाब दिने जलवायु विज्ञहरूको भनाइ छ।"
  },
  {
    "id": "news-g4",
    "title": "बेलायतमा नयाँ प्रधानमन्त्रीको चयन, आर्थिक मन्दी अन्त्य गर्ने प्रतिवद्धता",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "१२ घण्टा अगाडि",
    "summary": "आम निर्वाचनमा स्पष्ट बहुमत प्राप्त गरेसँगै नयाँ सरकारले देशको खस्कँदो अर्थतन्त्र सुधार गर्न विशेष कर छुट र सस्तो आवास योजना ल्याएको छ।",
    "content": "नवनियुक्त बेलायती प्रधानमन्त्रीले पदभार ग्रहण गरेलगत्तै जनतालाई मुद्रास्फीतिको मारबाट बचाउने र स्वास्थ्य सेवा सुधार गर्ने प्रतिबद्धता जनाउनुभयो। बेलायतमा बढ्दो सार्वजनिक ऋण र आन्तरिक मागमा आएको ह्रासलाई सम्बोधन गर्न नयाँ औद्योगिक नीति चाँडै घोषणा गरिने सरकारले बताएको छ। लन्डन स्टक एक्सचेन्जले नयाँ सरकारको आगमनलाई सकारात्मक रूपमा स्वागत गरेको छ।"
  },
  {
    "id": "news-g5",
    "title": "जापानमा शक्तिशाली भूकम्पको धक्का, सुनामीको चेतावनी जारी",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "१८ घण्टा अगाडि",
    "summary": "जापानको पूर्वी तटीय क्षेत्रमा ६.८ रेक्टर स्केलको भूकम्प गएको छ। तटीय बासिन्दाहरूलाई सुरक्षित स्थानमा जान आग्रह गरिएको छ।",
    "content": "भूकम्पको केन्द्रविन्दु समुद्रमुनि रहेको हुनाले समुद्रको छाल १ मिटरसम्म माथि आउन सक्ने चेतावनी जापानी मौसम विज्ञान निकायले दिएको हो। टोकियो लगायतका ठूला सहरहरूमा बुलेट रेल सेवा केही समयका लागि रोकिएको छ। अहिलेसम्म ठूलो मानवीय र भौतिक क्षतिको विवरण विवरण प्राप्त नभए पनि सुरक्षाका लागि तटीय क्षेत्र खाली गराउने काम भइरहेको छ।"
  },
  {
    "id": "news-g6",
    "title": "आर्टिफिसियल इन्टेलिजेन्स (AI) को नियमनका लागि अन्तर्राष्ट्रिय आचारसंहिता मस्यौदा तयार",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "१ दिन अगाडि",
    "summary": "संयुक्त राष्ट्रसंघ र प्रमुख प्रविधि कम्पनीहरू मिलेर आर्टिफिसियल इन्टेलिजेन्सको दुरुपयोग रोक्न विश्वव्यापी नीति तयार पारेका छन्।",
    "content": "यो नयाँ आचारसंहितामा एआईको विकास गर्दा मानव अधिकारको रक्षा गर्ने, साइबर आक्रमण रोक्ने र झूटा सूचना (Deepfake) नियन्त्रण गर्ने प्रावधान राखिएको छ। मस्यौदामा हस्ताक्षर गर्ने देशहरूले आफ्ना घरेलु कानुनमा पनि यस आचारसंहिताको जगमा नयाँ नियम बनाउनु पर्नेछ। यसले एआई प्रविधिलाई सुरक्षित र उत्तरदायी बनाउने लक्ष्य लिएको छ।"
  },
  {
    "id": "news-g7",
    "title": "भारतमा तीव्र आर्थिक विकास दर, दक्षिण एसियाको आर्थिक इन्जिन बन्ने दाबी",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "२ दिन अगाडि",
    "summary": "चालू आर्थिक वर्षको पहिलो त्रैमासिकमा भारतको आर्थिक वृद्धिदर ७.२ प्रतिशत पुगेको छ, जसले विश्वव्यापी प्रक्षेपणहरूलाई उछिनेको छ।",
    "content": "भारतको बलियो घरेलु माग, सेवा क्षेत्रको तीव्र वृद्धि र सरकारको ठूलो पूर्वाधार लगानीका कारण यो प्रगति सम्भव भएको हो। अन्तर्राष्ट्रिय मुद्रा कोष (IMF) ले भारत अहिले संसारको सबैभन्दा छिटो बढिरहेको ठूलो अर्थतन्त्र भएको पुष्टि गरेको छ। यस आर्थिक विकासले छिमेकी देश नेपालको व्यापार र पर्यटनमा समेत सकारात्मक प्रभाव पार्न सक्छ।"
  },
  {
    "id": "news-g8",
    "title": "चीन र ताइवानबीचको तनाव बढ्यो, दक्षिण चीन सागरमा सैन्य अभ्यास",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "३ दिन अगाडि",
    "summary": "ताइवान सीमा नजिकै चिनियाँ युद्धपोत र लडाकु विमानहरूले विशाल सैन्य अभ्यास सुरु गरेपछि ताइवानले आफ्नो प्रतिरक्षा प्रणाली सतर्क बनाएको छ।",
    "content": "सैन्य अभ्यासलाई चीनले आफ्नो भौगोलिक अखण्डता रक्षाको नियमित प्रक्रिया भनेको छ भने ताइवानले यसलाई उत्तेजक कदमको संज्ञा दिएको छ। अमेरिकाले पनि यस क्षेत्रमा आफ्ना विमानवाहक युद्धपोतहरू पठाएर ताइवानको सुरक्षा प्रतिबद्धता दोहोर्याएको छ। भूराजनीतिक तनावका कारण एसियाली बजारहरूमा तेल र सेयर मूल्यमा मूल्यमा केही उतारचढाव देखिएको छ।"
  },
  {
    "id": "news-g9",
    "title": "स्पेसएक्सद्वारा नयाँ विशाल रकेटको सफल परीक्षण उडान",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "४ दिन अगाडि",
    "summary": "इलन मस्कको अन्तरिक्ष कम्पनी स्पेसएक्सले मानिसलाई मंगल ग्रह पठाउने उद्देश्यले डिजाइन गरिएको रकेटको चौथो उडान परीक्षण पूरा गरेको छ।",
    "content": "टेक्ससबाट प्रक्षेपण गरिएको रकेटले पृथ्वीको कक्ष पार गर्दै हिन्द महासागरमा पूर्वनिर्धारित स्थानमा सफ्ट ल्यान्डिङ गरेको हो। यो सफलतासँगै भविष्यमा चन्द्रमा र मंगल ग्रहमा अन्तरिक्ष यात्री पठाउने नासा र स्पेसएक्सको संयुक्त मिसन थप सुनिश्चित भएको छ। अन्तरिक्ष पर्यटन र स्याटेलाइट नेटवर्क विस्तारमा यसले नयाँ क्रान्ति ल्याउने अपेक्षा छ।"
  },
  {
    "id": "news-g10",
    "title": "विश्व स्वास्थ्य संगठनद्वारा नयाँ संक्रामक भाइरसबारे सतर्कता अपनाउन अपिल",
    "category": "global",
    "categoryText": "विश्व समाचार",
    "time": "५ दिन अगाडि",
    "summary": "अफ्रिकी मुलुकहरूमा फैलिएको नयाँ श्वासप्रश्वास सम्बन्धी भाइरस अन्य देशहरूमा भी सर्ने जोखिम देखिएपछि सतर्कता जारी गरिएको छ।",
    "content": "विश्व स्वास्थ्य संगठन (WHO) ले सबै देशका विमानस्थल र नाकाहरूमा यात्रुहरूको स्वास्थ्य जाँच कडा बनाउन र शंकास्पद बिरामीको तत्काल आइसोलेसन व्यवस्था मिलाउन आग्रह गरेको छ। यद्यपि, यो नयाँ भाइरस महामारीको रूपमा फैलिने सम्भावना कम रहेको तर पूर्वसावधानी अपनाउनु नै उत्तम विकल्प भएको विज्ञहरूले बताएका छन्।"
  },
  {
    "id": "news-6",
    "title": "विश्व बजारमा कच्चा तेलको मूल्यमा गिरावट, पेट्रोलियम उत्पादक राष्ट्रहरू (OPEC) द्वारा आपूर्तिको समीक्षा",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "४ घण्टा अगाडि",
    "summary": "विश्वव्यापी मागमा आएको ह्रास र अमेरिकी डलर बलियो हुनुका कारण कच्चा तेलको मूल्यमा गिरावट आएको छ, ओपेकले उत्पादन नीतिमा पुनरावलोकन गर्दैछ।",
    "content": "विश्व अर्थतन्त्रमा मन्दीको संकेत देखिन थालेसँगै इन्धनको माग घटेको छ। ब्रेन्ट क्रुड र डब्लूटीआई तेलको मूल्यमा प्रति ब्यारेल २ देखि ३ प्रतिशतसम्म गिरावट आएको छ। तेल निर्यात गर्ने देशहरूको समूह (OPEC) ले आपूर्तिको सन्तुलन कायम राख्न उत्पादन कटौतीलाई निरन्तरता दिने कि नदिने भन्नेबारे समीक्षा बैठक बोलाएको छ। यसले इन्धन आयात गर्ने नेपाल जस्ता देशहरूलाई भने केही राहत मिल्न सक्छ।"
  },
  {
    "id": "news-8",
    "title": "अमेरिकी फेडरल रिजर्भद्वारा ब्याजदर कटौतीको सम्भावनाबारे संकेत, विश्व अर्थतन्त्र तरंगित",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "६ घण्टा अगाडि",
    "summary": "मुद्रास्फीति नियन्त्रणमा आएको रिपोर्ट सार्वजनिक भएसँगै अमेरिकी केन्द्रीय बैंक फेडले आउँदो त्रैमासिकमा ब्याजदर घटाउन सक्ने संकेत दिएको छ।",
    "content": "फेडका अध्यक्षले अमेरिकी अर्थतन्त्रमा मूल्य वृद्धिदर सन्तोषजनक रूपमा घटेकाले कडा मौद्रिक नीतिलाई खुकुलो बनाउने संकेत दिनुभएको छ। यस संकेतसँगै न्यूयोर्क, टोकियो, र युरोपेली सेयर बजारहरूमा हरियाली छाएको छ। विश्वभरिका विकासशील देशहरूका लागि विदेशी कर्जा सस्तो हुने र लगानीको प्रवाह बढ्ने आकलन अर्थशास्त्रीहरूले गरेका छन्।"
  },
  {
    "id": "news-e3",
    "title": "नेपालको चालु खाता बचतमा उल्लेख्य सुधार, रेमिट्यान्स आप्रवाह बढ्यो",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "१२ घण्टा अगाडि",
    "summary": "विदेशमा रहेका नेपालीहरूले पठाउने रेमिट्यान्स र आयात नियन्त्रणका कारण मुलुकको शोधनान्तर स्थिति बलियो बनेको छ।",
    "content": "नेपाल राष्ट्र बैंकको हालैको प्रतिवेदन अनुसार रेमिट्यान्स आप्रवाह अघिल्लो वर्षको तुलनामा १९ प्रतिशतले बढेर नयाँ उचाइमा पुगेको छ। यसले गर्दा देशको विदेशी मुद्रा सञ्चिति झण्डै १४ महिनाको आयात धान्न सक्ने अवस्थामा पुगेको छ। तर, बैंकहरूमा तरलता बढे पनि निजी क्षेत्रमा कर्जा प्रवाह भने अपेक्षित रूपमा बढ्न सकेको छैन, जसले आन्तरिक माग सुस्त देखाउँछ।"
  },
  {
    "id": "news-e4",
    "title": "आयात प्रतिबन्ध हटेपछि नेपालको बाह्य व्यापार घाटा बढ्यो",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "१८ घण्टा अगाडि",
    "summary": "विलासिताका वस्तु र सवारी साधनको आयात खुला गरिएपछि देशको बाह्य व्यापार घाटा पुनः फराकिलो हुन थालेको भन्सार विभागले जनाएको छ।",
    "content": "चालु आर्थिक वर्षको पहिलो १० महिनामा नेपालको व्यापार घाटा करिब ११ खर्ब रुपैयाँ नाघेको छ। निर्यातमा भने अघिल्लो वर्षको तुलनामा खासै सुधार हुन सकेको छैन। अर्थशास्त्रीहरूका अनुसार देशभित्रै उत्पादन बढाउने र आयात प्रतिस्थापन गर्ने ठोस उद्योगहरू सञ्चालन नभएसम्म व्यापार घाटाको यो ठूलो खाडल पुरिन गाह्रो छ।"
  },
  {
    "id": "news-e5",
    "title": "नेपालमा मुद्रास्फीति दर ६.२ प्रतिशतमा झर्यो, बजार मूल्य सामान्य नियन्त्रणमा",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "१ दिन अगाडि",
    "summary": "नेपाल राष्ट्र बैंकको कडा मौद्रिक नीति र इन्धनको मूल्यमा आएको स्थिरताका कारण उपभोक्ता मुद्रास्फीति नियन्त्रणमा आएको हो।",
    "content": "खाद्यान्न, यातायात र घरायसी उपभोग्य वस्तुहरूको मूल्य वृद्धिदर अघिल्लो वर्षको तुलनामा काहीँ घटेको छ। राष्ट्र बैंकले वार्षिक मुद्रास्फीतिलाई ६.५ प्रतिशत भित्रै राख्ने लक्ष्य हासिल गर्न सफल भएको जनाएको छ। यद्यपि, बजारमा मूल्य वृद्धिको चाप अझै पनि सामान्य उपभोक्ताको क्रयशक्ति भन्दा माथि नै रहेको उपभोक्ता हित संरक्षण मञ्चको दाबी छ।"
  },
  {
    "id": "news-e6",
    "title": "पर्यटन क्षेत्रबाट ऐतिहासिक रूपमा विदेशी मुद्रा आर्जन वृद्धि",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "२ दिन अगाडि",
    "summary": "नेपाल भ्रमण गर्ने विदेशी पर्यटकहरूको संख्यामा कीर्तिमानी वृद्धिसँगै सेवा क्षेत्रको आम्दानी बढेको पर्यटन बोर्डले जनाएको छ।",
    "content": "यस वर्ष नेपालमा हालसम्मकै बढी विदेशी पर्यटकहरू भित्रिएका छन्। पदयात्रा र पर्वतारोहणका लागि आएका पर्यटकहरूले गर्ने खर्च बढेकाले होटल, ट्राभल एजेन्सी र उड्डयन क्षेत्रको आम्दानीमा उल्लेख्य सुधार आएको छ। सरकारले पर्यटन क्षेत्रलाई विदेशी मुद्रा आर्जनको प्रमुख स्रोतको रूपमा विकास गर्न पूर्वाधार सुधारका नयाँ योजनाहरू घोषणा गरेको छ।"
  },
  {
    "id": "news-e7",
    "title": "सरकारले वैदेशिक ऋण भुक्तानीको नयाँ तालिका सार्वजनिक गर्यो",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "३ दिन अगाडि",
    "summary": "अर्थ मन्त्रालयले द्विपक्षीय र बहुपक्षीय विकास साझेदारहरूबाट लिएको वैदेशिक ऋणको सावाँ र ब्याज भुक्तानीको पारदर्शी विवरण विवरण सार्वजनिक गरेको छ।",
    "content": "नेपालको सार्वजनिक ऋण कुल गार्हस्थ्य उत्पादन (GDP) को ४२ प्रतिशत पुगेको बेला यो विवरण आएको हो। अर्थ मन्त्रालयका अनुसार नेपालले समयमै आफ्नो ऋण दायित्व भुक्तानी गरिरहेको छ र कुनै पनि प्रकारको डिफल्ट हुने जोखिम छैन। आगामी दिनमा उत्पादनमूलक आयोजनाहरूमा मात्र वैदेशिक ऋण परिचालन गर्ने रणनीति सरकारले तय गरेको छ।"
  },
  {
    "id": "news-e8",
    "title": "कृषि उत्पादन बढाउन मल आयातका लागि थप १० अर्ब बजेट निकासा",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "४ दिन अगाडि",
    "summary": "खेतीको सिजनमा रासायनिक मलको अभाव हुन नदिन कृषि मन्त्रालयको प्रस्तावमा अर्थ मन्त्रालयले थप बजेट निकासा गरेको छ।",
    "content": "सरकारले साल्ट ट्रेडिङ र कृषि सामग्री कम्पनी लिमिटेडमार्फत छिटो बोलपत्र आह्वान गरी रासायनिक मल खरिद गर्ने प्रक्रिया अघि बढाएको छ। यस बजेट निकासाले धान र मकै बालीको सिजनमा कृषकहरूले सहुलियत दरमा पर्याप्त मल पाउने सुनिश्चितता गर्ने सरकारको दाबी छ। यसले कृषि जीडीपीमा भी सुधार ल्याउने अपेक्षा गरिएको छ।"
  },
  {
    "id": "news-e9",
    "title": "नेपालमा प्रत्यक्ष वैदेशिक लगानी (FDI) मा १५ प्रतिशतको वृद्धि",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "५ दिन अगाडि",
    "summary": "जलविद्युत र पर्यटन क्षेत्रमा विदेशी लगानीकर्ताको रुचि बढेका कारण एफडिआई प्रतिबद्धता र वास्तविक लगानीमा सुधार आएको हो।",
    "content": "उद्योग विभागका अनुसार चालू वर्षको अन्त्यसम्ममा चीन, भारत र अन्य पश्चिमा मुलुकहरूबाट ऐतिहासिक मात्रामा जलविद्युत परियोजनाहरू र लक्जरी रिसोर्टहरूमा लगानी भित्रिएको छ। सरकारले एकद्वार प्रणाली (One Window System) मार्फत लगानी स्वीकृत प्रक्रिया सहज बनाएकाले विदेशी लगानीकर्ताहरूको विश्वास बढेको विभागको विश्लेषण छ।"
  },
  {
    "id": "news-e10",
    "title": "डिजिटल भुक्तानी प्रणालीमा उच्च वृद्धि, नगद कारोबार घट्दै",
    "category": "economy",
    "categoryText": "विश्व अर्थतन्त्र",
    "time": "६ दिन अगाडि",
    "summary": "क्युआर कोड र मोबाइल बैंकिङमार्फत हुने दैनिक वित्तीय कारोबारको आकारमा गत वर्षको तुलनामा दोब्बर वृद्धि भएको छ।",
    "content": "नेपाल राष्ट्र बैंकको पछिल्लो भुक्तानी सूचक अनुसार साना किराना पसलदेखि ठूला सपिङ मलसम्म डिजिटल भुक्तानी व्यापक बनेको छ। नगद छाप्ने र व्यवस्थापन गर्ने राष्ट्र बैंकको करोडौं खर्च जोगिएको छ भने कर प्रशासनमा पारदर्शिता बढेको छ। राष्ट्र बैंकले अब ग्रामीण क्षेत्रमा समेत डिजिटल वित्तीय साक्षरता अभियान चलाउने तयारी गरेको छ।"
  }
]
;

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

  banner.className = 'modal-iframe-wrapper has-banner';

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

  // Reset scrollbar position to the top after DOM rendering
  const details = document.querySelector('.modal-details');
  if (details) {
    details.scrollTop = 0;
    setTimeout(() => { details.scrollTop = 0; }, 50);
  }
}

// ==========================================
// TECHNICAL INDICATOR CALCULATORS FOR NEPSE CHART
// ==========================================
function calculateSMA(data, period) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push({ time: data[i].time, value: data[i].close });
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    sma.push({ time: data[i].time, value: sum / period });
  }
  return sma;
}

function calculateEMA(data, period) {
  const ema = [];
  if (data.length === 0) return ema;
  let prevEma = data[0].close;
  const multiplier = 2 / (period + 1);
  ema.push({ time: data[0].time, value: prevEma });
  
  for (let i = 1; i < data.length; i++) {
    const val = (data[i].close - prevEma) * multiplier + prevEma;
    ema.push({ time: data[i].time, value: val });
    prevEma = val;
  }
  return ema;
}

function calculateBollingerBands(data, period, multiplier) {
  const upper = [];
  const middle = [];
  const lower = [];
  const sma = calculateSMA(data, period);
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      middle.push({ time: data[i].time, value: sma[i].value });
      upper.push({ time: data[i].time, value: sma[i].value });
      lower.push({ time: data[i].time, value: sma[i].value });
      continue;
    }
    
    const midVal = sma[i].value;
    let sumSq = 0;
    for (let j = 0; j < period; j++) {
      const diff = data[i - j].close - midVal;
      sumSq += diff * diff;
    }
    const stdDev = Math.sqrt(sumSq / period);
    
    middle.push({ time: data[i].time, value: midVal });
    upper.push({ time: data[i].time, value: midVal + multiplier * stdDev });
    lower.push({ time: data[i].time, value: midVal - multiplier * stdDev });
  }
  
  return { upper, middle, lower };
}

function calculateRSI(data, period) {
  const rsi = [];
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      rsi.push({ time: data[i].time, value: 50 });
      continue;
    }

    const change = data[i].close - data[i - 1].close;
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    if (i <= period) {
      avgGain += gain;
      avgLoss += loss;
      
      if (i === period) {
        avgGain /= period;
        avgLoss /= period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push({ time: data[i].time, value: 100 - (100 / (1 + rs)) });
      } else {
        rsi.push({ time: data[i].time, value: 50 });
      }
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push({ time: data[i].time, value: 100 - (100 / (1 + rs)) });
    }
  }
  return rsi;
}

function calculateMACD(data) {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  
  const macdLine = [];
  for (let i = 0; i < data.length; i++) {
    macdLine.push({ time: data[i].time, value: ema12[i].value - ema26[i].value });
  }
  
  const macdData = macdLine.map(d => ({ time: d.time, close: d.value }));
  const signalLine = calculateEMA(macdData, 9);
  
  const histogram = [];
  for (let i = 0; i < data.length; i++) {
    histogram.push({
      time: data[i].time,
      value: macdLine[i].value - signalLine[i].value
    });
  }
  
  return { macdLine, signalLine, histogram };
}

// ==========================================
// NEPSE LIVE CHART CONTROLLER (TradingView Lightweight Charts)
// ==========================================
function initNepseChart() {
  const mainContainer = document.getElementById('nepse-main-chart');
  const rsiContainer = document.getElementById('nepse-rsi-chart');
  const macdContainer = document.getElementById('nepse-macd-chart');
  
  if (!mainContainer || !rsiContainer || !macdContainer) return;
  
  // 1. Generate Daily Candlestick Data (250 Trading Days)
  const dailyData = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 365); // 1 year ago
  
  let currentPrice = 2150;
  for (let i = 0; i < 250; i++) {
    baseDate.setDate(baseDate.getDate() + 1);
    while (baseDate.getDay() === 5 || baseDate.getDay() === 6) { // Friday/Saturday are weekends in Nepal
      baseDate.setDate(baseDate.getDate() + 1);
    }
    const timeStr = baseDate.toISOString().split('T')[0];
    
    let trend = 0;
    if (i < 80) trend = 1.8;
    else if (i < 160) trend = -0.8;
    else trend = 3.6;
    
    const vol = 15;
    const change = (Math.random() - 0.44) * vol + trend;
    const open = Math.round((currentPrice) * 100) / 100;
    
    let close = Math.round((currentPrice + change) * 100) / 100;
    if (i === 249) {
      close = 2745.32;
    }
    
    let high = Math.round((Math.max(open, close) + Math.random() * 8) * 100) / 100;
    let low = Math.round((Math.min(open, close) - Math.random() * 8) * 100) / 100;
    
    if (i === 249) {
      // Force last candle to match exactly 2745.32 (+38.67) and high/low details
      dailyData.push({
        time: timeStr,
        open: 2706.65,
        high: 2755.00,
        low: 2698.50,
        close: 2745.32,
        volume: 8670000
      });
    } else {
      dailyData.push({
        time: timeStr,
        open: open,
        high: high,
        low: low,
        close: close,
        volume: Math.round(5000000 + Math.random() * 7000000)
      });
      currentPrice = close;
    }
  }
  
  // 2. Pre-calculate technical indicators
  const smaData = calculateSMA(dailyData, 20);
  const emaData = calculateEMA(dailyData, 9);
  const bbData = calculateBollingerBands(dailyData, 20, 2);
  const rsiData = calculateRSI(dailyData, 14);
  const macdData = calculateMACD(dailyData);
  
  // 3. Render Main Candlestick & Volume Chart
  const mainChart = LightweightCharts.createChart(mainContainer, {
    layout: {
      background: { type: 'solid', color: 'transparent' },
      textColor: 'rgba(255, 255, 255, 0.65)',
      fontSize: 10,
    },
    grid: {
      vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
      horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
    },
    timeScale: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
      timeVisible: false,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
      vertLine: { color: 'rgba(255, 255, 255, 0.25)', width: 1, style: LightweightCharts.LineStyle.Dashed },
      horzLine: { color: 'rgba(255, 255, 255, 0.25)', width: 1, style: LightweightCharts.LineStyle.Dashed },
    }
  });
  
  const candlestickSeries = mainChart.addCandlestickSeries({
    upColor: '#059669',
    downColor: '#dc2626',
    borderUpColor: '#059669',
    borderDownColor: '#dc2626',
    wickUpColor: '#059669',
    wickDownColor: '#dc2626',
  });
  candlestickSeries.setData(dailyData);
  
  // Volume Overlay Series
  const volumeData = dailyData.map(d => ({
    time: d.time,
    value: d.volume,
    color: d.close >= d.open ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)'
  }));
  const volumeSeries = mainChart.addHistogramSeries({
    priceFormat: { type: 'volume' },
    priceScaleId: 'volume',
  });
  volumeSeries.setData(volumeData);
  mainChart.priceScale('volume').applyOptions({
    scaleMargins: { top: 0.8, bottom: 0 },
  });
  
  // SMA Series
  const smaSeries = mainChart.addLineSeries({
    color: '#2563eb',
    lineWidth: 1.5,
    title: 'SMA 20',
  });
  smaSeries.setData(smaData);
  
  // EMA Series
  const emaSeries = mainChart.addLineSeries({
    color: '#ea580c',
    lineWidth: 1.5,
    title: 'EMA 9',
  });
  emaSeries.setData(emaData);
  
  // Bollinger Bands Series
  const bbUpperSeries = mainChart.addLineSeries({ color: 'rgba(201, 162, 39, 0.4)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dotted });
  const bbMiddleSeries = mainChart.addLineSeries({ color: 'rgba(201, 162, 39, 0.3)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed });
  const bbLowerSeries = mainChart.addLineSeries({ color: 'rgba(201, 162, 39, 0.4)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dotted });
  
  bbUpperSeries.setData(bbData.upper);
  bbMiddleSeries.setData(bbData.middle);
  bbLowerSeries.setData(bbData.lower);
  
  // 4. Render RSI Sub-panel Chart
  const rsiChart = LightweightCharts.createChart(rsiContainer, {
    layout: {
      background: { type: 'solid', color: 'transparent' },
      textColor: 'rgba(255, 255, 255, 0.65)',
      fontSize: 10,
    },
    grid: {
      vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
      horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
    },
    timeScale: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
      visible: false,
    },
    rightPriceScale: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    }
  });
  
  const rsiLineSeries = rsiChart.addLineSeries({
    color: '#7e57c2',
    lineWidth: 1.5,
  });
  rsiLineSeries.setData(rsiData);
  
  // RSI reference lines at 30, 50, 70
  const rsi30 = rsiChart.addLineSeries({ color: 'rgba(220, 38, 38, 0.25)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed });
  const rsi50 = rsiChart.addLineSeries({ color: 'rgba(107, 114, 128, 0.15)', lineWidth: 1 });
  const rsi70 = rsiChart.addLineSeries({ color: 'rgba(5, 150, 105, 0.25)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed });
  
  const refTimeData = dailyData.map(d => d.time);
  rsi30.setData(refTimeData.map(t => ({ time: t, value: 30 })));
  rsi50.setData(refTimeData.map(t => ({ time: t, value: 50 })));
  rsi70.setData(refTimeData.map(t => ({ time: t, value: 70 })));
  
  // 5. Render MACD Sub-panel Chart
  const macdChart = LightweightCharts.createChart(macdContainer, {
    layout: {
      background: { type: 'solid', color: 'transparent' },
      textColor: 'rgba(255, 255, 255, 0.65)',
      fontSize: 10,
    },
    grid: {
      vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
      horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
    },
    timeScale: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
      visible: false,
    },
    rightPriceScale: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    }
  });
  
  const macdLineSeries = macdChart.addLineSeries({
    color: '#2563eb',
    lineWidth: 1.5,
  });
  macdLineSeries.setData(macdData.macdLine);
  
  const signalLineSeries = macdChart.addLineSeries({
    color: '#ea580c',
    lineWidth: 1.5,
  });
  signalLineSeries.setData(macdData.signalLine);
  
  const macdHistSeries = macdChart.addHistogramSeries({});
  const histData = macdData.histogram.map(d => ({
    time: d.time,
    value: d.value,
    color: d.value >= 0 ? 'rgba(5, 150, 105, 0.4)' : 'rgba(220, 38, 38, 0.4)'
  }));
  macdHistSeries.setData(histData);
  
  // 6. Synchronize time scales of the three charts
  mainChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
    rsiChart.timeScale().setVisibleLogicalRange(range);
    macdChart.timeScale().setVisibleLogicalRange(range);
  });
  rsiChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
    mainChart.timeScale().setVisibleLogicalRange(range);
    macdChart.timeScale().setVisibleLogicalRange(range);
  });
  macdChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
    mainChart.timeScale().setVisibleLogicalRange(range);
    rsiChart.timeScale().setVisibleLogicalRange(range);
  });
  
  // Set initial visible range (1Y)
  mainChart.timeScale().fitContent();
  
  // 7. Subscribe to crosshair movement to update legends
  mainChart.subscribeCrosshairMove(param => {
    updateLegends(param);
  });
  rsiChart.subscribeCrosshairMove(param => {
    if (param.point && param.time) {
      mainChart.setCrosshairPosition(null, param.time, candlestickSeries);
      macdChart.setCrosshairPosition(null, param.time, macdLineSeries);
    }
    updateLegends(param);
  });
  macdChart.subscribeCrosshairMove(param => {
    if (param.point && param.time) {
      mainChart.setCrosshairPosition(null, param.time, candlestickSeries);
      rsiChart.setCrosshairPosition(null, param.time, rsiLineSeries);
    }
    updateLegends(param);
  });
  
  function updateLegends(param) {
    let priceVal = 2745.32;
    let changeVal = 38.67;
    let pctVal = 1.43;
    let rsiVal = 58.42;
    let macdLineVal = 12.5;
    let signalLineVal = 8.3;
    
    if (param.time) {
      const candleData = param.seriesData.get(candlestickSeries);
      if (candleData) {
        priceVal = candleData.close;
        const openVal = candleData.open;
        changeVal = priceVal - openVal;
        pctVal = (changeVal / openVal) * 100;
      }
      
      const rsiDataVal = rsiData.find(d => d.time === param.time);
      if (rsiDataVal) {
        rsiVal = rsiDataVal.value.toFixed(2);
      }
      
      const macdLineValObj = macdData.macdLine.find(d => d.time === param.time);
      const signalLineValObj = macdData.signalLine.find(d => d.time === param.time);
      if (macdLineValObj && signalLineValObj) {
        macdLineVal = macdLineValObj.value.toFixed(2);
        signalLineVal = signalLineValObj.value.toFixed(2);
      }
    } else {
      const latestCandle = dailyData[dailyData.length - 1];
      priceVal = latestCandle.close;
      changeVal = 38.67;
      pctVal = 1.43;
      rsiVal = rsiData[rsiData.length - 1].value.toFixed(2);
      macdLineVal = macdData.macdLine[macdData.macdLine.length - 1].value.toFixed(2);
      signalLineVal = macdData.signalLine[macdData.signalLine.length - 1].value.toFixed(2);
    }
    
    const priceDisplay = document.getElementById('nepse-price-display');
    if (priceDisplay) {
      priceDisplay.innerHTML = `
        <span class="chart-current-price">${priceVal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        <span class="chart-price-change ${changeVal >= 0 ? 'positive' : 'negative'}">
          ${changeVal >= 0 ? '+' : ''}${changeVal.toFixed(2)} (${changeVal >= 0 ? '+' : ''}${pctVal.toFixed(2)}%)
        </span>
      `;
    }
    
    const rsiValEl = document.getElementById('rsi-value');
    if (rsiValEl) rsiValEl.textContent = rsiVal;
    
    const macdValEl = document.getElementById('macd-value');
    if (macdValEl) {
      macdValEl.innerHTML = `
        <span style="color:#2563eb">MACD: ${macdLineVal}</span>
        <span style="color:#ea580c; margin-left: 8px;">Signal: ${signalLineVal}</span>
      `;
    }
  }
  
  // 8. Timeframe button logic
  const tfButtons = document.querySelectorAll('.tf-btn');
  tfButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tfButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tf = btn.getAttribute('data-tf');
      let range = 250;
      if (tf === '1D') range = 2; 
      else if (tf === '1W') range = 7;
      else if (tf === '1M') range = 20;
      else if (tf === '3M') range = 60;
      else if (tf === '6M') range = 120;
      else if (tf === '1Y') range = 250;
      
      const toIndex = dailyData.length - 1;
      const fromIndex = Math.max(0, toIndex - range);
      
      mainChart.timeScale().setVisibleRange({
        from: dailyData[fromIndex].time,
        to: dailyData[toIndex].time
      });
    });
  });
  
  // 9. Indicator toggle logic
  const indButtons = document.querySelectorAll('.ind-btn');
  indButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const ind = btn.getAttribute('data-ind');
      const isActive = btn.classList.contains('active');
      
      if (ind === 'sma') smaSeries.applyOptions({ visible: isActive });
      else if (ind === 'ema') emaSeries.applyOptions({ visible: isActive });
      else if (ind === 'bb') {
        bbUpperSeries.applyOptions({ visible: isActive });
        bbMiddleSeries.applyOptions({ visible: isActive });
        bbLowerSeries.applyOptions({ visible: isActive });
      }
      else if (ind === 'vol') volumeSeries.applyOptions({ visible: isActive });
    });
  });
  
  // 10. Handle resizing
  window.addEventListener('resize', () => {
    const w = mainContainer.clientWidth;
    mainChart.resize(w, 220);
    rsiChart.resize(w, 55);
    macdChart.resize(w, 55);
  });
}

// ============================================================================
// ADVANCED CHARTING TERMINAL & AI COPILOT CONTROLLER
// ============================================================================

// Stock Metadata & AI Signals Database
const STOCK_METADATA = {
  NEPSE: { name: 'Nepal Stock Exchange Index', type: 'Index', last: 2745.32, open: 2706.65, high: 2755.00, low: 2698.50, change: 38.67, pct: 1.43, base: 2150, entry: 2745, target: 2850, sl: 2680, summary: 'Strong bullish continuation breakout. Heavy volume cluster at 2700 supports price structure.' },
  NICA: { name: 'NIC Asia Bank Limited', type: 'Banking', last: 542.80, open: 531.10, high: 548.00, low: 528.00, change: 11.70, pct: 2.20, base: 490, entry: 542, target: 610, sl: 512, summary: 'Bullish Hammer candlestick detected on daily support trendline. RSI indicating oversold reversal.' },
  HIDCL: { name: 'Hydroelectricity Investment & Dev. Co.', type: 'Hydro', last: 192.50, open: 188.20, high: 195.00, low: 186.50, change: 4.30, pct: 2.28, base: 145, entry: 192, target: 235, sl: 178, summary: 'Ascending triangle breakout. Trading volume increased by 140% during the current session.' },
  UPPER: { name: 'Upper Tamakoshi Hydropower Ltd.', type: 'Hydro', last: 268.30, open: 262.50, high: 271.00, low: 260.00, change: 5.80, pct: 2.21, base: 210, entry: 268, target: 315, sl: 250, summary: 'Consolidating near 200-EMA. Bullish divergence on MACD suggests an upcoming breakout rally.' },
  SHL: { name: 'Soaltee Hotel Limited', type: 'Hotel', last: 348.60, open: 340.20, high: 352.00, low: 338.00, change: 8.40, pct: 2.47, base: 280, entry: 348, target: 395, sl: 325, summary: 'Strong demand zone holding at 330. Cup and handle pattern forming on weekly chart.' },
  NTC: { name: 'Nepal Telecom', type: 'Telecom', last: 820.00, open: 805.00, high: 828.00, low: 801.00, change: 15.00, pct: 1.86, base: 740, entry: 820, target: 910, sl: 785, summary: 'Double bottom reversal patterns confirmed with high volume. Institutional buying detected.' },
  HDL: { name: 'Himalayan Distillery Limited', type: 'Manufacturing', last: 1850.00, open: 1812.00, high: 1865.00, low: 1802.00, change: 38.00, pct: 2.10, base: 1600, entry: 1850, target: 2100, sl: 1740, summary: 'Bullish engulfing candle breakout past resistance cluster. TEMA 9 & 21 bullish crossover.' }
};

// Global Terminal State Variables
let termChartInst = null;
let termRsiInst = null;
let termMacdInst = null;
let termCandleSeries = null;
let termVolumeSeries = null;
let termSmaSeries = null;
let termEmaSeries = null;
let termBbUpper = null;
let termBbMiddle = null;
let termBbLower = null;
let currentSymbol = 'NEPSE';
let currentTermTf = '1D';

// Drawing tools state
let drawingMode = 'cursor'; // cursor, trendline, horizontal, fibonacci, ai-zone, text
let isDrawing = false;
let drawStart = { x: 0, y: 0 };
let drawCurrent = { x: 0, y: 0 };
let drawingsList = []; // stores all drawn shapes
let activeDrawingsColor = '#00c076'; // neon green default

function updateCanvasPointerEvents() {
  const canvas = document.getElementById('drawing-canvas-overlay');
  if (canvas) {
    if (drawingMode === 'cursor') {
      canvas.style.pointerEvents = 'none';
      canvas.style.cursor = 'default';
    } else {
      canvas.style.pointerEvents = 'auto';
      canvas.style.cursor = 'crosshair';
    }
  }
}

// Initializer function for the Advanced Trading Terminal
function initTerminalChart() {
  const mainContainer = document.getElementById('terminal-main-chart');
  const rsiContainer = document.getElementById('terminal-rsi-chart');
  const macdContainer = document.getElementById('terminal-macd-chart');
  
  if (!mainContainer || !rsiContainer || !macdContainer || termChartInst) return;

  // Initialize Toolbar Dropdown controls
  const searchInput = document.getElementById('terminal-symbol-search');
  const dropdown = document.getElementById('symbol-dropdown');
  
  if (searchInput && dropdown) {
    searchInput.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.add('active');
    });
    
    document.addEventListener('click', () => {
      dropdown.classList.remove('active');
    });
    
    dropdown.querySelectorAll('.symbol-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const sym = opt.getAttribute('data-sym');
        searchInput.value = sym;
        switchTerminalSymbol(sym);
        dropdown.classList.remove('active');
      });
    });
    
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toUpperCase();
      dropdown.querySelectorAll('.symbol-option').forEach(opt => {
        const sym = opt.getAttribute('data-sym');
        const name = opt.getAttribute('data-name').toUpperCase();
        if (sym.includes(q) || name.includes(q)) {
          opt.style.display = 'block';
        } else {
          opt.style.display = 'none';
        }
      });
      dropdown.classList.add('active');
    });
  }

  // Timeframe Buttons Click Listeners
  const tfButtons = document.querySelectorAll('.term-tf-btn');
  tfButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tfButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTermTf = btn.getAttribute('data-tf');
      loadSymbolData(currentSymbol);
    });
  });

  // Toggles for Indicators
  const indButtons = document.querySelectorAll('.term-ind-btn');
  indButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const ind = btn.getAttribute('data-ind');
      const isActive = btn.classList.contains('active');
      
      if (ind === 'sma') termSmaSeries.applyOptions({ visible: isActive });
      else if (ind === 'ema') termEmaSeries.applyOptions({ visible: isActive });
      else if (ind === 'bb') {
        termBbUpper.applyOptions({ visible: isActive });
        termBbMiddle.applyOptions({ visible: isActive });
        termBbLower.applyOptions({ visible: isActive });
      }
      else if (ind === 'vol-profile' || ind === 'ai-signals' || ind === 'order-blocks') {
        redrawDrawingCanvas(); // triggers re-render of canvas overlays
      }
    });
  });

  // Drawing Tools Buttons Click Listeners
  const toolButtons = document.querySelectorAll('.tool-btn');
  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toolButtons.forEach(b => b.classList.remove('active'));
      const tool = btn.getAttribute('data-tool');
      if (tool) {
        btn.classList.add('active');
        drawingMode = tool;
        updateCanvasPointerEvents();
      }
    });
  });

  const clearBtn = document.getElementById('tool-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      drawingsList = [];
      redrawDrawingCanvas();
      alert('Drawings cleared!');
    });
  }

  // Sidebar Toggles
  const btnToggleAi = document.getElementById('btn-toggle-ai');
  const aiPanel = document.getElementById('terminal-ai-panel');
  if (btnToggleAi && aiPanel) {
    btnToggleAi.addEventListener('click', () => {
      btnToggleAi.classList.toggle('inactive');
      aiPanel.classList.toggle('collapsed');
      
      // Trigger charts resizing
      setTimeout(() => {
        resizeTerminalCharts();
      }, 350);
    });
  }

  // Fullscreen view toggle
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const termContainer = document.querySelector('.terminal-container');
  if (btnFullscreen && termContainer) {
    btnFullscreen.addEventListener('click', () => {
      termContainer.classList.toggle('fullscreen');
      
      // Toggle button icon representation or size
      setTimeout(() => {
        resizeTerminalCharts();
      }, 100);
    });
  }

  // AI Chat sends logic
  const chatInput = document.getElementById('ai-chat-input');
  const chatSend = document.getElementById('ai-chat-send');
  if (chatInput && chatSend) {
    chatSend.addEventListener('click', sendAiChatMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendAiChatMessage();
    });
  }

  // Create main Lightweight charts in dark mode
  termChartInst = LightweightCharts.createChart(mainContainer, {
    layout: {
      background: { type: 'solid', color: '#131722' },
      textColor: '#b2b5be',
      fontSize: 10,
    },
    grid: {
      vertLines: { color: '#202533' },
      horzLines: { color: '#202533' },
    },
    timeScale: {
      borderColor: '#2a2e39',
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: '#2a2e39',
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
      vertLine: { color: '#787b86', width: 1, style: LightweightCharts.LineStyle.Dashed },
      horzLine: { color: '#787b86', width: 1, style: LightweightCharts.LineStyle.Dashed },
    }
  });

  termCandleSeries = termChartInst.addCandlestickSeries({
    upColor: '#00c076',
    downColor: '#ff335c',
    borderUpColor: '#00c076',
    borderDownColor: '#ff335c',
    wickUpColor: '#00c076',
    wickDownColor: '#ff335c',
  });

  termVolumeSeries = termChartInst.addHistogramSeries({
    priceFormat: { type: 'volume' },
    priceScaleId: 'volume',
  });
  termChartInst.priceScale('volume').applyOptions({
    scaleMargins: { top: 0.82, bottom: 0 },
  });

  termSmaSeries = termChartInst.addLineSeries({ color: '#2962ff', lineWidth: 1.5 });
  termEmaSeries = termChartInst.addLineSeries({ color: '#ff6d00', lineWidth: 1.5 });
  
  termBbUpper = termChartInst.addLineSeries({ color: 'rgba(201, 162, 39, 0.45)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dotted });
  termBbMiddle = termChartInst.addLineSeries({ color: 'rgba(201, 162, 39, 0.3)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed });
  termBbLower = termChartInst.addLineSeries({ color: 'rgba(201, 162, 39, 0.45)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dotted });

  // Create RSI panel
  termRsiInst = LightweightCharts.createChart(rsiContainer, {
    layout: {
      background: { type: 'solid', color: '#131722' },
      textColor: '#787b86',
      fontSize: 9,
    },
    grid: {
      vertLines: { color: '#202533' },
      horzLines: { color: '#202533' },
    },
    timeScale: {
      borderColor: '#2a2e39',
      visible: false,
    },
    rightPriceScale: {
      borderColor: '#2a2e39',
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    }
  });

  // Create MACD panel
  termMacdInst = LightweightCharts.createChart(macdContainer, {
    layout: {
      background: { type: 'solid', color: '#131722' },
      textColor: '#787b86',
      fontSize: 9,
    },
    grid: {
      vertLines: { color: '#202533' },
      horzLines: { color: '#202533' },
    },
    timeScale: {
      borderColor: '#2a2e39',
      visible: false,
    },
    rightPriceScale: {
      borderColor: '#2a2e39',
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
    }
  });

  // Sync visible timeframe scales
  termChartInst.timeScale().subscribeVisibleLogicalRangeChange(range => {
    termRsiInst.timeScale().setVisibleLogicalRange(range);
    termMacdInst.timeScale().setVisibleLogicalRange(range);
    // redraw drawings overlay canvas since view shifts
    redrawDrawingCanvas();
  });
  
  termRsiInst.timeScale().subscribeVisibleLogicalRangeChange(range => {
    termChartInst.timeScale().setVisibleLogicalRange(range);
    termMacdInst.timeScale().setVisibleLogicalRange(range);
  });
  
  termMacdInst.timeScale().subscribeVisibleLogicalRangeChange(range => {
    termChartInst.timeScale().setVisibleLogicalRange(range);
    termRsiInst.timeScale().setVisibleLogicalRange(range);
  });

  // Crosshair movements for legends syncing
  termChartInst.subscribeCrosshairMove(param => {
    syncTerminalLegends(param);
  });

  // Initialize Drawing Canvas Events
  initDrawingOverlayCanvas();

  // Load first symbol (NEPSE)
  loadSymbolData('NEPSE');
}

// Resizes all charts to fit their containers
function resizeTerminalCharts() {
  const mainContainer = document.getElementById('terminal-main-chart');
  const rsiContainer = document.getElementById('terminal-rsi-chart');
  const macdContainer = document.getElementById('terminal-macd-chart');
  
  if (!mainContainer || !termChartInst) return;

  const w = mainContainer.clientWidth;
  const mainH = mainContainer.clientHeight || 280;
  
  termChartInst.resize(w, mainH);
  termRsiInst.resize(w, 60);
  termMacdInst.resize(w, 60);

  // Resize drawing canvas overlay
  const drawCanvas = document.getElementById('drawing-canvas-overlay');
  if (drawCanvas) {
    drawCanvas.width = mainContainer.clientWidth;
    drawCanvas.height = mainContainer.clientHeight;
    redrawDrawingCanvas();
  }
}

// Triggers active symbol switches
function switchTerminalSymbol(symbol) {
  if (!STOCK_METADATA[symbol]) return;
  currentSymbol = symbol;
  
  // Update header text titles
  document.getElementById('term-symbol-display').textContent = symbol;
  document.getElementById('term-fullname-display').textContent = STOCK_METADATA[symbol].name;
  
  // Load new stock data
  loadSymbolData(symbol);
  
  // Update AI recommendation panel
  const meta = STOCK_METADATA[symbol];
  document.getElementById('ai-reco-symbol').textContent = `${symbol} (${meta.type})`;
  document.getElementById('ai-reco-summary').textContent = meta.summary;
  document.getElementById('ai-entry').textContent = meta.last.toLocaleString('en-US');
  document.getElementById('ai-target').textContent = meta.target.toLocaleString('en-US');
  document.getElementById('ai-sl').textContent = meta.sl.toLocaleString('en-US');
  
  // Reset drawing canvas coordinates
  drawingsList = [];
  redrawDrawingCanvas();
}

// Generate stock data and bind to chart series
function loadSymbolData(symbol) {
  if (!termChartInst) return;

  const meta = STOCK_METADATA[symbol];
  const dailyData = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 365); // 1 year ago

  // Determine pricing walk density based on timeframe (simulated)
  let stepsCount = 250;
  let currentPrice = meta.base;

  for (let i = 0; i < stepsCount; i++) {
    baseDate.setDate(baseDate.getDate() + 1);
    while (baseDate.getDay() === 5 || baseDate.getDay() === 6) { // Sunday-Thursday trading weeks
      baseDate.setDate(baseDate.getDate() + 1);
    }
    const timeStr = baseDate.toISOString().split('T')[0];

    let trend = 0;
    if (i < 80) trend = 1.6;
    else if (i < 160) trend = -0.5;
    else trend = 3.2;

    const volatility = symbol === 'HDL' ? 45 : (symbol.includes('NIC') ? 8 : 4);
    const change = (Math.random() - 0.43) * volatility + trend;
    const open = Math.round((currentPrice) * 100) / 100;
    
    let close = Math.round((currentPrice + change) * 100) / 100;
    if (i === stepsCount - 1) {
      close = meta.last;
    }
    
    let high = Math.round((Math.max(open, close) + Math.random() * (volatility * 0.4)) * 100) / 100;
    let low = Math.round((Math.min(open, close) - Math.random() * (volatility * 0.4)) * 100) / 100;

    if (i === stepsCount - 1) {
      dailyData.push({
        time: timeStr,
        open: meta.open,
        high: meta.high,
        low: meta.low,
        close: meta.last,
        volume: Math.round(5000000 + Math.random() * 6000000)
      });
    } else {
      dailyData.push({
        time: timeStr,
        open: open,
        high: high,
        low: low,
        close: close,
        volume: Math.round(1000000 + Math.random() * 4000000)
      });
      currentPrice = close;
    }
  }

  // Precalculate technical indicators
  const smaData = calculateSMA(dailyData, 20);
  const emaData = calculateEMA(dailyData, 9);
  const bbData = calculateBollingerBands(dailyData, 20, 2);
  const rsiData = calculateRSI(dailyData, 14);
  const macdData = calculateMACD(dailyData);

  // Bind to main chart candlestick series
  termCandleSeries.setData(dailyData);
  
  // Bind Volume histogram series
  const volumeData = dailyData.map(d => ({
    time: d.time,
    value: d.volume,
    color: d.close >= d.open ? 'rgba(0, 192, 118, 0.15)' : 'rgba(255, 51, 92, 0.15)'
  }));
  termVolumeSeries.setData(volumeData);

  // Bind Line series indicators
  termSmaSeries.setData(smaData);
  termEmaSeries.setData(emaData);
  
  termBbUpper.setData(bbData.upper);
  termBbMiddle.setData(bbData.middle);
  termBbLower.setData(bbData.lower);

  // Render sub-panel series
  // RSI
  termRsiInst.removeSeries(termRsiInst.seriesList ? termRsiInst.seriesList[0] : null); // Clear prev
  const termRsiSeries = termRsiInst.addLineSeries({ color: '#7e57c2', lineWidth: 1.5 });
  termRsiSeries.setData(rsiData);
  
  // Render RSI bounds
  const rsi30 = termRsiInst.addLineSeries({ color: 'rgba(255, 51, 92, 0.2)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed });
  const rsi70 = termRsiInst.addLineSeries({ color: 'rgba(0, 192, 118, 0.2)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed });
  const refTimes = dailyData.map(d => d.time);
  rsi30.setData(refTimes.map(t => ({ time: t, value: 30 })));
  rsi70.setData(refTimes.map(t => ({ time: t, value: 70 })));

  // MACD
  termMacdInst.seriesList = termMacdInst.seriesList || [];
  termMacdInst.seriesList.forEach(s => termMacdInst.removeSeries(s));
  
  const macdLine = termMacdInst.addLineSeries({ color: '#2563eb', lineWidth: 1.5 });
  const macdSignal = termMacdInst.addLineSeries({ color: '#ea580c', lineWidth: 1.5 });
  const macdHist = termMacdInst.addHistogramSeries({});
  
  macdLine.setData(macdData.macdLine);
  macdSignal.setData(macdData.signalLine);
  const histData = macdData.histogram.map(d => ({
    time: d.time,
    value: d.value,
    color: d.value >= 0 ? 'rgba(0, 192, 118, 0.35)' : 'rgba(255, 51, 92, 0.35)'
  }));
  macdHist.setData(histData);

  termMacdInst.seriesList = [macdLine, macdSignal, macdHist];

  // Set indicators active toggles states
  const activeInds = document.querySelectorAll('.term-ind-btn.active');
  const indKeys = Array.from(activeInds).map(b => b.getAttribute('data-ind'));
  
  termSmaSeries.applyOptions({ visible: indKeys.includes('sma') });
  termEmaSeries.applyOptions({ visible: isActiveIndicator('ema') });
  termBbUpper.applyOptions({ visible: isActiveIndicator('bb') });
  termBbMiddle.applyOptions({ visible: isActiveIndicator('bb') });
  termBbLower.applyOptions({ visible: isActiveIndicator('bb') });

  // 1D/zoom constraints fitting
  termChartInst.timeScale().fitContent();

  // Set AI markers/buy sell indicators directly on the chart
  if (isActiveIndicator('ai-signals')) {
    const markers = [];
    // Place 4-5 mock AI prediction labels along the historical days
    for (let idx = 40; idx < stepsCount; idx += 55) {
      const d = dailyData[idx];
      const isBuy = d.close >= d.open;
      markers.push({
        time: d.time,
        position: isBuy ? 'belowBar' : 'aboveBar',
        color: isBuy ? '#00c076' : '#ff335c',
        shape: isBuy ? 'arrowUp' : 'arrowDown',
        text: isBuy ? 'AI BUY' : 'AI SELL',
        size: 1.2
      });
    }
    termCandleSeries.setMarkers(markers);
  } else {
    termCandleSeries.setMarkers([]);
  }

  // Update legends text to latest value on load
  const latestVal = dailyData[dailyData.length - 1];
  updateTerminalOHLCLegends(latestVal, meta.change, meta.pct);
  
  const latestRsi = rsiData[rsiData.length - 1].value.toFixed(2);
  document.getElementById('term-rsi-val').textContent = latestRsi;
  
  const latestMacd = macdData.macdLine[macdData.macdLine.length - 1].value.toFixed(2);
  const latestSignal = macdData.signalLine[macdData.signalLine.length - 1].value.toFixed(2);
  document.getElementById('term-macd-val').innerHTML = `<span style="color:#2563eb">MACD: ${latestMacd}</span> <span style="color:#ea580c; margin-left:6px;">Signal: ${latestSignal}</span>`;

  // Trigger drawings resize and overlay redraw
  setTimeout(() => {
    resizeTerminalCharts();
  }, 100);
}

function isActiveIndicator(ind) {
  const btn = document.querySelector(`.term-ind-btn[data-ind="${ind}"]`);
  return btn ? btn.classList.contains('active') : false;
}

// Updates price header metrics
function updateTerminalOHLCLegends(candle, change, pct) {
  document.getElementById('term-open').textContent = candle.open.toFixed(2);
  document.getElementById('term-high').textContent = candle.high.toFixed(2);
  document.getElementById('term-low').textContent = candle.low.toFixed(2);
  document.getElementById('term-close').textContent = candle.close.toFixed(2);
  
  const priceDisplay = document.getElementById('term-current-price');
  const changeDisplay = document.getElementById('term-price-change');
  
  if (priceDisplay && changeDisplay) {
    priceDisplay.textContent = candle.close.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    changeDisplay.innerHTML = `
      <span class="${change >= 0 ? 'positive' : 'negative'}">
        ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${change >= 0 ? '+' : ''}${pct.toFixed(2)}%)
      </span>
    `;
  }
}

// Synchronizes the technical legends on crosshair hover
function syncTerminalLegends(param) {
  if (!param.time) {
    // Reset to last candle values
    const meta = STOCK_METADATA[currentSymbol];
    document.getElementById('term-current-price').textContent = meta.last.toLocaleString('en-US');
    document.getElementById('term-price-change').innerHTML = `
      <span class="${meta.change >= 0 ? 'positive' : 'negative'}">
        ${meta.change >= 0 ? '+' : ''}${meta.change.toFixed(2)} (${meta.change >= 0 ? '+' : ''}${meta.pct.toFixed(2)}%)
      </span>
    `;
    return;
  }

  const candle = param.seriesData.get(termCandleSeries);
  if (candle) {
    const change = candle.close - candle.open;
    const pct = (change / candle.open) * 100;
    updateTerminalOHLCLegends(candle, change, pct);
  }
}

// Sets up the transparent overlay drawing canvas
function initDrawingOverlayCanvas() {
  const canvas = document.getElementById('drawing-canvas-overlay');
  const container = document.getElementById('terminal-canvas-container');
  
  if (!canvas || !container) return;

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  updateCanvasPointerEvents();

  // Listen to drawing trigger coordinate points
  canvas.addEventListener('mousedown', (e) => {
    if (drawingMode === 'cursor') return;
    
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    drawStart = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    drawCurrent = { ...drawStart };
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    drawCurrent = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Draw current action in real-time
    redrawDrawingCanvas();
    drawTemporaryShape();
  });

  canvas.addEventListener('mouseup', (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    
    const rect = canvas.getBoundingClientRect();
    drawCurrent = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    // Save drawn shape to drawingsList
    if (drawingMode !== 'cursor') {
      if (drawingMode === 'text') {
        const textStr = prompt('Enter note text label:');
        if (textStr) {
          drawingsList.push({
            type: 'text',
            x: drawStart.x,
            y: drawStart.y,
            text: textStr
          });
        }
      } else {
        drawingsList.push({
          type: drawingMode,
          x1: drawStart.x,
          y1: drawStart.y,
          x2: drawCurrent.x,
          y2: drawCurrent.y
        });
      }
      
      // Select cursor mode again after a shape finishes drawing
      drawingMode = 'cursor';
      updateCanvasPointerEvents();
      const cursorBtn = document.querySelector('.tool-btn[data-tool="cursor"]');
      if (cursorBtn) {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        cursorBtn.classList.add('active');
      }
    }
    
    redrawDrawingCanvas();
  });
}

// Clears and draws all custom shapes/indicators onto overlay canvas
function redrawDrawingCanvas() {
  const canvas = document.getElementById('drawing-canvas-overlay');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render Horizontal Volume Profile if active
  if (isActiveIndicator('vol-profile')) {
    drawHorizontalVolumeProfile(ctx, canvas);
  }

  // Render ICT Order Blocks if active
  if (isActiveIndicator('order-blocks')) {
    drawIctOrderBlocks(ctx, canvas);
  }

  // Render all saved drawings
  drawingsList.forEach(shape => {
    drawShape(ctx, shape);
  });
}

// Draws a temporary shape during mouse drag
function drawTemporaryShape() {
  const canvas = document.getElementById('drawing-canvas-overlay');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const tempShape = {
    type: drawingMode,
    x1: drawStart.x,
    y1: drawStart.y,
    x2: drawCurrent.x,
    y2: drawCurrent.y
  };
  
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 192, 118, 0.6)';
  ctx.lineWidth = 2;
  drawShape(ctx, tempShape);
  ctx.restore();
}

// Core drawing helper for shapes
function drawShape(ctx, shape) {
  ctx.strokeStyle = activeDrawingsColor;
  ctx.fillStyle = activeDrawingsColor;
  ctx.lineWidth = 1.5;

  if (shape.type === 'trendline') {
    ctx.beginPath();
    ctx.moveTo(shape.x1, shape.y1);
    ctx.lineTo(shape.x2, shape.y2);
    ctx.stroke();
    // Start and end circles
    ctx.beginPath();
    ctx.arc(shape.x1, shape.y1, 3.5, 0, 2 * Math.PI);
    ctx.arc(shape.x2, shape.y2, 3.5, 0, 2 * Math.PI);
    ctx.fill();
  } 
  else if (shape.type === 'horizontal') {
    ctx.beginPath();
    ctx.moveTo(0, shape.y1);
    ctx.lineTo(ctx.canvas.width, shape.y1);
    ctx.stroke();
    // Center point marker
    ctx.beginPath();
    ctx.arc(shape.x1, shape.y1, 3, 0, 2 * Math.PI);
    ctx.fill();
  } 
  else if (shape.type === 'fibonacci') {
    const h = shape.y2 - shape.y1;
    const levels = [
      { ratio: 0, label: '0.0% (1.000)' },
      { ratio: 0.236, label: '23.6% (0.764)' },
      { ratio: 0.382, label: '38.2% (0.618)' },
      { ratio: 0.5, label: '50.0% (0.500)' },
      { ratio: 0.618, label: '61.8% (0.382)' },
      { ratio: 1, label: '100.0% (0.000)' }
    ];
    
    levels.forEach(lvl => {
      const y = shape.y1 + h * lvl.ratio;
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.55)'; // Gold tone
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label text
      ctx.fillStyle = '#c9a227';
      ctx.font = '9px monospace';
      ctx.fillText(lvl.label, 10, y - 4);
    });
  } 
  else if (shape.type === 'ai-zone') {
    ctx.fillStyle = 'rgba(0, 192, 118, 0.08)';
    ctx.strokeStyle = 'rgba(0, 192, 118, 0.4)';
    const w = shape.x2 - shape.x1;
    const h = shape.y2 - shape.y1;
    ctx.fillRect(shape.x1, shape.y1, w, h);
    ctx.strokeRect(shape.x1, shape.y1, w, h);
    
    // AI Label
    ctx.fillStyle = '#00c076';
    ctx.font = '700 9px sans-serif';
    ctx.fillText('AI S/R ZONE', Math.min(shape.x1, shape.x2) + 6, Math.min(shape.y1, shape.y2) + 12);
  }
  else if (shape.type === 'text') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px var(--font-sans)';
    ctx.fillText(shape.text, shape.x, shape.y);
  }
}

// Renders horizontal Volume Profile on the left of chart area
function drawHorizontalVolumeProfile(ctx, canvas) {
  // Use prices between 2600 and 2760 for spacing
  const binsCount = 14;
  const barHeight = canvas.height / binsCount;
  
  ctx.save();
  ctx.fillStyle = 'rgba(120, 123, 134, 0.1)';
  ctx.strokeStyle = 'rgba(120, 123, 134, 0.18)';
  ctx.lineWidth = 1;

  for (let i = 0; i < binsCount; i++) {
    // Generate simulated volume sizes (wider profile bars in the middle range)
    let factor = Math.sin((i / binsCount) * Math.PI);
    let barWidth = (canvas.width * 0.35) * factor + (Math.random() * 20);
    
    const y = i * barHeight;
    ctx.fillRect(0, y + 2, barWidth, barHeight - 4);
    ctx.strokeRect(0, y + 2, barWidth, barHeight - 4);

    // Color point of control (POC) in red (middle bin)
    if (i === Math.floor(binsCount * 0.45)) {
      ctx.fillStyle = 'rgba(255, 51, 92, 0.2)';
      ctx.strokeStyle = 'rgba(255, 51, 92, 0.4)';
      ctx.fillRect(0, y + 2, barWidth + 15, barHeight - 4);
      ctx.strokeRect(0, y + 2, barWidth + 15, barHeight - 4);
      ctx.fillStyle = 'rgba(120, 123, 134, 0.1)';
      ctx.strokeStyle = 'rgba(120, 123, 134, 0.18)';
    }
  }
  ctx.restore();
}

// Draws Order Blocks zones on chart background
function drawIctOrderBlocks(ctx, canvas) {
  // Setup 2 order blocks ranges vertically
  const blocks = [
    { y: canvas.height * 0.22, h: 22, type: 'bearish', label: 'Bearish Order Block' },
    { y: canvas.height * 0.65, h: 26, type: 'bullish', label: 'Bullish Order Block' }
  ];

  ctx.save();
  blocks.forEach(b => {
    ctx.fillStyle = b.type === 'bearish' ? 'rgba(255, 51, 92, 0.05)' : 'rgba(0, 192, 118, 0.05)';
    ctx.strokeStyle = b.type === 'bearish' ? 'rgba(255, 51, 92, 0.25)' : 'rgba(0, 192, 118, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    
    ctx.fillRect(0, b.y, canvas.width, b.h);
    ctx.strokeRect(-2, b.y, canvas.width + 4, b.h);
    
    // Text tag
    ctx.fillStyle = b.type === 'bearish' ? '#ff335c' : '#00c076';
    ctx.font = '700 8px sans-serif';
    ctx.fillText(b.label, canvas.width - 110, b.y + 14);
  });
  ctx.restore();
}

// Interactive chat logs sender & analysis answers generator
function sendAiChatMessage() {
  const input = document.getElementById('ai-chat-input');
  const chatLog = document.getElementById('ai-chat-log-container');
  
  if (!input || !input.value.trim() || !chatLog) return;

  const userQuery = input.value.trim();
  input.value = '';

  // Append user chat bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'ai-msg user';
  userBubble.innerHTML = `
    <div class="msg-sender">You</div>
    <div class="msg-content">${userQuery}</div>
  `;
  chatLog.appendChild(userBubble);
  chatLog.scrollTop = chatLog.scrollHeight;

  // Simulate AI Copilot analytical reply
  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'ai-msg bot';
    
    let botReply = '';
    const q = userQuery.toUpperCase();
    
    if (q.includes('NICA') || q.includes('NIC ASIA')) {
      botReply = 'NIC Asia Bank (NICA) is showing a strong support base at 520. The current price of 542.80 is resting near the 50-day EMA, representing a low-risk buying opportunity. Target is 610, Stop Loss 512. Indicators show RSI at 42 (Oversold reversal).';
    } 
    else if (q.includes('HIDCL')) {
      botReply = 'HIDCL is trending inside an ascending triangle. Breakout point is 195. Volume profile shows heavy accumulation at 188. AI recommends adding positions on breakout past 196 with targets near 235.';
    } 
    else if (q.includes('UPPER') || q.includes('TAMAKOSHI')) {
      botReply = 'Upper Tamakoshi (UPPER) has formed a double bottom pattern near 260. RSI is turning positive from 35. EMA 9 is crossing above SMA 20, confirming short-term bullish momentum. Initial target is 315.';
    } 
    else if (q.includes('HYDRO') || q.includes('HYDROPOWER')) {
      botReply = 'The Hydropower index is facing overhead resistance. However, stocks like **UPPER** and **HIDCL** show strong consolidation structures compared to speculative names. Accumulate quality hydro shares near support zones.';
    }
    else if (q.includes('TREND') || q.includes('MARKET') || q.includes('NEPSE')) {
      botReply = `NEPSE index current structure is bullish. Having crossed 2,745 with high volume, the market is setting up a target of 2,850. Major support is located at 2,680. Volume profiles suggest POC (Point of Control) is currently shifting higher.`;
    }
    else {
      botReply = `I am analyzing the technical configurations of ${currentSymbol}. Volume profile POC represents key support. Bollinger Bands are squeezing, suggesting a volatility breakout is imminent. Entry parameters: Entry: ${STOCK_METADATA[currentSymbol].entry}, Target: ${STOCK_METADATA[currentSymbol].target}, Stop Loss: ${STOCK_METADATA[currentSymbol].sl}.`;
    }

    botBubble.innerHTML = `
      <div class="msg-sender">System Copilot</div>
      <div class="msg-content">${botReply}</div>
    `;
    chatLog.appendChild(botBubble);
    chatLog.scrollTop = chatLog.scrollHeight;
  }, 750);
}

