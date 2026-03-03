// ========================================
// 🏨 ORION HOTEL CONCIERGE - CONFIGURATION
// ========================================
// 📝 INSTRUCTIONS: Customize this file for each hotel deployment
// All branding, contact info, and features are controlled here

const HOTEL_CONFIG = {
  // 🏢 HOTEL IDENTITY
  branding: {
    name: "Orion Hotel",
    tagline: "Where Stars Meet Service",
    location: "15 Ocean Drive, Umhlanga, Durban, South Africa",
    phone: "+27 31 555 0100",
    email: "reservations@orionhotel.co.za",
    website: "www.orionhotel.co.za",
    logo: "./orion-hotel-logo.png", // Path to logo image
  },

  // 🎨 VISUAL THEME
  theme: {
    primaryColor: "#1a365d", // Deep navy blue
    accentColor: "#3b82f6", // Electric blue (lightning bolt)
    backgroundColor: "#f0f4f8", // Light gray-blue
    chatBotBg: "#ffffff",
    chatUserBg: "#1a365d",
  },

  // 📞 CONTACT & NOTIFICATIONS
  contacts: {
    // Your notification numbers (for system alerts)
    primaryContact: "+27724971810", // Graham - Primary
    emergencyContact: "+27780920145", // Graham - Emergency backup

    // Discord webhooks (set in Google Apps Script Properties)
    discordEnabled: true,
    discordChannels: {
      restaurant: "DISCORD_REST",
      housekeeping: "DISCORD_HK",
      maintenance: "DISCORD_MAIN",
      reservations: "DISCORD_RESV",
      emergency: "DISCORD_EMER",
    },
  },

  // 🍽️ DINING OPTIONS
  dining: {
    restaurants: [
      {
        name: "Orion Grill & Bar",
        cuisine: "Contemporary South African with International Flair",
        hours: "Lunch: 12:00 - 15:00 | Dinner: 18:00 - 22:00",
        phone: "+27 31 555 0101",
        features: [
          "Ocean Views",
          "Live Music Fridays",
          "Craft Cocktails",
          "Kids Menu",
        ],
        specialties:
          "Flame-grilled steaks, Fresh seafood, Signature Orion Burger",
      },
      {
        name: "The Lighthouse Lounge",
        cuisine: "Light Bites & Sundowners",
        hours: "Daily: 10:00 - 23:00",
        phone: "+27 31 555 0102",
        features: [
          "Rooftop Terrace",
          "Sunset Views",
          "Tapas Menu",
          "Premium Gin Bar",
        ],
        specialties: "Tapas platters, Artisan cocktails, Local craft beers",
      },
      {
        name: "Constellation Café",
        cuisine: "Breakfast & Coffee Bar",
        hours: "Daily: 06:00 - 11:00",
        features: [
          "Buffet Option",
          "Continental & Full English",
          "Barista Coffee",
        ],
        specialties: "Made-to-order omelettes, Fresh pastries, Smoothie bowls",
      },
    ],
    breakfastIncluded: true,
    breakfastTimes: "06:00 - 10:30 daily",
  },

  // 🛏️ ACCOMMODATION
  rooms: {
    types: [
      {
        name: "Celestial Standard",
        description: "Modern comfort with contemporary design",
        bedding: "King or Twin beds",
        bathroom: "Walk-in rain shower",
        features: [
          "Free WiFi",
          "Smart TV",
          "Mini-bar",
          "Work desk",
          "Sea-facing balcony",
        ],
        size: "28 sqm",
      },
      {
        name: "Galaxy Suite",
        description: "Spacious elegance with panoramic views",
        bedding: "King bed",
        bathroom: "Bath & separate shower",
        features: [
          "Free WiFi",
          "Smart TV",
          "Mini-bar",
          "Lounge area",
          "Ocean-view balcony",
          "Nespresso machine",
        ],
        size: "42 sqm",
      },
      {
        name: "Constellation Penthouse",
        description: "Ultimate luxury on the top floor",
        bedding: "King bed + separate lounge",
        bathroom: "Jacuzzi bath & rain shower",
        features: [
          "Free WiFi",
          "Smart TV",
          "Full bar",
          "Dining area",
          "Wrap-around terrace",
          "Butler service",
        ],
        size: "65 sqm",
      },
    ],
    amenities: [
      "Rooftop infinity pool with ocean views",
      "24-hour fitness center",
      "Business center with meeting rooms",
      "Secure parking (complimentary)",
      "Concierge services",
      "Laundry & dry cleaning",
    ],
  },

  // 💆 WELLNESS & SPA
  wellness: {
    onSite: {
      name: "Orion Express Spa",
      services: [
        "Express massages",
        "Manicures",
        "Pedicures",
        "Head & shoulder treatments",
      ],
      hours: "09:00 - 20:00 daily",
      booking: "Contact reception",
    },
    sisterProperty: {
      name: "Constellation Spa & Wellness Centre",
      description: "Full-service luxury spa (5 min drive)",
      services: [
        "Full-body massages",
        "Facials",
        "Body wraps",
        "Couples packages",
        "Day spa experiences",
      ],
      phone: "+27 31 555 0200",
      shuttle: "Complimentary shuttle available",
    },
  },

  // 🏖️ LOCAL ATTRACTIONS
  attractions: {
    beaches: [
      {
        name: "Umhlanga Main Beach",
        distance: "800m walk",
        features: ["Lifeguards", "Promenade", "Pier"],
      },
      {
        name: "Bronze Beach",
        distance: "1.2km",
        features: ["Tidal pools", "Family-friendly"],
      },
    ],
    shopping: [
      {
        name: "Gateway Theatre of Shopping",
        distance: "5km",
        description: "Africa's largest mall",
      },
      {
        name: "Chartwell Drive Boutiques",
        distance: "2km",
        description: "Upscale shopping & dining",
      },
    ],
    activities: [
      "Whale watching (June - November)",
      "Dolphin cruises",
      "Ushaka Marine World (15 min drive)",
      "Moses Mabhida Stadium skywalk",
      "Durban Botanic Gardens",
    ],
  },

  // 📋 POLICIES & INFO
  policies: {
    checkIn: "14:00",
    checkOut: "10:00",
    lateCheckout: "Subject to availability (fee may apply)",
    earlyCheckin: "Subject to availability (complimentary if possible)",

    wifi: {
      network: "Orion_Guest",
      password: "Stars2024!",
      speed: "High-speed fiber (complimentary)",
    },

    smoking: "Outdoor designated areas only",
    pets: "Small pets welcome (prior arrangement required)",
    children: "All ages welcome. Cots & highchairs available",

    cancellation: "Free cancellation up to 48 hours before arrival",
    payment: "All major credit cards accepted. Pre-authorization required",
  },

  // 🚕 TRANSPORTATION
  transportation: {
    airport: {
      name: "King Shaka International Airport",
      distance: "15km (20 min drive)",
      shuttle: "Airport shuttle available (pre-booking required)",
      cost: "R350 per vehicle (up to 4 passengers)",
    },
    localTransport: {
      taxi: "Uber & Bolt readily available",
      carRental: "On-site Avis desk",
      parking: "Complimentary secure parking for guests",
    },
  },

  // ⚙️ FEATURE TOGGLES
  features: {
    voiceInput: true, // Enable microphone button
    voiceOutput: true, // Enable text-to-speech responses
    emergencyButton: true, // Show emergency alert button
    quickButtons: true, // Show quick action buttons
    multilingual: true, // AI language detection
    weatherIntegration: true, // Show current weather
    whatsappEnabled: false, // WhatsApp Business API (coming soon)
  },

  // 🤖 AI BEHAVIOR
  ai: {
    model: "gemini-2.0-flash-exp",
    tone: "Professional yet warm and welcoming",
    languages: ["English", "Zulu", "Afrikaans", "Xhosa"],
    defaultLanguage: "English",
    maxHistoryLength: 20, // Keep last 20 exchanges (prevents token overflow)

    quickResponses: {
      wifi: `Our WiFi network is "${this.policies.wifi.network}" with password: ${this.policies.wifi.password}`,
      checkout: `Check-out time is ${this.policies.checkOut}. Late check-out subject to availability.`,
      checkin: `Check-in time is ${this.policies.checkIn}. We'll do our best to accommodate early arrivals!`,
      pool: "Our rooftop infinity pool is open daily for hotel guests, offering stunning 180° ocean views.",
      parking: "Complimentary secure parking is available for all guests.",
      breakfast: `Breakfast is served daily from ${this.dining.breakfastTimes} at Constellation Café.`,
    },
  },

  // 🔧 SYSTEM SETTINGS
  system: {
    version: "2.0.0",
    deploymentType: "production",
    maintenanceMode: false,
    debugMode: false,

    // Google Apps Script configuration
    backend: {
      scriptUrl:
        "https://script.google.com/macros/s/AKfycbybdjGk_90F9MLOz6S1eJYEvW-UEhvsYhnmRjYGyGtfwLxOFrvBUqpQDi5hFxsvyTUcBQ/exec", // Set after deploying backend.gs
      sheetId: "1GyoF26V7ezFS04Eo7kKyPQQ299nBfOhgZi5iEJ-o_U8", // Your Google Sheet ID
      cacheTimeout: 21600, // 6 hours
    },

    // Rate limiting
    rateLimits: {
      messagesPerMinute: 10,
      emergencyAlertsPerHour: 3,
    },
  },
};

// 🌐 Export for use in HTML files
if (typeof module !== "undefined" && module.exports) {
  module.exports = HOTEL_CONFIG;
}
