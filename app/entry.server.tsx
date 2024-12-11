import * as React from 'react';
import type { EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToString } from 'react-dom/server';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const userAgent = request.headers.get('user-agent');
  const isBot = isbot(userAgent ?? '');

  // If the request is from a bot, we want to wait for all content to be loaded
  // before sending the response. Otherwise, we can send the response as soon as
  // the shell is ready.
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
