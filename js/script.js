(function(){

    var cnv = document.querySelector("canvas")
    var ctx = cnv.getContext("2d")

    var WIDTH = cnv.width
    var HEIGHT = cnv.height

    // Variaveis de movimentação
    var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40
    var mvLeft = mvUp = mvRight = mvDown = false

    //tamanho dos blocos
    var tileSize = 96

    // Array para colisao
    var walls = []

    // Jogador
    var player = {
        x: tileSize + 2,
        y: tileSize + 2,
        width: 28,
        height: 28,
        speed: 2
    }
	
	//mapa do labirinto
	var maze = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
		[1,1,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    var T_WIDTH = maze[0].length * tileSize
    var T_HEIGHT = maze.length * tileSize
    
    for(var row in maze) {
        for(var col in maze[row]){
            var tile = maze[row][col]
            if(tile === 1) {
                var wall = {
                    x: tileSize * col,
                    y: tileSize * row,
                    width: tileSize,
                    height: tileSize
                }
                walls.push(wall)
            }
        }
    }

    var cam = {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        innerLeftBoundary: function() {
            return this.x + (this.width*0.25)
        },
        innerTopBoundary: function() {
            return this.y + (this.height*0.25)
        },
        innerRightBoundary: function() {
            return this.x + (this.width*0.75)
        },
        innerBottomBoundary: function() {
            return this.y + (this.height*0.75)
        }
    }

    window.addEventListener("keydown", keydownHandler, false)
    window.addEventListener("keyup", keyupHandler, false)

    function keydownHandler(e) {
        var key = e.keyCode

        switch(key) {
            case LEFT :
                mvLeft = true
                break
            case UP :
                mvUp = true
                break
            case RIGHT :
                mvRight = true
                break
            case DOWN :
                mvDown = true
                break
        }
    }

    function keyupHandler(e) {
        var key = e.keyCode

        switch(key) {
            case LEFT :
                mvLeft = false
                break
            case UP :
                mvUp = false
                break
            case RIGHT :
                mvRight = false
                break
            case DOWN :
                mvDown = false
                break
        }
    }

    function loop() {
        requestAnimationFrame(loop, cnv)
        update()
        render()
    }

    function update() {

        if(mvLeft && !mvRight) {
            player.x -= player.speed
        }
        if(mvRight && !mvLeft) {
            player.x += player.speed
        }
        if(mvUp && !mvDown) {
            player.y -= player.speed
        }
        if(mvDown && !mvUp) {
            player.y += player.speed
        }

        for(var i in walls) {
            var wall = walls[i]
            blockRectangle(player, wall)
        }

        if(player.x < cam.innerLeftBoundary()) {
            cam.x = player.x - (cam.width*0.25)
        }
        if(player.y < cam.innerTopBoundary()) {
            cam.y = player.y - (cam.height*0.25)
        }
        if(player.x + player.width > cam.innerRightBoundary()) {
            cam.x = player.x + player.width - (cam.width*0.75)
        }
        if(player.y + player.height > cam.innerBottomBoundary()) {
            cam.y = player.y + player.height - (cam.height*0.75)
        }

        cam.x = Math.max(0, Math.min(T_WIDTH - cam.width, cam.x))
        cam.y = Math.max(0, Math.min(T_WIDTH - cam.height, cam.y))
    }

    function blockRectangle(objA, objB) {
        var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2)
        var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2)

        var sumWidth = (objA.width + objB.width)/2
        var sumHeight = (objA.height + objB.height)/2

        if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight) {
            var overlapX = sumWidth - Math.abs(distX)
            var overlapY = sumHeight - Math.abs(distY)

            if(overlapX > overlapY) {
                objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY
            } else {
                objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX
            }
        }
    }

    function render() {
        
        ctx.clearRect(0,0, WIDTH, HEIGHT)
        ctx.save()
        ctx.translate(-cam.x, -cam.y)
        for(var row in maze) {
            for(var col in maze[row]){
                var tile = maze[row][col]
                if(tile === 1) {
                    var x = col * tileSize
                    var y = row * tileSize
                    ctx.fillRect(x,y,tileSize,tileSize)
                }
            }
        }

        ctx.fillStyle = "#00f"
        ctx.fillRect(player.x, player.y, player.width, player.height)
        ctx.restore()

    }

    loop()

}())