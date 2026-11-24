/**
 * 食好好 — 国标质检标准库（零售/采购端外观与感官快检）
 * 依据 GB 2762、GB 2707、GB 2733、GB 19301、GB 7718 等简化条目
 */

export const GRADES = {
  A: { label: '优等', minScore: 90, color: '#1a7f4b' },
  B: { label: '合格', minScore: 75, color: '#2d8f5e' },
  C: { label: '临界', minScore: 60, color: '#c47a00' },
  F: { label: '不合格', minScore: 0, color: '#c0392b' },
};

export const CATEGORIES = [
  {
    id: 'vegetable',
    name: '新鲜蔬菜',
    icon: '🥬',
    gbRefs: ['GB 2762-2022', 'GB 2763-2021', 'GB/T 13621-2006'],
    visual: {
      hueMin: 70,
      hueMax: 150,
      minSaturation: 0.22,
      maxDarkSpotRatio: 0.12,
      minBrightness: 0.28,
      maxGrayRatio: 0.18,
    },
    checklist: [
      { id: 'appearance', label: '色泽正常、无严重萎蔫', required: true, autoKey: 'colorFresh' },
      { id: 'spot', label: '无腐烂、霉斑、虫蛀孔洞', required: true, autoKey: 'noSpots' },
      { id: 'odor', label: '无异味、无发酵酸败气', required: true },
      { id: 'foreign', label: '无泥沙、异物、农药残留可见痕迹', required: true },
      { id: 'packaging', label: '包装完整、标签信息齐全（如有）', required: false },
    ],
  },
  {
    id: 'fruit',
    name: '鲜水果',
    icon: '🍎',
    gbRefs: ['GB/T 8559-2008', 'GB 2762-2022', 'GB 2763-2021'],
    visual: {
      hueMin: 0,
      hueMax: 60,
      minSaturation: 0.25,
      maxDarkSpotRatio: 0.1,
      minBrightness: 0.25,
      maxGrayRatio: 0.15,
    },
    checklist: [
      { id: 'appearance', label: '果形完整、表皮无明显 bruise', required: true, autoKey: 'colorFresh' },
      { id: 'spot', label: '无腐烂、霉变、虫眼', required: true, autoKey: 'noSpots' },
      { id: 'firmness', label: '硬度适中、无过度软烂', required: true },
      { id: 'odor', label: '无酒味、无异常发酵味', required: true },
      { id: 'residue', label: '表面无可见蜡层异常或残留', required: false },
    ],
  },
  {
    id: 'meat',
    name: '鲜（冻）畜禽肉',
    icon: '🥩',
    gbRefs: ['GB 2707-2016', 'GB 2762-2022', 'GB 31616-2015'],
    visual: {
      hueMin: 340,
      hueMax: 30,
      minSaturation: 0.12,
      maxDarkSpotRatio: 0.08,
      minBrightness: 0.2,
      maxGrayRatio: 0.25,
    },
    checklist: [
      { id: 'color', label: '肉色正常（鲜红/淡红），无发绿发灰', required: true, autoKey: 'colorFresh' },
      { id: 'spot', label: '无淤血块、脓包、寄生虫', required: true, autoKey: 'noSpots' },
      { id: 'odor', label: '无腥臭、氨味、酸败味', required: true },
      { id: 'elastic', label: '指压后弹性恢复良好', required: true },
      { id: 'cert', label: '检疫合格标志/追溯码可查', required: true },
    ],
  },
  {
    id: 'seafood',
    name: '鲜冻水产品',
    icon: '🐟',
    gbRefs: ['GB 2733-2015', 'GB 2762-2022', 'GB 10136-2016'],
    visual: {
      hueMin: 170,
      hueMax: 220,
      minSaturation: 0.08,
      maxDarkSpotRatio: 0.1,
      minBrightness: 0.18,
      maxGrayRatio: 0.3,
    },
    checklist: [
      { id: 'appearance', label: '鱼眼清亮、鳞片/虾壳完整', required: true, autoKey: 'colorFresh' },
      { id: 'spot', label: '无软烂、脱骨、黑鳃', required: true, autoKey: 'noSpots' },
      { id: 'odor', label: '无氨味、腐臭味', required: true },
      { id: 'gill', label: '鳃部鲜红或淡红（鲜品）', required: true },
      { id: 'temp', label: '冷链温度符合要求（≤4℃ 或冻结态）', required: true },
    ],
  },
  {
    id: 'dairy',
    name: '乳制品',
    icon: '🥛',
    gbRefs: ['GB 19301-2010', 'GB 25190-2010', 'GB 2762-2022'],
    visual: {
      hueMin: 30,
      hueMax: 55,
      minSaturation: 0.05,
      maxDarkSpotRatio: 0.05,
      minBrightness: 0.55,
      maxGrayRatio: 0.12,
    },
    checklist: [
      { id: 'packaging', label: '包装密封完好、无胀包漏包', required: true },
      { id: 'label', label: '生产日期、保质期、厂名厂址清晰', required: true },
      { id: 'appearance', label: '色泽均匀、无絮状物（液态奶）', required: true, autoKey: 'colorFresh' },
      { id: 'odor', label: '无酸败、馊味', required: true },
      { id: 'cold', label: '冷藏链未中断（需冷藏品类）', required: true },
    ],
  },
  {
    id: 'grain',
    name: '粮油及制品',
    icon: '🌾',
    gbRefs: ['GB 1354-2018', 'GB 1355-2021', 'GB 2716-2018'],
    visual: {
      hueMin: 35,
      hueMax: 50,
      minSaturation: 0.08,
      maxDarkSpotRatio: 0.06,
      minBrightness: 0.35,
      maxGrayRatio: 0.1,
    },
    checklist: [
      { id: 'appearance', label: '颗粒饱满、无大量碎米/杂质', required: true, autoKey: 'colorFresh' },
      { id: 'spot', label: '无虫蛀、无霉粒、无结块', required: true, autoKey: 'noSpots' },
      { id: 'odor', label: '无哈喇味、霉味', required: true },
      { id: 'label', label: '等级标识、执行标准号正确', required: true },
      { id: 'packaging', label: '包装干燥、无破损受潮', required: true },
    ],
  },
  {
    id: 'packaged',
    name: '预包装食品',
    icon: '📦',
    gbRefs: ['GB 7718-2011', 'GB 28050-2011', 'GB 14881-2013'],
    visual: {
      hueMin: 0,
      hueMax: 360,
      minSaturation: 0,
      maxDarkSpotRatio: 0.15,
      minBrightness: 0.15,
      maxGrayRatio: 0.35,
    },
    checklist: [
      { id: 'label_name', label: '食品名称、配料表完整', required: true },
      { id: 'label_date', label: '生产日期与保质期在有效期内', required: true },
      { id: 'label_std', label: '产品标准代号、生产许可证号', required: true },
      { id: 'packaging', label: '包装完好、无胀袋破损', required: true },
      { id: 'appearance', label: '内容物色泽形态正常', required: true, autoKey: 'colorFresh' },
    ],
  },
];

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}

export function listCategories() {
  return CATEGORIES.slice();
}

export function scoreToGrade(score) {
  const s = Number(score) || 0;
  if (s >= GRADES.A.minScore) return 'A';
  if (s >= GRADES.B.minScore) return 'B';
  if (s >= GRADES.C.minScore) return 'C';
  return 'F';
}

export function gradeInfo(grade) {
  return GRADES[grade] || GRADES.F;
}

export function isPassingGrade(grade) {
  return grade === 'A' || grade === 'B';
}
