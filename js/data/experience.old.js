// Research Experience — shown as a timeline in the "Experience" section.
// Each entry: period, location, role, org, and either `bullets` (a list) or `desc` (a plain paragraph).
// `projectLine` is an optional italic line shown above the bullets (e.g. naming the funded project).
const EXPERIENCE_DATA = [
  {
    period: '2023 — Present',
    location: '📍 Nantes, France',
    role: 'Research Scientist',
    org: 'GEOLOC, Université Gustave Eiffel',
    projectLine: 'Project: NAVISP – CHARLI (ESA-funded) — Positioning solutions for firefighters using GNSS',
    bullets: [
      'Evaluated GNSS receivers and reckoning systems for Nav4you device compatibility.',
      'Developed ML algorithms for GNSS/INS data fusion, improving localization accuracy in space and terrestrial applications.',
      'Conducted advanced near real-time satellite signal processing.',
      'Built Python/MATLAB computational tools for multi-sensor data analysis.'
    ]
  },
  {
    period: '2017 — 2023',
    location: '📍 Indore, India',
    role: 'Doctoral Researcher · DST Inspire Fellow',
    org: 'Indian Institute of Technology Indore',
    projectLine: 'Project: Study of Low Latitude Ionosphere using NavIC — funded by DST &amp; ISRO (NGP-27)',
    bullets: [
      'Pioneered NavIC+GPS combined analysis across Indian geographic locations for ionospheric dynamics under geomagnetic storms.',
      'Identified gravity waves as key drivers of ionospheric variations through troposphere-ionosphere coupling research.',
      'Conducted comprehensive RTK &amp; PPP performance evaluations of NavIC and GPS.',
      'Mentored 9+ students on ML-based space weather event detection (95.6% precision).'
    ]
  },
  {
    period: 'Sep 2016 — Jun 2017',
    location: '📍 Telangana, India',
    role: 'Research Engineer',
    org: 'NRN Aerospace Systems Pvt Ltd',
    desc: 'Designed sensor prototypes, authored design proposals and pitch decks, explored inertial navigation and avionics systems, and executed simulation iterations.'
  },
  {
    period: 'Aug 2014 — Nov 2015',
    location: '📍 Telangana, India',
    role: 'Research Intern — CEAWMT',
    org: 'Jawaharlal Nehru Technological University Hyderabad',
    desc: 'Worked with INCOIS scientists on Sea Surface Temperature analysis linked to ENSO and Indian Monsoon. Hands-on with Fortran NWP models and Automatic Weather Station data.'
  }
];
