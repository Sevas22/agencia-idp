'use client'

import { useState } from 'react'
import type { Img } from '@/lib/content'
import { ProjectRail } from './project-rail'
import { useT } from './lang-context'

export type CaseItem = { title: string; text: string; kicker: string; image: Img; href: string; category: string }

/**
 * Portafolio filtrable por categoría con la misma vitrina de la portada:
 * lista de proyectos a la izquierda y vista previa grande del sitio a la derecha.
 */
export function CaseGallery({ items, categories }: { items: CaseItem[]; categories: string[] }) {
  const t = useT()
  const all = t('Todos', 'All')
  const [filter, setFilter] = useState(all)
  const tabs = [all, ...categories]
  const visible = filter === all ? items : items.filter((item) => item.category === filter)
  const count = (tab: string) => (tab === all ? items.length : items.filter((item) => item.category === tab).length)

  return (
    <div className="nx-cases">
      <div className="nx-cases-tabs" role="tablist" aria-label={t('Filtrar casos por tipo', 'Filter case studies by type')}>
        {tabs.map((tab) => (
          <button key={tab} type="button" role="tab" aria-selected={filter === tab} className={filter === tab ? 'is-active' : undefined} onClick={() => setFilter(tab)}>
            {tab}
            <span>{String(count(tab)).padStart(2, '0')}</span>
          </button>
        ))}
      </div>

      <div className="nx-cases-showcase" key={filter}>
        <ProjectRail projects={visible.map((item) => ({ name: item.title, tag: item.kicker, text: item.text, chips: [item.category], href: item.href, image: item.image }))} />
      </div>
    </div>
  )
}
