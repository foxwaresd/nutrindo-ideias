'use client'

import AdUnit from './AdUnit'
import { AD_SLOTS } from '@/lib/ads'

export default function StickyAds() {
  return (
    <>
      <div className="hidden 2xl:flex flex-col items-center gap-1 fixed left-4 top-1/2 -translate-y-1/2 z-30">
        <p className="text-xs text-gray-400">Publicidade</p>
        <AdUnit
          slot={AD_SLOTS.sticky}
          format="vertical"
          responsive={false}
          style={{ width: 160, height: 600 }}
          className="rounded-xl overflow-hidden"
          label="Lateral esq."
        />
      </div>
      <div className="hidden 2xl:flex flex-col items-center gap-1 fixed right-4 top-1/2 -translate-y-1/2 z-30">
        <p className="text-xs text-gray-400">Publicidade</p>
        <AdUnit
          slot={AD_SLOTS.sticky}
          format="vertical"
          responsive={false}
          style={{ width: 160, height: 600 }}
          className="rounded-xl overflow-hidden"
          label="Lateral dir."
        />
      </div>
    </>
  )
}
