/**
 * カレンダーの内容をドキュメントにエクスポートする
 * @param {GoogleAppsScript.Calendar} calendar - カレンダー選択UIで選択されたカレンダーのID
 * @param {Date | null} from - 期間の開始日付
 * @param {Date | null} to - 期間の終了日付
 * @returns {string} カレンダーのデータを書き出したドキュメントファイルのURL
 */
function exportDocs(calendar, from, to) {
    console.log(calendar.getName());
    console.log(from);
    console.log(to);

    // do something...

    return docsUrl;
}