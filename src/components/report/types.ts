export type BlockType = 
  | 'text' 
  | 'kpi-grid' 
  | 'chart' 
  | 'swot' 
  | 'callout' 
  | 'timeline' 
  | 'table' 
  | 'image' 
  | 'quote' 
  | 'two-column'
  | 'sources-list';

export interface ReportBlock {
  id: string;
  type: BlockType;
  data: any;
}

export interface ReportSection {
  id: string;
  title: string;
  blocks: ReportBlock[];
  confidenceScore?: number;
  confidenceReason?: string;
}
