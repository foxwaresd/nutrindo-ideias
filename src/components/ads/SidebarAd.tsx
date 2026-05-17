import AdUnit from './AdUnit'
import { AD_SLOTS } from '@/lib/ads'

export default function SidebarAd() {
  return (
    <div className="w-full">
      <p className="text-xs text-gray-400 text-center mb-1">Publicidade</p>
      <AdUnit
        slot={AD_SLOTS.sidebar}
        format="auto"
        responsive
        style={{ minHeight: 250 }}
        className="w-full rounded-xl overflow-hidden"
        label="Banner — Sidebar"
      />
    </div>
  )
}
