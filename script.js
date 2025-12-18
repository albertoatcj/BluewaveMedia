document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const toast = document.getElementById('toast');
  const overlay = document.getElementById('overlay');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const counterEl = document.getElementById('messageCounter');

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const len = digits.length;
    if (len <= 2) return `(${digits}`;
    if (len <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  }
  phoneInput.addEventListener('input', () => {
    const pos = phoneInput.selectionStart || phoneInput.value.length;
    phoneInput.value = formatPhone(phoneInput.value);
    try { phoneInput.setSelectionRange(pos, pos); } catch(_){}
  });

  const MAX = messageInput.maxLength || 400;
  const MIN = parseInt(messageInput.getAttribute('minlength'), 10) || 10;
  function updateCounter() {
    const used = messageInput.value.length;
    counterEl.textContent = `${used}/${MAX}`;
    counterEl.classList.remove('warn', 'error');
    if (used >= MAX * 0.9 && used < MAX) counterEl.classList.add('warn');
    if (used >= MAX) counterEl.classList.add('error');
  }
  messageInput.addEventListener('input', updateCounter);
  updateCounter();

  const TOAST_VISIBLE_MS = 2200; const TOAST_REMOVE_DELAY_MS = 260; const LOADER_MS = 1200;
  function showToast() {
    toast.hidden = false; toast.classList.remove('hide'); toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); toast.classList.add('hide'); setTimeout(() => { toast.hidden = true; }, TOAST_REMOVE_DELAY_MS); }, TOAST_VISIBLE_MS);
  }

  function setFieldError(inputEl, errId, message) {
    const errEl = document.getElementById(errId); if (!errEl) return;
    errEl.textContent = message; errEl.classList.remove('sr-only'); inputEl.setAttribute('aria-invalid', 'true');
  }
  function clearFieldError(inputEl, errId) {
    const errEl = document.getElementById(errId); if (!errEl) return;
    errEl.textContent = ''; errEl.classList.add('sr-only'); inputEl.removeAttribute('aria-invalid');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault(); feedback.textContent = ''; feedback.className = 'feedback';

    const nameInput = form.fullName; const emailInput = form.email; const phoneInputLocal = form.phone; const messageInputLocal = form.message;
    const name = nameInput.value.trim(); const email = emailInput.value.trim(); const phone = phoneInputLocal.value.trim(); const message = messageInputLocal.value.trim();

    clearFieldError(nameInput, 'err-fullName'); clearFieldError(emailInput, 'err-email'); clearFieldError(phoneInputLocal, 'err-phone'); clearFieldError(messageInputLocal, 'err-message');

    const errors = [];
    if (name.length < 3) errors.push({ el: nameInput, id: 'err-fullName', msg: 'O nome completo deve ter pelo menos 3 caracteres.' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; if (!emailRegex.test(email)) errors.push({ el: emailInput, id: 'err-email', msg: 'Informe um email válido (ex.: nome@empresa.com).' });
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/; if (!phoneRegex.test(phone)) errors.push({ el: phoneInputLocal, id: 'err-phone', msg: 'Telefone inválido. Use o formato: (DD) 99999-9999.' });
    const MIN_MSG = MIN; if (message.length < MIN_MSG) errors.push({ el: messageInputLocal, id: 'err-message', msg: `A mensagem deve ter pelo menos ${MIN_MSG} caracteres.` });

    if (errors.length) {
      errors.forEach(({ el, id, msg }) => setFieldError(el, id, msg));
      errors[0].el.focus(); feedback.classList.add('error'); feedback.textContent = 'Verifique os campos destacados e tente novamente.'; return;
    }

    overlay.hidden = false;
    setTimeout(() => {
      overlay.hidden = true; feedback.classList.add('success'); feedback.textContent = 'Obrigado! ✅ Sua mensagem foi enviada. A BlueWave Media responderá em até 1 dia útil.'; showToast(); form.reset(); updateCounter();
    }, LOADER_MS);
  });
});
