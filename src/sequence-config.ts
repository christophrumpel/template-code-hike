export type SequenceItem =
  | { type: 'code'; files?: string[]; examples?: string[] }
  | { type: 'static-code'; file?: string; example?: string; duration?: number }
  | { type: 'text'; content: string; duration?: number; color?: string };

export const sequence: SequenceItem[] = [
  { type: 'static-code', file: 'code5.php', duration: 90 },
  { type: 'text', content: 'Constructor Property Promotion', duration: 60, color: '#fff'},
  { type: 'code', files: ['code2.php', 'code3.php'] },
  { type: 'text', content: 'Named Arguments', duration: 60, color: '#fff'},
  { type: 'code', files: ['code4.php', 'code5.php'] },
];
