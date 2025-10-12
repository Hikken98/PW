import React, { useState } from 'react'
export default function PatientForm({ onCreate }){
  const [form, setForm] = useState({ first_name:'', last_name:'', email:'' })
  return (
    <form className="form" onSubmit={async e=>{ e.preventDefault(); await onCreate(form); setForm({first_name:'',last_name:'',email:''}) }}>
      <input placeholder="Nome" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} required />
      <input placeholder="Cognome" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} required />
      <input className="full" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="full" placeholder="Telefono" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
      <button className="btn">Salva</button>
    </form>
  )
}
