import { getDistanceInKm } from "@/utils/distance"

type Delivery_Partner = {
  id: string
  latitude: number | null
  longitude: number | null
}

export function findNearestPartner(
  orderLat: number,
  orderLng: number,
  partners: Delivery_Partner[]
) {
  let nearest: { id: string; distance: number } | null = null

  for (const p of partners) {
    if (p.latitude == null || p.longitude == null) continue

    const dist = getDistanceInKm(
      orderLat,
      orderLng,
      p.latitude,
      p.longitude
    )

    if (!nearest || dist < nearest.distance) {
      nearest = { id: p.id, distance: dist }
    }
  }

  return nearest
}
