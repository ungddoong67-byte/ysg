let isScrolling = false;

// 1. 보안 및 방지 기능 (우클릭 / 선택 / 드래그 방지)
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('mainContainer');
  const sections = document.querySelectorAll('.section, .section-normal'); // 1~7번 전체 섹션
  const dots = document.querySelectorAll('.dot');
  let currentIndex = 0;

  if (!container) return;

  // 점(Dot) 클릭 시 해당 섹션으로 이동
  window.scrollToSection = function (index) {
    if (sections[index]) {
      sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 2. 스크롤 감지: 활성 점(Dot) 표시 및 7번 섹션 진입 시 CSS 스냅 끄기
  container.addEventListener('scroll', () => {
    const scrollPosition = container.scrollTop;
    const windowHeight = window.innerHeight;
    const section7 = document.getElementById('section7');

    // Dot 활성화 상태 업데이트
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      if (scrollPosition >= sectionTop - windowHeight / 3) {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) {
          dots[index].classList.add('active');
        }
      }
    });

    // 7번 섹션 영역 근처에 오면 CSS 스냅을 꺼서 튕김 현상 완전 방지
    if (section7 && scrollPosition >= section7.offsetTop - 50) {
      container.style.scrollSnapType = 'none';
    } else {
      container.style.scrollSnapType = 'y mandatory';
    }
  });

  // 3. 마우스 휠 이벤트 (PC 풀페이지 스크롤 제어)
  container.addEventListener('wheel', (e) => {
    // 현재 스크롤 위치 기준으로 인덱스 판단
    const currentScroll = container.scrollTop;
    const windowHeight = window.innerHeight;
    currentIndex = Math.round(currentScroll / windowHeight);

    // [핵심] 7번째(마지막) 섹션 영역에 있을 때의 예외 처리
    if (currentIndex >= sections.length - 1) {
      const section7 = sections[sections.length - 1];
      // 7번 섹션 최상단(scrollTop이 7번 offsetTop 이하)에서 위로 스크롤할 때만 6번 섹션으로 복귀
      if (e.deltaY < 0 && container.scrollTop <= section7.offsetTop + 5) {
        e.preventDefault();
        if (!isScrolling) {
          goToSection(sections.length - 2); // 6번 섹션으로 이동
        }
      }
      // 그 외 7번 섹션 내부에서의 스크롤은 브라우저 기본 자유 스크롤 동작 허용
      return;
    }

    // 1~6번 섹션 구간에서는 1페이지씩 딱딱 맞춰 이동
    e.preventDefault();
    if (isScrolling) return;

    if (e.deltaY > 0) {
      // 아래로 스크롤
      if (currentIndex < sections.length - 1) {
        goToSection(currentIndex + 1);
      }
    } else if (e.deltaY < 0) {
      // 위로 스크롤
      if (currentIndex > 0) {
        goToSection(currentIndex - 1);
      }
    }
  }, { passive: false });

  // 섹션 이동 공통 함수
  function goToSection(index) {
    isScrolling = true;
    currentIndex = index;

    sections[index].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    setTimeout(() => {
      isScrolling = false;
    }, 700);
  }
});