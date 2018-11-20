var COLOR_BUTTON_FILL = "rgb(100,100,100)";
var COLOR_BUTTON_STROKE = "rgb(0,0,0)";
var COLOR_WINDOW_CONTAINER_FILL = "rgb(200,200,200)";
var COLOR_WINDOW_CONTAINER_STROKE = "rgb(0,0,0)";
var COLOR_TEXTBOX_FILL = "rgb(200,200,200)";
var COLOR_TEXTBOX_STROKE = "rgb(0,0,0)";
var COLOR_WINDOW_TITLE = "rgb(100,100,100)";
var COLOR_TEXT = "rgb(0,0,0)";

var FONT_DEFAULT = "20px Arial";

var WINDOW_TITLE_HEIGHT = 30;

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

function gui_draw(ctx, tree)
{
    var globalT = new Transform(tree.root.data.T.position_x, tree.root.data.T.position_y, tree.root.data.T.height, tree.root.data.T.width);

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

function create_ctx(ID, width, height)
{
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", ID);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);

    document.body.appendChild(canvas);

    return canvas.getContext("2d");
}

function create_textbox(transform, text = "", font = FONT_DEFAULT)
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
    text_data.font = font;
    root.add(new Node(getNewID(), text_data));

    return root;
}

function create_button(transform, text = "", font = FONT_DEFAULT)
{
    // 0. Root
    var root = new Node(getNewID(), new GUI(transform));

    // 1. Round Rect
    var rrect_data = new RoundRect(new Transform(-(transform.width/2), -(transform.height/2), transform.height, transform.width));
    rrect_data.fillStyle = COLOR_BUTTON_FILL;
    rrect_data.strokeStyle = COLOR_BUTTON_STROKE;
    root.add(new Node(getNewID(), rrect_data));

    // 2. Text
    var text_data = new Text(new Transform(0, 0, transform.height, transform.width));
    text_data.text = text;
    text_data.font = font;
    root.add(new Node(getNewID(), text_data));

    // TODO : Add EventListener

    return root;
}

function create_window(transform, title = "")
{
    var h = Math.max(transform.height, WINDOW_TITLE_HEIGHT);
    var w = Math.max(transform.width, 0);

    // 0. Root
    var root = new Node(getNewID(), new GUI(transform));

    // 1. Rect(Body)
    var body_data = new Rect(new Transform(-(w/2), -(h/2), h, w));
    body_data.fillStyle = COLOR_WINDOW_CONTAINER_FILL;
    body_data.strokeStyle = COLOR_WINDOW_CONTAINER_STROKE;
    root.add(new Node(getNewID(), body_data));

    // 2. Rect(Title)
    var title_data = new Rect(new Transform(-(w/2), -(h/2), WINDOW_TITLE_HEIGHT, w));
    title_data.fillStyle = COLOR_WINDOW_TITLE;
    title_data.strokeStyle = COLOR_WINDOW_CONTAINER_STROKE;
    root.add(new Node(getNewID(), title_data));

    // 3. Text
    var text_data = new Text(new Transform(0, (WINDOW_TITLE_HEIGHT/2) - (h/2), WINDOW_TITLE_HEIGHT, 0));
    text_data.text = title;
    text_data.font = FONT_DEFAULT;
    root.add(new Node(getNewID(), text_data));

    // 4. Button(X)
    var close_node = create_button(new Transform((w/2) - (WINDOW_TITLE_HEIGHT/2), (h/2) - (WINDOW_TITLE_HEIGHT/2), WINDOW_TITLE_HEIGHT, WINDOW_TITLE_HEIGHT), "X");
    root.add(close_node);

    // 5. Button(_)
    var min_node = create_button(new Transform((w/2) - (WINDOW_TITLE_HEIGHT/2) - WINDOW_TITLE_HEIGHT, (h/2) - (WINDOW_TITLE_HEIGHT/2), WINDOW_TITLE_HEIGHT, WINDOW_TITLE_HEIGHT), "_");
    root.add(min_node);

    // TODO : Add EventListener

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
            return node;
        }
        else
        {
            throw new Error('Cannot find node to delete.');
        }
    }
}

/////////////////////////////////////
// TEMP
/////////////////////////////////////
/*
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
        var h = Math.max(height, WINDOW_TITLE_HEIGHT);
        var w = Math.max(width, 0);

        // draw container
        this.drawRect(position_x, position_y, w, h, COLOR_WINDOW_CONTAINER_FILL, COLOR_WINDOW_CONTAINER_STROKE);

        // draw title
        this.drawRect(position_x, position_y, w, WINDOW_TITLE_HEIGHT, COLOR_WINDOW_TITLE);
        this.drawText((2 * position_x + w) / 2, position_y + WINDOW_TITLE_HEIGHT / 2, title);

        // draw button
        this.create_button(ID, position_x + w - 2 * WINDOW_TITLE_HEIGHT, position_y + h - WINDOW_TITLE_HEIGHT, WINDOW_TITLE_HEIGHT, WINDOW_TITLE_HEIGHT, "X");
        this.create_button(ID, position_x + w - WINDOW_TITLE_HEIGHT, position_y + h - WINDOW_TITLE_HEIGHT, WINDOW_TITLE_HEIGHT, WINDOW_TITLE_HEIGHT, "_");
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
            this.drawText(position_x + WINDOW_TITLE_HEIGHT, position_y + height / 2, text, font, textAlign, textBaseline);
        }
        else if(textAlign == "right" || textAlign == "end")
        {
            this.drawText(position_x + width - WINDOW_TITLE_HEIGHT, position_y + height / 2, text, font, textAlign, textBaseline);
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
            this.create_button(ID, position_x + WINDOW_TITLE_HEIGHT, position_y + height * (i + 1), width, height, items[i], itemFont, "left");
        }
    }
}
*/