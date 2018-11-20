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

class GUI1
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

///////////////////////////////////
// GUI
///////////////////////////////////

function getNewID()
{
    if ( typeof getNewID.counter == 'undefined' ) {
        // It has not... perform the initialization
        getNewID.counter = 0;
    }

    getNewID.counter++;

    return getNewID.counter;
}

function gui_draw(ctx, root)
{
    var globalT = new Transform(0, 0, 0, 0);

    var tree = new Tree(root);

    var pre_callback = function(node)
    {
        if(node.data.isGUI)
        {
            globalT.position_x += node.data.T.position_x;
            globalT.position_y += node.data.T.position_y;
        }

        node.data.execute(ctx, globalT);
    };
    var post_callback = function(node)
    {
        if(node.data.isGUI)
        {
            globalT.position_x -= node.data.T.position_x;
            globalT.position_y -= node.data.T.position_y;
        }
    };

    tree.traverse(pre_callback, post_callback);
}

function create_textbox(transform, text)
{
    // 0. Root
    var root = new Node(getNewID(), new GUI(transform));

    // 1. Rect (Given X/Y is center)
    var rect_data = new Rect(new Transform(-(transform.width/2), -(transform.height/2), transform.height, transform.width));
    rect_data.fillStyle = COLOR_TEXTBOX_FILL;
    rect_data.strokeStyle = COLOR_TEXTBOX_STROKE;
    root.add(new Node(getNewID(), rect_data));

    // 2. Text (Given X/Y is center)
    var text_data = new Text(new Transform(0, 0, transform.height, transform.width));
    text_data.text = text;
    text_data.font = FONT_DEFAULT;
    root.add(new Node(getNewID(), text_data));

    return root;
}


//////////////////////////////////
//  Graphic
/////////////////////////////////

class GUI
{
    constructor(transform)
    {
        this.T = transform;

        this.isGUI = true;
    }
    execute(ctx, transform)
    {
        // Nothing
    }
}

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

        ctx.fillStyle = "rgb(0,0,0)";

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

//////////////////////////////////
//  Tree
/////////////////////////////////
class Node
{
    constructor(ID, data)
    {
        this.id = ID;
        this.data = data;
        this.parent = null;
        this.children = [];
    }
    add(node)
    {
        this.children.push(node);
        node.parent = this;
    }
    delete()
    {
        if(this.parent)
        {
            var index = this.parent.children.indexOf(this);
            this.parent.children.splice(index, 1);
        }

        this.parent = null;
    }
}

class Tree
{
    constructor(node)
    {
        this.root = node;
    }
    traverse(pre_callback, post_callback)      // Depth First Search
    {
        // this is a recurse and immediately-invoking function
        (function recurse(currentNode)
        {
            // step 2
            if(pre_callback)
            {
                pre_callback(currentNode);
            }

            // step 3
            for (var i = 0, length = currentNode.children.length; i < length; i++) {
                // step 4
                recurse(currentNode.children[i]);
            }

            // step 4
            if(post_callback)
            {
                post_callback(currentNode);
            }

            // step 1
        })(this.root);
    }
    search_node(ID)
    {
        var result = null;
        var callback = function(node)
        {
            if(node.id === ID)
            {
                result = node;
            }
        };

        this.traverse(callback, null);

        return result;
    }
    add_node(parentID, node)
    {
        var parentNode = this.search_node(parentID);

        if(parentNode)
        {
            parentNode.add(node);
        }
        else
        {
            throw new Error('Cannot add node to a non-existent parent.');
        }
    }
    delete_node(ID)
    {
        var node = this.search_node(ID);

        if(node)
        {
            node.delete();
        }
        else
        {
            throw new Error('Cannot find node to delete.');
        }
    }
}