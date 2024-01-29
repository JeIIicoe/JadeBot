function formatDuration(durationInMinutes) {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    let formattedDuration = '';

    if (hours > 0) {
        formattedDuration += `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    if (minutes > 0) {
        if (formattedDuration.length > 0) {
            formattedDuration += ' and ';
        }
        formattedDuration += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return formattedDuration;
}

module.exports = formatDuration;
