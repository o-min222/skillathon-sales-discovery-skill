const dataUrl = "../references/dashboard-output-example.json";

const labels = {
  budget: "예산",
  authority: "의사결정 권한",
  need: "니즈",
  timeline: "일정",
  metrics: "성과 지표",
  economic_buyer: "경제적 구매자",
  decision_criteria: "의사결정 기준",
  decision_process: "의사결정 절차",
  paper_process: "계약/구매 절차",
  identify_pain: "핵심 Pain",
  champion: "Champion",
  competition: "경쟁 구도"
};

const typeLabels = {
  account: "고객사",
  opportunity: "Opportunity",
  stakeholder: "이해관계자",
  pain_point: "Pain",
  business_metric: "성과 지표",
  competitor: "경쟁사",
  risk: "리스크",
  next_action: "다음 액션"
};

const channelLabels = {
  email: "이메일",
  video_meeting: "화상 미팅",
  demo_call: "데모콜",
  crm: "CRM",
  slack: "Slack"
};

let appData;
let selectedId = "";
let graphFilter = "all";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function badge(text, kind = "") {
  return `<span class="badge ${escapeHtml(kind)}">${escapeHtml(text)}</span>`;
}

function list(items) {
  if (!items || items.length === 0) return "<p>아직 데이터가 없습니다</p>";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function statusText(value) {
  const values = {
    confirmed: "확인됨",
    partial: "부분 확인",
    unknown: "미확인",
    risk: "리스크"
  };
  return values[value] || value.replaceAll("_", " ");
}

function freshnessText(value) {
  const values = {
    fresh: "최신",
    watch: "관찰 필요",
    stale: "오래됨",
    revalidate_required: "재확인 필요"
  };
  return values[value] || value;
}

function changeabilityText(value) {
  const values = {
    low: "낮음",
    medium: "중간",
    high: "높음"
  };
  return values[value] || value;
}

function evidenceByIds(ids = []) {
  const evidence = appData.evidence || [];
  return ids
    .map((id) => evidence.find((item) => item.id === id))
    .filter(Boolean);
}

function setActive(id) {
  selectedId = id;
  document.querySelectorAll("[data-detail-id]").forEach((element) => {
    element.classList.toggle("active", element.dataset.detailId === selectedId);
  });
}

function renderCard(key, item, groupName) {
  const sensitiveBadges = item.sensitive?.display_badges || [];
  const topConfirmed = item.confirmed?.[0] || "확인된 내용 없음";
  const topUnknown = item.unknown?.[0] || "추가 확인 항목 없음";
  const id = `${groupName}.${key}`;

  return `
    <article class="card ${item.status}" data-detail-id="${id}" tabindex="0" role="button" aria-label="${labels[key] || key} 상세보기">
      <div class="card-title-row">
        <h3>${escapeHtml(labels[key] || key)}</h3>
        ${badge(statusText(item.status), item.status)}
      </div>
      <div class="badge-row">
        ${badge(`신뢰도 ${Math.round(item.confidence * 100)}%`)}
        ${badge(freshnessText(item.freshness))}
        ${badge(`변동성 ${changeabilityText(item.changeability)}`)}
        ${sensitiveBadges.map((text) => badge(text, "sensitive")).join("")}
      </div>
      <div class="card-section">
        <b>확인된 내용</b>
        <p>${escapeHtml(topConfirmed)}</p>
      </div>
      <div class="card-section">
        <b>미확인 / 업데이트 필요</b>
        <p>${escapeHtml(topUnknown)}</p>
      </div>
      <div class="card-section">
        <b>다음 질문</b>
        ${list(item.next_questions?.slice(0, 2))}
      </div>
    </article>
  `;
}

function renderCards(targetId, group, groupName) {
  const target = document.getElementById(targetId);
  target.innerHTML = Object.entries(group)
    .map(([key, item]) => renderCard(key, item, groupName))
    .join("");
}

function renderCommunicationCards() {
  const target = document.getElementById("communicationCards");
  target.innerHTML = appData.communications
    .map((item) => {
      const badges = item.sensitive?.display_badges || [];
      return `
        <article class="communication-card" role="button" tabindex="0" data-detail-id="communication.${item.id}">
          <div class="card-title-row">
            <h3>${escapeHtml(item.title)}</h3>
            ${badge(channelLabels[item.channel] || item.channel)}
          </div>
          <div class="badge-row">
            ${badge(item.date)}
            ${badge(item.type)}
            ${badges.map((text) => badge(text, "sensitive")).join("")}
          </div>
          <div class="card-section">
            <b>요약</b>
            <p>${escapeHtml(item.source_summary || item.summary)}</p>
          </div>
          <div class="raw-preview">${escapeHtml(item.raw_excerpt || "Raw excerpt 없음")}</div>
        </article>
      `;
    })
    .join("");
}

function graphTypes() {
  const types = new Set(appData.ontology.nodes.map((node) => node.type));
  return ["all", ...types];
}

function renderGraphFilters() {
  const target = document.getElementById("graphFilters");
  target.innerHTML = graphTypes()
    .map((type) => {
      const text = type === "all" ? "전체" : typeLabels[type] || type;
      return `<button class="graph-filter ${graphFilter === type ? "active" : ""}" type="button" data-filter="${type}">${text}</button>`;
    })
    .join("");
}

function renderRelationshipMap() {
  const graph = document.getElementById("relationshipMap");
  const nodes = appData.ontology.nodes.filter((node) => graphFilter === "all" || node.type === graphFilter);
  const allNodes = appData.ontology.nodes;

  graph.innerHTML = nodes
    .map((node) => {
      const edges = appData.ontology.edges.filter((edge) => edge.from === node.id || edge.to === node.id);
      const edgePreview = edges.slice(0, 3).map((edge) => {
        const otherId = edge.from === node.id ? edge.to : edge.from;
        const other = allNodes.find((candidate) => candidate.id === otherId);
        return `<div class="edge-line">${escapeHtml(edge.type)} · ${escapeHtml(other?.label || otherId)}</div>`;
      }).join("");

      return `
        <div>
          <article class="map-node" role="button" tabindex="0" data-detail-id="node.${node.id}">
            <div class="map-node-head">
              <strong>${escapeHtml(node.label)}</strong>
              ${badge(typeLabels[node.type] || node.type)}
            </div>
            <div class="node-links">
              ${badge(`연결 ${edges.length}개`)}
              ${edges.some((edge) => edge.evidence_ids?.length) ? badge("근거 있음", "confirmed") : badge("근거 필요", "unknown")}
            </div>
          </article>
          ${edgePreview}
        </div>
      `;
    })
    .join("");
}

function renderStrategy(strategy) {
  const target = document.getElementById("strategy");
  target.innerHTML = `
    <div class="strategy-list">
      <article class="strategy-card interactive-panel" role="button" tabindex="0" data-detail-id="strategy.must_know">
        <h3>꼭 알아야 할 사항</h3>
        ${list(strategy.must_know)}
      </article>
      <article class="strategy-card interactive-panel" role="button" tabindex="0" data-detail-id="strategy.deal_closing_plan">
        <h3>딜 클로징 플랜</h3>
        ${list(strategy.deal_closing_plan)}
      </article>
      <article class="strategy-card interactive-panel" role="button" tabindex="0" data-detail-id="strategy.next_meeting_agenda">
        <h3>후속 미팅 아젠다</h3>
        ${list(strategy.next_meeting_agenda)}
      </article>
      <article class="strategy-card interactive-panel" role="button" tabindex="0" data-detail-id="strategy.email_strategy">
        <h3>이메일 전략</h3>
        ${list(strategy.email_strategy.key_points)}
      </article>
    </div>
  `;
}

function detailSection(title, content) {
  return `
    <section class="detail-section">
      <h3>${escapeHtml(title)}</h3>
      ${content}
    </section>
  `;
}

function keyValue(label, value) {
  return `
    <div class="detail-kv">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "미확인")}</strong>
    </div>
  `;
}

function renderEvidence(ids) {
  const items = evidenceByIds(ids);
  if (!items.length) return "<p>연결된 evidence가 없습니다.</p>";
  return list(items.map((item) => `${item.excerpt} (${item.communication_id})`));
}

function fieldDetail(title, item) {
  return `
    <div class="detail-content">
      <span class="label">분석 카드</span>
      <strong class="detail-title">${escapeHtml(title)}</strong>
      <div class="badge-row">
        ${badge(statusText(item.status), item.status)}
        ${badge(`신뢰도 ${Math.round(item.confidence * 100)}%`)}
        ${badge(freshnessText(item.freshness))}
        ${badge(`변동성 ${changeabilityText(item.changeability)}`)}
        ${(item.sensitive?.display_badges || []).map((text) => badge(text, "sensitive")).join("")}
      </div>
      ${detailSection("확인된 내용", list(item.confirmed))}
      ${detailSection("추론", list(item.inferred))}
      ${detailSection("미확인", list(item.unknown))}
      ${detailSection("추가 확인 질문", list(item.next_questions))}
      ${detailSection("근거", renderEvidence(item.evidence_ids))}
    </div>
  `;
}

function accountDetail() {
  const account = appData.account;
  return `
    <div class="detail-content">
      <span class="label">고객사 세부내용</span>
      <strong class="detail-title">${escapeHtml(account.name)}</strong>
      ${keyValue("산업", account.industry)}
      ${keyValue("직원 수", `${account.employee_count.toLocaleString()}명`)}
      ${keyValue("HRD 성숙도", account.hrd_maturity)}
      ${detailSection("연결된 이해관계자", list(appData.stakeholders.map((person) => `${person.name} · ${person.title} · ${person.role_in_deal}`)))}
      ${detailSection("관련 커뮤니케이션", list(appData.communications.map((item) => `${item.date} · ${item.title}`)))}
    </div>
  `;
}

function opportunityDetail() {
  const opportunity = appData.opportunity;
  return `
    <div class="detail-content">
      <span class="label">Opportunity 세부내용</span>
      <strong class="detail-title">${escapeHtml(opportunity.name)}</strong>
      ${keyValue("단계", opportunity.stage)}
      ${keyValue("예산 신호", opportunity.amount_signal)}
      ${keyValue("계약 목표", opportunity.close_date_signal)}
      ${detailSection("제품 범위", list(opportunity.target_products))}
      ${detailSection("주요 리스크", list(appData.risks.map((risk) => `${risk.name}: ${risk.mitigation}`)))}
    </div>
  `;
}

function communicationDetail(communicationId) {
  const item = appData.communications.find((communication) => communication.id === communicationId);
  const relatedEvidence = appData.evidence.filter((evidence) => evidence.communication_id === communicationId);
  return `
    <div class="detail-content">
      <span class="label">Raw 입력 자료</span>
      <strong class="detail-title">${escapeHtml(item.title)}</strong>
      <div class="badge-row">
        ${badge(channelLabels[item.channel] || item.channel)}
        ${badge(item.date)}
        ${badge(item.type)}
        ${(item.sensitive?.display_badges || []).map((text) => badge(text, "sensitive")).join("")}
      </div>
      ${keyValue("참가자", item.participants.join(", "))}
      ${detailSection("요약", `<p>${escapeHtml(item.source_summary || item.summary)}</p>`)}
      ${detailSection("Raw 원문", `<pre class="raw-block">${escapeHtml(item.raw_excerpt || "Raw excerpt 없음")}</pre>`)}
      ${detailSection("이 자료에서 추출된 Evidence", list(relatedEvidence.map((evidence) => `${evidence.claim_type}: ${evidence.excerpt}`)))}
    </div>
  `;
}

function qualityDetail() {
  const quality = appData.data_quality;
  return `
    <div class="detail-content">
      <span class="label">데이터 품질</span>
      <strong class="detail-title">전체 신뢰도 ${Math.round(quality.overall_confidence * 100)}%</strong>
      ${keyValue("확인된 claim", `${quality.confirmed_claim_count}개`)}
      ${keyValue("추론 claim", `${quality.inferred_claim_count}개`)}
      ${keyValue("미확인 항목", `${quality.unknown_item_count}개`)}
      ${detailSection("재확인 필요", list(quality.revalidation_needed))}
      ${detailSection("분석 메모", list(quality.notes))}
    </div>
  `;
}

function nodeDetail(nodeId) {
  const node = appData.ontology.nodes.find((item) => item.id === nodeId);
  const edges = appData.ontology.edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);
  return `
    <div class="detail-content">
      <span class="label">온톨로지 노드</span>
      <strong class="detail-title">${escapeHtml(node.label)}</strong>
      ${keyValue("유형", typeLabels[node.type] || node.type)}
      ${detailSection("연결 관계", list(edges.map((edge) => {
        const otherId = edge.from === nodeId ? edge.to : edge.from;
        const other = appData.ontology.nodes.find((candidate) => candidate.id === otherId);
        return `${edge.type} · ${other?.label || otherId}`;
      })))}
      ${detailSection("관계 근거", renderEvidence(edges.flatMap((edge) => edge.evidence_ids || [])))}
    </div>
  `;
}

function strategyDetail(key) {
  const strategy = appData.strategy;
  const mapping = {
    must_know: ["꼭 알아야 할 사항", strategy.must_know],
    deal_closing_plan: ["딜 클로징 플랜", strategy.deal_closing_plan],
    next_meeting_agenda: ["후속 미팅 아젠다", strategy.next_meeting_agenda],
    email_strategy: ["이메일 전략", [`제목: ${strategy.email_strategy.subject}`, ...strategy.email_strategy.key_points]]
  };
  const [title, items] = mapping[key];
  return `
    <div class="detail-content">
      <span class="label">전략 상세</span>
      <strong class="detail-title">${escapeHtml(title)}</strong>
      ${detailSection("권장 액션", list(items))}
      ${detailSection("Stakeholder 접근", list(strategy.stakeholder_approach.map((item) => {
        const stakeholder = appData.stakeholders.find((person) => person.id === item.stakeholder_id);
        return `${stakeholder?.name || item.stakeholder_id}: ${item.approach}`;
      })))}
    </div>
  `;
}

function showDetail(id) {
  const panel = document.getElementById("detailPanel");
  setActive(id);

  if (id === "account") panel.innerHTML = accountDetail();
  if (id === "opportunity") panel.innerHTML = opportunityDetail();
  if (id === "quality") panel.innerHTML = qualityDetail();
  if (id.startsWith("communication.")) panel.innerHTML = communicationDetail(id.replace("communication.", ""));
  if (id.startsWith("bant.")) {
    const key = id.split(".")[1];
    panel.innerHTML = fieldDetail(`BANT · ${labels[key]}`, appData.bant[key]);
  }
  if (id.startsWith("meddpicc.")) {
    const key = id.split(".")[1];
    panel.innerHTML = fieldDetail(`MEDDPICC · ${labels[key]}`, appData.meddpicc[key]);
  }
  if (id.startsWith("node.")) panel.innerHTML = nodeDetail(id.replace("node.", ""));
  if (id.startsWith("strategy.")) panel.innerHTML = strategyDetail(id.replace("strategy.", ""));
}

function bindInteractions() {
  document.body.addEventListener("click", (event) => {
    const detailTarget = event.target.closest("[data-detail-id]");
    if (detailTarget) showDetail(detailTarget.dataset.detailId);

    const filterTarget = event.target.closest("[data-filter]");
    if (filterTarget) {
      graphFilter = filterTarget.dataset.filter;
      renderGraphFilters();
      renderRelationshipMap();
      setActive(selectedId);
    }
  });

  document.body.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const detailTarget = event.target.closest("[data-detail-id]");
    if (!detailTarget) return;
    event.preventDefault();
    showDetail(detailTarget.dataset.detailId);
  });
}

function getInitialState() {
  const params = new URLSearchParams(window.location.search);
  return {
    detail: params.get("detail") || "account",
    filter: params.get("filter") || "all",
    capture: params.get("capture") || ""
  };
}

function scrollToHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
}

function applyCaptureMode(sectionId) {
  if (!sectionId) return;
  document.body.classList.add("capture-mode");
  const sections = document.querySelectorAll(".workspace-grid > div > section");
  sections.forEach((section) => {
    const isRequested = section.id === sectionId;
    const isSplitDetail = ["ontology-graph", "strategy-panel"].includes(sectionId) && section.id === "relationship";
    section.classList.toggle("capture-hidden", !isRequested && !isSplitDetail);
  });
  if (sectionId === "ontology-graph") {
    document.getElementById("strategy-panel")?.classList.add("capture-hidden");
  }
  if (sectionId === "strategy-panel") {
    document.getElementById("ontology-graph")?.classList.add("capture-hidden");
  }
}

async function main() {
  const response = await fetch(dataUrl);
  appData = await response.json();
  const initialState = getInitialState();
  graphFilter = initialState.filter;

  document.getElementById("generatedAt").textContent = appData.metadata.analysis_generated_at;
  document.getElementById("accountName").textContent = appData.account.name;
  document.getElementById("accountContext").textContent = `${appData.account.industry} · ${appData.account.hrd_maturity}`;
  document.getElementById("opportunityName").textContent = appData.opportunity.name;
  document.getElementById("opportunityContext").textContent = `${appData.opportunity.stage} · ${appData.opportunity.close_date_signal}`;
  document.getElementById("confidence").textContent = `신뢰도 ${Math.round(appData.data_quality.overall_confidence * 100)}%`;
  document.getElementById("qualityNotes").textContent = appData.data_quality.notes[0];

  renderCards("bantCards", appData.bant, "bant");
  renderCommunicationCards();
  renderCards("meddpiccCards", appData.meddpicc, "meddpicc");
  renderGraphFilters();
  renderRelationshipMap();
  renderStrategy(appData.strategy);
  bindInteractions();
  showDetail(initialState.detail);
  applyCaptureMode(initialState.capture);
  scrollToHash();
}

main().catch((error) => {
  document.body.innerHTML = `<main><h1>Demo failed to load</h1><p>${error.message}</p></main>`;
});
