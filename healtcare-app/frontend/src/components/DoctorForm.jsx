import React, { useState } from 'react'
export default function DoctorForm({ onCreate }){
const [form, setForm] = useState({ first_name:'', last_name:'', specialty:'' })
return (
<form onSubmit={async e=>{ e.preventDefault(); await onCreate(form); setForm({first_name:'',last_name:'',specialty:''}) }}>
<input placeholder="Nome" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} required />
<input placeholder="Cognome" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} required />
<input placeholder="Specialità" value={form.specialty} onChange={e=>setForm({...form, specialty:e.target.value})} required />
<button>Salva</button>
</form>
)
}