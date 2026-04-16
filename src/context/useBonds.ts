import { useContext } from 'react'
import BondsContext, { type IBondsContext } from './bondsContextDef'

const useBonds = (): IBondsContext => {
  const ctx = useContext(BondsContext)
  if (!ctx) throw new Error('useBonds must be used within BondsProvider')
  return ctx
}

export default useBonds
