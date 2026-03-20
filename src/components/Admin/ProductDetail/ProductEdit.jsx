import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as D from '../NoticeDetail/NoticeDetailStyle';
import * as N from '../Notice/NoticeStyle';
import { Editor } from '@toast-ui/react-editor'; 
import '@toast-ui/editor/dist/toastui-editor.css'; 
import axios from 'axios';
import color from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import * as C from '../Product/ProductCreateStyle';
import { API_BASE_URL } from '../../../constants/api';

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const [product, setProduct] = useState({
    productModel: '',
    productName: '',
    options: [],
    category: '',
    content: '',
    priceBussiness: '',
    priceBest: '',
    priceDealer: '',
    priceCustomer: '',
    pictures: [],
    previewImage: '',
    coverImage: ''
  });
  const [originalProduct, setOriginalProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); 
  const MAX_IMAGES = 4;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
        if (response.status === 200) {
          setProduct(response.data.data);
          setOriginalProduct(response.data.data);
          setIsLoading(false);
        }
      } catch {
        alert('상품 정보를 가져오는 데 실패했습니다.');
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
  
    if (type === 'number' && !Number.isInteger(+value)) {
      e.target.value = Math.floor(+value);
    }
  
    if (name === 'options') {
      const optionsArray = value.split(',').map(item => item.trim());
      setProduct(prev => ({ ...prev, options: optionsArray }));
    } else if (name === 'photo' && files.length > 0) {
      handleAddImage(e);
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.getInstance().getHTML();
      setProduct((prev) => ({ ...prev, content: htmlContent }));
    }
  };

  const handleAddImage = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length + product.pictures.length > MAX_IMAGES) {
      alert(`최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const reader = new FileReader();
          const imageDataUrl = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });

          const presignedUrlResponse = await axios.post(
            `${API_BASE_URL}/api/file?prefix=product`,
            {
              metadata: {
                description: '이미지 설명',
                tags: ['태그1', '태그2'],
              },
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const presignedUrl = presignedUrlResponse.data.data.url;

          await axios.put(presignedUrl, file, {
            headers: {
              'Content-Type': file.type,
            },
          });

          const imageUrl = presignedUrl.split('?')[0]; 
          return imageUrl;
        })
      );

      setProduct((prev) => ({
        ...prev,
        pictures: [...prev.pictures, ...newImages],
        coverImage: prev.coverImage || newImages[0] 
      }));

      console.log('이미지 업로드에 성공했습니다.');
    } catch (error) {
      console.error('이미지 업로드 중 오류가 발생했습니다:', error);
      alert(`이미지 업로드 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handleCoverImageSelect = (image) => {
    setProduct((prev) => ({
      ...prev,
      coverImage: image,
    }));
  };

  const handleRemoveImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index),
    }));
    setSelectedImageIndex(null); 
  };
  
  const handleUpdateProduct = async () => {
    const updatedProduct = {};
  
    const updateIfChanged = (key, newValue, oldValue) => {
      const newNum = parseFloat(newValue);
      const oldNum = parseFloat(oldValue);
      if (newNum !== oldNum) {
        updatedProduct[key] = newNum;
      }
    };
  
    const updateStringIfChanged = (key, newValue, oldValue) => {
      if (newValue !== oldValue) {
        updatedProduct[key] = newValue;
      }
    };
  
    updateIfChanged('priceBussiness', product.priceBussiness, originalProduct.priceBussiness);
    updateIfChanged('priceBest', product.priceBest, originalProduct.priceBest);
    updateIfChanged('priceDealer', product.priceDealer, originalProduct.priceDealer);
    updateIfChanged('priceCustomer', product.priceCustomer, originalProduct.priceCustomer);
    updateStringIfChanged('productModel', product.productModel, originalProduct.productModel);
    updateStringIfChanged('productName', product.productName, originalProduct.productName);
    updateStringIfChanged('category', product.category, originalProduct.category);
     
      if (product.productName !== originalProduct.productName) {
        updatedProduct.productName = product.productName;
      }
      if (product.category !== originalProduct.category) {
        updatedProduct.category = product.category;
      }
      if (product.options.join(',') !== originalProduct.options.join(',')) {
        updatedProduct.options = product.options;
      }
      if (product.content !== originalProduct.content) {
        updatedProduct.content = product.content;
      }
      if (product.pictures !== originalProduct.pictures) {
        updatedProduct.pictures = product.pictures;
      }
      if (product.coverImage !== originalProduct.coverImage) {
        updatedProduct.coverImage = product.coverImage; 
      }
    
      if (Object.keys(updatedProduct).length === 0) {
        alert('수정된 내용이 없습니다.');
        return;
      }
    
      try {
        const response = await axios.patch(
          `${API_BASE_URL}/api/products/${productId}`,
          updatedProduct,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
    
        if (response.status === 200) {
          alert('상품이 성공적으로 수정되었습니다.');
          navigate(`/admin/headset`);
        }
      } catch (error) {
        console.error('Error while updating product:', error);
        alert('상품 수정에 실패했습니다.');
      }
    };
  

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const addImageBlobHook = async (blob, callback) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/file?prefix=product`, {
        metadata: {
          description: "새로운 이미지 설명",
          tags: ["태그1", "태그2"]
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
  
      const presignedUrl = response.data.data.url;
  
      await axios.put(presignedUrl, blob, {
        headers: {
          'Content-Type': blob.type,
        }
      });
  
      callback(presignedUrl.split('?')[0], 'Image');
    } catch {
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };
  return (
    <C.MainWrapper>
      <C.SectionTitle style={{margin: '1%', marginBottom: '4%', marginTop: '3%'}}>상품 수정</C.SectionTitle>
      <C.FormWrapper>
        <C.SectionTitleWrapper>
          <C.SectionTitle style={{fontSize: '1.8rem'}}>상품 수정</C.SectionTitle>
        </C.SectionTitleWrapper>
        <div style={{padding: '2%'}}>
          <C.NameRowContainer>
            <div>
              <C.Label htmlFor="productModel">모델명 *</C.Label>
              <C.Input
                type="text"
                name="productModel"
                value={product.productModel}
                onChange={handleChange}
              />
            </div>
            <div>
              <C.Label htmlFor="productName">상품명 *</C.Label>
              <C.Input
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleChange}
              />
            </div>
          </C.NameRowContainer>
        </div>
        <C.RowContainer style={{padding: '2%'}}>
          <div >
            <C.Label htmlFor="category">상품 카테고리 *</C.Label>
            <C.Input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
            />
          </div>
          <div>
            <C.Label htmlFor="options">옵션 *</C.Label>
            <C.Input
              type="text"
              name="options"
              value={product.options.join(', ')}
              onChange={handleChange}
            >
            </C.Input>
          </div>
        </C.RowContainer>
        <C.RightColumn>
          <div>
            <C.Label htmlFor="photo">사진 업로드 (최대 4개) *</C.Label>
            <C.FileInput
              type="file"
              name="photo"
              id="photo"
              multiple
              onChange={handleAddImage}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {product.pictures.map((image, index) => (
                <div key={index} className="image-preview" style={{ position: 'relative' }}>
                  <img
                    src={image}
                    alt={`preview-${index}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      border: product.coverImage === image ? '2px solid green' : 'none',
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                  />

                  <button
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: product.coverImage === image ? 'green' : 'white',
                      color: product.coverImage === image ? 'white' : 'black',
                      border: '1px solid black',
                      borderRadius: '50%',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCoverImageSelect(image);
                    }}
                  >
                    {product.coverImage === image ? '✔' : '☆'}
                  </button>

                  <button
                    style={{
                      position: 'absolute',
                      top: '5px',
                      left: '5px',
                      background: '#ddd',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      padding: '3px',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </C.RightColumn>
        <C.RightColumn style={{padding: '2%'}}>
          <div>
            <C.Label htmlFor="priceBussiness">Business *</C.Label>
            <C.Input
              type="number"
              name="priceBussiness"
              id="priceBussiness"
              placeholder="숫자만 입력해 주세요."
              value={product.priceBussiness}
              onChange={handleChange}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} 
            />
          </div>

          <div>
            <C.Label htmlFor="priceBest">Best *</C.Label>
            <C.Input
              type="number"
              name="priceBest"
              id="priceBest"
              placeholder="숫자만 입력해 주세요."
              value={product.priceBest}
              onChange={handleChange}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} 
            />
          </div>
          <div>
            <C.Label htmlFor="priceDealer">Dealer *</C.Label>
            <C.Input
              type="number"
              name="priceDealer"
              id="priceDealer"
              placeholder="숫자만 입력해 주세요."
              value={product.priceDealer}
              onChange={handleChange}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} 
            />
          </div>
          <div>
            <C.Label htmlFor="priceCustomer">Customer *</C.Label>
            <C.Input
              type="number"
              name="priceCustomer"
              id="priceCustomer"
              placeholder="숫자만 입력해 주세요."
              value={product.priceCustomer}
              onChange={handleChange}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} 
            />
          </div>
        </C.RightColumn>
        <div style={{padding: '2%'}}>
          <C.Label style={{marginBottom: '20px'}} htmlFor="content">상품 설명 *</C.Label>
          <Editor
            ref={editorRef}
            initialValue={product.content}
            previewStyle="vertical"
            height="500px"
            initialEditType="wysiwyg"
            useCommandShortcut
            hooks={{
              addImageBlobHook: addImageBlobHook
            }}
            toolbarItems={[
              ['heading', 'bold', 'italic', 'strike'],
              ['hr', 'quote'],
              ['ul', 'ol', 'task', 'indent', 'outdent'],
              ['table', 'link', 'image']
            ]}
            plugins={[color]}
            onChange={handleEditorChange}
          />
        </div>
      </C.FormWrapper>
      <N.Section style={{ margin: '0' }}>
        <D.BtWrap>
          <D.BtLink as={Link} to={`/admin/headset`}>
            취소
          </D.BtLink>
          <D.BtLink as={Link} onClick={handleUpdateProduct}>수정</D.BtLink>
        </D.BtWrap>
      </N.Section>
    </C.MainWrapper>
  );
};

export default ProductEdit;