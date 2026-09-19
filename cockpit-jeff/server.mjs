import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||8080);

function send(res,status,body,type='text/plain; charset=utf-8'){res.writeHead(status,{'content-type':type,'cache-control':'no-store'});res.end(body)}

async function bridge(params){
  const base=process.env.DRIVE_BRIDGE_URL;
  const token=process.env.COCKPIT_TOKEN;
  if(!base||!token) throw new Error('Bridge Drive non configuré');
  const u=new URL(base);
  Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));
  u.searchParams.set('token',token);
  const r=await fetch(u,{redirect:'follow',cache:'no-store'});
  if(!r.ok) throw new Error('Bridge HTTP '+r.status);
  return r.json();
}

async function bridgePost(payload){
  const base=process.env.DRIVE_BRIDGE_URL;
  const token=process.env.COCKPIT_TOKEN;
  if(!base||!token) throw new Error('Bridge Drive non configuré');
  const r=await fetch(base,{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify({...payload,token}),
    redirect:'follow',
    cache:'no-store'
  });
  if(!r.ok) throw new Error('Bridge HTTP '+r.status);
  return r.json();
}

function readJson(req,max=100000){
  return new Promise((resolve,reject)=>{
    let data='';
    req.on('data',chunk=>{
      data+=chunk;
      if(data.length>max){reject(new Error('payload too large'));req.destroy();}
    });
    req.on('end',()=>{
      try{resolve(JSON.parse(data||'{}'))}catch(e){reject(new Error('invalid json'))}
    });
    req.on('error',reject);
  });
}

function validDate(v){return /^20\d{2}-\d{2}-\d{2}$/.test(String(v||''))}
function cleanNumber(v,min,max){
  if(v===null||v===undefined||v==='') return null;
  const n=Number(v);
  return Number.isFinite(n)&&n>=min&&n<=max?n:null;
}

async function handleApi(req,res,u){
  if(u.pathname==='/.netlify/functions/drive-list'){
    const data=await bridge({action:'list'});
    if(!data.ok) return send(res,502,JSON.stringify(data),'application/json');
    return send(res,200,JSON.stringify({files:data.files||[]}),'application/json');
  }
  if(u.pathname==='/.netlify/functions/drive-file'){
    const id=u.searchParams.get('id');
    if(!id) return send(res,400,'id manquant');
    const data=await bridge({action:'file',id});
    if(!data.ok||!data.base64) return send(res,502,JSON.stringify(data),'application/json');
    const buf=Buffer.from(data.base64,'base64');
    res.writeHead(200,{'content-type':data.mimeType||'application/pdf','cache-control':'no-store'});
    return res.end(buf);
  }
  if(u.pathname==='/.netlify/functions/linked-data' && req.method==='GET'){
    const data=await bridge({action:'linked'});
    if(!data.ok) return send(res,502,JSON.stringify(data),'application/json');
    return send(res,200,JSON.stringify({days:data.days||{}}),'application/json');
  }
  if(u.pathname==='/api/linked' && req.method==='POST'){
    const auth=req.headers.authorization||'';
    const token=process.env.COCKPIT_TOKEN||'';
    if(!token||auth!==('Bearer '+token)) return send(res,401,JSON.stringify({ok:false,error:'unauthorized'}),'application/json');
    const body=await readJson(req);
    if(!validDate(body.date)) return send(res,400,JSON.stringify({ok:false,error:'invalid_date'}),'application/json');
    const payload={
      action:'linked-upsert',
      date:body.date,
      steps:cleanNumber(body.steps,0,100000),
      calories:cleanNumber(body.calories,0,10000),
      activityMinutes:cleanNumber(body.activityMinutes,0,1440),
      sleepHours:cleanNumber(body.sleepHours,0,24),
      trainingMinutes:cleanNumber(body.trainingMinutes,0,1440)
    };
    const data=await bridgePost(payload);
    return send(res,data.ok?200:502,JSON.stringify(data),'application/json');
  }
  if(u.pathname==='/api/drive/status'){
    return send(res,200,JSON.stringify({configured:Boolean(process.env.DRIVE_BRIDGE_URL&&process.env.COCKPIT_TOKEN)}),'application/json');
  }
  return false;
}

const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};

function staticFile(req,res,u){
  let rel=decodeURIComponent(u.pathname);
  if(rel==='/') rel='/index.html';
  const file=path.resolve(root,'.'+rel);
  if(!file.startsWith(root)) return send(res,403,'Forbidden');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()) return send(res,404,'Not found');
  res.writeHead(200,{'content-type':types[path.extname(file).toLowerCase()]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
}

const server=http.createServer(async (req,res)=>{
  const u=new URL(req.url,'http://localhost');
  try{
    if(u.pathname.startsWith('/.netlify/functions/')||u.pathname.startsWith('/api/')){
      const handled=await handleApi(req,res,u);
      if(handled!==false) return;
    }
    staticFile(req,res,u);
  }catch(e){
    send(res,500,JSON.stringify({error:String(e.message||e)}),'application/json');
  }
});

server.listen(port,'0.0.0.0',async ()=>{
  console.log('Cockpit Jeff listening on '+port);
  try{
    const data=await bridge({action:'list'});
    if(data?.ok){
      const files=data.files||[];
      console.log('Drive bridge OK - '+files.length+' PDF');
      if(files.length){
        const smallest=[...files].sort((a,b)=>Number(a.size||Infinity)-Number(b.size||Infinity))[0];
        console.log('Drive smallest PDF - '+Number(smallest.size||0)+' bytes');
        const probe=await bridge({action:'file',id:smallest.id});
        if(probe?.ok&&probe.base64){
          const bytes=Buffer.from(probe.base64,'base64').length;
          console.log('Drive PDF fetch OK - '+bytes+' bytes - '+String(probe.name||'PDF'));
        }else{
          console.log('Drive PDF fetch FAILED');
        }
      }
    }else console.log('Drive bridge response error');
  }catch(e){
    console.error('Drive bridge FAILED - '+String(e.message||e));
  }
});
