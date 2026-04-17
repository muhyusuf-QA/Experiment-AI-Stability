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

Test prerelease membutuhkan 2 environment variable tambahan:

- `ASKLUMIA_PRE_EMAIL`
- `ASKLUMIA_PRE_PASSWORD`

Opsional:

- `PW_HEADLESS`
  - default: `true`
  - set `false` jika ingin melihat browser
- `PW_ITERATION_START`
  - default: `1`
- `PW_ITERATION_END`
  - default: `1`

Untuk lokal, repo ini juga mendukung file:

- `.env.local`

File ini di-ignore oleh Git, jadi aman untuk menyimpan credential lokal Anda.

## Menjalankan Lokal

### Opsi 1: `.env.local` yang direkomendasikan

1. Buka `.env.local`
2. Isi:

```dotenv
ASKLUMIA_EMAIL=email-anda
ASKLUMIA_PASSWORD=password-anda
ASKLUMIA_PRE_EMAIL=email-prerelease-anda
ASKLUMIA_PRE_PASSWORD=password-prerelease-anda
PW_HEADLESS=true
PW_ITERATION_START=1
PW_ITERATION_END=1
```

### Opsi 2: PowerShell sementara

```powershell
$env:ASKLUMIA_EMAIL="email-anda"
$env:ASKLUMIA_PASSWORD="password-anda"
$env:ASKLUMIA_PRE_EMAIL="email-prerelease-anda"
$env:ASKLUMIA_PRE_PASSWORD="password-prerelease-anda"
```

### List test

```bash
npm run test:list
```

### Jalankan suite login

```bash
npm run test:login
```

### Jalankan suite login prerelease

```bash
npm run test:login:pre
```

### Jalankan browser secara headful

```powershell
$env:PW_HEADLESS="false"
npm run test:login
```

### Jalankan iterasi tertentu saja

Contoh hanya iterasi 1:

```powershell
$env:PW_ITERATION_START="1"
$env:PW_ITERATION_END="1"
npm run test:login
```

## Iterasi Lokal vs CI

- Lokal default menjalankan `1` iterasi penuh
- CI GitHub Actions juga menjalankan `1` iterasi penuh
- `PW_ITERATION_START` dan `PW_ITERATION_END` tetap tersedia jika Anda ingin override manual

## GitHub Actions

Workflow tersedia di:

- `.github/workflows/playwright.yml`
- `.github/workflows/playwright-pre.yml`

Trigger:

- `playwright.yml`
  - manual via `workflow_dispatch`
- `playwright-pre.yml`
  - manual via `workflow_dispatch`

Secrets yang wajib diset di GitHub:

- `ASKLUMIA_EMAIL`
- `ASKLUMIA_PASSWORD`
- `ASKLUMIA_PRE_EMAIL`
- `ASKLUMIA_PRE_PASSWORD`
