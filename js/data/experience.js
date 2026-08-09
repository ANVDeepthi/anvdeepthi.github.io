// Research Experience — shown as a timeline in the "Experience" section.
// Newest first. Each entry: period, location, role, org, and either `bullets` (a list) or `desc` (a plain paragraph).
// `projectLine` is an optional italic line shown above the bullets (e.g. naming the funded project).
const EXPERIENCE_DATA = [
  {
    period: 'Sep 2025 — Present',
    location: '📍 Meghalaya, India',
    role: 'DST Inspire Faculty Fellow',
    org: 'North Eastern Space Applications Centre (NESAC)',
    projectLine: 'Project: Investigating the Impact of Solar-Terrestrial Interactions on the Atmospheric Dynamics of the Indian Subcontinent — an initial framework for LEO-based augmentation of NavIC-aided GPS, funded by the Department of Science &amp; Technology',
    bullets: [
      "Analyzing solar-terrestrial interactions and their impacts on the Indian subcontinent's magnetosphere and ionosphere.",
      'Investigating the influence of geomagnetic storms on atmospheric dynamics, including temperature, wind patterns, and precipitation.',
      'Developing predictive ML-based models for space weather events and their potential impacts on communication and navigation systems.',
      'Proposing mitigation strategies to minimize the adverse effects of space weather on technological infrastructure and human activities.',
      'Developing three-dimensional tomographic maps to understand the variability of upper atmospheric dynamics over the North East Region.'
    ]
  },
  {
    period: '2023 — 2024',
    location: '📍 Nantes, France',
    role: 'Research Scientist',
    org: 'GEOLOC, Université Gustave Eiffel',
    projectLine: 'Project: NAVISP – CHARLI (CHallenging Areas Localization services) — a commercial positioning and tracking solution for firefighters using GNSS, funded by the European Space Agency',
    bullets: [
      'Developed ML algorithms for GNSS/INS data fusion in firefighter-tracking systems operating in GNSS-degraded environments.',
      'Implemented probabilistic signal estimation models and real-time testing on embedded platforms.',
      'Coordinated with subsurface platform engineers for firmware compatibility and system upgrades.'
    ]
  },
  {
    period: '2017 — 2023',
    location: '📍 Indore, India',
    role: 'Doctoral Researcher · DST Inspire Fellow &amp; Teaching Assistant',
    org: 'Indian Institute of Technology Indore',
    projectLine: 'Project: Study of Low Latitude Ionosphere using NavIC — funded by DST Inspire Fellowship, sponsored by ISRO (NGP-27)',
    bullets: [
      'Built MATLAB/Python toolkits for GNSS and NavIC signal analysis for extreme geomagnetic events.',
      'Integrated Kalman filtering and signal decorrelation techniques for GNSS error modeling and correction.',
      'Investigated space weather impacts on GNSS signals using machine learning to detect anomaly trends (95.6% precision).',
      'Mentored 9+ students in ML-based space data analytics projects and participated in international collaborations.',
      'Assisted in teaching and course preparation for undergraduate and postgraduate students, building strong expertise in satellite navigation, Kalman filtering, guidance and control, and space weather.'
    ]
  },
  {
    period: 'Nov 2016 — Jul 2017',
    location: '📍 Telangana, India',
    role: 'Research Engineer',
    org: 'NRN Aerospace Systems Pvt Ltd',
    desc: 'Supported inertial navigation system simulations, including sensor error modeling and performance evaluation for avionic systems. Authored technical proposals and conducted analysis-driven decision support for design improvements.'
  },
  {
    period: 'Aug 2014 — Nov 2015',
    location: '📍 Telangana, India',
    role: 'Research Intern — CEAWMT',
    org: 'Jawaharlal Nehru Technological University Hyderabad',
    desc: 'Worked with INCOIS scientists on Sea Surface Temperature analysis linked to ENSO and Indian Monsoon. Hands-on with Fortran NWP models and Automatic Weather Station data.'
  }
];