async function accessToken(){
  const clientId=Netlify.env.get('GOOGLE_CLIENT_ID');
  const clientSecret=Netlify.env.get('GOOGLE_CLIENT_SECRET');
  const refreshToken=Netlify.env.get('GOOGLE_REFRESH_TOKEN');
  if(!clientId||!clientSecret||!refreshToken) throw new Error('OAuth Google non configuré');
  const body=new URLSearchParams({client_id:clientId,client_secret:clientSecret,refresh_token:refreshToken,grant_type:'refresh_token'});
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body});
  if(!r.ok) throw new Error('OAuth Google non configuré');
  return (await r.json()).access_token;
}

export default async (req) => {
  try{
    const id=new URL(req.url).searchParams.get('id');
    if(!id)return new Response('id manquant',{status:400});
    const token=await accessToken();
    const r=await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media`,{headers:{Authorization:`Bearer ${token}`}});
    if(!r.ok)throw new Error(await r.text());
    return new Response(await r.arrayBuffer(),{headers:{'content-type':'application/pdf','cache-control':'no-store'}});
  }catch(e){
    return new Response(String(e.message||e),{status:500,headers:{'cache-control':'no-store'}});
  }
};