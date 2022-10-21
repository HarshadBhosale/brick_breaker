var ball_x, ball_y, ball_diameter, ball_dx, ball_dy, ball_dia_inc;
var paddle_x, paddle_y, paddle_width, paddle_height, paddle_dx, paddle_w_inc;
var brick_x, brick_y, brick_width, brick_height;
ball_dia_inc = 1.2;
paddle_w_inc = 1.5;
// let song_bg, song_bounce, song_collide;
// song_bg = loadSound("block_breaker.mp3");
// song_bounce = loadSound("bouncingballsound.mp3");
// song_collide = loadSound("magic.mp3");

function collide_check(bx, by, i, isSpecial){
   if ((bx>=arr[i][1]) && (bx <=(arr[i][1]+brick_width))){
    if ((by>arr[i][0]) && (by - arr[i][0]) <=(brick_height + ball_diameter/2) || (by<arr[i][0]) && (arr[i][0] - by) <=ball_diameter/2){
      score += 1;
      arr[i][0] = -10000;
      if (isSpecial>=2){
// split ball into 2 
      }
      else if (isSpecial>=1){
        ball_diameter *= max(ball_dia_inc, 1.05);
        ball_dia_inc *= 0.95;
      } 
      ball_dy *= -1;
    }
  }
  if ((by>=arr[i][0]) && (by <=(arr[i][0]+brick_height))){
    if ((bx<arr[i][1]) && (arr[i][1] - bx) <=(ball_diameter/2) || (bx>(arr[i][1]+brick_width)) && (bx - arr[i][1]) <=(brick_width + ball_diameter/2)){
      score += 1;
      arr[i][1] = -10000;
      if (isSpecial>=2){
// split ball into 2 
      }
      else if (isSpecial>=1){
        paddle_width = min(paddle_width*paddle_w_inc, width); 
        paddle_w_inc *= 0.95;
        if (paddle_x+paddle_width>width){
          paddle_x = width - paddle_width ; 
      }
    }
    ball_dx *= -1;
    }
  }
}
function changeSpeedOnBounce(){
  if(ball_x>=(paddle_width/2 + paddle_x)){
    ball_dx = min((ball_dx+Math.random())*(ball_x/abs(ball_x)), 2.8*(ball_x/abs(ball_x)));
  }
  else{
    ball_dx = max((ball_dx-Math.random()*(ball_x/abs(ball_x))), 2*(ball_x/abs(ball_x)));
  }
}

function bounce(){
  distance_ball_paddle = (abs((paddle_x+paddle_width/2) - ball_x)^2 + abs((paddle_y+paddle_height/2) - ball_y)^2)^(0.5);
  if (((ball_x>paddle_x) && (ball_x<(paddle_width+paddle_x)))&&((distance_ball_paddle<(paddle_height/2+1.1*ball_diameter/2 + 5)))||(ball_y>(height-paddle_height/1.2-ball_diameter/2))){
    ball_dy *= -1;
    changeSpeedOnBounce();
    ball_y = height-ball_diameter/2 - paddle_height - 1;
  }
  // else if(){}
  if (ball_x<ball_diameter/2){
    ball_dx *= -1;
    ball_x = ball_diameter/2 + 1;
    console.log("here");
  }
  if(ball_y<(ball_diameter/2)){
    ball_dy *= -1;
    ball_y = ball_diameter/2 + 1;
    console.log("here");
  }
  if (ball_x>(width-ball_diameter/2)){
    ball_dx *= -1;
    ball_x = width-ball_diameter/2 - 1;
    console.log("here");
  }
}

function setup() {
  createCanvas(1400, 750);
  background("black");
  ball_x = width / 2;
  ball_y = 2.5*height / 4;
  ball_diameter = 25;
  if ((Math.random()-0.7)<0){
    ball_dx = -2;
  }
  else{
    ball_dx = 2;
  }
  ball_dy = 3;
  circle(ball_x, ball_y, ball_diameter);
  
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
  arr = []
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

function draw(){
  background("black");
  if(keyIsDown(SHIFT) || isStarted){
  textSize(20);
  stroke("pink");
  fill("green");
  rect(paddle_x, paddle_y, paddle_width, paddle_height);
  fill("red");
  circle(ball_x, ball_y, ball_diameter);
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
  fill("yellow");
  text("Score: "+ score.toString(), 10, 30);
  if (keyIsDown(RIGHT_ARROW) && paddle_x<(width - paddle_width)){
    paddle_x += paddle_dx
  }
  if (keyIsDown(LEFT_ARROW) && paddle_x>0){
    paddle_x -= paddle_dx
  }
  if (keyIsDown(ENTER)){
    setup();
  }
  ball_x += ball_dx;
  ball_y += ball_dy;
  bounce();
  for (let i=0; i<brick_row*brick_col; i++){
    collide_check(ball_x, ball_y, i, arr[i][2]);
  }
  if (score == brick_col*brick_row){
    ball_dx = 0; 
    ball_dy = 0;
    paddle_dx = 0;
    text("      WELL DONE\nYou Scored"+ score+ "points\nPress Enter to Restart", 0.46*width, 0.6*height)
  }else if (ball_y>(height-paddle_height)){
    text("      GAME OVER\nPress Enter to Restart", 0.42*width, 0.6*height)
    ball_x = -10000;
    ball_dy = 0;
    paddle_dx = 0;
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