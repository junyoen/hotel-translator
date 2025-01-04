let originalText = '';
let koreanRecognition = null;
let foreignRecognition = null;

// 음성 인식 초기화
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        // 한국어 음성 인식 설정
        koreanRecognition = new webkitSpeechRecognition();
        koreanRecognition.continuous = true;
        koreanRecognition.interimResults = true;
        koreanRecognition.lang = 'ko-KR';

        // 외국어 음성 인식 설정
        foreignRecognition = new webkitSpeechRecognition();
        foreignRecognition.continuous = true;
        foreignRecognition.interimResults = true;
        
        setupRecognitionEvents(koreanRecognition, 'korean');
        setupRecognitionEvents(foreignRecognition, 'foreign');
    } else {
        alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
    }
}

// 음성 인식 이벤트 설정
function setupRecognitionEvents(recognition, type) {
    const statusElement = document.getElementById(`${type}Status`);
    const isKorean = type === 'korean';

    recognition.onstart = function() {
        statusElement.textContent = `${isKorean ? '한국어' : '외국어'} 음성 인식 중...`;
        statusElement.style.color = '#1a73e8';
    };

    recognition.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + '\n';
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript) {
            if (isKorean) {
                document.getElementById('sourceText').value = finalTranscript;
                translateText();
            } else {
                document.getElementById('translatedText').innerText = finalTranscript;
            }
        }
    };

    recognition.onerror = function(event) {
        statusElement.textContent = `오류 발생: ${event.error}`;
        statusElement.style.color = 'red';
    };

    recognition.onend = function() {
        statusElement.textContent = `${isKorean ? '한국어' : '외국어'} 음성 인식 대기중`;
        statusElement.style.color = '#666';
    };
}

// 음성 인식 시작/중지 토글
function toggleRecognition(type) {
    const recognition = type === 'korean' ? koreanRecognition : foreignRecognition;
    const button = document.getElementById(`start${type.charAt(0).toUpperCase() + type.slice(1)}`);
    
    if (recognition.isStarting || recognition.isStarted) {
        recognition.stop();
        button.textContent = `${type === 'korean' ? '한국어' : '외국어'} 음성 인식 시작`;
    } else {
        recognition.start();
        button.textContent = `${type === 'korean' ? '한국어' : '외국어'} 음성 인식 중지`;
    }
}

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
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await axios.get(url);
        let translatedText = '';
        
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
    initializeSpeechRecognition();

    // 음성 인식 버튼 이벤트 리스너 설정
    document.getElementById('startKorean').addEventListener('click', () => toggleRecognition('korean'));
    document.getElementById('startForeign').addEventListener('click', () => toggleRecognition('foreign'));

    // 텍스트 영역 자동 크기 조절 및 입력 감지
    const textarea = document.getElementById('sourceText');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        if (this.value !== originalText) {
            originalText = this.value;
            translateText();
        }
    });

    // 언어 선택 변경 시 번역 실행
    document.getElementById('targetLang').addEventListener('change', function() {
        foreignRecognition.lang = this.value;
        translateText();
    });
};
