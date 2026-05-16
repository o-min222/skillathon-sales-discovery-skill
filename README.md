# sales-discovery-mapper

B2B 세일즈 커뮤니케이션 자료를 Opportunity 단위로 분석해 BANT, MEDDPICC, 이해관계자 온톨로지, 정보 신선도, 민감정보, 후속 접근 전략을 구조화하는 Skillathon 제출물입니다.

## 제출 링크에 포함할 정보

- GitHub 저장소 URL: `https://github.com/o-min222/skillathon-sales-discovery-skill`
- README.md 경로: [`README.md`](README.md)
- SKILL.md 경로: [`sales-discovery-mapper/SKILL.md`](sales-discovery-mapper/SKILL.md)
- references 폴더 경로: [`sales-discovery-mapper/references/`](sales-discovery-mapper/references/)
- 데모 화면: [`sales-discovery-mapper/demo/index.html`](sales-discovery-mapper/demo/index.html)
- 데모 데이터: [`sales-discovery-mapper/references/dashboard-output-example.json`](sales-discovery-mapper/references/dashboard-output-example.json)
- 검증 스크립트: [`sales-discovery-mapper/scripts/validate_output.py`](sales-discovery-mapper/scripts/validate_output.py)

## 해결하려는 문제

B2B 세일즈 담당자는 이메일, 회의록, 녹취록, CRM 메모, 메신저 대화 등 여러 채널에서 고객과 충분히 소통하지만, 실제 딜 리뷰 시점에는 BANT와 MEDDPICC 정보를 다시 수작업으로 정리해야 합니다. 이 Skill은 raw 커뮤니케이션 자료에서 확인된 사실, 추론, 미확인 항목을 분리하고 다음 소통에서 무엇을 확인해야 하는지까지 제안합니다.

## 사용 방법

Codex에서 다음처럼 요청합니다.

```text
세일즈 분석을 진행해줘.
```

입력으로 이메일 원문, 회의록 텍스트, 녹취록 텍스트, CRM 메모, Slack/카톡 대화, 첨부 문서 요약 또는 오디오 파일 설명을 제공합니다. 자료가 충분하면 바로 분석하고, 필수 정보가 부족하면 결과 마지막에 추가 확인 질문과 후속 전략을 정리합니다.

## 실행 프롬프트

리뷰어는 아래 프롬프트를 그대로 사용해 Skill 동작을 확인할 수 있습니다.

```text
세일즈 분석을 진행해줘.

분석 단위는 Opportunity로 잡아줘.
아래 raw 커뮤니케이션 자료를 바탕으로 고객사, 이해관계자, BANT, MEDDPICC, 온톨로지 그래프, Raw 입력 요약, 확인된 사실/추론/미확인 항목, 정보 신선도, 민감정보 배지, 다음 미팅/이메일 전략을 대시보드용 JSON으로 정리해줘.

[이메일]
김서연 HRD 담당 임원: 내부 교육은 운영 중이지만 디지털/AI 교육 과정이 부서마다 다릅니다. 해외 법인도 함께 볼 수 있는 일관된 콘텐츠 카탈로그가 필요합니다.

[회의록]
이지훈 L&D 매니저는 학습 참여율이 부서장에게 잘 보이지 않는 점을 문제로 언급했습니다. 기존 LMS 연동과 관리자 리포트가 중요합니다.

[CRM 메모]
HRD 쪽에 학습 혁신 예산 약 1억 원이 임시 배정되어 있으나, 구매팀 승인과 보안 검토에 4-6주가 걸릴 수 있습니다. 최종 승인권자는 아직 미확인입니다.
```

## 출력 예시

Skill은 대시보드 UI로 전환하기 쉬운 구조화 데이터를 생성합니다.

- Account / Opportunity / Stakeholder / Communication / Evidence 연결
- 입력 Raw 데이터와 요약 내용 확인
- BANT 카드 4개
- MEDDPICC 카드 8개
- 노드/엣지 기반 온톨로지 그래프
- 확인된 사실 / 추론 / 미확인 정보 구분
- 정보 신선도와 업데이트 필요 여부
- 민감정보 시각 단서
- 고객사에 꼭 알아야 할 사항, 딜 클로징 플랜, 후속 미팅/이메일 전략
- 클릭 가능한 고객사/Opportunity/데이터 품질 상세 패널
- Raw 입력 자료 카드와 원문/요약 상세 패널
- 카드형 노드와 관계 근거를 확인할 수 있는 온톨로지 그래프 뷰

## 파일 구조

```text
sales-discovery-mapper/
├── SKILL.md
├── references/
│   ├── schema.md
│   ├── mock-data.md
│   ├── dashboard-output-example.json
│   └── evaluation-checklist.md
├── demo/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── scripts/
    └── validate_output.py
```

## 데모 실행

정적 HTML 데모이므로 별도 빌드 없이 간단한 로컬 서버로 실행할 수 있습니다. 데모가 JSON 파일을 읽기 때문에 `file://`로 직접 열기보다 로컬 서버 실행을 권장합니다.

```bash
python3 -m http.server 8000
```

그 다음 `http://localhost:8000/sales-discovery-mapper/demo/`에 접속합니다.

## 검증

```bash
python3 sales-discovery-mapper/scripts/validate_output.py sales-discovery-mapper/references/dashboard-output-example.json
```

```bash
node --check sales-discovery-mapper/demo/app.js
```

비밀값 패턴 점검:

```bash
rg -n --glob '!README.md' --glob '!sales-discovery-mapper/references/evaluation-checklist.md' "(?i)(api[_-]?key|secret|token|password|passwd|bearer|authorization|client_secret|private[_-]?key|BEGIN (RSA|OPENSSH|PRIVATE)|sk-[A-Za-z0-9]|ghp_|github_pat_|xox[baprs]-|AKIA[0-9A-Z]{16})" .
```

현재 제출물에는 실제 API key, token, password, private key를 포함하지 않습니다. 데모에 등장하는 이름, 회사명, 예산, 커뮤니케이션은 Skillathon 설명을 위한 mock data입니다. 위 명령은 비밀값 점검 안내 문구가 들어 있는 README와 체크리스트 문서를 제외하고 검사합니다.

## 제한 사항 및 TODO

- 오디오 원본은 실제 환경에서 STT가 필요합니다. 이 제출물은 오디오 입력을 받을 수 있다는 워크플로를 정의하고, 데모는 텍스트 녹취록 형태를 사용합니다.
- 추론된 정보는 반드시 영업 담당자가 확인해야 합니다.
- 민감정보가 포함될 수 있으므로 사내 보안 정책과 접근 권한에 맞게 사용해야 합니다.
- CRM 연동은 mock schema 기준입니다. Salesforce, HubSpot, Dynamics 연동은 후속 TODO입니다.
- 데모 화면은 Skill 출력 구조를 보여주기 위한 정적 파일 기반 동적 프로토타입입니다.
