import SearchBar from '@components/common/search-bar';
import ProductSectionContainer from '@components/product-section/product-section-container';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicProducts = () => {
  const navigate = useNavigate();
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
    <div className="flex-col gap-[5rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5erm] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]">
      <div className="flex-col gap-[3.5rem]">
        <h1 className="title3">상품 목록</h1>
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
    </div>
  );
};

export default PublicProducts;
