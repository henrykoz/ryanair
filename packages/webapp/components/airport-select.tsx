'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Plane } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type Airport = {
  code: string
  name: string
  city: string
  country: string
  countryCode: string
}

type AirportsByCountry = Record<string, Airport[]>

interface AirportSelectProps {
  value?: string
  onValueChange: (value: string) => void
  airports: AirportsByCountry
  placeholder?: string
  disabled?: boolean
  filterByCodes?: string[]
}

export function AirportSelect({
  value,
  onValueChange,
  airports,
  placeholder = 'Select airport...',
  disabled = false,
  filterByCodes,
}: AirportSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Find selected airport
  const selectedAirport = React.useMemo(() => {
    if (!value) return null
    for (const country of Object.values(airports)) {
      const airport = country.find((a) => a.code === value)
      if (airport) return airport
    }
    return null
  }, [value, airports])

  // Filter airports based on search query and optional code filter
  const filteredAirports = React.useMemo(() => {
    let airportsToFilter = airports

    // First apply code filter if provided
    if (filterByCodes && filterByCodes.length > 0) {
      const codeSet = new Set(filterByCodes)
      const codeFiltered: AirportsByCountry = {}

      Object.entries(airports).forEach(([country, countryAirports]) => {
        const matchingAirports = countryAirports.filter((airport) =>
          codeSet.has(airport.code)
        )

        if (matchingAirports.length > 0) {
          codeFiltered[country] = matchingAirports
        }
      })

      airportsToFilter = codeFiltered
    }

    // Then apply search query filter
    if (!searchQuery) return airportsToFilter

    const query = searchQuery.toLowerCase()
    const filtered: AirportsByCountry = {}

    Object.entries(airportsToFilter).forEach(([country, countryAirports]) => {
      const matchingAirports = countryAirports.filter(
        (airport) =>
          airport.name.toLowerCase().includes(query) ||
          airport.city.toLowerCase().includes(query) ||
          airport.code.toLowerCase().includes(query) ||
          country.toLowerCase().includes(query)
      )

      if (matchingAirports.length > 0) {
        filtered[country] = matchingAirports
      }
    })

    return filtered
  }, [airports, searchQuery, filterByCodes])

  // Sort countries alphabetically
  const sortedCountries = React.useMemo(
    () => Object.keys(filteredAirports).sort(),
    [filteredAirports]
  )

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
            <Plane className="h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">
              {selectedAirport
                ? `${selectedAirport.code} - ${selectedAirport.city}`
                : placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search airport..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No airport found.</CommandEmpty>
            {sortedCountries.map((country) => (
              <CommandGroup key={country} heading={country}>
                {filteredAirports[country].map((airport) => (
                  <CommandItem
                    key={airport.code}
                    value={airport.code}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? '' : currentValue)
                      setOpen(false)
                      setSearchQuery('')
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === airport.code ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {airport.code} - {airport.city}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {airport.name}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
