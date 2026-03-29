// مفتاح Groq
const GROQ_API_KEY = "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";

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function login() {
    if(document.getElementById('loginEmail').value === '') {
        alert('يرجى إدخال البريد الإلكتروني.');
        return;
    }
    switchScreen('chatScreen');
}

// التسجيل وإرسال البيانات عبر FormSubmit مع الرد التلقائي للمستخدم
async function register(event) {
    event.preventDefault(); 

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const country = document.getElementById('regCountry').value;
    
    // ⚠️ ضع إيميلك الشخصي هنا (الإيميل الذي سيستقبل بيانات المسجلين الجدد كمدير للموقع)
    const adminEmail = "mkj555m@gmail.com"; 
    const formSubmitUrl = `https://formsubmit.co/ajax/${adminEmail}`; 

    try {
        const response = await fetch(formSubmitUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email, // مهم جداً: هذا الحقل سيقرأه FormSubmit ليرسل رسالة للمستخدم
                phone: phone,
                country: country,
                _subject: "مستخدم جديد سجل في موقع RTQ.ai",
                // الرسالة التلقائية التي ستصل إلى إيميل المستخدم الذي سجل للتو:
                _autoresponse: `مرحباً ${name}،\n\nشكراً لتسجيلك في موقع RTQ.ai.\nكود التحقق الخاص بك هو: 1234\n\nنتمنى لك تجربة ممتعة مع الذكاء الاصطناعي!`,
                _template: "table" // تنسيق الإيميل الذي سيصلك كمدير
            })
        });

        if (response.ok) {
            alert('تم إرسال كود التحقق إلى بريدك الإلكتروني بنجاح!');
            switchScreen('verifyScreen');
        } else {
            alert('حدث خطأ في خدمة الإرسال. تأكد من تفعيل الإيميل.');
        }
    } catch (error) {
        console.error("Error:", error);
        alert('حدث خطأ أثناء الاتصال بالخادم.');
    }
}

function verifyEmail() {
    const code = document.getElementById('verifyCode').value;
    if (code === '1234') {
        switchScreen('chatScreen');
    } else {
        alert('الكود الذي أدخلته غير صحيح!');
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const inputField = document.getElementById('userInput');
    const message = inputField.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    inputField.value = '';

    document.getElementById('loadingIndicator').style.display = 'block';

    try {
        await callGroqAPI(message);
    } catch (error) {
        console.error(error);
        addMessage('عذراً، حدث خطأ أثناء الاتصال بالخادم.', 'bot');
    } finally {
        document.getElementById('loadingIndicator').style.display = 'none';
    }
}

function addMessage(text, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function callGroqAPI(message) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: message }]
        })
    });
    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        addMessage(data.choices[0].message.content, 'bot');
    } else {
        addMessage('حدث خطأ في الرد من نموذج Groq.', 'bot');
    }
}
