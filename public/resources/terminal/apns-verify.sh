#!/bin/bash
# Vérification certificat APNs MDM
echo "=== OpenSSL certificat APNs ==="
openssl x509 -in apns.pem -noout -subject -dates 2>/dev/null || echo "Placez apns.pem dans le répertoire courant"
echo "=== Expiration ==="
openssl x509 -in apns.pem -noout -enddate 2>/dev/null
