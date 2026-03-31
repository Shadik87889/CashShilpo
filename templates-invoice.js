/**
 * CashShilpo Advanced Invoice Templates & Custom Builder
 * Features:
 * 1. Introduces 3 beautiful predefined templates (Elegant, Corporate, Minimalist).
 * 2. Injects a highly advanced "Custom Invoice Builder" with logo uploads, color pickers, and layout toggles.
 * 3. Safely hooks into the 'Templates' tab created by cashshilpo-settings-tab.js (No UI conflicts).
 */

(function () {
  console.log("CashShilpo: Advanced Invoice Templates & Builder Loaded");

  const CONFIG_KEY = "cashshilpo_custom_invoice_config";

  // --- Inject Custom CSS for Builder ---
  const style = document.createElement("style");
  style.innerHTML = `
        .builder-section {
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            padding: 1.25rem;
        }
        .builder-section-title {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
            margin-bottom: 1rem;
            font-weight: 700;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.5rem;
        }
        .logo-upload-box {
            border: 2px dashed var(--border-color-strong);
            border-radius: 0.5rem;
            padding: 1rem;
            text-align: center;
            cursor: pointer;
            transition: border-color 0.2s;
            position: relative;
            overflow: hidden;
        }
        .logo-upload-box:hover {
            border-color: var(--accent);
        }
        .logo-preview-img {
            max-height: 80px;
            max-width: 100%;
            object-fit: contain;
            margin: 0 auto;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color-strong); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }
    `;
  document.head.appendChild(style);

  // --- 1. Helpers for Currency and Store Details ---
  function formatMoney(amount, currencyCode = "USD") {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
      }).format(amount || 0);
    } catch (e) {
      return `${Number(amount || 0).toFixed(2)}`;
    }
  }

  function getStoreDetails() {
    let config = {};
    try {
      config = JSON.parse(localStorage.getItem(CONFIG_KEY)) || {};
    } catch (e) {}

    const domStoreName =
      document.getElementById("brand-name")?.innerText || "My Store";
    const domLogo = document.querySelector("#sidebar img")?.src || "";

    return {
      name: config.storeName || domStoreName,
      address: config.storeAddress || "",
      contact: config.storeContact || "",
      taxId: config.taxId || "",
      logoUrl: config.logoUrl || domLogo,
      footerText: config.footerText || "Thank you for your business!",
    };
  }

  function getInvoiceStatusBadge(status) {
    if (status === "Paid")
      return `<span style="background: #dcfce7; color: #166534; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Paid</span>`;
    if (status === "Due" || status === "Partial")
      return `<span style="background: #fef08a; color: #9a3412; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${status}</span>`;
    if (status === "Void")
      return `<span style="background: #fee2e2; color: #991b1b; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Void</span>`;
    if (status === "Return")
      return `<span style="background: #dbeafe; color: #1e40af; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Return</span>`;
    return `<span style="background: #e5e7eb; color: #374151; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${status}</span>`;
  }

  // --- 2. Define Advanced Templates ---
  window.invoiceTemplates = {
    elegant_serif: {
      name: "Elegant Serif",
      preview: `<div class="bg-[#faf9f6] p-4 font-serif text-[8px] leading-tight text-gray-800 border border-gray-200 shadow-sm flex flex-col h-full"><div class="text-center border-b border-gray-300 pb-2 mb-2"><h1 class="text-lg font-bold text-gray-900" style="font-family: 'Playfair Display', serif;">ELEGANT</h1><p class="text-[6px] italic text-gray-500">EST. 2024</p></div><div class="flex justify-between border-b border-gray-200 pb-1 mb-1"><span class="italic">Item</span><span>Price</span></div><div class="flex-grow"></div><div class="flex justify-between font-bold mt-2 pt-1 border-t border-gray-300"><span class="italic">TOTAL</span><span>$0.00</span></div></div>`,
      getBody: (invoice) => generateElegantTemplate(invoice),
    },
    corporate_modern: {
      name: "Corporate Blue",
      preview: `<div class="bg-white p-4 font-sans text-[8px] leading-tight text-gray-800 border-t-4 border-blue-600 shadow-sm flex flex-col h-full"><div class="flex justify-between items-start mb-2"><h1 class="font-bold text-blue-700 text-sm">CORP</h1><div class="text-right text-[6px] text-gray-400">INV-001</div></div><div class="bg-gray-100 p-1 mb-2 text-[6px] text-gray-600">Details block</div><div class="flex-grow"></div><div class="flex justify-between font-bold text-blue-900 border-t border-blue-200 pt-1"><span>DUE</span><span>$0.00</span></div></div>`,
      getBody: (invoice) => generateCorporateTemplate(invoice),
    },
    minimalist_dark: {
      name: "Minimalist Dark",
      preview: `<div class="bg-gray-900 p-4 font-sans text-[8px] leading-tight text-gray-300 shadow-sm flex flex-col h-full"><div class="text-white font-bold tracking-widest uppercase mb-2 text-center text-xs border-b border-gray-700 pb-1">MINIMAL</div><div class="flex justify-between pb-1 mb-1 text-[6px] text-gray-500"><span>ITEM</span><span>AMT</span></div><div class="flex-grow"></div><div class="flex justify-between text-white mt-2 border-t border-gray-700 pt-1 font-bold"><span>TOTAL</span><span>$0.00</span></div></div>`,
      getBody: (invoice) => generateMinimalistTemplate(invoice),
    },
    custom_user: {
      name: "My Custom Template",
      preview: `<div class="bg-white p-4 font-sans text-[8px] leading-tight text-gray-800 border-2 border-dashed border-cyan-500 flex items-center justify-center h-full bg-cyan-50"><span class="text-cyan-600 font-bold text-center tracking-widest">MY<br>CUSTOM<br>TEMPLATE</span></div>`,
      getBody: (invoice) => {
        let config = {};
        try {
          config = JSON.parse(localStorage.getItem(CONFIG_KEY)) || {};
        } catch (e) {}
        config.primaryColor = config.primaryColor || "#06b6d4";
        config.fontFamily = config.fontFamily || "'Inter', sans-serif";
        config.storeName = config.storeName || getStoreDetails().name;
        return generateHTMLFromConfig(invoice, config);
      },
    },
  };

  // --- 3. Template Render Functions ---
  function generateElegantTemplate(invoice) {
    const store = getStoreDetails();
    const currency = invoice.currency || "USD";
    const f = (val) => formatMoney(val, currency);

    const itemsHTML = (invoice.items || [])
      .map(
        (item) => `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea;">
                    <div style="font-weight: 600; color: #222;">${
                      item.name
                    }</div>
                    <div style="font-size: 11px; color: #888; font-family: 'Inter', sans-serif;">${
                      item.id || ""
                    } ${
          item.serialNumber ? `(SN: ${item.serialNumber})` : ""
        }</div>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; text-align: center;">${
                  item.qty || 1
                }</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; text-align: right;">${f(
                  item.price,
                )}</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; text-align: right; font-weight: 600;">${f(
                  (item.qty || 1) * item.price,
                )}</td>
            </tr>
        `,
      )
      .join("");

    return `
        <div id="receipt-content" style="font-family: 'Playfair Display', Georgia, serif; padding: 40px; max-width: 800px; margin: 0 auto; background: #faf9f6; color: #333; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 32px; font-weight: 700; color: #111; letter-spacing: 2px; margin: 0;">${
                  store.name
                }</h1>
                <p style="font-size: 12px; color: #666; font-style: italic; margin-top: 5px;">${
                  store.address
                } | ${store.contact}</p>
                <div style="margin: 20px auto 0; width: 50px; height: 1px; background: #ccc;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 40px; font-family: 'Inter', sans-serif; font-size: 12px;">
                <div>
                    <p style="text-transform: uppercase; color: #999; font-size: 10px; letter-spacing: 1px; margin-bottom: 5px;">Billed To</p>
                    <p style="font-size: 14px; color: #222; font-weight: 600;">${
                      invoice.customerName || "Walk-in Customer"
                    }</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 2px 0;"><strong>Invoice No:</strong> ${
                      invoice.id
                    }</p>
                    <p style="margin: 2px 0;"><strong>Date:</strong> ${new Date(
                      invoice.date,
                    ).toLocaleDateString()}</p>
                    <p style="margin: 6px 0 0 0;">${getInvoiceStatusBadge(
                      invoice.status,
                    )}</p>
                </div>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 13px; margin-bottom: 40px;">
                <thead>
                    <tr style="border-bottom: 2px solid #222;">
                        <th style="padding: 10px 0; text-align: left; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Description</th>
                        <th style="padding: 10px 0; text-align: center; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Qty</th>
                        <th style="padding: 10px 0; text-align: right; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Rate</th>
                        <th style="padding: 10px 0; text-align: right; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Amount</th>
                    </tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
            </table>
            <div style="display: flex; justify-content: flex-end; font-family: 'Inter', sans-serif;">
                <div style="width: 300px;">
                    <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #666; font-size: 13px;"><span>Subtotal:</span><span>${f(
                      invoice.subtotalInBaseCurrency,
                    )}</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 6px 0; color: #666; font-size: 13px;"><span>Tax:</span><span>${f(
                      invoice.taxInBaseCurrency,
                    )}</span></div>
                    <div style="display: flex; justify-content: space-between; padding: 15px 0; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; margin-top: 10px; font-size: 18px; font-weight: 700; color: #111;">
                        <span>Total Due:</span><span>${f(
                          invoice.totalInBaseCurrency,
                        )}</span>
                    </div>
                </div>
            </div>
            <div style="margin-top: 60px; text-align: center; font-style: italic; color: #888; font-size: 13px;">
                <p>${store.footerText.replace(/\n/g, "<br>")}</p>
            </div>
        </div>`;
  }

  function generateCorporateTemplate(invoice) {
    const store = getStoreDetails();
    const currency = invoice.currency || "USD";
    const f = (val) => formatMoney(val, currency);

    const itemsHTML = (invoice.items || [])
      .map(
        (item, idx) => `
            <tr style="background-color: ${
              idx % 2 === 0 ? "#f8fafc" : "#ffffff"
            };">
                <td style="padding: 10px; color: #1e293b; font-weight: 500;">${
                  item.name
                } <span style="display:block; font-size:10px; color:#64748b; font-weight:normal;">${
          item.id || ""
        }</span></td>
                <td style="padding: 10px; text-align: center; color: #475569;">${
                  item.qty || 1
                }</td>
                <td style="padding: 10px; text-align: right; color: #475569;">${f(
                  item.price,
                )}</td>
                <td style="padding: 10px; text-align: right; color: #0f172a; font-weight: 600;">${f(
                  (item.qty || 1) * item.price,
                )}</td>
            </tr>
        `,
      )
      .join("");

    return `
        <div id="receipt-content" style="font-family: 'Inter', Arial, sans-serif; padding: 0; max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; line-height: 1.5;">
            <div style="background-color: #1e3a8a; padding: 30px; color: #ffffff; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="font-size: 28px; font-weight: 800; margin: 0; letter-spacing: 1px;">${
                      store.name
                    }</h1>
                    <p style="font-size: 12px; color: #bfdbfe; margin-top: 4px;">${
                      store.contact
                    }</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="font-size: 32px; font-weight: 900; margin: 0; color: #60a5fa; text-transform: uppercase;">INVOICE</h2>
                    <p style="font-size: 14px; font-weight: 600; margin-top: 5px;">#${
                      invoice.id
                    }</p>
                </div>
            </div>
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div style="width: 45%;">
                        <p style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px;">Invoice To</p>
                        <p style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0;">${
                          invoice.customerName || "Walk-in Customer"
                        }</p>
                    </div>
                    <div style="width: 45%; background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span style="color: #64748b; font-size: 12px;">Date:</span><span style="color: #0f172a; font-weight: 600; font-size: 12px;">${new Date(
                          invoice.date,
                        ).toLocaleDateString()}</span></div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span style="color: #64748b; font-size: 12px;">Status:</span><span>${getInvoiceStatusBadge(
                          invoice.status,
                        )}</span></div>
                        <div style="display: flex; justify-content: space-between;"><span style="color: #64748b; font-size: 12px;">Cashier:</span><span style="color: #0f172a; font-weight: 600; font-size: 12px;">${
                          invoice.cashierName
                        }</span></div>
                    </div>
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 30px;">
                    <thead>
                        <tr style="background-color: #1e3a8a; color: #ffffff;">
                            <th style="padding: 12px 10px; text-align: left; font-weight: 600;">Description</th>
                            <th style="padding: 12px 10px; text-align: center; font-weight: 600;">Qty</th>
                            <th style="padding: 12px 10px; text-align: right; font-weight: 600;">Unit Price</th>
                            <th style="padding: 12px 10px; text-align: right; font-weight: 600;">Total</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHTML}</tbody>
                </table>
                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 320px; background: #f8fafc; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; justify-content: space-between; padding-bottom: 8px; color: #64748b; font-size: 13px;"><span>Subtotal</span><span style="color: #0f172a; font-weight: 600;">${f(
                          invoice.subtotalInBaseCurrency,
                        )}</span></div>
                        <div style="display: flex; justify-content: space-between; padding-bottom: 8px; color: #64748b; font-size: 13px;"><span>Tax</span><span style="color: #0f172a; font-weight: 600;">${f(
                          invoice.taxInBaseCurrency,
                        )}</span></div>
                        <div style="display: flex; justify-content: space-between; padding-top: 12px; margin-top: 4px; border-top: 2px solid #cbd5e1; font-size: 18px; font-weight: 800; color: #1e3a8a;">
                            <span>Grand Total</span><span>${f(
                              invoice.totalInBaseCurrency,
                            )}</span>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
                    <strong>${store.name}</strong> • ${store.address}<br>
                    ${store.footerText.replace(/\n/g, " • ")}
                </div>
            </div>`;
  }

  function generateMinimalistTemplate(invoice) {
    const store = getStoreDetails();
    const currency = invoice.currency || "USD";
    const f = (val) => formatMoney(val, currency);

    const itemsHTML = (invoice.items || [])
      .map(
        (item) => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #333;">
                <div style="flex: 1;">
                    <div style="color: #fff; font-weight: 500; font-size: 13px;">${
                      item.name
                    }</div>
                    <div style="color: #666; font-size: 11px; font-family: monospace;">${
                      item.id || ""
                    } x${item.qty || 1}</div>
                </div>
                <div style="color: #fff; font-weight: 600; font-size: 13px; font-family: monospace;">
                    ${f((item.qty || 1) * item.price)}
                </div>
            </div>
        `,
      )
      .join("");

    return `
        <div id="receipt-content" style="font-family: 'Inter', sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; background: #111; color: #eee; line-height: 1.5;">
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 10px; letter-spacing: 4px; color: #666; text-transform: uppercase; margin-bottom: 10px;">Receipt</div>
                <h1 style="font-size: 24px; font-weight: 400; color: #fff; margin: 0; letter-spacing: 1px;">${
                  store.name
                }</h1>
                <p style="font-size: 12px; color: #888; margin-top: 10px; font-family: monospace;">${
                  invoice.id
                } • ${new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            
            <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #333;">
                <p style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Billed To</p>
                <p style="font-size: 14px; color: #fff;">${
                  invoice.customerName || "Walk-in Customer"
                }</p>
            </div>

            <div style="margin-bottom: 30px;">
                ${itemsHTML}
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #888; padding: 5px 0;">
                <span>Subtotal</span>
                <span style="font-family: monospace;">${f(
                  invoice.subtotalInBaseCurrency,
                )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #888; padding: 5px 0;">
                <span>Tax</span>
                <span style="font-family: monospace;">${f(
                  invoice.taxInBaseCurrency,
                )}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #444;">
                <span style="font-size: 14px; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">Total</span>
                <span style="font-size: 24px; color: #fff; font-weight: 300; font-family: monospace;">${f(
                  invoice.totalInBaseCurrency,
                )}</span>
            </div>

            <div style="margin-top: 50px; text-align: center; color: #555; font-size: 11px;">
                <p>${store.footerText.replace(/\n/g, "<br>")}</p>
            </div>
        </div>`;
  }

  function generateHTMLFromConfig(invoice, config) {
    const color = config.primaryColor || "#06b6d4";
    const textColor = config.textColor || "#1e293b";
    const font = config.fontFamily || "'Inter', sans-serif";
    const currency = invoice.currency || "USD";
    const f = (val) => formatMoney(val, currency);

    const isSplit = config.headerLayout === "split";
    const isCenter = config.headerLayout === "center";

    let headerHTML = "";
    if (isSplit) {
      headerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid ${color}; padding-bottom: 20px;">
                    <div style="width: 50%;">
                        ${
                          config.showLogo && config.logoUrl
                            ? `<img src="${config.logoUrl}" style="max-height: 60px; margin-bottom: 10px;">`
                            : ""
                        }
                        <h1 style="font-size: 28px; font-weight: 800; margin: 0; color: ${color};">${
        config.storeName
      }</h1>
                        <p style="font-size: 12px; color: #64748b; margin: 5px 0 0 0;">${
                          config.storeAddress
                        }</p>
                        <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">${
                          config.storeContact
                        }</p>
                        ${
                          config.taxId
                            ? `<p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">VAT/BIN: ${config.taxId}</p>`
                            : ""
                        }
                    </div>
                    <div style="width: 50%; text-align: right;">
                        <h2 style="font-size: 32px; font-weight: 900; margin: 0; color: #cbd5e1; text-transform: uppercase;">INVOICE</h2>
                        <p style="font-size: 14px; font-weight: 700; color: ${textColor}; margin: 5px 0;">#${
        invoice.id
      }</p>
                        <p style="font-size: 12px; color: #64748b; margin: 2px 0;">Date: ${new Date(
                          invoice.date,
                        ).toLocaleDateString()}</p>
                        <div style="margin-top: 8px;">${getInvoiceStatusBadge(
                          invoice.status,
                        )}</div>
                    </div>
                </div>
            `;
    } else {
      headerHTML = `
                <div style="text-align: ${
                  isCenter ? "center" : config.headerLayout
                }; margin-bottom: 30px; border-bottom: 3px solid ${color}; padding-bottom: 20px;">
                    ${
                      config.showLogo && config.logoUrl
                        ? `<img src="${config.logoUrl}" style="max-height: 60px; margin-bottom: 15px; display: inline-block;">`
                        : ""
                    }
                    <h1 style="font-size: 32px; font-weight: 800; margin: 0; color: ${color};">${
        config.storeName
      }</h1>
                    <p style="font-size: 13px; color: #64748b; margin: 8px 0 0 0;">${
                      config.storeAddress
                    } | ${config.storeContact}</p>
                    ${
                      config.taxId
                        ? `<p style="font-size: 13px; color: #64748b; margin: 4px 0 0 0; font-weight: 500;">VAT/BIN: ${config.taxId}</p>`
                        : ""
                    }
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div>
                        <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin: 0 0 5px 0;">Billed To</p>
                        <p style="font-size: 16px; font-weight: 700; margin: 0; color: ${textColor};">${
        invoice.customerName || "Walk-in Customer"
      }</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin: 0 0 5px 0;">Invoice Details</p>
                        <p style="font-size: 14px; margin: 0 0 4px 0; color: ${textColor};"><strong>INV#:</strong> <span style="font-family: monospace;">${
        invoice.id
      }</span></p>
                        <p style="font-size: 13px; margin: 0 0 4px 0; color: #64748b;">Date: ${new Date(
                          invoice.date,
                        ).toLocaleDateString()}</p>
                        <p style="margin: 0;">${getInvoiceStatusBadge(
                          invoice.status,
                        )}</p>
                    </div>
                </div>
            `;
    }

    const itemsHTML = (invoice.items || [])
      .map((item, idx) => {
        const bg =
          config.stripedRows && idx % 2 !== 0 ? "#f8fafc" : "transparent";
        const borderB = config.showBorders ? "1px solid #e2e8f0" : "none";
        return `
            <tr style="background-color: ${bg};">
                <td style="padding: 12px 10px; border-bottom: ${borderB}; color: ${textColor};">
                    <div style="font-weight: 600;">${item.name}</div>
                    ${
                      config.showSku
                        ? `<div style="font-size: 11px; color: #64748b; font-family: monospace;">${
                            item.id || ""
                          } ${
                            item.serialNumber
                              ? `(SN: ${item.serialNumber})`
                              : ""
                          }</div>`
                        : ""
                    }
                </td>
                <td style="padding: 12px 10px; border-bottom: ${borderB}; text-align: center; color: #475569;">${
          item.qty || 1
        }</td>
                <td style="padding: 12px 10px; border-bottom: ${borderB}; text-align: right; color: #475569; font-family: monospace;">${f(
          item.price,
        )}</td>
                <td style="padding: 12px 10px; border-bottom: ${borderB}; text-align: right; font-weight: 600; color: ${textColor}; font-family: monospace;">${f(
          (item.qty || 1) * item.price,
        )}</td>
            </tr>
            `;
      })
      .join("");

    return `
        <div id="receipt-content" style="font-family: ${font}; padding: 40px; max-width: 800px; margin: 0 auto; background: #ffffff; color: ${textColor}; line-height: 1.6; position: relative;">
            
            ${
              config.showWatermark && config.logoUrl
                ? `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: ${
                    config.watermarkOpacity || "0.05"
                  }; pointer-events: none; z-index: 0;"><img src="${
                    config.logoUrl
                  }" style="width: 400px; height: auto; filter: grayscale(100%);"></div>`
                : ""
            }
            
            <div style="position: relative; z-index: 1;">
                
                ${headerHTML}

                ${
                  isSplit
                    ? `
                <div style="margin-bottom: 30px; background: #f8fafc; padding: 15px 20px; border-left: 4px solid ${color};">
                    <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin: 0 0 5px 0;">Billed To</p>
                    <p style="font-size: 16px; font-weight: 700; margin: 0; color: ${textColor};">${
                        invoice.customerName || "Walk-in Customer"
                      }</p>
                </div>
                `
                    : ""
                }

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 14px;">
                    <thead>
                        <tr>
                            <th style="padding: 12px 10px; text-align: left; font-weight: 700; color: #ffffff; background-color: ${color}; border-radius: 6px 0 0 6px;">Description</th>
                            <th style="padding: 12px 10px; text-align: center; font-weight: 700; color: #ffffff; background-color: ${color};">Qty</th>
                            <th style="padding: 12px 10px; text-align: right; font-weight: 700; color: #ffffff; background-color: ${color};">Unit Price</th>
                            <th style="padding: 12px 10px; text-align: right; font-weight: 700; color: #ffffff; background-color: ${color}; border-radius: 0 6px 6px 0;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>

                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="width: 45%; font-size: 11px; color: #64748b;">
                        ${
                          config.termsText
                            ? `<strong>Terms & Conditions:</strong><br><span style="white-space: pre-wrap;">${config.termsText}</span>`
                            : ""
                        }
                    </div>
                    <div style="width: 350px;">
                        <div style="display: flex; justify-content: space-between; padding: 8px 10px; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0;">
                            <span>Subtotal:</span>
                            <span style="font-family: monospace;">${f(
                              invoice.subtotalInBaseCurrency,
                            )}</span>
                        </div>
                        ${
                          config.showTax
                            ? `
                        <div style="display: flex; justify-content: space-between; padding: 8px 10px; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0;">
                            <span>Tax:</span>
                            <span style="font-family: monospace;">${f(
                              invoice.taxInBaseCurrency,
                            )}</span>
                        </div>`
                            : ""
                        }
                        <div style="display: flex; justify-content: space-between; padding: 15px 10px; font-size: 20px; font-weight: 800; color: #ffffff; background-color: ${color}; border-radius: 6px; margin-top: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                            <span>Total Due:</span>
                            <span style="font-family: monospace;">${f(
                              invoice.totalInBaseCurrency,
                            )}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #64748b; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="white-space: pre-wrap; margin: 0; font-weight: 500;">${
                      config.footerText
                    }</p>
                </div>
            </div>
        </div>
        `;
  }

  // --- 4. Injection & Observer Logic ---
  // We strictly listen for the #tab-content-templates container generated by cashshilpo-settings-tab.js

  function injectAdvancedCustomBuilder(container, isBangla) {
    // Prevent duplicate injection
    if (document.getElementById("advanced-template-builder")) return;

    const config = getStoreDetails();

    const builderDiv = document.createElement("div");
    builderDiv.id = "advanced-template-builder";
    builderDiv.className = "builder-section mt-8";

    builderDiv.innerHTML = `
        <h2 class="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
            <i data-lucide="pen-tool" class="text-cyan-400"></i> ${
              isBangla
                ? "কাস্টম ইনভয়েস বিল্ডার"
                : "Advanced Custom Invoice Builder"
            }
        </h2>
        <p class="text-sm text-text-secondary mb-6">${
          isBangla
            ? 'নিজস্ব লোগো, রং এবং লেআউট দিয়ে আপনার টেমপ্লেট ডিজাইন করুন। টেমপ্লেট সিলেক্টর থেকে "My Custom Template" বেছে নিন।'
            : 'Design your perfect invoice with custom logos, branding colors, and detailed layout controls. Select "My Custom Template" from the options above.'
        }</p>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left: Controls -->
            <div class="lg:col-span-5 space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                
                <!-- Logo Upload -->
                <div>
                    <div class="builder-section-title">Brand Logo</div>
                    <label class="logo-upload-box block">
                        <input type="file" id="ct-logoUpload" accept="image/*" class="hidden">
                        <img id="ct-logoPreview" src="${
                          config.logoUrl || ""
                        }" class="logo-preview-img ${
      config.logoUrl ? "" : "hidden"
    } mb-2">
                        <div id="ct-logoPlaceholder" class="${
                          config.logoUrl ? "hidden" : ""
                        }">
                            <i data-lucide="upload-cloud" class="w-8 h-8 mx-auto text-text-secondary mb-2"></i>
                            <p class="text-sm text-text-secondary">Click to upload logo</p>
                        </div>
                        <input type="hidden" id="ct-logoBase64" value="${
                          config.logoUrl || ""
                        }">
                    </label>
                </div>

                <!-- Brand Info -->
                <div>
                    <div class="builder-section-title">Company Information</div>
                    <div class="space-y-3">
                        <div><label class="block text-xs text-text-secondary mb-1">Company Name</label><input type="text" id="ct-storeName" value="${
                          config.name
                        }" class="form-input w-full text-sm"></div>
                        <div><label class="block text-xs text-text-secondary mb-1">Address</label><input type="text" id="ct-storeAddress" value="${
                          config.address
                        }" class="form-input w-full text-sm"></div>
                        <div class="grid grid-cols-2 gap-3">
                            <div><label class="block text-xs text-text-secondary mb-1">Contact</label><input type="text" id="ct-storeContact" value="${
                              config.contact
                            }" class="form-input w-full text-sm"></div>
                            <div><label class="block text-xs text-text-secondary mb-1">VAT/Tax ID</label><input type="text" id="ct-taxId" value="${
                              config.taxId
                            }" class="form-input w-full text-sm"></div>
                        </div>
                    </div>
                </div>

                <!-- Styling -->
                <div>
                    <div class="builder-section-title">Styling & Typography</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs text-text-secondary mb-1">Primary Color</label>
                            <div class="flex items-center gap-2">
                                <input type="color" id="ct-primaryColor" value="${
                                  config.primaryColor || "#06b6d4"
                                }" class="h-8 w-10 p-0 border-0 bg-transparent cursor-pointer rounded">
                                <span class="text-xs font-mono text-text-secondary uppercase" id="ct-colorVal">${
                                  config.primaryColor || "#06b6d4"
                                }</span>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs text-text-secondary mb-1">Text Color</label>
                            <input type="color" id="ct-textColor" value="${
                              config.textColor || "#1e293b"
                            }" class="h-8 w-10 p-0 border-0 bg-transparent cursor-pointer rounded">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-xs text-text-secondary mb-1">Font Family</label>
                            <select id="ct-fontFamily" class="form-select w-full text-sm">
                                <option value="'Inter', sans-serif" ${
                                  (config.fontFamily || "").includes("Inter")
                                    ? "selected"
                                    : ""
                                }>Inter (Modern Sans)</option>
                                <option value="'Playfair Display', serif" ${
                                  (config.fontFamily || "").includes("Playfair")
                                    ? "selected"
                                    : ""
                                }>Playfair (Elegant Serif)</option>
                                <option value="'Courier New', monospace" ${
                                  (config.fontFamily || "").includes("Courier")
                                    ? "selected"
                                    : ""
                                }>Courier (Classic Mono)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Layout Toggles -->
                <div>
                    <div class="builder-section-title">Layout Options</div>
                    <div class="space-y-2">
                        <div>
                            <label class="block text-xs text-text-secondary mb-1">Header Layout</label>
                            <select id="ct-headerLayout" class="form-select w-full text-sm mb-3">
                                <option value="split" ${
                                  config.headerLayout === "split"
                                    ? "selected"
                                    : ""
                                }>Split (Left & Right)</option>
                                <option value="left" ${
                                  config.headerLayout === "left"
                                    ? "selected"
                                    : ""
                                }>Aligned Left</option>
                                <option value="center" ${
                                  config.headerLayout === "center"
                                    ? "selected"
                                    : ""
                                }>Aligned Center</option>
                            </select>
                        </div>
                        <label class="flex items-center justify-between p-2 rounded bg-bg-secondary cursor-pointer">
                            <span class="text-sm">Show Header Logo</span>
                            <input type="checkbox" id="ct-showLogo" class="form-checkbox h-4 w-4 text-cyan-500 rounded" ${
                              config.showLogo !== false ? "checked" : ""
                            }>
                        </label>
                        <label class="flex items-center justify-between p-2 rounded bg-bg-secondary cursor-pointer">
                            <span class="text-sm">Show Logo Watermark</span>
                            <input type="checkbox" id="ct-showWatermark" class="form-checkbox h-4 w-4 text-cyan-500 rounded" ${
                              config.showWatermark ? "checked" : ""
                            }>
                        </label>
                        <label class="flex items-center justify-between p-2 rounded bg-bg-secondary cursor-pointer">
                            <span class="text-sm">Striped Table Rows</span>
                            <input type="checkbox" id="ct-stripedRows" class="form-checkbox h-4 w-4 text-cyan-500 rounded" ${
                              config.stripedRows !== false ? "checked" : ""
                            }>
                        </label>
                        <label class="flex items-center justify-between p-2 rounded bg-bg-secondary cursor-pointer">
                            <span class="text-sm">Show Table Borders</span>
                            <input type="checkbox" id="ct-showBorders" class="form-checkbox h-4 w-4 text-cyan-500 rounded" ${
                              config.showBorders !== false ? "checked" : ""
                            }>
                        </label>
                        <label class="flex items-center justify-between p-2 rounded bg-bg-secondary cursor-pointer">
                            <span class="text-sm">Show Tax Row</span>
                            <input type="checkbox" id="ct-showTax" class="form-checkbox h-4 w-4 text-cyan-500 rounded" ${
                              config.showTax !== false ? "checked" : ""
                            }>
                        </label>
                        <label class="flex items-center justify-between p-2 rounded bg-bg-secondary cursor-pointer">
                            <span class="text-sm">Show Item SKUs</span>
                            <input type="checkbox" id="ct-showSku" class="form-checkbox h-4 w-4 text-cyan-500 rounded" ${
                              config.showSku !== false ? "checked" : ""
                            }>
                        </label>
                    </div>
                </div>

                <!-- Extra Texts -->
                <div>
                    <div class="builder-section-title">Extra Content</div>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-xs text-text-secondary mb-1">Terms & Conditions</label>
                            <textarea id="ct-termsText" class="form-textarea w-full h-16 text-sm" placeholder="Returns accepted within 30 days...">${
                              config.termsText || ""
                            }</textarea>
                        </div>
                        <div>
                            <label class="block text-xs text-text-secondary mb-1">Footer Note</label>
                            <textarea id="ct-footerText" class="form-textarea w-full h-16 text-sm" placeholder="Thank you for your business!">${
                              config.footerText || ""
                            }</textarea>
                        </div>
                    </div>
                </div>

                <button type="button" id="ct-saveBuilderBtn" class="btn btn-primary w-full shadow-lg shadow-cyan-500/20 py-3 text-sm tracking-wide"><i data-lucide="save" class="w-4 h-4 mr-2"></i> Save Template Design</button>
            </div>

            <!-- Right: Live Preview -->
            <div class="lg:col-span-7 bg-[#cbd5e1] rounded-xl border border-border-color p-4 flex items-start justify-center overflow-hidden relative shadow-inner h-[800px]">
                <div class="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded font-mono uppercase tracking-widest z-10 backdrop-blur-sm">Live Preview</div>
                <div id="ct-livePreview" class="w-[800px] origin-top shadow-2xl transition-all" style="transform: scale(0.65);"></div>
            </div>
        </div>
    `;

    // Attempt to place it before the "Save Changes" button wrapper, if it exists
    const saveBtnWrap = container.querySelector(".flex.justify-end");
    if (saveBtnWrap) {
      container.insertBefore(builderDiv, saveBtnWrap);
    } else {
      container.appendChild(builderDiv);
    }

    if (window.lucide) window.lucide.createIcons();
    bindBuilderEvents(builderDiv, isBangla);
  }

  function bindBuilderEvents(container, isBangla) {
    const previewEl = container.querySelector("#ct-livePreview");
    const inputs = container.querySelectorAll("input, select, textarea");

    const updatePreview = () => {
      const tempConfig = {
        storeName: document.getElementById("ct-storeName").value,
        storeAddress: document.getElementById("ct-storeAddress").value,
        storeContact: document.getElementById("ct-storeContact").value,
        taxId: document.getElementById("ct-taxId").value,
        primaryColor: document.getElementById("ct-primaryColor").value,
        textColor: document.getElementById("ct-textColor").value,
        fontFamily: document.getElementById("ct-fontFamily").value,
        headerLayout: document.getElementById("ct-headerLayout").value,
        showLogo: document.getElementById("ct-showLogo").checked,
        showWatermark: document.getElementById("ct-showWatermark").checked,
        stripedRows: document.getElementById("ct-stripedRows").checked,
        showBorders: document.getElementById("ct-showBorders").checked,
        showTax: document.getElementById("ct-showTax").checked,
        showSku: document.getElementById("ct-showSku").checked,
        termsText: document.getElementById("ct-termsText").value,
        footerText: document.getElementById("ct-footerText").value,
        logoUrl: document.getElementById("ct-logoBase64").value,
      };

      const mockInvoice = {
        id: "INV-2026",
        date: new Date().toISOString(),
        customerName: "Alex Morgan",
        status: "Paid",
        currency: "USD",
        subtotalInBaseCurrency: 350.0,
        taxInBaseCurrency: 35.0,
        totalInBaseCurrency: 385.0,
        items: [
          { name: "Mechanical Keyboard", id: "SKU-112", qty: 1, price: 150 },
          { name: "Ergonomic Mouse", id: "SKU-115", qty: 2, price: 100 },
        ],
      };

      previewEl.innerHTML = generateHTMLFromConfig(mockInvoice, tempConfig);
    };

    // Logo Upload Logic to Base64
    const logoUpload = document.getElementById("ct-logoUpload");
    logoUpload.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          const b64 = evt.target.result;
          document.getElementById("ct-logoBase64").value = b64;
          const previewImg = document.getElementById("ct-logoPreview");
          previewImg.src = b64;
          previewImg.classList.remove("hidden");
          document.getElementById("ct-logoPlaceholder").classList.add("hidden");
          updatePreview();
        };
        reader.readAsDataURL(file);
      }
    });

    // Bind all inputs
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (input.id === "ct-primaryColor") {
          document.getElementById("ct-colorVal").textContent = input.value;
        }
        updatePreview();
      });
    });

    // Save Logic
    document
      .getElementById("ct-saveBuilderBtn")
      .addEventListener("click", () => {
        const finalConfig = {
          storeName: document.getElementById("ct-storeName").value,
          storeAddress: document.getElementById("ct-storeAddress").value,
          storeContact: document.getElementById("ct-storeContact").value,
          taxId: document.getElementById("ct-taxId").value,
          primaryColor: document.getElementById("ct-primaryColor").value,
          textColor: document.getElementById("ct-textColor").value,
          fontFamily: document.getElementById("ct-fontFamily").value,
          headerLayout: document.getElementById("ct-headerLayout").value,
          showLogo: document.getElementById("ct-showLogo").checked,
          showWatermark: document.getElementById("ct-showWatermark").checked,
          stripedRows: document.getElementById("ct-stripedRows").checked,
          showBorders: document.getElementById("ct-showBorders").checked,
          showTax: document.getElementById("ct-showTax").checked,
          showSku: document.getElementById("ct-showSku").checked,
          termsText: document.getElementById("ct-termsText").value,
          footerText: document.getElementById("ct-footerText").value,
          logoUrl: document.getElementById("ct-logoBase64").value,
        };
        localStorage.setItem(CONFIG_KEY, JSON.stringify(finalConfig));

        // Toasts if available, fallback to alert
        if (typeof showToast === "function") {
          showToast(
            isBangla
              ? "কাস্টম টেমপ্লেট সেভ করা হয়েছে!"
              : "Custom Template Saved Successfully!",
            "success",
          );
        } else {
          alert(
            isBangla
              ? "কাস্টম টেমপ্লেট সেভ করা হয়েছে!"
              : "Custom Template Saved Successfully!",
          );
        }
        updatePreview();
      });

    // Initialize preview
    updatePreview();
  }

  // --- 5. Observer to hook into the Templates tab seamlessly ---
  const tabObserver = new MutationObserver(() => {
    const templatesPane = document.getElementById("tab-content-templates");
    if (
      templatesPane &&
      !document.getElementById("advanced-template-builder")
    ) {
      const isBangla = document.body.classList.contains("lang-bn");
      injectAdvancedCustomBuilder(templatesPane, isBangla);
    }
  });

  tabObserver.observe(document.body, { childList: true, subtree: true });

  // Fallback initial check if the tab already exists when this script runs
  const existingTemplatesPane = document.getElementById(
    "tab-content-templates",
  );
  if (
    existingTemplatesPane &&
    !document.getElementById("advanced-template-builder")
  ) {
    injectAdvancedCustomBuilder(
      existingTemplatesPane,
      document.body.classList.contains("lang-bn"),
    );
  }
})();
