// src/app/api/youtube/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, codigo } = body;

    if (!url || !codigo) {
      return NextResponse.json({ error: "URL e código são obrigatórios." }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const html = await response.text();

    if (html.includes(codigo)) {
      return NextResponse.json({ 
        verificado: true, 
        mensagem: "Canal verificado com sucesso!" 
      });
    } else {
      return NextResponse.json({ 
        verificado: false, 
        error: "Código não encontrado. Verifique se colou na descrição e se o vídeo NÃO está privado." 
      }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json({ 
      error: "Falha ao acessar o link do YouTube. Tente novamente." 
    }, { status: 500 });
  }
}