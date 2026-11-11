import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Link } from '../app/router';
import { Button, EmptyState } from '../components/ui';

export const NotFoundPage: React.FC = () => {
  return (
    <AppLayout hideToc={true}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            color: 'var(--text-muted)',
            lineHeight: 1,
            marginBottom: '16px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}
        >
          페이지를 찾을 수 없습니다
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            maxWidth: '460px',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          요청하신 경로가 올바르지 않거나, 삭제되었거나, 아직 Notion 데이터베이스에 존재하지 않습니다.
        </p>

        <Link to="/">
          <Button variant="primary">홈으로 이동</Button>
        </Link>
      </div>
    </AppLayout>
  );
};
