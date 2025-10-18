'use client'

import * as React from 'react'
import { Plane, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AirportSelect } from '@/components/airport-select'
import { DateRangePicker } from '@/components/date-range-picker'
import { PassengerSelect, type PassengerCounts } from '@/components/passenger-select'
import { generateRyanairBookingUrl } from '@/lib/booking'
import { addDays } from 'date-fns'

type Airport = {
  code: string
  name: string
  city: string
  country: string
  countryCode: string
  coordinates?: { latitude: number; longitude: number }
}

type AirportsByCountry = Record<string, Airport[]>

export default function Home() {
  const [tripType, setTripType] = React.useState<'one-way' | 'return'>('return')
  const [origin, setOrigin] = React.useState('')
  const [destination, setDestination] = React.useState('')
  const [dateOut, setDateOut] = React.useState<Date>()
  const [dateIn, setDateIn] = React.useState<Date>()
  const [passengers, setPassengers] = React.useState<PassengerCounts>({
    adults: 1,
    teens: 0,
    children: 0,
    infants: 0,
  })
  const [airports, setAirports] = React.useState<AirportsByCountry>({})
  const [loading, setLoading] = React.useState(true)
  const [searchingNearby, setSearchingNearby] = React.useState(false)
  const [availableDestinations, setAvailableDestinations] = React.useState<string[]>()
  const [availableOrigins, setAvailableOrigins] = React.useState<string[]>()
  const [loadingDestinations, setLoadingDestinations] = React.useState(false)
  const [loadingOrigins, setLoadingOrigins] = React.useState(false)

  // Load airports on mount
  React.useEffect(() => {
    fetch('/api/airports')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAirports(data.data)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error loading airports:', error)
        setLoading(false)
      })
  }, [])

  // Fetch available destinations when origin changes
  React.useEffect(() => {
    if (!origin) {
      setAvailableDestinations(undefined)
      return
    }

    setLoadingDestinations(true)
    fetch(`/api/destinations?code=${origin}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAvailableDestinations(data.data)
          // Clear destination if it's not in the available list
          if (destination && !data.data.includes(destination)) {
            setDestination('')
          }
        }
        setLoadingDestinations(false)
      })
      .catch((error) => {
        console.error('Error loading destinations:', error)
        setLoadingDestinations(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin])

  // Fetch available origins when destination changes
  React.useEffect(() => {
    if (!destination) {
      setAvailableOrigins(undefined)
      return
    }

    setLoadingOrigins(true)
    fetch(`/api/destinations?code=${destination}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAvailableOrigins(data.data)
          // Clear origin if it's not in the available list
          if (origin && !data.data.includes(origin)) {
            setOrigin('')
          }
        }
        setLoadingOrigins(false)
      })
      .catch((error) => {
        console.error('Error loading origins:', error)
        setLoadingOrigins(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination])

  // Find nearby airports using geolocation
  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setSearchingNearby(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        fetch(`/api/nearby-airports?lat=${latitude}&lng=${longitude}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.data.length > 0) {
              // Set the closest airport as origin
              setOrigin(data.data[0].code)
              toast.success(`Found ${data.data[0].name} (${data.data[0].code}) nearby`)
            }
            setSearchingNearby(false)
          })
          .catch((error) => {
            console.error('Error finding nearby airports:', error)
            toast.error('Failed to find nearby airports')
            setSearchingNearby(false)
          })
      },
      (error) => {
        console.error('Geolocation error:', error)
        toast.error('Unable to get your location')
        setSearchingNearby(false)
      }
    )
  }

  const handleSearch = () => {
    if (!origin || !destination || !dateOut) {
      toast.error('Please fill in all required fields')
      return
    }

    if (tripType === 'return' && !dateIn) {
      toast.error('Please select a return date')
      return
    }

    const bookingUrl = generateRyanairBookingUrl({
      origin,
      destination,
      dateOut,
      dateIn: tripType === 'return' ? dateIn : undefined,
      adults: passengers.adults,
      teens: passengers.teens,
      children: passengers.children,
      infants: passengers.infants,
    })

    // Open Ryanair booking page in new tab
    window.open(bookingUrl, '_blank')
  }

  return (
    <main className="container mx-auto min-h-screen p-4 max-w-2xl">
      <div className="py-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Plane className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Ryanair Flight Search</h1>
        </div>
        <p className="text-center text-muted-foreground">
          Search for flights and book on Ryanair
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Search Flights</CardTitle>
          <CardDescription>
            Find the best flights and book directly on Ryanair's website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trip Type Toggle */}
          <div className="space-y-2">
            <Label>Trip Type</Label>
            <ToggleGroup
              type="single"
              value={tripType}
              onValueChange={(value) => {
                if (value) setTripType(value as 'one-way' | 'return')
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="return" aria-label="Return flight" className="touch-target">
                Return
              </ToggleGroupItem>
              <ToggleGroupItem value="one-way" aria-label="One way flight" className="touch-target">
                One Way
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Passengers */}
          <div className="space-y-2">
            <Label>Passengers</Label>
            <PassengerSelect
              value={passengers}
              onChange={setPassengers}
              disabled={loading}
            />
          </div>

          {/* Origin Airport */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="origin">From</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleFindNearby}
                disabled={searchingNearby || loading}
                className="h-auto py-1 px-2"
              >
                <MapPin className="h-3 w-3 mr-1" />
                <span className="text-xs">
                  {searchingNearby ? 'Searching...' : 'Use my location'}
                </span>
              </Button>
            </div>
            <AirportSelect
              value={origin}
              onValueChange={setOrigin}
              airports={airports}
              placeholder="Select departure airport"
              disabled={loading || loadingOrigins}
              filterByCodes={availableOrigins}
            />
          </div>

          {/* Destination Airport */}
          <div className="space-y-2">
            <Label htmlFor="destination">To</Label>
            <AirportSelect
              value={destination}
              onValueChange={setDestination}
              airports={airports}
              placeholder="Select destination airport"
              disabled={loading || loadingDestinations}
              filterByCodes={availableDestinations}
            />
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <Label>Departure Date</Label>
            <DateRangePicker
              date={dateOut}
              onDateChange={setDateOut}
              placeholder="Select departure date"
              minDate={new Date()}
            />
          </div>

          {/* Return Date (only for return trips) */}
          {tripType === 'return' && (
            <div className="space-y-2">
              <Label>Return Date</Label>
              <DateRangePicker
                date={dateIn}
                onDateChange={setDateIn}
                placeholder="Select return date"
                minDate={dateOut ? addDays(dateOut, 1) : addDays(new Date(), 1)}
                disabled={!dateOut}
              />
            </div>
          )}

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!origin || !destination || !dateOut || (tripType === 'return' && !dateIn)}
            className="w-full touch-target"
            size="lg"
          >
            <Plane className="mr-2 h-5 w-5" />
            Search on Ryanair
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You will be redirected to Ryanair's website to complete your booking
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Unofficial Ryanair flight search tool</p>
        <p className="mt-1">Not affiliated with Ryanair</p>
      </div>
    </main>
  )
}
