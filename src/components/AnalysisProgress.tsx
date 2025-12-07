'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AnalysisProgressProps {
  isLoading: boolean;
}

const steps = [
  { label: 'Uploading file...', icon: '📤', description: 'Securely transferring your data' },
  { label: 'Analyzing with AI...', icon: '🤖', description: 'Categorizing your spending' },
];

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ isLoading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const loadingStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setProgress(100);
      progressRef.current = 100;
      loadingStartRef.current = null;
      return;
    }

    // Initialize loading start time
    if (!loadingStartRef.current) {
      loadingStartRef.current = Date.now();
      progressRef.current = 0;
    }

    // Switch step after 3 seconds
    const stepTimeout = setTimeout(() => {
      setCurrentStep(1);
    }, 3000);

    // Animate progress bar with easing curve
    // Progresses quickly at first, then slows down as it approaches 95%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Never decrease progress, only increase
        const elapsed = Date.now() - (loadingStartRef.current || Date.now());
        
        // Easing function: starts fast, then slows down (quadratic ease-out)
        // This creates a smooth, natural-looking progress that doesn't reset
        const timeSeconds = elapsed / 1000;
        const easeProgress = Math.min(1 - Math.pow(1 - timeSeconds / 30, 2), 0.95);
        const newProgress = easeProgress * 100;
        
        // Only update if progress increases
        progressRef.current = Math.max(progressRef.current, newProgress);
        return progressRef.current;
      });
    }, 100);

    return () => {
      clearTimeout(stepTimeout);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  return (
    <div style={{
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 32px',
    }}>
      {/* Steps Indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        width: '100%',
        maxWidth: '600px',
        marginBottom: '48px',
      }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: index <= currentStep ? 1 : 0.4,
              transition: 'opacity 0.3s ease',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: index < currentStep ? '#10b981' : index === currentStep ? '#2563eb' : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: index <= currentStep ? 'white' : '#9ca3af',
                fontWeight: '600',
                transition: 'all 0.4s ease',
                boxShadow: index === currentStep ? '0 0 20px rgba(37, 99, 235, 0.3)' : 'none',
              }}
            >
              {index < currentStep ? '✓' : step.icon.split(' ')[0]}
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '8px',
              fontWeight: '500',
            }}>
              {step.label}
            </p>
          </div>
        ))}
      </div>

      {/* Current Step Description */}
      <div style={{
        marginBottom: '32px',
        minHeight: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#2563eb',
          margin: '0 0 8px 0',
          transition: 'opacity 0.5s ease',
        }}>
          {steps[currentStep].icon} {steps[currentStep].label}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          margin: 0,
          transition: 'opacity 0.5s ease',
        }}>
          {steps[currentStep].description}
        </p>
      </div>

      {/* Animated Progress Bar */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        height: '6px',
        backgroundColor: '#e5e7eb',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '32px',
        position: 'relative',
      }}>
        <div
          style={{
            height: '100%',
            backgroundColor: '#2563eb',
            width: `${progress}%`,
            transition: 'width 0.8s ease',
            borderRadius: '3px',
            boxShadow: progress >= 95 ? '0 0 20px rgba(37, 99, 235, 0.8)' : '0 0 10px rgba(37, 99, 235, 0.4)',
            animation: progress >= 95 ? 'glow 1.5s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {/* Pulse text when at 95% */}
      <p style={{
        fontSize: '13px',
        color: progress >= 95 ? '#2563eb' : '#6b7280',
        margin: '0 0 16px 0',
        fontWeight: '500',
        animation: progress >= 95 ? 'pulse-text 1.5s ease-in-out infinite' : 'none',
      }}>
        {progress >= 95 ? '✨ Almost there, finalizing your analysis...' : 'Processing your data...'}
      </p>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        
        @keyframes glow {
          0% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.8);
          }
          50% {
            box-shadow: 0 0 30px rgba(37, 99, 235, 1), inset 0 0 10px rgba(255, 255, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.8);
          }
        }
        
        @keyframes pulse-text {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysisProgress;
