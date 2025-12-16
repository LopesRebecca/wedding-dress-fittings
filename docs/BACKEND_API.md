# Backend API Documentation

## Endpoints Esperados

O frontend espera os seguintes endpoints do backend:

### Serviços

#### GET /api/services
Retorna lista de serviços disponíveis.

**Response:**
```json
[
  {
    "id": "noiva",
    "label": "Noiva",
    "icon": "💍",
    "durationMinutes": 120,
    "isActive": true
  },
  {
    "id": "debutante",
    "label": "Debutante",
    "icon": "👑",
    "durationMinutes": 60,
    "isActive": true
  }
]
```

#### GET /api/services/:id
Retorna um serviço específico.

---

### Disponibilidade

#### POST /api/availability
Busca datas e horários disponíveis para um serviço.

**Request Body:**
```json
{
  "serviceId": "noiva",
  "month": 0,
  "year": 2025
}
```

**Response:**
```json
{
  "availableDates": [
    {
      "date": "2025-01-15",
      "dayOfWeek": "Quarta",
      "timeSlots": [
        { "id": "2025-01-15-09:00", "time": "09:00", "available": true },
        { "id": "2025-01-15-11:00", "time": "11:00", "available": false }
      ]
    }
  ],
  "serviceInfo": {
    "id": "noiva",
    "label": "Noiva",
    "icon": "💍",
    "durationMinutes": 120,
    "isActive": true
  }
}
```

#### GET /api/availability/:date?serviceId=xxx
Retorna horários disponíveis para uma data específica.

**Response:**
```json
{
  "timeSlots": ["09:00", "11:00", "14:00", "16:00"]
}
```

---

### Agendamentos

#### POST /api/bookings
Cria um novo agendamento.

**Request Body:**
```json
{
  "name": "Maria Silva",
  "phone": "(21) 99999-9999",
  "serviceId": "noiva",
  "otherService": null,
  "color": "Branco",
  "date": "2025-01-15",
  "time": "09:00",
  "hasCompanions": true,
  "companionsCount": 2
}
```

**Response:**
```json
{
  "id": "booking-123456",
  "status": "pending",
  "message": "Agendamento recebido! Aguarde confirmação pelo WhatsApp.",
  "createdAt": "2025-01-10T10:30:00Z"
}
```

#### GET /api/bookings/:id
Retorna detalhes de um agendamento.

---

### Configurações

#### GET /api/config
Retorna configurações do estabelecimento.

**Response:**
```json
{
  "name": "Atelier Carvalho",
  "phone": "(21) 98249-5227",
  "whatsappNumber": "5521982495227",
  "address": "R. Cel. Costa Pereira, 100, Itaguaí - RJ",
  "instagram": "https://www.instagram.com/ateliecarvalho.oficial",
  "workingHours": {
    "start": "09:00",
    "end": "18:00"
  },
  "workingDays": [1, 2, 3, 4, 5, 6]
}
```

---

## Estrutura de Tipos (TypeScript)

Todos os tipos estão definidos em `src/types/index.ts`:

- `ServiceType` - Tipo de serviço
- `TimeSlot` - Horário disponível
- `AvailableDate` - Data com horários
- `BookingFormData` - Dados do formulário
- `BookingResponse` - Resposta de agendamento
- `EstablishmentConfig` - Configurações

---

## Modo Mock

Para desenvolvimento sem backend, defina `VITE_USE_MOCK=true` no `.env`.
O sistema usará dados simulados definidos em `src/services/bookingService.ts`.
