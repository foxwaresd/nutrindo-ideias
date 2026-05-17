import AdUnit from './AdUnit'
import { AD_SLOTS } from '@/lib/ads'

export default function InFeedAd() {
  return (
    <div className="w-full my-2">
      <p className="text-xs text-gray-400 text-center mb-1">Publicidade</p>
      <AdUnit
        slot={AD_SLOTS.infeed}
        format="fluid"
        style={{ minHeight: 200 }}
        className="w-full rounded-2xl overflow-hidden"
        label="Anúncio — Entre posts"
      />
    </div>
  )
}
