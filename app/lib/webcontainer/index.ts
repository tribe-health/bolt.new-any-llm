import { WebContainer } from '@webcontainer/api';
import { WORK_DIR_NAME } from '~/utils/constants';

interface WebContainerContext {
  loaded: boolean;
}

declare global {
  interface ImportMetaHot {
    data: Record<string, any>;
  }
}

export const webcontainerContext: WebContainerContext = (import.meta.hot?.data.webcontainerContext as WebContainerContext) ?? {
  loaded: false,
};

if (import.meta.hot) {
  import.meta.hot.data.webcontainerContext = webcontainerContext;
}

export let webcontainer: Promise<WebContainer> = new Promise(() => {
  // noop for ssr
});

if (!import.meta.env.SSR) {
  webcontainer =
    (import.meta.hot?.data.webcontainer as Promise<WebContainer>) ??
    Promise.resolve()
      .then(() => {
        return WebContainer.boot({
          workdirName: WORK_DIR_NAME,
        });
      })
      .then((webcontainer) => {
        webcontainerContext.loaded = true;
        return webcontainer;
      });

  if (import.meta.hot) {
    import.meta.hot.data.webcontainer = webcontainer;
  }
}
