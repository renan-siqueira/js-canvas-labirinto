(function(){

    var cnv = document.querySelector("canvas")
    var ctx = cnv.getContext("2d")
    

    function loop() {
        requestAnimationFrame(loop, cnv)
        update()
        render()
    }

    function update() {

    }

    function render() {
        ctx.clearRect(0,0, cnv.width, cnv.height)
    }

}())