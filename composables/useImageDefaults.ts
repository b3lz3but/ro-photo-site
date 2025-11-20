import { IMAGE_SIZES } from '~/constants'

/**
 * Image defaults composable
 * Provides consistent image configuration across the application
 */
export const useImageDefaults = () => {
  const getImageProps = (
    src: string,
    alt: string,
    preset: keyof typeof IMAGE_SIZES = 'GALLERY'
  ) => {
    const size = IMAGE_SIZES[preset]

    return {
      src,
      alt,
      width: size.width,
      height: size.height,
      loading: 'lazy' as const,
      placeholder: true,
      format: 'webp' as const,
    }
  }

  const getSizes = (preset: 'thumbnail' | 'gallery' | 'hero' | 'full' = 'gallery') => {
    const sizeMap = {
      thumbnail: 'sm:70px md:75px',
      gallery: 'sm:90vw md:50vw lg:30vw',
      hero: 'sm:100vw md:90vw lg:1200px',
      full: '100vw',
    }

    return sizeMap[preset]
  }

  return { getImageProps, getSizes, IMAGE_SIZES }
}
