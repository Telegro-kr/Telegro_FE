import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import SearchBar from '@components/common/search-bar';
import ProductSectionContainer from '@components/product-section/product-section-container';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicProducts = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleRefresh = () => {
    setKeyword('');
    setSearchKeyword('');
  };

  return (
    <div
      ref={pageRef}
      className="flex-col gap-[5rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]"
    >
      <div className="flex-col gap-[3.5rem]">
        <h1 className="title3 text-gray-900">상품 목록</h1>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          placeholder="찾으시는 상품의 이름을 입력해 주세요."
          buttonText="검색하기"
          size="lg"
        />
      </div>
      <ProductSectionContainer
        variant="list"
        searchKeyword={searchKeyword}
        onClickProduct={(product) => {
          navigate(`/products/${product.id}`);
        }}
      />
      <ExploreScrollToTop targetRef={pageRef} />
    </div>
  );
};

export default PublicProducts;
