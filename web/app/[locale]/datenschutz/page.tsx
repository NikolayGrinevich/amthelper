import { readFileSync } from 'fs';
import path from 'path';

const datenschutzPath = path.join(process.cwd(), '../compliance/DATENSCHUTZERKLAERUNG.md');

async function getContent() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return `# Datenschutzerklärung

AmtHelper respektiert Ihre Privatsphäre vollständig gemäß DSGVO.

- E-Mail: support@amthelper.de
- Datenschutzbehörde: Bundesdatenschutzbeauftragte (BfDI)`;
    }
    
    const content = readFileSync(datenschutzPath, 'utf-8');
    return content;
  } catch {
    return `# Datenschutzerklärung

Vollständige Datenschutzerklärung wird geladen...`;
  }
}

export default async function DatenschutzPage() {
  const content = await getContent();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        {content.split('\n').map((line, i) => {
          if (line.startsWith('# ')) {
            return <h1 key={i} className="text-4xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
          }
          if (line.startsWith('- ')) {
            return <li key={i} className="ml-6 mb-1">{line.replace('- ', '')}</li>;
          }
          if (line.startsWith('| ')) {
            return <p key={i} className="font-mono text-sm bg-gray-100 p-2 rounded mb-2">{line}</p>;
          }
          if (line.trim() === '') {
            return <p key={i} className="mb-4"></p>;
          }
          return <p key={i} className="mb-3">{line}</p>;
        })}
      </div>
    </div>
  );
}
