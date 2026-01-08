"use client"

import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api"

type Props = {
  orderLat: number
  orderLng: number
  partnerLat?: number | null
  partnerLng?: number | null
}

const containerStyle = {
  width: "100%",
  height: "400px",
}

export default function OrderMap({
  orderLat,
  orderLng,
  partnerLat,
  partnerLng,
}: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  if (!isLoaded) return <p>Loading map…</p>

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: orderLat, lng: orderLng }}
      zoom={14}
    >
      {/* Order Location */}
      <Marker
        position={{ lat: orderLat, lng: orderLng }}
        label="Order"
      />

      {/* Delivery Partner Location */}
      {partnerLat && partnerLng && (
        <Marker
          position={{ lat: partnerLat, lng: partnerLng }}
          label="Rider"
        />
      )}
    </GoogleMap>
  )
}
