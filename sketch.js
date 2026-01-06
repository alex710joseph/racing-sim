let bucket = [];
let p;
let c1;
let c2;
let c3;
let flag = [];

function setup()
{
  createCanvas(720,640,P2D);
  background(0);
  p = new Path();
  c1 = color(0,0,0);
  c2 = color(0,0,0);
  c3 = color(0,0,0);
  flag[0] = 0;
  flag[1] = 0;
  flag[2] = 0;
}

function draw()
{
  background(0);
    
  p.display();
  
  if(mouseIsPressed)
  {
    bucket.push(new Vehicle(mouseX,mouseY));
  }
  
  
  for(let v of bucket)
  {
    v.checD(v.future(),p);
    v.stripe();
    //v.debug();
    v.leader();
    v.applyGroupSteers();
    v.display();
    v.update();
    v.wrap();
    
    if(v.lap>=4 && flag[0]==0 && v.won==0)
    {
      c1 = v.leader();
      v.won = 1;
      flag[0]+=1;
    }

    if(v.lap>=4 && flag[1]==0 && v.won==0)
    {
      c2 = v.leader();
      v.won = 1;
      flag[1]+=1;
    }
    
    if(v.lap>=4 && flag[2]==0 && v.won==0)
    {
      c3 = v.leader();
      v.won = 1;
      flag[2]+=1;
    }
  }
    
  if(flag[0]==1)
  {
    strokeWeight(2);
    fill(c1);
    stroke(c1);
    ellipse(700,50,20,20);
  }
  
  if(flag[1]==1)
  {
    strokeWeight(2);
    fill(c2);
    stroke(c2);
    ellipse(700,80,20,20);
  }
  
  if(flag[2]==1)
  {
    strokeWeight(2);
    fill(c3);
    stroke(c3);
    ellipse(700,110,20,20);
  }
  
}
