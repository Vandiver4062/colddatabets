'use client'
import { useState, useEffect, useRef } from 'react'

// ── DATA ────────────────────────────────────────────────────────────
const NBA_TEAMS = [
  {a:'ATL',f:'Atlanta Hawks'},{a:'BOS',f:'Boston Celtics'},{a:'BKN',f:'Brooklyn Nets'},
  {a:'CHA',f:'Charlotte Hornets'},{a:'CHI',f:'Chicago Bulls'},{a:'CLE',f:'Cleveland Cavaliers'},
  {a:'DAL',f:'Dallas Mavericks'},{a:'DEN',f:'Denver Nuggets'},{a:'DET',f:'Detroit Pistons'},
  {a:'GS',f:'Golden State Warriors'},{a:'HOU',f:'Houston Rockets'},{a:'IND',f:'Indiana Pacers'},
  {a:'LAC',f:'LA Clippers'},{a:'LAL',f:'LA Lakers'},{a:'MEM',f:'Memphis Grizzlies'},
  {a:'MIA',f:'Miami Heat'},{a:'MIL',f:'Milwaukee Bucks'},{a:'MIN',f:'Minnesota Timberwolves'},
  {a:'NO',f:'New Orleans Pelicans'},{a:'NYK',f:'New York Knicks'},{a:'OKC',f:'OKC Thunder'},
  {a:'ORL',f:'Orlando Magic'},{a:'PHI',f:'Philadelphia 76ers'},{a:'PHX',f:'Phoenix Suns'},
  {a:'POR',f:'Portland Trail Blazers'},{a:'SAC',f:'Sacramento Kings'},{a:'SAS',f:'San Antonio Spurs'},
  {a:'TOR',f:'Toronto Raptors'},{a:'UTA',f:'Utah Jazz'},{a:'WAS',f:'Washington Wizards'},
]

const NHL_TEAMS = [
  {a:'ANA',f:'Anaheim Ducks'},{a:'BOS',f:'Boston Bruins'},{a:'BUF',f:'Buffalo Sabres'},
  {a:'CGY',f:'Calgary Flames'},{a:'CAR',f:'Carolina Hurricanes'},{a:'CHI',f:'Chicago Blackhawks'},
  {a:'COL',f:'Colorado Avalanche'},{a:'CBJ',f:'Columbus Blue Jackets'},{a:'DAL',f:'Dallas Stars'},
  {a:'DET',f:'Detroit Red Wings'},{a:'EDM',f:'Edmonton Oilers'},{a:'FLA',f:'Florida Panthers'},
  {a:'LA',f:'Los Angeles Kings'},{a:'MIN',f:'Minnesota Wild'},{a:'MTL',f:'Montreal Canadiens'},
  {a:'NSH',f:'Nashville Predators'},{a:'NJ',f:'New Jersey Devils'},{a:'NYI',f:'New York Islanders'},
  {a:'NYR',f:'New York Rangers'},{a:'OTT',f:'Ottawa Senators'},{a:'PHI',f:'Philadelphia Flyers'},
  {a:'PIT',f:'Pittsburgh Penguins'},{a:'STL',f:'St. Louis Blues'},{a:'SJ',f:'San Jose Sharks'},
  {a:'SEA',f:'Seattle Kraken'},{a:'TB',f:'Tampa Bay Lightning'},{a:'TOR',f:'Toronto Maple Leafs'},
  {a:'VAN',f:'Vancouver Canucks'},{a:'VGK',f:'Vegas Golden Knights'},{a:'WSH',f:'Washington Capitals'},
  {a:'WPG',f:'Winnipeg Jets'},
]

const MLB_DIVS = ['AL East','AL Central','AL West','NL East','NL Central','NL West']
const MLB_TEAMS = [
  {a:'BAL',f:'Baltimore Orioles',d:'AL East'},{a:'BOS',f:'Boston Red Sox',d:'AL East'},
  {a:'NYY',f:'New York Yankees',d:'AL East'},{a:'TB',f:'Tampa Bay Rays',d:'AL East'},
  {a:'TOR',f:'Toronto Blue Jays',d:'AL East'},{a:'CWS',f:'Chicago White Sox',d:'AL Central'},
  {a:'CLE',f:'Cleveland Guardians',d:'AL Central'},{a:'DET',f:'Detroit Tigers',d:'AL Central'},
  {a:'KC',f:'Kansas City Royals',d:'AL Central'},{a:'MIN',f:'Minnesota Twins',d:'AL Central'},
  {a:'HOU',f:'Houston Astros',d:'AL West'},{a:'LAA',f:'Los Angeles Angels',d:'AL West'},
  {a:'OAK',f:'Oakland Athletics',d:'AL West'},{a:'SEA',f:'Seattle Mariners',d:'AL West'},
  {a:'TEX',f:'Texas Rangers',d:'AL West'},{a:'ATL',f:'Atlanta Braves',d:'NL East'},
  {a:'MIA',f:'Miami Marlins',d:'NL East'},{a:'NYM',f:'New York Mets',d:'NL East'},
  {a:'PHI',f:'Philadelphia Phillies',d:'NL East'},{a:'WSH',f:'Washington Nationals',d:'NL East'},
  {a:'CHC',f:'Chicago Cubs',d:'NL Central'},{a:'CIN',f:'Cincinnati Reds',d:'NL Central'},
  {a:'MIL',f:'Milwaukee Brewers',d:'NL Central'},{a:'PIT',f:'Pittsburgh Pirates',d:'NL Central'},
  {a:'STL',f:'St. Louis Cardinals',d:'NL Central'},{a:'ARI',f:'Arizona Diamondbacks',d:'NL West'},
  {a:'COL',f:'Colorado Rockies',d:'NL West'},{a:'LAD',f:'Los Angeles Dodgers',d:'NL West'},
  {a:'SD',f:'San Diego Padres',d:'NL West'},{a:'SF',f:'San Francisco Giants',d:'NL West'},
]

const MLB_SPS = {
  BAL:['Corbin Burnes','Zach Eflin','Dean Kremer','Kyle Bradish','Cole Irvin'],
  BOS:['Tanner Houck','Brayan Bello','Kutter Crawford','Nick Pivetta','Lucas Giolito'],
  NYY:['Gerrit Cole','Carlos Rodon','Clarke Schmidt','Luis Gil','Marcus Stroman'],
  TB:['Zack Littell','Taj Bradley','Ryan Pepiot','Drew Rasmussen','Aaron Civale'],
  TOR:['Kevin Gausman','Jose Berrios','Chris Bassitt','Yusei Kikuchi','Bowden Francis'],
  CWS:['Garrett Crochet','Erick Fedde','Jonathan Cannon','Chris Flexen'],
  CLE:['Shane Bieber','Tanner Bibee','Gavin Williams','Ben Lively','Carlos Carrasco'],
  DET:['Tarik Skubal','Jack Flaherty','Reese Olson','Casey Mize','Kenta Maeda'],
  KC:['Cole Ragans','Seth Lugo','Brady Singer','Alec Marsh','Michael Lorenzen'],
  MIN:['Pablo Lopez','Joe Ryan','Bailey Ober','David Festa','Simeon Woods Richardson'],
  HOU:['Framber Valdez','Hunter Brown','Ronel Blanco','Spencer Arrighetti','Lance McCullers'],
  LAA:['Tyler Anderson','Patrick Sandoval','Griffin Canning','Jose Suarez','Davis Daniel'],
  OAK:['JP Sears','Paul Blackburn','Mitch Spence','Joe Boyle'],
  SEA:['Logan Gilbert','George Kirby','Luis Castillo','Bryan Woo','Emerson Hancock'],
  TEX:['Nathan Eovaldi','Jacob deGrom','Jon Gray','Cody Bradford','Andrew Heaney'],
  ATL:['Spencer Strider','Chris Sale','Max Fried','Reynaldo Lopez','Charlie Morton'],
  MIA:['Sandy Alcantara','Jesus Luzardo','Braxton Garrett','Trevor Rogers','Roddery Munoz'],
  NYM:['Kodai Senga','Sean Manaea','Luis Severino','Tylor Megill','Jose Quintana'],
  PHI:['Zack Wheeler','Aaron Nola','Ranger Suarez','Cristopher Sanchez','Taijuan Walker'],
  WSH:['MacKenzie Gore','Jake Irvin','Trevor Williams','Mitchell Parker','Patrick Corbin'],
  CHC:['Justin Steele','Jameson Taillon','Jordan Wicks','Ben Brown','Kyle Hendricks'],
  CIN:['Hunter Greene','Frankie Montas','Brandon Williamson','Graham Ashcraft','Nick Martinez'],
  MIL:['Freddy Peralta','Colin Rea','Wade Miley','Joe Ross'],
  PIT:['Paul Skenes','Mitch Keller','Jared Jones','Bailey Falter','Martin Perez'],
  STL:['Sonny Gray','Miles Mikolas','Lance Lynn','Steven Matz','Kyle Gibson'],
  ARI:['Zac Gallen','Merrill Kelly','Brandon Pfaadt','Ryne Nelson','Slade Cecconi'],
  COL:['Kyle Freeland','Austin Gomber','Cal Quantrill','Ryan Feltner','Dakota Hudson'],
  LAD:['Yoshinobu Yamamoto','Tyler Glasnow','Shohei Ohtani','Bobby Miller','River Ryan'],
  SD:['Dylan Cease','Yu Darvish','Michael King','Joe Musgrove','Matt Waldron'],
  SF:['Logan Webb','Blake Snell','Robbie Ray','Jordan Hicks','Kyle Harrison'],
}

const MLB_PARKS = {
  BAL:'Camden Yards',BOS:'Fenway Park',NYY:'Yankee Stadium',TB:'Tropicana Field',
  TOR:'Rogers Centre',CWS:'Guaranteed Rate Field',CLE:'Progressive Field',DET:'Comerica Park',
  KC:'Kauffman Stadium',MIN:'Target Field',HOU:'Minute Maid Park',LAA:'Angel Stadium',
  OAK:'Oakland Coliseum',SEA:'T-Mobile Park',TEX:'Globe Life Field',ATL:'Truist Park',
  MIA:'loanDepot Park',NYM:'Citi Field',PHI:'Citizens Bank Park',WSH:'Nationals Park',
  CHC:'Wrigley Field',CIN:'Great American Ball Park',MIL:'American Family Field',
  PIT:'PNC Park',STL:'Busch Stadium',ARI:'Chase Field',COL:'Coors Field',
  LAD:'Dodger Stadium',SD:'Petco Park',SF:'Oracle Park',
}

const SPORT_COLORS = { nba: '#f97316', nhl: '#38bdf8', mlb: '#22c55e' }
const SPORT_SOURCES = {
  nba: ['@Codify','@VSiN','Pace/Tempo','ORtg/DRtg','10yr ATS'],
  nhl: ['MoneyPuck','Nat Stat Trick','xGF%','PDO','CF%'],
  mlb: ['@BallparkPal','@Codify','@VSiN','Park Factors','10yr ATS'],
}

// ── HELPERS ─────────────────────────────────────────────────────────
function pillStyle(c) {
  const m = {
    green: 'rgba(0,230,118,0.12)',
    gold:  'rgba(251,191,36,0.12)',
    red:   'rgba(255,61,87,0.12)',
    blue:  'rgba(14,165,233,0.12)',
  }
  const t = { green:'#00e676', gold:'#fbbf24', red:'#ff3d57', blue:'#0ea5e9' }
  const b = { green:'rgba(0,230,118,0.25)', gold:'rgba(251,191,36,0.25)', red:'rgba(255,61,87,0.25)', blue:'rgba(14,165,233,0.25)' }
  return { background: m[c]||m.blue, color: t[c]||t.blue, border: `1px solid ${b[c]||b.blue}` }
}

function badgeStyle(v) {
  const map = { positive:'green', negative:'red', neutral:'blue', EVEN:'blue', HOT:'green', COLD:'red', NEUTRAL:'blue' }
  const norm = map[v] || (typeof v === 'string' && v.includes('AWAY') ? 'gold' : typeof v === 'string' && v.includes('HOME') ? 'gold' : 'blue')
  return pillStyle(norm)
}

function fmtDate(s) {
  try { return new Date(s + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' }).toUpperCase() }
  catch(e) { return s }
}

function buildPrompt(sport, away, home, date, extras) {
  const allTeams = sport==='nba' ? NBA_TEAMS : sport==='nhl' ? NHL_TEAMS : MLB_TEAMS
  const af = allTeams.find(t=>t.a===away)?.f || away
  const hf = allTeams.find(t=>t.a===home)?.f || home
  const schema = `{"pick":"","odds":"","betType":"","units":"1","confidence":70,"confColor":"green or gold or red","verdict":"ALL CAPS MAX 10 WORDS","reasoning":"3-4 sentences sharp analysis","teamA":{"label":"","stat1label":"","stat1val":"","stat2label":"","stat2val":"","stat3label":"","stat3val":"","stat4label":"","stat4val":"","trend":"HOT or COLD or NEUTRAL"},"teamB":{"label":"","stat1label":"","stat1val":"","stat2label":"","stat2val":"","stat3label":"","stat3val":"","stat4label":"","stat4val":"","trend":"HOT or COLD or NEUTRAL"},"keyMatchup":{"title":"","stat1label":"","stat1val":"","stat2label":"","stat2val":"","stat3label":"","stat3val":"","edge":"AWAY or HOME or EVEN"},"h2h":{"last10":"","atsSplit":"","totalTrend":""},"sharpAction":"","keyInjuries":[],"pills":[{"text":"","color":"green"},{"text":"","color":"blue"},{"text":"","color":"gold"}],"tickerText":"","elevenlabsScript":"Cold data. Hot picks. [under 60 words]"}`

  if (sport === 'nba') {
    return `You are Cold Data Bets NBA engine. Deep NBA knowledge 2015-2025.
MATCHUP: ${away} (${af}) @ ${home} (${hf}) HOME | DATE: ${date}
INJURIES: ${extras.injuries || 'None'}
Search DraftKings odds: "${away} vs ${home} NBA DraftKings odds ${date}"
Analyze: pace/tempo, ORtg/DRtg, last 10 SU+ATS both teams, H2H 3 years, rest advantage, bench depth, injury impact, sharp money. Use @Codify and @VSiN data.
RULES: Spread ok. ML cap -250. Units: 1u=60-65%, 2u=66-70%, 3u=71-75%, 4u=76-80%, 5u=81%+. Pick highest edge.
teamA=${away} offense stats. teamB=${home} offense stats. keyMatchup title=PACE MATCHUP.
Return ONLY valid JSON no markdown: ${schema}`
  }

  if (sport === 'nhl') {
    return `You are Cold Data Bets NHL engine. Deep NHL knowledge 2015-2025.
MATCHUP: ${away} (${af}) @ ${home} (${hf}) HOME | DATE: ${date}
AWAY GOALIE: ${extras.goalieAway || 'TBD'} | HOME GOALIE: ${extras.goalieHome || 'TBD'}
INJURIES: ${extras.injuries || 'None'}
Search DraftKings odds: "${away} vs ${home} NHL DraftKings odds ${date}"
Analyze: goalie SV%/GAA/last 5 starts, xGF%, CF% shot attempts, PDO, PP/PK efficiency, last 10 SU+ATS, H2H 3 years, back-to-back flags, sharp money.
RULES: Puck line ok. ML cap -250. Units: 1u=60-65%, 2u=66-70%, 3u=71-75%, 4u=76-80%, 5u=81%+.
teamA=${away} goalie+attack stats. teamB=${home} goalie+attack stats. keyMatchup title=GOALIE MATCHUP.
Return ONLY valid JSON no markdown: ${schema}`
  }

  return `You are Cold Data Bets MLB engine. Deep MLB knowledge 2015-2025.
MATCHUP: ${away} (${af}) @ ${home} (${hf}) HOME | DATE: ${date} | PARK: ${MLB_PARKS[home] || 'Unknown'}
AWAY SP: ${extras.spAway || 'TBD'} | HOME SP: ${extras.spHome || 'TBD'}
INJURIES: ${extras.injuries || 'None'}
Search DraftKings odds: "${away} vs ${home} MLB DraftKings odds ${date}"
Analyze: SP recent form + career splits, bullpen workload last 3 days, wRC+/OPS last 30 days, last 10 SU+ATS, H2H 3 years, park run/HR factors, sharp money. Use @BallparkPal, @Codify, @VSiN.
RULES: ML cap -250, use RL or total if over -250. Units: 1u=60-65%, 2u=66-70%, 3u=71-75%, 4u=76-80%, 5u=81%+.
teamA=${away} SP+offense. teamB=${home} SP+offense. keyMatchup title=PITCHER MATCHUP.
Return ONLY valid JSON no markdown: ${schema}`
}

// ── COMPONENTS ──────────────────────────────────────────────────────

function StatRow({ label, value, color }) {
  if (!label && !value) return null
  const valColors = { g:'#00e676', o:'#fbbf24', r:'#ff3d57', b:'#0ea5e9' }
  const colorMap = { green:'g', gold:'o', red:'r', blue:'b', positive:'g', negative:'r', neutral:'b' }
  const c = colorMap[color] || null
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 0', borderBottom:'1px solid rgba(14,165,233,0.06)' }}>
      <span style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'0.05em' }}>{label}</span>
      <span style={{ fontSize:10, fontWeight:600, color: c ? valColors[c] : '#f0f6ff' }}>{value || '—'}</span>
    </div>
  )
}

function StatCard({ title, badge, badgeVal, children }) {
  return (
    <div style={{ background:'#0d1e30', border:'1px solid rgba(14,165,233,0.15)', borderRadius:8, overflow:'hidden' }}>
      <div style={{ padding:'8px 12px', borderBottom:'1px solid rgba(14,165,233,0.1)', background:'rgba(14,165,233,0.03)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:8, letterSpacing:'0.18em', color:'#0ea5e9' }}>{title}</span>
        {badge && <span style={{ fontSize:7, padding:'2px 5px', borderRadius:2, letterSpacing:'0.07em', ...badgeStyle(badgeVal) }}>{badge}</span>}
      </div>
      <div style={{ padding:'10px 12px' }}>{children}</div>
    </div>
  )
}

function TrendBadge({ trend }) {
  const map = { HOT: { label:'HOT', color:'green' }, COLD: { label:'COLD', color:'red' } }
  const t = map[trend] || { label:'NEUTRAL', color:'blue' }
  return <span style={{ fontSize:7, padding:'2px 5px', borderRadius:2, letterSpacing:'0.07em', ...pillStyle(t.color) }}>{t.label}</span>
}

function ResultPanel({ id, sport, away, home, date, result: r }) {
  const sc = SPORT_COLORS[sport]
  const cbc = r.confColor==='green' ? '#00e676' : r.confColor==='red' ? '#ff3d57' : '#fbbf24'
  const dd = fmtDate(date)
  const allTeams = sport==='nba' ? NBA_TEAMS : sport==='nhl' ? NHL_TEAMS : MLB_TEAMS
  const af = allTeams.find(t=>t.a===away)?.f || away
  const hf = allTeams.find(t=>t.a===home)?.f || home
  const tA = r.teamA || {}
  const tB = r.teamB || {}
  const km = r.keyMatchup || {}
  const expTxt = `// COLD DATA BETS — ${sport.toUpperCase()} PICK\n// ${away} @ ${home} · ${dd}\n\nPICK: ${r.pick||''}\nODDS: ${r.odds||''}\nTYPE: ${r.betType||''} · ${r.units||''}U\nCONF: ${r.confidence||''}%\n\nVERDICT: ${r.verdict||''}\n\nKEY FACTORS:\n${(r.pills||[]).map(p=>`→ ${p.text}`).join('\n')}\n\nSHARP: ${r.sharpAction||'N/A'}\nH2H: ${r.h2h ? r.h2h.last10 : 'N/A'}`
  const vs = r.elevenlabsScript || `Cold data. Hot picks. Tonight's ${sport.toUpperCase()} pick: ${r.pick} at ${r.odds}. ${r.reasoning}`

  function copyText(text, btn) {
    navigator.clipboard.writeText(text).catch(() => {})
    const orig = btn.textContent
    btn.textContent = '✓ COPIED'
    setTimeout(() => btn.textContent = orig, 1500)
  }

  return (
    <div style={{ padding:'20px 24px', overflowY:'auto' }}>
      {/* VERDICT */}
      <div style={{ background:'#0d1e30', border:'1.5px solid rgba(14,165,233,0.28)', borderRadius:10, marginBottom:16, overflow:'hidden', position:'relative' }}>
        <div style={{ height:2, background:sc }} />
        <div style={{ padding:'11px 15px', borderBottom:'1px solid rgba(14,165,233,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:9, letterSpacing:'0.25em', color:sc, fontFamily:"'Orbitron', sans-serif" }}>// {sport.toUpperCase()} MODEL VERDICT · {dd}</span>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:72, height:3, background:'rgba(255,255,255,0.07)', borderRadius:2, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${r.confidence||0}%`, background:cbc, borderRadius:2, transition:'width 0.7s ease' }} />
            </div>
            <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:15, color:'#f0f6ff' }}>{r.confidence}%</span>
          </div>
        </div>
        <div style={{ padding:'13px 15px' }}>
          <div style={{ fontSize:8, color:'rgba(14,165,233,0.4)', letterSpacing:'0.15em', marginBottom:4 }}>{away} {af} @ {home} {hf}</div>
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:28, letterSpacing:'0.05em', color:'#f0f6ff', lineHeight:1, marginBottom:4 }}>
            {r.pick || '—'} <span style={{ color:'#0ea5e9', fontSize:16, margin:'0 6px' }}>·</span> {r.odds || '—'}
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
            {[{v:r.betType,c:'blue'},{v:`${r.units||1}U`,c:'gold'},{v:r.verdict,c:r.confColor||'gold'}].map((item,i) => (
              <span key={i} style={{ fontSize:8, padding:'3px 8px', borderRadius:2, letterSpacing:'0.08em', ...pillStyle(item.c) }}>{item.v}</span>
            ))}
          </div>
          <div style={{ fontSize:12, lineHeight:1.65, color:'rgba(255,255,255,0.55)', borderTop:'1px solid rgba(14,165,233,0.1)', paddingTop:10 }}>{r.reasoning}</div>
        </div>
      </div>

      {/* DATA PILLS */}
      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
        {(r.pills||[]).map((p,i) => <span key={i} style={{ fontSize:9, padding:'3px 9px', borderRadius:2, letterSpacing:'0.07em', fontWeight:600, ...pillStyle(p.color) }}>{p.text}</span>)}
      </div>
      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:16 }}>
        {(r.keyInjuries||[]).length
          ? r.keyInjuries.map((inj,i) => <span key={i} style={{ fontSize:9, padding:'3px 9px', borderRadius:2, letterSpacing:'0.07em', fontWeight:600, ...pillStyle('red') }}>⚠ {inj}</span>)
          : <span style={{ fontSize:9, padding:'3px 9px', borderRadius:2, letterSpacing:'0.07em', fontWeight:600, ...pillStyle('green') }}>NO KEY INJURIES</span>
        }
      </div>

      {/* STAT GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <StatCard title={`// ${away} · ${tA.label||'STATS'}`} badge={tA.trend} badgeVal={tA.trend}>
          <StatRow label={tA.stat1label} value={tA.stat1val} />
          <StatRow label={tA.stat2label} value={tA.stat2val} />
          <StatRow label={tA.stat3label} value={tA.stat3val} />
          <StatRow label={tA.stat4label} value={tA.stat4val} />
        </StatCard>
        <StatCard title={`// ${home} · ${tB.label||'STATS'}`} badge={tB.trend} badgeVal={tB.trend}>
          <StatRow label={tB.stat1label} value={tB.stat1val} />
          <StatRow label={tB.stat2label} value={tB.stat2val} />
          <StatRow label={tB.stat3label} value={tB.stat3val} />
          <StatRow label={tB.stat4label} value={tB.stat4val} />
        </StatCard>
        <StatCard title={`// ${km.title||'KEY MATCHUP'}`} badge={(km.edge||'EVEN').toUpperCase()} badgeVal={km.edge}>
          <StatRow label={km.stat1label} value={km.stat1val} />
          <StatRow label={km.stat2label} value={km.stat2val} />
          <StatRow label={km.stat3label} value={km.stat3val} />
        </StatCard>
        <StatCard title="// H2H + SHARP MONEY">
          {r.h2h && <>
            <StatRow label="LAST 10 H2H" value={r.h2h.last10} />
            <StatRow label="ATS SPLIT" value={r.h2h.atsSplit} />
            <StatRow label="TOTAL TREND" value={r.h2h.totalTrend} color="gold" />
          </>}
          <StatRow label="SHARP $" value={r.sharpAction} color="blue" />
        </StatCard>
      </div>

      {/* BROADCAST EXPORT */}
      {[
        { label:'// BROADCAST EXPORT', text: expTxt, id:`exp-${id}`, accent:'green', btnLabel:'⎘ COPY' },
        { label:'// UNIT ZERO ONE — ELEVENLAB SCRIPT', text: vs, id:`scr-${id}`, accent:'blue', btnLabel:'⎘ COPY SCRIPT' },
      ].map((box,i) => (
        <div key={i} style={{ borderRadius:9, padding:'13px 15px', marginBottom:14, background: box.accent==='green' ? 'rgba(0,230,118,0.02)' : 'rgba(14,165,233,0.02)', border:`1px solid ${box.accent==='green' ? 'rgba(0,230,118,0.12)' : 'rgba(14,165,233,0.12)'}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9 }}>
            <span style={{ fontSize:8, letterSpacing:'0.22em', color: box.accent==='green' ? '#00e676' : '#0ea5e9', opacity:0.7 }}>{box.label}</span>
            <button onClick={e => copyText(box.text, e.target)} style={{ fontSize:8, padding:'3px 8px', borderRadius:3, cursor:'pointer', letterSpacing:'0.1em', background: box.accent==='green' ? 'rgba(0,230,118,0.05)' : 'rgba(14,165,233,0.05)', border:`1px solid ${box.accent==='green' ? 'rgba(0,230,118,0.25)' : 'rgba(14,165,233,0.25)'}`, color: box.accent==='green' ? '#00e676' : '#0ea5e9', transition:'all 0.2s' }}>{box.btnLabel}</button>
          </div>
          <div id={box.id} style={{ background:'rgba(4,13,24,0.7)', borderRadius:4, padding:'9px 11px', fontSize:10.5, lineHeight:1.7, color:'rgba(255,255,255,0.58)', whiteSpace:'pre-wrap', wordBreak:'break-word', border:`1px solid ${box.accent==='green' ? 'rgba(0,230,118,0.07)' : 'rgba(14,165,233,0.08)'}` }}>{box.text}</div>
          {i === 0 && <div style={{ background:'rgba(4,13,24,0.7)', border:'1px solid rgba(14,165,233,0.12)', borderRadius:4, padding:'6px 10px', fontSize:9.5, color:'rgba(14,165,233,0.65)', letterSpacing:'0.07em', marginTop:7, overflowX:'auto', whiteSpace:'nowrap' }}>{r.tickerText || `${r.pick} · CONF ${r.confidence}% · ${r.betType} · ${r.units}U · @COLDDATABETS`}</div>}
        </div>
      ))}
    </div>
  )
}

function GameCard({ sport, id, onAnalyze, hasResult }) {
  const [open, setOpen] = useState(false)
  const [away, setAway] = useState('')
  const [home, setHome] = useState('')
  const [injuries, setInjuries] = useState('')
  const [note, setNote] = useState('')
  const [goalieAway, setGoalieAway] = useState('')
  const [goalieHome, setGoalieHome] = useState('')
  const [spAway, setSpAway] = useState('')
  const [spHome, setSpHome] = useState('')
  const [loading, setLoading] = useState(false)
  const num = id.split('-')[1]
  const teams = sport==='nba' ? NBA_TEAMS : sport==='nhl' ? NHL_TEAMS : MLB_TEAMS
  const sc = SPORT_COLORS[sport]

  const matchupLabel = away || home
    ? `${away||'???'} @ ${home||'???'}`
    : `GAME ${num}`

  function handleTeamChange(side, val) {
    if (side === 'away') { setAway(val); setSpAway('') }
    else { setHome(val); setSpHome('') }
  }

  async function handleAnalyze() {
    if (!away || !home) { alert('Select both teams first'); return }
    setLoading(true)
    const extras = { injuries, note, goalieAway, goalieHome, spAway, spHome }
    await onAnalyze(id, sport, away, home, extras)
    setLoading(false)
  }

  return (
    <div style={{ background:'#0f2035', border:`1px solid ${open ? 'rgba(14,165,233,0.35)' : 'rgba(14,165,233,0.15)'}`, borderRadius:8, overflow:'hidden', transition:'border 0.2s' }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding:'9px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
        <div>
          <div style={{ fontSize:13, letterSpacing:'0.06em' }}>{matchupLabel}</div>
          <div style={{ fontSize:7.5, color:'rgba(14,165,233,0.45)', letterSpacing:'0.1em', marginTop:2 }}>
            {sport.toUpperCase()} · {away && home ? 'READY TO ANALYZE' : 'TAP TO CONFIGURE'}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          {hasResult && <div style={{ width:6, height:6, borderRadius:'50%', background:'#00e676' }} />}
          <span style={{ fontSize:10, color:'rgba(14,165,233,0.4)', transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.2s', display:'inline-block' }}>▾</span>
        </div>
      </div>

      {open && (
        <div style={{ padding:'0 12px 12px', display:'flex', flexDirection:'column', gap:8 }}>
          {/* TEAM SELECTS */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
            {['away','home'].map(side => (
              <div key={side}>
                <div style={{ fontSize:7.5, letterSpacing:'0.2em', color:'rgba(14,165,233,0.5)', marginBottom:3 }}>{side.toUpperCase()} TEAM</div>
                <div style={{ position:'relative' }}>
                  <select value={side==='away'?away:home} onChange={e=>handleTeamChange(side,e.target.value)}>
                    <option value="" disabled>{side==='away'?'Away':'Home'}</option>
                    {sport==='mlb'
                      ? MLB_DIVS.map(div => (
                          <optgroup key={div} label={div}>
                            {MLB_TEAMS.filter(t=>t.d===div).map(t=><option key={t.a} value={t.a}>{t.a} — {t.f}</option>)}
                          </optgroup>
                        ))
                      : teams.map(t=><option key={t.a} value={t.a}>{t.a} — {t.f}</option>)
                    }
                  </select>
                  <span style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', color:'#0ea5e9', fontSize:10, pointerEvents:'none', opacity:0.6 }}>▾</span>
                </div>
              </div>
            ))}
          </div>

          {/* SPORT-SPECIFIC EXTRAS */}
          {sport === 'mlb' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
              {['away','home'].map(side => {
                const abbr = side==='away' ? away : home
                const ps = abbr && MLB_SPS[abbr] ? MLB_SPS[abbr] : []
                const val = side==='away' ? spAway : spHome
                const setter = side==='away' ? setSpAway : setSpHome
                return (
                  <div key={side}>
                    <div style={{ fontSize:7.5, letterSpacing:'0.2em', color:'rgba(14,165,233,0.5)', marginBottom:3 }}>{side.toUpperCase()} SP</div>
                    <div style={{ position:'relative' }}>
                      <select value={val} onChange={e=>setter(e.target.value)}>
                        <option value="">{abbr ? 'Select SP' : 'Pick team first'}</option>
                        {ps.map(p=><option key={p} value={p}>{p}</option>)}
                        <option value="TBD">TBD / Bullpen</option>
                      </select>
                      <span style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', color:'#0ea5e9', fontSize:10, pointerEvents:'none', opacity:0.6 }}>▾</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {sport === 'nhl' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
              {[['Away Goalie', goalieAway, setGoalieAway, 'e.g. Vasilevskiy'], ['Home Goalie', goalieHome, setGoalieHome, 'e.g. Hellebuyck']].map(([lbl,val,set,ph]) => (
                <div key={lbl}>
                  <div style={{ fontSize:7.5, letterSpacing:'0.2em', color:'rgba(14,165,233,0.5)', marginBottom:3 }}>{lbl.toUpperCase()}</div>
                  <input type="text" value={val} onChange={e=>set(e.target.value)} placeholder={ph} />
                </div>
              ))}
            </div>
          )}

          {sport === 'nba' && (
            <div>
              <div style={{ fontSize:7.5, letterSpacing:'0.2em', color:'rgba(14,165,233,0.5)', marginBottom:3 }}>KEY INJURY NOTE</div>
              <input type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Giannis out, LeBron questionable" />
            </div>
          )}

          <div>
            <div style={{ fontSize:7.5, letterSpacing:'0.2em', color:'rgba(14,165,233,0.5)', marginBottom:3 }}>INJURIES / NOTES</div>
            <textarea value={injuries} onChange={e=>setInjuries(e.target.value)} placeholder="Any additional injury news or context..." />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              width:'100%', padding:'9px', borderRadius:6, fontSize:9, letterSpacing:'0.18em',
              cursor: loading ? 'not-allowed' : 'pointer', transition:'all 0.2s',
              background: `rgba(${sport==='nba'?'249,115,22':sport==='nhl'?'56,189,248':'34,197,94'},0.08)`,
              border: `1px solid rgba(${sport==='nba'?'249,115,22':sport==='nhl'?'56,189,248':'34,197,94'},0.35)`,
              color: sc,
              opacity: loading ? 0.5 : 1,
              animation: loading ? 'pulse 1.2s infinite' : 'none',
            }}
          >
            {loading ? '◈ ANALYZING...' : '◈ ANALYZE THIS GAME'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── MAIN APP ─────────────────────────────────────────────────────────
export default function Home() {
  const [sport, setSport] = useState('nba')
  const [dates, setDates] = useState({ nba:'', nhl:'', mlb:'' })
  const [gameIds, setGameIds] = useState({ nba:['nba-1','nba-2'], nhl:['nhl-1','nhl-2'], mlb:['mlb-1','mlb-2'] })
  const [counters, setCounters] = useState({ nba:2, nhl:2, mlb:2 })
  const [results, setResults] = useState({})
  const [activeTab, setActiveTab] = useState(null)
  const [loadingId, setLoadingId] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)
  const loadingInterval = useRef(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setDates({ nba:today, nhl:today, mlb:today })
  }, [])

  function addGame(s) {
    const newCount = counters[s] + 1
    const newId = `${s}-${newCount}`
    setCounters(c => ({ ...c, [s]: newCount }))
    setGameIds(g => ({ ...g, [s]: [...g[s], newId] }))
  }

  const LOADING_STEPS = {
    nba:['PULLING TEAM STATS...','CHECKING PACE DATA...','ANALYZING ATS TRENDS...','SCANNING SHARP MONEY...','BUILDING PICK...'],
    nhl:['LOADING GOALIE DATA...','CHECKING xGF% SPLITS...','ANALYZING CF% TRENDS...','SCANNING SHARP MONEY...','BUILDING PICK...'],
    mlb:['PULLING PITCHER DATA...','CHECKING BULLPEN LOADS...','RUNNING PARK FACTORS...','SCANNING SHARP MONEY...','BUILDING PICK...'],
  }

  async function handleAnalyze(id, s, away, home, extras) {
    setLoadingId(id)
    setLoadingStep(0)
    setActiveTab(id)

    let step = 0
    clearInterval(loadingInterval.current)
    loadingInterval.current = setInterval(() => {
      step++
      setLoadingStep(step)
      if (step >= LOADING_STEPS[s].length) clearInterval(loadingInterval.current)
    }, 650)

    const date = dates[s]
    const prompt = buildPrompt(s, away, home, date, extras)

    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role:'user', content: prompt }] }),
      })
      const data = await resp.json()
      if (data.error) throw new Error(data.error)

      let raw = ''
      for (const b of data.content) if (b.type === 'text') raw += b.text
      raw = raw.replace(/```json|```/g, '').trim()

      let result
      try { result = JSON.parse(raw) }
      catch(e) { const m = raw.match(/\{[\s\S]*\}/); if (m) result = JSON.parse(m[0]); else throw new Error('Could not parse response') }

      setResults(r => ({ ...r, [id]: { sport:s, away, home, date, result } }))
    } catch(err) {
      setResults(r => ({ ...r, [id]: { sport:s, away, home, date, error: err.message } }))
    } finally {
      clearInterval(loadingInterval.current)
      setLoadingId(null)
    }
  }

  const resultTabIds = Object.keys(results).filter(id => id.startsWith(sport))
  const sc = SPORT_COLORS[sport]
  const steps = LOADING_STEPS[sport]

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#0a1628', fontFamily:"'IBM Plex Mono', monospace" }}>

      {/* HEADER */}
      <div style={{ background:'rgba(4,13,24,0.98)', borderBottom:'1.5px solid #0ea5e9', padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between', height:52, flexShrink:0 }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:20, letterSpacing:'0.2em' }}>
            <span style={{ color:'#0ea5e9' }}>COLD</span> DATA BETS
          </div>
          <div style={{ fontSize:8, letterSpacing:'0.3em', color:'rgba(14,165,233,0.45)' }}>// MULTI-SPORT RESEARCH HUB v3.0</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,61,87,0.1)', border:'1px solid rgba(255,61,87,0.28)', padding:'3px 9px', borderRadius:3 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:'#ff3d57', animation:'blink 1.2s infinite' }} />
          <span style={{ fontSize:8, color:'#ff3d57', letterSpacing:'0.15em' }}>AI POWERED</span>
        </div>
      </div>

      {/* SPORT TABS */}
      <div style={{ display:'flex', background:'rgba(4,13,24,0.95)', borderBottom:'1px solid rgba(14,165,233,0.15)', flexShrink:0 }}>
        {['nba','nhl','mlb'].map(s => (
          <div key={s} onClick={() => setSport(s)} style={{ flex:1, padding:'11px 8px', cursor:'pointer', borderBottom:`2px solid ${sport===s ? SPORT_COLORS[s] : 'transparent'}`, display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all 0.2s', borderRight:'1px solid rgba(14,165,233,0.1)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:SPORT_COLORS[s], opacity: sport===s ? 1 : 0.3, boxShadow: sport===s ? `0 0 6px ${SPORT_COLORS[s]}` : 'none', transition:'all 0.2s' }} />
            <span style={{ fontSize:11, letterSpacing:'0.2em', color: sport===s ? SPORT_COLORS[s] : 'rgba(255,255,255,0.3)', fontFamily:"'Orbitron', sans-serif", transition:'color 0.2s' }}>{s.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* MAIN BODY */}
      <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', flex:1, minHeight:0 }}>

        {/* LEFT — GAME SLATE */}
        <div style={{ background:'#0d1e30', borderRight:'1px solid rgba(14,165,233,0.15)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ padding:'11px 16px', borderBottom:'1px solid rgba(14,165,233,0.12)', background:'rgba(14,165,233,0.02)' }}>
            <div style={{ fontSize:8, letterSpacing:'0.3em', color:sc, opacity:0.65, marginBottom:2 }}>// {sport.toUpperCase()} GAMES</div>
            <div style={{ fontSize:11, letterSpacing:'0.1em', color:sc, fontFamily:"'Orbitron', sans-serif" }}>SELECT GAME TO ANALYZE</div>
          </div>
          <div style={{ padding:'8px 14px', borderBottom:'1px solid rgba(14,165,233,0.1)', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:7.5, letterSpacing:'0.2em', opacity:0.5, whiteSpace:'nowrap' }}>DATE</span>
            <input type="date" value={dates[sport]} onChange={e => setDates(d => ({ ...d, [sport]: e.target.value }))} style={{ flex:1, background:'rgba(14,165,233,0.05)', border:'1px solid rgba(14,165,233,0.18)', borderRadius:5, padding:'5px 8px', color:'#f0f6ff', fontSize:10 }} />
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'10px 12px', display:'flex', flexDirection:'column', gap:8 }}>
            {gameIds[sport].map(id => (
              <GameCard key={id} id={id} sport={sport} onAnalyze={handleAnalyze} hasResult={!!results[id]} />
            ))}
          </div>
          <button onClick={() => addGame(sport)} style={{ margin:'0 12px 12px', padding:'9px', background:'transparent', border:'1px dashed rgba(14,165,233,0.2)', borderRadius:7, color:'rgba(14,165,233,0.4)', fontSize:8.5, letterSpacing:'0.2em', cursor:'pointer', transition:'all 0.2s' }}>
            + ADD GAME
          </button>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', padding:'8px 12px', borderTop:'1px solid rgba(14,165,233,0.1)' }}>
            {SPORT_SOURCES[sport].map(s => (
              <span key={s} style={{ fontSize:7.5, padding:'2px 6px', borderRadius:2, background:'rgba(14,165,233,0.07)', border:'1px solid rgba(14,165,233,0.18)', color:'rgba(14,165,233,0.55)', letterSpacing:'0.05em' }}>{s}</span>
            ))}
          </div>
        </div>

        {/* RIGHT — RESULTS */}
        <div style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ padding:'11px 22px', borderBottom:'1px solid rgba(14,165,233,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(14,165,233,0.01)', flexShrink:0 }}>
            <div style={{ fontSize:16, letterSpacing:'0.15em', color:'#daeefa', fontFamily:"'Bebas Neue', sans-serif" }}>ANALYSIS OUTPUT</div>
            <div style={{ fontSize:7.5, padding:'3px 9px', background:'rgba(14,165,233,0.06)', border:'1px solid rgba(14,165,233,0.15)', borderRadius:2, color:'rgba(14,165,233,0.45)', letterSpacing:'0.12em' }}>MODEL: CDB {sport.toUpperCase()} v3.0</div>
          </div>

          {/* Result tabs */}
          {resultTabIds.length > 0 && (
            <div style={{ display:'flex', gap:5, padding:'10px 18px 0', borderBottom:'1px solid rgba(14,165,233,0.12)', flexWrap:'wrap', flexShrink:0 }}>
              {resultTabIds.map(id => {
                const r = results[id]
                return (
                  <div key={id} onClick={() => setActiveTab(id)} style={{ fontSize:8.5, letterSpacing:'0.1em', padding:'5px 10px 9px', borderRadius:'4px 4px 0 0', border:`1px solid ${activeTab===id ? 'rgba(14,165,233,0.18)' : 'transparent'}`, borderBottom:'none', background: activeTab===id ? 'rgba(14,165,233,0.06)' : 'transparent', color: activeTab===id ? '#0ea5e9' : 'rgba(14,165,233,0.3)', cursor:'pointer', marginBottom:-1, position:'relative', transition:'all 0.2s' }}>
                    {r.away} @ {r.home}
                    <div style={{ position:'absolute', top:3, right:3, width:5, height:5, borderRadius:'50%', background: r.error ? '#ff3d57' : '#00e676' }} />
                  </div>
                )
              })}
            </div>
          )}

          {/* Result body */}
          <div style={{ flex:1, overflowY:'auto' }}>
            {loadingId ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:18 }}>
                <div style={{ width:42, height:42, border:'2px solid rgba(14,165,233,0.1)', borderTopColor:'#0ea5e9', borderRadius:'50%', animation:'spin 0.85s linear infinite' }} />
                <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
                  {steps.map((s,i) => (
                    <div key={i} style={{ fontSize:8.5, letterSpacing:'0.2em', color: i < loadingStep ? 'rgba(0,230,118,0.5)' : i === loadingStep ? '#0ea5e9' : 'rgba(14,165,233,0.28)', transition:'color 0.3s' }}>{s}</div>
                  ))}
                </div>
              </div>
            ) : activeTab && results[activeTab] ? (
              results[activeTab].error
                ? <div style={{ padding:20, margin:20, background:'rgba(255,61,87,0.05)', border:'1px solid rgba(255,61,87,0.18)', borderRadius:8, fontSize:11, color:'#ff3d57', lineHeight:1.7 }}>ANALYSIS ERROR: {results[activeTab].error}</div>
                : <ResultPanel id={activeTab} {...results[activeTab]} />
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:14, opacity:0.3 }}>
                <div style={{ width:54, height:54, border:'1.5px solid #0ea5e9', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#0ea5e9', letterSpacing:'0.1em' }}>CDB</div>
                <div style={{ fontSize:9, letterSpacing:'0.25em', color:'#0ea5e9', textAlign:'center', lineHeight:2 }}>SELECT A SPORT TAB<br />ADD GAMES TO SLATE<br />HIT ANALYZE TO RUN PICKS</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
