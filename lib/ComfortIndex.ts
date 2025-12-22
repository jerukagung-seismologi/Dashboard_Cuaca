/**
 * Utility functions for calculating weather comfort indices
 */

/**
 * Calculate THI (Temperature-Humidity Index - Thom's Discomfort Index)
 * THI expresses how hot the weather feels to the average person by combining
 * the effect of heat and humidity, using Thom's formula.
 *
 * Formula (Celsius): THI = T - (0.55 - 0.0055 * RH) * (T - 14.5)
 *
 * @param temperature Temperature in Celsius
 * @param humidity Relative humidity (%)
 * @returns THI value
 */
export function calculateTHI(temperature: number, humidity: number): number {
  const thi = temperature - (0.55 - 0.0055 * humidity) * (temperature - 14.5)
  return Math.round(thi * 10) / 10 // Round to 1 decimal place
}

/**
 * Get THI comfort level description
 *
 * @param thi THI value
 * @returns Object with comfort level description and color
 */
export function getTHIComfort(thi: number): { level: string; description: string; color: string } {
  if (thi < 21) {
    return {
      level: "Comfortable",
      description: "Little to no discomfort",
      color: "text-green-500",
    }
  } else if (thi >= 21 && thi < 24) {
    return {
      level: "Noticeable Discomfort",
      description: "Some discomfort, especially during physical activity",
      color: "text-yellow-500",
    }
  } else if (thi >= 24 && thi < 27) {
    return {
      level: "Evident Discomfort",
      description: "Evident discomfort; limit intense physical activity",
      color: "text-orange-500",
    }
  } else if (thi >= 27 && thi < 29) {
    return {
      level: "Intense Discomfort",
      description: "Intense discomfort; avoid exertion",
      color: "text-red-500",
    }
  } else if (thi >= 29 && thi < 32) {
    return {
      level: "Dangerous",
      description: "Dangerous levels of discomfort; avoid outdoor activities",
      color: "text-red-600",
    }
  } else {
    return {
      level: "Heat Stroke Risk",
      description: "Heat stroke imminent; seek cool environment immediately",
      color: "text-purple-600",
    }
  }
}
