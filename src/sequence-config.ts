export type SequenceItem =
  | { type: 'code'; files: string[] }
  | { type: 'text'; content: string; duration?: number; color?: string };

export const sequence: SequenceItem[] = [
  { type: 'text', content: 'Constructor Property Promotion', duration: 60, color: '#fff'},
  { type: 'code', files: ['code2.php', 'code3.php'] },
  { type: 'text', content: 'Named Arguments', duration: 60, color: '#fff'},
  { type: 'code', files: ['code4.php', 'code5.php'] },
];
