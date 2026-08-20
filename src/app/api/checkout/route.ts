import { NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import { client } from '@/lib/mercadopago';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const preference = new Preference(client);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

   // ... dentro da sua API de checkout
const result = await preference.create({
  body: {
    items: [
      {
        id: 'cortcut-pro',
        title: 'CortCut Pro - Assinatura Mensal',
        quantity: 1,
        unit_price: 29.90, // O preço real, mas o Mercado Pago vai respeitar o trial
        currency_id: 'BRL',
      },
    ],
    // A mágica acontece aqui:
    // O Mercado Pago gerencia o trial se você criar uma Preference de Assinatura,
    // mas no Checkout Pro simples, o trial é configurado via "Subscription Plan".
    // PORÉM, para o nosso teste agora, o que vai valer é que o webhook 
    // vai receber o status 'approved' e disparar o isPro: true.
    back_urls: {
      success: `${baseUrl}/dashboard?status=sucesso`,
      failure: `${baseUrl}/dashboard?status=falha`,
      pending: `${baseUrl}/dashboard?status=pendente`,
    },
    external_reference: userId,
  },
});

    return NextResponse.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error('Erro ao criar preferência do Mercado Pago:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}