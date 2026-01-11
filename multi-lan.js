/**
 * CashShilpo Multi-Language & Feature Injection Engine
 * * Features:
 * 1. Injects 6 new premium features into the features grid automatically.
 * 2. Provides high-conversion, enthusiastic translations (English <-> Bangla).
 * 3. Handles language toggling and persistence.
 * 4. Normalizes text whitespace to ensure multi-line HTML paragraphs translate correctly.
 */

(function () {
  // --- Configuration ---
  const CONFIG = {
    fontFamily: "'Hind Siliguri', sans-serif",
    googleFontUrl:
      "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap",
    storageKey: "cashshilpo_lang_pref",
    accentColor: "#39ff14",
  };

  // --- Dictionary (English -> Bangla) ---
  // Persuasive, marketing-focused translations.
  const DICTIONARY = {
    // --- NEW FEATURES (Added dynamically) ---
    "System Language": "সিস্টেম ল্যাঙ্গুয়েজ",
    "Toggle between English and Bengali interface.":
      "যখন খুশি ইংরেজি থেকে বাংলায় সুইচ করুন। আপনার ব্যবসার ভাষা হোক আপনার নিজের ভাষায়।",

    "Interface Theme": "ইন্টারফেস থিম",
    "Select a look and feel for your workspace.":
      "আপনার পছন্দমতো ডার্ক বা লাইট থিম বেছে নিন। কাজের পরিবেশ হোক চোখের জন্য আরামদায়ক।",

    "Visual Command Center": "ভিজুয়াল কমান্ড সেন্টার",
    "Personalize your CashShilpo experience.":
      "ক্যাশশিল্পোকে সাজিয়ে নিন একদম আপনার মনের মতো করে। এটি শুধু সফটওয়্যার নয়, আপনার পার্সোনাল অ্যাসিস্ট্যান্ট।",

    "POS Layout": "POS লেআউট কাস্টমাইজেশন",
    "Customize your point of sale screen for maximum speed and comfort.":
      "বিক্রয় স্ক্রিনটি সাজান এমনভাবে, যেন কাস্টমার হ্যান্ডেল করা যায় চোখের পলকে।",

    "Advanced EMI System": "অ্যাডভান্সড কিস্তি (EMI) সুবিধা",
    "Offer flexible installment plans to customers and track EMI payments automatically.":
      "কাস্টমারকে দিন সহজ কিস্তিতে পণ্য কেনার সুযোগ। সফটওয়্যারই রাখবে কিস্তির পাই-টু-পাই হিসাব।",

    "Smart Actions & Automation": "স্মার্ট অটোমেশন ও AI",
    "Let AI handle the routine tasks. Enable smart automations to boost efficiency and drive sales.":
      "রুটিন কাজগুলো ছেড়ে দিন AI-এর হাতে। সময় বাঁচান, বিক্রি বাড়ান এবং ব্যবসায় আনুন আধুনিকতার ছোঁয়া।",

    // --- EXISTING CONTENT ---
    // Nav & General
    Features: "ফিচারসমূহ",
    Pricing: "প্যাকেজসমূহ",
    Support: "হেল্পলাইন",
    "Get Started": "যাত্রা শুরু করুন",
    "Start Free Trial": "ফ্রি ট্রায়াল চালু করুন",
    "Start Your 7-Day Free Trial": "৭ দিনের জন্য ফ্রি ব্যবহার করুন",
    Company: "প্রতিষ্ঠান",
    Legal: "আইনি তথ্যাদি",
    Product: "প্রোডাক্ট",
    "About Us": "আমাদের গল্প",
    Blog: "ব্লগ",
    Careers: "ক্যারিয়ার",
    Contact: "যোগাযোগ করুন",
    "Privacy Policy": "গোপনীয়তা নীতি",
    "Terms of Service": "শর্তাবলী",
    "Cookie Policy": "কুকি পলিসি",
    "Subscribe to our newsletter": "আমাদের নিউজলেটারে যুক্ত হোন",
    Subscribe: "সাবস্ক্রাইব",
    "Enter your email": "আপনার ইমেইল লিখুন",
    "All rights reserved.": "সর্বস্বত্ব সংরক্ষিত।",

    // Hero Section
    "MANAGE YOUR BUSINESS,": "আপনার ব্যবসার পূর্ণ নিয়ন্ত্রণ নিন,",
    "SIMPLY &": "খুব সহজে ও",
    "SMARTLY.": " স্মার্ট প্রযুক্তিতে ।",
    "CashShilpo is the all-in-one POS software designed to streamline your operations, manage inventory, and boost your sales. Stop guessing, start growing.":
      "ক্যাশশিল্পো—আপনার ব্যবসার এক কমপ্লিট সলিউশন। ইনভেন্টরি থেকে সেলস, সবকিছু সামলান এক নিমিষেই। অনুমান নয়, সঠিক তথ্যের ভিত্তিতে ব্যবসার গ্রোথ নিশ্চিত করুন আজই।",

    // Trusted By
    "Trusted by businesses like yours":
      "আপনার মতো হাজারো সফল উদ্যোক্তার আস্থার প্রতীক",

    // Command Center
    "THIS IS YOUR NEW": "এটিই আপনার ব্যবসার ",
    "COMMAND CENTER.": "ডিজিটাল পাওয়ারহাউজ।",
    "One clean, powerful dashboard to control your entire business. From sales to stock, it's all right here.":
      "একটি শক্তিশালী ড্যাশবোর্ড, যা দিয়ে পুরো ব্যবসা পরিচালনা করা এখন পানির মতো সহজ। বিক্রি থেকে স্টক—সবকিছুর হিসাব এখন চোখের সামনে।",

    // Pillars
    "FEATURES BUILT FOR": "আপনার ব্যবসার অগ্রগতির জন্য ",
    "YOUR BUSINESS.": "তৈরি বিশেষ ফিচারসমূহ।",
    "CashShilpo is built on three core pillars designed to simplify your workday and accelerate your growth.":
      "ক্যাশশিল্পো এমনভাবে তৈরি করা হয়েছে যা আপনার প্রতিদিনের কাজকে করবে সহজ এবং ব্যবসার গতি বাড়াবে বহুগুণ।",

    // Pillar 1: Sales
    "Streamline Sales": "বিক্রয় হোক চোখের পলকে",
    "Sell Faster, Sell Smarter.": "দ্রুত বিক্রি করুন, নির্ভুল হিসাব রাখুন।",
    "A blazingly fast, intuitive, and customizable checkout process. Handle sales, returns, discounts, and split payments with just a few taps.":
      "বিদ্যুৎগতিতে চেকআউট করার অভিজ্ঞতা। সেলস, রিটার্ন, ডিসকাউন্ট কিংবা বকেয়া—সব সামলান মাত্র কয়েক ক্লিকেই।",

    // Pillar 2: Inventory
    "Master Your Inventory": "ইনভেন্টরি এখন আপনার হাতের মুঠোয়",
    "Never Run Out of Stock.": "স্টক শেষ হওয়ার আগেই জানুন।",
    "Real-time stock tracking across all your locations. Get automatic low-stock alerts, create purchase orders, and manage suppliers.":
      "আপনার সকল শোরুমের রিয়েল-টাইম স্টক আপডেট। স্টক ফুরিয়ে যাওয়ার আগেই অটোমেটিক অ্যালার্ট পান এবং সাপ্লায়ার ম্যানেজ করুন স্মার্টলি।",

    // Pillar 3: Analytics
    "Grow Your Business": "ব্যবসার পরিধি বাড়ান",
    "Understand Your Data.": "ব্যবসার নাড়িনক্ষত্র জানুন।",
    "Get detailed insights into your sales, top-performing products, and customer behavior to make data-driven decisions.":
      "কোন পণ্যটি বেশি চলছে? লাভ কেমন হচ্ছে? ব্যবসার সব গোপন তথ্য জেনে সঠিক সিদ্ধান্ত নিন এবং মুনাফা বাড়ান।",

    // Marquee
    "SELL FASTER •": "দ্রুত বিক্রি করুন •",
    "TRACK INVENTORY •": "স্টক ট্র্যাক করুন •",
    "MANAGE CUSTOMERS •": "কাস্টমার ধরে রাখুন •",
    "BOOST YOUR SALES •": "বিক্রয় বৃদ্ধি করুন •",

    // Features Grid Header
    "AND EVERYTHING ELSE YOU NEED.":
      "এবং আরও যা যা আপনার প্রয়োজন—সব আছে এখানে।",
    "CashShilpo is a complete toolkit. We've thought of everything so you don't have to.":
      "ক্যাশশিল্পো একটি স্বয়ংসম্পূর্ণ টুলকিট। আপনার ব্যবসার প্রতিটি খুঁটিনাটি প্রয়োজনের কথা ভেবেই আমরা এটি সাজিয়েছি।",

    // Features List - Punchy Titles & Descriptions
    "Analytics Dashboard": "অ্যানালিটিক্স ড্যাশবোর্ড",
    "Your complete business overview with sales trends, top products, and profit metrics.":
      "এক নজরে পুরো ব্যবসার হালচাল, লাভ-ক্ষতি এবং সেরা পণ্যের রিপোর্ট।",
    "POS Terminal": "আধুনিক পজ টার্মিনাল",
    "A blazingly fast and intuitive checkout system with cart management and split payments.":
      "দ্রুততম চেকআউট সিস্টেম, যা কাস্টমারের অপেক্ষার সময় কমিয়ে আনে শূন্যের কোঠায়।",
    "Inventory Management": "ইনভেন্টরি ম্যানেজমেন্ট",
    "Real-time stock tracking, variant management, serial numbers, and low-stock alerts.":
      "স্টক চুরি বা হারিয়ে যাওয়া রোধ করুন রিয়েল-টাইম ট্র্যাকিং ও সিরিয়াল নম্বরের মাধ্যমে।",
    "Invoice Management": "ইনভয়েস ম্যানেজমেন্ট",
    "Create, track, and manage all your sales invoices, with support for voiding and returns.":
      "প্রফেশনাল ইনভয়েস তৈরি করুন এবং রিটার্ন বা ভয়েড করুন কোনো ঝামেলা ছাড়াই।",
    "Quotation Management": "কোটেশন ম্যানেজমেন্ট",
    "Send professional price quotes to clients and convert them to invoices with one click.":
      "ক্লায়েন্টদের প্রফেশনাল কোটেশন পাঠান এবং এক ক্লিকেই তা বিক্রয়ে রূপান্তর করুন।",
    "Customer Management (CRM)": "কাস্টমার ম্যানেজমেন্ট (CRM)",
    "Build customer profiles, track purchase history, manage credit limits, and handle due payments.":
      "কাস্টমারের কেনাকাটার ইতিহাস ও বকেয়া বা বাকি খাতার হিসাব রাখুন খুব সহজে।",

    "Reports & Analytics": "রিপোর্ট ও অ্যানালিটিক্স",
    "Detailed reports on sales, profit & loss, inventory, staff performance, and customer behavior.":
      "দিনশেষে বা মাসশেষে লাভের সঠিক হিসাব এবং কর্মীদের কাজের মূল্যায়ন রিপোর্ট।",
    "Purchase Orders (PO)": "পারচেজ অর্ডার (PO)",
    "Create and manage purchase orders to restock inventory and track incoming stock.":
      "দোকানের মাল ফুরিয়ে যাওয়ার আগেই সাপ্লায়ারকে অর্ডার দিন এবং ইনকামিং স্টক ট্র্যাক করুন।",
    "Supplier Management": "সাপ্লায়ার ম্যানেজমেন্ট",
    "Manage your supplier database and track purchase history by supplier.":
      "সকল সাপ্লায়ারের তালিকা ও তাদের সাথে লেনদেনের সঠিক ইতিহাস সংরক্ষণ করুন।",
    "Expense Tracking": "খরচের হিসাব (Expense)",
    "Log and categorize all your business expenses to keep a clear view of your cash flow.":
      "দোকান ভাড়া থেকে চা-নাস্তা—ব্যবসায়ের প্রতিটি পয়সার খরচের হিসাব রাখুন স্বচ্ছভাবে।",
    "Staff Management": "স্টাফ ম্যানেজমেন্ট",
    "Manage staff accounts, invite new members, and track sales performance per employee.":
      "কর্মীদের জন্য আলাদা একাউন্ট তৈরি করুন এবং কে কেমন বিক্রি করছে তা মনিটর করুন।",
    "User Roles & Permissions": "নিরাপত্তা ও পারমিশন",
    "Granular control over what each staff member can see and do, from voiding invoices to viewing profit.":
      "কোন কর্মী কী দেখতে পারবে বা করতে পারবে, তার পূর্ণ নিয়ন্ত্রণ রাখুন নিজের হাতে।",
    "Loyalty Program": "লয়ালটি প্রোগ্রাম",
    "Retain customers with a built-in points and rewards system, complete with customizable tiers.":
      "পয়েন্ট এবং রিওয়ার্ড দিয়ে কাস্টমারকে বারবার আপনার দোকানে ফিরিয়ে আনুন।",
    "Payroll Management": "বেতন ও হাজিরা",
    "Configure pay settings, define rates, and manage staff payroll runs directly within the system.":
      "সিস্টেম থেকেই কর্মীদের বেতন, বোনাস এবং ওভারটাইমের হিসাব করুন নির্ভুলভাবে।",
    "Warranty & Claims": "ওয়ারেন্টি ও ক্লেইম",
    "Track product warranties tied to serial numbers and manage customer service claims.":
      "ওয়ারেন্টি কার্ড হারানোর ভয় নেই; সিরিয়াল নম্বর দিয়েই ওয়ারেন্টি ট্র্যাক করুন।",
    "Barcode Generator": "বারকোড জেনারেটর",
    "Create and print custom barcode labels for your products individually or in bulk.":
      "নিজের দোকানের নামে পণ্যের বারকোড তৈরি এবং প্রিন্ট করুন খুব সহজেই।",
    "Product Attributes": "প্রোডাক্ট ভেরিয়েন্ট",
    "Define custom attributes (e.g., Color, Size, Brand) to easily manage product variants.":
      "রঙ, সাইজ বা ব্র্যান্ড অনুযায়ী পণ্যের ভেরিয়েন্ট সাজান এবং খুঁজে বের করুন।",
    "Advanced Settings": "অ্যাডভান্সড সেটিংস",
    "Customize currencies, tax rates, receipt templates, and business profiles.":
      "আপনার পছন্দমতো ভ্যাট, কারেন্সি এবং রিসিটের ডিজাইন কাস্টমাইজ করুন।",
    "AI Assistant": "স্মার্ট AI অ্যাসিস্ট্যান্ট",
    "Use natural language to get insights, create products, and perform actions instantly.":
      "মুখে বা লিখে কমান্ড দিন, AI আপনার হয়ে রিপোর্ট তৈরি বা কাজ করে দেবে মুহূর্তেই।",
    "Multi-Store Management": "মাল্টি-স্টোর ম্যানেজমেন্ট",
    "Manage multiple store locations, staff, and inventory from a single admin account.":
      "এক জায়গায় বসেই দেশের যেকোনো প্রান্তে থাকা আপনার একাধিক শোরুম নিয়ন্ত্রণ করুন।",
    Daybook: "দৈনিক খতিয়ান (Daybook)",
    "View a daily summary of all sales, expenses, and cash flow in one place.":
      "দিনশেষে ক্যাশ বক্সে কত টাকা থাকার কথা, তা এক ক্লিকেই মিলিয়ে নিন।",
    "Subscription Management": "সাবস্ক্রিপশন ম্যানেজমেন্ট",
    "Easily manage your plan, view usage, and upgrade your subscription.":
      "আপনার প্যাকেজ বা প্ল্যান ম্যানেজ করুন এবং প্রয়োজন অনুযায়ী আপগ্রেড করুন।",

    // Buttons
    "See All 28 Features": "সবগুলো ফিচার দেখুন",
    "See Less Features": "ফিচারগুলো লুকান",

    // Stats Overlay
    "This past month": "গত এক মাসে",
    "We served": "আমরা সেবা দিয়েছি ",
    Clients: "সন্তুষ্ট ক্লায়েন্ট",
    "100+": " ১০০+",

    // Testimonials
    "MORE VOICES.": "গ্রাহকদের মতামত। ",
    "MORE SUCCESS.": "সাফল্যের গল্প।",
    "See what other business owners are saying about CashShilpo.":
      "দেখুন সফল ব্যবসায়ীরা ক্যাশশিল্পো সম্পর্কে কী বলছেন।",
    '"CashShilpo completely changed how we run our cafe. Inventory is no longer a nightmare, and I can check my sales from home. It\'s the best decision we ever made."':
      '"ক্যাশশিল্পো আমাদের ক্যাফে চালানোর পদ্ধতিই বদলে দিয়েছে। ইনভেন্টরি নিয়ে এখন আর টেনশন নেই, বাসায় বসেই বিক্রির আপডেট পাই। এটা আমার ব্যবসার সেরা বিনিয়োগ।"',
    "Owner, The Cozy Corner Cafe": "স্বত্বাধিকারী, দ্য কোজি কর্নার ক্যাফে",
    '"The multi-store sync is a lifesaver. I manage three locations from one dashboard. It\'s ridiculously simple."':
      '"মাল্টি-স্টোর ফিচারটা আমার জীবন সহজ করে দিয়েছে। এক ড্যাশবোর্ড থেকেই আমি তিনটি শোরুম চালাই। অবিশ্বাস্য রকম সহজ!"',
    '"The analytics are powerful. I finally understand what my best-selling products are and when my busiest hours hit."':
      '"এর রিপোর্টগুলো খুব কাজের। আমি এখন জানি আমার কোন পণ্যটি হট কেকের মতো বিক্রি হচ্ছে এবং কখন কাস্টমারের চাপ বেশি থাকে।"',
    '"24/7 support actually means 24/7. I had an issue at 2 AM, and someone helped me solve it immediately. Unbelievable."':
      '"২৪/৭ সাপোর্ট মানে সত্যিই ২৪/৭। রাত ২টায় সমস্যায় পড়েছিলাম এবং তারা সাথে সাথেই সমাধান করে দিয়েছে। অকল্পনীয় সার্ভিস!"',

    // Final CTA
    "READY TO": "প্রস্তুত আপনার ",
    GROW: "ব্যবসা",
    "YOUR BUSINESS?": "বড় করতে?",
    "Stop guessing. Start selling smarter with CashShilpo. Get started with a free, no-obligation demo today.":
      "আর দেরি কেন? ক্যাশশিল্পোর সাথে আপনার ব্যবসার স্মার্ট যাত্রা শুরু করুন আজই। কোনো টাকা ছাড়াই ডেমো দেখুন।",

    // Footer & Misc
    "Empowering businesses with simple, smart, and powerful POS solutions.":
      "সহজ ও শক্তিশালী প্রযুক্তির ছোঁয়ায় আমরা বদলে দিচ্ছি ব্যবসার ধরণ।",
    "Get the latest updates, feature releases, and business tips sent straight to your inbox.":
      "ব্যবসা বৃদ্ধির টিপস এবং নতুন ফিচারের আপডেট পেতে আমাদের সাথে যুক্ত থাকুন।",
  };

  // --- State ---
  // MODIFIED: Changed default fallback from "en" to "bn"
  let currentLang = localStorage.getItem(CONFIG.storageKey) || "bn";
  let observer = null;

  // --- 0. NEW: Inject Missing Features ---
  // This function adds the new 6 features to the grid if they aren't there.
  function injectNewFeatures() {
    const grid = document.getElementById("features-grid");
    if (!grid) return;

    // Check if "System Language" already exists to prevent duplicates
    if (document.body.innerHTML.includes("System Language")) return;

    const newFeatures = [
      {
        title: "System Language",
        desc: "Toggle between English and Bengali interface.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>`,
      },
      {
        title: "Interface Theme",
        desc: "Select a look and feel for your workspace.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
      },
      {
        title: "Visual Command Center",
        desc: "Personalize your CashShilpo experience.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
      },
      {
        title: "POS Layout",
        desc:
          "Customize your point of sale screen for maximum speed and comfort.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      },
      {
        title: "Advanced EMI System",
        desc:
          "Offer flexible installment plans to customers and track EMI payments automatically.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
      },
      {
        title: "Smart Actions & Automation",
        desc:
          "Let AI handle the routine tasks. Enable smart automations to boost efficiency and drive sales.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
      },
    ];

    newFeatures.forEach((feat) => {
      const card = document.createElement("div");
      // Matches the 'feature-card' class in index.html, added 'injected-feature' for potential debugging
      card.className =
        "feature-card injected-feature bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-accent transition-all duration-300 transform hover:-translate-y-2 animate-card";
      card.innerHTML = `
                <div class="bg-accent h-16 w-16 rounded-full flex items-center justify-center">
                    <div class="text-black">${feat.icon}</div>
                </div>
                <h3 class="text-2xl font-bold mt-6 mb-3">${feat.title}</h3>
                <p class="text-gray-400">${feat.desc}</p>
            `;
      // Append to the grid
      grid.appendChild(card);
    });
  }

  // --- 1. Load Resources (Font & CSS) ---
  function loadResources() {
    // Load Google Font
    const link = document.createElement("link");
    link.href = CONFIG.googleFontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Inject Styles
    const style = document.createElement("style");
    style.textContent = `
            /* Bangla Font Application */
            body.lang-bn, body.lang-bn * {
                font-family: ${CONFIG.fontFamily} !important;
            }

            /* Floating Toggle Button */
            #lang-toggle-btn {
                position: fixed;
                bottom: 24px;
                right: 24px; 
                z-index: 9999;
                background: #000;
                color: ${CONFIG.accentColor};
                border: 2px solid ${CONFIG.accentColor};
                padding: 10px 20px;
                border-radius: 50px;
                font-family: 'Inter', sans-serif;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(57, 255, 20, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            #lang-toggle-btn:hover {
                background: ${CONFIG.accentColor};
                color: #000;
                transform: scale(1.05);
            }

            /* Icon Styling inside button */
            #lang-toggle-btn svg {
                width: 18px;
                height: 18px;
            }
        `;
    document.head.appendChild(style);
  }

  // --- 2. Create UI ---
  function createLanguageToggle() {
    const btn = document.createElement("button");
    btn.id = "lang-toggle-btn";
    btn.innerHTML = getButtonContent(currentLang);

    btn.addEventListener("click", () => {
      toggleLanguage();
    });

    document.body.appendChild(btn);
  }

  function getButtonContent(lang) {
    const globeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;
    return lang === "en" ? `${globeIcon} বাং` : `${globeIcon} EN`;
  }

  // --- 3. Translation Engine ---
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function translatePage(targetLang) {
    const body = document.body;

    if (targetLang === "bn") {
      body.classList.add("lang-bn");
      walkAndTranslate(body, "toBangla");
    } else {
      body.classList.remove("lang-bn");
      walkAndTranslate(body, "toEnglish");
    }

    const btn = document.getElementById("lang-toggle-btn");
    if (btn) btn.innerHTML = getButtonContent(targetLang);

    localStorage.setItem(CONFIG.storageKey, targetLang);
    currentLang = targetLang;
  }

  function walkAndTranslate(node, direction) {
    if (node.nodeType === 3) {
      // Text Node
      handleTextNode(node, direction);
      return;
    }

    if (
      ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(node.tagName) ||
      node.id === "lang-toggle-btn" ||
      (node.classList && node.classList.contains("lucide"))
    ) {
      return;
    }

    if (node.tagName === "INPUT" || node.tagName === "TEXTAREA") {
      handleAttribute(node, "placeholder", direction);
    }

    node.childNodes.forEach((child) => walkAndTranslate(child, direction));
  }

  function handleTextNode(node, direction) {
    const rawText = node.nodeValue;

    // --- NEW: Normalization ---
    // Collapse multiple spaces/tabs/newlines into single space
    // This ensures HTML like <p>\n  Text \n</p> matches "Text" in dictionary
    const cleanKey = rawText.replace(/\s+/g, " ").trim();

    if (!cleanKey) return;

    if (direction === "toBangla") {
      if (DICTIONARY[cleanKey]) {
        // Store original RAW text to preserve structure/formatting on revert
        if (!node._originalText) node._originalText = rawText;

        // Replace with translation
        node.nodeValue = DICTIONARY[cleanKey];
      }
    } else {
      if (node._originalText) {
        node.nodeValue = node._originalText;
        delete node._originalText;
      }
    }
  }

  function handleAttribute(element, attr, direction) {
    const val = element.getAttribute(attr);
    if (!val) return;

    // Attributes typically don't need normalization like text nodes, but we trim just in case
    const cleanVal = val.trim();

    if (direction === "toBangla") {
      if (DICTIONARY[cleanVal]) {
        if (!element[`_original_${attr}`]) element[`_original_${attr}`] = val;
        element.setAttribute(attr, DICTIONARY[cleanVal]);
      }
    } else {
      if (element[`_original_${attr}`]) {
        element.setAttribute(attr, element[`_original_${attr}`]);
        delete element[`_original_${attr}`];
      }
    }
  }

  function toggleLanguage() {
    const newLang = currentLang === "en" ? "bn" : "en";
    translatePage(newLang);
  }

  // --- 4. Dynamic Content Observer ---
  function initObserver() {
    observer = new MutationObserver((mutations) => {
      if (currentLang === "en") return;

      let shouldTranslate = false;
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          shouldTranslate = true;
        }
      });

      if (shouldTranslate) {
        observer.disconnect();
        walkAndTranslate(document.body, "toBangla");
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // --- Init ---
  // Wait for DOM to be ready to safely inject features
  window.addEventListener("DOMContentLoaded", () => {
    loadResources();
    injectNewFeatures(); // Inject features FIRST
    createLanguageToggle();

    // Translate after injection if needed
    if (currentLang === "bn") {
      setTimeout(() => {
        translatePage("bn");
      }, 100);
    }
    initObserver();
  });

  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    loadResources();
    injectNewFeatures();
    if (!document.getElementById("lang-toggle-btn")) createLanguageToggle();
    if (currentLang === "bn") translatePage("bn");
    initObserver();
  }
})();
