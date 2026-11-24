var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/standards.js
var standards_exports = {};
__export(standards_exports, {
  CATEGORIES: () => CATEGORIES,
  GRADES: () => GRADES,
  getCategory: () => getCategory,
  gradeInfo: () => gradeInfo,
  isPassingGrade: () => isPassingGrade,
  listCategories: () => listCategories,
  scoreToGrade: () => scoreToGrade
});
module.exports = __toCommonJS(standards_exports);
var GRADES = {
  A: { label: "\u4F18\u7B49", minScore: 90, color: "#1a7f4b" },
  B: { label: "\u5408\u683C", minScore: 75, color: "#2d8f5e" },
  C: { label: "\u4E34\u754C", minScore: 60, color: "#c47a00" },
  F: { label: "\u4E0D\u5408\u683C", minScore: 0, color: "#c0392b" }
};
var CATEGORIES = [
  {
    id: "vegetable",
    name: "\u65B0\u9C9C\u852C\u83DC",
    icon: "\u{1F96C}",
    gbRefs: ["GB 2762-2022", "GB 2763-2021", "GB/T 13621-2006"],
    visual: {
      hueMin: 70,
      hueMax: 150,
      minSaturation: 0.22,
      maxDarkSpotRatio: 0.12,
      minBrightness: 0.28,
      maxGrayRatio: 0.18
    },
    checklist: [
      { id: "appearance", label: "\u8272\u6CFD\u6B63\u5E38\u3001\u65E0\u4E25\u91CD\u840E\u852B", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u8150\u70C2\u3001\u9709\u6591\u3001\u866B\u86C0\u5B54\u6D1E", required: true, autoKey: "noSpots" },
      { id: "odor", label: "\u65E0\u5F02\u5473\u3001\u65E0\u53D1\u9175\u9178\u8D25\u6C14", required: true },
      { id: "foreign", label: "\u65E0\u6CE5\u6C99\u3001\u5F02\u7269\u3001\u519C\u836F\u6B8B\u7559\u53EF\u89C1\u75D5\u8FF9", required: true },
      { id: "packaging", label: "\u5305\u88C5\u5B8C\u6574\u3001\u6807\u7B7E\u4FE1\u606F\u9F50\u5168\uFF08\u5982\u6709\uFF09", required: false }
    ]
  },
  {
    id: "fruit",
    name: "\u9C9C\u6C34\u679C",
    icon: "\u{1F34E}",
    gbRefs: ["GB/T 8559-2008", "GB 2762-2022", "GB 2763-2021"],
    visual: {
      hueMin: 0,
      hueMax: 60,
      minSaturation: 0.25,
      maxDarkSpotRatio: 0.1,
      minBrightness: 0.25,
      maxGrayRatio: 0.15
    },
    checklist: [
      { id: "appearance", label: "\u679C\u5F62\u5B8C\u6574\u3001\u8868\u76AE\u65E0\u660E\u663E bruise", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u8150\u70C2\u3001\u9709\u53D8\u3001\u866B\u773C", required: true, autoKey: "noSpots" },
      { id: "firmness", label: "\u786C\u5EA6\u9002\u4E2D\u3001\u65E0\u8FC7\u5EA6\u8F6F\u70C2", required: true },
      { id: "odor", label: "\u65E0\u9152\u5473\u3001\u65E0\u5F02\u5E38\u53D1\u9175\u5473", required: true },
      { id: "residue", label: "\u8868\u9762\u65E0\u53EF\u89C1\u8721\u5C42\u5F02\u5E38\u6216\u6B8B\u7559", required: false }
    ]
  },
  {
    id: "meat",
    name: "\u9C9C\uFF08\u51BB\uFF09\u755C\u79BD\u8089",
    icon: "\u{1F969}",
    gbRefs: ["GB 2707-2016", "GB 2762-2022", "GB 31616-2015"],
    visual: {
      hueMin: 340,
      hueMax: 30,
      minSaturation: 0.12,
      maxDarkSpotRatio: 0.08,
      minBrightness: 0.2,
      maxGrayRatio: 0.25
    },
    checklist: [
      { id: "color", label: "\u8089\u8272\u6B63\u5E38\uFF08\u9C9C\u7EA2/\u6DE1\u7EA2\uFF09\uFF0C\u65E0\u53D1\u7EFF\u53D1\u7070", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u6DE4\u8840\u5757\u3001\u8113\u5305\u3001\u5BC4\u751F\u866B", required: true, autoKey: "noSpots" },
      { id: "odor", label: "\u65E0\u8165\u81ED\u3001\u6C28\u5473\u3001\u9178\u8D25\u5473", required: true },
      { id: "elastic", label: "\u6307\u538B\u540E\u5F39\u6027\u6062\u590D\u826F\u597D", required: true },
      { id: "cert", label: "\u68C0\u75AB\u5408\u683C\u6807\u5FD7/\u8FFD\u6EAF\u7801\u53EF\u67E5", required: true }
    ]
  },
  {
    id: "seafood",
    name: "\u9C9C\u51BB\u6C34\u4EA7\u54C1",
    icon: "\u{1F41F}",
    gbRefs: ["GB 2733-2015", "GB 2762-2022", "GB 10136-2016"],
    visual: {
      hueMin: 170,
      hueMax: 220,
      minSaturation: 0.08,
      maxDarkSpotRatio: 0.1,
      minBrightness: 0.18,
      maxGrayRatio: 0.3
    },
    checklist: [
      { id: "appearance", label: "\u9C7C\u773C\u6E05\u4EAE\u3001\u9CDE\u7247/\u867E\u58F3\u5B8C\u6574", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u8F6F\u70C2\u3001\u8131\u9AA8\u3001\u9ED1\u9CC3", required: true, autoKey: "noSpots" },
      { id: "odor", label: "\u65E0\u6C28\u5473\u3001\u8150\u81ED\u5473", required: true },
      { id: "gill", label: "\u9CC3\u90E8\u9C9C\u7EA2\u6216\u6DE1\u7EA2\uFF08\u9C9C\u54C1\uFF09", required: true },
      { id: "temp", label: "\u51B7\u94FE\u6E29\u5EA6\u7B26\u5408\u8981\u6C42\uFF08\u22644\u2103 \u6216\u51BB\u7ED3\u6001\uFF09", required: true }
    ]
  },
  {
    id: "dairy",
    name: "\u4E73\u5236\u54C1",
    icon: "\u{1F95B}",
    gbRefs: ["GB 19301-2010", "GB 25190-2010", "GB 2762-2022"],
    visual: {
      hueMin: 30,
      hueMax: 55,
      minSaturation: 0.05,
      maxDarkSpotRatio: 0.05,
      minBrightness: 0.55,
      maxGrayRatio: 0.12
    },
    checklist: [
      { id: "packaging", label: "\u5305\u88C5\u5BC6\u5C01\u5B8C\u597D\u3001\u65E0\u80C0\u5305\u6F0F\u5305", required: true },
      { id: "label", label: "\u751F\u4EA7\u65E5\u671F\u3001\u4FDD\u8D28\u671F\u3001\u5382\u540D\u5382\u5740\u6E05\u6670", required: true },
      { id: "appearance", label: "\u8272\u6CFD\u5747\u5300\u3001\u65E0\u7D6E\u72B6\u7269\uFF08\u6DB2\u6001\u5976\uFF09", required: true, autoKey: "colorFresh" },
      { id: "odor", label: "\u65E0\u9178\u8D25\u3001\u998A\u5473", required: true },
      { id: "cold", label: "\u51B7\u85CF\u94FE\u672A\u4E2D\u65AD\uFF08\u9700\u51B7\u85CF\u54C1\u7C7B\uFF09", required: true }
    ]
  },
  {
    id: "grain",
    name: "\u7CAE\u6CB9\u53CA\u5236\u54C1",
    icon: "\u{1F33E}",
    gbRefs: ["GB 1354-2018", "GB 1355-2021", "GB 2716-2018"],
    visual: {
      hueMin: 35,
      hueMax: 50,
      minSaturation: 0.08,
      maxDarkSpotRatio: 0.06,
      minBrightness: 0.35,
      maxGrayRatio: 0.1
    },
    checklist: [
      { id: "appearance", label: "\u9897\u7C92\u9971\u6EE1\u3001\u65E0\u5927\u91CF\u788E\u7C73/\u6742\u8D28", required: true, autoKey: "colorFresh" },
      { id: "spot", label: "\u65E0\u866B\u86C0\u3001\u65E0\u9709\u7C92\u3001\u65E0\u7ED3\u5757", required: true, autoKey: "noSpots" },
      { id: "odor", label: "\u65E0\u54C8\u5587\u5473\u3001\u9709\u5473", required: true },
      { id: "label", label: "\u7B49\u7EA7\u6807\u8BC6\u3001\u6267\u884C\u6807\u51C6\u53F7\u6B63\u786E", required: true },
      { id: "packaging", label: "\u5305\u88C5\u5E72\u71E5\u3001\u65E0\u7834\u635F\u53D7\u6F6E", required: true }
    ]
  },
  {
    id: "packaged",
    name: "\u9884\u5305\u88C5\u98DF\u54C1",
    icon: "\u{1F4E6}",
    gbRefs: ["GB 7718-2011", "GB 28050-2011", "GB 14881-2013"],
    visual: {
      hueMin: 0,
      hueMax: 360,
      minSaturation: 0,
      maxDarkSpotRatio: 0.15,
      minBrightness: 0.15,
      maxGrayRatio: 0.35
    },
    checklist: [
      { id: "label_name", label: "\u98DF\u54C1\u540D\u79F0\u3001\u914D\u6599\u8868\u5B8C\u6574", required: true },
      { id: "label_date", label: "\u751F\u4EA7\u65E5\u671F\u4E0E\u4FDD\u8D28\u671F\u5728\u6709\u6548\u671F\u5185", required: true },
      { id: "label_std", label: "\u4EA7\u54C1\u6807\u51C6\u4EE3\u53F7\u3001\u751F\u4EA7\u8BB8\u53EF\u8BC1\u53F7", required: true },
      { id: "packaging", label: "\u5305\u88C5\u5B8C\u597D\u3001\u65E0\u80C0\u888B\u7834\u635F", required: true },
      { id: "appearance", label: "\u5185\u5BB9\u7269\u8272\u6CFD\u5F62\u6001\u6B63\u5E38", required: true, autoKey: "colorFresh" }
    ]
  }
];
function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}
function listCategories() {
  return CATEGORIES.slice();
}
function scoreToGrade(score) {
  const s = Number(score) || 0;
  if (s >= GRADES.A.minScore) return "A";
  if (s >= GRADES.B.minScore) return "B";
  if (s >= GRADES.C.minScore) return "C";
  return "F";
}
function gradeInfo(grade) {
  return GRADES[grade] || GRADES.F;
}
function isPassingGrade(grade) {
  return grade === "A" || grade === "B";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CATEGORIES,
  GRADES,
  getCategory,
  gradeInfo,
  isPassingGrade,
  listCategories,
  scoreToGrade
});
