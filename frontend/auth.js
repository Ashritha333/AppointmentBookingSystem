let mode = 'login';
const $ = (id) => document.getElementById(id);

function setMode(next) {
  mode = next;
  $('tab-login').classList.toggle('active', mode === 'login');
  $('tab-register').classList.toggle('active', mode === 'register');
  $('name-row').classList.toggle('hidden', mode === 'login');
  $('submit').textContent = mode === 'login' ? 'Login' : 'Create account';
  $('message').textContent = '';
}

async function submit() {
  const body = { email: $('email').value, password: $('password').value };
  if (mode === 'register') body.name = $('name').value;
  const res = await fetch(`/api/auth/${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    $('message').textContent = data.error;
    $('message').className = 'message error';
    return;
  }
  if (mode === 'register') {
    setMode('login');
    $('message').textContent = 'Account created. Please log in.';
    $('message').className = 'message ok';
    return;
  }
  sessionStorage.setItem('token', data.token);
  sessionStorage.setItem('name', data.user.name);
  window.location.href = 'dashboard.html';
}

$('tab-login').addEventListener('click', () => setMode('login'));
$('tab-register').addEventListener('click', () => setMode('register'));
$('submit').addEventListener('click', submit);
