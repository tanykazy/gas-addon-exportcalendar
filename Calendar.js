/**
 * 表示され選択されているカレンダーを取得する
 * @returns {GoogleAppsScript.Calendar.Calendar[]} カレンダーの配列
 */
function getDisplayedCalendars() {
    const calendars = CalendarApp.getAllCalendars();

    return calendars.filter((calendar) => {
        if (calendar.isHidden()) {
            return false;
        }
        if (calendar.isSelected()) {
            return true;
        }
        return false;
    });
}
