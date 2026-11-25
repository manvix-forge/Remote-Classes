import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export default function App() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [loginMode, setLoginMode] = useState(true);
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rc-session")); } catch { return null; }
  });
  const [classes, setClasses] = useState([]);
  const [notice, setNotice] = useState("");
  const [newClass, setNewClass] = useState({ title: "", subject: "", description: "", meetingUrl: "", resourceUrl: "" });

  async function request(path, options = {}) {
    const response = await fetch(API + path, {
      ...options,
      headers: { "Content-Type": "application/json", ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}), ...options.headers }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }
  async function loadClasses() {
    try { setClasses(await request("/classes")); } catch (error) { setNotice(error.message); }
  }
  useEffect(() => { if (session?.token) loadClasses(); }, [session?.token]);

  async function submitAuth(event) {
    event.preventDefault(); setNotice("");
    try {
      const data = await request(loginMode ? "/auth/login" : "/auth/register", {
        method: "POST", body: JSON.stringify(loginMode
          ? { email: form.email, password: form.password } : form)
      });
      setSession(data); localStorage.setItem("rc-session", JSON.stringify(data));
      setNotice("Welcome, " + data.user.name);
    } catch (error) { setNotice(error.message); }
  }
  async function submitClass(event) {
    event.preventDefault(); setNotice("");
    try {
      await request("/classes", { method: "POST", body: JSON.stringify(newClass) });
      setNewClass({ title: "", subject: "", description: "", meetingUrl: "", resourceUrl: "" });
      setNotice("Class created."); await loadClasses();
    } catch (error) { setNotice(error.message); }
  }
  function logout() { localStorage.removeItem("rc-session"); setSession(null); setClasses([]); setNotice("Signed out."); }

  if (!session?.token) return <main className="auth-shell">
    <section className="panel auth-panel">
      <p className="eyebrow">LEARNING WITHOUT DISTANCE</p><h1>Remote Classes</h1>
      <p className="muted">A simple classroom hub designed to keep pages light and resources easy to access.</p>
      <div className="tabs"><button className={loginMode ? "active" : ""} onClick={() => setLoginMode(true)}>Login</button><button className={!loginMode ? "active" : ""} onClick={() => setLoginMode(false)}>Register</button></div>
      <form onSubmit={submitAuth}>
        {!loginMode && <><label>Name<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></label><label>Role<select value={form.role} onChange={e => setForm({...form,role:e.target.value})}><option value="student">Student</option><option value="teacher">Teacher</option></select></label></>}
        <label>Email<input required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></label>
        <label>Password<input required minLength="8" type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></label>
        <button className="primary" type="submit">{loginMode ? "Login" : "Create account"}</button>
      </form>{notice && <p className="notice">{notice}</p>}
    </section>
  </main>;

  return <main className="shell">
    <header className="topbar"><div><p className="eyebrow">RURAL COLLEGE LEARNING HUB</p><h1>Remote Classes</h1></div><div className="profile"><span>{session.user.name} · {session.user.role}</span><button onClick={logout}>Logout</button></div></header>
    {notice && <p className="notice">{notice}</p>}
    {session.user.role === "teacher" && <section className="panel"><h2>Create a class</h2><form className="class-form" onSubmit={submitClass}>
      <label>Class title<input required value={newClass.title} onChange={e=>setNewClass({...newClass,title:e.target.value})}/></label>
      <label>Subject<input required value={newClass.subject} onChange={e=>setNewClass({...newClass,subject:e.target.value})}/></label>
      <label className="wide">Description<textarea value={newClass.description} onChange={e=>setNewClass({...newClass,description:e.target.value})}/></label>
      <label>Meeting URL<input type="url" placeholder="https://" value={newClass.meetingUrl} onChange={e=>setNewClass({...newClass,meetingUrl:e.target.value})}/></label>
      <label>Notes / recording URL<input type="url" placeholder="https://" value={newClass.resourceUrl} onChange={e=>setNewClass({...newClass,resourceUrl:e.target.value})}/></label>
      <button className="primary">Publish class</button>
    </form></section>}
    <section><div className="section-heading"><div><p className="eyebrow">YOUR LEARNING SPACE</p><h2>Available classes</h2></div><button onClick={loadClasses}>Refresh</button></div>
      {classes.length === 0 ? <div className="empty panel">No classes published yet. Check again later.</div> : <div className="class-grid">{classes.map(item=><article className="panel class-card" key={item._id}><span className="tag">{item.subject}</span><h3>{item.title}</h3><p>{item.description || "Class resources and meeting details."}</p><small>Teacher: {item.teacher?.name || "Faculty"}</small><div className="links">{item.meetingUrl && <a href={item.meetingUrl} target="_blank" rel="noreferrer">Join meeting ↗</a>}{item.resourceUrl && <a href={item.resourceUrl} target="_blank" rel="noreferrer">Open notes / recording ↗</a>}</div></article>)}</div>}
    </section>
    <footer>Lightweight classroom portal · Use Wi-Fi or mobile data responsibly</footer>
  </main>;
}
