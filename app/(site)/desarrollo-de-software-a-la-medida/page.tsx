import { PhasePage, phaseMetadata } from '@/components/phase-page'

export const metadata = phaseMetadata('develop', 'es')

export default function Page() {
  return <PhasePage phase="develop" />
}
