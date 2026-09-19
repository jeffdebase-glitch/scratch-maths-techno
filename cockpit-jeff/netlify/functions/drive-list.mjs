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
    const folderId=new URL(req.url).searchParams.get('folderId')||Netlify.env.get('DRIVE_FOLDER_ID');
    if(!folderId)return new Response(JSON.stringify({error:'folderId manquant'}),{status:400,headers:{'content-type':'application/json'}});
    const token=await accessToken();
    const q=`'${folderId.replaceAll("'","\\'")}' in parents and trashed=false and mimeType='application/pdf'`;
    const u=new URL('https://www.googleapis.com/drive/v3/files');
    u.searchParams.set('q',q);u.searchParams.set('fields','files(id,name,modifiedTime,size,mimeType)');u.searchParams.set('orderBy','modifiedTime desc');u.searchParams.set('pageSize','100');
    const r=await fetch(u,{headers:{Authorization:`Bearer ${token}`}});
    if(!r.ok)throw new Error(await r.text());
    return new Response(await r.text(),{headers:{'content-type':'application/json','cache-control':'no-store'}});
  }catch(e){
    return new Response(JSON.stringify({error:String(e.message||e)}),{status:500,headers:{'content-type':'application/json','cache-control':'no-store'}});
  }
};