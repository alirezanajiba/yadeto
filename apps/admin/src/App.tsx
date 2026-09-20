import { useEffect, useMemo } from 'react';
import legacyDocument from './legacy.html?raw';
import { initializeAdmin } from './admin.js';
import './styles.css';

function getLegacyBody(documentMarkup: string) {
  const body = documentMarkup.match(/<body[^>]*>([\s\S]*?)<script\s+type="module"/i)?.[1];
  if (!body) throw new Error('قالب رابط مدیریت قابل خواندن نیست.');
  return body;
}

export default function App() {
  const markup = useMemo(() => getLegacyBody(legacyDocument), []);

  useEffect(() => initializeAdmin(), []);

  return <div className="react-admin-root" dangerouslySetInnerHTML={{ __html: markup }} />;
}
