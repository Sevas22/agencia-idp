'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import type { PriceGroup } from '@/lib/content'
import { site } from '@/lib/site'
import { useT } from './lang-context'

const formatPrice = (price: string) => {
  const match = price.match(/^(\$[\d.,]+)(.*)$/)
  if (!match) return { amount: price, unit: '' }
  const unit = match[2].replace(/^\//, '').toLowerCase()
  return { amount: match[1], unit: unit === 'usd' ? 'USD' : `USD / ${unit}` }
}

export function PriceTabs({ group }: { group: PriceGroup }) {
  const [active, setActive] = useState(0)
  const tab = group.tabs[active]
  const t = useT()

  return (
    <>
      {group.tabs.length > 1 && (
        <div className="nx-tabs" role="tablist" aria-label={group.title}>
          {group.tabs.map((item, index) => (
            <button key={item.name} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)}>
              {item.name}
            </button>
          ))}
        </div>
      )}
      <div className="nx-plans">
        {tab.plans.map((plan, index) => {
          const { amount, unit } = formatPrice(plan.price)
          return (
            <article key={plan.name} className={index === 1 ? 'is-orange' : index === 2 ? 'is-black' : ''}>
              <h3>{plan.name}</h3>
              <p>{plan.desc}</p>
              <p className="nx-plan-price">
                {amount} <span>{unit}</span>
              </p>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>
                    <Check size={15} aria-hidden /> {item}
                  </li>
                ))}
              </ul>
              <a className="nx-btn" href={site.planLink} target="_blank" rel="noopener noreferrer">
                {t('Escoger plan', 'Choose plan')} <ArrowRight size={16} strokeWidth={2.2} className="nx-arrow" aria-hidden />
              </a>
            </article>
          )
        })}
      </div>
    </>
  )
}
