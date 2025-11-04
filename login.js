// Exemplo de validação, registro local e 'login' com localStorage
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const msg = document.getElementById('msg');
const rmsg = document.getElementById('rmsg');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// Recupera usuários do localStorage (objeto: { email: { name, password } })
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('users') || '{}');
  } catch {
    return {};
  }
}

function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }

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

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const users = getUsers();

  if (!email || !password) { showMessage(msg, 'Preencha email e senha.'); return; }

  if (users[email] && users[email].password === password) {
    showMessage(msg, 'Login bem-sucedido! Redirecionando...', false);
    setTimeout(() => { window.location.href = './'; }, 800);
  } else {
    showMessage(msg, 'Credenciais inválidas. Verifique ou crie uma conta.');
  }
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('rname').value.trim();
  const email = document.getElementById('remail').value.trim().toLowerCase();
  const password = document.getElementById('rpassword').value;
  const confirm = document.getElementById('rconfirm').value;
  const users = getUsers();

  if (!name || !email || !password) { showMessage(rmsg, 'Preencha todos os campos.'); return; }
  if (password !== confirm) { showMessage(rmsg, 'As senhas não conferem.'); return; }
  if (users[email]) { showMessage(rmsg, 'Já existe conta com esse email.'); return; }

  users[email] = { name, password };
  saveUsers(users);
  showMessage(rmsg, 'Conta criada com sucesso! Você já pode entrar.', false);
  setTimeout(() => {
    registerForm.classList.add('hide');
    loginForm.classList.remove('hide');
    rmsg.textContent = '';
  }, 900);
});

// Comentários para o Copilot:
// Copilot, explique por que usamos localStorage para armazenar dados neste exemplo e os riscos de segurança.
// Copilot, explique event.preventDefault() e por que armazenar senhas em texto não é seguro para produção.
