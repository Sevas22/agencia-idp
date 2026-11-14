import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Project } from '@/components/project-rail'
import { getPage, type Img } from './content'
import { t } from './lang'

const load = <T,>(file: string): T => JSON.parse(readFileSync(path.join(process.cwd(), 'content', file), 'utf8')) as T

// Nombres de los logos de «Compañías con las que hemos trabajado» (Sobre nosotros), en el mismo orden.
const aboutNames = ['Amazon Web Services', 'Corpaul', 'ePayco', 'Estratek', 'Cámara de Comercio de Bogotá', 'Starter', 'Grupo Éxito', 'Grupo Nutresa', 'Cliente de Agencia IDP', 'Capihost', 'ISA Intercolombia', 'Presente', 'The Leads Guy', 'Intuix', 'Factum', 'Tributo', 'Humano Seguros', 'Startco', 'Sociedad Colombiana de Orquideología', 'NET Comunicaciones', 'Hospital Sagrado Corazón de Jesús']
// Ya están en la lista de la portada con su propio archivo.
const repeated = new Set(['Corpaul', 'Grupo Nutresa', 'Humano Seguros', 'Startco'])

/** Todos los logos de clientes para el carrusel «Confían en nosotros», con su nombre como texto alternativo. */
export function getClients(): Img[] {
  const media = load<Record<string, Img>>('home-media.json')
  const home: Img[] = [
    { ...media.pintuco, alt: 'Pintuco' },
    { ...media.corpaul, alt: 'Corpaul' },
    { ...media.comfama, alt: 'Comfama' },
    { ...media.humano, alt: 'Humano Seguros' },
    { ...media.starco, alt: 'Startco' },
    { ...media.logoCliente, alt: 'Grupo Nutresa' },
  ]
  const about = getPage('transforma-agencia-software-colombia').sections[1].blocks.flatMap((b) => (b.t === 'image' ? [b as Img] : []))
  const rest = about.map((image, i) => ({ ...image, alt: aboutNames[i] ?? 'Cliente de Agencia IDP' })).filter((image) => !repeated.has(image.alt))
  return [...home, ...rest]
}

/** Proyectos propios destacados, con capturas actuales de cada sitio (tomadas el 2026-11-13). */
export function getProjects(): Project[] {
  const shot = (name: string, alt: string) => ({ src: `/media/proyectos/${name}-2026.webp`, width: 1440, height: 800, alt })
  return [
    {
      name: 'Capihost',
      tag: '2019',
      text: t('Plataforma de servicios web de alojamiento y venta de dominios', 'Web hosting and domain registration platform'),
      chips: ['UI/UX Design', 'Brand Design', 'Web Design', 'Development'],
      href: 'https://capihost.com/',
      image: shot('capihost', t('Sitio de Capihost', 'Capihost website')),
    },
    {
      name: 'Pushleads',
      tag: '2021',
      text: t('CRM para la automatización de envío de emails y SMS, enfocado en pequeños negocios.', 'CRM that automates email and SMS campaigns for small businesses.'),
      chips: ['Graphic Design', 'Visual Design', 'Adobe Photoshop', 'Adobe Illustrator'],
      href: 'https://pushleads.co/',
      image: shot('pushleads', t('Sitio de Pushleads', 'Pushleads website')),
    },
    {
      name: 'SEDEFY',
      tag: 'EdTech',
      text: t(
        'Sistema de gestión académica que digitaliza la organización escolar: asistencia, calificaciones, registro de estudiantes y eventos.',
        'Academic management system that digitizes school operations: attendance, grades, student records and events.',
      ),
      chips: t('Aplicación web|Gestión académica|UX/UI|Development', 'Web app|Academic management|UX/UI|Development').split('|'),
      href: 'https://sedeapp.com/',
      image: shot('sedefy', t('Sitio de SEDEFY', 'SEDEFY website')),
    },
  ]
}
