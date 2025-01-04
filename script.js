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
async function translateText() {
    const text = document.getElementById('sourceText').value;
    const targetLang = document.getElementById('targetLang').value;
    const resultDiv = document.getElementById('translatedText');

    if (!text) {
        resultDiv.innerText = '';
        return;
    }

    try {
        // Google Translate API URL
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await axios.get(url);
        let translatedText = '';
        
        // API 응답에서 번역된 텍스트 추출
        response.data[0].forEach(item => {
            if (item[0]) translatedText += item[0];
        });

        resultDiv.innerText = translatedText;
    } catch (error) {
        console.error('번역 오류:', error);
        resultDiv.innerText = '번역 중 오류가 발생했습니다.';
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

    // 언어 선택 변경 시 번역 실행
    document.getElementById('targetLang').addEventListener('change', translateText);
};
