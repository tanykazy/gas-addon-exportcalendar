/**
 * 日付オブジェクトを年月日のフォーマットに変換する
 * @param {Date} date - 日付オブジェクト
 * @returns {string} - 年月日の文字列
 */
function toYYYYMMDD(date) {
    return Utilities.formatDate(date, 'JST', 'yyyyMMdd');
}

/**
 * 引数の月初の日付オブジェクトを返す
 * @param {Date} date - 基準の日付オブジェクト
 * @returns {Date} 月初の日付オブジェクト
 */
function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * 引数の月末の日付オブジェクトを返す
 * @param {Date} date - 基準の日付オブジェクト
 * @returns {Date} 月末の日付オブジェクト
 */
function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

