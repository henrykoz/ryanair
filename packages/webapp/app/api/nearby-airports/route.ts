import { NextResponse } from 'next/server'
import { airports } from '@2bad/ryanair'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (!lat || !lng) {
      return NextResponse.json(
        {
          success: false,
          error: 'Latitude and longitude are required',
        },
        { status: 400 }
      )
    }

    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid coordinates',
        },
        { status: 400 }
      )
    }

    // Get all airports and calculate distances
    const allAirports = await airports.getActive()

    // Calculate distance using simple Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371 // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    }

    const airportsWithDistance = allAirports
      .map(airport => ({
        code: airport.code,
        name: airport.name,
        city: airport.city.name,
        country: airport.country.name,
        countryCode: airport.country.code,
        coordinates: airport.coordinates,
        distance: calculateDistance(
          latitude,
          longitude,
          airport.coordinates.latitude,
          airport.coordinates.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10) // Return top 10 closest airports

    return NextResponse.json({
      success: true,
      data: airportsWithDistance,
    })
  } catch (error) {
    console.error('Error fetching nearby airports:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch nearby airports',
      },
      { status: 500 }
    )
  }
}
