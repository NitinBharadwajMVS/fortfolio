import { Sky } from '@react-three/drei'
import { SKY_RAYLEIGH, SKY_TURBIDITY, SUN_AZIMUTH, SUN_INCLINATION } from '../data/theme'

export function SkyEnvironment() {
  return (
    <Sky
      distance={450000}
      turbidity={SKY_TURBIDITY}
      rayleigh={SKY_RAYLEIGH}
      mieCoefficient={0.003}
      mieDirectionalG={0.55}
      inclination={SUN_INCLINATION}
      azimuth={SUN_AZIMUTH}
    />
  )
}
