# Asklumia Automation TS

Repo ini berisi automation test Playwright untuk flow Asklumia.

## Prasyarat

- Node.js
- npm

## Install

```bash
npm ci
npx playwright install --with-deps chromium
```

## Environment Variable

Test login membutuhkan 2 environment variable:

- `ASKLUMIA_EMAIL`
- `ASKLUMIA_PASSWORD`

Opsional:

- `PW_HEADLESS`
  - default: `true`
  - set `false` jika ingin melihat browser
- `PW_ITERATION_START`
  - default: `1`
- `PW_ITERATION_END`
  - default: `5`

## Menjalankan Lokal

### PowerShell

```powershell
$env:ASKLUMIA_EMAIL="email-anda"
$env:ASKLUMIA_PASSWORD="password-anda"
```

### List test

```bash
npm run test:list
```

### Jalankan suite login

```bash
npm run test:login
```

### Jalankan browser secara headful

```powershell
$env:PW_HEADLESS="false"
npm run test:login
```

### Jalankan iterasi tertentu saja

Contoh hanya iterasi 3:

```powershell
$env:PW_ITERATION_START="3"
$env:PW_ITERATION_END="3"
npm run test:login
```

## Iterasi Lokal vs CI

- Lokal default menjalankan `5` iterasi penuh
- CI GitHub Actions membagi `5` iterasi menjadi `5` job terpisah
- Setiap job CI hanya menjalankan `1` iterasi dengan:
  - `PW_ITERATION_START`
  - `PW_ITERATION_END`

Dengan cara ini, total coverage tetap `5` iterasi, tetapi runtime CI lebih realistis.

## GitHub Actions

Workflow tersedia di:

- `.github/workflows/playwright.yml`

Trigger:

- manual via `workflow_dispatch`
- terjadwal setiap `1:00 WIB`

Secrets yang wajib diset di GitHub:

- `ASKLUMIA_EMAIL`
- `ASKLUMIA_PASSWORD`
