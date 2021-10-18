interface SendWhatsappProps {
  phone: string;
  e?: Event;
  msg?: string;
}

export const sendWhatsapp = ({ e, phone, msg }: SendWhatsappProps): void => {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  msg = encodeURI(
    msg ??
      'Hola! te escribe panda store. Tu conjunto ya se encuentra disponible para retirar. Que tengas lindo dia! ;)'
  );

  window.open(`whatsapp://send?phone=58${phone}&msg=${msg}`);
};
