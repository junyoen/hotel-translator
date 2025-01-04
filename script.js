let originalText = '';

// 텍스트 입력 영역에 문구 삽입
function insertPhrase(phrase) {
    const textarea = document.getElementById('sourceText');
    textarea.value = phrase;
    originalText = phrase;
    translateText();
}

// 자주 사용하는 문구 클릭 시 사용
function usePhrase(element) {
    const phrase = element.textContent;
    insertPhrase(phrase);
}

// 번역 실행 함수
function translateText() {
    const iframe = document.querySelector('.goog-te-menu-frame');
    if (iframe) {
        const select = iframe.contentDocument.querySelector('.goog-te-menu2');
        if (select) {
            select.click();
        }
    }
}

// 페이지 로드 완료 후 실행
window.onload = function() {
    // 텍스트 영역 자동 크기 조절 및 입력 감지
    const textarea = document.getElementById('sourceText');
    textarea.addEventListener('input', function() {
        // 높이 자동 조절
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // 텍스트 변경 감지 및 번역
        if (this.value !== originalText) {
            originalText = this.value;
            translateText();
        }
    });
}
