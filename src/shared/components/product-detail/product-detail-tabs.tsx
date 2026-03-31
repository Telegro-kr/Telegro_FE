import { cn } from '@libs/cn';
import { type ProductTab } from '@hooks/use-product-detail';

type ProductDetailTabsProps = {
  activeTab: ProductTab;
  onChange: (tab: ProductTab) => void;
};

const tabs: Array<{ key: ProductTab; label: string; suffix?: string }> = [
  { key: 'detail', label: '상세정보' },
  { key: 'return', label: '반품/교환' },
];

const ProductDetailTabs = ({ activeTab, onChange }: ProductDetailTabsProps) => {
  return (
    <section className="mt-10 border-b border-[#E3E7EB]">
      <div className="grid grid-cols-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex-row-center h-[5.2rem] cursor-pointer gap-1 border-b-[3px] text-[1.35rem] font-medium transition-colors',
              activeTab === tab.key
                ? 'border-[#1F3138] bg-[#1F3138] text-white'
                : 'border-transparent text-[#263238] hover:bg-[#FAFBFB]',
            )}
          >
            <span>{tab.label}</span>
            {tab.suffix ? (
              <span className="text-gray-500">{tab.suffix}</span>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProductDetailTabs;
