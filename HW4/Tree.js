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