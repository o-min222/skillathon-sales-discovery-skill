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

## Raw 커뮤니케이션 자료

실제 운영에서 Raw 커뮤니케이션 자료는 고객과 주고받은 이메일 원문, 미팅 회의록, 회의/데모콜 녹취록, CRM 메모, 내부 Slack/카톡 메모처럼 아직 정리되지 않은 업무 기록입니다. 이 Skill은 해당 원문을 바로 BANT/MEDDPICC으로 덮어쓰지 않고, 먼저 원문 출처를 `communications` 레코드로 보존한 뒤 요약과 evidence를 연결합니다.

데모 데이터는 실제 고객 자료가 아니라 Skillathon 제출용 mock data입니다. 다만 구조는 실제 자료를 넣는 상황을 기준으로 설계되어 있습니다.

- `raw_excerpt`: 실제 이메일/회의록/녹취록/CRM 메모에서 가져온 대표 원문 또는 원문 발췌
- `source_summary`: 해당 raw 자료가 세일즈 분석에 기여하는 내용 요약
- `summary`: 대시보드에서 빠르게 읽기 위한 정규화 요약
- `evidence`: raw 자료에서 BANT, MEDDPICC, 리스크, 전략 판단에 사용된 근거 문장

데모 화면의 **Raw 입력 자료** 섹션에서는 각 입력 자료의 원문 발췌, 요약, 참가자, 민감정보 표시, 해당 자료에서 추출된 evidence를 함께 확인할 수 있습니다.

## 실행 프롬프트

리뷰어는 아래 프롬프트를 그대로 사용해 Skill 동작을 확인할 수 있습니다.

```text
세일즈 분석을 진행해줘.

분석 단위는 Opportunity로 잡아줘.
아래 raw 커뮤니케이션 자료를 바탕으로 고객사, 이해관계자, BANT, MEDDPICC, 온톨로지 그래프, Raw 입력 요약, 확인된 사실/추론/미확인 항목, 정보 신선도, 민감정보 배지, 다음 미팅/이메일 전략을 대시보드용 JSON으로 정리해줘.

[이메일 스레드]
From: 김서연 / HRD담당
To: 영업 담당자
Date: 2026-05-03
Subject: Re: 디지털 역량 교육 플랫폼 검토 관련

안녕하세요. 지난번 소개자료 잘 받았습니다.
저희가 이미 사내 교육 체계는 어느 정도 잡혀 있는데, 최근 디지털 전환/AI 쪽 교육은 사업부마다 따로 운영되고 있어서 편차가 큽니다.
해외 법인도 같이 봐야 해서 글로벌 콘텐츠 커버리지도 중요하고요.
다만 올해 예산을 바로 새로 잡을 수 있는지는 확인이 필요합니다. HRD 쪽에 일부 혁신 과제 예산은 있는데, 최종 승인은 저희 본부장님과 구매팀 확인이 필요합니다.
다음 미팅에서는 기존 LMS 연동, 한국어 자막 품질, 부서장용 리포트 화면을 보고 싶습니다.

[회의록 메모]
일시: 2026-05-07 14:00-15:00
참석: 김서연(HRD), 이지훈(L&D), 영업 담당자, 세일즈 엔지니어

- 김서연: 직무군별로 필요한 교육 과정을 표준화하고 싶음. 현재는 각 부서가 알아서 외부 강의나 사내 자료를 섞어 쓰고 있음.
- 이지훈: 학습 참여율이 부서장에게 잘 보이지 않음. 수료율, 활성 학습자, 과정별 만족도 같은 지표가 필요.
- 고객 질문: SSO 지원 여부, 기존 LMS와 사용자/수료 데이터 연동 가능 여부.
- 영업 담당자 메모: 이지훈 매니저가 PoC 사용자 모집을 도와줄 수 있다고 함. Champion 후보일 수 있음.
- 미확인: 실제 최종 승인권자, 구매 프로세스, 경쟁사 shortlist.

[데모콜 녹취 일부]
이지훈: 부서별 활성 학습자 수랑 수료율을 한 화면에서 볼 수 있나요?
최은지(IT): SSO는 SAML 방식 지원하나요? 개인정보 처리 위치도 확인이 필요합니다.
김서연: LinkedIn Learning도 같이 보고 있어서, 콘텐츠 품질뿐 아니라 관리자 리포트나 직무별 추천 기능 차이를 비교해야 할 것 같습니다.

[회의 녹음 STT txt]
파일명: 2026-05-10_hanbit_demo_call_stt.txt

00:01:12 영업 담당자: 오늘은 지난번에 말씀 주신 직무별 학습 경로랑 관리자 리포트 중심으로 보여드리겠습니다.
00:03:45 이지훈: 저희는 부서별로 어떤 과정이 실제로 소비되는지 보는 게 중요합니다. 단순 수료율 말고 활성 학습자 추이도 봐야 하고요.
00:07:18 김서연: 임원 보고에는 디지털 전환 교육이 실제로 어느 직무군까지 확산됐는지가 들어가야 합니다. 그냥 콘텐츠 수가 많다는 얘기만으로는 설득이 어렵습니다.
00:11:02 최은지: 보안 검토 때 개인정보 처리 위치와 SSO 방식은 꼭 확인해야 합니다. 저희는 SAML 기반이면 검토가 빠를 수 있습니다.
00:15:37 이지훈: PoC를 한다면 우선 HR, IT, 생산기술 쪽에서 30명 정도 파일럿을 잡아볼 수 있을 것 같습니다. 다만 최종 구매 승인 프로세스는 제가 정확히 모릅니다.
00:19:50 김서연: 예산은 HRD 혁신 과제 안에서 일부 검토할 수 있지만, 1억 원 이상이면 본부장님 보고와 구매팀 절차가 필요할 것 같습니다.
00:24:11 영업 담당자: 그럼 다음 미팅 전까지 PoC scorecard와 보안 검토 자료를 보내드리고, 구매팀 프로세스 확인 질문도 같이 정리드리겠습니다.

[CRM 메모]
Stage: PoC 논의 중
Amount signal: HRD 학습 혁신 예산 약 1억 원 언급. 확정 예산은 아님.
Close target: 가능하면 Q3 시작 희망.
Risk: 구매팀/보안 검토 4-6주 걸릴 수 있음. Economic buyer 미확인. Procurement owner 미확인.
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
