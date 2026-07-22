import { ReportSection, ReportBlock } from '../components/report/types';

export const generateDummyReportSections = (depth: string = "Standard", version: number = 1): ReportSection[] => {
  const isV2 = version > 1;
  
  const generateLoremParagraphs = (count: number) => {
    const p1 = "The rapid evolution of artificial intelligence frameworks over the last fiscal year has triggered a profound shift in global technology strategies. Enterprises are increasingly moving away from generalized models towards domain-specific architectures capable of handling nuanced, highly-regulated data payloads. This transition requires significant capital expenditure on specialized infrastructure, including advanced logic silicon and high-bandwidth memory modules.";
    const p2 = "Consequently, the supply chain for these critical components has experienced unprecedented strain, leading to prolonged procurement cycles and elevated pricing across the board. Organizations that successfully navigate this hardware bottleneck will secure a substantial competitive advantage, while those lagging behind risk obsolescence in an increasingly automated ecosystem. The integration of these advanced systems into legacy IT environments presents another formidable challenge, requiring specialized talent and meticulous strategic planning.";
    const pText = isV2 ? `${p2} ${p1}` : `${p1} ${p2}`;
    return Array(count).fill(pText);
  };

  const textBlock = (id: string, paragraphs: number): ReportBlock => ({
    id,
    type: 'text',
    data: { paragraphs: generateLoremParagraphs(paragraphs) }
  });

  const kpiBlock = (id: string, kpis: any[]): ReportBlock => ({
    id,
    type: 'kpi-grid',
    data: { kpis }
  });

  const chartBlock = (id: string, chartType: string, title: string, description: string, data: any[], config: any): ReportBlock => ({
    id,
    type: 'chart',
    data: { chartType, title, description, data, config }
  });

  const calloutBlock = (id: string, calloutType: string, title: string, content: string): ReportBlock => ({
    id,
    type: 'callout',
    data: { calloutType, title, content }
  });

  const swotBlock = (id: string, strengths: string[], weaknesses: string[], opportunities: string[], threats: string[]): ReportBlock => ({
    id,
    type: 'swot',
    data: { strengths, weaknesses, opportunities, threats }
  });

  const imageBlock = (id: string, src: string, alt: string, caption: string): ReportBlock => ({
    id,
    type: 'image',
    data: { src, alt, caption }
  });

  const tableBlock = (id: string, title: string, columns: any[], rows: any[]): ReportBlock => ({
    id,
    type: 'table',
    data: { title, columns, rows }
  });
  
  const quoteBlock = (id: string, quote: string, author: string, role: string): ReportBlock => ({
    id,
    type: 'quote',
    data: { quote, author, role }
  });

  const sourcesBlock = (id: string): ReportBlock => ({
    id,
    type: 'sources-list',
    data: { 
       icons: [
          'https://www.google.com/s2/favicons?domain=ft.com&sz=128',
          'https://www.google.com/s2/favicons?domain=gartner.com&sz=128',
          'https://www.google.com/s2/favicons?domain=bloomberg.com&sz=128'
       ],
       moreCount: 3
    }
  });

  // Base Sections
  const sections: ReportSection[] = [];
  
  const generateConfidence = () => {
    const score = Math.floor(Math.random() * 69) + 30; // 30-98
    let reason = "Verified against primary government databases.";
    if (score < 40) reason = "Based on limited secondary sources and market estimates.";
    else if (score < 80) reason = "Cross-referenced with recent industry reports.";
    return { confidenceScore: score, confidenceReason: reason };
  };

  // Section 1: Executive Summary
  sections.push({
    id: 'exec-summary',
    title: 'Executive Summary',
    ...generateConfidence(),
    blocks: [
      textBlock("es-text-1", 1),
      kpiBlock("es-kpi-1", [
        { label: "Infrastructure Capital Raised (Q3)", value: isV2 ? "$5.1B" : "$4.2B", trend: "up", change: "+12%" },
        { label: "Increase in Tech M&A Activity", value: "+45%", trend: "up", change: "+5%" },
        { label: "Enterprise AI Adoption Rate", value: "73%", trend: "up", change: "+8%" },
        { label: "Legacy Compute Depreciation", value: "-22%", trend: "down", change: "-4%" }
      ]),
      calloutBlock("es-callout-1", "Key Finding", "Enterprise adoption has shifted from experimental pilots to production deployments", `We observed a ${isV2 ? '345%' : '300%'} YoY increase in scalable AI infrastructure spend ${isV2 ? '(Updated with latest Q3 figures)' : ''}.`),
      chartBlock(
        "es-chart-1", 
        "bar", 
        "YoY AI Infrastructure Spend by Sector", 
        "Financial services and Healthcare lead the massive capital deployment in highly regulated AI models.",
        [
          { name: "Financial Services", value: isV2 ? 145 : 120 },
          { name: "Healthcare", value: 98 },
          { name: "Manufacturing", value: 65 },
          { name: "Retail", value: 45 },
          { name: "Public Sector", value: 25 },
        ],
        { dataKey: "value", color: "#36c0c9" }
      ),
      textBlock("es-text-2", 2),
      quoteBlock("es-quote-1", "The inflection point of generative AI is no longer a futuristic prediction; it is an immediate mandate for survival in the enterprise arena.", "Dr. Sarah Chen", "Chief AI Architect, Global Insights"),
      imageBlock("es-img-1", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200", "Data Analytics Dashboard", "Enterprise infrastructure dashboard visualization."),
      sourcesBlock("es-sources")
    ]
  });

  // Section 2: Market Overview & Trends
  sections.push({
    id: 'market-analysis',
    title: 'Market Analysis & Insights',
    ...generateConfidence(),
    blocks: [
      textBlock("mo-text-1", 2),
      chartBlock(
        "mo-chart-1",
        "line",
        "Global Technology Adoption Curve (2020-2025)",
        "The adoption curve shows an exponential hockey-stick growth for domain-specific AI vs generalized AI.",
        [
          { year: "2020", specialized: 10, generalized: 5 },
          { year: "2021", specialized: 15, generalized: 20 },
          { year: "2022", specialized: 30, generalized: 50 },
          { year: "2023", specialized: 85, generalized: 75 },
          { year: "2024", specialized: 190, generalized: 90 },
          { year: "2025", specialized: 340, generalized: 100 },
        ],
        { lines: [{ key: "specialized", color: "#36c0c9", name: "Domain-Specific AI" }, { key: "generalized", color: "#0D212C", name: "Generalized Models" }] }
      ),
      calloutBlock("mo-callout-1", "Strategic Recommendation", "Pivot to Edge Computing", "By 2026, relying solely on centralized cloud inference will incur prohibitive latency costs. Decentralized edge nodes must be implemented immediately."),
      textBlock("mo-text-2", 3),
      tableBlock(
        "mo-table-1",
        "Market Segment Growth Analysis",
        [{ key: "segment", label: "Segment" }, { key: "cagr", label: "CAGR (2024-2028)" }, { key: "maturity", label: "Maturity" }, { key: "risk", label: "Risk Level" }],
        [
          { segment: "Healthcare AI & Drug Discovery", cagr: isV2 ? "+156%" : "+142%", maturity: "Early Stage", risk: "High", badgeColor: "red" },
          { segment: "FinTech & Automated Trading", cagr: "+98%", maturity: "Growth", risk: "Medium", badgeColor: "yellow" },
          { segment: "Supply Chain & Logistics", cagr: "+45%", maturity: "Mature", risk: "Low", badgeColor: "green" },
          { segment: "Cybersecurity Autonomous Defense", cagr: "+112%", maturity: "Growth", risk: "Medium", badgeColor: "yellow" }
        ]
      ),
      textBlock("mo-text-3", 2),
      sourcesBlock("mo-sources")
    ]
  });

  // Section 3: Competitive Landscape
  sections.push({
    id: "competitive-landscape",
    title: "Competitive Landscape",
    blocks: [
      textBlock("cl-text-1", 1),
      swotBlock(
        "cl-swot-1",
        ["End-to-end vertical integration", "Unlimited distribution networks", "Access to proprietary silicon"],
        ["Slower deployment cycles", "Regulatory scrutiny in EU/US", "High latency for specific edge tasks"],
        ["Expanding into localized edge data centers", "Acquiring tier-3 applied AI startups"],
        ["Open-source model proliferation", "Geopolitical silicon embargoes"]
      ),
      chartBlock(
        "cl-chart-1",
        "donut",
        "Market Share Distribution",
        "Tier 1 Hyperscalers currently dominate, but Tier 2 is rapidly eroding their margin in niche applications.",
        [
          { name: "Hyperscalers (Tier 1)", value: 62, color: "#0D212C" },
          { name: "Foundation Models (Tier 2)", value: 25, color: "#36c0c9" },
          { name: "Applied AI Startups (Tier 3)", value: 13, color: "#94A3B8" }
        ],
        { dataKey: "value" }
      ),
      textBlock("cl-text-2", 4),
      calloutBlock("cl-callout-1", "Watch Out", "Regulatory Fragmentation", "The EU AI Act combined with decentralized US state policies will create a fragmented compliance landscape, disproportionately impacting Tier 2 Foundation Models."),
      sourcesBlock("cl-sources")
    ]
  });

  // Inject V2 regeneration insight if needed
  if (isV2) {
    sections.unshift({
      id: 'version-diff',
      title: 'Version Highlights',
      ...generateConfidence(),
      blocks: [
        calloutBlock("v2-callout", "Business Impact", "New Data Integrated", "Based on your feedback, this version incorporates Q3 institutional capital deployment metrics and revised supply chain forecasts."),
        textBlock("v2-text", 2),
        sourcesBlock("v2-sources")
      ]
    });
  }

  // To reach the 10-page minimum requirement, we dynamically pad 7 more deep-dive sections
  for (let i = 1; i <= 7; i++) {
    sections.push({
      id: `deep-dive-${i}`,
      title: `Deep Dive: ${['Regulatory', 'Investment', 'Risk', 'Talent', 'Future Trends', 'Competitor Matrix', 'Strategic Roadmap'][i - 1]}`,
      ...generateConfidence(),
      blocks: [
        textBlock(`dd-${i}-text-1`, 3),
        kpiBlock(`dd-${i}-kpi`, [
          { label: "Sector Momentum", value: `+${Math.floor(Math.random() * 50 + 20)}%`, trend: "up" },
          { label: "Capital Inflow", value: `$${(Math.random() * 10).toFixed(1)}B`, trend: "up" },
          { label: "Regulatory Risk", value: Math.random() > 0.5 ? "High" : "Medium", trend: "down" }
        ]),
        chartBlock(
          `dd-${i}-chart`,
          "area",
          `Projected Adoption Timeline - Scenario ${i}`,
          "Multi-scenario projection based on current capital allocation.",
          [
            { year: "2024", base: 100, upside: 100, downside: 100 },
            { year: "2025", base: 120, upside: 140, downside: 105 },
            { year: "2026", base: 150, upside: 210, downside: 110 },
            { year: "2027", base: 200, upside: 320, downside: 115 },
            { year: "2028", base: 280, upside: 500, downside: 120 },
          ],
          { lines: [{ key: "base", color: "#36c0c9", name: "Base Case" }, { key: "upside", color: "#0D212C", name: "Upside" }] }
        ),
        calloutBlock(`dd-${i}-callout`, "Market Opportunity", `Leverage Early Adoption in Sector ${i}`, "First-mover advantage in this specific vertical yields a 3x higher retention rate compared to broad-market approaches."),
        textBlock(`dd-${i}-text-2`, 4),
        quoteBlock(`dd-${i}-quote`, "Organizations that fail to recognize the nuanced demands of this sector will find themselves permanently locked out of the next super-cycle.", "Executive Board", "Global Tech Council"),
        sourcesBlock(`dd-${i}-sources`)
      ]
    });
  }

  return sections;
};
