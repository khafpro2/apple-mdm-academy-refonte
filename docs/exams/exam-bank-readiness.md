# Exam Bank Readiness

Generated for the Phase 4 exam-engine hardening pass. Incomplete banks must not launch a full-length simulation by silently duplicating questions; the engine reduces the attempt to available unique questions and surfaces a warning.

| Exam | Available | Internal target | Deficit | Domains covered | Duplicates | Needs-review / no source | Bias / difficulty notes | Recommendation |
| --- | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| Apple Device Support | 10 | 80 | 70 | Basic macOS support, Recovery, FileVault, 802.1X, Safe Mode, disk repair | Audit checks duplicate IDs | No per-question official source metadata yet | Small bank, mostly basic support questions | Keep catalog visible, but treat simulation as preparation in progress until at least 80 unique sourced questions exist. |
| Intune Apple | 35 | 60 | 25 | ABM, ADE, APNs, compliance, Conditional Access, Platform SSO, Defender, managed apps, troubleshooting | Audit checks duplicate IDs | No per-question official source metadata yet | Good breadth, insufficient count for full target | Expand with sourced Intune/macOS scenarios before advertising a full 60-question simulation. |
| Apple Enterprise Expert | 65 | 100 | 35 | Deployment, DDM, security, Platform SSO, compliance, architecture scenarios | Audit checks duplicate IDs | Internal academy exam; official equivalent not asserted | Advanced bank still below target | Mark as internal and keep simulation reduced until 100 unique questions exist. |

## Publication Rules

- Full simulation is allowed only when the selected unique pool reaches the configured target.
- If the unique pool is smaller than the target, `selectExamQuestions` returns fewer questions and emits a warning.
- Disabled questions are excluded from selection.
- `needs-review` questions are counted in the selection report so they can be audited before publication.
- Multi-select scoring is all-or-nothing: partial answers do not earn partial credit in this V1 engine.
