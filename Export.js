/**
 * カレンダーの内容をドキュメントにエクスポートする
 * @param {string} calendarId カレンダー選択UIで選択されたカレンダーのID
 * @returns {string} カレンダーのデータを書き出したドキュメントファイルのURL
 */
function exportDocs(calendarId) {
    const calendar = CalendarApp.getCalendarById(calendarId);

    // do something...

    return docsUrl;
}