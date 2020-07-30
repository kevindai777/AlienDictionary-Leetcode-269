//Objective is, given a lexicographically sorted array of strings with an unknown alphabet,
//to decipher that alphabet

let words = [
    "wrt",
    "wrf",
    "er",
    "ett",
    "rftt"
]


//O(KP) where K is the number of characters in the dictionary and P is the longest word in the list
//Topological sort solution without the edge case ['abc', 'ab']

let indegrees = new Array(26).fill(0)
let graph = new Map()
buildGraph()
return bfs(graph, indegrees)

function buildGraph() {
    //Build the map for all unique characters
    for (let word of words) {
        for (let char of word) {
            if (!graph.has(char)) {
                graph.set(char, new Set())
            }
        }
    }
    
    //For each word, find the different characters in the same indicies
    for (let i = 1; i < words.length; i++) {
        let first = words[i - 1]
        let second = words[i]
        
        let length = Math.min(first.length, second.length)
        for (let j = 0; j < length; j++) {
            if (first[j] != second[j]) {
                let out = first[j]
                let inner = second[j]
                
                //Map out the directed edge, and increase the indegree for the character
                if (!graph.get(out).has(inner)) {
                    graph.get(out).add(inner)
                    indegrees[inner.charCodeAt(0) - 97]++
                }
                
                //Once two different characters are met, go to the next word
                break
            }
        }
    }
}

function bfs(graph, indegrees) {
    let string = ''
    let queue = []
    
    //Find the starting node of the topological sort and push it into the queue for bfs
    for (let char of graph.keys()) {
        if (indegrees[char.charCodeAt(0) - 97] == 0) {
            string += char
            queue.push(char)
        }
    }
    
    while (queue.length > 0) {
        let curr = queue.shift()
        
        //If it doesn't exist in the graph or if it doesn't have any neighbors, skip
        if (!graph.get(curr) || graph.get(curr).size == 0) {
            continue
        }
        
        //Visit every neighbor
        //Once visited, we decrement the indegree of the char and push it into the queue
        for (let neighbor of graph.get(curr)) {
            indegrees[neighbor.charCodeAt(0) - 97]--
            if (indegrees[neighbor.charCodeAt(0) - 97] == 0) {
                queue.push(neighbor)
                string += neighbor
            }
        }
    }
    
    //Make sure the string is the size of the number of unique letters in the strings
    return string.length == graph.size ? string : ''
}


//O(KP) where K is the number of characters in the dictionary and P is the longest word in the list
//Topological sort solution with the edge case ['abc', 'ab'], using a 27th 'character' to compare as the empty space

let newArray = []
words.unshift('')
for (let word of words) {
    newArray.push(word + '{')
}
words = newArray

let indegrees = new Array(27).fill(0)
let graph = new Map()
buildGraph()
return bfs(graph, indegrees)

function buildGraph() {
    //Build the map for all unique characters
    for (let word of words) {
        for (let char of word) {
            if (!graph.has(char)) {
                graph.set(char, new Set())
            }
        }
    }
    
    //For each word, find the different characters in the same indicies
    for (let i = 1; i < words.length; i++) {
        let first = words[i - 1]
        let second = words[i]
        
        //Take the shorter of the two words to compare
        let length = Math.min(first.length, second.length)
        for (let j = 0; j < length; j++) {
            
            //If the characters don't match, map it out in the graph
            if (first[j] != second[j]) {
                let out = first[j]
                let inner = second[j]
                
                //Map out the directed edge, and increase the indegree for the character
                if (!graph.get(out).has(inner)) {
                    graph.get(out).add(inner)
                    indegrees[inner.charCodeAt(0) - 97]++
                }
                
                //Once two different characters are met, go to the next word
                break
            }
        }
    }
}

function bfs(graph, indegrees) {
    let string = ''
    let size = graph.size
    let queue = []
    
    //Nothing can point to '{'
    if (indegrees[26] != 0) {
        return ''
    }
    
    queue.push('{')
    
    //Find the starting node of the topological sort and push it into the queue for bfs
    for (let char of graph.keys()) {
        if (char != '{' && indegrees[char.charCodeAt(0) - 97] == 0) {
            string += char
            queue.push(char)
        }
    }
    
    while (queue.length > 0) {
        let curr = queue.shift()
        
        //If it doesn't have any neighbors, skip
        if (graph.get(curr).size == 0) {
            continue
        }
        
        //Visit every neighbor
        //Once visited, we decrement the indegree of the char and push it into the queue
        for (let neighbor of graph.get(curr)) {
            indegrees[neighbor.charCodeAt(0) - 97]--
            if (indegrees[neighbor.charCodeAt(0) - 97] == 0) {
                queue.push(neighbor)
                string += neighbor
            }
        }
    }
    
    //Make sure the string is the size of the number of unique letters in the strings
    //Remove the brace for 'size - 1'
    return string.length == size - 1 ? string : ''
}