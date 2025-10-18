import { NextResponse } from 'next/server'
import { airports } from '@2bad/ryanair'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const airportCode = searchParams.get('code')

    if (!airportCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Airport code is required',
        },
        { status: 400 }
      )
    }

    // Validate IATA code format (3 uppercase letters)
    if (!/^[A-Z]{3}$/.test(airportCode)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid IATA code format',
        },
        { status: 400 }
      )
    }

    const destinations = await airports.getDestinations(airportCode)

    // Extract just the airport codes for filtering
    const destinationCodes = destinations.map((dest) => dest.arrivalAirport.code)

    return NextResponse.json({
      success: true,
      data: destinationCodes,
    })
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch destinations',
      },
      { status: 500 }
    )
  }
}
