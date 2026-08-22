import { NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import { client } from '@/lib/mercadopago';
import { db } from '@/lib/firebase'; 
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Identifica o ID do pagamento considerando diferentes formatos que o Mercado Pago pode enviar
    const paymentId = body.data?.id || body.id || (body.resource && body.resource.split('/').pop());
    const topic = body.type || body.topic;

    if (topic === 'payment' && paymentId) {
      // Consulta os detalhes do pagamento diretamente na API oficial do Mercado Pago
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: Number(paymentId) });

      // Verifica se o pagamento foi aprovado com sucesso
      if (paymentInfo && paymentInfo.status === 'approved') {
        // O external_reference é o ID do usuário do Firebase que passamos no checkout!
        const userId = paymentInfo.external_reference;

        if (userId) {
          // Atualiza o documento do usuário no Firestore para PRO
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            isPro: true,
            planoAtual: 'pro',
            dataAssinatura: serverTimestamp(),
            mpPaymentId: String(paymentId),
          });

          console.log(`[WEBHOOK] Sucesso! Usuário ${userId} atualizado para PRO via pagamento ${paymentId}.`);
        }
      }
    }

    // Sempre responda 200 OK rapidamente para o Mercado Pago saber que a notificação foi recebida
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Erro no Webhook do Mercado Pago:', error?.message || error);
    // Retornamos 200 mesmo no erro para evitar loop infinito de reenvio do Mercado Pago em caso de falhas pontuais
    return NextResponse.json({ error: 'Erro processado' }, { status: 200 });
  }
}