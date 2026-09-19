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
    if(u.pathname.startsWith('/.netlify/functions/')||u.pathname==='/api/drive/status'){
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
    if(data?.ok) console.log('Drive bridge OK - '+((data.files||[]).length)+' PDF');
    else console.log('Drive bridge response error');
  }catch(e){
    console.error('Drive bridge FAILED - '+String(e.message||e));
  }
});
