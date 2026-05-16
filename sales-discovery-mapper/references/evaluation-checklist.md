# Evaluation Checklist

Use this checklist before submitting or demoing the Skill.

## Minimum Success Criteria

- [ ] Analysis is organized around an Opportunity, while still linking Account, stakeholders, and communications.
- [ ] BANT has Budget, Authority, Need, and Timeline.
- [ ] MEDDPICC has Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, and Competition.
- [ ] Confirmed information is clearly separated from inferred and unknown information.
- [ ] Every confirmed BANT/MEDDPICC claim has at least one evidence ID.
- [ ] Unknown or weak fields include specific follow-up questions.
- [ ] Ontology nodes and edges can be rendered as a graph.
- [ ] Dashboard cards include status, evidence, confidence, freshness, changeability, and sensitive-data cues.
- [ ] Raw input records include `raw_excerpt` and `source_summary`.
- [ ] Users can inspect raw input, generated summary, participants, sensitive-data cue, and extracted evidence together.
- [ ] Strategy includes must-know questions, deal closing plan, next meeting strategy, and email strategy.
- [ ] Data quality section calls out missing dates, old information, or unsupported claims.

## Demo Validation

- [ ] `dashboard-output-example.json` is valid JSON.
- [ ] Demo page loads without a build step.
- [ ] BANT and MEDDPICC cards render.
- [ ] Ontology nodes and edges render.
- [ ] Sensitive values show a visible `민감정보` marker.
- [ ] Stale or volatile data shows an update/revalidation cue.
- [ ] Raw 입력 자료 cards render and open a detail panel.

## Security Review

- [ ] Run secret pattern search before publishing.
- [ ] Confirm there are no real API keys, tokens, passwords, private keys, or credentials.
- [ ] Confirm mock names, company names, budgets, and communication excerpts are fictional.
- [ ] Confirm no real email addresses or phone numbers are present.

## Human Review TODO

- [ ] Confirm whether inferred champion/economic buyer assignments are accurate.
- [ ] Confirm actual budget range and procurement owner before forecast updates.
- [ ] Confirm whether competitor status changed after the latest meeting.
- [ ] Review sensitive data handling against company policy.
