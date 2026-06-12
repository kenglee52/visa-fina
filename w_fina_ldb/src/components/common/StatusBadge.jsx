/**
 * StatusBadge Component
 * Displays applicant status with appropriate styling
 */
import React from 'react';
import { APPLICANT_STATUSES, STATUS_LABELS } from '@/config/constants';
import { CheckCircle, XCircle, Clock, FileCheck, Inbox } from 'lucide-react';

const StatusBadge = ({ status, size = 'default' }) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    default: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  };

  const iconClasses = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  const statusConfig = {
    [APPLICANT_STATUSES.IN_PROGRESS]: {
      label: STATUS_LABELS.in_progress,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: Clock,
    },
    [APPLICANT_STATUSES.CHECKED]: {
      label: STATUS_LABELS.checked,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: CheckCircle,
    },
    [APPLICANT_STATUSES.REJECTED]: {
      label: STATUS_LABELS.rejected,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: XCircle,
    },
    [APPLICANT_STATUSES.ISSUED]: {
      label: STATUS_LABELS.issued,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: FileCheck,
    },
    [APPLICANT_STATUSES.RECEIVED]: {
      label: STATUS_LABELS.received,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      icon: Inbox,
    },
  };

  const config = statusConfig[status] || {
    label: status,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: null,
  };

  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full
        ${sizeClasses[size]}
        ${config.bgColor}
        ${config.textColor}
        font-medium
      `}
    >
      {Icon && <Icon className={iconClasses[size]} />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
