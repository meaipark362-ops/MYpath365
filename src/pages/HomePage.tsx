import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Link } from '../app/router';
import { ContentService } from '../services/content/contentService';
import { uiStore } from '../stores/uiStore';
import type { PageRegistryItem } from '../types/page';
import styles from './HomePage.module.css';

const contentService = new ContentService();

export const HomePage: React.FC = () => {
  const [pages, setPages] = useState<PageRegistryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    contentService
      .getAllPages()
      .then((items) => {
        if (isMounted) {
          setPages(items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenSearch = () => {
    uiStore.getState().openSearchModal();
  };

  return (
    <AppLayout hideToc={true}>
      <div className={styles.page}>
        {/* HERMES AI Style Persona Setup & Header Dialogue */}
        <section className={styles.heroDialogue}>
          <div className={styles.introLine}>
            안녕하세요, <strong>MyPath365</strong>에 오신 것을 환영합니다. 체계적인 진로 탐색과 엔지니어링 성과를 기록하고 포트폴리오로 완성합니다.
          </div>

          <div className={styles.dialogueBox}>
            <div className={styles.propRow}>
              <span className={styles.propLabel}>STUDENT</span>
              <span className={styles.propValue}>박민우 (Minwoo Park)</span>
            </div>
            <div className={styles.propRow}>
              <span className={styles.propLabel}>CAREER GOAL</span>
              <span className={styles.propValue}>
                임베디드 소프트웨어 엔지니어 & 온디바이스 AI / 로봇 시스템 아키텍트
              </span>
            </div>
            <div className={styles.propRow}>
              <span className={styles.propLabel}>ACCENT COLOR</span>
              <span className={`${styles.propValue} ${styles.propHighlight}`}>
                Electric Red (#E02444)
              </span>
            </div>
            <div className={styles.propRow}>
              <span className={styles.propLabel}>CORE TECH</span>
              <span className={styles.propValue}>
                STM32F4 · ARM Cortex-M · FreeRTOS · C/C++ · TinyML · Computer Architecture
              </span>
            </div>
          </div>

          <div className={styles.sloganCallout}>
            <strong>개인 슬로건:</strong> "하드웨어의 물리적 한계 위에서 실시간성(RTOS)과 온디바이스 인공지능을 구현하는 임베디드 소프트웨어 엔지니어를 꿈꿉니다."
          </div>

          <div className={styles.actionLinksRow}>
            <Link to="/page/portfolio" className={styles.primaryActionBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>포트폴리오 바로보기</span>
            </Link>
            <button type="button" className={styles.secondaryActionBtn} onClick={handleOpenSearch}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>전체 기록 검색 (⌘K)</span>
            </button>
            <Link to="/page/archive" className={styles.secondaryActionBtn}>
              <span>전체 타임라인 아카이브</span>
            </Link>
          </div>
        </section>

        {/* 6대 핵심 카테고리 쇼케이스 그리드 */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span>::</span>
              <span>CORE KNOWLEDGE & ACTIVITY DOMAINS</span>
            </div>
          </div>

          <div className={styles.cardGrid}>
            <Link to="/page/career-classes" className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIconTitle}>
                  <span>📚</span>
                  <span>01. 진로수업</span>
                </div>
                <span className={styles.cardBadge}>정규 교과 연계</span>
              </div>
              <div className={styles.cardDesc}>
                마이크로프로세서, 디지털 논리회로 브레드보드 실습, I2C 다중 센서 모둠 통신 과제 및 진로 종합 적성 검사 기록.
              </div>
              <div className={styles.cardMeta}>
                <span>3개 상세 활동</span> · <span>최근 업데이트 2일 전</span>
              </div>
            </Link>

            <Link to="/page/career-info" className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIconTitle}>
                  <span>🧭</span>
                  <span>02. 진로정보</span>
                </div>
                <span className={styles.cardBadge}>산업 및 학업 분석</span>
              </div>
              <div className={styles.cardDesc}>
                펌웨어 엔지니어 & RTOS 시스템 개발자 직무 분석, 전자전기/컴공 학과 진학 로드맵, 온디바이스 AI 채용 동향.
              </div>
              <div className={styles.cardMeta}>
                <span>4단계 테크트리</span> · <span>3개년 로드맵 구축</span>
              </div>
            </Link>

            <Link to="/page/career-activities" className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIconTitle}>
                  <span>🛠️</span>
                  <span>03. 진로활동</span>
                </div>
                <span className={`${styles.cardBadge} ${styles.cardBadgeActive}`}>핵심 프로젝트 2건</span>
              </div>
              <div className={styles.cardDesc}>
                Arduino 시각장애인 초음파 촉각 햅틱 보조기구(교내 우수상), STM32F4 & FreeRTOS 4축 로봇팔 비전 시스템 제어.
              </div>
              <div className={styles.cardMeta}>
                <span>동아리 연구</span> · <span>경진대회 수상 실적</span>
              </div>
            </Link>

            <Link to="/page/reading-footprint" className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIconTitle}>
                  <span>📖</span>
                  <span>04. 독서발자국</span>
                </div>
                <span className={styles.cardBadge}>전공 서적 필사</span>
              </div>
              <div className={styles.cardDesc}>
                《컴퓨터 밑바닥의 비밀》, 《ARM 리눅스 커널 구조》 정독 및 CPU 파이프라인/캐시 미스/메모리 정렬 분석 노트.
              </div>
              <div className={styles.cardMeta}>
                <span>2권 완독</span> · <span>엔지니어링 인사이트</span>
              </div>
            </Link>

            <Link to="/page/portfolio" className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIconTitle}>
                  <span>💼</span>
                  <span>PORTFOLIO</span>
                </div>
                <span className={`${styles.cardBadge} ${styles.cardBadgeActive}`}>외부 공개용</span>
              </div>
              <div className={styles.cardDesc}>
                하드웨어 회로부터 펌웨어 레지스터 직접 제어, 실시간 스케줄링까지 엔지니어링 역량을 증명하는 포트폴리오.
              </div>
              <div className={styles.cardMeta}>
                <span>대표작 2종</span> · <span>기술 스택 상세</span>
              </div>
            </Link>

            <Link to="/page/archive" className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIconTitle}>
                  <span>🗄️</span>
                  <span>ARCHIVE</span>
                </div>
                <span className={styles.cardBadge}>전체 타임라인</span>
              </div>
              <div className={styles.cardDesc}>
                고교 및 수험 기간 동안 누적된 모든 학습, 프로젝트, 독서 발자국을 날짜별 및 카테고리별로 일목요연하게 탐색.
              </div>
              <div className={styles.cardMeta}>
                <span>총 17건 기록</span> · <span>필터 및 검색 지원</span>
              </div>
            </Link>
          </div>
        </section>

        {/* 대표 프로젝트 딥다이브 섹션 */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <span>::</span>
              <span>FEATURED HARDWARE & EMBEDDED PROJECTS</span>
            </div>
          </div>

          <div className={styles.cardGrid}>
            <Link to="/page/project-arduino-assistive" className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIconTitle}>
                  <span>🦾</span>
                  <span>Arduino 초음파 촉각 햅틱 보조기구</span>
                </div>
                <span className={styles.cardBadge}>COMPLETED · 수상작</span>
              </div>
              <div className={styles.cardDesc}>
                시각장애인의 안전 보행을 위해 HC-SR04 센서와 ERM 진동 모터를 결합하여 거리 비례 PWM 햅틱 피드백 구현. 논블로킹 타이머 설계.
              </div>
              <div className={styles.cardMeta}>
                <span>ATmega328P</span> · <span>하드웨어 인터럽트</span> · <span>교내 메이커스 우수상</span>
              </div>
            </Link>

            <Link to="/page/project-stm32-robot-arm" className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIconTitle}>
                  <span>🤖</span>
                  <span>STM32F4 & FreeRTOS 4축 로봇팔</span>
                </div>
                <span className={`${styles.cardBadge} ${styles.cardBadgeActive}`}>IN PROGRESS · 연구중</span>
              </div>
              <div className={styles.cardDesc}>
                ARM Cortex-M4 기반 4채널 하드웨어 PWM 서보 제어, 비전 카메라 좌표 UART 패킷 파싱 및 선점형 RTOS 태스크 스케줄링.
              </div>
              <div className={styles.cardMeta}>
                <span>FreeRTOS Queue</span> · <span>역기구학 연산</span> · <span>CubeIDE</span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
