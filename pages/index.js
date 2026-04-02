import { useState } from "react";
import Head from "next/head";
 
const initial = { address:"", price:"", beds:"", baths:"", sqft:"", type:"Single Family Home", features:"", neighborhood:"", notes:"" };
const tabs = [{ key:"instagram_caption", label:"Instagram Caption" },{ key:"email_blast", label:"Email Blast" },{ key:"listing_description", label:"MLS Description" }];
 
export default function Home() {
  const [form, setForm] = useState(initial);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("instagram_caption");
  const [copied, setCopied] = useState("");
 
  const set = e => setForm(f => ({...f, [e.target.name]: e.target.value}));
 
  const generate = async () => {
    if (!form.address||!form.price||!form.beds||!form.baths||!form.features) { setError("Please fill in address, price, beds, baths, and features."); return; }
    setError(""); setLoading(true); setOutput(null);
    try {
      const r = await fetch("/api/generate", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error||"Failed");
      setOutput(d); setTab("instagram_caption");
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };
 
  const copy = (key, text) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(()=>setCopied(""),2000); };
 
  return <>
    <Head>
      <title>Listing Generator · Paige Bieker</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
    </Head>
    <style jsx global>{`
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'DM Sans',sans-serif;background:#F7F5F0;color:#1A1A1A;min-height:100vh}
      .hdr{background:#1A1A1A;padding:22px 32px;display:flex;align-items:center;justify-content:space-between}
      .hdr-title{font-family:'Playfair Display',serif;font-size:20px;color:#F7F5F0;letter-spacing:.02em}
      .hdr-sub{font-size:11px;color:#888;letter-spacing:.06em;text-transform:uppercase;margin-top:3px}
      .hdr-badge{background:#C9A84C;color:#1A1A1A;font-size:10px;font-weight:500;padding:4px 12px;border-radius:2px;letter-spacing:.08em;text-transform:uppercase}
      .main{max-width:820px;margin:0 auto;padding:36px 24px 80px}
      .slabel{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#888;margin-bottom:14px}
      .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
      .field{display:flex;flex-direction:column;gap:4px}
      .field label{font-size:11px;font-weight:500;color:#555;letter-spacing:.06em;text-transform:uppercase}
      .field input,.field select,.field textarea{background:#fff;border:1px solid #E0DDD8;border-radius:4px;padding:9px 12px;font-size:14px;font-family:'DM Sans',sans-serif;color:#1A1A1A;outline:none;width:100%;transition:border-color .15s}
      .field input:focus,.field select:focus,.field textarea:focus{border-color:#C9A84C}
      .field textarea{resize:vertical;min-height:86px;line-height:1.6}
      .full{margin-bottom:12px}
      .btn{width:100%;background:#1A1A1A;color:#F7F5F0;border:none;border-radius:4px;padding:14px;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;margin-top:6px;transition:background .15s}
      .btn:hover:not(:disabled){background:#C9A84C;color:#1A1A1A}
      .btn:disabled{background:#ccc;cursor:not-allowed;color:#888}
      .btn2{width:100%;background:none;border:1px solid #E0DDD8;color:#888;border-radius:4px;padding:10px;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:.06em;text-transform:uppercase;margin-top:6px;transition:all .15s}
      .btn2:hover{border-color:#999;color:#555}
      .err{background:#FEF2F2;border:1px solid #FCA5A5;border-radius:4px;padding:10px 14px;font-size:13px;color:#B91C1C;margin-top:8px}
      .loading{background:#fff;border:1px solid #E0DDD8;border-radius:6px;padding:48px;text-align:center;margin-top:28px}
      .spin{width:26px;height:26px;border:2px solid #E0DDD8;border-top-color:#C9A84C;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 14px}
      @keyframes spin{to{transform:rotate(360deg)}}
      .spin-label{font-size:12px;color:#888;letter-spacing:.08em;text-transform:uppercase}
      .divider{height:1px;background:#E0DDD8;margin:32px 0}
      .out-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
      .out-title{font-family:'Playfair Display',serif;font-size:20px}
      .pill{background:#E8F5EE;color:#166534;font-size:11px;font-weight:500;padding:4px 12px;border-radius:20px}
      .tabs{display:flex;border-bottom:1px solid #E0DDD8;margin-bottom:18px}
      .tab{padding:9px 18px;font-size:12px;font-weight:500;color:#888;cursor:pointer;border:none;border-bottom:2px solid transparent;background:none;font-family:'DM Sans',sans-serif;transition:all .15s;margin-bottom:-1px}
      .tab:hover{color:#555}
      .tab.active{color:#1A1A1A;border-bottom-color:#C9A84C}
      .content{background:#fff;border:1px solid #E0DDD8;border-radius:6px;padding:22px;position:relative;min-height:180px}
      .content pre{font-size:14px;color:#333;line-height:1.85;white-space:pre-wrap;font-family:'DM Sans',sans-serif;padding-right:70px}
      .cpbtn{position:absolute;top:14px;right:14px;background:#1A1A1A;color:#F7F5F0;border:none;border-radius:3px;padding:5px 12px;font-size:11px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.06em;text-transform:uppercase;transition:background .15s;white-space:nowrap}
      .cpbtn:hover{background:#C9A84C;color:#1A1A1A}
      .cpbtn.ok{background:#166534}
      .allrow{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
      .cpall{flex:1;min-width:130px;background:none;border:1px solid #E0DDD8;color:#555;border-radius:4px;padding:8px;font-size:11px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.04em;text-transform:uppercase;transition:all .15s}
      .cpall:hover{border-color:#C9A84C;color:#1A1A1A}
      .cpall.ok{background:#E8F5EE;border-color:#4ADE80;color:#166534}
      .tips{background:#fff;border:1px solid #E0DDD8;border-radius:6px;padding:18px 22px;margin-top:12px}
      .tip{display:flex;gap:8px;margin-bottom:7px;font-size:13px;color:#555;line-height:1.6}
      .tip b{font-weight:500;color:#1A1A1A;white-space:nowrap}
      @media(max-width:600px){.grid2{grid-template-columns:1fr}.hdr{padding:18px}.main{padding:20px 14px 60px}.tab{padding:9px 10px;font-size:11px}}
    `}</style>
 
    <div className="hdr">
      <div>
        <div className="hdr-title">Listing Content Generator</div>
        <div className="hdr-sub">Paige Bieker · McPherson Sisters Homes</div>
      </div>
      <div className="hdr-badge">AI Powered</div>
    </div>
 
    <div className="main">
      <div className="slabel">Listing details</div>
      <div className="grid2">
        <div className="field"><label>Property address *</label><input name="address" value={form.address} onChange={set} placeholder="123 Lakeview Dr, Wayzata MN" /></div>
        <div className="field"><label>Listing price *</label><input name="price" value={form.price} onChange={set} placeholder="750000" type="number" /></div>
        <div className="field"><label>Bedrooms *</label><input name="beds" value={form.beds} onChange={set} placeholder="4" type="number" /></div>
        <div className="field"><label>Bathrooms *</label><input name="baths" value={form.baths} onChange={set} placeholder="3.5" /></div>
        <div className="field"><label>Square footage</label><input name="sqft" value={form.sqft} onChange={set} placeholder="3,200" /></div>
        <div className="field"><label>Property type</label>
          <select name="type" value={form.type} onChange={set}>
            <option>Single Family Home</option><option>Luxury Estate</option><option>Townhome</option>
            <option>Condo</option><option>New Construction</option><option>Waterfront</option><option>Acreage / Hobby Farm</option>
          </select>
        </div>
      </div>
      <div className="full field"><label>Key features * (the standout details)</label>
        <textarea name="features" value={form.features} onChange={set} placeholder="Chef's kitchen with quartz countertops, primary suite with spa bath, 3-car garage, finished walkout basement, lake views..." />
      </div>
      <div className="grid2">
        <div className="field"><label>Neighborhood / area vibe</label><input name="neighborhood" value={form.neighborhood} onChange={set} placeholder="Wayzata, lake community, quiet cul-de-sac..." /></div>
        <div className="field"><label>Special angle or urgency</label><input name="notes" value={form.notes} onChange={set} placeholder="First time on market, priced to move fast..." /></div>
      </div>
 
      <button className="btn" onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate all 3 pieces of content →"}</button>
      {output && <button className="btn2" onClick={()=>{setForm(initial);setOutput(null);setError("");}}>Start over with a new listing</button>}
      {error && <div className="err">{error}</div>}
      {loading && <div className="loading"><div className="spin"/><div className="spin-label">Writing your listing content...</div></div>}
 
      {output && <>
        <div className="divider"/>
        <div className="out-hdr"><div className="out-title">Your listing content</div><div className="pill">Ready to use</div></div>
        <div className="tabs">{tabs.map(t=><button key={t.key} className={`tab${tab===t.key?" active":""}`} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>
        <div className="content">
          <button className={`cpbtn${copied===tab?" ok":""}`} onClick={()=>copy(tab,output[tab])}>{copied===tab?"Copied!":"Copy"}</button>
          <pre>{output[tab]}</pre>
        </div>
        <div className="allrow">{tabs.map(t=><button key={t.key+"_a"} className={`cpall${copied===t.key+"_a"?" ok":""}`} onClick={()=>copy(t.key+"_a",output[t.key])}>{copied===t.key+"_a"?"✓ Copied":`Copy ${t.label}`}</button>)}</div>
        <div className="tips">
          <div className="tip"><b>Instagram —</b> Add your photos or walkthrough video. Tweak any details before posting.</div>
          <div className="tip"><b>Email blast —</b> Paste into Follow Up Boss or Mailchimp. Replace phone/email placeholders with your real info.</div>
          <div className="tip"><b>MLS description —</b> Copy into your MLS input. Verify all details before submitting.</div>
        </div>
      </>}
    </div>
  </>;
}
