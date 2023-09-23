/**
 * カレンダーの内容をドキュメントにエクスポートする
 * @param {GoogleAppsScript.Calendar[]} calendars - カレンダー選択UIで選択されたカレンダー
 * @param {Date | null} from - 期間の開始日付
 * @param {Date | null} to - 期間の終了日付
 * @returns {string} カレンダーのデータを書き出したドキュメントファイルのURL
 */
function exportDocs(calendars, from, to) {
  const calendar = calendars.pop();
  return getReportURL(calendar, from, to);
}

/**
 * カレンダーから指定された期間のイベントを取得し、レポートのドキュメントを作成する
 * @param {GoogleAppsScript.Calendar} calendar - 選択されたカレンダー
 * @param {Date | null} from - 期間の開始日付
 * @param {Date | null} to - 期間の終了日付
 * @returns {GoogleAppsScript.Drive.File} 作成されたドキュメントのファイル
 */
function createReport(calendar, from, to) {
    // 新規Googleドキュメントを作成
    const doc = DocumentApp.create("カレンダーレポート_" + new Date().toISOString());
    const body = doc.getBody();
    
    // 文書の内容を追加
    body.appendParagraph(`カレンダーレポート: ${calendar.getName()} \n期間: ${from ? from.toLocaleDateString() : "開始日未指定"} から ${to ? to.toLocaleDateString() : "終了日未指定"}\n`);

    // カレンダーからイベントを取得
    const events = calendar.getEvents(from, to);
    
    const eventData = events.map(event => {
        return [event.getStartTime().toLocaleDateString(), event.getTitle(), event.getDescription() || ""];
    });

    // ヘッダー情報を追加
    const data = [["日時", "内容", "詳細"], ...eventData];

    body.appendTable(data);

    return DriveApp.getFileById(doc.getId());
}

/**
 * レポートのドキュメントのURLを取得する
 * @param {GoogleAppsScript.Calendar} calendar - カレンダー選択UIで選択されたカレンダー
 * @param {Date | null} from - 期間の開始日付
 * @param {Date | null} to - 期間の終了日付
 * @returns {string} レポートのドキュメントのURL
 */
function getReportURL(calendar, from, to) {
  const report = createReport(calendar, from, to);
  const movedReport = createReportInFolder(report);
  return movedReport.getUrl();
}

/**
 * レポートを指定のフォルダに保存する
 * @param {GoogleAppsScript.Drive.File} report - 移動するドキュメントのファイル
 * @returns {GoogleAppsScript.Drive.File} フォルダに移動されたドキュメントのファイル
 */
function createReportInFolder(report) { // 引数を追加
  const folderName = "calendarReport";
  let folder;
  
  // フォルダの存在確認および作成
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(folderName);
  }

  // ドキュメントをフォルダに移動
  report.moveTo(folder);

  return report;
}
