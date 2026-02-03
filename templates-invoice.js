/**
 * CashShilpo World-Class Invoice Templates Library
 * This file defines 10 premium receipt/invoice templates.
 * * FIXES:
 * 1. Removed auto-injection logic to prevent duplicate templates in the UI.
 * 2. Added high-specificity CSS to override the main app's "force black & white" print settings.
 */

(function () {
  console.log("Initializing World-Class Invoice Templates...");

  // --- Helper: Robust Currency Formatter ---
  const formatCurrency = (amount, currencyCode = "USD") => {
    if (
      typeof window.currencyUtils !== "undefined" &&
      window.currencyUtils.format
    ) {
      return window.currencyUtils.format(amount, currencyCode);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  };

  // --- Helper: Date Formatter ---
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --- FIX: HIGH SPECIFICITY PRINT STYLE OVERRIDE ---
  // We use ID repetition (#printable-content#printable-content) to boost specificity
  // and defeat the default app's "!important" black-and-white print reset.
  const printStyleFix = document.createElement("style");
  printStyleFix.innerHTML = `
        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Reset specific to the print container */
            #printable-content#printable-content {
                background-color: white !important;
                color: inherit !important;
            }
            
            /* Restore visibility for all elements */
            #printable-content#printable-content * {
                color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
                background-color: inherit;
                color: inherit;
                text-shadow: inherit;
                box-shadow: inherit;
            }

            /* --- Specific Template Overrides --- */

            /* Creative Pop Backgrounds */
            #printable-content#printable-content .bg-yellow-50 { background-color: #fefce8 !important; }
            #printable-content#printable-content .bg-pink-400 { background-color: #f472b6 !important; opacity: 1 !important; } /* Removed opacity for clearer print */
            #printable-content#printable-content .bg-purple-400 { background-color: #c084fc !important; opacity: 1 !important; }
            #printable-content#printable-content .bg-purple-100 { background-color: #f3e8ff !important; }
            
            /* Creative Pop Text Colors */
            #printable-content#printable-content .text-pink-500 { color: #ec4899 !important; }
            #printable-content#printable-content .text-purple-600 { color: #9333ea !important; }
            #printable-content#printable-content .text-purple-500 { color: #a855f7 !important; }
            
            /* Gradient Text Fix */
            #printable-content#printable-content .bg-clip-text {
                -webkit-background-clip: text !important;
                background-clip: text !important;
                /* If browser supports gradient text in print */
                background-image: linear-gradient(to right, #ec4899, #9333ea) !important; 
                color: #db2777 !important; /* Fallback color */
            }

            /* Corporate Blue & Others */
            #printable-content#printable-content .bg-blue-800 { background-color: #1e40af !important; color: white !important; }
            #printable-content#printable-content .bg-blue-900 { background-color: #1e3a8a !important; color: white !important; }
            #printable-content#printable-content .bg-blue-50 { background-color: #eff6ff !important; }
            #printable-content#printable-content .text-blue-900 { color: #1e3a8a !important; }
            #printable-content#printable-content .border-blue-800 { border-color: #1e40af !important; }

            /* Dark Mode / Tech Digital */
            #printable-content#printable-content .bg-gray-900 { background-color: #111827 !important; color: white !important; }
            #printable-content#printable-content .bg-gray-800 { background-color: #1f2937 !important; color: white !important; }
            #printable-content#printable-content .bg-black { background-color: #000000 !important; color: #4ade80 !important; }
            #printable-content#printable-content .text-green-400 { color: #4ade80 !important; }
            
            /* Cafe Style */
            #printable-content#printable-content .bg-[#fffcf5] { background-color: #fffcf5 !important; }
            #printable-content#printable-content .text-amber-900 { color: #78350f !important; }
            
            /* Structure helpers */
            #printable-content#printable-content .grid { display: grid !important; }
            #printable-content#printable-content .flex { display: flex !important; }
        }
    `;
  document.head.appendChild(printStyleFix);

  // --- 10 NEW TEMPLATES ---
  const newTemplates = {
    corporate_blue: {
      name: "Corporate Blue",
      preview: `<div class="w-full h-full bg-white border border-gray-200 flex flex-col"><div class="h-4 bg-blue-800 w-full"></div><div class="p-2 space-y-1"><div class="flex justify-between"><div class="w-8 h-2 bg-gray-300"></div><div class="w-4 h-2 bg-gray-300"></div></div><div class="mt-2 space-y-1"><div class="w-full h-1 bg-gray-100"></div><div class="w-full h-1 bg-gray-100"></div></div></div><div class="mt-auto p-2 border-t border-gray-100"><div class="w-1/2 h-2 bg-blue-800 ml-auto"></div></div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" class="font-sans text-gray-800 p-8 max-w-3xl mx-auto border border-gray-200 shadow-lg bg-white relative">
                    <div class="flex justify-between items-end border-b-4 border-blue-800 pb-6">
                        <div>
                            <h1 class="text-3xl font-bold text-blue-900 uppercase tracking-widest">Invoice</h1>
                            <p class="text-sm text-gray-500 mt-1">#${
                              invoice.id
                            }</p>
                        </div>
                        <div class="text-right">
                            <h2 class="text-xl font-bold text-gray-900">CashShilpo Store</h2>
                            <p class="text-sm text-gray-600">123 Business Rd, Tech City</p>
                            <p class="text-sm text-gray-600">contact@cashshilpo.com</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-8 py-8">
                        <div>
                            <p class="text-xs font-bold text-gray-400 uppercase mb-1">Bill To</p>
                            <p class="font-bold text-gray-800 text-lg">${
                              invoice.customerName
                            }</p>
                            ${
                              invoice.customer
                                ? `<p class="text-sm text-gray-600">${
                                    invoice.customer.address || ""
                                  }</p>`
                                : ""
                            }
                            ${
                              invoice.customer
                                ? `<p class="text-sm text-gray-600">${
                                    invoice.customer.phone || ""
                                  }</p>`
                                : ""
                            }
                        </div>
                        <div class="text-right">
                            <div class="mb-2"><span class="text-xs font-bold text-gray-400 uppercase mr-4">Date</span> <span class="font-bold">${formatDate(
                              invoice.date,
                            )}</span></div>
                            <div class="mb-2"><span class="text-xs font-bold text-gray-400 uppercase mr-4">Status</span> <span class="font-bold ${
                              invoice.status === "Paid"
                                ? "text-green-600"
                                : "text-red-600"
                            }">${invoice.status}</span></div>
                        </div>
                    </div>
                    <table class="w-full text-sm mb-8">
                        <thead class="bg-blue-50 text-blue-900 uppercase text-xs font-bold">
                            <tr><th class="py-3 px-4 text-left">Item</th><th class="py-3 px-4 text-center">Qty</th><th class="py-3 px-4 text-right">Price</th><th class="py-3 px-4 text-right">Total</th></tr>
                        </thead>
                        <tbody class="divide-y divide-blue-100">
                            ${invoice.items
                              .map(
                                (item) =>
                                  `<tr><td class="py-3 px-4 font-medium">${
                                    item.name
                                  }</td><td class="py-3 px-4 text-center">${
                                    item.qty
                                  }</td><td class="py-3 px-4 text-right">${formatCurrency(
                                    item.price,
                                    currency,
                                  )}</td><td class="py-3 px-4 text-right font-bold">${formatCurrency(
                                    item.price * item.qty,
                                    currency,
                                  )}</td></tr>`,
                              )
                              .join("")}
                        </tbody>
                    </table>
                    <div class="flex justify-end">
                        <div class="w-1/2 space-y-2 border-t border-gray-200 pt-4">
                            <div class="flex justify-between text-sm"><span>Subtotal</span><span>${formatCurrency(
                              invoice.subtotalInBaseCurrency,
                              currency,
                            )}</span></div>
                            <div class="flex justify-between text-sm"><span>Tax</span><span>${formatCurrency(
                              invoice.taxInBaseCurrency,
                              currency,
                            )}</span></div>
                            <div class="flex justify-between text-xl font-bold text-blue-900 border-t-2 border-blue-900 pt-2"><span>Total</span><span>${formatCurrency(
                              invoice.totalInBaseCurrency,
                              currency,
                            )}</span></div>
                        </div>
                    </div>
                    <div class="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
                        <p>Thank you for your business. Please contact us for any support queries.</p>
                    </div>
                </div>`;
      },
    },
    minimalist_mono: {
      name: "Minimalist Mono",
      preview: `<div class="w-full h-full bg-white border border-gray-200 p-3 flex flex-col justify-between font-mono text-[6px]"><div class="space-y-2"><div>INVOICE #001</div><div class="h-px bg-black w-full"></div><div>ITEM 1 ... $10</div><div>ITEM 2 ... $20</div></div><div class="text-right font-bold">TOTAL $30</div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" class="font-mono text-gray-900 p-10 max-w-2xl mx-auto bg-white border border-gray-900">
                    <div class="text-center mb-8">
                        <h1 class="text-4xl font-bold tracking-tighter">INVOICE</h1>
                        <p class="text-sm mt-2">${invoice.id}</p>
                    </div>
                    <div class="flex justify-between mb-8 text-sm">
                        <div>
                            <p class="font-bold">FROM:</p>
                            <p>CashShilpo Inc.</p>
                        </div>
                        <div class="text-right">
                            <p class="font-bold">TO:</p>
                            <p>${invoice.customerName}</p>
                        </div>
                    </div>
                    <div class="border-t-2 border-b-2 border-gray-900 py-4 mb-8">
                        <table class="w-full text-sm">
                            <thead><tr class="text-left"><th class="pb-2">ITEM</th><th class="text-right pb-2">COST</th></tr></thead>
                            <tbody>
                                ${invoice.items
                                  .map(
                                    (item) =>
                                      `<tr><td class="py-1">${item.qty} x ${
                                        item.name
                                      }</td><td class="text-right py-1">${formatCurrency(
                                        item.price * item.qty,
                                        currency,
                                      )}</td></tr>`,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="flex justify-between items-center text-xl font-bold">
                        <span>TOTAL DUE</span>
                        <span>${formatCurrency(
                          invoice.totalInBaseCurrency,
                          currency,
                        )}</span>
                    </div>
                    <div class="mt-12 text-xs text-center border-t border-gray-300 pt-4">
                        <p>THANK YOU.</p>
                    </div>
                </div>`;
      },
    },
    elegant_serif: {
      name: "Elegant Serif",
      preview: `<div class="w-full h-full bg-[#fcfbf9] border border-[#e5e0d8] p-3 font-serif flex flex-col items-center"><div class="w-8 h-8 rounded-full border border-gray-400 mb-2"></div><div class="h-px w-1/2 bg-gray-300 mb-2"></div><div class="w-full space-y-1 text-[5px] text-center"><div>Item A</div><div>Item B</div></div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" class="font-serif text-gray-800 p-10 max-w-3xl mx-auto bg-[#fcfbf9] shadow-xl" style="font-family: 'Georgia', 'Times New Roman', serif;">
                    <div class="text-center mb-10">
                        <div class="inline-block border-2 border-gray-800 p-4 mb-4"><h1 class="text-2xl tracking-widest uppercase">CashShilpo</h1></div>
                        <p class="text-sm italic text-gray-600">Excellence in every transaction</p>
                    </div>
                    <div class="flex justify-between mb-10 border-t border-b border-gray-200 py-6">
                        <div>
                            <p class="text-xs uppercase tracking-wide text-gray-500">Invoice For</p>
                            <p class="text-lg mt-1">${invoice.customerName}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs uppercase tracking-wide text-gray-500">Invoice No.</p>
                            <p class="text-lg mt-1 font-mono">${invoice.id.slice(
                              -8,
                            )}</p>
                            <p class="text-xs text-gray-500 mt-1">${formatDate(
                              invoice.date,
                            )}</p>
                        </div>
                    </div>
                    <table class="w-full text-sm mb-10">
                        <thead><tr class="border-b border-gray-800"><th class="py-2 text-left font-normal italic text-gray-600">Description</th><th class="py-2 text-center font-normal italic text-gray-600">Quantity</th><th class="py-2 text-right font-normal italic text-gray-600">Amount</th></tr></thead>
                        <tbody>
                            ${invoice.items
                              .map(
                                (item) =>
                                  `<tr class="border-b border-gray-100"><td class="py-4">${
                                    item.name
                                  }</td><td class="py-4 text-center">${
                                    item.qty
                                  }</td><td class="py-4 text-right">${formatCurrency(
                                    item.price * item.qty,
                                    currency,
                                  )}</td></tr>`,
                              )
                              .join("")}
                        </tbody>
                    </table>
                    <div class="flex justify-end">
                        <div class="text-right">
                            <p class="text-sm text-gray-600 mb-1">Total</p>
                            <p class="text-3xl font-bold">${formatCurrency(
                              invoice.totalInBaseCurrency,
                              currency,
                            )}</p>
                        </div>
                    </div>
                    <div class="mt-16 text-center">
                        <p class="text-sm italic text-gray-500">Thank you for your patronage.</p>
                    </div>
                </div>`;
      },
    },
    bold_dark: {
      name: "Bold Dark",
      preview: `<div class="w-full h-full bg-gray-900 border border-gray-700 p-2 flex flex-col"><div class="text-white font-bold text-[8px] mb-2">INVOICE</div><div class="bg-gray-800 h-10 w-full rounded"></div><div class="mt-auto text-right text-green-400 font-bold text-[8px]">$50.00</div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" class="bg-gray-900 text-gray-300 p-10 max-w-3xl mx-auto font-sans antialiased">
                    <div class="flex justify-between items-start mb-12">
                        <h1 class="text-5xl font-black text-white tracking-tighter">INVOICE</h1>
                        <div class="text-right">
                            <p class="text-gray-500 uppercase tracking-widest text-xs mb-1">Total Due</p>
                            <p class="text-4xl font-bold text-green-400">${formatCurrency(
                              invoice.dueAmount || 0,
                              currency,
                            )}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-10 mb-12">
                        <div class="bg-gray-800 p-6 rounded-lg">
                            <p class="text-xs font-bold text-gray-500 uppercase mb-2">Billed To</p>
                            <p class="text-xl font-bold text-white">${
                              invoice.customerName
                            }</p>
                        </div>
                        <div class="bg-gray-800 p-6 rounded-lg">
                            <p class="text-xs font-bold text-gray-500 uppercase mb-2">Details</p>
                            <div class="flex justify-between mb-1"><span>ID:</span> <span class="text-white font-mono">${invoice.id.slice(
                              -6,
                            )}</span></div>
                            <div class="flex justify-between"><span>Date:</span> <span class="text-white">${formatDate(
                              invoice.date,
                            )}</span></div>
                        </div>
                    </div>
                    <div class="bg-gray-800 rounded-lg overflow-hidden mb-8">
                        <table class="w-full text-left">
                            <thead class="bg-gray-700 text-gray-400 uppercase text-xs"><tr><th class="p-4">Item</th><th class="p-4 text-center">Qty</th><th class="p-4 text-right">Price</th></tr></thead>
                            <tbody class="divide-y divide-gray-700">
                                ${invoice.items
                                  .map(
                                    (item) =>
                                      `<tr><td class="p-4 text-white font-medium">${
                                        item.name
                                      }</td><td class="p-4 text-center">${
                                        item.qty
                                      }</td><td class="p-4 text-right">${formatCurrency(
                                        item.price,
                                        currency,
                                      )}</td></tr>`,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="flex justify-end text-xl">
                        <div class="space-y-2 w-64">
                            <div class="flex justify-between text-gray-400 text-base"><span>Subtotal</span><span>${formatCurrency(
                              invoice.subtotalInBaseCurrency,
                              currency,
                            )}</span></div>
                            <div class="flex justify-between font-bold text-white border-t border-gray-700 pt-2"><span>Total</span><span>${formatCurrency(
                              invoice.totalInBaseCurrency,
                              currency,
                            )}</span></div>
                        </div>
                    </div>
                </div>`;
      },
    },
    compact_thermal_plus: {
      name: "Thermal Plus",
      preview: `<div class="w-full h-full bg-white border border-gray-300 p-2 font-mono text-[5px] text-center"><div class="font-bold text-[6px]">STORE NAME</div><div>*** RECEIPT ***</div><div class="my-1 text-left">Item A ... 10.00</div><div class="border-t border-dashed border-gray-400 pt-1 font-bold">TOTAL: 10.00</div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" style="width: 350px; margin: 0 auto; background: #fff; padding: 15px; font-family: 'Courier New', Courier, monospace; color: #000;">
                    <div style="text-align: center; margin-bottom: 10px;">
                        <h2 style="font-size: 20px; font-weight: 800; margin: 0;">CASHSHILPO</h2>
                        <p style="font-size: 12px; margin: 2px 0;">Retail & Supply Co.</p>
                        <p style="font-size: 10px; margin-top: 5px;">--------------------------------</p>
                    </div>
                    <div style="font-size: 12px; margin-bottom: 10px;">
                        <p><strong>Inv #:</strong> ${invoice.id}</p>
                        <p><strong>Date:</strong> ${new Date(
                          invoice.date,
                        ).toLocaleString()}</p>
                        <p><strong>Customer:</strong> ${
                          invoice.customerName
                        }</p>
                    </div>
                    <table style="width: 100%; font-size: 12px; border-collapse: collapse; margin-bottom: 10px;">
                        <thead>
                            <tr style="border-bottom: 1px dashed #000;">
                                <th style="text-align: left; padding: 5px 0;">Item</th>
                                <th style="text-align: center; width: 30px; padding: 5px 0;">Q</th>
                                <th style="text-align: right; padding: 5px 0;">Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items
                              .map(
                                (item) =>
                                  `<tr><td style="padding: 3px 0;">${
                                    item.name
                                  }</td><td style="text-align: center;">${
                                    item.qty
                                  }</td><td style="text-align: right;">${formatCurrency(
                                    item.price * item.qty,
                                    currency,
                                  )}</td></tr>`,
                              )
                              .join("")}
                        </tbody>
                    </table>
                    <div style="border-top: 1px dashed #000; padding-top: 5px; font-size: 12px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 2px;"><span>Subtotal:</span><span>${formatCurrency(
                          invoice.subtotalInBaseCurrency,
                          currency,
                        )}</span></div>
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 5px;"><span>TOTAL:</span><span>${formatCurrency(
                          invoice.totalInBaseCurrency,
                          currency,
                        )}</span></div>
                    </div>
                    <div style="text-align: center; margin-top: 15px; font-size: 10px;">
                        <p>*** THANK YOU FOR VISITING ***</p>
                        <svg id="barcode-placeholder" style="width: 100%; height: 30px; margin-top: 5px; background: #eee;"></svg>
                    </div>
                </div>`;
      },
    },
    modern_grid: {
      name: "Modern Grid",
      preview: `<div class="w-full h-full bg-gray-50 border border-gray-200 p-2 grid grid-cols-2 gap-1"><div class="bg-white rounded"></div><div class="bg-white rounded"></div><div class="col-span-2 bg-white h-8 rounded mt-1"></div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" class="bg-gray-100 p-8 max-w-3xl mx-auto font-sans">
                    <div class="bg-white rounded-xl shadow-sm p-8 mb-6">
                        <div class="flex justify-between items-center mb-6">
                            <div class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold text-xl tracking-wide">INVOICE</div>
                            <div class="text-right">
                                <p class="text-gray-400 text-xs uppercase font-bold">Total Amount</p>
                                <p class="text-3xl font-bold text-indigo-900">${formatCurrency(
                                  invoice.totalInBaseCurrency,
                                  currency,
                                )}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4 text-sm">
                            <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p class="text-gray-400 text-xs font-bold uppercase mb-1">From</p>
                                <p class="font-bold text-gray-800">CashShilpo HQ</p>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p class="text-gray-400 text-xs font-bold uppercase mb-1">To</p>
                                <p class="font-bold text-gray-800">${
                                  invoice.customerName
                                }</p>
                            </div>
                            <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p class="text-gray-400 text-xs font-bold uppercase mb-1">Info</p>
                                <p class="font-bold text-gray-800">#${invoice.id.slice(
                                  -6,
                                )}</p>
                                <p class="text-gray-500 text-xs">${formatDate(
                                  invoice.date,
                                )}</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div class="grid grid-cols-12 bg-gray-50 border-b border-gray-100 p-4 text-xs font-bold text-gray-400 uppercase">
                            <div class="col-span-6">Description</div>
                            <div class="col-span-2 text-center">Qty</div>
                            <div class="col-span-2 text-right">Price</div>
                            <div class="col-span-2 text-right">Total</div>
                        </div>
                        ${invoice.items
                          .map(
                            (item) => `
                        <div class="grid grid-cols-12 p-4 border-b border-gray-50 items-center text-sm">
                            <div class="col-span-6 font-medium text-gray-800">${
                              item.name
                            }</div>
                            <div class="col-span-2 text-center text-gray-500 bg-gray-50 rounded-full py-1">${
                              item.qty
                            }</div>
                            <div class="col-span-2 text-right text-gray-600">${formatCurrency(
                              item.price,
                              currency,
                            )}</div>
                            <div class="col-span-2 text-right font-bold text-gray-800">${formatCurrency(
                              item.price * item.qty,
                              currency,
                            )}</div>
                        </div>`,
                          )
                          .join("")}
                    </div>
                </div>`;
      },
    },
    creative_color: {
      name: "Creative Pop",
      preview: `<div class="w-full h-full bg-yellow-50 border border-yellow-200 p-2 relative overflow-hidden"><div class="absolute -top-4 -right-4 w-12 h-12 bg-pink-400 rounded-full"></div><div class="text-pink-600 font-bold text-[8px] relative z-10">INVOICE</div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" class="bg-yellow-50 p-10 max-w-3xl mx-auto font-sans relative overflow-hidden">
                    <!-- Background Circles -->
                    <div class="absolute top-0 right-0 w-64 h-64 bg-pink-400 rounded-full transform translate-x-1/3 -translate-y-1/3 z-0"></div>
                    <div class="absolute bottom-0 left-0 w-40 h-40 bg-purple-400 rounded-full transform -translate-x-1/3 translate-y-1/3 z-0"></div>
                    
                    <div class="relative z-10">
                        <h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2" style="-webkit-text-fill-color: transparent;">HELLO.</h1>
                        <p class="text-xl font-bold text-gray-700 mb-12">Here is your invoice receipt.</p>
                        
                        <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white mb-8">
                            <table class="w-full">
                                <thead>
                                    <tr class="text-left text-gray-400 text-xs uppercase tracking-wider">
                                        <th class="pb-4">What you bought</th>
                                        <th class="pb-4 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody class="text-lg font-medium text-gray-800">
                                    ${invoice.items
                                      .map(
                                        (item) => `
                                    <tr class="border-t border-dashed border-gray-300">
                                        <td class="py-4">
                                            ${item.name}
                                            <span class="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full ml-2">x${
                                              item.qty
                                            }</span>
                                        </td>
                                        <td class="py-4 text-right">${formatCurrency(
                                          item.price * item.qty,
                                          currency,
                                        )}</td>
                                    </tr>`,
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="flex justify-between items-center">
                            <div class="text-sm text-gray-500 font-medium">
                                <p>Date: ${formatDate(invoice.date)}</p>
                                <p>Ref: #${invoice.id.slice(0, 8)}</p>
                            </div>
                            <div class="text-right">
                                <span class="block text-sm font-bold text-pink-500 uppercase tracking-wide">Total Paid</span>
                                <span class="block text-5xl font-black text-gray-900">${formatCurrency(
                                  invoice.totalInBaseCurrency,
                                  currency,
                                )}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
      },
    },
    service_focused: {
      name: "Service Pro",
      preview: `<div class="w-full h-full bg-white border border-gray-300 flex flex-col"><div class="bg-gray-800 text-white p-1 text-[6px]">SERVICES RENDERED</div><div class="p-2 space-y-1"><div class="h-1 bg-gray-200 w-full"></div><div class="h-1 bg-gray-200 w-2/3"></div></div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" class="font-sans text-gray-700 max-w-3xl mx-auto bg-white border border-gray-300">
                    <div class="bg-gray-800 text-white p-10">
                        <h1 class="text-2xl font-light uppercase tracking-[0.2em] mb-1">Statement of Service</h1>
                        <p class="text-gray-400 text-sm">Invoice #${
                          invoice.id
                        }</p>
                    </div>
                    <div class="p-10">
                        <div class="flex mb-10">
                            <div class="w-1/2 pr-4">
                                <h3 class="text-xs font-bold text-gray-400 uppercase border-b border-gray-200 pb-2 mb-2">Client</h3>
                                <p class="font-bold text-lg text-gray-900">${
                                  invoice.customerName
                                }</p>
                            </div>
                            <div class="w-1/2 pl-4">
                                <h3 class="text-xs font-bold text-gray-400 uppercase border-b border-gray-200 pb-2 mb-2">Provider</h3>
                                <p class="font-medium">CashShilpo Services</p>
                            </div>
                        </div>
                        
                        <div class="mb-10">
                            <h3 class="text-xs font-bold text-gray-400 uppercase border-b border-gray-200 pb-2 mb-4">Breakdown</h3>
                            ${invoice.items
                              .map(
                                (item) => `
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <p class="font-bold text-gray-900">${
                                      item.name
                                    }</p>
                                    <p class="text-xs text-gray-500">Qty/Hours: ${
                                      item.qty
                                    } @ ${formatCurrency(
                                  item.price,
                                  currency,
                                )}</p>
                                </div>
                                <p class="font-medium">${formatCurrency(
                                  item.price * item.qty,
                                  currency,
                                )}</p>
                            </div>`,
                              )
                              .join("")}
                        </div>
                        
                        <div class="bg-gray-50 p-6 rounded text-right">
                            <p class="text-lg">Amount Due: <span class="font-bold text-gray-900">${formatCurrency(
                              invoice.dueAmount || 0,
                              currency,
                            )}</span></p>
                            <p class="text-sm text-gray-500 mt-1">Total Billed: ${formatCurrency(
                              invoice.totalInBaseCurrency,
                              currency,
                            )}</p>
                        </div>
                    </div>
                </div>`;
      },
    },
    tech_digital: {
      name: "Tech Digital",
      preview: `<div class="w-full h-full bg-black text-green-400 font-mono p-2 text-[5px] border border-green-900"><div>> INVOICE_LOADED</div><div class="mt-2 text-white">TOTAL: [100.00]</div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" class="bg-black text-green-400 p-8 max-w-2xl mx-auto font-mono text-sm border border-green-900 shadow-2xl shadow-green-900/20">
                    <p class="mb-4 text-green-600">/* SYSTEM INVOICE GENERATED */</p>
                    <div class="border border-green-800 p-6 mb-6 relative">
                        <div class="absolute top-0 left-0 bg-black px-2 -mt-2.5 ml-4 text-green-600 text-xs">METADATA</div>
                        <div class="grid grid-cols-2 gap-4">
                            <div><span class="text-gray-500">ID:</span> <span class="text-white">${
                              invoice.id
                            }</span></div>
                            <div><span class="text-gray-500">TS:</span> <span class="text-white">${new Date(
                              invoice.date,
                            ).toISOString()}</span></div>
                            <div><span class="text-gray-500">USER:</span> <span class="text-white">${
                              invoice.customerName
                            }</span></div>
                        </div>
                    </div>
                    <table class="w-full mb-6">
                        <thead>
                            <tr class="text-gray-600 border-b border-gray-800">
                                <th class="text-left py-2">PKG</th>
                                <th class="text-right py-2">VAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items
                              .map(
                                (item) => `
                            <tr>
                                <td class="py-2"><span class="text-green-500">></span> ${
                                  item.name
                                } <span class="text-gray-600 text-xs">[x${
                                  item.qty
                                }]</span></td>
                                <td class="text-right py-2 text-white">${formatCurrency(
                                  item.price * item.qty,
                                  currency,
                                )}</td>
                            </tr>`,
                              )
                              .join("")}
                        </tbody>
                    </table>
                    <div class="text-right border-t-2 border-green-600 pt-4">
                        <p class="text-2xl font-bold text-white"><span class="text-green-600 animate-pulse">_</span>${formatCurrency(
                          invoice.totalInBaseCurrency,
                          currency,
                        )}</p>
                    </div>
                </div>`;
      },
    },
    cafe_style: {
      name: "Cafe Style",
      preview: `<div class="w-full h-full bg-[#fffcf5] border border-orange-100 p-2 text-center text-[6px] font-serif text-amber-900"><div>Coffee & Co.</div><div class="my-1 border-t border-b border-orange-200 py-1">Latte $5</div></div>`,
      getBody: (invoice) => {
        const currency = invoice.currency || "USD";
        return `
                <div id="receipt-content" class="bg-[#fffcf5] text-amber-900 p-12 max-w-xl mx-auto font-serif text-center border-t-8 border-amber-800 shadow-md">
                    <h1 class="text-4xl italic font-bold mb-2">CashShilpo Cafe</h1>
                    <p class="text-sm text-amber-700 uppercase tracking-widest mb-8">Fresh & Quality</p>
                    <div class="border-t border-b border-amber-200 py-2 mb-8 text-xs flex justify-between px-8">
                        <span>Table: 04</span>
                        <span>Date: ${formatDate(invoice.date)}</span>
                        <span>Server: ${invoice.cashierName}</span>
                    </div>
                    <div class="space-y-4 px-8 mb-8 text-left">
                        ${invoice.items
                          .map(
                            (item) => `
                        <div class="flex justify-between items-baseline relative">
                            <div class="bg-[#fffcf5] relative z-10 pr-2 font-bold">${
                              item.name
                            } <span class="font-normal text-xs text-amber-600">x${
                              item.qty
                            }</span></div>
                            <div class="flex-grow border-b border-dotted border-amber-300 absolute w-full bottom-1"></div>
                            <div class="bg-[#fffcf5] relative z-10 pl-2">${formatCurrency(
                              item.price * item.qty,
                              currency,
                            )}</div>
                        </div>`,
                          )
                          .join("")}
                    </div>
                    <div class="bg-amber-100/50 p-6 rounded-lg mx-8">
                        <div class="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${formatCurrency(
                              invoice.totalInBaseCurrency,
                              currency,
                            )}</span>
                        </div>
                    </div>
                    <div class="mt-10 text-xs text-amber-600">
                        <p>~ Thank you for dining with us ~</p>
                        <p>Wifi: cafe_guest / Pass: coffee123</p>
                    </div>
                </div>`;
      },
    },
  };

  // Expose templates to global scope for the main app to pick up
  window.invoiceTemplates = newTemplates;
  if (window.receiptTemplates) {
    Object.assign(window.receiptTemplates, newTemplates);
  }
})();
