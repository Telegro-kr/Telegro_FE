import { useState } from 'react';
import { useAuth } from '@hooks/use-auth';
// import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  // const nav = useNavigate();
  const [id, setId] = useState(''),
    [password, setPassword] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login({ id, password });
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="id"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
      />
      <button type="submit">로그인</button>
    </form>
  );
}
