const stats = [
  { label: "Core tables", value: "8" },
  { label: "Team size", value: "6" },
  { label: "Build window", value: "5–6 wks" },
];

const features = [
  {
    title: "Trip home base",
    text: "Create a trip, invite members, set dates, and keep every link, vote, schedule item, and cost in one shared source of truth.",
  },
  {
    title: "Location-backed proposals",
    text: "Members suggest restaurants, museums, hikes, and activities with latitude, longitude, notes, estimated cost, and Google Places context.",
  },
  {
    title: "Fast group decisions",
    text: "Upvote, downvote, and comment on proposals. Wayfare tallies votes and promotes winners into the itinerary without another fifty-message thread.",
  },
  {
    title: "Map + timeline itinerary",
    text: "Accepted ideas become day-by-day itinerary cards synced to an interactive map so the group can see timing and geography together.",
  },
  {
    title: "Shared expense ledger",
    text: "Log purchases as they happen, split them by member, and calculate who owes whom before the trip ends.",
  },
  {
    title: "Live collaboration",
    text: "Supabase realtime subscriptions push vote and schedule changes to the group, with refresh-on-action as a safe fallback.",
  },
];

const tables = ["trips", "trip_members", "proposals", "votes", "itinerary_items", "expenses", "expense_splits", "profiles"];

const roles = [
  "Frontend lead: Next.js shell, responsive UI, component system",
  "Proposal + voting owner: forms, vote states, tally display",
  "Itinerary + maps owner: Google Maps view, timeline scheduling",
  "Backend owner: Supabase schema, RLS, API helpers",
  "Expenses owner: ledger, split math, balance summaries",
  "QA/deployment owner: seeded data, Vercel, polish, demos",
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav" aria-label="Main navigation">
          <div className="brand"><span>✦</span> Wayfare</div>
          <div className="navLinks">
            <a href="#product">Product</a>
            <a href="#architecture">Architecture</a>
            <a href="#plan">Plan</a>
          </div>
        </nav>

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Group trips without group-chat chaos</p>
            <h1>Plan, vote, map, and split costs in one shared trip workspace.</h1>
            <p className="lede">
              Wayfare replaces scattered screenshots, spreadsheets, map links, and payment reminders with a single collaborative itinerary that your whole group can trust.
            </p>
            <div className="actions">
              <a className="button primary" href="#demo">Explore the demo</a>
              <a className="button secondary" href="#architecture">See the stack</a>
            </div>
            <div className="stats" aria-label="Project scope statistics">
              {stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
            </div>
          </div>

          <div className="appMock" id="demo" aria-label="Wayfare product mockup">
            <div className="mockHeader"><span></span><span></span><span></span><b>Barcelona Weekend</b></div>
            <div className="mockBody">
              <div className="mapPanel">
                <div className="routeLine"></div>
                <span className="pin pinOne">1</span><span className="pin pinTwo">2</span><span className="pin pinThree">3</span>
              </div>
              <div className="sidePanel">
                <p className="panelTitle">Winning proposals</p>
                <div className="voteCard"><b>Picasso Museum</b><span>12 votes · $18</span></div>
                <div className="voteCard"><b>Tapas crawl</b><span>10 votes · $35</span></div>
                <div className="balance"><b>Balances</b><p>Mina owes Alex $24.50</p><p>Jay owes Priya $18.00</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="product">
        <p className="eyebrow">Product scope</p>
        <h2>A bounded app with a real coordination loop.</h2>
        <div className="featureGrid">
          {features.map((feature) => <article className="card" key={feature.title}><h3>{feature.title}</h3><p>{feature.text}</p></article>)}
        </div>
      </section>

      <section className="split section" id="architecture">
        <div>
          <p className="eyebrow">Technical architecture</p>
          <h2>Portfolio-ready, team-sized, and deployable.</h2>
          <p>
            The app uses Next.js on Vercel for the frontend, Supabase for managed Postgres, Auth, Row Level Security, and realtime events, plus Google Maps Platform for Places autocomplete and itinerary visualization.
          </p>
        </div>
        <div className="stackCard">
          <div><span>Frontend</span><b>Next.js + React</b></div>
          <div><span>Backend & DB</span><b>Supabase Postgres + Auth</b></div>
          <div><span>Maps</span><b>Google Places + Maps JS API</b></div>
          <div><span>Deploy</span><b>Vercel from GitHub</b></div>
        </div>
      </section>

      <section className="section schema">
        <p className="eyebrow">Data model</p>
        <h2>Relational data connects members, decisions, schedules, and money.</h2>
        <div className="tablePills">{tables.map((table) => <span key={table}>{table}</span>)}</div>
      </section>

      <section className="section split" id="plan">
        <div>
          <p className="eyebrow">Feasibility</p>
          <h2>Ambitious enough for six people, cuttable when needed.</h2>
          <ul className="checklist">
            <li>Realtime collaboration starts with Supabase subscriptions; refresh-on-action remains the fallback.</li>
            <li>RLS policies are tested early so only trip members can read or write trip data.</li>
            <li>Maps usage is protected with cached place details and manual entry as a backup.</li>
            <li>Feature ownership and small PRs reduce merge conflicts across the team.</li>
          </ul>
        </div>
        <div className="roles">
          <h3>Defined roles</h3>
          {roles.map((role) => <p key={role}>{role}</p>)}
        </div>
      </section>
    </main>
  );
}
