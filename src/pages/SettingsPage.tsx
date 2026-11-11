import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui';
import { userStore } from '../stores/userStore';
import type { UserPreferences } from '../types/user';
import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {
  const [prefs, setPrefs] = useState<UserPreferences>(() => userStore.getState().preferences);

  useEffect(() => {
    const unsub = userStore.subscribe(() => {
      setPrefs(userStore.getState().preferences);
    });
    return unsub;
  }, []);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    userStore.getState().updatePreferences({ theme });
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleFontSizeChange = (fontSize: 'normal' | 'large') => {
    userStore.getState().updatePreferences({ fontSize });
    if (fontSize === 'large') {
      document.documentElement.style.setProperty('--font-size-base', '18px');
    } else {
      document.documentElement.style.setProperty('--font-size-base', '16px');
    }
  };

  const handleResetData = () => {
    if (window.confirm('저장된 즐겨찾기, 읽기 진행률, 체크리스트 상태를 모두 초기화하시겠습니까?')) {
      userStore.getState().resetUserData();
      alert('사용자 데이터가 초기화되었습니다.');
    }
  };

  return (
    <AppLayout hideToc={true}>
      <div className={styles.page}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>환경설정</h1>
          <p className={styles.pageDesc}>
            테마, 글꼴 크기, 저장소 동기화 등 사용자 경험을 맞춤 설정할 수 있습니다.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>화면 및 테마</h2>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>컬러 테마</span>
              <span className={styles.settingDesc}>
                라이트 모드, 옵시디언 다크 모드, 또는 시스템 설정을 따릅니다.
              </span>
            </div>
            <div className={styles.buttonGroup}>
              <Button
                variant={prefs.theme === 'light' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('light')}
              >
                라이트
              </Button>
              <Button
                variant={prefs.theme === 'dark' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('dark')}
              >
                다크
              </Button>
              <Button
                variant={prefs.theme === 'system' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('system')}
              >
                시스템
              </Button>
            </div>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>본문 글꼴 크기</span>
              <span className={styles.settingDesc}>
                콘텐츠 뷰어의 본문 가독성을 위한 기본 폰트 크기입니다.
              </span>
            </div>
            <div className={styles.buttonGroup}>
              <Button
                variant={prefs.fontSize === 'normal' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFontSizeChange('normal')}
              >
                기본 (16px)
              </Button>
              <Button
                variant={prefs.fontSize === 'large' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFontSizeChange('large')}
              >
                크게 (18px)
              </Button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>데이터 관리</h2>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <span className={styles.settingLabel}>사용자 데이터 초기화</span>
              <span className={styles.settingDesc}>
                로컬 브라우저에 저장된 즐겨찾기, 읽기 진행률, 체크리스트 완료 상태를 초기화합니다.
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetData}>
              데이터 초기화
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
