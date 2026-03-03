// ========================================================================
// 🏨 ORION HOTEL CONCIERGE v2.0 - PRODUCTION BACKEND
// ========================================================================

const SCRIPT_PROP = PropertiesService.getScriptProperties();
const GEMINI_KEY = SCRIPT_PROP.getProperty('GEMINI_API_KEY');
const WEATHER_KEY = SCRIPT_PROP.getProperty('WEATHER_API_KEY');
const SHEET_ID = SCRIPT_PROP.getProperty('SHEET_ID') || '1_PDHJnVcK6m8iKeoBAfqu0ugm02_Oy22WZigr6O3jSw';

// ========================================================================
// API ENDPOINTS
// ========================================================================

function doGet(e) {
  if (e.parameter.action === 'health') return createJSON(getSystemHealth());
  return createJSON({ status: "online", version: "2.0", system: "Orion Concierge Active" });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    switch(data.action) {
      case "chat": return handleChat(data);
      case "fetch_data": return handleFetchData(data);
      case "update_status": return handleUpdateStatus(data);
      case "notify": return handleEmergency(data);
      case "get_analytics": return handleAnalytics(data);
      default: return createJSON({ status: "error", message: "Invalid action" });
    }
  } catch (err) {
    logError("doPost", err);
    return createJSON({ status: "error", message: err.toString() });
  }
}

// ========================================================================
// CHAT HANDLER
// ========================================================================

function handleChat(data) {
  try {
    const userMessage = data.message;
    const history = trimHistory(data.history || "");
    
    if (!userMessage) return createJSON({ status: "error", message: "Empty message" });
    
    // Quick responses (no API call needed)
    const quick = checkQuickResponse(userMessage);
    if (quick) {
      logToSheet("CHAT LOG", [new Date(), `Guest: ${userMessage} | Bot: ${quick} [QUICK]`]);
      return createJSON({ status: "success", reply: quick });
    }
    
    const aiReply = generateAI(history, userMessage);
    logToSheet("CHAT LOG", [new Date(), `Guest: ${userMessage} | Bot: ${aiReply}`]);
    
    return createJSON({ status: "success", reply: aiReply });
  } catch (err) {
    return createJSON({ status: "error", reply: "Connection issue. Please contact +27 31 555 0100." });
  }
}

// ========================================================================
// AI BRAIN
// ========================================================================

function generateAI(history, msg) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_KEY}`;
  
  const prompt = `You are the AI Concierge at Orion Hotel (15 Ocean Drive, Umhlanga, Durban).

LANGUAGE: Detect guest language (English/Zulu/Afrikaans) and reply in SAME language.

COLLECT INFO BEFORE CREATING TICKETS:
- Restaurant: Name, Phone, Pax, Time, Email
- Room Booking: Name, Phone, Email, ID, Pax, Check-in, Nights
- Housekeeping: Room, Guest Name, Item needed
- Maintenance: Room, Guest Name, Issue

ACTION TAGS (English only):
||REST|Name|Phone|Pax|Time|Email|Requests||
||HOTEL_RES|Name|Phone|Email|ID|Pax|Date|Nights|Requests||
||HK|Room|Guest|Item||
||MAINT|Guest|Room|Issue||

HOTEL INFO:
📍 Orion Hotel, Umhlanga | ☎️ +27 31 555 0100
🍽️ Restaurants: Orion Grill (12-22h), Lighthouse Lounge (10-23h), Constellation Café (6-11h breakfast)
🛏️ Rooms: Celestial Standard, Galaxy Suite, Constellation Penthouse
🏊 Rooftop pool, WiFi: Orion_Guest / Stars2024!
⏰ Check-in: 14:00 | Check-out: 10:00
${getRealTimeContext()}

HISTORY: ${history}
Guest: ${msg}
Response:`;

  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  
  try {
    const res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    let text = JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
    return processActions(text);
  } catch (e) {
    return "I'm syncing with reception. For immediate help: +27 31 555 0100";
  }
}

// ========================================================================
// ACTION PROCESSOR
// ========================================================================

function processActions(text) {
  return text.replace(/\|\|(.*?)\|\|/g, function(match, content) {
    const p = content.split("|");
    const tag = p[0];
    
    if (tag === 'REST') {
      logToSheet("RESTAURANT RESERVATIONS", [new Date(), p[1], p[2], p[3], p[4], p[5]||"N/A", p[6]||"None", "Confirmed", "Open"]);
      sendDiscord("DISCORD_REST", `🍽️ NEW BOOKING\n👤 ${p[1]}\n📞 ${p[2]}\n👥 ${p[3]} pax\n⏰ ${p[4]}`);
    }
    
    if (tag === 'HK') {
      logToSheet("HOUSEKEEPING", [new Date(), p[1], p[2], p[3], "Open"]);
      sendDiscord("DISCORD_HK", `🧹 HOUSEKEEPING\n🚪 Room ${p[1]}\n👤 ${p[2]}\n📋 ${p[3]}`);
    }
    
    if (tag === 'MAINT') {
      const urgent = p[3].toLowerCase().includes('urgent') ? "URGENT" : "Standard";
      logToSheet("MAINTENANCE", [new Date(), p[1], p[2], p[3], urgent, "Open"]);
      sendDiscord("DISCORD_MAIN", `🔧 MAINTENANCE\n🚪 Room ${p[2]}\n👤 ${p[1]}\n⚠️ ${p[3]}\n${urgent==="URGENT"?"🚨 URGENT":""}`);
    }
    
    if (tag === 'HOTEL_RES') {
      logToSheet("HOTEL RESERVATIONS", [new Date(), p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8]||"None", "Awaiting Confirmation", "Open"]);
      sendDiscord("DISCORD_RESV", `🛏️ ROOM INQUIRY\n👤 ${p[1]}\n📞 ${p[2]}\n📅 ${p[6]} (${p[7]} nights)\n👥 ${p[5]} guests`);
    }
    
    return "";
  });
}

// ========================================================================
// DATA HANDLERS
// ========================================================================

function handleFetchData(data) {
  try {
    const sheetData = getSheetData(data.tab);
    const statusCol = getStatusCol(data.tab);
    
    if (data.filter === "open" && statusCol >= 0 && sheetData.length > 1) {
      const filtered = [sheetData[0]].concat(
        sheetData.slice(1).filter(r => r[statusCol] !== "Completed" && r[statusCol] !== "Confirmed")
      );
      return createJSON({ status: "success", data: filtered });
    }
    
    return createJSON({ status: "success", data: sheetData });
  } catch(err) {
    return createJSON({ status: "error", message: err.toString() });
  }
}

function handleUpdateStatus(data) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(data.tab);
    const statusCol = getStatusCol(data.tab);
    sheet.getRange(data.rowIndex, statusCol + 1).setValue(data.newStatus);
    return createJSON({ status: "success" });
  } catch(err) {
    return createJSON({ status: "error", message: err.toString() });
  }
}

function handleEmergency(data) {
  sendDiscord("DISCORD_EMER", `🚨 EMERGENCY\n\n${data.message}\n\n⏰ ${new Date().toLocaleString()}`);
  logToSheet("MAINTENANCE", [new Date(), "EMERGENCY BUTTON", "N/A", data.message, "URGENT", "Open"]);
  return createJSON({ status: "success" });
}

function handleAnalytics(data) {
  try {
    const days = data.range || 7;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const analytics = {
      total: 0, open: 0, completed: 0,
      byType: { restaurant: 0, housekeeping: 0, maintenance: 0, bookings: 0 },
      hourly: Array(24).fill(0)
    };
    
    ["RESTAURANT RESERVATIONS", "HOUSEKEEPING", "MAINTENANCE", "HOTEL RESERVATIONS"].forEach(tab => {
      const data = getSheetData(tab);
      data.slice(1).forEach(row => {
        const date = new Date(row[0]);
        if (date >= cutoff) {
          analytics.total++;
          analytics.hourly[date.getHours()]++;
          
          const statusCol = getStatusCol(tab);
          if (statusCol >= 0) {
            if (row[statusCol] === "Completed" || row[statusCol] === "Confirmed") analytics.completed++;
            else analytics.open++;
          }
          
          if (tab.includes("RESTAURANT")) analytics.byType.restaurant++;
          else if (tab.includes("HOUSEKEEPING")) analytics.byType.housekeeping++;
          else if (tab.includes("MAINTENANCE")) analytics.byType.maintenance++;
          else analytics.byType.bookings++;
        }
      });
    });
    
    return createJSON({ status: "success", analytics });
  } catch(err) {
    return createJSON({ status: "error", message: err.toString() });
  }
}

// ========================================================================
// HELPERS
// ========================================================================

function trimHistory(history) {
  const lines = history.split('\n').filter(l => l.includes('Guest:') || l.includes('Concierge:'));
  return lines.length > 20 ? lines.slice(-20).join('\n') : history;
}

function checkQuickResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('wifi') || m.includes('password')) return 'WiFi: Orion_Guest / Stars2024!';
  if (m.includes('check out')) return 'Check-out: 10:00. Late checkout available (ask me to request it)';
  if (m.includes('check in')) return 'Check-in: 14:00. Early arrival? Let me know your ETA!';
  if (m.includes('pool')) return 'Rooftop infinity pool open daily for guests - stunning ocean views!';
  if (m.includes('parking')) return 'Free secure parking for all guests. Show room key at entrance.';
  return null;
}

function getRealTimeContext() {
  const now = new Date();
  let ctx = "\n📅 " + Utilities.formatDate(now, "GMT+2", "EEEE, d MMM HH:mm") + " (SA Time)";
  
  if (WEATHER_KEY) {
    try {
      const w = JSON.parse(UrlFetchApp.fetch(`https://api.openweathermap.org/data/2.5/weather?q=Umhlanga,ZA&units=metric&appid=${WEATHER_KEY}`, {muteHttpExceptions:true}).getContentText());
      if (w.main) ctx += `\n🌤️ ${w.weather[0].description}, ${Math.round(w.main.temp)}°C`;
    } catch(e) {}
  }
  return ctx;
}

function getSheetData(tab) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(tab);
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) return [];
    const start = Math.max(1, lastRow - 50);
    return sheet.getRange(start, 1, Math.min(51, lastRow), sheet.getLastColumn()).getValues();
  } catch(e) { return []; }
}

function logToSheet(tab, data) {
  const lock = LockService.getScriptLock();
  try {
    if (lock.tryLock(10000)) {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(tab);
      if (sheet) { sheet.appendRow(data); SpreadsheetApp.flush(); }
    }
  } catch(e) {} finally { lock.releaseLock(); }
}

function sendDiscord(key, msg) {
  const url = SCRIPT_PROP.getProperty(key);
  if (!url) return;
  try {
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ content: msg }),
      muteHttpExceptions: true
    });
  } catch(e) {}
}

function getStatusCol(tab) {
  const cols = { "RESTAURANT RESERVATIONS": 8, "HOUSEKEEPING": 4, "MAINTENANCE": 5, "HOTEL RESERVATIONS": 9 };
  return cols[tab] !== undefined ? cols[tab] : -1;
}

function getSystemHealth() {
  const health = { version: "2.0", services: { gemini: "unknown", sheets: "unknown", discord: 0 } };
  
  try {
    if (GEMINI_KEY) {
      const r = UrlFetchApp.fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_KEY}`, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({ contents: [{ parts: [{ text: "test" }] }] }),
        muteHttpExceptions: true
      });
      health.services.gemini = r.getResponseCode() === 200 ? "online" : "error";
    }
  } catch(e) { health.services.gemini = "offline"; }
  
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    health.services.sheets = ss ? "online" : "offline";
  } catch(e) { health.services.sheets = "offline"; }
  
  ["DISCORD_REST", "DISCORD_HK", "DISCORD_MAIN", "DISCORD_RESV", "DISCORD_EMER"].forEach(k => {
    if (SCRIPT_PROP.getProperty(k)) health.services.discord++;
  });
  
  return health;
}

function logError(fn, err) {
  console.error(`[${fn}] ${err}`);
  try { logToSheet("CHAT LOG", [new Date(), `ERROR in ${fn}: ${err.toString()}`]); } catch(e) {}
}

function createJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}