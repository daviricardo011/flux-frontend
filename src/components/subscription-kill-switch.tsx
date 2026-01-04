 

import { useState } from "react"
import { Tv, Music, Cloud, Package, AlertCircle, X, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"

const initialSubscriptions = [
  {
    id: 1,
    name: "Netflix Premium",
    price: 22.99,
    previousPrice: 15.99,
    priceIncreased: true,
    icon: Tv,
    color: "#E50914",
    nextBilling: "Jan 5, 2025",
  },
  {
    id: 2,
    name: "Spotify Family",
    price: 16.99,
    previousPrice: null,
    priceIncreased: false,
    icon: Music,
    color: "#1DB954",
    nextBilling: "Jan 8, 2025",
  },
  {
    id: 3,
    name: "iCloud Storage",
    price: 9.99,
    previousPrice: null,
    priceIncreased: false,
    icon: Cloud,
    color: "#007AFF",
    nextBilling: "Jan 12, 2025",
  },
  {
    id: 4,
    name: "Amazon Prime",
    price: 14.99,
    previousPrice: null,
    priceIncreased: false,
    icon: Package,
    color: "#FF9900",
    nextBilling: "Jan 15, 2025",
  },
]

export function SubscriptionKillSwitch() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedSub, setSelectedSub] = useState<(typeof initialSubscriptions)[0] | null>(null)

  const handleCancelClick = (sub: (typeof initialSubscriptions)[0]) => {
    setSelectedSub(sub)
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = () => {
    if (selectedSub) {
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== selectedSub.id))
    }
    setCancelModalOpen(false)
    setSelectedSub(null)
  }

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.price, 0)

  return (
    <>
      <div className="glass rounded-2xl p-6 border border-white/10">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Subscription Kill-Switch</h2>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#CCFF00]">${totalMonthly.toFixed(2)}</p>
            <p className="text-sm text-white/50">/ month</p>
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const Icon = sub.icon
            return (
              <div
                key={sub.id}
                className="glass rounded-xl p-4 border border-white/10 glass-hover transition-all relative overflow-hidden"
              >
                {/* Gradient accent */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10"
                  style={{ background: sub.color }}
                />

                <div className="flex items-center gap-4 relative z-10">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${sub.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: sub.color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{sub.name}</h3>
                      {sub.priceIncreased && (
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-3 h-3 text-red-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-white">${sub.price}</p>
                      {sub.priceIncreased && sub.previousPrice && (
                        <p className="text-xs text-red-400 line-through">${sub.previousPrice}</p>
                      )}
                    </div>
                    <p className="text-xs text-white/50">Next billing: {sub.nextBilling}</p>
                  </div>

                  {/* Cancel Button */}
                  <Button
                    onClick={() => handleCancelClick(sub)}
                    variant="outline"
                    size="sm"
                    className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 flex-shrink-0"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Price increase alert */}
                {sub.priceIncreased && sub.previousPrice && (
                  <div className="mt-3 pt-3 border-t border-red-500/20">
                    <p className="text-xs text-red-400">
                      Price increased by ${(sub.price - sub.previousPrice).toFixed(2)} (+
                      {(((sub.price - sub.previousPrice) / sub.previousPrice) * 100).toFixed(0)}%)
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="glass border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription className="text-white/70">
              You are about to cancel your {selectedSub?.name} subscription. This action will take effect at the end of
              your current billing period.
            </DialogDescription>
          </DialogHeader>

          {selectedSub && (
            <div className="glass rounded-xl p-4 border border-white/10 my-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedSub.color}20` }}
                >
                  {selectedSub.icon && <selectedSub.icon className="w-6 h-6" style={{ color: selectedSub.color }} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{selectedSub.name}</p>
                  <p className="text-lg font-bold text-[#CCFF00]">${selectedSub.price}/mo</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/60">
                <p>Access until: {selectedSub.nextBilling}</p>
                <p>Annual savings: ${(selectedSub.price * 12).toFixed(2)}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              onClick={() => setCancelModalOpen(false)}
              variant="outline"
              className="flex-1 glass border-white/20 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              Keep Subscription
            </Button>
            <Button onClick={handleConfirmCancel} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              <Check className="w-4 h-4 mr-2" />
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
