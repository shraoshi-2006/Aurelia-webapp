// =========================================================================
// ZERO-FOUC THEME INITIALIZER (Runs immediately before DOM ready)
// =========================================================================
(function () {
  try {
    const raw = localStorage.getItem('aurelia_theme_settings');
    if (raw) {
      const theme = JSON.parse(raw);
      const ALLOWED_THEME_COLORS = ['#0284C7', '#FFFFFF', '#130481', '#494D5F', '#FCA311'];
      const sidebarBg = (theme.sidebarBg && ALLOWED_THEME_COLORS.includes(theme.sidebarBg.toUpperCase())) ? theme.sidebarBg.toUpperCase() : '#494D5F';
      const cardBorder = (theme.cardBorder && ALLOWED_THEME_COLORS.includes(theme.cardBorder.toUpperCase())) ? theme.cardBorder.toUpperCase() : '#FCA311';
      const isDefaultBorder = !theme.cardBorder || theme.cardBorder.includes('rgba');
      const rimBgValue = isDefaultBorder
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.5) 30%, rgba(255, 255, 255, 0.1) 65%, rgba(255, 255, 255, 0.75) 100%)'
        : cardBorder;
      const btnBg = isDefaultBorder ? '#FCA311' : cardBorder;
      let r = 252, g = 163, b = 17;
      if (btnBg.startsWith('#') && btnBg.length === 7) {
        r = parseInt(btnBg.slice(1, 3), 16) || 0;
        g = parseInt(btnBg.slice(3, 5), 16) || 0;
        b = parseInt(btnBg.slice(5, 7), 16) || 0;
      }
      const isLight = ((r * 299 + g * 587 + b * 114) / 1000) > 170;
      const btnText = isLight ? '#000000' : '#FFFFFF';
      const btnBorder = isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.25)';

      let style = document.getElementById('aurelia-dynamic-theme-override');
      if (!style) {
        style = document.createElement('style');
        style.id = 'aurelia-dynamic-theme-override';
        document.head.appendChild(style);
      }
      style.textContent = `
        :root {
          --aurelia-sidebar-bg: ${sidebarBg} !important;
          --aurelia-card-border: ${cardBorder} !important;
          --aurelia-card-border-hover: ${cardBorder} !important;
          --aurelia-card-rim-bg: ${rimBgValue} !important;
          --aurelia-btn-primary-bg: ${btnBg} !important;
          --aurelia-btn-primary-text: ${btnText} !important;
        }
        #app-sidebar,
        #mobile-user-menu-drawer,
        #mobile-drawer,
        .mobile-sidebar-drawer,
        #app-mobile-header,
        #btn-sidebar-collapse,
        #app-sidebar.is-collapsed #btn-sidebar-collapse {
          background: ${sidebarBg} !important;
          background-color: ${sidebarBg} !important;
        }
        #btn-sidebar-collapse,
        #btn-sidebar-collapse svg,
        #app-sidebar.is-collapsed #btn-sidebar-collapse,
        #app-sidebar.is-collapsed #btn-sidebar-collapse svg {
          color: ${isLight ? '#000000' : '#FFFFFF'} !important;
          stroke: ${isLight ? '#000000' : '#FFFFFF'} !important;
        }
        #btn-sidebar-collapse:hover svg,
        #btn-sidebar-collapse:hover svg path,
        #app-sidebar.is-collapsed #btn-sidebar-collapse:hover svg,
        #app-sidebar.is-collapsed #btn-sidebar-collapse:hover svg path {
          color: ${isLight ? '#000000' : '#FFFFFF'} !important;
          stroke: ${isLight ? '#000000' : '#FFFFFF'} !important;
        }
        #btn-sidebar-collapse:hover,
        #app-sidebar.is-collapsed #btn-sidebar-collapse:hover {
          filter: brightness(1.15);
        }
        ${isDefaultBorder ? `
        .Aurelia-card,
        .aurelia-card,
        .finset-card,
        .spatial-card,
        #section-dashboard .Aurelia-card,
        #main-app-content .Aurelia-card,
        .glass-money-flow {
          border: 0.1px solid rgba(255, 255, 255, 0.82) !important;
          outline: 0px !important;
          outline-width: 0px !important;
        }
        .Aurelia-card::before,
        .aurelia-card::before,
        .finset-card::before,
        .spatial-card::before,
        #section-dashboard .Aurelia-card::before,
        #main-app-content .Aurelia-card::before,
        .glass-money-flow::before {
          background: ${rimBgValue} !important;
        }
        ` : `
        .Aurelia-card,
        .aurelia-card,
        .finset-card,
        .spatial-card,
        #section-dashboard .Aurelia-card,
        #main-app-content .Aurelia-card,
        .glass-money-flow {
          border: 0.1px solid ${cardBorder} !important;
          border-color: ${cardBorder} !important;
          outline: 0px !important;
          outline-width: 0px !important;
          outline-color: transparent !important;
        }
        .Aurelia-card:hover,
        .aurelia-card:hover,
        .finset-card:hover,
        .spatial-card:hover,
        #section-dashboard .Aurelia-card:hover,
        #main-app-content .Aurelia-card:hover,
        .glass-money-flow:hover {
          border: 0.1px solid ${cardBorder} !important;
          border-color: ${cardBorder} !important;
          outline: 0px !important;
          outline-width: 0px !important;
          outline-color: transparent !important;
        }
        .Aurelia-card::before,
        .aurelia-card::before,
        .finset-card::before,
        .spatial-card::before,
        #section-dashboard .Aurelia-card::before,
        #main-app-content .Aurelia-card::before,
        .glass-money-flow::before {
          display: none !important;
          content: none !important;
        }
        `}
        .btn-Aurelia-primary,
        .btn-aurelia-primary,
        .btn-finset-primary,
        .btn-view-order-items,
        .btn-order-to-bill,
        .quick-nav-bill,
        #btn-theme-save,
        #btn-save-profile,
        #btn-confirm-reset-action,
        button.btn-finset-primary,
        button.btn-Aurelia-primary {
          background: ${btnBg} !important;
          background-color: ${btnBg} !important;
          color: ${btnText} !important;
          border-color: ${btnBorder} !important;
          box-shadow: none !important;
        }
        .btn-Aurelia-primary *,
        .btn-aurelia-primary *,
        .btn-finset-primary *,
        .btn-view-order-items *,
        .btn-order-to-bill *,
        .quick-nav-bill * {
          color: ${btnText} !important;
        }
        .btn-Aurelia-primary:hover,
        .btn-aurelia-primary:hover,
        .btn-finset-primary:hover,
        .btn-view-order-items:hover,
        .btn-order-to-bill:hover,
        .quick-nav-bill:hover,
        #btn-theme-save:hover {
          filter: brightness(0.92) !important;
          color: ${btnText} !important;
          box-shadow: none !important;
        }
        .btn-Aurelia-primary:active,
        .btn-aurelia-primary:active,
        .btn-finset-primary:active {
          box-shadow: none !important;
        }
      `;
    }
  } catch (e) { }
})();

/**
 * FinSet Hotel Financial & Billing Management System
 * Front Desk POS & Operational Financials Engine
 * Designed for Hotel Aurelia - Audit Session 27th October 2026
 * 
 * MODULES:
 * 1. LOCAL STORAGE & REALISTIC OCTOBER 2026 SAMPLE DATA
 * 2. CURRENCY & LOCALE FORMATTING (USD / INR SUPPORT)
 * 3. NAVIGATION, SIDEBAR COLLAPSE & THEME CONTROLLER
 * 4. DASHBOARD ENGINE (MONEY FLOW CHART, BUDGET DOUGHNUT, KPIS, RECENT TRANSACTIONS)
 * 5. BILLING & POS MODULE (LIVE GST 5%, DISCOUNTS, PRINT & JSPDF EXPORT)
 * 6. PRODUCT & MENU CATALOG (CATEGORIES, AVAILABILITY TOGGLES)
 * 7. ORDER & KITCHEN TICKET QUEUE (CONVERT TO BILL, STATUS LIFECYCLE)
 * 8. CUSTOMER REGISTRY & LOYALTY PROFILES
 * 9. GLOBAL SEARCH, NOTIFICATIONS & REPORT SUMMARIES
 */

$(document).ready(function () {
  // Payment Method Pill Switcher (Add Bill)
  $(document).on('click', '.btn-pay-pill', function () {
    const val = $(this).data('val');
    $('#select-payment-method').val(val).trigger('change');
  });

  $(document).on('change', '#select-payment-method', function () {
    const val = $(this).val();
    $('.btn-pay-pill').each(function () {
      const pVal = $(this).data('val');
      if (pVal === val) {
        if (pVal === 'UPI') {
          $(this).removeClass('border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300').addClass('border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 shadow-2xs');
        } else if (pVal === 'Card') {
          $(this).removeClass('border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300').addClass('border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 shadow-2xs');
        } else if (pVal === 'Cash') {
          $(this).removeClass('border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300').addClass('border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-2xs');
        }
      } else {
        $(this).removeClass('border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-2xs').addClass('border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300');
      }
    });
  });

  'use strict';

  // Global Table Alignment Enforcer (Headings: Center, Details/Data: Left)
  if (!$('#style-global-table-alignment').length) {
    $('#style-global-table-center').remove();
    $('head').append(`
      <style id="style-global-table-alignment">
  /* Global Table Left Alignment: All Table Headings, Details and Content Left-aligned */
  table,
  table thead,
  table tbody,
  table tfoot,
  table tr,
  table th,
  table td,
  table thead th,
  table tbody td,
  table tfoot td,
  .Aurelia-table-header th,
  .Aurelia-table-header td {
    text-align: left !important;
  }

  table tbody td:not(.whitespace-nowrap),
  table tfoot td:not(.whitespace-nowrap),
  table td:not(.whitespace-nowrap),
  .Aurelia-table-header td:not(.whitespace-nowrap) {
    white-space: normal;
    word-break: break-word;
  }

  table td.whitespace-nowrap,
  table th.whitespace-nowrap,
  .whitespace-nowrap {
    white-space: nowrap !important;
  }

  /* Mobile-only responsive containment and single-line table protection (Active ONLY on <= 767px) */
  @media (max-width: 767px) {
    html, body {
      overflow-x: hidden !important;
      max-width: 100vw !important;
      width: 100% !important;
    }

    #app-dashboard-wrapper,
    #main-app-content,
    main,
    section,
    .app-main-content {
      overflow-x: hidden !important;
      max-width: 100% !important;
      width: 100% !important;
      min-width: 0 !important;
    }

    /* Ambient blur glow circles: hide on mobile to prevent canvas horizontal expansion */
    #section-dashboard > div.absolute.rounded-full,
    section > div.absolute.rounded-full.blur-3xl {
      display: none !important;
    }

    /* Cards fit full mobile width cleanly with zero horizontal slide */
    .Aurelia-card,
    .aurelia-card {
      max-width: 100% !important;
    }

    /* Table scroll container: allows smooth horizontal scroll INSIDE the card */
    .overflow-x-auto,
    .overflow-x-scroll,
    .table-responsive,
    div:has(> table) {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      max-width: 100% !important;
      display: block !important;
      width: 100% !important;
    }

    /* Minimum table width on mobile so columns never get squished into vertical letters */
    .overflow-x-auto > table,
    .overflow-x-scroll > table,
    .Aurelia-card table:not(#print-invoice-area table),
    table.w-full {
      min-width: 560px !important;
    }

    #emp-leave-card {
      max-width: 100% !important;
      overflow: hidden !important;
    }
    #emp-leave-card .overflow-x-auto {
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    #page-emp-leave-table {
      min-width: 620px !important;
      width: 100% !important;
    }

    /* Table cells: compact font, clean padding, single-line data (never wrap letter by letter) */
    table tbody td,
    table tfoot td,
    table td,
    table th,
    .Aurelia-table-header td,
    .Aurelia-table-header th {
      white-space: nowrap !important;
      word-break: normal !important;
      font-size: 11px !important;
      padding-top: 0.5rem !important;
      padding-bottom: 0.5rem !important;
      padding-left: 0.5rem !important;
      padding-right: 0.5rem !important;
    }

    /* Badges, pills, numbers must NEVER wrap letters into vertical stacks */
    [class*="badge"],
    .stat-badge-pill,
    [id*="-badge-"],
    table td span,
    .inline-flex.rounded-full {
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      display: inline-flex !important;
    }

    /* Multi-line cells (like customer name + phone) */
    table td .inline-flex.flex-col,
    table td .flex-col {
      white-space: nowrap !important;
      min-width: 120px !important;
    }
  }

  /* Default table headers and cell text left-aligned */
  table th,
  table td,
  table th p,
  table td p,
  table th span:not([class*="justify-center"]):not([class*="rounded"]):not([class*="badge"]):not([class*="w-"]),
  table td span:not([class*="justify-center"]):not([class*="rounded"]):not([class*="badge"]):not([class*="w-"]),
  table th div:not([class*="justify-center"]):not([class*="rounded"]):not([class*="w-"]),
  table td div:not([class*="justify-center"]):not([class*="rounded"]):not([class*="w-"]) {
    text-align: left !important;
  }

  /* Primary layout flex containers in cells align to the start/left */
  table th > .flex,
  table th > .inline-flex,
  table td > .flex,
  table td > .inline-flex,
  table th .flex:not([class*="justify-center"]):not([class*="justify-end"]):not([class*="rounded"]):not([class*="w-"]),
  table th .inline-flex:not([class*="justify-center"]):not([class*="justify-end"]):not([class*="rounded"]):not([class*="w-"]),
  table td .flex:not([class*="justify-center"]):not([class*="justify-end"]):not([class*="rounded"]):not([class*="w-"]),
  table td .inline-flex:not([class*="justify-center"]):not([class*="justify-end"]):not([class*="rounded"]):not([class*="w-"]) {
    display: flex !important;
    justify-content: flex-start !important;
    text-align: left !important;
  }

  table th .flex-col,
  table td .flex-col {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    text-align: left !important;
  }

  table th .flex-col > *,
  table td .flex-col > * {
    text-align: left !important;
  }

  /* CRITICAL FIX: Retain internal centering for Avatars, Food Tiles, Dietary marks, Badges and Buttons */
  table th .justify-center,
  table td .justify-center,
  table th [class*="justify-center"],
  table td [class*="justify-center"],
  table th .items-center.justify-center,
  table td .items-center.justify-center,
  table td [class*="rounded-full"][class*="w-"],
  table td [class*="rounded-xl"][class*="w-"],
  table td [class*="rounded-2xl"][class*="w-"],
  table td [class*="rounded-lg"][class*="w-"],
  table td [class*="rounded-md"][class*="w-"],
  table td [class*="rounded-"][class*="h-"],
  table td [title="Vegetarian"],
  table td [title="Non-Vegetarian"],
  table td [aria-label="Vegetarian"],
  table td [aria-label="Non-Vegetarian"],
  table td button[class*="rounded"],
  table td a[class*="rounded"] {
    display: inline-flex !important;
    justify-content: center !important;
    align-items: center !important;
    text-align: center !important;
  }

  table td [class*="badge"],
  table td span[class*="rounded-full"] {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
  }

  /* Internal text, spans and SVG inside avatars, tiles, dietary badges and action buttons */
  table th .justify-center *,
  table td .justify-center *,
  table th [class*="justify-center"] *,
  table td [class*="justify-center"] *,
  table td [class*="rounded-full"][class*="w-"] *,
  table td [class*="rounded-xl"][class*="w-"] *,
  table td [class*="rounded-2xl"][class*="w-"] *,
  table td [class*="rounded-lg"][class*="w-"] *,
  table td [class*="rounded-md"][class*="w-"] *,
  table td [class*="rounded-"][class*="h-"] *,
  table td [title="Vegetarian"] *,
  table td [title="Non-Vegetarian"] *,
  table td [aria-label="Vegetarian"] *,
  table td [aria-label="Non-Vegetarian"] *,
  table td [class*="badge"] *,
  table td span[class*="rounded-full"] *,
  table td button[class*="rounded"] * {
    text-align: center !important;
  }

  /* Food Tile emoji specifically */
  table td [class*="rounded-xl"][class*="w-"] > span,
  table td [class*="rounded-2xl"][class*="w-"] > span {
    display: inline-block !important;
    text-align: center !important;
    line-height: 1 !important;
  }

  /* Form inputs and select boxes */
  table th select,
  table td select,
  table th input:not([type="checkbox"]):not([type="radio"]):not(.bill-item-qty-input),
  table td input:not([type="checkbox"]):not([type="radio"]):not(.bill-item-qty-input) {
    text-align: left !important;
    text-align-last: left !important;
    margin-left: 0 !important;
    margin-right: auto !important;
  }

  table td .bill-item-qty-input {
    text-align: center !important;
  }

  table th img,
  table th svg,
  table td img,
  table td svg {
    vertical-align: middle !important;
  }

  /* ========================================================================= */
  /* UNIVERSAL TABLE ROW CHECKBOXES (AURELIA REFINED STYLE)                    */
  /* ========================================================================= */
  .btn-bulk-toggle {
    display: none !important;
  }
  th.bulk-cb-cell,
  td.bulk-cb-cell {
    width: 44px !important;
    min-width: 44px !important;
    max-width: 48px !important;
    text-align: center !important;
    vertical-align: middle !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  .bulk-row-cb,
  .bulk-master-cb,
  th.bulk-cb-cell input[type="checkbox"],
  td.bulk-cb-cell input[type="checkbox"] {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    width: 17px !important;
    height: 17px !important;
    min-width: 17px !important;
    min-height: 17px !important;
    border: 1.8px solid #1E293B !important;
    border-radius: 4px !important;
    background-color: #FFFFFF !important;
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    vertical-align: middle !important;
    position: relative !important;
    transition: all 0.15s ease-in-out !important;
    outline: none !important;
    box-sizing: border-box !important;
    margin: 0 auto !important;
  }
  .dark .bulk-row-cb,
  .dark .bulk-master-cb,
  .dark th.bulk-cb-cell input[type="checkbox"],
  .dark td.bulk-cb-cell input[type="checkbox"] {
    border-color: #94A3B8 !important;
    background-color: #1E293B !important;
  }
  .bulk-row-cb:hover,
  .bulk-master-cb:hover,
  th.bulk-cb-cell input[type="checkbox"]:hover,
  td.bulk-cb-cell input[type="checkbox"]:hover {
    border-color: #0F172A !important;
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08) !important;
  }
  .dark .bulk-row-cb:hover,
  .dark .bulk-master-cb:hover,
  .dark th.bulk-cb-cell input[type="checkbox"]:hover,
  .dark td.bulk-cb-cell input[type="checkbox"]:hover {
    border-color: #FCA311 !important;
    box-shadow: 0 0 0 3px rgba(252, 163, 17, 0.15) !important;
  }
  .bulk-row-cb:checked,
  .bulk-master-cb:checked,
  th.bulk-cb-cell input[type="checkbox"]:checked,
  td.bulk-cb-cell input[type="checkbox"]:checked {
    background-color: #14213D !important;
    border-color: #14213D !important;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.5 8.5L6.5 11.5L12.5 4.5'/%3E%3C/svg%3E") !important;
    background-size: 11px 11px !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
  }
  .dark .bulk-row-cb:checked,
  .dark .bulk-master-cb:checked,
  .dark th.bulk-cb-cell input[type="checkbox"]:checked,
  .dark td.bulk-cb-cell input[type="checkbox"]:checked {
    background-color: #FCA311 !important;
    border-color: #FCA311 !important;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' stroke='%2314213D' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.5 8.5L6.5 11.5L12.5 4.5'/%3E%3C/svg%3E") !important;
  }
  .bulk-master-cb:indeterminate,
  th.bulk-cb-cell input[type="checkbox"]:indeterminate {
    background-color: #14213D !important;
    border-color: #14213D !important;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.6' stroke-linecap='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='4' y1='8' x2='12' y2='8'/%3E%3C/svg%3E") !important;
    background-size: 11px 11px !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
  }
  .dark .bulk-master-cb:indeterminate,
  .dark th.bulk-cb-cell input[type="checkbox"]:indeterminate {
    background-color: #FCA311 !important;
    border-color: #FCA311 !important;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' stroke='%2314213D' stroke-width='2.6' stroke-linecap='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='4' y1='8' x2='12' y2='8'/%3E%3C/svg%3E") !important;
  }
  table tbody tr.is-row-selected {
    background-color: rgba(252, 163, 17, 0.10) !important;
  }
  .dark table tbody tr.is-row-selected {
    background-color: rgba(252, 163, 17, 0.15) !important;
  }

  /* ========================================================================= */
  /* GLOBAL LIST TABLE ENGINE: Pure White default, Grey background + Grey shadow on hover */
  /* ========================================================================= */
  #main-app-content .Aurelia-card:has(table),
  #main-app-content .aurelia-card:has(table),
  #main-app-content div:has(> .overflow-x-auto > table),
  #main-app-content div:has(> table),
  section .Aurelia-card:has(table),
  section .aurelia-card:has(table),
  section div:has(> .overflow-x-auto > table),
  section div:has(> table) {
    background: #FFFFFF !important;
    border: 1px solid rgba(226, 232, 240, 0.95) !important;
    box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  /* Modals: Ensure inner content and wrappers never inherit table-card borders, backgrounds or shadows */
  div.fixed.z-50:not(#app-sidebar):not(#toast-container) .space-y-3.5,
  div.fixed.z-50:not(#app-sidebar):not(#toast-container) .space-y-4,
  div[id*="modal"] .space-y-3.5,
  div[id*="modal"] .space-y-4,
  div.fixed.z-50:not(#app-sidebar):not(#toast-container) div:has(> .overflow-x-auto > table):not(.Aurelia-card):not(.aurelia-card),
  div.fixed.z-50:not(#app-sidebar):not(#toast-container) div:has(> table):not(.Aurelia-card):not(.aurelia-card):not(.overflow-x-auto),
  div[id*="modal"] div:has(> .overflow-x-auto > table):not(.Aurelia-card):not(.aurelia-card),
  div[id*="modal"] div:has(> table):not(.Aurelia-card):not(.aurelia-card):not(.overflow-x-auto) {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  /* Table container inside modals */
  div.fixed.z-50:not(#app-sidebar):not(#toast-container) .overflow-x-auto,
  div[id*="modal"] .overflow-x-auto {
    border: 1px solid rgba(226, 232, 240, 0.95) !important;
    border-radius: 0.75rem !important;
    overflow: hidden !important;
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }
  .dark div.fixed.z-50:not(#app-sidebar):not(#toast-container) .overflow-x-auto,
  .dark div[id*="modal"] .overflow-x-auto {
    border-color: #334155 !important;
  }

  #modal-view-order table th,
  #modal-view-order table td,
  #modal-order-items-list table th,
  #modal-order-items-list table td {
    padding-top: 0.625rem !important;
    padding-bottom: 0.625rem !important;
    padding-left: 0.875rem !important;
    padding-right: 0.875rem !important;
  }

  #main-app-content .Aurelia-card:has(table)::before,
  #main-app-content .aurelia-card:has(table)::before,
  #main-app-content div:has(> .overflow-x-auto > table)::before,
  #main-app-content div:has(> table)::before,
  section .Aurelia-card:has(table)::before,
  section .aurelia-card:has(table)::before,
  section div:has(> .overflow-x-auto > table)::before,
  section div:has(> table)::before {
    display: none !important;
    content: none !important;
  }

  table:not(#print-invoice-area table) {
    background-color: #FFFFFF !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
  }

  table:not(#print-invoice-area table) thead tr {
    background-color: #F8FAFC !important;
  }

  table:not(#print-invoice-area table) tbody {
    background-color: transparent !important;
  }

  table:not(#print-invoice-area table) tbody tr {
    position: relative;
    transition: background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  table:not(#print-invoice-area table) tbody tr td {
    transition: background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  /* Alternating Zebra Striping: 1 row light grey, 1 row white */
  table:not(#print-invoice-area table) tbody tr:nth-child(odd),
  table:not(#print-invoice-area table) tbody tr:nth-child(odd) td {
    background-color: #F1F5F9 !important;
  }

  table:not(#print-invoice-area table) tbody tr:nth-child(even),
  table:not(#print-invoice-area table) tbody tr:nth-child(even) td {
    background-color: #FFFFFF !important;
  }

  table:not(#print-invoice-area table) tbody tr:hover {
    box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.16), 0 3px 8px -2px rgba(15, 23, 42, 0.08) !important;
    transform: translateY(-1px);
    z-index: 20;
  }

  table:not(#print-invoice-area table) tbody tr:hover td {
    background-color: #E2E8F0 !important;
    border-color: #CBD5E1 !important;
  }

  /* Retain selection highlight for selected rows */
  table:not(#print-invoice-area table) tbody tr.is-row-selected,
  table:not(#print-invoice-area table) tbody tr.is-row-selected td {
    background-color: rgba(252, 163, 17, 0.12) !important;
  }
  table:not(#print-invoice-area table) tbody tr.is-row-selected:hover,
  table:not(#print-invoice-area table) tbody tr.is-row-selected:hover td {
    background-color: rgba(252, 163, 17, 0.18) !important;
  }

  /* Dark mode overrides for all tables */
  .dark #main-app-content .Aurelia-card:has(table),
  .dark #main-app-content .aurelia-card:has(table),
  .dark #main-app-content div:has(> .overflow-x-auto > table),
  .dark #main-app-content div:has(> table),
  .dark section .Aurelia-card:has(table),
  .dark section .aurelia-card:has(table),
  .dark section div:has(> .overflow-x-auto > table),
  .dark section div:has(> table) {
    background: #0F172A !important;
    border-color: #334155 !important;
  }

  .dark table:not(#print-invoice-area table),
  .dark table:not(#print-invoice-area table) thead tr {
    background-color: #1E293B !important;
  }

  .dark table:not(#print-invoice-area table) tbody {
    background-color: #0F172A !important;
  }

  .dark table:not(#print-invoice-area table) tbody tr:nth-child(odd),
  .dark table:not(#print-invoice-area table) tbody tr:nth-child(odd) td {
    background-color: #131E32 !important;
  }

  .dark table:not(#print-invoice-area table) tbody tr:nth-child(even),
  .dark table:not(#print-invoice-area table) tbody tr:nth-child(even) td {
    background-color: #0F172A !important;
  }

  .dark table:not(#print-invoice-area table) tbody tr:hover td {
    background-color: #1E293B !important;
  }
  .dark table:not(#print-invoice-area table) tbody tr:hover {
    box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.6) !important;
  }

  .dark table:not(#print-invoice-area table) tbody tr.is-row-selected,
  .dark table:not(#print-invoice-area table) tbody tr.is-row-selected td {
    background-color: rgba(252, 163, 17, 0.18) !important;
  }
  .dark table:not(#print-invoice-area table) tbody tr.is-row-selected:hover,
  .dark table:not(#print-invoice-area table) tbody tr.is-row-selected:hover td {
    background-color: rgba(252, 163, 17, 0.25) !important;
  }

  @media print {
    table:not(#print-invoice-area table),
    table:not(#print-invoice-area table) tbody,
    table:not(#print-invoice-area table) tbody tr,
    table:not(#print-invoice-area table) tbody tr td {
      background-color: transparent !important;
      box-shadow: none !important;
      transform: none !important;
    }
  }
  @media print {
    .table-bulk-action-bar,
    th.bulk-cb-cell,
    td.bulk-cb-cell {
      display: none !important;
    }
  }

  /* Universal Table Bulk Action Bar Layout & Spacing */
  .table-bulk-action-bar {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 0.625rem 0.75rem !important;
    box-sizing: border-box !important;
    width: 100% !important;
  }
  .table-bulk-action-bar.hidden {
    display: none !important;
  }
  .table-bulk-action-bar .bulk-count-wrap {
    flex-shrink: 0 !important;
  }

  /* CRITICAL: Mobile drawer stacking context fix.
     Ensures the backdrop sits strictly above the sticky header (z-50) and below the mobile sidebar drawer (z-100),
     blurring everything behind it. When mobile drawer is open, DEV08 badge is hidden completely. */
  #app-dashboard-wrapper {
    z-index: auto !important;
  }
  #mobile-drawer-backdrop {
    z-index: 90 !important;
  }
  @media (max-width: 1023px) {
    #app-sidebar {
      z-index: 100 !important;
      background-color: var(--aurelia-sidebar-bg, #494D5F) !important;
    }
    #btn-sidebar-collapse {
      z-index: 105 !important;
    }
    body.sidebar-open #topbar-device-id-badge,
    body.sidebar-open [id*="device-id-badge"] {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  }
  @media (min-width: 1024px) {
    #app-sidebar {
      z-index: 55 !important;
      background-color: var(--aurelia-sidebar-bg, #494D5F) !important;
    }
    #btn-sidebar-collapse {
      z-index: 60 !important;
    }
  }

  /* Mobile-only font scaling & single-line containment for 2-column Stat/Metric Cards (Active ONLY on <= 639px) */
  @media (max-width: 639px) {
    .grid.grid-cols-2 .Aurelia-card,
    .grid.grid-cols-2 > div.Aurelia-card,
    .grid.grid-cols-2 > .Aurelia-card,
    .grid.grid-cols-2 .finset-card {
      padding: 0.625rem 0.625rem !important;
    }
    .grid.grid-cols-2 .Aurelia-card > div.text-2xl,
    .grid.grid-cols-2 .Aurelia-card > div.text-xl,
    .grid.grid-cols-2 .Aurelia-card div[class*="text-2xl"],
    .grid.grid-cols-2 .Aurelia-card div[class*="text-xl"],
    .grid.grid-cols-2 .finset-card > div.text-2xl,
    .grid.grid-cols-2 .finset-card > div.text-xl {
      font-size: 0.875rem !important;
      line-height: 1.15rem !important;
      font-weight: 800 !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .grid.grid-cols-2 .Aurelia-card > span:first-child,
    .grid.grid-cols-2 .Aurelia-card span[class*="text-[10px]"],
    .grid.grid-cols-2 .Aurelia-card span[class*="text-\\[10px\\]"] {
      font-size: 0.5625rem !important;
      line-height: 0.75rem !important;
      letter-spacing: 0.05em !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .grid.grid-cols-2 .Aurelia-card > span:last-child,
    .grid.grid-cols-2 .Aurelia-card span[class*="text-[11px]"],
    .grid.grid-cols-2 .Aurelia-card span[class*="text-\\[11px\\]"] {
      font-size: 0.625rem !important;
      line-height: 0.85rem !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }

    /* Mobile-only font scaling & single-line containment for Table Card Footers (e.g. Showing X of Y, Standards 2026) */
    .Aurelia-card > div.border-t,
    .aurelia-card > div.border-t,
    div[class*="border-t"][class*="justify-between"] {
      padding: 0.5rem 0.625rem !important;
      font-size: 0.53125rem !important;
      line-height: 0.85rem !important;
      gap: 0.25rem !important;
    }
    .Aurelia-card > div.border-t > span,
    .aurelia-card > div.border-t > span,
    div[class*="border-t"][class*="justify-between"] > span {
      white-space: nowrap !important;
      font-size: 0.53125rem !important;
      line-height: 0.85rem !important;
      flex-shrink: 0 !important;
    }
  }

  /* Ensure all header and modal icon badges are perfect circles and never squished */
  .bg-gradient-to-tr.from-\[\#14213D\].to-\[\#FCA311\],
  div[class*="bg-gradient-to-tr"][class*="from-[#14213D]"] {
    border-radius: 9999px !important;
    aspect-ratio: 1 / 1 !important;
    flex-shrink: 0 !important;
  }
  #btn-sidebar-close-mobile {
    display: none !important;
  }

  /* Protection: Top action buttons (e.g. + New Order, Authorize Batch Payout) strictly stay on a single line */
  #btn-quick-new-order,
  #btn-disburse-batch,
  #btn-download-neft,
  .btn-Aurelia-primary,
  .btn-Aurelia-secondary {
    white-space: nowrap !important;
  }
  #btn-quick-new-order,
  #btn-disburse-batch,
  #btn-download-neft {
    flex-shrink: 0 !important;
  }
  #btn-quick-new-order *,
  #btn-disburse-batch *,
  #btn-download-neft * {
    white-space: nowrap !important;
  }

  /* Spacing for mobile topbar right button (+ New Bill) */
  #app-mobile-header {
    padding-left: 1rem !important;
    padding-right: 1.25rem !important;
  }
  #app-mobile-header .quick-nav-bill,
  #app-mobile-header button:last-child {
    margin-right: 6px !important;
  }
      
  /* ========================================================================= */
  /* UNIVERSAL 3D MAGNIFYING GLASS SEARCH ICON ACROSS ALL SEARCHBARS           */
  /* ========================================================================= */
  input[id*="search" i],
  input[id*="Search"],
  input[placeholder*="search" i],
  input[placeholder*="Search"],
  input[type="search"],
  .aurelia-search-input,
  .Aurelia-search-input.is-searchbar,
  #filter-history-search,
  #filter-customers-search,
  #food-budget-search-input,
  #modal-billings-search,
  #modal-staff-search,
  #modal-dept-search,
  #modal-devices-search,
  #input-al-search,
  #input-ar-search,
  #input-ds-search,
  #input-page-staff-search,
  #input-holiday-search,
  #input-la-search,
  #input-emp-leave-search,
  #input-ms-search {
    background-image: url("data:image/png;base64,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") !important;
    background-repeat: no-repeat !important;
    background-position: 12px center !important;
    background-size: 18px 18px !important;
    padding-left: 38px !important;
  }

  input[id*="search" i]:focus,
  input[id*="Search"]:focus,
  input[placeholder*="search" i]:focus,
  input[placeholder*="Search"]:focus,
  input[type="search"]:focus,
  .aurelia-search-input:focus,
  .Aurelia-search-input.is-searchbar:focus,
  #filter-history-search:focus,
  #filter-customers-search:focus,
  #food-budget-search-input:focus,
  #modal-billings-search:focus,
  #modal-staff-search:focus,
  #modal-dept-search:focus,
  #modal-devices-search:focus,
  #input-al-search:focus,
  #input-ar-search:focus,
  #input-ds-search:focus,
  #input-page-staff-search:focus,
  #input-holiday-search:focus,
  #input-la-search:focus,
  #input-emp-leave-search:focus,
  #input-ms-search:focus {
    background-image: url("data:image/png;base64,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") !important;
    background-repeat: no-repeat !important;
    background-position: 12px center !important;
    background-size: 18px 18px !important;
    padding-left: 38px !important;
  }

  /* Hide legacy wireframe SVG search icons in searchbar wrappers */
  div:has(> input[id*="search" i]) > svg,
  div:has(> input[id*="Search"]) > svg,
  div:has(> input[placeholder*="search" i]) > svg,
  div:has(> input[placeholder*="Search"]) > svg,
  div:has(> input[type="search"]) > svg,
  .relative:has(> input[id*="search" i]) > svg,
  .relative:has(> input[id*="Search"]) > svg,
  .relative:has(> input[placeholder*="search" i]) > svg,
  .relative:has(> input[placeholder*="Search"]) > svg,
  .relative:has(> input[type="search"]) > svg,
  span:has(> input[id*="search" i]) > svg,
  span:has(> input[placeholder*="search" i]) > svg,
  .aurelia-search-wrapper > svg {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

</style>
    `);
  }

  // Global Chart.js Instances
  let moneyFlowChart = null;
  let budgetDoughnutChart = null;

  // Active Draft State
  let currentBillItems = [];
  let currentOrderItems = [];
  let currentDiscountType = 'percent';
  let activeCurrency = 'INR';
  localStorage.setItem('finset_currency', 'INR');
  let pendingDeleteCallback = null;

  // =========================================================================
  // 1. LOCAL STORAGE HELPERS & SAMPLE DATA SEEDING
  // =========================================================================

  const STORAGE_KEYS = {
    BILLS: 'finset_hotel_bills_v26',
    ORDERS: 'finset_hotel_orders_v26',
    MENU: 'finset_hotel_menu_v26',
    CUSTOMERS: 'finset_hotel_customers_v26',
    CATEGORIES: 'finset_hotel_categories_v26',
    STAFF: 'finset_hotel_staff_v26',
    INITIALIZED: 'finset_hotel_init_v26',
    PENDING_ORDER_BILL: 'finset_pending_order_bill_v26'
  };

  const Storage = {
    get(key, fallback = []) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
      } catch (e) {
        console.error('Storage Read Error for key:', key, e);
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Storage Write Error for key:', key, e);
      }
    },
    remove(key) {
      localStorage.removeItem(key);
    }
  };

  const DEFAULT_CATEGORIES = [
    'Starters',
    'Main Course',
    'Breads',
    'Rice and Biryani',
    'Desserts',
    'Beverages',
    'Room Service'
  ];

  const DEFAULT_MENU_ITEMS = [
    ['item-1', 'Paneer Butter Masala', 'Main Course', 16.50, true, 'Fresh cottage cheese in rich tomato butter gravy'],
    ['item-2', 'Dal Makhani', 'Main Course', 12.00, true, 'Slow-cooked black lentils with fresh cream'],
    ['item-3', 'Chicken Tikka Masala', 'Main Course', 18.50, true, 'Charcoal-grilled chicken chunks in spiced gravy'],
    ['item-4', 'Mutton Rogan Josh', 'Main Course', 22.00, true, 'Traditional Kashmiri aromatic slow-cooked lamb'],
    ['item-5', 'Kadai Paneer', 'Main Course', 15.00, true, 'Bell peppers and cottage cheese with crushed spices'],
    ['item-6', 'Butter Chicken Grand Style', 'Main Course', 19.50, true, 'Signature mild tandoori chicken simmered in makhani sauce'],
    ['item-7', 'Paneer Tikka Angara', 'Starters', 14.00, true, 'Clay oven roasted spiced cottage cheese skewers'],
    ['item-8', 'Chicken 65 Hyderabadi', 'Starters', 15.50, true, 'Crispy tempered fried chicken with curry leaves'],
    ['item-9', 'Hara Bhara Kabab', 'Starters', 11.50, true, 'Spinach and green pea patties shallow fried'],
    ['item-10', 'Crispy Corn Pepper Salt', 'Starters', 10.50, true, 'Golden fried sweet corn tossed with scallions'],
    ['item-11', 'Tandoori Chicken Half', 'Starters', 17.00, false, 'Spiced yogurt marinated bone-in chicken'],
    ['item-12', 'Butter Naan', 'Breads', 3.50, true, 'Tandoori leavened flatbread brushed with butter'],
    ['item-13', 'Garlic Naan', 'Breads', 4.50, true, 'Leavened bread topped with minced roasted garlic'],
    ['item-14', 'Tandoori Roti', 'Breads', 2.50, true, 'Whole wheat flatbread baked in clay oven'],
    ['item-15', 'Lachha Paratha', 'Breads', 4.00, true, 'Multi-layered flaky whole wheat bread'],
    ['item-16', 'Hyderabadi Chicken Dum Biryani', 'Rice and Biryani', 19.00, true, 'Fragrant basmati rice layered with spiced chicken and saffron'],
    ['item-17', 'Royal Veg Dum Biryani', 'Rice and Biryani', 14.50, true, 'Assorted vegetables cooked on dum with aromatic herbs'],
    ['item-18', 'Mutton Gosht Biryani', 'Rice and Biryani', 23.50, true, 'Tender lamb cuts infused with aged long-grain basmati'],
    ['item-19', 'Jeera Basmati Rice', 'Rice and Biryani', 8.50, true, 'Cumin tempered steamed fragrant basmati rice'],
    ['item-20', 'Gulab Jamun with Rabri', 'Desserts', 7.50, true, 'Warm milk dumplings soaked in cardamom sugar syrup'],
    ['item-21', 'Kesar Rasmalai (2 Pcs)', 'Desserts', 8.00, true, 'Spongy cottage cheese patties in saffron clotted milk'],
    ['item-22', 'Shahi Matka Kulfi', 'Desserts', 6.50, true, 'Traditional condensed milk ice cream with pistachios'],
    ['item-23', 'South Indian Filter Coffee', 'Beverages', 4.00, true, 'Freshly brewed chicory coffee with frothy hot milk'],
    ['item-24', 'Masala Chai Pot', 'Beverages', 3.50, true, 'Assam tea simmered with fresh ginger and green cardamom'],
    ['item-25', 'Fresh Lime Soda', 'Beverages', 4.50, true, 'Chilled sparkling limeade with rock salt'],
    ['item-26', 'Mango Lassi', 'Beverages', 6.00, true, 'Thick yogurt shake blended with Alphonso pulp'],
    ['item-27', 'Executive Club Sandwich', 'Room Service', 13.50, true, 'Triple decker toast with grilled chicken, egg and cheese'],
    ['item-28', 'Continental Breakfast Tray', 'Room Service', 18.00, true, 'Croissant, toast, preserves, fresh juice and coffee']
  ].map(([id, name, category, price, available, description]) => ({ id, name, category, price, available, description }));

  const DEFAULT_CUSTOMERS = [
    ['cust-1', 'Rajesh Sharma', '9845012345', 'rajesh.sharma@gmail.com', 'Koramangala 4th Block, Bengaluru', 12, 840.00],
    ['cust-2', 'Priya Sundaram', '9886167890', 'priya.sundaram@outlook.com', 'Indiranagar 100ft Road, Bengaluru', 8, 520.00],
    ['cust-3', 'Vikramaditya Reddy', '9741234567', 'vikram.reddy@techcorp.in', 'Whitefield EPIP Zone, Bengaluru', 15, 1140.00],
    ['cust-4', 'Ananya Deshmukh', '9900298765', 'ananya.d@gmail.com', 'HSR Layout Sector 2, Bengaluru', 6, 390.00],
    ['cust-5', 'Amit Patel', '9823045678', 'amit.patel@zenith.com', 'Jayanagar 4th T Block, Bengaluru', 9, 680.00],
    ['cust-6', 'Sunita Kulkarni', '9448123409', 'sunita.k@gmail.com', 'Malleshwaram 15th Cross, Bengaluru', 5, 310.00]
  ].map(([id, name, phone, email, address, visits, totalSpend]) => ({ id, name, phone, email, address, visits, totalSpend }));

  const makeOrder = (id, customerName, customerPhone, tableRoom, status, timestamp, notes, items, billNumber = null) => ({
    id, orderNumber: id, customerName, customerPhone, tableRoom, status, timestamp, notes, billNumber, items
  });

  const DEFAULT_ORDERS = [
    makeOrder('ORD-0089', 'Rohan Mehta', '9845123490', 'Table 2', 'Pending', '2026-10-27T11:20:00', 'Serve starters first, medium spice level', [
      { id: 'item-7', name: 'Paneer Tikka Angara', price: 14.00, qty: 2 },
      { id: 'item-13', name: 'Garlic Naan', price: 4.50, qty: 3 },
      { id: 'item-25', name: 'Fresh Lime Soda', price: 4.50, qty: 2 }
    ]),
    makeOrder('ORD-0088', 'Meera Nair', '9886234510', 'Suite 402', 'Preparing', '2026-10-27T11:05:00', 'Extra raita on the side for room service', [
      { id: 'item-18', name: 'Mutton Gosht Biryani', price: 23.50, qty: 1 },
      { id: 'item-9', name: 'Hara Bhara Kabab', price: 11.50, qty: 1 },
      { id: 'item-24', name: 'Masala Chai Pot', price: 3.50, qty: 2 }
    ]),
    makeOrder('ORD-0087', 'Karan Malhotra', '9741998877', 'Table 9', 'Served', '2026-10-27T10:50:00', 'No onions in Kadai Paneer', [
      { id: 'item-5', name: 'Kadai Paneer', price: 15.00, qty: 2 },
      { id: 'item-15', name: 'Lachha Paratha', price: 4.00, qty: 4 },
      { id: 'item-20', name: 'Gulab Jamun with Rabri', price: 7.50, qty: 2 }
    ]),
    makeOrder('ORD-0086', 'Priya Sundaram', '9886167890', 'Room 204', 'Pending', '2026-10-27T10:35:00', 'Deliver hot to Deluxe Room 204', [
      { id: 'item-27', name: 'Executive Club Sandwich', price: 13.50, qty: 2 },
      { id: 'item-23', name: 'South Indian Filter Coffee', price: 4.00, qty: 2 }
    ]),
    makeOrder('ORD-0085', 'Siddharth Rao', '9900445566', 'Table 11', 'Cancelled', '2026-10-27T10:20:00', 'Guest rescheduled dinner reservation to evening', [
      { id: 'item-3', name: 'Chicken Tikka Masala', price: 18.50, qty: 1 },
      { id: 'item-12', name: 'Butter Naan', price: 3.50, qty: 3 }
    ]),
    makeOrder('ORD-0084', 'Amit Patel', '9823045678', 'Table 5', 'Served', '2026-10-27T10:15:00', 'Extra chutney with starters', [
      { id: 'item-10', name: 'Crispy Corn Pepper Salt', price: 10.50, qty: 2 },
      { id: 'item-17', name: 'Royal Veg Dum Biryani', price: 14.50, qty: 2 },
      { id: 'item-21', name: 'Kesar Rasmalai (2 Pcs)', price: 8.00, qty: 2 }
    ]),
    makeOrder('ORD-0083', 'Sunita Kulkarni', '9448123409', 'Suite 301', 'Completed', '2026-10-27T10:10:00', 'Settled to room folio invoice', [
      { id: 'item-6', name: 'Butter Chicken Grand Style', price: 19.50, qty: 1 },
      { id: 'item-19', name: 'Jeera Basmati Rice', price: 8.50, qty: 1 },
      { id: 'item-22', name: 'Shahi Matka Kulfi', price: 6.50, qty: 2 }
    ], 'INV-2026-0141'),
    makeOrder('ORD-0082', 'Vikramaditya Reddy', '9741234567', 'Room 304', 'Preparing', '2026-10-27T10:05:00', 'Serve warm with lime wedges and onion rings', [
      { id: 'item-16', name: 'Hyderabadi Chicken Dum Biryani', price: 19.00, qty: 2 },
      { id: 'item-26', name: 'Mango Lassi', price: 6.00, qty: 2 }
    ]),
    makeOrder('ORD-0081', 'Rajesh Sharma', '9845012345', 'Table 4', 'Pending', '2026-10-27T09:45:00', 'Less oil in Dal Makhani, extra butter on naan', [
      { id: 'item-2', name: 'Dal Makhani', price: 12.00, qty: 1 },
      { id: 'item-1', name: 'Paneer Butter Masala', price: 16.50, qty: 1 },
      { id: 'item-12', name: 'Butter Naan', price: 3.50, qty: 4 }
    ]),
    makeOrder('ORD-0080', 'Ananya Deshmukh', '9900298765', 'Table 7', 'Completed', '2026-10-27T08:20:00', 'Table cleared, invoice settled via UPI', [
      { id: 'item-28', name: 'Continental Breakfast Tray', price: 18.00, qty: 2 },
      { id: 'item-23', name: 'South Indian Filter Coffee', price: 4.00, qty: 2 }
    ], 'INV-2026-0140')
  ];

  const makeBill = (id, billNumber, date, customerName, customerPhone, customerEmail, customerAddress, tableRoom, paymentMethod, subtotal, taxAmount, grandTotal, items, linkedOrderId = null) => ({
    id, billNumber, date, customerName, customerPhone, customerEmail, customerAddress, tableRoom, paymentMethod,
    status: 'Paid', linkedOrderId, taxRate: 5, discountType: 'flat', discountVal: 0, discountAmount: 0.00,
    subtotal, taxAmount, grandTotal, items
  });

  const DEFAULT_BILLS = [
    makeBill('bill-142', 'INV-2026-0142', '2026-10-27T10:10:00', 'Vikramaditya Reddy', '+91 97412 34567', 'vikram.reddy@gmail.com', 'Whitefield EPIP Zone, Bengaluru', 'Presidential Suite 501', 'UPI', 34000.00, 1700.00, 35700.00, [
      { name: 'Presidential Suite Luxury Stay (2 Nights)', category: 'Room Service', price: 15000.00, qty: 2, subtotal: 30000.00 },
      { name: 'In-Suite Candlelight Dining Experience', category: 'Main Course', price: 4000.00, qty: 1, subtotal: 4000.00 }
    ]),
    makeBill('bill-141', 'INV-2026-0141', '2026-10-27T09:15:00', 'Priya Sundaram', '+91 98861 67890', 'priya.sundaram@infosys.com', 'Indiranagar 100ft Road, Bengaluru', 'Deluxe Room 204', 'Card', 27095.24, 1354.76, 28450.00, [
      { name: 'Deluxe Garden View Room (3 Nights)', category: 'Room Service', price: 7500.00, qty: 3, subtotal: 22500.00 },
      { name: 'Aurelia Ayurvedic Spa Therapy & Hydro', category: 'Beverages', price: 4595.24, qty: 1, subtotal: 4595.24 }
    ]),
    makeBill('bill-140', 'INV-2026-0140', '2026-10-26T21:45:00', 'Tech Mahindra Corporate', '+91 99002 98765', 'events@techmahindra.com', 'Electronic City Phase 1, Bengaluru', 'Imperial Banquet Hall', 'Card', 40571.43, 2028.57, 42600.00, [
      { name: 'Corporate Dinner Banquet Buffet (25 Pax)', category: 'Main Course', price: 1400.00, qty: 25, subtotal: 35000.00 },
      { name: 'Audio-Visual Rigging & Live Mocktail Bar', category: 'Beverages', price: 5571.43, qty: 1, subtotal: 5571.43 }
    ]),
    makeBill('bill-139', 'INV-2026-0139', '2026-10-26T14:30:00', 'Rajesh Sharma', '+91 98450 12345', 'rajesh.sharma@tcs.com', 'Koramangala 4th Block, Bengaluru', 'Executive Suite 302', 'UPI', 18000.00, 900.00, 18900.00, [
      { name: 'Executive Club Suite (1 Night)', category: 'Room Service', price: 14500.00, qty: 1, subtotal: 14500.00 },
      { name: 'Aurelia Lounge Bar & Signature Drinks', category: 'Beverages', price: 3500.00, qty: 1, subtotal: 3500.00 }
    ]),
    makeBill('bill-138', 'INV-2026-0138', '2026-10-25T20:15:00', 'Ananya Deshmukh', '+91 98201 54321', 'ananya.d@gmail.com', 'HSR Layout Sector 2, Bengaluru', 'Table 8 (Fine Dining)', 'UPI', 8047.62, 402.38, 8450.00, [
      { name: 'Royal Nawabi Dinner Thali (4 Pax)', category: 'Main Course', price: 1300.00, qty: 4, subtotal: 5200.00 },
      { name: 'Grilled Tiger Prawns Angara', category: 'Starters', price: 923.81, qty: 2, subtotal: 1847.62 },
      { name: 'Kesar Rasmalai & Pistachio Kulfi Platter', category: 'Desserts', price: 500.00, qty: 2, subtotal: 1000.00 }
    ], 'ORD-0080'),
    makeBill('bill-137', 'INV-2026-0137', '2026-10-25T11:20:00', 'Arjun Kapoor', '+91 97110 88234', 'arjun.k@outlook.com', 'Lavelle Road, Bengaluru', 'Premium King 410', 'Card', 12619.05, 630.95, 13250.00, [
      { name: 'Premium King Room (1 Night)', category: 'Room Service', price: 10500.00, qty: 1, subtotal: 10500.00 },
      { name: 'Airport Luxury Chauffeur Transfer & Mini Bar', category: 'Beverages', price: 2119.05, qty: 1, subtotal: 2119.05 }
    ]),
    makeBill('bill-136', 'INV-2026-0136', '2026-10-24T18:00:00', 'Dr. Meera Nambiar', '+91 94481 22901', 'meera.nambiar@manipal.edu', 'Sadashivanagar, Bengaluru', 'Wellness Suite 108', 'Cash', 9263.99, 463.20, 9727.19, [
      { name: 'Wellness Rejuvenation Session & Aroma Therapy', category: 'Starters', price: 6500.00, qty: 1, subtotal: 6500.00 },
      { name: 'Organic Cold-Pressed Juices & Healthy Dining', category: 'Beverages', price: 2763.99, qty: 1, subtotal: 2763.99 }
    ])
  ];

  const DEFAULT_STAFF = [
    ["Adaline Lively", "Front Desk Supervisor", "Front Office", "Main Reception Desk 01", "Morning (07:00 - 15:30)", "On Duty", null, "adaline.l@aureliahotel.com"],
    ["Vikram Malhotra", "Senior Concierge", "Front Office", "Concierge Lounge", "Morning (08:00 - 16:30)", "On Duty", null, "vikram.m@aureliahotel.com"],
    ["Priyanka Sharma", "Guest Relations Officer", "Front Office", "Executive Club Lounge", "Day (09:00 - 17:30)", "On Duty", null, "priyanka.s@aureliahotel.com"],
    ["Rohan Desai", "Night Auditor", "Front Office", "Front Office Back-Desk", "Night (23:00 - 07:30)", "On Duty", null, "rohan.d@aureliahotel.com"],
    ["Ananya Sen", "Front Desk Agent", "Front Office", "Reception Desk 02", "Afternoon (14:00 - 22:30)", "On Duty", null, "ananya.s@aureliahotel.com"],
    ["Sameer Joshi", "Bell Captain & Porter", "Front Office", "Main Portico / Lobby", "Morning (07:00 - 15:30)", "On Duty", null, "sameer.j@aureliahotel.com"],
    ["Neha Pillai", "VIP Reservations Executive", "Front Office", "Front Office Suite", "Day (09:30 - 18:00)", "On Duty", null, "neha.p@aureliahotel.com"],
    ["Tanvi Agarwal", "Front Desk Agent", "Front Office", "Reception Desk 03", "Off-duty", "On Leave", "Casual Leave", "tanvi.a@aureliahotel.com"],
    ["Chef Rajesh Kulkarni", "Executive Chef", "Culinary & Kitchen", "Master Kitchen Central", "Day (09:00 - 18:00)", "On Duty", null, "chef.rajesh@aureliahotel.com"],
    ["Tariq Mansoor", "Sous Chef", "Culinary & Kitchen", "Hot Line & Saute", "Morning (06:30 - 15:00)", "On Duty", null, "tariq.m@aureliahotel.com"],
    ["Meenakshi Sundaram", "Head Pastry Chef", "Culinary & Kitchen", "Bakery & Confectionery", "Morning (06:00 - 14:30)", "On Duty", null, "meenakshi.s@aureliahotel.com"],
    ["Amitava Roy", "Tandoor Master Chef", "Culinary & Kitchen", "Live Charcoal Tandoor", "Evening (15:00 - 23:30)", "On Duty", null, "amitava.r@aureliahotel.com"],
    ["Gurpreet Singh", "Continental Line Cook", "Culinary & Kitchen", "Continental Range 02", "Morning (07:00 - 15:30)", "On Duty", null, "gurpreet.s@aureliahotel.com"],
    ["Farhan Qureshi", "Dum & Biryani Specialist", "Culinary & Kitchen", "Dum Biryani Hearth", "Afternoon (12:00 - 20:30)", "On Duty", null, "farhan.q@aureliahotel.com"],
    ["David D'Souza", "Kitchen Pantry Lead", "Culinary & Kitchen", "Cold Kitchen & Larder", "Morning (07:00 - 15:30)", "On Duty", null, "david.d@aureliahotel.com"],
    ["Ramesh Goud", "Prep Chef & Butchery", "Culinary & Kitchen", "Meat & Seafood Prep", "Morning (06:00 - 14:30)", "On Duty", null, "ramesh.g@aureliahotel.com"],
    ["Sumanth Rao", "Commis Chef III", "Culinary & Kitchen", "Banquet Prep Station", "Afternoon (13:00 - 21:30)", "On Duty", null, "sumanth.r@aureliahotel.com"],
    ["Prakash Shenoy", "Chief Kitchen Steward", "Culinary & Kitchen", "Dishwashing & Sanitation", "Day (08:00 - 17:00)", "On Duty", null, "prakash.s@aureliahotel.com"],
    ["Joseph Kurian", "South Indian Cuisine Lead", "Culinary & Kitchen", "Breakfast Live Counter", "Off-duty", "On Leave", "Annual Leave", "joseph.k@aureliahotel.com"],
    ["Baldev Yadav", "Grill Line Cook", "Culinary & Kitchen", "Robata & Skewers", "Off-duty", "On Leave", "Sick Leave", "baldev.y@aureliahotel.com"],
    ["Kevin Peterson", "F&B Service Manager", "Food & Beverage", "Main Dining Hall", "Day (10:00 - 19:00)", "On Duty", null, "kevin.p@aureliahotel.com"],
    ["Suresh Nair", "Head Bartender & Mixologist", "Food & Beverage", "Aurelia Bar & Lounge", "Evening (16:00 - 00:30)", "On Duty", null, "suresh.n@aureliahotel.com"],
    ["Aarti Menon", "Senior Restaurant Captain", "Food & Beverage", "Fine Dining Section A", "Afternoon (13:00 - 21:30)", "On Duty", null, "aarti.m@aureliahotel.com"],
    ["Karthik Reddy", "Senior Banquet Steward", "Food & Beverage", "Ballroom Banquet Hall", "Morning (07:00 - 15:30)", "On Duty", null, "karthik.r@aureliahotel.com"],
    ["Pooja Hegde", "Restaurant Hostess", "Food & Beverage", "Restaurant Welcome Desk", "Morning (08:00 - 16:30)", "On Duty", null, "pooja.h@aureliahotel.com"],
    ["Nikhil Varma", "In-Room Dining Lead", "Food & Beverage", "Room Service Dispatch", "Evening (15:00 - 23:30)", "On Duty", null, "nikhil.v@aureliahotel.com"],
    ["Deepa Swaminathan", "Sommelier & Wine Steward", "Food & Beverage", "Wine Cellar & Bar", "Evening (17:00 - 01:00)", "On Duty", null, "deepa.s@aureliahotel.com"],
    ["Imran Baig", "Lead Barista", "Food & Beverage", "Cafe & Bakery Counter", "Morning (06:30 - 15:00)", "On Duty", null, "imran.b@aureliahotel.com"],
    ["Abhishek Das", "Banquet Captain", "Food & Beverage", "Conference Center", "Day (09:00 - 18:00)", "On Duty", null, "abhishek.d@aureliahotel.com"],
    ["Simran Kaur", "Senior Table Server", "Food & Beverage", "Terrace Garden Dining", "Afternoon (14:00 - 22:30)", "On Duty", null, "simran.k@aureliahotel.com"],
    ["Rahul Chauhan", "Food Expeditor", "Food & Beverage", "Kitchen Pass & Service", "Morning (07:00 - 15:30)", "On Duty", null, "rahul.c@aureliahotel.com"],
    ["Manoj Tiwari", "Dining Room Steward", "Food & Beverage", "Poolside Deck Dining", "Off-duty", "On Leave", "Weekly Off", "manoj.t@aureliahotel.com"],
    ["Shanti Bai", "Executive Housekeeper", "Housekeeping", "Housekeeping Control Desk", "Day (08:00 - 17:00)", "On Duty", null, "shanti.b@aureliahotel.com"],
    ["Lakshmi Devi", "Floor Supervisor (Floors 2 & 3)", "Housekeeping", "2nd Floor Linen Hub", "Morning (07:30 - 16:00)", "On Duty", null, "lakshmi.d@aureliahotel.com"],
    ["Mohanlal Gujjar", "Laundry & Dry-Clean Master", "Housekeeping", "Industrial Laundry Plant", "Day (08:00 - 16:30)", "On Duty", null, "mohanlal.g@aureliahotel.com"],
    ["Rekha Das", "Senior Room Attendant", "Housekeeping", "Executive Suites Floor 4", "Morning (08:00 - 16:30)", "On Duty", null, "rekha.d@aureliahotel.com"],
    ["Sunil Paswan", "Public Area Lead", "Housekeeping", "Main Lobby & Atrium", "Morning (07:00 - 15:30)", "On Duty", null, "sunil.p@aureliahotel.com"],
    ["Geeta Soren", "Room Amenities Attendant", "Housekeeping", "Linen & Amenity Stock", "Day (09:00 - 17:30)", "On Duty", null, "geeta.s@aureliahotel.com"],
    ["Harish Chandra", "Linen Runner", "Housekeeping", "Service Elevators & Hubs", "Afternoon (13:00 - 21:30)", "On Duty", null, "harish.c@aureliahotel.com"],
    ["Mary Fernandez", "Deluxe Rooms Attendant", "Housekeeping", "Deluxe Wing Floor 1", "Morning (08:00 - 16:30)", "On Duty", null, "mary.f@aureliahotel.com"],
    ["Basavaraj Patil", "Deep Cleaning Specialist", "Housekeeping", "Banquet & Spa Floors", "Day (08:30 - 17:00)", "On Duty", null, "basavaraj.p@aureliahotel.com"],
    ["Savita More", "Room Attendant", "Housekeeping", "Standard Wing Floor 1", "Off-duty", "On Leave", "Medical Leave", "savita.m@aureliahotel.com"],
    ["Girish Sharma", "Chief Facility Engineer", "Engineering & Maintenance", "Engineering Control Room", "Day (08:30 - 17:30)", "On Duty", null, "girish.s@aureliahotel.com"],
    ["Jagdish Mhatre", "HVAC & Chiller Specialist", "Engineering & Maintenance", "Central Plant Room", "Morning (07:00 - 15:30)", "On Duty", null, "jagdish.m@aureliahotel.com"],
    ["Venkat Raman", "Duty Electrician & DG Set", "Engineering & Maintenance", "Electrical Substation", "Evening (15:00 - 23:30)", "On Duty", null, "venkat.r@aureliahotel.com"],
    ["Santosh Kumar", "Lead Plumber & RO Systems", "Engineering & Maintenance", "Water Treatment Facility", "Off-duty", "On Leave", "Emergency Leave", "santosh.k@aureliahotel.com"],
    ["Capt. R. S. Rathore", "Head of Hotel Security", "Security & Operations", "Security Command Center", "Day (08:00 - 17:00)", "On Duty", null, "security.head@aureliahotel.com"],
    ["Dharmender Singh", "CCTV Surveillance Lead", "Security & Operations", "CCTV Monitoring Room", "Rotation (07:00 - 19:00)", "On Duty", null, "dharmender.s@aureliahotel.com"]
  ].map(([name, role, department, station, shift, status, leaveReason, email], i) => ({
    id: `EMP-2026-${String(i + 1).padStart(2, "0")}`,
    name, role, department, station, shift, status, leaveReason,
    phone: `+91 98450 112${String(i + 1).padStart(2, "0")}`,
    email
  }));

  function initializeSampleData(force = false) {
    const existingBills = Storage.get(STORAGE_KEYS.BILLS, []);
    const existingTotal = (existingBills || []).reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    const needsBillsUpgrade = !existingBills.length || existingTotal < 1000;

    if (force || !localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      Storage.set(STORAGE_KEYS.MENU, DEFAULT_MENU_ITEMS);
      Storage.set(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
      Storage.set(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
      Storage.set(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
      Storage.set(STORAGE_KEYS.BILLS, DEFAULT_BILLS);
      Storage.set(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } else {
      if (needsBillsUpgrade) {
        Storage.set(STORAGE_KEYS.BILLS, DEFAULT_BILLS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
        Storage.set(STORAGE_KEYS.STAFF, DEFAULT_STAFF);
      }
      if (!localStorage.getItem('aurelia_bills_draft_seed_v1')) {
        const storedBills = Storage.get(STORAGE_KEYS.BILLS, []);
        const hasDraft = storedBills.some(b => (b.status || '').toLowerCase() === 'draft');
        if (!hasDraft && storedBills.length > 0) {
          storedBills.push({
            id: 'bill-draft-sample',
            billNumber: 'INV-2026-0135',
            date: '2026-10-24T14:15:00',
            customerName: 'Siddharth Rao',
            customerPhone: '+91 98800 11223',
            customerEmail: 'siddharth.r@techcorp.in',
            customerAddress: 'Indiranagar, Bengaluru',
            tableRoom: 'Table 12',
            paymentMethod: 'Unpaid',
            status: 'Draft',
            emailSent: false,
            linkedOrderId: null,
            taxRate: 5,
            discountType: 'flat',
            discountVal: 0,
            discountAmount: 0.00,
            subtotal: 4200.00,
            taxAmount: 210.00,
            grandTotal: 4410.00,
            items: [
              { name: 'Tandoori Murgh Platter', category: 'Starters', price: 1800.00, qty: 1, subtotal: 1800.00 },
              { name: 'Dal Bukhara & Garlic Naan (2 Pax)', category: 'Main Course', price: 2400.00, qty: 1, subtotal: 2400.00 }
            ]
          });
          Storage.set(STORAGE_KEYS.BILLS, storedBills);
        }
        localStorage.setItem('aurelia_bills_draft_seed_v1', 'true');
      }
      if (!Storage.get(STORAGE_KEYS.MENU, []).length) {
        Storage.set(STORAGE_KEYS.MENU, DEFAULT_MENU_ITEMS);
      }
      const storedOrders = Storage.get(STORAGE_KEYS.ORDERS, []);
      if (!storedOrders.length) {
        Storage.set(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
      } else if (!localStorage.getItem('finset_orders_seed_v31')) {
        const existingIds = new Set(storedOrders.map(o => o.id));
        const missingDefaults = DEFAULT_ORDERS.filter(o => !existingIds.has(o.id));
        if (missingDefaults.length) {
          Storage.set(STORAGE_KEYS.ORDERS, [...storedOrders, ...missingDefaults]);
        }
        localStorage.setItem('finset_orders_seed_v31', 'true');
      }
      if (!Storage.get(STORAGE_KEYS.CUSTOMERS, []).length) {
        Storage.set(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
      }
    }
  }

  initializeSampleData(false);

  // =========================================================================
  // 2. CURRENCY & LOCALE FORMATTING (Default ₹ INR)
  // =========================================================================

  function formatMoney(amount) {
    const val = Number(amount) || 0;
    return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Alias for backward compatibility
  window.formatINR = formatMoney;

  // =========================================================================
  // ANIMATED NUMBER SCROLLER / ODOMETER DIGIT REEL ENGINE
  // =========================================================================

  function animateNumber(selector, targetVal, options = {}) {
    const $els = $(selector);
    if (!$els.length) return;

    const target = Number(targetVal) || 0;
    const duration = options.duration !== undefined ? options.duration : 1150;
    const delay = options.delay || 0;
    const decimals = options.decimals !== undefined ? options.decimals : 0;
    const prefix = options.prefix || '';
    const suffix = options.suffix || '';
    const decimalClass = options.decimalClass || '';
    const suffixClass = options.suffixClass || '';
    const useLocale = options.useLocale !== false;
    const stagger = options.stagger !== undefined ? options.stagger : 35;
    const rollAnim = options.rollAnim !== false;

    $els.each(function () {
      const el = this;

      // Prevent re-triggering rolling odometer animation if value has not changed
      // (stops badges and stats from fluctuating / spinning on every button click)
      if (el._currentCountVal !== undefined && el._currentCountVal === target && el.innerHTML.trim() !== '') {
        return;
      }

      if (el._countAnimRaf) {
        cancelAnimationFrame(el._countAnimRaf);
        el._countAnimRaf = null;
      }
      if (el._countDelayTimer) {
        clearTimeout(el._countDelayTimer);
        el._countDelayTimer = null;
      }

      function startAnimation() {
        if (el.tagName === 'INPUT') {
          el.value = (decimals > 0 ? target.toFixed(decimals) : Math.round(target));
          return;
        }

        const isNegative = target < 0;
        const absVal = Math.abs(target);
        let numStr = decimals > 0 ? absVal.toFixed(decimals) : Math.round(absVal).toString();

        let intStr = '';
        let decStr = '';

        if (decimals > 0) {
          const parts = numStr.split('.');
          const intPart = parseInt(parts[0], 10) || 0;
          intStr = useLocale ? intPart.toLocaleString('en-IN') : intPart.toString();
          decStr = parts[1] || '';
        } else {
          const intPart = parseInt(numStr, 10) || 0;
          intStr = useLocale ? intPart.toLocaleString('en-IN') : intPart.toString();
        }

        const sign = isNegative ? '-' : '';
        const fullLabel = `${sign}${prefix}${intStr}${decStr ? '.' + decStr : ''}${suffix}`;

        if (!rollAnim) {
          el.innerHTML = fullLabel;
          el._currentCountVal = target;
          return;
        }

        // Build rolling digit reel columns
        let html = `<span class="num-scroller-wrap" aria-label="${escapeHtml(fullLabel)}">`;

        if (sign) {
          html += `<span class="num-scroller-static">${sign}</span>`;
        }
        if (prefix) {
          const isRupee = prefix.includes('₹');
          const prefixClass = isRupee ? 'num-scroller-static num-currency-rupee' : 'num-scroller-static';
          html += `<span class="${prefixClass}">${prefix}</span>`;
        }

        // Integer digits & separators
        for (let i = 0; i < intStr.length; i++) {
          const ch = intStr[i];
          if (ch >= '0' && ch <= '9') {
            const d = parseInt(ch, 10);
            html += `<span class="num-scroller-col" data-digit="${d}"><span class="num-scroller-strip">`;
            for (let c = 0; c < 2; c++) {
              for (let n = 0; n <= 9; n++) {
                html += `<span class="num-scroller-digit">${n}</span>`;
              }
            }
            html += `</span></span>`;
          } else {
            html += `<span class="num-scroller-static">${ch}</span>`;
          }
        }

        // Decimal point & decimal digits
        if (decimals > 0 && decStr) {
          html += `<span class="num-scroller-static ${decimalClass}">.</span>`;
          for (let i = 0; i < decStr.length; i++) {
            const ch = decStr[i];
            if (ch >= '0' && ch <= '9') {
              const d = parseInt(ch, 10);
              html += `<span class="num-scroller-col ${decimalClass}" data-digit="${d}"><span class="num-scroller-strip">`;
              for (let c = 0; c < 2; c++) {
                for (let n = 0; n <= 9; n++) {
                  html += `<span class="num-scroller-digit">${n}</span>`;
                }
              }
              html += `</span></span>`;
            } else {
              html += `<span class="num-scroller-static ${decimalClass}">${ch}</span>`;
            }
          }
        }

        if (suffix) {
          html += `<span class="num-scroller-static num-scroller-suffix ${suffixClass}">${suffix}</span>`;
        }

        html += `</span>`;

        el.innerHTML = html;
        el._currentCountVal = target;

        // Animate digit strips from top to target index in next frame
        const cols = el.querySelectorAll('.num-scroller-col');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            cols.forEach((col, idx) => {
              const digit = parseInt(col.getAttribute('data-digit'), 10) || 0;
              const strip = col.querySelector('.num-scroller-strip');
              if (strip) {
                // Second cycle target index is 10 + digit (each digit is 5% of 20-digit strip)
                const targetPct = (10 + digit) * 5;
                const colDelay = idx * stagger;
                strip.style.transition = `transform ${duration}ms cubic-bezier(0.12, 0.8, 0.2, 1) ${colDelay}ms`;
                strip.style.transform = `translateY(-${targetPct}%)`;
              }
            });
          });
        });
      }

      if (delay > 0) {
        el._countDelayTimer = setTimeout(startAnimation, delay);
      } else {
        startAnimation();
      }
    });
  }

  // Expose globally so external calls or developer consoles can trigger counters
  window.animateNumber = animateNumber;

  function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message, type = 'info') {
    let iconType = 'info';
    if (type === 'success') iconType = 'success';
    else if (type === 'error' || type === 'danger') iconType = 'error';
    else if (type === 'warning' || type === 'warn') iconType = 'warning';
    else if (type === 'info') iconType = 'info';

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        position: 'center',
        icon: iconType,
        title: message,
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    const toastId = 'toast-' + Date.now();
    const isError = type === 'error';
    const typeClass = isError ? 'toast-error text-[#DC2626]' : 'toast-default text-black';

    const toastHtml = `
      <div id="${toastId}" class="aurelia-toast ${typeClass} bg-white text-xs sm:text-sm font-semibold px-5 py-3 border shadow-md flex items-center space-x-2 transition-all duration-200 opacity-0 translate-y-2 pointer-events-auto rounded-full">
        <span>${escapeHtml(message)}</span>
      </div>
    `;

    $('#toast-container').append(toastHtml);
    const $elem = $('#' + toastId);

    setTimeout(() => {
      $elem.removeClass('opacity-0 translate-y-2').addClass('opacity-100 translate-y-0');
    }, 20);

    setTimeout(() => {
      $elem.removeClass('opacity-100 translate-y-0').addClass('opacity-0 translate-y-2');
      setTimeout(() => $elem.remove(), 250);
    }, 3200);
  }
  window.showToast = showToast;

  function getStatusBadge(status) {
    status = status || 'Pending';
    switch (status.toLowerCase()) {
      case 'active':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#15803d] border border-[#15803d] shadow-2xs whitespace-nowrap">Active</span>`;
      case 'not active':
      case 'not-active':
      case 'inactive':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#b91c1c] border border-[#b91c1c] shadow-2xs whitespace-nowrap">${escapeHtml(status)}</span>`;
      case 'on duty':
      case 'onduty':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#15803d] border border-[#15803d] shadow-2xs whitespace-nowrap">On Duty</span>`;
      case 'on leave':
      case 'onleave':
      case 'leave':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#b91c1c] border border-[#b91c1c] shadow-2xs whitespace-nowrap">On Leave</span>`;
      case 'paid':
      case 'completed':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#15803d] border border-[#15803d] shadow-2xs whitespace-nowrap">${escapeHtml(status)}</span>`;
      case 'draft':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#d97706] border border-[#d97706] shadow-2xs whitespace-nowrap">Draft</span>`;
      case 'available':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#15803d] border border-[#15803d] shadow-2xs whitespace-nowrap">${escapeHtml(status)}</span>`;
      case 'pending':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#ea580c] border border-[#ea580c] shadow-2xs whitespace-nowrap">${escapeHtml(status)}</span>`;
      case 'preparing':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#ca8a04] border border-[#ca8a04] shadow-2xs whitespace-nowrap">${escapeHtml(status)}</span>`;
      case 'served':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#0284c7] border border-[#0284c7] shadow-2xs whitespace-nowrap">${escapeHtml(status)}</span>`;
      case 'cancelled':
      case 'unavailable':
      case 'refunded':
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#b91c1c] border border-[#b91c1c] shadow-2xs whitespace-nowrap">${escapeHtml(status)}</span>`;
      default:
        return `<span class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-white text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 whitespace-nowrap">${escapeHtml(status)}</span>`;
    }
  }

  function getPaymentMethodIconSvg(method) {
    const m = (method || '').toLowerCase().trim();
    if (m === 'cash') {
      return `<svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2.5" /><circle cx="12" cy="12" r="2.8" /><path stroke-linecap="round" d="M6 12h.01M18 12h.01" stroke-width="2.5" /></svg>`;
    } else if (m === 'card') {
      return `<svg class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2.5" /><line x1="2" y1="10" x2="22" y2="10" stroke-width="1.8" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 15h3" stroke-width="2" /></svg>`;
    } else if (m === 'upi') {
      return `<svg class="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2.5" width="14" height="19" rx="2.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01" stroke-width="2.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M10 7h4" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 11.5l3-3 3 3M12 8.5v5.5" stroke-width="1.8" /></svg>`;
    }
    return `<svg class="w-4 h-4 text-slate-400 shrink-0 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l2.5 2.5" /></svg>`;
  }
  window.getPaymentMethodIconSvg = getPaymentMethodIconSvg;

  function getPaymentMethodBadge(method) {
    const raw = method || 'Unpaid';
    const m = raw.toLowerCase().trim();
    const icon = getPaymentMethodIconSvg(m);

    if (m === 'cash') {
      return `<span class="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-300">${icon}<span>Cash</span></span>`;
    } else if (m === 'card') {
      return `<span class="inline-flex items-center gap-1.5 font-medium text-blue-700 dark:text-blue-300">${icon}<span>Card</span></span>`;
    } else if (m === 'upi') {
      return `<span class="inline-flex items-center gap-1.5 font-medium text-purple-700 dark:text-purple-300">${icon}<span>UPI</span></span>`;
    } else {
      return `<span class="inline-flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">${icon}<span>${escapeHtml(raw)}</span></span>`;
    }
  }
  window.getPaymentMethodBadge = getPaymentMethodBadge;

  // =========================================================================
  // 3. NAVIGATION, SIDEBAR COLLAPSE & THEME CONTROLLER
  // =========================================================================

  const titles = {
    dashboard: 'Welcome back!',
    billing: 'Transactions & POS Billing',
    'add-bill': 'Create Tax Invoice & POS Billing',
    'billing-details': 'Billing Details & History',
    menu: 'Product & Menu Management',
    orders: 'Order Queue & Kitchen Tickets',
    customers: 'Guest Directory & Loyalty',
    analytics: 'Revenue & Sales Analytics',
    settings: 'Station & Terminal Settings',
    'hr-documents': 'HR Document Templates & Agreements',
    'all-departments': 'Hotel Departments',
    'all-department': 'Hotel Departments',
    'add-department': 'Create New Department',
    employees: 'Staff Directory & Shift Roster',
    'add-employee': 'Add New Employee (Staff Onboarding)',
    holidays: 'Hotel Holiday & Observance Calendar 2026',
    'leave-category': 'Hotel Leave Categories & Policy 2026',
    'leave-assign': 'Staff Leave Quota Allocation Matrix',
    'leave-request': 'Staff Leave Requests & Approvals Queue',
    'attendance-list': 'Daily Staff Attendance Roster',
    'attendance-report': 'Monthly Attendance & Overtime Report',
    'salary-grade': 'Salary Grades & Compensation Bands',
    'manage-salary': 'Employee Salary Configurations & Setup',
    'disburse-salary-update': 'Monthly Payroll Disbursement & Bank Batches',
    'pay-slip': 'Official Employee Pay Slip & Salary Advice'
  };

  function switchSection(target) {
    if (window.Auth && typeof window.Auth.isAuthenticated === 'function' && !window.Auth.isAuthenticated()) {
      window.Auth.showView('login');
      return;
    }

    if (!titles[target]) {
      if (window.location.pathname.includes('add-bill')) target = 'add-bill';
      else if (window.location.pathname.includes('billing-details')) target = 'billing-details';
      else if (window.location.pathname.includes('billing')) target = 'billing';
      else target = 'dashboard';
    }

    // Update nav links active styling
    $('.Aurelia-nav-item, .aurelia-nav-item, .finset-nav-item, .nav-link').each(function () {
      $(this).toggleClass('active', $(this).data('target') === target);
    });

    // Auto-sync Human Resource submenu expansion and active pill
    const allHrTargets = [
      'hr-documents', 'employees', 'add-employee', 'holidays',
      'leave-category', 'leave-assign', 'leave-request',
      'attendance-list', 'attendance-report',
      'salary-grade', 'manage-salary', 'disburse-salary-update', 'pay-slip'
    ];
    if (allHrTargets.includes(target)) {
      $('#submenu-human-resource').removeClass('hidden');
      $('#chevron-nav-hr').addClass('rotate-90');

      const hrActionMap = {
        'hr-documents': 'hr-doc-templates',
        'add-employee': 'add-employee',
        'employees': 'employee-list',
        'holidays': 'holiday-list',
        'leave-category': 'leave-category',
        'leave-assign': 'leave-assign',
        'leave-request': 'leave-request',
        'attendance-list': 'attendance-list',
        'attendance-report': 'attendance-report',
        'salary-grade': 'salary-grade',
        'manage-salary': 'manage-salary',
        'disburse-salary-update': 'disburse-salary-update',
        'pay-slip': 'pay-slip'
      };
      let act = hrActionMap[target] || target;
      if (window.location.pathname.includes('hr-employee-list')) {
        act = 'hr-employee-list';
      }

      if (['leave-category', 'leave-assign', 'leave-request'].includes(target)) {
        $('#nested-leave-mgmt-menu').removeClass('hidden');
        $('#chevron-sub-leave').addClass('rotate-90');
      }
      if (['salary-grade', 'manage-salary', 'disburse-salary-update', 'pay-slip'].includes(target)) {
        $('#nested-payroll-menu').removeClass('hidden');
        $('#chevron-sub-payroll').addClass('rotate-90');
      }

      $('.hr-sub-item').removeClass('text-sky-400 font-bold active').addClass('text-slate-300');
      $('.hr-sub-item span.rounded-full').removeClass('border-sky-400 bg-sky-400').addClass('border-slate-400');
      const $activeItem = $(`.hr-sub-item[data-action="${act}"]`);
      $activeItem.addClass('text-sky-400 font-bold active').removeClass('text-slate-300');
      $activeItem.find('span.rounded-full').addClass('border-sky-400 bg-sky-400').removeClass('border-slate-400');
    }

    // Auto-sync Department submenu expansion and active pill
    if (['all-departments', 'all-department', 'add-department'].includes(target)) {
      $('#submenu-department').removeClass('hidden');
      $('#chevron-nav-dept').addClass('rotate-90');
      const deptActionMap = {
        'all-departments': 'all-department',
        'all-department': 'all-department',
        'add-department': 'add-department'
      };
      const act = deptActionMap[target];
      $('.dept-sub-item').removeClass('text-sky-400 font-bold active').addClass('text-slate-300');
      $('.dept-sub-item span.rounded-full').removeClass('border-sky-400 bg-sky-400').addClass('border-slate-400');
      const $activeItem = $(`.dept-sub-item[data-action="${act}"]`);
      $activeItem.addClass('text-sky-400 font-bold active').removeClass('text-slate-300');
      $activeItem.find('span.rounded-full').addClass('border-sky-400 bg-sky-400').removeClass('border-slate-400');
    }

    // Auto-sync Billing submenu expansion and active pill
    if (['billing', 'add-bill', 'billing-details'].includes(target)) {
      $('#submenu-billing').removeClass('hidden');
      $('#chevron-nav-billing').addClass('rotate-90');
      $('#btn-nav-billing').addClass('active');
      const act = target === 'billing-details' ? 'billing-details' : 'add-bill';
      $('.billing-sub-item').removeClass('text-[#FCA311] font-bold active').addClass('text-slate-300');
      $('.billing-sub-item span.rounded-full').removeClass('border-[#FCA311] bg-[#FCA311]').addClass('border-slate-400');
      const $activeItem = $(`.billing-sub-item[data-action="${act}"]`);
      $activeItem.addClass('text-[#FCA311] font-bold active').removeClass('text-slate-300');
      $activeItem.find('span.rounded-full').addClass('border-[#FCA311] bg-[#FCA311]').removeClass('border-slate-400');
    }

    // If target section is not present in the current DOM (e.g. cross-navigating between index.html and standalone HR pages)
    let $targetSec = $('#section-' + target);
    if ($targetSec.length === 0 && (target === 'add-bill' || target === 'billing-details' || target === 'billing') && $('#section-billing').length) {
      $targetSec = $('#section-billing');
    }
    if ($targetSec.length === 0) {
      const isDeptSubdir = window.location.pathname.includes('/department');
      const isHRSubdir = window.location.pathname.includes('/human-resources');
      const isBillingSubdir = window.location.pathname.includes('/billing-management');
      const isSubdir = isDeptSubdir || isHRSubdir || isBillingSubdir;
      const pageFileMap = {
        'billing': isBillingSubdir ? 'add-bill.html' : (isSubdir ? '../billing-management/add-bill.html' : 'billing-management/add-bill.html'),
        'add-bill': isBillingSubdir ? 'add-bill.html' : (isSubdir ? '../billing-management/add-bill.html' : 'billing-management/add-bill.html'),
        'billing-details': isBillingSubdir ? 'billing-details.html' : (isSubdir ? '../billing-management/billing-details.html' : 'billing-management/billing-details.html'),
        'orders': isSubdir ? '../order.html' : 'order.html',
        'menu': isSubdir ? '../menu.html' : 'menu.html',
        'customers': isSubdir ? '../customer.html' : 'customer.html',
        'analytics': isSubdir ? '../analytics.html' : 'analytics.html',
        'hr-documents': isHRSubdir ? 'hr-document-template.html' : (isSubdir ? '../human-resources/hr-document-template.html' : 'human-resources/hr-document-template.html'),
        'hr-employee-list': isHRSubdir ? 'hr-employee-list.html' : (isSubdir ? '../human-resources/hr-employee-list.html' : 'human-resources/hr-employee-list.html'),
        'add-employee': isHRSubdir ? 'add-employee.html' : (isSubdir ? '../human-resources/add-employee.html' : 'human-resources/add-employee.html'),
        'employees': isHRSubdir ? 'employee-list.html' : (isSubdir ? '../human-resources/employee-list.html' : 'human-resources/employee-list.html'),
        'holidays': isHRSubdir ? 'holiday-list.html' : (isSubdir ? '../human-resources/holiday-list.html' : 'human-resources/holiday-list.html'),
        'leave-category': isHRSubdir ? 'leave-category.html' : (isSubdir ? '../human-resources/leave-category.html' : 'human-resources/leave-category.html'),
        'leave-assign': isHRSubdir ? 'leave-assign.html' : (isSubdir ? '../human-resources/leave-assign.html' : 'human-resources/leave-assign.html'),
        'leave-request': isHRSubdir ? 'leave-request.html' : (isSubdir ? '../human-resources/leave-request.html' : 'human-resources/leave-request.html'),
        'attendance-list': isHRSubdir ? 'attendance-list.html' : (isSubdir ? '../human-resources/attendance-list.html' : 'human-resources/attendance-list.html'),
        'attendance-report': isHRSubdir ? 'attendance-report.html' : (isSubdir ? '../human-resources/attendance-report.html' : 'human-resources/attendance-report.html'),
        'salary-grade': isHRSubdir ? 'salary-grade.html' : (isSubdir ? '../human-resources/salary-grade.html' : 'human-resources/salary-grade.html'),
        'manage-salary': isHRSubdir ? 'manage-salary.html' : (isSubdir ? '../human-resources/manage-salary.html' : 'human-resources/manage-salary.html'),
        'disburse-salary-update': isHRSubdir ? 'disburse-salary-update.html' : (isSubdir ? '../human-resources/disburse-salary-update.html' : 'human-resources/disburse-salary-update.html'),
        'pay-slip': isHRSubdir ? 'pay-slip.html' : (isSubdir ? '../human-resources/pay-slip.html' : 'human-resources/pay-slip.html'),
        'all-departments': isDeptSubdir ? 'all_department.html' : (isSubdir ? '../department/all_department.html' : 'department/all_department.html'),
        'all-department': isDeptSubdir ? 'all_department.html' : (isSubdir ? '../department/all_department.html' : 'department/all_department.html'),
        'add-department': isDeptSubdir ? 'add_department.html' : (isSubdir ? '../department/add_department.html' : 'department/add_department.html')
      };
      if (pageFileMap[target]) {
        window.location.href = pageFileMap[target];
      } else {
        window.location.href = (isSubdir ? '../index.html#' : 'index.html#') + target;
      }
      return;
    }

    // Hide all sections, show target
    $('main section').addClass('hidden').attr('hidden', true);
    $targetSec.removeClass('hidden').removeAttr('hidden');

    // Sync topbar greeting, user name, role, email/username, and avatar dynamically
    updateTopbarAvatarUI();

    closeSidebar();

    const sectionRenderers = {
      dashboard: renderDashboard,
      settings: renderSettingsSection,
      billing: initBillingSection,
      'add-bill': initBillingSection,
      'billing-details': initBillingSection,
      menu: renderMenuSection,
      orders: renderOrdersSection,
      customers: renderCustomersSection,
      analytics: renderAnalyticsSection,
      'hr-documents': renderHrDocumentsSection,
      employees: renderEmployeesSection,
      'add-employee': renderAddEmployeeSection,
      holidays: renderHolidaysSection,
      'all-departments': renderDepartmentsGrid,
      'all-department': renderDepartmentsGrid
    };
    if (sectionRenderers[target]) sectionRenderers[target]();
    renderSidebarBadges();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-stick and keep active sidebar item visible
    keepActiveSidebarItemVisible(false);
    setTimeout(() => keepActiveSidebarItemVisible(false), 50);
    setTimeout(() => keepActiveSidebarItemVisible(false), 150);
  }

  // =========================================================================
  // SIDEBAR SCROLL PERSISTENCE & ACTIVE ITEM AUTO-STICK
  // =========================================================================
  function keepActiveSidebarItemVisible(isSmooth = false) {
    const $scrollContainer = $('#sidebar-quicklinks-scroll');
    if (!$scrollContainer.length) return;

    // Search for currently active sub-item or nav item
    const $active = $('.hr-sub-item.active, .dept-sub-item.active, .Aurelia-nav-item.active:not([data-target="dashboard"])').first();
    if (!$active.length) return;

    const container = $scrollContainer[0];
    const elem = $active[0];

    const containerRect = container.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    // Distance relative to scroll container viewport
    const diffTop = elemRect.top - containerRect.top;
    const elemHeight = elemRect.height;
    const containerHeight = containerRect.height;

    // Check if element is out of visible bounds or too close to edges (< 25px)
    if (diffTop < 25 || (diffTop + elemHeight) > (containerHeight - 25)) {
      const currentScroll = container.scrollTop;
      const targetScroll = currentScroll + diffTop - (containerHeight / 2) + (elemHeight / 2);
      const safeScroll = Math.max(0, targetScroll);

      if (isSmooth) {
        container.scrollTo({ top: safeScroll, behavior: 'smooth' });
      } else {
        container.scrollTop = safeScroll;
      }
      try {
        sessionStorage.setItem('aurelia_sidebar_scroll', safeScroll);
      } catch (e) { }
    }
  }

  function restoreSidebarScroll() {
    const $scrollContainer = $('#sidebar-quicklinks-scroll');
    if (!$scrollContainer.length) return;

    try {
      const savedScroll = sessionStorage.getItem('aurelia_sidebar_scroll');
      if (savedScroll !== null && !isNaN(parseInt(savedScroll, 10))) {
        $scrollContainer[0].scrollTop = parseInt(savedScroll, 10);
      }
    } catch (e) { }

    // Guarantee that active item is visible
    setTimeout(() => keepActiveSidebarItemVisible(false), 60);
    setTimeout(() => keepActiveSidebarItemVisible(false), 200);
  }

  window.keepActiveSidebarItemVisible = keepActiveSidebarItemVisible;
  window.restoreSidebarScroll = restoreSidebarScroll;

  // Preserve scroll position whenever a user clicks any sidebar link or button
  $(document).on('click', '#app-sidebar a, #app-sidebar button, .hr-sub-item, .dept-sub-item, .nav-link', function () {
    const $scrollContainer = $('#sidebar-quicklinks-scroll');
    if ($scrollContainer.length) {
      try {
        sessionStorage.setItem('aurelia_sidebar_scroll', $scrollContainer[0].scrollTop);
      } catch (e) { }
    }
  });

  // Track scroll changes on sidebar
  $(document).on('scroll', '#sidebar-quicklinks-scroll', function () {
    try {
      sessionStorage.setItem('aurelia_sidebar_scroll', this.scrollTop);
    } catch (e) { }
  });

  window.addEventListener('beforeunload', function () {
    const $sc = document.getElementById('sidebar-quicklinks-scroll');
    if ($sc) {
      try {
        sessionStorage.setItem('aurelia_sidebar_scroll', $sc.scrollTop);
      } catch (e) { }
    }
  });

  // Expose switchSection & syncSectionWithHash for Auth controller
  window.switchSection = switchSection;
  window.syncSectionWithHash = function () {
    let hash = window.location.hash.replace('#', '') || 'dashboard';
    if (['login', 'register', 'forgot'].includes(hash)) {
      hash = 'dashboard';
      window.location.hash = '#dashboard';
    }
    switchSection(hash);
  };

  $('.nav-link').on('click', function (e) {
    const target = $(this).data('target');
    if (!target) return;
    e.preventDefault();
    window.location.hash = target;
    switchSection(target);
  });

  // Topbar Settings Icon Button
  $('#btn-top-settings').on('click', function (e) {
    e.preventDefault();
    window.location.hash = 'settings';
    switchSection('settings');
  });

  // =========================================================================
  // HUMAN RESOURCE SIDEBAR DROPDOWN CONTROLLER
  // =========================================================================
  $('#btn-nav-hr').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // If sidebar is collapsed, auto-expand sidebar first
    if ($('#app-sidebar').hasClass('is-collapsed')) {
      $('#btn-sidebar-collapse').trigger('click');
    }

    const $submenu = $('#submenu-human-resource');
    const $chevron = $('#chevron-nav-hr');
    const isExpanded = !$submenu.hasClass('hidden');

    if (isExpanded) {
      $submenu.addClass('hidden');
      $chevron.removeClass('rotate-90');
      $(this).removeClass('active');
    } else {
      $submenu.removeClass('hidden');
      $chevron.addClass('rotate-90');
      $(this).addClass('active');
    }
  });

  // Nested: Leave Management Dropdown Toggle
  $(document).on('click', '#btn-sub-leave-mgmt', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $nestedMenu = $('#nested-leave-mgmt-menu');
    const $chevron = $('#chevron-sub-leave');
    const isExpanded = !$nestedMenu.hasClass('hidden');

    if (isExpanded) {
      $nestedMenu.addClass('hidden');
      $chevron.removeClass('rotate-90');
    } else {
      $nestedMenu.removeClass('hidden');
      $chevron.addClass('rotate-90');
      setTimeout(() => keepActiveSidebarItemVisible(true), 60);
    }
  });

  // Nested: Payroll Dropdown Toggle
  $(document).on('click', '#btn-sub-payroll', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $nestedMenu = $('#nested-payroll-menu');
    const $chevron = $('#chevron-sub-payroll');
    const isExpanded = !$nestedMenu.hasClass('hidden');

    if (isExpanded) {
      $nestedMenu.addClass('hidden');
      $chevron.removeClass('rotate-90');
    } else {
      $nestedMenu.removeClass('hidden');
      $chevron.addClass('rotate-90');
      setTimeout(() => keepActiveSidebarItemVisible(true), 60);
    }
  });

  // Human Resource Sub-Items Actions
  $(document).on('click', '.hr-sub-item', function (e) {
    const href = $(this).attr('href');
    const isRealLink = href && href !== '#' && !href.startsWith('javascript:');

    if (isRealLink) {
      // Allow browser native navigation for clean, reliable routing
      const targetFile = href.split('/').pop().replace('.html', '').split('#')[0];
      const currentFile = window.location.pathname.split('/').pop().replace('.html', '');
      if (targetFile && currentFile && targetFile === currentFile) {
        e.preventDefault();
        return;
      }
      return; // Let browser navigate natively!
    }

    const action = $(this).data('action');
    const isDeptSubdir = window.location.pathname.includes('/department');
    const isHRSubdir = window.location.pathname.includes('/human-resources');
    const isBillingSubdir = window.location.pathname.includes('/billing-management');
    const isOtherSubdir = isDeptSubdir || isBillingSubdir;

    const hrPageMap = {
      'hr-doc-templates': isOtherSubdir ? '../human-resources/hr-document-template.html' : (isHRSubdir ? 'hr-document-template.html' : 'human-resources/hr-document-template.html'),
      'hr-employee-list': isHRSubdir ? 'hr-employee-list.html' : (isSubdir ? '../human-resources/hr-employee-list.html' : 'human-resources/hr-employee-list.html'),
      'add-employee': isHRSubdir ? 'add-employee.html' : (isSubdir ? '../human-resources/add-employee.html' : 'human-resources/add-employee.html'),
      'employee-list': isOtherSubdir ? '../human-resources/employee-list.html' : (isHRSubdir ? 'employee-list.html' : 'human-resources/employee-list.html'),
      'holiday-list': isOtherSubdir ? '../human-resources/holiday-list.html' : (isHRSubdir ? 'holiday-list.html' : 'human-resources/holiday-list.html'),
      'leave-category': isHRSubdir ? 'leave-category.html' : (isSubdir ? '../human-resources/leave-category.html' : 'human-resources/leave-category.html'),
      'leave-assign': isHRSubdir ? 'leave-assign.html' : (isSubdir ? '../human-resources/leave-assign.html' : 'human-resources/leave-assign.html'),
      'leave-request': isHRSubdir ? 'leave-request.html' : (isSubdir ? '../human-resources/leave-request.html' : 'human-resources/leave-request.html'),
      'attendance-list': isHRSubdir ? 'attendance-list.html' : (isSubdir ? '../human-resources/attendance-list.html' : 'human-resources/attendance-list.html'),
      'attendance-report': isHRSubdir ? 'attendance-report.html' : (isSubdir ? '../human-resources/attendance-report.html' : 'human-resources/attendance-report.html'),
      'salary-grade': isHRSubdir ? 'salary-grade.html' : (isSubdir ? '../human-resources/salary-grade.html' : 'human-resources/salary-grade.html'),
      'manage-salary': isHRSubdir ? 'manage-salary.html' : (isSubdir ? '../human-resources/manage-salary.html' : 'human-resources/manage-salary.html'),
      'disburse-salary-update': isHRSubdir ? 'disburse-salary-update.html' : (isSubdir ? '../human-resources/disburse-salary-update.html' : 'human-resources/disburse-salary-update.html'),
      'pay-slip': isOtherSubdir ? '../human-resources/pay-slip.html' : (isHRSubdir ? 'pay-slip.html' : 'human-resources/pay-slip.html')
    };

    if (hrPageMap[action]) {
      e.preventDefault();
      const targetFile = hrPageMap[action].split('/').pop().replace('.html', '');
      const currentFile = window.location.pathname.split('/').pop().replace('.html', '');

      if (currentFile === targetFile) {
        return; // Already on this page
      }

      window.location.href = hrPageMap[action];
      return;
    }

    e.preventDefault();

    $('.hr-sub-item').removeClass('text-sky-400 font-bold active').addClass('text-slate-300');
    $('.hr-sub-item span.rounded-full').removeClass('border-sky-400 bg-sky-400').addClass('border-slate-400');
    $(this).addClass('text-sky-400 font-bold active').removeClass('text-slate-300');
    $(this).find('span.rounded-full').addClass('border-sky-400 bg-sky-400').removeClass('border-slate-400');

    const hrToastMap = {
      'hr-employee-list': ['Viewing HR List & Document Templates', 'info'],
      'employee-list': ['Viewing Employee Directory (48 staff members)', 'info'],
      'add-employee': ['Human Resource: Add Employee panel ready', 'info'],
      'holiday-list': ['Holiday List: 14 official paid holidays & gazetted calendar for 2026', 'info'],
      'hr-doc-templates': ['HR Document Templates: 12 official hotel agreements, contracts & policies available', 'info'],
      'leave-category': ['Leave Categories: Casual Leave, Sick Leave, Earned Leave, Maternity/Paternity', 'info'],
      'leave-assign': ['Leave Allocation: Annual quotas assigned for 48 staff members', 'info'],
      'leave-request': ['Leave Requests: 6 staff members currently on approved leave today', 'warning'],
      'attendance-list': ['Attendance Ledger: 42 of 48 staff on duty (87.5% attendance rate)', 'info'],
      'attendance-report': ['Monthly Attendance Report generated for October 2026', 'info'],
      'salary-grade': ['Salary Grades: Executive Grade A to Support Grade E configured', 'info'],
      'manage-salary': ['Salary Management: Base salary, HRA, DA, and shift allowances active', 'info'],
      'disburse-salary-update': ['Disburse Salary: October payroll processed for 48 employees', 'success'],
      'pay-slip': ['Pay Slips: Digital salary slips with PF and Tax breakdown ready for dispatch', 'info']
    };

    const [msg, type] = hrToastMap[action] || [`Human Resource: ${action}`, 'info'];
    showToast(msg, type);
  });

  // =========================================================================
  // DEPARTMENT SIDEBAR DROPDOWN & MANAGEMENT CONTROLLER
  // =========================================================================
  const defaultDepartments = [
    {
      id: 'DEPT-FO',
      name: 'Front Office & Concierge',
      code: 'DEPT-FO',
      head: 'Adaline Lively',
      staffCount: 8,
      location: 'Ground Floor Main Lobby',
      shift: '24/7 Continuous (3 Shifts)',
      desc: 'Guest check-in/out, concierge, VIP arrivals, baggage handling, and reservations.'
    },
    {
      id: 'DEPT-KIT',
      name: 'Culinary & Kitchen',
      code: 'DEPT-KIT',
      head: 'Sous Chef Marco Rossi',
      staffCount: 12,
      location: 'Main Kitchen Level -1',
      shift: 'Morning & Evening (2 Shifts)',
      desc: 'Fine dining preparation, banquets, buffet management, and culinary inventory.'
    },
    {
      id: 'DEPT-FNB',
      name: 'Food & Beverage / Restaurant',
      code: 'DEPT-FNB',
      head: 'Roberto Rossi',
      staffCount: 12,
      location: 'Ground & Terrace Bar',
      shift: 'Morning & Evening (2 Shifts)',
      desc: 'Table service, Aurelia Bar & Lounge, in-room dining, and banqueting.'
    },
    {
      id: 'DEPT-HK',
      name: 'Housekeeping & Laundry',
      code: 'DEPT-HK',
      head: 'Maria Santos',
      staffCount: 10,
      location: 'Floors 1-5 & Service Wing',
      shift: 'Morning & Evening (2 Shifts)',
      desc: 'Guest room sanitization, linen management, floor maintenance, and laundry operations.'
    },
    {
      id: 'DEPT-ENG',
      name: 'Engineering & Maintenance',
      code: 'DEPT-ENG',
      head: 'Rajesh Nair',
      staffCount: 4,
      location: 'Basements & Tech Core',
      shift: '24/7 Continuous (3 Shifts)',
      desc: 'HVAC systems, electricals, plumbing, elevator maintenance, and safety compliance.'
    },
    {
      id: 'DEPT-SEC',
      name: 'Security & Operations',
      code: 'DEPT-SEC',
      head: 'Vikram Rathore',
      staffCount: 2,
      location: 'Surveillance Hub & Gates',
      shift: '24/7 Continuous (3 Shifts)',
      desc: 'Perimeter surveillance, CCTV monitoring, access control, and fire safety systems.'
    }
  ];

  let hotelDepartments = JSON.parse(localStorage.getItem('aurelia_departments')) || defaultDepartments;

  function saveDepartments() {
    localStorage.setItem('aurelia_departments', JSON.stringify(hotelDepartments));
  }

  function renderDepartmentsGrid(filterText = '') {
    const $grid = $('#modal-dept-grid');
    if (!$grid.length) return;

    const query = (filterText || '').toLowerCase().trim();
    const filtered = hotelDepartments.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.code.toLowerCase().includes(query) ||
      d.head.toLowerCase().includes(query) ||
      d.location.toLowerCase().includes(query)
    );

    $('#modal-dept-count-badge').text(`${hotelDepartments.length} Departments`);
    $('#stat-dept-count').text(`${hotelDepartments.length} Wings`);
    const totalStaff = hotelDepartments.reduce((acc, d) => acc + (parseInt(d.staffCount) || 0), 0);
    $('#stat-dept-staff').text(`${totalStaff} Staff`);
    $('#modal-dept-footer-count').text(`Showing ${filtered.length} of ${hotelDepartments.length} departments`);

    if (filtered.length === 0) {
      $grid.empty();
      $('#modal-dept-empty').removeClass('hidden');
      return;
    }

    $('#modal-dept-empty').addClass('hidden');
    let html = '';

    const isTable = $grid.is('tbody') || $grid.closest('table').length > 0;
    const isDeptSubdir = window.location.pathname.includes('/department');
    const isHRSubdir = window.location.pathname.includes('/human-resources');
    const isBillingSubdir = window.location.pathname.includes('/billing-management');
    const isOtherSubdir = isDeptSubdir || isBillingSubdir;
    const staffListUrl = isOtherSubdir ? '../human-resources/employee-list.html' : (isHRSubdir ? 'employee-list.html' : 'human-resources/employee-list.html');

    filtered.forEach(dept => {
      if (isTable) {
        html += `
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/80 last:border-b-0 group" data-code="${escapeHtml(dept.code)}" data-id="${escapeHtml(dept.code)}">
            <td class="py-2.5 sm:py-3 px-3">
              <div class="flex items-center space-x-2.5 min-w-0">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#14213D] to-[#FCA311] flex items-center justify-center text-white text-[11px] font-black shadow-2xs flex-shrink-0">
                  ${dept.code.replace('DEPT-', '').slice(0, 2)}
                </div>
                <div class="min-w-0">
                  <div class="font-bold text-slate-900 dark:text-white text-xs group-hover:text-[#FCA311] transition-colors truncate" title="${dept.name}">
                    ${dept.name}
                  </div>
                  <div class="text-[10px] text-slate-400 truncate max-w-[160px] sm:max-w-[190px]" title="${dept.desc || ''}">
                    ${dept.desc || 'Operational hotel division.'}
                  </div>
                </div>
              </div>
            </td>
            <td class="py-2.5 sm:py-3 px-2 whitespace-nowrap">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#14213D] text-[#FCA311] inline-block">
                ${dept.code}
              </span>
            </td>
            <td class="py-2.5 sm:py-3 px-2.5 whitespace-nowrap">
              <div class="font-semibold text-slate-800 dark:text-slate-200 text-xs leading-tight">${dept.head}</div>
              <div class="text-[10px] text-slate-400 font-medium">Head of Dept</div>
            </td>
            <td class="py-2.5 sm:py-3 px-2 whitespace-nowrap text-center">
              <div class="inline-flex items-center justify-center space-x-1">
                <span class="font-black text-slate-900 dark:text-white text-xs">${dept.staffCount}</span>
                <span class="text-slate-400 text-[10px]">Staff</span>
              </div>
            </td>
            <td class="py-2.5 sm:py-3 px-2.5 whitespace-nowrap">
              <div class="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                <svg class="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span class="text-[11px] truncate max-w-[140px]" title="${dept.location}">${dept.location}</span>
              </div>
            </td>
            <td class="py-2.5 sm:py-3 px-2 whitespace-nowrap">
              <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                ${dept.shift || 'Standard (2 Shifts)'}
              </span>
            </td>
            <td class="py-2.5 sm:py-3 px-2 whitespace-nowrap text-center">
              ${(dept.status === 'Inactive' || dept.status === 'Not active' || dept.status === 'not-active')
            ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#b91c1c] text-white shadow-2xs">
                    Not active
                  </span>`
            : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#15803d] text-white shadow-2xs">
                    Active
                  </span>`
          }
            </td>
            <td class="py-2.5 sm:py-3 px-3 whitespace-nowrap text-center">
              <div class="inline-flex items-center justify-end space-x-1.5">
                <a href="${staffListUrl}" class="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#FCA311] hover:text-black transition-all shadow-2xs" title="View staff assigned to this department">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <span>Staff</span>
                </a>
                <button type="button" class="btn-delete-dept p-1 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors" data-code="${dept.code}" data-name="${dept.name}" title="Delete Department">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      } else {
        html += `
          <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 hover:border-[#FCA311] transition-all shadow-xs flex flex-col justify-between space-y-3 group">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#14213D] text-[#FCA311]">${dept.code}</span>
                ${(dept.status === 'Inactive' || dept.status === 'Not active' || dept.status === 'not-active')
            ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#b91c1c] text-white shadow-2xs">
                      Not active
                    </span>`
            : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#15803d] text-white shadow-2xs">
                      Active
                    </span>`
          }
              </div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#FCA311] transition-colors leading-snug">
                ${dept.name}
              </h4>
              <p class="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                ${dept.desc || 'No description provided.'}
              </p>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-[11px]">
              <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span class="text-[10px] font-medium uppercase tracking-wider">Head of Dept:</span>
                <span class="font-bold text-slate-700 dark:text-slate-200">${dept.head}</span>
              </div>
              <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span class="text-[10px] font-medium uppercase tracking-wider">Staff Roster:</span>
                <span class="font-bold text-[#14213D] dark:text-amber-400">${dept.staffCount} Members</span>
              </div>
              <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span class="text-[10px] font-medium uppercase tracking-wider">Station:</span>
                <span class="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[140px] text-right" title="${dept.location}">${dept.location}</span>
              </div>
            </div>
          </div>
        `;
      }
    });

    $grid.html(html);
  }

  // Delete Department Handler
  $(document).on('click', '.btn-delete-dept', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const code = $(this).data('code');
    const name = $(this).data('name');
    if (confirm(`Are you sure you want to delete the department "${name}" (${code})?`)) {
      hotelDepartments = hotelDepartments.filter(d => d.code !== code);
      saveDepartments();
      renderDepartmentsGrid($('#modal-dept-search').val());
      showToast(`Department "${name}" removed.`, 'info');
    }
  });

  // Toggle Department Dropdown in Sidebar
  $('#btn-nav-dept').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // If sidebar is collapsed, auto-expand sidebar first
    if ($('#app-sidebar').hasClass('is-collapsed')) {
      $('#btn-sidebar-collapse').trigger('click');
    }

    const $submenu = $('#submenu-department');
    const $chevron = $('#chevron-nav-dept');
    const isExpanded = !$submenu.hasClass('hidden');

    if (isExpanded) {
      $submenu.addClass('hidden');
      $chevron.removeClass('rotate-90');
      $(this).removeClass('active');
    } else {
      $submenu.removeClass('hidden');
      $chevron.addClass('rotate-90');
      $(this).addClass('active');
    }
  });

  // Department Sub-items Click Handlers
  $('.dept-sub-item').on('click', function (e) {
    const action = $(this).data('action');
    const isDeptSubdir = window.location.pathname.includes('/department');
    const isHRSubdir = window.location.pathname.includes('/human-resources');
    const isBillingSubdir = window.location.pathname.includes('/billing-management');
    const isOtherSubdir = isDeptSubdir || isBillingSubdir;

    if (action === 'all-department') {
      const targetUrl = isDeptSubdir ? 'all_department.html' : (isHRSubdir ? '../department/all_department.html' : 'department/all_department.html');
      if (window.location.pathname.includes('all_department')) {
        e.preventDefault();
        renderDepartmentsGrid();
      } else {
        window.location.href = targetUrl;
      }
    } else if (action === 'add-department') {
      const targetUrl = isDeptSubdir ? 'add_department.html' : (isOtherSubdir ? '../department/add_department.html' : 'department/add_department.html');
      if (window.location.pathname.includes('add_department')) {
        e.preventDefault();
        $('#input-dept-name').focus();
      } else {
        window.location.href = targetUrl;
      }
    }
  });

  // Open Add Department from inside All Department
  $('#btn-open-add-dept-from-list').on('click', function () {
    const isDeptSubdir = window.location.pathname.includes('/department');
    const isHRSubdir = window.location.pathname.includes('/human-resources');
    const isBillingSubdir = window.location.pathname.includes('/billing-management');
    const isOtherSubdir = isDeptSubdir || isBillingSubdir;
    const targetUrl = isDeptSubdir ? 'add_department.html' : (isOtherSubdir ? '../department/add_department.html' : 'department/add_department.html');
    window.location.href = targetUrl;
  });

  // Toggle Billing Dropdown in Sidebar
  $(document).on('click', '#btn-nav-billing', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // If sidebar is collapsed, auto-expand sidebar first
    if ($('#app-sidebar').hasClass('is-collapsed')) {
      $('#btn-sidebar-collapse').trigger('click');
    }

    const $submenu = $('#submenu-billing');
    const $chevron = $('#chevron-nav-billing');
    const isExpanded = !$submenu.hasClass('hidden');

    if (isExpanded) {
      $submenu.addClass('hidden');
      $chevron.removeClass('rotate-90');
      $(this).removeClass('active');
    } else {
      $submenu.removeClass('hidden');
      $chevron.addClass('rotate-90');
      $(this).addClass('active');
    }
  });

  // Billing Sub-items Click Handlers
  $(document).on('click', '.billing-sub-item', function (e) {
    const action = $(this).data('action');
    const isDeptSubdir = window.location.pathname.includes('/department');
    const isHRSubdir = window.location.pathname.includes('/human-resources');
    const isBillingSubdir = window.location.pathname.includes('/billing-management');
    const isSubdir = isDeptSubdir || isHRSubdir || isBillingSubdir;
    if (action === 'add-bill') {
      const targetUrl = isBillingSubdir ? 'add-bill.html' : (isSubdir ? '../billing-management/add-bill.html' : 'billing-management/add-bill.html');
      if (window.location.pathname.includes('add-bill')) {
        e.preventDefault();
      } else {
        e.preventDefault();
        window.location.href = targetUrl;
      }
    } else if (action === 'billing-details') {
      const targetUrl = isBillingSubdir ? 'billing-details.html' : (isSubdir ? '../billing-management/billing-details.html' : 'billing-management/billing-details.html');
      if (window.location.pathname.includes('billing-details')) {
        e.preventDefault();
        renderBillingHistory();
      } else {
        e.preventDefault();
        window.location.href = targetUrl;
      }
    }
  });

  // Search Departments
  $('#modal-dept-search').on('input', function () {
    renderDepartmentsGrid($(this).val());
  });

  // Handle Form Submit for Adding Department
  $('#form-add-department').on('submit', function (e) {
    e.preventDefault();

    const name = $('#input-dept-name').val().trim();
    const code = ($('#input-dept-code').val().trim() || ('DEPT-' + name.slice(0, 3).toUpperCase())).toUpperCase();
    const location = $('#input-dept-location').val().trim() || 'Main Complex';
    const head = $('#input-dept-head').val().trim() || 'Assigned Supervisor';
    const staffCount = parseInt($('#input-dept-quota').val()) || 5;
    const shift = $('#select-dept-shift').val();
    const desc = $('#input-dept-desc').val().trim() || 'Operational hotel division.';

    if (!name) {
      showToast('Department name is required.', 'error');
      return;
    }

    const newDept = {
      id: code,
      name,
      code,
      head,
      staffCount,
      location,
      shift,
      desc
    };

    hotelDepartments.unshift(newDept);
    saveDepartments();

    // Reset Form
    this.reset();
    showToast(`Department "${name}" successfully created!`, 'success');

    const isDeptSubdir = window.location.pathname.includes('/department');
    const isHRSubdir = window.location.pathname.includes('/human-resources');
    const isBillingSubdir = window.location.pathname.includes('/billing-management');
    const isOtherSubdir = isDeptSubdir || isBillingSubdir;
    const targetUrl = isDeptSubdir ? 'all_department.html' : (isHRSubdir ? '../department/all_department.html' : 'department/all_department.html');
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 500);
  });

  $(window).on('hashchange', function () {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    switchSection(hash);
  });

  // Mobile Drawer Toggle
  function openSidebar() {
    $('#mobile-quick-popup').addClass('hidden');
    $('#app-sidebar').removeClass('-translate-x-full is-collapsed');
    $('#mobile-drawer-backdrop').removeClass('hidden');
    $('body').addClass('overflow-hidden lg:overflow-auto sidebar-open');
    if ($(window).width() < 1024) {
      $('#btn-sidebar-collapse').find('svg').css('transform', 'rotate(0deg)');
      $('#btn-sidebar-collapse').attr('title', 'Close sidebar');
      const curTheme = typeof getSavedTheme === 'function' ? getSavedTheme() : { sidebarBg: '#494D5F' };
      const curLight = isColorLight(curTheme.sidebarBg);
      const curCol = curLight ? '#000000' : '#FFFFFF';
      $('#btn-sidebar-collapse').css('color', curCol);
      $('#btn-sidebar-collapse svg, #btn-sidebar-collapse svg path').css({ 'color': curCol, 'stroke': curCol }).attr('stroke', curCol);
    }
  }

  function closeSidebar() {
    $('#app-sidebar').addClass('-translate-x-full');
    $('#mobile-drawer-backdrop').addClass('hidden');
    $('body').removeClass('overflow-hidden lg:overflow-auto sidebar-open');
    if ($(window).width() < 1024) {
      $('#btn-sidebar-collapse').find('svg').css('transform', 'rotate(180deg)');
      $('#btn-sidebar-collapse').attr('title', 'Open sidebar');
    }
  }

  $(document).on('click', '.btn-sidebar-trigger', openSidebar);
  $(document).on('click', '#mobile-drawer-backdrop, #btn-sidebar-close-mobile', closeSidebar);

  // Mobile 3-Lines User Menu Drawer (Pure Path / Image 1 style: Notifications, Settings, Profile ONLY)
  function openMobileUserMenu() {
    $('#mobile-user-menu-backdrop').removeClass('hidden');
    $('#mobile-user-menu-drawer').removeClass('-translate-x-full translate-x-full').addClass('translate-x-0');
    $('body').addClass('overflow-hidden');
  }

  function closeMobileUserMenu() {
    $('#mobile-user-menu-drawer').removeClass('translate-x-0').addClass('translate-x-full');
    $('#mobile-user-menu-backdrop').addClass('hidden');
    $('body').removeClass('overflow-hidden');
  }

  $(document).on('click', '#btn-mobile-more', function (e) {
    e.preventDefault();
    e.stopPropagation();
    openMobileUserMenu();
  });

  $(document).on('click', '#btn-close-mobile-user-menu, #mobile-user-menu-backdrop', function (e) {
    e.preventDefault();
    closeMobileUserMenu();
  });

  $(document).on('click', '#menu-item-notifications', function (e) {
    e.preventDefault();
    closeMobileUserMenu();
    setTimeout(() => {
      if (typeof showToast === 'function') {
        showToast('Kitchen Ticket ORD-0082 (Room 304) is preparing. Front desk audit session active.', 'info');
      } else {
        $('#btn-top-notifications').trigger('click');
      }
    }, 150);
  });

  $(document).on('click', '#menu-item-settings', function (e) {
    e.preventDefault();
    closeMobileUserMenu();
    setTimeout(() => {
      window.location.hash = 'settings';
      if (typeof switchSection === 'function') {
        switchSection('settings');
      } else {
        $('#btn-top-settings').trigger('click');
      }
    }, 150);
  });

  $(document).on('click', '#menu-item-profile', function (e) {
    e.preventDefault();
    closeMobileUserMenu();
    setTimeout(() => {
      if (typeof openUserProfileModal === 'function') {
        openUserProfileModal();
      } else {
        $('#topbar-profile-container button, #user-profile-capsule').first().trigger('click');
      }
    }, 150);
  });

  // Auto-close mobile drawer when tapping any navigation link
  $(document).on('click', '#app-sidebar a, #app-sidebar .nav-link, #app-sidebar .hr-sub-item, #app-sidebar .dept-sub-item', function () {
    if ($(window).width() < 1024 && !$(this).is('#btn-nav-hr, #btn-nav-dept, #btn-nav-billing, #btn-sub-leave-mgmt, #btn-sub-payroll')) {
      closeSidebar();
    }
  });

  // Sidebar Collapse / Mobile Drawer Toggle
  let sidebarCollapsed = false;
  $(document).on('click', '#btn-sidebar-collapse', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // On mobile (< 1024px), toggle slide drawer open / closed
    if ($(window).width() < 1024) {
      if ($('#app-sidebar').hasClass('-translate-x-full')) {
        openSidebar();
      } else {
        closeSidebar();
      }
      return;
    }

    // On Desktop, toggle between full width (lg:w-68) and compact icon width (is-collapsed)
    sidebarCollapsed = !sidebarCollapsed;
    if (sidebarCollapsed) {
      $('#app-sidebar').addClass('is-collapsed').removeClass('lg:w-68');
      $(this).find('svg').css('transform', 'rotate(180deg)');
      $(this).attr('title', 'Expand sidebar');
    } else {
      $('#app-sidebar').removeClass('is-collapsed').addClass('lg:w-68');
      $(this).find('svg').css('transform', 'rotate(0deg)');
      $(this).attr('title', 'Collapse sidebar');
    }
  });

  // Set initial chevron position on mobile
  if ($(window).width() < 1024) {
    $('#btn-sidebar-collapse').find('svg').css('transform', 'rotate(180deg)');
    $('#btn-sidebar-collapse').attr('title', 'Open sidebar');
  }

  $(window).on('resize', function () {
    if ($(window).width() >= 1024) {
      $('#app-sidebar').removeClass('-translate-x-full');
      $('#mobile-drawer-backdrop').addClass('hidden');
      $('body').removeClass('overflow-hidden sidebar-open');
      if (sidebarCollapsed) {
        $('#btn-sidebar-collapse').find('svg').css('transform', 'rotate(180deg)');
      } else {
        $('#btn-sidebar-collapse').find('svg').css('transform', 'rotate(0deg)');
      }
    } else {
      if ($('#app-sidebar').hasClass('-translate-x-full')) {
        $('body').removeClass('sidebar-open');
        $('#btn-sidebar-collapse').find('svg').css('transform', 'rotate(180deg)');
      } else {
        $('body').addClass('sidebar-open');
        $('#btn-sidebar-collapse').find('svg').css('transform', 'rotate(0deg)');
      }
    }
  });

  // Theme Setup (Set to light mode by default)
  $('html').removeClass('dark').addClass('light');
  localStorage.setItem('finset_theme', 'light');

  // Help Modal & Logout
  $('#btn-sidebar-help').on('click', function () {
    showToast('Hotel Aurelia POS Guide: Use Dashboard for overview, Transactions for live billing.', 'info');
  });

  $('#btn-sidebar-logout').on('click', function (e) {
    e.preventDefault();
    if (window.Auth && typeof window.Auth.showLogoutConfirmation === 'function') {
      window.Auth.showLogoutConfirmation();
    }
  });

  // Global Date Range & Presets Handler (Single Date Picker: From Date -> Today)
  function getTodayDateStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatPeriodDateLabel(d1, d2) {
    const l1 = d1.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const l2 = d2 ? d2.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today';
    return `${l1} to ${l2}`;
  }

  function applyDateRangeToDashboard(fromStr, toStr) {
    if (!fromStr) return;
    const todayStr = getTodayDateStr();
    if (!toStr) {
      toStr = $('#input-global-date-to').val() || todayStr;
    }
    let d1 = new Date(fromStr);
    let d2 = new Date(toStr);
    if (d1 > d2) {
      const tmp = d1; d1 = d2; d2 = tmp;
      const tmpStr = fromStr; fromStr = toStr; toStr = tmpStr;
    }

    $('#input-global-date-from, #input-graph-date-from').val(fromStr);
    $('#input-global-date-to, #input-graph-date-to').val(toStr);

    const displayLabel = formatPeriodDateLabel(d1, d2);

    renderMoneyFlowChart();
    renderDashboard();
    showToast(`Dashboard updated for ${displayLabel}.`, 'info');
  }

  $('#input-global-date-from, #input-graph-date-from, #input-global-date-to, #input-graph-date-to').on('change', function () {
    const fromStr = $('#input-global-date-from').val() || $('#input-graph-date-from').val();
    const toStr = $('#input-global-date-to').val() || $('#input-graph-date-to').val() || getTodayDateStr();
    if (fromStr && toStr) {
      applyDateRangeToDashboard(fromStr, toStr);
    }
  });

  // Live Calendar Symbols & Date Input Click -> Open date picker popup
  $(document).on('click', '.calendar-icon-trigger', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const $capsule = $(this).closest('.calendar-range-capsule');
    const $inputs = $capsule.find('input[type="date"]:not(.hidden)');
    const allTriggers = $capsule.find('.calendar-icon-trigger');
    const triggerIndex = allTriggers.index(this);
    const targetInput = (triggerIndex === 1 && $inputs.length > 1) ? $inputs[1] : $inputs[0];
    if (targetInput) {
      if (typeof targetInput.showPicker === 'function') {
        try {
          targetInput.showPicker();
        } catch (err) {
          targetInput.focus();
        }
      } else {
        targetInput.focus();
      }
    }
  });

  $(document).on('click', '.date-picker-input', function (e) {
    if (typeof this.showPicker === 'function') {
      try {
        this.showPicker();
      } catch (err) { }
    }
  });

  // Quick action navigation
  $(document).on('click', '.quick-nav-bill', function (e) {
    e.preventDefault();
    const isBillingPage = window.location.pathname.includes('add-bill') || window.location.pathname.includes('billing');
    if (isBillingPage && typeof clearBillForm === 'function') {
      clearBillForm();
      switchBillingSubtab('create');
      showToast('New blank bill initialized.', 'info');
      const $form = $('#form-create-bill');
      if ($form.length) {
        $('html, body').animate({ scrollTop: $form.offset().top - 80 }, 250);
      }
    } else {
      window.location.hash = 'billing';
      switchSection('billing');
      switchBillingSubtab('create');
    }
  });

  $('.nav-to-billing-history').on('click', function () {
    window.location.hash = 'billing';
    switchSection('billing');
    switchBillingSubtab('history');
  });

  // Generic Modal Close
  $('.btn-close-modal').on('click', function () {
    $(this).closest('.fixed').addClass('hidden');
  });

  $('.fixed').on('click', function (e) {
    if ($(e.target).is(this)) {
      $(this).addClass('hidden');
    }
  });

  // Reset Sample Data Trigger
  $('#btn-trigger-reset').on('click', function () {
    $('#modal-reset-data').removeClass('hidden');
  });

  $('#btn-confirm-reset-action').on('click', function () {
    initializeSampleData(true);
    $('#modal-reset-data').addClass('hidden');
    showToast('Sample data reset to baseline.', 'success');
    renderSidebarBadges();
    const currentHash = window.location.hash.replace('#', '') || 'dashboard';
    switchSection(currentHash);
  });

  function openConfirmDeleteModal(message, onConfirm) {
    $('#confirm-delete-message').text(message);
    pendingDeleteCallback = onConfirm;
    $('#modal-confirm-delete').removeClass('hidden');
  }

  $('#btn-confirm-delete-action').on('click', function () {
    if (typeof pendingDeleteCallback === 'function') {
      pendingDeleteCallback();
      pendingDeleteCallback = null;
    }
    $('#modal-confirm-delete').addClass('hidden');
  });

  function renderSidebarBadges() {
    const rawMenu = Storage.get(STORAGE_KEYS.MENU, []);
    const rawOrders = Storage.get(STORAGE_KEYS.ORDERS, []);
    const rawCustomers = Storage.get(STORAGE_KEYS.CUSTOMERS, []);

    const menu = (rawMenu && rawMenu.length) ? rawMenu : DEFAULT_MENU_ITEMS;
    const orders = (rawOrders && rawOrders.length) ? rawOrders : DEFAULT_ORDERS;
    const customers = (rawCustomers && rawCustomers.length) ? rawCustomers : DEFAULT_CUSTOMERS;

    const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;

    // Completely static numbers - zero animation
    $('#badge-pending-orders').text(pendingOrdersCount);
    $('#badge-menu-count').text(menu.length);
    $('#badge-customers-count').text(customers.length);
  }
  window.renderSidebarBadges = renderSidebarBadges;

  // =========================================================================
  // 4. DASHBOARD ENGINE (Matches FinSet Screenshot Exactly)
  // =========================================================================

  function animateBillingMetrics(bills = Storage.get(STORAGE_KEYS.BILLS) || []) {
    const totalBillingVal = bills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    const totalTaxVal = bills.reduce((sum, b) => sum + (Number(b.taxAmount) || 0), 0);
    const invoiceCount = bills.length;
    const avgBillVal = invoiceCount > 0 ? totalBillingVal / invoiceCount : 0;

    animateNumber('#stat-total-billing, #stat-total-balance', totalBillingVal, {
      duration: 1200,
      decimals: 2,
      prefix: '₹',
      decimalClass: 'text-slate-400 font-normal'
    });
    animateNumber('#stat-billing-growth', 12.1, { duration: 900, decimals: 1, prefix: '↑ ', suffix: '%', useLocale: false });
    animateNumber('#stat-billing-count', invoiceCount, { duration: 900, decimals: 0, suffix: ' Settled', useLocale: false });
    animateNumber('#stat-billing-tax', totalTaxVal, {
      duration: 1100,
      decimals: 2,
      prefix: '₹',
      decimalClass: 'text-slate-400 font-normal'
    });
    if ($('#stat-billing-avg').length) {
      $('#stat-billing-avg').text('Avg ' + formatMoney(avgBillVal));
    }
  }

  function animateProfitMetrics() {
    const currentIncome = 85000;
    const currentExpense = 62220;
    const calculatedProfit = currentIncome - currentExpense;
    const profitMargin = ((calculatedProfit / currentIncome) * 100).toFixed(1);

    animateNumber('#stat-calculated-profit', calculatedProfit, {
      duration: 1200,
      decimals: 2,
      prefix: '₹',
      decimalClass: 'text-emerald-600/70 dark:text-emerald-400/70 font-normal'
    });
    animateNumber('#stat-profit-margin', Number(profitMargin), {
      duration: 1000,
      decimals: 1,
      prefix: '+',
      suffix: '% Profit',
      useLocale: false
    });
    animateNumber('#stat-income-display, #stat-income', currentIncome, {
      duration: 1100,
      decimals: 2,
      prefix: '₹',
      decimalClass: 'text-slate-400 font-normal'
    });
    animateNumber('#stat-income-growth', 6.3, { duration: 900, decimals: 1, prefix: '↑ ', suffix: '%', useLocale: false });
    animateNumber('#stat-expense-display, #stat-expense', currentExpense, {
      duration: 1100,
      decimals: 2,
      prefix: '₹',
      decimalClass: 'text-slate-400 font-normal'
    });
    animateNumber('#stat-expense-growth', 2.4, { duration: 900, decimals: 1, prefix: '↑ ', suffix: '%', useLocale: false });
  }

  function animateStaffMetrics() {
    const staffList = Storage.get(STORAGE_KEYS.STAFF, DEFAULT_STAFF) || DEFAULT_STAFF;
    const totalEmployees = staffList.length;
    const onDutyEmployees = staffList.filter(s => s.status === 'On Duty').length;
    const onLeaveEmployees = totalEmployees - onDutyEmployees;
    const attendancePct = totalEmployees > 0 ? (onDutyEmployees / totalEmployees) * 100 : 0;
    const deptCount = new Set(staffList.map(s => s.department).filter(Boolean)).size || 6;

    animateNumber('#stat-total-employee, #stat-total-savings', totalEmployees, {
      duration: 900,
      decimals: 0,
      suffix: 'Staff',
      suffixClass: 'text-slate-400 font-semibold text-lg ml-1.5'
    });
    animateNumber('#stat-employee-onduty', onDutyEmployees, { duration: 900, decimals: 0, prefix: '● ', suffix: ' On Duty' });
    animateNumber('#stat-employee-attendance', attendancePct, { duration: 900, decimals: 1, suffix: '%', useLocale: false });
    animateNumber('#stat-employee-leave', onLeaveEmployees, { duration: 900, decimals: 0, suffix: ' Staff' });
    if ($('#stat-employee-depts').length) {
      $('#stat-employee-depts').text(`${deptCount} Depts`);
    }
  }

  function renderDashboard() {
    const bills = Storage.get(STORAGE_KEYS.BILLS) || [];
    const orders = Storage.get(STORAGE_KEYS.ORDERS) || [];

    // Format top 3 cards with smooth count-up animation
    animateBillingMetrics(bills);
    animateProfitMetrics();
    animateStaffMetrics();

    // Render Charts (Row 2: Cascades from top to bottom at 200ms)
    renderMoneyFlowChart();
    renderBudgetDoughnutChart();

    // Render Recent Transactions (Row 3: Cascades at 400ms)
    renderDashboardRecentTransactions(bills);

    // Render Saving Goals (Row 3: Cascades at 400ms)
    renderSavingGoals();

    // Keep User Login & Device Activity height synced to Unpaid Salaries
    requestAnimationFrame(syncDeviceActivityCardHeight);

    // Update Badges
    renderSidebarBadges();

    // Initialize/refresh scroll-driven observer for dashboard cards
    initDashboardScrollAnimations();
  }

  // =========================================================================
  // UNPAID SALARY ENGINE (Bottom Right Card in Dashboard)
  // Calculates employee salary who's salary is not paid till now
  // =========================================================================

  function renderSavingGoals() {
    // 1. Animate Total Unpaid Salary KPI (₹3,42,228 for 9 unpaid staff)
    if ($('#stat-total-unpaid-salary').length) {
      animateNumber('#stat-total-unpaid-salary', 342228, {
        duration: 900,
        delay: 350,
        prefix: '₹'
      });
    }

    const groups = [
      { id: 'culinary', val: 148240, pct: 43, width: 43 },
      { id: 'frontoffice', val: 106080, pct: 31, width: 31 },
      { id: 'fnb', val: 87908, pct: 26, width: 26 }
    ];

    groups.forEach((g, idx) => {
      // 1. Animate department unpaid amount in top-to-bottom order
      if ($(`#goal-val-${g.id}`).length) {
        animateNumber(`#goal-val-${g.id}`, g.val, {
          duration: 900,
          delay: 400 + (idx * 80),
          prefix: '₹'
        });
      }

      // 2. Animate progress bar width and internal percentage
      const $bar = $(`#goal-bar-${g.id}`);
      if ($bar.length) {
        $bar.css({ width: '0%', transition: 'none' });
        setTimeout(() => {
          $bar.css({ width: g.width + '%', transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' });
          animateNumber($bar, g.pct, {
            duration: 900,
            delay: 0,
            suffix: '%',
            useLocale: false
          });
        }, 400 + (idx * 80));
      }
    });
  }

  // =========================================================================
  // SCROLL-DRIVEN NUMBER SCROLLING ENGINE FOR DASHBOARD
  // (Disabled: Numbers animate strictly on page reload / navigation, NEVER on scroll)
  // =========================================================================

  function initDashboardScrollAnimations() {
    // Intentionally disabled so numbers stay rock-solid and do not fluctuate when scrolling up/down
    if (window.dashboardIntersectionObserver) {
      window.dashboardIntersectionObserver.disconnect();
      window.dashboardIntersectionObserver = null;
    }
  }

  // Range-driven chart generator for Money Flow Area Graph
  function generateChartDataForRange(fromStr, toStr, account) {
    let d1 = new Date(fromStr);
    let d2 = new Date(toStr);
    if (isNaN(d1.getTime())) d1 = new Date('2026-01-01');
    if (isNaN(d2.getTime())) d2 = new Date();
    if (d1 > d2) { const t = d1; d1 = d2; d2 = t; }

    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    let labels = [];
    let income = [];
    let expense = [];

    if (diffDays <= 1) {
      // Intraday (hourly breakdown)
      labels = ['08:00', '11:00', '14:00', '17:00', '20:00', '23:00'];
      income = [1200, 3400, 5600, 4200, 7800, 3100];
      expense = [900, 2100, 4800, 3800, 6200, 2400];
    } else if (diffDays <= 14) {
      // Day by day
      let cur = new Date(d1);
      while (cur <= d2) {
        labels.push(cur.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
        cur.setDate(cur.getDate() + 1);
      }
      const seedInc = [4200, 6100, 5800, 8900, 7400, 9600, 8200, 7100, 8500, 6400, 9100, 8300, 9700, 8800];
      const seedExp = [3500, 5400, 5100, 7800, 6900, 8200, 7500, 6300, 7900, 5900, 8200, 7400, 8900, 7900];
      income = labels.map((_, i) => seedInc[i % seedInc.length]);
      expense = labels.map((_, i) => seedExp[i % seedExp.length]);
    } else if (diffDays <= 60) {
      // 7-day intervals
      let cur = new Date(d1);
      while (cur <= d2) {
        let next = new Date(cur);
        next.setDate(next.getDate() + 6);
        if (next > d2) next = new Date(d2);
        const l1 = cur.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const l2 = next.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        labels.push(l1 === l2 ? l1 : l1 + ' - ' + l2);
        cur.setDate(cur.getDate() + 7);
      }
      const seedInc = [12500, 16800, 14200, 19500, 18300, 15900, 17200, 19100];
      const seedExp = [10200, 14500, 13100, 17200, 16400, 14100, 15500, 16900];
      income = labels.map((_, i) => seedInc[i % seedInc.length]);
      expense = labels.map((_, i) => seedExp[i % seedExp.length]);
    } else {
      // Month by month (Jan - Jul defaults to exact screenshot data)
      let cur = new Date(d1.getFullYear(), d1.getMonth(), 1);
      const end = new Date(d2.getFullYear(), d2.getMonth(), 1);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const defaultInc = [7500, 11000, 10000, 14500, 14000, 6500, 7200, 9400, 13800, 12600, 15200, 16800];
      const defaultExp = [6500, 12000, 11000, 13500, 14500, 7500, 8500, 7900, 11200, 10800, 13400, 14900];
      while (cur <= end) {
        const mIdx = cur.getMonth();
        labels.push(monthNames[mIdx]);
        income.push(defaultInc[mIdx]);
        expense.push(defaultExp[mIdx]);
        cur.setMonth(cur.getMonth() + 1);
      }
    }

    if (account === 'frontdesk') {
      income = income.map(v => Math.round(v * 0.45));
      expense = expense.map(v => Math.round(v * 0.35));
    } else if (account === 'restaurant') {
      income = income.map(v => Math.round(v * 0.55));
      expense = expense.map(v => Math.round(v * 0.65));
    }

    return { labels, income, expense };
  }

  // Glassmorphic Area Graph for Money Flow (Jan - Jul smooth splines with translucent fills)
  function renderMoneyFlowChart() {
    const canvas = document.getElementById('chart-money-flow');
    if (!canvas) return;

    if (moneyFlowChart) {
      moneyFlowChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    const chartHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 256;

    // Glassmorphic translucent gradients
    const incomeGradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
    incomeGradient.addColorStop(0, 'rgba(20, 33, 61, 0.38)');
    incomeGradient.addColorStop(0.55, 'rgba(20, 33, 61, 0.12)');
    incomeGradient.addColorStop(1, 'rgba(20, 33, 61, 0.00)');

    const expenseGradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
    expenseGradient.addColorStop(0, 'rgba(252, 163, 17, 0.45)');
    expenseGradient.addColorStop(0.55, 'rgba(252, 163, 17, 0.14)');
    expenseGradient.addColorStop(1, 'rgba(252, 163, 17, 0.00)');

    const tickColor = '#94A3B8';
    const gridColor = 'rgba(229, 229, 229, 0.7)';

    const fromDate = $('#input-graph-date-from').val() || $('#input-global-date-from').val() || '2026-01-01';
    const toDate = $('#input-graph-date-to').val() || $('#input-global-date-to').val() || getTodayDateStr();
    $('#input-graph-date-to, #input-global-date-to').val(toDate);
    const account = $('#select-money-flow-account').val() || 'all';

    const chartData = generateChartDataForRange(fromDate, toDate, account);
    const labels = chartData.labels;
    const incomeData = chartData.income;
    const expenseData = chartData.expense;

    const maxInc = Math.max(...incomeData);
    const maxVal = Math.max(maxInc, Math.max(...expenseData));
    const stepSize = Math.max(1000, Math.ceil(maxVal / 4 / 500) * 500);
    const maxY = Math.ceil((maxVal * 1.15) / stepSize) * stepSize;

    // Update Peak Glassmorphic Tooltip Badge dynamically
    const peakIndex = incomeData.indexOf(maxInc);
    const leftPercent = labels.length > 1 ? Math.round(10 + (peakIndex / (labels.length - 1)) * 78) : 50;
    $('#chart-march-tooltip').css('left', `${leftPercent}%`);
    animateNumber('#chart-march-tooltip span:last-child', maxInc, { duration: 900, delay: 200, prefix: '₹' });

    moneyFlowChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            borderColor: '#14213D',
            borderWidth: 3,
            backgroundColor: incomeGradient,
            fill: true,
            tension: 0.42,
            pointRadius: 4.5,
            pointHoverRadius: 8,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#14213D',
            pointBorderWidth: 2.5,
            pointHoverBackgroundColor: '#14213D',
            pointHoverBorderColor: '#FFFFFF',
            pointHoverBorderWidth: 3
          },
          {
            label: 'Expense',
            data: expenseData,
            borderColor: '#FCA311',
            borderWidth: 3,
            backgroundColor: expenseGradient,
            fill: true,
            tension: 0.42,
            pointRadius: 4.5,
            pointHoverRadius: 8,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#FCA311',
            pointBorderWidth: 2.5,
            pointHoverBackgroundColor: '#FCA311',
            pointHoverBorderColor: '#FFFFFF',
            pointHoverBorderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(20, 33, 61, 0.92)',
            titleColor: '#FFFFFF',
            titleFont: { family: 'Inter', size: 12, weight: 'bold' },
            bodyColor: '#FCA311',
            bodyFont: { family: 'Inter', size: 12, weight: 600 },
            borderColor: 'rgba(252, 163, 17, 0.35)',
            borderWidth: 1,
            padding: { top: 9, bottom: 9, left: 14, right: 14 },
            cornerRadius: 12,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            callbacks: {
              label: function (context) {
                return ' ' + (context.dataset.label || '') + ': ' + formatMoney(context.raw);
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Inter', size: 11, weight: 600 },
              color: tickColor
            }
          },
          y: {
            min: 0,
            max: maxY,
            grid: {
              color: gridColor,
              drawBorder: false
            },
            ticks: {
              stepSize: stepSize,
              font: { family: 'Inter', size: 11, weight: 600 },
              color: tickColor,
              callback: function (val) {
                return '₹' + Number(val).toLocaleString('en-IN');
              }
            }
          }
        }
      }
    });
  }

  // Filter interaction for Money Flow account dropdown
  $('#select-money-flow-account').on('change', function () {
    renderMoneyFlowChart();
  });

  // =========================================================================
  // FOOD SALES PERFORMANCE & BUDGET ENGINE (4 Tiers: Best, Moderate, Less, Not)
  // =========================================================================

  function calculateFoodSalesTiers(monthlyBudget = 5950) {
    const menuItems = Storage.get(STORAGE_KEYS.MENU, DEFAULT_MENU_ITEMS);
    const allBills = Storage.get(STORAGE_KEYS.BILLS, DEFAULT_BILLS);

    const itemMap = {};
    menuItems.forEach(item => {
      itemMap[item.name] = {
        id: item.id,
        name: item.name,
        category: item.category,
        price: Number(item.price) || 0,
        description: item.description || '',
        qty: 0,
        rawRevenue: 0
      };
    });

    allBills.forEach(bill => {
      (bill.items || []).forEach(bi => {
        const name = bi.name;
        const qty = Number(bi.qty) || 0;
        const price = Number(bi.price) || (itemMap[name] ? itemMap[name].price : 0);
        if (itemMap[name]) {
          itemMap[name].qty += qty;
          itemMap[name].rawRevenue += qty * price;
        } else {
          itemMap[name] = {
            id: bi.id || ('item-' + name.toLowerCase().replace(/\s+/g, '-')),
            name: name,
            category: bi.category || 'Special',
            price: price,
            description: 'Chef recommendation / custom item',
            qty: qty,
            rawRevenue: qty * price
          };
        }
      });
    });

    const allItems = Object.values(itemMap);
    const sold = allItems.filter(i => i.qty > 0).sort((a, b) => {
      if (b.qty !== a.qty) return b.qty - a.qty;
      return b.rawRevenue - a.rawRevenue;
    });
    const notSelling = allItems.filter(i => i.qty === 0);

    let best = [];
    let moderate = [];
    let less = [];

    if (sold.length <= 1) {
      best = sold;
    } else if (sold.length === 2) {
      best = [sold[0]];
      moderate = [sold[1]];
    } else if (sold.length === 3) {
      best = [sold[0]];
      moderate = [sold[1]];
      less = [sold[2]];
    } else {
      // 4 tiers distribution: top ~30% best selling, next ~40% moderate, remainder less selling
      const topCount = Math.max(1, Math.round(sold.length * 0.30));
      const midCount = Math.max(1, Math.round(sold.length * 0.40));
      best = sold.slice(0, topCount);
      moderate = sold.slice(topCount, topCount + midCount);
      less = sold.slice(topCount + midCount);
    }

    // Annotate tier keys for filtering
    best.forEach(i => i.tier = 'best');
    moderate.forEach(i => i.tier = 'moderate');
    less.forEach(i => i.tier = 'less');
    notSelling.forEach(i => i.tier = 'not');

    const sumRaw = (arr) => arr.reduce((acc, x) => acc + x.rawRevenue, 0);
    const bestRaw = sumRaw(best);
    const modRaw = sumRaw(moderate);
    const lessRaw = sumRaw(less);
    const totalRaw = bestRaw + modRaw + lessRaw;

    // Monthly hotel budget target (₹5,950.00 baseline from dashboard design or dynamic total)
    const targetBudget = Math.max(monthlyBudget, totalRaw);

    const bestPct = totalRaw > 0 ? (bestRaw / totalRaw) : 0;
    const modPct = totalRaw > 0 ? (modRaw / totalRaw) : 0;
    const lessPct = totalRaw > 0 ? (lessRaw / totalRaw) : 0;

    const bestBudget = Math.round(targetBudget * bestPct);
    const modBudget = Math.round(targetBudget * modPct);
    const lessBudget = Math.max(0, targetBudget - bestBudget - modBudget);
    const notBudget = 0;

    return {
      totalBudget: targetBudget,
      totalRawRevenue: totalRaw,
      allItems: allItems,
      tiers: {
        best: {
          key: 'best',
          label: 'Best Selling',
          color: '#14213D',
          budget: bestBudget,
          pct: Math.round(bestPct * 100),
          items: best,
          totalQty: best.reduce((s, i) => s + i.qty, 0),
          rawRevenue: bestRaw
        },
        moderate: {
          key: 'moderate',
          label: 'Moderate Selling',
          color: '#FCA311',
          budget: modBudget,
          pct: Math.round(modPct * 100),
          items: moderate,
          totalQty: moderate.reduce((s, i) => s + i.qty, 0),
          rawRevenue: modRaw
        },
        less: {
          key: 'less',
          label: 'Less Selling',
          color: '#5C677D',
          budget: lessBudget,
          pct: Math.round(lessPct * 100),
          items: less,
          totalQty: less.reduce((s, i) => s + i.qty, 0),
          rawRevenue: lessRaw
        },
        not: {
          key: 'not',
          label: 'Not Selling',
          color: '#CBD5E1',
          budget: notBudget,
          pct: 0,
          items: notSelling,
          totalQty: 0,
          rawRevenue: 0
        }
      }
    };
  }

  // Budget Doughnut Chart with center text and live 4-tier food sales performance
  function renderBudgetDoughnutChart() {
    const ctx = document.getElementById('chart-budget-doughnut');
    if (!ctx) return;

    if (budgetDoughnutChart) {
      budgetDoughnutChart.destroy();
    }

    const analysis = calculateFoodSalesTiers(5950);
    const { tiers, totalBudget } = analysis;

    // Update 4 Tier Sections on the left side of the Budget Card with animated counters (Row 2: delay 200ms)
    ['best', 'moderate', 'less', 'not'].forEach(key => {
      const t = tiers[key];
      const isNot = key === 'not';
      animateNumber(`#budget-val-${key}`, isNot ? 0 : t.budget, { duration: 900, delay: 200, prefix: '₹' });
      $(`#budget-items-${key}`).text(`${t.items.length} foods (${isNot ? 0 : t.totalQty} sold)`);
      animateNumber(`#budget-pct-${key}`, isNot ? 0 : t.pct, { duration: 800, delay: 200, suffix: '%' });
    });

    // Center text: Total for month
    animateNumber('#budget-doughnut-total', totalBudget, { duration: 1100, delay: 200, decimals: 2, prefix: '₹' });

    // Top callout pill badge: Default to Best Selling tier
    animateNumber('#budget-badge-pct', tiers.best.pct, { duration: 800, delay: 200, suffix: '%' });
    animateNumber('#budget-badge-val', tiers.best.budget, { duration: 900, delay: 200, prefix: '₹' });

    // Data for Doughnut chart: [Best, Moderate, Less]
    const data = [tiers.best.budget, tiers.moderate.budget, tiers.less.budget];
    const labels = ['Best Selling', 'Moderate Selling', 'Less Selling'];
    const colors = ['#14213D', '#FCA311', '#5C677D'];

    budgetDoughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 3,
          borderColor: '#FFFFFF',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#14213D',
            titleFont: { family: 'Inter', size: 11, weight: 'bold' },
            bodyFont: { family: 'Inter', size: 11 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: function (tooltipItem) {
                const label = tooltipItem.label || '';
                const val = tooltipItem.raw || 0;
                const pct = Math.round((val / totalBudget) * 100);
                return ' ' + label + ': ' + formatMoney(val) + ' (' + pct + '%)';
              }
            }
          }
        },
        onHover: function (event, elements) {
          if (elements && elements.length > 0) {
            const idx = elements[0].index;
            if (idx === 0) {
              $('#budget-badge-pct').text(tiers.best.pct + '%');
              $('#budget-badge-val').text(formatMoney(tiers.best.budget));
            } else if (idx === 1) {
              $('#budget-badge-pct').text(tiers.moderate.pct + '%');
              $('#budget-badge-val').text(formatMoney(tiers.moderate.budget));
            } else if (idx === 2) {
              $('#budget-badge-pct').text(tiers.less.pct + '%');
              $('#budget-badge-val').text(formatMoney(tiers.less.budget));
            }
          } else {
            // Restore default to top performer
            $('#budget-badge-pct').text(tiers.best.pct + '%');
            $('#budget-badge-val').text(formatMoney(tiers.best.budget));
          }
        }
      }
    });
  }

  // Render Food Sales & Budget Modal Breakdown
  let currentFoodModalTab = 'all';
  function renderFoodSalesModal(filterTier = 'all', searchQuery = '') {
    currentFoodModalTab = filterTier;
    const analysis = calculateFoodSalesTiers(5950);
    const { tiers, totalBudget, allItems } = analysis;

    // Update 4 Metric Summary Cards in Modal with animated counters
    [
      ['best', tiers.best],
      ['mod', tiers.moderate],
      ['less', tiers.less]
    ].forEach(([k, t]) => {
      animateNumber(`#modal-metric-${k}-pct`, t.pct, { duration: 800, suffix: '%' });
      animateNumber(`#modal-metric-${k}-budget`, t.budget, { duration: 900, decimals: 2, prefix: '₹' });
      $(`#modal-metric-${k}-items`).text(t.items.length + ' foods');
      $(`#modal-metric-${k}-qty`).text(t.totalQty + ' units sold');
    });
    animateNumber('#modal-metric-not-budget', 0, { duration: 900, decimals: 2, prefix: '₹' });
    $('#modal-metric-not-items').text(tiers.not.items.length + ' foods');

    // Tab counts
    [
      ['all', allItems.length],
      ['best', tiers.best.items.length],
      ['mod', tiers.moderate.items.length],
      ['less', tiers.less.items.length],
      ['not', tiers.not.items.length]
    ].forEach(([k, cnt]) => animateNumber(`#modal-tab-count-${k}`, cnt, { duration: 600, useLocale: false }));
    animateNumber('#modal-footer-total-budget', totalBudget, { duration: 900, decimals: 2, prefix: '₹' });

    // Update Tab Active Style
    $('.food-modal-tab-btn').removeClass('active bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs')
      .addClass('text-slate-500 hover:text-slate-900 dark:hover:text-white');
    $('.food-modal-tab-btn[data-tab="' + filterTier + '"]').addClass('active bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs')
      .removeClass('text-slate-500');

    // Filter items
    let list = allItems;
    if (filterTier !== 'all') {
      list = list.filter(i => i.tier === filterTier);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(i => (i.name || '').toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q));
    }

    // Sort: highest sales quantity first, then revenue
    list.sort((a, b) => {
      if (b.qty !== a.qty) return b.qty - a.qty;
      return b.rawRevenue - a.rawRevenue;
    });

    const $tbody = $('#food-budget-modal-tbody');
    $tbody.empty();

    if (list.length === 0) {
      $tbody.html('<tr><td colspan="6" class="py-10 text-center text-slate-400 font-medium">No matching food items found in this section</td></tr>');
      return;
    }

    const tierBadgeMap = {
      best: '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#14213D] text-amber-300 shadow-xs">🔥 Best Selling</span>',
      moderate: '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border border-amber-200/60">⚡ Moderate</span>',
      less: '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200/60">⚠️ Less Selling</span>',
      not: '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60">Not Selling</span>'
    };

    list.forEach(item => {
      const tierBadge = tierBadgeMap[item.tier] || tierBadgeMap.not;

      const rowHtml = `
        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3 px-4">
            <div class="font-bold text-slate-900 dark:text-slate-100">${escapeHtml(item.name)}</div>
            <div class="text-[10px] text-slate-400 truncate max-w-xs">${escapeHtml(item.description || '')}</div>
          </td>
          <td class="py-3 px-3 text-slate-600 dark:text-slate-300">${escapeHtml(item.category || '-')}</td>
          <td class="py-3 px-3 text-center font-semibold text-slate-700 dark:text-slate-200">${formatMoney(item.price)}</td>
          <td class="py-3 px-3 text-center">
            <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${item.qty > 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100' : 'text-slate-400'}">
              ${item.qty}
            </span>
          </td>
          <td class="py-3 px-3 text-center font-bold ${item.rawRevenue > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">
            ${formatMoney(item.rawRevenue)}
          </td>
          <td class="py-3 px-3 text-center">
            ${tierBadge}
          </td>
        </tr>
      `;
      $tbody.append(rowHtml);
    });
  }

  // Open Food Sales Breakdown Modal
  $('#btn-open-food-sales-modal').on('click', function () {
    $('#modal-food-sales-budget').removeClass('hidden');
    $('#food-budget-search-input').val('');
    renderFoodSalesModal('all');
  });

  // Clicking on any tier row opens modal filtered to that tier
  $(document).on('click', '.food-tier-item', function () {
    const tier = $(this).data('tier') || 'all';
    $('#modal-food-sales-budget').removeClass('hidden');
    $('#food-budget-search-input').val('');
    renderFoodSalesModal(tier);
  });

  // Tab filtering inside Food Sales modal
  $(document).on('click', '.food-modal-tab-btn', function () {
    const tab = $(this).data('tab') || 'all';
    const query = $('#food-budget-search-input').val() || '';
    renderFoodSalesModal(tab, query);
  });

  // Search filter inside Food Sales modal
  $('#food-budget-search-input').on('input', function () {
    const query = $(this).val() || '';
    renderFoodSalesModal(currentFoodModalTab, query);
  });

  // =========================================================================
  // MODAL 1: TOTAL BILLINGS POPUP CONTROLLER
  // =========================================================================

  function openTotalBillingsModal() {
    $('#modal-billings-search').val('');
    $('#modal-billings-filter-payment').val('all');
    $('#modal-billings-sort').val('newest');
    $('#modal-total-billings').removeClass('hidden').css('display', 'flex');
    renderModalBillingsList(true);
  }

  function closeTotalBillingsModal() {
    $('#modal-total-billings').addClass('hidden').css('display', 'none');
  }

  // Export filtered bills to CSV
  function exportBillingsToCSV() {
    const bills = Storage.get(STORAGE_KEYS.BILLS, DEFAULT_BILLS) || [];
    if (!bills.length) {
      showToast('No billing records available to export.', 'warning');
      return;
    }
    const headers = ['Invoice Number', 'Date', 'Customer Name', 'Customer Phone', 'Email', 'Table / Room', 'Payment Method', 'Subtotal (INR)', 'GST 5% (INR)', 'Grand Total (INR)', 'Status'];
    const rows = bills.map(b => [
      `"${b.billNumber || ''}"`,
      `"${b.date || ''}"`,
      `"${(b.customerName || 'Walk-in Guest').replace(/"/g, '""')}"`,
      `"${b.customerPhone || ''}"`,
      `"${b.customerEmail || ''}"`,
      `"${b.tableRoom || ''}"`,
      `"${b.paymentMethod || 'UPI'}"`,
      (Number(b.subtotal) || 0).toFixed(2),
      (Number(b.taxAmount) || 0).toFixed(2),
      (Number(b.grandTotal) || 0).toFixed(2),
      `"${b.status || 'Paid'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aurelia_Hotel_Billings_Ledger_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${bills.length} invoices to CSV.`, 'success');
  }

  function renderModalBillingsList(isInitialOpen = false) {
    const bills = Storage.get(STORAGE_KEYS.BILLS, DEFAULT_BILLS) || [];
    const search = $.trim($('#modal-billings-search').val()).toLowerCase();
    const payFilter = $('#modal-billings-filter-payment').val() || 'all';
    const sort = $('#modal-billings-sort').val() || 'newest';

    // Calculate dynamic totals from bills
    const totalBillingVal = bills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    const totalTax = bills.reduce((sum, b) => sum + (Number(b.taxAmount) || 0), 0);
    const avgBill = bills.length ? (totalBillingVal / bills.length) : 0;

    // Top-to-Bottom Cascading Animated Number Counter Sequence
    const baseDelay = isInitialOpen ? 40 : 0;

    animateNumber('#modal-billings-count-badge', bills.length, {
      duration: 650,
      delay: baseDelay,
      suffix: ' Invoices',
      useLocale: false,
      rollAnim: isInitialOpen
    });

    animateNumber('#modal-billings-stat-total', totalBillingVal, {
      duration: 900,
      delay: baseDelay + 40,
      decimals: 2,
      prefix: '₹',
      rollAnim: isInitialOpen
    });

    animateNumber('#modal-billings-stat-count', bills.length, {
      duration: 800,
      delay: baseDelay + 80,
      decimals: 0,
      useLocale: false,
      rollAnim: isInitialOpen
    });

    animateNumber('#modal-billings-stat-avg', avgBill, {
      duration: 900,
      delay: baseDelay + 120,
      decimals: 2,
      prefix: '₹',
      rollAnim: isInitialOpen
    });

    animateNumber('#modal-billings-stat-tax', totalTax, {
      duration: 900,
      delay: baseDelay + 160,
      decimals: 2,
      prefix: '₹',
      rollAnim: isInitialOpen
    });

    // Filter bills
    let filtered = bills.filter(b => {
      const bNum = (b.billNumber || '').toLowerCase();
      const cName = (b.customerName || '').toLowerCase();
      const cPhone = (b.customerPhone || '').toLowerCase();
      const cEmail = (b.customerEmail || '').toLowerCase();
      const tRef = (b.tableRoom || '').toLowerCase();
      const pMethod = b.paymentMethod || 'UPI';
      const itemsStr = (b.items || []).map(it => it.name).join(' ').toLowerCase();

      const matchSearch = !search ||
        bNum.includes(search) ||
        cName.includes(search) ||
        cPhone.includes(search) ||
        cEmail.includes(search) ||
        tRef.includes(search) ||
        itemsStr.includes(search);

      const matchPay = (payFilter === 'all') || (pMethod === payFilter);

      return matchSearch && matchPay;
    });

    // Sort bills
    if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === 'amount-high') {
      filtered.sort((a, b) => (Number(b.grandTotal) || 0) - (Number(a.grandTotal) || 0));
    } else if (sort === 'amount-low') {
      filtered.sort((a, b) => (Number(a.grandTotal) || 0) - (Number(b.grandTotal) || 0));
    } else {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const $tbody = $('#modal-billings-tbody');
    $tbody.empty();

    if (filtered.length === 0) {
      $('#modal-billings-empty').removeClass('hidden');
    } else {
      $('#modal-billings-empty').addClass('hidden');
      filtered.forEach((b, idx) => {
        let payBadge = '';
        if (b.paymentMethod === 'UPI') {
          payBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/70">${getPaymentMethodIconSvg('upi')}UPI</span>`;
        } else if (b.paymentMethod === 'Card') {
          payBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70">${getPaymentMethodIconSvg('card')}Card</span>`;
        } else {
          payBadge = `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/70">${getPaymentMethodIconSvg('cash')}Cash</span>`;
        }

        const itemsList = (b.items || []).map(it => `${it.name} (x${it.qty})`).join(', ') || 'General Hotel Billing';
        const itemsCount = (b.items || []).reduce((sum, it) => sum + (Number(it.qty) || 1), 0);
        const itemsPreview = itemsList.length > 34 ? itemsList.substring(0, 31) + '...' : itemsList;
        const rowAmtId = `modal-bill-amt-${b.id || idx}`;

        $tbody.append(`
          <tr class="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/80">
            <td class="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[#14213D] dark:text-[#FCA311] font-bold text-[11px]">
                ${escapeHtml(b.billNumber)}
              </span>
            </td>
            <td class="py-3 px-3 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap text-[11px]">
              ${formatDateTime(b.date)}
            </td>
            <td class="py-2.5 px-3 whitespace-nowrap">
              <div class="font-bold text-slate-900 dark:text-white whitespace-nowrap">${escapeHtml(b.customerName || 'Walk-in Guest')}</div>
              <div class="text-[10px] text-slate-400 font-mono whitespace-nowrap">${escapeHtml(b.customerPhone || 'Counter Settlement')}</div>
              ${b.customerEmail ? `<div class="text-[10px] text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap">${escapeHtml(b.customerEmail)}</div>` : ''}
            </td>
            <td class="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              <span class="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/50 text-[10px] whitespace-nowrap">
                ${escapeHtml(b.tableRoom || '-')}
              </span>
            </td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">${payBadge}</td>
            <td class="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap" title="${escapeHtml(itemsList)}">
              <div class="inline-flex items-center space-x-1.5 whitespace-nowrap">
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 whitespace-nowrap">${itemsCount}</span>
                <span class="whitespace-nowrap text-xs">${escapeHtml(itemsPreview)}</span>
              </div>
            </td>
            <td class="py-2.5 px-3 text-center font-extrabold text-slate-900 dark:text-white whitespace-nowrap text-sm">
              <span id="${rowAmtId}">${formatMoney(b.grandTotal)}</span>
            </td>
            <td class="py-3 px-3 text-center whitespace-nowrap space-x-1">
              <button type="button" class="btn-view-bill px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#14213D] text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs" data-id="${b.id}" title="View tax invoice receipt">
                Receipt
              </button>
              <button type="button" class="btn-print-bill-row p-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer inline-flex items-center justify-center w-6 h-6" data-id="${b.id}" title="Print Receipt">
                <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                </svg>
              </button>
            </td>
          </tr>
        `);

        if (isInitialOpen) {
          animateNumber(`#${rowAmtId}`, Number(b.grandTotal) || 0, {
            duration: 750,
            delay: baseDelay + 200 + Math.min(idx * 25, 450),
            decimals: 2,
            prefix: '₹',
            rollAnim: true
          });
        }
      });
    }

    const filteredSum = filtered.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    $('#modal-billings-footer-count').html(`Showing <strong>${filtered.length}</strong> of <strong>${bills.length}</strong> bills &bull; Total: <strong>${formatMoney(filteredSum)}</strong>`);
  }

  // Trigger Total Billings Modal (from arrow button or card)
  $(document).on('click', '#btn-dashboard-total-billings, #card-dashboard-total-billing, [data-action="open-total-billings"]', function (e) {
    e.preventDefault();
    openTotalBillingsModal();
  });

  // Modal Close Handlers
  $('#modal-total-billings').on('click', '.btn-close-modal', function (e) {
    e.preventDefault();
    closeTotalBillingsModal();
  });

  $('#modal-total-billings').on('click', function (e) {
    if ($(e.target).is('#modal-total-billings')) {
      closeTotalBillingsModal();
    }
  });

  // Export CSV handler
  $('#btn-modal-billings-export').on('click', function (e) {
    e.preventDefault();
    exportBillingsToCSV();
  });

  // Search & Filter event bindings
  $('#modal-billings-search').on('input keyup', function () { renderModalBillingsList(false); });
  $('#modal-billings-filter-payment, #modal-billings-sort').on('change', function () { renderModalBillingsList(true); });

  $('#btn-modal-billings-create').on('click', function () {
    closeTotalBillingsModal();
    switchSection('billing');
    switchBillingSubtab('create');
  });

  // Expose global methods
  window.openTotalBillingsModal = openTotalBillingsModal;
  window.closeTotalBillingsModal = closeTotalBillingsModal;

  // =========================================================================
  // MODAL 2: TOTAL STAFF DIRECTORY POPUP CONTROLLER
  // =========================================================================

  let currentStaffFilterStatus = 'all';

  function openTotalStaffModal() {
    currentStaffFilterStatus = 'all';
    $('#modal-staff-search').val('');
    $('#modal-staff-filter-dept').val('all');
    updateStaffStatusTabButtons();
    $('#modal-total-staff').removeClass('hidden').css('display', 'flex');
    renderModalStaffList(true);
  }

  function updateStaffStatusTabButtons() {
    $('.tab-staff-status').each(function () {
      const st = $(this).data('status');
      if (st === currentStaffFilterStatus) {
        $(this).addClass('bg-[#14213D] text-white').removeClass('text-slate-600 dark:text-slate-300');
      } else {
        $(this).removeClass('bg-[#14213D] text-white').addClass('text-slate-600 dark:text-slate-300');
      }
    });
  }

  function renderModalStaffList(isInitialOpen = false) {
    const staffList = Storage.get(STORAGE_KEYS.STAFF, DEFAULT_STAFF) || DEFAULT_STAFF;
    const search = $.trim($('#modal-staff-search').val()).toLowerCase();
    const deptFilter = $('#modal-staff-filter-dept').val() || 'all';

    const onDutyCount = staffList.filter(s => s.status === 'On Duty').length;
    const onLeaveCount = staffList.filter(s => s.status === 'On Leave').length;

    const baseDelay = isInitialOpen ? 40 : 0;
    animateNumber('#modal-staff-count-badge', staffList.length, { duration: 600, delay: baseDelay, suffix: ' Total Staff', useLocale: false, rollAnim: isInitialOpen });
    animateNumber('#modal-staff-stat-total', staffList.length, { duration: 800, delay: baseDelay + 40, suffix: ' Staff', useLocale: false, rollAnim: isInitialOpen });
    animateNumber('#modal-staff-stat-onduty', onDutyCount, { duration: 800, delay: baseDelay + 80, suffix: ' Staff', useLocale: false, rollAnim: isInitialOpen });
    animateNumber('#modal-staff-stat-leave', onLeaveCount, { duration: 800, delay: baseDelay + 120, suffix: ' Staff', useLocale: false, rollAnim: isInitialOpen });

    animateNumber('#modal-staff-badge-all', staffList.length, { duration: 500, useLocale: false });
    animateNumber('#modal-staff-badge-onduty', onDutyCount, { duration: 500, useLocale: false });
    animateNumber('#modal-staff-badge-leave', onLeaveCount, { duration: 500, useLocale: false });

    let filtered = staffList.filter(s => {
      const matchStatus = (currentStaffFilterStatus === 'all') ||
        (currentStaffFilterStatus === 'onduty' && s.status === 'On Duty') ||
        (currentStaffFilterStatus === 'leave' && s.status === 'On Leave');

      const matchDept = (deptFilter === 'all') || (s.department === deptFilter);

      const sName = (s.name || '').toLowerCase();
      const sRole = (s.role || '').toLowerCase();
      const sDept = (s.department || '').toLowerCase();
      const sId = (s.id || '').toLowerCase();
      const sStation = (s.station || '').toLowerCase();

      const matchSearch = !search || sName.includes(search) || sRole.includes(search) || sDept.includes(search) || sId.includes(search) || sStation.includes(search);

      return matchStatus && matchDept && matchSearch;
    });

    const $tbody = $('#modal-staff-tbody');
    $tbody.empty();

    if (filtered.length === 0) {
      $('#modal-staff-empty').removeClass('hidden');
    } else {
      $('#modal-staff-empty').addClass('hidden');
      filtered.forEach(s => {
        const isSubdir = window.location.pathname.includes('/human-resources/') ||
          window.location.pathname.includes('/department/') ||
          window.location.pathname.includes('/billing-management/');
        const pfx = isSubdir ? '../assets/images/' : 'assets/images/';
        const femaleNames = [
          'tanvi', 'priya', 'priyanka', 'ananya', 'neha', 'sunita', 'meenakshi',
          'aarti', 'pooja', 'deepa', 'simran', 'shanti', 'lakshmi', 'rekha',
          'geeta', 'mary', 'savita', 'kavita', 'shreya', 'trisha', 'adaline', 'elena', 'sophia'
        ];
        const isFemale = femaleNames.some(fn => (s.name || '').toLowerCase().includes(fn));
        const avatarSrc = pfx + (isFemale ? 'avatar-female.png' : 'avatar-male.png');

        const isOnDuty = s.status === 'On Duty';

        const statusPill = isOnDuty
          ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#15803d] text-white shadow-2xs">
              On Duty
            </span>`
          : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#b91c1c] text-white shadow-2xs" title="${escapeHtml(s.leaveReason || 'On Leave')}">
              On Leave
            </span>`;

        const avatarDot = isOnDuty
          ? '<span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#15803d] border-2 border-white dark:border-slate-800 rounded-full"></span>'
          : '<span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#b91c1c] border-2 border-white dark:border-slate-800 rounded-full"></span>';

        $tbody.append(`
          <tr class="bg-white hover:bg-slate-100/90 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all cursor-pointer relative">
            <td class="py-2.5 px-3">
              <div class="flex items-center space-x-2.5">
                <div class="relative w-8 h-8 rounded-full flex-shrink-0 shadow-xs">
                  <img src="${avatarSrc}" alt="${escapeHtml(s.name)}" class="w-8 h-8 rounded-full object-cover border border-white/60 dark:border-slate-700">
                  ${avatarDot}
                </div>
                <div>
                  <div class="font-bold text-slate-900 dark:text-white">${escapeHtml(s.name)}</div>
                  <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(s.id)}</div>
                </div>
              </div>
            </td>
            <td class="py-2.5 px-3">
              <div class="font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(s.role)}</div>
              <div class="text-[10px] text-slate-400">${escapeHtml(s.department)}</div>
            </td>
            <td class="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-300">
              ${escapeHtml(s.station || 'Main Property')}
            </td>
            <td class="py-2.5 px-3 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
              ${escapeHtml(s.shift || 'Regular')}
            </td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">
              ${statusPill}
            </td>
            <td class="py-2.5 px-3">
              <div class="text-[11px] text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">${escapeHtml(s.phone)}</div>
              <div class="text-[10px] text-slate-400 truncate max-w-[150px]">${escapeHtml(s.email)}</div>
            </td>
          </tr>
        `);
      });
    }

    $('#modal-staff-footer-count').text(`Showing ${filtered.length} of ${staffList.length} staff members`);
  }

  // Trigger Total Staff: Direct redirect to Human Resource -> Employee List standalone page
  $('#btn-dashboard-total-staff').on('click', function (e) {
    e.preventDefault();
    $('#modal-total-staff').addClass('hidden').hide();
    window.location.href = 'human-resources/employee-list.html';
  });

  $(document).on('click', '.tab-staff-status', function () {
    currentStaffFilterStatus = $(this).data('status');
    updateStaffStatusTabButtons();
    renderModalStaffList(true);
  });

  $('#modal-staff-search').on('input keyup', function () { renderModalStaffList(false); });
  $('#modal-staff-filter-dept').on('change', function () { renderModalStaffList(true); });

  // Shared Live Device & Login Session Registry
  function getAllDeviceSessions() {
    const activeUser = getActiveUserData();
    const displayName = (activeUser && activeUser.name) ? String(activeUser.name).trim() : 'Aurelia Staff';
    const userEmail = (activeUser && activeUser.email) ? String(activeUser.email).trim() : 'staff@aureliahotel.com';
    const userRole = (activeUser && activeUser.role) ? String(activeUser.role).trim() : 'Front Desk Supervisor';
    const initials = displayName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AU';

    try { sessionStorage.removeItem('aurelia_active_session_seconds'); } catch (e) { }
    const currentActiveTimeStr = 'Active now';

    // Detect browser/device
    let currentDeviceName = 'Front Desk PC (Win 11 / Chrome)';
    let currentDeviceType = 'Desktop';
    const ua = (navigator.userAgent || '').toLowerCase();
    if (/mobile|android|iphone/i.test(ua)) {
      currentDeviceName = 'Mobile Terminal (Android / Chrome)';
      currentDeviceType = 'Mobile';
    } else if (/tablet|ipad/i.test(ua)) {
      currentDeviceName = 'Manager iPad Pro (iPadOS / Safari)';
      currentDeviceType = 'Tablet';
    } else if (/macintosh|mac os x/i.test(ua)) {
      currentDeviceName = 'Concierge iMac (macOS / Safari)';
      currentDeviceType = 'Desktop';
    }

    return [
      {
        terminalId: 'DEV08',
        id: 'EMP-2026-01',
        name: displayName,
        role: userRole,
        avatarBg: 'bg-[#14213D] dark:bg-[#FCA311] text-white dark:text-[#14213D]',
        initials: initials,
        email: userEmail,
        phone: '+91 98450 11201',
        deviceName: currentDeviceName,
        deviceType: currentDeviceType,
        timeSpent: currentActiveTimeStr,
        status: 'Active Now',
        isLive: true
      },
      {
        terminalId: 'DEV01',
        id: 'EMP-2026-04',
        name: 'Vikramaditya Reddy',
        role: 'General Manager',
        avatarBg: 'bg-blue-600 text-white',
        initials: 'VR',
        email: 'vikram.reddy@aureliahotel.com',
        phone: '+91 97412 34567',
        deviceName: 'Executive iMac 27" (macOS / Safari)',
        deviceType: 'Desktop',
        timeSpent: '2 hrs 15 mins',
        status: 'Active Now',
        isLive: true
      },
      {
        terminalId: 'DEV03',
        id: 'EMP-2026-07',
        name: 'Priya Sundaram',
        role: 'Guest Relations Officer',
        avatarBg: 'bg-purple-600 text-white',
        initials: 'PS',
        email: 'priya.s@aureliahotel.com',
        phone: '+91 98112 45678',
        deviceName: 'Reception iPad Pro (iPadOS / Safari)',
        deviceType: 'Tablet',
        timeSpent: '1 hr 45 mins',
        status: 'Active Now',
        isLive: true
      },
      {
        terminalId: 'DEV04',
        id: 'EMP-2026-12',
        name: 'Rohan Desai',
        role: 'Night Auditor',
        avatarBg: 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900',
        initials: 'RD',
        email: 'rohan.d@aureliahotel.com',
        phone: '+91 98200 55189',
        deviceName: 'Back Office PC #04 (Win 11 / Edge)',
        deviceType: 'Desktop',
        timeSpent: '58 mins',
        status: 'Idle (5m)',
        isLive: false
      },
      {
        terminalId: 'DEV02',
        id: 'EMP-2026-19',
        name: 'Kevin Peterson',
        role: 'F&B Service Captain',
        avatarBg: 'bg-emerald-600 text-white',
        initials: 'KP',
        email: 'kevin.p@aureliahotel.com',
        phone: '+91 99012 33456',
        deviceName: 'POS Handheld Dev #02 (Android 14)',
        deviceType: 'Mobile',
        timeSpent: '24 mins',
        status: 'Active Now',
        isLive: true
      },
      {
        terminalId: 'DEV05',
        id: 'EMP-2026-22',
        name: 'Arjun Nair',
        role: 'Executive Head Chef',
        avatarBg: 'bg-amber-600 text-white',
        initials: 'AN',
        email: 'arjun.n@aureliahotel.com',
        phone: '+91 98331 77420',
        deviceName: 'Main Kitchen KDS iPad (iPadOS / Chrome)',
        deviceType: 'Tablet',
        timeSpent: '4 hrs 10 mins',
        status: 'Active Now',
        isLive: true
      },
      {
        terminalId: 'DEV06',
        id: 'EMP-2026-25',
        name: 'Meera Kapoor',
        role: 'Spa & Wellness Lead',
        avatarBg: 'bg-rose-600 text-white',
        initials: 'MK',
        email: 'meera.k@aureliahotel.com',
        phone: '+91 98224 61908',
        deviceName: 'Spa Reception iPad Mini (iPadOS / Safari)',
        deviceType: 'Tablet',
        timeSpent: '1 hr 18 mins',
        status: 'Idle (12m)',
        isLive: false
      },
      {
        terminalId: 'DEV07',
        id: 'EMP-2026-31',
        name: 'Siddharth Malhotra',
        role: 'Banquet Operations',
        avatarBg: 'bg-indigo-600 text-white',
        initials: 'SM',
        email: 'siddharth.m@aureliahotel.com',
        phone: '+91 97654 22190',
        deviceName: 'Banquet Hall PC #02 (Win 11 / Chrome)',
        deviceType: 'Desktop',
        timeSpent: '3 hrs 05 mins',
        status: 'Active Now',
        isLive: true
      },
      {
        terminalId: 'DEV09',
        id: 'EMP-2026-34',
        name: 'Ananya Roy',
        role: 'Room Service Supervisor',
        avatarBg: 'bg-teal-600 text-white',
        initials: 'AR',
        email: 'ananya.r@aureliahotel.com',
        phone: '+91 98109 88721',
        deviceName: 'Room Service Handheld #03 (Android 14)',
        deviceType: 'Mobile',
        timeSpent: '42 mins',
        status: 'Active Now',
        isLive: true
      },
      {
        terminalId: 'DEV10',
        id: 'EMP-2026-38',
        name: 'Kabir Verma',
        role: 'Concierge & Valet Lead',
        avatarBg: 'bg-cyan-600 text-white',
        initials: 'KV',
        email: 'kabir.v@aureliahotel.com',
        phone: '+91 99105 44312',
        deviceName: 'Valet Desk Mobile POS (iOS 18 / Safari)',
        deviceType: 'Mobile',
        timeSpent: '1 hr 12 mins',
        status: 'Signed Out',
        isLive: false
      },
      {
        terminalId: 'DEV11',
        id: 'EMP-2026-41',
        name: 'Neha Sharma',
        role: 'Accounts & Finance',
        avatarBg: 'bg-violet-600 text-white',
        initials: 'NS',
        email: 'neha.s@aureliahotel.com',
        phone: '+91 98765 10293',
        deviceName: 'Finance Workstation #01 (Win 11 / Chrome)',
        deviceType: 'Desktop',
        timeSpent: '2 hrs 50 mins',
        status: 'Active Now',
        isLive: true
      },
      {
        terminalId: 'DEV12',
        id: 'EMP-2026-45',
        name: 'Devendra Kulkarni',
        role: 'Bar & Lounge Manager',
        avatarBg: 'bg-orange-600 text-white',
        initials: 'DK',
        email: 'devendra.k@aureliahotel.com',
        phone: '+91 98211 90345',
        deviceName: 'Sky Lounge POS Tablet (Android Tab S9)',
        deviceType: 'Tablet',
        timeSpent: '1 hr 30 mins',
        status: 'Idle (8m)',
        isLive: false
      }
    ].filter(s => {
      try {
        const removed = JSON.parse(localStorage.getItem('aurelia_deleted_device_sessions') || '[]');
        return !removed.includes(s.terminalId) && !removed.includes(s.id);
      } catch (e) { return true; }
    });
  }

  function getDeviceTypeIconSvg(deviceType) {
    const t = (deviceType || '').toLowerCase();
    if (t === 'mobile') {
      return `<svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`;
    } else if (t === 'tablet') {
      return `<svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`;
    }
    return `<svg class="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`;
  }

  // Sync "User Login & Device Activity" card height cleanly to match "Unpaid Salaries"
  function syncDeviceActivityCardHeight() {
    const deviceCard = document.getElementById('card-device-activity');
    const unpaidCard = document.getElementById('card-unpaid-salaries');
    if (!deviceCard || !unpaidCard) return;

    const targetHeight = Math.round(unpaidCard.getBoundingClientRect().height);
    if (window.innerWidth >= 1024) {
      if (targetHeight > 200) {
        deviceCard.style.height = targetHeight + 'px';
        deviceCard.style.minHeight = targetHeight + 'px';
        deviceCard.style.maxHeight = targetHeight + 'px';
      }
    } else {
      const mobileFixed = targetHeight > 200 ? targetHeight : 480;
      deviceCard.style.height = mobileFixed + 'px';
      deviceCard.style.minHeight = mobileFixed + 'px';
      deviceCard.style.maxHeight = mobileFixed + 'px';
    }
  }

  // Observe size changes on Unpaid Salaries & window resize so cards always stay aligned
  (function initDeviceActivityHeightSync() {
    const unpaidCard = document.getElementById('card-unpaid-salaries');
    if (unpaidCard && typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => syncDeviceActivityCardHeight());
      ro.observe(unpaidCard);
    }
    window.addEventListener('resize', syncDeviceActivityCardHeight);
  })();

  // User Login Sessions & Device Activity in Dashboard (Filtered by Device Type; internal scroll handles overflow)
  function renderDashboardRecentTransactions() {
    const $tbody = $('#dashboard-recent-trans-tbody');
    if (!$tbody.length) return;
    $tbody.empty();

    const selectedFilter = ($('#select-trans-payment-method').val() || 'all').toLowerCase();
    const sessions = getAllDeviceSessions();

    let filtered = sessions;
    if (selectedFilter !== 'all') {
      filtered = sessions.filter(s => s.deviceType.toLowerCase() === selectedFilter);
    }

    if (filtered.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="4" class="py-8 text-center text-slate-400 font-medium">
            No active login sessions found for device filter (${escapeHtml(selectedFilter)}).
          </td>
        </tr>
      `);
      requestAnimationFrame(syncDeviceActivityCardHeight);
      return;
    }

    filtered.forEach((row) => {
      const deviceIcon = getDeviceTypeIconSvg(row.deviceType);

      $tbody.append(`
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors" data-id="${escapeHtml(row.terminalId || row.id)}">
          <td class="py-3 px-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#FCA311] text-black inline-block shadow-2xs whitespace-nowrap">${escapeHtml(row.id)}</span>
          </td>
          <td class="py-2.5 px-3 whitespace-nowrap">
            <div class="flex items-center space-x-2.5 whitespace-nowrap">
              <div class="w-7 h-7 rounded-full ${row.avatarBg} flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-xs">${escapeHtml(row.initials)}</div>
              <div class="flex flex-col whitespace-nowrap">
                <span class="font-semibold text-slate-900 dark:text-white leading-tight whitespace-nowrap">${escapeHtml(row.name)}</span>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">${escapeHtml(row.role)}</span>
              </div>
            </div>
          </td>
          <td class="py-2.5 px-3 whitespace-nowrap">
            <div class="flex flex-col text-xs whitespace-nowrap">
              <span class="text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">${escapeHtml(row.email)}</span>
              <span class="text-slate-500 dark:text-slate-400 text-[11px] font-mono whitespace-nowrap">${escapeHtml(row.phone)}</span>
            </div>
          </td>
          <td class="py-2.5 px-3 whitespace-nowrap">
            <div class="flex items-center space-x-2 whitespace-nowrap">
              ${deviceIcon}
              <span class="text-slate-700 dark:text-slate-300 font-medium text-xs whitespace-nowrap">${escapeHtml(row.deviceName)}</span>
            </div>
          </td>
        </tr>
      `);
    });

    requestAnimationFrame(syncDeviceActivityCardHeight);
  }

  // Filter login sessions on Device Type change
  $(document).on('change', '#select-trans-payment-method', function () {
    renderDashboardRecentTransactions();
  });

  // =========================================================================
  // ALL CONNECTED DEVICES MODAL CONTROLLER ("See all >" Popup)
  // =========================================================================
  let activeModalDeviceFilter = 'all';

  function renderAllDevicesModal() {
    const $tbody = $('#modal-devices-tbody');
    const $empty = $('#modal-devices-empty');
    if (!$tbody.length) return;

    const allDevices = getAllDeviceSessions();
    const searchQuery = ($('#modal-devices-search').val() || '').trim().toLowerCase();

    // Update top metric strip & tab counts
    const totalCount = allDevices.length;
    const liveCount = allDevices.filter(d => d.isLive).length;
    const desktopCount = allDevices.filter(d => d.deviceType.toLowerCase() === 'desktop').length;
    const tabletCount = allDevices.filter(d => d.deviceType.toLowerCase() === 'tablet').length;
    const mobileCount = allDevices.filter(d => d.deviceType.toLowerCase() === 'mobile').length;

    $('#modal-devices-count-badge').text(`${totalCount} Devices`);
    $('#modal-devices-stat-total').text(`${totalCount} Devices`);
    $('#modal-devices-stat-live').text(`${liveCount} Active`);
    $('#modal-devices-stat-desktop').text(`${desktopCount} Stations`);
    $('#modal-devices-stat-portable').text(`${tabletCount + mobileCount} Devices`);
    $('#modal-devices-badge-all').text(totalCount);
    $('#modal-devices-badge-desktop').text(desktopCount);
    $('#modal-devices-badge-tablet').text(tabletCount);
    $('#modal-devices-badge-mobile').text(mobileCount);

    let filtered = allDevices;
    if (activeModalDeviceFilter !== 'all') {
      filtered = filtered.filter(d => d.deviceType.toLowerCase() === activeModalDeviceFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchQuery) ||
        d.id.toLowerCase().includes(searchQuery) ||
        d.terminalId.toLowerCase().includes(searchQuery) ||
        d.deviceName.toLowerCase().includes(searchQuery) ||
        d.email.toLowerCase().includes(searchQuery) ||
        d.role.toLowerCase().includes(searchQuery)
      );
    }

    $tbody.empty();
    if (filtered.length === 0) {
      $empty.removeClass('hidden');
      $('#modal-devices-footer-count').text(`Showing 0 of ${totalCount} devices`);
      return;
    }
    $empty.addClass('hidden');
    $('#modal-devices-footer-count').text(`Showing ${filtered.length} of ${totalCount} devices`);

    filtered.forEach((row) => {
      const deviceIcon = getDeviceTypeIconSvg(row.deviceType);
      const statusPill = row.isLive
        ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/50 whitespace-nowrap">${escapeHtml(row.status)}</span>`
        : row.status === 'Signed Out'
          ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-800/50 whitespace-nowrap">${escapeHtml(row.status)}</span>`
          : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/50 whitespace-nowrap">${escapeHtml(row.status)}</span>`;

      $tbody.append(`
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-2.5 px-3 whitespace-nowrap">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#EBF1FD] dark:bg-blue-950/60 text-[#1D4ED8] dark:text-blue-300 border border-[#D7E3FC] dark:border-blue-900/60 font-mono whitespace-nowrap">${escapeHtml(row.terminalId)}</span>
          </td>
          <td class="py-2.5 px-3 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#FCA311] text-black inline-block shadow-2xs whitespace-nowrap">${escapeHtml(row.id)}</span>
          </td>
          <td class="py-2.5 px-3 whitespace-nowrap">
            <div class="flex items-center space-x-2.5 whitespace-nowrap">
              <div class="w-7 h-7 rounded-full ${row.avatarBg} flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-xs">${escapeHtml(row.initials)}</div>
              <div class="flex flex-col whitespace-nowrap">
                <span class="font-semibold text-slate-900 dark:text-white leading-tight whitespace-nowrap">${escapeHtml(row.name)}</span>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">${escapeHtml(row.role)}</span>
              </div>
            </div>
          </td>
          <td class="py-2.5 px-3 whitespace-nowrap">
            <div class="flex flex-col text-xs whitespace-nowrap">
              <span class="text-slate-800 dark:text-slate-200 font-medium whitespace-nowrap">${escapeHtml(row.email)}</span>
              <span class="text-slate-500 dark:text-slate-400 text-[11px] font-mono whitespace-nowrap">${escapeHtml(row.phone)}</span>
            </div>
          </td>
          <td class="py-2.5 px-3 whitespace-nowrap">
            <div class="flex items-center space-x-2 whitespace-nowrap">
              ${deviceIcon}
              <span class="text-slate-700 dark:text-slate-300 font-medium text-xs whitespace-nowrap">${escapeHtml(row.deviceName)}</span>
            </div>
          </td>
          <td class="py-3 px-3 whitespace-nowrap">
            <span class="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">${escapeHtml(row.timeSpent)}</span>
          </td>
          <td class="py-3 px-3 text-center whitespace-nowrap">
            ${statusPill}
          </td>
        </tr>
      `);
    });
  }

  $(document).on('click', '.tab-device-filter', function () {
    activeModalDeviceFilter = ($(this).data('type') || 'all').toLowerCase();
    $('.tab-device-filter').removeClass('bg-[#14213D] text-white').addClass('text-slate-600 dark:text-slate-300');
    $(this).addClass('bg-[#14213D] text-white').removeClass('text-slate-600 dark:text-slate-300');
    renderAllDevicesModal();
  });

  $(document).on('input keyup', '#modal-devices-search', function () {
    renderAllDevicesModal();
  });

  // =========================================================================
  // 5. BILLING & POS MANAGEMENT ENGINE
  // =========================================================================

  function initBillingSection() {
    const todayStr = getTodayDateStr();
    const $historyToInput = $('#filter-history-date-to');
    if ($historyToInput.length && (!$historyToInput.val() || $historyToInput.val() < todayStr)) {
      $historyToInput.val(todayStr);
    }

    initNewBillForm();
    renderBillingHistory();
    consumePendingOrderForBilling();
    consumeResumeDraftBill();

    const path = window.location.pathname;
    if (path.includes('billing-details')) {
      switchBillingSubtab('history');
    } else if (path.includes('add-bill') || path.includes('billing')) {
      switchBillingSubtab('create');
    }

    try {
      const savedMsg = sessionStorage.getItem('aurelia_billing_saved_msg');
      if (savedMsg) {
        sessionStorage.removeItem('aurelia_billing_saved_msg');
        showToast(savedMsg, 'success');
      }
    } catch (e) { }
  }

  function populateBillingFromOrder(ord) {
    if (!ord) return;
    switchBillingSubtab('create');
    clearBillForm();

    const customers = Storage.get(STORAGE_KEYS.CUSTOMERS) || [];
    const ordPhoneDigits = String(ord.customerPhone || '').replace(/\D/g, '');
    const ordNameNorm = String(ord.customerName || '').trim().toLowerCase();
    const matchedCust = customers.find(c =>
      (ordPhoneDigits && c.phone && String(c.phone).replace(/\D/g, '') === ordPhoneDigits) ||
      (ordNameNorm && c.name && c.name.trim().toLowerCase() === ordNameNorm)
    );

    if (matchedCust && $(`#select-customer-dropdown option[value="${matchedCust.id}"]`).length) {
      $('input[name="customer-type"][value="existing"]').prop('checked', true);
      $('#wrapper-walkin-customer').addClass('hidden');
      $('#wrapper-existing-customer').removeClass('hidden');
      $('#select-customer-dropdown').val(matchedCust.id).trigger('change');
    } else {
      $('input[name="customer-type"][value="walkin"]').prop('checked', true);
      $('#wrapper-existing-customer').addClass('hidden');
      $('#wrapper-walkin-customer').removeClass('hidden');
      $('#input-walkin-name').val(ord.customerName || '');
      $('#input-walkin-phone').val(ord.customerPhone || '');
      $('#input-walkin-email').val(ord.customerEmail || '');
    }

    $('#input-bill-tableref').val(ord.tableRoom || '');
    $('#linked-order-banner').removeClass('hidden');
    $('#linked-order-id-label').text(ord.orderNumber || ord.id);
    $('#input-linked-order-id').val(ord.id);

    const menuItems = Storage.get(STORAGE_KEYS.MENU) || [];
    currentBillItems = (ord.items || []).map(it => {
      const menuMatch = menuItems.find(m => m.id === it.id || (m.name && it.name && m.name.toLowerCase() === it.name.toLowerCase()));
      const price = Number(it.price) || 0;
      const qty = Number(it.qty) || 1;
      return {
        id: it.id || ('item-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)),
        name: it.name,
        category: (menuMatch && menuMatch.category) || it.category || 'Dining',
        price: price,
        qty: qty,
        subtotal: Math.round(price * qty * 100) / 100
      };
    });

    renderBillDraftItems();
    calculateLiveBillTotals();
    showToast(`Order ${ord.orderNumber || ord.id} loaded into billing draft.`, 'success');
  }

  function consumePendingOrderForBilling() {
    let pendingOrderId = null;
    try {
      pendingOrderId = localStorage.getItem(STORAGE_KEYS.PENDING_ORDER_BILL);
    } catch (e) {
      pendingOrderId = null;
    }
    if (!pendingOrderId || $('#form-create-bill').length === 0) return false;

    try {
      localStorage.removeItem(STORAGE_KEYS.PENDING_ORDER_BILL);
    } catch (e) { /* ignore */ }

    const orders = Storage.get(STORAGE_KEYS.ORDERS) || [];
    const ord = orders.find(o => o.id === pendingOrderId || o.orderNumber === pendingOrderId);
    if (!ord) return false;

    populateBillingFromOrder(ord);
    return true;
  }

  function convertOrderToBilling(orderId) {
    if (!orderId) return;
    const orders = Storage.get(STORAGE_KEYS.ORDERS) || [];
    const ord = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!ord) {
      showToast('Unable to locate order for billing.', 'error');
      return;
    }

    if ($('#form-create-bill').length === 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.PENDING_ORDER_BILL, ord.id);
      } catch (e) { /* ignore */ }
      const isSubdir = window.location.pathname.includes('/department') || window.location.pathname.includes('/human-resources');
      const isBillingSubdir = window.location.pathname.includes('/billing-management');
      window.location.href = isBillingSubdir ? 'add-bill.html' : (isSubdir ? '../billing-management/add-bill.html' : 'billing-management/add-bill.html');
      return;
    }

    window.location.hash = 'billing';
    switchSection('billing');
    populateBillingFromOrder(ord);
  }

  function switchBillingSubtab(subtab) {
    if (subtab === 'history') {
      $('#tab-btn-create-bill').removeClass('bg-[#14213D] text-white').addClass('text-[#14213D] hover:text-[#000000]');
      $('#tab-btn-billing-history').addClass('bg-[#14213D] text-white').removeClass('text-[#14213D] hover:text-[#000000]');
      $('#subtab-create-bill').addClass('hidden');
      $('#subtab-billing-history').removeClass('hidden');
      renderBillingHistory();
    } else {
      $('#tab-btn-billing-history').removeClass('bg-[#14213D] text-white').addClass('text-[#14213D] hover:text-[#000000]');
      $('#tab-btn-create-bill').addClass('bg-[#14213D] text-white').removeClass('text-[#14213D] hover:text-[#000000]');
      $('#subtab-billing-history').addClass('hidden');
      $('#subtab-create-bill').removeClass('hidden');
    }
  }

  $('#tab-btn-create-bill').on('click', () => switchBillingSubtab('create'));
  $('#tab-btn-billing-history').on('click', () => switchBillingSubtab('history'));

  function initNewBillForm() {
    const nextBillNum = generateNextBillNumber();
    $('#input-bill-number').val(nextBillNum);
    $('#bill-number-display').text(nextBillNum);

    const now = new Date();
    $('#bill-date-display').text(formatDateTime(now.toISOString()));

    populateCustomerDropdown();
    populateMenuItemPicker();

    calculateLiveBillTotals();
  }

  function generateNextBillNumber() {
    const bills = Storage.get(STORAGE_KEYS.BILLS);
    let maxId = 142;
    bills.forEach(b => {
      const match = (b.billNumber || '').match(/INV-2026-(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxId) maxId = num;
      }
    });
    return 'INV-2026-' + String(maxId + 1).padStart(4, '0');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim().toLowerCase());
  }

  function populateCustomerDropdown() {
    const customers = (Storage.get(STORAGE_KEYS.CUSTOMERS) || []).slice();
    customers.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));
    const $select = $('#select-customer-dropdown');
    $select.find('option:not(:first)').remove();
    customers.forEach(c => {
      $select.append(`<option value="${c.id}" data-name="${escapeHtml(c.name)}" data-phone="${escapeHtml(c.phone)}" data-email="${escapeHtml(c.email || '')}" data-addr="${escapeHtml(c.address || '')}">${escapeHtml(c.name)} (${c.phone})</option>`);
    });
  }

  function populateMenuItemPicker() {
    const menu = Storage.get(STORAGE_KEYS.MENU);
    const $select = $('#select-menu-item-picker');
    $select.find('option:not(:first)').remove();
    menu.filter(m => m.available).forEach(item => {
      $select.append(`<option value="${item.id}" data-name="${escapeHtml(item.name)}" data-price="${item.price}" data-cat="${escapeHtml(item.category)}">${escapeHtml(item.name)} (${formatMoney(item.price)})</option>`);
    });
  }

  // Customer Radio Switch
  $('input[name="customer-type"]').on('change', function () {
    if ($(this).val() === 'walkin') {
      $('#wrapper-existing-customer').addClass('hidden');
      $('#wrapper-walkin-customer').removeClass('hidden');
    } else {
      $('#wrapper-walkin-customer').addClass('hidden');
      $('#wrapper-existing-customer').removeClass('hidden');
    }
  });

  $('#select-customer-dropdown').on('change', function () {
    const $opt = $(this).find('option:selected');
    const phone = $opt.data('phone') || '';
    const email = $opt.data('email') || '';
    const addr = $opt.data('addr') || '';
    $('#input-customer-phone-preview').val(phone ? `${phone} | ${addr}` : '');
    $('#input-customer-email').val(email || '');
    $('#err-customer-select').addClass('hidden');
    if (email && isValidEmail(email)) {
      $('#err-customer-email').addClass('hidden');
    }
  });

  $('#input-customer-email').on('input', function () {
    const val = $.trim($(this).val());
    if (val && isValidEmail(val)) {
      $('#err-customer-email').addClass('hidden');
    }
  });

  $('#input-walkin-email').on('input', function () {
    const val = $.trim($(this).val());
    if (val && isValidEmail(val)) {
      $('#err-walkin-email').addClass('hidden');
    }
  });

  // Discount Type Switcher
  $('#btn-discount-pct').on('click', function () {
    currentDiscountType = 'percent';
    $(this).addClass('bg-[#14213D] text-white').removeClass('text-slate-500');
    $('#btn-discount-flat').removeClass('bg-[#14213D] text-white').addClass('text-slate-500');
    calculateLiveBillTotals();
  });

  $('#btn-discount-flat').on('click', function () {
    currentDiscountType = 'flat';
    $(this).addClass('bg-[#14213D] text-white').removeClass('text-slate-500');
    $('#btn-discount-pct').removeClass('bg-[#14213D] text-white').addClass('text-slate-500');
    calculateLiveBillTotals();
  });

  $('#input-discount-val').on('input change keyup', calculateLiveBillTotals);

  // Add Item to Bill Draft
  $('#btn-add-item-to-bill').on('click', function () {
    const $opt = $('#select-menu-item-picker').find('option:selected');
    const id = $opt.val();
    if (!id) {
      showToast('Please select a menu item first.', 'error');
      return;
    }

    const name = $opt.data('name') || $opt.attr('data-name') || 'Item';
    const category = $opt.data('cat') || $opt.attr('data-cat') || 'General';
    const rawPrice = $opt.data('price') !== undefined ? $opt.data('price') : $opt.attr('data-price');
    const price = Number(rawPrice) || 0;
    const qty = parseInt($('#input-item-qty').val(), 10) || 1;

    const existing = currentBillItems.find(it => it.id === id);
    if (existing) {
      existing.qty += qty;
      existing.subtotal = Math.round(existing.qty * existing.price * 100) / 100;
    } else {
      currentBillItems.push({
        id: id,
        name: name,
        category: category,
        price: price,
        qty: qty,
        subtotal: Math.round(price * qty * 100) / 100
      });
    }

    $('#select-menu-item-picker').val('');
    $('#input-item-qty').val(1);

    renderBillDraftItems();
    calculateLiveBillTotals();
  });

  function renderBillDraftItems() {
    const $tbody = $('#bill-items-tbody');
    $tbody.empty();

    if (currentBillItems.length === 0) {
      $('#bill-items-empty').removeClass('hidden');
    } else {
      $('#bill-items-empty').addClass('hidden');
      currentBillItems.forEach((it, idx) => {
        $tbody.append(`
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors" data-index="${idx}">
            <td class="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">${escapeHtml(it.name)}</td>
            <td class="py-2.5 px-3 text-slate-500 font-medium">${escapeHtml(it.category || 'General')}</td>
            <td class="py-2.5 px-2 text-center">
              <input type="number" min="1" max="99" value="${it.qty}" class="bill-item-qty-input Aurelia-input w-16 py-1 px-1.5 text-center text-xs font-bold" data-index="${idx}">
            </td>
            <td class="py-2.5 px-3 text-center text-slate-600 dark:text-slate-300">${formatMoney(it.price)}</td>
            <td class="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white bill-item-subtotal">${formatMoney(it.subtotal)}</td>
            <td class="py-2.5 px-2 text-center">
              <button type="button" class="btn-remove-bill-item text-rose-500 hover:text-rose-700 font-bold text-base cursor-pointer" data-index="${idx}" title="Remove item">&times;</button>
            </td>
          </tr>
        `);
      });
    }
  }

  // Live quantity change without destroying input element while typing
  function updateBillItemQty($input, isBlur) {
    const idx = parseInt($input.data('index'), 10);
    const rawVal = $input.val();
    if (!isBlur && rawVal === '') return;
    let newQty = Math.min(99, Math.max(1, parseInt(rawVal, 10) || 1));
    if (isBlur) $input.val(newQty);
    if (currentBillItems[idx]) {
      currentBillItems[idx].qty = newQty;
      currentBillItems[idx].subtotal = Math.round(newQty * Number(currentBillItems[idx].price || 0) * 100) / 100;
      $input.closest('tr').find('.bill-item-subtotal').text(formatMoney(currentBillItems[idx].subtotal));
      calculateLiveBillTotals();
    }
  }

  $(document).on('input', '.bill-item-qty-input', function () { updateBillItemQty($(this), false); });
  $(document).on('change blur', '.bill-item-qty-input', function () { updateBillItemQty($(this), true); });

  $(document).on('click', '.btn-remove-bill-item', function () {
    const idx = parseInt($(this).data('index'), 10);
    if (!isNaN(idx) && idx >= 0 && idx < currentBillItems.length) {
      currentBillItems.splice(idx, 1);
      renderBillDraftItems();
      calculateLiveBillTotals();
    }
  });

  function calculateLiveBillTotals() {
    const subtotal = currentBillItems.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0);
    const rawDiscount = parseFloat($('#input-discount-val').val());
    const discountVal = (isNaN(rawDiscount) || rawDiscount < 0) ? 0 : rawDiscount;

    let discountAmount = 0;
    const discType = (typeof currentDiscountType !== 'undefined' && currentDiscountType) ? currentDiscountType : 'percent';
    if (discType === 'percent') {
      discountAmount = (subtotal * Math.min(100, Math.max(0, discountVal))) / 100;
    } else {
      discountAmount = Math.min(subtotal, Math.max(0, discountVal));
    }
    discountAmount = Math.round(discountAmount * 100) / 100;

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // GST 5% (CGST 2.5% + SGST 2.5%)
    const taxRate = 5;
    const taxAmount = Math.round(((discountedSubtotal * taxRate) / 100) * 100) / 100;
    const cgst = Math.round((taxAmount / 2) * 100) / 100;
    const sgst = Math.round((taxAmount - cgst) * 100) / 100;

    const grandTotal = Math.round((discountedSubtotal + taxAmount) * 100) / 100;

    $('#summary-subtotal').text(formatMoney(subtotal));
    $('#summary-discount-amount').text('- ' + formatMoney(discountAmount));
    $('#summary-cgst').text(formatMoney(cgst));
    $('#summary-sgst').text(formatMoney(sgst));
    $('#summary-tax-amount').text(formatMoney(taxAmount));
    $('#summary-grand-total').text(formatMoney(grandTotal));

    return {
      subtotal,
      discountAmount,
      taxRate,
      taxAmount,
      cgst,
      sgst,
      grandTotal
    };
  }

  function consumeResumeDraftBill() {
    try {
      const raw = sessionStorage.getItem('aurelia_bill_resume_draft');
      if (!raw) return;
      sessionStorage.removeItem('aurelia_bill_resume_draft');
      const bill = JSON.parse(raw);
      if (!bill) return;

      $('#form-create-bill').data('draft-id', bill.id);

      currentBillItems = (bill.items || []).map(it => ({
        id: it.id || ('item-' + Date.now() + Math.random()),
        name: it.name,
        category: it.category || 'Special',
        price: Number(it.price) || 0,
        qty: Number(it.qty) || 1,
        subtotal: Number(it.subtotal) || (Number(it.price) * Number(it.qty))
      }));

      $('#input-bill-number').val(bill.billNumber || generateNextBillNumber());
      $('#bill-number-display').text($('#input-bill-number').val());
      $('#input-bill-tableref').val(bill.tableRoom || '');

      if (bill.customerName && bill.customerName !== 'Draft Guest' && bill.customerName !== 'Walk-in Guest') {
        $('input[name="customer-type"][value="walkin"]').prop('checked', true);
        $('#wrapper-existing-customer').addClass('hidden');
        $('#wrapper-walkin-customer').removeClass('hidden');
        $('#input-walkin-name').val(bill.customerName);
        $('#input-walkin-phone').val(bill.customerPhone && bill.customerPhone !== '-' ? bill.customerPhone : '');
        $('#input-walkin-email').val(bill.customerEmail || '');
      }

      if (bill.discountVal) {
        $('#input-discount-val').val(bill.discountVal);
        if (bill.discountType === 'flat') {
          $('#btn-discount-flat').click();
        } else {
          $('#btn-discount-pct').click();
        }
      }

      renderBillDraftItems();
      calculateLiveBillTotals();
      showToast(`Draft ${bill.billNumber} loaded into editor.`, 'info');
    } catch (e) {
      console.warn('Error loading resume draft:', e);
    }
  }

  function clearBillForm() {
    currentBillItems = [];
    $('#form-create-bill')[0].reset();
    $('#form-create-bill').removeData('draft-id');
    $('#input-discount-val').val('0');
    currentDiscountType = 'percent';
    $('#btn-discount-pct').addClass('bg-[#14213D] text-white').removeClass('text-slate-500');
    $('#btn-discount-flat').removeClass('bg-[#14213D] text-white').addClass('text-slate-500');
    $('#linked-order-banner').addClass('hidden');
    $('#input-linked-order-id').val('');
    $('#input-customer-email').val('');
    $('#input-walkin-email').val('');
    $('#err-customer-email, #err-walkin-email, #err-customer-select, #err-walkin-name, #err-walkin-phone').addClass('hidden');
    $('#check-send-email-invoice, #check-walkin-send-email').prop('checked', true);
    $('#wrapper-walkin-customer').addClass('hidden');
    $('#wrapper-existing-customer').removeClass('hidden');
    $('input[name="customer-type"][value="existing"]').prop('checked', true);

    initNewBillForm();
    renderBillDraftItems();
    calculateLiveBillTotals();
  }

  $('#btn-clear-bill-draft').on('click', function (e) {
    e.preventDefault();
    if (currentBillItems.length === 0) {
      showToast('Please add at least one item before saving as draft.', 'warning');
      return;
    }

    const customerType = $('input[name="customer-type"]:checked').val();
    let customerName = '';
    let customerPhone = '';
    let customerEmail = '';
    let customerAddress = '';
    let customerId = null;

    if (customerType === 'existing') {
      const $opt = $('#select-customer-dropdown').find('option:selected');
      customerId = $opt.val() || null;
      if (customerId) {
        customerName = $opt.data('name') || '';
        customerPhone = $opt.data('phone') || '';
        customerAddress = $opt.data('addr') || '';
      }
      customerEmail = $.trim($('#input-customer-email').val());
    } else {
      customerName = $.trim($('#input-walkin-name').val());
      customerPhone = $.trim($('#input-walkin-phone').val());
      customerEmail = $.trim($('#input-walkin-email').val());
    }

    if (!customerName) {
      customerName = 'Draft Guest';
    }

    const billNumber = $('#input-bill-number').val() || generateNextBillNumber();
    const tableRoom = $.trim($('#input-bill-tableref').val()) || 'Counter 01';
    const paymentMethod = $('#select-payment-method').val() || 'Unpaid';
    const linkedOrderId = $('#input-linked-order-id').val() || null;
    const totals = calculateLiveBillTotals();

    const existingDraftId = $('#form-create-bill').data('draft-id');
    const draftId = existingDraftId || ('bill-draft-' + Date.now());

    const draftBill = {
      id: draftId,
      billNumber: billNumber,
      date: new Date().toISOString(),
      customerName: customerName,
      customerPhone: customerPhone || '-',
      customerEmail: customerEmail || '',
      customerAddress: customerAddress || '',
      tableRoom: tableRoom,
      paymentMethod: paymentMethod,
      status: 'Draft',
      emailSent: false,
      linkedOrderId: linkedOrderId,
      taxRate: totals.taxRate,
      subtotal: totals.subtotal,
      discountType: currentDiscountType,
      discountVal: parseFloat($('#input-discount-val').val()) || 0,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      grandTotal: totals.grandTotal,
      items: JSON.parse(JSON.stringify(currentBillItems))
    };

    const bills = Storage.get(STORAGE_KEYS.BILLS, []);
    if (existingDraftId) {
      const idx = bills.findIndex(b => b.id === existingDraftId);
      if (idx !== -1) {
        bills[idx] = draftBill;
      } else {
        bills.unshift(draftBill);
      }
    } else {
      bills.unshift(draftBill);
    }
    Storage.set(STORAGE_KEYS.BILLS, bills);

    clearBillForm();
    renderBillingHistory();
    renderDashboard();
    renderSidebarBadges();

    showToast(`Invoice ${billNumber} saved as Draft. View anytime in Billing Details.`, 'success');
  });

  // Unlink Order
  $('#btn-clear-linked-order').on('click', function () {
    $('#input-linked-order-id').val('');
    $('#linked-order-banner').addClass('hidden');
    showToast('Unlinked from kitchen order.', 'info');
  });

  // Save / Complete Bill Process
  function processSaveBill(andPrint = false, andPdf = false) {
    if (currentBillItems.length === 0) {
      showToast('Please add at least one menu item to the invoice.', 'error');
      return null;
    }

    const customerType = $('input[name="customer-type"]:checked').val();
    let customerName = '';
    let customerPhone = '';
    let customerEmail = '';
    let customerAddress = '';
    let customerId = null;
    let shouldSendEmail = true;

    if (customerType === 'existing') {
      const $opt = $('#select-customer-dropdown').find('option:selected');
      customerId = $opt.val();
      if (!customerId) {
        $('#err-customer-select').removeClass('hidden');
        showToast('Please select a saved customer or use walk-in guest.', 'error');
        return null;
      }
      customerName = $opt.data('name');
      customerPhone = $opt.data('phone');
      customerAddress = $opt.data('addr');
      customerEmail = $.trim($('#input-customer-email').val());

      if (!customerEmail || !isValidEmail(customerEmail)) {
        $('#err-customer-email').removeClass('hidden');
        $('#input-customer-email').focus();
        showToast('Valid guest email address is required for digital e-invoice generation.', 'error');
        return null;
      }
      $('#err-customer-email').addClass('hidden');
      shouldSendEmail = $('#check-send-email-invoice').is(':checked');
    } else {
      customerName = $.trim($('#input-walkin-name').val());
      customerPhone = $.trim($('#input-walkin-phone').val());
      customerEmail = $.trim($('#input-walkin-email').val());

      if (!customerName) {
        $('#err-walkin-name').removeClass('hidden');
        $('#input-walkin-name').focus();
        return null;
      }
      if (!customerPhone || customerPhone.length < 8) {
        $('#err-walkin-phone').removeClass('hidden');
        $('#input-walkin-phone').focus();
        return null;
      }
      if (!customerEmail || !isValidEmail(customerEmail)) {
        $('#err-walkin-email').removeClass('hidden');
        $('#input-walkin-email').focus();
        showToast('Valid guest email address is required (e.g. guest@domain.com).', 'error');
        return null;
      }
      $('#err-walkin-email').addClass('hidden');
      shouldSendEmail = $('#check-walkin-send-email').is(':checked');

      // Check if walk-in guest should be saved to directory
      if ($('#check-save-walkin').is(':checked')) {
        const customers = Storage.get(STORAGE_KEYS.CUSTOMERS);
        const newCust = {
          id: 'cust-' + Date.now(),
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          address: 'Walk-in Guest',
          visits: 1,
          totalSpend: 0
        };
        customers.unshift(newCust);
        Storage.set(STORAGE_KEYS.CUSTOMERS, customers);
        customerId = newCust.id;
        populateCustomerDropdown();
      }
    }

    const billNumber = $('#input-bill-number').val() || generateNextBillNumber();
    const tableRoom = $.trim($('#input-bill-tableref').val()) || 'Counter 01';
    const paymentMethod = $('#select-payment-method').val() || 'UPI';
    const linkedOrderId = $('#input-linked-order-id').val() || null;
    const totals = calculateLiveBillTotals();

    const newBill = {
      id: 'bill-' + Date.now(),
      billNumber: billNumber,
      date: new Date().toISOString(),
      customerName: customerName,
      customerPhone: customerPhone,
      customerEmail: customerEmail,
      customerAddress: customerAddress || '',
      tableRoom: tableRoom,
      paymentMethod: paymentMethod,
      status: 'Paid',
      emailSent: shouldSendEmail,
      linkedOrderId: linkedOrderId,
      taxRate: totals.taxRate,
      subtotal: totals.subtotal,
      discountType: currentDiscountType,
      discountVal: parseFloat($('#input-discount-val').val()) || 0,
      discountAmount: totals.discountAmount,
      taxAmount: totals.taxAmount,
      grandTotal: totals.grandTotal,
      items: JSON.parse(JSON.stringify(currentBillItems))
    };

    const existingDraftId = $('#form-create-bill').data('draft-id');
    const bills = Storage.get(STORAGE_KEYS.BILLS);
    if (existingDraftId) {
      const draftIdx = bills.findIndex(b => b.id === existingDraftId);
      if (draftIdx !== -1) bills.splice(draftIdx, 1);
    }
    bills.unshift(newBill);
    Storage.set(STORAGE_KEYS.BILLS, bills);

    // Update customer spend
    if (customerId) {
      const customers = Storage.get(STORAGE_KEYS.CUSTOMERS);
      const c = customers.find(x => x.id === customerId);
      if (c) {
        c.visits = (c.visits || 0) + 1;
        c.totalSpend = (c.totalSpend || 0) + totals.grandTotal;
        Storage.set(STORAGE_KEYS.CUSTOMERS, customers);
      }
    }

    // Update linked order status to Completed
    if (linkedOrderId) {
      const orders = Storage.get(STORAGE_KEYS.ORDERS);
      const ord = orders.find(o => o.id === linkedOrderId || o.orderNumber === linkedOrderId);
      if (ord) {
        ord.status = 'Completed';
        ord.billNumber = billNumber;
        Storage.set(STORAGE_KEYS.ORDERS, orders);
      }
    }

    if (shouldSendEmail) {
      showToast(`Invoice ${billNumber} saved! Digital copy dispatched to ${customerEmail}.`, 'success');
    } else {
      showToast(`Invoice ${billNumber} saved successfully. View anytime in Billing Details.`, 'success');
    }

    // Trigger Print or PDF
    if (andPrint) {
      printInvoiceReceipt(newBill);
    } else if (andPdf) {
      downloadInvoicePDF(newBill);
    }

    clearBillForm();
    renderBillingHistory();
    renderDashboard();
    renderSidebarBadges();

    return newBill;
  }

  // Submit Button Handler (saves to website without downloading or redirecting)
  $('#btn-download-bill').on('click', function (e) {
    e.preventDefault();
    processSaveBill(false, false);
  });

  // Print Button Handler (saves and triggers printer dialog)
  $('#btn-print-bill').on('click', function (e) {
    e.preventDefault();
    processSaveBill(true, false);
  });

  $('#form-create-bill').on('submit', function (e) {
    e.preventDefault();
    processSaveBill(false, false);
  });

  // Billing History Table
  function renderBillingHistory() {
    const bills = Storage.get(STORAGE_KEYS.BILLS);
    const search = $.trim($('#filter-history-search').val()).toLowerCase();
    const payFilter = $('#filter-history-payment').val();
    const fromDate = $('#filter-history-date-from').val();
    let toDate = $('#filter-history-date-to').val();
    if (!toDate && fromDate) {
      toDate = getTodayDateStr();
      $('#filter-history-date-to').val(toDate);
    }

    // Update billing details stat cards if present
    const totalBillingVal = bills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    const totalPaid = bills.filter(b => (b.status || 'Paid').toLowerCase() === 'paid').reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    const totalTax = bills.reduce((sum, b) => sum + (Number(b.taxAmount) || 0), 0);

    $('#billing-details-stat-total').text(formatMoney(totalBillingVal));
    $('#billing-details-stat-paid').text(formatMoney(totalPaid));
    $('#billing-details-stat-count').text(bills.length);
    $('#billing-details-stat-tax').text(formatMoney(totalTax));

    let filtered = bills.filter(b => {
      const matchSearch = !search ||
        (b.billNumber && b.billNumber.toLowerCase().includes(search)) ||
        (b.customerName && b.customerName.toLowerCase().includes(search)) ||
        (b.customerPhone && b.customerPhone.includes(search)) ||
        (b.status && b.status.toLowerCase().includes(search));

      const matchPay = !payFilter || (b.paymentMethod === payFilter) || (payFilter === 'Draft' && (b.status || '').toLowerCase() === 'draft') || (payFilter === 'Unpaid' && (b.paymentMethod === 'Unpaid' || (b.status || '').toLowerCase() === 'draft'));

      const bDate = (b.date || '').substring(0, 10);
      const matchFrom = !fromDate || (bDate >= fromDate);
      const matchTo = !toDate || (bDate <= toDate);

      return matchSearch && matchPay && matchFrom && matchTo;
    });

    const $tbody = $('#billing-history-tbody');
    $tbody.empty();

    if (filtered.length === 0) {
      $tbody.append(`
        <tr>
          <td colspan="7" class="py-8 text-center text-slate-400">No invoices match your filter criteria.</td>
        </tr>
      `);
    } else {
      filtered.forEach(b => {
        $tbody.append(`
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors" data-id="${escapeHtml(b.id)}">
            <td class="py-2.5 px-3 font-mono font-bold text-[#14213D] whitespace-nowrap">${escapeHtml(b.billNumber)}</td>
            <td class="py-2.5 px-3 whitespace-nowrap">
              <div class="inline-flex flex-col text-left whitespace-nowrap">
                <div class="font-bold text-slate-900 dark:text-white whitespace-nowrap">${escapeHtml(b.customerName)}</div>
                <div class="text-[11px] text-slate-400 font-mono whitespace-nowrap">${escapeHtml(b.customerPhone || '-')}</div>
                ${b.customerEmail ? `<div class="text-[10px] text-amber-600 font-medium whitespace-nowrap">${escapeHtml(b.customerEmail)}</div>` : ''}
              </div>
            </td>
            <td class="py-2.5 px-3 text-slate-500 font-medium whitespace-nowrap">${formatDateTime(b.date)}</td>
            <td class="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">${getPaymentMethodBadge(b.paymentMethod)}</td>
            <td class="py-2.5 px-3 text-center font-black text-slate-900 dark:text-white whitespace-nowrap">${formatMoney(b.grandTotal)}</td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">${getStatusBadge(b.status)}</td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">
              <div class="flex items-center justify-end space-x-1 whitespace-nowrap">
                <!-- View / Eye -->
                <button type="button" class="btn-view-bill p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="View Invoice" data-id="${b.id}">
                  <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                ${(b.status || '').toLowerCase() === 'draft' ? `
                <!-- Edit / Complete Draft -->
                <button type="button" class="btn-edit-bill p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Edit / Complete Draft" data-id="${b.id}">
                  <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </button>
                ` : `
                <!-- Print / Printer -->
                <button type="button" class="btn-print-bill-row p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Print Receipt" data-id="${b.id}">
                  <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                </button>
                `}
                <!-- Delete / Trash (Red) -->
                <button type="button" class="btn-delete-bill p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer" title="Delete Invoice" data-id="${b.id}">
                  <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        `);
      });
    }
  }

  $('#filter-history-search, #filter-history-payment, #filter-history-date-from, #filter-history-date-to').on('input change', renderBillingHistory);

  $('#btn-clear-history-dates').on('click', function () {
    $('#filter-history-date-from').val('');
    $('#filter-history-date-to').val('');
    renderBillingHistory();
  });

  // View Bill Modal
  function openInvoiceModal(bill) {
    if (!bill) return;
    $('#modal-bill-num-sub').text(bill.billNumber);

    let itemsHtml = (bill.items || []).map(it => `
      <div class="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-xs">
        <span class="text-slate-800 dark:text-slate-200">${it.qty}x ${escapeHtml(it.name)}</span>
        <span class="font-semibold text-slate-900 dark:text-white">${formatMoney(it.subtotal || (it.price * it.qty))}</span>
      </div>
    `).join('');

    const html = `
      <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3 font-sans">
        <div class="text-center pb-3 border-b border-slate-200 dark:border-slate-700">
          <div class="flex justify-center mb-1.5">
            <img src="assets/aurelia-mark.svg" alt="Aurelia" class="w-10 h-10 rounded-full shadow-xs object-contain">
          </div>
          <h4 class="text-base font-bold text-[#14213D] dark:text-white tracking-[0.22em] uppercase leading-none" style="font-family: 'Cormorant Garamond', Georgia, serif;">AURELIA</h4>
          <div class="w-8 h-[1.5px] bg-[#FCA311] mx-auto my-1"></div>
          <p class="text-[9px] font-semibold text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase leading-tight">Hotel &amp; Restaurant</p>
          <p class="text-[10px] text-slate-400 mt-1">Residency Road, Bengaluru, KA 560025 | GSTIN: 29AABCU9603R1Z7</p>
        </div>

        <div class="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
          <div>
            <p><strong>Bill:</strong> ${escapeHtml(bill.billNumber)}</p>
            <p><strong>Guest:</strong> ${escapeHtml(bill.customerName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(bill.customerEmail || '-')}</p>
            <p><strong>Ref:</strong> ${escapeHtml(bill.tableRoom || 'Counter 01')}</p>
          </div>
          <div class="text-right">
            <p><strong>Date:</strong> ${formatDateTime(bill.date)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(bill.customerPhone || '-')}</p>
            <p class="flex items-center gap-1.5"><strong>Mode:</strong> ${getPaymentMethodBadge(bill.paymentMethod)}</p>
            ${bill.customerEmail ? `<p class="text-emerald-600 font-semibold">✓ e-Invoice Dispatched</p>` : ''}
          </div>
        </div>

        <div class="py-2">
          ${itemsHtml}
        </div>

        <div class="space-y-1 text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
          <div class="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span>${formatMoney(bill.subtotal)}</span>
          </div>
          ${bill.discountAmount > 0 ? `
            <div class="flex justify-between text-rose-500">
              <span>Discount:</span>
              <span>- ${formatMoney(bill.discountAmount)}</span>
            </div>
          ` : ''}
          <div class="flex justify-between text-slate-500">
            <span>GST (5%):</span>
            <span>${formatMoney(bill.taxAmount)}</span>
          </div>
          <div class="flex justify-between font-black text-sm text-[#14213D] pt-1 border-t border-slate-200 dark:border-slate-700">
            <span>Grand Total:</span>
            <span>${formatMoney(bill.grandTotal)}</span>
          </div>
        </div>

        <div class="text-center pt-2 text-[10px] text-slate-400">
          Thank you for choosing Hotel Aurelia! Please visit again.
        </div>
      </div>
    `;

    $('#modal-invoice-content').html(html);

    $('#btn-modal-print-bill').off('click').on('click', () => printInvoiceReceipt(bill));
    $('#btn-modal-pdf-bill').off('click').on('click', () => downloadInvoicePDF(bill));
    $('#btn-modal-email-bill').off('click').on('click', function () {
      const email = bill.customerEmail;
      if (email && isValidEmail(email)) {
        showToast(`Tax invoice ${bill.billNumber} successfully dispatched to ${email}!`, 'success');
      } else {
        showToast('No valid email address recorded for this invoice.', 'error');
      }
    });

    $('#modal-view-bill').removeClass('hidden');
  }

  $(document).on('click', '.btn-edit-bill', function () {
    const id = $(this).data('id');
    const bills = Storage.get(STORAGE_KEYS.BILLS, []);
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    try {
      sessionStorage.setItem('aurelia_bill_resume_draft', JSON.stringify(bill));
    } catch (e) { }

    const isBillingSubdir = window.location.pathname.includes('/billing-management');
    const isDeptSubdir = window.location.pathname.includes('/department');
    const isHRSubdir = window.location.pathname.includes('/human-resources');
    const isSubdir = isDeptSubdir || isHRSubdir;
    const targetUrl = isBillingSubdir ? 'add-bill.html' : (isSubdir ? '../billing-management/add-bill.html' : 'billing-management/add-bill.html');

    window.location.href = targetUrl;
  });

  $(document).on('click', '.btn-view-bill', function () {
    const id = $(this).data('id');
    const bills = Storage.get(STORAGE_KEYS.BILLS, DEFAULT_BILLS);
    const bill = bills.find(b => b.id === id);
    if (bill) openInvoiceModal(bill);
  });

  $(document).on('click', '.btn-print-bill-row', function () {
    const id = $(this).data('id');
    const bills = Storage.get(STORAGE_KEYS.BILLS, DEFAULT_BILLS);
    const bill = bills.find(b => b.id === id);
    if (bill) printInvoiceReceipt(bill);
  });

  $(document).on('click', '.btn-delete-bill', function () {
    const id = $(this).data('id');
    const bills = Storage.get(STORAGE_KEYS.BILLS);
    const bill = bills.find(b => b.id === id);
    if (!bill) return;

    openConfirmDeleteModal(`Permanently delete invoice "${bill.billNumber}"?`, function () {
      const updated = bills.filter(b => b.id !== id);
      Storage.set(STORAGE_KEYS.BILLS, updated);
      showToast(`Invoice ${bill.billNumber} removed.`, 'info');
      renderBillingHistory();
      renderDashboard();
    });
  });

  // Print Invoice Receipt
  function printInvoiceReceipt(bill) {
    let itemsRows = (bill.items || []).map(it => `
      <tr>
        <td style="padding: 6px 0; border-bottom: 1px dashed #ddd;">${escapeHtml(it.name)}</td>
        <td style="padding: 6px 0; text-align: center; border-bottom: 1px dashed #ddd;">${it.qty}</td>
        <td style="padding: 6px 0; text-align: right; border-bottom: 1px dashed #ddd;">${formatMoney(it.price)}</td>
        <td style="padding: 6px 0; text-align: right; border-bottom: 1px dashed #ddd;">${formatMoney(it.subtotal || (it.price * it.qty))}</td>
      </tr>
    `).join('');

    const printHtml = `
      <div style="max-width: 450px; margin: 0 auto; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #111; padding: 20px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <img src="assets/aurelia-mark.svg" alt="Aurelia Logo" style="width: 44px; height: 44px; margin: 0 auto 6px auto; display: block;" />
          <h2 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 3px; font-family: 'Cormorant Garamond', Georgia, serif; color: #14213D;">AURELIA</h2>
          <div style="width: 40px; height: 2px; background: #FCA311; margin: 4px auto;"></div>
          <p style="margin: 2px 0 4px 0; font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #555; text-transform: uppercase;">Hotel &amp; Restaurant</p>
          <p style="margin: 2px 0; font-size: 11px; color: #555;">Residency Road, Bengaluru, KA 560025</p>
          <p style="margin: 2px 0; font-size: 10px; color: #555;">GSTIN: 29AABCU9603R1Z7 | Phone: +91 80 4123 4567</p>
          <h3 style="margin: 10px 0 0 0; font-size: 14px; font-weight: 700; border-top: 1px dashed #aaa; border-bottom: 1px dashed #aaa; padding: 6px 0;">TAX INVOICE</h3>
        </div>

        <table style="width: 100%; font-size: 11px; margin-bottom: 12px;">
          <tr>
            <td><strong>Invoice No:</strong> ${escapeHtml(bill.billNumber)}</td>
            <td style="text-align: right;"><strong>Date:</strong> ${formatDateTime(bill.date)}</td>
          </tr>
          <tr>
            <td><strong>Guest:</strong> ${escapeHtml(bill.customerName)}</td>
            <td style="text-align: right;"><strong>Ref:</strong> ${escapeHtml(bill.tableRoom || 'Counter 01')}</td>
          </tr>
          <tr>
            <td><strong>Phone:</strong> ${escapeHtml(bill.customerPhone || '-')}</td>
            <td style="text-align: right;"><strong>Email:</strong> ${escapeHtml(bill.customerEmail || '-')}</td>
          </tr>
          <tr>
            <td><strong>Mode:</strong> ${getPaymentMethodBadge(bill.paymentMethod)}</td>
            <td style="text-align: right;"><strong>Status:</strong> ${escapeHtml(bill.status || 'Paid')}</td>
          </tr>
        </table>

        <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr style="border-top: 1px solid #222; border-bottom: 1px solid #222; text-align: left; font-size: 11px;">
              <th style="padding: 6px 0; text-align: left;">Item</th>
              <th style="padding: 6px 0; text-align: left;">Qty</th>
              <th style="padding: 6px 0; text-align: left;">Price</th>
              <th style="padding: 6px 0; text-align: left;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div style="font-size: 12px; line-height: 1.6; border-top: 1px solid #222; padding-top: 8px;">
          <div style="display: flex; justify-content: space-between;">
            <span>Subtotal:</span>
            <span>${formatMoney(bill.subtotal)}</span>
          </div>
          ${bill.discountAmount > 0 ? `
            <div style="display: flex; justify-content: space-between; color: #c00;">
              <span>Discount:</span>
              <span>- ${formatMoney(bill.discountAmount)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; color: #555;">
            <span>CGST (2.5%):</span>
            <span>${formatMoney(bill.taxAmount / 2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: #555;">
            <span>SGST (2.5%):</span>
            <span>${formatMoney(bill.taxAmount / 2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 800; border-top: 2px solid #000; padding-top: 6px; margin-top: 4px;">
            <span>GRAND TOTAL:</span>
            <span>${formatMoney(bill.grandTotal)}</span>
          </div>
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #666; border-top: 1px dashed #aaa; padding-top: 10px;">
          <p style="margin: 0;">Thank you for your visit!</p>
          <p style="margin: 4px 0 0 0;">Hotel Aurelia | FinSet Operational Billing</p>
        </div>
      </div>
    `;

    $('#print-invoice-area').html(printHtml).removeClass('hidden');
    window.print();
    setTimeout(() => {
      $('#print-invoice-area').addClass('hidden').empty();
    }, 1000);
  }

  // =========================================================================
  // PINE LABS POS RECEIPT PDF GENERATOR (High-Fidelity Thermal Format)
  // =========================================================================

  function downloadPineLabsPDF(bill) {
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        showToast('PDF library not loaded.', 'error');
        return;
      }

      const d = new Date(bill.date || Date.now());
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const dateFormatted = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const timeFormatted = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

      const invoiceNo = bill.billNumber || 'PL-2026-001';
      const payMode = (bill.paymentMethod || 'UPI').toUpperCase();
      const statusStr = 'SUCCESS';

      const items = (bill.items && bill.items.length > 0) ? bill.items : [{
        name: 'Aurelia Item',
        category: 'Dining',
        id: 'AUR-001',
        qty: 1,
        price: bill.grandTotal || 12500,
        subtotal: bill.grandTotal || 12500
      }];

      const formatNum = (n) => (Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const subtotalFormatted = '₹ ' + formatNum(bill.subtotal || bill.grandTotal);
      const discountFormatted = '₹ ' + formatNum(bill.discountAmount || 0);
      const taxFormatted = '₹ ' + formatNum(bill.taxAmount || 0);
      const totalFormatted = '₹ ' + formatNum(bill.grandTotal);

      const dividerDouble = '============================================================';
      const dividerSingle = '------------------------------------------------------------';

      const itemsHtml = items.map((it, idx) => `
        <div style="margin-bottom: ${idx === items.length - 1 ? '0' : '10px'};">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Product / Service</span>
            <span style="font-weight: 500;">${escapeHtml(it.name || 'Aurelia Item')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Product Category</span>
            <span>${escapeHtml(it.category || 'Dining')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Product Code</span>
            <span>${escapeHtml(it.code || it.id || ('AUR-' + String(idx + 1).padStart(3, '0')))}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Serial No.</span>
            <span>SN-2026-${String(idx + 1).padStart(3, '0')}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Quantity</span>
            <span>${it.qty || 1}</span>
          </div>
          ${items.length > 1 ? `
          <div style="display: flex; justify-content: space-between; border-top: 1px dotted #ccc; padding-top: 2px; margin-top: 2px;">
            <span>Line Total</span>
            <span>₹ ${formatNum(it.subtotal || (it.price * it.qty))}</span>
          </div>` : ''}
        </div>
      `).join('');

      const receiptHtml = `
        <div id="pine-labs-pdf-card" style="
          width: 380px;
          background: #ffffff;
          color: #000000;
          font-family: 'Courier New', Courier, 'Lucida Console', monospace;
          font-size: 11px;
          line-height: 1.45;
          padding: 26px 22px;
          box-sizing: border-box;
          letter-spacing: 0.15px;
          text-align: left;
        ">
          <!-- Logo Header -->
          <div style="text-align: center; margin-bottom: 14px;">
            <div style="font-size: 28px; font-weight: normal; margin-bottom: 4px; font-family: 'Segoe UI', Arial, sans-serif; letter-spacing: -0.5px; color: #000;">Aurelia</div>
            <div style="font-size: 13px; font-weight: bold; letter-spacing: 0.8px; margin-bottom: 3px; color: #000;">PAYMENT RECEIPT</div>
            <div style="font-size: 10px; letter-spacing: 0.5px; color: #222;">MERCHANT COPY</div>
          </div>

          <!-- Merchant Info -->
          <div style="margin-bottom: 12px; font-size: 10.5px; line-height: 1.4;">
            <div style="font-size: 9.5px; color: #333;">MERCHANT</div>
            <div style="font-weight: bold; margin-bottom: 8px;">AURELIA</div>

            <div style="font-size: 9.5px; color: #333;">ADDRESS</div>
            <div style="font-weight: bold; margin-bottom: 8px;">KOLKATA, WEST BENGAL</div>

            <div style="font-size: 9.5px; color: #333;">MERCHANT ID</div>
            <div style="font-weight: bold; margin-bottom: 8px;">PL123456789</div>

            <div style="font-size: 9.5px; color: #333;">TERMINAL ID</div>
            <div style="font-weight: bold; margin-bottom: 4px;">TID123456</div>
          </div>

          <!-- Divider -->
          <div style="white-space: pre; overflow: hidden; font-size: 9.5px; letter-spacing: -0.3px; margin: 6px 0; color: #111;">${dividerDouble}</div>

          <!-- SALE section -->
          <div style="text-align: center; font-weight: bold; font-size: 12px; margin: 4px 0 8px 0; letter-spacing: 1px;">SALE</div>

          <div style="margin-bottom: 6px; font-size: 10.5px; line-height: 1.55;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>DATE</span>
              <span style="font-weight: bold;">${dateFormatted}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>TIME</span>
              <span style="font-weight: bold;">${timeFormatted}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>INVOICE NO.</span>
              <span style="font-weight: bold;">${escapeHtml(invoiceNo)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>PAYMENT MODE</span>
              <span style="font-weight: bold;">${escapeHtml(payMode)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>STATUS</span>
              <span style="font-weight: bold;">${escapeHtml(statusStr)}</span>
            </div>
          </div>

          <!-- Divider -->
          <div style="white-space: pre; overflow: hidden; font-size: 9.5px; letter-spacing: -0.3px; margin: 6px 0; color: #111;">${dividerDouble}</div>

          <!-- PRODUCT / BILL DETAILS section -->
          <div style="text-align: center; font-weight: bold; font-size: 12px; margin: 4px 0 8px 0; letter-spacing: 0.5px;">PRODUCT / BILL DETAILS</div>

          <div style="margin-bottom: 6px; font-size: 10.5px; line-height: 1.55;">
            ${itemsHtml}
          </div>

          <!-- Divider -->
          <div style="white-space: pre; overflow: hidden; font-size: 9.5px; letter-spacing: -0.3px; margin: 6px 0; color: #111;">${dividerDouble}</div>

          <!-- AMOUNT BREAKUP section -->
          <div style="text-align: center; font-weight: bold; font-size: 12px; margin: 4px 0 8px 0; letter-spacing: 0.5px;">AMOUNT BREAKUP</div>

          <div style="margin-bottom: 6px; font-size: 10.5px; line-height: 1.55;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>Subtotal</span>
              <span>${subtotalFormatted}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>Discount</span>
              <span>${discountFormatted}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>Tax / GST</span>
              <span>${taxFormatted}</span>
            </div>
          </div>

          <!-- Divider -->
          <div style="white-space: pre; overflow: hidden; font-size: 9.5px; letter-spacing: -0.3px; margin: 6px 0; color: #111;">${dividerDouble}</div>

          <!-- TOTAL AMOUNT -->
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin: 6px 0;">
            <span>TOTAL AMOUNT</span>
            <span>${totalFormatted}</span>
          </div>

          <!-- Dashed Divider -->
          <div style="white-space: pre; overflow: hidden; font-size: 9.5px; letter-spacing: -0.3px; margin: 10px 0 8px 0; color: #111;">${dividerSingle}</div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 10px; line-height: 1.5; margin-top: 8px;">
            <div>Thank you for your purchase!</div>
            <div>Please keep this receipt for your records.</div>
            <div style="margin-top: 10px; font-size: 9px; color: #444;">This is a sample receipt format.</div>
          </div>
        </div>
      `;

      // Mount temporary offscreen container
      const mount = document.createElement('div');
      mount.id = 'pine-labs-print-mount';
      mount.style.position = 'fixed';
      mount.style.left = '-9999px';
      mount.style.top = '0';
      mount.style.zIndex = '-9999';
      mount.innerHTML = receiptHtml;
      document.body.appendChild(mount);

      if (window.html2canvas) {
        window.html2canvas(mount.firstElementChild, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = 80;
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
          });
          doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          doc.save(`${bill.billNumber || 'Receipt'}_Aurelia.pdf`);
          mount.remove();
          showToast(`Aurelia receipt for ${bill.billNumber} downloaded!`, 'success');
        }).catch(err => {
          console.warn('html2canvas canvas rendering error, using direct PDF fallback:', err);
          mount.remove();
          generateDirectPineLabsPDF(bill);
        });
      } else {
        mount.remove();
        generateDirectPineLabsPDF(bill);
      }
    } catch (err) {
      console.error('Aurelia PDF Generation Error:', err);
      showToast('Error generating PDF document.', 'error');
    }
  }

  function generateDirectPineLabsPDF(bill) {
    try {
      const { jsPDF } = window.jspdf;
      const pdfWidth = 80;
      const items = (bill.items && bill.items.length > 0) ? bill.items : [{
        name: 'Aurelia Item',
        category: 'Dining',
        id: 'AUR-001',
        qty: 1,
        price: bill.grandTotal || 12500,
        subtotal: bill.grandTotal || 12500
      }];
      const pdfHeight = Math.max(180, 150 + (items.length * 26));
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      doc.setFont('courier', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Aurelia', 40, 12, { align: 'center' });

      doc.setFontSize(9);
      doc.setFont('courier', 'bold');
      doc.text('PAYMENT RECEIPT', 40, 17, { align: 'center' });
      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.text('MERCHANT COPY', 40, 21, { align: 'center' });

      let y = 28;
      const drawDivider = (char = '=') => {
        doc.setFont('courier', 'normal').setFontSize(6.5);
        doc.text(char.repeat(60), 40, y, { align: 'center' });
        y += 5;
      };
      const drawHeader = (title, size = 8.5) => {
        doc.setFontSize(size).setFont('courier', 'bold');
        doc.text(title, 40, y, { align: 'center' });
        y += 5;
      };
      const drawKV = (left, right, isBoldRight = false, gap = 4) => {
        doc.setFontSize(7.5).setFont('courier', 'normal').text(left, 6, y);
        if (isBoldRight) doc.setFont('courier', 'bold');
        doc.text(right, 74, y, { align: 'right' });
        y += gap;
      };

      [
        ['MERCHANT', 'AURELIA'],
        ['ADDRESS', 'KOLKATA, WEST BENGAL'],
        ['MERCHANT ID', 'PL123456789'],
        ['TERMINAL ID', 'TID123456']
      ].forEach(([lbl, val]) => {
        doc.setFontSize(7).setFont('courier', 'normal').text(lbl, 6, y); y += 3.5;
        doc.setFont('courier', 'bold').text(val, 6, y); y += 5;
      });

      drawDivider();
      drawHeader('SALE', 9);

      const d = new Date(bill.date || Date.now());
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const dateFormatted = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const timeFormatted = `${String(hours).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${ampm}`;

      drawKV('DATE', dateFormatted, true);
      drawKV('TIME', timeFormatted, true);
      drawKV('INVOICE NO.', bill.billNumber || 'PL-2026-001', true);
      drawKV('PAYMENT MODE', (bill.paymentMethod || 'UPI').toUpperCase(), true);
      drawKV('STATUS', 'SUCCESS', true, 5);

      drawDivider();
      drawHeader('PRODUCT / BILL DETAILS');

      doc.setFontSize(7.5);
      items.forEach((it, idx) => {
        drawKV('Product / Service', it.name || 'Aurelia Item', false, 3.8);
        drawKV('Product Category', it.category || 'Dining', false, 3.8);
        drawKV('Product Code', it.code || it.id || ('AUR-' + String(idx + 1).padStart(3, '0')), false, 3.8);
        drawKV('Serial No.', 'SN-2026-' + String(idx + 1).padStart(3, '0'), false, 3.8);
        drawKV('Quantity', String(it.qty || 1), false, 5);
      });

      drawDivider();
      drawHeader('AMOUNT BREAKUP');

      const fmt = (num) => 'Rs ' + (Number(num) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      drawKV('Subtotal', fmt(bill.subtotal || bill.grandTotal));
      drawKV('Discount', fmt(bill.discountAmount || 0));
      drawKV('Tax / GST', fmt(bill.taxAmount || 0), false, 5);

      drawDivider();
      doc.setFontSize(8).setFont('courier', 'bold');
      doc.text('TOTAL AMOUNT', 6, y);
      doc.text(fmt(bill.grandTotal), 74, y, { align: 'right' });
      y += 5;

      drawDivider('-');
      doc.setFontSize(7).text('Thank you for your purchase!', 40, y, { align: 'center' }); y += 3.5;
      doc.text('Please keep this receipt for your records.', 40, y, { align: 'center' }); y += 5;
      doc.setFontSize(6.5).text('This is a sample receipt format.', 40, y, { align: 'center' });

      doc.save(`${bill.billNumber || 'Receipt'}_Aurelia.pdf`);
      showToast(`Aurelia receipt for ${bill.billNumber} downloaded!`, 'success');
    } catch (err) {
      console.error('Direct PDF fallback error:', err);
      showToast('Error generating PDF receipt.', 'error');
    }
  }

  // Alias downloadInvoicePDF to downloadPineLabsPDF for full compatibility
  const downloadInvoicePDF = downloadPineLabsPDF;

  // =========================================================================
  // 6. PRODUCT & MENU MANAGEMENT
  // =========================================================================

  let activeMenuCategory = 'all';
  let activeMenuDiet = 'all';

  function syncMenuDietButtons() {
    const configs = [
      { id: '#btn-filter-diet-veg', diet: 'veg', activeBg: '#008000', textCls: 'text-[#008000] dark:text-emerald-400' },
      { id: '#btn-filter-diet-nonveg', diet: 'nonveg', activeBg: '#b91c1c', textCls: 'text-[#b91c1c] dark:text-rose-400' }
    ];
    configs.forEach(cfg => {
      const $btn = $(cfg.id);
      if (!$btn.length) return;
      const isActive = activeMenuDiet === cfg.diet;
      $btn.attr('aria-pressed', isActive ? 'true' : 'false');
      $btn.find('[data-switch-track]').css('background-color', isActive ? cfg.activeBg : '');
      $btn.find('[data-switch-knob]').css('transform', isActive ? 'translateX(20px)' : 'translateX(0px)');
      const $label = $btn.find('[data-switch-label]');
      $label.removeClass('text-slate-700 dark:text-slate-200 text-[#008000] dark:text-emerald-400 text-[#b91c1c] dark:text-rose-400');
      $label.addClass(isActive ? cfg.textCls : 'text-slate-700 dark:text-slate-200');
    });
  }

  function renderMenuSection() {
    renderMenuCategoryPills();
    syncMenuDietButtons();
    renderMenuItemsGrid();
  }

  function renderMenuCategoryPills() {
    const categories = Storage.get(STORAGE_KEYS.CATEGORIES);
    const $select = $('#select-menu-category-filter');
    if (!$select.length) return;

    if (activeMenuCategory !== 'all' && !categories.includes(activeMenuCategory)) {
      activeMenuCategory = 'all';
    }

    $select.empty();
    $select.append('<option value="all">All Items</option>');

    categories.forEach(cat => {
      $select.append(`<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`);
    });

    $select.val(activeMenuCategory);
  }

  $(document).on('change', '#select-menu-category-filter', function () {
    activeMenuCategory = $(this).val() || 'all';
    renderMenuItemsGrid();
  });

  $(document).on('click', '#btn-filter-diet-veg, #btn-filter-diet-nonveg', function () {
    const diet = $(this).data('diet');
    activeMenuDiet = (activeMenuDiet === diet) ? 'all' : diet;
    syncMenuDietButtons();
    renderMenuItemsGrid();
  });

  function getMenuDishMeta(item) {
    const rawName = String(item.name || '').toLowerCase();
    const rawDesc = String(item.description || '').toLowerCase();
    const rawCat = String(item.category || '').toLowerCase();
    const combined = `${rawName} ${rawDesc}`;

    const isNonVeg = /\b(chicken|mutton|lamb|gosht|fish|prawn|prawns|shrimp|egg|eggs|meat|keema|bacon|turkey|seafood|crab)\b/.test(combined);

    let emoji = '🍽️';
    if (rawName.includes('biryani')) emoji = '🍲';
    else if (rawName.includes('rice')) emoji = '🍚';
    else if (rawName.includes('naan') || rawName.includes('roti') || rawName.includes('paratha')) emoji = '🫓';
    else if (rawName.includes('coffee')) emoji = '☕';
    else if (rawName.includes('chai') || rawName.includes('tea')) emoji = '🫖';
    else if (rawName.includes('lime') || rawName.includes('lemon')) emoji = '🍋';
    else if (rawName.includes('lassi') || rawName.includes('mango')) emoji = '🥭';
    else if (rawName.includes('sandwich')) emoji = '🥪';
    else if (rawName.includes('breakfast') || rawName.includes('croissant')) emoji = '🥐';
    else if (rawName.includes('kulfi') || rawName.includes('ice cream')) emoji = '🍨';
    else if (rawName.includes('jamun') || rawName.includes('rasmalai') || rawCat.includes('dessert')) emoji = '🍮';
    else if (rawName.includes('chicken') || rawName.includes('tandoori')) emoji = '🍗';
    else if (rawName.includes('mutton') || rawName.includes('lamb') || rawName.includes('gosht')) emoji = '🍖';
    else if (rawName.includes('corn')) emoji = '🌽';
    else if (rawName.includes('tikka') || rawName.includes('kabab') || rawName.includes('kebab')) emoji = '🍢';
    else if (rawCat.includes('main')) emoji = '🍛';
    else if (rawCat.includes('starter')) emoji = '🥟';
    else if (rawCat.includes('bread')) emoji = '🫓';
    else if (rawCat.includes('rice') || rawCat.includes('biryani')) emoji = '🍲';
    else if (rawCat.includes('beverage')) emoji = '🥤';
    else if (rawCat.includes('room')) emoji = '🛎️';

    let tileTheme = 'from-slate-50 to-slate-100 border-slate-200/80 dark:from-slate-800 dark:to-slate-700/70 dark:border-slate-600/50';
    if (rawCat.includes('main')) {
      tileTheme = 'from-amber-50 to-orange-100/90 border-amber-200/80 dark:from-amber-950/60 dark:to-orange-900/40 dark:border-amber-700/40';
    } else if (rawCat.includes('starter')) {
      tileTheme = 'from-rose-50 to-orange-100/80 border-rose-200/80 dark:from-rose-950/60 dark:to-orange-900/40 dark:border-rose-700/40';
    } else if (rawCat.includes('bread')) {
      tileTheme = 'from-yellow-50 to-amber-100/80 border-yellow-200/80 dark:from-yellow-950/60 dark:to-amber-900/40 dark:border-yellow-700/40';
    } else if (rawCat.includes('rice') || rawCat.includes('biryani')) {
      tileTheme = 'from-orange-50 to-amber-100/90 border-orange-200/80 dark:from-orange-950/60 dark:to-amber-900/40 dark:border-orange-700/40';
    } else if (rawCat.includes('dessert')) {
      tileTheme = 'from-pink-50 to-rose-100/80 border-pink-200/80 dark:from-pink-950/60 dark:to-rose-900/40 dark:border-pink-700/40';
    } else if (rawCat.includes('beverage')) {
      tileTheme = 'from-sky-50 to-cyan-100/80 border-sky-200/80 dark:from-sky-950/60 dark:to-cyan-900/40 dark:border-sky-700/40';
    } else if (rawCat.includes('room')) {
      tileTheme = 'from-indigo-50 to-slate-100/90 border-indigo-200/80 dark:from-indigo-950/60 dark:to-slate-800/60 dark:border-indigo-700/40';
    }

    let badge = null;
    if (rawName.includes('grand') || rawName.includes('royal') || rawName.includes('shahi') || rawName.includes('signature')) {
      badge = { label: "Chef's Signature", cls: 'bg-[#FCA311]/15 text-[#b45309] dark:text-[#FCA311] border border-[#FCA311]/30' };
    } else if (['item-1', 'item-2', 'item-12', 'item-16', 'item-20', 'item-26'].includes(item.id)) {
      badge = { label: 'Bestseller', cls: 'bg-[#14213D]/10 text-[#14213D] dark:bg-slate-700 dark:text-amber-300 border border-[#14213D]/15 dark:border-slate-600' };
    } else if (rawName.includes('tandoori') || rawName.includes('angara') || rawName.includes('clay oven') || rawDesc.includes('clay oven')) {
      badge = { label: 'Clay Oven', cls: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-200/70 dark:border-orange-800/50' };
    } else if (rawName.includes('dum')) {
      badge = { label: 'Slow Dum', cls: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/50' };
    } else if (rawCat.includes('room')) {
      badge = { label: 'In-Room 24×7', cls: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/50' };
    }

    const codeNum = String(item.id || '').replace(/^item-?/i, '');
    const code = codeNum && /^\d+$/.test(codeNum) ? `MN-${codeNum.padStart(2, '0')}` : String(item.id || 'DISH').toUpperCase().slice(0, 8);

    return { isNonVeg, emoji, tileTheme, badge, code };
  }

  function renderMenuItemsGrid() {
    syncMenuDietButtons();
    const menu = Storage.get(STORAGE_KEYS.MENU);
    const $tbody = $('#menu-items-tbody');
    $tbody.empty();

    let filtered = menu;
    if (activeMenuCategory !== 'all') {
      filtered = filtered.filter(m => m.category === activeMenuCategory);
    }
    if (activeMenuDiet === 'veg') {
      filtered = filtered.filter(m => !getMenuDishMeta(m).isNonVeg);
    } else if (activeMenuDiet === 'nonveg') {
      filtered = filtered.filter(m => getMenuDishMeta(m).isNonVeg);
    }

    if (filtered.length === 0) {
      $tbody.append(`
        <tr>
          <td colspan="6" class="py-8 text-center text-slate-400">No items match the current category or Veg / Non-Veg filter.</td>
        </tr>
      `);
      return;
    }

    filtered.forEach(item => {
      const isAvail = !!item.available;
      const meta = getMenuDishMeta(item);
      const dietaryMark = meta.isNonVeg
        ? `<span class="inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] border border-rose-600 bg-white dark:bg-slate-900 flex-shrink-0" title="Non-Vegetarian" aria-label="Non-Vegetarian"><svg class="w-2 h-2 text-rose-600 fill-current" viewBox="0 0 10 10"><polygon points="5,1.5 9,8.5 1,8.5"/></svg></span>`
        : `<span class="inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] border border-emerald-600 bg-white dark:bg-slate-900 flex-shrink-0" title="Vegetarian" aria-label="Vegetarian"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span></span>`;

      $tbody.append(`
        <tr class="group hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors" data-id="${escapeHtml(item.id)}">
          <td class="py-3 px-4 ${!isAvail ? 'opacity-65' : ''}">
            <div class="flex items-center gap-3 min-w-[220px]">
              <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br ${meta.tileTheme} border flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 group-hover:shadow transition-all duration-200">
                <span class="text-lg leading-none select-none" aria-hidden="true">${meta.emoji}</span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  ${dietaryMark}
                  <span class="font-bold text-slate-900 dark:text-white group-hover:text-[#14213D] dark:group-hover:text-[#FCA311] transition-colors truncate">
                    ${escapeHtml(item.name)}
                  </span>
                </div>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-[10px] font-semibold font-mono tracking-wider text-slate-400 dark:text-slate-500">#${escapeHtml(meta.code)}</span>
                  ${meta.badge ? `<span class="inline-flex items-center px-1.5 py-0 rounded-md text-[10px] font-semibold leading-4 ${meta.badge.cls}">${escapeHtml(meta.badge.label)}</span>` : ''}
                </div>
              </div>
            </div>
          </td>
          <td class="py-3 px-4 whitespace-nowrap ${!isAvail ? 'opacity-65' : ''}">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E5E5E5]/60 dark:bg-slate-700 text-[#14213D] dark:text-slate-200 uppercase tracking-wider">
              ${escapeHtml(item.category)}
            </span>
          </td>
          <td class="py-3 px-4 text-slate-500 max-w-sm whitespace-normal break-words ${!isAvail ? 'opacity-65' : ''}" title="${escapeHtml(item.description || '')}">
            ${escapeHtml(item.description || 'Prepared fresh upon order.')}
          </td>
          <td class="py-3 px-4 text-center font-black text-[#14213D] dark:text-white whitespace-nowrap ${!isAvail ? 'opacity-65' : ''}">
            ${formatMoney(item.price)}
          </td>
          <td class="py-2.5 px-3 text-center whitespace-nowrap">
            ${isAvail ? `
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#15803d] border border-[#15803d] shadow-2xs whitespace-nowrap">
                Available
              </span>
            ` : `
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-[#b91c1c] border border-[#b91c1c] shadow-2xs whitespace-nowrap">
                Unavailable
              </span>
            `}
          </td>
          <td class="py-3.5 px-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-end space-x-1">
              <!-- Edit / Pencil -->
              <button type="button" class="btn-edit-menu-item p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" data-id="${item.id}" title="Edit item" aria-label="Edit item">
                <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <!-- Delete / Trash (Red) -->
              <button type="button" class="btn-delete-menu-item p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer" data-id="${item.id}" title="Delete item" aria-label="Delete item">
                <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `);
    });
  }

  // Modal: Add / Edit Item
  function openMenuItemModal(item = null) {
    $('#form-menu-item')[0].reset();
    $('.text-rose-600').addClass('hidden');

    const categories = Storage.get(STORAGE_KEYS.CATEGORIES);
    const $select = $('#menu-select-category');
    $select.empty();
    categories.forEach(c => $select.append(`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`));

    if (item) {
      $('#modal-menu-title').text('Edit Menu Item');
      $('#menu-item-edit-id').val(item.id);
      $('#menu-input-name').val(item.name);
      $('#menu-select-category').val(item.category);
      $('#menu-input-price').val(item.price);
      $('#menu-input-desc').val(item.description || '');
      $('#menu-check-available').prop('checked', !!item.available);
    } else {
      $('#modal-menu-title').text('Add Menu Item');
      $('#menu-item-edit-id').val('');
      $('#menu-check-available').prop('checked', true);
    }

    $('#modal-menu-item').removeClass('hidden');
    $('#menu-input-name').focus();
  }

  $('#btn-open-menu-modal').on('click', () => openMenuItemModal(null));

  $(document).on('click', '.btn-edit-menu-item', function () {
    const id = $(this).data('id');
    const menu = Storage.get(STORAGE_KEYS.MENU);
    const item = menu.find(m => m.id === id);
    if (item) openMenuItemModal(item);
  });

  $('#form-menu-item').on('submit', function (e) {
    e.preventDefault();
    const editId = $('#menu-item-edit-id').val();
    const name = $.trim($('#menu-input-name').val());
    const category = $('#menu-select-category').val();
    const price = parseFloat($('#menu-input-price').val());
    const desc = $.trim($('#menu-input-desc').val());
    const isAvail = $('#menu-check-available').is(':checked');

    let hasError = false;
    if (!name) {
      $('#err-menu-name').removeClass('hidden');
      hasError = true;
    }
    if (isNaN(price) || price <= 0) {
      $('#err-menu-price').removeClass('hidden');
      hasError = true;
    }
    if (hasError) return;

    const menu = Storage.get(STORAGE_KEYS.MENU);
    if (editId) {
      const item = menu.find(m => m.id === editId);
      if (item) {
        item.name = name;
        item.category = category;
        item.price = price;
        item.description = desc;
        item.available = isAvail;
        showToast(`Item "${name}" updated.`, 'success');
      }
    } else {
      menu.push({
        id: 'item-' + Date.now(),
        name,
        category,
        price,
        description: desc,
        available: isAvail
      });
      showToast(`Item "${name}" added to menu.`, 'success');
    }

    Storage.set(STORAGE_KEYS.MENU, menu);
    $('#modal-menu-item').addClass('hidden');
    renderMenuItemsGrid();
    populateMenuItemPicker();
    renderSidebarBadges();
  });

  $(document).on('click', '.btn-delete-menu-item', function () {
    const id = $(this).data('id');
    const menu = Storage.get(STORAGE_KEYS.MENU);
    const item = menu.find(m => m.id === id);
    if (!item) return;

    openConfirmDeleteModal(`Remove "${item.name}" from hotel menu?`, function () {
      const updated = menu.filter(m => m.id !== id);
      Storage.set(STORAGE_KEYS.MENU, updated);
      showToast(`Item "${item.name}" deleted.`, 'info');
      renderMenuItemsGrid();
      populateMenuItemPicker();
      renderSidebarBadges();
    });
  });

  // Category Modal
  $('#btn-open-category-modal').on('click', function () {
    renderCategoryTags();
    $('#modal-category').removeClass('hidden');
  });

  function renderCategoryTags() {
    const categories = Storage.get(STORAGE_KEYS.CATEGORIES);
    const $wrap = $('#categories-list-tags');
    $wrap.empty();
    categories.forEach(c => {
      $wrap.append(`
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          ${escapeHtml(c)}
        </span>
      `);
    });
  }

  $('#form-add-category').on('submit', function (e) {
    e.preventDefault();
    const newCat = $.trim($('#input-new-category').val());
    if (!newCat) {
      $('#err-category-name').removeClass('hidden');
      return;
    }
    const categories = Storage.get(STORAGE_KEYS.CATEGORIES);
    if (categories.includes(newCat)) {
      showToast('Category already exists.', 'error');
      return;
    }

    categories.push(newCat);
    Storage.set(STORAGE_KEYS.CATEGORIES, categories);
    $('#input-new-category').val('');
    $('#err-category-name').addClass('hidden');
    renderCategoryTags();
    renderMenuCategoryPills();
    showToast(`Category "${newCat}" created.`, 'success');
  });

  // =========================================================================
  // 7. ORDER & KITCHEN TICKET QUEUE
  // =========================================================================

  function renderOrdersSection() {
    const rawOrders = Storage.get(STORAGE_KEYS.ORDERS) || [];
    const orders = [...rawOrders].sort((a, b) => {
      const na = parseInt(String(a.orderNumber || a.id || '').replace(/\D+/g, ''), 10) || 0;
      const nb = parseInt(String(b.orderNumber || b.id || '').replace(/\D+/g, ''), 10) || 0;
      if (nb !== na) return nb - na;
      return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
    });
    const $tbody = $('#orders-tbody');
    $tbody.empty();

    if (orders.length === 0) {
      $tbody.append(`
        <tr>
          <td colspan="7" class="py-8 text-center text-slate-400">No active orders. Click "+ New Order" to create a table ticket.</td>
        </tr>
      `);
      return;
    }

    orders.forEach(ord => {
      const estTotal = (ord.items || []).reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.qty || 1)), 0);
      const isBilled = !!ord.billNumber;

      $tbody.append(`
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors" data-id="${escapeHtml(ord.id)}">
          <td class="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
            ${escapeHtml(ord.orderNumber)}
          </td>
          <td class="py-2.5 px-3 text-slate-500 whitespace-nowrap text-xs">
            ${formatDateTime(ord.timestamp)}
          </td>
          <td class="py-2.5 px-3 whitespace-nowrap">
            <div class="font-bold text-slate-900 dark:text-white whitespace-nowrap">${escapeHtml(ord.customerName)}</div>
            <div class="text-[11px] text-slate-400 font-medium whitespace-nowrap">${escapeHtml(ord.tableRoom)}</div>
          </td>
          <td class="py-2.5 px-3 text-center whitespace-nowrap">
            <button type="button" class="btn-view-order-items btn-finset-primary text-xs py-1 px-3 cursor-pointer whitespace-nowrap" data-id="${ord.id}" title="View ordered items list">
              Click here to see &rarr;
            </button>
          </td>
          <td class="py-2.5 px-3 text-center font-black text-[#14213D] dark:text-white whitespace-nowrap">
            ${formatMoney(estTotal)}
          </td>
          <td class="py-2.5 px-3 text-center whitespace-nowrap">
            <select class="order-status-inline-change py-1 px-2.5 text-xs font-semibold rounded-full cursor-pointer whitespace-nowrap" data-id="${ord.id}" data-status="${escapeHtml((ord.status || 'Pending').toLowerCase())}">
              <option value="Pending" ${ord.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Preparing" ${ord.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
              <option value="Served" ${ord.status === 'Served' ? 'selected' : ''}>Served</option>
              <option value="Completed" ${ord.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${ord.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td class="py-2.5 px-3 text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-2 whitespace-nowrap">
              <button type="button" class="btn-view-order-details btn-finset-secondary text-xs py-1 px-3" data-id="${ord.id}">
                Details
              </button>
              ${!isBilled && ord.status !== 'Cancelled' ? `
                <button type="button" class="btn-order-to-bill btn-finset-primary text-xs py-1 px-3" data-id="${ord.id}">
                  Bill &rarr;
                </button>
              ` : `
                <span class="text-[11px] text-slate-400 font-mono font-bold px-1">${escapeHtml(ord.billNumber || 'Settled')}</span>
              `}
            </div>
          </td>
        </tr>
      `);
    });
  }

  // Inline Status Change
  $(document).on('change', '.order-status-inline-change', function () {
    const $sel = $(this);
    const id = $sel.data('id');
    const newStatus = $sel.val();
    $sel.attr('data-status', String(newStatus || 'Pending').toLowerCase());
    const orders = Storage.get(STORAGE_KEYS.ORDERS);
    const ord = orders.find(o => o.id === id);
    if (ord) {
      ord.status = newStatus;
      Storage.set(STORAGE_KEYS.ORDERS, orders);
      renderSidebarBadges();
      renderDashboard();
      showToast(`Order ${ord.orderNumber} status is now ${newStatus}.`, 'info');
    }
  });

  // Convert Order to Bill
  $(document).on('click', '.btn-order-to-bill', function () {
    const id = $(this).data('id');
    convertOrderToBilling(id);
  });

  // Open New Order Modal
  $('#btn-quick-new-order').on('click', function () {
    $('#form-new-order')[0].reset();
    currentOrderItems = [];
    renderNewOrderItemsTable();
    $('.text-rose-600').addClass('hidden');

    const menu = Storage.get(STORAGE_KEYS.MENU);
    const $select = $('#order-select-item');
    $select.find('option:not(:first)').remove();
    menu.filter(m => m.available).forEach(item => {
      $select.append(`<option value="${item.id}" data-name="${escapeHtml(item.name)}" data-price="${item.price}">${escapeHtml(item.name)} (${formatMoney(item.price)})</option>`);
    });

    $('#modal-order').removeClass('hidden');
  });

  $('#btn-add-order-item-row').on('click', function () {
    const $opt = $('#order-select-item').find('option:selected');
    const id = $opt.val();
    if (!id) {
      showToast('Please select a menu item.', 'error');
      return;
    }

    const name = $opt.data('name');
    const price = Number($opt.data('price')) || 0;
    const qty = parseInt($('#order-item-qty').val(), 10) || 1;

    const existing = currentOrderItems.find(it => it.id === id);
    if (existing) {
      existing.qty += qty;
    } else {
      currentOrderItems.push({ id, name, price, qty });
    }

    $('#order-select-item').val('');
    $('#order-item-qty').val(1);
    $('#err-order-items').addClass('hidden');

    renderNewOrderItemsTable();
  });

  function renderNewOrderItemsTable() {
    const $tbody = $('#order-items-tbody');
    $tbody.empty();

    let total = 0;
    currentOrderItems.forEach((it, idx) => {
      const line = it.price * it.qty;
      total += line;
      $tbody.append(`
        <tr>
          <td class="py-1 px-3 font-semibold text-slate-800 dark:text-white">${escapeHtml(it.name)}</td>
          <td class="py-1 px-2 text-center">${it.qty}</td>
          <td class="py-1 px-3 text-center text-slate-500">${formatMoney(it.price)}</td>
          <td class="py-1 px-3 text-center font-bold text-slate-900 dark:text-white">${formatMoney(line)}</td>
          <td class="py-1 px-2 text-center">
            <button type="button" class="btn-remove-order-item text-rose-500 font-bold" data-index="${idx}">&times;</button>
          </td>
        </tr>
      `);
    });

    $('#order-est-total-text').text(formatMoney(total));
  }

  $(document).on('click', '.btn-remove-order-item', function () {
    const idx = $(this).data('index');
    currentOrderItems.splice(idx, 1);
    renderNewOrderItemsTable();
  });

  $('#form-new-order').on('submit', function (e) {
    e.preventDefault();
    const customer = $.trim($('#order-input-customer').val());
    const tableRoom = $.trim($('#order-input-location').val());
    const phone = $.trim($('#order-input-phone').val());
    const notes = $.trim($('#order-input-notes').val());

    let hasError = false;
    if (!customer) {
      $('#err-order-customer').removeClass('hidden');
      hasError = true;
    }
    if (!tableRoom) {
      $('#err-order-location').removeClass('hidden');
      hasError = true;
    }
    if (currentOrderItems.length === 0) {
      $('#err-order-items').removeClass('hidden');
      hasError = true;
    }
    if (hasError) return;

    const orders = Storage.get(STORAGE_KEYS.ORDERS);
    let nextNum = 83;
    orders.forEach(o => {
      const match = (o.orderNumber || '').match(/ORD-(\d+)/);
      if (match && match[1]) {
        const n = parseInt(match[1], 10);
        if (n >= nextNum) nextNum = n + 1;
      }
    });

    const newOrder = {
      id: 'ORD-' + String(nextNum).padStart(4, '0'),
      orderNumber: 'ORD-' + String(nextNum).padStart(4, '0'),
      customerName: customer,
      customerPhone: phone,
      tableRoom: tableRoom,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      notes: notes,
      billNumber: null,
      items: JSON.parse(JSON.stringify(currentOrderItems))
    };

    orders.unshift(newOrder);
    Storage.set(STORAGE_KEYS.ORDERS, orders);

    $('#modal-order').addClass('hidden');
    showToast(`Order ${newOrder.orderNumber} sent to kitchen queue.`, 'success');

    renderOrdersSection();
    renderSidebarBadges();
    renderDashboard();
  });

  // View Ordered Items List Popup ("Click here to see")
  function openOrderItemsListModal(orderId) {
    const orders = Storage.get(STORAGE_KEYS.ORDERS) || [];
    const ord = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!ord) return;

    let $modal = $('#modal-order-items-list');
    if (!$modal.length) {
      $('body').append(`
        <div id="modal-order-items-list" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm hidden flex items-center justify-center p-4">
          <div class="Aurelia-card max-w-lg sm:max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 id="modal-order-items-title" class="text-base font-bold text-slate-900 dark:text-white">Ordered Items</h3>
                <p id="modal-order-items-subtitle" class="text-[11px] text-slate-400 font-medium"></p>
              </div>
              <button type="button" class="btn-close-modal w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white flex items-center justify-center transition-colors text-sm font-semibold cursor-pointer" title="Close">&times;</button>
            </div>
            <div class="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800">
              <table class="w-full text-xs text-center">
                <thead>
                  <tr class="Aurelia-table-header text-slate-500 font-semibold text-[11px]">
                    <th class="py-2 px-3">#</th>
                    <th class="py-2 px-3">Item</th>
                    <th class="py-2 px-2">Qty</th>
                    <th class="py-2 px-3">Price</th>
                    <th class="py-2 px-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody id="modal-order-items-tbody" class="divide-y divide-slate-100 dark:divide-slate-800"></tbody>
              </table>
            </div>
            <div class="flex items-center justify-between text-xs font-semibold pt-1">
              <span id="modal-order-items-count" class="text-slate-500 dark:text-slate-400"></span>
              <div>
                <span class="text-slate-500 mr-1.5">Total:</span>
                <span id="modal-order-items-total" class="text-base text-[#14213D] dark:text-white font-bold">₹0.00</span>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button type="button" class="btn-close-modal btn-Aurelia-secondary text-xs py-1.5 px-4 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      `);
      $modal = $('#modal-order-items-list');
      $modal.on('click', '.btn-close-modal', function () {
        $modal.addClass('hidden');
      });
      $modal.on('click', function (e) {
        if (e.target === this) $(this).addClass('hidden');
      });
    }

    $('#modal-order-items-title').text(`Ordered Items — ${ord.orderNumber}`);
    $('#modal-order-items-subtitle').text(`${ord.customerName} • ${ord.tableRoom}`);

    const $tbody = $('#modal-order-items-tbody');
    $tbody.empty();
    let total = 0;
    let totalQty = 0;
    (ord.items || []).forEach((it, idx) => {
      const qty = Number(it.qty) || 1;
      const price = Number(it.price) || 0;
      const line = qty * price;
      total += line;
      totalQty += qty;
      $tbody.append(`
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td class="py-2 px-3 text-slate-400 font-mono">${idx + 1}</td>
          <td class="py-2 px-3 font-semibold text-slate-800 dark:text-white">${escapeHtml(it.name)}</td>
          <td class="py-2 px-2 font-bold text-slate-700 dark:text-slate-200">${qty}</td>
          <td class="py-2 px-3 text-slate-500">${formatMoney(price)}</td>
          <td class="py-2 px-3 font-bold text-slate-900 dark:text-white">${formatMoney(line)}</td>
        </tr>
      `);
    });

    $('#modal-order-items-count').text(`${(ord.items || []).length} dish(es) • ${totalQty} qty`);
    $('#modal-order-items-total').text(formatMoney(total));
    $modal.removeClass('hidden');
  }

  $(document).on('click', '.btn-view-order-items', function () {
    openOrderItemsListModal($(this).data('id'));
  });

  // View Order Details Modal
  $(document).on('click', '.btn-view-order-details', function () {
    const id = $(this).data('id');
    const orders = Storage.get(STORAGE_KEYS.ORDERS);
    const ord = orders.find(o => o.id === id);
    if (!ord) return;

    $('#view-order-title').text('Order Ticket: ' + ord.orderNumber);
    $('#view-order-subtitle').text(ord.orderNumber);
    $('#view-order-cust').text(ord.customerName);
    $('#view-order-phone').text(ord.customerPhone || 'Walk-in Guest');
    $('#view-order-loc').text(ord.tableRoom);
    $('#view-order-time').text(formatDateTime(ord.timestamp));
    $('#view-order-status-badge').replaceWith(getStatusBadge(ord.status));

    const estTotal = (ord.items || []).reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.qty || 1)), 0);
    $('#view-order-est-total').text(formatMoney(estTotal));
    $('#view-order-notes-text').text(ord.notes || 'No special kitchen note.');

    const $tbody = $('#view-order-items-tbody');
    $tbody.empty();
    (ord.items || []).forEach(it => {
      $tbody.append(`
        <tr>
          <td class="py-2 px-3 font-semibold text-slate-800 dark:text-white">${escapeHtml(it.name)}</td>
          <td class="py-2 px-2 text-center">${it.qty}</td>
          <td class="py-2 px-3 text-center text-slate-500">${formatMoney(it.price)}</td>
          <td class="py-2 px-3 text-center font-bold text-slate-900 dark:text-white">${formatMoney(it.price * it.qty)}</td>
        </tr>
      `);
    });

    $('#btn-order-generate-bill').data('id', ord.id);
    if (ord.billNumber || ord.status === 'Cancelled') {
      $('#btn-order-generate-bill').addClass('hidden');
    } else {
      $('#btn-order-generate-bill').removeClass('hidden');
    }

    $('#modal-view-order').removeClass('hidden');
  });

  $('#btn-order-generate-bill').on('click', function () {
    const id = $(this).data('id');
    $('#modal-view-order').addClass('hidden');
    convertOrderToBilling(id);
  });

  // =========================================================================
  // 8. CUSTOMER REGISTRY & LOYALTY
  // =========================================================================

  function renderCustomersSection() {
    const customers = Storage.get(STORAGE_KEYS.CUSTOMERS);
    const search = $.trim($('#filter-customers-search').val()).toLowerCase();

    let filtered = customers.filter(c => {
      return !search ||
        (c.name && c.name.toLowerCase().includes(search)) ||
        (c.phone && c.phone.includes(search)) ||
        (c.email && c.email.toLowerCase().includes(search));
    });

    const $tbody = $('#customers-tbody');
    $tbody.empty();

    if (filtered.length === 0) {
      $tbody.append(`
        <tr>
          <td colspan="7" class="py-8 text-center text-slate-400">No guests match your search. Click "+ Add Customer" to create record.</td>
        </tr>
      `);
    } else {
      filtered.forEach(c => {
        $tbody.append(`
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors" data-id="${escapeHtml(c.id)}">
            <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">${escapeHtml(c.name)}</td>
            <td class="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">${escapeHtml(c.phone)}</td>
            <td class="py-2.5 px-3 text-slate-500 whitespace-nowrap">${escapeHtml(c.email || '-')}</td>
            <td class="py-2.5 px-3 text-slate-500 max-w-xs truncate whitespace-nowrap">${escapeHtml(c.address || '-')}</td>
            <td class="py-2.5 px-3 text-center font-bold text-slate-800 dark:text-white whitespace-nowrap">${c.visits || 0}</td>
            <td class="py-2.5 px-3 text-center font-black text-[#14213D] whitespace-nowrap">${formatMoney(c.totalSpend || 0)}</td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">
              <div class="flex items-center justify-end space-x-1 whitespace-nowrap">
                <!-- View / Eye -->
                <button type="button" class="btn-view-customer-profile p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" data-id="${c.id}" title="View profile" aria-label="View profile">
                  <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <!-- Edit / Pencil -->
                <button type="button" class="btn-edit-customer p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" data-id="${c.id}" title="Edit customer details" aria-label="Edit customer details">
                  <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <!-- Delete / Trash (Red) -->
                <button type="button" class="btn-delete-customer p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer" data-id="${c.id}" title="Delete customer" aria-label="Delete customer">
                  <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        `);
      });
    }
  }

  $('#filter-customers-search').on('input', renderCustomersSection);

  // Add Customer Modal
  $('#btn-add-customer-modal').on('click', function () {
    $('#form-customer')[0].reset();
    $('.text-rose-600').addClass('hidden');
    $('#modal-customer-title').text('Add Customer');
    $('#customer-edit-id').val('');
    $('#modal-customer').removeClass('hidden');
    $('#cust-input-name').focus();
  });

  // Customer Edit Modal Handlers
  function openEditCustomerModal(id) {
    if (!id) return;
    const c = Storage.get(STORAGE_KEYS.CUSTOMERS).find(x => x.id === id);
    if (!c) return;
    $('#modal-view-customer').addClass('hidden');
    $('#form-customer')[0].reset();
    $('.text-rose-600').addClass('hidden');
    $('#modal-customer-title').text('Edit Customer');
    $('#customer-edit-id').val(c.id);
    $('#cust-input-name').val(c.name || '');
    $('#cust-input-phone').val(c.phone || '');
    $('#cust-input-email').val(c.email || '');
    $('#cust-input-address').val(c.address || '');
    $('#modal-customer').removeClass('hidden');
    $('#cust-input-name').focus();
  }

  $(document).on('click', '.btn-edit-customer', function () {
    openEditCustomerModal($(this).data('id'));
  });

  $('#btn-edit-from-profile').on('click', function () {
    openEditCustomerModal(currentViewingCustomerId);
  });

  $('#form-customer').on('submit', function (e) {
    e.preventDefault();
    const editId = $('#customer-edit-id').val();
    const name = $.trim($('#cust-input-name').val());
    const phone = $.trim($('#cust-input-phone').val());
    const email = $.trim($('#cust-input-email').val());
    const addr = $.trim($('#cust-input-address').val());

    let hasError = false;
    if (!name) {
      $('#err-cust-name').removeClass('hidden');
      hasError = true;
    }
    if (!phone || phone.length < 8) {
      $('#err-cust-phone').removeClass('hidden');
      hasError = true;
    }
    if (hasError) return;

    const customers = Storage.get(STORAGE_KEYS.CUSTOMERS);

    if (editId) {
      const idx = customers.findIndex(x => x.id === editId);
      if (idx !== -1) {
        customers[idx].name = name;
        customers[idx].phone = phone;
        customers[idx].email = email;
        customers[idx].address = addr;
        Storage.set(STORAGE_KEYS.CUSTOMERS, customers);
        showToast(`Guest "${name}" updated successfully.`, 'success');
      }
    } else {
      const newCust = {
        id: 'cust-' + Date.now(),
        name,
        phone,
        email,
        address: addr,
        visits: 0,
        totalSpend: 0
      };
      customers.unshift(newCust);
      Storage.set(STORAGE_KEYS.CUSTOMERS, customers);
      showToast(`Guest "${name}" added to registry.`, 'success');
    }

    $('#modal-customer').addClass('hidden');
    renderCustomersSection();
    populateCustomerDropdown();
    renderSidebarBadges();
  });

  $(document).on('click', '.btn-delete-customer', function () {
    const id = $(this).data('id');
    const customers = Storage.get(STORAGE_KEYS.CUSTOMERS);
    const c = customers.find(x => x.id === id);
    if (!c) return;

    openConfirmDeleteModal(`Remove "${c.name}" from guest directory?`, function () {
      const updated = customers.filter(x => x.id !== id);
      Storage.set(STORAGE_KEYS.CUSTOMERS, updated);
      showToast(`Guest record removed.`, 'info');
      renderCustomersSection();
      populateCustomerDropdown();
      renderSidebarBadges();
    });
  });

  // Customer Profile View
  let currentViewingCustomerId = null;
  $(document).on('click', '.btn-view-customer-profile', function () {
    const id = $(this).data('id');
    currentViewingCustomerId = id;
    const customers = Storage.get(STORAGE_KEYS.CUSTOMERS);
    const c = customers.find(x => x.id === id);
    if (!c) return;

    $('#view-cust-name').text(c.name);
    $('#view-cust-phone').text(c.phone);
    $('#view-cust-email').text(c.email || 'None on file');
    $('#view-cust-address').text(c.address || 'Standard Guest');

    $('#view-cust-total-spend').text(formatMoney(c.totalSpend || 0));
    $('#view-cust-visits').text(c.visits || 0);

    const avgSpend = (c.visits && c.visits > 0) ? ((c.totalSpend || 0) / c.visits) : 0;
    $('#view-cust-avg-spend').text(formatMoney(avgSpend));

    // Customer past bills
    const bills = Storage.get(STORAGE_KEYS.BILLS);
    const custBills = bills.filter(b => (b.customerPhone === c.phone) || (b.customerName && b.customerName.toLowerCase() === c.name.toLowerCase()));

    const $tbody = $('#view-cust-bills-tbody');
    $tbody.empty();

    if (custBills.length === 0) {
      $tbody.append(`<tr><td colspan="5" class="py-3 text-center text-slate-400">No invoice history recorded yet.</td></tr>`);
    } else {
      custBills.forEach(b => {
        $tbody.append(`
          <tr>
            <td class="py-2 px-3 font-mono font-bold text-[#14213D]">${escapeHtml(b.billNumber)}</td>
            <td class="py-2 px-3 text-slate-500">${formatDateTime(b.date)}</td>
            <td class="py-2 px-3 text-slate-600 dark:text-slate-300 font-medium">${getPaymentMethodBadge(b.paymentMethod)}</td>
            <td class="py-2 px-3 text-center font-black text-slate-900 dark:text-white">${formatMoney(b.grandTotal)}</td>
            <td class="py-2 px-3 text-center">
              <button type="button" class="btn-view-bill btn-finset-secondary text-xs py-0.5 px-2" data-id="${b.id}">View</button>
            </td>
          </tr>
        `);
      });
    }

    $('#modal-view-customer').removeClass('hidden');
  });

  // =========================================================================
  // 9. REVENUE ANALYTICS & GLOBAL SEARCH
  // =========================================================================

  function renderAnalyticsSection() {
    const fromDate = $('#analytics-date-from').val() || '2026-10-01';
    const toDate = getTodayDateStr();
    $('#analytics-date-to').val(toDate);
    updateReportSummary(fromDate, toDate);
  }

  function updateReportSummary(fromDate, toDate) {
    const bills = Storage.get(STORAGE_KEYS.BILLS);
    let filteredBills = bills;

    if (fromDate && toDate) {
      filteredBills = bills.filter(b => {
        const d = (b.date || '').substring(0, 10);
        return d >= fromDate && d <= toDate;
      });
    }

    const totalTax = filteredBills.reduce((acc, b) => acc + (Number(b.taxAmount) || 0), 0);
    const totalDiscounts = filteredBills.reduce((acc, b) => acc + (Number(b.discountAmount) || 0), 0);
    const grossTotal = filteredBills.reduce((acc, b) => acc + (Number(b.grandTotal) || 0), 0);
    const avgBill = filteredBills.length > 0 ? (grossTotal / filteredBills.length) : 0;
    const netRevenue = Math.max(0, grossTotal - totalTax);

    animateNumber('#report-tax-collected', totalTax, { duration: 1000, decimals: 2, prefix: '₹' });
    animateNumber('#report-discounts-given', totalDiscounts, { duration: 1000, decimals: 2, prefix: '₹' });
    animateNumber('#report-avg-bill', avgBill, { duration: 1000, decimals: 2, prefix: '₹' });
    animateNumber('#report-net-revenue', netRevenue, { duration: 1100, decimals: 2, prefix: '₹' });

    // Top 5 Items
    const itemMap = {};
    filteredBills.forEach(b => {
      (b.items || []).forEach(item => {
        const key = item.name;
        if (!itemMap[key]) {
          itemMap[key] = {
            name: item.name,
            category: item.category || 'Main Course',
            qty: 0,
            revenue: 0
          };
        }
        itemMap[key].qty += (Number(item.qty) || 1);
        itemMap[key].revenue += (Number(item.subtotal) || (Number(item.price || 0) * Number(item.qty || 1)));
      });
    });

    const sortedItems = Object.values(itemMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const $tbody = $('#top-selling-items-tbody');
    $tbody.empty();

    if (sortedItems.length === 0) {
      $tbody.append(`<tr><td colspan="5" class="py-4 text-center text-slate-400">No sales recorded for this period.</td></tr>`);
    } else {
      sortedItems.forEach((it, idx) => {
        $tbody.append(`
          <tr class="bg-white hover:bg-slate-100/90 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all cursor-pointer relative">
            <td class="py-2.5 px-4 text-center text-slate-400 font-bold">${idx + 1}</td>
            <td class="py-2.5 px-4 text-left font-bold text-slate-900 dark:text-white">${escapeHtml(it.name)}</td>
            <td class="py-2.5 px-4 text-left text-slate-500 font-medium">${escapeHtml(it.category)}</td>
            <td class="py-2.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">${it.qty}</td>
            <td class="py-2.5 px-4 text-right font-black text-slate-900 dark:text-white">${formatMoney(it.revenue)}</td>
          </tr>
        `);
      });
    }
  }

  $('#analytics-date-from').on('change', function () {
    $('.analytics-preset-btn').removeClass('active bg-[#14213D] text-white').addClass('text-slate-600 hover:text-slate-900');
    const fromDate = $('#analytics-date-from').val();
    const toDate = getTodayDateStr();
    $('#analytics-date-to').val(toDate);
    if (fromDate) {
      updateReportSummary(fromDate, toDate);
    }
  });

  $('.analytics-preset-btn').on('click', function () {
    $('.analytics-preset-btn').removeClass('active bg-[#14213D] text-white').addClass('text-slate-600 hover:text-slate-900');
    $(this).addClass('active bg-[#14213D] text-white').removeClass('text-slate-600 hover:text-slate-900');
    const preset = $(this).data('preset');

    const toStr = getTodayDateStr();
    let fromStr = '2026-10-01';

    if (preset === 'today') {
      fromStr = toStr;
    } else if (preset === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      fromStr = `${y}-${m}-${day}`;
    } else if (preset === 'month') {
      const d = new Date();
      d.setDate(1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      fromStr = `${y}-${m}-${day}`;
    } else if (preset === 'year') {
      const d = new Date();
      const y = d.getFullYear();
      fromStr = `${y}-01-01`;
    } else if (preset === 'all') {
      fromStr = '2026-01-01';
    }

    $('#analytics-date-from').val(fromStr);
    $('#analytics-date-to').val(toStr);
    updateReportSummary(fromStr, toStr);
  });

  // Keyboard Shortcuts: ESC to close modals
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.fixed:not(#toast-container)').addClass('hidden');
    }
  });

  // Notification button action
  $('#btn-top-notifications').on('click', function () {
    showToast('Kitchen Ticket ORD-0082 (Room 304) is preparing. Front desk audit session active.', 'info');
  });

  // Device ID Badge (Default DEV08, click to copy)
  const defaultDeviceId = localStorage.getItem('aurelia_device_id') || 'DEV08';
  $('#topbar-device-id-text').text(defaultDeviceId);
  $('#topbar-device-id-badge').on('click', function () {
    const devId = $('#topbar-device-id-text').text().trim() || 'DEV08';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(devId).catch(() => { });
    }
    showToast(`Device ID: ${devId} copied to clipboard`, 'info');
  });

  // =========================================================================
  // USER PROFILE & PHOTO MANAGEMENT CONTROLLER
  // =========================================================================
  let currentPendingAvatar = null;

  function getActiveUserData() {
    let user = (window.Auth && window.Auth.state && window.Auth.state.currentUser) || null;
    if (!user) {
      try {
        const stored = localStorage.getItem('aurelia_auth_user') || sessionStorage.getItem('aurelia_auth_user');
        if (stored) user = JSON.parse(stored);
      } catch (e) { }
    }
    if (!user) {
      user = {
        id: 'usr-guest',
        name: 'Aurelia Staff',
        username: '',
        email: 'staff@aureliahotel.com',
        phone: '+91 98450 11201',
        role: 'Front Desk Supervisor',
        department: 'Front Office',
        empId: 'EMP-2026-01',
        avatar: null
      };
    }
    return user;
  }

  function updateModalAvatarPreview(avatarDataUrl, nameStr) {
    const $img = $('#modal-profile-avatar-img');
    const $text = $('#modal-profile-avatar-text');
    const $removeBtn = $('#btn-remove-photo');

    const initials = (nameStr || 'Aurelia Staff')
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AU';

    if (avatarDataUrl) {
      $img.attr('src', avatarDataUrl).removeClass('hidden');
      $text.addClass('hidden');
      $removeBtn.removeClass('opacity-50 cursor-not-allowed').removeAttr('disabled');
    } else {
      $img.attr('src', '').addClass('hidden');
      $text.text(initials).removeClass('hidden');
      $removeBtn.addClass('opacity-50 cursor-not-allowed').attr('disabled', 'disabled');
    }
  }

  function updateTopbarAvatarUI(user) {
    if (!user) user = getActiveUserData();
    const $avatarImg = $('#topbar-user-avatar-img');
    const $avatarText = $('#topbar-user-avatar-text');

    const displayName = (user && user.name ? String(user.name).trim() : '') || 'Aurelia Staff';
    const userRole = (user && user.role ? String(user.role).trim() : '') || 'Front Desk Supervisor';
    const userEmail = (user && user.email ? String(user.email).trim() : '');
    const userUsername = (user && user.username ? String(user.username).trim().replace(/^@+/, '') : '');
    const initials = displayName
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AU';

    if (user && user.avatar) {
      $avatarImg.attr('src', user.avatar).removeClass('hidden');
      $avatarText.addClass('hidden');
    } else {
      $avatarImg.attr('src', '').addClass('hidden');
      $avatarText.text(initials).removeClass('hidden');
    }

    const summary = [displayName, userRole, userUsername ? '@' + userUsername : '', userEmail].filter(Boolean).join(' • ');
    $('#user-profile-capsule')
      .attr('data-instant-tooltip', `${summary} (Click for Profile)`)
      .removeAttr('title');

    // Update greeting consistently across all pages
    const firstName = displayName.split(' ')[0] || 'Guest';
    $('#topbar-welcome-title').text(`Welcome back, ${firstName}!`);
  }

  function ensureUserProfileModal() {
    if ($('#modal-user-profile').length > 0) return;
    $('body').append(`
      <div id="modal-user-profile"
        class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm hidden flex items-center justify-center p-3 sm:p-4">
        <div
          class="Aurelia-card max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 min-w-10 min-h-10 rounded-full flex-shrink-0 aspect-square bg-gradient-to-tr from-[#14213D] to-[#FCA311] flex items-center justify-center text-white shadow-md">
                <svg class="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="text-base font-bold text-slate-900 dark:text-white">User Profile & Account</h3>
                </div>
                <p class="text-xs text-slate-400">View and update your personal credentials, contact info, and profile photo</p>
              </div>
            </div>
            <button type="button" class="btn-close-modal w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white flex items-center justify-center transition-colors text-sm font-semibold" title="Close">✕</button>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
            <div class="relative group flex-shrink-0">
              <div id="modal-profile-avatar-preview" class="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-[#14213D] text-[#FCA311] font-extrabold text-2xl flex items-center justify-center shadow-md ring-4 ring-[#FCA311]/25 overflow-hidden relative">
                <span id="modal-profile-avatar-text">AU</span>
                <img id="modal-profile-avatar-img" src="" alt="Profile Photo" class="w-full h-full object-cover hidden">
              </div>
              <button type="button" id="btn-trigger-avatar-file" class="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#FCA311] text-[#14213D] flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer" title="Upload photo">
                <svg class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </button>
            </div>
            <div class="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
              <div>
                <h4 class="text-xs font-bold text-slate-900 dark:text-slate-100">Profile Photo</h4>
                <p class="text-[11px] text-slate-400">Upload your staff photo for receipts, kitchen orders, and staff directory</p>
              </div>
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                <input type="file" id="input-profile-avatar-file" accept="image/png, image/jpeg, image/jpg, image/webp" class="hidden">
                <button type="button" id="btn-upload-photo" class="px-3 py-1.5 rounded-xl bg-[#14213D] hover:bg-[#1f325d] text-[#FCA311] text-[11px] font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer">
                  <span>Upload Photo</span>
                </button>
                <button type="button" id="btn-remove-photo" class="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-rose-100 text-slate-600 hover:text-rose-600 dark:bg-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center space-x-1.5 transition-all cursor-pointer">
                  <span>Remove Photo</span>
                </button>
              </div>
            </div>
          </div>
          <form id="form-user-profile" class="space-y-3.5 overflow-y-auto flex-1 pr-1">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Full Name *</label>
                <input type="text" id="input-profile-name" required class="Aurelia-input w-full text-xs font-semibold py-2 px-3">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Email Address *</label>
                <input type="email" id="input-profile-email" required class="Aurelia-input w-full text-xs py-2 px-3">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Phone Number</label>
                <input type="tel" id="input-profile-phone" class="Aurelia-input w-full text-xs py-2 px-3">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Employee ID</label>
                <input type="text" id="input-profile-empid" class="Aurelia-input w-full text-xs py-2 px-3 bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 cursor-not-allowed font-mono" value="EMP-2026-01" readonly>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Role / Designation</label>
                <select id="select-profile-role" class="Aurelia-input w-full text-xs font-medium py-2 px-3">
                  <option value="Front Desk Supervisor">Front Desk Supervisor</option>
                  <option value="Hotel Operations Manager">Hotel Operations Manager</option>
                  <option value="Executive Chef / F&B Manager">Executive Chef / F&B Manager</option>
                  <option value="Night Auditor & Cashier">Night Auditor & Cashier</option>
                  <option value="General Manager">General Manager</option>
                  <option value="Guest Relations Executive">Guest Relations Executive</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Department</label>
                <select id="select-profile-dept" class="Aurelia-input w-full text-xs font-medium py-2 px-3">
                  <option value="Front Office">Front Office</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Accounts & Billing">Accounts & Billing</option>
                  <option value="Housekeeping & Operations">Housekeeping & Operations</option>
                  <option value="Executive Administration">Executive Administration</option>
                </select>
              </div>
            </div>
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <button type="button" id="btn-profile-signout" class="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer">
                <span>Sign Out</span>
              </button>
              <div class="flex items-center space-x-2">
                <button type="button" class="btn-close-modal btn-Aurelia-secondary text-xs py-2 px-4">Cancel</button>
                <button type="submit" id="btn-save-profile" class="btn-Aurelia-primary text-xs py-2 px-5 flex items-center space-x-1.5 shadow-md">
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `);
  }

  function openUserProfileModal() {
    ensureUserProfileModal();
    const $modal = $('#modal-user-profile');
    // Ensure modal is always a direct child of document.body so no parent container can hide or clip it
    if ($modal.length && document.body && $modal[0].parentElement !== document.body) {
      $modal.appendTo('body');
    }
    const user = getActiveUserData();

    $('#input-profile-name').val(user.name || 'Aurelia Staff');
    $('#input-profile-email').val(user.email || '');
    $('#input-profile-phone').val(user.phone || '+91 98450 11201');
    $('#input-profile-empid').val(user.empId || 'EMP-2026-01');

    if (user.role) {
      const $roleSel = $('#select-profile-role');
      if ($roleSel.find(`option[value="${user.role.replace(/"/g, '\\"')}"]`).length === 0) {
        $roleSel.append($('<option>', { value: user.role, text: user.role }));
      }
      $roleSel.val(user.role);
    }
    if (user.department) {
      $('#select-profile-dept').val(user.department);
    }

    currentPendingAvatar = user.avatar || null;
    $('#input-profile-avatar-file').val('');
    updateModalAvatarPreview(currentPendingAvatar, user.name);

    $modal.removeClass('hidden');
  }

  window.updateTopbarAvatarUI = updateTopbarAvatarUI;
  window.openUserProfileModal = openUserProfileModal;
  window.renderDashboard = renderDashboard;

  // Open modal when topbar profile button or avatar is clicked
  $(document).on('click', '#user-profile-capsule, #topbar-user-avatar', function (e) {
    if (this.id === 'topbar-user-avatar' && $(this).closest('#user-profile-capsule').length) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    openUserProfileModal();
  });

  // Close injected/existing user profile modal via Close buttons or backdrop
  $(document).on('click', '#modal-user-profile .btn-close-modal', function () {
    $('#modal-user-profile').addClass('hidden');
  });
  $(document).on('click', '#modal-user-profile', function (e) {
    if (e.target && e.target.id === 'modal-user-profile') {
      $('#modal-user-profile').addClass('hidden');
    }
  });

  // Trigger file selection
  $(document).on('click', '#btn-upload-photo, #btn-trigger-avatar-file', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#input-profile-avatar-file').trigger('click');
  });

  // Handle image file selection
  $(document).on('change', '#input-profile-avatar-file', function (e) {
    const file = this.files && this.files[0];
    if (!file) return;

    if (!file.type.match(/^image\//i)) {
      showToast('Please select a valid image file (JPG, PNG, or WebP).', 'warning');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showToast('Image file size must be less than 4MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      currentPendingAvatar = event.target.result;
      updateModalAvatarPreview(currentPendingAvatar, $('#input-profile-name').val());
      showToast('Photo loaded preview! Click "Save Changes" to apply.', 'info');
    };
    reader.onerror = function () {
      showToast('Could not read image file. Please try another image.', 'error');
    };
    reader.readAsDataURL(file);
  });

  // Remove photo
  $(document).on('click', '#btn-remove-photo', function (e) {
    e.preventDefault();
    currentPendingAvatar = null;
    $('#input-profile-avatar-file').val('');
    updateModalAvatarPreview(null, $('#input-profile-name').val());
    showToast('Profile photo removed. User initials will be displayed.', 'info');
  });

  // Update initials live if name changes without custom photo
  $(document).on('input', '#input-profile-name', function () {
    if (!currentPendingAvatar) {
      updateModalAvatarPreview(null, $(this).val());
    }
  });

  // Quick Sign Out directly from profile popup
  $(document).on('click', '#btn-profile-signout', function (e) {
    e.preventDefault();
    $('#modal-user-profile').addClass('hidden');
    if (window.Auth && typeof window.Auth.showLogoutConfirmation === 'function') {
      window.Auth.showLogoutConfirmation();
    }
  });

  // Save Profile Form
  $(document).on('submit', '#form-user-profile', function (e) {
    e.preventDefault();

    const nameVal = $('#input-profile-name').val().trim();
    const emailVal = $('#input-profile-email').val().trim();
    const phoneVal = $('#input-profile-phone').val().trim();
    const empIdVal = $('#input-profile-empid').val().trim() || 'EMP-2026-01';
    const roleVal = $('#select-profile-role').val();
    const deptVal = $('#select-profile-dept').val();

    if (!nameVal) {
      showToast('Please enter your full name.', 'warning');
      $('#input-profile-name').focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showToast('Please enter a valid email address.', 'warning');
      $('#input-profile-email').focus();
      return;
    }

    const applyProfileChanges = () => {
      const existingUser = getActiveUserData();
      const updatedUser = {
        ...existingUser,
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        empId: empIdVal,
        role: roleVal,
        department: deptVal,
        avatar: currentPendingAvatar
      };

      // 1. Update session/local storage
      try {
        localStorage.setItem('aurelia_auth_user', JSON.stringify(updatedUser));
        sessionStorage.setItem('aurelia_auth_user', JSON.stringify(updatedUser));
      } catch (err) {
        console.warn('Storage quota error:', err);
      }

      // 2. Update local registered users list
      try {
        const localUsersStr = localStorage.getItem('aurelia_local_users');
        if (localUsersStr) {
          const localUsers = JSON.parse(localUsersStr);
          const idx = localUsers.findIndex(u =>
            (u.email && u.email.toLowerCase() === (existingUser.email || '').toLowerCase()) ||
            u.id === existingUser.id
          );
          if (idx >= 0) {
            localUsers[idx] = { ...localUsers[idx], ...updatedUser };
          } else {
            localUsers.push(updatedUser);
          }
          localStorage.setItem('aurelia_local_users', JSON.stringify(localUsers));
        }
      } catch (e) { }

      // 3. Update staffDirectory roster if Adaline / EMP-2026-01 exists
      if (typeof staffDirectory !== 'undefined' && Array.isArray(staffDirectory)) {
        const staffIdx = staffDirectory.findIndex(s => s.id === empIdVal || s.name === existingUser.name);
        if (staffIdx >= 0) {
          staffDirectory[staffIdx].name = nameVal;
          staffDirectory[staffIdx].role = roleVal;
          staffDirectory[staffIdx].department = deptVal;
          staffDirectory[staffIdx].phone = phoneVal;
          staffDirectory[staffIdx].email = emailVal;
          if (typeof renderStaffDirectoryModal === 'function') {
            renderStaffDirectoryModal();
          }
        }
      }

      // 4. Update window.Auth state if active
      if (window.Auth) {
        if (window.Auth.state) {
          window.Auth.state.currentUser = updatedUser;
        }
        if (typeof window.Auth.syncUserProfile === 'function') {
          window.Auth.syncUserProfile(updatedUser);
        }
      }

      // 5. Update topbar avatar & profile capsule display immediately
      updateTopbarAvatarUI(updatedUser);
      if ($('#section-dashboard').length > 0 && typeof renderDashboard === 'function') {
        renderDashboard();
      }

      // 6. Close modal & show SweetAlert Saved!
      $('#modal-user-profile').addClass('hidden');
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        showToast('Profile and photo updated successfully!', 'success');
      }
    };

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          applyProfileChanges();
        } else if (result.isDenied) {
          $('#modal-user-profile').addClass('hidden');
          currentPendingAvatar = null;
          Swal.fire({
            position: "center",
            icon: "info",
            title: "Changes are not saved",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    } else {
      applyProfileChanges();
    }
  });

  // =========================================================================
  // 10. HR DOCUMENT TEMPLATES STANDALONE PAGE CONTROLLER
  // =========================================================================
  const DEFAULT_HR_TEMPLATES = [
    {
      id: 'doc-emp-01',
      empId: 'FD-26-DY01',
      empName: 'Piyush Barua',
      avatar: 'images/emp-piyush.jpg',
      initials: 'PB',
      department: 'Front Desk',
      deptCode: 'FD',
      format: 'CSV',
      isVerified: true,
      title: 'Employment Contract & Onboarding Form',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Front Desk Operations</p><p>Official employment contract for Piyush Barua assigned to Luxury Front Desk Concierge.</p></div>'
    },
    {
      id: 'doc-emp-02',
      empId: 'FD-26-DY02',
      empName: 'Adaline Lively',
      avatar: 'images/avatar-female.png',
      initials: 'AL',
      department: 'Front Desk',
      deptCode: 'FD',
      format: 'PDF',
      isVerified: true,
      title: 'Executive & Staff Employment Agreement',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Front Desk Management</p><p>Permanent employment agreement outlining supervisory terms for Adaline Lively.</p></div>'
    },
    {
      id: 'doc-emp-03',
      empId: 'HK-26-DY03',
      empName: 'Marcus Vance',
      avatar: 'images/emp-marcus.jpg',
      initials: 'HK',
      department: 'Housekeeping',
      deptCode: 'HK',
      format: 'DOCX',
      isVerified: true,
      title: 'Hotel Non-Disclosure & Guest Data Privacy Agreement',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Confidentiality & Guest Data</p><p>Strict guest privacy undertaking executed for Housekeeping Supervisor Marcus Vance.</p></div>'
    },
    {
      id: 'doc-emp-04',
      empId: 'HK-26-DY04',
      empName: 'Elena Rostova',
      avatar: 'images/avatar-female.png',
      initials: 'ER',
      department: 'Housekeeping',
      deptCode: 'HK',
      format: 'PDF',
      isVerified: true,
      title: 'Formal Job Offer & Appointment Letter',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Appointment Details</p><p>Appointment letter with CTC breakdown and shift assignment for Elena Rostova.</p></div>'
    },
    {
      id: 'doc-emp-05',
      empId: 'FB-26-DY05',
      empName: 'Chef Jean-Marc',
      avatar: 'images/avatar-male.png',
      initials: 'JM',
      department: 'Food & Beverage',
      deptCode: 'FB',
      format: 'PDF',
      isVerified: true,
      title: 'Culinary Recipes & Food Formula Protection Agreement',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Kitchen & Recipe IP</p><p>Protection of signature dining recipes and culinary protocols for Executive Chef Jean-Marc.</p></div>'
    },
    {
      id: 'doc-emp-06',
      empId: 'FB-26-DY06',
      empName: 'Sophia Chen',
      avatar: 'images/avatar-female.png',
      initials: 'SC',
      department: 'Food & Beverage',
      deptCode: 'FB',
      format: 'DOCX',
      isVerified: 'Pending',
      title: 'POS Terminal & Cashier Handover Policy',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Cash Desk & Terminal Handover</p><p>Daily EDC terminal settlement agreement for Cafe Barista Sophia Chen.</p></div>'
    },
    {
      id: 'doc-emp-07',
      empId: 'HR-26-DY07',
      empName: 'Rajesh Sharma',
      avatar: 'images/emp-rajesh.jpg',
      initials: 'HR',
      department: 'Human Resources',
      deptCode: 'HR',
      format: 'PDF',
      isVerified: 'Verified',
      title: 'Hospitality Internship & Industrial Trainee Agreement',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. HR Talent Onboarding</p><p>Accredited trainee rotation agreement for HR Coordinator Rajesh Sharma.</p></div>'
    },
    {
      id: 'doc-emp-08',
      empId: 'HR-26-DY08',
      empName: 'Sunita Rao',
      avatar: 'images/avatar-female.png',
      initials: 'SR',
      department: 'Human Resources',
      deptCode: 'HR',
      format: 'CSV',
      isVerified: 'Verified',
      title: 'Banquet & Event On-Call Casual Staff Agreement',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Duty & Call Sheet</p><p>Staff roster and emergency shift agreement for Sunita Rao.</p></div>'
    },
    {
      id: 'doc-emp-09',
      empId: 'AC-26-DY09',
      empName: 'Ananya Deshmukh',
      avatar: 'images/avatar-female.png',
      initials: 'AC',
      department: 'Accounts & Finance',
      deptCode: 'AC',
      format: 'XLSX',
      isVerified: 'Verified',
      title: 'Anti-Harassment, POSH & Code of Ethics Undertaking',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Ethics & Compliance</p><p>Financial compliance and hotel code of conduct signed by Accounts Officer Ananya Deshmukh.</p></div>'
    },
    {
      id: 'doc-emp-10',
      empId: 'AC-26-DY10',
      empName: 'Vikramaditya Roy',
      avatar: 'images/avatar-male.png',
      initials: 'VR',
      department: 'Accounts & Finance',
      deptCode: 'AC',
      format: 'PDF',
      isVerified: 'Pending',
      title: 'HACCP & Commercial Kitchen Food Safety Protocol',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Financial Audits</p><p>Quarterly audit and inventory compliance record for Vikramaditya Roy.</p></div>'
    },
    {
      id: 'doc-emp-11',
      empId: 'FB-26-DY11',
      empName: 'Kavita Nair',
      avatar: 'images/avatar-female.png',
      initials: 'KN',
      department: 'Food & Beverage',
      deptCode: 'FB',
      format: 'DOCX',
      isVerified: 'Rejected',
      title: 'Official Performance Advisory & Warning Letter Template',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Performance Appraisal</p><p>Standard performance documentation for Banquet Captain Kavita Nair.</p></div>'
    },
    {
      id: 'doc-emp-12',
      empId: 'MG-26-DY12',
      empName: 'David Miller',
      avatar: 'images/avatar-male.png',
      initials: 'MG',
      department: 'Management',
      deptCode: 'MG',
      format: 'PDF',
      isVerified: 'Verified',
      title: 'Employee Experience Certificate & Relieving Letter',
      body: '<div class="space-y-3"><p class="font-bold text-slate-800 uppercase tracking-wide">1. Relieving Undertaking</p><p>General management service certificate for Operations Lead David Miller.</p></div>'
    }
  ];

  let HR_TEMPLATES = [];
  try {
    let storedHrTpls = localStorage.getItem('aurelia_hr_templates_v8');
    if (!storedHrTpls) {
      const v6 = localStorage.getItem('aurelia_hr_templates_v6') || localStorage.getItem('aurelia_hr_templates_v5');
      if (v6) {
        try {
          const parsed = JSON.parse(v6);
          parsed.forEach(p => {
            if (p.avatar && typeof p.avatar === 'string' && p.avatar.startsWith('employees/')) {
              p.avatar = p.avatar.replace('employees/', 'images/');
            }
            if (p.id === 'doc-emp-11' && (p.isVerified === false || p.isVerified === 'Pending')) {
              p.isVerified = 'Rejected';
            }
          });
          storedHrTpls = JSON.stringify(parsed);
          localStorage.setItem('aurelia_hr_templates_v8', storedHrTpls);
        } catch (e) { }
      }
    }
    if (storedHrTpls) {
      HR_TEMPLATES = JSON.parse(storedHrTpls);
      // Migrate any lingering 'employees/' avatar paths to 'images/'
      HR_TEMPLATES.forEach(p => {
        if (p.avatar && typeof p.avatar === 'string' && p.avatar.startsWith('employees/')) {
          p.avatar = p.avatar.replace('employees/', 'images/');
        }
        if (p.id === 'doc-emp-11' && (p.isVerified === false || p.isVerified === 'Pending')) {
          p.isVerified = 'Rejected';
        }
      });
      localStorage.setItem('aurelia_hr_templates_v8', JSON.stringify(HR_TEMPLATES));
    } else {
      HR_TEMPLATES = [...DEFAULT_HR_TEMPLATES];
      localStorage.setItem('aurelia_hr_templates_v8', JSON.stringify(HR_TEMPLATES));
    }
  } catch (err) {
    HR_TEMPLATES = [...DEFAULT_HR_TEMPLATES];
  }

  let currentHrDocCategory = 'all';

  function renderHrDocumentsSection() {
    const $tbody = $('#hr-templates-tbody');
    if (!$tbody.length) return;

    if ($('#select-hr-doc-category').length) {
      currentHrDocCategory = $('#select-hr-doc-category').val() || 'all';
    }

    const isHrDocTemplatePage = window.location.pathname.includes('hr-document-template');
    const isHrEmployeeListPage = window.location.pathname.includes('hr-employee-list');
    const isSubdir = window.location.pathname.includes('/human-resources') || window.location.pathname.includes('/department') || window.location.pathname.includes('/billing-management');
    const assetPrefix = isSubdir ? '../assets/' : 'assets/';

    const filtered = HR_TEMPLATES.filter(tpl => {
      if (!currentHrDocCategory || currentHrDocCategory === 'all') return true;
      const dept = (tpl.department || '').trim().toLowerCase();
      const cat = currentHrDocCategory.trim().toLowerCase();
      return dept === cat;
    });

    if (filtered.length === 0) {
      $tbody.empty();
      $('#hr-templates-empty').removeClass('hidden');
      $('#hr-templates-count-label').text(`Showing 0 of ${HR_TEMPLATES.length} records`);
      return;
    }

    $('#hr-templates-empty').addClass('hidden');

    let displayList = filtered;
    if (isHrDocTemplatePage) {
      if (currentHrDocCategory === 'all') {
        displayList = filtered.slice(0, 4);
        $('#hr-templates-count-label').text(`Showing top ${displayList.length} of ${HR_TEMPLATES.length} records`);
        $('#hr-templates-see-more-wrap').removeClass('hidden');
      } else {
        displayList = filtered;
        $('#hr-templates-count-label').text(`Showing ${displayList.length} of ${HR_TEMPLATES.length} records for ${currentHrDocCategory}`);
        $('#hr-templates-see-more-wrap').addClass('hidden');
      }
    } else {
      // On hr-employee-list (extended page) or standalone: show ALL filtered records
      displayList = filtered;
      if (currentHrDocCategory === 'all') {
        $('#hr-templates-count-label').text(`Showing all ${displayList.length} records`);
      } else {
        $('#hr-templates-count-label').text(`Showing ${displayList.length} of ${HR_TEMPLATES.length} records for ${currentHrDocCategory}`);
      }
      $('#hr-templates-see-more-wrap').addClass('hidden');
    }

    let html = '';
    displayList.forEach(tpl => {
      const vStr = String(tpl.isVerified === undefined || tpl.isVerified === null ? '' : tpl.isVerified).toLowerCase().trim();
      let verifyBadge = '';
      if (vStr === 'true' || vStr === 'verified') {
        verifyBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#15803d] text-white shadow-2xs">Verified</span>';
      } else if (vStr === 'rejected' || vStr === 'reject') {
        verifyBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#b91c1c] text-white shadow-2xs">Rejected</span>';
      } else {
        verifyBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#d97706] text-white shadow-2xs">Pending</span>';
      }

      // Profile Picture
      const femaleNames = [
        'tanvi', 'priya', 'priyanka', 'ananya', 'neha', 'sunita', 'meenakshi',
        'aarti', 'pooja', 'deepa', 'simran', 'shanti', 'lakshmi', 'rekha',
        'geeta', 'mary', 'savita', 'kavita', 'shreya', 'trisha', 'adaline', 'elena', 'sophia'
      ];
      const isFemale = femaleNames.some(fn => (tpl.empName || '').toLowerCase().includes(fn));
      const defaultAvatarFile = isFemale ? 'avatar-female.png' : 'avatar-male.png';

      let avatarPath = tpl.avatar;
      if (!avatarPath || (typeof avatarPath === 'string' && avatarPath.includes('badge-fo-sample'))) {
        avatarPath = 'images/' + defaultAvatarFile;
      }
      if (typeof avatarPath === 'string' && avatarPath.startsWith('employees/')) {
        avatarPath = avatarPath.replace('employees/', 'images/');
      }
      const imgSrc = (avatarPath.startsWith('data:') || avatarPath.startsWith('http'))
        ? avatarPath
        : (assetPrefix + avatarPath);

      const avatarHtml = `
        <img src="${imgSrc}" alt="${escapeHtml(tpl.empName)}"
          class="w-9 h-9 rounded-xl object-cover object-top shadow-xs border border-white/60 dark:border-slate-700 flex-shrink-0"
          onerror="this.onerror=null; this.src='${assetPrefix}images/${defaultAvatarFile}';">
      `;

      html += `
        <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group" data-id="${escapeHtml(tpl.id)}">
          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded text-xs font-mono font-bold bg-[#14213D] text-[#FCA311] inline-block shadow-xs tracking-wider">
              ${tpl.empId}
            </span>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <div class="flex items-center space-x-3">
              ${avatarHtml}
              <div class="min-w-0">
                <div class="font-bold text-slate-900 dark:text-white text-xs truncate">${escapeHtml(tpl.empName)}</div>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 inline-block">
              ${escapeHtml(tpl.department)}
            </span>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <span class="px-2.5 py-0.5 rounded font-mono font-bold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-flex items-center space-x-1">
              <svg class="w-3.5 h-3.5 stroke-current text-[#FCA311]" fill="none" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
              <span>${escapeHtml(tpl.format || 'PDF')}</span>
            </span>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            ${verifyBadge}
          </td>
          <td class="py-3.5 px-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-end space-x-1">
              <!-- View / Eye -->
              <button type="button" class="btn-preview-hr-doc p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="View Document" data-id="${tpl.id}">
                <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <!-- Edit / Pencil -->
              <button type="button" class="btn-edit-hr-doc p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Edit Record" data-id="${tpl.id}">
                <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <!-- Delete / Trash (Red) -->
              <button type="button" class="btn-delete-hr-doc p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer" title="Delete Record" data-id="${tpl.id}">
                <svg class="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    });
    $tbody.html(html);
  }

  // Department Dropdown Filter
  $(document).on('change', '#select-hr-doc-category', function () {
    currentHrDocCategory = $(this).val() || 'all';
    renderHrDocumentsSection();
  });

  $(document).on('click', '.hr-doc-filter-btn', function () {
    $('.hr-doc-filter-btn').removeClass('active bg-[#14213D] text-white shadow-xs').addClass('text-slate-600 dark:text-slate-400 hover:text-slate-900');
    $(this).addClass('active bg-[#14213D] text-white shadow-xs').removeClass('text-slate-600 dark:text-slate-400 hover:text-slate-900');
    currentHrDocCategory = $(this).data('category') || 'all';
    if ($('#select-hr-doc-category').length) {
      $('#select-hr-doc-category').val(currentHrDocCategory);
    }
    renderHrDocumentsSection();
  });

  // Action: Preview Document (Eye Icon)
  $(document).on('click', '.btn-preview-hr-doc', function () {
    const id = $(this).data('id');
    const tpl = HR_TEMPLATES.find(t => t.id === id);
    if (!tpl) return;

    $('#preview-doc-title').text(`${tpl.empName} - ${tpl.title || 'Official Document'}`);
    const vStr = String(tpl.isVerified === undefined || tpl.isVerified === null ? '' : tpl.isVerified).toLowerCase().trim();
    const statusLabel = (vStr === 'true' || vStr === 'verified') ? 'Verified' : (vStr === 'rejected' || vStr === 'reject' ? 'Rejected' : 'Pending');
    $('#preview-doc-meta').text(`${tpl.department} • ID: ${tpl.empId} • Format: ${tpl.format} • ${statusLabel}`);
    $('#preview-doc-ref').text(`REF: AUR/26/${tpl.empId}`);
    $('#preview-doc-body').html(tpl.body || `<div class="space-y-4"><p class="font-bold text-slate-800">Employee: ${escapeHtml(tpl.empName)}</p><p>Department: ${escapeHtml(tpl.department)} (ID: ${escapeHtml(tpl.empId)})</p><p class="text-xs text-slate-500">Document verified: ${tpl.isVerified ? 'Yes' : 'Pending Review'}</p></div>`);

    $('#modal-preview-hr-doc').removeClass('hidden');
  });

  // Action: Edit Employee Record (Pencil Icon)
  $(document).on('click', '.btn-edit-hr-doc', function () {
    const id = $(this).data('id');
    const tpl = HR_TEMPLATES.find(t => t.id === id);
    if (!tpl) return;

    const newName = prompt('Update Employee Name:', tpl.empName);
    if (newName === null) return;
    const trimmed = $.trim(newName);
    if (!trimmed) {
      showToast('Employee name cannot be empty.', 'error');
      return;
    }
    tpl.empName = trimmed;
    try {
      localStorage.setItem('aurelia_hr_templates_v8', JSON.stringify(HR_TEMPLATES));
    } catch (e) { }
    renderHrDocumentsSection();
    showToast(`Updated record for ${tpl.empId}`, 'success');
  });

  // Action: Delete Employee Record (Trash Icon)
  $(document).on('click', '.btn-delete-hr-doc', function () {
    const id = $(this).data('id');
    const idx = HR_TEMPLATES.findIndex(t => t.id === id);
    if (idx === -1) return;

    const item = HR_TEMPLATES[idx];
    if (confirm(`Are you sure you want to delete employee record ${item.empName} (${item.empId})?`)) {
      HR_TEMPLATES.splice(idx, 1);
      try {
        localStorage.setItem('aurelia_hr_templates_v8', JSON.stringify(HR_TEMPLATES));
      } catch (e) { }
      renderHrDocumentsSection();
      showToast(`Record ${item.empId} deleted successfully.`, 'info');
    }
  });

  // Action: Print and Download are handled directly by printHrDocumentDirectly() in template to prevent duplicate triggers

  // Redirect to HR Employee Lists page when clicking 'See More'
  $(document).on('click', '#btn-see-more-hr-docs', function (e) {
    e.preventDefault();
    const isHrFolder = window.location.pathname.includes('human-resources');
    const targetUrl = isHrFolder ? 'hr-employee-list.html' : 'human-resources/hr-employee-list.html';
    window.location.href = targetUrl;
  });

  // Handle Profile Picture / Logo Upload in Add Document Form (+ sign container)
  let selectedAvatarDataUrl = null;

  $(document).on('change', '#hr-doc-input-avatar', function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, JPEG).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (evt) {
      selectedAvatarDataUrl = evt.target.result;
      $('#hr-avatar-preview-box').html(`
        <img src="${selectedAvatarDataUrl}" alt="Avatar Preview" class="w-5 h-5 object-cover rounded-md shadow-xs border border-amber-300" />
      `);
      showToast('Profile image attached!', 'success');
    };
    reader.readAsDataURL(file);
  });

  // Form Submit: Upload & Add Employee Record
  $(document).on('submit', '#form-upload-hr-doc', function (e) {
    e.preventDefault();
    const empName = $.trim($('#hr-doc-input-title').val());
    const dept = $('#hr-doc-input-dept').val();
    const deptCode = $('#hr-doc-input-dept option:selected').data('code') || (dept ? dept.substring(0, 2).toUpperCase() : 'FD');
    const isVerifiedVal = $('#hr-doc-input-verify').val() || 'Verified';

    const fileInput = document.getElementById('hr-doc-input-file');
    const fileName = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : 'document.pdf';

    let fileFormat = 'PDF';
    const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
    if (extMatch) {
      fileFormat = extMatch[1].toUpperCase();
    }

    if (!empName || !dept) {
      showToast('Please enter employee name and select department.', 'error');
      return;
    }

    // Format: DE-26-DY01
    const serialNum = String(HR_TEMPLATES.length + 1).padStart(2, '0');
    const empId = `${deptCode}-26-DY${serialNum}`;
    const newId = 'doc-custom-' + Date.now();

    const nameParts = empName.split(' ');
    const initials = nameParts.length > 1 ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() : empName.substring(0, 2).toUpperCase();

    const newDoc = {
      id: newId,
      empId: empId,
      empName: empName,
      avatar: selectedAvatarDataUrl || null,
      initials: initials,
      department: dept,
      deptCode: deptCode,
      format: fileFormat,
      isVerified: isVerifiedVal,
      title: `${dept} Official Document`,
      body: `<div class="space-y-4"><p class="font-bold text-slate-900">${escapeHtml(empName)} (${escapeHtml(empId)})</p><p>Department: ${escapeHtml(dept)}</p><p class="text-xs text-slate-500">Uploaded File: ${escapeHtml(fileName)}</p></div>`
    };

    HR_TEMPLATES.unshift(newDoc);
    try {
      localStorage.setItem('aurelia_hr_templates_v8', JSON.stringify(HR_TEMPLATES));
    } catch (e) {
      console.warn('Failed to save HR templates to localStorage', e);
    }

    renderHrDocumentsSection();
    showToast(`Employee ${empName} (${empId}) added successfully!`, 'success');
    this.reset();
    selectedAvatarDataUrl = null;
    $('#hr-avatar-preview-box').html(`
      <svg class="w-4 h-4 stroke-current stroke-[2.2] transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    `);
  });

  // 11. EMPLOYEES STANDALONE PAGE CONTROLLER
  // =========================================================================
  let currentStaffPageFilter = 'all';

  function renderEmployeesSection() {
    const staffList = Storage.get(STORAGE_KEYS.STAFF, DEFAULT_STAFF) || DEFAULT_STAFF;
    const search = $.trim($('#input-page-staff-search').val()).toLowerCase();
    const deptFilter = $('#select-page-staff-dept').val() || 'all';

    const filtered = staffList.filter(s => {
      const matchStatus = (currentStaffPageFilter === 'all') ||
        (currentStaffPageFilter === 'onduty' && s.status === 'On Duty') ||
        (currentStaffPageFilter === 'leave' && s.status === 'On Leave');

      const matchDept = (deptFilter === 'all') || (s.department === deptFilter);

      const sName = (s.name || '').toLowerCase();
      const sRole = (s.role || '').toLowerCase();
      const sDept = (s.department || '').toLowerCase();
      const sId = (s.id || '').toLowerCase();

      const matchSearch = !search || sName.includes(search) || sRole.includes(search) || sDept.includes(search) || sId.includes(search);
      return matchStatus && matchDept && matchSearch;
    });

    const $tbody = $('#page-staff-tbody');
    $tbody.empty();

    if (filtered.length === 0) {
      $('#page-staff-empty').removeClass('hidden');
    } else {
      $('#page-staff-empty').addClass('hidden');
      filtered.forEach((s, idx) => {
        const isSubdir = window.location.pathname.includes('/human-resources/') ||
          window.location.pathname.includes('/department/') ||
          window.location.pathname.includes('/billing-management/');
        const pfx = isSubdir ? '../assets/images/' : 'assets/images/';
        const femaleNames = [
          'tanvi', 'priya', 'priyanka', 'ananya', 'neha', 'sunita', 'meenakshi',
          'aarti', 'pooja', 'deepa', 'simran', 'shanti', 'lakshmi', 'rekha',
          'geeta', 'mary', 'savita', 'kavita', 'shreya', 'trisha', 'adaline', 'elena', 'sophia'
        ];
        const isFemale = femaleNames.some(fn => (s.name || '').toLowerCase().includes(fn));
        const avatarSrc = pfx + (isFemale ? 'avatar-female.png' : 'avatar-male.png');

        const avatarHtml = `<img src="${avatarSrc}" alt="${escapeHtml(s.name)}" class="w-8 h-8 md:w-9 md:h-9 rounded-xl object-cover shadow-xs border border-white/60 dark:border-slate-700 flex-shrink-0">`;
        const isOnDuty = s.status === 'On Duty';
        const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-100/80 dark:bg-slate-800/60';

        $tbody.append(`
          <tr class="${rowBg} hover:bg-slate-100 hover:shadow-md dark:hover:bg-slate-800 transition-all cursor-pointer relative" data-id="${escapeHtml(s.id)}">
            <td class="py-2.5 px-2.5 sm:py-3.5 sm:px-4 whitespace-nowrap">
              <span class="px-2 py-0.5 md:px-2.5 md:py-1 rounded text-xs md:text-sm font-mono font-bold bg-[#FCA311] text-black inline-block shadow-2xs">${escapeHtml(s.id)}</span>
            </td>
            <td class="py-2.5 px-2.5 sm:py-3.5 sm:px-4 whitespace-nowrap">
              <div class="flex items-center space-x-2.5 md:space-x-3">
                ${avatarHtml}
                <div>
                  <div class="font-bold text-slate-900 dark:text-white text-xs md:text-sm">${escapeHtml(s.name)}</div>
                  <div class="text-[10px] md:text-xs text-slate-400">${escapeHtml(s.station || s.role)}</div>
                </div>
              </div>
            </td>
            <td class="py-2.5 px-2.5 sm:py-3.5 sm:px-4 whitespace-nowrap">
              <div class="font-semibold text-slate-800 dark:text-slate-200 text-xs md:text-sm">${escapeHtml(s.role)}</div>
              <div class="text-[10px] md:text-xs text-slate-400">${escapeHtml(s.department)}</div>
            </td>
            <td class="py-2.5 px-2.5 sm:py-3.5 sm:px-4 font-medium text-slate-600 dark:text-slate-300 text-xs md:text-sm whitespace-nowrap">
              ${escapeHtml(s.station)}
            </td>
            <td class="py-2.5 px-2.5 sm:py-3.5 sm:px-4 font-mono text-xs md:text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
              ${escapeHtml(s.shift)}
            </td>
            <td class="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center whitespace-nowrap">
              <span class="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-[10px] md:text-xs font-semibold ${isOnDuty ? 'bg-[#15803d] text-white' : 'bg-[#b91c1c] text-white'} shadow-2xs">
                ${escapeHtml(s.status)}
              </span>
            </td>
            <td class="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-slate-500 font-mono text-xs md:text-sm whitespace-nowrap">
              ${escapeHtml(s.phone)}
            </td>
          </tr>
        `);
      });
    }

    $('#page-staff-count-label').text(`Showing ${filtered.length} of ${staffList.length} staff members`);
  }

  // Filter Buttons for Employees page
  $(document).on('click', '.btn-staff-filter', function () {
    $('.btn-staff-filter').removeClass('active bg-[#14213D] text-white').addClass('text-slate-600 dark:text-slate-400 hover:text-slate-900');
    $(this).addClass('active bg-[#14213D] text-white').removeClass('text-slate-600 dark:text-slate-400 hover:text-slate-900');
    currentStaffPageFilter = $(this).data('filter') || 'all';
    renderEmployeesSection();
  });

  $('#select-page-staff-dept').on('change', function () {
    renderEmployeesSection();
  });

  $('#input-page-staff-search').on('input', function () {
    renderEmployeesSection();
  });

  $('#btn-page-add-employee').on('click', function () {
    window.location.hash = 'add-employee';
    switchSection('add-employee');
  });

  // =========================================================================
  // 12. ADD EMPLOYEE STANDALONE PAGE CONTROLLER
  // =========================================================================
  function renderAddEmployeeSection() {
    const staffList = Storage.get(STORAGE_KEYS.STAFF, DEFAULT_STAFF) || DEFAULT_STAFF;
    const nextNum = staffList.length + 1;
    const nextId = 'AUR-EMP-2026-' + String(nextNum).padStart(3, '0');
    $('#add-emp-id').val(nextId);
    $('#preview-emp-id-display').text(nextId);

    function syncEmpPreview() {
      const name = $.trim($('#add-emp-name').val()) || 'Vikramaditya Roy';
      const role = $.trim($('#add-emp-role').val()) || 'Guest Relations Executive';
      const dept = $('#add-emp-dept').val() || 'Front Office';
      const status = $('#add-emp-status').val() || 'On Duty';
      const shift = $('#add-emp-shift').val() || '07:00 - 15:30 (Morning)';

      const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'VR';
      $('#preview-emp-avatar').text(initials);
      $('#preview-emp-name-display').text(name);
      $('#preview-emp-role-display').text(role);
      $('#preview-emp-dept-display').text(`${dept} • ${status}`);
      $('#preview-emp-shift-display').text(shift.split(' ')[0]);
    }

    $('#add-emp-name, #add-emp-role, #add-emp-dept, #add-emp-status, #add-emp-shift').off('input change').on('input change', syncEmpPreview);
    syncEmpPreview();
  }

  function handleAddEmployeeSubmit() {
    const name = $.trim($('#add-emp-name').val());
    const role = $.trim($('#add-emp-role').val());
    const dept = $('#add-emp-dept').val();
    const station = $.trim($('#add-emp-station').val());
    const shift = $('#add-emp-shift').val();
    const phone = $.trim($('#add-emp-phone').val());
    const email = $.trim($('#add-emp-email').val());
    const status = $('#add-emp-status').val() || 'On Duty';
    const id = $('#add-emp-id').val() || ('AUR-EMP-2026-' + Date.now().toString().slice(-3));

    if (!name) {
      showToast('Please enter employee legal name', 'warning');
      $('#add-emp-name').focus();
      return;
    }
    if (!role) {
      showToast('Please enter designation / role', 'warning');
      $('#add-emp-role').focus();
      return;
    }
    if (!station) {
      showToast('Please specify assigned station or duty desk', 'warning');
      $('#add-emp-station').focus();
      return;
    }

    const staffList = Storage.get(STORAGE_KEYS.STAFF, DEFAULT_STAFF) || DEFAULT_STAFF;
    const newStaff = {
      id: id,
      name: name,
      role: role,
      department: dept,
      station: station,
      shift: shift.split(' ')[0] + ' ' + (shift.split(' ')[1] || '-') + ' ' + (shift.split(' ')[2] || ''),
      status: status,
      phone: phone || '+91 98000 00000',
      email: email
    };

    staffList.unshift(newStaff);
    Storage.set(STORAGE_KEYS.STAFF, staffList);

    animateStaffMetrics();
    showToast(`Staff member ${name} onboarded successfully!`, 'success');

    // Reset Form
    if ($('#form-standalone-add-employee').length > 0) {
      $('#form-standalone-add-employee')[0].reset();
    }

    // Redirect to Employee Directory to view newly onboarded staff member
    if ($('#section-employees').length > 0) {
      window.location.hash = 'employees';
      switchSection('employees');
    } else {
      setTimeout(() => {
        window.location.href = 'employee-list.html';
      }, 300);
    }
  }

  $('#btn-submit-add-emp, #btn-submit-add-emp-top, .btn-submit-add-emp-trigger').on('click', function (e) {
    e.preventDefault();
    handleAddEmployeeSubmit();
  });

  $('.btn-back-to-employees').on('click', function (e) {
    e.preventDefault();
    if ($('#section-employees').length > 0) {
      window.location.hash = 'employees';
      switchSection('employees');
    } else {
      window.location.href = 'employee-list.html';
    }
  });

  $('#btn-page-add-employee').on('click', function (e) {
    e.preventDefault();
    if ($('#section-add-employee').length > 0) {
      window.location.hash = 'add-employee';
      switchSection('add-employee');
    } else {
      window.location.href = 'add-employee.html';
    }
  });

  // =========================================================================
  // 13. HOLIDAY LIST STANDALONE PAGE CONTROLLER
  // =========================================================================
  const HOTEL_HOLIDAYS_2026 = [
    { date: '26 Jan 2026', day: 'Monday', name: 'Republic Day', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'Mandatory operational double-time pay or compensatory day off', status: 'Observed' },
    { date: '17 Mar 2026', day: 'Tuesday', name: 'Maha Shivratri', type: 'floating', typeLabel: 'Floating Holiday', policy: 'Departmental roster rotation; floating leave option', status: 'Observed' },
    { date: '25 Mar 2026', day: 'Wednesday', name: 'Holi (Festival of Colors)', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'Banquet & F&B active roster; shift bonus + comp off', status: 'Observed' },
    { date: '03 Apr 2026', day: 'Friday', name: 'Good Friday', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'Normal hospitality shift timings; holiday rate applicable', status: 'Observed' },
    { date: '11 Apr 2026', day: 'Saturday', name: 'Eid-ul-Fitr', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'Kitchen & banquet high coverage; compensatory credit', status: 'Observed' },
    { date: '01 May 2026', day: 'Friday', name: 'International Labor Day', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'Statutory hospitality holiday pay for all active roster staff', status: 'Observed' },
    { date: '17 Jun 2026', day: 'Wednesday', name: 'Bakrid / Eid al-Adha', type: 'floating', typeLabel: 'Floating Holiday', policy: 'Roster coverage swap allowed with 72h manager signoff', status: 'Observed' },
    { date: '15 Aug 2026', day: 'Saturday', name: 'Independence Day', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'Flag hoisting ceremony at 09:00; double daily shift credit', status: 'Observed' },
    { date: '04 Sep 2026', day: 'Friday', name: 'Janmashtami', type: 'floating', typeLabel: 'Floating Holiday', policy: 'Floating leave option upon prior supervisor approval', status: 'Observed' },
    { date: '02 Oct 2026', day: 'Friday', name: 'Mahatma Gandhi Jayanti', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'Dry day observed across hotel bars; room service normal', status: 'Observed' },
    { date: '20 Oct 2026', day: 'Tuesday', name: 'Dussehra (Vijayadashami)', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'High dining volume; full operational staffing bonus', status: 'Observed' },
    { date: '08 Nov 2026', day: 'Sunday', name: 'Diwali (Deepavali)', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'Festive hamper bonus + 2x compensatory shift allowance', status: 'Upcoming' },
    { date: '24 Nov 2026', day: 'Tuesday', name: 'Guru Nanak Jayanti', type: 'floating', typeLabel: 'Floating Holiday', policy: 'Floating leave selection; minimum desk skeleton crew', status: 'Upcoming' },
    { date: '25 Dec 2026', day: 'Friday', name: 'Christmas Day', type: 'gazetted', typeLabel: 'Gazetted Holiday', policy: 'Gala Dinner peak operational schedule; festive holiday bonus', status: 'Upcoming' }
  ];

  // Load persisted deleted holidays if any
  (function syncPersistedHolidays() {
    try {
      const removed = JSON.parse(localStorage.getItem('aurelia_deleted_holidays_2026') || '[]');
      if (Array.isArray(removed) && removed.length) {
        for (let i = HOTEL_HOLIDAYS_2026.length - 1; i >= 0; i--) {
          const key = HOTEL_HOLIDAYS_2026[i].name + '|' + HOTEL_HOLIDAYS_2026[i].date;
          if (removed.includes(HOTEL_HOLIDAYS_2026[i].name) || removed.includes(key)) {
            HOTEL_HOLIDAYS_2026.splice(i, 1);
          }
        }
      }
    } catch (e) { }
  })();

  let currentHolidayFilter = 'all';

  function getFilteredHolidays() {
    const search = $.trim($('#input-holiday-search').val()).toLowerCase();
    return HOTEL_HOLIDAYS_2026.filter(h => {
      const matchType = (currentHolidayFilter === 'all') || (h.type === currentHolidayFilter);
      const matchSearch = !search ||
        h.name.toLowerCase().includes(search) ||
        h.date.toLowerCase().includes(search) ||
        h.day.toLowerCase().includes(search) ||
        h.policy.toLowerCase().includes(search);
      return matchType && matchSearch;
    });
  }

  function renderHolidaysSection() {
    const filtered = getFilteredHolidays();

    const $tbody = $('#page-holiday-tbody');
    $tbody.empty();

    if (filtered.length === 0) {
      $('#page-holiday-empty').removeClass('hidden');
    } else {
      $('#page-holiday-empty').addClass('hidden');
      filtered.forEach(h => {
        const isGazetted = h.type === 'gazetted';
        const isUpcoming = h.status === 'Upcoming';

        $tbody.append(`
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors" data-name="${escapeHtml(h.name)}" data-date="${escapeHtml(h.date)}">
            <td class="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
              ${escapeHtml(h.date)}
            </td>
            <td class="py-3 px-4">
              <div class="font-bold text-slate-900 dark:text-white">${escapeHtml(h.name)}</div>
            </td>
            <td class="py-3 px-4 font-medium text-slate-600 dark:text-slate-300">
              ${escapeHtml(h.day)}
            </td>
            <td class="py-3 px-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isGazetted
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50'
            : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200/50'
          }">
                ${escapeHtml(h.typeLabel)}
              </span>
            </td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs">
              ${escapeHtml(h.policy)}
            </td>
            <td class="py-3 px-4 text-center">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isUpcoming
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }">
                ${isUpcoming ? '● In 8 Days' : 'Observed'}
              </span>
            </td>
          </tr>
        `);
      });
    }

    $('#page-holiday-count-label').text(`Showing ${filtered.length} of ${HOTEL_HOLIDAYS_2026.length} holidays`);
  }

  function buildHolidaySchedulePrintHtml() {
    const filtered = getFilteredHolidays();
    const listToPrint = filtered.length > 0 ? filtered : HOTEL_HOLIDAYS_2026;
    const totalHolidays = listToPrint.length;
    const gazettedCount = listToPrint.filter(h => h.type === 'gazetted').length;
    const floatingCount = listToPrint.filter(h => h.type === 'floating').length;
    const searchVal = $.trim($('#input-holiday-search').val());
    const filterLabel = currentHolidayFilter === 'gazetted'
      ? 'Gazetted Holidays'
      : (currentHolidayFilter === 'floating' ? 'Floating / Optional Holidays' : 'All Official Holidays');
    const activeUser = typeof getActiveUserData === 'function' ? getActiveUserData() : null;
    const printedBy = (activeUser && activeUser.name) ? activeUser.name : 'HR Administration';
    const printedOn = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const rowsHtml = listToPrint.map((h, idx) => {
      const isGazetted = h.type === 'gazetted';
      const isUpcoming = h.status === 'Upcoming';
      const classBg = isGazetted ? '#ecfdf5' : '#f0f9ff';
      const classColor = isGazetted ? '#047857' : '#0369a1';
      const classBorder = isGazetted ? '#a7f3d0' : '#bae6fd';
      const statusBg = isUpcoming ? '#fef3c7' : '#f1f5f9';
      const statusColor = isUpcoming ? '#92400e' : '#475569';
      const statusBorder = isUpcoming ? '#fcd34d' : '#cbd5e1';
      const rowBg = idx % 2 === 1 ? '#f8fafc' : '#ffffff';

      return `
        <tr style="background:${rowBg};">
          <td style="padding:7px 8px;border:1px solid #cbd5e1;font-family:'Courier New',monospace;font-weight:700;font-size:11px;color:#0f172a;white-space:nowrap;">${escapeHtml(h.date)}</td>
          <td style="padding:7px 8px;border:1px solid #cbd5e1;font-weight:700;font-size:11px;color:#0f172a;">${escapeHtml(h.name)}</td>
          <td style="padding:7px 8px;border:1px solid #cbd5e1;font-size:11px;color:#334155;white-space:nowrap;">${escapeHtml(h.day)}</td>
          <td style="padding:7px 8px;border:1px solid #cbd5e1;white-space:nowrap;">
            <span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:${classBg};color:${classColor};border:1px solid ${classBorder};">${escapeHtml(h.typeLabel)}</span>
          </td>
          <td style="padding:7px 8px;border:1px solid #cbd5e1;font-size:11px;color:#334155;line-height:1.35;">${escapeHtml(h.policy)}</td>
          <td style="padding:7px 8px;border:1px solid #cbd5e1;text-align:center;white-space:nowrap;">
            <span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:${statusBg};color:${statusColor};border:1px solid ${statusBorder};">${isUpcoming ? '● In 8 Days' : 'Observed'}</span>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div id="holiday-print-sheet" style="font-family:'Plus Jakarta Sans','Inter',Arial,sans-serif;color:#0f172a;background:#ffffff;width:100%;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #14213D;padding-bottom:10px;margin-bottom:12px;">
          <div>
            <div style="font-size:20px;font-weight:900;letter-spacing:4px;color:#14213D;line-height:1;">AURELIA</div>
            <div style="width:44px;height:2.5px;background:#FCA311;margin:5px 0;"></div>
            <div style="font-size:10px;font-weight:700;letter-spacing:1.6px;color:#475569;text-transform:uppercase;">Hotel &amp; Restaurant • Human Resources</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:15px;font-weight:800;color:#14213D;">Hotel Holiday &amp; Observance Calendar 2026</div>
            <div style="font-size:10px;color:#475569;margin-top:2px;">Official Holiday Schedule &amp; Compensatory Leave Policy</div>
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:10.5px;background:#f8fafc;border:1px solid #cbd5e1;">
          <tr>
            <td style="padding:6px 10px;border-right:1px solid #cbd5e1;"><strong>View:</strong> ${escapeHtml(filterLabel)}${searchVal ? ` (Search: "${escapeHtml(searchVal)}")` : ''}</td>
            <td style="padding:6px 10px;border-right:1px solid #cbd5e1;"><strong>Total:</strong> ${totalHolidays} Days</td>
            <td style="padding:6px 10px;border-right:1px solid #cbd5e1;"><strong>Gazetted:</strong> ${gazettedCount} &nbsp;|&nbsp; <strong>Floating:</strong> ${floatingCount}</td>
            <td style="padding:6px 10px;text-align:right;"><strong>Printed:</strong> ${escapeHtml(printedOn)} (${escapeHtml(printedBy)})</td>
          </tr>
        </table>

        <table style="width:100%;border-collapse:collapse;table-layout:auto;">
          <thead>
            <tr style="background:#14213D;color:#ffffff;text-align:left;">
              <th style="padding:8px;border:1px solid #14213D;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;text-align:left;white-space:nowrap;">Date</th>
              <th style="padding:8px;border:1px solid #14213D;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;text-align:left;">Holiday / Festival</th>
              <th style="padding:8px;border:1px solid #14213D;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;text-align:left;">Day</th>
              <th style="padding:8px;border:1px solid #14213D;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;text-align:left;white-space:nowrap;">Classification</th>
              <th style="padding:8px;border:1px solid #14213D;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;text-align:left;">Staffing Coverage &amp; Compensation Policy</th>
              <th style="padding:8px;border:1px solid #14213D;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;text-align:left;white-space:nowrap;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div style="margin-top:12px;padding-top:8px;border-top:1px solid #cbd5e1;display:flex;justify-content:space-between;font-size:10px;color:#64748b;">
          <span>Aurelia Hospitality Labor Standards 2026</span>
          <span>&copy; 2026 AURELIA. All rights reserved by Shraoshi Basak &amp; Piyush Barua.</span>
        </div>
      </div>
    `;
  }

  let holidayPrintGuard = false;
  function prepareHolidayPrintArea() {
    const $area = $('#print-invoice-area');
    if (!$area.length) return false;
    $area.html(buildHolidaySchedulePrintHtml()).removeClass('hidden');
    return true;
  }

  function printHolidaySchedule() {
    if (holidayPrintGuard) return;
    holidayPrintGuard = true;
    try {
      prepareHolidayPrintArea();
      window.print();
    } finally {
      setTimeout(() => {
        holidayPrintGuard = false;
        $('#print-invoice-area').addClass('hidden').empty();
      }, 1000);
    }
  }
  window.printHolidaySchedule = printHolidaySchedule;

  function generateDirectHolidaySchedulePDF(listToPrint, filterLabel, searchVal, printedBy, printedOn, fileName) {
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) return false;

      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 12;
      const contentW = pageW - margin * 2;
      const totalHolidays = listToPrint.length;
      const gazettedCount = listToPrint.filter(h => h.type === 'gazetted').length;
      const floatingCount = listToPrint.filter(h => h.type === 'floating').length;

      // Brand Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.setTextColor(20, 33, 61);
      doc.text('A U R E L I A', margin, 17);

      doc.setFillColor(252, 163, 17);
      doc.rect(margin, 19.2, 14, 0.9, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('HOTEL & RESTAURANT  •  HUMAN RESOURCES', margin, 24);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(20, 33, 61);
      doc.text('Hotel Holiday & Observance Calendar 2026', pageW - margin, 17.5, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('Official Holiday Schedule & Compensatory Leave Policy', pageW - margin, 22.8, { align: 'right' });

      doc.setDrawColor(20, 33, 61);
      doc.setLineWidth(0.6);
      doc.line(margin, 27, pageW - margin, 27);

      // Summary Strip
      const summaryY = 30.5;
      const summaryH = 8;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.25);
      doc.rect(margin, summaryY, contentW, summaryH, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(15, 23, 42);
      const viewText = `View: ${filterLabel}${searchVal ? ` (Search: "${searchVal}")` : ''}`;
      doc.text(viewText, margin + 2.5, summaryY + 5.2);
      doc.text(`Total: ${totalHolidays} Days`, margin + 62, summaryY + 5.2);
      doc.text(`Gazetted: ${gazettedCount}  |  Floating: ${floatingCount}`, margin + 94, summaryY + 5.2);
      doc.text(`Printed: ${printedOn} (${printedBy})`, pageW - margin - 2.5, summaryY + 5.2, { align: 'right' });

      if (typeof doc.autoTable === 'function') {
        const bodyRows = listToPrint.map(h => [
          h.date,
          h.name,
          h.day,
          h.typeLabel,
          h.policy,
          h.status === 'Upcoming' ? 'In 8 Days' : 'Observed'
        ]);

        doc.autoTable({
          startY: summaryY + summaryH + 3.5,
          margin: { left: margin, right: margin, bottom: 18 },
          head: [[
            'DATE',
            'HOLIDAY / FESTIVAL',
            'DAY',
            'CLASSIFICATION',
            'STAFFING COVERAGE & COMPENSATION POLICY',
            'STATUS'
          ]],
          body: bodyRows,
          theme: 'grid',
          styles: {
            font: 'helvetica',
            fontSize: 8,
            cellPadding: 2.3,
            textColor: [30, 41, 59],
            lineColor: [203, 213, 225],
            lineWidth: 0.2,
            valign: 'middle'
          },
          headStyles: {
            fillColor: [20, 33, 61],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 7.5,
            lineColor: [20, 33, 61]
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          columnStyles: {
            0: { font: 'courier', fontStyle: 'bold', cellWidth: 23, textColor: [15, 23, 42] },
            1: { fontStyle: 'bold', cellWidth: 38, textColor: [15, 23, 42] },
            2: { cellWidth: 19 },
            3: { fontStyle: 'bold', cellWidth: 27 },
            4: { cellWidth: 61 },
            5: { fontStyle: 'bold', halign: 'center', cellWidth: 18 }
          },
          didParseCell: function (data) {
            if (data.section === 'body') {
              if (data.column.index === 3) {
                const isGaz = String(data.cell.raw).toLowerCase().includes('gazetted');
                data.cell.styles.textColor = isGaz ? [4, 120, 87] : [3, 105, 161];
              } else if (data.column.index === 5) {
                const isUp = String(data.cell.raw).includes('8 Days');
                data.cell.styles.textColor = isUp ? [146, 64, 14] : [71, 85, 105];
                if (isUp) data.cell.styles.fillColor = [254, 243, 199];
              }
            }
          }
        });

        const finalY = Math.min((doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : summaryY + 25) + 6, pageH - 12);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.25);
        doc.line(margin, finalY, pageW - margin, finalY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('Aurelia Hospitality Labor Standards 2026', margin, finalY + 4.5);
        doc.text('© 2026 AURELIA. All rights reserved by Shraoshi Basak & Piyush Barua.', pageW - margin, finalY + 4.5, { align: 'right' });
      }

      doc.save(fileName);
      showToast('Holiday schedule PDF downloaded!', 'success');
      return true;
    } catch (err) {
      console.error('Direct Holiday PDF generation error:', err);
      return false;
    }
  }

  let holidayPdfDownloading = false;
  function downloadHolidaySchedulePDF() {
    if (holidayPdfDownloading) return;
    holidayPdfDownloading = true;

    const $btn = $('#btn-download-holiday-schedule');
    const $btnLabel = $btn.find('span').last();
    const originalLabel = $btnLabel.text() || 'Download Schedule';
    $btn.prop('disabled', true).addClass('opacity-75 cursor-wait');
    if ($btnLabel.length) $btnLabel.text('Downloading...');

    const resetBtn = () => {
      holidayPdfDownloading = false;
      $btn.prop('disabled', false).removeClass('opacity-75 cursor-wait');
      if ($btnLabel.length) $btnLabel.text(originalLabel);
    };

    const filtered = getFilteredHolidays();
    const listToPrint = filtered.length > 0 ? filtered : HOTEL_HOLIDAYS_2026;
    const searchVal = $.trim($('#input-holiday-search').val());
    const filterLabel = currentHolidayFilter === 'gazetted'
      ? 'Gazetted Holidays'
      : (currentHolidayFilter === 'floating' ? 'Floating / Optional Holidays' : 'All Official Holidays');
    const activeUser = typeof getActiveUserData === 'function' ? getActiveUserData() : null;
    const printedBy = (activeUser && activeUser.name) ? activeUser.name : 'HR Administration';
    const printedOn = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const fileSuffix = currentHolidayFilter && currentHolidayFilter !== 'all' ? `_${currentHolidayFilter}` : '';
    const fileName = `Aurelia_Holiday_Schedule_2026${fileSuffix}.pdf`;

    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        resetBtn();
        showToast('PDF library unavailable. Opening print view to Save as PDF...', 'info');
        printHolidaySchedule();
        return;
      }

      if (window.html2canvas) {
        const mount = document.createElement('div');
        mount.id = 'holiday-pdf-render-mount';
        mount.style.position = 'fixed';
        mount.style.left = '-9999px';
        mount.style.top = '0';
        mount.style.width = '794px';
        mount.style.background = '#ffffff';
        mount.style.color = '#0f172a';
        mount.style.padding = '0';
        mount.style.zIndex = '-9999';
        mount.innerHTML = buildHolidaySchedulePrintHtml();
        document.body.appendChild(mount);

        const targetEl = mount.firstElementChild || mount;
        window.html2canvas(targetEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 794
        }).then(canvas => {
          try {
            const doc = new jsPDF({
              orientation: 'p',
              unit: 'mm',
              format: 'a4'
            });
            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();
            const margin = 12;
            const imgWidth = pageW - margin * 2;
            const pageContentH = pageH - margin * 2;
            const totalImgHeight = (canvas.height * imgWidth) / canvas.width;

            if (totalImgHeight <= pageContentH) {
              const imgData = canvas.toDataURL('image/png');
              doc.addImage(imgData, 'PNG', margin, margin, imgWidth, totalImgHeight, undefined, 'FAST');
            } else {
              const pagePixelH = Math.floor(canvas.width * (pageContentH / imgWidth));
              let offsetPx = 0;
              let pageIdx = 0;
              while (offsetPx < canvas.height) {
                const sliceH = Math.min(pagePixelH, canvas.height - offsetPx);
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = canvas.width;
                sliceCanvas.height = sliceH;
                const ctx = sliceCanvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
                ctx.drawImage(canvas, 0, offsetPx, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
                const sliceMmH = (sliceH * imgWidth) / canvas.width;
                if (pageIdx > 0) doc.addPage();
                doc.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, sliceMmH, undefined, 'FAST');
                offsetPx += sliceH;
                pageIdx++;
              }
            }

            doc.save(fileName);
            showToast('Holiday schedule PDF downloaded!', 'success');
          } catch (pdfErr) {
            console.warn('Holiday PDF assembly error, using direct AutoTable fallback:', pdfErr);
            generateDirectHolidaySchedulePDF(listToPrint, filterLabel, searchVal, printedBy, printedOn, fileName);
          } finally {
            mount.remove();
            resetBtn();
          }
        }).catch(err => {
          console.warn('html2canvas Holiday capture error, using direct AutoTable fallback:', err);
          mount.remove();
          generateDirectHolidaySchedulePDF(listToPrint, filterLabel, searchVal, printedBy, printedOn, fileName);
          resetBtn();
        });
      } else {
        generateDirectHolidaySchedulePDF(listToPrint, filterLabel, searchVal, printedBy, printedOn, fileName);
        resetBtn();
      }
    } catch (err) {
      console.error('Holiday PDF download error:', err);
      showToast('Error generating Holiday Schedule PDF.', 'error');
      resetBtn();
    }
  }
  window.downloadHolidaySchedulePDF = downloadHolidaySchedulePDF;

  // Support Ctrl+P / native browser print directly on Holiday List page
  window.addEventListener('beforeprint', function () {
    const holidaySection = document.getElementById('section-holidays');
    const area = document.getElementById('print-invoice-area');
    if (holidaySection && !holidaySection.classList.contains('hidden') && area && (!area.innerHTML.trim() || area.querySelector('#holiday-print-sheet'))) {
      prepareHolidayPrintArea();
    }
  });
  window.addEventListener('afterprint', function () {
    const holidaySection = document.getElementById('section-holidays');
    if (holidaySection && !holidaySection.classList.contains('hidden')) {
      $('#print-invoice-area').addClass('hidden').empty();
    }
  });

  $(document).on('change', '#select-holiday-filter', function () {
    currentHolidayFilter = $(this).val() || 'all';
    renderHolidaysSection();
  });

  $('#input-holiday-search').on('input', function () {
    renderHolidaysSection();
  });

  // Initial Boot - guarded by authentication
  const currentPath = (window.location.pathname || '').toLowerCase();
  const isHRPage = currentPath.includes('/human-resources') ||
    currentPath.includes('hr-employee-list') ||
    currentPath.includes('employee-list') ||
    currentPath.includes('add-employee') ||
    currentPath.includes('hr-document') ||
    currentPath.includes('holiday') ||
    currentPath.includes('leave-category') ||
    currentPath.includes('leave-assign') ||
    currentPath.includes('leave-request') ||
    currentPath.includes('attendance-list') ||
    currentPath.includes('attendance-report') ||
    currentPath.includes('salary-grade') ||
    currentPath.includes('manage-salary') ||
    currentPath.includes('disburse-salary-update') ||
    currentPath.includes('pay-slip');
  const isAddBillPage = currentPath.includes('add-bill');
  const isBillingDetailsPage = currentPath.includes('billing-details');
  const isBillingPage = currentPath.includes('billing.html') || currentPath.endsWith('billing') || isAddBillPage || isBillingDetailsPage;
  const isOrdersPage = currentPath.includes('order.html') || currentPath.endsWith('order');
  const isMenuPage = currentPath.includes('menu.html') || currentPath.endsWith('menu');
  const isCustomerPage = currentPath.includes('customer.html') || currentPath.endsWith('customer');
  const isAnalyticsPage = currentPath.includes('analytics.html') || currentPath.endsWith('analytics');
  const isAllDeptPage = currentPath.includes('all_department');
  const isAddDeptPage = currentPath.includes('add_department');
  const isDeptPage = isAllDeptPage || isAddDeptPage;

  let defaultSection = 'dashboard';
  if (currentPath.includes('hr-employee-list')) defaultSection = 'hr-documents';
  else if (currentPath.includes('employee-list')) defaultSection = 'employees';
  else if (currentPath.includes('add-employee')) defaultSection = 'add-employee';
  else if (currentPath.includes('hr-document')) defaultSection = 'hr-documents';
  else if (currentPath.includes('holiday')) defaultSection = 'holidays';
  else if (currentPath.includes('leave-category')) defaultSection = 'leave-category';
  else if (currentPath.includes('leave-assign')) defaultSection = 'leave-assign';
  else if (currentPath.includes('leave-request')) defaultSection = 'leave-request';
  else if (currentPath.includes('attendance-list')) defaultSection = 'attendance-list';
  else if (currentPath.includes('attendance-report')) defaultSection = 'attendance-report';
  else if (currentPath.includes('salary-grade')) defaultSection = 'salary-grade';
  else if (currentPath.includes('manage-salary')) defaultSection = 'manage-salary';
  else if (currentPath.includes('disburse-salary-update')) defaultSection = 'disburse-salary-update';
  else if (currentPath.includes('pay-slip')) defaultSection = 'pay-slip';
  else if (isAddBillPage) defaultSection = 'add-bill';
  else if (isBillingDetailsPage) defaultSection = 'billing-details';
  else if (isBillingPage) defaultSection = 'billing';
  else if (isOrdersPage) defaultSection = 'orders';
  else if (isMenuPage) defaultSection = 'menu';
  else if (isCustomerPage) defaultSection = 'customers';
  else if (isAnalyticsPage) defaultSection = 'analytics';
  else if (isAllDeptPage) defaultSection = 'all-departments';
  else if (isAddDeptPage) defaultSection = 'add-department';

  const isStandalonePage = isHRPage || isBillingPage || isOrdersPage || isMenuPage || isCustomerPage || isAnalyticsPage || isDeptPage;
  const hashSec = window.location.hash.replace('#', '');
  let initHash = isStandalonePage ? defaultSection : (hashSec || 'dashboard');
  if (isAddBillPage) {
    initHash = 'add-bill';
  } else if (isBillingDetailsPage) {
    initHash = 'billing-details';
  } else if (isBillingPage && (hashSec === 'history' || hashSec === 'create' || hashSec === 'billing')) {
    initHash = 'billing';
  }
  // Immediately render sidebar badges on startup
  renderSidebarBadges();

  if (!window.Auth || window.Auth.isAuthenticated()) {
    const hasPendingOrderBill = !!localStorage.getItem(STORAGE_KEYS.PENDING_ORDER_BILL);
    switchSection(initHash);
    restoreSidebarScroll();
    if (!isStandalonePage) {
      renderDashboard();
    }
    if (isBillingDetailsPage) {
      switchBillingSubtab('history');
    } else if (isBillingPage && hashSec === 'history' && !hasPendingOrderBill) {
      switchBillingSubtab('history');
    }
    if (isAllDeptPage) {
      renderDepartmentsGrid();
    }
    renderSidebarBadges();
    updateTopbarAvatarUI();
  }

  // =========================================================================
  // UNIVERSAL BULK TABLE SELECTION & DELETE ENGINE (ALL TABLE PAGES)
  // =========================================================================
  (function initUniversalBulkTableSelection() {
    let tableAutoIdCounter = 1;

    function isEligibleTable($table) {
      if (!$table || !$table.length) return false;
      if ($table.attr('data-no-bulk-select') === 'true') return false;
      // Exclude hidden print/PDF export templates & invoice receipt print blocks
      if ($table.closest('.receipt-wrap, #invoice-receipt, #modal-receipt, .print-section, [id*="print-"], [id*="-print"], [id*="pdf-"], [class*="print-only"]').length) {
        return false;
      }
      const inlineStyle = ($table.attr('style') || '').toLowerCase();
      if (inlineStyle.includes('border-collapse') && !$table.hasClass('w-full')) {
        return false;
      }
      if (!$table.find('tbody').length) return false;
      return true;
    }

    function getTableForToolbar($toolbar) {
      const tableId = $toolbar.attr('data-for-table');
      if (tableId) {
        const $byId = $(document.getElementById(tableId));
        if ($byId.length) return $byId;
      }
      return $toolbar.nextAll('.overflow-x-auto, #device-activity-scroll-wrap, table').first().find('table').addBack('table').first();
    }

    function getToolbarForTable($table) {
      const tableId = $table.attr('data-bulk-table-id');
      if (tableId) {
        const $tb = $(`.table-bulk-action-bar[data-for-table="${tableId}"]`);
        if ($tb.length) return $tb;
      }
      const $wrap = $table.closest('.overflow-x-auto, #device-activity-scroll-wrap');
      return ($wrap.length ? $wrap : $table).prev('.table-bulk-action-bar');
    }

    function getSelectableRows($table) {
      return $table.find('tbody > tr').filter(function () {
        const $tr = $(this);
        if ($tr.hasClass('hidden') || $tr.css('display') === 'none') return false;
        const $nonCbCells = $tr.children('td:not(.bulk-cb-cell)');
        if ($nonCbCells.length === 1 && $nonCbCells.first().attr('colspan')) return false;
        return $nonCbCells.length > 0;
      });
    }

    function attachBulkSelectToTable($table) {
      if (!isEligibleTable($table)) return;
      if ($table.attr('data-bulk-initialized') === 'true') return;

      let $targetWrap = $table.closest('.overflow-x-auto, #device-activity-scroll-wrap');
      if (!$targetWrap.length) $targetWrap = $table;
      if ($targetWrap.prev('.table-bulk-action-bar').length) {
        $table.attr('data-bulk-initialized', 'true');
        return;
      }

      const bulkId = $table.attr('id') || ('aurelia-bulk-tbl-' + (tableAutoIdCounter++));
      if (!$table.attr('id')) $table.attr('id', bulkId);
      $table.attr('data-bulk-table-id', bulkId);
      $table.attr('data-bulk-initialized', 'true');

      // Choose padding seamlessly based on parent card styling
      const $parent = $targetWrap.parent();
      const isFlushCard = $parent.hasClass('p-0') || ($parent.hasClass('Aurelia-card') && !$parent.hasClass('p-6') && !$parent.hasClass('p-4')) || $parent.hasClass('overflow-hidden');
      const barPadClass = isFlushCard
        ? 'px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40'
        : 'pb-2.5 pt-1 mb-2 border-b border-slate-100/80 dark:border-slate-800/60';

      const toolbarHtml = `
        <div class="table-bulk-action-bar ${barPadClass} flex flex-wrap items-center justify-between gap-3 text-xs transition-all hidden" data-for-table="${bulkId}">
          <div class="flex items-center gap-2 min-w-0 flex-shrink-0">
            <div class="bulk-count-wrap inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60">
              <span class="inline-block w-2 h-2 rounded-full bg-[#FCA311]"></span>
              <span class="bulk-count-text font-bold text-[#14213D] dark:text-amber-300 text-xs whitespace-nowrap">Selected row count: 0</span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap justify-end ml-auto">
            <button type="button" class="btn-bulk-select-all inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#14213D] text-white hover:bg-[#1f325d] dark:bg-[#FCA311] dark:text-[#14213D] dark:hover:bg-[#e5940f] shadow-2xs transition-all cursor-pointer" title="Select or deselect all rows">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span class="btn-bulk-select-all-label">Select All</span>
            </button>

            <button type="button" class="btn-table-bulk-delete inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white border border-rose-200 dark:border-rose-900 shadow-2xs transition-all cursor-pointer opacity-50 cursor-not-allowed" title="Delete selected rows" aria-label="Delete selected rows" disabled>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span class="btn-bulk-delete-label">Delete</span>
            </button>

            <button type="button" class="btn-bulk-cancel inline-flex items-center px-2.5 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 transition-all cursor-pointer" title="Deselect all rows">
              <span>Deselect</span>
            </button>
          </div>
        </div>
      `;

      $targetWrap.before(toolbarHtml);
    }

    function syncTableCheckboxes($table) {
      if (!isEligibleTable($table)) return;

      // Ensure header checkbox cell exists
      $table.find('thead > tr').each(function () {
        const $tr = $(this);
        if (!$tr.children('th.bulk-cb-cell').length) {
          const $firstTh = $tr.children('th').first();
          if ($firstTh.hasClass('rounded-l-xl')) {
            $firstTh.removeClass('rounded-l-xl');
          }
          $tr.prepend(`
            <th class="bulk-cb-cell w-11 text-center py-3 px-2 rounded-l-xl">
              <input type="checkbox" class="bulk-master-cb" title="Select / Deselect all rows" aria-label="Select all rows">
            </th>
          `);
        }
      });

      // Ensure body checkbox cells exist on data rows & adjust empty-state colspan
      $table.find('tbody > tr').each(function () {
        const $tr = $(this);
        const $nonCbCells = $tr.children('td:not(.bulk-cb-cell)');
        if ($nonCbCells.length === 1 && $nonCbCells.first().attr('colspan')) {
          const $emptyTd = $nonCbCells.first();
          if (!$emptyTd.attr('data-orig-colspan')) {
            const orig = parseInt($emptyTd.attr('colspan'), 10) || 1;
            $emptyTd.attr('data-orig-colspan', orig);
            $emptyTd.attr('colspan', orig + 1);
          }
          return;
        }
        if ($nonCbCells.length > 0 && !$tr.children('td.bulk-cb-cell').length) {
          $tr.prepend(`
            <td class="bulk-cb-cell w-11 text-center py-3 px-2">
              <input type="checkbox" class="bulk-row-cb" aria-label="Select row">
            </td>
          `);
        }
      });

      // Ensure tfoot alignment if present
      $table.find('tfoot > tr').each(function () {
        const $tr = $(this);
        if (!$tr.children('td.bulk-cb-cell, th.bulk-cb-cell').length) {
          $tr.prepend('<td class="bulk-cb-cell w-11"></td>');
        }
      });

      const $toolbar = getToolbarForTable($table);
      if ($toolbar.length) updateToolbarCount($toolbar, $table);
    }

    function updateToolbarCount($toolbar, $table) {
      const $rows = getSelectableRows($table);
      const total = $rows.length;
      const checked = $rows.find('td.bulk-cb-cell .bulk-row-cb:checked').length;

      if (checked > 0) {
        $toolbar.removeClass('hidden');
        $toolbar.find('.bulk-count-text').text(`Selected row count: ${checked}`);
        $toolbar.find('.btn-table-bulk-delete').removeClass('opacity-50 cursor-not-allowed').prop('disabled', false);
        $toolbar.find('.btn-bulk-delete-label').text(`Delete (${checked})`);
      } else {
        $toolbar.addClass('hidden');
        $toolbar.find('.bulk-count-text').text('Selected row count: 0');
        $toolbar.find('.btn-table-bulk-delete').addClass('opacity-50 cursor-not-allowed').prop('disabled', true);
        $toolbar.find('.btn-bulk-delete-label').text('Delete');
      }

      const $selectAllLabel = $toolbar.find('.btn-bulk-select-all-label');
      if (total > 0 && checked === total) {
        $selectAllLabel.text('Deselect All');
      } else {
        $selectAllLabel.text('Select All');
      }

      const $masterCb = $table.find('thead .bulk-master-cb');
      if ($masterCb.length) {
        if (checked === 0) {
          $masterCb.prop('checked', false).prop('indeterminate', false);
        } else if (checked === total && total > 0) {
          $masterCb.prop('checked', true).prop('indeterminate', false);
        } else {
          $masterCb.prop('checked', false).prop('indeterminate', true);
        }
      }
    }

    function toggleTableBulkSelection($table, enable) {
      // Retained for backward-compat if invoked externally; simply clears if enable=false
      if (!enable) {
        const $rows = getSelectableRows($table);
        $rows.find('td.bulk-cb-cell .bulk-row-cb').prop('checked', false);
        $rows.removeClass('is-row-selected');
        const $toolbar = getToolbarForTable($table);
        if ($toolbar.length) updateToolbarCount($toolbar, $table);
      }
    }

    function extractRowId(tr) {
      const $tr = $(tr);
      return $tr.attr('data-id') || $tr.find('[data-id]').first().attr('data-id') || '';
    }

    function executeTableBulkDelete($table, selectedTrs) {
      const tbodyId = $table.find('tbody').attr('id') || '';
      const count = selectedTrs.length;
      if (!count) return;

      // 1. Menu Items
      if (tbodyId === 'menu-items-tbody') {
        const ids = selectedTrs.map(extractRowId).filter(Boolean);
        const menu = Storage.get(STORAGE_KEYS.MENU, []);
        Storage.set(STORAGE_KEYS.MENU, menu.filter(m => !ids.includes(String(m.id))));
        renderMenuItemsGrid();
        populateMenuItemPicker();
        renderSidebarBadges();
        showToast(`Deleted ${count} menu item${count > 1 ? 's' : ''} successfully.`, 'info');
        return;
      }

      // 2. Orders
      if (tbodyId === 'orders-tbody') {
        const ids = selectedTrs.map(extractRowId).filter(Boolean);
        const orders = Storage.get(STORAGE_KEYS.ORDERS, []);
        Storage.set(STORAGE_KEYS.ORDERS, orders.filter(o => !ids.includes(String(o.id))));
        renderOrdersSection();
        renderSidebarBadges();
        showToast(`Deleted ${count} order${count > 1 ? 's' : ''} successfully.`, 'info');
        return;
      }

      // 3. Customers / Guests
      if (tbodyId === 'customers-tbody') {
        const ids = selectedTrs.map(extractRowId).filter(Boolean);
        const customers = Storage.get(STORAGE_KEYS.CUSTOMERS, []);
        Storage.set(STORAGE_KEYS.CUSTOMERS, customers.filter(c => !ids.includes(String(c.id))));
        renderCustomersSection();
        populateCustomerDropdown();
        renderSidebarBadges();
        showToast(`Deleted ${count} guest record${count > 1 ? 's' : ''} successfully.`, 'info');
        return;
      }

      // 4. Billing Details & Billings Modal
      if (tbodyId === 'billing-history-tbody' || tbodyId === 'modal-billings-tbody') {
        const ids = selectedTrs.map(extractRowId).filter(Boolean);
        const bills = Storage.get(STORAGE_KEYS.BILLS, []);
        Storage.set(STORAGE_KEYS.BILLS, bills.filter(b => !ids.includes(String(b.id))));
        if (typeof renderBillingHistory === 'function') renderBillingHistory();
        if (typeof renderDashboard === 'function') renderDashboard();
        if (tbodyId === 'modal-billings-tbody' && typeof renderBillingsModal === 'function') renderBillingsModal();
        showToast(`Deleted ${count} billing record${count > 1 ? 's' : ''} successfully.`, 'info');
        return;
      }

      // 5. Add Bill Draft Items
      if (tbodyId === 'bill-items-tbody') {
        const indices = new Set(selectedTrs.map(tr => {
          const idx = $(tr).find('[data-index]').first().attr('data-index');
          return typeof idx !== 'undefined' ? parseInt(idx, 10) : $(tr).index();
        }));
        currentBillItems = currentBillItems.filter((_, idx) => !indices.has(idx));
        renderBillDraftItems();
        calculateLiveBillTotals();
        showToast(`Removed ${count} item${count > 1 ? 's' : ''} from bill.`, 'info');
        return;
      }

      // 6. Staff / Employee Directory
      if (tbodyId === 'page-staff-tbody' || tbodyId === 'modal-staff-tbody') {
        const ids = selectedTrs.map(tr => extractRowId(tr) || $(tr).children('td:not(.bulk-cb-cell)').first().text().trim()).filter(Boolean);
        const staffList = Storage.get(STORAGE_KEYS.STAFF, DEFAULT_STAFF) || DEFAULT_STAFF;
        Storage.set(STORAGE_KEYS.STAFF, staffList.filter(s => !ids.includes(String(s.id))));
        if (typeof renderEmployeesSection === 'function') renderEmployeesSection();
        if (tbodyId === 'modal-staff-tbody' && typeof renderStaffDirectoryModal === 'function') renderStaffDirectoryModal();
        showToast(`Deleted ${count} employee record${count > 1 ? 's' : ''} successfully.`, 'info');
        return;
      }

      // 7. HR Document Templates & HR Employee List
      if (tbodyId === 'hr-templates-tbody') {
        const ids = selectedTrs.map(extractRowId).filter(Boolean);
        HR_TEMPLATES = HR_TEMPLATES.filter(t => !ids.includes(String(t.id)));
        try {
          localStorage.setItem('aurelia_hr_templates_v8', JSON.stringify(HR_TEMPLATES));
        } catch (e) { }
        renderHrDocumentsSection();
        showToast(`Deleted ${count} HR record${count > 1 ? 's' : ''} successfully.`, 'info');
        return;
      }

      // 8. Departments Table
      if (tbodyId === 'modal-dept-grid') {
        const codes = selectedTrs.map(tr => $(tr).attr('data-code') || $(tr).find('[data-code]').first().attr('data-code') || extractRowId(tr)).filter(Boolean);
        hotelDepartments = hotelDepartments.filter(d => !codes.includes(String(d.code)));
        saveDepartments();
        renderDepartmentsGrid($('#modal-dept-search').val());
        showToast(`Deleted ${count} department${count > 1 ? 's' : ''} successfully.`, 'info');
        return;
      }

      // 9. Holiday Schedule Table
      if (tbodyId === 'page-holiday-tbody') {
        const names = selectedTrs.map(tr => $(tr).attr('data-name') || $(tr).children('td:not(.bulk-cb-cell)').eq(1).text().trim()).filter(Boolean);
        for (let i = HOTEL_HOLIDAYS_2026.length - 1; i >= 0; i--) {
          if (names.includes(HOTEL_HOLIDAYS_2026[i].name)) {
            HOTEL_HOLIDAYS_2026.splice(i, 1);
          }
        }
        try {
          const prev = JSON.parse(localStorage.getItem('aurelia_deleted_holidays_2026') || '[]');
          const merged = Array.from(new Set(prev.concat(names)));
          localStorage.setItem('aurelia_deleted_holidays_2026', JSON.stringify(merged));
        } catch (e) { }
        renderHolidaysSection();
        showToast(`Deleted ${count} holiday${count > 1 ? 's' : ''} successfully.`, 'info');
        return;
      }

      // 10. Dashboard Device Activity & Modal Devices
      if (tbodyId === 'dashboard-recent-trans-tbody' || tbodyId === 'modal-devices-tbody') {
        const ids = selectedTrs.map(tr => extractRowId(tr) || $(tr).children('td:not(.bulk-cb-cell)').first().text().trim()).filter(Boolean);
        try {
          const prev = JSON.parse(localStorage.getItem('aurelia_deleted_device_sessions') || '[]');
          const merged = Array.from(new Set(prev.concat(ids)));
          localStorage.setItem('aurelia_deleted_device_sessions', JSON.stringify(merged));
        } catch (e) { }
        if (typeof renderDashboardRecentTransactions === 'function') renderDashboardRecentTransactions();
        if (tbodyId === 'modal-devices-tbody' && typeof renderAllDevicesModal === 'function') renderAllDevicesModal();
        showToast(`Deleted ${count} device session record${count > 1 ? 's' : ''} successfully.`, 'info');
        return;
      }

      // 11. Universal Fallback (HR static/inline tables, analytics top items, modal tables, etc.)
      const $tbody = $table.find('tbody');
      selectedTrs.forEach(tr => $(tr).remove());
      if (getSelectableRows($table).length === 0) {
        const colCount = Math.max(1, $table.find('thead > tr:first > th:not(.bulk-cb-cell)').length || 5);
        $tbody.html(`<tr><td colspan="${colCount}" class="py-8 text-center text-slate-400 font-medium">No records remaining.</td></tr>`);
      }
      showToast(`Deleted ${count} record${count > 1 ? 's' : ''} successfully.`, 'info');
    }

    function scanAndInitializeTables() {
      $('table').each(function () {
        const $tbl = $(this);
        if (!isEligibleTable($tbl)) return;
        attachBulkSelectToTable($tbl);
        syncTableCheckboxes($tbl);
      });
    }

    // Delegated Event Handlers
    $(document).on('click', '.btn-bulk-cancel', function (e) {
      e.preventDefault();
      const $toolbar = $(this).closest('.table-bulk-action-bar');
      const $table = getTableForToolbar($toolbar);
      if ($table.length) {
        const $rows = getSelectableRows($table);
        $rows.find('td.bulk-cb-cell .bulk-row-cb').prop('checked', false);
        $rows.removeClass('is-row-selected');
        updateToolbarCount($toolbar, $table);
      }
    });

    $(document).on('click', '.btn-bulk-select-all', function (e) {
      e.preventDefault();
      const $toolbar = $(this).closest('.table-bulk-action-bar');
      const $table = getTableForToolbar($toolbar);
      if (!$table.length) return;
      const $rows = getSelectableRows($table);
      const $cbs = $rows.find('td.bulk-cb-cell .bulk-row-cb');
      const allChecked = $cbs.length > 0 && $cbs.filter(':checked').length === $cbs.length;
      const nextState = !allChecked;
      $cbs.prop('checked', nextState);
      $rows.toggleClass('is-row-selected', nextState);
      updateToolbarCount($toolbar, $table);
    });

    $(document).on('change', '.bulk-master-cb', function (e) {
      e.stopPropagation();
      const $table = $(this).closest('table');
      const $toolbar = getToolbarForTable($table);
      const isChecked = $(this).is(':checked');
      const $rows = getSelectableRows($table);
      $rows.find('td.bulk-cb-cell .bulk-row-cb').prop('checked', isChecked);
      $rows.toggleClass('is-row-selected', isChecked);
      if ($toolbar.length) updateToolbarCount($toolbar, $table);
    });

    $(document).on('click', '.bulk-cb-cell', function (e) {
      e.stopPropagation();
      if (!$(e.target).is('input[type="checkbox"]')) {
        const $cb = $(this).find('input[type="checkbox"]');
        if ($cb.length) {
          $cb.prop('checked', !$cb.is(':checked')).trigger('change');
        }
      }
    });

    $(document).on('change', '.bulk-row-cb', function (e) {
      e.stopPropagation();
      const $tr = $(this).closest('tr');
      const $table = $tr.closest('table');
      const $toolbar = getToolbarForTable($table);
      $tr.toggleClass('is-row-selected', $(this).is(':checked'));
      if ($toolbar.length) updateToolbarCount($toolbar, $table);
    });

    $(document).on('click', '.btn-table-bulk-delete', function (e) {
      e.preventDefault();
      const $toolbar = $(this).closest('.table-bulk-action-bar');
      const $table = getTableForToolbar($toolbar);
      if (!$table.length) return;

      const selectedTrs = getSelectableRows($table).filter(function () {
        return $(this).find('td.bulk-cb-cell .bulk-row-cb').is(':checked');
      }).get();

      const count = selectedTrs.length;
      if (!count) {
        showToast('Please select at least one row to delete.', 'warning');
        return;
      }

      const label = count === 1 ? 'record' : 'records';
      const msg = `Are you sure you want to permanently delete ${count} selected ${label}? This action cannot be undone.`;

      const performBulkDelete = function () {
        executeTableBulkDelete($table, selectedTrs);
        scanAndInitializeTables();
        const $tb = getToolbarForTable($table);
        if ($tb.length) updateToolbarCount($tb, $table);
      };

      if (typeof openConfirmDeleteModal === 'function' && $('#modal-confirm-delete').length) {
        openConfirmDeleteModal(msg, performBulkDelete);
      } else if (window.confirm(msg)) {
        performBulkDelete();
      }
    });

    // Initial scan + fast MutationObserver so dynamically rendered/filtered tables stay synced
    scanAndInitializeTables();
    setTimeout(scanAndInitializeTables, 100);
    setTimeout(scanAndInitializeTables, 400);

    let observerTimer = null;
    if (typeof MutationObserver !== 'undefined' && document.body) {
      const bulkObserver = new MutationObserver(function () {
        if (observerTimer) clearTimeout(observerTimer);
        observerTimer = setTimeout(scanAndInitializeTables, 30);
      });
      bulkObserver.observe(document.body, { childList: true, subtree: true });
    }
  })();


  // =========================================================================
  // APPEARANCE & THEME CUSTOMIZATION CONTROLLER (Sidebar & Card Border)
  // =========================================================================
  const FIXED_THEME_COLORS = ['#0284C7', '#FFFFFF', '#130481', '#494D5F', '#FCA311'];
  const DEFAULT_THEME = {
    sidebarBg: '#494D5F',
    cardBorder: '#FCA311'
  };

  function getSavedTheme() {
    try {
      const raw = localStorage.getItem('aurelia_theme_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        const sb = (parsed.sidebarBg || '').toUpperCase();
        const cb = (parsed.cardBorder || '').toUpperCase();
        return {
          sidebarBg: FIXED_THEME_COLORS.includes(sb) ? sb : DEFAULT_THEME.sidebarBg,
          cardBorder: FIXED_THEME_COLORS.includes(cb) ? cb : DEFAULT_THEME.cardBorder
        };
      }
    } catch (e) {
      console.error('Error loading theme preferences:', e);
    }
    return { ...DEFAULT_THEME };
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem('aurelia_theme_settings', JSON.stringify(theme));
    } catch (e) {
      console.error('Error saving theme preferences:', e);
    }
  }

  function isColorLight(color) {
    try {
      let r = 0, g = 0, b = 0;
      if (!color) return false;
      if (color.startsWith('#')) {
        let hex = color.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (color.startsWith('rgb')) {
        const match = color.match(/\d+/g);
        if (match && match.length >= 3) {
          r = parseInt(match[0]);
          g = parseInt(match[1]);
          b = parseInt(match[2]);
        }
      }
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luma > 165;
    } catch (e) {
      return false;
    }
  }

  function applyThemeColors(sidebarBg, cardBorder) {
    const root = document.documentElement;
    const isDefaultBorder = !cardBorder || cardBorder.includes('rgba');
    const rimBgValue = isDefaultBorder
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.5) 30%, rgba(255, 255, 255, 0.1) 65%, rgba(255, 255, 255, 0.75) 100%)'
      : cardBorder;

    // Match primary button color (e.g. "Click here to see ->", "+ New Bill", "Save") to Card Border Color
    const btnBg = isDefaultBorder ? '#FCA311' : cardBorder;
    const btnIsLight = isColorLight(btnBg);
    const btnText = btnIsLight ? '#000000' : '#FFFFFF';
    const btnBorder = btnIsLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.25)';

    if (sidebarBg) {
      root.style.setProperty('--aurelia-sidebar-bg', sidebarBg);
    }
    if (cardBorder) {
      root.style.setProperty('--aurelia-card-border', cardBorder);
      root.style.setProperty('--aurelia-card-border-hover', cardBorder);
      root.style.setProperty('--aurelia-card-rim-bg', rimBgValue);
      root.style.setProperty('--aurelia-btn-primary-bg', btnBg);
      root.style.setProperty('--aurelia-btn-primary-text', btnText);
    }

    // Dynamic style tag override to guarantee instant application across all elements
    let dynamicStyle = document.getElementById('aurelia-dynamic-theme-override');
    if (!dynamicStyle) {
      dynamicStyle = document.createElement('style');
      dynamicStyle.id = 'aurelia-dynamic-theme-override';
      document.head.appendChild(dynamicStyle);
    }

    dynamicStyle.textContent = `
      :root {
        --aurelia-sidebar-bg: ${sidebarBg} !important;
        --aurelia-card-border: ${cardBorder} !important;
        --aurelia-card-border-hover: ${cardBorder} !important;
        --aurelia-card-rim-bg: ${rimBgValue} !important;
        --aurelia-btn-primary-bg: ${btnBg} !important;
        --aurelia-btn-primary-text: ${btnText} !important;
      }
      #app-sidebar,
      #mobile-user-menu-drawer,
      #mobile-drawer,
      .mobile-sidebar-drawer,
      #app-mobile-header,
      #btn-sidebar-collapse,
      #app-sidebar.is-collapsed #btn-sidebar-collapse {
        background: ${sidebarBg} !important;
        background-color: ${sidebarBg} !important;
      }
      #btn-sidebar-collapse,
      #btn-sidebar-collapse svg,
      #app-sidebar.is-collapsed #btn-sidebar-collapse,
      #app-sidebar.is-collapsed #btn-sidebar-collapse svg {
        color: ${isColorLight(sidebarBg) ? '#000000' : '#FFFFFF'} !important;
        stroke: ${isColorLight(sidebarBg) ? '#000000' : '#FFFFFF'} !important;
      }
      #btn-sidebar-collapse:hover svg,
      #btn-sidebar-collapse:hover svg path,
      #app-sidebar.is-collapsed #btn-sidebar-collapse:hover svg,
      #app-sidebar.is-collapsed #btn-sidebar-collapse:hover svg path {
        color: ${isColorLight(sidebarBg) ? '#000000' : '#FFFFFF'} !important;
        stroke: ${isColorLight(sidebarBg) ? '#000000' : '#FFFFFF'} !important;
      }
      #btn-sidebar-collapse:hover,
      #app-sidebar.is-collapsed #btn-sidebar-collapse:hover {
        filter: brightness(1.15);
      }
      ${isDefaultBorder ? `
      .Aurelia-card,
      .aurelia-card,
      .finset-card,
      .spatial-card,
      #section-dashboard .Aurelia-card,
      #main-app-content .Aurelia-card,
      .glass-money-flow {
        border: 0.1px solid rgba(255, 255, 255, 0.82) !important;
        outline: 0px !important;
        outline-width: 0px !important;
      }
      .Aurelia-card::before,
      .aurelia-card::before,
      .finset-card::before,
      .spatial-card::before,
      #section-dashboard .Aurelia-card::before,
      #main-app-content .Aurelia-card::before,
      .glass-money-flow::before {
        background: ${rimBgValue} !important;
      }
      ` : `
      .Aurelia-card,
      .aurelia-card,
      .finset-card,
      .spatial-card,
      #section-dashboard .Aurelia-card,
      #main-app-content .Aurelia-card,
      .glass-money-flow {
        border: 0.1px solid ${cardBorder} !important;
        border-color: ${cardBorder} !important;
        outline: 0px !important;
        outline-width: 0px !important;
        outline-color: transparent !important;
      }
      .Aurelia-card:hover,
      .aurelia-card:hover,
      .finset-card:hover,
      .spatial-card:hover,
      #section-dashboard .Aurelia-card:hover,
      #main-app-content .Aurelia-card:hover,
      .glass-money-flow:hover {
        border: 0.1px solid ${cardBorder} !important;
        border-color: ${cardBorder} !important;
        outline: 0px !important;
        outline-width: 0px !important;
        outline-color: transparent !important;
      }
      .Aurelia-card::before,
      .aurelia-card::before,
      .finset-card::before,
      .spatial-card::before,
      #section-dashboard .Aurelia-card::before,
      #main-app-content .Aurelia-card::before,
      .glass-money-flow::before {
        display: none !important;
        content: none !important;
      }
      `}
      .btn-Aurelia-primary,
      .btn-aurelia-primary,
      .btn-finset-primary,
      .btn-view-order-items,
      .btn-order-to-bill,
      .quick-nav-bill,
      #btn-theme-save,
      #btn-save-profile,
      #btn-confirm-reset-action,
      button.btn-finset-primary,
      button.btn-Aurelia-primary {
        background: ${btnBg} !important;
        background-color: ${btnBg} !important;
        color: ${btnText} !important;
        border-color: ${btnBorder} !important;
        box-shadow: none !important;
      }
      .btn-Aurelia-primary *,
      .btn-aurelia-primary *,
      .btn-finset-primary *,
      .btn-view-order-items *,
      .btn-order-to-bill *,
      .quick-nav-bill * {
        color: ${btnText} !important;
      }
      .btn-Aurelia-primary:hover,
      .btn-aurelia-primary:hover,
      .btn-finset-primary:hover,
      .btn-view-order-items:hover,
      .btn-order-to-bill:hover,
      .quick-nav-bill:hover,
      #btn-theme-save:hover {
        filter: brightness(0.92) !important;
        color: ${btnText} !important;
        box-shadow: none !important;
      }
      .btn-Aurelia-primary:active,
      .btn-aurelia-primary:active,
      .btn-finset-primary:active {
        box-shadow: none !important;
      }
    `;

    // Apply inline style directly to ensure no specificity clashes
    const $sidebarTargets = $('#app-sidebar, #mobile-user-menu-drawer, #mobile-drawer, #app-mobile-header, #btn-sidebar-collapse');
    $sidebarTargets.each(function () {
      this.style.setProperty('background', sidebarBg, 'important');
      this.style.setProperty('background-color', sidebarBg, 'important');
    });

    const isSbLightMode = isColorLight(sidebarBg);
    const arrowCol = isSbLightMode ? '#000000' : '#FFFFFF';
    $('#btn-sidebar-collapse').css('color', arrowCol);
    $('#btn-sidebar-collapse svg, #btn-sidebar-collapse svg path, #btn-sidebar-collapse path').css({
      'color': arrowCol,
      'stroke': arrowCol
    }).attr('stroke', arrowCol);

    if (isColorLight(sidebarBg)) {
      $('#app-sidebar, #mobile-user-menu-drawer').addClass('sidebar-light-mode');
    } else {
      $('#app-sidebar, #mobile-user-menu-drawer').removeClass('sidebar-light-mode');
    }

    $('.Aurelia-card, .aurelia-card, .finset-card, .spatial-card, #section-dashboard .Aurelia-card, #main-app-content .Aurelia-card, .glass-money-flow').each(function () {
      this.style.setProperty('border-color', cardBorder, 'important');
      this.style.setProperty('border-width', '0.1px', 'important');
    });

    $('.btn-Aurelia-primary, .btn-aurelia-primary, .btn-finset-primary, .btn-view-order-items, .btn-order-to-bill, .quick-nav-bill, #btn-theme-save').each(function () {
      this.style.setProperty('background', btnBg, 'important');
      this.style.setProperty('background-color', btnBg, 'important');
      this.style.setProperty('color', btnText, 'important');
      this.style.setProperty('box-shadow', 'none', 'important');
    });

    if (typeof window.renderBrandLogo === 'function') {
      window.renderBrandLogo(null, cardBorder);
    }
  }

  function updateThemeUI(theme) {
    const { sidebarBg, cardBorder } = theme;

    // 1. Update Sidebar Theme UI
    const normSidebar = (sidebarBg || DEFAULT_THEME.sidebarBg).toUpperCase();
    $('#preview-sidebar-dot').css('background-color', normSidebar);
    $('#preview-sidebar-hex').text(normSidebar);

    // Update active swatch in sidebar tray
    $('#tray-sidebar-colors .aurelia-theme-swatch').removeClass('active-swatch');
    $('#tray-sidebar-colors .aurelia-theme-swatch').each(function () {
      const c = ($(this).attr('data-color') || $(this).data('color') || '').toString().toUpperCase();
      if (c === normSidebar) {
        $(this).addClass('active-swatch');
      }
    });

    // 2. Update Card Border Theme UI
    const normCard = (cardBorder || DEFAULT_THEME.cardBorder).toUpperCase();
    $('#preview-card-border-dot').css('background-color', normCard);
    $('#preview-card-border-hex').text(normCard);

    // Update active swatch in card border tray
    $('#tray-card-border-colors .aurelia-theme-swatch').removeClass('active-swatch');
    $('#tray-card-border-colors .aurelia-theme-swatch').each(function () {
      const c = ($(this).attr('data-color') || $(this).data('color') || '').toString().toUpperCase();
      if (c === normCard) {
        $(this).addClass('active-swatch');
      }
    });
  }

  function renderSettingsSection() {
    const theme = getSavedTheme();
    applyThemeColors(theme.sidebarBg, theme.cardBorder);
    updateThemeUI(theme);
  }

  function updateSaveButtonState(isSaved) {
    const $btn = $('#btn-theme-save');
    if (!$btn.length) return;
    const $span = $btn.find('span');
    if ($span.length) {
      $span.text(isSaved ? 'Saved' : 'Save Changes');
    } else {
      $btn.text(isSaved ? 'Saved' : 'Save Changes');
    }
  }

  function initThemeSettings() {
    const currentTheme = getSavedTheme();
    applyThemeColors(currentTheme.sidebarBg, currentTheme.cardBorder);
    updateThemeUI(currentTheme);
    updateSaveButtonState(false);

    // Click on circular preset swatch (instant real-time live preview)
    $(document).on('click', '.aurelia-theme-swatch', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const target = $(this).attr('data-target') || $(this).data('target');
      const color = ($(this).attr('data-color') || $(this).data('color') || '').toString().toUpperCase();
      if (!target || !color || !FIXED_THEME_COLORS.includes(color)) return;

      const theme = getSavedTheme();
      if (target === 'sidebar') {
        theme.sidebarBg = color;
      } else if (target === 'cardBorder') {
        theme.cardBorder = color;
      }

      applyThemeColors(theme.sidebarBg, theme.cardBorder);
      saveTheme(theme);
      updateThemeUI(theme);
      updateSaveButtonState(false);
    });

    // Save Changes Button (Confirmation feedback)
    $(document).on('click', '#btn-theme-save', function (e) {
      e.preventDefault();
      const theme = getSavedTheme();
      saveTheme(theme);
      applyThemeColors(theme.sidebarBg, theme.cardBorder);
      updateThemeUI(theme);
      updateSaveButtonState(true);
      if (typeof showToast === 'function') {
        showToast('Appearance & theme preferences saved successfully!', 'info');
      }
    });

    // Reset to Default Button
    $(document).on('click', '#btn-theme-reset', function (e) {
      e.preventDefault();
      const theme = { ...DEFAULT_THEME };
      saveTheme(theme);
      applyThemeColors(theme.sidebarBg, theme.cardBorder);
      updateThemeUI(theme);
      updateSaveButtonState(false);
      if (typeof showToast === 'function') {
        showToast('Theme preferences reset to baseline defaults.', 'info');
      }
    });
  }

  // Initialize theme on ready
  initThemeSettings();

});

// =========================================================================
// STICKY TOP DESKTOP HEADER (Pinned securely with opaque background)
// =========================================================================
(function initStickyHeader() {
  function applyHeaderStyles() {
    let style = document.getElementById('app-sticky-header-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'app-sticky-header-styles';
      document.head.appendChild(style);
    }
    style.textContent = `
      html {
        scroll-behavior: smooth !important;
      }
      body,
      #main-app-content,
      .overflow-y-auto,
      .overflow-x-auto,
      .overflow-auto {
        scroll-behavior: smooth;
      }
      .app-sticky-header,
      #top-desktop-header {
        position: sticky !important;
        top: 0 !important;
        z-index: 50 !important;
        background: transparent !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border-bottom: 1px solid transparent !important;
        box-shadow: none !important;
        transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, backdrop-filter 0.2s ease !important;
      }
      .app-sticky-header.is-scrolled,
      #top-desktop-header.is-scrolled {
        background: #DCE4ED !important;
        background: linear-gradient(135deg, rgba(207, 216, 227, 0.98) 0%, rgba(220, 228, 237, 0.98) 50%, rgba(208, 217, 228, 0.98) 100%) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.85) !important;
        box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.08) !important;
      }
      .dark .app-sticky-header,
      .dark #top-desktop-header {
        background: transparent !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border-bottom: 1px solid transparent !important;
        box-shadow: none !important;
      }
      .dark .app-sticky-header.is-scrolled,
      .dark #top-desktop-header.is-scrolled {
        background: #14213D !important;
        background: linear-gradient(135deg, rgba(20, 33, 61, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.45) !important;
      }
      .dark #topbar-welcome-title {
        color: #FFFFFF !important;
      }
      .dark #topbar-welcome-title + p {
        color: #94A3B8 !important;
      }
      #user-profile-capsule {
        position: relative !important;
        z-index: 20 !important;
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      #user-profile-capsule #topbar-user-avatar,
      #user-profile-capsule #topbar-user-avatar * {
        pointer-events: none !important;
      }
      #modal-user-profile {
        z-index: 90 !important;
      }
      #modal-user-profile.hidden {
        display: none !important;
      }
      #modal-user-profile:not(.hidden) {
        display: flex !important;
      }
      .dark #user-profile-capsule,
      .dark #btn-top-notifications {
        background: rgba(30, 41, 59, 0.88) !important;
        border-color: rgba(255, 255, 255, 0.15) !important;
        color: #F8FAFC !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
      }
      .dark #user-profile-capsule:hover,
      .dark #btn-top-notifications:hover {
        background: rgba(51, 65, 85, 0.94) !important;
        border-color: rgba(252, 163, 17, 0.6) !important;
      }
      table th,
      table thead th {
        text-align: left !important;
      }
      select.order-status-inline-change,
      select.order-status-inline-change:focus,
      select.order-status-inline-change:active,
      select.order-status-inline-change[data-status],
      select.order-status-inline-change[data-status]:focus,
      .dark select.order-status-inline-change,
      .dark select.order-status-inline-change:focus,
      .dark select.order-status-inline-change[data-status],
      .dark select.order-status-inline-change[data-status]:focus {
        border-radius: 9999px !important;
        padding-left: 0.85rem !important;
        padding-right: 1.85rem !important;
        padding-top: 0.25rem !important;
        padding-bottom: 0.25rem !important;
        background-color: #FFFFFF !important;
        background-repeat: no-repeat !important;
        background-position: right 0.55rem center !important;
        background-size: 1.1em 1.1em !important;
        font-weight: 700 !important;
        font-size: 11.5px !important;
        border-width: 1.5px !important;
        border-style: solid !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;
        transition: all 0.15s ease-in-out !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        cursor: pointer !important;
        outline: none !important;
      }
      select.order-status-inline-change:hover {
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08) !important;
        transform: translateY(-0.5px);
      }
      select.order-status-inline-change[data-status="completed"],
      select.order-status-inline-change[data-status="completed"]:focus,
      .dark select.order-status-inline-change[data-status="completed"],
      .dark select.order-status-inline-change[data-status="completed"]:focus {
        background-color: #FFFFFF !important;
        border-color: #15803d !important;
        color: #15803d !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2315803d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
      }
      select.order-status-inline-change[data-status="cancelled"],
      select.order-status-inline-change[data-status="cancelled"]:focus,
      .dark select.order-status-inline-change[data-status="cancelled"],
      .dark select.order-status-inline-change[data-status="cancelled"]:focus {
        background-color: #FFFFFF !important;
        border-color: #b91c1c !important;
        color: #b91c1c !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23b91c1c' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
      }
      select.order-status-inline-change[data-status="preparing"],
      select.order-status-inline-change[data-status="preparing"]:focus,
      .dark select.order-status-inline-change[data-status="preparing"],
      .dark select.order-status-inline-change[data-status="preparing"]:focus {
        background-color: #FFFFFF !important;
        border-color: #ca8a04 !important;
        color: #ca8a04 !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ca8a04' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
      }
      select.order-status-inline-change[data-status="pending"],
      select.order-status-inline-change[data-status="pending"]:focus,
      .dark select.order-status-inline-change[data-status="pending"],
      .dark select.order-status-inline-change[data-status="pending"]:focus {
        background-color: #FFFFFF !important;
        border-color: #ea580c !important;
        color: #ea580c !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ea580c' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
      }
      select.order-status-inline-change[data-status="served"],
      select.order-status-inline-change[data-status="served"]:focus,
      .dark select.order-status-inline-change[data-status="served"],
      .dark select.order-status-inline-change[data-status="served"]:focus {
        background-color: #FFFFFF !important;
        border-color: #0284c7 !important;
        color: #0284c7 !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230284c7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
      }
      select.order-status-inline-change option {
        background-color: #FFFFFF !important;
        color: #1E293B !important;
      }
      .dark select.order-status-inline-change option {
        background-color: #1E293B !important;
        color: #F8FAFC !important;
      }
    `;

    const hdr = document.getElementById('top-desktop-header') || document.querySelector('.app-sticky-header');
    if (hdr) {
      hdr.classList.add('app-sticky-header');
    }
    updateHeaderScrollState();
  }

  function updateHeaderScrollState() {
    const hdr = document.getElementById('top-desktop-header') || document.querySelector('.app-sticky-header');
    if (!hdr) return;
    const mainEl = document.getElementById('main-app-content');
    const scrollTop = Math.max(
      window.scrollY || window.pageYOffset || 0,
      document.documentElement ? document.documentElement.scrollTop : 0,
      document.body ? document.body.scrollTop : 0,
      mainEl ? mainEl.scrollTop : 0
    );
    hdr.classList.toggle('is-scrolled', scrollTop > 4);
  }

  if (!window.__aureliaStickyHeaderScrollBound) {
    window.__aureliaStickyHeaderScrollBound = true;
    window.addEventListener('scroll', updateHeaderScrollState, { passive: true });
    window.addEventListener('resize', updateHeaderScrollState, { passive: true });
    window.addEventListener('hashchange', () => setTimeout(updateHeaderScrollState, 30));
    window.addEventListener('load', updateHeaderScrollState);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyHeaderStyles();
      const mainEl = document.getElementById('main-app-content');
      if (mainEl && !mainEl.__aureliaScrollBound) {
        mainEl.__aureliaScrollBound = true;
        mainEl.addEventListener('scroll', updateHeaderScrollState, { passive: true });
      }
    });
  } else {
    applyHeaderStyles();
    const mainEl = document.getElementById('main-app-content');
    if (mainEl && !mainEl.__aureliaScrollBound) {
      mainEl.__aureliaScrollBound = true;
      mainEl.addEventListener('scroll', updateHeaderScrollState, { passive: true });
    }
  }
})();

// =========================================================================
// INSTANT ZERO-DELAY HOVER TOOLTIPS & INSTANT SIDEBAR HOVER HIGHLIGHT
// =========================================================================
(function initInstantTooltips() {
  function setup() {
    if (!document.body) return;

    let style = document.getElementById('aurelia-instant-tooltip-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'aurelia-instant-tooltip-styles';
      document.head.appendChild(style);
    }
    style.textContent = `
      /* Instant 0ms hover response for sidebar navigation links */
      #app-sidebar .Aurelia-nav-item,
      #app-sidebar .aurelia-nav-item,
      #app-sidebar .finset-nav-item,
      #app-sidebar .Aurelia-nav-item svg,
      #app-sidebar .aurelia-nav-item svg,
      #app-sidebar .finset-nav-item svg,
      #app-sidebar .hr-sub-item,
      #app-sidebar .dept-sub-item,
      #app-sidebar #btn-sidebar-help,
      #app-sidebar #btn-sidebar-help svg,
      #app-sidebar #btn-sidebar-logout,
      #app-sidebar #btn-sidebar-logout svg {
        transition: none !important;
      }

      /* Instant floating tooltip (0ms delay, portal outside overflow containers) */
      #aurelia-instant-tooltip {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999999;
        pointer-events: none;
        display: none;
        width: max-content;
        max-width: 280px;
        padding: 4px 9px;
        border-radius: 6px;
        background: #1B1E28;
        color: #F8FAFC;
        border: 1px solid rgba(255, 255, 255, 0.28);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.28);
        font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
        font-size: 11.5px;
        font-weight: 500;
        line-height: 1.35;
        letter-spacing: 0.01em;
        white-space: normal;
        word-break: break-word;
        user-select: none;
        transition: none !important;
      }
    `;

    let tipEl = document.getElementById('aurelia-instant-tooltip');
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.id = 'aurelia-instant-tooltip';
      tipEl.setAttribute('role', 'tooltip');
      document.body.appendChild(tipEl);
    }

    let activeTrigger = null;

    function migrateTitleAttr(el) {
      if (!el || el.nodeType !== 1) return '';
      const tag = (el.tagName || '').toUpperCase();
      if (tag === 'IFRAME' || tag === 'TITLE') return '';
      if (el.hasAttribute('title')) {
        const raw = el.getAttribute('title');
        el.removeAttribute('title');
        if (raw && raw.trim()) {
          const clean = raw.trim();
          el.setAttribute('data-instant-tooltip', clean);
          if (!el.getAttribute('aria-label') && !(el.textContent || '').trim()) {
            el.setAttribute('aria-label', clean);
          }
          if (el === activeTrigger && tipEl.style.display === 'block') {
            tipEl.textContent = clean;
          }
        }
      }
      return el.getAttribute('data-instant-tooltip') || '';
    }

    function migrateAllTitles(root) {
      if (!root || !root.querySelectorAll) return;
      const list = root.querySelectorAll('[title]:not(iframe)');
      for (let i = 0; i < list.length; i++) {
        migrateTitleAttr(list[i]);
      }
    }

    migrateAllTitles(document);

    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function (mutations) {
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          if (m.type === 'attributes' && m.attributeName === 'title' && m.target) {
            migrateTitleAttr(m.target);
          } else if (m.addedNodes && m.addedNodes.length) {
            for (let j = 0; j < m.addedNodes.length; j++) {
              const node = m.addedNodes[j];
              if (node.nodeType === 1) {
                if (node.hasAttribute && node.hasAttribute('title')) {
                  migrateTitleAttr(node);
                }
                migrateAllTitles(node);
              }
            }
          }
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['title']
      });
    }

    function positionTooltip(clientX, clientY, anchorEl) {
      if (!tipEl || tipEl.style.display === 'none') return;
      const pad = 8;
      const tipW = tipEl.offsetWidth;
      const tipH = tipEl.offsetHeight;
      let left;
      let top;

      if (typeof clientX === 'number' && typeof clientY === 'number' && (clientX !== 0 || clientY !== 0)) {
        left = clientX + 12;
        top = clientY + 18;
      } else if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        left = rect.left + Math.min(rect.width * 0.5, 40);
        top = rect.bottom + 6;
      } else {
        return;
      }

      if (left + tipW > window.innerWidth - pad) {
        left = Math.max(pad, window.innerWidth - tipW - pad);
      }
      if (left < pad) left = pad;

      if (top + tipH > window.innerHeight - pad) {
        const fallbackY = (typeof clientY === 'number' && clientY !== 0)
          ? clientY - tipH - 10
          : (anchorEl ? anchorEl.getBoundingClientRect().top - tipH - 6 : pad);
        top = Math.max(pad, fallbackY);
      }
      if (top < pad) top = pad;

      tipEl.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
    }

    function showTooltip(trigger, clientX, clientY) {
      if (!trigger) return;
      const text = migrateTitleAttr(trigger) || trigger.getAttribute('data-instant-tooltip') || '';
      if (!text) {
        hideTooltip();
        return;
      }
      activeTrigger = trigger;
      tipEl.textContent = text;
      tipEl.style.display = 'block';
      positionTooltip(clientX, clientY, trigger);
    }

    function hideTooltip() {
      activeTrigger = null;
      if (tipEl) {
        tipEl.style.display = 'none';
      }
    }

    document.addEventListener('mouseover', function (e) {
      const target = e.target && e.target.closest ? e.target.closest('[data-instant-tooltip], [title]:not(iframe)') : null;
      if (!target) {
        if (activeTrigger) hideTooltip();
        return;
      }
      showTooltip(target, e.clientX, e.clientY);
    }, true);

    document.addEventListener('mousemove', function (e) {
      if (!activeTrigger) return;
      positionTooltip(e.clientX, e.clientY, activeTrigger);
    }, true);

    document.addEventListener('mouseout', function (e) {
      if (!activeTrigger) return;
      const related = e.relatedTarget;
      const nextTrigger = (related && related.closest) ? related.closest('[data-instant-tooltip], [title]:not(iframe)') : null;
      if (nextTrigger !== activeTrigger) {
        if (nextTrigger) {
          showTooltip(nextTrigger, e.clientX, e.clientY);
        } else {
          hideTooltip();
        }
      }
    }, true);

    document.addEventListener('focusin', function (e) {
      const target = e.target && e.target.closest ? e.target.closest('[data-instant-tooltip], [title]:not(iframe)') : null;
      if (target && target.matches && target.matches(':focus-visible')) {
        showTooltip(target, 0, 0);
      }
    }, true);

    document.addEventListener('focusout', hideTooltip, true);
    document.addEventListener('mousedown', hideTooltip, true);
    document.addEventListener('scroll', hideTooltip, true);
    window.addEventListener('blur', hideTooltip);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideTooltip();
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();

// =========================================================================
// UNIVERSAL 3D MAGNIFYING GLASS SEARCH ICON ENGINE
// =========================================================================
function applyUniversalSearchIcons() {
  try {
    const searchInputs = document.querySelectorAll(
      'input[id*="search" i], input[id*="Search"], input[placeholder*="search" i], input[placeholder*="Search"], input[type="search"]'
    );
    searchInputs.forEach(function (inp) {
      inp.classList.add('aurelia-search-input');
      if (inp.parentElement) {
        const svgs = inp.parentElement.querySelectorAll(':scope > svg, :scope > div > svg');
        svgs.forEach(function (svg) {
          svg.style.display = 'none';
          svg.style.opacity = '0';
          svg.style.visibility = 'hidden';
          svg.setAttribute('aria-hidden', 'true');
        });
      }
    });
  } catch (e) {
    console.warn('applyUniversalSearchIcons error:', e);
  }
}

// Run on ready and observe DOM for search inputs in modals
applyUniversalSearchIcons();
$(document).ready(function () {
  applyUniversalSearchIcons();
  setTimeout(applyUniversalSearchIcons, 100);
  setTimeout(applyUniversalSearchIcons, 500);
});

if (typeof window !== 'undefined' && window.MutationObserver) {
  const aureliaSearchObserver = new MutationObserver(function (mutations) {
    let shouldCheck = false;
    for (let i = 0; i < mutations.length; i++) {
      const added = mutations[i].addedNodes;
      if (added && added.length > 0) {
        for (let j = 0; j < added.length; j++) {
          if (added[j].nodeType === 1) {
            shouldCheck = true;
            break;
          }
        }
      }
      if (shouldCheck) break;
    }
    if (shouldCheck) {
      applyUniversalSearchIcons();
    }
  });
  if (document.body) {
    aureliaSearchObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      aureliaSearchObserver.observe(document.body, { childList: true, subtree: true });
    });
  }
}

// =========================================================================
// UNIVERSAL EDITABLE BRAND NAME & DYNAMIC LOGO ENGINE
// =========================================================================
(function initBrandCustomizationEngine() {
  const BRAND_STORAGE_KEY = 'aurelia_custom_brand_name';
  const LOGO_IMG_STORAGE_KEY = 'aurelia_custom_brand_logo_img';
  const HOTEL_INFO_STORAGE_KEY = 'aurelia_hotel_info';
  const DEFAULT_BRAND_NAME = 'AURELIA';

  function getSavedHotelInfo() {
    try {
      const raw = localStorage.getItem(HOTEL_INFO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) { }
    const currentBrand = getSavedBrandName();
    return {
      hotelName: currentBrand === 'AURELIA' ? 'Hotel Aurelia' : currentBrand,
      gstin: '29AABCU9603R1Z7',
      posCounter: 'Counter 01 - Executive Front Desk'
    };
  }

  function saveHotelInfo(data) {
    try {
      localStorage.setItem(HOTEL_INFO_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving hotel info:', e);
    }
  }

  function syncHotelInfoUI() {
    const info = getSavedHotelInfo();
    document.querySelectorAll('#input-hotel-info-name').forEach(function (inp) {
      if (document.activeElement !== inp) inp.value = info.hotelName || '';
    });
    document.querySelectorAll('#input-hotel-info-gstin').forEach(function (inp) {
      if (document.activeElement !== inp) inp.value = info.gstin || '';
    });
    document.querySelectorAll('#input-hotel-info-pos').forEach(function (inp) {
      if (document.activeElement !== inp) inp.value = info.posCounter || '';
    });
  }

  function saveHotelInfoFromCard() {
    const nameInput = document.getElementById('input-hotel-info-name');
    const gstinInput = document.getElementById('input-hotel-info-gstin');
    const posInput = document.getElementById('input-hotel-info-pos');

    const rawName = nameInput ? nameInput.value : '';
    const cleanHotelName = (rawName || '').trim();
    const gstin = gstinInput ? gstinInput.value.trim() : '';
    const pos = posInput ? posInput.value.trim() : '';

    const newInfo = {
      hotelName: cleanHotelName || DEFAULT_BRAND_NAME,
      gstin: gstin || '29AABCU9603R1Z7',
      posCounter: pos || 'Counter 01 - Executive Front Desk'
    };
    saveHotelInfo(newInfo);

    // Sync hotel name across the branding engine (Card 1, sidebar, mobile header, page title)
    if (cleanHotelName) {
      const finalBrandName = cleanHotelName.toUpperCase();
      try {
        localStorage.setItem(BRAND_STORAGE_KEY, finalBrandName);
      } catch (e) { }
      applyBrandName(finalBrandName, false);
    }

    if (typeof window.showToast === 'function') {
      window.showToast('Hotel information and branding saved successfully!', 'success');
    }
  }

  function getCustomLogoImage() {
    try {
      return localStorage.getItem(LOGO_IMG_STORAGE_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  function saveCustomLogoImage(dataUrl) {
    try {
      if (dataUrl) {
        localStorage.setItem(LOGO_IMG_STORAGE_KEY, dataUrl);
      } else {
        localStorage.removeItem(LOGO_IMG_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error saving custom logo image:', e);
    }
  }

  function getActiveCardBorderColor() {
    try {
      const raw = localStorage.getItem('aurelia_theme_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.cardBorder) return parsed.cardBorder.toUpperCase();
      }
    } catch (e) { }
    return '#FCA311';
  }

  function isLightColor(color) {
    try {
      let r = 0, g = 0, b = 0;
      if (!color) return false;
      if (color.startsWith('#')) {
        let hex = color.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 165;
    } catch (e) {
      return false;
    }
  }

  function getSavedBrandName() {
    try {
      const saved = localStorage.getItem(BRAND_STORAGE_KEY);
      if (saved && saved.trim()) {
        return saved.trim();
      }
    } catch (e) { }
    return DEFAULT_BRAND_NAME;
  }

  function escapeAttr(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function updateFavicon(brandName, cardBorderColor) {
    try {
      const customImg = getCustomLogoImage();
      let faviconUrl = '';
      let isSvg = false;

      if (customImg) {
        faviconUrl = customImg;
        isSvg = customImg.startsWith('data:image/svg');
      } else {
        const cleanName = (brandName || getSavedBrandName()).trim();
        const isDefault = cleanName.toUpperCase() === DEFAULT_BRAND_NAME;
        const initial = (cleanName.charAt(0) || 'A').toUpperCase();
        const logoBg = (cardBorderColor || getActiveCardBorderColor()).toUpperCase();
        const isLight = isLightColor(logoBg);
        const accentColor = isLight ? '#14213D' : '#FFFFFF';
        const pearlFill = isLight ? (logoBg === '#FFFFFF' ? '#FCA311' : '#FFFFFF') : '#FCA311';

        let rawSvg = '';
        if (isDefault) {
          rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="${logoBg}"/><circle cx="100" cy="100" r="86" fill="none" stroke="${accentColor}" stroke-width="2.2"/><path d="M58 162 L100 46 L142 162" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><line x1="71" y1="126" x2="129" y2="126" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="104" r="8.5" fill="${pearlFill}"/></svg>`;
        } else {
          rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="95" fill="${logoBg}"/><circle cx="100" cy="100" r="86" fill="none" stroke="${accentColor}" stroke-width="2.2"/><text x="100" y="110" text-anchor="middle" dominant-baseline="central" fill="${accentColor}" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="115">${escapeAttr(initial)}</text></svg>`;
        }

        faviconUrl = 'data:image/svg+xml,' + encodeURIComponent(rawSvg);
        isSvg = true;
      }

      // Remove old icon elements to force instant browser tab repaint
      const oldIcons = document.querySelectorAll("link[rel*='icon']");
      oldIcons.forEach(function (el) {
        if (el.parentNode) el.parentNode.removeChild(el);
      });

      const iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      if (isSvg) iconLink.type = 'image/svg+xml';
      iconLink.href = faviconUrl;
      document.head.appendChild(iconLink);

      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = faviconUrl;
      document.head.appendChild(appleLink);
    } catch (err) {
      console.error('Favicon update error:', err);
    }
  }

  function syncAuthBrandingUI(brandName, cardBorderColor, customLogo) {
    const cleanName = (brandName || getSavedBrandName()).trim();
    const logoBg = (cardBorderColor || getActiveCardBorderColor()).toUpperCase();
    const customImg = customLogo !== undefined ? customLogo : getCustomLogoImage();
    const isDefault = cleanName.toUpperCase() === DEFAULT_BRAND_NAME;
    const initial = (cleanName.charAt(0) || 'A').toUpperCase();
    const isLight = isLightColor(logoBg);
    const accentColor = isLight ? '#14213D' : '#FFFFFF';
    const pearlFill = isLight ? (logoBg === '#FFFFFF' ? '#FCA311' : '#FFFFFF') : '#FCA311';

    let svgHtml = '';
    if (isDefault) {
      svgHtml = `
          <svg id="auth-logo-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-full object-contain" role="img" aria-label="Aurelia Emblem">
            <circle cx="100" cy="100" r="95" fill="${logoBg}"/>
            <circle cx="100" cy="100" r="86" fill="none" stroke="${accentColor}" stroke-width="2.2"/>
            <path d="M58 162 L100 46 L142 162" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="71" y1="126" x2="129" y2="126" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/>
            <circle cx="100" cy="104" r="8.5" fill="${pearlFill}"/>
          </svg>
        `;
    } else {
      svgHtml = `
          <svg id="auth-logo-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-full h-full object-contain" role="img" aria-label="${escapeAttr(cleanName)} Emblem">
            <circle cx="100" cy="100" r="95" fill="${logoBg}"/>
            <circle cx="100" cy="100" r="86" fill="none" stroke="${accentColor}" stroke-width="2.2"/>
            <text x="100" y="110" text-anchor="middle" dominant-baseline="central" fill="${accentColor}" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="115">${escapeAttr(initial)}</text>
          </svg>
        `;
    }

    document.querySelectorAll('#auth-container').forEach(function (authBox) {
      // 1. Auth logo emblem or image
      authBox.querySelectorAll('img, svg').forEach(function (el) {
        if ((el.src && (el.src.includes('aurelia-mark') || el.src.startsWith('data:image'))) || el.id === 'auth-logo-mark' || (el.getAttribute('aria-label') && el.getAttribute('aria-label').includes('Emblem'))) {
          if (customImg) {
            if (el.tagName && el.tagName.toLowerCase() === 'img') {
              el.src = customImg;
              el.alt = escapeAttr(cleanName) + ' Logo';
              el.className = 'w-full h-full object-cover rounded-full';
            } else {
              const newImg = document.createElement('img');
              newImg.id = 'auth-logo-mark';
              newImg.src = customImg;
              newImg.alt = escapeAttr(cleanName) + ' Logo';
              newImg.className = 'w-full h-full object-cover rounded-full';
              if (el.parentNode) el.parentNode.replaceChild(newImg, el);
            }
          } else {
            const wrap = document.createElement('div');
            wrap.className = 'w-full h-full flex items-center justify-center';
            wrap.innerHTML = svgHtml;
            if (el.parentNode) el.parentNode.replaceChild(wrap, el);
          }
        }
      });

      // 2. Auth top-bar brand title (e.g. "SURELIA")
      authBox.querySelectorAll('span').forEach(function (sp) {
        const style = sp.getAttribute('style') || '';
        const txt = sp.textContent.trim().toUpperCase();
        if (style.includes('Cormorant Garamond') || sp.getAttribute('data-auth-brand-name') === 'true') {
          sp.setAttribute('data-auth-brand-name', 'true');
          sp.textContent = cleanName;
        } else if (txt.includes('LUXURY POS') || sp.getAttribute('data-luxury-badge') === 'true') {
          sp.setAttribute('data-luxury-badge', 'true');
          sp.textContent = `${cleanName} Luxury POS`;
        } else if (txt.includes('STAFF') && (txt.includes('JOIN') || sp.getAttribute('data-join-badge') === 'true')) {
          sp.setAttribute('data-join-badge', 'true');
          sp.textContent = `Join ${cleanName} Staff`;
        }
      });

      // 3. Login submit button: "Sign In to [cleanName]"
      const loginBtnSpan = authBox.querySelector('#btn-login-submit > span');
      if (loginBtnSpan) {
        loginBtnSpan.textContent = `Sign In to ${cleanName}`;
      }

      // 4. Register subtitle
      const regSubtitle = authBox.querySelector('#auth-card-register p');
      if (regSubtitle && regSubtitle.textContent.includes('operations')) {
        regSubtitle.innerHTML = `Register a new profile for ${escapeAttr(cleanName)} Hotel &amp; Restaurant operations.`;
      }

      // 5. Terms & Privacy disclaimers
      authBox.querySelectorAll('p, span').forEach(function (el) {
        if (el.textContent.includes('Hotel Management') || el.getAttribute('data-terms-disclaimer') === 'true') {
          el.setAttribute('data-terms-disclaimer', 'true');
          el.innerHTML = `By clicking Sign In or Google, you agree to ${escapeAttr(cleanName)} Hotel Management <span class="underline">Terms &amp; Conditions</span> and <span class="underline">Privacy Policy</span>.`;
        } else if (el.textContent.includes('Terms of Service & privacy') || el.getAttribute('data-reg-terms') === 'true') {
          el.setAttribute('data-reg-terms', 'true');
          el.textContent = `I agree to the ${cleanName} Terms of Service & privacy confidentiality policy.`;
        }
      });
    });
  }

  window.syncAuthBrandingUI = syncAuthBrandingUI;
  window.getSavedBrandName = getSavedBrandName;

  function renderBrandLogo(brandName, cardBorderColor) {
    const cleanName = (brandName || getSavedBrandName()).trim();
    const isDefault = cleanName.toUpperCase() === DEFAULT_BRAND_NAME;
    const initial = (cleanName.charAt(0) || 'A').toUpperCase();
    const logoBg = (cardBorderColor || getActiveCardBorderColor()).toUpperCase();
    const isLight = isLightColor(logoBg);
    const accentColor = isLight ? '#14213D' : '#FFFFFF';
    const pearlFill = isLight ? (logoBg === '#FFFFFF' ? '#FCA311' : '#FFFFFF') : '#FCA311';

    const customImg = getCustomLogoImage();

    // Toggle remove button on the branding card
    document.querySelectorAll('#btn-remove-brand-logo').forEach(function (btn) {
      if (customImg) {
        btn.classList.remove('hidden');
      } else {
        btn.classList.add('hidden');
      }
    });

    if (customImg) {
      // Render custom uploaded image across Desktop Sidebar, Settings Card, Mobile Header and Mobile Drawer
      const sidebarHtml = `<img id="sidebar-logo-mark" src="${customImg}" alt="${escapeAttr(cleanName)} Logo" class="w-11 h-11 rounded-full object-cover shadow-sm">`;
      document.querySelectorAll('#sidebar-logo-container').forEach(function (container) {
        container.innerHTML = sidebarHtml;
      });

      const cardHtml = `<img src="${customImg}" alt="${escapeAttr(cleanName)} Logo" class="w-14 h-14 rounded-full object-cover shadow-sm">`;
      document.querySelectorAll('#branding-card-logo-container').forEach(function (container) {
        container.innerHTML = cardHtml;
      });

      // Mobile header and mobile drawer
      document.querySelectorAll('#app-mobile-header img, #mobile-user-menu-drawer img').forEach(function (img) {
        if ((img.src && (img.src.includes('aurelia-mark') || img.src.startsWith('data:image'))) || img.id === 'sidebar-logo-mark') {
          img.src = customImg;
          img.alt = escapeAttr(cleanName) + ' Logo';
          img.classList.remove('object-contain');
          img.classList.add('object-cover');
        }
      });
      document.querySelectorAll('#app-mobile-header svg, #mobile-user-menu-drawer svg').forEach(function (svg) {
        if (svg.id === 'sidebar-logo-mark' || (svg.getAttribute('aria-label') && svg.getAttribute('aria-label').includes('Emblem'))) {
          const newImg = document.createElement('img');
          newImg.id = 'sidebar-logo-mark';
          newImg.src = customImg;
          newImg.alt = escapeAttr(cleanName) + ' Logo';
          newImg.className = 'w-full h-full rounded-full object-cover shadow-xs';
          if (svg.parentNode) svg.parentNode.replaceChild(newImg, svg);
        }
      });
    } else {
      let svgHtml = '';
      if (isDefault) {
        // Exact Default Aurelia Medallion Emblem with stylized A and white pearl dot
        svgHtml = `
            <svg id="sidebar-logo-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-11 h-11 rounded-full object-contain" role="img" aria-label="Aurelia Emblem">
              <circle cx="100" cy="100" r="95" fill="${logoBg}"/>
              <circle cx="100" cy="100" r="86" fill="none" stroke="${accentColor}" stroke-width="2.2"/>
              <path d="M58 162 L100 46 L142 162" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="71" y1="126" x2="129" y2="126" stroke="${accentColor}" stroke-width="6" stroke-linecap="round"/>
              <circle cx="100" cy="104" r="8.5" fill="${pearlFill}"/>
            </svg>
          `;
      } else {
        // Dynamic First Alphabet Emblem retaining exact circular gold/navy medallion and brand serif
        svgHtml = `
            <svg id="sidebar-logo-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="w-11 h-11 rounded-full object-contain" role="img" aria-label="${escapeAttr(cleanName)} Emblem">
              <circle cx="100" cy="100" r="95" fill="${logoBg}"/>
              <circle cx="100" cy="100" r="86" fill="none" stroke="${accentColor}" stroke-width="2.2"/>
              <text x="100" y="110" text-anchor="middle" dominant-baseline="central" fill="${accentColor}" font-family="'Cormorant Garamond', Georgia, serif" font-weight="700" font-size="115">${escapeAttr(initial)}</text>
            </svg>
          `;
      }

      const containers = document.querySelectorAll('#sidebar-logo-container');
      containers.forEach(function (container) {
        container.innerHTML = svgHtml;
      });

      const cardContainers = document.querySelectorAll('#branding-card-logo-container');
      cardContainers.forEach(function (container) {
        container.innerHTML = svgHtml.replace(/w-11 h-11/g, 'w-14 h-14');
      });

      // Also update mobile header and mobile drawer emblems (Responsive Mobile)
      document.querySelectorAll('#app-mobile-header img, #mobile-user-menu-drawer img').forEach(function (img) {
        if ((img.src && (img.src.includes('aurelia-mark') || img.src.startsWith('data:image'))) || img.id === 'sidebar-logo-mark') {
          const wrap = document.createElement('div');
          wrap.className = (img.className || '').replace(/object-cover|object-contain/g, '').trim() + ' flex items-center justify-center';
          wrap.innerHTML = svgHtml.replace(/w-11 h-11/g, 'w-full h-full');
          if (img.parentNode) img.parentNode.replaceChild(wrap, img);
        }
      });
      document.querySelectorAll('#app-mobile-header svg, #mobile-user-menu-drawer svg').forEach(function (svg) {
        if (svg.id === 'sidebar-logo-mark' || (svg.getAttribute('aria-label') && svg.getAttribute('aria-label').includes('Emblem'))) {
          svg.outerHTML = svgHtml.replace(/w-11 h-11/g, 'w-full h-full');
        }
      });
    }

    // Update mobile header and drawer brand title texts
    document.querySelectorAll('#app-mobile-header span, #mobile-user-menu-drawer span').forEach(function (sp) {
      const txt = sp.textContent.trim().toUpperCase();
      if (txt === 'AURELIA' || sp.getAttribute('data-brand-synced') === 'true') {
        sp.setAttribute('data-brand-synced', 'true');
        sp.textContent = cleanName;
      }
    });

    // Always update browser tab favicon with matching card border color or custom logo
    updateFavicon(cleanName, logoBg);

    // Sync Auth / Login Stage branding (Emblem/Logo + Brand Name + Buttons)
    syncAuthBrandingUI(cleanName, logoBg, customImg);
  }

  window.renderBrandLogo = renderBrandLogo;
  window.updateFavicon = updateFavicon;

  function updateDocumentTitle(brandName) {
    try {
      const cleanName = (brandName || DEFAULT_BRAND_NAME).trim();
      if (!document.title) return;
      if (!document.documentElement.dataset.origTitle) {
        document.documentElement.dataset.origTitle = document.title;
      }
      const baseTitle = document.documentElement.dataset.origTitle;
      if (cleanName.toUpperCase() === DEFAULT_BRAND_NAME) {
        document.title = baseTitle;
      } else {
        document.title = baseTitle.replace(/Aurelia/gi, cleanName);
      }
    } catch (e) { }
  }

  function applyStyles() {
    if (document.getElementById('aurelia-brand-customizer-styles')) return;
    const style = document.createElement('style');
    style.id = 'aurelia-brand-customizer-styles';
    style.textContent = `
        #btn-branding-card-edit {
          opacity: 0.7;
          transition: opacity 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        #btn-branding-card-edit:hover {
          opacity: 1;
          color: #FCA311 !important;
          transform: scale(1.1);
        }
        #input-branding-card-name {
          outline: none;
          min-width: 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        #btn-upload-brand-logo:hover {
          transform: scale(1.12);
        }
        #btn-remove-brand-logo:hover {
          transform: scale(1.15);
        }
      `;
    document.head.appendChild(style);
  }

  function setupBrandingUI() {
    applyStyles();

    const currentName = getSavedBrandName();
    renderBrandLogo(currentName);
    updateDocumentTitle(currentName);

    // Sidebar: pure display, NO editing icons or form controls
    const brandTitleElements = document.querySelectorAll('#sidebar-brand-title');
    if (brandTitleElements && brandTitleElements.length) {
      brandTitleElements.forEach(function (brandTitle) {
        brandTitle.innerHTML = `
            <h2 id="sidebar-brand-name-text" class="text-xl font-bold tracking-[0.22em] leading-none uppercase truncate" style="font-family: 'Cormorant Garamond', Georgia, serif;">${escapeAttr(currentName)}</h2>
            <div class="w-8 h-[1.5px] bg-[#FCA311] my-1 shadow-xs"></div>
            <span class="text-[9px] font-semibold text-[#5C677D] tracking-[0.22em] uppercase leading-tight truncate">Hotel &amp; Restaurant</span>
          `;
      });
    }

    // Card 1: Website Branding & Identity
    document.querySelectorAll('#branding-card-name-text').forEach(function (el) {
      el.textContent = currentName;
    });
    document.querySelectorAll('#input-branding-card-name').forEach(function (inp) {
      if (document.activeElement !== inp) inp.value = currentName;
    });

    // Card 3: Hotel Information
    syncHotelInfoUI();

    // Login / Auth Stage Branding
    syncAuthBrandingUI(currentName);
  }

  function applyBrandName(name, showFeedback = true) {
    const cleanName = (name || DEFAULT_BRAND_NAME).trim();
    const isDefault = cleanName.toUpperCase() === DEFAULT_BRAND_NAME;

    // Update all sidebar brand text elements
    document.querySelectorAll('#sidebar-brand-name-text').forEach(function (el) {
      el.textContent = cleanName;
    });

    // Update card brand text elements
    document.querySelectorAll('#branding-card-name-text').forEach(function (el) {
      el.textContent = cleanName;
    });

    // Update all inputs
    document.querySelectorAll('#input-branding-card-name, #input-brand-name').forEach(function (inp) {
      inp.value = cleanName;
    });

    // Update Hotel Information input as well
    document.querySelectorAll('#input-hotel-info-name').forEach(function (inp) {
      if (document.activeElement !== inp) {
        inp.value = cleanName;
      }
    });
    try {
      const currInfo = getSavedHotelInfo();
      currInfo.hotelName = cleanName;
      saveHotelInfo(currInfo);
    } catch (e) { }

    // Update logos
    renderBrandLogo(cleanName);

    // Sync Login / Auth Stage branding
    syncAuthBrandingUI(cleanName);

    // Update document title
    updateDocumentTitle(cleanName);

    if (showFeedback && typeof window.showToast === 'function') {
      if (isDefault) {
        window.showToast('Restored default branding: AURELIA', 'info');
      } else {
        window.showToast(`Website name updated to "${cleanName}"`, 'success');
      }
    }
  }

  function saveBrandNameFromCard() {
    const input = document.getElementById('input-branding-card-name');
    const rawVal = input ? input.value : '';
    const trimmedVal = (rawVal || '').trim();

    if (!trimmedVal) {
      // Validation: Do not allow empty names or names containing only spaces.
      // Default Reset: If the customer clears the saved name, restore default branding "AURELIA" with letter "A" in logo
      try {
        localStorage.removeItem(BRAND_STORAGE_KEY);
      } catch (e) { }
      applyBrandName(DEFAULT_BRAND_NAME, true);
    } else {
      const finalName = trimmedVal.toUpperCase();
      try {
        localStorage.setItem(BRAND_STORAGE_KEY, finalName);
      } catch (e) { }
      applyBrandName(finalName, true);
    }

    // Exit card edit mode
    document.querySelectorAll('#branding-card-edit-mode').forEach(function (em) {
      em.classList.add('hidden');
    });
    document.querySelectorAll('#branding-card-display-mode').forEach(function (dm) {
      dm.classList.remove('hidden');
    });
  }

  function cancelBrandNameCardEdit() {
    const current = getSavedBrandName();
    document.querySelectorAll('#input-branding-card-name').forEach(function (inp) {
      inp.value = current;
    });
    document.querySelectorAll('#branding-card-edit-mode').forEach(function (em) {
      em.classList.add('hidden');
    });
    document.querySelectorAll('#branding-card-display-mode').forEach(function (dm) {
      dm.classList.remove('hidden');
    });
  }

  // Event delegation for branding controls
  document.addEventListener('click', function (e) {
    // 1. Upload logo button on card ([+] sign)
    const uploadBtn = e.target.closest('#btn-upload-brand-logo');
    if (uploadBtn) {
      e.preventDefault();
      e.stopPropagation();
      const fileInput = document.getElementById('input-brand-logo-file');
      if (fileInput) {
        fileInput.click();
      }
      return;
    }

    // 2. Remove custom logo button on card (red [X] sign)
    const removeBtn = e.target.closest('#btn-remove-brand-logo');
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      saveCustomLogoImage(null);
      const fileInput = document.getElementById('input-brand-logo-file');
      if (fileInput) fileInput.value = '';
      renderBrandLogo();
      if (typeof window.showToast === 'function') {
        window.showToast('Custom logo image removed. Dynamic emblem restored.', 'info');
      }
      return;
    }

    // 3. Edit button on card
    const editBtn = e.target.closest('#btn-branding-card-edit');
    if (editBtn) {
      e.preventDefault();
      e.stopPropagation();
      const current = getSavedBrandName();
      document.querySelectorAll('#input-branding-card-name').forEach(function (inp) {
        inp.value = current;
      });
      document.querySelectorAll('#branding-card-display-mode').forEach(function (dm) {
        dm.classList.add('hidden');
      });
      document.querySelectorAll('#branding-card-edit-mode').forEach(function (em) {
        em.classList.remove('hidden');
      });
      const activeInput = document.getElementById('input-branding-card-name');
      if (activeInput) {
        setTimeout(function () {
          activeInput.focus();
          activeInput.select();
        }, 30);
      }
      return;
    }

    // 4. Save button on card
    const saveBtn = e.target.closest('#btn-branding-card-save');
    if (saveBtn) {
      e.preventDefault();
      e.stopPropagation();
      saveBrandNameFromCard();
      return;
    }

    // 5. Cancel button on card
    const cancelBtn = e.target.closest('#btn-branding-card-cancel');
    if (cancelBtn) {
      e.preventDefault();
      e.stopPropagation();
      cancelBrandNameCardEdit();
      return;
    }

    // 6. Reset to default button on card
    const resetBtn = e.target.closest('#btn-branding-card-reset');
    if (resetBtn) {
      e.preventDefault();
      e.stopPropagation();
      try {
        localStorage.removeItem(BRAND_STORAGE_KEY);
      } catch (err) { }
      saveCustomLogoImage(null);
      const fileInput = document.getElementById('input-brand-logo-file');
      if (fileInput) fileInput.value = '';
      applyBrandName(DEFAULT_BRAND_NAME, true);
      cancelBrandNameCardEdit();
      return;
    }

    // 7. Save button on Hotel Information card
    const saveHotelBtn = e.target.closest('#btn-save-hotel-info');
    if (saveHotelBtn) {
      e.preventDefault();
      e.stopPropagation();
      saveHotelInfoFromCard();
      return;
    }

    const brandInput = e.target.closest('#input-branding-card-name');
    if (brandInput) {
      e.stopPropagation();
    }
  }, true);

  // File upload change listener
  document.addEventListener('change', function (e) {
    const fileInput = e.target.closest ? e.target.closest('#input-brand-logo-file') : null;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      if (!file.type.startsWith('image/')) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please select a valid image file (PNG, JPG, SVG, WebP).', 'error');
        }
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        if (typeof window.showToast === 'function') {
          window.showToast('Image size should be less than 5MB.', 'warning');
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = function (evt) {
        const rawDataUrl = evt.target.result;
        if (file.type === 'image/svg+xml') {
          saveCustomLogoImage(rawDataUrl);
          renderBrandLogo();
          if (typeof window.showToast === 'function') {
            window.showToast('Company logo updated successfully!', 'success');
          }
          return;
        }

        // Optimize raster images using Canvas (max 300x300) to keep localStorage lightweight and fast
        const img = new Image();
        img.onload = function () {
          try {
            const canvas = document.createElement('canvas');
            const maxDim = 300;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png', 0.9);
            saveCustomLogoImage(optimizedDataUrl);
            renderBrandLogo();
            if (typeof window.showToast === 'function') {
              window.showToast('Company logo updated successfully!', 'success');
            }
          } catch (err) {
            console.error('Canvas processing failed, using raw data URL:', err);
            saveCustomLogoImage(rawDataUrl);
            renderBrandLogo();
            if (typeof window.showToast === 'function') {
              window.showToast('Company logo updated successfully!', 'success');
            }
          }
        };
        img.onerror = function () {
          saveCustomLogoImage(rawDataUrl);
          renderBrandLogo();
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  }, true);

  document.addEventListener('keydown', function (e) {
    const brandInput = e.target.closest ? e.target.closest('#input-branding-card-name') : null;
    if (brandInput) {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBrandNameFromCard();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelBrandNameCardEdit();
      }
      return;
    }

    const hotelInput = e.target.closest ? e.target.closest('#input-hotel-info-name, #input-hotel-info-gstin, #input-hotel-info-pos') : null;
    if (hotelInput && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      saveHotelInfoFromCard();
      return;
    }
  }, true);

  // Cross-tab synchronization via storage event
  window.addEventListener('storage', function (e) {
    if (e.key === BRAND_STORAGE_KEY) {
      applyBrandName(getSavedBrandName(), false);
      syncHotelInfoUI();
    } else if (e.key === HOTEL_INFO_STORAGE_KEY) {
      syncHotelInfoUI();
    } else if (e.key === LOGO_IMG_STORAGE_KEY) {
      renderBrandLogo(null);
    } else if (e.key === 'aurelia_theme_settings') {
      renderBrandLogo(null);
    }
  });

  // Run setup immediately and on DOM events
  setupBrandingUI();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBrandingUI);
  } else {
    setTimeout(setupBrandingUI, 50);
  }
})();

// =========================================================================
// UNIVERSAL SIDEBAR DROPDOWN EXPAND ARROW ENGINE (Collapsed: ">", Expanded: "v")
// =========================================================================
function syncExpandChevrons() {
  const chevronConfigs = [
    { id: 'chevron-nav-billing', submenuId: 'submenu-billing' },
    { id: 'chevron-nav-hr', submenuId: 'submenu-human-resource' },
    { id: 'chevron-sub-leave', submenuId: 'nested-leave-mgmt-menu' },
    { id: 'chevron-sub-payroll', submenuId: 'nested-payroll-menu' },
    { id: 'chevron-nav-dept', submenuId: 'submenu-department' }
  ];

  chevronConfigs.forEach(function (cfg) {
    const chevrons = document.querySelectorAll('#' + cfg.id);
    const submenu = document.getElementById(cfg.submenuId);
    const isExpanded = submenu && !submenu.classList.contains('hidden');

    chevrons.forEach(function (svg) {
      // Enforce right-pointing arrow ">"
      const path = svg.querySelector('path');
      if (path && path.getAttribute('d') !== 'M8.25 4.5l7.5 7.5-7.5 7.5') {
        path.setAttribute('d', 'M8.25 4.5l7.5 7.5-7.5 7.5');
      }
      svg.classList.remove('rotate-180');
      if (isExpanded) {
        svg.classList.add('rotate-90');
      } else {
        svg.classList.remove('rotate-90');
      }
    });
  });
}

// Inject styles to guarantee rotate-90 always renders pointing DOWN "v"
(function initChevronStyles() {
  if (document.getElementById('aurelia-chevron-expand-styles')) return;
  const style = document.createElement('style');
  style.id = 'aurelia-chevron-expand-styles';
  style.textContent = `
      #chevron-nav-billing,
      #chevron-nav-hr,
      #chevron-sub-leave,
      #chevron-sub-payroll,
      #chevron-nav-dept {
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        transform-origin: center center !important;
      }
      #chevron-nav-billing.rotate-90,
      #chevron-nav-hr.rotate-90,
      #chevron-sub-leave.rotate-90,
      #chevron-sub-payroll.rotate-90,
      #chevron-nav-dept.rotate-90 {
        transform: rotate(90deg) !important;
      }
    `;
  document.head.appendChild(style);
})();

$(document).ready(function () {
  syncExpandChevrons();
  setTimeout(syncExpandChevrons, 100);
  setTimeout(syncExpandChevrons, 400);
});
