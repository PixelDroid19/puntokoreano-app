// hooks/useCardDetection.ts
import { useState, useCallback } from "react";

export const CARD_TYPES = {
  VISA: "visa",
  MASTERCARD: "mastercard",
  AMEX: "american-express",
  DISCOVER: "discover",
  DINERS: "diners",
  JCB: "jcb",
  UNIONPAY: "unionpay",
  MAESTRO: "maestro",
  UNKNOWN: "unknown",
} as const;

export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];

// Configuración de tarjetas
export const CARD_CONFIG = {
    PATTERNS: {
      [CARD_TYPES.VISA]: /^4[0-9]{12}(?:[0-9]{3})?$/,
      [CARD_TYPES.MASTERCARD]: /^(5[1-5]|2[2-7])[0-9]{14}$/,
      [CARD_TYPES.AMEX]: /^3[47][0-9]{13}$/,
      [CARD_TYPES.DISCOVER]: /^(6011|65|64[4-9]|622)[0-9]{12,15}$/,
      [CARD_TYPES.DINERS]: /^3(?:0[0-5]|[68][0-9])[0-9]{11,13}$/,
      [CARD_TYPES.JCB]: /^35[0-9]{14,16}$/,
      [CARD_TYPES.UNIONPAY]: /^(62|88)[0-9]{14,17}$/,
      [CARD_TYPES.MAESTRO]: /^(5018|5020|5038|6304|6759|676[1-3])[0-9]{8,15}$/,
      [CARD_TYPES.UNKNOWN]: /.*/,
    },
    LENGTHS: {
      [CARD_TYPES.VISA]: [13, 16, 19],
      [CARD_TYPES.MASTERCARD]: [16],
      [CARD_TYPES.AMEX]: [15],
      [CARD_TYPES.DISCOVER]: [16, 19],
      [CARD_TYPES.DINERS]: [14, 16],
      [CARD_TYPES.JCB]: [16],
      [CARD_TYPES.UNIONPAY]: [16, 17, 18, 19],
      [CARD_TYPES.MAESTRO]: [12, 13, 14, 15, 16, 17, 18, 19],
      [CARD_TYPES.UNKNOWN]: [],
    },
    FORMATS: {
      [CARD_TYPES.AMEX]: [[4, 6, 5]], // XXXX XXXXXX XXXXX
      DEFAULT: [[4, 4, 4, 4]], // XXXX XXXX XXXX XXXX
    },
  } as const;

  export const useCardDetection = () => {
    const [cardType, setCardType] = useState<CardType>(CARD_TYPES.UNKNOWN);
    const [cardLogo, setCardLogo] = useState<string>("/assets/icons/generic/card-generic.svg");
  
    // Verificación Luhn optimizada
    const luhnCheck = useCallback((cardNumber: string): boolean => {
      const digits = cardNumber.replace(/\D/g, "").split("").map(Number);
      return digits
        .reverse()
        .map((digit, index) => (index % 2 ? digit * 2 : digit))
        .map((digit) => (digit > 9 ? digit - 9 : digit))
        .reduce((sum, digit) => sum + digit, 0) % 10 === 0;
    }, []);
  
    // Validador de tarjeta
    const validateCard = useCallback((cardNumber: string): { isValid: boolean; type: CardType } => {
      const cleaned = cardNumber.replace(/\D/g, "");
      if (!cleaned) return { isValid: false, type: CARD_TYPES.UNKNOWN };
  
      // Detectar tipo
      const type = (Object.entries(CARD_CONFIG.PATTERNS).find(([_, pattern]) => 
        pattern.test(cleaned)
      )?.[0] as CardType) || CARD_TYPES.UNKNOWN;
  
      // Validar longitud
      const validLength = CARD_CONFIG.LENGTHS[type]?.includes(cleaned.length);
  
      // Validar algoritmo Luhn solo si la longitud es válida
      const isValid = validLength && luhnCheck(cleaned);
  
      return { isValid, type };
    }, [luhnCheck]);
  
    // Memoized detectCardType que ahora solo maneja el estado interno
    const detectCardType = useCallback((cardNumber: string): CardType => {
      const { type } = validateCard(cardNumber);
      if (type !== cardType) {
        setCardType(type);
        setCardLogo(`/assets/icons/cards/${type}.svg`);
      }
      return type;
    }, [cardType, validateCard]);
  
    return {
      cardType,
      cardLogo,
      detectCardType,
      validateCard
    };
  };