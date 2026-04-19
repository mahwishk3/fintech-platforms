import { useLocation } from 'wouter';

export default function NotFound() {
  const [, navigate] = useLocation();
  return (
    <div className="not-found page-wrapper" data-testid="page-not-found">
      <div className="container">
        <h1>404</h1>
        <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Page Not Found</p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/')} data-testid="btn-home">
          Go to Home
        </button>
      </div>
    </div>
  );
}
