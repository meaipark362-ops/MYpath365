import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Link } from '../app/router';
import { uiStore } from '../stores/uiStore';
import styles from './HomePage.module.css';

interface DomainTile {
  index: string;
  title: string;
  slug: string;
  description: string;
}

const DOMAIN_TILES: DomainTile[] = [
  {
    index: '01',
    title: '01. 진로수업',
    slug: 'career-classes',
    description: '마이크로프로세서·디지털 논리회로 실습, UART/I2C 센서 모둠 과제 및 공학 적성 기록.',
  },
  {
    index: '02',
    title: '02. 진로정보',
    slug: 'career-info',
    description: '펌웨어·RTOS 엔지니어 직무 분석, 전자전기/컴공 진학 전략과 3단계 성장 로드맵.',
  },
  {
    index: '03',
    title: '03. 진로활동',
    slug: 'career-activities',
    description: '로보틱스 동아리 MCU 제어 세미나, ARM 인터럽트 주제탐구 및 교내 경진대회 수상.',
  },
  {
    index: '04',
    title: '04. 독서발자국',
    slug: 'reading-footprint',
    description: '컴퓨터 구조, CPU 파이프라인, 리눅스 커널 메모리 계층을 깊이 탐구한 전공 서적 노트.',
  },
  {
    index: 'PF',
    title: '엔지니어링 포트폴리오',
    slug: 'portfolio',
    description: '회로 설계부터 레지스터 제어, 실시간 스케줄링까지 검증된 핵심 역량과 대표 성과.',
  },
  {
    index: 'AR',
    title: '전체 기록 아카이브',
    slug: 'archive',
    description: '누적된 17건의 학습·탐구·독서 기록을 카테고리별 및 시간순으로 정리한 보관소.',
  },
];

export const HomePage: React.FC = () => {
  const handleOpenSearch = () => {
    uiStore.getState().openSearchModal();
  };

  return (
    <AppLayout hideToc={true}>
      <div className={styles.page}>
        {/* 1. Apple.com/kr Style Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.eyebrow}>EMBEDDED &amp; AI SYSTEMS PORTFOLIO</div>
          <h1 className={styles.heroTitle}>
            장민겸.
            <span className={styles.heroSubtitle}>
              하드웨어의 물리적 한계 위에서
              <br />
              실시간성과 인공지능을 설계하다.
            </span>
          </h1>
          <p className={styles.heroLead}>
            임베디드 소프트웨어, 컴퓨터 구조, MCU 및 RTOS 제어 역량을 체계적으로 축적하고
            실제 하드웨어 프로토타입으로 증명하는 엔지니어링 워크스페이스입니다.
          </p>

          <div className={styles.heroActions}>
            <Link to="/page/portfolio" className={styles.pillButton}>
              포트폴리오 살펴보기
            </Link>
            <button type="button" className={styles.textLinkAction} onClick={handleOpenSearch}>
              <span>전체 기록 검색하기</span>
              <span className={styles.chevron} aria-hidden="true">›</span>
            </button>
          </div>
        </section>

        {/* 2. Core Engineering Pillars (3-Column Highlights) */}
        <section className={styles.pillarsSection} aria-label="핵심 엔지니어링 영역">
          <div className={styles.pillarsGrid}>
            <div className={styles.pillarItem}>
              <div className={styles.pillarLabel}>01 / Architecture</div>
              <h2 className={styles.pillarTitle}>ARM Cortex-M &amp; MCU</h2>
              <p className={styles.pillarDesc}>
                레지스터 직접 제어와 하드웨어 인터럽트 설계
              </p>
            </div>
            <div className={styles.pillarItem}>
              <div className={styles.pillarLabel}>02 / System OS</div>
              <h2 className={styles.pillarTitle}>FreeRTOS &amp; Linux Kernel</h2>
              <p className={styles.pillarDesc}>
                실시간 선점형 태스크 스케줄링과 메모리 계층 분석
              </p>
            </div>
            <div className={styles.pillarItem}>
              <div className={styles.pillarLabel}>03 / Intelligence</div>
              <h2 className={styles.pillarTitle}>Robotics &amp; On-Device AI</h2>
              <p className={styles.pillarDesc}>
                다축 로봇팔 역기구학 제어와 비전 센서 융합
              </p>
            </div>
          </div>
        </section>

        {/* 3. Featured Hardware Projects (2 Spacious Showcase Cards) */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>핵심 하드웨어 프로젝트.</h2>
          </div>

          <div className={styles.showcaseGrid}>
            <Link to="/page/project-arduino-assistive" className={styles.showcaseCard}>
              <div className={styles.cardEyebrow}>PROJECT 01 · 교내 메이커스 우수상</div>
              <h3 className={styles.showcaseTitle}>Arduino 초음파 촉각 햅틱 보조 장치</h3>
              <p className={styles.showcaseDesc}>
                시각장애인의 안전 보행을 위해 HC-SR04 초음파 센서와 ERM 진동 모터를 결합하여
                거리 비례 PWM 햅틱 피드백을 구현했습니다. 논블로킹 타이머 구조로 센서 응답 지연을 최소화했습니다.
              </p>
              <div className={styles.cardActionLink}>
                <span>더 알아보기</span>
                <span className={styles.chevron} aria-hidden="true">›</span>
              </div>
            </Link>

            <Link to="/page/project-stm32-robot-arm" className={styles.showcaseCard}>
              <div className={styles.cardEyebrow}>PROJECT 02 · RTOS 연구 진행중</div>
              <h3 className={styles.showcaseTitle}>STM32F4 &amp; FreeRTOS 4축 로봇팔 비전 시스템</h3>
              <p className={styles.showcaseDesc}>
                ARM Cortex-M4 기반 UART 비전 좌표 수신, 역기구학 연산, 4채널 하드웨어 PWM 구동을
                독립적인 FreeRTOS 태스크와 Queue로 분리해 실시간 제어를 구현하고 있습니다.
              </p>
              <div className={styles.cardActionLink}>
                <span>더 알아보기</span>
                <span className={styles.chevron} aria-hidden="true">›</span>
              </div>
            </Link>
          </div>
        </section>

        {/* 4. Explore by Domain (Progressive Disclosure 2-Column Tiles) */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>진로 탐색 및 활동 기록.</h2>
            <p className={styles.sectionSubtitle}>
              원하는 영역을 선택하여 세부 활동과 노트를 확인하세요.
            </p>
          </div>

          <div className={styles.domainGrid}>
            {DOMAIN_TILES.map((tile) => (
              <Link key={tile.slug} to={`/page/${tile.slug}`} className={styles.domainTile}>
                <div className={styles.domainIndex}>{tile.index}</div>
                <h3 className={styles.domainTitle}>{tile.title}</h3>
                <p className={styles.domainDesc}>{tile.description}</p>
                <div className={styles.cardActionLink}>
                  <span>살펴보기</span>
                  <span className={styles.chevron} aria-hidden="true">›</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
