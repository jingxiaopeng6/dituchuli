import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import GlobeExplorer from './GlobeExplorer'
import UploadZone from './UploadZone'
import BandComposer from './BandComposer'
import FormatLab from './format/FormatLab'
import DataHub from './data/DataHub'
import { CONTOUR_INTERVALS } from '../constants/theme'

const COLOR_SCHEMES = [
  { key: 'natural', label: '自然', colors: ['#1E40AF', '#166534', '#854D0E'] },
  { key: 'satellite', label: '卫星', colors: ['#1E3A5F', '#4A7C59', '#8B7355'] },
  { key: 'topographic', label: '等高', colors: ['#F8FAFC', '#D4E6D4', '#6B8E6B'] },
]

function CollapsibleSection({ eyebrow, title, badge, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-white/6 bg-slate-950/30 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-amber-300/70 shrink-0">{eyebrow}</span>
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

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-white/8 bg-slate-950/45 px-2.5 py-2">
      <div className="text-[9px] text-slate-400">{label}</div>
      <div className="mt-0.5 truncate text-xs font-semibold text-slate-100" title={String(value)}>
        {value}
      </div>
      {hint ? <div className="mt-0.5 text-[9px] text-slate-500">{hint}</div> : null}
    </div>
  )
}

function ToggleButton({ label, active, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${
        active
          ? 'border-amber-500/40 bg-amber-500/15'
          : 'border-white/5 bg-slate-900/35 hover:border-slate-600/30'
      } ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
    >
      <div className="text-[11px] text-slate-200">{label}</div>
      <div className={`relative h-3.5 w-7 rounded-full transition-colors ${active ? 'bg-amber-500' : 'bg-slate-700'}`}>
        <motion.div animate={{ x: active ? 14 : 2 }} className="absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white" />
      </div>
    </button>
  )
}

function RangeControl({ label, value, displayValue, suffix, min, max, step, onChange, onCommit }) {
  return (
    <div className="rounded-xl border border-white/6 bg-slate-950/35 p-2.5">
      <div className="mb-1 flex justify-between text-[11px]">
        <span className="text-slate-400">{label}</span>
        <span className="text-amber-300">
          {displayValue ?? value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={() => onCommit?.()}
        onMouseUp={() => onCommit?.()}
        onTouchEnd={() => onCommit?.()}
        className="w-full cursor-pointer appearance-none rounded-full bg-slate-800 h-1.5
          [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
      />
    </div>
  )
}

export default function WorkspaceConsole({
  terrainData,
  overlayData,
  settings,
  onSettingsChange,
  onFileUpload,
  selectedRegion,
  onRegionChange,
  datasets = [],
  onToggleDatasetInclude,
  onAssignDatasetBand,
  onPickDatasetRole,
  onRemoveDataset,
  onClearDatasets,
  onOpenBandComposer,
  onOpenReportPage,
}) {
  const hasOverlay = !!overlayData
  const hasData = !!terrainData
  const [terrainScaleDraft, setTerrainScaleDraft] = useState(settings.terrainScale)
  const terrainScaleDragActive = useRef(false)
  const activeFiles = datasets.filter((item) => item.include !== false).length

  useEffect(() => {
    if (!terrainScaleDragActive.current) {
      setTerrainScaleDraft(settings.terrainScale)
    }
  }, [settings.terrainScale])

  const handleChange = (key, value) => {
    onSettingsChange((prev) => ({ ...prev, [key]: value }))
  }

  const handleTerrainScaleChange = (value) => {
    terrainScaleDragActive.current = true
    setTerrainScaleDraft(value)
    onSettingsChange((prev) => ({ ...prev, terrainScale: value }))
  }

  const commitTerrainScale = () => {
    terrainScaleDragActive.current = false
    onSettingsChange((prev) => ({ ...prev, terrainScale: terrainScaleDraft }))
  }

  return (
    <motion.div
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-slate-950/25"
    >
      {/* 紧凑的顶部区域 */}
      <div className="border-b border-white/5 px-4 pb-3 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <span className="text-xs">🗺️</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-100">空间数据工作台</h2>
              <div className="flex items-center gap-2 text-[9px] text-slate-400">
                <span>文件 {datasets.length}</span>
                <span>·</span>
                <span>已启用 {activeFiles}</span>
              </div>
            </div>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
            Live
          </span>
        </div>
      </div>

      {/* 可滚动内容区 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2.5 pb-3">
          <CollapsibleSection eyebrow="DATA" title="数据中心" badge={`${datasets.length} 文件`}>
            <div className="pt-2">
              <DataHub
                datasets={datasets}
                onToggleInclude={onToggleDatasetInclude}
                onAssignBand={onAssignDatasetBand}
                onPickRole={onPickDatasetRole}
                onRemove={onRemoveDataset}
                onClear={onClearDatasets}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection eyebrow="GEO" title="地名与区域" badge={selectedRegion?.label || '就绪'}>
            <div className="pt-2">
              <GlobeExplorer selectedRegion={selectedRegion} onRegionChange={onRegionChange} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection eyebrow="IMPORT" title="文件导入与合成" badge={`${activeFiles}/${datasets.length || 0}`}>
            <div className="pt-2 space-y-2.5">
              <UploadZone
                onFileUpload={(data) => {
                  onFileUpload?.(data)
                  if (data?.kind === 'imagery') {
                    onSettingsChange((prev) => ({ ...prev, showOverlay: true }))
                  }
                }}
              />
              <BandComposer
                onCompositeReady={(data) => {
                  onFileUpload?.(data)
                }}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection eyebrow="FORMAT" title="格式转换中心" badge="GDAL 路线">
            <div className="pt-2">
              <FormatLab
                datasets={datasets}
                terrainData={terrainData}
                overlayData={overlayData}
                onImportConvertedData={onFileUpload}
                onOpenBandComposer={onOpenBandComposer}
                onOpenReportPage={onOpenReportPage}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection eyebrow="RENDER" title="渲染控制" badge="实时">
            <div className="pt-2 space-y-2.5">
              <div>
                <label className="mb-1.5 block text-[11px] text-slate-400">渲染风格</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {COLOR_SCHEMES.map(({ key, label, colors }) => (
                    <button
                      key={key}
                      onClick={() => handleChange('colorScheme', key)}
                      className={`rounded-xl border p-2 text-left transition-all ${
                        settings.colorScheme === key
                          ? 'border-amber-500/40 bg-amber-500/10'
                          : 'border-white/5 bg-slate-900/40 hover:border-slate-600/30'
                      }`}
                    >
                      <div className="mb-1.5 flex gap-0.5">
                        {COLOR_SCHEMES.find(s => s.key === key)?.colors.map((c) => (
                        <div key={c} className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: c }} />
                      ))}
                      </div>
                      <span className="text-[9px] text-slate-400">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <RangeControl
                label="地形夸张"
                value={terrainScaleDraft}
                displayValue={terrainScaleDraft.toFixed(1)}
                suffix="x"
                min={0.1}
                max={3}
                step={0.1}
                onChange={handleTerrainScaleChange}
                onCommit={commitTerrainScale}
              />

              <div>
                <div className="mb-1.5 flex justify-between text-[11px]">
                  <span className="text-slate-400">等高线间距</span>
                  <span className="text-amber-300">{settings.contourInterval}m</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {CONTOUR_INTERVALS.map((interval) => (
                    <button
                      key={interval}
                      onClick={() => handleChange('contourInterval', interval)}
                      className={`min-w-9 flex-1 rounded-lg py-1.5 text-[10px] transition-all ${
                      settings.contourInterval === interval
                        ? 'bg-amber-500 font-medium text-slate-950'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-amber-500/15'
                    }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>

              <RangeControl
                label="影像透明度"
                value={settings.overlayOpacity * 100}
                displayValue={Math.round(settings.overlayOpacity * 100)}
                suffix="%"
                min={0}
                max={100}
                step={5}
                onChange={(value) => handleChange('overlayOpacity', value / 100)}
              />

              <RangeControl
                label="太阳方位"
                value={settings.sunAzimuth}
                suffix="°"
                min={0}
                max={360}
                step={1}
                onChange={(value) => handleChange('sunAzimuth', value)}
              />

              <RangeControl
                label="太阳高度"
                value={settings.sunElevation}
                suffix="°"
                min={0}
                max={90}
                step={1}
                onChange={(value) => handleChange('sunElevation', value)}
              />

              <div className="space-y-1.5">
                <ToggleButton
                  label="显示影像"
                  active={settings.showOverlay}
                  onClick={() => handleChange('showOverlay', !settings.showOverlay)}
                  disabled={!hasOverlay}
                />
                <ToggleButton
                  label="显示阴影"
                  active={settings.showHillshade}
                  onClick={() => handleChange('showHillshade', !settings.showHillshade)}
                  disabled={!hasData}
                />
                <ToggleButton
                  label="显示等高线"
                  active={settings.showContours}
                  onClick={() => handleChange('showContours', !settings.showContours)}
                  disabled={!hasData}
                />
              </div>
            </div>
          </CollapsibleSection>


        </div>
      </div>
    </motion.div>
  )
}
