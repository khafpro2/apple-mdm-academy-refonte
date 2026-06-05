#!/bin/bash
# Statut FileVault macOS
echo "=== FileVault status ==="
fdesetup status
echo "=== Escrow configuré (MDM) ==="
profiles list -type configuration | grep -i filevault || echo "Profil FileVault non détecté"
