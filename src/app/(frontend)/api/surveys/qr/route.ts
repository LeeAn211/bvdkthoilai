import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
export async function GET(req:Request){const u=new URL(req.url);const slug=String(u.searchParams.get('slug')||'').replace(/[^a-z0-9-]/gi,'').slice(0,120);if(!slug)return NextResponse.json({error:'Thiếu slug'},{status:400});const origin=process.env.NEXT_PUBLIC_SITE_URL||u.origin;const svg=await QRCode.toString(`${origin}/khao-sat/${slug}`,{type:'svg',margin:2,width:512,errorCorrectionLevel:'M'});return new NextResponse(svg,{headers:{'content-type':'image/svg+xml; charset=utf-8','cache-control':'public, max-age=3600'}})}
