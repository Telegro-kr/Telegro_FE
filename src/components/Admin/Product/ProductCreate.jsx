import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as D from '../NoticeDetail/NoticeDetailStyle';
import { Editor } from '@toast-ui/react-editor'; 
import '@toast-ui/editor/dist/toastui-editor.css'; 
import axios from 'axios';
import * as C from './ProductCreateStyle';
import color from '@toast-ui/editor-plugin-color-syntax';
import { API_BASE_URL } from '../../../constants/api';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [coverImage, setCoverImage] = useState(null); 
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
    previewImage: '' 
  });
  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
    }
  }, []);
  const handleChange = e => {
    const { name, value, files } = e.target;
  
    if (name === 'options') {
      const optionsArray = value.split(',').map(item => item.trim());
      setProduct(prev => ({
        ...prev,
        options: optionsArray
      }));
    } else if (name === 'photo' && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({
          ...prev,
          previewImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else if (name === 'category') {
      setProduct(prev => ({
        ...prev,
        category: value 
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.image-preview') === null) {
        setSelectedImageIndex(null);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const handleEditorChange = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.getInstance().getHTML();
      setProduct(prev => ({ ...prev, content: htmlContent }));
    } else {
      console.error('Editor not initialized');
    }
  };
  const MAX_IMAGES = 4;

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
    } catch {
      alert('이미지 업로드 중 오류가 발생했습니다');
    }
  };
  
  const handleCoverImageSelect = (image) => {
    setProduct((prev) => ({
      ...prev,
      coverImage: image,
    }));
  };
  
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
  
  const handleRemoveImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index),
    }));
    setSelectedImageIndex(null); 
  };
  
  const handleCreateProduct = async () => {
    const formData = {
      productModel: product.productModel,  
      productName: product.productName,  
      options: product.options,           
      category: product.category,         
      content: product.content,          
      priceBussiness: product.priceBussiness,
      priceBest: product.priceBest,    
      priceDealer: product.priceDealer,   
      priceCustomer: product.priceCustomer,
      pictures: product.pictures ,
      coverImage: product.coverImage,    
    };
  
    try {
      const accessToken = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/products`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
  
      if (response.status === 200) {
        alert('Product registered successfully.');
        navigate('/admin/headset');  
      }
    } catch (error) {
      console.error('Error while registering product:', error);
      alert('Failed to register product');
    }
  };
  
  return (
    <>
    <C.MainWrapper>
      <C.SectionTitle>상품 등록</C.SectionTitle>
      <C.FormWrapper>
      <C.SectionTitleWrapper>
        <C.SectionTitle2>상품 등록</C.SectionTitle2>
        </C.SectionTitleWrapper>
        <div style={{padding: '2%'}}>
        <C.NameRowContainer>
            <div>
              <C.Label htmlFor="productModel">모델명 *</C.Label>
              <C.Input
                type="text"
                name="productModel"
                id="modelName"
                value={product.productModel}
                onChange={handleChange}
              />
            </div>
            <div>
              <C.Label htmlFor="productName">상품명 *</C.Label>
              <C.Input
                type="text"
                name="productName"
                id="productName"
                placeholder="상품명"
                value={product.productName}
                onChange={handleChange}
              />
            </div>
          </C.NameRowContainer>
          <C.RowContainer>
            <div>
              <C.Label htmlFor="category">상품 카테고리 *</C.Label>
              <C.Select
                name="category"
                id="category"
                value={product.category}
                onChange={handleChange}
              >
                  <option value="">카테고리를 선택하세요</option>
                  <option value="LINE_CORD">라인코드</option>
                  <option value="HEADSET">헤드셋</option>
                  <option value="ACCESSORY">악세서리</option>
                  <option value="RECORDER">녹음기</option>
              </C.Select>
            </div>
            <div>
              <C.Label htmlFor="options">옵션 *</C.Label>
              <C.Input
                type="text"
                name="options"
                id="options"
                placeholder="옵션을 콤마(,)로 구분하여 입력하세요"
                value={product.options.join(', ')}
                onChange={handleChange}
              />
            </div>
          </C.RowContainer>

            <C.RightColumn>
              <div>
                <C.Label htmlFor="priceBussiness">Business *</C.Label>
                <C.Input
                  type="number"
                  name="priceBussiness"
                  id="priceBussiness"
                  placeholder="숫자만 입력해 주세요."
                  value={product.priceBussiness}
                  onChange={handleChange}
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
                />
              </div>
            </C.RightColumn>
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
                        onClick={() => handleImageClick(index)} // 클릭 시 이미지를 선택 상태로 만듦
                      />

                      {/* 기존 별/체크 표시 버튼 */}
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
                          setProduct((prev) => ({
                            ...prev,
                            coverImage: image,
                          }));
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
            <div>
              <div style={{marginBottom: '10px'}}><C.Label  htmlFor="content">상품 설명 *</C.Label></div>
              <Editor
                ref={editorRef}
                initialValue=" "
                previewStyle="vertical"
                height="500px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
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
            </div>
            </C.FormWrapper>
            </C.MainWrapper>
            <D.BtWrap>
              <D.BtLink as={Link} to="/admin/headset">
                  취소
              </D.BtLink>
            <D.BtLink as={Link} onClick={handleCreateProduct}>
              등록
            </D.BtLink>
          </D.BtWrap>
        </>
  );
};

export default ProductCreate;