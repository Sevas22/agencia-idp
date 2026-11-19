import { PhasePage, phaseMetadata } from '@/components/phase-page'

export const metadata = phaseMetadata('ideate', 'es')

export default function Page() {
  return <PhasePage phase="ideate" />
}
