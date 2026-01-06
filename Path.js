class Path{
  
  constructor()
  {
    this.pos = [];
    this.pos[0] = createVector(80,80);
    this.pos[1] = createVector(640,80);
    this.pos[2] = createVector(640,560);
    this.pos[3] = createVector(80,560);
    this.margin = 20;
  }
  
  display()
  {
    stroke(255);
    
    strokeWeight(20);
    line(this.pos[0].x + 200,this.pos[0].y-this.margin,this.pos[0].x+ 200,this.pos[0].y+this.margin);
    
    strokeWeight(2);
    
    line(this.pos[0].x,this.pos[0].y,this.pos[1].x,this.pos[1].y);
    line(this.pos[0].x-this.margin,this.pos[0].y-this.margin,this.pos[1].x+this.margin,this.pos[1].y-this.margin);
    line(this.pos[0].x+this.margin,this.pos[0].y+this.margin,this.pos[1].x-this.margin,this.pos[1].y+this.margin);
    
    
    line(this.pos[1].x,this.pos[1].y,this.pos[2].x,this.pos[2].y);
    line(this.pos[1].x-this.margin,this.pos[1].y+this.margin,this.pos[2].x-this.margin,this.pos[2].y-this.margin);
    line(this.pos[1].x+this.margin,this.pos[1].y-this.margin,this.pos[2].x+this.margin,this.pos[2].y+this.margin);
    
    line(this.pos[2].x,this.pos[2].y,this.pos[3].x,this.pos[3].y);
    line(this.pos[2].x-this.margin,this.pos[2].y-this.margin,this.pos[3].x+this.margin,this.pos[3].y-this.margin);
    line(this.pos[2].x+this.margin,this.pos[2].y+this.margin,this.pos[3].x-this.margin,this.pos[3].y+this.margin);
    
    line(this.pos[3].x,this.pos[3].y,this.pos[0].x,this.pos[0].y);
    line(this.pos[3].x+this.margin,this.pos[3].y-this.margin,this.pos[0].x+this.margin,this.pos[0].y+this.margin);
    line(this.pos[3].x-this.margin,this.pos[3].y+this.margin,this.pos[0].x-this.margin,this.pos[0].y-this.margin);
  }
  
  send0()
  {
    return this.pos[0];
  }
  
  send1()
  {
    return this.pos[1];
  }

  send2()
  {
    return this.pos[2];
  }
  
  send3()
  {
    return this.pos[3];
    
  }
  

}