export const envMapper = {
  DB_HOST: String,
  DB_USER: String,
  DB_PORT: Number,
  DB_PASS: String,
  DB_DATABASE: String,
};

export type EnvMapper = typeof envMapper;
export type EnvKey = keyof EnvMapper;
