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
  'use strict';

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
    INITIALIZED: 'finset_hotel_init_v26'
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
    { id: 'item-1', name: 'Paneer Butter Masala', category: 'Main Course', price: 16.50, available: true, description: 'Fresh cottage cheese in rich tomato butter gravy' },
    { id: 'item-2', name: 'Dal Makhani', category: 'Main Course', price: 12.00, available: true, description: 'Slow-cooked black lentils with fresh cream' },
    { id: 'item-3', name: 'Chicken Tikka Masala', category: 'Main Course', price: 18.50, available: true, description: 'Charcoal-grilled chicken chunks in spiced gravy' },
    { id: 'item-4', name: 'Mutton Rogan Josh', category: 'Main Course', price: 22.00, available: true, description: 'Traditional Kashmiri aromatic slow-cooked lamb' },
    { id: 'item-5', name: 'Kadai Paneer', category: 'Main Course', price: 15.00, available: true, description: 'Bell peppers and cottage cheese with crushed spices' },
    { id: 'item-6', name: 'Butter Chicken Grand Style', category: 'Main Course', price: 19.50, available: true, description: 'Signature mild tandoori chicken simmered in makhani sauce' },

    { id: 'item-7', name: 'Paneer Tikka Angara', category: 'Starters', price: 14.00, available: true, description: 'Clay oven roasted spiced cottage cheese skewers' },
    { id: 'item-8', name: 'Chicken 65 Hyderabadi', category: 'Starters', price: 15.50, available: true, description: 'Crispy tempered fried chicken with curry leaves' },
    { id: 'item-9', name: 'Hara Bhara Kabab', category: 'Starters', price: 11.50, available: true, description: 'Spinach and green pea patties shallow fried' },
    { id: 'item-10', name: 'Crispy Corn Pepper Salt', category: 'Starters', price: 10.50, available: true, description: 'Golden fried sweet corn tossed with scallions' },
    { id: 'item-11', name: 'Tandoori Chicken Half', category: 'Starters', price: 17.00, available: false, description: 'Spiced yogurt marinated bone-in chicken' },

    { id: 'item-12', name: 'Butter Naan', category: 'Breads', price: 3.50, available: true, description: 'Tandoori leavened flatbread brushed with butter' },
    { id: 'item-13', name: 'Garlic Naan', category: 'Breads', price: 4.50, available: true, description: 'Leavened bread topped with minced roasted garlic' },
    { id: 'item-14', name: 'Tandoori Roti', category: 'Breads', price: 2.50, available: true, description: 'Whole wheat flatbread baked in clay oven' },
    { id: 'item-15', name: 'Lachha Paratha', category: 'Breads', price: 4.00, available: true, description: 'Multi-layered flaky whole wheat bread' },

    { id: 'item-16', name: 'Hyderabadi Chicken Dum Biryani', category: 'Rice and Biryani', price: 19.00, available: true, description: 'Fragrant basmati rice layered with spiced chicken and saffron' },
    { id: 'item-17', name: 'Royal Veg Dum Biryani', category: 'Rice and Biryani', price: 14.50, available: true, description: 'Assorted vegetables cooked on dum with aromatic herbs' },
    { id: 'item-18', name: 'Mutton Gosht Biryani', category: 'Rice and Biryani', price: 23.50, available: true, description: 'Tender lamb cuts infused with aged long-grain basmati' },
    { id: 'item-19', name: 'Jeera Basmati Rice', category: 'Rice and Biryani', price: 8.50, available: true, description: 'Cumin tempered steamed fragrant basmati rice' },

    { id: 'item-20', name: 'Gulab Jamun with Rabri', category: 'Desserts', price: 7.50, available: true, description: 'Warm milk dumplings soaked in cardamom sugar syrup' },
    { id: 'item-21', name: 'Kesar Rasmalai (2 Pcs)', category: 'Desserts', price: 8.00, available: true, description: 'Spongy cottage cheese patties in saffron clotted milk' },
    { id: 'item-22', name: 'Shahi Matka Kulfi', category: 'Desserts', price: 6.50, available: true, description: 'Traditional condensed milk ice cream with pistachios' },

    { id: 'item-23', name: 'South Indian Filter Coffee', category: 'Beverages', price: 4.00, available: true, description: 'Freshly brewed chicory coffee with frothy hot milk' },
    { id: 'item-24', name: 'Masala Chai Pot', category: 'Beverages', price: 3.50, available: true, description: 'Assam tea simmered with fresh ginger and green cardamom' },
    { id: 'item-25', name: 'Fresh Lime Soda', category: 'Beverages', price: 4.50, available: true, description: 'Chilled sparkling limeade with rock salt' },
    { id: 'item-26', name: 'Mango Lassi', category: 'Beverages', price: 6.00, available: true, description: 'Thick yogurt shake blended with Alphonso pulp' },

    { id: 'item-27', name: 'Executive Club Sandwich', category: 'Room Service', price: 13.50, available: true, description: 'Triple decker toast with grilled chicken, egg and cheese' },
    { id: 'item-28', name: 'Continental Breakfast Tray', category: 'Room Service', price: 18.00, available: true, description: 'Croissant, toast, preserves, fresh juice and coffee' }
  ];

  const DEFAULT_CUSTOMERS = [
    { id: 'cust-1', name: 'Rajesh Sharma', phone: '9845012345', email: 'rajesh.sharma@gmail.com', address: 'Koramangala 4th Block, Bengaluru', visits: 12, totalSpend: 840.00 },
    { id: 'cust-2', name: 'Priya Sundaram', phone: '9886167890', email: 'priya.sundaram@outlook.com', address: 'Indiranagar 100ft Road, Bengaluru', visits: 8, totalSpend: 520.00 },
    { id: 'cust-3', name: 'Vikramaditya Reddy', phone: '9741234567', email: 'vikram.reddy@techcorp.in', address: 'Whitefield EPIP Zone, Bengaluru', visits: 15, totalSpend: 1140.00 },
    { id: 'cust-4', name: 'Ananya Deshmukh', phone: '9900298765', email: 'ananya.d@gmail.com', address: 'HSR Layout Sector 2, Bengaluru', visits: 6, totalSpend: 390.00 },
    { id: 'cust-5', name: 'Amit Patel', phone: '9823045678', email: 'amit.patel@zenith.com', address: 'Jayanagar 4th T Block, Bengaluru', visits: 9, totalSpend: 680.00 },
    { id: 'cust-6', name: 'Sunita Kulkarni', phone: '9448123409', email: 'sunita.k@gmail.com', address: 'Malleshwaram 15th Cross, Bengaluru', visits: 5, totalSpend: 310.00 }
  ];

  const DEFAULT_ORDERS = [
    {
      id: 'ORD-0081',
      orderNumber: 'ORD-0081',
      customerName: 'Rajesh Sharma',
      customerPhone: '9845012345',
      tableRoom: 'Table 4',
      status: 'Pending',
      timestamp: '2026-10-27T09:45:00',
      notes: 'Less oil in Dal Makhani, extra butter on naan',
      billNumber: null,
      items: [
        { id: 'item-2', name: 'Dal Makhani', price: 12.00, qty: 1 },
        { id: 'item-1', name: 'Paneer Butter Masala', price: 16.50, qty: 1 },
        { id: 'item-12', name: 'Butter Naan', price: 3.50, qty: 4 }
      ]
    },
    {
      id: 'ORD-0082',
      orderNumber: 'ORD-0082',
      customerName: 'Vikramaditya Reddy',
      customerPhone: '9741234567',
      tableRoom: 'Room 304',
      status: 'Preparing',
      timestamp: '2026-10-27T10:05:00',
      notes: 'Serve warm with lime wedges and onion rings',
      billNumber: null,
      items: [
        { id: 'item-16', name: 'Hyderabadi Chicken Dum Biryani', price: 19.00, qty: 2 },
        { id: 'item-26', name: 'Mango Lassi', price: 6.00, qty: 2 }
      ]
    },
    {
      id: 'ORD-0080',
      orderNumber: 'ORD-0080',
      customerName: 'Ananya Deshmukh',
      customerPhone: '9900298765',
      tableRoom: 'Table 7',
      status: 'Completed',
      timestamp: '2026-10-27T08:20:00',
      notes: 'Table cleared, invoice settled via UPI',
      billNumber: 'INV-2026-0140',
      items: [
        { id: 'item-28', name: 'Continental Breakfast Tray', price: 18.00, qty: 2 },
        { id: 'item-23', name: 'South Indian Filter Coffee', price: 4.00, qty: 2 }
      ]
    }
  ];

  const DEFAULT_BILLS = [
    {
      id: 'bill-142',
      billNumber: 'INV-2026-0142',
      date: '2026-10-27T10:10:00',
      customerName: 'Vikramaditya Reddy',
      customerPhone: '+91 97412 34567',
      customerEmail: 'vikram.reddy@gmail.com',
      customerAddress: 'Whitefield EPIP Zone, Bengaluru',
      tableRoom: 'Presidential Suite 501',
      paymentMethod: 'UPI',
      status: 'Paid',
      linkedOrderId: null,
      taxRate: 5,
      subtotal: 34000.00,
      discountType: 'flat',
      discountVal: 0,
      discountAmount: 0.00,
      taxAmount: 1700.00,
      grandTotal: 35700.00,
      items: [
        { name: 'Presidential Suite Luxury Stay (2 Nights)', category: 'Room Service', price: 15000.00, qty: 2, subtotal: 30000.00 },
        { name: 'In-Suite Candlelight Dining Experience', category: 'Main Course', price: 4000.00, qty: 1, subtotal: 4000.00 }
      ]
    },
    {
      id: 'bill-141',
      billNumber: 'INV-2026-0141',
      date: '2026-10-27T09:15:00',
      customerName: 'Priya Sundaram',
      customerPhone: '+91 98861 67890',
      customerEmail: 'priya.sundaram@infosys.com',
      customerAddress: 'Indiranagar 100ft Road, Bengaluru',
      tableRoom: 'Deluxe Room 204',
      paymentMethod: 'Card',
      status: 'Paid',
      linkedOrderId: null,
      taxRate: 5,
      subtotal: 27095.24,
      discountType: 'flat',
      discountVal: 0,
      discountAmount: 0.00,
      taxAmount: 1354.76,
      grandTotal: 28450.00,
      items: [
        { name: 'Deluxe Garden View Room (3 Nights)', category: 'Room Service', price: 7500.00, qty: 3, subtotal: 22500.00 },
        { name: 'Aurelia Ayurvedic Spa Therapy & Hydro', category: 'Beverages', price: 4595.24, qty: 1, subtotal: 4595.24 }
      ]
    },
    {
      id: 'bill-140',
      billNumber: 'INV-2026-0140',
      date: '2026-10-26T21:45:00',
      customerName: 'Tech Mahindra Corporate',
      customerPhone: '+91 99002 98765',
      customerEmail: 'events@techmahindra.com',
      customerAddress: 'Electronic City Phase 1, Bengaluru',
      tableRoom: 'Imperial Banquet Hall',
      paymentMethod: 'Card',
      status: 'Paid',
      linkedOrderId: null,
      taxRate: 5,
      subtotal: 40571.43,
      discountType: 'flat',
      discountVal: 0,
      discountAmount: 0.00,
      taxAmount: 2028.57,
      grandTotal: 42600.00,
      items: [
        { name: 'Corporate Dinner Banquet Buffet (25 Pax)', category: 'Main Course', price: 1400.00, qty: 25, subtotal: 35000.00 },
        { name: 'Audio-Visual Rigging & Live Mocktail Bar', category: 'Beverages', price: 5571.43, qty: 1, subtotal: 5571.43 }
      ]
    },
    {
      id: 'bill-139',
      billNumber: 'INV-2026-0139',
      date: '2026-10-26T14:30:00',
      customerName: 'Rajesh Sharma',
      customerPhone: '+91 98450 12345',
      customerEmail: 'rajesh.sharma@tcs.com',
      customerAddress: 'Koramangala 4th Block, Bengaluru',
      tableRoom: 'Executive Suite 302',
      paymentMethod: 'UPI',
      status: 'Paid',
      linkedOrderId: null,
      taxRate: 5,
      subtotal: 18000.00,
      discountType: 'flat',
      discountVal: 0,
      discountAmount: 0.00,
      taxAmount: 900.00,
      grandTotal: 18900.00,
      items: [
        { name: 'Executive Club Suite (1 Night)', category: 'Room Service', price: 14500.00, qty: 1, subtotal: 14500.00 },
        { name: 'Aurelia Lounge Bar & Signature Drinks', category: 'Beverages', price: 3500.00, qty: 1, subtotal: 3500.00 }
      ]
    },
    {
      id: 'bill-138',
      billNumber: 'INV-2026-0138',
      date: '2026-10-25T20:15:00',
      customerName: 'Ananya Deshmukh',
      customerPhone: '+91 98201 54321',
      customerEmail: 'ananya.d@gmail.com',
      customerAddress: 'HSR Layout Sector 2, Bengaluru',
      tableRoom: 'Table 8 (Fine Dining)',
      paymentMethod: 'UPI',
      status: 'Paid',
      linkedOrderId: 'ORD-0080',
      taxRate: 5,
      subtotal: 8047.62,
      discountType: 'flat',
      discountVal: 0,
      discountAmount: 0.00,
      taxAmount: 402.38,
      grandTotal: 8450.00,
      items: [
        { name: 'Royal Nawabi Dinner Thali (4 Pax)', category: 'Main Course', price: 1300.00, qty: 4, subtotal: 5200.00 },
        { name: 'Grilled Tiger Prawns Angara', category: 'Starters', price: 923.81, qty: 2, subtotal: 1847.62 },
        { name: 'Kesar Rasmalai & Pistachio Kulfi Platter', category: 'Desserts', price: 500.00, qty: 2, subtotal: 1000.00 }
      ]
    },
    {
      id: 'bill-137',
      billNumber: 'INV-2026-0137',
      date: '2026-10-25T11:20:00',
      customerName: 'Arjun Kapoor',
      customerPhone: '+91 97110 88234',
      customerEmail: 'arjun.k@outlook.com',
      customerAddress: 'Lavelle Road, Bengaluru',
      tableRoom: 'Premium King 410',
      paymentMethod: 'Card',
      status: 'Paid',
      linkedOrderId: null,
      taxRate: 5,
      subtotal: 12619.05,
      discountType: 'flat',
      discountVal: 0,
      discountAmount: 0.00,
      taxAmount: 630.95,
      grandTotal: 13250.00,
      items: [
        { name: 'Premium King Room (1 Night)', category: 'Room Service', price: 10500.00, qty: 1, subtotal: 10500.00 },
        { name: 'Airport Luxury Chauffeur Transfer & Mini Bar', category: 'Beverages', price: 2119.05, qty: 1, subtotal: 2119.05 }
      ]
    },
    {
      id: 'bill-136',
      billNumber: 'INV-2026-0136',
      date: '2026-10-24T18:00:00',
      customerName: 'Dr. Meera Nambiar',
      customerPhone: '+91 94481 22901',
      customerEmail: 'meera.nambiar@manipal.edu',
      customerAddress: 'Sadashivanagar, Bengaluru',
      tableRoom: 'Wellness Suite 108',
      paymentMethod: 'Cash',
      status: 'Paid',
      linkedOrderId: null,
      taxRate: 5,
      subtotal: 9263.99,
      discountType: 'flat',
      discountVal: 0,
      discountAmount: 0.00,
      taxAmount: 463.20,
      grandTotal: 9727.19,
      items: [
        { name: 'Wellness Rejuvenation Session & Aroma Therapy', category: 'Starters', price: 6500.00, qty: 1, subtotal: 6500.00 },
        { name: 'Organic Cold-Pressed Juices & Healthy Dining', category: 'Beverages', price: 2763.99, qty: 1, subtotal: 2763.99 }
      ]
    }
  ];

  const DEFAULT_STAFF = [
    // Front Office (8 staff: 7 On Duty, 1 On Leave)
    { id: 'EMP-2026-01', name: 'Adaline Lively', role: 'Front Desk Supervisor', department: 'Front Office', station: 'Main Reception Desk 01', shift: 'Morning (07:00 - 15:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11201', email: 'adaline.l@aureliahotel.com' },
    { id: 'EMP-2026-02', name: 'Vikram Malhotra', role: 'Senior Concierge', department: 'Front Office', station: 'Concierge Lounge', shift: 'Morning (08:00 - 16:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11202', email: 'vikram.m@aureliahotel.com' },
    { id: 'EMP-2026-03', name: 'Priyanka Sharma', role: 'Guest Relations Officer', department: 'Front Office', station: 'Executive Club Lounge', shift: 'Day (09:00 - 17:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11203', email: 'priyanka.s@aureliahotel.com' },
    { id: 'EMP-2026-04', name: 'Rohan Desai', role: 'Night Auditor', department: 'Front Office', station: 'Front Office Back-Desk', shift: 'Night (23:00 - 07:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11204', email: 'rohan.d@aureliahotel.com' },
    { id: 'EMP-2026-05', name: 'Ananya Sen', role: 'Front Desk Agent', department: 'Front Office', station: 'Reception Desk 02', shift: 'Afternoon (14:00 - 22:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11205', email: 'ananya.s@aureliahotel.com' },
    { id: 'EMP-2026-06', name: 'Sameer Joshi', role: 'Bell Captain & Porter', department: 'Front Office', station: 'Main Portico / Lobby', shift: 'Morning (07:00 - 15:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11206', email: 'sameer.j@aureliahotel.com' },
    { id: 'EMP-2026-07', name: 'Neha Pillai', role: 'VIP Reservations Executive', department: 'Front Office', station: 'Front Office Suite', shift: 'Day (09:30 - 18:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11207', email: 'neha.p@aureliahotel.com' },
    { id: 'EMP-2026-08', name: 'Tanvi Agarwal', role: 'Front Desk Agent', department: 'Front Office', station: 'Reception Desk 03', shift: 'Off-duty', status: 'On Leave', leaveReason: 'Casual Leave', phone: '+91 98450 11208', email: 'tanvi.a@aureliahotel.com' },

    // Culinary & Kitchen (12 staff: 10 On Duty, 2 On Leave)
    { id: 'EMP-2026-09', name: 'Chef Rajesh Kulkarni', role: 'Executive Chef', department: 'Culinary & Kitchen', station: 'Master Kitchen Central', shift: 'Day (09:00 - 18:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11209', email: 'chef.rajesh@aureliahotel.com' },
    { id: 'EMP-2026-10', name: 'Tariq Mansoor', role: 'Sous Chef', department: 'Culinary & Kitchen', station: 'Hot Line & Saute', shift: 'Morning (06:30 - 15:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11210', email: 'tariq.m@aureliahotel.com' },
    { id: 'EMP-2026-11', name: 'Meenakshi Sundaram', role: 'Head Pastry Chef', department: 'Culinary & Kitchen', station: 'Bakery & Confectionery', shift: 'Morning (06:00 - 14:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11211', email: 'meenakshi.s@aureliahotel.com' },
    { id: 'EMP-2026-12', name: 'Amitava Roy', role: 'Tandoor Master Chef', department: 'Culinary & Kitchen', station: 'Live Charcoal Tandoor', shift: 'Evening (15:00 - 23:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11212', email: 'amitava.r@aureliahotel.com' },
    { id: 'EMP-2026-13', name: 'Gurpreet Singh', role: 'Continental Line Cook', department: 'Culinary & Kitchen', station: 'Continental Range 02', shift: 'Morning (07:00 - 15:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11213', email: 'gurpreet.s@aureliahotel.com' },
    { id: 'EMP-2026-14', name: 'Farhan Qureshi', role: 'Dum & Biryani Specialist', department: 'Culinary & Kitchen', station: 'Dum Biryani Hearth', shift: 'Afternoon (12:00 - 20:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11214', email: 'farhan.q@aureliahotel.com' },
    { id: 'EMP-2026-15', name: 'David D\'Souza', role: 'Kitchen Pantry Lead', department: 'Culinary & Kitchen', station: 'Cold Kitchen & Larder', shift: 'Morning (07:00 - 15:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11215', email: 'david.d@aureliahotel.com' },
    { id: 'EMP-2026-16', name: 'Ramesh Goud', role: 'Prep Chef & Butchery', department: 'Culinary & Kitchen', station: 'Meat & Seafood Prep', shift: 'Morning (06:00 - 14:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11216', email: 'ramesh.g@aureliahotel.com' },
    { id: 'EMP-2026-17', name: 'Sumanth Rao', role: 'Commis Chef III', department: 'Culinary & Kitchen', station: 'Banquet Prep Station', shift: 'Afternoon (13:00 - 21:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11217', email: 'sumanth.r@aureliahotel.com' },
    { id: 'EMP-2026-18', name: 'Prakash Shenoy', role: 'Chief Kitchen Steward', department: 'Culinary & Kitchen', station: 'Dishwashing & Sanitation', shift: 'Day (08:00 - 17:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11218', email: 'prakash.s@aureliahotel.com' },
    { id: 'EMP-2026-19', name: 'Joseph Kurian', role: 'South Indian Cuisine Lead', department: 'Culinary & Kitchen', station: 'Breakfast Live Counter', shift: 'Off-duty', status: 'On Leave', leaveReason: 'Annual Leave', phone: '+91 98450 11219', email: 'joseph.k@aureliahotel.com' },
    { id: 'EMP-2026-20', name: 'Baldev Yadav', role: 'Grill Line Cook', department: 'Culinary & Kitchen', station: 'Robata & Skewers', shift: 'Off-duty', status: 'On Leave', leaveReason: 'Sick Leave', phone: '+91 98450 11220', email: 'baldev.y@aureliahotel.com' },

    // Food & Beverage Service (12 staff: 11 On Duty, 1 On Leave)
    { id: 'EMP-2026-21', name: 'Kevin Peterson', role: 'F&B Service Manager', department: 'Food & Beverage', station: 'Main Dining Hall', shift: 'Day (10:00 - 19:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11221', email: 'kevin.p@aureliahotel.com' },
    { id: 'EMP-2026-22', name: 'Suresh Nair', role: 'Head Bartender & Mixologist', department: 'Food & Beverage', station: 'Aurelia Bar & Lounge', shift: 'Evening (16:00 - 00:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11222', email: 'suresh.n@aureliahotel.com' },
    { id: 'EMP-2026-23', name: 'Aarti Menon', role: 'Senior Restaurant Captain', department: 'Food & Beverage', station: 'Fine Dining Section A', shift: 'Afternoon (13:00 - 21:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11223', email: 'aarti.m@aureliahotel.com' },
    { id: 'EMP-2026-24', name: 'Karthik Reddy', role: 'Senior Banquet Steward', department: 'Food & Beverage', station: 'Ballroom Banquet Hall', shift: 'Morning (07:00 - 15:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11224', email: 'karthik.r@aureliahotel.com' },
    { id: 'EMP-2026-25', name: 'Pooja Hegde', role: 'Restaurant Hostess', department: 'Food & Beverage', station: 'Restaurant Welcome Desk', shift: 'Morning (08:00 - 16:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11225', email: 'pooja.h@aureliahotel.com' },
    { id: 'EMP-2026-26', name: 'Nikhil Varma', role: 'In-Room Dining Lead', department: 'Food & Beverage', station: 'Room Service Dispatch', shift: 'Evening (15:00 - 23:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11226', email: 'nikhil.v@aureliahotel.com' },
    { id: 'EMP-2026-27', name: 'Deepa Swaminathan', role: 'Sommelier & Wine Steward', department: 'Food & Beverage', station: 'Wine Cellar & Bar', shift: 'Evening (17:00 - 01:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11227', email: 'deepa.s@aureliahotel.com' },
    { id: 'EMP-2026-28', name: 'Imran Baig', role: 'Lead Barista', department: 'Food & Beverage', station: 'Cafe & Bakery Counter', shift: 'Morning (06:30 - 15:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11228', email: 'imran.b@aureliahotel.com' },
    { id: 'EMP-2026-29', name: 'Abhishek Das', role: 'Banquet Captain', department: 'Food & Beverage', station: 'Conference Center', shift: 'Day (09:00 - 18:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11229', email: 'abhishek.d@aureliahotel.com' },
    { id: 'EMP-2026-30', name: 'Simran Kaur', role: 'Senior Table Server', department: 'Food & Beverage', station: 'Terrace Garden Dining', shift: 'Afternoon (14:00 - 22:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11230', email: 'simran.k@aureliahotel.com' },
    { id: 'EMP-2026-31', name: 'Rahul Chauhan', role: 'Food Expeditor', department: 'Food & Beverage', station: 'Kitchen Pass & Service', shift: 'Morning (07:00 - 15:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11231', email: 'rahul.c@aureliahotel.com' },
    { id: 'EMP-2026-32', name: 'Manoj Tiwari', role: 'Dining Room Steward', department: 'Food & Beverage', station: 'Poolside Deck Dining', shift: 'Off-duty', status: 'On Leave', leaveReason: 'Weekly Off', phone: '+91 98450 11232', email: 'manoj.t@aureliahotel.com' },

    // Housekeeping & Laundry (10 staff: 9 On Duty, 1 On Leave)
    { id: 'EMP-2026-33', name: 'Shanti Bai', role: 'Executive Housekeeper', department: 'Housekeeping', station: 'Housekeeping Control Desk', shift: 'Day (08:00 - 17:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11233', email: 'shanti.b@aureliahotel.com' },
    { id: 'EMP-2026-34', name: 'Lakshmi Devi', role: 'Floor Supervisor (Floors 2 & 3)', department: 'Housekeeping', station: '2nd Floor Linen Hub', shift: 'Morning (07:30 - 16:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11234', email: 'lakshmi.d@aureliahotel.com' },
    { id: 'EMP-2026-35', name: 'Mohanlal Gujjar', role: 'Laundry & Dry-Clean Master', department: 'Housekeeping', station: 'Industrial Laundry Plant', shift: 'Day (08:00 - 16:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11235', email: 'mohanlal.g@aureliahotel.com' },
    { id: 'EMP-2026-36', name: 'Rekha Das', role: 'Senior Room Attendant', department: 'Housekeeping', station: 'Executive Suites Floor 4', shift: 'Morning (08:00 - 16:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11236', email: 'rekha.d@aureliahotel.com' },
    { id: 'EMP-2026-37', name: 'Sunil Paswan', role: 'Public Area Lead', department: 'Housekeeping', station: 'Main Lobby & Atrium', shift: 'Morning (07:00 - 15:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11237', email: 'sunil.p@aureliahotel.com' },
    { id: 'EMP-2026-38', name: 'Geeta Soren', role: 'Room Amenities Attendant', department: 'Housekeeping', station: 'Linen & Amenity Stock', shift: 'Day (09:00 - 17:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11238', email: 'geeta.s@aureliahotel.com' },
    { id: 'EMP-2026-39', name: 'Harish Chandra', role: 'Linen Runner', department: 'Housekeeping', station: 'Service Elevators & Hubs', shift: 'Afternoon (13:00 - 21:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11239', email: 'harish.c@aureliahotel.com' },
    { id: 'EMP-2026-40', name: 'Mary Fernandez', role: 'Deluxe Rooms Attendant', department: 'Housekeeping', station: 'Deluxe Wing Floor 1', shift: 'Morning (08:00 - 16:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11240', email: 'mary.f@aureliahotel.com' },
    { id: 'EMP-2026-41', name: 'Basavaraj Patil', role: 'Deep Cleaning Specialist', department: 'Housekeeping', station: 'Banquet & Spa Floors', shift: 'Day (08:30 - 17:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11241', email: 'basavaraj.p@aureliahotel.com' },
    { id: 'EMP-2026-42', name: 'Savita More', role: 'Room Attendant', department: 'Housekeeping', station: 'Standard Wing Floor 1', shift: 'Off-duty', status: 'On Leave', leaveReason: 'Medical Leave', phone: '+91 98450 11242', email: 'savita.m@aureliahotel.com' },

    // Engineering & Maintenance (4 staff: 3 On Duty, 1 On Leave)
    { id: 'EMP-2026-43', name: 'Girish Sharma', role: 'Chief Facility Engineer', department: 'Engineering & Maintenance', station: 'Engineering Control Room', shift: 'Day (08:30 - 17:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11243', email: 'girish.s@aureliahotel.com' },
    { id: 'EMP-2026-44', name: 'Jagdish Mhatre', role: 'HVAC & Chiller Specialist', department: 'Engineering & Maintenance', station: 'Central Plant Room', shift: 'Morning (07:00 - 15:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11244', email: 'jagdish.m@aureliahotel.com' },
    { id: 'EMP-2026-45', name: 'Venkat Raman', role: 'Duty Electrician & DG Set', department: 'Engineering & Maintenance', station: 'Electrical Substation', shift: 'Evening (15:00 - 23:30)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11245', email: 'venkat.r@aureliahotel.com' },
    { id: 'EMP-2026-46', name: 'Santosh Kumar', role: 'Lead Plumber & RO Systems', department: 'Engineering & Maintenance', station: 'Water Treatment Facility', shift: 'Off-duty', status: 'On Leave', leaveReason: 'Emergency Leave', phone: '+91 98450 11246', email: 'santosh.k@aureliahotel.com' },

    // Security & Operations (2 staff: 2 On Duty, 0 On Leave)
    { id: 'EMP-2026-47', name: 'Capt. R. S. Rathore', role: 'Head of Hotel Security', department: 'Security & Operations', station: 'Security Command Center', shift: 'Day (08:00 - 17:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11247', email: 'security.head@aureliahotel.com' },
    { id: 'EMP-2026-48', name: 'Dharmender Singh', role: 'CCTV Surveillance Lead', department: 'Security & Operations', station: 'CCTV Monitoring Room', shift: 'Rotation (07:00 - 19:00)', status: 'On Duty', leaveReason: null, phone: '+91 98450 11248', email: 'dharmender.s@aureliahotel.com' }
  ];

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
    const toastId = 'toast-' + Date.now();
    let bg = 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700';
    if (type === 'success') {
      bg = 'bg-[#ECFDF3] dark:bg-emerald-950/80 text-[#12B76A] dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    } else if (type === 'error') {
      bg = 'bg-[#FEF3F2] dark:bg-rose-950/80 text-[#F04438] dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }

    const toastHtml = `
      <div id="${toastId}" class="finset-card ${bg} text-xs px-4 py-3 border shadow-lg flex items-center space-x-2 transition-all duration-200 opacity-0 translate-y-2 pointer-events-auto rounded-2xl">
        <span class="font-bold">${escapeHtml(message)}</span>
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

  function getStatusBadge(status) {
    status = status || 'Pending';
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return `<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#ECFDF3] text-[#12B76A] dark:bg-emerald-950/50 dark:text-emerald-300">${escapeHtml(status)}</span>`;
      case 'available':
        return `<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#ECFDF3] text-[#12B76A] dark:bg-emerald-950/50 dark:text-emerald-300">${escapeHtml(status)}</span>`;
      case 'pending':
        return `<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#FFF5E6] text-[#B26A00] border border-[#FCA311]/30">${escapeHtml(status)}</span>`;
      case 'preparing':
        return `<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">${escapeHtml(status)}</span>`;
      case 'served':
        return `<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">${escapeHtml(status)}</span>`;
      case 'cancelled':
      case 'unavailable':
      case 'refunded':
        return `<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">${escapeHtml(status)}</span>`;
      default:
        return `<span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">${escapeHtml(status)}</span>`;
    }
  }

  // =========================================================================
  // 3. NAVIGATION, SIDEBAR COLLAPSE & THEME CONTROLLER
  // =========================================================================

  const titles = {
    dashboard: 'Welcome back, Adaline!',
    billing: 'Transactions & POS Billing',
    menu: 'Product & Menu Management',
    orders: 'Order Queue & Kitchen Tickets',
    customers: 'Guest Directory & Loyalty',
    analytics: 'Revenue & Sales Analytics',
    settings: 'Station & Terminal Settings'
  };

  function switchSection(target) {
    // Authentication Route Guard: Prevent access to dashboard sections if unauthenticated
    if (window.Auth && typeof window.Auth.isAuthenticated === 'function') {
      if (!window.Auth.isAuthenticated()) {
        window.Auth.showView('login');
        return;
      }
    }

    if (!titles[target]) target = 'dashboard';

    // Update nav links active styling
    $('.Aurelia-nav-item, .aurelia-nav-item, .finset-nav-item, .nav-link').each(function () {
      const linkTarget = $(this).data('target');
      if (linkTarget === target) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });

    // Hide all sections, show target
    $('main section').addClass('hidden').attr('hidden', true);
    const $targetSec = $('#section-' + target);
    $targetSec.removeClass('hidden').removeAttr('hidden');

    // Replay smooth glassmorphic entrance animation on cards
    $targetSec.find('.Aurelia-card').each(function () {
      const el = $(this);
      el.removeClass('glass-card-animate');
      void this.offsetWidth; // Force reflow
      el.addClass('glass-card-animate');
    });

    if (target === 'dashboard') {
      const activeUser = (window.Auth && window.Auth.state && window.Auth.state.currentUser) || null;
      const firstName = activeUser ? (activeUser.name || 'Adaline').split(' ')[0] : 'Adaline';
      $('#topbar-welcome-title').text(`Welcome back, ${firstName}!`);
    } else {
      $('#topbar-welcome-title').text(titles[target]);
    }

    closeSidebar();

    // Module-specific renderers
    if (target === 'dashboard') {
      renderDashboard();
    } else if (target === 'billing') {
      initBillingSection();
    } else if (target === 'menu') {
      renderMenuSection();
    } else if (target === 'orders') {
      renderOrdersSection();
    } else if (target === 'customers') {
      renderCustomersSection();
    } else if (target === 'analytics') {
      renderAnalyticsSection();
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

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
      $chevron.removeClass('rotate-180');
      $(this).removeClass('active');
    } else {
      $submenu.removeClass('hidden');
      $chevron.addClass('rotate-180');
      $(this).addClass('active');
    }
  });

  // Nested: Leave Management Dropdown Toggle
  $('#btn-sub-leave-mgmt').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $nestedMenu = $('#nested-leave-mgmt-menu');
    const $chevron = $('#chevron-sub-leave');
    const isExpanded = !$nestedMenu.hasClass('hidden');

    if (isExpanded) {
      $nestedMenu.addClass('hidden');
      $chevron.removeClass('rotate-180');
    } else {
      $nestedMenu.removeClass('hidden');
      $chevron.addClass('rotate-180');
    }
  });

  // Nested: Payroll Dropdown Toggle
  $('#btn-sub-payroll').on('click', function (e) {
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
    }
  });

  // Human Resource Sub-Items Actions
  $('.hr-sub-item').on('click', function (e) {
    e.preventDefault();
    const action = $(this).data('action');

    // Highlight active sub-item
    $('.hr-sub-item').removeClass('text-sky-400 font-bold active').addClass('text-slate-300');
    $('.hr-sub-item span.rounded-full').removeClass('border-sky-400 bg-sky-400').addClass('border-slate-400');

    $(this).addClass('text-sky-400 font-bold active').removeClass('text-slate-300');
    $(this).find('span.rounded-full').addClass('border-sky-400 bg-sky-400').removeClass('border-slate-400');

    switch (action) {
      case 'employee-list':
        if (typeof openStaffDirectoryModal === 'function') {
          openStaffDirectoryModal();
        } else {
          $('#modal-total-staff').removeClass('hidden');
        }
        showToast('Viewing Employee Directory (48 staff members)', 'info');
        break;

      case 'add-employee':
        if (typeof openStaffDirectoryModal === 'function') {
          openStaffDirectoryModal();
        } else {
          $('#modal-total-staff').removeClass('hidden');
        }
        showToast('Human Resource: Add Employee panel ready', 'info');
        break;

      case 'holiday-list':
        showToast('Holiday List: 14 official paid holidays & gazetted calendar for 2026', 'info');
        break;

      case 'hr-doc-templates':
        showToast('HR Document Templates: 12 official hotel agreements, contracts & policies available', 'info');
        break;

      case 'leave-category':
        showToast('Leave Categories: Casual Leave, Sick Leave, Earned Leave, Maternity/Paternity', 'info');
        break;

      case 'leave-assign':
        showToast('Leave Allocation: Annual quotas assigned for 48 staff members', 'info');
        break;

      case 'leave-request':
        showToast('Leave Requests: 6 staff members currently on approved leave today', 'warning');
        break;

      case 'attendance-list':
        showToast('Attendance Ledger: 42 of 48 staff on duty (87.5% attendance rate)', 'info');
        break;

      case 'attendance-report':
        showToast('Monthly Attendance Report generated for October 2026', 'info');
        break;

      case 'salary-grade':
        showToast('Salary Grades: Executive Grade A to Support Grade E configured', 'info');
        break;

      case 'manage-salary':
        showToast('Salary Management: Base salary, HRA, DA, and shift allowances active', 'info');
        break;

      case 'disburse-salary-update':
        showToast('Disburse Salary: October payroll processed for 48 employees', 'success');
        break;

      case 'pay-slip':
        showToast('Pay Slips: Digital salary slips with PF and Tax breakdown ready for dispatch', 'info');
        break;

      default:
        showToast(`Human Resource: ${action}`, 'info');
        break;
    }
  });

  $(window).on('hashchange', function () {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    switchSection(hash);
  });

  // Mobile Drawer Toggle
  function openSidebar() {
    $('#app-sidebar').removeClass('-translate-x-full');
    $('#mobile-drawer-backdrop').removeClass('hidden');
    $('body').addClass('overflow-hidden lg:overflow-auto');
  }

  function closeSidebar() {
    $('#app-sidebar').addClass('-translate-x-full');
    $('#mobile-drawer-backdrop').addClass('hidden');
    $('body').removeClass('overflow-hidden lg:overflow-auto');
  }

  $('#btn-mobile-more').on('click', openSidebar);
  $('#mobile-drawer-backdrop').on('click', closeSidebar);

  // Desktop Sidebar Collapse Toggle (<)
  let sidebarCollapsed = false;
  $('#btn-sidebar-collapse').on('click', function (e) {
    e.preventDefault();
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
    return `${l1} to Today`;
  }

  function applyDateRangeToDashboard(fromStr, toStr) {
    if (!fromStr) return;
    const todayStr = getTodayDateStr();
    toStr = todayStr;
    let d1 = new Date(fromStr);
    let d2 = new Date(toStr);
    if (d1 > d2) { d1 = new Date(toStr); fromStr = toStr; }

    $('#input-global-date-from, #input-graph-date-from').val(fromStr);
    $('#input-global-date-to, #input-graph-date-to').val(toStr);

    const displayLabel = formatPeriodDateLabel(d1, d2);

    renderMoneyFlowChart();
    showToast(`Dashboard updated for ${displayLabel}.`, 'info');
  }

  $('#input-global-date-from, #input-graph-date-from').on('change', function () {
    const fromStr = $(this).val();
    if (fromStr) {
      applyDateRangeToDashboard(fromStr, getTodayDateStr());
    }
  });

  // Live 1st Calendar Symbol & Date Input Click -> Open date picker popup
  $(document).on('click', '.calendar-icon-trigger', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const $input = $(this).closest('.calendar-range-capsule').find('input[type="date"]:not(.hidden)');
    if ($input.length && $input[0]) {
      const inputEl = $input[0];
      if (typeof inputEl.showPicker === 'function') {
        try {
          inputEl.showPicker();
        } catch (err) {
          inputEl.focus();
        }
      } else {
        inputEl.focus();
      }
    }
  });

  $(document).on('click', '.date-picker-input', function (e) {
    if (typeof this.showPicker === 'function') {
      try {
        this.showPicker();
      } catch (err) {}
    }
  });

  // Quick action navigation
  $('.quick-nav-bill, #btn-add-new-widget').on('click', function () {
    window.location.hash = 'billing';
    switchSection('billing');
    switchBillingSubtab('create');
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
    const menu = Storage.get(STORAGE_KEYS.MENU);
    const orders = Storage.get(STORAGE_KEYS.ORDERS);
    const customers = Storage.get(STORAGE_KEYS.CUSTOMERS);

    const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
    $('#badge-menu-count').text(menu.length);
    $('#badge-pending-orders').text(pendingOrdersCount);
    $('#badge-customers-count').text(customers.length);
  }

  // =========================================================================
  // 4. DASHBOARD ENGINE (Matches FinSet Screenshot Exactly)
  // =========================================================================

  function renderDashboard() {
    const bills = Storage.get(STORAGE_KEYS.BILLS);
    const orders = Storage.get(STORAGE_KEYS.ORDERS);

    // Dynamic totals with fallback to screenshot numbers for maximum visual accuracy
    const totalSales = bills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    const todayBills = bills.filter(b => (b.date || '').startsWith('2026-10-27'));
    const todayRevenue = todayBills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);

    // Format top 3 cards (Total Billing, Merged Income/Expense & Profit, Total Employee)
    const totalBillingVal = bills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    const billParts = totalBillingVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.');
    $('#stat-total-billing, #stat-total-balance').html(`₹${billParts[0]}<span class="text-slate-400 font-semibold text-lg">.${billParts[1]}</span>`);

    // Merged Income & Expense with Calculated Profit
    const currentIncome = 85000;
    const currentExpense = 62220;
    const calculatedProfit = currentIncome - currentExpense; // ₹22,780.00
    const profitMargin = ((calculatedProfit / currentIncome) * 100).toFixed(1);

    const profitParts = calculatedProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.');
    $('#stat-calculated-profit').html(`₹${profitParts[0]}<span class="text-emerald-600/70 dark:text-emerald-400/70 font-semibold text-lg">.${profitParts[1]}</span>`);
    $('#stat-profit-margin').text(`+${profitMargin}% Profit`);

    const incomeParts = currentIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.');
    $('#stat-income-display, #stat-income').html(`₹${incomeParts[0]}<span class="text-slate-400 text-xs font-normal">.${incomeParts[1]}</span>`);

    const expenseParts = currentExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split('.');
    $('#stat-expense-display, #stat-expense').html(`₹${expenseParts[0]}<span class="text-slate-400 text-xs font-normal">.${expenseParts[1]}</span>`);

    // Total Employee
    const totalEmployees = 48;
    const onDutyEmployees = 42;
    const onLeaveEmployees = totalEmployees - onDutyEmployees;
    $('#stat-total-employee, #stat-total-savings').html(`${totalEmployees}<span class="text-slate-400 font-semibold text-lg ml-1.5">Staff</span>`);
    $('#stat-employee-onduty').text(`● ${onDutyEmployees} On Duty`);
    $('#stat-employee-leave').text(`${onLeaveEmployees} on leave today`);

    // Render Charts
    renderMoneyFlowChart();
    renderBudgetDoughnutChart();

    // Render Recent Transactions
    renderDashboardRecentTransactions(bills);

    // Update Badges
    renderSidebarBadges();
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
    const toDate = getTodayDateStr();
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
    $('#chart-march-tooltip span:last-child').text(formatMoney(maxInc));

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
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
            bodyColor: '#FCA311',
            bodyFont: { family: 'Plus Jakarta Sans', size: 12, weight: 600 },
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
              font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 },
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
              font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 },
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

  // Filter interaction for Money Flow range & account dropdowns
  $('#input-graph-date-from').on('change', function () {
    const fromStr = $(this).val();
    if (fromStr) {
      applyDateRangeToDashboard(fromStr, getTodayDateStr());
    }
  });

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

    // Update 4 Tier Sections on the left side of the Budget Card
    // 1. Best Selling
    $('#budget-val-best').text(formatMoney(tiers.best.budget));
    $('#budget-items-best').text(tiers.best.items.length + ' foods (' + tiers.best.totalQty + ' sold)');
    $('#budget-pct-best').text(tiers.best.pct + '%');

    // 2. Moderate Selling
    $('#budget-val-moderate').text(formatMoney(tiers.moderate.budget));
    $('#budget-items-moderate').text(tiers.moderate.items.length + ' foods (' + tiers.moderate.totalQty + ' sold)');
    $('#budget-pct-moderate').text(tiers.moderate.pct + '%');

    // 3. Less Selling
    $('#budget-val-less').text(formatMoney(tiers.less.budget));
    $('#budget-items-less').text(tiers.less.items.length + ' foods (' + tiers.less.totalQty + ' sold)');
    $('#budget-pct-less').text(tiers.less.pct + '%');

    // 4. Not Selling
    $('#budget-val-not').text(formatMoney(0));
    $('#budget-items-not').text(tiers.not.items.length + ' foods (0 sold)');
    $('#budget-pct-not').text('0%');

    // Center text: Total for month
    $('#budget-doughnut-total').text(formatMoney(totalBudget));

    // Top callout pill badge: Default to Best Selling tier
    $('#budget-badge-pct').text(tiers.best.pct + '%');
    $('#budget-badge-val').text(formatMoney(tiers.best.budget));

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
            titleFont: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
            bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
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

    // Update 4 Metric Summary Cards in Modal
    $('#modal-metric-best-pct').text(tiers.best.pct + '%');
    $('#modal-metric-best-budget').text(formatMoney(tiers.best.budget));
    $('#modal-metric-best-items').text(tiers.best.items.length + ' foods');
    $('#modal-metric-best-qty').text(tiers.best.totalQty + ' units sold');

    $('#modal-metric-mod-pct').text(tiers.moderate.pct + '%');
    $('#modal-metric-mod-budget').text(formatMoney(tiers.moderate.budget));
    $('#modal-metric-mod-items').text(tiers.moderate.items.length + ' foods');
    $('#modal-metric-mod-qty').text(tiers.moderate.totalQty + ' units sold');

    $('#modal-metric-less-pct').text(tiers.less.pct + '%');
    $('#modal-metric-less-budget').text(formatMoney(tiers.less.budget));
    $('#modal-metric-less-items').text(tiers.less.items.length + ' foods');
    $('#modal-metric-less-qty').text(tiers.less.totalQty + ' units sold');

    $('#modal-metric-not-budget').text(formatMoney(0));
    $('#modal-metric-not-items').text(tiers.not.items.length + ' foods');

    // Tab counts
    $('#modal-tab-count-all').text(allItems.length);
    $('#modal-tab-count-best').text(tiers.best.items.length);
    $('#modal-tab-count-mod').text(tiers.moderate.items.length);
    $('#modal-tab-count-less').text(tiers.less.items.length);
    $('#modal-tab-count-not').text(tiers.not.items.length);
    $('#modal-footer-total-budget').text(formatMoney(totalBudget));

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

    list.forEach(item => {
      let tierBadge = '';
      if (item.tier === 'best') {
        tierBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#14213D] text-amber-300 shadow-xs">🔥 Best Selling</span>';
      } else if (item.tier === 'moderate') {
        tierBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border border-amber-200/60">⚡ Moderate</span>';
      } else if (item.tier === 'less') {
        tierBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200/60">⚠️ Less Selling</span>';
      } else {
        tierBadge = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60">Not Selling</span>';
      }

      const rowHtml = `
        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3 px-4">
            <div class="font-bold text-slate-900 dark:text-slate-100">${escapeHtml(item.name)}</div>
            <div class="text-[10px] text-slate-400 truncate max-w-xs">${escapeHtml(item.description || '')}</div>
          </td>
          <td class="py-3 px-3 text-slate-600 dark:text-slate-300">${escapeHtml(item.category || '-')}</td>
          <td class="py-3 px-3 text-right font-semibold text-slate-700 dark:text-slate-200">${formatMoney(item.price)}</td>
          <td class="py-3 px-3 text-center">
            <span class="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${item.qty > 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100' : 'text-slate-400'}">
              ${item.qty}
            </span>
          </td>
          <td class="py-3 px-3 text-right font-bold ${item.rawRevenue > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}">
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
    renderModalBillingsList();
    $('#modal-total-billings').removeClass('hidden').css('display', 'flex');
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

  function renderModalBillingsList() {
    const bills = Storage.get(STORAGE_KEYS.BILLS, DEFAULT_BILLS) || [];
    const search = $.trim($('#modal-billings-search').val()).toLowerCase();
    const payFilter = $('#modal-billings-filter-payment').val() || 'all';
    const sort = $('#modal-billings-sort').val() || 'newest';

    // Calculate dynamic totals from bills
    const totalBillingVal = bills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    const totalTax = bills.reduce((sum, b) => sum + (Number(b.taxAmount) || 0), 0);
    const avgBill = bills.length ? (totalBillingVal / bills.length) : 0;

    $('#modal-billings-count-badge').text(`${bills.length} Invoices`);
    $('#modal-billings-stat-total').text(formatMoney(totalBillingVal));
    $('#modal-billings-stat-count').text(bills.length);
    $('#modal-billings-stat-avg').text(formatMoney(avgBill));
    $('#modal-billings-stat-tax').text(formatMoney(totalTax));

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
      filtered.forEach(b => {
        let payBadge = '';
        if (b.paymentMethod === 'UPI') {
          payBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/70"><span class="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span>UPI</span>';
        } else if (b.paymentMethod === 'Card') {
          payBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span>Card</span>';
        } else {
          payBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/70"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>Cash</span>';
        }

        const itemsList = (b.items || []).map(it => `${it.name} (x${it.qty})`).join(', ') || 'General Hotel Billing';
        const itemsCount = (b.items || []).reduce((sum, it) => sum + (Number(it.qty) || 1), 0);
        const itemsPreview = itemsList.length > 34 ? itemsList.substring(0, 31) + '...' : itemsList;

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
            <td class="py-3 px-3">
              <div class="font-bold text-slate-900 dark:text-white">${escapeHtml(b.customerName || 'Walk-in Guest')}</div>
              <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(b.customerPhone || 'Counter Settlement')}</div>
              ${b.customerEmail ? `<div class="text-[10px] text-amber-600 dark:text-amber-400 font-medium truncate max-w-[170px]">${escapeHtml(b.customerEmail)}</div>` : ''}
            </td>
            <td class="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              <span class="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/50 text-[10px]">
                ${escapeHtml(b.tableRoom || '-')}
              </span>
            </td>
            <td class="py-3 px-3 text-center whitespace-nowrap">${payBadge}</td>
            <td class="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium" title="${escapeHtml(itemsList)}">
              <div class="inline-flex items-center space-x-1.5 max-w-[210px]">
                <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">${itemsCount}</span>
                <span class="truncate text-xs">${escapeHtml(itemsPreview)}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-right font-extrabold text-slate-900 dark:text-white whitespace-nowrap text-sm">
              ${formatMoney(b.grandTotal)}
            </td>
            <td class="py-3 px-3 text-center whitespace-nowrap space-x-1">
              <button type="button" class="btn-view-bill px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#14213D] text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs" data-id="${b.id}" title="View tax invoice receipt">
                Receipt
              </button>
              <button type="button" class="btn-print-bill-row p-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer inline-flex items-center justify-center w-6 h-6" data-id="${b.id}" title="Print Receipt">
                🖨️
              </button>
            </td>
          </tr>
        `);
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
  $('#modal-billings-search').on('input keyup', renderModalBillingsList);
  $('#modal-billings-filter-payment, #modal-billings-sort').on('change', renderModalBillingsList);

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
    renderModalStaffList();
    $('#modal-total-staff').removeClass('hidden');
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

  function renderModalStaffList() {
    const staffList = Storage.get(STORAGE_KEYS.STAFF, DEFAULT_STAFF) || DEFAULT_STAFF;
    const search = $.trim($('#modal-staff-search').val()).toLowerCase();
    const deptFilter = $('#modal-staff-filter-dept').val() || 'all';

    const onDutyCount = staffList.filter(s => s.status === 'On Duty').length;
    const onLeaveCount = staffList.filter(s => s.status === 'On Leave').length;

    $('#modal-staff-count-badge').text(`${staffList.length} Total Staff`);
    $('#modal-staff-stat-total').text(`${staffList.length} Staff`);
    $('#modal-staff-stat-onduty').text(`${onDutyCount} Staff`);
    $('#modal-staff-stat-leave').text(`${onLeaveCount} Staff`);

    $('#modal-staff-badge-all').text(staffList.length);
    $('#modal-staff-badge-onduty').text(onDutyCount);
    $('#modal-staff-badge-leave').text(onLeaveCount);

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
        const initials = (s.name || 'Staff').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const isOnDuty = s.status === 'On Duty';

        const statusPill = isOnDuty
          ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF3] text-[#12B76A] dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
              <span class="w-1.5 h-1.5 rounded-full bg-[#12B76A] mr-1.5 animate-pulse"></span>
              On Duty
            </span>`
          : `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40" title="${escapeHtml(s.leaveReason || 'On Leave')}">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
              On Leave (${escapeHtml(s.leaveReason || 'Leave')})
            </span>`;

        const avatarDot = isOnDuty
          ? '<span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#12B76A] border-2 border-white dark:border-slate-800 rounded-full"></span>'
          : '<span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 border-2 border-white dark:border-slate-800 rounded-full"></span>';

        $tbody.append(`
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-2.5 px-3">
              <div class="flex items-center space-x-2.5">
                <div class="relative w-8 h-8 rounded-full bg-[#14213D] text-[#FCA311] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                  ${initials}
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

  // Trigger Total Staff Modal
  $('#btn-dashboard-total-staff').on('click', function (e) {
    e.preventDefault();
    openTotalStaffModal();
  });

  $(document).on('click', '.tab-staff-status', function () {
    currentStaffFilterStatus = $(this).data('status');
    updateStaffStatusTabButtons();
    renderModalStaffList();
  });

  $('#modal-staff-search').on('input keyup', renderModalStaffList);
  $('#modal-staff-filter-dept').on('change', renderModalStaffList);

  // Recent Transactions Table in Dashboard (Filtered by Payment Method, capped at last 5)
  function renderDashboardRecentTransactions(bills) {
    const $tbody = $('#dashboard-recent-trans-tbody');
    if (!$tbody.length) return;
    $tbody.empty();

    const selectedMethod = $('#select-trans-payment-method').val() || 'all';
    bills = bills || Storage.get(STORAGE_KEYS.BILLS, DEFAULT_BILLS);

    // 1. Hotel Operating Invoices (Revenue)
    const billTransactions = (bills || []).map(b => {
      const dt = new Date(b.date);
      const timestamp = !isNaN(dt.getTime()) ? dt.getTime() : 0;
      const dateStr = !isNaN(dt.getTime())
        ? dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        : b.date;

      let methodLabel = 'Cash Counter';
      let methodType = 'Cash';
      const rawMethod = (b.paymentMethod || '').trim().toLowerCase();
      if (rawMethod === 'card' || rawMethod.includes('card') || rawMethod.includes('visa') || rawMethod.includes('mastercard')) {
        methodLabel = 'VISA **4912';
        methodType = 'Card';
      } else if (rawMethod === 'upi' || rawMethod.includes('upi') || rawMethod.includes('qr')) {
        methodLabel = 'UPI / QR';
        methodType = 'UPI';
      } else if (rawMethod === 'cash') {
        methodLabel = 'Cash Counter';
        methodType = 'Cash';
      }

      const firstCat = (b.items && b.items[0] && b.items[0].category) || 'Cafe & Dining';

      return {
        timestamp: timestamp,
        date: dateStr,
        amount: Number(b.grandTotal) || 0,
        name: b.customerName || 'Front Desk Guest',
        icon: 'hotel',
        method: methodLabel,
        paymentMethodType: methodType,
        category: firstCat,
        isIncome: true
      };
    });

    // 2. Demo Operations & Expense Transactions
    const staticRows = [
      {
        timestamp: new Date('2026-10-27T09:00:00').getTime(),
        date: '27 Jul 9:00',
        amount: 80,
        name: 'Yaposhka',
        icon: 'yaposhka',
        method: 'Mastercard **2154',
        paymentMethodType: 'Card',
        category: 'Cafe & Restaurants',
        isIncome: false
      },
      {
        timestamp: new Date('2026-10-26T15:00:00').getTime(),
        date: '26 Jul 15:00',
        amount: 150,
        name: 'Reserved',
        icon: 'reserved',
        method: 'Mastercard **2154',
        paymentMethodType: 'Card',
        category: 'Shopping',
        isIncome: false
      },
      {
        timestamp: new Date('2026-10-25T12:30:00').getTime(),
        date: '25 Jul 12:30',
        amount: 10,
        name: 'YouTube',
        icon: 'youtube',
        method: 'VISA **3254',
        paymentMethodType: 'Card',
        category: 'Subscription',
        isIncome: false
      }
    ];

    // Combine all records
    let allTransactions = [...billTransactions, ...staticRows];

    // Filter by selected payment method
    if (selectedMethod !== 'all') {
      allTransactions = allTransactions.filter(t => t.paymentMethodType.toLowerCase() === selectedMethod.toLowerCase());
    }

    // Sort by timestamp descending (most recent first)
    allTransactions.sort((a, b) => b.timestamp - a.timestamp);

    // Strictly limit to the LAST 5 TRANSACTIONS
    const last5Transactions = allTransactions.slice(0, 5);

    if (last5Transactions.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="5" class="py-8 text-center text-slate-400 font-medium">
            No transactions found for the selected payment method (${escapeHtml(selectedMethod)}).
          </td>
        </tr>
      `);
      return;
    }

    last5Transactions.forEach(row => {
      let iconHtml = '';
      if (row.icon === 'youtube') {
        iconHtml = `<div class="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm"><svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></div>`;
      } else if (row.icon === 'reserved') {
        iconHtml = `<div class="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-[9px] font-black flex-shrink-0 shadow-sm">RSV</div>`;
      } else if (row.icon === 'yaposhka') {
        iconHtml = `<div class="w-7 h-7 rounded-lg bg-[#14213D] text-[#FCA311] flex items-center justify-center text-[12px] font-black flex-shrink-0 shadow-sm">🍜</div>`;
      } else {
        iconHtml = `<div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-xs">🏨</div>`;
      }

      const amountHtml = row.isIncome
        ? `<span class="font-bold text-emerald-600 dark:text-emerald-400">+ ${formatMoney(row.amount)}</span>`
        : `<span class="font-bold text-slate-900 dark:text-white">- ${formatMoney(Math.abs(row.amount))}</span>`;

      $tbody.append(`
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3 px-4 text-slate-500 font-medium">${escapeHtml(row.date)}</td>
          <td class="py-3 px-3">${amountHtml}</td>
          <td class="py-3 px-4">
            <div class="flex items-center space-x-2.5">
              ${iconHtml}
              <span class="font-semibold text-slate-900 dark:text-white">${escapeHtml(row.name)}</span>
            </div>
          </td>
          <td class="py-3 px-4 text-slate-500 font-mono text-[11px]">${escapeHtml(row.method)}</td>
          <td class="py-3 px-4">
            <span class="text-slate-600 dark:text-slate-300 font-medium">${escapeHtml(row.category)}</span>
          </td>
        </tr>
      `);
    });
  }

  // Filter Recent Transactions on Payment Method change
  $(document).on('change', '#select-trans-payment-method', function () {
    const bills = Storage.get(STORAGE_KEYS.BILLS, DEFAULT_BILLS);
    renderDashboardRecentTransactions(bills);
  });

  // =========================================================================
  // 5. BILLING & POS MANAGEMENT ENGINE
  // =========================================================================

  function initBillingSection() {
    initNewBillForm();
    renderBillingHistory();
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
            <td class="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300">${formatMoney(it.price)}</td>
            <td class="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white bill-item-subtotal">${formatMoney(it.subtotal)}</td>
            <td class="py-2.5 px-2 text-center">
              <button type="button" class="btn-remove-bill-item text-rose-500 hover:text-rose-700 font-bold text-base cursor-pointer" data-index="${idx}" title="Remove item">&times;</button>
            </td>
          </tr>
        `);
      });
    }
  }

  // Live quantity change without destroying input element while typing
  $(document).on('input', '.bill-item-qty-input', function () {
    const idx = parseInt($(this).data('index'), 10);
    const rawVal = $(this).val();
    if (rawVal === '') return;
    let newQty = parseInt(rawVal, 10);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    if (newQty > 99) newQty = 99;

    if (currentBillItems[idx]) {
      currentBillItems[idx].qty = newQty;
      currentBillItems[idx].subtotal = Math.round(newQty * Number(currentBillItems[idx].price || 0) * 100) / 100;
      $(this).closest('tr').find('.bill-item-subtotal').text(formatMoney(currentBillItems[idx].subtotal));
      calculateLiveBillTotals();
    }
  });

  $(document).on('change blur', '.bill-item-qty-input', function () {
    const idx = parseInt($(this).data('index'), 10);
    let newQty = parseInt($(this).val(), 10);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    if (newQty > 99) newQty = 99;
    $(this).val(newQty);

    if (currentBillItems[idx]) {
      currentBillItems[idx].qty = newQty;
      currentBillItems[idx].subtotal = Math.round(newQty * Number(currentBillItems[idx].price || 0) * 100) / 100;
      $(this).closest('tr').find('.bill-item-subtotal').text(formatMoney(currentBillItems[idx].subtotal));
      calculateLiveBillTotals();
    }
  });

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

  function clearBillForm() {
    currentBillItems = [];
    $('#form-create-bill')[0].reset();
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

  $('#btn-clear-bill-draft').on('click', clearBillForm);

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

    const bills = Storage.get(STORAGE_KEYS.BILLS);
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
      showToast(`Invoice ${billNumber} generated! Digital copy dispatched to ${customerEmail}.`, 'success');
    } else {
      showToast(`Invoice ${billNumber} completed for ${customerName}.`, 'success');
    }

    // Trigger Print or PDF
    if (andPrint) {
      printInvoiceReceipt(newBill);
    } else if (andPdf) {
      downloadInvoicePDF(newBill);
    } else {
      openInvoiceModal(newBill);
    }

    clearBillForm();
    renderBillingHistory();
    renderDashboard();
    renderSidebarBadges();

    return newBill;
  }

  // Download Button Handler (saves and downloads Pine Labs PDF receipt)
  $('#btn-download-bill').on('click', function (e) {
    e.preventDefault();
    processSaveBill(false, true);
  });

  // Print Button Handler (saves and triggers printer dialog)
  $('#btn-print-bill').on('click', function (e) {
    e.preventDefault();
    processSaveBill(true, false);
  });

  $('#form-create-bill').on('submit', function (e) {
    e.preventDefault();
    processSaveBill(false, true);
  });

  // Billing History Table
  function renderBillingHistory() {
    const bills = Storage.get(STORAGE_KEYS.BILLS);
    const search = $.trim($('#filter-history-search').val()).toLowerCase();
    const payFilter = $('#filter-history-payment').val();
    const fromDate = $('#filter-history-date-from').val();
    const toDate = fromDate ? getTodayDateStr() : '';
    $('#filter-history-date-to').val(toDate);

    let filtered = bills.filter(b => {
      const matchSearch = !search ||
        (b.billNumber && b.billNumber.toLowerCase().includes(search)) ||
        (b.customerName && b.customerName.toLowerCase().includes(search)) ||
        (b.customerPhone && b.customerPhone.includes(search));

      const matchPay = !payFilter || (b.paymentMethod === payFilter);

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
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-3 px-4 font-mono font-bold text-[#14213D]">${escapeHtml(b.billNumber)}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-slate-900 dark:text-white">${escapeHtml(b.customerName)}</div>
              <div class="text-[11px] text-slate-400 font-mono">${escapeHtml(b.customerPhone || '-')}</div>
              ${b.customerEmail ? `<div class="text-[10px] text-amber-600 font-medium truncate max-w-[150px]">${escapeHtml(b.customerEmail)}</div>` : ''}
            </td>
            <td class="py-3 px-4 text-slate-500 font-medium">${formatDateTime(b.date)}</td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">${escapeHtml(b.paymentMethod)}</td>
            <td class="py-3 px-4 text-right font-black text-slate-900 dark:text-white">${formatMoney(b.grandTotal)}</td>
            <td class="py-3 px-4 text-center">${getStatusBadge(b.status)}</td>
            <td class="py-3 px-4 text-right whitespace-nowrap space-x-2">
              <button type="button" class="btn-view-bill btn-finset-secondary text-xs py-1 px-3" data-id="${b.id}">View</button>
              <button type="button" class="btn-print-bill-row btn-finset-secondary text-xs py-1 px-2.5" data-id="${b.id}" title="Print">🖨️</button>
              <button type="button" class="btn-delete-bill btn-finset-danger text-xs py-1 px-2.5" data-id="${b.id}" title="Delete">🗑️</button>
            </td>
          </tr>
        `);
      });
    }
  }

  $('#filter-history-search, #filter-history-payment, #filter-history-date-from').on('input change', renderBillingHistory);

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
            <p><strong>Mode:</strong> ${escapeHtml(bill.paymentMethod)}</p>
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
            <td><strong>Mode:</strong> ${escapeHtml(bill.paymentMethod)}</td>
            <td style="text-align: right;"><strong>Status:</strong> ${escapeHtml(bill.status || 'Paid')}</td>
          </tr>
        </table>

        <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr style="border-top: 1px solid #222; border-bottom: 1px solid #222; text-align: left; font-size: 11px;">
              <th style="padding: 6px 0;">Item</th>
              <th style="padding: 6px 0; text-align: center;">Qty</th>
              <th style="padding: 6px 0; text-align: right;">Price</th>
              <th style="padding: 6px 0; text-align: right;">Subtotal</th>
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
      doc.setFontSize(7);
      doc.text('MERCHANT', 6, y); y += 3.5;
      doc.setFont('courier', 'bold');
      doc.text('AURELIA', 6, y); y += 5;

      doc.setFont('courier', 'normal');
      doc.text('ADDRESS', 6, y); y += 3.5;
      doc.setFont('courier', 'bold');
      doc.text('KOLKATA, WEST BENGAL', 6, y); y += 5;

      doc.setFont('courier', 'normal');
      doc.text('MERCHANT ID', 6, y); y += 3.5;
      doc.setFont('courier', 'bold');
      doc.text('PL123456789', 6, y); y += 5;

      doc.setFont('courier', 'normal');
      doc.text('TERMINAL ID', 6, y); y += 3.5;
      doc.setFont('courier', 'bold');
      doc.text('TID123456', 6, y); y += 5;

      // Divider
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.text('============================================================', 40, y, { align: 'center' });
      y += 5;

      // SALE
      doc.setFontSize(9);
      doc.setFont('courier', 'bold');
      doc.text('SALE', 40, y, { align: 'center' });
      y += 5;

      const d = new Date(bill.date || Date.now());
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const dateFormatted = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const timeFormatted = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

      doc.setFontSize(7.5);
      doc.setFont('courier', 'normal');
      doc.text('DATE', 6, y); doc.setFont('courier', 'bold'); doc.text(dateFormatted, 74, y, { align: 'right' }); y += 4;
      doc.setFont('courier', 'normal'); doc.text('TIME', 6, y); doc.setFont('courier', 'bold'); doc.text(timeFormatted, 74, y, { align: 'right' }); y += 4;
      doc.setFont('courier', 'normal'); doc.text('INVOICE NO.', 6, y); doc.setFont('courier', 'bold'); doc.text(bill.billNumber || 'PL-2026-001', 74, y, { align: 'right' }); y += 4;
      doc.setFont('courier', 'normal'); doc.text('PAYMENT MODE', 6, y); doc.setFont('courier', 'bold'); doc.text((bill.paymentMethod || 'UPI').toUpperCase(), 74, y, { align: 'right' }); y += 4;
      doc.setFont('courier', 'normal'); doc.text('STATUS', 6, y); doc.setFont('courier', 'bold'); doc.text('SUCCESS', 74, y, { align: 'right' }); y += 5;

      // Divider
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.text('============================================================', 40, y, { align: 'center' });
      y += 5;

      // PRODUCT / BILL DETAILS
      doc.setFontSize(8.5);
      doc.setFont('courier', 'bold');
      doc.text('PRODUCT / BILL DETAILS', 40, y, { align: 'center' });
      y += 5;

      doc.setFontSize(7.5);
      items.forEach((it, idx) => {
        doc.setFont('courier', 'normal'); doc.text('Product / Service', 6, y); doc.text(it.name || 'Aurelia Item', 74, y, { align: 'right' }); y += 3.8;
        doc.text('Product Category', 6, y); doc.text(it.category || 'Dining', 74, y, { align: 'right' }); y += 3.8;
        doc.text('Product Code', 6, y); doc.text(it.code || it.id || ('AUR-' + String(idx + 1).padStart(3, '0')), 74, y, { align: 'right' }); y += 3.8;
        doc.text('Serial No.', 6, y); doc.text('SN-2026-' + String(idx + 1).padStart(3, '0'), 74, y, { align: 'right' }); y += 3.8;
        doc.text('Quantity', 6, y); doc.text(String(it.qty || 1), 74, y, { align: 'right' }); y += 5;
      });

      // Divider
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.text('============================================================', 40, y, { align: 'center' });
      y += 5;

      // AMOUNT BREAKUP
      doc.setFontSize(8.5);
      doc.setFont('courier', 'bold');
      doc.text('AMOUNT BREAKUP', 40, y, { align: 'center' });
      y += 5;

      const fmt = (num) => 'Rs ' + (Number(num) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      doc.setFontSize(7.5);
      doc.setFont('courier', 'normal');
      doc.text('Subtotal', 6, y); doc.text(fmt(bill.subtotal || bill.grandTotal), 74, y, { align: 'right' }); y += 4;
      doc.text('Discount', 6, y); doc.text(fmt(bill.discountAmount || 0), 74, y, { align: 'right' }); y += 4;
      doc.text('Tax / GST', 6, y); doc.text(fmt(bill.taxAmount || 0), 74, y, { align: 'right' }); y += 5;

      // Divider
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.text('============================================================', 40, y, { align: 'center' });
      y += 5;

      // TOTAL AMOUNT
      doc.setFontSize(8);
      doc.setFont('courier', 'bold');
      doc.text('TOTAL AMOUNT', 6, y);
      doc.text(fmt(bill.grandTotal), 74, y, { align: 'right' });
      y += 5;

      // Dashed divider
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.text('------------------------------------------------------------', 40, y, { align: 'center' });
      y += 5;

      // Footer
      doc.setFontSize(7);
      doc.text('Thank you for your purchase!', 40, y, { align: 'center' }); y += 3.5;
      doc.text('Please keep this receipt for your records.', 40, y, { align: 'center' }); y += 5;
      doc.setFontSize(6.5);
      doc.text('This is a sample receipt format.', 40, y, { align: 'center' });

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

  function renderMenuSection() {
    renderMenuCategoryPills();
    renderMenuItemsGrid();
  }

  function renderMenuCategoryPills() {
    const categories = Storage.get(STORAGE_KEYS.CATEGORIES);
    const $wrap = $('#menu-category-filter-pills');
    $wrap.empty();

    $wrap.append(`
      <button type="button" class="btn-menu-cat-pill px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeMenuCategory === 'all' ? 'bg-[#14213D] text-white shadow-sm' : 'btn-finset-secondary'}" data-cat="all">
        All Items
      </button>
    `);

    categories.forEach(cat => {
      const isActive = activeMenuCategory === cat;
      $wrap.append(`
        <button type="button" class="btn-menu-cat-pill px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${isActive ? 'bg-[#14213D] text-white shadow-sm' : 'btn-finset-secondary'}" data-cat="${escapeHtml(cat)}">
          ${escapeHtml(cat)}
        </button>
      `);
    });
  }

  $(document).on('click', '.btn-menu-cat-pill', function () {
    activeMenuCategory = $(this).data('cat');
    renderMenuCategoryPills();
    renderMenuItemsGrid();
  });

  function renderMenuItemsGrid() {
    const menu = Storage.get(STORAGE_KEYS.MENU);
    const $tbody = $('#menu-items-tbody');
    $tbody.empty();

    let filtered = menu;
    if (activeMenuCategory !== 'all') {
      filtered = menu.filter(m => m.category === activeMenuCategory);
    }

    if (filtered.length === 0) {
      $tbody.append(`
        <tr>
          <td colspan="6" class="py-8 text-center text-slate-400">No items found in this category. Click "+ Add Item" to add delicious dishes.</td>
        </tr>
      `);
      return;
    }

    filtered.forEach(item => {
      const isAvail = !!item.available;
      $tbody.append(`
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${!isAvail ? 'opacity-65' : ''}">
          <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">
            ${escapeHtml(item.name)}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E5E5E5]/60 dark:bg-slate-700 text-[#14213D] dark:text-slate-200 uppercase tracking-wider">
              ${escapeHtml(item.category)}
            </span>
          </td>
          <td class="py-3 px-4 text-slate-500 max-w-sm truncate" title="${escapeHtml(item.description || '')}">
            ${escapeHtml(item.description || 'Prepared fresh upon order.')}
          </td>
          <td class="py-3 px-4 text-right font-black text-[#14213D] dark:text-white whitespace-nowrap">
            ${formatMoney(item.price)}
          </td>
          <td class="py-3 px-4 text-center whitespace-nowrap">
            ${isAvail ? `
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF3] text-[#12B76A]">
                Available
              </span>
            ` : `
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400">
                Unavailable
              </span>
            `}
          </td>
          <td class="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
            <button type="button" class="btn-edit-menu-item btn-finset-secondary text-xs py-1 px-3" data-id="${item.id}" title="Edit item">
              Edit
            </button>
            <button type="button" class="btn-delete-menu-item btn-finset-danger text-xs py-1 px-2.5" data-id="${item.id}" title="Delete item">
              ✕
            </button>
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
    const orders = Storage.get(STORAGE_KEYS.ORDERS);
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

      const itemsSummary = (ord.items || []).map(it => `
        <span class="inline-block mr-2.5 text-xs py-0.5">
          <strong class="font-bold text-[#14213D] dark:text-white">${it.qty}×</strong> <span class="text-slate-700 dark:text-slate-300">${escapeHtml(it.name)}</span>
        </span>
      `).join('');

      $tbody.append(`
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
            ${escapeHtml(ord.orderNumber)}
          </td>
          <td class="py-3 px-4 text-slate-500 whitespace-nowrap text-xs">
            ${formatDateTime(ord.timestamp)}
          </td>
          <td class="py-3 px-4 whitespace-nowrap">
            <div class="font-bold text-slate-900 dark:text-white">${escapeHtml(ord.customerName)}</div>
            <div class="text-[11px] text-slate-400 font-medium">${escapeHtml(ord.tableRoom)}</div>
          </td>
          <td class="py-3 px-4 max-w-sm">
            <div class="flex flex-wrap items-center">
              ${itemsSummary}
            </div>
          </td>
          <td class="py-3 px-4 text-right font-black text-[#14213D] dark:text-white whitespace-nowrap">
            ${formatMoney(estTotal)}
          </td>
          <td class="py-3 px-4 text-center whitespace-nowrap">
            <select class="order-status-inline-change finset-input py-1 px-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white cursor-pointer" data-id="${ord.id}">
              <option value="Pending" ${ord.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Preparing" ${ord.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
              <option value="Served" ${ord.status === 'Served' ? 'selected' : ''}>Served</option>
              <option value="Completed" ${ord.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${ord.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td class="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
            <button type="button" class="btn-view-order-details btn-finset-secondary text-xs py-1 px-3" data-id="${ord.id}">
              Details
            </button>
            ${!isBilled && ord.status !== 'Cancelled' ? `
              <button type="button" class="btn-order-to-bill btn-finset-primary text-xs py-1 px-3" data-id="${ord.id}">
                Bill &rarr;
              </button>
            ` : `
              <span class="text-[11px] text-slate-400 font-mono font-bold px-2">${escapeHtml(ord.billNumber || 'Settled')}</span>
            `}
          </td>
        </tr>
      `);
    });
  }

  // Inline Status Change
  $(document).on('change', '.order-status-inline-change', function () {
    const id = $(this).data('id');
    const newStatus = $(this).val();
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
    const orders = Storage.get(STORAGE_KEYS.ORDERS);
    const ord = orders.find(o => o.id === id);
    if (!ord) return;

    window.location.hash = 'billing';
    switchSection('billing');
    switchBillingSubtab('create');

    clearBillForm();

    // Prefill Walkin guest
    $('input[name="customer-type"][value="walkin"]').prop('checked', true);
    $('#wrapper-existing-customer').addClass('hidden');
    $('#wrapper-walkin-customer').removeClass('hidden');

    $('#input-walkin-name').val(ord.customerName);
    $('#input-walkin-phone').val(ord.customerPhone || '');
    $('#input-bill-tableref').val(ord.tableRoom);

    $('#linked-order-banner').removeClass('hidden');
    $('#linked-order-id-label').text(ord.orderNumber);
    $('#input-linked-order-id').val(ord.id);

    // Populate Items
    currentBillItems = (ord.items || []).map(it => ({
      id: it.id || ('item-' + Date.now()),
      name: it.name,
      category: 'Dining',
      price: Number(it.price) || 0,
      qty: Number(it.qty) || 1,
      subtotal: (Number(it.price) || 0) * (Number(it.qty) || 1)
    }));

    renderBillDraftItems();
    calculateLiveBillTotals();

    showToast(`Order ${ord.orderNumber} loaded into billing draft.`, 'success');
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
          <td class="py-1 px-3 text-right text-slate-500">${formatMoney(it.price)}</td>
          <td class="py-1 px-3 text-right font-bold text-slate-900 dark:text-white">${formatMoney(line)}</td>
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
          <td class="py-2 px-3 text-right text-slate-500">${formatMoney(it.price)}</td>
          <td class="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">${formatMoney(it.price * it.qty)}</td>
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
    $(`.btn-order-to-bill[data-id="${id}"]`).trigger('click');
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
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">${escapeHtml(c.name)}</td>
            <td class="py-3 px-4 font-mono text-slate-500">${escapeHtml(c.phone)}</td>
            <td class="py-3 px-4 text-slate-500">${escapeHtml(c.email || '-')}</td>
            <td class="py-3 px-4 text-slate-500 max-w-xs truncate">${escapeHtml(c.address || '-')}</td>
            <td class="py-3 px-4 text-center font-bold text-slate-800 dark:text-white">${c.visits || 0}</td>
            <td class="py-3 px-4 text-right font-black text-[#14213D]">${formatMoney(c.totalSpend || 0)}</td>
            <td class="py-3 px-4 text-right whitespace-nowrap space-x-2">
              <button type="button" class="btn-view-customer-profile btn-finset-secondary text-xs py-1 px-3" data-id="${c.id}">Profile</button>
              <button type="button" class="btn-edit-customer btn-finset-secondary text-xs py-1 px-3" data-id="${c.id}" title="Edit customer details">Edit</button>
              <button type="button" class="btn-delete-customer btn-finset-danger text-xs py-1 px-2.5" data-id="${c.id}" title="Delete customer">✕</button>
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

  // Edit Customer Modal Trigger
  $(document).on('click', '.btn-edit-customer', function () {
    const id = $(this).data('id');
    const customers = Storage.get(STORAGE_KEYS.CUSTOMERS);
    const c = customers.find(x => x.id === id);
    if (!c) return;

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
  });

  // Edit from Profile Modal
  $('#btn-edit-from-profile').on('click', function () {
    if (!currentViewingCustomerId) return;
    const customers = Storage.get(STORAGE_KEYS.CUSTOMERS);
    const c = customers.find(x => x.id === currentViewingCustomerId);
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
            <td class="py-2 px-3 text-slate-600 dark:text-slate-300 font-medium">${escapeHtml(b.paymentMethod)}</td>
            <td class="py-2 px-3 text-right font-black text-slate-900 dark:text-white">${formatMoney(b.grandTotal)}</td>
            <td class="py-2 px-3 text-right">
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

    $('#report-tax-collected').text(formatMoney(totalTax));
    $('#report-discounts-given').text(formatMoney(totalDiscounts));
    $('#report-avg-bill').text(formatMoney(avgBill));
    $('#report-net-revenue').text(formatMoney(netRevenue));

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
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-2.5 px-4 text-center text-slate-400 font-bold">${idx + 1}</td>
            <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">${escapeHtml(it.name)}</td>
            <td class="py-2.5 px-4 text-slate-500 font-medium">${escapeHtml(it.category)}</td>
            <td class="py-2.5 px-4 text-right font-semibold text-slate-700 dark:text-slate-300">${it.qty}</td>
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
      } catch (e) {}
    }
    if (!user) {
      user = {
        id: 'usr-adaline',
        name: 'Adaline Lively',
        email: 'adalinea@gmail.com',
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

    const initials = (nameStr || 'Adaline Lively')
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AL';

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

    const initials = (user.name || 'Adaline Lively')
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AL';

    if (user.avatar) {
      $avatarImg.attr('src', user.avatar).removeClass('hidden');
      $avatarText.addClass('hidden');
    } else {
      $avatarImg.attr('src', '').addClass('hidden');
      $avatarText.text(initials).removeClass('hidden');
    }

    // Update greeting
    const firstName = (user.name || 'Adaline').split(' ')[0];
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    $('#topbar-welcome-title').text(`${timeGreeting}, ${firstName}!`);
  }

  function openUserProfileModal() {
    const user = getActiveUserData();

    $('#input-profile-name').val(user.name || 'Adaline Lively');
    $('#input-profile-email').val(user.email || 'adalinea@gmail.com');
    $('#input-profile-phone').val(user.phone || '+91 98450 11201');
    $('#input-profile-empid').val(user.empId || 'EMP-2026-01');

    if (user.role) {
      $('#select-profile-role').val(user.role);
    }
    if (user.department) {
      $('#select-profile-dept').val(user.department);
    }

    currentPendingAvatar = user.avatar || null;
    $('#input-profile-avatar-file').val('');
    updateModalAvatarPreview(currentPendingAvatar, user.name);

    $('#modal-user-profile').removeClass('hidden');
  }

  // Open modal when topbar avatar button is clicked
  $('#topbar-user-avatar, #user-profile-capsule').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    openUserProfileModal();
  });

  // Trigger file selection
  $('#btn-upload-photo, #btn-trigger-avatar-file').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#input-profile-avatar-file').trigger('click');
  });

  // Handle image file selection
  $('#input-profile-avatar-file').on('change', function (e) {
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
  $('#btn-remove-photo').on('click', function (e) {
    e.preventDefault();
    currentPendingAvatar = null;
    $('#input-profile-avatar-file').val('');
    updateModalAvatarPreview(null, $('#input-profile-name').val());
    showToast('Profile photo removed. User initials will be displayed.', 'info');
  });

  // Update initials live if name changes without custom photo
  $('#input-profile-name').on('input', function () {
    if (!currentPendingAvatar) {
      updateModalAvatarPreview(null, $(this).val());
    }
  });

  // Quick Sign Out directly from profile popup
  $('#btn-profile-signout').on('click', function (e) {
    e.preventDefault();
    $('#modal-user-profile').addClass('hidden');
    if (window.Auth && typeof window.Auth.showLogoutConfirmation === 'function') {
      window.Auth.showLogoutConfirmation();
    }
  });

  // Save Profile Form
  $('#form-user-profile').on('submit', function (e) {
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
    } catch (e) {}

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

    // 5. Update topbar avatar display immediately
    updateTopbarAvatarUI(updatedUser);

    // 6. Close modal & show toast
    $('#modal-user-profile').addClass('hidden');
    showToast('Profile and photo updated successfully!', 'success');
  });

  // Initial Boot - guarded by authentication
  const initHash = window.location.hash.replace('#', '') || 'dashboard';
  if (!window.Auth || window.Auth.isAuthenticated()) {
    switchSection(initHash);
    renderDashboard();
    renderSidebarBadges();
    updateTopbarAvatarUI();
  }
});
