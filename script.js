const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const CANVAS_BACKGROUND_COLOR = "#FFFFFF";
const LINE_WIDTH = 4;
const LINE_COLOR = "#000000";

const EMPTY = 0;
const MARU = 1;
const BATSU = 2;
const DRAW = 3;

let canvas;
let ctx;
let gameTable = [];
let next;
let winner;

function drawTable(table){
	let x,y,i,j;

	//背景を描画
	ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	//枠を描画
	ctx.strokeStyle = LINE_COLOR;
	//枠線
	ctx.lineWidth = LINE_WIDTH;
	for(i = 0;i < 4;i++){ //縦線
		x = Math.floor(((CANVAS_WIDTH-LINE_WIDTH)/3.0*i)+(LINE_WIDTH/2.0));
		ctx.beginPath();
		ctx.moveTo(x,0);
		ctx.lineTo(x,CANVAS_HEIGHT);
		ctx.stroke();
	}
	for(i = 0;i < 4;i++){ //横線
		y = Math.floor(((CANVAS_HEIGHT-LINE_WIDTH)/3.0*i)+(LINE_WIDTH/2.0));
		ctx.beginPath();
		ctx.moveTo(0,y);
		ctx.lineTo(CANVAS_WIDTH,y);
		ctx.stroke();
	}
	//丸とバツを書く
	for(i = 0;i < 3;i++){
		for(j = 0;j < 3;j++){
			x = (CANVAS_WIDTH-LINE_WIDTH*2.0)/3.0/2.0*(j*2+1)+LINE_WIDTH;
			y = (CANVAS_WIDTH-LINE_WIDTH*2.0)/3.0/2.0*(i*2+1)+LINE_WIDTH;
			if(table[i*3+j] == MARU){
				ctx.strokeStyle = "#FF0000";
				ctx.beginPath();
				ctx.arc(x,y,CANVAS_WIDTH/3.0/2.0-20.0,0,2*Math.PI,false);
				ctx.stroke();
			}else if(table[i*3+j] == BATSU){
				ctx.strokeStyle = "#0000FF";
				ctx.beginPath();
				ctx.moveTo(x-(CANVAS_WIDTH/3.0/2.0-20.0),y-(CANVAS_HEIGHT/3.0/2.0-20.0));
				ctx.lineTo(x+(CANVAS_WIDTH/3.0/2.0-20.0),y+(CANVAS_HEIGHT/3.0/2.0-20.0));
				ctx.moveTo(x-(CANVAS_WIDTH/3.0/2.0-20.0),y+(CANVAS_HEIGHT/3.0/2.0-20.0));
				ctx.lineTo(x+(CANVAS_WIDTH/3.0/2.0-20.0),y-(CANVAS_HEIGHT/3.0/2.0-20.0));
				ctx.stroke();
			}
		}
	}
	
}

function clickTable(e){
	let clickX,clickY,tableX,tableY;
	let winPattern = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

	//既に勝敗が決まっている場合は無視
	if(winner != EMPTY){
		return;
	}

	//クリックされた座標を調べる
	clickX = e.clientX-e.target.getBoundingClientRect().left;
	clickY = e.clientY-e.target.getBoundingClientRect().top;
	//クリックされたテーブルの座標を調べる
	tableX = Math.floor(clickX/((CANVAS_WIDTH-LINE_WIDTH)/3.0));
	tableY = Math.floor(clickY/((CANVAS_HEIGHT-LINE_WIDTH)/3.0));
	//線の上は除く
	if(tableX >= 3 || clickX < ((CANVAS_WIDTH-LINE_WIDTH)/3.0)*tableX+LINE_WIDTH){
		return;
	}
	if(tableY >= 3 || clickY < ((CANVAS_HEIGHT-LINE_WIDTH)/3.0)*tableY+LINE_WIDTH){
		return;
	}

	//既に置かれていたら飛ばす
	if(gameTable[tableY*3+tableX] != EMPTY){
		return;
	}

	//置く
	gameTable[tableY*3+tableX] = next;

	//次のターン
	if(next == MARU){
		next = BATSU;
	}else if(next == BATSU){
		next = MARU;
	}

	//テーブルを描画する
	drawTable(gameTable);

	//勝敗を調べる
	for(i = 0;i < winPattern.length;i++){
		if(gameTable[winPattern[i][0]] != EMPTY &&
			gameTable[winPattern[i][0]] == gameTable[winPattern[i][1]] &&
			gameTable[winPattern[i][0]] == gameTable[winPattern[i][2]]){
			winner = gameTable[winPattern[i][0]];
			break;
		}
	}
	if(winner != EMPTY){
		alert(winner == MARU ? "丸が勝ちました" : "バツが勝ちました");
	}else{
		//おける場所がない場合は引き分け
		if(winner == EMPTY){
		for(i = 0;i < 9;i++){
			if(gameTable[i] == EMPTY){
				break;
			}
		}
		if(i == 9){
			alert("引き分けです");
		}
	}
}


window.addEventListener("load",function(){
	let i;

	//キャンバスの設定
	canvas = document.getElementsByTagName("canvas")[0];
	ctx = canvas.getContext("2d");
	//イベントを登録
	canvas.addEventListener("click",clickTable,false);
	//テーブルの初期化
	gameTable = [];
	for(i = 0;i < 9;i++){
		gameTable.push(EMPTY);
	}
	drawTable(gameTable);
	//先手は丸にする
	next = MARU;
	winner = EMPTY;
},false);
