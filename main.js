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
    makeOrder('ORD-0081', 'Rajesh Sharma', '9845012345', 'Table 4', 'Pending', '2026-10-27T09:45:00', 'Less oil in Dal Makhani, extra butter on naan', [
      { id: 'item-2', name: 'Dal Makhani', price: 12.00, qty: 1 },
      { id: 'item-1', name: 'Paneer Butter Masala', price: 16.50, qty: 1 },
      { id: 'item-12', name: 'Butter Naan', price: 3.50, qty: 4 }
    ]),
    makeOrder('ORD-0082', 'Vikramaditya Reddy', '9741234567', 'Room 304', 'Preparing', '2026-10-27T10:05:00', 'Serve warm with lime wedges and onion rings', [
      { id: 'item-16', name: 'Hyderabadi Chicken Dum Biryani', price: 19.00, qty: 2 },
      { id: 'item-26', name: 'Mango Lassi', price: 6.00, qty: 2 }
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
          html += `<span class="num-scroller-static">${prefix}</span>`;
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
          html += `<span class="num-scroller-static ${suffixClass}">${suffix}</span>`;
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
    if (window.Auth && typeof window.Auth.isAuthenticated === 'function' && !window.Auth.isAuthenticated()) {
      window.Auth.showView('login');
      return;
    }

    if (!titles[target]) target = 'dashboard';

    // Update nav links active styling
    $('.Aurelia-nav-item, .aurelia-nav-item, .finset-nav-item, .nav-link').each(function () {
      $(this).toggleClass('active', $(this).data('target') === target);
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

    const sectionRenderers = {
      dashboard: renderDashboard,
      billing: initBillingSection,
      menu: renderMenuSection,
      orders: renderOrdersSection,
      customers: renderCustomersSection,
      analytics: renderAnalyticsSection
    };
    if (sectionRenderers[target]) sectionRenderers[target]();

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

    $('.hr-sub-item').removeClass('text-sky-400 font-bold active').addClass('text-slate-300');
    $('.hr-sub-item span.rounded-full').removeClass('border-sky-400 bg-sky-400').addClass('border-slate-400');
    $(this).addClass('text-sky-400 font-bold active').removeClass('text-slate-300');
    $(this).find('span.rounded-full').addClass('border-sky-400 bg-sky-400').removeClass('border-slate-400');

    if (action === 'employee-list' || action === 'add-employee') {
      typeof openStaffDirectoryModal === 'function' ? openStaffDirectoryModal() : $('#modal-total-staff').removeClass('hidden');
    }

    const hrToastMap = {
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

    filtered.forEach(dept => {
      html += `
        <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 hover:border-[#FCA311] transition-all shadow-xs flex flex-col justify-between space-y-3 group">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#14213D] text-[#FCA311]">${dept.code}</span>
              <span class="inline-flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                Active
              </span>
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
    });

    $grid.html(html);
  }

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
      $chevron.removeClass('rotate-180');
      $(this).removeClass('active');
    } else {
      $submenu.removeClass('hidden');
      $chevron.addClass('rotate-180');
      $(this).addClass('active');
    }
  });

  // Department Sub-items Click Handlers
  $('.dept-sub-item').on('click', function (e) {
    e.preventDefault();
    const action = $(this).data('action');

    $('.dept-sub-item').removeClass('text-sky-400 font-bold active').addClass('text-slate-300');
    $('.dept-sub-item span.rounded-full').removeClass('border-sky-400 bg-sky-400').addClass('border-slate-400');
    $(this).addClass('text-sky-400 font-bold active').removeClass('text-slate-300');
    $(this).find('span.rounded-full').addClass('border-sky-400 bg-sky-400').removeClass('border-slate-400');

    if (action === 'all-department') {
      renderDepartmentsGrid();
      $('#modal-all-departments').removeClass('hidden');
      showToast('Viewing All Hotel Departments', 'info');
    } else if (action === 'add-department') {
      $('#modal-add-department').removeClass('hidden');
      $('#input-dept-name').focus();
    }
  });

  // Open Add Department from inside All Department modal
  $('#btn-open-add-dept-from-list').on('click', function () {
    $('#modal-all-departments').addClass('hidden');
    $('#modal-add-department').removeClass('hidden');
    $('#input-dept-name').focus();
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

    // Reset Form & Close Modal
    this.reset();
    $('#modal-add-department').addClass('hidden');

    // Re-render and open All Departments view
    renderDepartmentsGrid();
    $('#modal-all-departments').removeClass('hidden');
    showToast(`Department "${name}" successfully created!`, 'success');
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
    renderDashboard();
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
      } catch (err) { }
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
    const menu = Storage.get(STORAGE_KEYS.MENU) || [];
    const orders = Storage.get(STORAGE_KEYS.ORDERS) || [];
    const customers = Storage.get(STORAGE_KEYS.CUSTOMERS) || [];

    const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
    animateNumber('#badge-menu-count', menu.length, { duration: 600, useLocale: false });
    animateNumber('#badge-pending-orders', pendingOrdersCount, { duration: 600, useLocale: false });
    animateNumber('#badge-customers-count', customers.length, { duration: 600, useLocale: false });
  }

  // =========================================================================
  // 4. DASHBOARD ENGINE (Matches FinSet Screenshot Exactly)
  // =========================================================================

  function animateBillingMetrics(bills = Storage.get(STORAGE_KEYS.BILLS) || []) {
    const totalBillingVal = bills.reduce((sum, b) => sum + (Number(b.grandTotal) || 0), 0);
    animateNumber('#stat-total-billing, #stat-total-balance', totalBillingVal, {
      duration: 1200,
      decimals: 2,
      prefix: '₹',
      decimalClass: 'text-slate-400 font-semibold text-lg'
    });
    animateNumber('#stat-billing-growth', 12.1, { duration: 900, decimals: 1, prefix: '↑ ', suffix: '%', useLocale: false });
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
      decimalClass: 'text-emerald-600/70 dark:text-emerald-400/70 font-semibold text-lg'
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
      decimalClass: 'text-slate-400 text-xs font-normal'
    });
    animateNumber('#stat-income-growth', 6.3, { duration: 900, decimals: 1, prefix: '↑ ', suffix: '%', useLocale: false });
    animateNumber('#stat-expense-display, #stat-expense', currentExpense, {
      duration: 1100,
      decimals: 2,
      prefix: '₹',
      decimalClass: 'text-slate-400 text-xs font-normal'
    });
    animateNumber('#stat-expense-growth', 2.4, { duration: 900, decimals: 1, prefix: '↑ ', suffix: '%', useLocale: false });
  }

  function animateStaffMetrics() {
    const totalEmployees = 48;
    const onDutyEmployees = 42;
    const onLeaveEmployees = totalEmployees - onDutyEmployees;
    animateNumber('#stat-total-employee, #stat-total-savings', totalEmployees, {
      duration: 900,
      decimals: 0,
      suffix: 'Staff',
      suffixClass: 'text-slate-400 font-semibold text-lg ml-1.5'
    });
    animateNumber('#stat-employee-onduty', onDutyEmployees, { duration: 900, decimals: 0, prefix: '● ', suffix: ' On Duty' });
    animateNumber('#stat-employee-leave', onLeaveEmployees, { duration: 900, decimals: 0, suffix: ' on leave today' });
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

    // Update Badges
    renderSidebarBadges();

    // Initialize/refresh scroll-driven observer for dashboard cards
    initDashboardScrollAnimations();
  }

  // =========================================================================
  // SAVING GOALS ENGINE (Bottom Right Card in Dashboard)
  // =========================================================================

  function renderSavingGoals() {
    const goals = [
      { id: 'macbook', val: 1650, pct: 25, width: 25 },
      { id: 'car', val: 60000, pct: 42, width: 42 },
      { id: 'house', val: 150000, pct: 3, width: 14 }
    ];

    goals.forEach((g, idx) => {
      // 1. Animate target amount in top-to-bottom order
      animateNumber(`#goal-val-${g.id}`, g.val, {
        duration: 900,
        delay: 400 + (idx * 80),
        prefix: '₹'
      });

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
          payBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/70"><span class="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1"></span>UPI</span>';
        } else if (b.paymentMethod === 'Card') {
          payBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span>Card</span>';
        } else {
          payBadge = '<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/70"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>Cash</span>';
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
              <span id="${rowAmtId}">${formatMoney(b.grandTotal)}</span>
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
    renderModalStaffList(true);
  });

  $('#modal-staff-search').on('input keyup', function () { renderModalStaffList(false); });
  $('#modal-staff-filter-dept').on('change', function () { renderModalStaffList(true); });

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

    last5Transactions.forEach((row, index) => {
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

      const amtId = `recent-trans-amt-${index}`;
      const amountColor = row.isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white';
      const amountSign = row.isIncome ? '+ ₹' : '- ₹';

      $tbody.append(`
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3 px-4 text-slate-500 font-medium">${escapeHtml(row.date)}</td>
          <td class="py-3 px-3">
            <span id="${amtId}" class="font-bold ${amountColor}">${amountSign}0</span>
          </td>
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

      // Animate table transaction amounts in top-to-bottom sequence
      animateNumber(`#${amtId}`, Math.abs(row.amount), {
        duration: 900,
        delay: 450 + (index * 60),
        prefix: amountSign,
        decimals: 0
      });
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
      } catch (e) { }
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

      // 5. Update topbar avatar display immediately
      updateTopbarAvatarUI(updatedUser);

      // 6. Close modal & show SweetAlert Saved!
      $('#modal-user-profile').addClass('hidden');
      if (typeof Swal !== 'undefined') {
        Swal.fire("Saved!", "", "success");
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
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } else {
      applyProfileChanges();
    }
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
