# Dashboard Output Schema

This schema is intentionally dashboard-oriented rather than tied to a specific CRM.

## Top-Level Shape

```json
{
  "metadata": {},
  "account": {},
  "opportunity": {},
  "communications": [],
  "stakeholders": [],
  "bant": {},
  "meddpicc": {},
  "ontology": {
    "nodes": [],
    "edges": []
  },
  "strategy": {},
  "risks": [],
  "data_quality": {}
}
```

## Evidence-Aware Field

Use this object for BANT, MEDDPICC, risks, and strategic claims.

```json
{
  "status": "confirmed | partial | unknown | risk",
  "confirmed": [],
  "inferred": [],
  "unknown": [],
  "evidence_ids": [],
  "confidence": 0.0,
  "freshness": "fresh | watch | stale | revalidate_required",
  "changeability": "low | medium | high",
  "sensitive": {
    "pii_detected": false,
    "sensitive_items": [],
    "display_badges": []
  },
  "next_questions": []
}
```

## Communication Record

Each communication item should keep the original source visible and auditable.

```json
{
  "id": "comm_email_001",
  "type": "email_thread | meeting_notes | transcript_excerpt | crm_note | internal_chat",
  "date": "YYYY-MM-DD",
  "channel": "email | video_meeting | demo_call | crm | slack",
  "title": "Source title",
  "participants": [],
  "summary": "Short normalized summary",
  "source_summary": "What this raw source contributes to the sales analysis",
  "raw_excerpt": "Representative original raw text",
  "sensitive": {}
}
```

Dashboard UIs should render communication records as inspectable Raw Input cards. The card summary should use `source_summary`; the detail view should show `raw_excerpt`, participants, sensitive-data badges, and evidence extracted from that source.

## BANT Categories

- `budget`
- `authority`
- `need`
- `timeline`

## MEDDPICC Categories

- `metrics`
- `economic_buyer`
- `decision_criteria`
- `decision_process`
- `paper_process`
- `identify_pain`
- `champion`
- `competition`

## Ontology Node Types

- `account`
- `opportunity`
- `stakeholder`
- `department`
- `communication`
- `pain_point`
- `business_metric`
- `budget_signal`
- `decision_criteria`
- `decision_process`
- `competitor`
- `risk`
- `next_action`
- `evidence`

## Edge Types

- `owns`
- `participated_in`
- `mentioned`
- `supports`
- `influences`
- `blocks`
- `requires_validation`
- `competes_with`
- `next_step_for`

## Card UI Guidance

Dashboard cards should be compact and evidence-first.

- Use a colored status rail or badge for `confirmed`, `partial`, `unknown`, and `risk`.
- Show a visible `민감정보` badge beside sensitive values.
- Show freshness next to the claim, not only at the bottom of the page.
- Make evidence expandable so a reviewer can audit why the claim exists.
- Keep unknown items visible because they drive the next sales motion.
