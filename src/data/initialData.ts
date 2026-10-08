import { Job, Asset, StockAsset } from '../types';

export const COUNTRIES_CITIES = [
  { country: 'United States', city: 'New York', flag: '🇺🇸' },
  { country: 'France', city: 'Paris', flag: '🇫🇷' },
  { country: 'United Kingdom', city: 'London', flag: '🇬🇧' },
  { country: 'Japan', city: 'Tokyo', flag: '🇯🇵' },
  { country: 'Australia', city: 'Sydney', flag: '🇦🇺' },
  { country: 'Canada', city: 'Toronto', flag: '🇨🇦' },
  { country: 'Germany', city: 'Berlin', flag: '🇩🇪' },
  { country: 'Monaco', city: 'Monte Carlo', flag: '🇲🇨' },
  { country: 'Brazil', city: 'Rio de Janeiro', flag: '🇧🇷' },
  { country: 'South Korea', city: 'Seoul', flag: '🇰🇷' },
];

export const AVAILABLE_JOBS_CATALOG: Omit<Job, 'id' | 'performance' | 'yearsInRole'>[] = [
  // Entry Level / Service
  { title: 'Fast Food Cashier', company: 'BurgerKing Pin', salary: 22000, reqSmarts: 10, category: 'Service', reqDegree: 'High School' },
  { title: 'Coffee Barista', company: 'Starbeans', salary: 28000, reqSmarts: 15, category: 'Service', reqDegree: 'High School' },
  { title: 'Taxi / Rideshare Driver', company: 'UberRide', salary: 34000, reqSmarts: 20, category: 'Service', reqDegree: 'High School' },
  
  // Trade & Manual
  { title: 'Apprentice Electrician', company: 'Volt Power Co.', salary: 42000, reqSmarts: 30, category: 'Trade', reqDegree: 'High School' },
  { title: 'Automotive Mechanic', company: 'Apex Auto Repair', salary: 48000, reqSmarts: 35, category: 'Trade', reqDegree: 'High School' },
  { title: 'Construction Inspector', company: 'BuildRight Ltd.', salary: 62000, reqSmarts: 45, category: 'Trade', reqDegree: 'High School' },

  // Tech & Corporate
  { title: 'Junior Software Engineer', company: 'GooGleTech', salary: 85000, reqSmarts: 65, category: 'Tech', reqDegree: 'University' },
  { title: 'Senior Software Architect', company: 'GooGleTech', salary: 165000, reqSmarts: 80, category: 'Tech', reqDegree: 'University' },
  { title: 'Financial Analyst', company: 'Goldman Wall St', salary: 95000, reqSmarts: 70, category: 'Corporate', reqDegree: 'University' },
  { title: 'Corporate Attorney', company: 'Pearson & Hardman', salary: 180000, reqSmarts: 85, category: 'Corporate', reqDegree: 'Law School' },

  // Medical
  { title: 'Registered Nurse', company: 'St. Jude Hospital', salary: 75000, reqSmarts: 60, category: 'Medical', reqDegree: 'Nursing School' },
  { title: 'Chief Surgeon', company: 'St. Jude Hospital', salary: 320000, reqSmarts: 90, category: 'Medical', reqDegree: 'Medical School' },

  // Creative & Special Fame
  { title: 'Background Extra Actor', company: 'Hollywood Studios', salary: 35000, reqSmarts: 20, reqLooks: 50, category: 'Creative', isSpecialFame: true, reqDegree: 'High School' },
  { title: 'Lead Movie Actor', company: 'Warner Paramount', salary: 1200000, reqSmarts: 40, reqLooks: 75, category: 'Creative', isSpecialFame: true, reqDegree: 'High School' },
  { title: 'Pop Star Singer', company: 'Universal Records', salary: 2500000, reqSmarts: 30, reqLooks: 70, category: 'Creative', isSpecialFame: true, reqDegree: 'High School' },

  // Executive
  { title: 'Vice President of Operations', company: 'Apex Global', salary: 450000, reqSmarts: 85, category: 'Executive', reqDegree: 'Business School' },
  { title: 'Chief Executive Officer (CEO)', company: 'Fortune 500 Inc.', salary: 3500000, reqSmarts: 90, category: 'Executive', reqDegree: 'Business School' }
];

export const REAL_ESTATE_CATALOG = [
  { name: 'Studio Apartment', price: 120000, annualCost: 2400, icon: '🏢', type: 'RealEstate' as const },
  { name: 'Suburban Family Home', price: 450000, annualCost: 6000, icon: '🏡', type: 'RealEstate' as const },
  { name: 'Beachfront Villa', price: 2200000, annualCost: 25000, icon: '🏖️', type: 'RealEstate' as const },
  { name: 'Beverly Hills Mansion', price: 8500000, annualCost: 90000, icon: '🏰', type: 'RealEstate' as const },
  { name: 'Monaco Penthouse', price: 25000000, annualCost: 200000, icon: '🌆', type: 'RealEstate' as const }
];

export const VEHICLES_CATALOG = [
  { name: 'Used Sedan', price: 8000, annualCost: 1200, icon: '🚗', type: 'Vehicle' as const },
  { name: 'Luxury Electric SUV', price: 75000, annualCost: 3500, icon: '🚘', type: 'Vehicle' as const },
  { name: 'Italian Supercar (Ferrari style)', price: 280000, annualCost: 15000, icon: '🏎️', type: 'Vehicle' as const },
  { name: 'Private Motor Yacht', price: 3500000, annualCost: 120000, icon: '🛥️', type: 'Vehicle' as const },
  { name: 'Executive Helicopter', price: 6000000, annualCost: 180000, icon: '🚁', type: 'Vehicle' as const }
];

export const PETS_CATALOG = [
  { name: 'Golden Retriever Dog', price: 800, annualCost: 1200, icon: '🐕', type: 'Pet' as const },
  { name: 'Persian Kitten', price: 600, annualCost: 800, icon: '🐈', type: 'Pet' as const },
  { name: 'Exotic Macaw Parrot', price: 2500, annualCost: 1500, icon: '🦜', type: 'Pet' as const },
  { name: 'Baby Bengal Tiger', price: 25000, annualCost: 12000, icon: '🐅', type: 'Pet' as const }
];

export const RELICS_CATALOG = [
  { name: 'Golden Neko Lucky Statue', price: 50000, annualCost: 0, icon: '🐱', type: 'Relic' as const, details: '+€2M/year passive lucky wealth earnings' },
  { name: 'Golden Wrench Repair Kit', price: 75000, annualCost: 0, icon: '🔧', type: 'Relic' as const, details: 'Keeps all vehicles in mint 100% condition automatically' },
  { name: 'Diamond VIP Crown', price: 500000, annualCost: 0, icon: '👑', type: 'Relic' as const, details: '+20% Looks & Fame permanent aura' }
];

export const INITIAL_STOCKS: StockAsset[] = [
  { symbol: 'APPL', name: 'Pear Inc.', price: 185, changePercent: 2.4, sharesOwned: 0, history: [175, 180, 182, 185] },
  { symbol: 'TESL', name: 'Volt Motors', price: 240, changePercent: -1.8, sharesOwned: 0, history: [255, 250, 245, 240] },
  { symbol: 'AMZN', name: 'Jungle Corp', price: 140, changePercent: 4.1, sharesOwned: 0, history: [125, 130, 135, 140] },
  { symbol: 'BITC', name: 'BitCoin Crypto', price: 64000, changePercent: 8.5, sharesOwned: 0, history: [52000, 58000, 61000, 64000] }
];

export const PLASTIC_SURGERIES = [
  { name: 'Botox Injection', cost: 1500, looksBoost: 8, icon: '💉' },
  { name: 'Teeth Whitening & Veneers', cost: 4000, looksBoost: 12, icon: '🪥' },
  { name: 'Rhinoplasty (Nose Job)', cost: 9000, looksBoost: 20, icon: '👃' },
  { name: 'Hair Transplant', cost: 12000, looksBoost: 18, icon: '💇' },
  { name: 'Full Body Facelift', cost: 25000, looksBoost: 30, icon: '✨' }
];

export const CRIMES_LIST = [
  { name: 'Pickpocketing', risk: 'Low', moneyReward: 150, jailTime: 1, icon: '👛' },
  { name: 'Shoplifting Luxury Store', risk: 'Medium', moneyReward: 1200, jailTime: 2, icon: '🏬' },
  { name: 'Grand Theft Auto', risk: 'High', moneyReward: 18000, jailTime: 5, icon: '🏎️' },
  { name: 'Bank Vault Heist', risk: 'Very High', moneyReward: 250000, jailTime: 15, icon: '🏦' }
];
