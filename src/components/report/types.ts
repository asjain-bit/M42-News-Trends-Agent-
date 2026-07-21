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
  | 'two-column';

export interface ReportBlock {
  id: string;
  type: BlockType;
  data: any;
}

export interface ReportSection {
  id: string;
  title: string;
  blocks: ReportBlock[];
}
