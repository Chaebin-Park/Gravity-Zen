# 🌌 Gravity Zen Garden

**Gravity Zen Garden**은 물리 법칙이 적용된 공간에서 자유롭게 상호작용하며 스트레스를 해소할 수 있는 인터랙티브 물리 샌드박스 웹 애플리케이션입니다.

## 🚀 주요 기능

- **인터랙티브 물리 엔진:** `Matter.js`를 사용한 실시간 2D 물리 시뮬레이션.
- **다양한 상호작용 모드:**
  - ✨ **Spawn:** 화면을 클릭하여 랜덤한 색상의 도형(원, 상자) 생성.
  - 💥 **Explode:** 클릭한 지점에서 강력한 충격파를 발생시켜 물체들을 튕겨냄.
  - 🧲 **Magnet:** 마우스를 누르는 동안 모든 물체를 커서 방향으로 끌어당김.
- **물리 법칙 제어:**
  - **Zero G:** 무중력 상태로 전환하여 물체들을 둥둥 떠다니게 함.
  - **Invert G:** 중력을 반전시켜 모든 물체를 천장으로 보냄.
- **모던 디자인:** 네온 컬러와 글래스모피즘 UI가 적용된 다크 모드 스타일.

## 🛠 기술 스택

- **Frontend:** React (TypeScript)
- **Build Tool:** Vite
- **Physics Engine:** Matter.js
- **Styling:** Vanilla CSS
- **Deployment:** GitHub Pages

## 🎮 시작하기

1. **의존성 설치:**
   ```bash
   npm install
   ```
2. **로컬 실행:**
   ```bash
   npm run dev
   ```
3. **배포:**
   ```bash
   npm run deploy
   ```

## 🕹 조작 방법

- **좌측 상단:** 현재 설정된 모드와 중력 상태 확인.
- **우측 메뉴:**
  - 상호작용 모드(Spawn, Explode, Magnet) 선택.
  - 생성할 도형 타입(Circle, Box, Mixed) 선택.
  - 물리 옵션(Zero G, Invert G) 및 화면 초기화.
- **화면 클릭/드래그:** 선택된 모드에 따라 물체를 생성하거나 물리 효과를 가함.

---
만든 이: [Your Name/GitHub ID]
