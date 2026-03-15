export const PIPE_TYPES = ['straight', 'corner', 'tee'] as const;

export type PipeType = (typeof PIPE_TYPES)[number];

export type PipeModel = {
  type: PipeType;
};
