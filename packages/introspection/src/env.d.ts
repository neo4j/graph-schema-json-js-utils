/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TESTING_BOLT_URL: string;
  readonly VITE_TESTING_BOLT_USER: string;
  readonly VITE_TESTING_BOLT_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
