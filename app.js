/**
 * KONTERPRO - Interactive Application Logic
 * Solusi Kasir, Scan IMEI & Stok Khusus Counter HP UMKM
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Real-time Clock in Hero Mockup
  initLiveClock();

  // 2. Mobile Navigation Toggle
  initMobileNav();

  // 3. Interactive IMEI & POS Cashier Simulator
  initPosSimulator();

  // 4. ROI / Time-Saving Calculator
  initRoiCalculator();

  // 5. Pricing Period Switch (Monthly vs Annual)
  initPricingToggle();

  // 6. FAQ Accordions
  initFaqAccordion();

  // 7. Lead Registration Form Handler
  initLeadForm();

  // 8. Login Modal
  initLoginModal();
});

/* ==========================================================================
   1. LIVE REAL-TIME CLOCK
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('heroClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes} WIB`;
  }

  update();
  setInterval(update, 10000);
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggle || !mobileNav) return;

  menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE POS & IMEI SIMULATOR
   ========================================================================== */
const SAMPLE_UNITS = {
  iphone13: {
    name: 'iPhone 13 128GB Midnight',
    imei: '356789012345678',
    sellPrice: 10499000,
    hppPrice: 9600000,
    profit: 899000,
    condition: 'Unit Baru (Segel Box)',
    warranty: 'Garansi Resmi iBox 1 Tahun',
    badge: 'HP Baru'
  },
  redminote12: {
    name: 'Redmi Note 12 6/128GB Mint Green',
    imei: '869012345678901',
    sellPrice: 2499000,
    hppPrice: 2150000,
    profit: 349000,
    condition: 'Unit Baru (Segel Box)',
    warranty: 'Garansi Resmi Xiaomi 15 Bln',
    badge: 'HP Baru'
  },
  samsunga54: {
    name: 'Samsung Galaxy A54 5G 8/256GB (Second)',
    imei: '358901234567890',
    sellPrice: 4450000,
    hppPrice: 3800000,
    profit: 650000,
    condition: 'Unit Second Mulus 98%',
    warranty: 'Garansi Toko 30 Hari Ganti Unit',
    badge: 'HP Second'
  }
};

let currentSelectedUnitKey = 'iphone13';

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function initPosSimulator() {
  const sampleBtns = document.querySelectorAll('.btn-sample-unit');
  const imeiInput = document.getElementById('simImeiInput');
  const btnTriggerScan = document.getElementById('btnTriggerScan');
  const custNameInput = document.getElementById('simCustName');
  const custWaInput = document.getElementById('simCustWa');
  const sellPriceEl = document.getElementById('simSellPrice');
  const hppPriceEl = document.getElementById('simHppPrice');
  const profitEl = document.getElementById('simProfit');
  const btnProcess = document.getElementById('btnSimProcess');

  // Receipt preview elements
  const receiptItemName = document.getElementById('receiptItemName');
  const receiptItemTotal = document.getElementById('receiptItemTotal');
  const receiptItemPrice = document.getElementById('receiptItemPrice');
  const receiptItemImei = document.getElementById('receiptItemImei');
  const receiptSubtotal = document.getElementById('receiptSubtotal');
  const receiptGrandTotal = document.getElementById('receiptGrandTotal');
  const receiptCust = document.getElementById('receiptCust');
  const receiptDate = document.getElementById('receiptDate');
  const receiptPayMethodLabel = document.getElementById('receiptPayMethodLabel');

  // WhatsApp elements
  const waCustName = document.getElementById('waCustName');
  const waUnitName = document.getElementById('waUnitName');
  const waImei = document.getElementById('waImei');
  const waTotal = document.getElementById('waTotal');
  const waTime = document.getElementById('waTime');

  // Tab switcher for receipt view
  const tabBtns = document.querySelectorAll('.btn-receipt-tab');
  const thermalView = document.getElementById('thermalReceiptView');
  const waView = document.getElementById('whatsappReceiptView');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      if (targetTab === 'thermal') {
        thermalView.style.display = 'block';
        waView.style.display = 'none';
      } else {
        thermalView.style.display = 'none';
        waView.style.display = 'block';
      }
    });
  });

  function updateUnitSelection(unitKey) {
    currentSelectedUnitKey = unitKey;
    const unit = SAMPLE_UNITS[unitKey];
    if (!unit) return;

    sampleBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-unit') === unitKey);
    });

    imeiInput.value = unit.imei;
    sellPriceEl.textContent = formatRupiah(unit.sellPrice);
    hppPriceEl.textContent = formatRupiah(unit.hppPrice);
    profitEl.textContent = '+' + formatRupiah(unit.profit);

    // Update receipt preview
    updateReceiptView();
  }

  function updateReceiptView() {
    const unit = SAMPLE_UNITS[currentSelectedUnitKey];
    const custName = custNameInput.value.trim() || 'Pelanggan';
    const selectedPayMethod = document.querySelector('input[name="payMethod"]:checked')?.value || 'QRIS';

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    if (receiptItemName) receiptItemName.textContent = unit.name;
    if (receiptItemTotal) receiptItemTotal.textContent = Number(unit.sellPrice).toLocaleString('id-ID');
    if (receiptItemPrice) receiptItemPrice.textContent = Number(unit.sellPrice).toLocaleString('id-ID');
    if (receiptItemImei) receiptItemImei.textContent = unit.imei;
    if (receiptSubtotal) receiptSubtotal.textContent = formatRupiah(unit.sellPrice);
    if (receiptGrandTotal) receiptGrandTotal.textContent = formatRupiah(unit.sellPrice);
    if (receiptCust) receiptCust.textContent = `Cust: ${custName}`;
    if (receiptDate) receiptDate.textContent = dateFormatted;
    if (receiptPayMethodLabel) receiptPayMethodLabel.textContent = `Metode: ${selectedPayMethod}`;

    // WhatsApp
    if (waCustName) waCustName.textContent = custName;
    if (waUnitName) waUnitName.textContent = unit.name;
    if (waImei) waImei.textContent = unit.imei;
    if (waTotal) waTotal.textContent = formatRupiah(unit.sellPrice);
    if (waTime) waTime.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} ✓✓`;
  }

  // Sample unit buttons click
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const unitKey = btn.getAttribute('data-unit');
      updateUnitSelection(unitKey);
      showToast(`📱 Unit ${SAMPLE_UNITS[unitKey].name} dipilih!`);
    });
  });

  // Re-scan trigger
  if (btnTriggerScan) {
    btnTriggerScan.addEventListener('click', () => {
      btnTriggerScan.disabled = true;
      btnTriggerScan.innerHTML = '<span>Scanning...</span>';
      
      setTimeout(() => {
        btnTriggerScan.disabled = false;
        btnTriggerScan.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span>Simulasi Scan Ulang</span>
        `;
        showToast(`🔍 Barcode IMEI ${SAMPLE_UNITS[currentSelectedUnitKey].imei} berhasil dibaca!`);
      }, 600);
    });
  }

  // Input listeners
  if (custNameInput) custNameInput.addEventListener('input', updateReceiptView);
  document.querySelectorAll('input[name="payMethod"]').forEach(r => {
    r.addEventListener('change', updateReceiptView);
  });

  // Process Transaction Button
  if (btnProcess) {
    btnProcess.addEventListener('click', () => {
      updateReceiptView();
      const unit = SAMPLE_UNITS[currentSelectedUnitKey];
      const custName = custNameInput.value.trim() || 'Pelanggan';
      const custWa = custWaInput.value.trim() || '0812xxxx';
      const payMethod = document.querySelector('input[name="payMethod"]:checked')?.value || 'QRIS';

      showToast(`🎉 Transaksi ${formatRupiah(unit.sellPrice)} (${payMethod}) Sukses! Struk Thermal Dicetak & E-Nota WA terkirim ke ${custWa}!`);
    });
  }
}

/* ==========================================================================
   4. ROI / SAVING CALCULATOR
   ========================================================================== */
function initRoiCalculator() {
  const sliderHp = document.getElementById('sliderHpDaily');
  const sliderAcc = document.getElementById('sliderAccDaily');
  const valHp = document.getElementById('valHpDaily');
  const valAcc = document.getElementById('valAccDaily');

  const savedHoursEl = document.getElementById('calcSavedHours');
  const preventLossEl = document.getElementById('calcPreventLoss');

  if (!sliderHp || !sliderAcc) return;

  function recalculate() {
    const hpCount = parseInt(sliderHp.value, 10);
    const accCount = parseInt(sliderAcc.value, 10);

    valHp.textContent = `${hpCount} Unit / hari`;
    valAcc.textContent = `${accCount} Transaksi / hari`;

    // Formula calculation
    // Average counter spends 10 mins per HP unit and 3 mins per accessories on manual bookkeeping
    const minutesSavedDaily = (hpCount * 12) + (accCount * 3.5);
    const monthlyHoursSaved = Math.round((minutesSavedDaily * 30) / 60);

    // Potential inventory discrepancies prevented (~Rp 250.000 per HP loss prevention + 5% acc loss)
    const monthlyLossPrevented = (hpCount * 450000) + (accCount * 30000);

    if (savedHoursEl) savedHoursEl.textContent = `${monthlyHoursSaved} Jam`;
    if (preventLossEl) preventLossEl.textContent = formatRupiah(monthlyLossPrevented);
  }

  sliderHp.addEventListener('input', recalculate);
  sliderAcc.addEventListener('input', recalculate);

  // Initial run
  recalculate();
}

/* ==========================================================================
   5. PRICING PERIOD SWITCH
   ========================================================================== */
function initPricingToggle() {
  const toggleBtn = document.getElementById('pricingSwitch');
  const priceMonthlyVal = document.getElementById('priceMonthlyVal');
  const priceMonthlyPeriod = document.getElementById('priceMonthlyPeriod');
  const priceAnnualVal = document.getElementById('priceAnnualVal');
  const priceAnnualPeriod = document.getElementById('priceAnnualPeriod');
  const annualSavingSub = document.getElementById('annualSavingSub');

  if (!toggleBtn) return;

  let isAnnual = false;

  toggleBtn.addEventListener('click', () => {
    isAnnual = !isAnnual;
    toggleBtn.setAttribute('aria-checked', isAnnual ? 'true' : 'false');

    if (isAnnual) {
      if (priceMonthlyVal) priceMonthlyVal.textContent = '74.900';
      if (priceMonthlyPeriod) priceMonthlyPeriod.textContent = '/ bln (Tagihan Tahunan)';
      if (priceAnnualVal) priceAnnualVal.textContent = '899.000';
      if (priceAnnualPeriod) priceAnnualPeriod.textContent = '/ tahun';
      if (annualSavingSub) annualSavingSub.textContent = '🔥 Anda Berhemat Rp 289.000 / Tahun!';
      showToast('🏷️ Harga Paket Tahunan Hemat 25% Diaktifkan!');
    } else {
      if (priceMonthlyVal) priceMonthlyVal.textContent = '99.000';
      if (priceMonthlyPeriod) priceMonthlyPeriod.textContent = '/ bulan';
      if (priceAnnualVal) priceAnnualVal.textContent = '899.000';
      if (priceAnnualPeriod) priceAnnualPeriod.textContent = '/ tahun';
      if (annualSavingSub) annualSavingSub.textContent = 'Setara Rp 74.900/bulan (Hemat Rp 289.000)';
    }
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. LEAD REGISTRATION FORM HANDLER
   ========================================================================== */
function initLeadForm() {
  const form = document.getElementById('leadRegisterForm');
  const successBox = document.getElementById('formSuccessBox');
  const successWaTarget = document.getElementById('successWaTarget');
  const btnReset = document.getElementById('btnResetForm');
  const btnSubmit = document.getElementById('btnSubmitReg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const storeName = document.getElementById('regStoreName').value.trim();
    const ownerName = document.getElementById('regOwnerName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();

    if (!storeName || !ownerName || !phone || !email) {
      alert('Mohon lengkapi semua kolom bertanda bintang (*)');
      return;
    }

    // Loading State
    btnSubmit.disabled = true;
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<span>Membuat Akun Trial...</span>';

    setTimeout(() => {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalText;

      form.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
        if (successWaTarget) successWaTarget.textContent = phone;
      }

      showToast(`🎉 Selamat ${ownerName}! Akun trial ${storeName} telah aktif.`);
    }, 900);
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      if (successBox) successBox.style.display = 'none';
    });
  }
}

/* ==========================================================================
   8. LOGIN MODAL
   ========================================================================== */
function initLoginModal() {
  const btnOpenModal = document.getElementById('btnOpenLoginModal');
  const btnOpenModalMobile = document.getElementById('btnOpenLoginModalMobile');
  const btnCloseModal = document.getElementById('btnCloseLoginModal');
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const linkGoToRegister = document.getElementById('linkGoToRegister');

  function openModal() {
    if (loginModal) loginModal.style.display = 'flex';
  }

  function closeModal() {
    if (loginModal) loginModal.style.display = 'none';
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
  if (btnOpenModalMobile) btnOpenModalMobile.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) closeModal();
    });
  }

  if (linkGoToRegister) {
    linkGoToRegister.addEventListener('click', () => {
      closeModal();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('🚀 Berhasil masuk ke Dashboard KonterPro!');
    });
  }
}

/* ==========================================================================
   9. GLOBAL TOAST NOTIFICATION
   ========================================================================== */
let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById('appToast');
  const toastMsg = document.getElementById('toastMessage');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.style.display = 'flex';

  if (toastTimeout) clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}
