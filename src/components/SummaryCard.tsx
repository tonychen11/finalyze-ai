import React from 'react';
import { ChartIcon } from './icons/ChartIcon';

interface SummaryCardProps {
  summary: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '28px',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      border: '1px solid #f0f0f0',
      height: '100%'
    }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
          flexShrink: 0,
          backgroundColor: '#eff6ff',
          padding: '12px',
          borderRadius: '10px'
        }}>
          <ChartIcon style={{ width: '24px', height: '24px', color: '#2563eb' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>AI Summary</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
