/**
 * CashShilpo Bangla Language Module
 * Features:
 * 1. Auto-injects Language Toggle in Settings page.
 * 2. High-quality 'Hind Siliguri' font integration.
 * 3. Smart DOM observation for real-time translation.
 */

(function () {
  console.log("CashShilpo Bangla: Module Loaded");

  // 1. CONFIG & STATE
  const PREF_KEY = "cashshilpo_lang_pref";
  let currentLang = localStorage.getItem(PREF_KEY) || "en"; // Default to English

  // 2. FONT & STYLES INJECTION
  // Import Hind Siliguri font
  const fontLink = document.createElement("link");
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  // Inject CSS for the toggle and font application
  const style = document.createElement("style");
  style.innerHTML = `
        /* Apply Bangla Font when class is active */
        body.lang-bn, body.lang-bn input, body.lang-bn button, body.lang-bn select, body.lang-bn textarea {
            font-family: 'Hind Siliguri', sans-serif !important;
        }
        
        /* Toggle Switch Container */
        #lang-toggle-card {
            background-color: var(--bg-secondary, #121212);
            border: 1px solid var(--border-color, #2a2a2a);
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            animation: fadeIn 0.3s ease-in-out;
        }

        /* The Switch */
        .lang-switch {
            position: relative;
            display: inline-block;
            width: 52px;
            height: 28px;
        }
        .lang-switch input { 
            opacity: 0; 
            width: 0; 
            height: 0; 
        }
        .lang-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #374151; /* Gray-700 */
            transition: .4s;
            border-radius: 34px;
            border: 1px solid #4b5563;
        }
        .lang-slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .lang-slider {
            background-color: var(--accent, #007bff);
            border-color: var(--accent, #007bff);
        }
        input:checked + .lang-slider:before {
            transform: translateX(24px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
  document.head.appendChild(style);

  // 3. DICTIONARY
  const dictionary = {
    // Navigation & Sidebar
    Dashboard: "ড্যাশবোর্ড",
    "POS Terminal": "POS টার্মিনাল",
    "Barcode Generator": "বারকোড জেনারেটর",
    Invoices: "ইনভয়েস",
    Quotations: "কোটেশন",
    "EMI Sales": "কিস্তি বিক্রয়",
    "Warranty & Claims": "ওয়ারেন্টি ও দাবি",
    "Purchase Orders": "ক্রয় অর্ডার",
    Inventory: "ইনভেন্টরি",
    Attribute: "অ্যাট্রিবিউট",
    Reports: "রিপোর্ট",
    Customers: "কাস্টমার",
    Suppliers: "সাপ্লায়ার",
    Expenses: "খরচ / ব্যয়",
    Payroll: "বেতন ব্যবস্থাপনা",
    "Loyalty Program": "লয়ালটি প্রোগ্রাম",
    Staff: "স্টাফ",
    "User Roles": "ইউজার রোল",
    Settings: "সেটিংস",
    Subscription: "সাবস্ক্রিপশন",
    "Sign Out": "লগ আউট",
    "Not Logged In": "লগইন করা নেই",
    "No Role": "রোল নেই",

    // Header & Global
    "Search...": "অনুসন্ধান...",
    Daybook: "দৈনিক হিসাব",
    "Initializing System...": "সিস্টেম চালু হচ্ছে...",
    "Connecting to secure servers.": "সার্ভারে সংযোগ করা হচ্ছে।",

    // Dashboard
    "Welcome Back": "স্বাগতম",
    "Your business at a glance.": "এক নজরে আপনার ব্যবসা।",
    Today: "আজ",
    Yesterday: "গতকাল",
    "This Week": "এই সপ্তাহ",
    "Last 7 Days": "গত ৭ দিন",
    "This Month": "এই মাস",
    "Last 30 Days": "গত ৩০ দিন",
    "This Year": "এই বছর",
    Custom: "কাস্টম",
    "Custom Range": "কাস্টম রেঞ্জ",
    "Gross Revenue": "মোট রেভিনিউ",
    "Total Discounts": "মোট ছাড়",
    "Net Revenue": "নিট রেভিনিউ",
    "Gross Profit": "মোট প্রফিট",
    "Net Profit": "নিট প্রফিট",
    "Total Sales": "মোট বিক্রয়",
    "Total Receivables": "মোট প্রাপ্য (বাকি)",
    "Avg. Sale Value": "গড় বিক্রয় মূল্য",
    "New Customers": "নতুন কাস্টমার",
    "Top Selling Products": "সেরা বিক্রিত পণ্য",
    "Revenue Overview": "রেভিনিউয়ের সারসংক্ষেপ",
    "Sales by Hour of Day": "ঘন্টা অনুযায়ী বিক্রয়",
    "Payment Methods": "পেমেন্ট মেথড",
    "Low Stock Alert": "স্টক স্বল্পতা সতর্কতা",
    "Recent Activity": "সাম্প্রতিক কার্যকলাপ",
    "Cashier Performance": "ক্যাশিয়ার পারফরম্যান্স",
    "AI Insights & Quick Actions": "AI ইনসাইট ও অ্যাকশন",

    // POS
    "Scan or search products...": "পণ্য স্ক্যান বা খুঁজুন...",
    "Scan or search products by name, SKU, or barcode...":
      "নাম, SKU বা বারকোড দিয়ে পণ্য খুঁজুন...",
    "Current Sale": "বর্তমান বিক্রয়",
    "Order Summary": "অর্ডার সারাংশ",
    Subtotal: "সর্বমোট",
    Discount: "ডিসকাউন্ট",
    Tax: "ট্যাক্স / ভ্যাট",
    Total: "মোট",
    Pay: "পরিশোধ",
    Hold: "হোল্ড",
    Cancel: "বাতিল",
    Item: "আইটেম",
    Price: "দাম",
    Qty: "পরিমাণ",
    Quantity: "পরিমাণ",
    Actions: "অ্যাকশন",
    "Cart is empty": "কার্ট খালি",
    "Add products from the list to get started":
      "শুরু করতে তালিকা থেকে পণ্য যোগ করুন",
    "Customer Added": "কাস্টমার যুক্ত হয়েছে",
    "Remove Customer": "কাস্টমার সরান",
    "Apply Discount": "ডিসকাউন্ট দিন",
    "Apply Total Discount": "পুরো অর্ডারে ডিসকাউন্ট",
    "Clear Sale": "বিক্রয় মুছুন",
    "Select Customer": "কাস্টমার নির্বাচন করুন",
    "Create New Customer": "নতুন কাস্টমার তৈরি করুন",
    "Top Sellers": "শীর্ষ বিক্রয়",
    "All Products": "সকল পণ্য",
    Customer: "কাস্টমার",

    // Payment Modal
    "Process Payment": "পেমেন্ট প্রক্রিয়া",
    "Total Due": "মোট বকেয়া",
    "Amount Remaining": "বাকি পরিমাণ",
    "Change Due": "ফেরত দিতে হবে",
    "Add Payment": "পেমেন্ট যোগ করুন",
    "Finalize Payment": "পেমেন্ট সম্পন্ন করুন",
    "Cancel Transaction": "লেনদেন বাতিল করুন",
    "Payment Method": "পেমেন্ট মাধ্যম",
    Cash: "নগদ",
    Card: "কার্ড",
    "Mobile Banking": "মোবাইল ব্যাংকিং",
    "Bank Transfer": "ব্যাংক ট্রান্সফার",
    "Add to Due": "বাকিতে যোগ করুন",
    Notes: "নোট / মন্তব্য",

    // Inventory
    "Inventory Management": "ইনভেন্টরি ম্যানেজমেন্ট",
    "View, search, and manage all your products.":
      "আপনার সমস্ত পণ্য দেখুন, খুঁজুন এবং পরিচালনা করুন।",
    "Add Product": "পণ্য যোগ করুন",
    Import: "ইম্পোর্ট",
    "Product Name": "পণ্যের নাম",
    Category: "ক্যাটাগরি",
    "Cost Price": "ক্রয় মূল্য",
    "Selling Price": "বিক্রয় মূল্য",
    "Stock Quantity": "স্টক পরিমাণ",
    Barcode: "বারকোড",
    Status: "অবস্থা",
    Active: "সক্রিয়",
    Inactive: "নিষ্ক্রিয়",
    "Out of Stock": "স্টক শেষ",
    "Low Stock": "স্বল্প স্টক",
    "In Stock": "স্টক আছে",
    Edit: "এডিট",
    Delete: "মুছুন",
    "View Details": "বিস্তারিত দেখুন",
    "Generate Variants": "ভেরিয়েন্ট তৈরি করুন",
    "Manage Variants": "ভেরিয়েন্ট ম্যানেজ করুন",
    "Adjust Stock": "স্টক পরিবর্তন করুন",
    "Receive Stock": "স্টক গ্রহণ করুন",

    // Customers
    "Customer Database": "কাস্টমার তালিকা",
    "Add Customer": "কাস্টমার যোগ করুন",
    "Import Customers": "কাস্টমার ইম্পোর্ট",
    "Full Name": "পুরো নাম",
    Phone: "ফোন",
    Email: "ইমেইল",
    Address: "ঠিকানা",
    "Credit Limit": "বাকি নেওয়ার লিমিট",
    "Loyalty ID": "লয়ালটি আইডি",
    "Points Balance": "পয়েন্ট ব্যালেন্স",
    "Due Balance": "বকেয়া ব্যালেন্স",
    "Join Date": "যোগদানের তারিখ",

    // Invoices & Quotes
    "Invoice History": "ইনভয়েস হিস্ট্রি",

    "Invoice ID": "ইনভয়েস আইডি",
    Date: "তারিখ",
    Paid: "পরিশোধিত",
    Partial: "আংশিক",
    Due: "বাকি",
    Void: "বাতিল",
    Return: "ফেরত",
    View: "দেখুন",
    Print: "প্রিন্ট",
    "Convert to Invoice": "ইনভয়েসে রূপান্তর করুন",
    "Send Email": "ইমেইল পাঠান",

    // Staff
    "Staff Management": "স্টাফ ম্যানেজমেন্ট",
    "Invite Staff": "স্টাফ ইনভাইট করুন",
    Role: "রোল / পদবী",
    Manager: "ম্যানেজার",
    Cashier: "ক্যাশিয়ার",
    Admin: "অ্যাডমিন",
    Administrator: "অ্যাডমিনিস্ট্রেটর",
    "Emergency Contact": "জরুরী যোগাযোগ",

    // Buttons & Commons
    "Save Changes": "সেভ করুন",
    Create: "তৈরি করুন",
    Update: "আপডেট",
    Close: "বন্ধ করুন",
    Confirm: "নিশ্চিত করুন",
    Yes: "হ্যাঁ",
    No: "না",
    OK: "ঠিক আছে",
    "Loading...": "লোড হচ্ছে...",
    Success: "সফল",
    Error: "ত্রুটি",
    Warning: "সতর্কতা",
    Apply: "প্রয়োগ করুন",
    Reset: "রিসেট",

    // Login
    "Sign In": "লগইন করুন",
    "Sign up": "সাইন আপ",
    Password: "পাসওয়ার্ড",
    "Email address": "ইমেইল ঠিকানা",
    "Business Name": "ব্যবসার নাম",
    "Create Account": "অ্যাকাউন্ট খুলুন",
    "Already have an account?": "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    "Don't have an account?": "অ্যাকাউন্ট নেই?",

    // Bengali Specifics
    taka: "টাকা",
    BDT: "টাকা",

    // Add Toggle Text
    Language: "ভাষা",
    "Switch to Bangla": "বাংলায় দেখুন",
    "System Language": "সিস্টেমের ভাষা",
    //adding more manually by research
    // Analytics & Dashboard Extras
    "Credit Limit (BDT)": "ক্রেডিট সীমা (টাকা)",
    "Staff Discount (%)": "স্টাফ ছাড় (%)",
    "Lifetime Discount (%)": "আজীবন ছাড় (%)",
    "Sales by Category": "ক্যাটাগরি অনুযায়ী বিক্রয়",
    "No customer sales.": "কোনো গ্রাহক বিক্রয় নেই।",
    "All products are well-stocked.": "সব পণ্য পর্যাপ্ত মজুদে রয়েছে।",
    "No new insights at the moment.": "এই মুহূর্তে নতুন কোনো ইনসাইট নেই।",
    "Hourly Sales Breakdown": "ঘণ্টাভিত্তিক বিক্রয় বিশ্লেষণ",
    "Performance Snapshot": "পারফরম্যান্সের সংক্ষিপ্ত চিত্র",
    "Current outstanding balance": "বর্তমান বকেয়া ব্যালেন্স",

    // Comparison Labels
    "vs. yesterday": "গতকালের তুলনায়",
    "vs. day before": "তার আগের দিনের তুলনায়",
    "vs. last week": "গত সপ্তাহের তুলনায়",
    "vs. previous 7 days": "পূর্ববর্তী ৭ দিনের তুলনায়",
    "vs. last month": "গত মাসের তুলনায়",
    "vs. previous 30 days": "পূর্ববর্তী ৩০ দিনের তুলনায়",
    "vs. last year": "গত বছরের তুলনায়",
    "vs. previous period": "পূর্ববর্তী সময়ের তুলনায়",

    // Header / Context
    "Welcome Back, Admin": "ক্যাশশিল্পে স্বাগতম, অ্যাডমিন",
    "Showing data for:": "যে ডেটা দেখানো হচ্ছে:",
    // Barcode Generator Page
    "Advanced Barcode Generator": "উন্নত বারকোড জেনারেটর",
    "Create, customize, and print barcode sheets for your products.":
      "আপনার পণ্যের জন্য বারকোড শিট তৈরি, কাস্টমাইজ ও প্রিন্ট করুন।",

    Single: "একক",
    "Bulk Add": "একসাথে যোগ করুন",

    "Search Product": "পণ্য খুঁজুন",
    "Find by name or SKU...": "নাম বা SKU দিয়ে খুঁজুন...",

    "Product Name (for label)": "পণ্যের নাম (লেবেলের জন্য)",
    "Price (for label)": "মূল্য (লেবেলের জন্য)",
    "Data to Encode (Barcode Number)": "এনকোড করার তথ্য (বারকোড নম্বর)",
    "Enter product SKU, number, etc.": "পণ্যের SKU, নম্বর ইত্যাদি লিখুন",
    "Text below Barcode": "বারকোডের নিচের লেখা",
    "Optional text line": "ঐচ্ছিক লেখা",

    Settings: "সেটিংস",
    "Track by Serial Number": "সিরিয়াল নম্বর অনুযায়ী ট্র্যাক করুন",
    "Add to Sheet": "শিটে যোগ করুন",

    "Barcode List": "বারকোড তালিকা",
    "Add barcodes to see them here.": "এখানে দেখতে বারকোড যোগ করুন।",
    "Clear Sheet": "শিট পরিষ্কার করুন",

    "Print Preview": "প্রিন্ট প্রিভিউ",

    // Right Panel – Label Content
    "Label Content": "লেবেলের কনটেন্ট",
    "Show Shop Name": "দোকানের নাম দেখান",
    "Show Product Name": "পণ্যের নাম দেখান",
    "Show Price": "মূল্য দেখান",

    // Barcode Format
    "Barcode Format": "বারকোড ফরম্যাট",
    Format: "ফরম্যাট",
    "Bar Width": "বারের প্রস্থ",
    Height: "উচ্চতা",
    "Text Font Size (pt)": "টেক্সট ফন্ট সাইজ (pt)",
    "Show Text in Barcode": "বারকোডে লেখা দেখান",

    // Sheet Layout
    "Sheet Layout": "শিট লেআউট",
    Columns: "কলাম",
    "Gap (px)": "ফাঁক (px)",
    "Margin X (px)": "মার্জিন X (px)",
    "Margin Y (px)": "মার্জিন Y (px)",

    // Empty State
    "Your barcode sheet is empty": "আপনার বারকোড শিট খালি রয়েছে",
    "Add New Customer": "নতুন কাস্টমার যোগ করুন",
    "Create Customer": "কাস্টমার তৈরি করুন",
    "Search by name, phone, or email...": "নাম, ফোন বা ইমেইল দিয়ে খুঁজুন...",
    Optional: "ঐচ্ছিক",
    "Subtotal:": "সাবটোটাল:",
    Tax: "ট্যাক্স / ভ্যাট",
    Total: "মোট",

    "Edit Item Details": "আইটেমের বিস্তারিত সম্পাদনা করুন",
    "Line Item Discount (Overrides Price)":
      "আইটেমভিত্তিক ডিসকাউন্ট (মূল্য পরিবর্তন করবে)",
    "e.g., Customer requested gift wrap": "যেমন: কাস্টমার গিফট র‍্যাপ চেয়েছেন",

    "Discount Method": "ডিসকাউন্ট পদ্ধতি",
    "Discount Amount": "ডিসকাউন্টের পরিমাণ",
    "Leave value blank or 0 to remove discount.":
      "ডিসকাউন্ট বাতিল করতে মান ফাঁকা রাখুন বা 0 লিখুন।",
    "e.g., Holiday promotion, Staff discount":
      "যেমন: ছুটির অফার, স্টাফ ডিসকাউন্ট",
    "New Total (Est.)": "নতুন মোট (আনুমানিক)",
    "Reason (Optional)": "কারণ (ঐচ্ছিক)",
    "e.g.,": "যেমন:",
    "Percentage (%)": "শতাংশ (%)",
    "Fixed Amount": "নির্দিষ্ট পরিমাণ",
    "Set Manual Total": "ম্যানুয়ালি মোট নির্ধারণ করুন",
    "Enter the final price you want for the total.":
      "মোটের জন্য আপনি যে চূড়ান্ত মূল্য নির্ধারণ করতে চান তা লিখুন।",
    "Apply Changes": "পরিবর্তন প্রয়োগ করুন",
    "Cancel Sale": "বিক্রয় বাতিল",
    "Are you sure you want to clear all items from this sale? This action cannot be undone.":
      "আপনি কি নিশ্চিত এই বিক্রয় থেকে সব আইটেম মুছে ফেলতে চান? এই কাজটি আর ফিরিয়ে আনা যাবে না।",
    "Keep Sale": "বিক্রয় রাখুন",
    "Yes, Cancel It": "হ্যাঁ, বাতিল করুন",
    "Barcode data cannot be empty.": "বারকোডের তথ্য খালি রাখা যাবে না।",
    "All Time": "সর্বসময়",
    "Search by ID or Customer...": "আইডি বা কাস্টমার দিয়ে খুঁজুন...",
    "All Types": "সব ধরনের",
    Sales: "সেলস",
    "All Statuses": "সব স্ট্যাটাস",
    Pending: "পেন্ডিং",
    "Void Requested": "ভয়েড অনুরোধ করা হয়েছে",
    "Specific Date...": "নির্দিষ্ট তারিখ...",
    "Custom Range...": "কাস্টম রেঞ্জ...",
    EMI: "ইএমআই",
    "Void Invoice": "ইনভয়েস ভয়েড করুন",
    "Process Return": "রিটার্ন প্রক্রিয়া",
    "Delete Invoice": "ইনভয়েস মুছে ফেলুন",
    "Subtotal Credit:": "সাবটোটাল ক্রেডিট:",
    "Tax Credit (Est.):": "ট্যাক্স ক্রেডিট (আনুমানিক):",
    "Total Credit:": "মোট ক্রেডিট:",
    "e.g., Damaged item, Wrong size": "যেমন: পণ্য ক্ষতিগ্রস্ত, ভুল সাইজ",

    // Table Headers (CAPS)
    PRODUCT: "পণ্য",
    "MAX RETURNABLE": "সর্বোচ্চ ফেরতযোগ্য",
    "RETURN QTY": "ফেরতের পরিমাণ",
    "CREDIT AMOUNT": "ক্রেডিটের পরিমাণ",

    "Select items to return from Invoice":
      "ইনভয়েস থেকে ফেরত দেওয়ার আইটেম নির্বাচন করুন",
    "Reason for Return": "ফেরতের কারণ",
    "You are about to void invoice": "আপনি ইনভয়েস ভয়েড করতে যাচ্ছেন ",
    "This will restore inventory and reverse the transaction. This action is irreversible.":
      "এতে ইনভেন্টরি পুনরুদ্ধার হবে এবং লেনদেন বাতিল হবে। এই কাজটি আর ফেরানো যাবে না।",
    "Reason for Void": "ভয়েড করার কারণ",
    "Confirm Void": "ভয়েড নিশ্চিত করুন",
    "Are you sure you want to permanently delete invoice":
      "আপনি কি নিশ্চিত ইনভয়েসটি স্থায়ীভাবে মুছে ফেলতে চান ",
    "This action will restore stock and is irreversible.":
      "এতে স্টক পুনরুদ্ধার হবে এবং এই কাজটি আর ফেরানো যাবে না।",
    "Create and manage price quotes for your customers.":
      "আপনার কাস্টমারদের জন্য মূল্য কোটেশন তৈরি ও পরিচালনা করুন।",
    "+ New Quotation": "+ নতুন কোটেশন",
    "Search by ID, customer name...": "আইডি বা কাস্টমারের নাম দিয়ে খুঁজুন...",

    "QUOTE #": "কোটেশন #",
    "EXPIRES ON": "মেয়াদ শেষ",
    "No quotations found.": "কোনো কোটেশন পাওয়া যায়নি।",

    Draft: "ড্রাফট",
    Sent: "সেন্ট",
    Accepted: "অ্যাকসেপ্টেড",
    Invoiced: "ইনভয়েসড",
    Expired: "মেয়াদোত্তীর্ণ",

    "Mark as Sent": "সেন্ট হিসেবে চিহ্নিত করুন",
    "Create Quotation": "কোটেশন তৈরি করুন",

    "Date Issued:": "ইস্যুর তারিখ:",
    "Valid Until:": "বৈধ থাকবে:",
    "Item Description": "আইটেমের বিবরণ",
    "Unit Price": "একক মূল্য",
    "Total:": "মোট",
    "Quote For": "কোটেশন ফর",
    "Notes / Terms & Conditions": "নোট / শর্তাবলি",
    "Product / SKU": "পণ্য / SKU",
    "No items added yet.": "এখনো কোনো আইটেম যোগ করা হয়নি।",
    "Search by Name/SKU, or scan Barcode...":
      "নাম/SKU দিয়ে খুঁজুন, অথবা বারকোড স্ক্যান করুন...",
    "Add Items to Quotation": "কোটেশনে আইটেম যোগ করুন",

    "Quotation Date": "কোটেশনের তারিখ",
    "Expiry Date": "মেয়াদ শেষের তারিখ",
    "Select a customer...": "একজন কাস্টমার নির্বাচন করুন...",
    "Search customers...": "কাস্টমার খুঁজুন...",
    "New Quotation": "নতুন কোটেশন",
    "View Invoices": "ইনভয়েস দেখুন",
    "Receive Payment": "পেমেন্ট গ্রহণ",
    "View / Print": "দেখুন / প্রিন্ট",
    "Are you sure you want to delete Quotation #":
      "আপনি কি নিশ্চিত কোটেশনটি মুছে ফেলতে চান",
    "Delete Quotation": "কোটেশন মুছে ফেলুন",
    "Active Schedules": "সক্রিয় সময়সূচি",
    "Schedule ID": "সময়সূচি আইডি",
    Customer: "কাস্টমার",
    "Next Due": "পরবর্তী কিস্তি",
    "Amount Due": "বকেয়া পরিমাণ",
    Progress: "অগ্রগতি",
    Action: "অ্যাকশন",
    Manage: "ম্যানেজ",

    "Search customer or ID...": "কাস্টমার বা আইডি দিয়ে খুঁজুন...",

    "Total Active Loans": "মোট সক্রিয় ঋণ",
    "Principal Receivable": "মূলধন প্রাপ্য",
    "Interest Earning": "ইন্টারেস্ট থেকে আয়",
    "Overdue Accounts": "মেয়াদোত্তীর্ণ অ্যাকাউন্ট",

    "Manage installments, create loan schedules, and track collections.":
      "কিস্তি ম্যানেজ করুন, ঋণের সময়সূচি তৈরি করুন এবং আদায় ট্র্যাক করুন।",

    "New EMI Sale": "নতুন ইএমআই বিক্রয়",
    Overdue: "ওভারডিউ",
    "Manage EMI": "ইএমআই ম্যানেজ",
    "EMI Details": "ইএমআই বিস্তারিত",
    "Foreclosing loan for": "ঋণ ফোরক্লোজ করা হচ্ছে ",
    "Pay Remaining Principal:": "বাকি মূলধন পরিশোধ করুন:",
    "Future interest will be waived.": "ভবিষ্যতের ইন্টারেস্ট মওকুফ করা হবে।",
    "Confirm Payment & Close Loan": "পেমেন্ট নিশ্চিত করুন ও ঋণ বন্ধ করুন",
    "Settle Loan Early": "আগে ঋণ পরিশোধ",
    "Monthly Amount": "মাসিক পরিমাণ",
    "Remaining Principal": "বাকি মূলধন",
    "Total Installment:": "মোট কিস্তি:",
    "Already Paid:": "ইতিমধ্যে পরিশোধিত:",
    "Due Now:": "এখন পরিশোধযোগ্য:",
    "Amount Paying (BDT)": "পরিশোধের পরিমাণ (টাকা)",
    Method: "পদ্ধতি",
    Installment: "কিস্তি",
    "Receive Installment": "কিস্তি গ্রহণ",
    "Create EMI Sale": "ইএমআই বিক্রয় তৈরি করুন",

    "Select Customer...": "কাস্টমার নির্বাচন করুন...",
    "Scan or Search...": "স্ক্যান করুন বা খুঁজুন...",
    "Selected Products": "নির্বাচিত পণ্য",
    "Total Product Value:": "মোট পণ্যের মূল্য:",
    "No Items added.": "কোনো আইটেম যোগ করা হয়নি।",

    "Loan Calculator": "ঋণ ক্যালকুলেটর",
    "Down Payment (BDT)": "ডাউন পেমেন্ট (টাকা)",
    "Interest Rate (% p.a.)": "ইন্টারেস্টের হার (% বার্ষিক)",
    "Tenure (Months)": "মেয়াদ (মাস)",
    "Processing Fee (Flat BDT)": "প্রসেসিং ফি (নির্দিষ্ট টাকা)",
    "First EMI Date": "প্রথম ইএমআই তারিখ",

    "Principal Loan:": "মূল ঋণ:",
    "Total Interest:": "মোট ইন্টারেস্ট:",
    "Monthly EMI:": "মাসিক ইএমআই:",
    "Total Payable:": "মোট পরিশোধযোগ্য:",
    "Confirm & Create Sale": "নিশ্চিত করে বিক্রয় তৈরি করুন",
    SETTLED: "পরিশোধিত",
    Completed: "সম্পন্ন",
    "Total Revenue": "মোট রেভিনিউ",

    "Manage product warranties and process customer claims.":
      "পণ্যের ওয়ারেন্টি ম্যানেজ করুন এবং কাস্টমার ক্লেইম প্রক্রিয়া করুন।",

    "Active Warranties": "সক্রিয় ওয়ারেন্টি",
    Calims: "ক্লেইমস",

    "Search by product, serial, or customer...":
      "পণ্য, সিরিয়াল বা কাস্টমার দিয়ে খুঁজুন...",

    "All Policies": "সব পলিসি",
    POLICY: "পলিসি",
    "PRODUCT / SERIAL": "পণ্য / সিরিয়াল",

    "No active warranties found matching your criteria.":
      "আপনার নির্ধারিত মানদণ্ড অনুযায়ী কোনো সক্রিয় ওয়ারেন্টি পাওয়া যায়নি।",

    Approved: "অনুমোদিত",
    Rejected: "প্রত্যাখ্যাত",

    "Claim ID": "ক্লেইম আইডি",
    "New Policy": "নতুন পলিসি",
    "Warranty Policies": "ওয়ারেন্টি পলিসি",
    "New Warranty Policy": "নতুন ওয়ারেন্টি পলিসি",

    "Policy Name": "পলিসির নাম",
    "Duration (in Months)": "মেয়াদ (মাসে)",
    "Coverage Description": "কভারেজের বিবরণ",

    "e.g., Covers manufacturing defects. Does not cover accidental damage.":
      "যেমন: উৎপাদনজনিত ত্রুটি কভার করে। দুর্ঘটনাজনিত ক্ষতি কভার করে না।",

    "Create Policy": "পলিসি তৈরি করুন",
    "Delete Policy": "পলিসি মুছে ফেলুন",
    "Are you sure you want to delete this policy? This cannot be undone.":
      "আপনি কি নিশ্চিত এই পলিসিটি মুছে ফেলতে চান? এই কাজটি আর ফিরিয়ে আনা যাবে না।",
    "No claims found matching your criteria.":
      "আপনার নির্ধারিত মানদণ্ড অনুযায়ী কোনো ক্লেইম পাওয়া যায়নি।",
    "Edit Warranty Policy": "ওয়ারেন্টি পলিসি সম্পাদনা",

    // Purchase Orders
    "Manage Suppliers": "সাপ্লায়ার ম্যানেজ",
    "New PO": "নতুন PO",
    "Search PO ID or Supplier...": "PO আইডি বা সাপ্লায়ার দিয়ে খুঁজুন...",

    Ordered: "অর্ডার করা হয়েছে",
    "Partially Received": "আংশিক গ্রহণ করা হয়েছে",
    Recieved: "গ্রহণ করা হয়েছে",
    Cancelled: "বাতিল",

    "All Suppliers": "সব সাপ্লায়ার",

    // Table Headers (CAPS)
    "PO NUMBER": "PO নম্বর",
    SUPPLIER: "সাপ্লায়ার",
    "ORDER DATE": "অর্ডারের তারিখ",

    "No purchase orders found.": "কোনো ক্রয় অর্ডার পাওয়া যায়নি।",

    // Supplier Management
    "Supplier List": "সাপ্লায়ার তালিকা",
    "New Supplier": "নতুন সাপ্লায়ার",
    "Add New Supplier": "নতুন সাপ্লায়ার যোগ করুন",

    "Supplier Name": "সাপ্লায়ারের নাম",
    "Contact Person": "যোগাযোগ ব্যক্তি",
    Website: "ওয়েবসাইট",
    "Tax ID / BIN": "ট্যাক্স আইডি / বিআইএন",

    "Create Supplier": "সাপ্লায়ার তৈরি করুন",

    "Cannot delete supplier. They are linked to existing purchase orders.":
      "এই সাপ্লায়ার মুছে ফেলা যাবে না। এটি বিদ্যমান ক্রয় অর্ডারের সাথে যুক্ত।",

    "Edit Supplier": "সাপ্লায়ার সম্পাদনা",

    // PO Details
    "Order Date": "অর্ডারের তারিখ",
    "Expected Delivery": "সম্ভাব্য ডেলিভারি",
    "Set Initial Status": "প্রাথমিক স্ট্যাটাস নির্ধারণ করুন",
    "Add Items to PO": "PO-তে আইটেম যোগ করুন",

    "Shipping:": "শিপিং",
    "Tax (%):": "ট্যাক্স (%)",
    "Tax Amount:": "ট্যাক্সের পরিমাণ:",

    "Create PO": "PO তৈরি করুন",
    Received: "গ্রহণ করা হয়েছে",

    "Select a supplier": "একজন সাপ্লায়ার নির্বাচন করুন",
    "Search by Name/SKU, or scan Barcode and press Enter...":
      "নাম/SKU দিয়ে খুঁজুন, অথবা বারকোড স্ক্যান করে এন্টার চাপুন...",

    "Optional, e.g., PO-2025-001": "ঐচ্ছিক, যেমন: PO-2025-001",
    "Payment Terms": "পেমেন্ট শর্তাবলি",
    "Custom PO Number": "কাস্টম PO নম্বর",
    "e.g., Net 30, Due on Receipt":
      "যেমন: নেট ৩০, রিসিভের সাথে সাথে পরিশোধযোগ্য",
    "New Purchase Order": "নতুন Purchase Order",
    COST: "খরচ",
    "SHIP TO": "ডেলিভারি ঠিকানা",
    "Cancel PO": "PO বাতিল",
    "Edit PO": "PO সম্পাদনা",
    "Mark as Ordered": "অর্ডার হিসেবে চিহ্নিত করুন",
    "Purchase Order": "Purchase Order",
    "Edit Purchase Order": "Purchase Order সম্পাদনা",
    "Yes, Mark as Ordered": "হ্যাঁ, অর্ডার হিসেবে চিহ্নিত করুন",
    "Confirm Order": "অর্ডার নিশ্চিত করুন",

    "This will mark the PO as Ordered and lock it from editing. Are you sure?":
      "এতে PO অর্ডার হিসেবে চিহ্নিত হবে এবং আর সম্পাদনা করা যাবে না। আপনি কি নিশ্চিত?",

    // Table Headers (CAPS)
    REMAINING: "বাকি",
    "RECEIVING NOW": "এখন গ্রহণ করা হচ্ছে",
    "NEW SELLING PRICE (BDT)": "নতুন বিক্রয় মূল্য (টাকা)",

    "Receive Items": "আইটেম গ্রহণ করুন",
    "Enter the quantity or serial numbers for items you are receiving now for PO":
      "এই PO-এর জন্য এখন যে আইটেমগুলো গ্রহণ করছেন, সেগুলোর পরিমাণ বা সিরিয়াল নম্বর লিখুন ",
    "Confirm Cancellation": "বাতিল নিশ্চিত করুন",
    "Are you sure you want to cancel this Purchase Order?":
      "আপনি কি নিশ্চিত এই Purchase Order বাতিল করতে চান?",
    "Yes, Cancel PO": "হ্যাঁ, PO বাতিল",
    "Search by PO ID or Supplier...": "PO আইডি বা সাপ্লায়ার দিয়ে খুঁজুন...",
    "PO has been cancelled.": "PO বাতিল করা হয়েছে।",
    // Inventory / Product
    STOCK: "STOCK",
    "All Categories": "সব ক্যাটাগরি",
    "All Stock Status": "সব স্টক স্ট্যাটাস",
    "All Product Types": "সব পণ্যের ধরন",
    "Search by name, SKU, category...": "নাম, SKU বা ক্যাটাগরি দিয়ে খুঁজুন...",
    Deactivate: "নিষ্ক্রিয় করুন",

    // Table Headers (CAPS)
    "PRODUCT TYPE": "পণ্যের ধরন",

    "No additional details available.": "অতিরিক্ত কোনো তথ্য উপলব্ধ নেই।",

    Physical: "ফিজিক্যাল",
    Service: "সার্ভিস",

    "Back to Inventory": "ইনভেন্টরিতে ফিরে যান",
    "Edit Product": "পণ্য সম্পাদনা",
    Variants: "ভ্যারিয়েন্টস",
    "Pricing & Tax": "মূল্য ও ট্যাক্স",

    "This Product has variants": "এই পণ্যের ভ্যারিয়েন্ট রয়েছে",
    "Enable to manage versions like size or color. Price, stock, and barcode will be managed per variant.":
      "সাইজ বা রঙের মতো বিভিন্ন ভার্সন ম্যানেজ করতে সক্ষম। প্রতিটি ভ্যারিয়েন্ট অনুযায়ী মূল্য, স্টক ও বারকোড ম্যানেজ হবে।",

    "Barcode (UPC/EAN)": "বারকোড (UPC/EAN)",
    "Product Type": "পণ্যের ধরন",
    Brand: "ব্র্যান্ড",
    "Select...": "নির্বাচন করুন...",
    "Scan or type barcode here": "এখানে বারকোড স্ক্যান করুন বা লিখুন",

    "Track by Expiry Date": "মেয়াদ শেষের তারিখ অনুযায়ী ট্র্যাক করুন",
    "Cost Price (in BDT)": "ক্রয় মূল্য (টাকায়)",
    "Selling Price (in BDT)": "বিক্রয় মূল্য (টাকায়)",
    "This item is taxable": "এই আইটেমটি ট্যাক্সযোগ্য",
    "Unit of Measure": "পরিমাপের একক",
    "Current Stock": "বর্তমান স্টক",

    General: "সাধারণ",
    "Variant Options": "ভ্যারিয়েন্ট অপশন",

    "No attributes defined. Add one below.":
      "কোনো অ্যাট্রিবিউট নির্ধারিত নেই। নিচে একটি যোগ করুন।",
    "-- Add existing attribute --": "-- বিদ্যমান অ্যাট্রিবিউট যোগ করুন --",
    "Define the attributes that differentiate your variants.":
      "ভ্যারিয়েন্টগুলো আলাদা করতে যে অ্যাট্রিবিউটগুলো দরকার তা নির্ধারণ করুন।",

    "Create Product": "পণ্য তৈরি করুন",
    "Add New Product": "নতুন পণ্য যোগ করুন",

    "Stock is managed individually for each variant.":
      "প্রতিটি ভ্যারিয়েন্টের জন্য স্টক আলাদাভাবে ম্যানেজ করা হয়।",
    "Price & Cost are managed for each variant.":
      "প্রতিটি ভ্যারিয়েন্টের জন্য মূল্য ও খরচ আলাদাভাবে ম্যানেজ করা হয়।",

    "Default Warranty Policy": "ডিফল্ট ওয়ারেন্টি পলিসি",
    "Applies to serialized items. Can be set on parent products with serialized variants.":
      "সিরিয়ালযুক্ত আইটেমে প্রযোজ্য। সিরিয়ালযুক্ত ভ্যারিয়েন্টসহ প্যারেন্ট পণ্যে সেট করা যায়।",

    "No variants created yet. Use 'Generate Variants' or 'Add Variant'.":
      "এখনো কোনো ভ্যারিয়েন্ট তৈরি হয়নি। 'Generate Variants' বা 'Add Variant' ব্যবহার করুন।",

    "Add Variant": "ভ্যারিয়েন্ট যোগ করুন",
    "Total Stock": "মোট স্টক",
    "Edit Selected": "নির্বাচিতগুলো সম্পাদনা করুন",

    "No variant options defined on parent product. Please edit the parent and add options.":
      "প্যারেন্ট পণ্যে কোনো ভ্যারিয়েন্ট অপশন নির্ধারিত নেই। অনুগ্রহ করে প্যারেন্ট পণ্য সম্পাদনা করে অপশন যোগ করুন।",

    "Generating variant combinations...":
      "ভ্যারিয়েন্ট কম্বিনেশন তৈরি হচ্ছে...",

    "Product created successfully!": "পণ্য সফলভাবে তৈরি হয়েছে!",

    "Select an option for each attribute":
      "প্রতিটি অ্যাট্রিবিউটের জন্য একটি অপশন নির্বাচন করুন",

    "Details for the specific variant will appear here.":
      "নির্দিষ্ট ভ্যারিয়েন্টের বিস্তারিত এখানে দেখা যাবে।",

    "Common Specifications": "সাধারণ স্পেসিফিকেশন",
    "No common specifications available for this product.":
      "এই পণ্যের জন্য কোনো সাধারণ স্পেসিফিকেশন নেই।",

    // Variant Table / Actions (CAPS)
    VARIANT: "ভ্যারিয়েন্ট",
    "(No change)": "(কোনো পরিবর্তন নেই)",
    "Prefix or Start Number": "প্রিফিক্স বা শুরুর নম্বর",
    Value: "মান",

    "Adjust Stock Quantity": "স্টক পরিমাণ সমন্বয় করুন",
    "Set Selling Price": "বিক্রয় মূল্য নির্ধারণ করুন",
    "Set Cost Price": "খরচ মূল্য নির্ধারণ করুন",

    "Bulk Actions": "বাল্ক অ্যাকশন",
    "Apply a change to all selected variants below.":
      "নিচে নির্বাচিত সব ভ্যারিয়েন্টে পরিবর্তন প্রয়োগ করুন।",

    "Edit Individual Variants": "আলাদাভাবে ভ্যারিয়েন্ট সম্পাদনা করুন",
    "This product has no variants defined.":
      "এই পণ্যের জন্য কোনো ভ্যারিয়েন্ট নির্ধারিত নেই।",

    "Select Variants": "ভ্যারিয়েন্ট নির্বাচন করুন",

    "PO marked as Ordered.": "PO Ordered হিসেবে চিহ্নিত করা হয়েছে।",

    "Stock received and inventory updated!":
      "স্টক গ্রহণ করা হয়েছে এবং ইনভেন্টরি আপডেট হয়েছে!",

    "Generate Barcodes": "বারকোড তৈরি করুন",

    "Set Variant Status": "ভ্যারিয়েন্টের স্ট্যাটাস নির্ধারণ করুন",

    Serials: "সিরিয়ালসমূহ",

    "One serial per line": "প্রতি লাইনে একটি সিরিয়াল",

    "Add New Variant": "নতুন ভ্যারিয়েন্ট যোগ করুন",

    "Creating a new variant for": "নতুন ভ্যারিয়েন্ট তৈরি করা হচ্ছে",

    "Variant SKU": "ভ্যারিয়েন্ট SKU",

    "Selling Price (BDT)": "বিক্রয় মূল্য (BDT)",

    "Serial Numbers (one per line)": "সিরিয়াল নম্বরসমূহ (প্রতি লাইনে একটি)",

    "Stock quantity will be automatically set to the number of serials entered.":
      "প্রবেশ করানো সিরিয়ালের সংখ্যার ভিত্তিতে স্টক পরিমাণ স্বয়ংক্রিয়ভাবে নির্ধারিত হবে।",

    "Create Variant": "ভ্যারিয়েন্ট তৈরি করুন",

    "Deactivate Product": "পণ্য নিষ্ক্রিয় করুন",

    "Are you sure you want to deactivate": "আপনি কি নিশ্চিত নিষ্ক্রিয় করতে চান",

    "An inactive product will be hidden from the POS terminal.":
      "নিষ্ক্রিয় পণ্য POS টার্মিনালে প্রদর্শিত হবে না।",

    "Import Products": "পণ্য ইমপোর্ট করুন",

    "Upload a CSV file to bulk-import your data. Please ensure your file matches the template format.":
      "একসাথে ডেটা ইমপোর্ট করতে একটি CSV ফাইল আপলোড করুন। অনুগ্রহ করে নিশ্চিত করুন আপনার ফাইলটি টেমপ্লেট ফরম্যাট অনুযায়ী।",

    "Upload your CSV file": "আপনার CSV ফাইল আপলোড করুন",

    "Download products_template.csv": "products_template.csv ডাউনলোড করুন",

    "No file selected.": "কোনো ফাইল নির্বাচন করা হয়নি।",

    "Start Import": "ইমপোর্ট শুরু করুন",

    "One serial per line...": "প্রতি লাইনে একটি সিরিয়াল...",

    "ORDERED QTY": "অর্ডারকৃত পরিমাণ",

    "Confirm Received Stock": "প্রাপ্ত স্টক নিশ্চিত করুন",

    'You are creating a new PO with status "Received". Please confirm the items, quantities, selling prices, and barcodes you are adding to your inventory.':
      'আপনি "Received" স্ট্যাটাসসহ একটি নতুন PO তৈরি করছেন। অনুগ্রহ করে ইনভেন্টরিতে যোগ করা পণ্য, পরিমাণ, বিক্রয় মূল্য এবং বারকোড নিশ্চিত করুন।',

    "Confirm & Create": "নিশ্চিত করুন ও তৈরি করুন",

    "PO created and stock received successfully!":
      "PO সফলভাবে তৈরি হয়েছে এবং স্টক গ্রহণ সম্পন্ন হয়েছে!",
    "Select options for": "অপশন নির্বাচন করুন",

    "Quantity:": "পরিমাণ:",

    "Add to Cart": "কার্টে যোগ করুন",

    "Select Variant": "ভ্যারিয়েন্ট নির্বাচন করুন",
    "add more values and press Enter...": "আরও মান যোগ করুন এবং Enter চাপুন...",

    "Add Values and Enter": "মান যোগ করুন এবং Enter চাপুন",

    "Manage Attributes": "অ্যাট্রিবিউট পরিচালনা করুন",

    "Create and manage product options like size, color, or material.":
      "সাইজ, রং বা ম্যাটেরিয়ালের মতো পণ্যের অপশন তৈরি ও পরিচালনা করুন।",

    "New Attribute": "নতুন অ্যাট্রিবিউট",

    "Attribute Name": "অ্যাট্রিবিউটের নাম",

    "Initial Values (optional)": "প্রাথমিক মান (ঐচ্ছিক)",

    "Press Enter after each value.": "প্রতিটি মান দেওয়ার পর Enter চাপুন।",

    "Create Attribute": "অ্যাট্রিবিউট তৈরি করুন",
    Expense: "এক্সপেন্স",

    "P&L": "লাভ ও ক্ষতি",

    Activity: "কার্যক্রম",

    "All Staff": "সকল স্টাফ",

    Discount: "ডিসকাউন্ট",

    Profit: "মুনাফা",

    "Top 5 Selling Products": "সর্বাধিক বিক্রিত শীর্ষ ৫টি পণ্য",

    "Sales by Cashier": "ক্যাশিয়ার অনুযায়ী বিক্রয়",

    Cash: "নগদ",

    "EMI (Due)": "EMI (বকেয়া)",

    "Add to Due": "বকেয়ায় যোগ",

    "Credit (Due)": "ক্রেডিট (বকেয়া)",
    "Revenue & Profit": "রেভিনিউ ও প্রফিট",

    "Net Revenue": "নিট রেভিনিউ",

    "Revenue by Category": "ক্যাটাগরি অনুযায়ী রেভিনিউ",
    "All Sales in Period": "নির্দিষ্ট সময়ের সব বিক্রয়",

    "Export Products": "পণ্য এক্সপোর্ট করুন",

    "Export Customers": "কাস্টমার এক্সপোর্ট করুন",

    Export: "এক্সপোর্ট",
    "Total Inventory Value": "মোট ইনভেন্টরি মূল্য",

    "Total SKUs": "মোট SKU",

    "Units Sold": "বিক্রিত ইউনিট",

    "Revenue from Inventory": "ইনভেন্টরি থেকে আয়",

    "Stock Value by Category (Live)": "ক্যাটাগরি অনুযায়ী স্টক মূল্য (লাইভ)",

    "Top 5 Most Stocked Products (Live)":
      "সবচেয়ে বেশি স্টক থাকা শীর্ষ ৫ পণ্য (লাইভ)",

    Uncategorized: "ক্যাটাগরি নির্ধারিত নয়",

    "Dead Stock (Items with no sales in period)":
      "ডেড স্টক (এই সময়ে বিক্রয় হয়নি এমন পণ্য)",

    "Full Inventory List (Live)": "সম্পূর্ণ ইনভেন্টরি তালিকা (লাইভ)",

    "Stock Value": "স্টক মূল্য",

    "Total Customers": "মোট কাস্টমার",

    "Total Spend": "মোট ব্যয়",

    "Avg. Spend / Sale": "গড় ব্যয় / বিক্রয়",

    "New vs. Returning Customers": "নতুন বনাম পুনরাগমনকারী কাস্টমার",

    "Top 5 Customers by Spend": "ব্যয় অনুযায়ী শীর্ষ ৫ কাস্টমার",

    "Customer List": "কাস্টমার তালিকা",

    "Customer Name": "কাস্টমারের নাম",

    "Total Invoices": "মোট ইনভয়েস",

    "Total Spent": "মোট ব্যয়",

    "Loyalty Points": "লয়ালটি পয়েন্ট",

    "Total Expenses": "মোট খরচ",

    "# of Expenses": "খরচের সংখ্যা",

    "Avg. Expense": "গড় খরচ",

    "Expenses by Category": "ক্যাটাগরি অনুযায়ী খরচ",

    "Expense Trend": "খরচের প্রবণতা",

    "Expense List": "খরচের তালিকা",

    "Paid To": "যাকে প্রদান করা হয়েছে",

    Amount: "পরিমাণ",

    "Recorded By": "রেকর্ড করেছেন",
    "Business Reports": "ব্যবসায়িক রিপোর্ট",

    "Analyze trends and performance metrics.":
      "প্রবণতা ও পারফরম্যান্স মেট্রিক বিশ্লেষণ করুন।",

    "Loans Disbursed": "বিতরণকৃত ঋণ",

    "Projected Interest": "প্রক্ষেপিত ইন্টারেস্ট",

    "EMI Collections": "EMI সংগ্রহ",

    "New Loan Accounts": "নতুন ঋণ অ্যাকাউন্ট",

    "Disbursals vs Collections (Daily)": "বিতরণ বনাম সংগ্রহ (দৈনিক)",

    Disbursed: "বিতরণ করা হয়েছে",

    Collected: "সংগ্রহ করা হয়েছে",

    "Loan Status (All Time)": "ঋণের অবস্থা (সর্বমোট সময়)",

    Principal: "মূল টাকা",

    Interest: "ইন্টারেস্ট",

    Tenure: "মেয়াদ",

    "No loans originated in this period.": "এই সময়কালে কোনো ঋণ শুরু হয়নি।",

    "Loans Originated in Period": "এই সময়ে শুরু হওয়া ঋণ",

    "Interest Income": "ইন্টারেস্ট থেকে আয়",

    "Op. Expenses": "অপারেশনাল খরচ",

    "Income vs. Expense": "আয় বনাম খরচ",

    "Financial Summary": "আর্থিক সারসংক্ষেপ",

    "Product Sales": "পণ্য বিক্রয়",

    "- Total Discounts": "- মোট ডিসকাউন্ট",

    "- Cost of Goods Sold (COGS)": "- বিক্রিত পণ্যের খরচ (COGS)",

    "- Operating Expenses": "- পরিচালন খরচ",
    "Activity Log": "অ্যাক্টিভিটি লগ",

    Timestamp: "টাইমস্ট্যাম্প",

    User: "ইউজার",

    "Action Type": "অ্যাকশন টাইপ",

    Details: "বিস্তারিত",

    "Voided Invoices": "বাতিলকৃত ইনভয়েস",

    "Audit Log": "অডিট লগ",

    CONTACT: "CONTACT",

    "Search by name, phone, email, loyalty ID...":
      "নাম, ফোন, ইমেইল বা লয়ালটি আইডি দিয়ে খুঁজুন...",

    "Receive Due Payment": "বকেয়া পেমেন্ট গ্রহণ করুন",

    "Receiving payment for:": "পেমেন্ট গ্রহণ করা হচ্ছে:",

    "Current Due:": "বর্তমান বকেয়া:",

    "Payment Amount (in BDT)": "পেমেন্টের পরিমাণ (BDT)",

    "Edit Customer": "কাস্টমার এডিট করুন",

    "Invoice History:": "ইনভয়েস হিস্ট্রি:",

    "Showing invoice history for": "ইনভয়েস হিস্ট্রি দেখানো হচ্ছে:",

    "Delete Customer": "কাস্টমার ডিলিট করুন",

    "Cannot delete customer. They are associated with existing invoices.":
      "কাস্টমার ডিলিট করা যাবে না। তারা বিদ্যমান ইনভয়েসের সাথে যুক্ত।",

    "Are you sure you want to permanently delete":
      "আপনি কি নিশ্চিত স্থায়ীভাবে ডিলিট করতে চান ",

    "This action cannot be undone.": "এই কাজটি আর ফেরানো যাবে না।",

    "Total Suppliers": "মোট সাপ্লায়ার",

    "Add Supplier": "সাপ্লায়ার যোগ করুন",

    "Total Purchase Value": "মোট ক্রয় মূল্য",

    "Average PO Value": "গড় PO মূল্য",

    "Search by name, contact, email...":
      "নাম, কন্টাক্ট বা ইমেইল দিয়ে খুঁজুন...",

    "CONTACT INFO": "যোগাযোগ তথ্য",

    "PRODUCTS SUPPLIED": "সরবরাহকৃত পণ্য",

    "LAST ORDER": "সর্বশেষ অর্ডার",
    "All Methods": "সব মেথড",
    "Search expenses...": "সার্চ এক্সপেন্স",

    "Expense Tracker": "এক্সপেন্স ট্র্যাকার",

    "Monitor and manage all your business expenditures.":
      "আপনার সব ব্যবসায়িক খরচ পর্যবেক্ষণ ও পরিচালনা করুন।",

    "Log New Expense": "নতুন খরচ যোগ করুন",
    "Amount (BDT)": "পরিমাণ (BDT)",

    "Select a category...": "একটি ক্যাটাগরি নির্বাচন করুন...",

    "Receipt URL (Optional)": "রিসিপ্ট URL (ঐচ্ছিক)",

    "Notes (Optional)": "নোটস (ঐচ্ছিক)",

    "Log Expense": "খরচ লগ করুন",
    "Edit Expense": "খরচ এডিট করুন",

    Search: "সার্চ",

    "Payroll Management": "পেরোল ম্যানেজমেন্ট",

    "Process salaries, manage pay settings, and view history.":
      "বেতন প্রক্রিয়া করুন, পে সেটিংস পরিচালনা করুন এবং হিস্ট্রি দেখুন।",

    "Overview & Run Payroll": "ওভারভিউ ও পেরোল চালান",

    "Staff Pay Settings": "স্টাফ পে সেটিংস",

    "Payroll History": "পেরোল হিস্ট্রি",

    "NEXT PAYROLL DATE": "পরবর্তী পেরোল তারিখ",

    Monthly: "মাসিক",

    "General Settings": "সাধারণ সেটিংস",

    "Frequency:": "ফ্রিকোয়েন্সি:",

    "Pay Day:": "পে ডে:",

    "Default Tax Rate:": "ডিফল্ট ট্যাক্স রেট:",

    "Overtime Rate:": "ওভারটাইম রেট:",

    "Run Payroll Now": "এখনই পেরোল চালান",

    "Staff Ready for Payroll": "পেরোলের জন্য প্রস্তুত স্টাফ",

    Name: "নাম",

    "Pay Type": "পে টাইপ",

    Rate: "রেট",

    "Est. Gross (Current Period)": "আনুমানিক গ্রস (বর্তমান সময়কাল)",

    "No staff members have pay settings configured.":
      "কোনো স্টাফের পে সেটিংস কনফিগার করা নেই।",

    "Pay Rate": "পে রেট",

    "Bank Details": "ব্যাংক তথ্য",

    "Not Set": "সেট করা নেই",

    "Edit Pay Settings": "পে সেটিংস এডিট করুন",

    "Editing pay settings for:": "পে সেটিংস এডিট করা হচ্ছে: ",

    Hourly: "ঘন্টাভিত্তিক",

    "Fixed Salary": "নির্ধারিত বেতন",

    "Bank Details (Optional)": "ব্যাংক তথ্য (ঐচ্ছিক)",

    "Bank Name": "ব্যাংকের নাম",

    "Account Number": "অ্যাকাউন্ট নম্বর",

    "Save Settings": "সেটিংস সেভ করুন",

    "Past Payroll Runs": "পূর্ববর্তী পেরোল রান",

    Run: "রান",

    Date: "তারিখ",

    "Period Covered": "সময়কাল",

    "Total Paid": "মোট পরিশোধিত",

    "# Employees": "কর্মচারীর সংখ্যা",

    "No payroll history found.": "কোনো পেরোল হিস্ট্রি পাওয়া যায়নি।",

    "Enter rate per hour or fixed amount":
      "প্রতি ঘন্টার রেট বা নির্ধারিত পরিমাণ লিখুন",

    "This is a simulation. Actual fund transfers are not performed.":
      "এটি একটি সিমুলেশন। প্রকৃত অর্থ স্থানান্তর করা হবে না।",

    "Confirm & Run Payroll": "নিশ্চিত করুন ও পেরোল চালান",

    "This will calculate gross pay, apply deductions (based on default settings), and record the payroll run. Ensure all pay rates and hours (if applicable) are correct before proceeding.":
      "এতে গ্রস বেতন হিসাব করা হবে, ডিডাকশন প্রয়োগ হবে (ডিফল্ট সেটিংস অনুযায়ী) এবং পেরোল রেকর্ড করা হবে। এগিয়ে যাওয়ার আগে সব রেট ও সময় সঠিক কিনা নিশ্চিত করুন।",

    "Confirm Payroll Run": "পেরোল রান নিশ্চিত করুন",

    "Payroll for 1 employees completed successfully!":
      "১ জন কর্মচারীর পেরোল সফলভাবে সম্পন্ন হয়েছে!",

    "Processing payroll... please wait.":
      "পেরোল প্রক্রিয়াধীন... অনুগ্রহ করে অপেক্ষা করুন।",

    "Payroll General Settings": "পেরোল সাধারণ সেটিংস",

    "Pay Frequency": "পে ফ্রিকোয়েন্সি",

    "Pay Day of Month (for Monthly)": "মাসের পে ডে (মাসিকের জন্য)",

    "Default Income Tax Rate (%)": "ডিফল্ট আয়কর হার (%)",

    "Default Overtime Rate (Multiplier)":
      "ডিফল্ট ওভারটাইম রেট (মাল্টিপ্লায়ার)",

    Weekly: "সাপ্তাহিক",

    "Bi-Weekly": "দ্বি-সাপ্তাহিক",

    "Payroll Details": "পেরোল বিস্তারিত",

    "Period:": "সময়কাল:",

    "Total Gross Pay": "মোট গ্রস বেতন",

    "Total Deductions": "মোট ডিডাকশন",

    "Total Net Pay": "মোট নেট বেতন",

    "Employee Payslips": "কর্মচারী পে-স্লিপ",

    Employee: "কর্মচারী",

    "Gross Pay": "গ্রস বেতন",

    Deductions: "ডিডাকশন",

    "Net Pay": "নেট বেতন",

    "Print Payslip": "পে-স্লিপ প্রিন্ট করুন",
    "Manage members, points, and program settings.":
      "মেম্বার, পয়েন্ট এবং প্রোগ্রাম সেটিংস পরিচালনা করুন।",

    "Configure Program": "প্রোগ্রাম কনফিগার করুন",

    "Program Status": "প্রোগ্রাম স্ট্যাটাস",

    "Active Members": "সক্রিয় মেম্বার",

    "Total Points Outstanding": "মোট অব্যবহৃত পয়েন্ট",

    "Potential Reward Value: ৳": "সম্ভাব্য রিওয়ার্ড মূল্য:",

    "REWARDS AVAILABLE": "উপলব্ধ রিওয়ার্ড",

    "LAST ACTIVITY": "সর্বশেষ কার্যকলাপ",

    "Adjust Points": "পয়েন্ট সমন্বয় করুন",

    "View History": "হিস্ট্রি দেখুন",

    "Adjust Loyalty Points": "লয়ালটি পয়েন্ট সমন্বয় করুন",

    "Adjusting points for: ": "পয়েন্ট সমন্বয় করা হচ্ছে:",

    "Current Balance: ": "বর্তমান ব্যালেন্স:",

    "Enter positive to add, negative to subtract":
      "যোগ করতে পজিটিভ, বিয়োগ করতে নেগেটিভ মান লিখুন",

    "Reason for Adjustment": "সমন্বয়ের কারণ",

    "e.g., Promotion, Correction, Manual redemption":
      "যেমন: প্রোমোশন, সংশোধন, ম্যানুয়াল রিডেম্পশন",

    "Apply Adjustment": "সমন্বয় প্রয়োগ করুন",
    "Loyalty History": "লয়ালটি হিস্ট্রি",

    "Showing loyalty history for:": "লয়ালটি হিস্ট্রি দেখানো হচ্ছে:",

    TYPE: "টাইপ",

    "NEW BALANCE": "নতুন ব্যালেন্স",

    "Configure Loyalty Program": "লয়ালটি প্রোগ্রাম কনফিগার করুন",

    "Enable Loyalty Program": "লয়ালটি প্রোগ্রাম সক্রিয় করুন",

    "Points Earning": "পয়েন্ট অর্জন",

    "Points per BDT Spent": "প্রতি BDT খরচে পয়েন্ট",

    "Award points on tax amount": "ট্যাক্সের পরিমাণের উপর পয়েন্ট দিন",

    "Reward Configuration": "রিওয়ার্ড কনফিগারেশন",

    "Points Needed for Reward": "রিওয়ার্ডের জন্য প্রয়োজনীয় পয়েন্ট",

    "Reward Value (BDT)": "রিওয়ার্ড মূল্য (BDT)",

    "Reward Type": "রিওয়ার্ড টাইপ",

    "Max Rewards per Order": "প্রতি অর্ডারে সর্বোচ্চ রিওয়ার্ড",

    "Tier System": "টিয়ার সিস্টেম",

    "Define tiers based on points. Customers automatically move up. Tiers should be ordered by points ascending.":
      "পয়েন্টের ভিত্তিতে টিয়ার নির্ধারণ করুন। কাস্টমাররা স্বয়ংক্রিয়ভাবে উপরের টিয়ারে যাবে। টিয়ারগুলো পয়েন্ট অনুযায়ী ক্রমবর্ধমানভাবে সাজানো উচিত।",

    "Tier Name": "টিয়ার নাম",

    "Points Required": "প্রয়োজনীয় পয়েন্ট",

    "Discount %": "ডিসকাউন্ট %",

    Color: "রঙ",

    "Add Tier": "টিয়ার যোগ করুন",
    "Search by name or email...": "নাম বা ইমেইল দিয়ে সার্চ করুন...",

    "All Roles": "সব রোল",

    "JOINED ON": "যোগদানের তারিখ",

    "TOTAL SALES (30D)": "মোট বিক্রয় (৩০ দিন)",

    "Deactivation Pending": "ডিঅ্যাক্টিভেশন অপেক্ষমাণ",

    "View Performance": "পারফরম্যান্স দেখুন",

    "Edit Role/Status": "রোল / স্ট্যাটাস এডিট করুন",

    "Deactivate Account": "অ্যাকাউন্ট ডিঅ্যাক্টিভ করুন",

    "Delete Staff": "স্টাফ ডিলিট করুন",

    "This action is irreversible and will remove their access and data permanently.":
      "এই কাজটি আর ফেরানো যাবে না এবং তাদের অ্যাক্সেস ও ডেটা স্থায়ীভাবে মুছে যাবে।",

    "Yes, Delete Permanently": "হ্যাঁ, স্থায়ীভাবে ডিলিট করুন",

    Transactions: "লেনদেন",

    "Items Sold": "বিক্রিত আইটেম",

    "Performance:": "পারফরম্যান্স:",

    "(Last 30 Days)": "(গত ৩০ দিন)",

    "Are you sure you want to deactivate the account for":
      "আপনি কি নিশ্চিত এই অ্যাকাউন্টটি ডিঅ্যাক্টিভ করতে চান",

    "An inactive user will not be able to log in.":
      "ডিঅ্যাক্টিভ ইউজার লগইন করতে পারবে না।",

    "Edit Staff Member": "স্টাফ মেম্বার এডিট করুন",

    "Date of Birth": "জন্ম তারিখ",

    "Emergency Contact Name": "জরুরি যোগাযোগের নাম",

    "Emergency Contact Phone": "জরুরি যোগাযোগের ফোন",

    "Account Status": "অ্যাকাউন্ট স্ট্যাটাস",

    "Store Access": "স্টোর অ্যাক্সেস",

    "Grant Access": "অ্যাক্সেস দিন",

    "Remove Access": "অ্যাক্সেস সরান",

    "Select which store(s) you want to grant access to for":
      "যে স্টোর(গুলো)তে অ্যাক্সেস দিতে চান তা নির্বাচন করুন: ",

    "They will be added as a 'Cashier' by default.":
      "ডিফল্টভাবে তাদের 'Cashier' হিসেবে যোগ করা হবে।",

    "Grant Store Access": "স্টোর অ্যাক্সেস দিন",

    "Invite New Staff Member": "নতুন স্টাফ ইনভাইট করুন",
    "Recent Transactions": "সাম্প্রতিক লেনদেন",

    "Sales Trend (Last 30 Days)": "বিক্রয় প্রবণতা (গত ৩০ দিন)",

    "Performance (Last 30 Days)": "পারফরম্যান্স (গত ৩০ দিন)",

    "Personal Information": "ব্যক্তিগত তথ্য",

    "Contact Information": "যোগাযোগের তথ্য",

    "Back to Staff List": "স্টাফ তালিকায় ফিরে যান",

    "User Roles & Permissions": "ইউজার রোল ও অনুমতি",

    "Define what different roles can see and do within the system.":
      "সিস্টেমে বিভিন্ন রোল কী দেখতে ও কী করতে পারবে তা নির্ধারণ করুন।",

    "Reset to Defaults": "ডিফল্টে রিসেট করুন",

    "Dashboard & POS": "ড্যাশবোর্ড ও POS",

    "Can Access Dashboard": "ড্যাশবোর্ডে অ্যাক্সেস করতে পারবে",

    "Can view the main dashboard and analytics.":
      "মূল ড্যাশবোর্ড ও অ্যানালিটিক্স দেখতে পারবে।",

    "Can Use POS": "POS ব্যবহার করতে পারবে",

    "Can access and use the Point of Sale terminal.":
      "পয়েন্ট অফ সেল টার্মিনাল ব্যবহার করতে পারবে।",

    "Can Manage Invoices": "ইনভয়েস ম্যানেজ করতে পারবে",

    "Can view, create, and manage all invoices.":
      "সব ইনভয়েস দেখতে, তৈরি করতে ও পরিচালনা করতে পারবে।",

    "Can Directly Void Invoice": "সরাসরি ইনভয়েস ভয়েড করতে পারবে",

    "Can directly void an invoice without a prior request.":
      "পূর্ব অনুমতি ছাড়াই ইনভয়েস ভয়েড করতে পারবে।",

    "Can Process Returns": "রিটার্ন প্রক্রিয়া করতে পারবে",

    "Can process returns and issue credit.":
      "রিটার্ন গ্রহণ ও ক্রেডিট ইস্যু করতে পারবে।",

    "Inventory & Products": "ইনভেন্টরি ও পণ্য",

    "Can View Inventory": "ইনভেন্টরি দেখতে পারবে",

    "Can view the inventory list and product details.":
      "ইনভেন্টরি তালিকা ও পণ্যের বিস্তারিত দেখতে পারবে।",

    "Can Add Products": "পণ্য যোগ করতে পারবে",

    "Can add new products.": "নতুন পণ্য যোগ করতে পারবে।",

    "Can Edit Products": "পণ্য এডিট করতে পারবে",

    "Can edit existing products.": "বিদ্যমান পণ্য এডিট করতে পারবে।",

    "Can Deactivate Products": "পণ্য ডিঅ্যাক্টিভ করতে পারবে",

    "Can activate or deactivate products.":
      "পণ্য অ্যাক্টিভ বা ডিঅ্যাক্টিভ করতে পারবে।",

    "Can Delete Products": "পণ্য ডিলিট করতে পারবে",

    "Cannot permanently delete products.":
      "পণ্য স্থায়ীভাবে ডিলিট করতে পারবে না।",

    "Can Generate Barcodes": "বারকোড জেনারেট করতে পারবে",

    "Can access the barcode generator tool.":
      "বারকোড জেনারেটর টুল ব্যবহার করতে পারবে।",

    "Purchasing & Suppliers": "ক্রয় ও সাপ্লায়ার",

    "Can Manage Suppliers": "সাপ্লায়ার ম্যানেজ করতে পারবে",

    "Can add, edit, and manage suppliers.":
      "সাপ্লায়ার যোগ, এডিট ও পরিচালনা করতে পারবে।",

    "Can View Purchase Orders": "পারচেজ অর্ডার দেখতে পারবে",

    "Can view all purchase orders.": "সব পারচেজ অর্ডার দেখতে পারবে।",

    "Can Create Purchase Orders": "পারচেজ অর্ডার তৈরি করতে পারবে",

    "Can create new purchase orders.": "নতুন পারচেজ অর্ডার তৈরি করতে পারবে।",

    "Can Update Purchase Orders": "পারচেজ অর্ডার আপডেট করতে পারবে",

    "Can update purchase orders (e.g., mark as received).":
      "পারচেজ অর্ডার আপডেট করতে পারবে (যেমন: Received হিসেবে মার্ক করা)।",

    "Can Delete Purchase Orders": "পারচেজ অর্ডার ডিলিট করতে পারবে",

    "Cannot delete purchase orders.": "পারচেজ অর্ডার ডিলিট করতে পারবে না।",

    "Sales & CRM": "বিক্রয় ও CRM",

    "Can Manage Customers": "কাস্টমার ম্যানেজ করতে পারবে",

    "Can add, edit, and delete customer profiles.":
      "কাস্টমার প্রোফাইল যোগ, এডিট ও ডিলিট করতে পারবে।",

    "Can Manage Quotations": "কোটেশন ম্যানেজ করতে পারবে",

    "Can create, edit, and manage all quotations.":
      "সব কোটেশন তৈরি, এডিট ও পরিচালনা করতে পারবে।",

    "Can Delete Quotations": "কোটেশন ডিলিট করতে পারবে",

    "Cannot permanently delete quotations.":
      "কোটেশন স্থায়ীভাবে ডিলিট করতে পারবে না।",

    "Can Convert To Invoice": "ইনভয়েসে রূপান্তর করতে পারবে",

    "Can convert a quotation into a sales invoice.":
      "কোটেশনকে বিক্রয় ইনভয়েসে রূপান্তর করতে পারবে।",

    "Can Manage Loyalty": "লয়ালটি প্রোগ্রাম ম্যানেজ করতে পারবে",

    "Can configure and manage the loyalty program.":
      "লয়ালটি প্রোগ্রাম কনফিগার ও পরিচালনা করতে পারবে।",

    "Finance & Expenses": "ফাইন্যান্স ও খরচ",

    "Can Add Expenses": "খরচ যোগ করতে পারবে",

    "Can add new business expenses.": "নতুন ব্যবসায়িক খরচ যোগ করতে পারবে।",

    "Can Edit Expenses": "খরচ এডিট করতে পারবে",

    "Cannot edit expenses.": "খরচ এডিট করতে পারবে না।",

    "Can Delete Expenses": "খরচ ডিলিট করতে পারবে",

    "Cannot delete expenses.": "খরচ ডিলিট করতে পারবে না।",

    "Can Manage Payroll": "পেরোল ম্যানেজ করতে পারবে",

    "Cannot manage payroll.": "পেরোল ম্যানেজ করতে পারবে না।",

    "Reporting & Analytics": "রিপোর্ট ও অ্যানালিটিক্স",

    "Can Access Reports": "রিপোর্টে অ্যাক্সেস করতে পারবে",

    "Can generate and view all business reports.":
      "সব ব্যবসায়িক রিপোর্ট তৈরি ও দেখতে পারবে।",

    "Can See All Reports": "সব রিপোর্ট দেখতে পারবে",

    "Can see reports for all staff, not just their own.":
      "শুধু নিজের নয়, সব স্টাফের রিপোর্ট দেখতে পারবে।",

    "Can View Profit And Loss": "লাভ-ক্ষতি দেখতে পারবে",

    "Can view gross profit, cost prices, and other profit-related metrics.":
      "গ্রস লাভ, ক্রয়মূল্য ও অন্যান্য লাভসংক্রান্ত মেট্রিক দেখতে পারবে।",

    Administration: "অ্যাডমিনিস্ট্রেশন",

    "Can Manage Staff": "স্টাফ ম্যানেজ করতে পারবে",

    "Can invite and manage staff roles and permissions.":
      "স্টাফ ইনভাইট ও রোল-অনুমতি পরিচালনা করতে পারবে।",

    "Can Manage Roles": "রোল ম্যানেজ করতে পারবে",

    "Can view and edit user role permissions.":
      "ইউজার রোলের অনুমতি দেখতে ও এডিট করতে পারবে।",

    "Can Manage Settings": "সেটিংস ম্যানেজ করতে পারবে",

    "Can change store settings, receipt templates, etc.":
      "স্টোর সেটিংস, রিসিপ্ট টেমপ্লেট ইত্যাদি পরিবর্তন করতে পারবে।",

    "Can Manage Warranties": "ওয়ারেন্টি ম্যানেজ করতে পারবে",

    "Can view warranties and create/manage warranty claims.":
      "ওয়ারেন্টি দেখতে ও ওয়ারেন্টি ক্লেইম তৈরি/পরিচালনা করতে পারবে।",

    "Can Manage Subscription": "সাবস্ক্রিপশন ম্যানেজ করতে পারবে",

    "Can view and manage the store subscription.":
      "স্টোর সাবস্ক্রিপশন দেখতে ও পরিচালনা করতে পারবে।",

    "Can Invite Cashiers": "ক্যাশিয়ার ইনভাইট করতে পারবে",

    "Can invite new cashiers, pending admin approval.":
      "নতুন ক্যাশিয়ার ইনভাইট করতে পারবে (অ্যাডমিন অনুমোদন সাপেক্ষে)।",

    "Can View Staff Performance": "স্টাফ পারফরম্যান্স দেখতে পারবে",

    "Can view performance reports for staff.":
      "স্টাফদের পারফরম্যান্স রিপোর্ট দেখতে পারবে।",

    "Can Request Staff Deactivation":
      "স্টাফ ডিঅ্যাক্টিভেশনের অনুরোধ করতে পারবে",

    "Can request to deactivate a cashier, pending admin approval.":
      "ক্যাশিয়ার ডিঅ্যাক্টিভেশনের অনুরোধ করতে পারবে (অ্যাডমিন অনুমোদন সাপেক্ষে)।",

    "Can Edit Cashier Details": "ক্যাশিয়ারের তথ্য এডিট করতে পারবে",

    "Can edit basic details of a cashier, like their name.":
      "ক্যাশিয়ারের নামের মতো মৌলিক তথ্য এডিট করতে পারবে।",
    "Can Request Invoice Void": "ইনভয়েস বাতিলের অনুরোধ করতে পারবে",
    "Can request to void an invoice, pending manager approval.":
      "ম্যানেজারের অনুমোদনের অপেক্ষায় থাকা অবস্থায় ইনভয়েস বাতিলের অনুরোধ করতে পারবে",

    "Can Cancel Void Request": "ইনভয়েস বাতিলের অনুরোধ বাতিল করতে পারবে",
    "Can cancel their own pending void requests.":
      "নিজের করা অপেক্ষমাণ বাতিলের অনুরোধ বাতিল করতে পারবে",

    "Cannot process returns.": "রিটার্ন প্রক্রিয়া করতে পারবে না",

    "Cannot access the barcode generator tool.":
      "বারকোড জেনারেটর টুল ব্যবহার করতে পারবে না",

    "Cannot manage suppliers.": "সাপ্লায়ার ব্যবস্থাপনা করতে পারবে না",

    "Cannot view purchase orders.": "Purchase Order দেখতে পারবে না",

    "Cannot create purchase orders.": "Purchase Order তৈরি করতে পারবে না",

    "Cannot update purchase orders.": "Purchase Order আপডেট করতে পারবে না",

    "Cannot convert a quotation into a sales invoice.":
      "কোটেশনকে সেলস ইনভয়েসে রূপান্তর করতে পারবে না",

    "Cannot add new business expenses.":
      "নতুন ব্যবসায়িক খরচ যোগ করতে পারবে না",
    "Can view warranties and create new warranty claims.":
      "ওয়ারেন্টি দেখতে এবং নতুন ওয়ারেন্টি ক্লেইম তৈরি করতে পারবে",
    "Your plan renews on": "আপনার প্ল্যান নবায়ন হবে ",

    "Upgrade Plan": "প্ল্যান আপগ্রেড করুন",

    "days remaining": "দিন বাকি",

    "Subscription Management": "সাবস্ক্রিপশন ম্যানেজমেন্ট",

    "View your current plan, usage, and upgrade options.":
      "আপনার বর্তমান প্ল্যান, ব্যবহার এবং আপগ্রেড অপশন দেখুন।",
    "Business Profile": "বিজনেস প্রোফাইল",

    "Select your primary business type to tailor the system experience.":
      "সিস্টেমের অভিজ্ঞতা কাস্টমাইজ করতে আপনার প্রধান ব্যবসার ধরন নির্বাচন করুন।",

    "General Store": "জেনারেল স্টোর",

    "Super Shop": "সুপার শপ",

    "Electronics Store": "ইলেকট্রনিক্স স্টোর",

    Pharmacy: "ফার্মেসি",

    Restaurant: "রেস্টুরেন্ট",

    "Apparel Boutique": "অ্যাপারেল বুটিক",

    "Repair Services": "রিপেয়ার সার্ভিস",

    "Salon & Spa": "সালন ও স্পা",

    "Consulting Agency": "কনসাল্টিং এজেন্সি",

    "Digital Services / SaaS": "ডিজিটাল সার্ভিস / SaaS",

    "Create Your Own": "নিজের মতো তৈরি করুন",

    "Store Information": "স্টোর তথ্য",

    "Store Name": "স্টোরের নাম",

    "Contact Phone": "যোগাযোগ নম্বর",

    "Store Address": "স্টোরের ঠিকানা",

    "Social Media Handle": "সোশ্যাল মিডিয়া হ্যান্ডেল",

    "Currency Settings": "কারেন্সি সেটিংস",

    "Default Display Currency": "ডিফল্ট ডিসপ্লে কারেন্সি",

    "This is the currency the POS will default to on launch.":
      "POS চালু হলে এই কারেন্সিটিই ডিফল্ট হিসেবে ব্যবহৃত হবে।",

    "Tax Settings": "ট্যাক্স সেটিংস",

    "Default Tax Rate (%)": "ডিফল্ট ট্যাক্স রেট (%)",

    "Unit Settings": "ইউনিট সেটিংস",

    "Default Unit of Measurement": "ডিফল্ট পরিমাপ ইউনিট",

    "This will be the pre-selected unit when creating a new product.":
      "নতুন প্রোডাক্ট তৈরি করার সময় এই ইউনিটটি আগে থেকেই নির্বাচিত থাকবে।",

    "Receipt & Invoice Customization": "রিসিপ্ট ও ইনভয়েস কাস্টমাইজেশন",

    "Choose the default design for printed and digital receipts.":
      "প্রিন্টেড ও ডিজিটাল রিসিপ্টের জন্য ডিফল্ট ডিজাইন নির্বাচন করুন।",

    Futuristic: "ফিউচারিস্টিক",

    "Thermal Receipt": "থার্মাল রিসিপ্ট",

    "Customize the promotional text that appears at the bottom of your receipts. Use a new line for each separate message.":
      "রিসিপ্টের নিচে দেখানো প্রোমোশনাল টেক্সট কাস্টমাইজ করুন। প্রতিটি আলাদা মেসেজের জন্য নতুন লাইন ব্যবহার করুন।",

    Appearance: "অ্যাপিয়ারেন্স",

    Automation: "অটোমেশন",

    "Interface Theme": "ইন্টারফেস থিম",

    "Visual Command Center": "ভিজ্যুয়াল কমান্ড সেন্টার",

    "Personalize your CashShilpo experience":
      "আপনার CashShilpo অভিজ্ঞতা ব্যক্তিগতভাবে কাস্টমাইজ করুন",

    "POS Layout": "POS লেআউট",

    "Choose the layout for your Point of Sale terminal.":
      "আপনার Point of Sale টার্মিনালের জন্য লেআউট নির্বাচন করুন।",

    "Classic List View": "ক্লাসিক লিস্ট ভিউ",

    "Modern Grid View": "মডার্ন গ্রিড ভিউ",
    "Let AI handle the routine tasks. Enable smart automations to boost efficiency and drive sales.":
      "রুটিন কাজগুলো AI-এর হাতে ছেড়ে দিন। স্মার্ট অটোমেশন চালু করে দক্ষতা বাড়ান এবং বিক্রি বৃদ্ধি করুন।",

    "Inventory Optimization AI": "ইনভেন্টরি অপটিমাইজেশন AI",

    "Get AI suggestions on what to stock, promote, or discontinue.":
      "কোন পণ্য স্টক করবেন, প্রোমোট করবেন বা বন্ধ করবেন—সে বিষয়ে AI-এর পরামর্শ পান।",

    "Dynamic Pricing Suggestions": "ডায়নামিক প্রাইসিং সাজেশন",

    "Get AI-powered price suggestions based on sales data and trends.":
      "বিক্রির ডাটা ও ট্রেন্ডের উপর ভিত্তি করে AI-চালিত মূল্য প্রস্তাবনা পান।",

    "Automated End-of-Day Reports": "অটোমেটেড এন্ড-অফ-ডে রিপোর্ট",

    "Receive an automated sales summary via notification each day.":
      "প্রতিদিন নোটিফিকেশনের মাধ্যমে স্বয়ংক্রিয় সেলস সামারি পান।",

    "AI-Powered Fraud Detection": "AI-পাওয়ারড ফ্রড ডিটেকশন",

    "Monitor transactions for suspicious activity in real-time.":
      "রিয়েল-টাইমে সন্দেহজনক কার্যকলাপের জন্য ট্রানজ্যাকশন মনিটর করুন।",
    "Choose how often the AI should analyze your inventory and sales data to provide optimization suggestions.":
      "অপ্টিমাইজেশন সাজেশন দিতে AI কত ঘন ঘন আপনার ইনভেন্টরি ও সেলস ডাটা বিশ্লেষণ করবে তা নির্বাচন করুন।",

    "Analysis Frequency": "অ্যানালাইসিস ফ্রিকোয়েন্সি",

    "Suggestions will appear as notifications and on your dashboard.":
      "সাজেশনগুলো নোটিফিকেশন হিসেবে এবং আপনার ড্যাশবোর্ডে দেখানো হবে।",

    Daily: "দৈনিক",

    "Let the AI adjust pricing to maximize profit based on different strategies.":
      "ভিন্ন ভিন্ন স্ট্রাটেজির ভিত্তিতে লাভ সর্বোচ্চ করতে AI-কে প্রাইস অ্যাডজাস্ট করতে দিন।",

    "Pricing Strategy": "প্রাইসিং স্ট্রাটেজি",

    "The AI will suggest price changes which you can approve or reject.":
      "AI প্রাইস পরিবর্তনের প্রস্তাব দেবে, যা আপনি অনুমোদন বা বাতিল করতে পারবেন।",

    "Balanced (Moderate adjustments)": "ব্যালান্সড (মাঝারি পরিবর্তন)",

    "Conservative (Minor adjustments)": "কনজারভেটিভ (স্বল্প পরিবর্তন)",

    "Aggressive (Maximize revenue)": "অ্যাগ্রেসিভ (রেভিনিউ সর্বোচ্চ করা)",

    "Set a time for the system to automatically compile and deliver your end-of-day sales summary.":
      "দিন শেষে সেলস সামারি স্বয়ংক্রিয়ভাবে প্রস্তুত ও পাঠানোর সময় নির্ধারণ করুন।",

    "Report Delivery Time": "রিপোর্ট ডেলিভারি সময়",

    "The report will be generated daily at this time and sent as a notification.":
      "এই সময়ে প্রতিদিন রিপোর্ট তৈরি হবে এবং নোটিফিকেশন হিসেবে পাঠানো হবে।",

    "Set the sensitivity for detecting potentially fraudulent transactions.":
      "সম্ভাব্য প্রতারণামূলক লেনদেন শনাক্ত করার সংবেদনশীলতা নির্ধারণ করুন।",

    "Detection Sensitivity": "ডিটেকশন সেনসিটিভিটি",

    "High sensitivity may flag normal transactions occasionally.":
      "উচ্চ সেনসিটিভিটিতে মাঝে মাঝে স্বাভাবিক লেনদেনও ফ্ল্যাগ হতে পারে।",

    "High (More alerts, catches more suspicious activity)":
      "হাই (বেশি অ্যালার্ট, বেশি সন্দেহজনক কার্যকলাপ ধরবে)",

    "Medium (Balanced approach)": "মিডিয়াম (ব্যালান্সড অ্যাপ্রোচ)",
    Daybook: "ডেবুক",

    Summary: "সামারি",

    "Cash Flow": "ক্যাশ ফ্লো",

    "Due & Discounts": "ডিউ ও ডিসকাউন্ট",

    "Opening Balance": "ওপেনিং ব্যালেন্স",

    "Payments Received": "প্রাপ্ত পেমেন্ট",

    "Due / EMI Collected": "ডিউ / EMI কালেক্টেড",

    "New Due / Loan Given": "নতুন ডিউ / লোন দেওয়া",

    "Net Cash Movement": "নেট ক্যাশ মুভমেন্ট",

    "Print Daybook": "ডেবুক প্রিন্ট করুন",

    "Closing Balance": "ক্লোজিং ব্যালেন্স",

    "Sales by Customer": "কাস্টমার অনুযায়ী সেলস",

    "All Sales Invoices": "সব সেলস ইনভয়েস",

    "All Expenses": "সব এক্সপেন্স",

    "Payments by Method": "মেথড অনুযায়ী পেমেন্ট",

    "Due Collected & EMI Payments": "ডিউ কালেক্টেড ও EMI পেমেন্ট",

    "Items Sold Today": "আজ বিক্রি হওয়া আইটেম",

    "New Due Amounts Added (Credit & EMI Loans)":
      "নতুন ডিউ অ্যামাউন্ট যোগ হয়েছে (ক্রেডিট ও EMI লোন)",

    "Discounts Given": "ডিসকাউন্ট দেওয়া হয়েছে",

    "No discounts given.": "কোনো ডিসকাউন্ট দেওয়া হয়নি।",

    "No sales by customer.": "কাস্টমার অনুযায়ী কোনো সেলস নেই।",

    "No sales recorded for this date.": "এই তারিখে কোনো সেলস রেকর্ড নেই।",

    "No expenses by category.": "ক্যাটাগরি অনুযায়ী কোনো এক্সপেন্স নেই।",

    "No expenses recorded for this date.":
      "এই তারিখে কোনো এক্সপেন্স রেকর্ড নেই।",

    "No due collections recorded.": "কোনো ডিউ কালেকশন রেকর্ড নেই।",

    "No items sold recorded for this date.":
      "এই তারিখে কোনো আইটেম বিক্রির রেকর্ড নেই।",

    "No new due amounts added.": "কোনো নতুন ডিউ অ্যামাউন্ট যোগ হয়নি।",

    "Global Search": "গ্লোবাল সার্চ",

    "Find anything in your store instantly.":
      "আপনার স্টোরের যেকোনো কিছু তাৎক্ষণিক খুঁজুন।",

    "Search products, customers, invoices":
      "প্রোডাক্ট, কাস্টমার, ইনভয়েস সার্চ করুন",

    PRODUCTS: "PRODUCTS",

    Global: "গ্লোবাল",

    "Open universal search": "ইউনিভার্সাল সার্চ খুলুন",

    "Close all open tabs": "সব খোলা ট্যাব বন্ধ করুন",

    "Show this shortcuts guide": "এই শর্টকাট গাইড দেখান",

    "Close modals & menus": "মোডাল ও মেনু বন্ধ করুন",

    Navigation: "নেভিগেশন",

    "Go to Dashboard": "ড্যাশবোর্ডে যান",

    "Go to POS Terminal": "POS টার্মিনালে যান",

    "Go to Invoices": "ইনভয়েসে যান",

    "Go to Inventory": "ইনভেন্টরিতে যান",

    "Go to Customers": "কাস্টমারে যান",

    "Go to Reports": "রিপোর্টে যান",

    "Go to Settings": "সেটিংসে যান",

    "Go to User Roles": "ইউজার রোলে যান",

    "Go to Staff": "স্টাফে যান",

    "Go to Expenses": "এক্সপেন্সে যান",

    "Go to Suppliers": "সাপ্লায়ারে যান",

    "Go to Purchase Orders": "পারচেজ অর্ডারে যান",

    "Go to Barcode Generator": "বারকোড জেনারেটরে যান",

    "Focus Product search": "প্রোডাক্ট সার্চে ফোকাস করুন",

    "Open Payment screen": "পেমেন্ট স্ক্রিন খুলুন",

    "Add Customer to sale": "সেলে কাস্টমার যোগ করুন",

    "Create a new sale tab": "নতুন সেল ট্যাব তৈরি করুন",

    Forms: "ফর্মস",

    "Save changes in forms": "ফর্মের পরিবর্তন সংরক্ষণ করুন",
    Notifications: "নোটিফিকেশনস",

    "You have no notifications.": "আপনার কোনো নোটিফিকেশন নেই।",

    Calculator: "ক্যালকুলেটর",

    "Advanced Tools": "অ্যাডভান্সড টুলস",

    "Profit Margin": "প্রফিট মার্জিন",

    "Original Price": "মূল দাম",

    "Final Price": "চূড়ান্ত দাম",

    "Price (before tax)": "দাম (ট্যাক্সের আগে)",

    "Tax Rate (%)": "ট্যাক্স রেট (%)",

    "Tax Amount": "ট্যাক্স অ্যামাউন্ট",

    "Total (with tax)": "মোট (ট্যাক্সসহ)",

    "Currency Converter": "কারেন্সি কনভার্টার",

    From: "থেকে",

    To: "তে",

    "Converted Amount": "রূপান্তরিত অ্যামাউন্ট",

    "Loan EMI": "লোন EMI",

    "Loan Amount": "লোন অ্যামাউন্ট",

    "Interest Rate (%)": "ইন্টারেস্ট রেট (%)",

    "Tenure (Years)": "মেয়াদ (বছর)",

    "Monthly EMI": "মাসিক EMI",

    "Compound Interest": "কম্পাউন্ড ইন্টারেস্ট",

    "Principal Amount": "প্রিন্সিপাল অ্যামাউন্ট",

    "Annual Rate (%)": "বার্ষিক রেট (%)",

    Years: "বছর",

    "Future Value": "ফিউচার ভ্যালু",

    "Breakeven Point": "ব্রেকইভেন পয়েন্ট",

    "Fixed Costs": "ফিক্সড কস্ট",

    "Price per Unit": "প্রতি ইউনিট মূল্য",

    "Cost per Unit": "প্রতি ইউনিট খরচ",

    "Breakeven Units": "ব্রেকইভেন ইউনিটস",

    "Breakeven Revenue": "ব্রেকইভেন রেভিনিউ",
  };

  // 4. TRANSLATION LOGIC
  function translateText(text) {
    if (!text || !text.trim()) return text;
    const trimmed = text.trim();
    // Check exact match
    if (dictionary[trimmed]) return dictionary[trimmed];
    // Check case-insensitive
    const lowerKey = Object.keys(dictionary).find(
      (k) => k.toLowerCase() === trimmed.toLowerCase()
    );
    if (lowerKey) return dictionary[lowerKey];
    // Basic plural check (e.g., "Customers" -> "কাস্টমার")
    if (trimmed.endsWith("s")) {
      const singular = trimmed.slice(0, -1);
      if (dictionary[singular]) return dictionary[singular] + "সমূহ";
    }
    return text;
  }

  function processNode(node) {
    // Skip script, style, and our toggle card to prevent recursive translation
    if (
      node.tagName === "SCRIPT" ||
      node.tagName === "STYLE" ||
      (node.id && node.id === "lang-toggle-card")
    )
      return;

    // TEXT NODES
    if (node.nodeType === 3) {
      const text = node.nodeValue;
      if (!text.trim()) return;

      const translated = translateText(text);
      if (translated !== text) {
        node.nodeValue = translated;
      }
      return;
    }

    // ELEMENT NODES
    if (node.nodeType === 1) {
      // Translate Placeholder
      const ph = node.getAttribute("placeholder");
      if (ph) {
        const translatedPh = translateText(ph);
        if (translatedPh !== ph) node.setAttribute("placeholder", translatedPh);
      }

      // Translate Title
      const title = node.getAttribute("title");
      if (title) {
        const translatedTitle = translateText(title);
        if (translatedTitle !== title)
          node.setAttribute("title", translatedTitle);
      }

      // Recursively process child nodes
      node.childNodes.forEach((child) => processNode(child));
    }
  }

  // 5. OBSERVER & INJECTION LOGIC
  const observer = new MutationObserver((mutations) => {
    // A. Inject Toggle if Settings Page is visible
    const settingsForm = document.getElementById("settings-form");
    // Check if settings exist and toggle is not yet injected
    if (settingsForm && !document.getElementById("lang-toggle-card")) {
      injectLanguageToggle(settingsForm);
    }

    // B. Translate content if Bangla is enabled
    if (currentLang === "bn") {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            processNode(node);
          });
        }
      });
    }
  });

  // Start Observing the body
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["placeholder", "title"],
  });

  // 6. TOGGLE UI INJECTION FUNCTION
  function injectLanguageToggle(container) {
    // Look for the header title in settings to place the toggle after it
    const header = container.querySelector("h1");

    const toggleCard = document.createElement("div");
    toggleCard.id = "lang-toggle-card";

    // Determine labels based on current language
    const titleText =
      currentLang === "bn"
        ? "সিস্টেমের ভাষা (System Language)"
        : "System Language";
    const descText =
      currentLang === "bn"
        ? "ইংরেজি এবং বাংলার মধ্যে পরিবর্তন করুন।"
        : "Toggle between English and Bengali interface.";
    const labelText = currentLang === "bn" ? "বাংলা" : "Bangla";

    toggleCard.innerHTML = `
            <div>
                <h4 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary, #f0f0f0);">${titleText}</h4>
                <p style="font-size: 0.875rem; color: var(--text-secondary, #a0a0a0); margin-top: 0.25rem;">${descText}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">${labelText}</span>
                <label class="lang-switch">
                    <input type="checkbox" id="cashshilpo-lang-checkbox" ${
                      currentLang === "bn" ? "checked" : ""
                    }>
                    <span class="lang-slider"></span>
                </label>
            </div>
        `;

    // Insert after header if it exists, otherwise prepend to container
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(toggleCard, header.nextSibling);
    } else {
      container.prepend(toggleCard);
    }

    // Add Event Listener
    const checkbox = toggleCard.querySelector("#cashshilpo-lang-checkbox");
    checkbox.addEventListener("change", (e) => {
      const newLang = e.target.checked ? "bn" : "en";
      setLanguage(newLang);
    });
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(PREF_KEY, lang);

    if (lang === "bn") {
      document.body.classList.add("lang-bn");
      // Translate existing content immediately
      processNode(document.body);
      // Update toggle card text manually for immediate feedback
      const card = document.getElementById("lang-toggle-card");
      if (card) {
        card.querySelector("h4").textContent =
          "সিস্টেমের ভাষা (System Language)";
        card.querySelector("p").textContent =
          "ইংরেজি এবং বাংলার মধ্যে পরিবর্তন করুন।";
      }
    } else {
      document.body.classList.remove("lang-bn");
      // Reload to restore original English text cleanly
      location.reload();
    }
  }

  // 7. INITIAL RUN
  if (currentLang === "bn") {
    document.body.classList.add("lang-bn");
    // Delay slightly to ensure body content is parsed
    setTimeout(() => processNode(document.body), 100);
  }
})();
