import { CreditCard, Smartphone } from 'lucide-react';
function PaymentMethodSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const methods = [
    { id: 'momo', label: 'Mobile Money', icon: Smartphone, description: 'Paiement via MTN Money' },
    { id: 'card', label: 'Carte Bancaire', icon: CreditCard, description: 'Visa, Mastercard' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {methods.map((method) => {
        const isSelected = value === method.id;
        const Icon = method.icon;
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
              ${isSelected 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-muted bg-background hover:border-primary/50'
              }
            `}
          >
            <Icon className="h-8 w-8" />
            <span className="font-medium">{method.label}</span>
            <span className="text-xs text-muted-foreground">{method.description}</span>
          </button>
        );
      })}
    </div>
  );
}

export { PaymentMethodSelector }