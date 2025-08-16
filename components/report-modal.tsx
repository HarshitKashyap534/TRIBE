"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const reportReasons = [
  { id: "inappropriate", label: "Inappropriate Content" },
  { id: "spam", label: "Spam" },
  { id: "harassment", label: "Harassment" },
  { id: "other", label: "Other" },
]

export function ReportModal({ isOpen, onClose, onReport }) {
  const [selectedReason, setSelectedReason] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleReport = () => {
    if (selectedReason) {
      onReport(selectedReason)
      setShowSuccess(true)

      // Auto close after 8 seconds (increased from 5)
      setTimeout(() => {
        setShowSuccess(false)
        setSelectedReason("")
        onClose()
      }, 8000)
    }
  }

  const handleClose = () => {
    setShowSuccess(false)
    setSelectedReason("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-center mb-2">Report Submitted Successfully!</h2>
              <p className="text-center text-muted-foreground mb-2">
                <strong>Your report has been submitted successfully and we'll look into it</strong>
              </p>
              <p className="text-xs text-muted-foreground text-center">
                This dialog will close automatically in a few seconds
              </p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  Report Post
                </DialogTitle>
                <DialogDescription>Please select a reason for reporting this post.</DialogDescription>
              </DialogHeader>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="space-y-2 my-4">
                {reportReasons.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-2 border rounded-md p-2">
                    <RadioGroupItem value={reason.id} id={reason.id} />
                    <Label htmlFor={reason.id} className="flex-grow cursor-pointer">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <DialogFooter>
                <Button variant="outline" onClick={handleClose} className="rounded-full">
                  Cancel
                </Button>
                <Button onClick={handleReport} disabled={!selectedReason} className="rounded-full">
                  Report
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
