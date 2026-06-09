import { useState } from 'react'
import { motion } from 'framer-motion'
import AnalysisPanel from '../AnalysisPanel'
import ExportCenter from '../ExportCenter'

function CollapsibleSection({ eyebrow, title, badge, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-white/6 bg-slate-950/30 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-sky-300/70 shrink-0">{eyebrow}</span>
          <span className="text-sm font-medium text-slate-200 truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {badge ? (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-300 border border-white/10">
              {badge}
            </span>
          ) : null}
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400 text-xs"
          >
            ▶
          </motion.div>
        </div>
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="px-3.5 pb-3.5 pt-0">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function QuickStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/8 bg-slate-950/45 px-2.5 py-2">
      <div className="text-[9px] text-slate-400">{label}</div>
      <div className="mt-0.5 truncate text-xs font-semibold text-slate-100" title={String(value)}>
        {value}
      </div>
    </div>
  )
}

export default function RightInspector({ terrainData, overlayData, settings, selectedRegion, canvasElement, datasets = [] }) {
  const activeCount = datasets.filter((item) => item.include !== false).length
  const hasCanvas = !!canvasElement

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-950/25">
      {/* 紧凑的顶部区域 */}
      <div className="border-b border-white/5 px-4 pb-3 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <span className="text-xs">📊</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-100">信息面板</h2>
              <div className="flex items-center gap-2 text-[9px] text-slate-400">
                <span>区域: {selectedRegion?.label || '未知'}</span>
              </div>
            </div>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-300 border border-sky-400/20">
            {hasCanvas ? '就绪' : '等待'}
          </span>
        </div>
      </div>

      {/* 可滚动内容区 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2.5 pb-3">
          <CollapsibleSection eyebrow="STATS" title="快速统计" badge={activeCount + ' 活跃'}>
            <div className="pt-2 grid grid-cols-2 gap-1.5">
              <QuickStat label="文件总数" value={datasets.length} />
              <QuickStat label="已启用" value={activeCount} />
              <QuickStat label="DEM" value={terrainData?.sourceFile ? terrainData.sourceFile.substring(0, 12) + '…' : '未加载'} />
              <QuickStat label="影像" value={overlayData?.sourceFile ? overlayData.sourceFile.substring(0, 12) + '…' : '未加载'} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection eyebrow="ANALYSIS" title="分析看板" badge={terrainData ? '实时' : '等待'}>
            <div className="pt-2">
              <AnalysisPanel terrainData={terrainData} overlayData={overlayData} settings={settings} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection eyebrow="EXPORT" title="办公输出" badge="导出">
            <div className="pt-2">
              <ExportCenter
                terrainData={terrainData}
                overlayData={overlayData}
                settings={settings}
                selectedRegion={selectedRegion}
                canvasElement={canvasElement}
              />
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  )
}
