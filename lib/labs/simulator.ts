import { expertLabSlugs } from "@/lib/data/advanced-tracks/admin-stats";

/** Sorties simulées pour labs experts — environnement sandbox sans instance réelle */

export type LabSimulation = {
  title: string;
  command?: string;
  output: string;
};

const SIMULATIONS: Record<string, Record<string, LabSimulation>> = {
  "jamf-api": {
    oauth: {
      title: "Token OAuth2 simulé",
      command: 'curl -X POST "$JAMF_URL/api/oauth/token" -d "client_id=..."',
      output: `HTTP/1.1 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`,
    },
    inventory: {
      title: "Inventaire API simulé",
      command: 'curl -H "Authorization: Bearer $TOKEN" "$JAMF_URL/api/v1/computers-inventory?page-size=2"',
      output: `{
  "totalCount": 512,
  "results": [
    { "id": "101", "general": { "name": "MBP-PILOT-01", "lastIpAddress": "10.0.1.42" },
      "operatingSystem": { "version": "14.5" } },
    { "id": "102", "general": { "name": "MBP-PILOT-02" },
      "operatingSystem": { "version": "15.0" } }
  ]
}`,
    },
    "smart-group": {
      title: "Smart Group créé",
      command: 'curl -X POST .../computer-groups -d \'{"name":"LAB-API-SG","isSmart":true}\'',
      output: `{ "id": 8842, "name": "LAB-API-SG", "isSmart": true, "criteria": "Operating System Version >= 14.0" }`,
    },
  },
  "jamf-webhooks": {
    configure: {
      title: "Webhook configuré",
      output: `Webhook ID: 12
Events: ComputerAddedToDEP, SmartGroupComputerMembershipChange
URL: https://hooks.example.com/jamf (200 OK on test)`,
    },
    trigger: {
      title: "Payload reçu",
      output: `{
  "event": "SmartGroupComputerMembershipChange",
  "groupId": 8842,
  "computerId": 101,
  "timestamp": "2026-06-05T14:22:01Z"
}`,
    },
  },
  "declarative-device-management": {
    declaration: {
      title: "Declaration Software Update",
      output: `Status: Active
Declaration: com.apple.configuration.softwareupdate
Defer major updates: 30 days
Device report: compliant`,
    },
  },
  "intune-conditional-access": {
    "test-fail": {
      title: "Accès bloqué — non conforme",
      output: `Sign-in blocked
Error: AADSTS53003 — Access blocked by Conditional Access
Device compliance: FileVault OFF`,
    },
    "test-pass": {
      title: "Accès autorisé",
      output: `Sign-in success
Device compliance: compliant
MFA: satisfied`,
    },
  },
};

export function isExpertLabWithSimulator(labSlug: string): boolean {
  return expertLabSlugs.includes(labSlug) && Boolean(SIMULATIONS[labSlug]);
}

export function getLabSimulation(labSlug: string, stepId: string): LabSimulation | undefined {
  return SIMULATIONS[labSlug]?.[stepId];
}
