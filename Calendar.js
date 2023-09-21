/**
 * @typedef {object} CalendarParam - カレンダーの名前とID
 * @property {string} name - カレンダーの名前
 * @property {string} id - カレンダーのID
 */

/**
 * ユーザーがオーナーまたは登録しているすべてのカレンダーを取得する
 * @returns {CalendarParam} カレンダーの
 */
function getAllCalendars() {
    const calendars = CalendarApp.getAllCalendars();

    return calendars.map((calendar) => {
        return {
            name: calendar.getName(),
            id: calendar.getId()
        };
    });
}

function sortCalendar(calendars) {
    const primary = [];
    const selected = [];
    const owned = [];
    const hidden = [];
    const other = [];
    for (const calendar of calendars) {
        if (calendar.isMyPrimaryCalendar()) {
            primary.push(calendar);
        } else if (calendar.isSelected()) {
            selected.push(calendar);
        } else if (calendar.isOwnedByMe()) {
            owned.push(calendar);
        } else if (calendar.isHidden()) {
            hidden.push(calendar);
        } else {
            other.push(calendar);
        }
    }
    return [...primary, ...selected, ...owned, ...other, ...hidden];
}