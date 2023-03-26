export const isAvailable = (visibility: string, currency: string) => (
  (visibility === 'Todo el mundo') ||
  (currency === 'MXN' && visibility === 'Mexico') ||
  (currency !== 'MXN' && visibility === 'Exterior')
)