const API = 'http://localhost:8000/api';

export async function getDoctors() {
  const r = await fetch(`${API}/doctors`);
  if (!r.ok) {
    let msg = 'Errore caricamento medici';
    try { const e = await r.json(); msg = e.detail || JSON.stringify(e); } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export async function getPatients() {
  const r = await fetch(`${API}/patients`);
  if (!r.ok) {
    let msg = 'Errore caricamento pazienti';
    try { const e = await r.json(); msg = e.detail || JSON.stringify(e); } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export async function createPatient(data) {
  const r = await fetch(`${API}/patients`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  if (!r.ok) {
    let msg = 'Errore creazione paziente';
    try { const e = await r.json(); msg = e.detail || JSON.stringify(e); } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export async function createDoctor(data) {
  const r = await fetch(`${API}/doctors`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  if (!r.ok) {
    let msg = 'Errore creazione medico';
    try { const e = await r.json(); msg = e.detail || JSON.stringify(e); } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export async function getAppointments(params = {}) {
  const qs = new URLSearchParams();
  if (params.date) qs.set('date', params.date);
  if (params.doctor_id != null && params.doctor_id !== '') qs.set('doctor_id', params.doctor_id);
  const url = `${API}/appointments${qs.toString() ? `?${qs}` : ''}`;
  const r = await fetch(url);
  if (!r.ok) {
    let msg = `Errore fetch appuntamenti (${r.status})`;
    try { const e = await r.json(); msg = e.detail || JSON.stringify(e); } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export async function createAppointment(data) {
  const r = await fetch(`${API}/appointments`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  if (!r.ok) {
    let msg = 'Errore prenotazione';
    try { const e = await r.json(); msg = e.detail || JSON.stringify(e); } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export async function deleteAppointment(id) {
  const r = await fetch(`${API}/appointments/${id}`, { method:'DELETE' });
  if (!r.ok) {
    let msg = 'Errore eliminazione appuntamento';
    try { const e = await r.json(); msg = e.detail || JSON.stringify(e); } catch {}
    throw new Error(msg);
  }
  return true;
}

export async function deletePatient(id) {
  const r = await fetch(`${API}/patients/${id}`, { method:'DELETE' });
  if (!r.ok) {
    let msg = 'Errore eliminazione paziente';
    try { const e = await r.json(); msg = e.detail || JSON.stringify(e); } catch {}
    throw new Error(msg);
  }
  return true;
}

export async function deleteDoctor(id) {
  const r = await fetch(`${API}/doctors/${id}`, { method:'DELETE' });
  if (!r.ok) {
    let msg = 'Errore eliminazione medico';
    try { const e = await r.json(); msg = e.detail || JSON.stringify(e); } catch {}
    throw new Error(msg);
  }
  return true;
}

