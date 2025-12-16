# 💍 Atelier Carvalho - Sistema de Agendamento

Sistema de agendamento de provas de vestidos para noivas, debutantes, madrinhas e daminhas.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)

## ✨ Funcionalidades

- 📅 **Agendamento de Provas** - Seleção de data e horário disponíveis
- 👗 **Tipos de Vestido** - Noiva, Debutante, Madrinha, Daminha e outros
- ⏰ **Horários Dinâmicos** - Intervalos de 2h para noivas, 1h para demais
- 👥 **Acompanhantes** - Opção para informar quantas pessoas irão junto
- 📱 **Integração WhatsApp** - Envio automático da solicitação
- 🎨 **Design Responsivo** - Interface elegante em qualquer dispositivo
- 🌙 **Modo Escuro** - Tema claro e escuro

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização utility-first
- **shadcn/ui** - Componentes acessíveis
- **Framer Motion** - Animações
- **React Query** - Gerenciamento de estado server-side
- **React Router** - Navegação SPA

### Arquitetura
- **Atomic Design** - Estrutura de componentes (atoms, molecules, organisms, templates)
- **Service Layer** - Camada de serviços para API
- **Custom Hooks** - Hooks reutilizáveis para lógica de negócio

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── atoms/          # Componentes básicos (IconLabel, LoadingSpinner, etc)
│   ├── molecules/      # Componentes compostos (FormField, DatePicker, etc)
│   ├── organisms/      # Componentes complexos (BookingForm, ServiceSelector)
│   ├── templates/      # Layouts de página
│   └── ui/             # Componentes shadcn/ui
├── hooks/              # Hooks customizados
├── services/           # Comunicação com API
├── types/              # Interfaces TypeScript
├── config/             # Configurações
├── lib/                # Utilitários
└── pages/              # Páginas da aplicação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou bun

### Instalação

```bash
# Clone o repositório
git clone https://github.com/LopesRebecca/wedding-dress-fittings.git

# Entre na pasta
cd wedding-dress-fittings

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# URL da API do Backend
VITE_API_URL=http://localhost:3001/api

# Usar dados mock (true para desenvolvimento sem backend)
VITE_USE_MOCK=true
```

## 🔌 Integração com Backend

O sistema está preparado para integração com backend. Consulte a documentação em `docs/BACKEND_API.md` para:

- Endpoints esperados
- Estrutura de dados
- Exemplos de requisições/respostas

### Modo Mock
Por padrão, o sistema usa dados simulados. Para conectar a um backend real:
1. Configure `VITE_API_URL` com a URL da API
2. Defina `VITE_USE_MOCK=false`

## 📦 Build para Produção

```bash
# Gera build otimizado
npm run build

# Preview do build
npm run preview
```

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificação de código |

## 📄 Licença

Este projeto é privado e de uso exclusivo do Atelier Carvalho.

---

Desenvolvido com 💛 para o Atelier Carvalho
