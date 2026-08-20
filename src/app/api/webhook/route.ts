import { NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import { client } from '@/lib/mercadopago';
import { db } from '@/lib/firebase'; // Certifique-se de que a exportação do firestore do firebase está correta
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // O Mercado Pago envia notificações de vários tipos. Queremos focar em pagamentos.
    if (body.type === 'payment') {
      const paymentId = body.data?.id;

      if (paymentId) {
        // Consulta os detalhes do pagamento diretamente na API do Mercado Pago
        const payment = new Payment(client);
        const paymentInfo = await payment.get({ id: paymentId });

        // Verifica se o pagamento foi aprovado
        if (paymentInfo.status === 'approved') {
          // O external_reference que passamos no checkout é o ID do usuário do Firebase!
          const userId = paymentInfo.external_reference;

          if (userId) {
            // Atualiza o documento do usuário no Firestore para Pro
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
              isPro: true,
              planoAtual: 'pro',
              dataAssinatura: serverTimestamp(),
              mpPaymentId: paymentId,
            });

            console.log(`[WEBHOOK] Sucesso! Usuário ${userId} atualizado para PRO.`);
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro no Webhook do Mercado Pago:', error);
    return NextResponse.json({ error: 'Erro interno no webhook' }, { status: 500 });
  }
}