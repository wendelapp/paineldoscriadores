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

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'cortcut-pro-teste',
            title: 'CortCut Pro - Teste de Produção (R$ 1,00)',
            quantity: 1,
            unit_price: 5.00, // Valor simbólico de 5 real para o teste real
            currency_id: 'BRL',
          },
        ],
        back_urls: {
          success: `${baseUrl}/dashboard?status=sucesso`,
          failure: `${baseUrl}/dashboard?status=falha`,
          pending: `${baseUrl}/dashboard?status=pendente`,
        },
        external_reference: userId, // Chave mestre que liga o pagamento ao seu ID no Firebase!
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error('Erro ao criar preferência do Mercado Pago:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}