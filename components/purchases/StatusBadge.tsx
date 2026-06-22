import { Badge } from '@/components/ui/Badge'

type BadgeTone = 'accent' | 'neutral' | 'danger' | 'amber' | 'violet'

interface StatusBadgeProps {
  status: string
}

const STATUS_MAP: Record<string, { label: string; tone: BadgeTone }> = {
  pago:     { label: 'Pago',       tone: 'accent'  },
  pendente: { label: 'Aguardando', tone: 'amber'   },
  enviado:  { label: 'Enviado',    tone: 'violet'  },
  entregue: { label: 'Entregue',   tone: 'accent'  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, tone: 'neutral' as BadgeTone }

  return (
    <Badge tone={config.tone} dot={status === 'pendente'}>
      {config.label}
    </Badge>
  )
}
