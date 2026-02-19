import type { StyleTemplate } from '@/types';

export const templates: StyleTemplate[] = [
  {
    id: 'professional',
    name: '專業商務',
    description: '乾淨俐落的商務風格',
    preview: {
      primaryColor: '#1a1a2e',
      secondaryColor: '#16213e',
      accentColor: '#e94560',
    },
    defaults: {
      globalSetting: {
        mood: 'professional',
        colorScheme: 'monochrome',
        decorationDensity: 30,
        overallRefinement: 80,
      },
      elementDefaults: {
        title: {
          elementId: '',
          decoration: { style: 'underline', intensity: 60, customNote: '' },
          enhancement: { fontSuggestion: '現代無襯線體', texture: '', effect: '微陰影', colorOverride: '' },
        },
        background: {
          elementId: '',
          decoration: { style: 'gradient', intensity: 40, customNote: '' },
          enhancement: { fontSuggestion: '', texture: '磨砂質感', effect: '', colorOverride: '' },
        },
        cta_button: {
          elementId: '',
          decoration: { style: 'outline', intensity: 70, customNote: '' },
          enhancement: { fontSuggestion: '現代無襯線體', texture: '', effect: '微陰影', colorOverride: '' },
        },
      },
    },
  },
  {
    id: 'playful',
    name: '活潑繽紛',
    description: '色彩豐富、充滿活力',
    preview: {
      primaryColor: '#ff6b6b',
      secondaryColor: '#ffd93d',
      accentColor: '#6bcb77',
    },
    defaults: {
      globalSetting: {
        mood: 'playful',
        colorScheme: 'vibrant',
        decorationDensity: 70,
        overallRefinement: 60,
      },
      elementDefaults: {
        title: {
          elementId: '',
          decoration: { style: 'badge', intensity: 80, customNote: '' },
          enhancement: { fontSuggestion: '圓體', texture: '', effect: '立體感', colorOverride: '' },
        },
        decoration: {
          elementId: '',
          decoration: { style: 'glow', intensity: 60, customNote: '' },
          enhancement: { fontSuggestion: '', texture: '', effect: '霓虹', colorOverride: '' },
        },
        cta_button: {
          elementId: '',
          decoration: { style: 'badge', intensity: 85, customNote: '' },
          enhancement: { fontSuggestion: '圓體', texture: '', effect: '立體感', colorOverride: '' },
        },
      },
    },
  },
  {
    id: 'chinese-heritage',
    name: '中式老店風',
    description: '深紅底金字，傳統品牌質感',
    preview: {
      primaryColor: '#8B1A1A',
      secondaryColor: '#C8A951',
      accentColor: '#3E2723',
    },
    defaults: {
      globalSetting: {
        mood: 'elegant',
        colorScheme: 'analogous',
        decorationDensity: 60,
        overallRefinement: 75,
      },
      elementDefaults: {
        title: {
          elementId: '',
          decoration: { style: 'shadow', intensity: 70, customNote: '金色粗體字，帶微微浮雕感，確保文字清晰可讀' },
          enhancement: { fontSuggestion: '粗體標題體', texture: '', effect: '微陰影', colorOverride: '金黃色' },
        },
        subtitle: {
          elementId: '',
          decoration: { style: 'none', intensity: 40, customNote: '黃色字，比標題略小' },
          enhancement: { fontSuggestion: '現代無襯線體', texture: '', effect: '', colorOverride: '淺金色' },
        },
        background: {
          elementId: '',
          decoration: { style: 'gradient', intensity: 50, customNote: '深紅底色，帶中式暗紋/雲紋裝飾' },
          enhancement: { fontSuggestion: '', texture: '紙質', effect: '', colorOverride: '暗紅色' },
        },
        decoration: {
          elementId: '',
          decoration: { style: 'outline', intensity: 65, customNote: '白色撕裂紙張效果作為區塊分隔' },
          enhancement: { fontSuggestion: '', texture: '紙質', effect: '微陰影', colorOverride: '' },
        },
        image: {
          elementId: '',
          decoration: { style: 'shadow', intensity: 55, customNote: '照片帶邊框，微微傾斜擺放增加層次' },
          enhancement: { fontSuggestion: '', texture: '', effect: '微陰影', colorOverride: '' },
        },
        body_text: {
          elementId: '',
          decoration: { style: 'badge', intensity: 50, customNote: '深棕底白字的標籤式標注' },
          enhancement: { fontSuggestion: '現代無襯線體', texture: '', effect: '', colorOverride: '白色' },
        },
        cta_button: {
          elementId: '',
          decoration: { style: 'badge', intensity: 75, customNote: '紅底金字的醒目按鈕，文字需清晰可辨' },
          enhancement: { fontSuggestion: '粗體標題體', texture: '', effect: '微陰影', colorOverride: '金黃色' },
        },
      },
    },
  },
  {
    id: 'elegant',
    name: '優雅質感',
    description: '簡約高級的設計質感',
    preview: {
      primaryColor: '#2d2d2d',
      secondaryColor: '#c4a35a',
      accentColor: '#f5f0e8',
    },
    defaults: {
      globalSetting: {
        mood: 'elegant',
        colorScheme: 'analogous',
        decorationDensity: 40,
        overallRefinement: 90,
      },
      elementDefaults: {
        title: {
          elementId: '',
          decoration: { style: 'shadow', intensity: 50, customNote: '優雅質感但文字需清晰' },
          enhancement: { fontSuggestion: '優雅襯線體', texture: '', effect: '微陰影', colorOverride: '' },
        },
        background: {
          elementId: '',
          decoration: { style: 'gradient', intensity: 30, customNote: '' },
          enhancement: { fontSuggestion: '', texture: '大理石', effect: '', colorOverride: '' },
        },
        cta_button: {
          elementId: '',
          decoration: { style: 'outline', intensity: 60, customNote: '' },
          enhancement: { fontSuggestion: '優雅襯線體', texture: '', effect: '微陰影', colorOverride: '' },
        },
      },
    },
  },
];
