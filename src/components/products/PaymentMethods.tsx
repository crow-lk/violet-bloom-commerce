import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentMethods() {
  const { methods, isLoading } = usePaymentMethods();

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-4 mt-4">
        <Skeleton className="h-4 w-48 mb-3" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!methods.length) return null;

  return (
    <div className="glass rounded-xl p-4 mt-4">
      <p className="font-medium text-sm mb-3">Payment Methods</p>
      <div className="flex flex-wrap gap-2">
        {methods.map((method) => (
          <div key={method.id} className="glass rounded-lg px-3 py-1 flex items-center gap-2">
            {method.icon_url && (
              <img src={method.icon_url} alt={method.name} className="h-20 w-20 object-contain" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}