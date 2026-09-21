import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function Admin() {
  const [isLogin, setIsLogin] = useState(false);
  const [pass, setPass] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    if(localStorage.getItem("admin_beben") === "true") setIsLogin(true);
    const q = query(collection(db, "confesses"), where("expiresAt", ">", new Date()));
    return onSnapshot(q, s => setList(s.docs.map(d => ({id:d.id, ...d.data()}))));
  }, []);

  if(!isLogin) return (
    <div style={{minHeight:'100vh', background:'black', color:'white', display:'flex', justifyContent:'center', alignItems:'center'}}>
      <div style={{border:'1px solid #333', padding:24, borderRadius:12, width:300}}>
        <h1>Login Admin</h1>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" style={{width:'100%', padding:8, marginTop:12, background:'#222', color:'white'}} />
        <button onClick={()=>{ if(pass==="bebenkasep"){ setIsLogin(true); localStorage.setItem("admin_beben","true")} else alert("Salah") }} style={{width:'100%', marginTop:12, background:'white', color:'black', padding:8, fontWeight:'bold'}}>Masuk</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh', background:'black', color:'white', padding:20}}>
      <h1>Admin - {list.length} Confess Aktif</h1>
      <p style={{color:'gray', fontSize:12}}>Otomatis hilang 24 jam - Opsi A</p>
      <div style={{marginTop:20, display:'grid', gap:12}}>
        {list.map(c=>(
          <div key={c.id} style={{background:'#18181b', padding:12, borderRadius:12, display:'flex', justifyContent:'space-between'}}>
            <span>{c.text}</span>
            <button onClick={async()=>{ if(confirm("Hapus?")) await deleteDoc(doc(db,"confesses",c.id)) }} style={{color:'red'}}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
