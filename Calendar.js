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
