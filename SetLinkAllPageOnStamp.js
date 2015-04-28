//
//SetLinkAllPageOnStamp.js
//20150428　v1
//選択したスタンプを全てのページにコピーします
//その後でスタンプの上にリンクをブジェクトをコピーします
//Acrobatの仕様通りには動いていないが…汗
//結果としては期待値なので公開
//Adobe Reader 11 OSX 10.6.8 にて確認
//インストール先は
//ディスク名/Users/ユーザー名/Library/Application Support/Adobe/Acrobat/11.0/JavaScripts
//文字コード　UTF-16　改行コードUNIX　に変更してから配置



function SetLinkAllPage(){
//まずはコンソール（デバッガー）を出さないと
//結果が見れませんので出しておきます
console.show();

//URL入力用のダイアログ
var strResponse = app.response({
		cQuestion: "リンクオブジェクト用のURLを入力",
		cTitle: "URLを入力してください",
		cDefault: "http://",
		cLabel:"入力:"
		});
//デバッグ用のコンソールログ
console.println(strResponse);
//ダイアログの戻り値がnullなら処理を中止
if (strResponse == null){
 exit;
}



//ロックされていない場合はロックする
this.selectedAnnots[0].setProps({ lock:true});
//リードオンリーにする
this.selectedAnnots[0].setProps({ readOnly:true});
//リードオンリーにする
this.selectedAnnots[0].setProps({ opacity:0.75});
//日付けを取得　date(ja)日本形式で
var objDate = new Date();
var JpDate = util.printd("date(ja){ggg' 'YYYY'年 'MMMM' 'DD'日('EEEE')'}",objDate,true);

//nameプロパティを取得
var cStrName = this.selectedAnnots[0].name;
//APプロパティを取得
var cStrAP = this.selectedAnnots[0].AP;
//subjectプロパティを取得
var cStrSubject = this.selectedAnnots[0].subject;
//authorプロパティを取得
var cStrAuthor = this.selectedAnnots[0].author;
//stateプロパティを取得
var cStrState = this.selectedAnnots[0].state;
//rotateプロパティを取得
var cStrRotate = this.selectedAnnots[0].rotate;
//popupRectプロパティを取得
var cStrPopupRect = this.selectedAnnots[0].popupRect;
//typeプロパティを取得
var cStrType = this.selectedAnnots[0].type;
//pageプロパティを取得
var cStrPage = this.selectedAnnots[0].page;
//rectプロパティを取得
var cStrRect = this.selectedAnnots[0].rect;
//rectの４つの値をそれぞれに分ける
var numXll = cStrRect[0];
var numYll = cStrRect[1];
var numXur = cStrRect[2];
var numYrl = cStrRect[3];
//少数点以下を切り捨て
var numXll = Math.floor(numXll);
var numYll = Math.floor(numYll);
var numXur = Math.floor(numXur);
var numYrl = Math.floor(numYrl);
//デバッグ用のコンソールログ
console.println('numXll: ' + numXll + ' ');
console.println('numYll: ' + numYll + ' ');
console.println('numXur: ' + numXur + ' ');
console.println('numYrl: ' + numYrl + ' ');
//整数になった値を並べる
var cStrRectFloor = [numXll,numYll,numXur,numYrl];
//デバッグ用のコンソールログ
console.println('rect: ' + cStrRectFloor + ' ');
//コメント※READERでは機能しない
try{
var cStrContents = this.selectedAnnots[0].contents;
console.println('contents: ' + cStrContents + ' ');
}catch( e ){
/////////////☆ここだけ設定項目　コンテンツの内容を指定
var cStrContents = JpDate + "に" + cStrAuthor + " が追加しました";
}
//今のページ番号を取得
var numNowPage = this.pageNum;
//ページのカウント用の数値の初期化
var numPageCnt = 0;
/////最初のスタンプのみここで処理リンクをかぶせる
var lhLink = this.addLink(numPageCnt, cStrRectFloor);
//リンクオブジェトにリンクを設定
lhLink.setAction("app.launchURL('" + strResponse + "');");
//赤ボーダー
lhLink.borderColor = color.red;
//ボーダー幅は１px
lhLink.borderWidth = 1;


//全ページ数を取得
var numAllPageCnt = this.numPages ;
//////////////////////////////////////////////繰り返しの始まり
while (+numPageCnt < numAllPageCnt) {
//次のページへ移動する
var numPageCnt = +numPageCnt + 1;
//注釈を追加する処理
var annot = this.addAnnot
({
name: cStrName,			//スタンプの名前
AP: cStrAP,				//AP名
subject: cStrSubject,		//サブジェクトはスタンプのプロパティのタイトルになります
author: cStrAuthor,			//ユーザー名スタンプのプロパティの作成者
page: numPageCnt,			//注釈を入れるページ（現在のページ）
type: cStrType,			//タイプはスタンプ
rect: cStrRectFloor,			//注釈を落とす位置xy左下が0,0
//rectは以下の形式で格納: [numXll,numYll,numXur,numYrl],
popupRect: cStrPopupRect,	//ポップアップを開く位置
contents: cStrContents,		//コメント
opacity:0.75,				//75％の不透明度
print:true,				//印刷する属性を付けておく（意味ないけど）
state:cStrState,			//Accepted, Rejected,Cancelled, Completed None　のどれか
rotate: cStrRotate,			//回転
delay: true,				//ディレイ(true or false)
noView: false ,			//表示(true or false)
hidden: false ,			//隠すか？(true or false)
popupOpen: false, 			//ポップアップをオープンするか？(true or false)
lock:true,						//☆ロックする ロックしない場合は「false」に変更
//留意事項リードオンリー属性をtrueにすると、普通の方法ではスタンプが削除出来なくなります。
//削除出来ないようにするには良いですが、削除が必要な場合にはfalseに設定しましょう
readOnly:true						//☆リードオンリーにする　しない場合は「false」に変更
//スタンプ実行部の終了
});
/////リンクをかぶせる
var lhLink = this.addLink(numPageCnt, cStrRectFloor);
//リンクオブジェトにリンクを設定
lhLink.setAction("app.launchURL('" + strResponse + "');");
//赤ボーダー
lhLink.borderColor = color.red;
//ボーダー幅は１px
lhLink.borderWidth = 1;



//ページカウントをカウントアップ
this.pageNum++;
//繰り返しの終わり
}
//処理の終わり
}

///拡張メニュー部
app.addToolButton({
cName: "SetLinkAllPage",
cParent: "Annots",
cExec: "SetLinkAllPage()",
cEnable: "event.rc = true",
cMarked: "event.rc = false",
cTooltext: "選択したスタンプを全てのページにコピーしてその上にリンクをおきます",
nPos: -1,
cLabel: "リンクonスタンプAllPages"

});

