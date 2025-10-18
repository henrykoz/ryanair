'use client'

import * as React from 'react'
import { Users, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface PassengerCounts {
  adults: number
  teens: number
  children: number
  infants: number
}

interface PassengerSelectProps {
  value: PassengerCounts
  onChange: (value: PassengerCounts) => void
  disabled?: boolean
}

export function PassengerSelect({ value, onChange, disabled = false }: PassengerSelectProps) {
  const [open, setOpen] = React.useState(false)

  const totalPassengers = value.adults + value.teens + value.children + value.infants

  const updateCount = (
    type: keyof PassengerCounts,
    delta: number
  ) => {
    const newValue = { ...value }
    const newCount = Math.max(0, value[type] + delta)

    // Validate constraints
    if (type === 'adults') {
      // Must have at least 1 adult
      if (newCount < 1) return
      // If reducing adults below infants count, reduce infants
      if (newCount < value.infants) {
        newValue.infants = newCount
      }
    }

    if (type === 'infants') {
      // Infants cannot exceed adults
      if (newCount > value.adults) return
    }

    // Apply max total passengers limit (9 is common for most airlines)
    const newTotal = Object.entries(newValue).reduce((sum, [key, count]) => {
      return sum + (key === type ? newCount : count)
    }, 0)

    if (newTotal > 9) return

    newValue[type] = newCount
    onChange(newValue)
  }

  const passengerTypes = [
    {
      key: 'adults' as keyof PassengerCounts,
      label: 'Adults',
      description: '16+ years',
      min: 1,
    },
    {
      key: 'teens' as keyof PassengerCounts,
      label: 'Teens',
      description: '12-15 years',
      min: 0,
    },
    {
      key: 'children' as keyof PassengerCounts,
      label: 'Children',
      description: '2-11 years',
      min: 0,
    },
    {
      key: 'infants' as keyof PassengerCounts,
      label: 'Infants',
      description: 'Under 2 years',
      min: 0,
    },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between touch-target"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 opacity-50" />
            <span>
              {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select Passengers</div>
          {passengerTypes.map((type) => (
            <div key={type.key} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{type.label}</span>
                <span className="text-xs text-muted-foreground">{type.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateCount(type.key, -1)}
                  disabled={value[type.key] <= type.min}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {value[type.key]}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateCount(type.key, 1)}
                  disabled={
                    (type.key === 'infants' && value[type.key] >= value.adults) ||
                    totalPassengers >= 9
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {totalPassengers >= 9 && (
            <p className="text-xs text-muted-foreground text-center">
              Maximum 9 passengers allowed
            </p>
          )}
          {value.infants >= value.adults && value.infants > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Each infant must be accompanied by an adult
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
