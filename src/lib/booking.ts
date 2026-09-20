export function resolveBookingConfig(medproSettings: any, siteSettings: any = {}) {
  const useFacilityBooking = medproSettings?.useFacilityBooking === true
  const medproUrl = medproSettings?.url || siteSettings?.medproUrl || process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'
  const facilityUrl = medproSettings?.facilityUrl || '/dat-lich-kham'
  return {
    enabled: medproSettings?.enabled !== false,
    useFacilityBooking,
    url: useFacilityBooking ? facilityUrl : medproUrl,
    label: medproSettings?.label || 'Đặt lịch khám',
    openNewTab: useFacilityBooking ? false : medproSettings?.openNewTab !== false,
  }
}
