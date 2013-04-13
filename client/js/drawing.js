function Drawing(type, attrs){
    this.type = type;
    this.attrs = attrs; 
    this.data = {};
    this.init();
    return this;
}
Drawing.prototype.init = function(){
    
    this.element = this[this.type].apply(this, this.attrs);
    if(this.element == null) return;

    this.element.drag(function(dx, dy, x, y, event){
        dx = this.data["adjust_position"].x + dx;
        dy = this.data["adjust_position"].y + dy;
        this.element.transform("t" + dx + "," + dy);
        this.data["dx"] = dx; 
        this.data["dy"] = dy;
    }, function(){
        this.data["adjust_position"] = (!this.data.hasOwnProperty("dx"))?{x: 0, y:0}:{x: this.data["dx"], y:this.data["dy"]};
            
    }, null, this, this);
}
Drawing.prototype.line = function(paper, startX, startY, endX, endY){
    return paper.path("M" + startX +"," + startY + "L" + endX + "," + endY).attr({"stroke-width": 5});
}
Drawing.prototype.circle = function(paper, centerX, centerY, radius){
    return paper.circle(centerX, centerY, radius).attr("fill", "white");
}
Drawing.prototype.getData = function(key){
    return this.data[key];
}
Drawing.prototype.rectangle = function(paper, startX, startY, width, height){
    this.paper = paper;
    return this.paper.rect(startX, startY, width, height).attr({fill: "white"});
}
Drawing.prototype.text = function(paper, startX, startY, text){
    return paper.text(startX, startY, text).dblclick(function(){


    });
}

Drawing.prototype.oneDimensionArray = function(paper, startX, startY, elements){
    paper.setStart();
    var unit_width = 30;
    var unit_height = 30;
    for(var i = 0; i< elements.length; i++){
        var t = this.text(paper, startX + i*unit_width + unit_width/2, startY, i);
        var h = t.getBBox().height;
        this.rectangle(paper, startX+ i* unit_width, startY + h, unit_width, unit_height);
        var t = this.text(paper, startX + i*unit_width + unit_width/2, startY+h+unit_height/2, elements[i]);
    } 
    return paper.setFinish();
}
Drawing.prototype.binaryTree = function(paper, startX, startY, treeHeight){
    paper.setStart();
    var r = 15;
    var separtion = r; 
    for(var level= treeHeight-1; level >=0 ; level--){
        temp = [];
        last_index = 0;
        if( level == treeHeight - 1){
            for(var i= 0; i< Math.pow(2, treeHeight - 1); i++){
                var node = this.circle(paper, startX + i * r + 2 * i * r , startY + level * 2 *r, r);
                temp.push(node);
            }
        }
        else{
            for(var i= 0; i< Math.pow(2, level); i++){
                var cx = (last_children[last_index].attrs.cx + last_children[last_index+1].attrs.cx)/2;
                last_index += 2;
                var node = this.circle(paper, cx, startY + level * 2 * r , r);
                temp.push(node);
            }
        }
        last_children = temp;
    }
    return paper.setFinish();
}
