

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
        newDocument.size = getEntitySize(newDocument, type)

        try {
            move(null, path, newDocument)
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
                if (pathToFile[i] !== child.name) throw Error('Invalid path')
                parent = curNode
                curNode = child
                i++
            }
        }

        return [curNode, parent]
    }

    move(from, to, node = null) {
        // If the node already exists
        if (!node) {
            let [node, oldParent] = getNode(from)
        }
        
        const [newParent, _] = getNode(to)

        const namesOfDocumentsInDir = newParent.children.map((n) => n.name)
        if (namesOfDocumentsInDir.includes(node.name)) {
            throw Error(node.name + ' already exist')
        }
       
        if (newParent.type == TYPES.TXT) throw new Error('Cannot nest under a txt file')

        if (newParent.type !== 'root' && node.type == TYPES.DRIVE) throw new Error('Drive cannot be nested') 

        newParent.children.push(node)

        // Only delete the node if the node has been successfully moved 
         if (from) {
            delete(oldParent, node)
        }
        
    }

    writeToFile(path, content) {
       const [node, _] = getNode(path)

        node.content = content 
        node.size = getEntitySize(node, node.type)   
    }

    delete(path) {
        const [node, parent] = getNode(path)
        deleteNode(parent, node)
    }

    deleteNode(parent, node) {
        const n = parent.children.length
        parent.children = parent.children.filter(d => d.name !== node.name)
        
        if (n == parent.children.length) throw new Error('Cannot delete nonexisint document')
    }

}

const fileSystem = new FileSystem()


