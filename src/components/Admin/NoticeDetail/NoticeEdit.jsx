import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as N from '../Notice/NoticeStyle';
import * as C from '../Product/ProductCreateStyle';
import * as D from '../NoticeDetail/NoticeDetailStyle';
import { Editor } from '@toast-ui/react-editor'; 
import '@toast-ui/editor/dist/toastui-editor.css'; 
import color from '@toast-ui/editor-plugin-color-syntax';
import { API_BASE_URL } from '../../../constants/api';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

const NoticeEdit = () => {
  const { noticeId } = useParams();
  const editorRef = useRef();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');  
  const [files, setFiles] = useState([]);
  const [noticeFiles, setNoticeFiles] = useState([]);
  const [originalNotice, setOriginalNotice] = useState(null);  
  const [error, setError] = useState('');
  const [fileNames, setFileNames] = useState([]); 

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notices/${noticeId}`);
        if (response.status === 200) {
          const notice = response.data.data;
          setTitle(notice.noticeTitle);  
          setContent(notice.noticeContent);  
          setNoticeFiles(notice.noticeFiles);  
          setOriginalNotice(notice);
  
          if (editorRef.current) {
            editorRef.current.getInstance().setHTML(notice.noticeContent || '');  
          }
        }
      } catch {
        alert('공지사항 상세 정보를 가져오는 데 실패했습니다.');
      }
    };
    fetchNoticeDetail();
  }, [noticeId]);

  const handleEditorChange = () => {
    const editorInstance = editorRef.current.getInstance();
    setContent(editorInstance.getHTML());
  };

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
            `${API_BASE_URL}/api/file?prefix=notice`,
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
            fileUrl: fileUrl
          };
        })
      );

      setNoticeFiles((prev) => [...prev, ...uploadedFiles]);
    } catch {
      alert('파일 업로드 중 오류가 발생했습니다');
    }
  };
  const handleDeleteExistingFile = (indexToDelete) => {
    setNoticeFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToDelete));
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
    const contentValue = editorRef.current.getInstance().getHTML();
  
    const noticeData = {
      title: title, 
      context: contentValue, 
      noticeFiles: noticeFiles 
    };
  
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/notices/${noticeId}`, noticeData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (response.status === 200) {
        navigate('/admin/notice');
      }
    } catch {
      alert('공지사항 수정 중 오류가 발생했습니다');
      if (error.response && error.response.status === 403) {
        setError('관리자 계정으로 로그인하십시오.');
      } else {
        setError('공지사항을 수정하는 동안 오류가 발생했습니다.');
      }
    }
  };
  
  const handleDeleteFile = (indexToDelete) => {
    setNoticeFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToDelete));
    setFileNames(prevNames => prevNames.filter((_, index) => index !== indexToDelete));
  };

  return (
    <>
      <N.MainWrapper>
        <C.SectionTitle>공지사항 수정</C.SectionTitle>
        <D.FormWrapper>
          <D.SectionTitleWrapper>
            <D.SectionTitle>게시글 수정</D.SectionTitle>
          </D.SectionTitleWrapper>
          <div style={{ padding: '2%' }}>
            <D.Label htmlFor="title">제목 *</D.Label>
            <D.Input
              type="text"
              id="title"
              placeholder="제목을 입력해 주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <D.Label htmlFor="attachment">첨부</D.Label>
            <D.FileInput
              type="file"
              multiple
              onChange={handleAddFile}
            />
            {noticeFiles.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                {noticeFiles.map((file, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <a href={file.fileUrl} download={file.fileName} target="_blank" rel="noopener noreferrer">
                      {file.fileName}
                    </a>
                    <button
                      style={{ color: '#ff0000', fontSize: '1.2rem', marginLeft: '10px' }}
                      onClick={() => handleDeleteExistingFile(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}

            <D.Label htmlFor="content">내용 *</D.Label>
            <div>
              <Editor
                ref={editorRef}
                initialValue={content} 
                previewStyle="vertical"
                height="500px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                onChange={handleEditorChange} 
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
        </D.FormWrapper>
      </N.MainWrapper>
      <D.BtWrap>
        <D.BtLink as={Link} to="/admin/notice">취소</D.BtLink>
        <D.BtLink as={Link} onClick={handleSubmit}>수정</D.BtLink>
      </D.BtWrap>
    </>
  );
};

export default NoticeEdit;
