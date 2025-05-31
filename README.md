# proj1

A modern Next.js application built with:

- ⚡ **Next.js 14** - React framework with App Router
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful and accessible component library
- 📝 **TypeScript** - Type-safe JavaScript
- 🔧 **ESLint** - Code linting

## Getting Started

### Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Adding shadcn/ui Components

```bash
# Add a specific component
npm run ui button

# List all available components
npm run ui:list

# Or use npx directly
npx shadcn@latest add [component-name]
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run ui` - Add shadcn/ui components
- `npm run ui:list` - List available components

## Project Structure

```
proj1/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   └── lib/
│       └── utils.ts
├── components.json
├── tailwind.config.ts
└── package.json
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deployment

Deploy easily on [Vercel](https://vercel.com/new) or any other platform that supports Next.js.
