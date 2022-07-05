
/*
 * This is a sudo code example with real javascript. I have not run this code, so there is probably bugs
 */

class Node {// class Entity a better name?
    constructor(name, type, size, content){
        this.type = type
        this.content = content
        this.size = size
        this.path = path
        this.name = name
        this.children = []
    }
    
}

const TYPES = {
    ZIP: 'ZIP',
    TXT: 'TXT',
    DRIVE: 'DRIVE'
}

class FileSystem {
    constructor() {
        this.root = new Node(root, 'root', null, null)
    }

    getEntitySize(entity, type) {
        let size = entity.content.length
        if (type == TYPES.DRIVE) {
            size = entity.children.reduce((acc, n) => acc += n.size, 0)// TODO: duplicate work here that is unnecessary, save children sum to an var
        }

        if (type == TYPES.ZIP) {
            size = entity.children.reduce((acc, n) => acc += n.size, 0) / 2 // TODO: duplicate work here that is unnecessary, save children sum to an var 

        }

        return size
    }

    create(path, name, content, type) {
        if (!Object.values(TYPES).includes(type.toUpperCase())) throw new Error('invald file type')

        const pathToFile = path.split('/')

        const newDocument = new Node(name, type, content.length, content)
        newDocument.size = this.getEntitySize(newDocument, type)

        try {
            this.move(null, path, newDocument)
        } catch (error) {
            throw Error(error)
        }
    }

    getNode(path) {
        const pathToFile = path.split('/')
        let curNode = this.root
        let i = 0
        let parent = this.root
        while (i < pathToFile.length) {
            for (const child of curNode.children) {
                if (pathToFile[i] == child.name) {
                    parent = curNode
                    curNode = child
                    i++
                }
            }
        }
        
        // Check if we found the node by confirming its parent
        if (pathToFile.length >= 2 && pathToFile[pathToFile.length - 2] != parent.name) throw new Error('Invalid path')

        return [curNode, parent]
    }

    move(from, to, node = null) {
        // If the node already exists
        if (!node) {
            let [node, oldParent] = this.getNode(from)
        }
        
        const [newParent, _] = this.getNode(to)

        const namesOfDocumentsInDir = newParent.children.map((n) => n.name)
        if (namesOfDocumentsInDir.includes(node.name)) {
            throw new Error(node.name + ' already exist')
        }
       
        if (newParent.type == TYPES.TXT) throw new Error('Cannot nest under a txt file')

        if (newParent.type !== 'root' && node.type == TYPES.DRIVE) throw new Error('Drive cannot be nested') 

        newParent.children.push(node)

        // Only delete the node if the node has been successfully moved 
         if (from) {
            this.delete(oldParent, node)
        }
        
    }

    writeToFile(path, content) {
       const [node, _] = this.getNode(path)

        node.content = content 
        node.size = this.getEntitySize(node, node.type)   
    }

    delete(path) {
        const [node, parent] = this.getNode(path)
        this.deleteNode(parent, node)
    }

    deleteNode(parent, node) {
        const n = parent.children.length
        parent.children = parent.children.filter(d => d.name !== node.name)
        
        if (n == parent.children.length) throw new Error('Cannot delete nonexisint document')
    }

}

const fileSystem = new FileSystem()


