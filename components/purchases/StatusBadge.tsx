import { Badge } from '@/components/ui/Badge'

type PaymentStatus = 'paid' | 'pending' | 'refunded' | string

interface StatusBadgeProps {
  status: PaymentStatus
}

const STATUS_MAP: Record<string, { label: string; tone: 'accent' | 'amber' | 'danger' | 'neutral' }> = {
  paid:     { label: 'Pago',       tone: 'accent'  },
  pending:  { label: 'Aguardando', tone: 'amber'   },
  refunded: { label: 'Estornado',  tone: 'danger'  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, tone: 'neutral' as const }

  return (
    <Badge tone={config.tone} dot={status === 'pending'}>
      {config.label}
    </Badge>
  )
}
