class Transform
{
    constructor(position_x, position_y, height, width)
    {
        this.position_x = position_x;
        this.position_y = position_y;
        this.height = height;
        this.width = width;
    }
}

class Text
{
    constructor(transform)
    {
        this.T = transform;

        this.text = "";
        this.font = "rgb(0,0,0)";
        this.textAlign = "center";
        this.textBaseline = "middle";
    }
    execute(ctx, transform)
    {
        var global_x = this.T.position_x + transform.position_x;
        var global_y = this.T.position_y + transform.position_y;

        ctx.fillStyle = COLOR_TEXT;

        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(this.text, global_x, global_y);
    }
}

class Rect
{
    constructor(transform)
    {
        this.T = transform;

        this.fillStyle = "rgb(0,0,0)";
        this.strokeStyle ="rgb(0,0,0)";
    }
    execute(ctx, transform)
    {
        var global_x = this.T.position_x + transform.position_x;
        var global_y = this.T.position_y + transform.position_y;

        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(global_x, global_y, this.T.width, this.T.height);

        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(global_x, global_y, this.T.width, this.T.height);
    }
}

class RoundRect
{
    constructor(transform)
    {
        this.T = transform;

        this.radius = {tl: 5, tr: 5, br: 5, bl: 5};

        this.fillStyle = "rgb(0,0,0)";
        this.strokeStyle ="rgb(0,0,0)";
    }
    execute(ctx, transform)
    {
        var global_x = this.T.position_x + transform.position_x;
        var global_y = this.T.position_y + transform.position_y;

        ctx.beginPath();
        ctx.moveTo(global_x + this.radius.tl, global_y);
        ctx.lineTo(global_x + this.T.width - this.radius.tr, global_y);
        ctx.quadraticCurveTo(global_x + this.T.width, global_y, global_x + this.T.width, global_y + this.radius.tr);
        ctx.lineTo(global_x + this.T.width, global_y + this.T.height - this.radius.br);
        ctx.quadraticCurveTo(global_x + this.T.width, global_y + this.T.height, global_x + this.T.width - this.radius.br, global_y + this.T.height);
        ctx.lineTo(global_x + this.radius.bl, global_y + this.T.height);
        ctx.quadraticCurveTo(global_x, global_y + this.T.height, global_x, global_y + this.T.height - this.radius.bl);
        ctx.lineTo(global_x, global_y + this.radius.tl);
        ctx.quadraticCurveTo(global_x, global_y, global_x + this.radius.tl, global_y);
        ctx.closePath();

        ctx.fillStyle = this.fillStyle;
        ctx.fill();

        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    }
}
