import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            AI Prompt 生成器
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            選擇工作模式開始使用
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16 flex-1 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            你想做什麼？
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            兩種工作流程，各自獨立運作
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Flow A：社群貼文美化 */}
          <Link
            href="/beautify"
            className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
              <svg className="h-6 w-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                社群貼文美化
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                上傳現有社群貼文圖片，AI 分析版面元素，調整裝飾與風格後產出一個美化 Prompt
              </p>
            </div>

            <div className="space-y-1.5">
              {['上傳社群貼文圖片', 'AI 分析版面與元素', '逐元素調整風格', '產出 1 個美化 Prompt'].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-violet-600 dark:text-violet-400">
              開始使用
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Flow B：產品圖 7 種 Prompt */}
          <Link
            href="/product"
            className="group flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                產品圖 Prompt 生成
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                上傳產品圖並填寫資訊，AI 一次產出 7 種類型的產品圖 Prompt，各自複製貼到 AI 工具生成
              </p>
            </div>

            <div className="space-y-1.5">
              {['上傳產品圖 + 填寫產品資訊', 'AI 分析產品特徵', '同時產出 7 種 Prompt', '各自複製貼至 AI 工具'].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            <div className="space-y-1 mb-1">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">包含 7 種圖片類型：</p>
              <div className="flex flex-wrap gap-1">
                {['3D 渲染', '手持產品', '特點圖 ×2', '比較圖', '情境+Model', '使用說明'].map((tag) => (
                  <span key={tag} className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              開始使用
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
