class Vehicle{

  
  constructor(x,y)
  {
    this.location = createVector(x,y);
    this.velocity = createVector(2,1.3);
    this.acceleration = createVector(0,0);
    this.r = 10;
    this.maxLimit = random(5,7);
    this.maxForce = random(0.30,0.35);
    this.frames = 50;
    this.won = 0;
    this.rx = int(random(50,255));
    this.gx = int(random(50,255));
    this.bx = int(random(50,255));
    this.lap = 0;
    this.margin = 15;
    this.sep = 25;
    this.strip = [];
    this.strip[0] = 0;
    this.strip[1] = 0;
    this.strip[2] = 0;
    this.strip[3] = 0;
    this.pos = [];
    this.pos[0] = 0;
    this.pos[1] = 0;
    this.pos[2] = 0;
    this.pos[3] = 0;
  }
  
  display()
  {
    stroke(this.rx,this.gx,this.bx);
    strokeWeight(2);
    fill(this.rx,this.gx,this.bx);
    let angle = this.velocity.heading();
    push();
    translate(this.location.x,this.location.y);
    rotate(angle);
    beginShape();
    vertex(0,-this.r/2);
    vertex(0,this.r/2);
    vertex(2*this.r,0);
    endShape(CLOSE);
    pop();
    
  }
  
  update()
  {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxLimit);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }
  
  wrap()
  {
    if(this.location.x>=width || this.location.x<=0)
      this.velocity.x*=-1;
    if(this.location.y>=height || this.location.y<=0)
      this.velocity.y*=-1;      
  }
  
  applyForce(temp)
  {
    this.acceleration.add(temp);
  }
  
  steer(temp)
  {    
    let desired = p5.Vector.sub(temp,this.location);
    desired.setMag(this.maxLimit);
    
    let steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxForce);
    
    this.applyForce(steer);
  }
///////////////////////////////////////////////////////
  normal(x1,y1,x2,y2,x3,y3)
  {
    let origin = createVector(x1,y1);
    let A = createVector(x3,y3);
    let B = createVector(x2,y2);
    let tempA = p5.Vector.sub(A,origin);
    let tempB = p5.Vector.sub(B,origin);
    tempB.normalize();
    tempB.mult(tempA.dot(tempB));
    let proj = p5.Vector.add(origin,tempB);
    return proj;
  }
//////////////////////////////////////////////////////
  future()
  {
    let fut = this.velocity.copy();
    fut.normalize();
    fut.mult(this.frames);   // how many frames ahead do we want to predict
    let ret = p5.Vector.add(this.location,fut);
    return ret;
  }
//////////////////////////////////////////////////////
  checD(temp,p)
  {
    let future = temp.copy();
    let normFinal = createVector(0,0);
    let seek = createVector(0,0);
        
    this.pos[0] = p.send0();
    this.pos[1] = p.send1();
    this.pos[2] = p.send2();
    this.pos[3] = p.send3();

   

    let shortest = 2000;
    let curr1 = createVector(0,0);
    let curr2 = createVector(0,0);
    
    for(let i=0;i<4;i++)
    {
      
      curr1 = this.pos[i].copy();
      curr2 = this.pos[(i+1)%4].copy();
      
      let norm = this.normal(curr1.x,curr1.y,curr2.x,curr2.y,future.x,future.y);
      
      let dir = p5.Vector.sub(curr2,curr1);
      dir.setMag(25);
      
      if(norm.x<min(curr1.x,curr2.x) || norm.x>max(curr1.x,curr2.x) || norm.y<min(curr1.y,curr2.y) || norm.y>max(curr1.y,curr2.y))
        {
          norm = curr2.copy();
          curr1 = this.pos[(i+1)%4].copy();
          curr2 = this.pos[(i+2)%4].copy();
          dir = p5.Vector.sub(curr2,curr1);
          dir.setMag(25);
        }

      let d = p5.Vector.dist(norm,future);
      if(d<shortest)
        {
          shortest = d;
          normFinal = norm;
          seek = normFinal.copy();
          seek.add(dir);
        }  
     
    }
    
    //line(normFinal.x,normFinal.y,future.x,future.y);
    
    if(shortest>this.margin)
    {
      this.steer(seek);
    }
  }
//////////////////////////////////////////////////////
  separation()
  {
    let sum = createVector(0,0);
    let count = 0;
    for(let Vehicle of bucket)
    {
      let d = dist(this.location.x,this.location.y,Vehicle.location.x,Vehicle.location.y);
      if(d > 0 && d < this.sep)
      {
        let temp = p5.Vector.sub(this.location,Vehicle.location);
        temp.normalize();
        temp.div(d);
        sum.add(temp);
        count++;
      }
    }
    
    if(count>0)
    {
      sum.div(count);
      sum.setMag(this.maxLimit);
      let steer = p5.Vector.sub(sum,this.velocity);
      return steer;
    }
    else
    {
      let temp = createVector(0,0);
      return temp;
    }
     
  }
//////////////////////////////////////////////////////
  alignment()
  {
    let sum = createVector(0,0);
    let count = 0;
    for(let Vehicle of bucket)
    {
      let d = dist(this.location.x,this.location.y,Vehicle.location.x,Vehicle.location.y);
      if(d > 0 && d < this.sep)
      {
        sum.add(Vehicle.velocity);
        count++;
      }
    }
    
    if(count>0)
    {
      sum.div(count);
      sum.setMag(this.maxLimit);
      let steer = p5.Vector.sub(sum,this.velocity);
      return steer;
    }
    else
    {
      let temp = createVector(0,0);
      return temp;
    }
  }
//////////////////////////////////////////////////////
  cohesion()
  {
    let avg = createVector(0,0);
    let count = 0;
    for(let Vehicle of bucket)
    {
      let d = dist(this.location.x,this.location.y,Vehicle.location.x,Vehicle.location.y);
      if(d > 0 && d < this.sep)
      {
        avg.add(Vehicle.location);
        count++;
      }
    }
    
    if(count>0)
    {
      avg.div(count);
      let desired = p5.Vector.sub(avg,this.location);
      desired.setMag(this.maxLimit);
      return desired;
    }
    else
    {
      let temp = createVector(0,0);
      return temp;
    }
  }
  
//////////////////////////////////////////////////////
  applyGroupSteers()
  {
    let steer1 = this.cohesion();
    let steer2 = this.separation();
    let steer3 = this.alignment();
    

    steer1.limit(this.maxForce);
    steer2.limit(this.maxForce);
    steer3.limit(this.maxForce);
        
    steer1.mult(0.7);
    steer2.mult(2.5);
    steer3.mult(1);
    
    this.applyForce(steer1);
    this.applyForce(steer2);
    this.applyForce(steer3);
  }

//////////////////////////////////////////////////////
  stripe()
  {
    if(this.location.x>=250 && this.location.x<=280 && this.location.y>=0 && this.location.y<=150)
    {
      this.lapCount();
      this.reset();
      this.strip[0]+=1;
    }
    if(this.location.x>=570 && this.location.x<=720 && this.location.y>=360 && this.location.y<=390)
      this.strip[1]+=1;
    if(this.location.x>=360 && this.location.x<=390 && this.location.y>=490 && this.location.y<=640)
      this.strip[2]+=1;
    if(this.location.x>=0 && this.location.x<=150 && this.location.y>=360 && this.location.y<=390)
      this.strip[3]+=1;
  }
  
  reset()
  {
    this.strip[0]=0;
    this.strip[1]=0;
    this.strip[2]=0;
    this.strip[3]=0;
  }
  
  lapCount()
  {
    if(this.strip[0]>0 && this.strip[1]>0 && this.strip[2]>0 && this.strip[3]>0)
      this.lap+=1;    
  }
  
  debug()
  {
    print(this.lap);
  }
  
  leader()
  {
    let c = color(this.rx,this.gx,this.bx);
    return c;  
  } 
//////////////////////////////////////////////////////
}