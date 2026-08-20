import { MercadoPagoConfig } from 'mercadopago';

// Inicializa a SDK com o seu token de acesso
export const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '', 
  options: { timeout: 5000 } 
});