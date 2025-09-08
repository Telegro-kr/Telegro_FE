import { useParams } from 'react-router-dom';

export default function NoticeDetail() {
  const { noticeId } = useParams<{ noticeId: string }>();
  return <h1>Notice Detail - #{noticeId}</h1>;
}
