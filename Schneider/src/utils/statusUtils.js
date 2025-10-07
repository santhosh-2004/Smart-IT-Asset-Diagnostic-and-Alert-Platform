import { differenceInDays, parseISO } from 'date-fns';

// Calculate PC status based on last reboot time
export const getPCStatus = (lastReboot) => {
  const rebootDate = parseISO(lastReboot);
  const daysSinceReboot = differenceInDays(new Date(), rebootDate);
  
  if (daysSinceReboot <= 1) {
    return { status: 'green', label: 'OK', days: daysSinceReboot };
  } else if (daysSinceReboot <= 3) {
    return { status: 'green', label: 'OK', days: daysSinceReboot };
  } else if (daysSinceReboot <= 7) {
    return { status: 'yellow', label: 'Reboot Due', days: daysSinceReboot };
  } else if (daysSinceReboot < 10) {
    return { status: 'yellow', label: 'Reboot Due', days: daysSinceReboot };
  } else {
    return { status: 'red', label: 'Critical', days: daysSinceReboot };
  }
};

// Utility: Should alert if days since reboot >= 8 and < 10, returns days left
export const shouldAlertReboot = (lastReboot) => {
  const rebootDate = parseISO(lastReboot);
  const daysSinceReboot = differenceInDays(new Date(), rebootDate);
  if (daysSinceReboot >= 8 && daysSinceReboot < 10) {
    return 10 - daysSinceReboot;
  }
  return null;
};

// Get status color class
export const getStatusColorClass = (status) => {
  switch (status) {
    case 'green':
      return 'status-green';
    case 'yellow':
      return 'status-yellow';
    case 'red':
      return 'status-red';
    default:
      return 'status-green';
  }
};

// Format date for display
export const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Sort PCs by various criteria
export const sortPCs = (pcs, sortBy, sortOrder) => {
  return [...pcs].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'ipAddress':
        aValue = a.ipAddress;
        bValue = b.ipAddress;
        break;
      case 'lastReboot':
        aValue = new Date(a.lastReboot);
        bValue = new Date(b.lastReboot);
        break;
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'status':
        const aStatus = getPCStatus(a.lastReboot);
        const bStatus = getPCStatus(b.lastReboot);
        aValue = aStatus.status;
        bValue = bStatus.status;
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}; 