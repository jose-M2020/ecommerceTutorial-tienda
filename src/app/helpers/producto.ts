export const isAvailable = (visibility: string, currency: string) => (
  (visibility === 'Todo el mundo') ||
  (currency === 'MXN' && visibility === 'Mexico') ||
  (currency !== 'MXN' && visibility === 'Exterior')
)

export const calcAverageRating = (reviews: Array<any>) => {
  if(!reviews.length) return 5;
  
  const totalStars = reviews.reduce((acc, { estrellas }) => (
    acc + estrellas
  ), 0);

  return Math.round(totalStars / reviews.length);
}