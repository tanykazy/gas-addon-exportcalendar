/**
 * カレンダーの内容をドキュメントにエクスポートする
 * @param {GoogleAppsScript.Calendar.Calendar[]} calendars - カレンダー選択UIで選択されたカレンダー
 * @param {Date} from - 期間の開始日付
 * @param {Date} to - 期間の終了日付
 * @returns {string} カレンダーのデータを書き出したドキュメントファイルのURL
 */
function exportDocs(calendars, from, to) {
    const docName = `カレンダーレポート ${toYYYYMMDD(from)}-${toYYYYMMDD(to)}`;
    // 新規Googleドキュメントを作成
    const doc = DocumentApp.create(docName);
    const body = doc.getBody();

    body.appendParagraph("カレンダー・レポート\n");
    body.appendParagraph(`期間: ${from.toLocaleDateString()} から ${to.toLocaleDateString()}\n\n`);

    const allEventsData = [];

    for (const calendar of calendars) {
        const events = calendar.getEvents(from, to);

        const eventData = events.map(event => {
            const startTime = event.getStartTime();

            // イベントが終日のものかどうかを確認
            let timeStr = "";
            if (!event.isAllDayEvent()) {
                timeStr = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
            }

            return {
                date: startTime.toLocaleDateString(),
                time: timeStr,
                title: event.getTitle(),
                description: event.getDescription() || "",
            };
        });

        allEventsData.push(...eventData);
    }

    allEventsData.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

    let currentDate = "";
    let currentTableData = [["時刻", "内容", "詳細"]];
    for (const eventData of allEventsData) {
        if (currentDate !== eventData.date) {
            if (currentTableData.length > 1) {
                body.appendParagraph(currentDate);
                body.appendTable(currentTableData);
                body.appendParagraph("\n");
            }
            currentDate = eventData.date;
            currentTableData = [["時刻", "内容", "詳細"]];
        }
        currentTableData.push([eventData.time, eventData.title, eventData.description]);
    }
    if (currentTableData.length > 1) {
        body.appendParagraph(currentDate);
        body.appendTable(currentTableData);
    }

    return doc.getUrl();
}
