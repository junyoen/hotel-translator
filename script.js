// 텍스트 입력 영역에 문구 삽입
function insertPhrase(phrase) {
    const textarea = document.getElementById('sourceText');
    textarea.value = phrase;
}

// 자주 사용하는 문구 클릭 시 사용
function usePhrase(element) {
    const phrase = element.textContent;
    insertPhrase(phrase);
}

// 페이지 로드 완료 후 실행
window.onload = function() {
    // 텍스트 영역 자동 크기 조절
    const textarea = document.getElementById('sourceText');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}
