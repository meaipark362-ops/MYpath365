import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Link } from '../app/router';
import { uiStore } from '../stores/uiStore';
import styles from './HomePage.module.css';

interface DomainIndexItem {
  code: string;
  title: string;
  slug: string;
  summary: string;
  subLinks: Array<{ label: string; slug: string }>;
}

const DOMAIN_INDEX: DomainIndexItem[] = [
  {
    code: '01',
    title: '진로수업',
    slug: 'career-classes',
    summary: '마이크로프로세서·디지털 논리회로 실습, UART/I2C 모둠 통신 설계 및 공학 적성 분석.',
    subLinks: [
      { label: '마이크로프로세서 실습', slug: 'class-microprocessor' },
      { label: 'UART/I2C 센서 모둠과제', slug: 'class-group-sensor' },
      { label: '진로 적성 분석', slug: 'career-aptitude' },
    ],
  },
  {
    code: '02',
    title: '진로정보',
    slug: 'career-info',
    summary: '펌웨어·RTOS 엔지니어 직무 분석, 전자전기/컴공 진학 전략 및 3단계 기술 로드맵.',
    subLinks: [
      { label: '펌웨어 SW 직무 분석', slug: 'job-embedded-engineer' },
      { label: '진학 전략 및 이수 과목', slug: 'academic-pathway' },
      { label: '온디바이스 AI 동향', slug: 'industry-edge-ai' },
      { label: '3단계 성장 테크트리', slug: 'career-roadmap' },
    ],
  },
  {
    code: '03',
    title: '진로활동',
    slug: 'career-activities',
    summary: '로보틱스 동아리 MCU 제어 세미나, ARM 인터럽트 주제탐구 및 교내 메이커스 경진대회 수상.',
    subLinks: [
      { label: '로보틱스 동아리 세미나', slug: 'club-robotics' },
      { label: 'ARM 인터럽트 & RTOS 탐구', slug: 'lecture-arm-rtos' },
      { label: '대회 수상 및 자격 계획', slug: 'certifications-competitions' },
    ],
  },
  {
    code: '04',
    title: '독서발자국',
    slug: 'reading-footprint',
    summary: '하드웨어 계층 구조, CPU 파이프라인, 커널 메모리 관리를 깊이 탐구한 전공 서적 필사 및 인사이트.',
    subLinks: [
      { label: '《ARM 리눅스 커널 구조》 필사', slug: 'book-linux-kernel' },
      { label: '《컴퓨터 밑바닥의 비밀》 정리', slug: 'book-computer-architecture' },
      { label: '메모리 보호 & HAL 인사이트', slug: 'reading-insights' },
    ],
  },
  {
    code: 'PF',
    title: 'PORTFOLIO',
    slug: 'portfolio',
    summary: '회로 설계, 레지스터 직접 제어, RTOS 태스크 아키텍처를 총망라한 외부 공개용 엔지니어링 포트폴리오.',
    subLinks: [
      { label: '포트폴리오 전체 보기', slug: 'portfolio' },
      { label: '홈 대시보드 원본 문서', slug: 'home' },
    ],
  },
  {
    code: 'AR',
    title: 'ARCHIVE',
    slug: 'archive',
    summary: '누적된 17건의 학습·프로젝트·독서 발자국을 시간순과 카테고리별로 추적하는 전체 기록 보관소.',
    subLinks: [
      { label: '전체 타임라인 아카이브', slug: 'archive' },
    ],
  },
];

export const HomePage: React.FC = () => {
  const handleOpenSearch = () => {
    uiStore.getState().openSearchModal();
  };

  return (
    <AppLayout hideToc={true}>
      <div className={styles.page}>
        {/* HERMES AI Style Console Header & Setup Dialogue */}
        <section className={styles.heroDialogue}>
          <div className={styles.heroEyebrow}>
            <span className={styles.eyebrowDot} />
            <span>MYPATH365 · ENGINEERING CAREER WORKSPACE</span>
          </div>

          <h1 className={styles.heroTitle}>
            Mingyeom Jang <span className={styles.heroTitleSub}>— Embedded &amp; AI Systems</span>
          </h1>

          <p className={styles.introLine}>
            하드웨어의 물리적 한계 위에서 실시간성(RTOS)과 온디바이스 인공지능을 구현하는 임베디드 소프트웨어 엔지니어{' '}
            <strong>장민겸</strong>의 학습·탐구·프로젝트 기록 공간입니다.
          </p>

          <div className={styles.dialogueFlow}>
            <div className={styles.dialogueSlot}>
              <span className={styles.propLabel}>Name</span>
              <span className={styles.propValue}>장민겸 (Mingyeom Jang)</span>
            </div>
            <div className={styles.systemAck}>Mingyeom Jang, initialized.</div>

            <div className={styles.dialogueSlot}>
              <span className={styles.propLabel}>Accent color</span>
              <span className={`${styles.propValue} ${styles.propNeon}`}>Neon Red (#FF1717)</span>
            </div>
            <div className={styles.systemAck}>Pure neon red accent calibrated.</div>

            <div className={styles.dialogueSlot}>
              <span className={styles.propLabel}>Architecture</span>
              <span className={styles.propValue}>ARM Cortex-M4 · FreeRTOS · Embedded C/C++</span>
            </div>

            <div className={styles.dialogueSlot}>
              <span className={styles.propLabel}>Focus Domain</span>
              <span className={styles.propValue}>Real-time Control · Computer Architecture · On-Device Vision</span>
            </div>
          </div>

          <div className={styles.actionLinksRow}>
            <Link to="/page/portfolio" className={styles.primaryActionBtn}>
              <span>포트폴리오 바로보기</span>
              <span aria-hidden="true">→</span>
            </Link>
            <button type="button" className={styles.secondaryActionBtn} onClick={handleOpenSearch}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>전체 기록 검색 (⌘K)</span>
            </button>
            <Link to="/page/archive" className={styles.secondaryActionBtn}>
              <span>타임라인 아카이브</span>
            </Link>
          </div>
        </section>

        {/* Featured Hardware & Embedded Projects (Full-width Spec Strips) */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionPrefix}>::</span>
              <span>FEATURED HARDWARE &amp; EMBEDDED PROJECTS</span>
            </div>
            <span className={styles.sectionMeta}>2 CORE SYSTEMS</span>
          </div>

          <div className={styles.specList}>
            <Link to="/page/project-arduino-assistive" className={styles.specStrip}>
              <div className={styles.specTopRow}>
                <div className={styles.specIdentity}>
                  <span className={styles.specCode}>PRJ-01</span>
                  <h2 className={styles.specTitle}>Arduino 기반 시각장애인 초음파 촉각 햅틱 보조 장치</h2>
                </div>
                <span className={styles.statusCompleted}>COMPLETED · 교내 우수상</span>
              </div>
              <p className={styles.specDesc}>
                시각장애인의 안전 보행을 위해 HC-SR04 초음파 센서와 ERM 진동 모터를 결합하여 장애물 거리에 반비례하는 PWM 햅틱 피드백을 구현했습니다. 논블로킹 타이머 설계로 다중 센서 응답 지연을 최소화했습니다.
              </p>
              <div className={styles.specFooter}>
                <div className={styles.specTags}>
                  <span className={styles.specTag}>ATmega328P</span>
                  <span className={styles.specTag}>HC-SR04</span>
                  <span className={styles.specTag}>PWM Haptic</span>
                  <span className={styles.specTag}>Hardware Interrupt</span>
                </div>
                <span className={styles.specArrow}>상세 아키텍처 보기 →</span>
              </div>
            </Link>

            <Link to="/page/project-stm32-robot-arm" className={styles.specStrip}>
              <div className={styles.specTopRow}>
                <div className={styles.specIdentity}>
                  <span className={styles.specCode}>PRJ-02</span>
                  <h2 className={styles.specTitle}>STM32F4 &amp; FreeRTOS 기반 4축 로봇팔 비전 제어 시스템</h2>
                </div>
                <span className={styles.statusLive}>
                  <span className={styles.liveDot} />
                  IN PROGRESS · RTOS 연구중
                </span>
              </div>
              <p className={styles.specDesc}>
                ARM Cortex-M4 기반으로 비전 좌표 UART 패킷 수신, 역기구학(IK) 연산, TIM2/TIM3 4채널 하드웨어 PWM 서보 구동을 독립적인 선점형 FreeRTOS 태스크와 Queue로 분리해 실시간 정밀 제어를 구현하고 있습니다.
              </p>
              <div className={styles.specFooter}>
                <div className={styles.specTags}>
                  <span className={styles.specTag}>STM32F401RE</span>
                  <span className={styles.specTag}>FreeRTOS Queue</span>
                  <span className={styles.specTag}>4-DOF Kinematics</span>
                  <span className={styles.specTag}>UART CRC</span>
                </div>
                <span className={styles.specArrow}>태스크 구조 보기 →</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Core Curriculum & Activity Index (Editorial Index Rows) */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionPrefix}>::</span>
              <span>CORE KNOWLEDGE &amp; ACTIVITY INDEX</span>
            </div>
            <span className={styles.sectionMeta}>DIRECT NAVIGATION</span>
          </div>

          <div className={styles.indexTable}>
            {DOMAIN_INDEX.map((domain) => (
              <div key={domain.code} className={styles.indexRow}>
                <div className={styles.indexLeft}>
                  <span className={styles.indexCode}>{domain.code}</span>
                  <Link to={`/page/${domain.slug}`} className={styles.indexTitleLink}>
                    {domain.title}
                  </Link>
                </div>

                <div className={styles.indexRight}>
                  <p className={styles.indexSummary}>{domain.summary}</p>
                  <div className={styles.subLinkRow}>
                    {domain.subLinks.map((sub) => (
                      <Link key={sub.slug} to={`/page/${sub.slug}`} className={styles.subLinkChip}>
                        <span>{sub.label}</span>
                        <span className={styles.chipArrow}>↗</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
