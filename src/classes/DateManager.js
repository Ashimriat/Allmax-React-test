class DateManager {

	getGMTZone(date) {
        let timeZonesDifference = -(date.getTimezoneOffset());
        let hoursDifference = timeZonesDifference / 60;
        let minutesDifference = timeZonesDifference % 60;
        let zString = null;
        if (hoursDifference < 10) hoursDifference = '0' + hoursDifference; 
        if (minutesDifference < 10) minutesDifference = '0' + minutesDifference; 
        if (timeZonesDifference > 0) {
            zString = '+' + hoursDifference + ':' + minutesDifference;
        } else {
            zString = '-' + hoursDifference + ':' + minutesDifference;
        } 
        return zString;
    }

    getFullLocalDateISO(day, time){
        let todayDate = new Date();
        let dayString = day;
        let timeString = time;
        let zString = this.getGMTZone(todayDate);
        let dateString = '';
        if (dayString === '' && timeString === '') {
            return dateString;
        } 
        if (dayString === '' && timeString !== '') {
            let defaultDateDay = todayDate.toISOString();
            dayString = defaultDateDay.substr(0, 10);
        }
        if (timeString === '') timeString = 'HH:mm';
        dateString = dayString + 'T' + timeString + ':00.000' + zString;
        return dateString;
    }

    getLocalDate(){
        let todayDate = new Date();
        let timeZonesDifference = -(todayDate.getTimezoneOffset());
        let hoursDifference = timeZonesDifference / 60;
        let minutesDifference = timeZonesDifference % 60;
        let todayDateUTCHours = todayDate.getHours();
        let todayDateUTCMinutes = todayDate.getMinutes();
        let localDateHours = todayDateUTCHours;
        let localDateMinutes = todayDateUTCMinutes;
        if (timeZonesDifference > 0) {
            localDateHours += hoursDifference;
            localDateMinutes += minutesDifference;
        } else {
            localDateHours -= hoursDifference;
            localDateMinutes -= minutesDifference;
        }
        let todayDateLocal = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), localDateHours, localDateMinutes);
        return todayDateLocal;
    }

}

export default DateManager;