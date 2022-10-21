var ball_dia_inc;
var paddle_x, paddle_y, paddle_width, paddle_height, paddle_dx, paddle_w_inc;
var brick_x, brick_y, brick_width, brick_height;
ball_dia_inc = 1.2;
paddle_w_inc = 1.5;
// let song_bg, song_bounce, song_collide;
// song_bg = loadSound("block_breaker.mp3");
// song_bounce = loadSound("bouncingballsound.mp3");
// song_collide = loadSound("magic.mp3");

function collide_check(bx, by, j, i, isSpecial){
   if ((bx>=arr[i][1]) && (bx <=(arr[i][1]+brick_width))){
    if ((by>arr[i][0]) && (by - arr[i][0]) <=(brick_height + ball[j][2]/2) || (by<arr[i][0]) && (arr[i][0] - by) <=ball[j][2]/2){
      score += 1;
      arr[i][0] = -10000;
      if (isSpecial>=2){
        ball.push([ball[0][0], ball[0][1], 20, 2*(ball[0][3]/abs(ball[0][3])), 3*(ball[0][4]/abs(ball[0][4]))]);
      }
      else if (isSpecial>=1){
        ball[j][2] *= max(ball_dia_inc, 1.05);
        ball_dia_inc *= 0.95;
      }
      ball[j][4] *= -1;
    }
  }
  if ((by>=arr[i][0]) && (by <=(arr[i][0]+brick_height))){
    if ((bx<arr[i][1]) && (arr[i][1] - bx) <=(ball[j][2]/2) || (bx>(arr[i][1]+brick_width)) && (bx - arr[i][1]) <=(brick_width + ball[j][2]/2)){
      score += 1;
      arr[i][1] = -10000;
      if (isSpecial>=2){
        ball.push([ball[0][0], ball[0][1], 20, 2*(ball[0][3]/abs(ball[0][3])), 3*(ball[0][4]/abs(ball[0][4]))]);
      }
      else if (isSpecial>=1){
        paddle_width = min(paddle_width*paddle_w_inc, width); 
        paddle_w_inc *= 0.95;
        if (paddle_x+paddle_width>width){
          paddle_x = width - paddle_width ; 
      }
    }
    ball[j][3] *= -1;
    }
  }
}
function changeSpeedOnBounce(){
  if(ball[0][0]>=(paddle_width/2 + paddle_x)){
    ball[0][3] = min(ball[0][3]+0.7, 2.5);
  }
  else{
    ball[0][3] = min(ball[0][3]-0.7, 1.8);
  }
}

function bounce(){
  for (let j=0; j<ball.length; j++){
    if ((ball[j][0]>=paddle_x) && (ball[j][0]<=(paddle_width+paddle_x)) && (ball[j][1] >= (height-ball[j][2]/2 - paddle_height)) &&(ball[j][1]<(width-ball[j][2]/2))){
      ball[j][4] *= -1;
      changeSpeedOnBounce();
      ball[j][1] = height-ball[j][2]/2 - paddle_height + 1;
    }
    if(ball[j][1]<(ball[j][2]/2)){
      ball[j][4] *= -1;
    }
    if (ball[j][0]>=(width-ball[j][2]/2) || ball[j][0]<(ball[j][2]/2)){
      ball[j][3] *= -1;
    }
  }
}

function setup() {
  createCanvas(1400, 750);
  background("black");
  if ((Math.random()-0.7)<0){
    ball = [[width / 2, 2.5*height / 4, 25, -2, 3]];
  }
  else{
    ball = [[width / 2, 2.5*height / 4, 25, 2, 3]];
  }
  paddle_width = 100;
  paddle_height = 20;
  paddle_x = width/2 - paddle_width/2;
  paddle_y = height - paddle_height;
  paddle_dx = 4.5;

  brick_width = 70;
  brick_height = 20;
  brick_x = width/2 - paddle_width/2;
  brick_y = height/5 - paddle_height;
  brick_row = 8;
  brick_col = 12;
  let rand = floor(Math.random()*10);
  if (rand>=5){
    rand = rand*(20-rand);
  }
  else{
    rand = rand*rand*rand/(10.5-rand);
  }
  arr = [];
  for(let i = 0; i<brick_row; i++){
    for(let j=0; j<brick_col; j++){
      if (j%3 == 0){
        arr.push([i*50+min(rand+50, 60), j*110+50, floor(Math.random()*4)]) //special -> 0, 1
      }
      else if (j%3 == 1){
        arr.push([i*50+60, j*110+min(rand+45, 55), floor(Math.random()*2.5)]) //special -> 0, 1
      }
      else {
        arr.push([i*50+60, j*110+min(rand+45, 55), floor(Math.random()*1.5)]) //special -> 0, 1
      }
      
    }
  }
  score = 0;
  isStarted = 0;
  ball_dia_inc = 1.5;
  paddle_w_inc = 1.5;
}

function drawCircle(ball, ind, color){
  fill(color);
  circle(ball[ind][0], ball[ind][1], ball[ind][2]);
  ball[ind][0] += ball[ind][3];
  ball[ind][1] += ball[ind][4];
}

function draw(){
  background("black");
  if(keyIsDown(SHIFT) || isStarted){
  textSize(20);
  stroke("pink");
  fill("green");
  rect(paddle_x, paddle_y, paddle_width, paddle_height);

  for (let i = 0; i<(brick_row*brick_col); i++){
    if (arr[i][2]>=2){
      fill("white");
    rect(arr[i][1], arr[i][0], brick_width, brick_height);
    }
    else if (arr[i][2]>=1){
      fill("blue");
    rect(arr[i][1], arr[i][0], brick_width, brick_height);
    }
    else {
      fill("purple");
    rect(arr[i][1], arr[i][0], brick_width, brick_height);
    }
  }

  drawCircle(ball, 0, "red");
  for (let j = 1; j<(ball.length - 1); j++){
    drawCircle(ball, j, "black");
  }

  if (keyIsDown(RIGHT_ARROW) && paddle_x<(width - paddle_width)){
    paddle_x += paddle_dx
  }
  if (keyIsDown(LEFT_ARROW) && paddle_x>0){
    paddle_x -= paddle_dx
  }
  if (keyIsDown(ENTER)){
    setup();
  }
  bounce();
  for (let i=0; i<brick_row*brick_col; i++){
    for(let j=0; j<ball.length;j++){
      collide_check(ball[j][0], ball[j][1], j, i, arr[i][2]);
    }
  }

  fill("yellow");
  text("Score: "+ score.toString(), 10, 30);

  if (score == brick_col*brick_row){
    for(let j=0; j<ball.length;j++){
      ball[j][3] = 0; 
      ball[j][4] = 0;
    }
    paddle_dx = 0;
    text("      WELL DONE\nYou Scored"+ score+ "points\nPress Enter to Restart", 0.46*width, 0.6*height)
  }else{
    if (ball[0][1]>=(height-paddle_height-ball[0][2]/2)){
    text("      GAME OVER\nPress Enter to Restart", 0.42*width, 0.6*height);
    ball[0][1] = 1000;
    ball[0][4] = 0;
    paddle_dx = 0;
    }
    for(let j=1; j<ball.length;j++){
        if (ball[j][1]>(height-paddle_height - ball[j][2]/2)){
          ball[j][1] = -1000;
          ball[j][4] = 0;
        }
      }
  }
  isStarted = 1;
  }
  else{
  stroke("pink");
  fill("yellow");
  textSize(100);
  text("      Press Shift to start", 0.05*width, 0.52*height)
  }
}