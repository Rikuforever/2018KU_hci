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
    traverse(callback)
    {
        var queue = [];
        queue.push(this.root);

        var currentNode = queue.shift();

        while(currentNode)
        {
            for(var i = 0, length = currentNode.children.length; i < length; i++)
            {
                queue.push(currentNode.children[i]);
            }

            callback(currentNode);
            currentNode = queue.shift();
        }
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

        this.traverse(callback);

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