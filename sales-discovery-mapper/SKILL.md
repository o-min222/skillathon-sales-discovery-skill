---
name: sales-discovery-mapper
description: Use this skill when the user asks to analyze B2B sales communications, map an opportunity into BANT and MEDDPICC, identify stakeholders and evidence, build an ontology-style account dashboard, or create follow-up sales strategy from emails, meeting notes, transcripts, CRM notes, chat logs, summaries, or audio-derived text.
---

# Sales Discovery Mapper

Analyze raw B2B sales communications at the Opportunity level and produce dashboard-ready structured data. The primary trigger phrase is:

```text
세일즈 분석을 진행해줘.
```

Example prompt:

```text
세일즈 분석을 진행해줘.

아래 이메일, 회의록, CRM 메모를 Opportunity 단위로 분석해줘.
고객사/이해관계자/BANT/MEDDPICC/온톨로지/Raw 입력 요약/후속 전략을 대시보드용 JSON으로 구성하고, 확인된 사실과 추론과 미확인 항목을 분리해줘.
```

## Inputs

Accept any mix of:

- Email threads
- Meeting notes
- Call transcripts
- CRM notes
- Slack/KakaoTalk/internal chat notes
- Attachment summaries
- Audio files or audio descriptions, when STT is available

Inputs may be incomplete, messy, or missing standard CRM fields. Preserve source context and mark uncertainty instead of over-normalizing.

## Workflow

1. Split inputs into source records with type, date, channel, participants, and raw excerpt.
2. Normalize communications into Opportunity-level evidence.
3. Identify Account, Opportunity, Stakeholders, Departments, Pain Points, Business Metrics, Budget Signals, Decision Criteria, Decision Process, Competitors, Risks, Next Actions, and Evidence.
4. Build ontology nodes and edges that connect entities to communications and evidence.
5. Create BANT cards for Budget, Authority, Need, and Timeline.
6. Create MEDDPICC cards for Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, and Competition.
7. For every BANT and MEDDPICC field, separate:
   - `confirmed`: explicitly supported by evidence
   - `inferred`: likely but not directly confirmed
   - `unknown`: not yet available
8. Attach evidence IDs, source excerpts, confidence, freshness, changeability, and sensitive-data flags.
9. Generate follow-up strategy:
   - Must-know questions for the customer
   - Deal closing plan
   - Next meeting agenda
   - Follow-up email strategy
   - Stakeholder-specific approach
10. If input is insufficient, still produce the analysis and place missing items in `unknown` with concrete discovery questions.

## Freshness Rules

Use the source date when available.

- `fresh`: 0-14 days old
- `watch`: 15-45 days old
- `stale`: 46-90 days old
- `revalidate_required`: more than 90 days old or no reliable date for volatile information

Volatile fields include budget, timeline, decision process, competitor status, champion strength, legal/procurement status, and stakeholder influence.

## Sensitive Data Handling

Do not remove sensitive data by default for personal work use. Detect and label it so dashboards can show visual cues near the affected value.

Use:

```json
{
  "pii_detected": true,
  "sensitive_items": ["personal_name", "email", "phone", "budget", "contract_terms"],
  "display_badges": ["민감정보"]
}
```

## Output Requirements

Return dashboard-ready JSON first, then a concise human-readable summary. The JSON must include:

- `metadata`
- `account`
- `opportunity`
- `communications`
- `stakeholders`
- `bant`
- `meddpicc`
- `ontology`
- `strategy`
- `risks`
- `data_quality`

See [`references/schema.md`](references/schema.md) for schema guidance and [`references/dashboard-output-example.json`](references/dashboard-output-example.json) for a complete example.

Each communication record should preserve both:

- `raw_excerpt`: representative original text or transcript excerpt
- `source_summary`: concise summary of what the raw source contributes to the sales analysis

## Dashboard Card Guidance

Each BANT and MEDDPICC card should show:

- Status: `confirmed`, `partial`, `unknown`, or `risk`
- Top evidence excerpt
- Confidence score
- Freshness badge
- Changeability badge
- Sensitive-data badge when relevant
- Missing information
- Next discovery question

Use ontology cards for Account, Opportunity, Stakeholder, Pain Point, Metric, Decision Event, Competitor, Risk, and Next Action. Each card should link back to evidence IDs.

Include a Raw Input section in dashboard-oriented outputs so users can inspect original inputs beside generated summaries and evidence.

## Verification

Before finalizing, check:

- BANT has exactly 4 categories.
- MEDDPICC has exactly 8 categories.
- Confirmed claims have evidence IDs.
- Inferred claims have rationale and confidence.
- Unknown fields include a next question or strategy.
- Ontology edges reference existing node IDs.
- Sensitive data is flagged near affected data.
- Freshness and changeability are present for volatile fields.
- Raw input records include both `raw_excerpt` and `source_summary`.
- The dashboard-oriented output lets users inspect raw inputs, summaries, and extracted evidence together.
