#!/bin/bash
set -e

echo "=== LP NSM 02 - Deploy ==="
echo ""

# 1. Testes
echo "[1/5] Testes..."
npm run test
echo "Testes OK"

# 2. Lint
echo "[2/5] Lint..."
npm run lint
echo "Lint OK"

# 3. Build
echo "[3/5] Build..."
npm run build
echo "Build OK"

# 4. Deploy
echo "[4/5] Deploy para Vercel..."
npx vercel --yes --prod
echo "Deploy OK"

# 5. Health check
echo "[5/5] Health check..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://nutraseumarketing.com.br/lp-02)
if [ "$STATUS" = "200" ]; then
  echo "LP respondendo: $STATUS OK"
else
  echo "ALERTA: LP retornou $STATUS"
  exit 1
fi

echo ""
echo "Deploy concluido com sucesso!"
