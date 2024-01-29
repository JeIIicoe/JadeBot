function formatDateTime(date) {
    return date.toLocaleString('en-GB', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}


module.exports = formatDateTime;
