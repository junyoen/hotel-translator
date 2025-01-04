// 자주 사용하는 문구를 저장할 배열
const commonPhrases = {
    checkIn: "체크인은 오후 3시부터입니다.",
    checkOut: "체크아웃은 오전 11시까지입니다.",
    passport: "여권을 보여주시겠습니까?",
    help: "무엇을 도와드릴까요?"
};

// 문구를 번역기에 입력하는 함수
function insertPhrase(phrase) {
    // 한국어 번역기 iframe 찾기
    const koreanTranslator = document.querySelector('.translator-frame:first-child iframe');
    
    // 구글 번역기의 입력 필드에 포커스
    koreanTranslator.contentWindow.postMessage({
        text: phrase,
        action: 'translate'
    }, '*');
}

// iframe이 로드된 후 실행되는 함수
window.onload = function() {
    // iframe들이 완전히 로드될 때까지 기다림
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.onload = function() {
            console.log('iframe loaded');
        }
    });
}

// 에러 처리
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    return false;
};
