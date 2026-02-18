# 社群貼文美化 Prompt 生成器

一個基於 AI 的社群媒體貼文圖片分析工具，能自動辨識圖片中的視覺元素，並生成可用於 AI 圖像生成工具的美化 Prompt。

## 功能特色

- **智慧圖片分析** — 使用 Google Gemini AI 自動辨識圖片中的文字、背景、裝飾、排版結構與配色
- **風格模板** — 提供 4 套預設模板（專業商務、活潑繽紛、中式老店風、優雅質感），一鍵套用
- **全域設定** — 自訂整體氛圍、配色方案、裝飾密度與精緻度
- **元素級微調** — 針對每個辨識出的元素，獨立調整裝飾風格、字體、材質、特效與顏色
- **一鍵複製 Prompt** — 生成的 Prompt 可直接用於任何 AI 圖像生成工具

## 使用流程

```
上傳圖片 → AI 分析 → 選擇模板 / 微調設定 → 生成 Prompt → 複製使用
```

1. **上傳** — 支援 PNG、JPEG、WEBP 格式（最大 10MB），可拖曳或點擊上傳
2. **分析** — AI 自動辨識圖片中的所有視覺元素，提供配色分析與風格評估
3. **調整** — 選擇風格模板或手動微調全域設定與各元素細節
4. **生成** — 產出完整的美化 Prompt，支援一鍵複製

## 技術堆疊

- **框架**: [Next.js](https://nextjs.org) 16 + React 19
- **語言**: TypeScript 5
- **樣式**: Tailwind CSS 4
- **AI 模型**: Google Gemini 2.5 Flash
- **資料驗證**: Zod 4

## 快速開始

### 環境需求

- Node.js 18+
- Google Gemini API Key

### 安裝步驟

```bash
# 1. 複製專案
git clone https://github.com/Liiiiwei/image-prompt-creator.git
cd image-prompt-creator

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env.local
# 編輯 .env.local，填入你的 Gemini API Key
```

`.env.local` 範例：

```
GEMINI_API_KEY=你的_API_Key
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000) 即可使用。

### 其他指令

```bash
npm run build    # 建置生產版本
npm run start    # 啟動生產伺服器
npm run lint     # 執行程式碼檢查
```

## 專案結構

```
src/
├── app/
│   ├── page.tsx                  # 主頁面（4 步驟流程）
│   ├── layout.tsx                # 根佈局
│   └── globals.css               # 全域樣式
├── components/
│   ├── ImageUploader.tsx         # 圖片上傳元件
│   ├── AnalysisLoading.tsx       # 分析載入狀態
│   ├── ElementControlPanel.tsx   # 全域設定 + 元素控制面板
│   ├── ElementCard.tsx           # 單一元素編輯卡片
│   ├── StyleTemplateSelector.tsx # 風格模板選擇器
│   └── PromptOutput.tsx          # Prompt 輸出顯示
├── hooks/
│   ├── useImageUpload.ts         # 圖片上傳邏輯
│   └── useAnalysis.ts            # AI 分析邏輯
├── lib/
│   ├── gemini.ts                 # Gemini API 封裝
│   ├── image-utils.ts            # 圖片工具函式
│   └── prompt-builder.ts         # Prompt 組裝邏輯
├── data/
│   └── templates.ts              # 風格模板定義
└── types/
    └── index.ts                  # TypeScript 型別定義
```

## 授權

MIT License
