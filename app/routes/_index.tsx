
import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { Header } from '~/components/header/Header';
import { Chat } from '~/components/chat/Chat.client';

export const meta: MetaFunction = () => {
  return [
    { title: 'Zeus AI' },
    { name: 'description', content: 'Your AI-powered coding assistant' }
  ];
};

export const loader = () => json({});

export default function Index() {
  return (
    <div className="flex flex-col h-full w-full bg-zeus-dark-background">
      <Header />
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => {
          
          return <Chat />;
        }}
      </ClientOnly>
    </div>
  );
}