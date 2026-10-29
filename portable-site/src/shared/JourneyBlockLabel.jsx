import { JOURNEY_SECTIONS } from './JourneyHeader.jsx';
import './journey-block-labels.css';

export default function JourneyBlockLabel({ sectionId, className = '' }) {
  const index = JOURNEY_SECTIONS.findIndex(([id]) => id === sectionId);
  return <p className={`journey-block-label ${className}`}>{String(index + 1).padStart(2, '0')} · {JOURNEY_SECTIONS[index][1]}</p>;
}
