export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1>Impressum</h1>
        
        <h2>Verantwortlich für den Inhalt</h2>
        <p>
          <strong>AmtHelper GmbH</strong><br />
          support@amthelper.de
        </p>

        <h2>Datenschutz</h2>
        <p>
          Informationen zur Verarbeitung Ihrer personenbezogenen Daten finden Sie in unserer{' '}
          <a href="/datenschutz" className="text-blue-600 hover:underline">
            Datenschutzerklärung
          </a>
          .
        </p>

        <h2>Haftungsausschluss</h2>
        <p>
          AmtHelper stellt die Informationen auf dieser Website ohne Gewähr zur Verfügung. Eine Haftung für die Vollständigkeit, Richtigkeit und Zugänglichkeit wird nicht übernommen.
        </p>

        <h2>Verstoß melden</h2>
        <p>
          Falls Sie einen Verstoß gegen diese Bedingungen oder geltende Gesetze feststellen, kontaktieren Sie bitte:
        </p>
        <p>
          <strong>abuse@amthelper.de</strong>
        </p>

        <p className="text-sm text-gray-600 mt-8">
          Zuletzt aktualisiert: 11. Juni 2026
        </p>
      </div>
    </div>
  );
}
