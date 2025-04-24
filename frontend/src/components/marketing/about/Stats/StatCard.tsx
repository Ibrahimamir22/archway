import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import { ScrollReveal } from '@/components/ui';

interface StatCardProps {
  /**
   * The value to display
   */
  value: number;
  
  /**
   * The label for the statistic
   */
  label: string;
  
  /**
   * Icon to display (JSX element)
   */
  icon: React.ReactNode;
  
  /**
   * Prefix to add before the number (e.g., "$")
   */
  prefix?: string;
  
  /**
   * Suffix to add after the number (e.g., "%", "+")
   */
  suffix?: string;
  
  /**
   * Number of decimal places to show
   */
  decimals?: number;
  
  /**
   * Animation delay in seconds
   */
  delay?: number;
  
  /**
   * Is right-to-left language
   */
  isRtl?: boolean;
  
  /**
   * Description text shown below the stat
   */
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  prefix = '',
  suffix = '',
  decimals = 0,
  delay = 0,
  isRtl = false,
  description,
}) => {
  return (
    <ScrollReveal
      animation="zoom-in"
      delay={delay}
      offset="-100px"
    >
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow ${isRtl ? 'text-right' : ''}`}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue dark:text-brand-accent">
            {icon}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-4xl font-bold text-brand-blue dark:text-white">
            <AnimatedCounter
              end={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              className="tabular-nums"
              easing="easeOut"
              duration={2500}
              threshold={0.15}
            />
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {label}
          </p>
          {description && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default StatCard; 