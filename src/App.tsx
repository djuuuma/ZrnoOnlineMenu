/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Info } from 'lucide-react';

// --- Types ---

type Category = 'COFFEE' | 'WINE' | 'BITES';

type Lang = 'bs' | 'en';

interface LocalizedText {
  en: string;
  bs: string;
}

interface MenuItem {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: string;
  category: Category;
  subCategory?: string;
  origin?: string;
  producer?: string;
  region?: string;
  varietal?: string;
  vintage?: string;
  tastingNotes?: LocalizedText;
  isAvailable: boolean;
  isSpecial?: boolean;
}

const ALL_TAB = 'All';

// --- Mock Data ---

const MENU_ITEMS: MenuItem[] = [
  // COFFEE
  {
    id: 'c1',
    name: {
      en: 'Ethiopia Sidamo',
      bs: 'Etiopija Sidamo'
    },
    description: {
      en: 'Single-origin espresso with jasmine and citrus notes.',
      bs: 'Jednosortni espresso s notama jasmina i agruma.'
    },
    price: '4.50',
    category: 'COFFEE',
    subCategory: 'Espresso',
    origin: 'Ethiopia',
    producer: 'Daye Bensa',
    region: 'Sidamo',
    varietal: 'Heirloom',
    tastingNotes: {
      en: 'Jasmine, Bergamot, Lemon Zest',
      bs: 'Jasmin, bergamot, limunova kora'
    },
    isAvailable: true
  },
  {
    id: 'c2',
    name: {
      en: 'Colombia Geisha',
      bs: 'Kolumbija Geisha'
    },
    description: {
      en: 'Rare pour-over with complex floral profile.',
      bs: 'Rijetak pour-over sa složenim cvjetnim profilom.'
    },
    price: '9.00',
    category: 'COFFEE',
    subCategory: 'Filter',
    origin: 'Colombia',
    producer: 'La Palma y El Tucan',
    region: 'Cundinamarca',
    varietal: 'Geisha',
    tastingNotes: {
      en: 'Peach, Honeysuckle, Silky Body',
      bs: 'Breskva, zimzelen, svilenasto tijelo'
    },
    isAvailable: true,
    isSpecial: true
  },
  {
    id: 'c3',
    name: {
      en: 'Flat White',
      bs: 'Flat White'
    },
    description: {
      en: 'Velvety micro-foam over double ristretto.',
      bs: 'Baršunasti mikro-pjenasti sloj preko dvostrukog ristretta.'
    },
    price: '4.80',
    category: 'COFFEE',
    subCategory: 'Espresso',
    isAvailable: true
  },
  {
    id: 'c4',
    name: {
      en: 'Cold Brew Nitro',
      bs: 'Hladna nitro kava'
    },
    description: {
      en: 'Infused with nitrogen for a creamy, stout-like head.',
      bs: 'Infuzirano dušikom za kremastu pjenicu kao kod stouta.'
    },
    price: '5.50',
    category: 'COFFEE',
    subCategory: 'Cold',
    isAvailable: true
  },

  // WINE
  {
    id: 'w1',
    name: {
      en: 'Radikon Ribolla Gialla',
      bs: 'Radikon Ribolla Gialla'
    },
    description: {
      en: 'Skin-contact orange wine from a legendary producer.',
      bs: 'Narandžasto vino s maceracijom kože od legendarnog proizvođača.'
    },
    price: '18 | 85',
    category: 'WINE',
    subCategory: 'Orange',
    origin: 'Italy',
    producer: 'Radikon',
    region: 'Friuli',
    varietal: 'Ribolla Gialla',
    vintage: '2018',
    tastingNotes: {
      en: 'Dried Apricot, Tea Tannins, Volatile Acidity',
      bs: 'Suša breskva, tanini čaja, volatilna kiselost'
    },
    isAvailable: true,
    isSpecial: true
  },
  {
    id: 'w2',
    name: {
      en: 'Meinklang Prosa',
      bs: 'Meinklang Prosa'
    },
    description: {
      en: 'Frizzante rosé with notes of wild strawberries.',
      bs: 'Frizzante rose s notama divljih jagoda.'
    },
    price: '12 | 50',
    category: 'WINE',
    subCategory: 'Bubbles',
    origin: 'Austria',
    producer: 'Meinklang',
    region: 'Burgenland',
    varietal: 'Pinot Noir',
    vintage: '2022',
    tastingNotes: {
      en: 'Strawberry, Rhubarb, Yeast',
      bs: 'Jagoda, rabarbara, kvasac'
    },
    isAvailable: true
  },
  {
    id: 'w3',
    name: {
      en: 'Partida Creus VN',
      bs: 'Partida Creus VN'
    },
    description: {
      en: 'Super-glou red, light body and high acidity.',
      bs: 'Super-glou crveno, lagano tijelo i visoka kiselost.'
    },
    price: '14 | 60',
    category: 'WINE',
    subCategory: 'Red',
    origin: 'Spain',
    producer: 'Partida Creus',
    region: 'Catalonia',
    varietal: 'Blend',
    vintage: '2021',
    tastingNotes: {
      en: 'Cherry, Pepper, Energetic',
      bs: 'Trešnja, biber, energično'
    },
    isAvailable: true
  },

  // BITES
  {
    id: 'b1',
    name: {
      en: 'Cured Meat Board',
      bs: 'Daska suhomesnatih pršuta i salama'
    },
    description: {
      en: 'Selection of three artisanal meats, pickles, sourdough.',
      bs: 'Tri vrste mesa, turšija i kiselo tijesto.'
    },
    price: '22',
    category: 'BITES',
    isAvailable: true
  },
  {
    id: 'b2',
    name: {
      en: 'Truffle Honey Crostini',
      bs: 'Crostini sa tartufastim medom'
    },
    description: {
      en: 'Whipped ricotta, truffle honey, crushed walnuts.',
      bs: 'Umutena rikota, tartufasti med, lomljeni orasi.'
    },
    price: '12',
    category: 'BITES',
    isAvailable: true
  }
];

const UI: Record<Lang, Record<string, string>> = {
  bs: {
    tagline: 'Kafa i vino',
    viewMenu: 'Pogledaj meni',
    lateNight: 'NOĆNI RAD DO 02:00',
    hub: 'HUB',
    categoriesMeta: '02 / KATEGORIJE',
    catCoffee: 'Kafa',
    catWine: 'Vino',
    catBites: 'Zakuske',
    active: 'AKTIVNO',
    hubFooter:
      'SIROVI MATERIJALI • TRADICIONALNE METODE • NISKA INTERVENCIJA • DIREKTNA NABAVKA',
    listMetaPrefix: '03 / MENI /',
    listSuffix: 'LISTA',
    stockNotice: 'Dopuna zaliha u toku',
    limitedPour: 'OGRANIČENO',
    endOfList: 'KRAJ LISTE',
    footerBrand: 'ZRNO INDUSTRIJSKI NOIR',
    producer: 'Proizvođač',
    region: 'Regija',
    varietal: 'Varijeta',
    vintage: 'Vintidž',
    origin: 'Porijeklo',
    tastingNotesLabel: 'Okusne note',
    tastingNotesLead: 'Note:',
    backToList: 'Nazad na listu',
    switchToEn: 'English',
    switchToBs: 'Bosanski'
  },
  en: {
    tagline: 'Coffee & Wine',
    viewMenu: 'View Menu',
    lateNight: 'LATE NIGHT 02:00',
    hub: 'HUB',
    categoriesMeta: '02 / CATEGORIES',
    catCoffee: 'Coffee',
    catWine: 'Wine',
    catBites: 'Bites',
    active: 'ACTIVE',
    hubFooter:
      'RAW MATERIALS • TRADITIONAL METHODS • LOW INTERVENTION • SOURCED DIRECTLY',
    listMetaPrefix: '03 / MENU /',
    listSuffix: 'LIST',
    stockNotice: 'Stock replenishment in progress',
    limitedPour: 'LIMITED POUR',
    endOfList: 'END OF LIST',
    footerBrand: 'ZRNO INDUSTRIAL NOIR',
    producer: 'Producer',
    region: 'Region',
    varietal: 'Varietal',
    vintage: 'Vintage',
    origin: 'Origin',
    tastingNotesLabel: 'Tasting Notes',
    tastingNotesLead: 'Notes of',
    backToList: 'Back to List',
    switchToEn: 'English',
    switchToBs: 'Bosanski'
  }
};

const SUB_TAB_LABEL: Record<string, LocalizedText> = {
  [ALL_TAB]: { en: 'All', bs: 'Sve' },
  Espresso: { en: 'Espresso', bs: 'Espresso' },
  Filter: { en: 'Filter', bs: 'Filter' },
  Cold: { en: 'Cold', bs: 'Hladno' },
  Orange: { en: 'Orange', bs: 'Narandžasto' },
  Bubbles: { en: 'Bubbles', bs: 'Pjenušavo' },
  Red: { en: 'Red', bs: 'Crveno' }
};

const CATEGORY_LABEL: Record<Category, LocalizedText> = {
  COFFEE: { en: 'COFFEE', bs: 'KAFA' },
  WINE: { en: 'WINE', bs: 'VINO' },
  BITES: { en: 'BITES', bs: 'ZAKUSKE' }
};

// --- Components ---

const GrainOverlay = () => <div className="noise-overlay" />;

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className={`min-h-screen bg-brand-background overflow-x-hidden relative ${className}`}
  >
    {/* Background Watermark */}
    <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-[0.03] z-0 select-none">
      <span className="text-[240px] font-black leading-none font-heading tracking-widest">RAW</span>
    </div>
    <div className="relative z-10 min-h-screen flex flex-col">
      {children}
    </div>
  </motion.div>
);


const SectionDivider = ({ title }: { title: string }) => (
  <div className="flex items-center gap-4 my-8 px-6">
    <div className="h-[1px] flex-1 bg-brand-border" />
    <span className="text-[10px] font-heading tracking-[0.3em] text-brand-muted uppercase whitespace-nowrap">{title}</span>
    <div className="h-[1px] flex-1 bg-brand-border" />
  </div>
);

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Lang>('bs');
  const [screen, setScreen] = useState<'WELCOME' | 'HUB' | 'LIST'>('WELCOME');
  const [activeCategory, setActiveCategory] = useState<Category>('COFFEE');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<string>(ALL_TAB);

  const t = (key: string) => UI[lang][key] ?? key;

  const pick = (x: LocalizedText) => x[lang];

  const subTabLabel = (tab: string) => (SUB_TAB_LABEL[tab] ? pick(SUB_TAB_LABEL[tab]) : tab);

  useEffect(() => {
    document.documentElement.lang = lang === 'bs' ? 'bs' : 'en';
  }, [lang]);

  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS.filter(item => item.category === activeCategory);
    if (activeSubTab !== ALL_TAB) {
      items = items.filter(item => item.subCategory === activeSubTab);
    }
    return items;
  }, [activeCategory, activeSubTab]);

  const subTabs = useMemo(() => {
    const tabs = Array.from(new Set(MENU_ITEMS
      .filter(item => item.category === activeCategory && item.subCategory)
      .map(item => item.subCategory as string)));
    return [ALL_TAB, ...tabs];
  }, [activeCategory]);

  const handleCategorySelect = (cat: Category) => {
    setActiveCategory(cat);
    setActiveSubTab(ALL_TAB);
    setScreen('LIST');
  };

  return (
    <div className="relative selection:bg-brand-primary/30">
      <GrainOverlay />
      
      <AnimatePresence mode="wait">
        {screen === 'WELCOME' && (
          <ScreenContainer key="welcome" className="flex flex-col items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 ember-glow opacity-30 pointer-events-none" />

            <div className="w-16 h-1 bg-brand-primary mb-12" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center z-10"
            >
              <h1 className="text-8xl font-black mb-4 tracking-[0.2em] leading-none">ZRNO</h1>
              <p className="text-brand-muted font-body tracking-[0.6em] text-[10px] uppercase">{t('tagline')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute bottom-20 left-12 right-12 z-20 flex flex-col gap-3"
            >
              <button
                type="button"
                aria-label={lang === 'bs' ? 'Switch language to English' : 'Switch language to Bosnian'}
                onClick={() => setLang(l => (l === 'bs' ? 'en' : 'bs'))}
                className="w-full py-3 border border-brand-border bg-brand-surface/80 text-[10px] font-heading tracking-[0.25em] uppercase text-brand-muted hover:text-brand-primary hover:border-brand-primary transition-all duration-300 active:scale-[0.98]"
              >
                {lang === 'bs' ? t('switchToEn') : t('switchToBs')}
              </button>
              <button
                id="enter-button"
                onClick={() => setScreen('HUB')}
                className="w-full py-5 border border-brand-primary text-brand-primary font-heading text-sm tracking-[0.4em] font-bold uppercase transition-all duration-500 hover:bg-brand-primary hover:text-brand-background active:scale-[0.98]"
              >
                {t('viewMenu')}
              </button>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-border bg-brand-surface/50 flex justify-between items-center px-8">
              <span className="text-[9px] tracking-[0.3em] font-heading text-brand-muted">EST. 2024</span>
              <span className="text-[9px] tracking-[0.3em] font-heading text-brand-primary">{t('lateNight')}</span>
            </div>
          </ScreenContainer>
        )}

        {screen === 'HUB' && (
          <ScreenContainer key="hub">
            <header className="h-20 bg-brand-background border-b border-brand-border flex items-end justify-between px-8 pb-6 bg-[#0A0908] relative">
              <h2 className="text-3xl font-black tracking-tighter">{t('hub')}</h2>
              <div className="flex items-end gap-4">
                <button
                  type="button"
                  onClick={() => setLang(l => (l === 'bs' ? 'en' : 'bs'))}
                  className="mb-0.5 px-3 py-1.5 border border-brand-border text-[9px] font-heading tracking-[0.2em] uppercase text-brand-muted hover:text-brand-primary hover:border-brand-primary transition-all"
                >
                  {lang === 'bs' ? t('switchToEn') : t('switchToBs')}
                </button>
                <span className="text-brand-muted text-[10px] tracking-widest font-heading hidden sm:inline">{t('categoriesMeta')}</span>
              </div>
            </header>

            <main className="flex-grow flex flex-col">
              {[
                { type: 'COFFEE' as const, labelKey: 'catCoffee', num: '01' },
                { type: 'WINE' as const, labelKey: 'catWine', num: '02' },
                { type: 'BITES' as const, labelKey: 'catBites', num: '03' }
              ].map((cat, i) => (
                <motion.div
                  key={cat.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  id={`cat-${cat.type.toLowerCase()}`}
                  onClick={() => handleCategorySelect(cat.type)}
                  className="flex-1 border-b border-brand-border p-8 flex items-center group cursor-pointer relative hover:bg-brand-surface transition-colors"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-brand-primary text-xs font-mono mr-6 font-bold tracking-widest">{cat.num}.</span>
                  <h3 className="text-5xl font-black tracking-widest group-hover:translate-x-2 transition-transform duration-500 whitespace-nowrap">
                    {t(cat.labelKey)}
                  </h3>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[9px] text-brand-primary font-bold tracking-widest">{t('active')}</span>
                  </div>
                </motion.div>
              ))}
            </main>

            <footer className="p-8 bg-brand-surface border-t border-brand-border mt-auto">
              <p className="text-[10px] text-brand-muted tracking-[0.3em] font-heading leading-loose">
                {t('hubFooter')}
              </p>
            </footer>
          </ScreenContainer>
        )}

        {screen === 'LIST' && (
          <ScreenContainer key="list">
            <header className="sticky top-0 bg-brand-background z-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="h-20 flex items-center px-4 bg-brand-surface border-b border-brand-primary shadow-lg">
                <button onClick={() => setScreen('HUB')} className="p-3 mr-2 bg-brand-background border border-brand-border text-brand-muted hover:text-brand-text active:scale-95 transition-all">
                  <ArrowLeft size={18} />
                </button>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-4 h-[1px] bg-brand-primary shrink-0" />
                    <h2 className="text-xl font-black tracking-widest text-brand-primary truncate">
                      {pick(CATEGORY_LABEL[activeCategory])} {t('listSuffix')}
                    </h2>
                  </div>
                  <span className="text-[9px] text-brand-muted tracking-[0.2em] font-heading ml-6 uppercase truncate block">
                    {t('listMetaPrefix')} {pick(CATEGORY_LABEL[activeCategory])}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLang(l => (l === 'bs' ? 'en' : 'bs'))}
                  className="shrink-0 px-2 py-1.5 border border-brand-border text-[8px] font-heading tracking-[0.15em] uppercase text-brand-muted hover:text-brand-primary self-center"
                >
                  {lang === 'bs' ? t('switchToEn') : t('switchToBs')}
                </button>
              </div>
              
              {subTabs.length > 1 && (
                <div className="flex bg-brand-background border-b border-brand-border">
                  {subTabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveSubTab(tab)}
                      className={`flex-1 py-4 text-[9px] font-heading tracking-[0.3em] uppercase transition-all relative border-r border-brand-border last:border-r-0 ${
                        activeSubTab === tab ? 'bg-brand-surface text-brand-primary' : 'text-brand-muted'
                      }`}
                    >
                      {subTabLabel(tab)}
                      {activeSubTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </header>

            <main className="flex-grow">
              {filteredItems.length === 0 ? (
                <div className="h-60 flex items-center justify-center text-brand-muted uppercase tracking-[0.4em] text-[10px] font-heading text-center px-4">
                  {t('stockNotice')}
                </div>
              ) : (
                <div className="divide-y divide-brand-border">
                  {filteredItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedItem(item)}
                      className="p-8 group cursor-pointer relative hover:bg-brand-surface transition-all duration-300"
                    >
                      {item.isSpecial && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-brand-accent shadow-[glow_0_0_10px_rgba(158,42,43,0.5)]" />
                      )}
                      
                      <div className="flex justify-between items-start mb-2">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black tracking-widest group-hover:text-brand-primary transition-colors duration-300">
                            {pick(item.name)}
                          </h3>
                          <p className="text-[10px] text-brand-muted uppercase tracking-[0.2em] font-heading">
                            {item.producer ? `${item.producer} • ` : ''}
                            {item.region ? `${item.region} • ` : ''}
                            {item.origin || item.vintage || ''}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-heading text-brand-primary text-sm font-black tracking-tighter bg-brand-surface px-2 py-1 border border-brand-border">
                            {item.price}
                          </span>
                          {item.isSpecial && (
                            <span className="bg-brand-accent text-white text-[8px] px-1.5 py-0.5 tracking-tighter font-black uppercase whitespace-nowrap">
                              {t('limitedPour')}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-brand-text/70 text-xs leading-relaxed italic pr-12 line-clamp-2">
                        {pick(item.description)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="p-12">
                <SectionDivider title={t('endOfList')} />
                <p className="text-center text-[9px] text-brand-muted tracking-[0.5em] mt-4 uppercase">{t('footerBrand')}</p>
              </div>
            </main>
          </ScreenContainer>
        )}
      </AnimatePresence>

      {/* Item Detail Sheet */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-brand-background/90 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-brand-surface z-50 border-t border-brand-primary overflow-y-auto"
            >
              <div className="p-8 pb-12 relative">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 p-2 bg-brand-background border border-brand-border text-brand-muted hover:text-brand-text active:scale-95 transition-all"
                >
                  <X size={20} />
                </button>

                <div className="mb-8">
                  <h3 className="text-3xl font-heading tracking-widest mb-1">{pick(selectedItem.name)}</h3>
                  <span className="text-brand-primary font-body text-sm tracking-widest font-bold uppercase">{selectedItem.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                  {selectedItem.producer && (
                    <div>
                      <div className="text-[9px] text-brand-muted tracking-[0.25em] mb-1 font-heading uppercase font-bold">{t('producer')}</div>
                      <div className="text-sm font-body font-bold">{selectedItem.producer}</div>
                    </div>
                  )}
                   {selectedItem.region && (
                    <div>
                      <div className="text-[9px] text-brand-muted tracking-[0.25em] mb-1 font-heading uppercase font-bold">{t('region')}</div>
                      <div className="text-sm font-body font-bold">{selectedItem.region}</div>
                    </div>
                  )}
                   {selectedItem.varietal && (
                    <div>
                      <div className="text-[9px] text-brand-muted tracking-[0.25em] mb-1 font-heading uppercase font-bold">{t('varietal')}</div>
                      <div className="text-sm font-body font-bold">{selectedItem.varietal}</div>
                    </div>
                  )}
                   {selectedItem.vintage && (
                    <div>
                      <div className="text-[9px] text-brand-muted tracking-[0.25em] mb-1 font-heading uppercase font-bold">{t('vintage')}</div>
                      <div className="text-sm font-body font-bold">{selectedItem.vintage}</div>
                    </div>
                  )}
                   {selectedItem.origin && (
                    <div>
                      <div className="text-[9px] text-brand-muted tracking-[0.25em] mb-1 font-heading uppercase font-bold">{t('origin')}</div>
                      <div className="text-sm font-body font-bold">{selectedItem.origin}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-6 border-t border-brand-border">
                  <div className="text-[10px] text-brand-muted tracking-[0.2em] font-heading uppercase flex items-center gap-2">
                    <Info size={12} className="text-brand-primary" />
                    {t('tastingNotesLabel')}
                  </div>
                  <p className="text-brand-text/90 italic leading-relaxed font-body">
                    {pick(selectedItem.description)}
                    {selectedItem.tastingNotes
                      ? ` ${t('tastingNotesLead')} ${pick(selectedItem.tastingNotes).toLowerCase()}.`
                      : ''}
                  </p>
                </div>
                
                <div className="mt-10">
                   <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full py-4 border border-brand-border text-[10px] tracking-[0.3em] uppercase font-heading hover:border-brand-primary transition-all active:scale-95"
                  >
                    {t('backToList')}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

