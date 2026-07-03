import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.72} luminanceSmoothing={0.4} intensity={0.22} />
      <Vignette eskil offset={0.2} darkness={0.38} />
    </EffectComposer>
  )
}
