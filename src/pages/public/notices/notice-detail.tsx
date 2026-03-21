import { useParams } from 'react-router-dom';

const NoticeDetail = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  return <h1>Notice Detail - #{noticeId}</h1>;
};

export default NoticeDetail;
