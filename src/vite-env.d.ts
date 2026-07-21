/// <reference types="vite/client" />

declare const __BUILD_TIME__: string;
declare const __GIT_COMMITS__: number;
declare const __LINES_OF_CODE__: number;

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

interface Document {
  startViewTransition?: (callback: () => void) => ViewTransition;
}
