const $ = (id) => document.getElementById(id);
const token = sessionStorage.getItem('token');
if (!token) window.location.href = 'index.html';
const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
let selectedTime = null;

$('user-name').textContent = sessionStorage.getItem('name') || '';
$('date').min = new Date().toISOString().slice(0, 10);

async function loadDoctors() {
  const doctors = await (await fetch('/api/doctors')).json();
  $('doctor').innerHTML = doctors
    .map((d) => `<option value="${d.id}">${d.name} – ${d.specialty}</option>`)
    .join('');
}

async function loadSlots() {
  selectedTime = null;
  $('book').disabled = true;
  if (!$('date').value) return;
  const res = await fetch(`/api/doctors/${$('doctor').value}/slots?date=${$('date').value}`);
  const data = await res.json();
  if (!data.available || data.available.length === 0) {
    $('slots').innerHTML = '<span class="muted">No free slots on this day</span>';
    return;
  }
  $('slots').innerHTML = data.available
    .map((t) => `<button type="button" class="slot" data-time="${t}">${t}</button>`)
    .join('');
}

$('slots').addEventListener('click', (e) => {
  if (!e.target.dataset.time) return;
  document.querySelectorAll('.slot').forEach((b) => b.classList.remove('selected'));
  e.target.classList.add('selected');
  selectedTime = e.target.dataset.time;
  $('book').disabled = false;
});

async function loadAppointments() {
  const list = await (await fetch('/api/appointments', { headers: authHeaders })).json();
  $('appointments').innerHTML = list.length === 0
    ? '<tr><td colspan="5" class="muted">No appointments yet</td></tr>'
    : list.map((a) => `<tr>
        <td>${a.date}</td><td>${a.time}</td><td>${a.doctor_name}</td>
        <td><span class="badge ${a.status.toLowerCase()}">${a.status}</span></td>
        <td>${a.status === 'BOOKED' ? `<button class="link" data-cancel="${a.id}">Cancel</button>` : ''}</td>
      </tr>`).join('');
}

$('book').addEventListener('click', async () => {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      doctorId: Number($('doctor').value), date: $('date').value, time: selectedTime, reason: $('reason').value,
    }),
  });
  const data = await res.json();
  $('book-msg').textContent = res.ok ? `Booked for ${data.date} at ${data.time}` : data.error;
  $('book-msg').className = `message ${res.ok ? 'ok' : 'error'}`;
  await loadSlots();
  await loadAppointments();
});

$('appointments').addEventListener('click', async (e) => {
  const id = e.target.dataset.cancel;
  if (!id) return;
  await fetch(`/api/appointments/${id}/cancel`, { method: 'PATCH', headers: authHeaders });
  await loadSlots();
  await loadAppointments();
});

$('doctor').addEventListener('change', loadSlots);
$('date').addEventListener('change', loadSlots);
$('logout').addEventListener('click', () => {
  sessionStorage.clear();
  window.location.href = 'index.html';
});

loadDoctors().then(loadAppointments);
