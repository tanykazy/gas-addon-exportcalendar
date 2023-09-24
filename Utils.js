/**
 * 日付オブジェクトを年月日のフォーマットに変換する
 * @param {Date} date - 日付オブジェクト
 * @returns {string} - 年月日の文字列
 */
function toYYYYMMDD(date) {
    return Utilities.formatDate(date, 'JST', 'yyyyMMdd');
}
