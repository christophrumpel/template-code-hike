export type SequenceItem =
  | { type: 'code'; files: string[] }
  | { type: 'text'; content: string; duration?: number };

export const sequence: SequenceItem[] = [
  { type: 'code', files: ['code2.php', 'code3.php'] },
  { type: 'text', content: 'This is an explanation slide', duration: 60 },
  { type: 'code', files: ['code4.php', 'code5.php'] },
];
