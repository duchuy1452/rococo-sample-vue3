export const PRIORITY = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
}

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Low',
  [PRIORITY.MEDIUM]: 'Medium',
  [PRIORITY.HIGH]: 'High',
}

export const PRIORITY_OPTIONS = [
  { label: 'Low', value: PRIORITY.LOW },
  { label: 'Medium', value: PRIORITY.MEDIUM },
  { label: 'High', value: PRIORITY.HIGH },
]

export const DEFAULT_PRIORITY = PRIORITY.LOW
