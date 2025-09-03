참고 스타일링

/* 추가 스타일 */
:root {
  --main-surface-background: #fffffff2;
  --main-surface-primary: #fffffff2;
  --border-medium: #0d0d0d;
  --text-primary: #0d0d0d;
  --btn-primary-bg: #0d0d0d;
  --btn-primary-color: #fff;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;
  --text-sm: 0.875rem;
  --text-sm--line-height: 1.42857;
  --spacing: 0.25rem;
  --header-h: 3.375rem;
}

/* 기본 스타일 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 시험 모드 화면 고정 스타일 */
body.exam-mode {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
  height: 100% !important;
  touch-action: none !important;
  -webkit-overflow-scrolling: touch !important;
}

/* 모바일 뷰포트 고정 */
@media (max-width: 768px) {
  body.exam-mode {
    height: 100vh !important;
    height: calc(var(--vh, 1vh) * 100) !important;
  }
  
  /* 키보드가 올라와도 레이아웃 고정 */
  body.exam-mode #root {
    height: 100vh !important;
    height: calc(var(--vh, 1vh) * 100) !important;
    overflow: hidden !important;
  }
  
  /* input 포커스 시 스크롤 방지 */
  body.exam-mode input:focus {
    position: relative !important;
  }
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.h-screen {
  height: 100vh;
}

.bg-white {
  background-color: #fff;
}

.border-b {
  border-bottom-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.max-w-7xl {
  max-width: 80rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: 700;
}

.relative {
  position: relative;
}

.rounded-full {
  border-radius: 9999px;
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.focus\:outline-none:focus {
  outline: none;
}

.transition {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.h-10 {
  height: 2.5rem;
}

.w-10 {
  width: 2.5rem;
}

.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.w-8 {
  width: 2rem;
}

.h-8 {
  height: 2rem;
}

.rounded-xs {
  border-radius: 0.125rem;
}

.text-gray-600 {
  color: #4b5563;
}

.absolute {
  position: absolute;
}

.right-0 {
  right: 0;
}

.mt-2 {
  margin-top: 0.5rem;
}

.w-56 {
  width: 14rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.z-10 {
  z-index: 10;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.w-full {
  width: 100%;
}

.text-left {
  text-align: left;
}

.mr-2 {
  margin-right: 0.5rem;
}

.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}

.text-xs {
  font-size: 0.75rem;
}

.text-gray-500 {
  color: #6b7280;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.border-t {
  border-top-width: 1px;
}

.my-1 {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.bg-black {
  background-color: #000;
}

.bg-opacity-50 {
  --tw-bg-opacity: 0.5;
}

.flex {
  display: flex;
}

.z-50 {
  z-index: 50;
}

.p-6 {
  padding: 1.5rem;
}

.max-w-sm {
  max-width: 24rem;
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-gray-400 {
  color: #9ca3af;
}

.hover\:text-gray-600:hover {
  color: #4b5563;
}

.block {
  display: block;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.flex-1 {
  flex: 1 1 0%;
}

.gap-4 {
  gap: 1rem;
}

.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.py-2\.5 {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.text-blue-500 {
  color: #3b82f6;
}


.bg-red-50 {
  background-color: #fef2f2;
}

.text-red-500 {
  color: #ef4444;
}

.justify-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}

.text-blue-500 {
  color: #3b82f6;
}

.hover\:text-blue-600:hover {
  color: #2563eb;
}

.text-gray-300 {
  color: #d1d5db;
}

.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.text-yellow-500 {
  color: #f59e0b;
}

.justify-end {
  justify-content: flex-end;
}

.gap-3 {
  gap: 0.75rem;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.overflow-hidden {
  overflow: hidden;
}

.flex-wrap {
  flex-wrap: wrap;
}

.btn {
  --tw-font-weight: var(--font-weight-medium);
  align-items: center;
  border-color: #0000;
  border-radius: 3.40282e+38px;
  border-style: var(--tw-border-style);
  border-width: 1px;
  display: inline-flex
;
  flex-shrink: 0;
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  justify-content: center;
  line-height: var(--tw-leading, var(--text-sm--line-height));
  min-height: 38px;
  padding-block: calc(var(--spacing) * 2);
  padding-inline: calc(var(--spacing) * 3.5);
  pointer-events: auto;
}