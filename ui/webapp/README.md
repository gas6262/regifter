# Regift UI

Frontend-only React prototype for a gift-card regifting product.

## What it is

This prototype explores a flow where a user starts with an already-opened gift card, uses enough of the current balance to shape a clean remainder, and then sends that remainder as a new Amazon gift card.

Current UI includes:
- landing/hero section
- current gift card balance form
- rounding logic preview
- recipient details form
- outbound Amazon gift card preview
- responsive layout

## Tech stack

- React
- TypeScript
- Vite
- Docker
- Nginx

## Local setup

### 1. Go to the project directory

```bash
cd ui/webapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the local dev server

```bash
npm run dev
```

Vite will print a local URL, usually:

```bash
http://localhost:4173
```

Open that in your browser.

## Production build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Docker

Build the image:

```bash
docker build -t regift-ui ./ui/webapp
```

Run it locally:

```bash
docker run --rm -p 8080:8080 regift-ui
```

Then open:

```bash
http://localhost:8080
```

This image is suitable for container-based deployment targets such as GCP Cloud Run or other container hosting.

## Project structure

```text
ui/webapp/
├── Dockerfile
├── nginx.conf
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── styles.css
    └── data/
        └── mock.ts
```

## Business-rule assumption used in the UI

I interpreted the initial product rule this way:
- start from the currently available balance on an opened gift card
- compute the giftable amount by rounding down to the nearest $5
- if that result would leave less than $2 difference, reduce by one additional $5
- only show the result as eligible when the new gift amount is at least $5

Example:
- current balance: `$36.72`
- suggested new gift card amount: `$30`
- amount to use first on original card: `$6.72`

If that rule is not quite right, the UI can be adjusted quickly.

## Notes

- This is UI only.
- No authentication, payment processing, card validation, or Amazon gift card issuance is implemented.
- All data is mocked in the frontend.
