// Key Projects — shown as cards in the "Projects" section.
const PROJECTS_DATA = [
  {
    icon: '🌌',
    title: 'Solar-Terrestrial Impacts on the Indian Subcontinent',
    funder: '⚡ DST Inspire Faculty Fellowship, NESAC (2025–Present)',
    desc: 'Investigating solar-terrestrial interactions and geomagnetic storm impacts on atmospheric dynamics over the Indian subcontinent, building 3D tomographic maps of upper-atmospheric variability and an initial framework for LEO-based augmentation of NavIC-aided GPS.',
    tags: ['Space Weather', 'Tomography', 'NavIC', 'LEO Augmentation']
  },
  {
    icon: '🛡️',
    title: 'NAVISP – CHARLI: Localization for Firefighters',
    funder: '⚡ European Space Agency (ESA-funded)',
    desc: 'Development of a commercial GNSS-based positioning and tracking solution for firefighters in challenging indoor/outdoor environments. Involves GNSS/INS data fusion and ML-enhanced localization accuracy.',
    tags: ['GNSS/INS', 'Machine Learning', 'ESA', 'Real-time']
  },
  {
    icon: '🌐',
    title: 'Low Latitude Ionosphere via NavIC',
    funder: '⚡ DST Inspire Fellowship + ISRO (NGP-27)',
    desc: 'First systematic study combining NavIC and GPS across Indian stations to analyze ionospheric disturbances, geomagnetic storms, plasma irregularities, and troposphere-ionosphere coupling.',
    tags: ['NavIC', 'GPS', 'Space Weather', 'Scintillation']
  },
  {
    icon: '🌀',
    title: 'Ionospheric Response to Tropical Cyclones',
    funder: '⚡ Peer-reviewed study · ASR 2022',
    desc: 'Investigated ionospheric signatures during Tropical Cyclones Amphan and Nisarga using GNSS data, revealing upper-atmospheric coupling mechanisms triggered by extreme weather events.',
    tags: ['Cyclone', 'TEC', 'Atmospheric Coupling']
  },
  {
    icon: '🌑',
    title: 'TEC Variations During Solar Eclipse 2020',
    funder: '⚡ IEEE InCAP 2021',
    desc: 'Analyzed Total Electron Content variations over central India during the Annular Solar Eclipse of June 21, 2020, capturing ionospheric depletion and recovery dynamics.',
    tags: ['Solar Eclipse', 'TEC', 'NavIC']
  },
  {
    icon: '🧲',
    title: 'Geomagnetic Storm Impact on NavIC',
    funder: '⚡ Springer CODEC 2019',
    desc: "First study examining intense geomagnetic storm effects on NavIC signals at Indore, demonstrating NavIC's superior spatial and temporal coverage for ionospheric monitoring.",
    tags: ['Geomagnetic Storm', 'NavIC', 'Signal Quality']
  },
  {
    icon: '📈',
    title: 'ML for Space Weather Event Detection',
    funder: '⚡ IIT Indore — Mentorship Project',
    desc: 'Led mentorship of 9+ students developing linear regression ML models to detect space weather events from 2–5 decade satellite datasets, achieving 95.6% detection precision.',
    tags: ['ML', 'Linear Regression', 'Satellite Data']
  }
];
