import { format } from 'date-fns'

export interface BookingParams {
  origin: string
  destination: string
  dateOut: Date
  dateIn?: Date
  adults?: number
  teens?: number
  children?: number
  infants?: number
}

/**
 * Generates a Ryanair booking URL with the specified search parameters
 */
export function generateRyanairBookingUrl(params: BookingParams): string {
  const {
    origin,
    destination,
    dateOut,
    dateIn,
    adults = 1,
    teens = 0,
    children = 0,
    infants = 0,
  } = params

  const urlParams = new URLSearchParams({
    adults: adults.toString(),
    teens: teens.toString(),
    children: children.toString(),
    infants: infants.toString(),
    dateOut: format(dateOut, 'yyyy-MM-dd'),
    dateIn: dateIn ? format(dateIn, 'yyyy-MM-dd') : '',
    isConnectedFlight: 'false',
    discount: '0',
    isReturn: dateIn ? 'true' : 'false',
    promoCode: '',
    originIata: origin,
    destinationIata: destination,
  })

  return `https://www.ryanair.com/gb/en/trip/flights/select?${urlParams.toString()}`
}
