import React, { useState, useEffect } from 'react';
import { PaymentMethod, Language } from '../types';
import { translations } from '../utils/i18n';
import { Smartphone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface UssdPromptModalProps {
  isOpen: boolean;
  method: 'momo' | 'orange';
  phoneNumber: string;
  amountFormatted: string;
  language: Language;
  onSuccess: (txId: string) => void;
  onCancel: () => void;
}

export const UssdPromptModal: React.FC<UssdPromptModalProps> = ({
  isOpen,
  method,
  phoneNumber,
  amountFormatted,
  language,
  onSuccess,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [state, setState] = useState<'prompt' | 'authorizing' | 'success' | 'failed'>('prompt');
  const [errorMessage, setErrorMessage] = useState('');
  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setState('prompt');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMomo = method === 'momo';
  const brandName = isMomo ? 'MTN Mobile Money Cameroun (*126#)' : 'Orange Money Cameroun (#150#)';
  const brandBg = isMomo ? 'bg-[#FFCC00] text-[#1A1A1A]' : 'bg-[#FF7900] text-white';

  const handleKeyPress = (num: string) => {
    if (pin.length < 5) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleConfirm = (forceFail: boolean = false) => {
    if (pin.length < 4) {
      setErrorMessage(
        language === 'fr'
          ? 'Veuillez saisir au moins 4 chiffres de votre code secret.'
          : 'Please enter at least 4 digits for your secret PIN.'
      );
      return;
    }

    setState('authorizing');
    setErrorMessage('');

    setTimeout(() => {
      if (forceFail) {
        setState('failed');
        setErrorMessage(
          language === 'fr'
            ? 'Échec opérateur : Solde de votre compte Mobile Money insuffisant ou délai expiré.'
            : 'Operator failure: Insufficient mobile wallet balance or session timeout.'
        );
      } else {
        const randomId = `${isMomo ? 'MTN' : 'OM'}-CM-${Math.floor(10000000 + Math.random() * 90000000)}`;
        setState('success');
        setTimeout(() => {
          onSuccess(randomId);
        }, 1500);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Handset / USSD Overlay Frame */}
      <div className="w-full max-w-sm bg-[#111111] text-white rounded-lg shadow-2xl overflow-hidden border border-white/10 font-mono">
        {/* USSD Dialog Title Bar */}
        <div className={`px-4 py-3 font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-between ${brandBg}`}>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>{brandName}</span>
          </div>
          <span className="text-[10px] font-normal opacity-90">+237 {phoneNumber}</span>
        </div>

        {/* USSD Prompt Message Body */}
        <div className="p-5 font-sans">
          {state === 'prompt' && (
            <>
              <div className="bg-[#1C1C1E] p-3.5 rounded-sm border border-white/5 text-xs text-white/90 leading-relaxed mb-4">
                <p className="font-semibold text-white mb-1">
                  MBOA LUXURY COLLECTION
                </p>
                <p>
                  {isMomo
                    ? `Autorisation de paiement marchand de ${amountFormatted} initiée par Mboa Collection SA.`
                    : `Demande de débit Orange Money de ${amountFormatted} pour votre séjour hôtelier.`}
                </p>
                <p className="mt-2 text-[#FFCC00] font-medium text-[11px]">
                  {language === 'fr'
                    ? 'Tapez votre code secret PIN pour confirmer :'
                    : 'Enter your secret PIN to authorize:'}
                </p>
              </div>

              {/* PIN Display (Masked) */}
              <div className="mb-4">
                <div className="h-11 bg-black border border-white/20 rounded-xs flex items-center justify-center gap-3 px-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${
                        pin.length > index ? 'bg-white scale-110' : 'border border-white/30'
                      }`}
                    />
                  ))}
                </div>
                {errorMessage && (
                  <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 font-sans">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </p>
                )}
              </div>

              {/* Simulated Numeric USSD Keypad */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeyPress(digit)}
                    className="h-10 bg-[#2C2C2E] hover:bg-[#3A3A3C] active:bg-[#48484A] text-white font-medium text-base rounded-xs transition-colors cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={onCancel}
                  className="h-10 bg-[#2C2C2E]/60 text-xs text-white/60 hover:text-white rounded-xs transition-colors cursor-pointer"
                >
                  {t.ussdModal.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="h-10 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white font-medium text-base rounded-xs transition-colors cursor-pointer"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="h-10 bg-[#2C2C2E]/60 text-xs text-white/80 hover:text-white rounded-xs transition-colors cursor-pointer"
                >
                  ←
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirm(false)}
                  disabled={pin.length < 4}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase rounded-xs transition-all cursor-pointer ${
                    pin.length >= 4
                      ? `${brandBg} hover:opacity-90 shadow-xs`
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {t.ussdModal.confirmPin}
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirm(true)}
                  title="Simulate insufficient balance or timeout failure for testing"
                  className="px-3 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-700/50 text-red-200 text-[10px] rounded-xs cursor-pointer"
                >
                  {language === 'fr' ? 'Tester Échec' : 'Test Fail'}
                </button>
              </div>
            </>
          )}

          {state === 'authorizing' && (
            <div className="py-8 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-[#FFCC00] animate-spin mx-auto" />
              <p className="text-xs text-white/90">
                {t.ussdModal.authorizing}
              </p>
              <p className="text-[10px] text-white/50">
                Liaison passerelle sécurisée MTN / Orange Cameroun...
              </p>
            </div>
          )}

          {state === 'success' && (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-white">
                {t.ussdModal.statusSuccess}
              </p>
              <p className="text-xs text-white/70">
                Génération de votre reçu officiel en cours...
              </p>
            </div>
          )}

          {state === 'failed' && (
            <div className="py-4 space-y-4">
              <div className="bg-red-950/60 border border-red-800 p-4 rounded-xs text-xs text-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setState('prompt')}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold text-white rounded-xs cursor-pointer"
                >
                  {language === 'fr' ? 'Réessayer' : 'Retry'}
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 py-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-xs font-semibold text-white/70 rounded-xs cursor-pointer"
                >
                  {t.ussdModal.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
