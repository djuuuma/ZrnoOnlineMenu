/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, X, Info } from 'lucide-react';

// --- Types ---

type Category =
  | 'HOT_DRINKS'
  | 'SODA'
  | 'JUICE_BOTTLE'
  | 'JUICE_FRESH'
  | 'BEER_BOTTLE'
  | 'BEER_DRAFT'
  | 'WINE'
  | 'RAKIJA'
  | 'SPIRITS'
  | 'LIQUEURS';

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

function item(
  id: string,
  category: Category,
  bsName: string,
  enName: string,
  priceNum: string,
  extra?: Partial<
    Omit<MenuItem, 'id' | 'category' | 'name' | 'price' | 'isAvailable'>
  > & { descBs?: string; descEn?: string }
): MenuItem {
  const { descBs, descEn, ...rest } = extra ?? {};
  return {
    id,
    category,
    name: { bs: bsName, en: enName },
    description: {
      bs: descBs ?? '',
      en: descEn ?? ''
    },
    price: `${priceNum} KM`,
    isAvailable: true,
    ...rest
  };
}

const MENU_ITEMS: MenuItem[] = [
  // Topli napitci
  item('h1', 'HOT_DRINKS', 'Kafa espresso', 'Espresso', '2,50'),
  item('h2', 'HOT_DRINKS', 'Kafa espresso sa mlijekom — mala', 'Espresso with milk — small', '3,00'),
  item('h3', 'HOT_DRINKS', 'Kafa espresso sa mlijekom — velika', 'Espresso with milk — large', '3,50'),
  item('h4', 'HOT_DRINKS', 'Kafa espresso — produžena u veliku šolju', 'Espresso — extended in a large cup', '3,00'),
  item('h5', 'HOT_DRINKS', 'Kafa espresso sa šlagom', 'Espresso with whipped cream', '3,50'),
  item('h6', 'HOT_DRINKS', 'Macchiato — mali', 'Macchiato — small', '3,50'),
  item('h7', 'HOT_DRINKS', 'Macchiato — veliki', 'Macchiato — large', '4,00'),
  item('h8', 'HOT_DRINKS', 'Cappuccino', 'Cappuccino', '5,00'),
  item('h9', 'HOT_DRINKS', 'Latte macchiato — mali', 'Latte macchiato — small', '4,00'),
  item('h10', 'HOT_DRINKS', 'Latte macchiato — veliki', 'Latte macchiato — large', '5,00'),
  item('h11', 'HOT_DRINKS', 'Nescafé Cappuccino', 'Nescafé Cappuccino', '4,00'),
  item('h12', 'HOT_DRINKS', 'Topla čokolada', 'Hot chocolate', '4,50'),
  item('h13', 'HOT_DRINKS', 'Čaj', 'Tea', '3,50'),
  item('h14', 'HOT_DRINKS', 'Irish coffee', 'Irish coffee', '6,00'),
  item(
    'h15',
    'HOT_DRINKS',
    'Ekspreso kafa',
    'Espresso',
    '10,00',
    { isSpecial: true }
  ),

  // Sokovi gazirani 0,33 l
  item('s1', 'SODA', 'Coca-Cola', 'Coca-Cola', '4,00'),
  item('s2', 'SODA', 'Coca-Cola Zero', 'Coca-Cola Zero', '4,00'),
  item('s3', 'SODA', 'Fanta Orange', 'Fanta Orange', '4,00'),
  item('s4', 'SODA', 'Sprite', 'Sprite', '4,00'),
  item('s5', 'SODA', 'Schweppes Tonic', 'Schweppes Tonic', '4,00'),
  item('s6', 'SODA', 'Schweppes Bitter Lemon', 'Schweppes Bitter Lemon', '4,00'),
  item('s7', 'SODA', 'Schweppes Tangerina', 'Schweppes Tangerina', '4,00'),
  item('s8', 'SODA', 'Kiseljak voda', 'Kiseljak sparkling water', '3,00'),
  item('s9', 'SODA', 'Sensation', 'Sensation', '3,00'),
  item('s10', 'SODA', 'Prirodna voda', 'Still water', '2,50'),
  item('s11', 'SODA', 'Orangina', 'Orangina', '5,00'),
  item('s12', 'SODA', 'Red Bull', 'Red Bull', '6,00'),

  // Sokovi negazirani 0,20 l — Kuća prirode
  item('jn1', 'JUICE_BOTTLE', 'Kuća prirode — ananas', 'Kuća prirode — pineapple', '4,50', {
    descBs: '0,20 l',
    descEn: '0.20 L'
  }),
  item('jn2', 'JUICE_BOTTLE', 'Kuća prirode — breskva', 'Kuća prirode — peach', '4,50', {
    descBs: '0,20 l',
    descEn: '0.20 L'
  }),
  item('jn3', 'JUICE_BOTTLE', 'Kuća prirode — jabuka', 'Kuća prirode — apple', '4,50', {
    descBs: '0,20 l',
    descEn: '0.20 L'
  }),
  item('jn4', 'JUICE_BOTTLE', 'Kuća prirode — jagoda', 'Kuća prirode — strawberry', '4,50', {
    descBs: '0,20 l',
    descEn: '0.20 L'
  }),
  item('jn5', 'JUICE_BOTTLE', 'Kuća prirode — aronija', 'Kuća prirode — chokeberry', '4,50', {
    descBs: '0,20 l',
    descEn: '0.20 L'
  }),
  item('jn6', 'JUICE_BOTTLE', 'Kuća prirode — narandža', 'Kuća prirode — orange', '4,50', {
    descBs: '0,20 l',
    descEn: '0.20 L'
  }),
  item('jn7', 'JUICE_BOTTLE', 'Kuća prirode — banana', 'Kuća prirode — banana', '4,50', {
    descBs: '0,20 l',
    descEn: '0.20 L'
  }),
  item('jn8', 'JUICE_BOTTLE', 'Cedevita — limun', 'Cedevita — lemon', '4,00'),
  item('jn9', 'JUICE_BOTTLE', 'Cedevita — narandža', 'Cedevita — orange', '4,00'),

  // Prirodni sokovi
  item('jf1', 'JUICE_FRESH', 'Cijeđena narandža', 'Fresh orange juice', '5,00'),
  item('jf2', 'JUICE_FRESH', 'Limunada', 'Lemonade', '4,00'),
  item('jf3', 'JUICE_FRESH', 'Cijeđeni mix', 'Fresh mixed juice', '6,00'),
  // Pivo 0,33 l
  item('bb1', 'BEER_BOTTLE', 'Blanc', 'Blanc', '5,00', { descBs: '0,33 l', descEn: '0.33 L' }),
  item('bb2', 'BEER_BOTTLE', 'Tuborg', 'Tuborg', '4,50', { descBs: '0,33 l', descEn: '0.33 L' }),
  item('bb3', 'BEER_BOTTLE', 'Budweiser', 'Budweiser', '4,50', { descBs: '0,33 l', descEn: '0.33 L' }),
  item('bb4', 'BEER_BOTTLE', 'Erdinger svijetlo', 'Erdinger pale', '5,00', { descBs: '0,33 l', descEn: '0.33 L' }),
  item('bb5', 'BEER_BOTTLE', 'Erdinger tamno', 'Erdinger dark', '5,00', { descBs: '0,33 l', descEn: '0.33 L' }),
  item('bb6', 'BEER_BOTTLE', 'Carlsberg', 'Carlsberg', '4,50', { descBs: '0,33 l', descEn: '0.33 L' }),
  item('bb7', 'BEER_BOTTLE', 'Somersby', 'Somersby', '4,50', { descBs: '0,33 l', descEn: '0.33 L' }),

  // Točeno pivo
  item('bd1', 'BEER_DRAFT', 'Carlsberg — malo', 'Carlsberg — small', '4,00', {
    descBs: '0,33 l',
    descEn: '0.33 L'
  }),
  item('bd2', 'BEER_DRAFT', 'Carlsberg — veliko', 'Carlsberg — large', '5,00', {
    descBs: '0,50 l',
    descEn: '0.50 L'
  }),
  item('bd3', 'BEER_DRAFT', 'Blanc — malo', 'Blanc — small', '4,00', {
    descBs: '0,33 l',
    descEn: '0.33 L'
  }),
  item('bd4', 'BEER_DRAFT', 'Blanc — veliko', 'Blanc — large', '5,00', {
    descBs: '0,50 l',
    descEn: '0.50 L'
  }),

  // Vina
  item('w1', 'WINE', 'Žilavka Milas — čaša', 'Žilavka Milas — glass', '7,00', {
    descBs: '0,15 l',
    descEn: '0.15 L'
  }),
  item('w2', 'WINE', 'Blatina Milas — čaša', 'Blatina Milas — glass', '7,00', {
    descBs: '0,15 l',
    descEn: '0.15 L'
  }),
  item('w3', 'WINE', 'Rosé Marijanović — čaša', 'Rosé Marijanović — glass', '7,00', {
    descBs: '0,15 l',
    descEn: '0.15 L'
  }),
  item('w4', 'WINE', 'Žilavka Marijanović', 'Žilavka Marijanović', '35,00', {
    descBs: '0,75 l',
    descEn: '0.75 L'
  }),
  item('w5', 'WINE', 'Barrique Marijanović', 'Barrique Marijanović', '75,00', {
    descBs: '0,75 l',
    descEn: '0.75 L'
  }),
  item('w6', 'WINE', 'Vukoje Cabernet Sauvignon', 'Vukoje Cabernet Sauvignon', '65,00', {
    descBs: '0,75 l',
    descEn: '0.75 L'
  }),
  item('w7', 'WINE', 'Vukoje Chardonnay', 'Vukoje Chardonnay', '60,00', {
    descBs: '0,75 l',
    descEn: '0.75 L'
  }),

  // Rakije 0,03 l
  item('r1', 'RAKIJA', 'Višnja', 'Sour cherry', '4,00', { descBs: '0,03 l', descEn: '0.03 L' }),
  item('r2', 'RAKIJA', 'Viljamovka', 'Williams pear', '4,00', { descBs: '0,03 l', descEn: '0.03 L' }),
  item('r3', 'RAKIJA', 'Medovača', 'Honey brandy', '4,00', { descBs: '0,03 l', descEn: '0.03 L' }),
  item('r4', 'RAKIJA', 'Istra sa 21 biljkom', 'Istra herbal (21 botanicals)', '4,00', {
    descBs: '0,03 l',
    descEn: '0.03 L'
  }),
  item('r5', 'RAKIJA', 'Dunja', 'Quince', '4,00', { descBs: '0,03 l', descEn: '0.03 L' }),
  item('r6', 'RAKIJA', 'Kajsija', 'Apricot', '4,00', { descBs: '0,03 l', descEn: '0.03 L' }),
  item('r7', 'RAKIJA', 'Šljiva', 'Plum', '4,00', { descBs: '0,03 l', descEn: '0.03 L' }),
  item('r8', 'RAKIJA', 'Travarica', 'Herbal rakija', '4,00', { descBs: '0,03 l', descEn: '0.03 L' }),
  item('r9', 'RAKIJA', 'Grozđana', 'Grape pomace', '3,00', { descBs: '0,03 l', descEn: '0.03 L' }),

  // Žestoka pića
  item('sp1', 'SPIRITS', 'Jack Daniel’s', 'Jack Daniel’s', '6,00'),
  item('sp2', 'SPIRITS', 'Chivas', 'Chivas', '7,00'),
  item('sp3', 'SPIRITS', 'Johnnie Walker — Black Label', 'Johnnie Walker — Black Label', '7,00'),
  item('sp4', 'SPIRITS', 'Johnnie Walker — Red Label', 'Johnnie Walker — Red Label', '5,00'),
  item('sp5', 'SPIRITS', 'Smirnoff', 'Smirnoff', '4,00'),
  item('sp6', 'SPIRITS', 'Gordon’s Dry Gin', 'Gordon’s Dry Gin', '5,00'),
  item('sp7', 'SPIRITS', 'Jägermeister', 'Jägermeister', '4,00'),
  item('sp8', 'SPIRITS', 'Courvoisier', 'Courvoisier', '8,00'),
  item('sp9', 'SPIRITS', 'Glenlivet', 'Glenlivet', '8,00'),
  item('sp10', 'SPIRITS', 'Aperol', 'Aperol', '6,00'),
  item('sp11', 'SPIRITS', 'Pelinkovac', 'Pelinkovac', '4,00'),
  item('sp12', 'SPIRITS', 'Tequila silver', 'Tequila silver', '4,00'),
  item('sp13', 'SPIRITS', 'Tequila gold', 'Tequila gold', '4,00'),
  item('sp14', 'SPIRITS', 'Bacardi', 'Bacardi', '4,00'),

  // Likeri 0,05 l
  item('l1', 'LIQUEURS', 'Piña Colada', 'Piña Colada', '3,50', { descBs: '0,05 l', descEn: '0.05 L' }),
  item('l2', 'LIQUEURS', 'Baileys', 'Baileys', '5,00', { descBs: '0,05 l', descEn: '0.05 L' })
];

const CATEGORY_NOTE: Partial<Record<Category, LocalizedText>> = {
  HOT_DRINKS: {
    bs: 'Zašto 10 KM? Zato što svaki put kad neko naruči ekspreso kafu, jedan Italijan padne s Vespe.',
    en: 'Why 10 KM? Because every time someone orders an espresso, an Italian falls off a Vespa.'
  }
};

const UI: Record<Lang, Record<string, string>> = {
  bs: {
    tagline: 'Kafa i prijatelji — savršen spoj',
    viewMenu: 'Pogledaj cjenovnik',
    lateNight: 'CAFFE BAR I SLASTIČARNICA',
    hub: 'ZRNO',
    categoriesMeta: '02 / KATEGORIJE',
    catHot: 'Topli napitci',
    catSoda: 'Sokovi (gazirani) 0,33 l',
    catJuiceBottle: 'Sokovi (negazirani) 0,20 l',
    catJuiceFresh: 'Prirodni sokovi',
    catBeerBottle: 'Pivo 0,33 l',
    catBeerDraft: 'Točeno pivo',
    catWine: 'Vina',
    catRakija: 'Rakije 0,03 l',
    catSpirits: 'Žestoka pića',
    catLiqueurs: 'Likeri 0,05 l',
    active: 'AKTIVNO',
    hubFooter:
      'UR CAFFE BAR I SLASTIČARNICA "ZRNO" • VL. EMIR MUJIČIĆ • LOPATA B.B., ILIDŽA, SARAJEVO',
    listMetaPrefix: '03 / CJENOVNIK /',
    listSuffix: 'LISTA',
    stockNotice: 'Nema stavki u ovoj kategoriji',
    limitedPour: 'POSEBNO',
    endOfList: 'KRAJ LISTE',
    footerBrand: 'Coffee and Friends are the Perfect Blend',
    producer: 'Proizvođač',
    region: 'Regija',
    varietal: 'Sorta',
    vintage: 'Godište',
    origin: 'Porijeklo',
    tastingNotesLabel: 'Opis',
    tastingNotesLead: 'Note:',
    backToList: 'Nazad na listu',
    switchToEn: 'English',
    switchToBs: 'Bosanski',
    categoryNoteLead: 'Napomena',
    footerCreditLead: 'Dizajn i razvoj:'
  },
  en: {
    tagline: 'Coffee and Friends are the Perfect Blend',
    viewMenu: 'View price list',
    lateNight: 'CAFE BAR & PATISSERIE',
    hub: 'ZRNO',
    categoriesMeta: '02 / CATEGORIES',
    catHot: 'Hot drinks',
    catSoda: 'Soft drinks (carbonated) 0.33 L',
    catJuiceBottle: 'Juices (still) 0.20 L',
    catJuiceFresh: 'Fresh juices',
    catBeerBottle: 'Beer 0.33 L',
    catBeerDraft: 'Draft beer',
    catWine: 'Wines',
    catRakija: 'Fruit brandy 0.03 L',
    catSpirits: 'Spirits',
    catLiqueurs: 'Liqueurs 0.05 L',
    active: 'ACTIVE',
    hubFooter:
      'UR CAFFE BAR & PATISSERIE "ZRNO" • OWNER EMIR MUJIČIĆ • LOPATA B.B., ILIDŽA, SARAJEVO',
    listMetaPrefix: '03 / MENU /',
    listSuffix: 'LIST',
    stockNotice: 'No items in this category',
    limitedPour: 'SPECIAL',
    endOfList: 'END OF LIST',
    footerBrand: 'Coffee and Friends are the Perfect Blend',
    producer: 'Producer',
    region: 'Region',
    varietal: 'Varietal',
    vintage: 'Vintage',
    origin: 'Origin',
    tastingNotesLabel: 'Description',
    tastingNotesLead: 'Notes:',
    backToList: 'Back to list',
    switchToEn: 'English',
    switchToBs: 'Bosanski',
    categoryNoteLead: 'Note',
    footerCreditLead: 'Designed and developed by'
  }
};

const DEVELOPER_LINKEDIN_HREF = 'https://www.linkedin.com/in/anes-djumisic/';

function DeveloperCredit({
  t,
  className = ''
}: {
  t: (key: string) => string;
  className?: string;
}) {
  return (
    <p className={`text-[9px] sm:text-[10px] font-body text-brand-muted leading-relaxed ${className}`.trim()}>
      {t('footerCreditLead')}{' '}
      <a
        href={DEVELOPER_LINKEDIN_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        Anes Đumišić
      </a>
    </p>
  );
}

const SUB_TAB_LABEL: Record<string, LocalizedText> = {
  [ALL_TAB]: { en: 'All', bs: 'Sve' }
};

const CATEGORY_LABEL: Record<Category, LocalizedText> = {
  HOT_DRINKS: { en: 'HOT DRINKS', bs: 'TOPLI NAPITCI' },
  SODA: { en: 'SODAS', bs: 'SOKOVI (GAZ.)' },
  JUICE_BOTTLE: { en: 'STILL JUICES', bs: 'SOKOVI (NEGAZ.)' },
  JUICE_FRESH: { en: 'NATURAL', bs: 'PRIRODNI' },
  BEER_BOTTLE: { en: 'BEER', bs: 'PIVO' },
  BEER_DRAFT: { en: 'DRAFT', bs: 'TOČENO' },
  WINE: { en: 'WINE', bs: 'VINO' },
  RAKIJA: { en: 'RAKIJA', bs: 'RAKIJA' },
  SPIRITS: { en: 'SPIRITS', bs: 'ŽESTOKO' },
  LIQUEURS: { en: 'LIQUEURS', bs: 'LIKERI' }
};

const HUB_CATEGORIES: { type: Category; labelKey: string; num: string }[] = [
  { type: 'HOT_DRINKS', labelKey: 'catHot', num: '01' },
  { type: 'SODA', labelKey: 'catSoda', num: '02' },
  { type: 'JUICE_BOTTLE', labelKey: 'catJuiceBottle', num: '03' },
  { type: 'JUICE_FRESH', labelKey: 'catJuiceFresh', num: '04' },
  { type: 'BEER_BOTTLE', labelKey: 'catBeerBottle', num: '05' },
  { type: 'BEER_DRAFT', labelKey: 'catBeerDraft', num: '06' },
  { type: 'WINE', labelKey: 'catWine', num: '07' },
  { type: 'RAKIJA', labelKey: 'catRakija', num: '08' },
  { type: 'SPIRITS', labelKey: 'catSpirits', num: '09' },
  { type: 'LIQUEURS', labelKey: 'catLiqueurs', num: '10' }
];

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
    className={`min-h-dvh bg-brand-background overflow-x-clip relative ${className}`}
  >
    <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-[0.03] z-0 select-none">
      <span className="text-[240px] font-black leading-none font-heading tracking-widest">ZRNO</span>
    </div>
    <div className="relative z-10 min-h-dvh flex flex-col">
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
  const [activeCategory, setActiveCategory] = useState<Category>('HOT_DRINKS');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<string>(ALL_TAB);

  const t = (key: string) => UI[lang][key] ?? key;

  const pick = (x: LocalizedText) => x[lang];

  const subTabLabel = (tab: string) => (SUB_TAB_LABEL[tab] ? pick(SUB_TAB_LABEL[tab]) : tab);

  useEffect(() => {
    document.documentElement.lang = lang === 'bs' ? 'bs' : 'en';
  }, [lang]);

  useEffect(() => {
    if (!selectedItem) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedItem]);

  // Hub and list reuse the window scroll chain; reset when opening/changing a list so items start from the top.
  useEffect(() => {
    if (screen !== 'LIST') return;
    window.scrollTo(0, 0);
  }, [screen, activeCategory, activeSubTab]);

  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS.filter(item => item.category === activeCategory);
    if (activeSubTab !== ALL_TAB) {
      items = items.filter(item => item.subCategory === activeSubTab);
    }
    return items;
  }, [activeCategory, activeSubTab]);

  const subTabs = useMemo(() => {
    const tabs = Array.from(
      new Set(
        MENU_ITEMS.filter(item => item.category === activeCategory && item.subCategory).map(
          item => item.subCategory as string
        )
      )
    );
    return [ALL_TAB, ...tabs];
  }, [activeCategory]);

  const handleCategorySelect = (cat: Category) => {
    setActiveCategory(cat);
    setActiveSubTab(ALL_TAB);
    setScreen('LIST');
  };

  const categoryFootnote = CATEGORY_NOTE[activeCategory];

  return (
    <div className="relative selection:bg-brand-primary/30">
      <GrainOverlay />

      <AnimatePresence mode="wait">
        {screen === 'WELCOME' && (
          <ScreenContainer key="welcome" className="relative overflow-hidden">
            <div className="absolute inset-0 ember-glow opacity-30 pointer-events-none z-0" />

            <div className="relative z-10 flex min-h-dvh w-full flex-col">
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 py-10 sm:p-12">
                <div className="w-16 h-1 bg-brand-primary mb-12 shrink-0" />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="text-center"
                >
                  <h1 className="text-8xl font-black mb-4 tracking-[0.2em] leading-none">ZRNO</h1>
                  <p className="text-brand-muted font-body tracking-[0.35em] text-[10px] uppercase max-w-sm mx-auto leading-relaxed">
                    {t('tagline')}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="shrink-0 px-8 pb-5 sm:px-12 flex w-full flex-col gap-3"
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

              <div className="shrink-0 border-t border-brand-border bg-brand-surface/50 px-8 py-4 flex flex-col gap-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[9px] tracking-[0.2em] font-heading text-brand-muted text-left leading-snug">
                    {t('hubFooter').split('•')[0]?.trim()}
                  </span>
                  <span className="text-[9px] tracking-[0.2em] font-heading text-brand-primary text-right shrink-0">
                    {t('lateNight')}
                  </span>
                </div>
                <DeveloperCredit t={t} className="text-center" />
              </div>
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
              {HUB_CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  id={`cat-${cat.type.toLowerCase()}`}
                  onClick={() => handleCategorySelect(cat.type)}
                  className="flex-1 min-h-[3.5rem] border-b border-brand-border py-5 px-8 flex items-center group cursor-pointer relative hover:bg-brand-surface transition-colors"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-brand-primary text-xs font-mono mr-4 font-bold tracking-widest shrink-0">{cat.num}.</span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-widest group-hover:translate-x-2 transition-transform duration-500 leading-tight">
                    {t(cat.labelKey)}
                  </h3>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[9px] text-brand-primary font-bold tracking-widest">{t('active')}</span>
                  </div>
                </motion.div>
              ))}
            </main>

            <footer className="p-6 sm:p-8 bg-brand-surface border-t border-brand-border mt-auto pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
              <p className="text-[9px] sm:text-[10px] text-brand-muted tracking-[0.2em] font-heading leading-loose">
                {t('hubFooter')}
              </p>
              <DeveloperCredit t={t} className="mt-4 pt-4 border-t border-brand-border/50" />
            </footer>
          </ScreenContainer>
        )}

        {screen === 'LIST' && (
          <ScreenContainer key="list">
            <header className="sticky top-0 bg-brand-background z-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="h-20 flex items-center px-4 bg-brand-surface border-b border-brand-primary shadow-lg">
                <button type="button" onClick={() => setScreen('HUB')} className="p-3 mr-2 bg-brand-background border border-brand-border text-brand-muted hover:text-brand-text active:scale-95 transition-all">
                  <ArrowLeft size={18} />
                </button>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-4 h-[1px] bg-brand-primary shrink-0" />
                    <h2 className="text-lg sm:text-xl font-black tracking-widest text-brand-primary truncate">
                      {pick(CATEGORY_LABEL[activeCategory])} {t('listSuffix')}
                    </h2>
                  </div>
                  <span className="text-[9px] text-brand-muted tracking-[0.2em] font-heading ml-6 uppercase truncate block">
                    {t('listMetaPrefix')} {t(HUB_CATEGORIES.find(c => c.type === activeCategory)?.labelKey ?? 'hub')}
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
                <div className="flex bg-brand-background border-b border-brand-border overflow-x-auto no-scrollbar">
                  {subTabs.map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveSubTab(tab)}
                      className={`flex-1 min-w-[72px] py-4 text-[9px] font-heading tracking-[0.3em] uppercase transition-all relative border-r border-brand-border last:border-r-0 ${
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
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedItem(item)}
                      className="p-6 sm:p-8 group cursor-pointer relative hover:bg-brand-surface transition-all duration-300"
                    >
                      {item.isSpecial && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-brand-accent shadow-[glow_0_0_10px_rgba(158,42,43,0.5)]" />
                      )}

                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div className="space-y-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-black tracking-widest group-hover:text-brand-primary transition-colors duration-300">
                            {pick(item.name)}
                          </h3>
                          {(item.producer || item.region || item.origin || item.vintage) && (
                            <p className="text-[10px] text-brand-muted uppercase tracking-[0.2em] font-heading">
                              {item.producer ? `${item.producer} • ` : ''}
                              {item.region ? `${item.region} • ` : ''}
                              {item.origin || item.vintage || ''}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="font-heading text-brand-primary text-sm font-black tracking-tighter bg-brand-surface px-2 py-1 border border-brand-border whitespace-nowrap">
                            {item.price}
                          </span>
                          {item.isSpecial && (
                            <span className="bg-brand-accent text-white text-[8px] px-1.5 py-0.5 tracking-tighter font-black uppercase whitespace-nowrap">
                              {t('limitedPour')}
                            </span>
                          )}
                        </div>
                      </div>

                      {pick(item.description).trim() !== '' && (
                        <p className="text-brand-text/70 text-xs leading-relaxed italic pr-4 line-clamp-3">
                          {pick(item.description)}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {categoryFootnote && filteredItems.length > 0 && (
                <div className="px-6 sm:px-8 pb-6">
                  <p className="text-[10px] text-brand-muted font-body leading-relaxed border-l-2 border-brand-primary/50 pl-3">
                    <span className="font-heading uppercase tracking-[0.2em] block mb-1 text-brand-primary">{t('categoryNoteLead')}</span>
                    {pick(categoryFootnote)}
                  </p>
                </div>
              )}

              <div className="p-12 pb-[max(3rem,env(safe-area-inset-bottom,0px))]">
                <SectionDivider title={t('endOfList')} />
                <p className="text-center text-[9px] text-brand-muted tracking-[0.35em] mt-4 uppercase font-heading">{t('footerBrand')}</p>
                <DeveloperCredit t={t} className="text-center mt-6 max-w-md mx-auto" />
              </div>
            </main>
          </ScreenContainer>
        )}
      </AnimatePresence>

      {/* Item Detail Sheet */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="item-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto overscroll-y-contain"
          >
            <div className="min-h-dvh flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedItem(null)}
                className="min-h-[min(50dvh,240px)] flex-1 bg-brand-background/90 backdrop-blur-sm"
                aria-hidden
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="w-full shrink-0 bg-brand-surface border-t border-brand-primary pb-[max(3rem,env(safe-area-inset-bottom,0px))]"
              >
              <div className="p-8 pb-12 relative">
                <button
                  type="button"
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

                {(pick(selectedItem.description).trim() !== '' || selectedItem.tastingNotes) && (
                  <div className="space-y-4 pt-6 border-t border-brand-border">
                    <div className="text-[10px] text-brand-muted tracking-[0.2em] font-heading uppercase flex items-center gap-2">
                      <Info size={12} className="text-brand-primary" />
                      {t('tastingNotesLabel')}
                    </div>
                    <p className="text-brand-text/90 italic leading-relaxed font-body">
                      {pick(selectedItem.description)}
                      {selectedItem.tastingNotes
                        ? `${pick(selectedItem.description).trim() ? ' ' : ''}${t('tastingNotesLead')} ${pick(selectedItem.tastingNotes).toLowerCase()}.`
                        : ''}
                    </p>
                  </div>
                )}

                <div className="mt-10">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="w-full py-4 border border-brand-border text-[10px] tracking-[0.3em] uppercase font-heading hover:border-brand-primary transition-all active:scale-95"
                  >
                    {t('backToList')}
                  </button>
                </div>
              </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
