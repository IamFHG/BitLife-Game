import React, { useState } from 'react';
import { GameState, Asset, StockAsset } from '../types';
import { REAL_ESTATE_CATALOG, VEHICLES_CATALOG, PETS_CATALOG, RELICS_CATALOG, INITIAL_STOCKS } from '../data/initialData';
import { formatMoney } from '../utils/gameUtils';
import { Coins, X, Home, Car, Dog, Sparkles, TrendingUp, DollarSign } from 'lucide-react';

interface AssetsModalProps {
  state: GameState;
  onClose: () => void;
  onBuyAsset: (asset: Asset) => void;
  onSellAsset: (assetId: string) => void;
  onTradeStock: (symbol: string, sharesDelta: number) => void;
}

export const AssetsModal: React.FC<AssetsModalProps> = ({
  state,
  onClose,
  onBuyAsset,
  onSellAsset,
  onTradeStock
}) => {
  const { bankBalance } = state.character;
  const [activeTab, setActiveTab] = useState<'owned' | 'realestate' | 'vehicles' | 'pets' | 'relics' | 'stocks'>('owned');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePurchase = (item: { name: string; price: number; annualCost: number; icon: string; type: any; details?: string }) => {
    if (bankBalance < item.price) {
      setFeedback(`Insufficient funds! You need ${formatMoney(item.price)}.`);
      return;
    }

    const newAsset: Asset = {
      id: 'asset_' + Date.now(),
      name: item.name,
      type: item.type,
      purchasePrice: item.price,
      currentValue: item.price,
      annualCost: item.annualCost,
      icon: item.icon,
      condition: 100,
      yearPurchased: state.character.age,
      details: item.details
    };

    onBuyAsset(newAsset);
    setFeedback(`Successfully purchased ${item.name} for ${formatMoney(item.price)}!`);
  };

  const handleSell = (asset: Asset) => {
    onSellAsset(asset.id);
    setFeedback(`Sold ${asset.name} for ${formatMoney(asset.currentValue)}!`);
  };

  return (
    <div className="fixed inset-0 z-40 max-w-md mx-auto w-full h-full bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-150 select-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-700 px-4 py-3 text-white flex items-center justify-between border-b-2 border-cyan-300">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-white" />
            <h2 className="text-xl font-black italic tracking-wide text-white drop-shadow">
              Assets & Wealth
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cyan-800/80 hover:bg-cyan-900 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-cyan-50/50 text-[11px] font-bold overflow-x-auto p-1 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('owned')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${activeTab === 'owned' ? 'bg-cyan-600 text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:bg-cyan-100'}`}
          >
            My Assets ({state.assets.length})
          </button>
          <button
            onClick={() => setActiveTab('realestate')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${activeTab === 'realestate' ? 'bg-cyan-600 text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:bg-cyan-100'}`}
          >
            <Home className="w-3.5 h-3.5" /> Real Estate
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${activeTab === 'vehicles' ? 'bg-cyan-600 text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:bg-cyan-100'}`}
          >
            <Car className="w-3.5 h-3.5" /> Vehicles
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${activeTab === 'pets' ? 'bg-cyan-600 text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:bg-cyan-100'}`}
          >
            <Dog className="w-3.5 h-3.5" /> Pets
          </button>
          <button
            onClick={() => setActiveTab('relics')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${activeTab === 'relics' ? 'bg-cyan-600 text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:bg-cyan-100'}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Relics
          </button>
          <button
            onClick={() => setActiveTab('stocks')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 ${activeTab === 'stocks' ? 'bg-cyan-600 text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:bg-cyan-100'}`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Stocks & Crypto
          </button>
        </div>

        {/* Body Content */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2">
          {feedback && (
            <div className="bg-cyan-100 border border-cyan-400 text-cyan-950 p-2.5 rounded-xl font-semibold text-xs flex items-center justify-between">
              <span>{feedback}</span>
              <button
                onClick={() => setFeedback(null)}
                className="text-[10px] bg-cyan-200 hover:bg-cyan-300 px-2 py-0.5 rounded font-bold"
              >
                OK
              </button>
            </div>
          )}

          {/* MY ASSETS TAB */}
          {activeTab === 'owned' && (
            state.assets.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-medium space-y-1">
                <p className="text-xs">You do not own any real estate, vehicles, or pets yet.</p>
                <p className="text-[10px] text-slate-400">Browse the tabs above to invest!</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {state.assets.map(asset => (
                  <div
                    key={asset.id}
                    className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="text-xl bg-cyan-50 w-9 h-9 flex items-center justify-center rounded-lg border border-cyan-100 shrink-0">{asset.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-slate-800 text-xs truncate">{asset.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium truncate">
                          Val: {formatMoney(asset.currentValue)} • Maint: {formatMoney(asset.annualCost)}/yr
                        </div>
                        {asset.details && <div className="text-[9px] text-amber-700 font-bold truncate">{asset.details}</div>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSell(asset)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-2xs active:scale-95 transition shrink-0"
                    >
                      Sell ({formatMoney(asset.currentValue)})
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* REAL ESTATE SHOP */}
          {activeTab === 'realestate' && (
            <div className="space-y-1.5">
              {REAL_ESTATE_CATALOG.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between hover:border-cyan-400 transition gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="text-xl bg-slate-50 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-100 shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-slate-800 text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">Tax/Upkeep: {formatMoney(item.annualCost)}/yr</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-2xs active:scale-95 transition shrink-0"
                  >
                    Buy ({formatMoney(item.price)})
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* VEHICLES SHOP */}
          {activeTab === 'vehicles' && (
            <div className="space-y-1.5">
              {VEHICLES_CATALOG.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between hover:border-cyan-400 transition gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="text-xl bg-slate-50 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-100 shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-slate-800 text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">Maint: {formatMoney(item.annualCost)}/yr</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-2xs active:scale-95 transition shrink-0"
                  >
                    Buy ({formatMoney(item.price)})
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* PETS SHELTER */}
          {activeTab === 'pets' && (
            <div className="space-y-1.5">
              {PETS_CATALOG.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between hover:border-cyan-400 transition gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="text-xl bg-slate-50 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-100 shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-slate-800 text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">Food/Vet: {formatMoney(item.annualCost)}/yr</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-2xs active:scale-95 transition shrink-0"
                  >
                    Adopt ({formatMoney(item.price)})
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* RELICS */}
          {activeTab === 'relics' && (
            <div className="space-y-1.5">
              {RELICS_CATALOG.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-amber-300/80 shadow-2xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="text-xl bg-amber-50 w-9 h-9 flex items-center justify-center rounded-lg border border-amber-200 shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-slate-800 text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-amber-800 font-bold truncate">{item.details}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md shadow-2xs active:scale-95 transition border border-amber-300 shrink-0"
                  >
                    Buy ({formatMoney(item.price)})
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STOCKS & CRYPTO TRADING */}
          {activeTab === 'stocks' && (
            <div className="space-y-1.5">
              {(state.stocks.length > 0 ? state.stocks : INITIAL_STOCKS).map((stock, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                      <span className="truncate">{stock.name}</span>
                      <span className="text-[10px] font-black text-slate-400 shrink-0">({stock.symbol})</span>
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 truncate mt-0.5">
                      Price: <span className="font-bold text-slate-700">{formatMoney(stock.price)}</span> • Owned: <span className="font-bold text-slate-700">{stock.sharesOwned} sh</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onTradeStock(stock.symbol, 1)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-2 py-1 rounded-md active:scale-95 shadow-2xs"
                    >
                      + Buy 1
                    </button>
                    <button
                      onClick={() => onTradeStock(stock.symbol, -1)}
                      disabled={stock.sharesOwned <= 0}
                      className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-2 py-1 rounded-md active:scale-95 shadow-2xs disabled:opacity-40"
                    >
                      - Sell 1
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};
