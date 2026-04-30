export default function PrivacyPage() {
  return (
    <div className="sm:ml-52 max-w-2xl space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold mb-1">Privacyverklaring</h1>
        <p className="text-gray-500 text-sm">Versie 1.0 · April 2026</p>
      </div>

      <Section title="1. Wie zijn wij">
        <p>FitTrack is een persoonlijke fitness-applicatie waarmee gebruikers hun trainingen kunnen bijhouden en voortgang kunnen analyseren. De app wordt beheerd door:</p>
        <ul className="mt-2 space-y-1 text-gray-400">
          <li>Naam beheerder: Joris Boes</li>
          <li>E-mail: <a href="mailto:jorisboes@gmail.com" className="text-green-400 hover:text-green-300">jorisboes@gmail.com</a></li>
          <li>Locatie: Groningen, Nederland</li>
        </ul>
      </Section>

      <Section title="2. Welke gegevens verzamelen wij">
        <ul className="space-y-2 text-gray-400">
          <li><span className="text-gray-200 font-medium">Accountgegevens:</span> e-mailadres en gebruikersnaam bij registratie</li>
          <li><span className="text-gray-200 font-medium">Trainingsdata:</span> naam, datum, duur, oefeningen, sets, herhalingen en gewichten per training</li>
          <li><span className="text-gray-200 font-medium">Community-inhoud:</span> oefeningen die je publiceert of voorstelt</li>
          <li><span className="text-gray-200 font-medium">Technische gegevens:</span> IP-adres en inlogmomenten, automatisch opgeslagen door Supabase</li>
        </ul>
      </Section>

      <Section title="3. Waarom verwerken wij jouw gegevens">
        <ul className="space-y-1 text-gray-400">
          <li>Het mogelijk maken van je account en het opslaan van je trainingsgeschiedenis</li>
          <li>Het tonen van persoonlijke statistieken en voortgang</li>
          <li>Het functioneren van de community-sectie</li>
          <li>Het verbeteren en onderhouden van de applicatie</li>
        </ul>
        <p className="mt-3 text-gray-400">Wij verkopen jouw gegevens niet aan derden en gebruiken ze niet voor advertentiedoeleinden.</p>
      </Section>

      <Section title="4. Toegang door de beheerder">
        <p className="text-gray-400">Als beheerder heeft Joris Boes via het Supabase-beheerderspaneel technische toegang tot alle gebruikersdata, inclusief trainingsgegevens. Deze toegang is uitsluitend bedoeld voor technisch beheer, bugfixing en verbetering van de app. Er worden geen gegevens van individuele gebruikers buiten dit doel verwerkt. De beheerder is gebonden aan geheimhouding.</p>
      </Section>

      <Section title="5. Opslag en beveiliging">
        <p className="text-gray-400 mb-2">Alle gegevens worden opgeslagen in Supabase, een beveiligde cloud-database. Wij treffen de volgende technische maatregelen:</p>
        <ul className="space-y-1 text-gray-400">
          <li>Row Level Security (RLS): elke gebruiker ziet uitsluitend zijn eigen data</li>
          <li>Versleutelde verbindingen (HTTPS) voor alle communicatie</li>
          <li>Authenticatie via Supabase Auth met beveiligde tokens</li>
        </ul>
      </Section>

      <Section title="6. Bewaartermijn">
        <p className="text-gray-400">Jouw gegevens worden bewaard zolang je een actief account hebt. Wanneer je je account verwijdert, worden jouw gegevens uiterlijk binnen 30 dagen verwijderd.</p>
      </Section>

      <Section title="7. Jouw rechten (AVG)">
        <p className="text-gray-400 mb-2">Op grond van de AVG heb je recht op inzage, correctie, verwijdering, bezwaar en dataportabiliteit. Neem contact op via <a href="mailto:jorisboes@gmail.com" className="text-green-400 hover:text-green-300">jorisboes@gmail.com</a> — wij reageren binnen 30 dagen.</p>
      </Section>

      <Section title="8. Contact en klachten">
        <p className="text-gray-400">Voor vragen: <a href="mailto:jorisboes@gmail.com" className="text-green-400 hover:text-green-300">jorisboes@gmail.com</a>. Voor klachten kun je terecht bij de <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">Autoriteit Persoonsgegevens</a>.</p>
      </Section>

      <Section title="9. Wijzigingen">
        <p className="text-gray-400">Deze verklaring kan worden gewijzigd. De meest recente versie is altijd beschikbaar op deze pagina.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-gray-100 mb-2">{title}</h2>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}
