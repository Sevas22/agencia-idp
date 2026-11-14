import { DarkHero } from '@/components/nx'
import { PriceTabs } from '@/components/price-tabs'
import { getPrices } from '@/lib/content'
import { t } from '@/lib/lang'


export function PricingPage() {
  return (
    <div className="nx-page">
      <DarkHero label="Agencia IDP" title={t('Planes & Precios', 'Plans & Pricing')} />
      {getPrices().map((group, index) => (
        <section key={group.title} className={`nx-section ${index % 2 ? 'nx-grey' : ''}`} data-theme="light">
          <div className="nx-wrap">
            <h2 className="nx-h2">{group.title}</h2>
            <PriceTabs group={group} />
          </div>
        </section>
      ))}
    </div>
  )
}
