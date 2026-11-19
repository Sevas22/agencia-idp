import { PhasePage, phaseMetadata } from '@/components/phase-page'

export const metadata = phaseMetadata('validate', 'es')

export default function Page() {
  return <PhasePage phase="validate" />
}
