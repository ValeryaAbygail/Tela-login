// Frontend login/register usando backend API com fallback para localStorage
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const msg = document.getElementById('msg');
const rmsg = document.getElementById('rmsg');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

function showMessage(el, text, isError = true) {
  el.textContent = text;
  el.style.color = isError ? '#b00020' : '#0a8a00';
}

showRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hide');
  registerForm.classList.remove('hide');
});

showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.add('hide');
  loginForm.classList.remove('hide');
});

async function callApi(path, body) {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    // network error -> indicate offline
    return { ok: false, status: 0, error: err };
  }
}

// localStorage fallback (same shape used previously)
function getUsers() {
  try { return JSON.parse(localStorage.getItem('users') || '{}'); } catch { return {}; }
}
function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  if (!email || !password) { showMessage(msg, 'Preencha email e senha.'); return; }

  // Try server
  const res = await callApi('/api/login', { email, password });
  if (res.status === 0) {
    // server not reachable -> fallback to localStorage
    const users = getUsers();
    if (users[email] && users[email].password === password) {
      showMessage(msg, 'Login bem-sucedido (fallback)! Redirecionando...', false);
      setTimeout(() => { window.location.href = './'; }, 800);
    } else {
      showMessage(msg, 'Credenciais inválidas. Verifique ou crie uma conta.');
    }
    return;
  }

  if (res.ok) {
    showMessage(msg, 'Login bem-sucedido! Redirecionando...', false);
    setTimeout(() => { window.location.href = './'; }, 800);
  } else {
    showMessage(msg, res.data && res.data.message ? res.data.message : 'Erro ao logar');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('rname').value.trim();
  const email = document.getElementById('remail').value.trim().toLowerCase();
  const password = document.getElementById('rpassword').value;
  const confirm = document.getElementById('rconfirm').value;

  if (!name || !email || !password) { showMessage(rmsg, 'Preencha todos os campos.'); return; }
  if (password !== confirm) { showMessage(rmsg, 'As senhas não conferem.'); return; }

  const res = await callApi('/api/register', { name, email, password });
  if (res.status === 0) {
    // fallback: localStorage
    const users = getUsers();
    if (users[email]) { showMessage(rmsg, 'Já existe conta com esse email.'); return; }
    users[email] = { name, password };
    saveUsers(users);
    showMessage(rmsg, 'Conta criada com sucesso (fallback)! Você já pode entrar.', false);
    setTimeout(() => {
      registerForm.classList.add('hide');
      loginForm.classList.remove('hide');
      rmsg.textContent = '';
    }, 900);
    return;
  }

  if (res.ok) {
    showMessage(rmsg, 'Conta criada com sucesso! Você já pode entrar.', false);
    setTimeout(() => {
      registerForm.classList.add('hide');
      loginForm.classList.remove('hide');
      rmsg.textContent = '';
    }, 900);
  } else {
    showMessage(rmsg, res.data && res.data.message ? res.data.message : 'Erro ao criar conta');
  }
});

// Comentários para o Copilot:
// Explique por que usamos localStorage como fallback e os riscos de segurança.

