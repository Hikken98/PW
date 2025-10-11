import React, { useState } from 'react'
export default function AppointmentForm({ doctors, patients, onCreate }){
const [form, setForm] = useState({ doctor_id:'', patient_id:'', start_time:'' })
return (
<form onSubmit={async e=>{ e.preventDefault(); await onCreate({...form, doctor_id:+form.doctor_id, patient_id:+form.patient_id}); }}>
<select value={form.doctor_id} onChange={e=>setForm({...form, doctor_id:e.target.value})} required>
<option value="">Medico…</option>
{doctors.map(d=> <option key={d.id} value={d.id}>{d.last_name} {d.first_name} – {d.specialty}</option>)}
</select>
<select value={form.patient_id} onChange={e=>setForm({...form, patient_id:e.target.value})} required>
<option value="">Paziente…</option>
{patients.map(p=> <option key={p.id} value={p.id}>{p.last_name} {p.first_name}</option>)}
</select>
<input type="datetime-local" value={form.start_time} onChange={e=>setForm({...form, start_time:e.target.value})} required />
<button>Prenota</button>
</form>
)
}