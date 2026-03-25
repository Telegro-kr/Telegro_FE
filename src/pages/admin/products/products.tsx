import SearchBar from '@components/common/search-bar';
import ProductSectionContainer from '@components/product-section/product-section-container';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminProducts = () => {
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
    <div className="bg-white px-8 py-10">
      <div className="mb-[5rem]">
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
          navigate(`/admin/products/${product.id}`);
        }}
      />
    </div>
  );
};

export default AdminProducts;
