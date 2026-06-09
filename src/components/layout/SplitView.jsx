import { useState } from 'react'
import TerrainViewer from '../TerrainViewer'
import Map2DView from '../map/Map2DView'

export default function SplitView({ terrainData, overlayData, settings, onCanvasReady }) {
  const [ratio, setRatio] = useState(52)

  return (
    <div className="flex h-full w-full bg-slate-950">
      <div className="relative min-w-0 overflow-hidden border-r border-white/6" style={{ width: `${ratio}%` }}>
        <TerrainViewer terrainData={terrainData} overlayData={overlayData} settings={settings} onCanvasReady={onCanvasReady} />
      </div>

      <div className="flex w-2 items-stretch bg-white/5">
        <input
          type="range"
          min={30}
          max={70}
          value={ratio}
          onChange={(e) => setRatio(Number(e.target.value))}
          className="w-full rotate-180 appearance-none bg-transparent"
        />
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <Map2DView terrainData={terrainData} overlayData={overlayData} settings={settings} title="2D 联动预览" />
      </div>
    </div>
  )
}
