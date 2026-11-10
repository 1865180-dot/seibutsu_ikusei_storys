/**
 * 「道の駅の名物づくり」の記録を、Googleスプレッドシートに保存するApps Script（例）
 *
 * 使い方
 *  1. 記録を入れたいスプレッドシートを開く →［拡張機能］→［Apps Script］に、このコードを貼る
 *  2. ［デプロイ］→［新しいデプロイ］→ 種類「ウェブアプリ」
 *       次のユーザーとして実行：自分 ／ アクセスできるユーザー：学校アカウント（組織内）または全員
 *  3. 表示された「ウェブアプリのURL」を、index.html の先頭近くにある
 *       SUBMIT_URL: ''   のなかに貼る（例：SUBMIT_URL: 'https://script.google.com/macros/s/xxxx/exec',）
 *  ※コードを書き換えたら、［デプロイを管理］から「新しいバージョン」で再デプロイしてください。
 */
const SHEET_NAME = '記録';
const HEADERS = ['送信日時', '組', '番号', '主人公名', '挑戦回数', '評価', '結末', '合計点', 'かたより',
  '収量', '品質', 'コスト', '環境', 'もうけ・量', '品質軸', '環境軸', '選択(10場面)', '選択の内訳', '評価の履歴',
  '①いちばん迷った場面', '②理由', '③トレードオフとは', '④3人の考えをくらべられたか', 'プレイ秒数', 'ver'];

function doPost(e) {
  const p = e.parameter;
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
    }
    sh.appendRow([
      new Date(), p.cls, p.num, p.name, p.attempts, p.grade, p.ending, p.total, p.bias,
      p.y, p.q, p.c, p.e, p.econ, p.qual, p.env, p.picks, p.pickLabels, p.history,
      p.hard, p.reason, p.trade, p.self, p.seconds, p.ver
    ]);
  } finally {
    lock.releaseLock();
  }
  return HtmlService.createHtmlOutput(
    '<meta charset="utf-8"><body style="font-family:sans-serif;text-align:center;padding:60px;font-size:28px">' +
    '受け付けました。<br>このタブは閉じて、ゲームにもどってください。</body>');
}

function doGet() {
  return ContentService.createTextOutput('OK（このURLは記録の受け取り用です）');
}
