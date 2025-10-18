import { NextResponse } from 'next/server'
import { fares } from '@2bad/ryanair'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const SearchSchema = z.object({
  origin: z.string().length(3),
  destination: z.string().length(3),
  dateOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  adults: z.number().int().min(1).max(25).default(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const params = SearchSchema.parse(body)

    // Search for cheapest fares
    const fareData = await fares.getCheapestPerDay(
      params.origin,
      params.destination,
      params.dateOut
    )

    return NextResponse.json({
      success: true,
      data: fareData,
    })
  } catch (error) {
    console.error('Error searching flights:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid search parameters',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search flights',
      },
      { status: 500 }
    )
  }
}
