import React, { useRef, useState } from 'react';
import axios from 'axios';
import * as N from '../Notice/NoticeStyle';
import * as C from '../Product/ProductCreateStyle';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import * as D from '../NoticeDetail/NoticeDetailStyle';
import { Editor } from '@toast-ui/react-editor'; 
import '@toast-ui/editor/dist/toastui-editor.css'; 
import color from '@toast-ui/editor-plugin-color-syntax';
import { API_BASE_URL } from '../../../constants/api';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

export const FormWrapper = styled.div`
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
`;

const SectionTitleWrapper = styled.div`
  background-color: #f2f2f2;
  padding: 1%;
  @media(max-width: 780px){
    padding: 2%;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: bold;
  @media(max-width: 780px){
    font-size: 1.5rem;
  }
`;

const Label = styled.label`
  font-size: 1.3rem;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const FileList = styled.ul`
  margin-top: 10px;
  padding-left: 20px;
  list-style-type: disc;
`;

const NoticeCreate = () => {
  const editorRef = useRef();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [noticeFiles, setNoticeFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]); 
  const [error, setError] = useState('');

  const handleAddFile = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const fileNamesArray = selectedFiles.map(file => file.name);
  
    setFileNames(prev => [...prev, ...fileNamesArray]);
  
    try {
      const uploadedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
  
          const presignedUrlResponse = await axios.post(
            `${API_BASE_URL}/api/file?prefix=notice&fileName=${encodeURIComponent(file.name)}`, 
            {
              metadata: {
                description: '파일 설명',
                tags: ['notice', 'attachment'],
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
  
          const fileUrl = presignedUrl.split('?')[0];
  
          return {
            fileName: file.name,
            fileUrl: fileUrl,
          };
        })
      );
      setNoticeFiles((prev) => [...prev, ...uploadedFiles]);
    } catch {
      alert('파일 업로드 중 오류가 발생했습니다');
    }
  };
  
  const handleDeleteFile = (indexToDelete) => {
    setNoticeFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToDelete));
    setFileNames(prevNames => prevNames.filter((_, index) => index !== indexToDelete));
  };
  const addImageBlobHook = async (blob, callback) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/file?prefix=notice`, {
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
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editorRef.current.getInstance().getHTML();

    const noticeData = {
      title,
      context: content, 
      noticeFiles,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/notices`, noticeData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        navigate('/admin/notice');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('관리자 계정으로 로그인하십시오.');
      } else {
        setError('공지사항을 게시하는 동안 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
      <N.MainWrapper>
        <C.SectionTitle>공지사항</C.SectionTitle>
        <FormWrapper>
          <SectionTitleWrapper>
            <SectionTitle>게시글 작성</SectionTitle>
          </SectionTitleWrapper>
          <div style={{ padding: '2%' }}>
            <Label htmlFor="title">제목 *</Label>
            <Input
              type="text"
              id="title"
              placeholder="제목을 입력해 주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Label htmlFor="attachment">첨부</Label>
            <FileInput
              type="file"
              multiple
              onChange={handleAddFile}
            />

            {fileNames.length > 0 && (
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '20px', alignItems: 'center'}}>
                {fileNames.map((fileName, index) => (
                  <li key={index}>
                    {fileName}
                    <button style={{color: '#ff0000', fontSize: '1.2rem', marginLeft: '2px'}} onClick={() => handleDeleteFile(index)}>X</button>
                  </li>
                ))}
              </div>
            )}

            <Label style={{marginTop: '20px'}} htmlFor="content">내용 *</Label>
            <div>
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
              />
            </div>
          </div>
        </FormWrapper>
      </N.MainWrapper>
      <D.BtWrap>
        <D.BtLink as={Link} to="/admin/adminnotice">취소</D.BtLink>
        <D.BtLink as={Link} onClick={handleSubmit}>등록</D.BtLink>
      </D.BtWrap>
    </>
  );
};

export default NoticeCreate;
