type Level = 'debug' | 'info' | 'warn' | 'error';

type LevelConfig = {
  label: string;
  css: string;
  rank: number;
};

const LEVELS: Record<Level, LevelConfig> = {
  debug: {
    label: 'DEBUG',
    css: 'color:#6b7280;font-weight:600',
    rank: 10
  },
  info: {
    label: 'INFO',
    css: 'color:#0284c7;font-weight:600',
    rank: 20
  },
  warn: {
    label: 'WARN',
    css: 'color:#d97706;font-weight:600',
    rank: 30
  },
  error: {
    label: 'ERROR',
    css: 'color:#dc2626;font-weight:700',
    rank: 40
  }
};

const pad = (n: number, width = 2): string => String(n).padStart(width, '0');

const timestamp = (): string => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
};

const minRank = (): number => {
  if (process.env.NODE_ENV === 'production') return LEVELS.info.rank;
  return LEVELS.debug.rank;
};

const write = (level: Level, scope: string | undefined, args: unknown[]): void => {
  const cfg = LEVELS[level];
  if (cfg.rank < minRank()) return;
  const tag = scope ? `[${scope}] ` : '';
  const prefix = `%c${timestamp()} %c${cfg.label}%c ${tag}`;
  const styles = [
    'color:#9ca3af',
    cfg.css,
    'color:inherit;font-weight:400'
  ];
  console[level](prefix, ...styles, ...args);
};

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  scope: (name: string) => Logger;
}

export const logger: Logger = {
  debug: (...args) => write('debug', undefined, args),
  info: (...args) => write('info', undefined, args),
  warn: (...args) => write('warn', undefined, args),
  error: (...args) => write('error', undefined, args),
  scope: (name) => scoped(name)
};

const scoped = (name: string): Logger => ({
  debug: (...args) => write('debug', name, args),
  info: (...args) => write('info', name, args),
  warn: (...args) => write('warn', name, args),
  error: (...args) => write('error', name, args),
  scope: (child) => scoped(`${name}:${child}`)
});
