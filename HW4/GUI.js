var COLOR_BUTTON_FILL = "rgb(100,100,100)";
var COLOR_BUTTON_STROKE = "rgb(0,0,0)";
var COLOR_WINDOW_CONTAINER_FILL = "rgb(200,200,200)";
var COLOR_WINDOW_CONTAINER_STROKE = "rgb(0,0,0)";
var COLOR_TEXTBOX_FILL = "rgb(200,200,200)";
var COLOR_TEXTBOX_STROKE = "rgb(0,0,0)";
var COLOR_WINDOW_TITLE = "rgb(100,100,100)";
var COLOR_TEXT = "rgb(0,0,0)";

var FONT_DEFAULT = "20px Arial";

var SIZE_HEIGHT_MIN = 30;

class GUI
{
    constructor(ID, height, width)
    {
        this.height = height;
        this.width = width;

        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", ID);
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);

        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");
    }
    drawText(position_x, position_y, text, font=FONT_DEFAULT, textAlign="center", textBaseline = "middle")
    {
        this.ctx.font = font;
        this.ctx.fillStyle = COLOR_TEXT;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillText(text, position_x, position_y);
    }
    drawRect(position_x, position_y, width, height, fillStyle="rgb(0,0,0)", strokeStyle="rgb(0,0,0)")
    {
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillRect(position_x, position_y, width, height);

        this.ctx.strokeStyle = strokeStyle;
        this.ctx.strokeRect(position_x, position_y, width, height);
    }
    drawRoundRect(position_x, position_y, width, height, radius, fillStyle="rgba(0,0,0,1)", strokeStyle="rgb(0,0,0)") {
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }

        this.ctx.beginPath();
        this.ctx.moveTo(position_x + radius.tl, position_y);
        this.ctx.lineTo(position_x + width - radius.tr, position_y);
        this.ctx.quadraticCurveTo(position_x + width, position_y, position_x + width, position_y + radius.tr);
        this.ctx.lineTo(position_x + width, position_y + height - radius.br);
        this.ctx.quadraticCurveTo(position_x + width, position_y + height, position_x + width - radius.br, position_y + height);
        this.ctx.lineTo(position_x + radius.bl, position_y + height);
        this.ctx.quadraticCurveTo(position_x, position_y + height, position_x, position_y + height - radius.bl);
        this.ctx.lineTo(position_x, position_y + radius.tl);
        this.ctx.quadraticCurveTo(position_x, position_y, position_x + radius.tl, position_y);
        this.ctx.closePath();

        this.ctx.fillStyle = fillStyle;
        this.ctx.fill();

        this.ctx.strokeStyle = strokeStyle;
        this.ctx.stroke();
    }

    create_window(ID, position_x, position_y, width, height, title="")
    {
        var h = Math.max(height, SIZE_HEIGHT_MIN);
        var w = Math.max(width, 0);

        // draw container
        this.drawRect(position_x, position_y, w, h, COLOR_WINDOW_CONTAINER_FILL, COLOR_WINDOW_CONTAINER_STROKE);

        // draw title
        this.drawRect(position_x, position_y, w, SIZE_HEIGHT_MIN, COLOR_WINDOW_TITLE);
        this.drawText((2 * position_x + w) / 2, position_y + SIZE_HEIGHT_MIN / 2, title);

        // draw button
        this.create_button(ID, position_x + w - 2 * SIZE_HEIGHT_MIN, position_y + h - SIZE_HEIGHT_MIN, SIZE_HEIGHT_MIN, SIZE_HEIGHT_MIN, "X");
        this.create_button(ID, position_x + w - SIZE_HEIGHT_MIN, position_y + h - SIZE_HEIGHT_MIN, SIZE_HEIGHT_MIN, SIZE_HEIGHT_MIN, "_");
    }
    create_textbox(ID, position_x, position_y, width, height, text="", font=FONT_DEFAULT)
    {
        this.drawRect(position_x, position_y, width, height, COLOR_TEXTBOX_FILL, COLOR_TEXTBOX_STROKE);
        this.drawText((2 * position_x + width) / 2, (2 * position_y + height) / 2, text, font);
    }
    create_button(ID, position_x, position_y, width, height, text="", font=FONT_DEFAULT, textAlign="center", textBaseline = "middle")
    {
        this.drawRoundRect(position_x, position_y, width, height, 5, COLOR_BUTTON_FILL, COLOR_BUTTON_STROKE);

        if(textAlign == "left" || textAlign == "start")
        {
            this.drawText(position_x + SIZE_HEIGHT_MIN, position_y + height / 2, text, font, textAlign, textBaseline);
        }
        else if(textAlign == "right" || textAlign == "end")
        {
            this.drawText(position_x + width - SIZE_HEIGHT_MIN, position_y + height / 2, text, font, textAlign, textBaseline);
        }
        else    // center
        {
            this.drawText((2 * position_x + width) / 2, position_y + height / 2, text, font, textAlign, textBaseline);
        }
    }
    create_menu(ID, position_x, position_y, width, height, title, items, titleFont=FONT_DEFAULT, itemFont=FONT_DEFAULT)
    {
        // draw menu
        this.create_button(ID, position_x, position_y, width, height, title, titleFont);

        // draw items
        var i;
        for(i = 0; i < items.length; i++)
        {
            this.create_button(ID, position_x + SIZE_HEIGHT_MIN, position_y + height * (i + 1), width, height, items[i], itemFont, "left");
        }
    }
}