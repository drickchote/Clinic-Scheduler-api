module.exports = {
    enumerateDaysBetweenDates(startDate, endDate) {
        var now = startDate.clone(), dates = [];
    
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format('DD-MM-YYYY'));
            now.add(1, 'days');
        }
        return dates;
    }
}