import {
  Archivo_Black,
  Gloria_Hallelujah,
  Outfit,
  Sora,
  Space_Mono,
} from 'next/font/google'
import localFont from 'next/font/local'

const wagerQuyaSans = localFont({
  src: '../../public/fonts/Wager Quya.ttf',
  display: 'swap',
  variable: '--next-font-sans',
  weight: '400',
  style: 'normal',
})

const mysticDream = localFont({
  src: '../../public/fonts/Agilera.woff',
  display: 'swap',
  variable: '--font-mystic-dream',
  weight: '400',
  style: 'normal',
})

const vank = localFont({
  src: '../../public/fonts/GC Vank.woff2',
  display: 'swap',
  variable: '--font-vank',
  weight: '400',
  style: 'normal',
  preload: false,
})

const dripdropAltSolid = localFont({
  src: '../../public/fonts/Dripdrop Alt Solid.ttf',
  display: 'swap',
  variable: '--font-dripdrop-alt-solid',
  weight: '400',
  style: 'normal',
  preload: false,
})

const gloriaHallelujah = Gloria_Hallelujah({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-gloria-hallelujah',
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-landing-outfit',
})

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-landing-sora',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-landing-space-mono',
})

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-landing-archivo-black',
})

const fonts = [
  wagerQuyaSans,
  mysticDream,
  vank,
  dripdropAltSolid,
  gloriaHallelujah,
  outfit,
  sora,
  spaceMono,
  archivoBlack,
]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable }
