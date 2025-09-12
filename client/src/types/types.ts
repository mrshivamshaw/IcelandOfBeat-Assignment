export type Pricing = {
  breakdown: any[]
  vehicleTotal: number
  activitiesTotal: number
  subtotal: number
  taxes: number
  total: number
  accommodationTotal: number
}

interface BaseEntity {
  _id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: string[];
}

export interface Accommodation extends BaseEntity {
  name: string;
  type: "economy" | "comfort" | "superior";
  description: string;
  maxOccupancy: number;
}

export interface Vehicle extends BaseEntity {
  name: string;
  carModel: string;
  type: "suv" | "sedan" | "minivan" | "luxury";
  noPassengers: number;
  noDoors: number;
  noSuitcases: number;
  transmission: "manual" | "automatic";
  features: string[];
}

export interface Activity extends BaseEntity {
  name: string;
  description: string;
  category: "adventure" | "relaxation" | "cultural" | "sightseeing" | "nature";
  duration: number;
  perPersonPrice: number;
  location: string;
  includes: string[];
  excludes: string[];
  details: string[];
}

export interface Trip {
  _id: string;
  name: string;
  description: string;
  dayDuration: number;
  nightDuration: number;
  duration: number;
  price: number;
  imgUrl: string[];
  isActive: boolean;

  accommodations: Accommodation[];
  vehicles: Vehicle[];
  activities: Activity[];
}


export interface BookingData {
  tripId: string
  startDate: string
  travelers: {
    adults: number
    children: number
    infants: number
  }
  selectedAccommodation: string
  selectedVehicle: string
  selectedActivities: string[]
  extraNights: { before: number; after: number }
  travelerDetails: [
    {
        firstName: string
        lastName: string
        dateOfBirth: Date
        countryOfResidence: string
        type: "adult" | "child" | "infant"
        title?: string
        passportNumber?: string
    }  
  ]
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      country: string
      zipCode: string
    }
  }
  additionalServices: string[]
  totalPrice: number
  pricingBreakdown?: any
  
}