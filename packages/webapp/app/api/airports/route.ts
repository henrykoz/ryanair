import { NextResponse } from 'next/server'
import { airports } from '@2bad/ryanair'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const allAirports = await airports.getActive()

    // Group airports by country
    const airportsByCountry = allAirports.reduce(
      (acc, airport) => {
        const countryName = airport.country.name
        if (!acc[countryName]) {
          acc[countryName] = []
        }
        acc[countryName].push({
          code: airport.code,
          name: airport.name,
          city: airport.city.name,
          country: countryName,
          countryCode: airport.country.code,
          coordinates: airport.coordinates,
        })
        return acc
      },
      {} as Record<string, Array<{
        code: string
        name: string
        city: string
        country: string
        countryCode: string
        coordinates: { latitude: number; longitude: number }
      }>>
    )

    return NextResponse.json({
      success: true,
      data: airportsByCountry,
    })
  } catch (error) {
    console.error('Error fetching airports:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch airports',
      },
      { status: 500 }
    )
  }
}
